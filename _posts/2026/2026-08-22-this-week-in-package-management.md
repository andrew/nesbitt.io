---
layout: post
title: "This Week in Package Management: 22 August 2026"
date: 2026-08-22 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week fourteen of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[Go 1.27](https://go.dev/doc/go1.27) is out. On the module side, `go mod tidy` now consolidates duplicate `require` blocks into the canonical direct/indirect pair for modules declaring `go 1.27` or later, `go doc` accepts `package@version` to fetch documentation for a specific module version, and the `go` command drops support for fetching modules from Bazaar repositories.

[pnpm 11.22](https://github.com/pnpm/pnpm/releases/tag/v11.22.0) shipped alongside a [11.21–11.22 recap](https://pnpm.io/blog/releases/11.21-11.22): `pnpm install` now edits the lockfile in place for most everyday manifest changes without re-resolving the whole dependency graph, global installs switch over atomically, `pnpm cache path` prints the store location, and a project's `pnpm-workspace.yaml` can no longer relocate machine-level state directories. pnpm 12 reached [RC 7](https://github.com/pnpm/pnpm/releases/tag/v12.0.0-rc.7), which restructures the `registries` setting to be keyed by URL with scopes, tarball layout and `serverType` declared per entry, and drops the recorded registry list from `node_modules/.modules.yaml`.

[Renovate 44.33.0–44.34.3](https://github.com/renovatebot/renovate/releases/tag/44.34.3) adds [PEP 691 JSON simple index](https://github.com/renovatebot/renovate/pull/44222) support to the PyPI datasource and passes [`POETRY_SOLVER_MIN_RELEASE_AGE`](https://github.com/renovatebot/renovate/pull/43429) through to Poetry when `minimumReleaseAge` is configured.

Also out:

- [Gradle 9.7.1](https://github.com/gradle/gradle/releases/tag/v9.7.1)
- [conda 26.7.1](https://github.com/conda/conda/releases/tag/26.7.1)
- [PDM 2.28.2](https://github.com/pdm-project/pdm/releases/tag/2.28.2)
- [Homebrew 6.0.18](https://github.com/Homebrew/brew/releases/tag/6.0.18)
- [Chocolatey 2.7.4](https://github.com/chocolatey/choco/releases/tag/2.7.4)
- [Verdaccio 6.9.3](https://github.com/verdaccio/verdaccio/releases/tag/v6.9.3)
- [Dependabot Core 0.392.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.392.0)
- [mise 2026.8.8](https://github.com/jdx/mise/releases/tag/v2026.8.8)
- [Harbor 2.15.2](https://github.com/goharbor/harbor/releases/tag/v2.15.2)

## Security

[sbt 2.0.6](https://github.com/sbt/sbt/releases/tag/v2.0.6) and [1.12.15](https://github.com/sbt/sbt/releases/tag/v1.12.15) fix [GHSA-m2pw-22cj-jq4v](https://github.com/sbt/sbt/security/advisories/GHSA-m2pw-22cj-jq4v), a remote code execution via the sbt server when `serverConnectionType` is set to `Tcp`. Builds using the default Unix domain socket connection type are unaffected.

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

## git-pkgs

I tagged 13 repos this week:

- [artifacts v0.1.1](https://github.com/git-pkgs/artifacts/releases/tag/v0.1.1) (new), a Go library that describes a completed package file as a canonical package URL, an OCI-form content digest and a byte count, with optional filename and media type carried alongside
- [integrity v0.1.1](https://github.com/git-pkgs/integrity/releases/tag/v0.1.1) (new), a Go library that parses Subresource Integrity metadata (SHA-256/384/512, standard or URL-safe base64) and verifies package byte streams against it as they are read
- [clone v0.5.0](https://github.com/git-pkgs/clone/releases/tag/v0.5.0)
- [cooldown v0.2.0](https://github.com/git-pkgs/cooldown/releases/tag/v0.2.0)
- [enrichment v0.7.0](https://github.com/git-pkgs/enrichment/releases/tag/v0.7.0)
- [forge v0.9.0](https://github.com/git-pkgs/forge/releases/tag/v0.9.0)
- [manifests v0.10.0](https://github.com/git-pkgs/manifests/releases/tag/v0.10.0)
- [pin v0.2.0](https://github.com/git-pkgs/pin/releases/tag/v0.2.0)
- [pom v0.1.7](https://github.com/git-pkgs/pom/releases/tag/v0.1.7)
- [purl v0.1.17](https://github.com/git-pkgs/purl/releases/tag/v0.1.17)
- [registries v0.8.0](https://github.com/git-pkgs/registries/releases/tag/v0.8.0)
- [sigstore v0.2.0](https://github.com/git-pkgs/sigstore/releases/tag/v0.2.0)
- [vers v0.6.0](https://github.com/git-pkgs/vers/releases/tag/v0.6.0)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
