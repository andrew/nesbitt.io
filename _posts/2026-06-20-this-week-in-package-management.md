---
layout: post
title: "This Week in Package Management: 20 June 2026"
date: 2026-06-20 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week five of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[sbt 2.0.0](https://eed3si9n.com/sbt-2.0.0) moves build definitions and plugins to Scala 3, requires JDK 17, and replaces the caching layer with a Bazel-compatible local/remote cache that the rewritten `compile` and `test` tasks use. The project matrix plugin is now built in and a native-image client cuts startup time. [sbt 1.12.12](https://github.com/sbt/sbt/releases/tag/v1.12.12) shipped alongside it for the 1.x line.

[pnpm 11.7](https://pnpm.io/blog/releases/11.7) adds a `frozenStore` setting that opens the store's SQLite index read-only so `pnpm install` can run against a Nix store, a read-only bind mount or an OCI layer without trying to write WAL sidecar files. The release also adds a `--batch` flag to publish a whole workspace in one request, per-scope auth tokens, and an option to delegate resolving installs to pacquet.

[Yarn 4.17.0](https://github.com/yarnpkg/berry/releases/tag/%40yarnpkg%2Fcli%2F4.17.0) adds package map generation and lets `npmMinimalAgeGate` be set per npm scope rather than globally.

[Dependabot Core 0.382.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.382.0) supports a `scope` property on `npm_registry` credentials and fixes a leak where npm registry credentials were sent to sibling paths on the same host.

[mise 2026.6.11](https://github.com/jdx/mise/releases/tag/v2026.6.11) adds Alpine `apk` as a bootstrap package manager alongside apt, dnf, pacman and brew, and stops the default Windows `.exe` shims from leaking into WSL sessions.

[Stack 3.11.1](https://github.com/commercialhaskell/stack/releases/tag/v3.11.1) changes the default MSYS2 environment on 64-bit Windows from MINGW64 to CLANG64, following the MSYS2 project's deprecation of the former.

[conda 26.5.3](https://github.com/conda/conda/releases/tag/26.5.3) stops caching a not-found response for sharded repodata, which broke shards-only channels on subsequent runs.

[Athens 0.18.0](https://github.com/gomods/athens/releases/tag/v0.18.0), the Go module proxy, adds Redis cluster-mode support for its singleflight stash.

[pipx 1.14.1](https://github.com/pypa/pipx/releases/tag/1.14.1) restores a package after an interrupted reinstall and fixes `inject --force` reinstall behaviour.

Also out: [Homebrew 6.0.2](https://github.com/Homebrew/brew/releases/tag/6.0.2), [Helm 4.2.2](https://github.com/helm/helm/releases/tag/v4.2.2), [Gradle 9.7.0-M1](https://github.com/gradle/gradle/releases/tag/v9.7.0-M1), [Harbor 2.15.2-rc1](https://github.com/goharbor/harbor/releases/tag/v2.15.2-rc1), [Renovate 43.229.3](https://github.com/renovatebot/renovate/releases/tag/43.229.3).

## Articles

[rv: plan and progress](https://andre.arko.net/2026/06/13/rv-plan-and-progress/) (André Arko) reports a year in on the Rust-based Ruby toolchain. It now installs Rubies, builds with YJIT, manages gems with `clean-install` and `rvx`, and runs on Windows. The next step is full dependency resolution, evaluating a Gemfile and writing a lockfile at uv-like speed.

[Package managers need global hooks](https://captnemo.in/blog/2026/06/17/package-managers-need-hooks/) (Nemo) argues every package manager should expose pre-clone and pre-build hooks so users can wire dependency cooldowns and threat-feed scanning into the install path locally, without a proxy registry or a shell wrapper.

[Introducing pkgcli](https://blog.tenstral.net/2026/06/introducing-pkgcli-a-nicer-command-line-interface-for-packagekit.html) (Matthias Klumpp) is a new command-line front end for PackageKit to replace `pkcon`, with friendlier command names, coloured output and a JSON mode for scripting.

[Why stdx is not on crates.io](https://kerkour.com/stdx-cratesio) (Sylvain Kerkour) distributes his 64-crate Rust extended standard library by git only, citing the lack of namespaces and the attack surface a central registry adds: publish tokens, source that need not match the repository, typosquatting, dependency confusion. He argues Rust should follow Go's model of pointing the package manager at the source repository and backing it with a checksum database and an optional caching proxy.

[What is npm doing to protect the JavaScript ecosystem, and is it enough?](https://www.thestack.technology/npm-protect-javascript-ecosystem-supply-chain-attacks/) (Mary Branscombe, The Stack) surveys the registry-side changes npm has shipped against supply-chain attacks and what that leaves for developers to do themselves.

[curl summer of bliss](https://daniel.haxx.se/blog/2026/06/15/curl-summer-of-bliss/) (Daniel Stenberg) announces that the curl project will not accept or handle vulnerability reports during July 2026, giving the maintainers a month off the disclosure treadmill. [libexpat is doing the same](https://github.com/libexpat/libexpat/issues/1277) through 1 August.

[Composer & Packagist Supply Chain Security in 2026](https://naderman.de/slippy/slides/2026-06-09-PHPVerse-Composer-and-Packagist-Supply-Chain-Security-in-2026.pdf) (Nils Adermann) are the slides from the PHPVerse talk covering the same series of changes the Packagist blog has been writing up over the last few weeks.

## Elsewhere

[Software Dark Matter: Gazing at Uncharted Files to Navigate SBOM Integrations](https://arxiv.org/abs/2606.13966) (Reddypalle et al., arXiv) names the gap between what an SBOM lists from package manager metadata and the security-relevant files that actually ship in an artifact but never appear in a manifest.

The [ClickPy May 2026 report](https://clickpy.clickhouse.com/report/may-2026.html) puts PyPI at 163.8 billion downloads for the month, up about 20% since March.

[gem-guardian](https://github.com/kanutocd/gem-guardian) is a RubyGems checksum verifier that has grown lockfile-checksum support, provenance reporting and publisher-provided checksum verification for private registries.

Following last week's AUR takeover, Morten Linderud [points out](https://chaos.social/@Foxboron/116753600698430125) that anyone maintaining ten or more AUR packages they depend on should consider becoming an [official Arch package maintainer](https://wiki.archlinux.org/title/Package_Maintainers) instead.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
