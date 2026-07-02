---
layout: post
title: "This Week in Package Management: 4 July 2026"
date: 2026-07-04 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week seven of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[Hex 2.5.0](https://github.com/hexpm/hex/releases/tag/v2.5.0) adds organisation-defined dependency policies: an organisation publishes a named policy through its repository, a project opts in via `HEX_POLICY` or the `:hex` block in `mix.exs`, and resolution then filters out versions that carry an advisory above a given severity, are retired for listed reasons, or are newer than a release-age threshold.

[Conan 2.30.0](https://github.com/conan-io/conan/releases/tag/2.30.0) adds SPDX expression support to its SBOM generation, a `conf=~` unset operator, and IntelCC support in the Meson, Autotools and Premake toolchains.

[uv 0.11.25](https://github.com/astral-sh/uv/releases/tag/0.11.25) hardens tar handling against parser differentials via an updated `astral-tokio-tar`, so uv may now reject malformed source distributions it previously accepted, and writes a full lockfile into tool receipts. [0.11.26](https://github.com/astral-sh/uv/releases/tag/0.11.26) followed with resolver performance work reusing state across PubGrub iterations.

[pixi 0.72.0](https://github.com/prefix-dev/pixi/releases/tag/v0.72.0) adds inline package manifests, so a git dependency without a Pixi Build manifest of its own can have build backend metadata set directly in the consuming project's `dependencies` table.

[Rust 1.96.1](https://blog.rust-lang.org/2026/06/30/Rust-1.96.1/) is a point release fixing missing retries and timeouts in Cargo's HTTP client and patching three libssh2 CVEs in the copy compiled into Cargo.

[npm 12.0.0-pre.2](https://github.com/npm/cli/releases/tag/v12.0.0-pre.2) graduates the linked install strategy from experimental to stable and moves install-script approval under a dedicated `npm install-scripts` namespace.

[brew-vulns 0.4.0](https://github.com/Homebrew/homebrew-brew-vulns/releases/tag/v0.4.0), which I maintain, uses the `resolves` field on formula patches added in Homebrew 6.0.4 to suppress false positives where the formula already carries a patch for the CVE, and records those as `analysis.state = resolved` in CycloneDX output.

Also out: [Homebrew 6.0.6](https://github.com/Homebrew/brew/releases/tag/6.0.6), [sbt 2.0.1](https://github.com/sbt/sbt/releases/tag/v2.0.1), [Cargo 0.97.2](https://github.com/rust-lang/cargo/releases/tag/0.97.2), [Deno 2.9.1](https://github.com/denoland/deno/releases/tag/v2.9.1), [Podman 5.8.4](https://github.com/podman-container-tools/podman/releases/tag/v5.8.4), [Harbor 2.15.2](https://github.com/goharbor/harbor/releases/tag/v2.15.2), [Dependabot Core 0.384.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.384.0), [diffoscope 323](https://diffoscope.org/news/diffoscope-323-released/).

## Security

[Composer 2.10.2](https://github.com/composer/composer/releases/tag/2.10.2) and LTS [2.2.29](https://github.com/composer/composer/releases/tag/2.2.29) fix path traversal via package `bin` entries ([GHSA-gjfg-22fp-rrxx](https://github.com/advisories/GHSA-gjfg-22fp-rrxx)), credential leakage in verbose output ([GHSA-g6xq-892h-64w3](https://github.com/advisories/GHSA-g6xq-892h-64w3)), missing package name validation ([GHSA-499r-g7pc-vmp9](https://github.com/advisories/GHSA-499r-g7pc-vmp9)), and three further hardening changes around HTTP redirects, phar metadata and JSON error output.

[Mitigated: API bypass for download metadata on python.org](https://blog.python.org/2026/06/mitigated-api-bypass-for-download-metadata-python-dot-org/) reports an authentication bypass in the python.org API where mixed handling of guest and API-key authentication could grant administrative privileges over download metadata; the fix separates the two modes and adds URL validation. Guix has a [tracking issue](https://codeberg.org/guix/guix/issues/6992) on the implications for its importer.

[Hijacked npm and Go packages use VS Code tasks to deploy infostealer](https://thehackernews.com/2026/06/hijacked-npm-and-go-packages-use-vs.html) covers a campaign in which sixteen hijacked Go modules and a set of npm packages shipped fake font files and VS Code task definitions that fetched a Python infostealer.

## Articles

[GuixPkgs: every Guix package as a Nix flake](https://fzakaria.com/2026/06/25/guixpkgs-every-guix-package-as-a-nix-flake) (Farid Zakaria) imports the full Guix package set into Nix by building a primitive that exposes each Guix derivation through a flake.

[The Vulnerability Identity Crisis](https://research.empiricalsecurity.com/research/the-vulnerability-identity-crisis) (Jay Jacobs and Art Manion, Empirical Security) argues a vulnerability should be defined as a disposition, a structural property comprising a fault, conditions for exploitation, and a resulting security failure, rather than by surface characteristics.

[Do excellent vulnerability reports](https://daniel.haxx.se/blog/2026/06/29/do-excellent-vulnerability-reports/) (Daniel Stenberg) is a guide for reporters on what an open source project needs from a vulnerability report to act on it.

[All Package Management Functionality Moved from Compiler to Build System](https://ziglang.org/devlog/2026/?2026-06-30#2026-06-30) (Andrew Kelley, Zig devlog) shifts package fetching, the HTTP client, TLS, the Git protocol and archive handling out of the `zig` binary into the build-side maker process, shipped as source. Networking now runs in `ReleaseSafe` with safety checks on and can be patched without rebuilding the compiler.

## Papers

[Mutating the "Immutable": A Large-Scale Study of Git Tag Alterations](https://arxiv.org/abs/2606.31354) (Rapaport et al., arXiv) analyses 328.4 million repositories from Software Heritage and finds 10.2 million tags that were deleted or force-pushed after creation, undermining the assumption that a tag is a stable reference for reproducible builds.

[Uncovering Similar but Different Packages in PyPI and Potential Security Threats](https://arxiv.org/abs/2606.29785) (Park et al., arXiv) measures package replication on PyPI, where a package duplicates most of an existing codebase, and traces how replicated packages propagate known vulnerabilities and provide cover for malicious variants.

## Elsewhere

The PSF has [announced the inaugural Python Packaging Council election](https://pyfound.blogspot.com/2026/06/packaging-council-inaugural-election.html), establishing a technical decision-making body for Python packaging specs that coordinates across tools and teams.

The [Open Source Pledge](https://opensourcepledge.com/) has a redesigned site marking $7 million paid to maintainers by member companies so far.

[Once a Maintainer: Mike Dalessio](https://onceamaintainer.substack.com/p/once-a-maintainer-mike-dalessio) is an interview with the Nokogiri maintainer on the security work that comes with maintaining a widely depended-on gem.

## git-pkgs

I tagged fifteen repos this week:

- [git-pkgs v0.17.0](https://github.com/git-pkgs/git-pkgs/releases/tag/v0.17.0)
- [brief v0.9.2](https://github.com/git-pkgs/brief/releases/tag/v0.9.2)
- [managers v0.10.1](https://github.com/git-pkgs/managers/releases/tag/v0.10.1)
- [forge v0.6.0](https://github.com/git-pkgs/forge/releases/tag/v0.6.0)
- [registries v0.6.2](https://github.com/git-pkgs/registries/releases/tag/v0.6.2)
- [proxy v0.5.1](https://github.com/git-pkgs/proxy/releases/tag/v0.5.1)
- [manifests v0.6.0](https://github.com/git-pkgs/manifests/releases/tag/v0.6.0)
- [enrichment v0.4.1](https://github.com/git-pkgs/enrichment/releases/tag/v0.4.1)
- [resolve v0.2.2](https://github.com/git-pkgs/resolve/releases/tag/v0.2.2)
- [outline v0.1.6](https://github.com/git-pkgs/outline/releases/tag/v0.1.6)
- [purl v0.1.13](https://github.com/git-pkgs/purl/releases/tag/v0.1.13)
- [vulns v0.1.6](https://github.com/git-pkgs/vulns/releases/tag/v0.1.6)
- [pom v0.1.5](https://github.com/git-pkgs/pom/releases/tag/v0.1.5)
- [capcheck v0.1.1](https://github.com/git-pkgs/capcheck/releases/tag/v0.1.1)
- [distill v0.1.0](https://github.com/git-pkgs/distill/releases/tag/v0.1.0)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
