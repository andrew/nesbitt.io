---
layout: post
title: "This Week in Package Management: 1 August 2026"
date: 2026-08-01 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week eleven of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[mise 2026.7.14](https://github.com/jdx/mise/releases/tag/v2026.7.14) adds `additional_asset_patterns` to the GitHub/GitLab/Forgejo backend so a single install can overlay multiple release archives from one tag, each locked and verified independently. The default shell-argument settings (`unix_default_file_shell_args` and friends) are now global-only, closing a hole where an untrusted repository's local config could influence how commands from trusted sources were executed before trust evaluation ran.

[Verdaccio 6.9.0](https://github.com/verdaccio/verdaccio/releases/tag/v6.9.0) requires Node.js 22 as the minimum runtime and ships a dual CJS+ESM build with an `exports` field, so `import { runServer } from 'verdaccio'` resolves a real ES module. The bundled `@verdaccio/config` moves to js-yaml 4.3.0, resolving [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m).

[setup-uv v9.0.0](https://github.com/astral-sh/setup-uv/releases/tag/v9.0.0) flips the `prune-cache` default to `false` to reduce load on PyPI infrastructure. The major bump reflects that workflows may see higher GitHub Actions cache usage as a result; the [reasoning is written up in #967](https://github.com/astral-sh/setup-uv/pull/967).

[Renovate 43.282.0](https://github.com/renovatebot/renovate/releases/tag/43.282.0) has the mise manager run `mise lock` in the `MISE_SAFE=1` mode [added last week](/2026/07/25/this-week-in-package-management), so lockfile updates against untrusted branches no longer need `allowedUnsafeExecutions`. [43.283.0](https://github.com/renovatebot/renovate/releases/tag/43.283.0) adds a `commitTrailers` option.

Also out: [pipx 1.16.3](https://github.com/pypa/pipx/releases/tag/1.16.3), [sbt 2.0.4](https://github.com/sbt/sbt/releases/tag/v2.0.4).

## Elsewhere

The [EuroPython 2026 Packaging Summit notes](https://hackmd.io/DZj3uo6eT_qyddBP0PZlDw?view) are up, following on from [last week's](/2026/07/25/this-week-in-package-management) mention of the summit itself. Sessions covered wheel-variant provider trust (PEPs 817 and 825), whether PyPI should distribute application lockfiles separately from libraries, external build-dependency metadata via PURL (PEPs 725 and 804), and the Packaging Council election timeline.

Most WASI phase 2 proposals now have OCI packages published and are indexed on [wasm.directory](https://wasm.directory/wasi), a meta-registry for WebAssembly components that is intended for eventual donation to the Bytecode Alliance.

## git-pkgs

I tagged 13 repos this week:

- [git-pkgs v0.18.2](https://github.com/git-pkgs/git-pkgs/releases/tag/v0.18.2)
- [archives v0.3.1](https://github.com/git-pkgs/archives/releases/tag/v0.3.1)
- [brief v0.9.4](https://github.com/git-pkgs/brief/releases/tag/v0.9.4)
- [capcheck v0.1.2](https://github.com/git-pkgs/capcheck/releases/tag/v0.1.2)
- [distill v0.1.1](https://github.com/git-pkgs/distill/releases/tag/v0.1.1)
- [enrichment v0.6.4](https://github.com/git-pkgs/enrichment/releases/tag/v0.6.4)
- [forge v0.7.0](https://github.com/git-pkgs/forge/releases/tag/v0.7.0)
- [manifests v0.6.1](https://github.com/git-pkgs/manifests/releases/tag/v0.6.1)
- [outline v0.1.7](https://github.com/git-pkgs/outline/releases/tag/v0.1.7)
- [pin v0.1.1](https://github.com/git-pkgs/pin/releases/tag/v0.1.1)
- [proxy v0.6.0](https://github.com/git-pkgs/proxy/releases/tag/v0.6.0)
- [registries v0.6.4](https://github.com/git-pkgs/registries/releases/tag/v0.6.4)
- [sigstore v0.1.2](https://github.com/git-pkgs/sigstore/releases/tag/v0.1.2)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
