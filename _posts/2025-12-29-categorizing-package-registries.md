---
layout: post
title: "Categorizing Package Registries"
date: 2025-12-29 10:00 +0000
description: "Sorting package registries by architecture, review model, namespacing, governance, and other structural differences."
tags:
  - package-managers
---

Package registries differ in dozens of ways, but most of those differences cluster into a few structural categories. Looking at them through the lens of [design tradeoffs](/2025/12/05/package-manager-tradeoffs.html) helps explain why they ended up where they did. The [ecosyste.ms documentation repositories](/2025/11/30/documenting-package-manager-data.html) contain detailed data on over 70 registries; here I'm trying to draw out the shapes.

The categories below are roughly orthogonal dimensions. No registry is "just" one thing; each is a particular combination of choices. npmjs.com is database-backed, unreviewed, has flat-plus-scoped names, ships mostly source, and is run by a for-profit company. Debian's repositories are filesystem-based, curated by maintainers, use distro-managed names, ship binaries, and are run by a foundation. Those combinations matter more than any single axis.

A companion post covers [package manager clients](/2025/12/29/categorizing-package-manager-clients.html): resolution algorithms, lockfiles, build hooks, and manifest formats. The data is also available as [CSV](https://github.com/andrew/nesbitt.io/blob/master/data/package-registries.csv). There are gaps; contributions welcome.

**Contents:** [Architecture](#registry-architecture) · [Review model](#reviewed--unreviewed) · [Namespacing](#namespacing) · [Distribution model](#distribution-model) · [Governance](#registry-governance) · [Ecosystem scope](#ecosystem-scope) · [Version retention](#version-retention) · [Size](#registry-size) · [Mirroring](#mirroring--proxying)

## Registry architecture

How does the registry store and serve package metadata?

**Database-backed web services** are uploaded via API, with metadata in Postgres or similar. This model scales well and supports rich features like download counts and vulnerability reporting.

- npmjs.com
- pypi.org
- rubygems.org
- nuget.org
- crates.io[^cargo-index]
- packagist.org
- hex.pm
- pub.dev
- clojars.org
- forge.puppet.com
- anaconda.org
- luarocks.org
- community.chocolatey.org
- open-vsx.org
- galaxy.ansible.com
- jsr.io

**Git repositories as indexes** use version control as the storage layer on the critical path. If you removed git, you'd need to replace it with a database. The git model provides history, is trivially mirrorable, and works offline once cloned. But it doesn't scale indefinitely; Cargo had to add a [sparse index](/2025/12/28/the-compact-index.html) to avoid downloading the entire registry on first use.

- homebrew-core
- cocoapods.org
- vcpkg
- conan.io
- swiftpackageindex.com
- Julia General registry
- juliahub.com[^juliahub-git]
- winget-pkgs
- spack

**Filesystem-based repositories** serve generated index files statically from HTTP mirrors. The server does work only when the repository is updated, not when clients fetch. This is the pattern that [the compact index](/2025/12/28/the-compact-index.html) brought to RubyGems.

- apt/dpkg
- yum/dnf
- pacman
- apk
- zypper
- Portage
- cran.r-project.org
- bioconductor.org
- metacpan.org
- hackage.haskell.org
- pkgs.racket-lang.org[^racket-filesystem]
- FreeBSD ports
- pkgsrc
- Helm
- postmarketOS
- Adélie Linux

**Source host as registry** means no central registry. Packages are fetched directly from git hosts using URLs as identifiers.

- Go modules
- Deno
- Carthage

**Content-addressed stores** identify packages by hash of inputs. Binary caches provide pre-built artifacts.

- Nix
- Guix

## Reviewed / Unreviewed

Does someone look at packages before they're available?

**Unreviewed** means anyone can publish immediately. You create an account, run a publish command, and your package is live within seconds. This enables growth but creates attack surface.

- npmjs.com
- pypi.org
- crates.io
- rubygems.org
- packagist.org
- nuget.org
- hex.pm
- pub.dev
- clojars.org
- juliahub.com
- hackage.haskell.org
- metacpan.org
- forge.puppet.com
- anaconda.org
- luarocks.org
- open-vsx.org
- galaxy.ansible.com
- jsr.io

**Reviewed** registries have maintainers review packages before they appear. These registries grow more slowly but catch problems earlier. In practice, "review" ranges from packaging QA and policy checks to security vetting; very few projects do systematic source code review.

- Debian
- Fedora
- Ubuntu
- homebrew-core
- Alpine
- Arch[^arch-aur]
- nixpkgs
- F-Droid
- cran.r-project.org
- bioconductor.org
- conda-forge
- postmarketOS
- Adélie Linux
- spack
- FreeBSD ports
- pkgsrc
- winget-pkgs
- central.sonatype.com[^maven-verification]

**Moderated upload** accepts uploads but has moderation layers or automated semantic checks.

- package.elm-lang.org[^elm-semver]
- community.chocolatey.org[^chocolatey-moderation]

## Namespacing

How are packages named?

**Flat** namespaces give each package a single global name.

- rubygems.org
- pypi.org
- crates.io
- hex.pm
- hackage.haskell.org
- cran.r-project.org
- juliahub.com
- package.elm-lang.org
- luarocks.org
- community.chocolatey.org

**Scoped** namespaces add organizational prefixes like `@babel/core` or `symfony/console`.

- npmjs.com
- packagist.org
- forge.puppet.com
- open-vsx.org
- galaxy.ansible.com
- winget-pkgs
- artifacthub.io
- anaconda.org
- jsr.io

**Hierarchical** namespaces use structured naming like `org.apache.commons:commons-lang3` or `DateTime::Format::Strptime`.

- central.sonatype.com
- metacpan.org
- clojars.org

**URL-based** identifiers like `github.com/user/repo` use domain ownership as the claim. No registration step.

- proxy.golang.org
- deno.land
- Swift Package Manager
- Carthage

**Distro-managed** names are controlled by distribution maintainers, often differing from upstream project names.

- Debian
- Fedora
- Arch
- Alpine
- homebrew-core
- nixpkgs
- spack
- conda-forge
- FreeBSD ports
- pkgsrc
- postmarketOS

## Distribution model

What gets distributed?

**Source only** ships code that gets compiled or interpreted on the client. One artifact supports any platform.

- npmjs.com
- crates.io
- proxy.golang.org
- metacpan.org
- hex.pm
- hackage.haskell.org
- cran.r-project.org
- package.elm-lang.org
- pkgs.racket-lang.org
- clojars.org[^clojars-bytecode]
- luarocks.org
- galaxy.ansible.com
- artifacthub.io
- jsr.io

**Binary only** ships precompiled artifacts.

- central.sonatype.com
- nuget.org
- apt/dpkg
- yum/dnf
- pacman
- apk
- community.chocolatey.org
- winget-pkgs

**Mixed source and binary** provides source distributions plus prebuilt wheels/binaries. Native code gets platform-specific builds.

- pypi.org
- rubygems.org
- cocoapods.org
- anaconda.org
- homebrew-core[^homebrew-bottles]
- cache.nixos.org[^nix-substitutes]
- spack[^spack-binaries]
- FreeBSD ports
- pkgsrc

**Platform matrices** publish multiple artifacts per release: `cp39-manylinux_x86_64`, `cp310-macosx_arm64`, etc.

- pypi.org
- rubygems.org
- anaconda.org
- cache.nixos.org
- nuget.org[^nuget-rids]
- homebrew-core

## Registry governance

Who runs the registry?

**Non-profit foundations** operate registries as community infrastructure.

- pypi.org[^pypi-psf]
- crates.io[^crates-rust]
- rubygems.org[^rubygems-central]
- central.sonatype.com[^maven-lf]
- packagist.org[^packagist-funding]
- metacpan.org[^cpan-perl]
- hex.pm[^hex-funding]
- clojars.org[^clojars-funding]
- hackage.haskell.org[^hackage-org]
- cran.r-project.org[^cran-r]
- homebrew-core[^homebrew-osc]
- open-vsx.org[^openvsx-eclipse]
- artifacthub.io[^helm-cncf]

**For-profit companies** run registries as products or strategic infrastructure.

- npmjs.com[^npm-microsoft]
- nuget.org[^nuget-microsoft]
- pub.dev[^pubdev-google]
- anaconda.org[^conda-anaconda]
- juliahub.com[^juliahub-computing]
- forge.puppet.com[^puppet-perforce]
- galaxy.ansible.com[^ansible-redhat]
- community.chocolatey.org[^chocolatey-company]
- winget-pkgs[^winget-microsoft]
- proxy.golang.org[^go-google]
- deno.land[^deno-company]
- jsr.io[^deno-company]

**Community projects** run registries as volunteer efforts, often with fiscal sponsors.

- cocoapods.org
- conda-forge
- swiftpackageindex.com
- luarocks.org
- Carthage
- nixpkgs

**Distribution projects** maintain repositories as part of their distro.

- Debian
- Fedora[^fedora-redhat]
- Ubuntu[^ubuntu-canonical]
- Arch
- Alpine
- postmarketOS
- Adélie Linux
- spack
- FreeBSD
- pkgsrc

## Ecosystem scope

What kind of software does this package manager handle?

**Language-specific** registries serve a single programming language ecosystem.

- npmjs.com
- pypi.org
- rubygems.org
- crates.io
- hex.pm
- hackage.haskell.org
- metacpan.org
- clojars.org
- pub.dev
- cran.r-project.org
- juliahub.com
- package.elm-lang.org
- pkgs.racket-lang.org
- packagist.org
- proxy.golang.org
- central.sonatype.com
- luarocks.org
- jsr.io

**System-level** registries install operating system components and applications.

- apt/dpkg
- yum/dnf
- pacman
- apk
- homebrew-core
- nixpkgs
- Guix
- zypper
- Portage
- FreeBSD ports
- pkgsrc
- community.chocolatey.org
- winget-pkgs

**Domain-specific** registries serve particular use cases or industries.

- bioconductor.org
- conda-forge
- spack
- ROS
- forge.puppet.com
- registry.terraform.io
- galaxy.ansible.com
- artifacthub.io
- open-vsx.org

## Version retention

Does the registry keep old versions available? What happens when a published version needs to be removed?

**Keeps all versions** indefinitely. You can install any historical version.

- central.sonatype.com[^maven-permanent]
- proxy.golang.org[^go-cache-permanent]

**Yanking** marks a version as unavailable for new installs but keeps it accessible for existing lockfiles.

- crates.io
- rubygems.org
- hex.pm

**Time-limited deletion** allows removal within a window, then versions become permanent.

- npmjs.com[^npm-unpublish]
- pypi.org[^pypi-deletion]
- nuget.org
- packagist.org
- clojars.org
- hackage.haskell.org
- metacpan.org
- pub.dev

**Latest only** or limited retention. Old versions disappear when new ones are published.

- homebrew-core[^homebrew-latest]
- apt/dpkg[^apt-releases]
- Arch[^arch-rolling]
- Alpine[^alpine-releases]

## Registry size

How many packages? Grouped by order of magnitude.

**10⁶+ (millions)**

- npmjs.com
- proxy.golang.org
- pypi.org

**10⁵ (hundreds of thousands)**

- central.sonatype.com
- nuget.org
- packagist.org
- rubygems.org
- crates.io
- cocoapods.org
- anaconda.org
- nixpkgs
- Arch AUR
- Fedora
- Debian
- Ubuntu

**10⁴ (tens of thousands)**

- pub.dev
- clojars.org
- hex.pm
- hackage.haskell.org
- cran.r-project.org
- FreeBSD ports
- Alpine

**10³ (thousands)**

- homebrew-core
- luarocks.org
- package.elm-lang.org

## Mirroring / Proxying

How hard is it to run your own registry or mirror?

**Trivial** means filesystem-based repos or source-host registries that need no special infrastructure.

- apt/dpkg
- yum/dnf
- proxy.golang.org
- metacpan.org
- cran.r-project.org

**Supported** means official tooling or documented processes exist for running mirrors or private registries.

- npmjs.com[^npm-verdaccio]
- pypi.org[^pypi-devpi]
- central.sonatype.com[^maven-nexus]
- nuget.org
- rubygems.org
- crates.io
- packagist.org
- hex.pm[^hex-mirrors]
- luarocks.org[^luarocks-servers]
- clojars.org[^clojars-mirrors]

[^cargo-index]: Cargo originally required cloning the full crates.io-index git repo; the [sparse index](https://rust-lang.github.io/rfcs/2789-sparse-index.html) now allows fetching only needed entries.
[^arch-aur]: The AUR (Arch User Repository) is unreviewed; official repos are curated.
[^maven-verification]: Requires proving domain ownership via DNS or hosting a file at the domain.
[^elm-semver]: Elm [enforces semantic versioning](https://package.elm-lang.org/help/design-guidelines) by diffing package APIs and rejecting publishes that break compatibility without a major version bump.
[^clojars-bytecode]: Publishes JVM bytecode in JAR files, but these are built from source during the publish process.
[^homebrew-bottles]: Bottles are prebuilt binaries for common macOS versions.
[^nix-substitutes]: Binary substitutes from [cache.nixos.org](https://cache.nixos.org/) avoid rebuilding from source.
[^spack-binaries]: Spack supports binary caches but defaults to building from source.
[^nuget-rids]: Runtime Identifiers (RIDs) specify platform-specific assets.
[^pypi-psf]: [Python Software Foundation](https://www.python.org/psf-landing/)
[^crates-rust]: [Rust Foundation](https://rustfoundation.org/)
[^rubygems-central]: [Ruby Central](https://rubycentral.org/)
[^maven-lf]: Originally [Sonatype](https://www.sonatype.com/), now [Linux Foundation](https://www.linuxfoundation.org/)
[^packagist-funding]: Funded by [Private Packagist](https://packagist.com/)
[^cpan-perl]: [Perl Foundation](https://perlfoundation.org/)
[^hex-funding]: Six Colors AB, community-funded
[^clojars-funding]: [Clojurists Together](https://www.clojuriststogether.org/)
[^hackage-org]: [Haskell.org](https://www.haskell.org/)
[^cran-r]: [R Foundation](https://www.r-project.org/foundation/)
[^npm-microsoft]: GitHub/Microsoft
[^nuget-microsoft]: Microsoft
[^pubdev-google]: Google
[^conda-anaconda]: Anaconda Inc
[^juliahub-computing]: Julia Computing
[^puppet-perforce]: Perforce
[^openvsx-eclipse]: [Eclipse Foundation](https://www.eclipse.org/)
[^fedora-redhat]: Red Hat
[^ubuntu-canonical]: Canonical
[^homebrew-latest]: Formulas point to the latest version; older versions require tapping homebrew-core history.
[^apt-releases]: Each Debian/Ubuntu release has its own repository snapshot.
[^arch-rolling]: Rolling release model; only current versions are available.
[^alpine-releases]: Each Alpine release has its own repository.
[^maven-permanent]: Maven Central [does not allow deletion](https://central.sonatype.org/faq/can-i-change-a-component/) or modification of published artifacts.
[^npm-unpublish]: [72-hour window](https://docs.npmjs.com/policies/unpublish/) for unpublishing, with exceptions for security issues.
[^pypi-deletion]: Can delete files and releases; [PEP 763](https://peps.python.org/pep-0763/) proposes limiting this to 72 hours.
[^go-cache-permanent]: Once cached by [proxy.golang.org](https://proxy.golang.org/), modules remain available indefinitely.
[^npm-verdaccio]: [Verdaccio](https://www.verdaccio.org/) is the most popular private npm registry.
[^pypi-devpi]: [devpi](https://github.com/devpi/devpi) and [Artifactory](https://jfrog.com/artifactory/) provide PyPI-compatible private registries.
[^maven-nexus]: [Nexus](https://www.sonatype.com/products/sonatype-nexus-repository) and [Artifactory](https://jfrog.com/artifactory/) are widely used for hosting private Maven repositories.
[^juliahub-git]: JuliaHub has a database-backed front end but the underlying Julia General registry is a git repository.
[^racket-filesystem]: pkgs.racket-lang.org stores packages as files, generates a JSON index, and serves via S3. It polls git sources for updates but doesn't use git as its storage layer.
[^homebrew-osc]: Fiscally sponsored by [Open Source Collective](https://opencollective.com/opensource)
[^chocolatey-moderation]: Three-stage automated review (validator, verifier, VirusTotal scan) plus human moderation.
[^helm-cncf]: [Cloud Native Computing Foundation](https://www.cncf.io/)
[^ansible-redhat]: Red Hat.
[^chocolatey-company]: Chocolatey Software.
[^winget-microsoft]: Microsoft.
[^go-google]: Google.
[^deno-company]: Deno Company.
[^hex-mirrors]: Official [mirror documentation](https://hex.pm/docs/mirrors) with geographic mirrors available.
[^luarocks-servers]: Custom rock servers can be configured via `rocks_servers` in the config file.
[^clojars-mirrors]: [Mirror documentation](https://github.com/clojars/clojars-web/wiki/Mirrors) with instructions for running your own.
