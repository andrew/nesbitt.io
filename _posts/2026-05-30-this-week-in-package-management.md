---
layout: post
title: "This Week in Package Management: 30 May 2026"
date: 2026-05-30 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

## Security

npm [invalidated every granular access token with write access that bypassed 2FA](https://github.com/orgs/community/discussions/196340), following another Shai-Hulud-pattern attack. CI pipelines that publish with a granular token need a new one.

[npm 11.16.0](https://github.com/npm/cli/releases/tag/v11.16.0) ships phase one of the [`allowScripts` install-script policy](https://github.com/npm/cli/pull/9360): an opt-in allowlist in `package.json` that names which dependencies may run lifecycle scripts, with everything else silenced.

pnpm hardened lockfile integrity on both maintained lines. [10.34.0](https://github.com/pnpm/pnpm/releases/tag/v10.34.0) makes a tarball-integrity mismatch a hard failure instead of quietly re-resolving and overwriting the locked hash, and [10.34.1](https://github.com/pnpm/pnpm/releases/tag/v10.34.1) rejects lockfile entries whose `resolution:` block has no `integrity` field at all, closing a path where a PR that strips the field let unverified bytes through.

[Cargo 1.96](https://doc.rust-lang.org/nightly/cargo/CHANGELOG.html#cargo-196-2026-05-28) ships fixes for two third-party-registry vulnerabilities: [CVE-2026-5223](https://blog.rust-lang.org/2026/05/25/cve-2026-5223/), symlink handling when extracting crate tarballs, and [CVE-2026-5222](https://blog.rust-lang.org/2026/05/25/cve-2026-5222/), authentication against normalised registry URLs. crates.io users are unaffected by either. Both are on the [package manager CWE list](/2026/05/04/package-manager-cwes.html) from earlier this month.

[Composer 2.10](https://blog.packagist.com/composer-2-10-release/) shipped with native malware filtering on by default for Packagist installs, fed by an Aikido detection feed. The new `config.policy` block consolidates how malware, advisories, and abandoned packages are handled, and source-fallback on dist failure is now off by default. Packagist's accompanying [supply-chain update](https://blog.packagist.com/an-update-on-composer-packagist-supply-chain-security/) covers version immutability and a public transparency log. I wrote up the [policy framework](/2026/05/29/composer-dependency-policies.html) yesterday.

[Atomdrift](https://atomdrift.org/) is a new Apache-2.0 malware classifier for packages and binaries that runs its models locally with no network calls, with the components split out as separate Rust and Go tools on [Codeberg](https://codeberg.org/atomdrift).

## Releases

[pnpm 11.3.0](https://github.com/pnpm/pnpm/releases/tag/v11.3.0) adds `pnpm stage` with `publish`, `list`, `view`, `approve`, `reject`, and `download` subcommands for npm's new staged publishing queue, so pnpm users can drive the 2FA-gated promote flow without switching client.

[dependabot-core 0.378.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.378.0) adds blocked-versions support to the updater job and dry-run script, letting a config pin specific versions out of consideration regardless of what the registry advertises.

[pixi 0.69.0](https://github.com/prefix-dev/pixi/releases/tag/v0.69.0) gets `pixi auth login prefix.dev` for browser-based OAuth in the style of `gh auth login`, plus `--variant`, `--build-number`, and `--package-format` flags on `pixi publish`.

[mise 2026.5.16](https://github.com/jdx/mise/releases/tag/v2026.5.16) routes GitHub release metadata and attestation lookups through a shared `mise-versions` host before falling back to `api.github.com`, cutting anonymous API usage in CI, and adds an `allow_builds` tool option for npm-backend installs.

Also out: [Deno 2.8.1](https://github.com/denoland/deno/releases/tag/v2.8.1), [uv 0.11.17](https://github.com/astral-sh/uv/releases/tag/0.11.17), [Conan 2.29.0](https://github.com/conan-io/conan/releases/tag/2.29.0), [Homebrew 5.1.14](https://github.com/Homebrew/brew/releases/tag/5.1.14), [conda 26.5.1](https://github.com/conda/conda/releases/tag/26.5.1), [Gradle 9.6.0-RC1](https://github.com/gradle/gradle/releases/tag/v9.6.0-RC1), [vcpkg 2026-05-27](https://github.com/microsoft/vcpkg-tool/releases/tag/2026-05-27), [Verdaccio 6.7.2](https://github.com/verdaccio/verdaccio/releases/tag/v6.7.2), [snapd 2.75.2.2](https://github.com/canonical/snapd/releases/tag/2.75.2.2).

## Articles

Daniel Stenberg on [the pressure on the curl project right now](https://daniel.haxx.se/blog/2026/05/26/the-pressure/), and his [State of curl 2026](https://youtu.be/zt4qMZN2xDU) talk.

Predrag Gruevski's [cargo-semver-checks 2025 year in review](https://predr.ag/blog/cargo-semver-checks-2025-year-in-review/) lays out the 2026 plan: type-checking lints, fixing the remaining false-positive classes, and getting the Rust standard library itself running under it.

Ding and Stevens have a preprint, [Stdlib or Third-Party?](https://arxiv.org/abs/2605.21405), measuring how LLM-generated zero-dependency reimplementations of popular Python libraries compare to the originals on correctness and performance.

Talk Python [episode 544](https://talkpython.fm/episodes/show/544/wheel-next-packaging-peps) covers the wheel-next packaging PEPs, and the guests point at [pypackaging-native](https://pypackaging-native.github.io/) as the reference for where current Python packaging falls short for compiled extensions.

## Elsewhere

I made [heap](/heap), a first-person walk through your `node_modules` folder.

Garnix, the hosted Nix CI service, is [shutting down on 15 July](https://discourse.nixos.org/t/garnix-is-shutting-down-not-oc/77895) as the team joins Shopify, and the [codebase is now open source](https://github.com/garnix-io/garnix-ci).

snix grew a [`snix-store import-nar` subcommand](https://snix.dev/docs/components/store/snix-flavoured-nix-binary-cache-protocol/) for feeding already-downloaded NARs into snix-castore, which the authors used to compress 115 GiB of cached NARs for an event with slow connectivity.

[mvnpm](https://mvnpm.org/) is a Maven repository that repackages npm packages as Maven and Gradle dependencies on demand.

## git-pkgs

I tagged [git-pkgs v0.16.2](https://github.com/git-pkgs/git-pkgs/releases/tag/v0.16.2), [brief v0.8.1](https://github.com/git-pkgs/brief/releases/tag/v0.8.1), and [managers v0.9.0](https://github.com/git-pkgs/managers/releases/tag/v0.9.0).

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
