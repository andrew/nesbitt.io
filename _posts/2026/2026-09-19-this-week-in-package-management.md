---
layout: post
title: "This Week in Package Management: 19 September 2026"
date: 2026-09-19 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week eighteen of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[Homebrew 7.0.0](https://brew.sh/2026/09/13/homebrew-7.0.0/) overlaps package preparation with downloads for faster installs, sandboxes formula and cask operations with home-directory reads blocked by default, adds a `brew vulns` command backed by a new OSV-format advisory database published under CC0, ships a native macOS app (BrewUI) for browsing and installing packages, drops macOS 10.15 support, and moves Intel Macs to Tier 3. [7.0.1](https://github.com/Homebrew/brew/releases/tag/7.0.1) and [7.0.2](https://github.com/Homebrew/brew/releases/tag/7.0.2) fix Perl bottle relocation under the shorter prefix and restrict which files are verified when tapping.

[Swift 6.4](https://www.swift.org/blog/swift-6.4-released/) makes Swift Build the default build system in SwiftPM and adds SBOM generation in SPDX and CycloneDX formats via [SE-0509](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0509-package-sbom.md).

[sbt 2.1.0-M1](https://github.com/sbt/sbt/releases/tag/v2.1.0-M1) moves the metabuild to Scala 3.9 and removes Apache Ivy as a dependency; plugins built for 2.1.x are incompatible with sbt 2.0.x.

[RubyGems and Bundler 4.0.21](https://blog.rubygems.org/2026/09/16/4.0.21-released.html) normalises absolute symlink targets during gem extraction and rejects Bundler redirects that downgrade HTTPS to HTTP.

[Pixi 0.81.0](https://github.com/prefix-dev/pixi/releases/tag/v0.81.0) extends `pixi run --script` to fetch conda-script files from HTTP and HTTPS URLs, including Gists, reusing the cached environment without a local copy.

[uv 0.12.15](https://github.com/astral-sh/uv/releases/tag/0.12.15) reverts the symlinked-destination check from 0.12.14 that broke `uv pip install --system` in `python:*` Docker images and `--target .`, and batches cache writes to speed up cold-cache resolution.

Also out:

- [mise 2026.9.9](https://github.com/jdx/mise/releases/tag/v2026.9.9)
- [pipx 1.17.3](https://github.com/pypa/pipx/releases/tag/1.17.3)
- [PDM 2.29.1](https://github.com/pdm-project/pdm/releases/tag/2.29.1)
- [MacPorts 2.12.6](https://github.com/macports/macports-base/releases/tag/v2.12.6)
- [DNF5 5.4.5.0](https://github.com/rpm-software-management/dnf5/releases/tag/5.4.5.0)
- [sbt 2.0.9](https://github.com/sbt/sbt/releases/tag/v2.0.9)
- [Pkg.jl 1.13.0](https://github.com/JuliaLang/Pkg.jl/releases/tag/v1.13.0)
- [Docker Engine 29.8.1](https://github.com/moby/moby/releases/tag/docker-v29.8.1)
- [Gradle 9.9.0-M1](https://github.com/gradle/gradle/releases/tag/v9.9.0-M1)
- [Dependabot Core 0.396.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.396.0)
- [Renovate 44.93.6](https://github.com/renovatebot/renovate/releases/tag/44.93.6)

## Security

[Podman 6.1.2](https://github.com/podman-container-tools/podman/releases/tag/v6.1.2) fixes [CVE-2025-11395](https://nvd.nist.gov/vuln/detail/CVE-2025-11395), where `podman load` on an image with a crafted layer tarball, or `podman volume import` on a volume with crafted symlinks, could overwrite files on the host.

[pnpm 12.4.2](https://github.com/pnpm/pnpm/releases/tag/v12.4.2) stops a dependency's executable from redirecting another package's POSIX bin shim through its shell helpers (a reinstall replaces existing shims) and stops GitHub Actions homepage links from including server credentials. The Cygwin, MSYS2 and WSL shims still resolve `PATH` for Windows path conversion, so the redirect remains possible there.

Aaron Patterson [wrote up](https://tenderlovemaking.com/2026/09/11/what-a-time-to-be-alive/) the mechanism behind the May rubygems.org spam campaign covered [last week](/2026/09/12/this-week-in-package-management.html): a `--load ./script.rb` line in a gem's `.yardopts` runs during YARD documentation generation, so publishing a gem executed arbitrary code inside rubydoc.info's networked container, which the campaign used to extract cached rubygems.org API keys and publish more gems.

## Papers

[An Exploratory Study of Dependabot Cooldown Adoption in Open-Source GitHub Projects](https://arxiv.org/abs/2609.16605) (Tanaka et al., arXiv) looks at repositories that enabled Dependabot's cooldown feature: 83 of 92 adoptions with a stated motivation cited security, 97.2% set a general delay rather than per-update-type settings, and 64.3% of those picked seven days.

[Python Import as an Execution Boundary](https://arxiv.org/abs/2609.14791) (Chen and Li, arXiv) mines PyPI histories and advisories for bugs and vulnerabilities that trigger at `import` time: module-level and `__init__` code activates 98.3% of the cases they confirm, and 90% of the twenty initialisation-time advisory vulnerabilities are rated High or Critical. Fixes more often move when the import runs than remove the dependency.

[GANADI: Uncovering C/C++ OSS Reuse Genealogies](https://arxiv.org/abs/2609.17018) (Kim et al., arXiv) clusters downstream C/C++ projects by pivotal functions to reconstruct which project copied code from which, then uses the resulting reuse tree to route vulnerability reports; 23 of 48 unpatched vulnerabilities they found this way were fixed after disclosure.

## Elsewhere

The OpenJS Foundation CNA is [pausing CVE triage, validation and assignment](https://openjsf.org/blog/the-openjs-foundation-cna-is-taking-a-coordinated-break) from 17 September to 6 October, citing the volume of AI-generated security reports reaching its volunteer team. Incoming reports queue for processing after the break; actively exploited issues still get a response through the OpenJS Slack.

Emma Irwin has moved [Open Source Wishlist](https://sunnydeveloper.com/we-have-the-data-the-standards-the-expertise-to-solve-most-oss-sustainability-problems-dollars-not-so-much/) to a standalone teaching tool that uses [Ecosyste.ms](https://ecosyste.ms) metadata to surface single-maintainer risk and open vulnerabilities for a chosen project and generate a support plan, arguing that data, standards and expertise for open source sustainability exist and funding is the missing piece.

## git-pkgs

I tagged seven repos this week:

- [tiers v0.1.1](https://github.com/git-pkgs/tiers/releases/tag/v0.1.1) (new), which layers a set of local package checkouts by their in-set dependencies to compute a release order, and iterates over that order to bump each package's in-set dependencies through `managers`
- [managers v0.12.0](https://github.com/git-pkgs/managers/releases/tag/v0.12.0)
- [manifests v0.12.2](https://github.com/git-pkgs/manifests/releases/tag/v0.12.2)
- [registries v0.9.2](https://github.com/git-pkgs/registries/releases/tag/v0.9.2)
- [archives v0.7.1](https://github.com/git-pkgs/archives/releases/tag/v0.7.1)
- [gitignore v1.3.0](https://github.com/git-pkgs/gitignore/releases/tag/v1.3.0)
- [vers v0.7.1](https://github.com/git-pkgs/vers/releases/tag/v0.7.1)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
