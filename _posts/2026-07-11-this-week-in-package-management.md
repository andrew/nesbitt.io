---
layout: post
title: "This Week in Package Management: 11 July 2026"
date: 2026-07-11 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week eight of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[pnpm 11.10](https://pnpm.io/blog/releases/11.10) adds an `_auth` setting that takes registry credentials as a single URL-keyed structure, so CI can pass them via `pnpm_config__auth` without the shell-quoting problems that broke the per-registry env vars. It also adds `pnpm prefix` and `pnpm issues`, and `pnpm self-update` can now install v12, the Rust port.

[uv 0.11.28](https://github.com/astral-sh/uv/releases/tag/0.11.28) hardens ZIP handling against parser differentials via an updated `astral-async-zip`, so uv may now reject malformed wheels it previously accepted, matching last week's tar work. [0.11.27](https://github.com/astral-sh/uv/releases/tag/0.11.27) preceded it with resolver performance work: SIMD TOML parsing, interned `requires-python` specifiers and cached lock markers.

[Go 1.26.5](https://go.dev/doc/devel/release#go1.26.5) is a security release fixing issues in `crypto/tls` and `os`, alongside bug fixes to the compiler, runtime and `go` command.

[winget 1.29](https://github.com/microsoft/winget-cli/releases/tag/v1.29.280) adds an experimental source priority feature: sources get a numeric priority via `winget source add` or `source edit`, and higher-priority sources sort first when a search matches packages in more than one.

[Spack 1.2.1](https://github.com/spack/spack/releases/tag/v1.2.1) fixes a hang in the new installer when running under `forkserver` and restores solver performance on macOS.

[CocoaPods 1.17.0](https://github.com/CocoaPods/CocoaPods/releases/tag/1.17.0) adds `--no-lint` to `pod repo push` to skip the lint phase when publishing, and updates `ruby-macho` so mergeable libraries are detected.

Also out: [Homebrew 6.0.9](https://github.com/Homebrew/brew/releases/tag/6.0.9), [asdf 0.20.0](https://github.com/asdf-vm/asdf/releases/tag/v0.20.0), [mise 2026.7.2](https://github.com/jdx/mise/releases/tag/v2026.7.2), [Hatch 1.17.1](https://github.com/pypa/hatch/releases/tag/hatch-v1.17.1), [Hatchling 1.31.0](https://github.com/pypa/hatch/releases/tag/hatchling-v1.31.0), [pixi 0.72.1](https://github.com/prefix-dev/pixi/releases/tag/v0.72.1), [Nix 2.34.8](https://github.com/NixOS/nix/releases/tag/2.34.8), [Gradle 9.7.0-M2](https://github.com/gradle/gradle/releases/tag/v9.7.0-M2), [Dependabot Core 0.385.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.385.0), [Go 1.27rc2](https://go.dev/dl/#go1.27rc2).

## Articles

[Immutable Versions on Packagist](https://blog.packagist.com/immutable-versions-on-packagist/) (Packagist Blog) is the next post in the Composer supply chain series: once a stable version is published its git reference is now fixed, retag attempts are blocked with an email to the maintainer, and deletions become soft with a public transparency log.

[You shouldn't trust Trusted Publishing](https://blog.yossarian.net/2026/07/07/You-shouldnt-trust-trusted-publishing) (William Woodruff) argues Trusted Publishing is an authentication mechanism between CI and a registry, not a signal that a package is safe, and that PyPI keeps it out of the badge UI for exactly that reason.

## Elsewhere

The [EuroPython 2026 Packaging Summit](https://programme.europython.eu/europython-2026/talk/SBREFN/) schedule is up for 13 July in Kraków, with [public notes](https://hackmd.io/@jezdez/europython2026-packaging-summit) and late topic proposals still open.

[Open Source Security: Rust Foundation Maintainers Fund](https://opensourcesecurity.io/2026/2026-07-rfmf-lori-niko/) (Josh Bressers) is a podcast conversation with Lori Lorusso and Niko Matsakis on how the fund is structured and where the money goes.

[Beyond Compliance: A Large Scale Study on the Completeness and Consistency of the GitHub SBOMs](https://arxiv.org/abs/2607.04614) (Bhuiyan et al., arXiv) measures GitHub's auto-generated SBOMs across ecosystems and finds version and licence coverage varies enough by language that reliability depends on which ecosystem you're in.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
