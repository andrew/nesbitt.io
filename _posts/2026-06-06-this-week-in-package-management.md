---
layout: post
title: "This Week in Package Management: 6 June 2026"
date: 2026-06-06 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Third week of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez). Five new project blog feeds and the NixOS announcements feed landed in the OPML this week.

## Security

[Bundler 4.0.13](https://github.com/ruby/rubygems/releases/tag/bundler-v4.0.13) ships [Cooldown](https://blog.rubygems.org/2026/06/03/cooldown-let-new-gems-be-vetted.html), a configurable time window that holds back resolution to gem versions younger than N days, so a freshly published malicious release ages past the window before a `bundle install` will pick it up. The companion [RubyGems 4.0.13](https://github.com/ruby/rubygems/releases/tag/v4.0.13) release blocks gem extraction from escaping the destination directory via pre-existing symlinks.

The Packagist supply-chain series continues. [Closing Composer's Download Fallback Paths](https://blog.packagist.com/closing-composers-download-fallback-paths-in-private-packagist/) covers how the dist-to-source fallback, originally designed for resilience, can be used to fetch a different artifact than the one Composer expected. [Blocking Malware Downloads for Every Composer Version](https://blog.packagist.com/blocking-malware-downloads-for-every-composer-version-in-private-packagist/) describes how Private Packagist enforces malware blocking for installs from Composer versions older than 2.10, before the dependency policy framework existed.

## Releases

[Yarn 4.16.0](https://github.com/yarnpkg/berry/releases/tag/%40yarnpkg%2Fcli%2F4.16.0) adds `yarn npm stage` for npm's staged publishing queue, alongside editor SDK support for oxc's formatter and linter.

[Hatch 1.17.0](https://github.com/pypa/hatch/releases/tag/hatch-v1.17.0) deprecates `hatch fmt` in favour of a new `hatch check` command group with `code`, `fmt`, and `types` subcommands. Type checking is wired up to Pyrefly. The release also adds `hatch env lock` for locking environments and switches the HTTP client from httpx to httpx2.

[NixOS 26.05 "Yarara"](https://nixos.org/blog/announcements/2026/nixos-2605/) is the latest six-monthly release of Nixpkgs and NixOS. The Nixpkgs side added 20,442 new packages and updated 20,641 since 25.11, and dropped 17,532. This is also the final release with `x86_64-darwin` support, since upstream Apple has deprecated the platform.

[Stack 3.11.0.1 RC](https://github.com/commercialhaskell/stack/releases/tag/rc%2Fv3.11.0.1) switches the default 64-bit Windows MSYS environment from MINGW64 to CLANG64, following the MSYS2 project's deprecation of MINGW64 in March.

[Dependabot Core 0.380.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.380.0) adds a lockfile generator for bun via PR [#14882](https://github.com/dependabot/dependabot-core/pull/14882). The same release passes `--config.minimumReleaseAge=0` to pnpm security updates, bypassing any `pnpm-workspace.yaml` cooldown setting so security PRs aren't blocked behind the release-age policy.

Also out: [Cargo 0.97.1](https://github.com/rust-lang/cargo/releases/tag/0.97.1), [uv 0.11.18](https://github.com/astral-sh/uv/releases/tag/0.11.18), [pip 26.1.2](https://github.com/pypa/pip/releases/tag/26.1.2), [Conda 26.5.2](https://github.com/conda/conda/releases/tag/26.5.2), [Mamba 2.7.0](https://github.com/mamba-org/mamba/releases/tag/2.7.0), [pixi 0.70.0](https://github.com/prefix-dev/pixi/releases/tag/v0.70.0), [pnpm 11.5.1](https://github.com/pnpm/pnpm/releases/tag/v11.5.1), [mise 2026.5.17](https://github.com/jdx/mise/releases/tag/v2026.5.17), [Go 1.25.11](https://github.com/golang/go/releases/tag/go1.25.11), [Go 1.26.4](https://github.com/golang/go/releases/tag/go1.26.4), [sbt 2.0.0-RC14](https://github.com/sbt/sbt/releases/tag/v2.0.0-RC14), [cargo-semver-checks 0.48.0](https://github.com/obi1kenobi/cargo-semver-checks/releases/tag/v0.48.0).

## Articles

[Where does the money come from?](https://ddbeck.com/where-does-the-money-come-from/) (Daniel D. Beck) is a catalogue of every channel he knows that gets technical-documentation authors and maintainers paid, from foundation grants and staff tech-writer roles to docs-for-hire arrangements and tip jars.

[How OSPOs can measure the impact of OSS funding](https://fastwonderblog.com/2026/06/02/how-ospos-can-measure-the-impact-of-oss-funding/) (Dawn Foster) is the case OSPOs can make internally when budgets tighten and the funded projects don't translate directly into product revenue.

The [Rust Foundation Maintainers Fund](https://blog.rust-lang.org/2026/06/02/launching-the-rust-foundation-maintainers-fund/) launched this week as a "Maintainer in Residence" programme that pays existing Rust Project maintainers from a donor-funded pool.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
