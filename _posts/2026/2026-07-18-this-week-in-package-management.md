---
layout: post
title: "This Week in Package Management: 18 July 2026"
date: 2026-07-18 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mr3v7ockb52p"
---

Week nine of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[pnpm 11.13](https://github.com/pnpm/pnpm/releases/tag/v11.13.0) adds `pnpm change`, a native changesets-compatible release planner that handles version bumping, dependent propagation, fixed groups and per-package release lanes. It also adds `pnpm team` for registry organisation and team membership, and a `versioning.epics` config that ties a group of packages to a lead package so their versions stay within a band derived from the lead's major. [11.12](https://github.com/pnpm/pnpm/releases/tag/v11.12.0) preceded it, letting a pnpmfile fetcher return `{ delegate: <resolution> }` so custom fetchers can hand off to the built-in ones portably across pnpm and pacquet.

[Deno 2.9.3](https://github.com/denoland/deno/releases/tag/v2.9.3) adds `deno add --no-save` and `--save-optional`, and `--min-dep-age` as a shorter alias for the minimum-release-age check.

[pixi 0.73.0](https://github.com/prefix-dev/pixi/releases/tag/v0.73.0) lets `{ workspace = true }` work in environment `[dependencies]` tables, so a version shared across features or targets is declared once in `[workspace.dependencies]` without needing the `pixi-build` preview.

[uv 0.11.29](https://github.com/astral-sh/uv/releases/tag/0.11.29) adds JSON output to `uv tree` and prefers local artifacts over URLs when installing from `pylock.toml`.

[Verdaccio 6.8.0](https://github.com/verdaccio/verdaccio/releases/tag/v6.8.0) fires the notification webhook on unpublish and single-version removal as well as publish. Templates get a `{{ publishType }}` variable, and the `{{ publisher }}` object exposes only `name`, `groups` and `real_groups` so the auth token can never reach the notification endpoint.

[zizmor 1.27](https://docs.zizmor.sh/release-notes/#1270) adds experimental support for auditing GitHub's new parallel steps pattern.

[Rust 1.97.1](https://blog.rust-lang.org/2026/07/16/Rust-1.97.1/) is a point release backporting an LLVM fix and disabling the IR change in 1.97.0 that made the miscompilation more likely to trigger.

[Homebrew 6.0.11](https://github.com/Homebrew/brew/releases/tag/6.0.11) merges `brew vulns`, so CVE scanning of installed formulae is now built in; I wrote up [the work behind it](/2026/07/17/plumbing-homebrew-into-the-vulnerability-ecosystem).

Also out: [npm 12.0.1](https://github.com/npm/cli/releases/tag/v12.0.1), [Athens 0.18.1](https://github.com/gomods/athens/releases/tag/v0.18.1), [vcpkg 2026-07-13](https://github.com/microsoft/vcpkg-tool/releases/tag/2026-07-13), [sbt 2.0.2](https://github.com/sbt/sbt/releases/tag/v2.0.2), [Nix 2.35.1](https://github.com/NixOS/nix/releases/tag/2.35.1), [mise 2026.7.10](https://github.com/jdx/mise/releases/tag/v2026.7.10), [pipx 1.16.0](https://github.com/pypa/pipx/releases/tag/1.16.0), [Gradle 9.7.0-RC1](https://github.com/gradle/gradle/releases/tag/v9.7.0-RC1), [Renovate 43.268.4](https://github.com/renovatebot/renovate/releases/tag/43.268.4), [Dependabot Core 0.387.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.387.0).

## Security

[Docker Engine 29.6.2](https://github.com/moby/moby/releases/tag/docker-v29.6.2) fixes three CVEs: [CVE-2026-15793](https://github.com/advisories/GHSA-hw3h-2gp9-cxpv), where a git source checkout from a bundle file could lead to command injection; [CVE-2026-15792](https://github.com/advisories/GHSA-qx3x-mv6r-52p6), where incorrect parameters from a BuildKit frontend could cause a panic; and [CVE-2026-15791](https://github.com/advisories/GHSA-32pv-7hq5-qhwj), where an LLB file operation could be tricked into removing the contents of `/tmp`.

[sbt 1.12.14](https://github.com/sbt/sbt/releases/tag/v1.12.14) backports the fix for [CVE-2026-26032](https://github.com/advisories/GHSA-j482-hm6j-v5jj) in the bundled Apache Ivy `PackagerResolver`.

## Articles

[crates.io: development update](https://blog.rust-lang.org/2026/07/13/crates-io-development-update/) (Tobias Bieniek, Rust Blog) covers six months of work: crate pages now have a Code tab that shows the exact files `cargo` downloads, which can differ from the linked repository; crates.io accounts are being untangled from GitHub logins; and the Svelte frontend migration is complete.

[Composer and Packagist Under Supply-Chain Stress](https://phpunit.expert/articles/composer-and-packagist-under-supply-chain-stress.html) (Sebastian Bergmann) reviews how the PHP ecosystem held up through 2025 and 2026, what it can borrow from other registries, and who owns the infrastructure.

[My First Month as AI Security Engineer in Residence](https://rustfoundation.org/media/my-first-month-as-ai-security-engineer-in-residence-at-the-rust-foundation/) (Jacob Finkelman, Rust Foundation) covers building a prioritised database of crates to scan, running early passes with Scrutineer, and working out when a bug found this way should be embargoed rather than reported openly.

## Papers

[Software Supply Chains are Dead: Use-Case-Oriented Regeneration](https://arxiv.org/abs/2607.13021) (arXiv) argues that supply-chain attacks have raised the cost of external dependencies while generative AI has lowered the cost of local implementation, and evaluates an agent workflow that synthesises only the slice of a dependency an application actually calls.

[Setup Complete, Now You Are Compromised: Weaponizing Setup Instructions Against AI Coding Agents](https://arxiv.org/abs/2607.15143) (Bagmar et al., arXiv) evaluates package-install-time supply-chain attacks delivered through project setup docs against production coding-agent harnesses: editing only a README, requirements file or Makefile redirects the agent to an untrusted registry, a known-vulnerable version, or a wrong-but-plausible package name.

[The Distributed Open-Source Vulnerability Ecosystem](https://arxiv.org/abs/2607.14900) (Mandl et al., arXiv) models vulnerability management as a distributed process and traces where scanners diverge on identical software inventories to specific stages of the ecosystem rather than any one tool or data source.

## Elsewhere

[Forgejo 16.0](https://forgejo.org/2026-07-release-v16-0/) adds per-repository watch options, an Authorized Integrations mechanism for secret-less API access, and review comments that span multiple lines.

[Ruby 4.0.6](https://www.ruby-lang.org/en/news/2026/07/14/ruby-4-0-6-released/) is a routine bugfix release.

[Open Source Security: Project Lightwell](https://opensourcesecurity.io/2026/2026-07-lightwell-mo-duffy/) (Josh Bressers) is a podcast conversation with Máirín Duffy on Red Hat's programme for routing AI-discovered vulnerabilities to upstream projects rather than carrying downstream patches.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
