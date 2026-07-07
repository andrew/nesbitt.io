---
layout: post
title: "Unboxed: Zig"
date: 2026-07-09 10:00 +0000
description: "Zig's package manager: mechanics, categorisation, governance, threat model."
tags:
  - package-managers
  - unboxed
  - zig
---

This is the first in a series of posts working through individual package managers against a fixed set of headings, so they can be compared directly. The headings come from earlier posts: the [client](/2025/12/29/categorizing-package-manager-clients.html) and [registry](/2025/12/29/categorizing-package-registries.html) categorisations, the [governance](/2025/12/22/package-registries-are-governance-as-a-service.html) post, and the [threat model](/2026/05/05/package-manager-threat-models.html).

Zig's package manager has been built into the `zig` binary since [0.11 in August 2023](https://ziglang.org/download/0.11.0/release-notes.html#Package-Management), with no separate tool and no central registry. A `build.zig.zon` file lists dependencies as URLs with content hashes, and `zig build` fetches and compiles everything together. The language and the tool are both run by the [Zig Software Foundation](https://ziglang.org/zsf/), a 501(c)(3).

## How it works

A Zig project has a `build.zig` program at its root, describing targets, compile flags, and which dependencies to link where, alongside a `build.zig.zon` data file listing metadata and dependencies. Despite the similar names, `build.zig.zon` is inert data that can be parsed without running anything, while `build.zig` is arbitrary Zig code that gets compiled and executed. Which of the two an operation touches is where most of the security properties come from.

```zig
.{
    .name = .example,
    .version = "0.3.1",
    .fingerprint = 0x6a8091f57c7f07ff,
    .minimum_zig_version = "0.16.0",
    .dependencies = .{
        .known_folders = .{
            .url = "https://github.com/ziglibs/known-folders/archive/refs/tags/1.1.0.tar.gz",
            .hash = "known_folders-1.1.0-Fy-PJtnVAAC1Qq48Hf6_4er0Ku98mFvx99UUwo9-mrJd",
        },
        .tracy = .{
            .url = "git+https://github.com/wolfpld/tracy#v0.11.1",
            .hash = "N-V-__8AAKw3UgOhKDsrn8hRlOoGmVBl5x91fMi0WQwVaokf",
            .lazy = true,
        },
    },
    .paths = .{
        "build.zig",
        "build.zig.zon",
        "src",
        "LICENSE",
    },
}
```

The `.zon` extension is [Zig Object Notation](https://github.com/ziglang/zig/blob/master/lib/std/zon.zig), a subset of Zig's syntax restricted to literals and anonymous structs with no expressions, imports, or function calls. The [`fingerprint`](https://github.com/ziglang/zig/blob/master/doc/build.zig.zon.md) is a 64-bit integer combining a random 32-bit id with a checksum of the `name`, generated once when the package is created. It stays the same through renames and repo moves, so it's the package's identity independent of whichever URL currently serves it.

Each dependency is either a `.url` and `.hash` pair or a local `.path`. The hash is computed over the extracted files after applying the `.paths` inclusion list from the dependency's own manifest, so a package author decides which files count towards its identity. The [documentation](https://github.com/ziglang/zig/blob/master/doc/build.zig.zon.md) is explicit that the hash is the identity and the URL is just one place to get it: "packages do not come from a `url`; they come from a `hash`. `url` is just one of many possible mirrors."

The [hash string](https://github.com/ziglang/zig/pull/22994) is `$name-$version-` followed by URL-safe base64 packing the fingerprint id, decompressed size, and 200 bits of truncated SHA-256, so a `zig-pkg/` directory listing stays readable without a lookup table. A dependency with no `build.zig.zon` of its own, like `tracy` above, is a "naked" package and gets the placeholders `N-V-` and a sentinel id instead. `.lazy = true` defers fetching until the dependency is referenced from `build.zig`.

Dependencies are fetched by downloading the URL, verifying it against the pinned hash, unpacking into a project-local `zig-pkg/` directory named by the hash, and recursing into that dependency's own `.zon`. A canonical recompressed tarball is kept in the [global cache](https://ziglang.org/download/0.16.0/release-notes.html#Fetch-Packages-Into-Project-Local-Directory) so a second project using the same hash doesn't redownload. `zig fetch <url>` on its own downloads one URL and prints the computed hash for pasting into a manifest, without recursing. Supported schemes are `http(s)://` for tarballs and git bundles, `git+http(s)://` for the git smart protocol with a ref in the fragment, `file://`, and bare paths.

`zig build` compiles `build.zig` together with every dependency's `build.zig` into a single executable and runs it, so a transitive dependency's build code is linked into the same program as yours rather than invoked as a separate process per package. Calling into a dependency from your build script [runs that dependency's build script](https://github.com/ziglang/zig/blob/master/lib/std/Build.zig), which can do the same for its own dependencies.

Every `.zon` in the tree pins its direct dependencies by content hash, so there's no version resolution step and the full tree is determined once the root's hashes are fixed. Two dependencies that pin different hashes of the same upstream both get fetched and both exist, with deduplication by hash only. Version selection using the `fingerprint` field is [planned](https://github.com/ziglang/zig/issues/14288) and [expected to look like Go's minimal version selection](https://kristoff.it/blog/zig-self-hosted-now-what/), but as of 0.16 the only cross-tree check is that the [same fingerprint and version can't appear with two different hashes](https://ziglang.org/download/0.16.0/release-notes.html#Fetch-Packages-Into-Project-Local-Directory).

0.14 introduced the [current hash format and the `fingerprint` field](https://ziglang.org/download/0.14.0/release-notes.html). 0.16 moved extracted packages from the global cache into a [project-local `zig-pkg/` directory](https://ziglang.org/devlog/2026/#2026-02-06) and added [`--fork`](https://ziglang.org/download/0.16.0/release-notes.html#Ability-to-Override-Packages-Locally) for overriding a package across the whole tree. On 30 June the fetching logic, HTTP client, TLS, and git protocol were [moved out of the compiler binary](https://ziglang.org/devlog/2026/?2026-06-30#2026-06-30) into the build-system process, shipped as source.

## Categorisation

### Client {#categorisation-client}

**Resolution algorithm.** None: each manifest pins exact content hashes with no version ranges. Closest to the [explicit-dependencies bucket](/2025/12/29/categorizing-package-manager-clients.html#resolution-algorithms) alongside Nix and Guix, though without a [content-addressed store](/2026/07/07/content-addressing-in-package-managers.html) underneath, and with minimal version selection [planned](https://github.com/ziglang/zig/issues/14288).

**Lockfile.** Manifest is the lock: `build.zig.zon` pins content hashes for every direct dependency and each dependency does the same for its own, with no separate file. Doesn't fit any of the [existing buckets](/2025/12/29/categorizing-package-manager-clients.html#lockfiles-and-reproducibility) cleanly: reproducible without a lockfile like Go, but by pinning hashes in the manifest rather than by deterministic resolution.

**Build hooks.** Allowed: `build.zig` is a Zig program compiled and run at build time with every dependency's `build.zig` compiled into the same process, comparable to Cargo's `build.rs`, Gradle, or Swift's `Package.swift`.

**Tuesday test.** [Fails](/2026/04/15/the-tuesday-test.html), i.e. the install can observe inputs the manifest doesn't declare: `build.zig` is Turing-complete and runs for every dependency, though `.zon` on its own is pure data and would pass alone.

**Manifest format.** Custom for metadata (`.zon`), host language for build logic (`build.zig`), where most tools in the [categorisation](/2025/12/29/categorizing-package-manager-clients.html#manifest-format) put both in one file. Being a bespoke format rather than JSON or TOML, `.zon` needs its own parser in [every cross-ecosystem tool](/2026/01/29/zig-and-the-mxn-supply-chain-problem.html) that reads manifests, [ecosyste.ms](https://ecosyste.ms) and [git-pkgs](https://github.com/git-pkgs) included.

### Registry {#categorisation-registry}

**Architecture.** [Source host as registry](/2025/12/29/categorizing-package-registries.html#registry-architecture), alongside Go modules, Deno, and Carthage, with no central index and packages served as tarballs or git refs at whatever URL the author chose.

**Review model.** None: whoever controls the URL controls what's served at it.

**Namespacing.** URL-based for location, but identity is the `name` plus a self-generated 64-bit `fingerprint`, which doesn't match any bucket in the [namespacing categorisation](/2025/12/29/categorizing-package-registries.html#namespacing).

**Distribution model.** Source only, compiled on the client.

**Ecosystem scope.** Language-specific, though Zig's C interop and bundled `zig cc` mean C and C++ libraries are commonly packaged as Zig dependencies too.

**Version retention.** Delegated to the source host, so a GitHub release stays available until the repo owner deletes it or the account goes away, and there's no yank mechanism.

**Size.** Without a central index there's no canonical count, though [Zigistry](https://zigistry.dev/) scrapes GitHub for repos with a `build.zig.zon` and indexes what it finds.

**Mirroring.** Trivial in principle since the client accepts any URL and verifies by hash, though each `.zon` names one URL per dependency, so if that URL goes dead the depender has to edit their manifest.

## Governance

The [Zig Software Foundation](https://ziglang.org/zsf/) governs the language and the tool, funded by donations, but package hosting and name authority are outside its remit since there's no registry for it to operate.

Name ownership rests on the `fingerprint`, and the [manifest documentation](https://github.com/ziglang/zig/blob/master/doc/build.zig.zon.md) says a fork of a maintained project should regenerate it, calling a fork that keeps the upstream's value "hostile, attempting to take control over the original project's identity". Nothing enforces that and there's no arbiter to appeal to. Availability, account recovery, DMCA takedowns and abuse handling all fall to whichever source host the URL points at, which in practice is overwhelmingly GitHub. Removal of a malicious version is something only the repo owner or the source host can do, and neither has any way to signal downstream `.zon` files that already pin its hash. Changes to the package manager itself go through the [Zig issue tracker](https://github.com/ziglang/zig/issues).

Loris Cro of the ZSF wrote in 2022 that ["we don't plan to create an official package index"](https://kristoff.it/blog/zig-self-hosted-now-what/), so the absence of a [governance provider](/2025/12/22/package-registries-are-governance-as-a-service.html) is a design choice rather than a gap.

## Comparisons

The closest existing designs are Go modules and pre-JSR Deno (when it imported dependencies directly by URL): URL-addressed source, no publish step, no central registry, integrity by content hash. Go's `go.sum` and checksum database are the nearest equivalent to `.zon` hashes, though Go verifies against a public log rather than only what the depending project committed. Swift Package Manager is close on the client side, with a host-language build manifest and git-URL dependencies, but resolves version ranges against tags rather than pinning a single hash. Bazel's [`http_archive`](https://bazel.build/rules/lib/repo/http#http_archive) takes a URL list plus a `sha256` with the hash as the identity and the URLs as interchangeable mirrors, then evaluates a hermetic Starlark `BUILD` file rather than a Turing-complete build program.

The `fingerprint` is what none of those have: a package identity that survives a URL change, whereas in Go the identity is the module path and moving a repo creates a new module. The [`--fork` flag](https://ziglang.org/download/0.16.0/release-notes.html#Ability-to-Override-Packages-Locally) uses it to substitute a local checkout for every occurrence of a package across the whole dependency tree, regardless of which URLs the intermediate `.zon` files pinned. It is a CLI argument only, not a manifest field, and the release notes call that ["appropriately ephemeral"](https://ziglang.org/download/0.16.0/release-notes.html#Ability-to-Override-Packages-Locally).

There is no `build.zig.zon` field equivalent to Cargo's [`[patch]`](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html), Go's [`replace`](https://go.dev/ref/mod#go-mod-file-replace), npm's `overrides` or pub's `dependency_overrides`, and [no update subcommand](https://github.com/ziglang/zig/issues/14288) for direct dependencies either.

With exact-hash pins at every level and no ranges to re-resolve, a fix in a low-level dependency reaches a project only when every intermediate `.zon` on the path has been re-released with the new hash. Until then the root's options are forking the intermediates, vendoring a patched `zig-pkg/` into source control, or passing `--fork` on every build. The flag isn't recorded anywhere, so the same commit builds a different tree depending on whether it was passed, in a design where the committed manifest is otherwise a complete lock. Once [minimal version selection](https://github.com/ziglang/zig/issues/14288) lands, listing the fixed version in the root `.zon` would be enough, as it is in `go.mod`.

The `.paths` filter is close to the `files` array in `package.json` or `include` in `Cargo.toml`, except that the hash is computed after the filter is applied rather than over a tarball the author uploaded, so the inclusion list is part of the identity rather than a packaging convenience.

## Threat model

### Client

**Code execution at install time.** `zig build --fetch` runs nothing from the package: it downloads each URL, verifies the hash, extracts and parses each dependency's `.zon` as data, and recurses without compiling `build.zig`. `zig build` compiles your `build.zig` and every dependency's `build.zig` into [one executable](https://github.com/ziglang/zig/blob/master/lib/std/Build.zig) and runs it, so a dependency's build script executes with your privileges the first time you build. There's no flag to disable that, since the build script is how a dependency exposes its artifacts. A `.lazy = true` dependency isn't fetched, and its `build.zig` isn't compiled in, until [`b.lazyDependency`](https://github.com/ziglang/zig/blob/master/lib/std/Build.zig) is called for it.

**Code execution before install time.** Since `.zon` is data, parsing a manifest and running `zig fetch` on an untrusted URL are safe modulo the extractor, but `zig build` on an untrusted checkout compiles and runs `build.zig`, and so do `zig build -h` and `--list-steps`, since the step list comes from executing the configure phase.

**Lockfile guarantees by design.** The manifest pins 200 bits of SHA-256 for every direct dependency, and each of those pins its own, so the whole tree is fixed by content and every install is a locked install. The guarantee is per-project and starts at first fetch: the hash protects a project from the URL's contents changing later, but there's no independent record of what the URL served at the moment the hash was first written down. Go's [checksum database](https://go.dev/ref/mod#checksum-database) is the counterexample, a public log that records what each module path served so a substituted first fetch would disagree with everyone else's. Without an equivalent, two Zig projects adding the same URL a week apart can pin different hashes with nothing to flag the discrepancy. Plain `http://` URLs are accepted without a warning, and an already-unpacked `zig-pkg/<hash>/` directory is not re-hashed before reuse.

**Package name identity.** `name` is a bare Zig identifier, at most 32 bytes, case-sensitive, ASCII only, so the usual normalisation gaps don't apply. Deduplication and `--fork` match on `name` plus `fingerprint`, so two packages sharing a `name` with different fingerprints coexist in the same tree.

**Resolution across multiple sources.** Each dependency entry names exactly one URL, so there's no source ordering to get wrong and the dependency-confusion pattern doesn't apply. The related failure mode is a stale URL: the `.zon` records where the author fetched from, and if that host disappears there's no automatic fallback even though any mirror serving the same bytes would satisfy the hash.

### Registry

**Namespace allocation.** Fingerprints are self-asserted rather than allocated, so a fork can write the upstream's value into its own manifest verbatim and be matched as the same package. Typosquatting on the URL is the source host's problem.

**Maintainer lifecycle.** Maintainership is control of the source repo, so adding a maintainer means adding a GitHub collaborator, and nothing signals that to anyone with the package in their tree. Account recovery is whatever the source host provides, and a lapsed custom domain in a `.url` is a straightforward takeover, mitigated only by the hash pin in existing dependers' manifests.

**Immutability of published versions.** The hash in a depender's `.zon` guarantees they get the bytes they locked but not their continued availability, and the tag or release the URL points at can be replaced with something else that new dependers will then pin. Git tags can be [force-pushed](https://arxiv.org/abs/2606.31354), GitHub release assets can be replaced, and there's no transparency log recording what a URL served when.

**Provenance from source to artifact.** The artifact is the source, so there's no build step to attest. The hash proves you got what the depender pinned but not who wrote it or whether the URL's repo matches the tarball, and trusted publishing would need somewhere to publish to.

**The minimum viable publish credential.** This is whatever the source host issues: for GitHub, a token or SSH key with push access to the repo, with scoping, expiry and 2FA on GitHub's side and no separate publish surface for a Zig-specific credential to protect.

**Blast radius and detection.** Anomaly detection on publish, malicious-version markers that clients check, and central audit logging are all registry functions that nothing here stands in for. A compromised release spreads only as fast as dependers update their `.hash` fields, which is slower than a registry ecosystem with floating ranges but also means there's no single place to pull it from once it's out, and detection falls to whoever's reading diffs on the source host.

### The tool's own supply chain

The Zig compiler's [own `build.zig.zon`](https://github.com/ziglang/zig/blob/master/build.zig.zon) declares zero external dependencies, with the only entries being `.path` references into the source tree. The toolchain components it needs are [vendored into the release tarballs](https://ziglang.org/download/0.16.0/release-notes.html#Toolchain) rather than fetched. Since the [30 June change](https://ziglang.org/devlog/2026/?2026-06-30#2026-06-30) the HTTP client, TLS stack, git protocol and decompressors ship as Zig source rather than compiled into the `zig` binary, which the devlog notes runs in `ReleaseSafe` so safety checks stay on for the networking code.

## Summary

Closest relatives are Go modules and pre-JSR Deno on the registry side, Swift Package Manager on the client side, and Bazel's `http_archive` on the fetch model. Treating the content hash as the identity, with the URL just one place to fetch it, is the right way round, and `.zon` being pure data means the dependency graph can be read without executing anything. The compiler declaring zero external dependencies of its own is a supply chain position I'd like to see more of, and moving the networking stack out into `ReleaseSafe` source that can be patched without rebuilding the compiler is a good recent change.

`.zon` being a bespoke format rather than JSON or TOML means I've had to write a parser for it in both [ecosyste.ms](https://ecosyste.ms) and [git-pkgs](https://github.com/git-pkgs), and so will everyone else building cross-ecosystem tooling. The tool ends up on the wrong side of the [Tuesday test](/2026/04/15/the-tuesday-test.html) because `build.zig` is a full Zig program, when the pure-data `.zon` had it most of the way to passing. The governance functions a registry would provide fall to GitHub instead, which is now the arbiter of availability, account recovery and abuse handling for Zig packages without either party having chosen that.

Nothing in the manifest can override a transitive dependency, so if a low-level package ships a security fix and an intermediate hasn't re-released, the options are forking the intermediate or passing `--fork` on every build, and the flag leaves nothing in the repo to record that it was passed. Cargo, Go, npm, pub, Mix and Bazel all have a manifest field for this, and exact-hash pinning makes its absence matter more here than it would with version ranges.
