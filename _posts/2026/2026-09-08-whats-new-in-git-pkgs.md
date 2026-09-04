---
layout: post
title: "What's new in git-pkgs"
date: 2026-09-08 10:00 +0100
description: "Small Go modules for people who build package-manager tooling."
tags:
  - git-pkgs
  - tools
  - go
---

Back in February I [wrote up the fourteen Go modules](/2026/02/19/go-modules-for-package-management-tooling) behind [git-pkgs](https://github.com/git-pkgs/git-pkgs), a git subcommand for exploring dependency history. The org now has around forty-five repositories: nine standalone tools, a couple of dozen library modules, and the GitHub Actions and agent skills that wire them into CI and coding assistants. Several of the tools have had their own posts here already ([brief](/2026/04/21/brief), [proxy](/2026/05/11/proxy), [forge](/2026/03/13/forge), [actions](/2026/03/11/git-pkgs-actions)), so for those I'll cover what's changed since.

## Tools

### [git-pkgs](https://github.com/git-pkgs/git-pkgs)

The main CLI has gone from v0.14 to v0.20 and added eight new subcommands:

- `git pkgs changelog <pkg>` fetches the upstream changelog and shows entries between two versions
- `git pkgs freshness` reports how many days behind the latest release each dependency is
- `git pkgs deprecated` checks installed versions against registry deprecation flags
- `git pkgs funding` lists sponsorship links for your dependencies, with `--missing` to invert
- `git pkgs maintainers` reports maintainer counts and names, with `--single` to find one-person projects
- `git pkgs health` scores each dependency's project against [ecosyste.ms](https://ecosyste.ms) metadata
- `git pkgs provenance` reports registry attestations and trusted-publishing status for npm, PyPI, and RubyGems
- `git pkgs replace` redirects a dependency to a local checkout or git ref for downstream testing

Eight ecosystems were added: Guix, pre-commit, Lean, opam, Chef, Helm, Solaris IPS, and Vagrant. The GitHub Actions ecosystem gained lockfile support via `.github/workflows/actions.lock`, and existing parsers now handle `conda-lock.yml`, `Directory.Packages.props`, `setup.cfg`, `compose.yml`, `go.graph`, and several Maven graph exports.

`git pkgs licenses` added `--drift` to flag packages whose license changed between the installed and latest versions, and `--license-text` to download package archives and scan the actual license files inside them, independent of any package manager. `git pkgs diff` gained `--stat`, `--summary`, and `--by=ecosystem` for comparing across a lockfile migration such as `package-lock.json` to `pnpm-lock.yaml`.

Release checksums are now signed with cosign v4 bundles, and the formula moved into homebrew-core, so installation is just `brew install git-pkgs`.

### [brief](https://github.com/git-pkgs/brief)

I [wrote about brief in April](/2026/04/21/brief) when it was a knowledge base of project conventions with a CLI in front of it. It's since gained `brief inspect`, which produces a full artifact report for a package, and `brief outline`, which reduces a source tree to signatures and imports for feeding to an LLM. The knowledge base now covers over 570 tools, with new detectors for native-extension toolchains (Rust extensions for Node, Python, Ruby, and BEAM), scientific and research tooling, agent instruction files, and issue templates. It now recurses into workspaces and optionally into submodules. [Scrutineer](/2026/06/25/scrutineer) runs it as the first step of every scan to profile the target repository.

### [proxy](https://github.com/git-pkgs/proxy)

The [caching registry proxy from May](/2026/05/11/proxy) now supports 25 registry protocols, up from 16, adding Alpine APK, Helm, Homebrew (JSON API and bottles), the Swift package registry, and a generic HTTP proxy for GitHub release assets so tools like mise and aqua can point at it. It now has a web UI, a GCS storage backend, ECR upstream auth, a Helm chart, and an artifact scanning hook that runs Trivy, ClamAV, or a custom scanner against every download and can block or just log. Cooldowns are enforced on artifact downloads as well as metadata.

### [forge](https://github.com/git-pkgs/forge)

The [multi-forge library and CLI from March](/2026/03/13/forge) has added Bitbucket Cloud, Gerrit, and [Tangled](https://tangled.org) adapters alongside the original GitHub, GitLab, and Gitea/Forgejo. The CLI gained `forge pr checkout`, `forge pr view` for the current branch, `forge branch show-base`, and `--push` on `forge pr create`. It now derives the host from the git remote, supports plain-HTTP self-hosted instances, and handles GitLab nested group paths and agit-flow.

### [pin](https://github.com/git-pkgs/pin)

Vendors browser assets into your repository without going through npm: you list the files you want from published packages in `pin.yaml`, `pin sync` fetches them, verifies each against the registry tarball hash, and commits them alongside a lockfile that is also a valid CycloneDX SBOM. Sources are npm by default, `github:` via jsDelivr with the tag resolved to a commit SHA, or a raw URL with trust-on-first-use. A 48-hour minimum release age is on by default, install scripts are never executed, and `--frozen` fails CI if the lock is stale.

### [capcheck](https://github.com/git-pkgs/capcheck)

Fails CI when your Go code or one of its dependencies gains access to a new privileged operation, such as spawning processes, opening sockets, or calling into cgo. It wraps [google/capslock](https://github.com/google/capslock), diffs against a committed `capcheck.lock.json` baseline, and ships as both a binary and a GitHub Action. `capcheck init ./...` records the baseline, `capcheck ./...` checks it, and `capcheck update ./...` accepts a change.

### [licenses](https://github.com/git-pkgs/licenses)

A license scanner built on [ScanCode's rule corpus](https://github.com/aboutcode-org/scancode-toolkit), compiled into a single 22 MB Go binary. ScanCode is the reference implementation for license detection but it's a 507 MB Python install (351 MB of which is a pre-built Lucene-style index) that forks several worker processes each holding over a gigabyte of RSS, which makes it awkward to embed in other tools or run on every push. `licenses` embeds the same rule set at build time and runs [ScanCode's own conformance suite](https://github.com/git-pkgs/licenses#conformance) with tracked differences. On a checkout of [rust-lang/cargo](https://github.com/rust-lang/cargo) (2,950 files, 8-core M1 Pro, default flags) it finishes in 0.91 s and 243 MB peak RSS against scancode -l 32.5.0's 94 s and 4.5 GB across nine processes, roughly 100× faster and 19× lighter.

`licenses .` scans a directory and reports SPDX expressions per file plus a rolled-up expression for the tree; `-json` includes declared licenses from any manifests it recognises alongside the detected ones. It's also the library behind `git pkgs licenses --license-text`, which downloads package archives and scans the files inside them directly.

### [downstream](https://github.com/git-pkgs/downstream)

Tests a library against the projects that depend on it. `downstream run --upstream-path .` clones dependents from the ecosyste.ms API or a hand-curated `downstream.toml`, runs their tests against the published version to establish a baseline, swaps in your local checkout via the manager's replace mechanism, reruns, and reports what the change breaks. Go, Cargo, and npm-family are wired up so far, with a `--github-output` flag that emits an Actions matrix for fanning the runs out across CI.

### [distill](https://github.com/git-pkgs/distill)

Works out what kind of project a repository is (web framework, ORM, CLI tool, test library, and so on through the [oss-taxonomy](https://github.com/ecosyste-ms/oss-taxonomy) vocabulary) by looking at the code rather than the README, since READMEs are marketing and easy to game. It uses an LLM to label a training corpus once, then ships a small classifier that runs offline inside brief with no model calls at scan time. `distill classify pkg:pypi/torch` runs the full LLM path directly if you want the slower, more accurate answer for a single package.

## Utilities

[actions](https://github.com/git-pkgs/actions) packages the CLI as reusable GitHub Actions (`setup@v1`, `diff@v1`, `vulns@v1`, `licenses@v1`) with annotations and job summaries. I [wrote it up in March](/2026/03/11/git-pkgs-actions). [skills](https://github.com/git-pkgs/skills) is a Claude Code plugin that instructs an agent to run brief and git-pkgs before touching a repository, so it starts with the toolchain and dependency picture already in context, and adds skills for driving forge, pin, and capcheck.

## New modules

### Provenance

Recording where a package came from and verifying its integrity turned out to need five separate pieces, mostly because the existing Go options bundle parsing and verification together and pull in a lot of transitive dependencies to do it.

[attestation](https://github.com/git-pkgs/attestation) parses SLSA Provenance v1 identity fields (builder ID, source repository, source revision) out of a sigstore bundle's DSSE envelope using only the standard library. It only parses: `git pkgs provenance` and the registries client want to record what a registry claims about a package while keeping TUF, Fulcio, and Rekor out of downstream dependency trees.

[sigstore](https://github.com/git-pkgs/sigstore) is the verifying half, a thin wrapper around [sigstore-go](https://github.com/sigstore/sigstore-go) that checks a bundle against the TUF trust root and returns the certificate identity, Rekor log inclusion time, and in-toto subjects. It's a separate module so the heavy dependency tree is opt-in.

[integrity](https://github.com/git-pkgs/integrity) parses Subresource Integrity strings in the various encodings registries emit them in (standard base64, URL-safe, padded and unpadded) and wraps an `io.Reader` so a download is hashed and checked against an expected digest as it streams, picking the strongest algorithm both sides have.

[artifacts](https://github.com/git-pkgs/artifacts) is the value type that ties these together: a PURL, an OCI-form `sha256:...` digest, and a byte count, with validation only. `registries` produces one on download, `archives` opens it, and the SBOM writers consume it.

[cooldown](https://github.com/git-pkgs/cooldown) is the version-age filter lifted out of proxy so update bots and other clients can share the same policy code. Given a publish timestamp and a config it reports whether a version is old enough to install yet, resolving package-specific overrides ahead of ecosystem defaults ahead of a global floor. Both pin's 48-hour default and proxy's version hiding call it.

### Formats

[sbom](https://github.com/git-pkgs/sbom) reads CycloneDX JSON and SPDX JSON (including documents wrapped in `{"sbom":...}` or in-toto `{"predicate":...}` envelopes) into one document model and writes CycloneDX JSON, CycloneDX XML, and SPDX JSON back out. It's a zero-dependency alternative to [protobom](https://github.com/protobom/protobom) for tools that only need the package list, and `git pkgs sbom` now uses it in place of hand-rolled structs.

[sarif](https://github.com/git-pkgs/sarif) does the equivalent for SARIF 2.1.0 static-analysis logs, with types generated from the OASIS schema and a validator, backing `git pkgs vulns scan -f sarif`.

[cwe](https://github.com/git-pkgs/cwe) embeds the MITRE CWE catalogue at build time for offline lookup of weakness names and [View-1400](https://cwe.mitre.org/data/definitions/1400.html) software-assurance categories, refreshed by a monthly workflow. [Scrutineer](https://github.com/alpha-omega-security/scrutineer) uses it to classify and group findings.

### Licensing

[licenses](https://github.com/git-pkgs/licenses) is also importable as a library, which is how it's mostly used across the org. `git pkgs licenses --license-text` calls `matcher.Match` on every text file inside a downloaded package archive, and proxy is [about to do the same](https://github.com/git-pkgs/proxy/issues/312) so cached artifacts get a persisted license report exposed in the API and web UI, with a [policy hook](https://github.com/git-pkgs/proxy/issues/313) that can block a fetch on a disallowed expression. Because the corpus is embedded and the matcher is a plain Go value, adding license detection to another tool is one `go get` and a function call.

[reuse](https://github.com/git-pkgs/reuse) handles the other way projects declare licensing: it parses [REUSE spec](https://reuse.software) v3.3 projects, reading SPDX identifiers and copyright lines from file-header comments, `.license` sidecar files, `REUSE.toml` annotations, and legacy `.reuse/dep5` globs, and returns the effective license per path. Between the two, brief can report a project's licensing whether it's declared in structured metadata or only present as text.

### Content

[magic](https://github.com/git-pkgs/magic) is content-type detection that works on a bounded prefix as well as a whole file, which matters when you're reading blobs out of a bare git repository or a tarball entry and would rather avoid buffering all of a 40 MB PNG to identify it. It reports a format, MIME type, text encoding, and whether it needs more bytes to classify, covering archives, executables (ELF, Mach-O, PE, WebAssembly), images, PDF, and structured text, in pure Go using only the standard library. brief, clone, and archives all use it for extensionless files.

[markup](https://github.com/git-pkgs/markup) renders README-style markup to HTML by file extension: Markdown and Org handled natively, AsciiDoc, reStructuredText, and Pod by shelling out to their reference tools if installed, and a registry for plugging in Textile, MediaWiki, Creole, or RDoc renderers. It exists so tools that show a package's README share one format-dispatch table.

### Source

[outline](https://github.com/git-pkgs/outline) reduces a source tree to something an LLM can hold in context: function and method bodies dropped, signatures, types, doc comments, and imports kept, unsupported files passed through unchanged. It has body-stripping tree-sitter queries for 35 languages and import extraction for 20 of them, running in pure Go at around 6 MB/s per core, and it's what `brief outline` calls. distill uses its identifier extraction as classifier features.

[provides](https://github.com/git-pkgs/provides) is an early attempt at closing the gap between what a package is called on a registry and what you write in an `import` statement: `PyYAML` provides `yaml`, `beautifulsoup4` provides `bs4`, a Maven artifact provides several Java package prefixes. So far it has curated mappings for a handful of well-known Python cases and archive resolvers that open a wheel, jar, npm tarball, crate, or Go module and read the answer out of the file layout. Vulnerability tooling needs this to work out whether an advisory against a package name actually reaches the code that imports it.

### Repository

[clone](https://github.com/git-pkgs/clone) is what every tool in the org that needs a local checkout now goes through. It handles shallow clone and fetch with retries, reset to a ref, tag checkout that returns a restore function, submodule init, and a `Cache` type that keeps checkouts under one root keyed by URL. Reads go through `os.Root` so a hostile repository stays confined to its directory, refs and paths are validated before they reach a `git` argument list, and a bounded `InspectBlob` classifies file content via `magic` directly from the object store. brief, dependents, and Scrutineer use it directly, downstream through dependents.

[dependents](https://github.com/git-pkgs/dependents) finds repositories that depend on a package via the ecosyste.ms API, deduplicates by repository while keeping the package-level edges, ranks them, and can detect which ones build native extensions (Maturin, napi-rs, Neon, rb-sys, Rustler, setuptools-rust) so downstream can pick a representative test set.

### Maven

Maven's dependency metadata is spread across a chain of parent POMs, imported BOMs, profiles, and `${property}` references, and most Go tooling either shells out to `mvn` or parses only the top-level file.

[pom](https://github.com/git-pkgs/pom) does effective-POM resolution in pure Go, walking parents and BOM imports through a one-method `Fetcher` interface, applying `dependencyManagement` and property interpolation, and tagging each dependency with how confidently its version was resolved. I built it because [packages.ecosyste.ms](https://packages.ecosyste.ms) was shelling out to `mvn` from Sidekiq workers to extract Maven dependencies, and spinning up a JVM per job was too slow and too heavy on memory to keep up with the queue; the workers now call the `pom` binary instead. Scrutineer uses it for the same job.

[nexus](https://github.com/git-pkgs/nexus) reads the Maven repository index format (the binary Lucene-derived chunks Nexus and Central publish) in pure Go, streaming artifact add and remove events in publication order with resumable checkpoints. I built it to replace the Maven indexer in [packages.ecosyste.ms](https://packages.ecosyste.ms), which currently has to shell out to Java; that swap is pending.

### Storage

[gcs](https://github.com/git-pkgs/gcs) is a Google Cloud Storage client that calls the JSON API directly with only `compute/metadata` and `oauth2` as dependencies, covering `Open`, `Write`, `Delete`, `Exists`, `ListPrefix`, and V2 signed URLs. proxy's GCS storage backend is built on it because pulling in the full Cloud SDK roughly doubled the binary size.

## Updates

Since February the original fourteen modules have changed as follows:

- [manifests](https://github.com/git-pkgs/manifests) now covers 47 ecosystems and added `DiscoverManifests` and `DiscoverVendors` for repository-wide manifest and vendor-directory discovery, plus a `Declaration` API exposing raw source references (git, path, URL) before resolution
- [registries](https://github.com/git-pkgs/registries) added Helm repositories, a `fetch` sub-package for streaming artifact downloads with retry and circuit-breaking, `FetchObserved` returning the final URL and content digests, and a `safehttp` transport that rejects private-network upstreams
- [vers](https://github.com/git-pkgs/vers) added Bazel, Composer, Pub, PEP 440, and apk-tools version schemes, plus `HighestSatisfying` and a conformance suite harvested from univers
- [archives](https://github.com/git-pkgs/archives) added zstd, `.conda`, and extensionless-archive detection, `ExtractAll` confined with `os.Root`, per-archive byte and entry limits, and a `diff` sub-package for comparing two archive versions; it now powers [archives.ecosyste.ms](https://archives.ecosyste.ms)
- [enrichment](https://github.com/git-pkgs/enrichment) added an [endoflife.date](https://endoflife.date) client, downloads, dependent, funding, and maintainer fields, and made `HybridClient.BulkLookup` run its backends concurrently
- [managers](https://github.com/git-pkgs/managers) added `init` for 30 managers, `replace` (which backs `git pkgs replace` and downstream), and an renv definition for R
- [spdx](https://github.com/git-pkgs/spdx) added identifier rewriting and a syntax-only parse mode for expressions with unknown identifiers
- [changelog](https://github.com/git-pkgs/changelog) added `FetchAndParse` for remote changelogs and version-range filtering
- [gitignore](https://github.com/git-pkgs/gitignore) added `WalkFrom` for walking a subdirectory while still applying ancestor `.gitignore` rules
- [resolve](https://github.com/git-pkgs/resolve) added end-to-end `ResolveDeps` and manifest writers for pub, mix, and lein
- [purl](https://github.com/git-pkgs/purl) added OSV ecosystem mappings and Swift registry identity handling

The design constraints are the same as in February: each module is small, has a narrow job, avoids cgo so it cross-compiles cleanly, and covers every ecosystem the underlying format allows. Several of them line up with an [ecosyste.ms](https://ecosyste.ms) service (registries with packages, forge with repos, enrichment with the aggregate API, dependents with the dependents endpoint) and can use it as a fast path, but each also works standalone against a registry or a git remote directly. Almost everything is MIT licensed and hosted at [github.com/git-pkgs](https://github.com/git-pkgs).
