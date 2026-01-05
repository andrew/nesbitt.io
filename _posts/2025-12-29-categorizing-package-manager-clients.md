---
layout: post
title: "Categorizing Package Manager Clients"
date: 2025-12-29 10:00 +0000
description: "Sorting package manager clients by resolution algorithms, lockfile strategies, build hooks, and manifest formats."
tags:
  - package-managers
---

This is the companion to [Categorizing Package Registries](/2025/12/29/categorizing-package-registries.html), focusing on the client side: how package managers resolve dependencies, track versions, run build code, and declare dependencies. The data is also available as [CSV](https://github.com/andrew/nesbitt.io/blob/master/data/package-manager-clients.csv). There are gaps; contributions welcome.

Each package manager combines these choices differently. Cargo uses backtracking resolution, generates lockfiles, allows build hooks via build.rs, and uses TOML manifests. Go uses minimal version selection, achieves reproducibility without lockfiles, forbids hooks entirely, and embeds dependencies in go.mod. npm uses deduplication with nesting, generates lockfiles, allows postinstall hooks, and uses JSON. The particular combination shapes the developer experience more than any single choice.

## Resolution algorithms

How does the package manager decide which versions to install? The [ecosyste.ms resolver documentation](https://github.com/ecosyste-ms/package-manager-resolvers) covers the major algorithm families.

[**SAT solving**](https://research.swtch.com/version-sat) treats resolution as a satisfiability problem. Can find solutions when they exist and prove when they don't, but computationally expensive. [PubGrub](https://nex3.medium.com/pubgrub-2fb6470504f) is a variant that produces better error messages by tracking why versions were excluded.

- Composer
- DNF
- Conda/Mamba[^libsolv]
- Zypper[^libsolv]
- opam[^opam-cudf]
- pub[^pubgrub]
- Poetry[^pubgrub]
- uv[^pubgrub]
- pdm[^pubgrub]
- Swift Package Manager[^pubgrub]
- Hex[^pubgrub]
- Bundler[^pubgrub]

[^libsolv]: Via [libsolv](https://github.com/openSUSE/libsolv).
[^opam-cudf]: Uses external CUDF solvers.
[^pubgrub]: Uses [PubGrub](https://nex3.medium.com/pubgrub-2fb6470504f).

**Backtracking** tries versions in order and backs up when conflicts arise.

- pip
- Cargo
- Cabal[^cabal-solver]

[^cabal-solver]: Modular solver with backjumping.

**ASP solving** uses answer set programming for complex constraint solving.

- Spack[^spack-clingo]

[^spack-clingo]: Via [Clingo](https://potassco.org/clingo/).

[**Minimal version selection**](https://research.swtch.com/vgo-mvs) picks the oldest version that satisfies constraints.

- Go modules
- vcpkg[^vcpkg-mvs]

**Deduplication with nesting** installs multiple versions when packages need incompatible versions.

- npm
- Yarn
- pnpm
- Cargo[^cargo-semver-compat]

**Version mediation** lets build systems pick winners using different strategies.

- Maven[^maven-nearest]
- Gradle[^gradle-highest]
- NuGet[^nuget-lowest]
- sbt
- Clojars[^clojars-maven]
- Ivy

[^cargo-semver-compat]: Limited to one version per semver-compatible range (one per major version, or one per minor if pre-1.0).
[^maven-nearest]: Nearest definition wins.
[^gradle-highest]: Highest version wins.
[^nuget-lowest]: Lowest applicable version.

[**Molinillo**](https://github.com/CocoaPods/Molinillo) is a backtracking solver with heuristics tuned for Ruby's ecosystem.

- RubyGems
- CocoaPods

**System package resolution** handles system-level constraints like file conflicts and provides/requires relationships.

- apt[^apt-scoring]
- pacman
- apk
- Portage
- FreeBSD ports
- pkgsrc

[^apt-scoring]: Scoring with immediate resolution.

**Single version per formula** with topological sort for dependency ordering.

- Homebrew

**Explicit dependencies** with no version resolution needed.

- Nix
- Guix

## Lockfiles and reproducibility

Can you reproduce the same install later?

**Generates lockfiles** to record exact versions resolved. Committed to version control.

- Bundler
- npm
- Yarn
- pnpm
- Cargo
- Poetry
- uv
- pdm
- Composer
- Mix
- pub
- Swift Package Manager
- Elm
- Cabal[^cabal-freeze]
- Stack
- Spack
- Homebrew
- NuGet
- Julia
- Conan
- dub
- CocoaPods
- opam

**Deterministic resolution** through algorithms that produce stable results without needing a lockfile to pin versions.

- Go modules[^go-sum]

**No native lockfile** means resolution happens fresh each time, or build systems handle pinning.

- pip[^pip-lockfiles]
- Maven
- Gradle
- apt
- CRAN
- Hackage[^hackage-freeze]
- CPAN
- Conda[^conda-lock]

[^conda-lock]: conda-lock is a separate tool that adds lockfile support.

**Content-addressed** packages are identified by input hash. Reproducibility without traditional lockfiles.

- Nix
- Guix

## Build hooks

Can packages run code during installation?

**Hooks allowed** let packages execute scripts during install, build, or publish.

- npm[^npm-postinstall]
- Yarn
- pip[^pip-setuppy]
- Composer[^composer-scripts]
- RubyGems[^rubygems-extensions]
- Maven[^maven-plugins]
- Gradle
- Cargo[^cargo-buildrs]
- CocoaPods
- Homebrew
- Nix[^nix-sandboxed]
- apt/dpkg[^system-postinst]
- RPM/DNF

[^nix-sandboxed]: Build hooks run in a sandboxed environment.

**Hooks restricted** allow some build-time execution with limitations.

- pnpm[^pnpm-disabled]
- Bun[^bun-disabled]
- Deno[^deno-permissions]

**No hooks** by design.

- Go
- Elm
- Swift Package Manager
- pip[^pip-wheels]

[^pip-wheels]: Wheel format explicitly forbids install-time code execution; sdist still allows setup.py hooks.

## Manifest format

How are dependencies declared?

**TOML**

- Cargo
- Poetry
- uv
- Julia
- pdm

**JSON**

- npm
- Composer
- Deno
- Elm
- dub
- vcpkg

**YAML**

- Conda
- pub
- Homebrew
- GitHub Actions
- Helm
- pnpm

**Host language**

- Bundler (Ruby)
- CocoaPods (Ruby)
- Gradle (Groovy/Kotlin)
- sbt (Scala)
- Mix (Elixir)
- Swift Package Manager (Swift)
- Leiningen (Clojure)
- Nix

**XML**

- Maven
- NuGet
- Ivy

**Custom format**

- Go
- Cabal
- CPAN
- CRAN
- pip

[^vcpkg-mvs]: Microsoft explicitly documents vcpkg's [minimal version selection algorithm](https://learn.microsoft.com/en-us/vcpkg/users/versioning.concepts).
[^clojars-maven]: Clojars uses Maven's resolution algorithm since it's a Maven-compatible repository.
[^cabal-freeze]: The `cabal freeze` command generates a freeze file pinning versions.
[^go-sum]: go.sum exists but contains checksums for verification, not version pins. MVS means the same go.mod always resolves to the same versions.
[^pip-lockfiles]: pip-tools, Poetry, and uv provide lockfile functionality for pip.
[^hackage-freeze]: Cabal can generate freeze files, but Hackage itself doesn't require them.
[^npm-postinstall]: postinstall scripts run after package installation.
[^pip-setuppy]: Historically via setup.py; modern PEP 517 builds use wheel build backends, which still execute arbitrary code at build time.
[^composer-scripts]: Composer scripts can run at various lifecycle points.
[^rubygems-extensions]: Native extensions compile C code during installation.
[^maven-plugins]: Maven plugins execute during build phases.
[^cargo-buildrs]: build.rs scripts run at compile time, typically for native code compilation.
[^pnpm-disabled]: Scripts are disabled by default; must be explicitly enabled.
[^bun-disabled]: Lifecycle scripts are disabled by default.
[^deno-permissions]: Requires explicit permission flags for network, file system, and subprocess access.
[^system-postinst]: System packages do have maintainer scripts that run as root, but those are part of the distribution's build pipeline, not arbitrary user-space package hooks.
