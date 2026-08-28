---
layout: post
title: "This Week in Package Management: 29 August 2026"
date: 2026-08-29 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week fifteen of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[pnpm 12.0](https://pnpm.io/blog/releases/12.0) is the stable release of the Rust rewrite. The commands, flags, settings and lockfile format from pnpm 11 carry over unchanged; a companion [what's different](https://pnpm.io/blog/whats-different-in-pnpm-12) post lists the seven behavioural changes. Git dependencies on GitHub, GitLab and Bitbucket now resolve through the host's canonical HTTPS URL regardless of how they were specified, so lockfiles no longer record SSH URLs for those hosts. Dependency cycles are broken canonically during peer resolution, making the lockfile a pure function of the dependency graph, and cycle-heavy workspaces resolve peers 2–3× faster with roughly 25% less memory. Globally installed tools now follow version pins from the current project, pnpm can provision npm, Yarn and Bun as managed tools with a `pnx` command for one-off runs, and unrecognised keys in `pnpm-workspace.yaml` are now errors. On the 11.x branch, [11.23](https://pnpm.io/blog/releases/11.23) reworks the `registries` setting so an Artifactory or GitLab registry can keep its tarball URLs out of `pnpm-lock.yaml`, and [11.24](https://pnpm.io/blog/releases/11.24) restores `pnpm approve-builds --global` and groups recursive publishes by registry so a credential mismatch is caught before anything is uploaded.

[Stack 4.1.0.1 RC](https://github.com/commercialhaskell/stack/releases/tag/rc%2Fv4.1.0.1) adds cross-package Backpack support: when a package uses signatures and mixins to depend on an abstract interface from another package, Stack now generates the extra instantiation build steps Cabal needs. Private Backpack, with signatures and implementations in the same package, was already supported.

[winget 1.29.290](https://github.com/microsoft/winget-cli/releases/tag/v1.29.290) adds an experimental `sourcePriority` feature: sources can be given a numeric priority via `source add` or `source edit`, and higher-priority sources sort first in search results when other ranking factors are equal.

[Maven 3.10.0-rc-1](https://github.com/apache/maven/releases/tag/maven-3.10.0-rc-1) is the first release candidate for the 3.10 line, which aligns 3.x behaviour with Maven 4: classpath ordering, version-range resolution filtering and the Resolver 2.0.19 changes are backported, and the super POM drops the deprecated `release-profile` and default plugin management.

Also out:

- [Homebrew 6.0.20](https://github.com/Homebrew/brew/releases/tag/6.0.20)
- [npm 11.19.1](https://github.com/npm/cli/releases/tag/v11.19.1)
- [Verdaccio 6.10.1](https://github.com/verdaccio/verdaccio/releases/tag/v6.10.1)
- [Deno 2.9.6](https://github.com/denoland/deno/releases/tag/v2.9.6)
- [uv 0.12.7](https://github.com/astral-sh/uv/releases/tag/0.12.7)
- [pipx 1.16.8](https://github.com/pypa/pipx/releases/tag/1.16.8)
- [pixi 0.78.0](https://github.com/prefix-dev/pixi/releases/tag/v0.78.0)
- [mise 2026.8.14](https://github.com/jdx/mise/releases/tag/v2026.8.14)
- [MacPorts 2.12.6](https://github.com/macports/macports-base/releases/tag/v2.12.6)
- [Flatpak 1.18.2](https://github.com/flatpak/flatpak/releases/tag/1.18.2)
- [Dependabot Core 0.393.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.393.0)
- [Renovate 44.49.0](https://github.com/renovatebot/renovate/releases/tag/44.49.0)
- [Gradle 9.8.0-M2](https://github.com/gradle/gradle/releases/tag/v9.8.0-M2)
- [sbt 2.0.8](https://github.com/sbt/sbt/releases/tag/v2.0.8)

## Security

[Composer 2.10.3](https://github.com/composer/composer/releases/tag/2.10.3) and [2.2.30](https://github.com/composer/composer/releases/tag/2.2.30) fix four issues: [CVE-2026-59944](https://github.com/composer/composer/security/advisories/GHSA-96h3-5x6v-m776) (path traversal via symlinked `bin` entries), [command injection via a malicious Perforce URL](https://github.com/composer/composer/security/advisories/GHSA-rvx4-ffvw-m9q3), URL-embedded credentials leaking into more places than intended, and GitLab URL matching that could send credentials to the wrong domain.

[ORAS 1.3.4](https://github.com/oras-project/oras/releases/tag/v1.3.4) fixes three credential-scoping issues: mTLS client certificates supplied via `--cert-file` were presented to any HTTPS peer including cross-origin redirect and bearer-realm targets, custom `--header` values were forwarded to hosts other than the configured registry, and `--debug` traces logged pre-signed URL parameters, cookies, proxy authorisation and token response bodies.

## Articles

[Rumour is the exploit](https://anil.recoil.org/notes/rumour-is-the-exploit) (Anil Madhavapeddy): after opening a public PR fixing a path traversal in OCaml's cohttp, Anil's server logs showed probes for the exact pattern within minutes, and an agent given only a rough description of the bug produced a working exploit in under a minute. He argues that once the existence of a fix is public an agent can rediscover the bug independently, so the coordinated-disclosure window that embargoes are meant to protect no longer exists for open source maintainers.

## Papers

[Evaluating Inference-Time Defenses Against Package Hallucination in LLM-Generated Code](https://arxiv.org/abs/2608.22652) (arXiv) shows that prior measurements overstate hallucinated-package rates by counting standard-library modules as hallucinations (by 9.4 percentage points for Python) and evaluates seven decoding-time strategies for reducing them.

[The Rising Cost of Trust: Practitioners' Trust Signals, Controls, and Responses in the Software Supply Chain](https://arxiv.org/abs/2608.20675) (arXiv) is a semi-structured interview study of 38 industry and open source practitioners on which signals they use when deciding to depend on a package and what controls they apply.

## Elsewhere

The Rust project [announced](https://blog.rust-lang.org/2026/08/26/announcing-our-first-maintainers-in-residence/) its first Maintainers in Residence, funding five contributors (including rustup maintainer rami3l) full-time and two more via grants for at least twelve months from a Rust Foundation maintainers fund backed by Google, AWS and OpenAI.

[Fettle and the CVE problem](https://opensourcesecurity.io/2026/2026-08-paul-fettle-cve/) (Josh Bressers, Open Source Security): an interview with Paul Asadoorian on Fettle, a tool for checking a Linux system's outdated packages, pending firmware updates and binary hardening flags, and on his InfraTrust Pulse report which tracks vendor advisories rather than raw CVE counts.

[Additional Sustainability Topics from the CHAOSS Practitioner Guides](https://fastwonderblog.com/2026/08/25/part-2-additional-sustainability-topics-from-the-chaoss-practitioner-guides/) (Dawn Foster) covers the Security, Diverse Leadership and Sunsetting guides; the Security guide recommends Libyears and release frequency as dependency-currency metrics.

## git-pkgs

I tagged 6 repos this week:

- [archives v0.6.0](https://github.com/git-pkgs/archives/releases/tag/v0.6.0)
- [artifacts v0.2.0](https://github.com/git-pkgs/artifacts/releases/tag/v0.2.0)
- [brief v0.12.1](https://github.com/git-pkgs/brief/releases/tag/v0.12.1)
- [clone v0.7.1](https://github.com/git-pkgs/clone/releases/tag/v0.7.1)
- [purl v0.1.19](https://github.com/git-pkgs/purl/releases/tag/v0.1.19)
- [sbom v0.1.6](https://github.com/git-pkgs/sbom/releases/tag/v0.1.6)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
