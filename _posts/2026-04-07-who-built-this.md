---
layout: post
title: "Who Built This?"
date: 2026-04-07 10:00 +0000
description: "Tracing a dependency back to its source commit."
tags:
  - package-managers
  - security
  - supply-chain
---

Michael Stapelberg [wrote last week](https://michael.stapelberg.ch/posts/2026-04-05-stamp-it-all-programs-must-report-their-version/) about Go's automatic VCS stamping: since Go 1.18, every binary built from a git checkout embeds the commit hash, timestamp, and dirty flag, queryable with `go version -m` or `runtime/debug.ReadBuildInfo()` at runtime. His argument is that every program should do this, so you can always answer "what version is running in production?" without guessing. Go is unusual in doing this by default, and the rest of the [package management landscape](/2026/01/03/the-package-management-landscape.html) varies wildly in how it handles this, if it handles it at all.

## Compiled languages

Rust's Cargo has [an open issue](https://github.com/rust-lang/cargo/issues/5629) proposing that `cargo package` record the git commit hash in published crates, but nothing has been accepted beyond a `.cargo_vcs_info.json` file in the packaged crate, so the conventional approach is a `build.rs` script using crates like [vergen](https://github.com/rustyhorde/vergen) or [shadow-rs](https://github.com/baoyachi/shadow-rs) to emit `cargo:rustc-env` directives that become compile-time environment variables readable with `env!()`. You get the SHA, branch, timestamp, and dirty flag, but you have to opt in, wire it up, and expose it through a `--version` flag or similar, and there's no way to inspect an arbitrary Rust binary externally.

[SourceLink](https://github.com/dotnet/sourcelink), now built into the .NET SDK, makes .NET the closest to Go's approach. It sets `AssemblyInformationalVersion` to something like `1.0.0+60002d50a...`, embedding the full commit SHA alongside the repository URL for debugger source fetching. [MinVer](https://github.com/adamralph/minver) derives the version entirely from git tags with no configuration file, and [GitVersion](https://github.com/GitTools/GitVersion) computes semver from branch topology. It's opt-in, but the tooling is mature enough that a .NET developer who wants stamping can get it with a single package reference and no build script.

Java's ecosystem relies on [git-commit-id-maven-plugin](https://github.com/git-commit-id/git-commit-id-maven-plugin), which generates a `git.properties` file and can inject metadata into `META-INF/MANIFEST.MF`. Spring Boot's actuator `/info` endpoint reads `git.properties` automatically, which means a lot of Spring Boot applications in production actually do have VCS info available, even if the developers who configured it don't think of it as "stamping." You can inspect a JAR's manifest with `unzip -p foo.jar META-INF/MANIFEST.MF`, and `Package.getImplementationVersion()` reads it at runtime, though without the plugin you get whatever the maintainer put in the POM version field and nothing else. Gradle has equivalents, and sbt needs two plugins ([sbt-buildinfo](https://github.com/sbt/sbt-buildinfo) plus [sbt-git](https://github.com/sbt/sbt-git)) to get the same result.

Swift Package Manager has no stamping mechanism at all, and a third-party [PackageBuildInfo](https://github.com/DimaRU/PackageBuildInfo) plugin that shells out to git during the build is about all that exists. SwiftPM has a registry protocol (SE-0292, SE-0391) and private registries exist, but there's no public centralized registry and most packages still resolve directly from git repositories, so the VCS metadata is right there at build time. It clones the repo, checks out the tagged commit, and then throws away everything except the source files. Of all the compiled language toolchains, SwiftPM would have the easiest time stamping and yet doesn't.

Bazel's `--workspace_status_command` flag runs a user-provided script that prints key-value pairs. Keys prefixed `STABLE_` invalidate the build cache when they change; others are "volatile" and stale values may be used without triggering a rebuild. The mechanism is powerful and built-in, but the documentation is notoriously confusing and the stable-vs-volatile distinction trips people up regularly.

## Interpreted languages

For interpreted languages, "stamping" means something slightly different, since there's no compiled binary to embed data in: can you determine what version or commit an installed package came from at runtime?

Composer's `InstalledVersions::getReference('vendor/pkg')`, available since version 2.0, returns the git commit SHA of every installed PHP package, backed by `vendor/composer/installed.json`. This works for both source and dist installs because Packagist records the commit SHA that each tag points to in its API metadata, and Composer preserves it through the lock file into runtime. No other interpreted language package manager preserves this much VCS metadata with this little configuration.

Python's `importlib.metadata.version('pkg')` gives you the version string but no VCS revision unless you use [setuptools-scm](https://github.com/pypa/setuptools-scm) or similar to bake the commit hash in at build time. PEP 610 specifies a `direct_url.json` for packages installed directly from VCS, which records the commit hash, but anything installed from PyPI lost its git SHA when the sdist or wheel was built. npm, pnpm, and Yarn make `package.json` version available at runtime but nothing more; npm provenance attestations link published packages to specific commits via Sigstore, though that's registry metadata rather than something embedded in the package itself. RubyGems exposes version at runtime through `Gem::Specification` and the gemspec `metadata` hash allows arbitrary keys, but there's no standard field for git SHA and no convention for using one.

## System package managers

dpkg stores package version (e.g. `1.2.3-1`) queryable with `dpkg -s`, and a `Vcs-Git` field exists in source package metadata, but that field never propagates to installed binary packages. RPM actually has a dedicated `VCS` tag (tag 5034) that can store the upstream repository URL and potentially a commit SHA, but most Fedora RPMs don't bother setting it.

Arch's pacman has a clever approach for VCS packages: packages suffixed `-git` run a `pkgver()` function in the PKGBUILD that encodes the commits-since-last-tag and short hash into the version string itself, like `1.0.3.r12.ga1b2c3d`, so the version you see in `pacman -Qi` actually contains the commit info. Regular packages built from release tarballs just carry the upstream version number, though.

Homebrew records the formula URL (typically a tarball) and its SHA256, plus a Homebrew-specific `revision` field for rebuilds, but no upstream git commit survives installation. Flatpak and Snap both have version metadata in their app manifests but no VCS revision field in either format.

Nix is where Stapelberg's post originates, and it's a good illustration of the problem: store paths encode a content hash, not a VCS revision, and fetchers like `fetchFromGitHub` download a tarball with no `.git` directory. Even `builtins.fetchGit` strips `.git` for reproducibility. The `.rev` attribute exists during Nix evaluation but isn't written to the store, so Stapelberg's [go-vcs-stamping.nix](https://github.com/stapelberg/nix) overlay has to bridge that gap for Go specifically, and the underlying problem affects every language built through Nix.

## Container images

OCI images have their own annotation spec for this: the [`org.opencontainers.image.revision`](https://github.com/opencontainers/image-spec/blob/main/annotations.md) label carries the VCS commit hash, and `org.opencontainers.image.source` points to the repository URL. `docker buildx` can set these automatically from git context, and GitHub Actions' `docker/metadata-action` populates them from the workflow environment, so a CI-built image can carry its commit SHA and repo URL without any manual wiring.

Plenty of Dockerfiles don't set these labels in practice, and even when they're present they describe the image build, not necessarily the application inside it. An image built from a Go binary that was itself built without VCS stamping will have the commit that changed the Dockerfile, which may or may not be the commit that changed the application code, so image-level and application-level stamping end up being two separate problems.

## Source archives

Git's own [`git archive`](https://git-scm.com/docs/git-archive) command supports [`export-subst`](https://git-scm.com/docs/gitattributes#_creating_an_archive) in `.gitattributes`, expanding placeholders like `$Format:%H$` into the full commit hash, which is the intended mechanism for embedding commit info in archives without `.git`. GitHub, GitLab, Gitea, and Forgejo all use `git archive` internally for their downloadable tarballs and zipballs, so `export-subst` works on all of them. If you add `version.txt export-subst` to your `.gitattributes` and put `$Format:%H$` in that file, the tarball will contain the full commit hash.

The catch is reproducibility. Abbreviated hash placeholders like `$Format:%h$` produce different-length output depending on the number of objects in the repository, and GitHub's servers don't always agree on object counts. The same tarball URL can return different contents at different times, which breaks checksum verification. [NixOS/nixpkgs#84312](https://github.com/NixOS/nixpkgs/issues/84312) documents this problem in detail. Full hashes (`%H`) are stable, but ref-dependent placeholders like `%d` change as branches move. The mechanism works, but anyone who checksums tarballs, which is most package managers, has to treat `export-subst` repos as a source of non-determinism.

The same thing happens with package archives, where the version from the manifest file survives but the commit that produced it doesn't unless the build backend explicitly stamped it in. (An [npm bug in 6.9.1](https://github.com/npm/npm/issues/20213) once accidentally included `.git` directories in published tarballs, and it was treated as a serious defect.) A developer tags a commit, CI builds an artifact from that tag, the build process strips `.git`, and the resulting package carries only the version string.

## Trusted publishing and embedded stamping

Trusted publishing through Sigstore addresses this from the registry side. When a package is published from CI with OIDC-based trusted publishing, the registry records which commit, repository, and workflow produced it, with a cryptographic signature in a transparency ledger. npm and PyPI both support this today. The provenance metadata lives at the registry rather than in the artifact, but you can look up an artifact's attestation by its hash, so if you have the artifact you can trace it back to the commit that produced it without the artifact itself needing to carry that information.

[Software Heritage](https://www.softwareheritage.org/) could eventually enable something similar from the source side. They archive public source code repositories and assign intrinsic identifiers ([SWHIDs](https://docs.softwareheritage.org/devel/swh-model/persistent-identifiers.html)) based on content hashes, so in principle you could go the other direction too: given a source tree or file, look up which commits and repositories it appeared in. That archive is already large and growing, though the tooling to make these lookups practical for everyday debugging isn't there yet.

All this research got me thinking about how it could integrate with [git-pkgs](https://github.com/git-pkgs/git-pkgs), which already tracks the dependency side of this: who added a package, when it changed, what the version history looks like in your repo. Its `browse` command opens the installed source of a package in your editor, but that's the installed files with no git history.

If packages reliably carried their source commit, there's a more interesting version of that command: clone the upstream repository and check out the exact commit your installed version was built from. You'd get `git log`, `git blame`, the full context of what changed between the version you have and the version you're upgrading to, all from your local terminal. The stamping metadata is the missing link between "I depend on this package at this version" and "here is the code that produced it, with its history."