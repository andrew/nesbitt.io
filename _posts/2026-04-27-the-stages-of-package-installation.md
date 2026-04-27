---
layout: post
title: "The stages of package installation"
date: 2026-04-27 10:00 +0000
description: "Denial, anger, bargaining, depression, acceptance, postinstall."
tags:
  - open-source
  - package-managers
  - security
---

Suppose, hypothetically, that someone had been spending their evenings reimplementing bits of several package managers from scratch, not to ship anything but as a test bed for swapping different resolvers, index formats, and registry APIs in and out to see what actually changes.

One of the first things such a person would want is a clean decomposition of the install command into stages with well-defined inputs and outputs, so that each stage can be replaced independently and so that it's obvious which parts need the network, which parts run untrusted code, and which parts are pure functions over data you already have.

### 1. Fetching metadata

The package manager talks to one or more registries to discover what exists: package names, the list of versions available for each, and the dependency constraints each version declares on other packages. This might be one big index file pulled down in a single request, as with a Packagist `packages.json`, RubyGems' [compact index](/2025/12/28/the-compact-index.html), or a crates.io index clone, or it might be per-package documents fetched on demand from something like the npm registry or PyPI's JSON API.

Either way, the only thing this stage needs is outbound network access to a known set of hosts, and the only thing it produces is structured data describing the universe of possible packages. The security-relevant decision here is which registries get asked and in what order, since [dependency confusion](/2025/12/10/slopsquatting-meets-dependency-confusion.html) attacks work by getting a public registry to answer for a name you thought was internal.

### 2. Resolving

A resolver takes the user's top-level requirements plus the constraints discovered in stage one and works out a single concrete set of `name@version` pairs that satisfies every constraint simultaneously. Depending on the ecosystem this might be a [full SAT or PubGrub solver, a simpler greedy walk, or Go's minimal version selection](/2026/02/06/dependency-resolution-methods.html), but in every case it's pure computation over data already in memory and the output is effectively a [lockfile](/2026/01/17/lockfile-format-design-and-tradeoffs.html), whether or not one gets written to disk. In the model, resolution needs no network and runs no third-party code.

### 3. Downloading

With a fixed set of versions chosen, the package manager fetches the actual artifacts: tarballs, zips, wheels, gems, crates, bottles. Each one should come from a URL that was determined by the metadata, and each should be verified against a checksum that was also in the metadata, so that the download stage can't be steered somewhere unexpected by anything outside the already-fetched index. In practice the local cache usually has most of these already and the stage collapses to a hash check against what's on disk. Like stage one this needs the network and nothing else, and on a warm cache not even that.

### 4. Unpacking

The downloaded archives are extracted and arranged on disk in whatever layout the language runtime expects to find them in: a flat `site-packages`, a nested `node_modules`, a content-addressed store under `~/.pnpm` or `/nix/store` with symlinks back into the project, a `vendor` tree checked into the repo. There's a fair amount of subtlety here around hoisting, deduplication, and peer dependencies, but the privilege footprint is small: write access to the target directory, and no need for either network or a shell.

That hasn't stopped it being a reliable source of CVEs, because archive formats are expressive enough that extracting one is closer to interpreting a small program than copying files. A tar entry can name a path with `../../` in it, or lay down a symlink pointing at `~/.ssh` and then write a file through it on the next entry. The contract says no code runs here, and strictly none does, but the archive is still directing where bytes land outside the target directory.

### 5. Building

Some packages ship as source that has to be compiled against the host toolchain before they're usable, most often native extensions written in C, C++, or Rust that bridge into the host language. This is the first stage where code from inside a package is expected to run, since the package has to tell the build system what to compile and how, whether through a `build.rs`, a `setup.py`, a `binding.gyp`, or an `extconf.rb`. Ideally the build needs a compiler and the already-unpacked source tree and nothing else.

### 6. Post-install

Packages get a last opportunity to run their own hooks for the work that can't be expressed as "put these files here and compile those": generating machine-specific config, registering themselves with some host facility, patching shebang lines, printing a funding message. This is the second place arbitrary package code is expected to run, and along with the build step it's where almost every "malicious package steals credentials on install" story actually happens, which is why `--ignore-scripts` and its equivalents exist. The model would still prefer these hooks ran without network access, since by this point everything the package needs should already be on disk.

---

Laid out this way the privilege boundaries are clean enough to enforce. Stages one and three need the network but never execute anything from a package; stages two and four need neither; only five and six run package-supplied code, and even those shouldn't need to dial out.

You could draw a line after stage four and put everything beyond it in a sandbox, or chop the pipeline at any join to get offline installs, [air-gapped mirrors](/2026/03/20/package-manager-mirroring.html), prefetch-then-build CI caching, and "resolve here, install there" workflows like [separating download from install in Docker builds](/2026/02/15/separating-download-from-install-in-docker-builds.html) more or less for free.

### The model versus the implementations

Almost no package manager in common use works this way, and the ones that come closest have usually been dragged there over a decade of incremental fixes rather than designed for it. The two privileges you'd most like to keep contained, network access and arbitrary code execution, leak into stages where the model says they have no business being.

Resolution is where it most often falls apart, because the resolver needs accurate dependency metadata for every version it considers, and that metadata is surprisingly often not available without doing real work. For most of pip's history the only reliable way to find out what an sdist depended on was to download it, unpack it, and run its `setup.py`, an arbitrary Python program that can import anything, inspect the host, and compute its dependency list at runtime.

Stages one through five collapsed into a single recursive tangle, and the resolver could end up executing dozens of untrusted `setup.py` files from versions it would ultimately reject. Python has spent years digging out of this with static metadata standards and wheels, but the long tail of sdist-only packages means a cold `pip install` can still drop into that path without warning.

Ruby has a milder form of the same thing: a `.gemspec` is Ruby code, and Bundler resolving against a git dependency means cloning the repo and evaluating that file just to learn what it requires, so a manifest that looks declarative is really a small program with the full language available to it. Homebrew formulae and Portage ebuilds never pretended otherwise: the manifest format and the host language were always the same thing and a static representation has been retrofitted later. I've written before about [the Tuesday test](/2026/04/15/the-tuesday-test.html) for this: if a manifest format is expressive enough that a package can declare different dependencies depending on what day of the week it is, you've lost any hope of resolving it without running it.

Even where metadata is properly static, stages one and two are almost always interleaved rather than sequential. npm's resolver, like most that talk to large registries, fetches per-package metadata on demand as constraint solving proceeds, because pulling the full version list for every transitively-reachable package up front would be enormously wasteful, so the network stays live for the whole resolution.

Go [treats version control as the registry outright](/2025/12/24/package-managers-keep-using-git-as-a-database.html): there's nothing to publish to, the import path is the location, and resolving a module version ultimately means reading `go.mod` out of a git tag, which puts a full git client with all its transport and credential machinery inside what should have been a metadata fetch. The module proxy that now sits in front by default is a cache and an audit log more than a registry in its own right, and `GOPROXY=direct` still sends the toolchain straight to the repositories.

The build and post-install end leaks in the opposite direction, pulling network access into stages that were supposed to be done with it. A Cargo `build.rs` is nominally a build step, and most just probe for system libraries or generate code, but nothing stops one opening a socket to fetch a prebuilt binary or vendored headers.

The npm ecosystem leans on this heavily: a great many packages with native components don't compile anything in `postinstall` but instead download a prebuilt artifact from a GitHub release matched to the host platform, so the "real" download for that package happens after the package manager thinks installation is finished, from a URL the lockfile never saw and with no checksum the resolver knew about.

`node-gyp` will fetch Node headers from nodejs.org on first run, and the assorted `prebuild-install` style helpers each have their own conventions for where binaries live and whether they're verified at all: a second, undocumented dependency graph hiding behind the first.

### Consequences for tooling

The questions tooling authors most want to answer about an install, which hosts it will touch on the network, what code it will run before anyone has had a chance to look at it, whether it can be [reproduced](/2026/02/24/reproducible-builds-in-language-package-managers.html) from a mirror without the public internet, don't have good answers for most ecosystems.

You can't point at a moment in the process and promise nothing after it dials out, because a `postinstall` three levels deep might pull a binary from an S3 bucket, and you can't promise nothing before it executes package code, because the resolver might already have evaluated a manifest. [SBOM generators](/2025/12/23/could-lockfiles-just-be-sboms.html), supply-chain scanners, and sandboxing wrappers all end up reconstructing from the outside the stage boundaries that the package manager declined to provide from the inside.

Most ecosystems have been slowly pushing the early stages towards being static: declarative manifests that don't need evaluating, compact-index style registry APIs that serve dependency metadata without serving the whole artifact, lockfiles that pin checksums for everything including the things post-install scripts would otherwise fetch on their own.

I should mention Nix and Guix, because someone on Mastodon will if I don't. Evaluating the expression language produces a set of derivation files, each a static record of inputs by content hash, build environment, and build commands, and only once those exist does anything run. The build itself executes in a sandbox with the network cut off. A package that needs to fetch something must express it as a fixed-output derivation with the expected hash declared up front, which pushes every download back into the stage where the model says it belongs. There is no post-install hook because the store is immutable and nothing runs after the sandbox exits.

The remaining leak is at the front: the expression language is a real programming language, and import-from-derivation lets evaluation trigger a build to compute what to evaluate next, so a sufficiently determined package can still cross the boundary between resolving and building. And for anything pulled from a language registry, the Nix build step usually just runs that language's own package manager inside the sandbox to do the repackaging. The stages are contained more than reimplemented; the guarantees come from the sandbox cutting the network and pinning the inputs, while the tool inside is the same one that blurs them together everywhere else.

Most package managers don't expose any of these stages as something another tool can call into. The integration points that do exist are accidental: a lockfile format that other tools learn to parse, a `node_modules` or `site-packages` layout they learn to walk, an environment variable that happens to redirect the cache, a registry protocol that proxy caches sit in the middle of. So everything built on top carries a partial reimplementation of the package manager it sits on, kept in sync by hand, and breaks whenever upstream changes something it never promised to keep stable.
