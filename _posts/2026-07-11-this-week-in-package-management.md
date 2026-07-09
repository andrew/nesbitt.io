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

[Rust 1.97.0](https://blog.rust-lang.org/2026/07/09/Rust-1.97.0/) stabilises `resolver.lockfile-path` in Cargo config for pointing at a lockfile outside a read-only source directory, and `build.warnings` for turning warnings into errors without `-Dwarnings` invalidating the build cache. `cargo clean` now refuses a `--target-dir` that doesn't look like a Cargo target directory.

[winget 1.29](https://github.com/microsoft/winget-cli/releases/tag/v1.29.280) adds an experimental source priority feature: sources get a numeric priority via `winget source add` or `source edit`, and higher-priority sources sort first when a search matches packages in more than one.

[Spack 1.2.1](https://github.com/spack/spack/releases/tag/v1.2.1) fixes a hang in the new installer when running under `forkserver` and restores solver performance on macOS.

[CocoaPods 1.17.0](https://github.com/CocoaPods/CocoaPods/releases/tag/1.17.0) adds `--no-lint` to `pod repo push` to skip the lint phase when publishing, and updates `ruby-macho` so mergeable libraries are detected.

[mise 2026.7.4](https://github.com/jdx/mise/releases/tag/v2026.7.4) graduates `mise bootstrap` and `mise dotfiles` out of experimental mode, so system packages, repos, user services and shell activation now work without `MISE_EXPERIMENTAL`.

Also out: [Homebrew 6.0.9](https://github.com/Homebrew/brew/releases/tag/6.0.9), [asdf 0.20.0](https://github.com/asdf-vm/asdf/releases/tag/v0.20.0), [Hatch 1.17.1](https://github.com/pypa/hatch/releases/tag/hatch-v1.17.1), [Hatchling 1.31.0](https://github.com/pypa/hatch/releases/tag/hatchling-v1.31.0), [pixi 0.72.2](https://github.com/prefix-dev/pixi/releases/tag/v0.72.2), [Yarn 4.17.1](https://github.com/yarnpkg/berry/releases/tag/%40yarnpkg%2Fcli%2F4.17.1), [Deno 2.9.2](https://github.com/denoland/deno/releases/tag/v2.9.2), [Podman 6.0.1](https://github.com/podman-container-tools/podman/releases/tag/v6.0.1), [npm 12.0.0-pre.3](https://github.com/npm/cli/releases/tag/v12.0.0-pre.3), [Nix 2.34.8](https://github.com/NixOS/nix/releases/tag/2.34.8), [Gradle 9.7.0-M2](https://github.com/gradle/gradle/releases/tag/v9.7.0-M2), [Dependabot Core 0.385.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.385.0), [Go 1.27rc2](https://go.dev/dl/#go1.27rc2).

## Security

[opam 2.5.2](https://github.com/ocaml/opam/releases/tag/2.5.2) fixes CVE-2026-57825: a package could install files anywhere on the system by including a symlink to an external directory, bypassing the user prompt that direct external paths trigger.

## Articles

[Immutable Versions on Packagist](https://blog.packagist.com/immutable-versions-on-packagist/) (Packagist Blog) is the next post in the Composer supply chain series: once a stable version is published its git reference is now fixed, retag attempts are blocked with an email to the maintainer, and deletions become soft with a public transparency log.

[You shouldn't trust Trusted Publishing](https://blog.yossarian.net/2026/07/07/You-shouldnt-trust-trusted-publishing) (William Woodruff) argues Trusted Publishing is an authentication mechanism between CI and a registry, not a signal that a package is safe, and that PyPI keeps it out of the badge UI for exactly that reason.

## Elsewhere

The [EuroPython 2026 Packaging Summit](https://programme.europython.eu/europython-2026/talk/SBREFN/) schedule is up for 13 July in Kraków, with [public notes](https://hackmd.io/@jezdez/europython2026-packaging-summit) and late topic proposals still open.

[Open Source Security: Rust Foundation Maintainers Fund](https://opensourcesecurity.io/2026/2026-07-rfmf-lori-niko/) (Josh Bressers) is a podcast conversation with Lori Lorusso and Niko Matsakis on how the fund is structured and where the money goes.

[Beyond Compliance: A Large Scale Study on the Completeness and Consistency of the GitHub SBOMs](https://arxiv.org/abs/2607.04614) (Bhuiyan et al., arXiv) measures GitHub's auto-generated SBOMs across ecosystems and finds version and licence coverage varies enough by language that reliability depends on which ecosystem you're in.

## git-pkgs

I tagged [brief v0.9.3](https://github.com/git-pkgs/brief/releases/tag/v0.9.3), [enrichment v0.6.0](https://github.com/git-pkgs/enrichment/releases/tag/v0.6.0), [purl v0.1.14](https://github.com/git-pkgs/purl/releases/tag/v0.1.14) and [sbom v0.1.3](https://github.com/git-pkgs/sbom/releases/tag/v0.1.3).

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
