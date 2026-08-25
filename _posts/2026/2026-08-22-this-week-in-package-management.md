---
layout: post
title: "This Week in Package Management: 22 August 2026"
date: 2026-08-22 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mtvlilqerg2o"
---

Week fourteen of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[Go 1.27](https://go.dev/doc/go1.27) is out. On the module side, `go mod tidy` now consolidates duplicate `require` blocks into the canonical direct/indirect pair for modules declaring `go 1.27` or later, `go doc` accepts `package@version` to fetch documentation for a specific module version, and the `go` command drops support for fetching modules from Bazaar repositories. A [`compress/flate` encoder change](https://go.dev/doc/go1.27#compressflatepkgcompressflate) also means `archive/zip` and `compress/gzip` produce different bytes than under Go 1.26, which is worth checking anywhere a Go-built tool's archive output is hash-pinned downstream (forge tarball endpoints, module proxies, release pipelines).

[Rust 1.98](https://blog.rust-lang.org/2026/08/20/Rust-1.98.0/) ships Cargo with an unstable [`-Zmin-publish-age`](https://github.com/rust-lang/cargo/pull/17012) flag implementing [RFC 3923](https://github.com/rust-lang/rfcs/pull/3923): resolution filters out crate versions published more recently than a configured threshold. It also fixes a 1.96 Windows regression in `cargo:token-from-stdout` credential providers.

[Bun 1.4](https://bun.com/blog/bun-v1.4) is the first release of the [Rust rewrite](https://bun.com/blog/bun-in-rust), the bulk of which Jarred Sumner produced from the Zig codebase with Claude Code workflows. It fills out the package manager subcommands: `bun pm diff` shows un-minified source diffs between package versions and flags new install scripts, `bun audit fix` upgrades vulnerable dependencies, `bun dedupe` and `bun prune` clean up the lockfile and `node_modules`, GitHub and tarball dependencies now record SHA-512 hashes in the lockfile, and only packages from the npm registry are auto-trusted to run install scripts by default.

[pnpm 11.22](https://github.com/pnpm/pnpm/releases/tag/v11.22.0) shipped alongside a [11.21–11.22 recap](https://pnpm.io/blog/releases/11.21-11.22): `pnpm install` now edits the lockfile in place for most everyday manifest changes without re-resolving the whole dependency graph, global installs switch over atomically, `pnpm cache path` prints the store location, and a project's `pnpm-workspace.yaml` can no longer relocate machine-level state directories. pnpm 12 reached [RC 8](https://github.com/pnpm/pnpm/releases/tag/v12.0.0-rc.8): the `registries` setting is now keyed by URL with scopes and tarball layout declared per entry, and `packageImportMethod: auto` tries hardlinks before reflinks on Linux, roughly halving the time to materialise `node_modules` from a warm store on btrfs.

[Hex 2.5](https://hex.pm/blog/hex-v25-released) surfaces security advisories during `mix deps.get` and `mix deps.update`, printing a summary of vulnerable packages at the end of the run. A `cooldown` setting withholds versions younger than a configured age from resolution, lifted automatically when the currently locked version is itself retired or has an advisory, and organisations can publish signed dependency policies that opted-in projects apply centrally.

[Renovate 44.33.0–44.39.1](https://github.com/renovatebot/renovate/releases/tag/44.39.1) adds [PEP 691 JSON simple index](https://github.com/renovatebot/renovate/pull/44222) support to the PyPI datasource and passes [`POETRY_SOLVER_MIN_RELEASE_AGE`](https://github.com/renovatebot/renovate/pull/43429) through to Poetry when `minimumReleaseAge` is configured.

Also out:

- [Gradle 9.7.1](https://github.com/gradle/gradle/releases/tag/v9.7.1)
- [conda 26.7.1](https://github.com/conda/conda/releases/tag/26.7.1)
- [PDM 2.28.2](https://github.com/pdm-project/pdm/releases/tag/2.28.2)
- [Homebrew 6.0.18](https://github.com/Homebrew/brew/releases/tag/6.0.18)
- [Chocolatey 2.7.4](https://github.com/chocolatey/choco/releases/tag/2.7.4)
- [Verdaccio 6.9.3](https://github.com/verdaccio/verdaccio/releases/tag/v6.9.3)
- [Dependabot Core 0.392.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.392.0)
- [mise 2026.8.10](https://github.com/jdx/mise/releases/tag/v2026.8.10)
- [Harbor 2.15.2](https://github.com/goharbor/harbor/releases/tag/v2.15.2)
- [RPM 6.1.0](https://rpm.org/releases/6.1.0)
- [RubyGems 4.0.19](https://blog.rubygems.org/2026/08/20/4.0.19-released.html)
- [snapd 2.76.3](https://github.com/canonical/snapd/releases/tag/2.76.3)
- [DNF5 5.4.4.0](https://github.com/rpm-software-management/dnf5/releases/tag/5.4.4.0)
- [opam 2.6.0-beta1](https://github.com/ocaml/opam/releases/tag/2.6.0-beta1)
- [diffoscope 329](https://diffoscope.org/news/diffoscope-329-released/)

## Security

crates.io [removed](https://blog.rust-lang.org/2026/08/20/supply-chain-attack-on-arrayref/) malicious versions of `arrayref`, `internment`, `append-only-vec` and several typosquat crates published from a compromised maintainer account. The malicious versions carried a build script that downloaded a remote payload and were live for under two hours before deletion; the post gives a command to check the local Cargo cache for the affected versions.

[sbt 2.0.6](https://github.com/sbt/sbt/releases/tag/v2.0.6) and [1.12.15](https://github.com/sbt/sbt/releases/tag/v1.12.15) fix [GHSA-m2pw-22cj-jq4v](https://github.com/sbt/sbt/security/advisories/GHSA-m2pw-22cj-jq4v), a remote code execution via the sbt server when `serverConnectionType` is set to `Tcp`, and [2.0.7](https://github.com/sbt/sbt/releases/tag/v2.0.7)/[1.13.0](https://github.com/sbt/sbt/releases/tag/v1.13.0) fix the same class of bug in the BSP handler ([GHSA-943m-f264-54p4](https://github.com/sbt/sbt/security/advisories/GHSA-943m-f264-54p4)). Builds using the default Unix domain socket connection type are unaffected.

## Articles

[What's missing to have reproducible builds on PyPI](https://snarky.ca/whats-missing-to-have-reproducible-builds-on-pypi/) (Brett Cannon) sets out three gaps: distributions don't record the source location they were built from, sdists have no standard place to store build-environment SBOM data the way wheels do, and there's no channel for independent verifiers to attest to PyPI that they reproduced a distribution.

[Protecting the Rust standard library from breakage](https://predr.ag/blog/protecting-the-rust-stdlib-from-breakage/) (Predrag Gruevski): rust-lang/rust CI now runs cargo-semver-checks against `core`, `alloc` and `std`, treating `#[stable]` and `#[unstable]` attributes as the public-API boundary. Getting there meant new stability fields in rustdoc's JSON output and threading them through the linter's query layer without rewriting existing lints.

[Spinel dev log, July 2026](https://spinel.coop/blog/spinel-dev-log-july-2026/): the Ruby tooling cooperative's monthly update on `rv` (a Ruby version manager with its own [precompiled Ruby builds](https://github.com/spinel-coop/rv-ruby)), the Dyad shell helper, and brut-pack for bundling scripts.

[How mature is this repository?](https://www.foo.be/2026/08/Open-Source-Metrics.html) (Alexandre Dulaunoy) introduces [OSSTRL](https://github.com/adulau/osstrl), which computes a 1–9 Technology Readiness Level for a GitHub repository from automatically gathered evidence across community, governance, development, support and security dimensions, with maturity gates so a single strong signal can't inflate the overall level.

## Papers

[Implicit, Yet Impactful: Understanding Hidden Dependencies in Java Projects](https://arxiv.org/abs/2608.16262) (Zhang et al., arXiv) measures transitive Maven dependencies whose classes are referenced directly by a project's own code without being declared: across 972 GitHub modules, 34% contain at least one, 48% of those introduce breaking API changes, and 36 CVEs in the sample expose vulnerable methods that the root project calls directly.

[SMTpip: Interpreter-Aware SMT-Based Dependency Conflict Resolution](https://arxiv.org/abs/2608.15886) (Sakib et al., arXiv) encodes both package version constraints and Python interpreter compatibility as SMT formulas so a solver can decide up front whether a satisfying environment exists, reporting a 6.9× speedup over pip's backtracking resolver on their benchmark.

## Elsewhere

[Commonhaus and HeroDevs launch OSSI](https://opensourcesecurity.io/2026/2026-08-commonhaus-herodevs/) (Josh Bressers, Open Source Security): an interview with Erin Schnabel and Rob Nalen on a partnership funding CVE remediation and extended support for end-of-life releases of Commonhaus-hosted projects, starting with Hibernate, Jackson and Quarkus.

[How AWS powers PyPI and the PSF](https://blog.pypi.org/posts/2026-08-14-how-aws-powers-pypi-and-the-psf/) (PyPI blog): AWS's open source credits programme covers PyPI's infrastructure bill and its security sponsorship funds engineering time, but PyPI is currently maintained by roughly one and a half full-time engineers plus one on support. A line describing PyPI as a supply chain risk given that staffing was later [reworded](https://github.com/pypi/warehouse/commit/bc867eed).

[Inside Modern Software Engineering with Homebrew's Mike McQuaid](https://podcast.thoughtbot.com/619) (Giant Robots podcast): an interview covering Homebrew's history and open source maintainership.

[Sustain #293](https://podcast.sustainoss.org/293) has Daniel Roe and Matias Capeletto on [npmx](https://npmx.dev), the community-built npm registry browser, covering how the project reached hundreds of contributors since January and its governance and funding.

## git-pkgs

I tagged 16 repos this week:

- [artifacts v0.1.1](https://github.com/git-pkgs/artifacts/releases/tag/v0.1.1) (new), a Go library that describes a completed package file as a canonical package URL, an OCI-form content digest and a byte count, with optional filename and media type carried alongside
- [integrity v0.1.1](https://github.com/git-pkgs/integrity/releases/tag/v0.1.1) (new), a Go library that parses Subresource Integrity metadata (SHA-256/384/512, standard or URL-safe base64) and verifies package byte streams against it as they are read
- [brief v0.11.0](https://github.com/git-pkgs/brief/releases/tag/v0.11.0)
- [clone v0.5.0](https://github.com/git-pkgs/clone/releases/tag/v0.5.0)
- [cooldown v0.2.0](https://github.com/git-pkgs/cooldown/releases/tag/v0.2.0)
- [enrichment v0.7.0](https://github.com/git-pkgs/enrichment/releases/tag/v0.7.0)
- [forge v0.9.0](https://github.com/git-pkgs/forge/releases/tag/v0.9.0)
- [licenses v0.6.0](https://github.com/git-pkgs/licenses/releases/tag/v0.6.0)
- [managers v0.11.0](https://github.com/git-pkgs/managers/releases/tag/v0.11.0)
- [manifests v0.10.0](https://github.com/git-pkgs/manifests/releases/tag/v0.10.0)
- [pin v0.2.0](https://github.com/git-pkgs/pin/releases/tag/v0.2.0)
- [pom v0.1.7](https://github.com/git-pkgs/pom/releases/tag/v0.1.7)
- [purl v0.1.17](https://github.com/git-pkgs/purl/releases/tag/v0.1.17)
- [registries v0.8.1](https://github.com/git-pkgs/registries/releases/tag/v0.8.1)
- [sigstore v0.2.0](https://github.com/git-pkgs/sigstore/releases/tag/v0.2.0)
- [vers v0.6.0](https://github.com/git-pkgs/vers/releases/tag/v0.6.0)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
