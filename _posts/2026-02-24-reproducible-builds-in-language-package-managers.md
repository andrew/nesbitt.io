---
layout: post
title: "Reproducible Builds in Language Package Managers"
date: 2026-02-24 10:00 +0000
description: "Verifying that a published package was actually built from the source it claims."
tags:
  - package-managers
  - security
---

You download a package from a registry and the registry says it was built from a particular git commit, but the tarball or wheel or crate you received is an opaque artifact that someone built on their machine and uploaded. Reproducible builds let you check by rebuilding from source yourself and comparing, and if you get the same bytes, the artifact is what it claims to be. Making this work requires controlling both the build environment and the provenance of artifacts, and most language package managers historically controlled neither.

The [Reproducible Builds](https://reproducible-builds.org/) project has been working on this since 2013, when Lunar (Jérémy Bobbio) organized a session at DebConf13 and began patching Debian's build tooling. The Snowden disclosures had made software trust an urgent concern, Bitcoin's Gitian builder had shown the approach was viable for a single project, and the Tor Project had begun producing deterministic builds of Tor Browser. Lunar wanted to apply the same thinking to an entire operating system.

The first mass rebuild of Debian packages in September 2013 found that 24% were reproducible, and by January 2014, after fixing the lowest-hanging fruit in dpkg and common build helpers, that jumped to 67%. Today Debian's [testing infrastructure](https://tests.reproducible-builds.org/) shows around 96% of packages in trixie building reproducibly under controlled conditions, while [reproduce.debian.net](https://reproduce.debian.net/) runs a stricter test by rebuilding the actual binaries that ftp.debian.org distributes rather than clean-room test builds.

The project grew into a cross-distribution effort as Arch Linux, NixOS, GNU Guix, FreeBSD, and others joined over the following years. Summits have been held most years since 2015, most recently in Vienna in October 2025. Chris Lamb, who served as Debian Project Leader from 2017 to 2019, co-authored [an IEEE Software paper](https://arxiv.org/abs/2104.06020) on the project that won Best Paper for 2022. Lunar passed away in November 2024. The project's [weekly reports](https://reproducible-builds.org/reports/), published continuously since 2015, give a sense of the scale of work involved: each one lists patches sent to individual upstream packages fixing timestamps, file ordering, path embedding, locale sensitivity, one package at a time, hundreds of packages a year. Getting from 24% to 96% was not a single architectural fix but a decade of this kind of janitorial patching across the entire Debian archive.

### How verification works

You build the same source twice in different environments and compare the output, and if the bytes match, nobody tampered with the artifact between source and distribution. In practice this requires recording everything about the build environment, which Debian does with `.buildinfo` files capturing exact versions of all build dependencies, architecture, and build flags. A verifier retrieves the source, reconstructs the environment using tools like `debrebuild`, builds the package, and compares SHA256 hashes against the official binary.

When hashes don't match, [diffoscope](https://diffoscope.org/) is how you find out why. Originally written by Lunar as `debbindiff`, it recursively unpacks archives, decompiles binaries, and shows you exactly where two builds diverge across hundreds of file formats: ZIP, tar, ELF, PE, Mach-O, PDF, SQLite, Java class files, Android APKs. Feed it two JARs that should be identical and it'll dig through the archive, into individual class files, into the bytecode, and show you that one has a timestamp from Tuesday and the other from Wednesday.

The project also maintains [`strip-nondeterminism`](https://salsa.debian.org/reproducible-builds/strip-nondeterminism) for removing non-deterministic metadata from archives after the fact, and [`reprotest`](https://salsa.debian.org/reproducible-builds/reprotest), which builds packages under deliberately varied conditions (different timezones, user IDs, locales, hostnames, file ordering) to flush out hidden assumptions.

### What makes builds non-reproducible

Benedetti et al. tested 4,000 packages from each of six ecosystems using `reprotest` for their ICSE 2025 paper ["An Empirical Study on Reproducible Packaging in Open-Source Ecosystems"](http://www.cs.cmu.edu/~ckaestne/pdf/icse25_rb.pdf), varying time, timezone, locale, file ordering, umask, and kernel version between builds. Cargo and npm scored 100% reproducible out of the box because both package managers hard-code fixed values in archive metadata, eliminating nondeterminism at the tooling level. PyPI managed 12.2%, limited to packages using the `flit` or `hatch` build backends which fix archive metadata the same way. Maven came in at 2.1%, and RubyGems at 0%.

The dominant cause across all three failing ecosystems was timestamps embedded in the package archive, responsible for 97.1% of RubyGems failures, 92.4% of Maven failures, and 87.7% of PyPI failures. The standard fix is `SOURCE_DATE_EPOCH`, an environment variable defined by the Reproducible Builds project in 2015, containing a Unix timestamp that build tools should use instead of the current time. GCC, Clang, CMake, Sphinx, man-db, dpkg, and many other tools now honour it, but it's opt-in, so any build tool that doesn't check the variable just uses the current time.

Most of this turned out to be fixable with infrastructure changes rather than per-package work. Simply configuring `SOURCE_DATE_EPOCH` brought Maven from 2.1% to 92.6% and RubyGems from 0% to 97.1%, and small patches to the package manager tools addressing umask handling, file ordering, and locale issues pushed PyPI to 98% and RubyGems to 99.9%. The packages that remained unreproducible were ones running arbitrary code during the build, like `setup.py` scripts calling `os.path.expanduser` or gemspecs using `Time.now` in version strings, which no amount of tooling can fix because the nondeterminism is in the package author's code.

File ordering causes similar problems because `readdir()` returns entries in filesystem-dependent order (hash-based on ext4, lexicographic on APFS, insertion order on tmpfs) and tar and zip tools faithfully preserve whatever order they're given. The project built [disorderfs](https://salsa.debian.org/reproducible-builds/disorderfs), a FUSE filesystem overlay that deliberately shuffles directory entries to expose ordering bugs during testing. Absolute paths get embedded in compiler debug info and source location macros, so a binary built in `/home/alice/project` differs from one built in `/home/bob/project`. Archive metadata carries UIDs, GIDs, and permissions. Locale differences change output encoding. Parallel builds produce output in nondeterministic order, and any single unfixed source is enough to make the whole build non-reproducible.

### Go

Since Go 1.21 in August 2023, the toolchain produces bit-for-bit identical output regardless of the host OS, architecture, or build time, after Russ Cox's team [eliminated ten distinct sources of nondeterminism](https://go.dev/blog/rebuild) including map iteration order, embedded source paths, file metadata in archives, and ARM floating-point mode defaults.

Go runs nightly verification at [go.dev/rebuild](https://go.dev/rebuild) using [`gorebuild`](https://pkg.go.dev/golang.org/x/build/cmd/gorebuild), and Andrew Ayer has [independently verified](https://www.agwa.name/blog/post/verifying_go_reproducible_builds) over 2,672 Go toolchain builds with every one matching. The Go Checksum Database at sum.golang.org adds a transparency log so that even if a module author modifies a published version, the ecosystem detects it. Anything that calls into C via cgo reintroduces the host C toolchain as a build input and all the nondeterminism that comes with it, but pure Go code is genuinely reproducible across platforms and over time.

### Maven

Maven's [official guide](https://maven.apache.org/guides/mini/guide-reproducible-builds.html) documents the steps: set `project.build.outputTimestamp` in `pom.xml`, upgrade all plugins to versions that respect it, verify with `mvn clean verify artifact:compare`. Maven 4.0.0-beta-5 enables reproducible mode by default, and [Reproducible Central](https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=74682318) maintains a list of independently verified releases.

The timestamp only works if every plugin in the chain respects it, though, and many third-party plugins don't. Different JDK versions produce different bytecode, ZIP entry ordering varies by implementation, and Maven builds are assembled from dozens of plugins that each introduce their own potential nondeterminism. Researchers built [Chains-Rebuild](https://arxiv.org/html/2509.08204v1) to canonicalize six root causes of Java build unreproducibility, which gives a sense of how many separate things can go wrong in a single build system.

### Cargo

Rust's [RFC 3127](https://rust-lang.github.io/rfcs/3127-trim-paths.html) introduced `trim-paths`, which remaps absolute filesystem paths out of compiled binaries and is now the default in release builds, replacing paths like `/home/alice/.cargo/registry/src/crates.io-abc123/serde-1.0.200/src/lib.rs` with `serde-1.0.200/src/lib.rs`. Embedded paths were the most common source of non-reproducibility in Rust binaries, and the [`cargo-repro`](https://docs.rs/cargo-repro) tool lets you rebuild and compare crates byte-for-byte to check for remaining issues.

Procedural macros and build scripts (`build.rs`) remain a gap since they can do anything at build time: read environment variables, call system tools, generate code based on the hostname. The `cc` crate, used to compile bundled C code, reintroduces the same C-toolchain nondeterminism that cgo does for Go.

### PyPI

The Benedetti et al. study found only 12.2% of PyPI packages reproducible out of the box, and the split came down to build backend: packages using `flit` or `hatch` were reproducible because those backends fix archive metadata the way Cargo and npm do, while packages using `setuptools` (still the majority) were not. With patches to address umask handling and archive metadata the number reached 98%, with the remaining 2% coming from packages running arbitrary code in `setup.py` or `pyproject.toml` build hooks.

PyPI has also moved further than most registries on attestations through [PEP 740](https://peps.python.org/pep-0740/), shipped in October 2024, which adds support for Sigstore-signed digital attestations uploaded alongside packages. These link each artifact to the OIDC identity that produced it, so combined with trusted publishing, PyPI can record that a package was built in a specific CI workflow from a specific commit with a cryptographic signature binding artifact to source.

### RubyGems

RubyGems 3.6.7 made the gem building process [more reproducible by default](https://blog.rubygems.org/2025/04/25/march-rubygems-updates.html), setting a default `SOURCE_DATE_EPOCH` value and sorting metadata in gemspecs so that building the same gem twice produces the same `.gem` file without special configuration. Individual gems can still have their own nondeterminism, native extensions like nokogiri compile against host system libraries with all the usual C-toolchain variation, and there's no independent rebuild verification infrastructure for RubyGems.

### npm

The npm registry accepts arbitrary tarballs with no connection to source, no build provenance, and no way to independently rebuild a package and compare it against what's published. `package-lock.json` and `npm ci` give you dependency pinning and integrity hashes that confirm the tarball hasn't changed since publication, but that says nothing about whether it matches any particular source commit.

### Homebrew

Homebrew distributes prebuilt binaries called bottles, built on GitHub Actions and hosted as GitHub release artifacts. The project has a [reproducible builds page](https://docs.brew.sh/Reproducible-Builds) documenting the mechanisms available to formula authors: `SOURCE_DATE_EPOCH` is set automatically during builds, build paths are replaced with placeholders like `@@HOMEBREW_PREFIX@@` during bottle creation, and helpers like `Utils::Gzip.compress` produce deterministic gzip output. There's no systematic testing of what percentage of bottles actually rebuild identically, though.

Since Homebrew 4.3.0 in May 2024, every bottle comes with a Sigstore-backed attestation linking it to the specific GitHub Actions workflow that built it, meeting SLSA Build Level 2 requirements. Users can verify attestations by setting `HOMEBREW_VERIFY_ATTESTATIONS=1`, though verification isn't yet the default because it currently depends on the `gh` CLI and GitHub authentication while the project waits on [sigstore-ruby](https://github.com/sigstore/sigstore-ruby) to mature.

### Trusted publishing

Traditionally a maintainer authenticates with an API token, builds on their laptop, and uploads. Trusted publishing replaces that with OIDC tokens from CI so that the registry knows the package was built by a specific GitHub Actions workflow in a specific repository, not just uploaded by someone who had the right credentials.

PyPI [launched trusted publishing](https://blog.pypi.org/posts/2023-04-20-introducing-trusted-publishers/) in April 2023, built by Trail of Bits and funded by Google's Open Source Security Team. RubyGems.org [followed in December 2023](https://blog.rubygems.org/2023/12/14/trusted-publishing.html), npm shipped provenance attestations via Sigstore in 2023 and [full trusted publishing in July 2025](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/), crates.io launched in July 2025, and NuGet followed in September 2025. Over 25% of PyPI uploads now use it.

Once provenance tells you that a package was built from commit `abc123` of `github.com/foo/bar` in a specific workflow, anyone can check out that commit and attempt to rebuild, and if the build is reproducible the rebuilt artifact should match the published one. Most of these trusted publishing flows run on GitHub Actions, though, which itself has [serious problems as a dependency system](/2025/12/06/github-actions-package-manager/): no lockfile, no integrity verification, and mutable tags that can change between runs, meaning the build infrastructure that's supposed to provide provenance guarantees doesn't have great provenance properties of its own.

### Google's OSS Rebuild

[OSS Rebuild](https://github.com/google/oss-rebuild), announced by Google's Open Source Security Team in July 2025, takes a pragmatic approach to the fact that most builds aren't bit-for-bit reproducible yet by rebuilding packages from source and performing semantic comparison, normalizing known instabilities like timestamps and file ordering before checking whether the meaningful content matches.

At launch it covered thousands of packages across PyPI, npm, and crates.io, using automation and heuristics to infer build definitions from published metadata, rebuilding in containers, and publishing [SLSA](https://slsa.dev/) Level 3 provenance attestations signed via Sigstore. The `stabilize` CLI tool handles the normalization by stripping timestamps, reordering archive entries, and removing owner metadata from ZIPs, tars, and wheels. Maven Central, Go modules, and container base images are on the roadmap.

Matthew Suozzo's [FOSDEM 2026 talk](https://fosdem.org/2026/schedule/event/EP8AMW-oss-rebuild-observability/) pushed beyond pure reproducibility into build observability, adding a network proxy for detecting hidden remote dependencies and eBPF-based build tracing to answer not just whether a build can be reproduced but what the build is actually doing at runtime, which is useful independently of whether the output happens to be deterministic.

### Where things stand

Language package managers are years behind Linux distributions on reproducible builds because Debian controls its build infrastructure and can mandate changes to that environment, while language registries accept uploads from anywhere and historically had no way to know how an artifact was produced. Trusted publishing is shifting that by moving builds from laptops into CI where the registry has visibility into the process, and combined with build provenance and SLSA attestations, this creates conditions where independent verification becomes possible even when the build tooling itself hasn't caught up. Go got there by making the compiler deterministic, which is the cleanest solution but requires controlling the entire toolchain from the start.
