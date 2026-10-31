---
layout: post
title: "This Week in Package Management: 31 October 2026"
date: 2026-10-31 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
  - twipm
---

This week's package management news, gathered from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml), my posts and boosts on [Mastodon](https://mastodon.social/@andrewnez), and anything people sent me.

## Security

The Go blog's [eMudhra post-incident writeup](https://go.dev/blog/emudhra-incident) covers Go's first URGENT-track security release: Mozilla added eight eMudhra intermediates to OneCRL on 17 October, the Go security team was alerted on 19 October, and Go 1.27.3 and 1.26.10 shipped under seven and a half hours later with a patch that rejects any chain through those intermediates. The post also says Go plans to add revocation checking on Linux. A [test page](https://emudhra.we-have-a-problem.com/apple.html) shows the git, curl and python3 that Apple ships with macOS still trusted the eMudhra intermediates on 28 October, and macOS 27.2 undid the workaround users had applied by hand.

[sbt 1.13.1](https://github.com/sbt/sbt/releases/tag/v1.13.1) and 2.0.12 fix a zip slip in `IO.unzip` and its variants ([GHSA-p8jf-532w-4p65](https://github.com/sbt/sbt/security/advisories/GHSA-p8jf-532w-4p65)) that an earlier fix missed. [pipx 1.18.7](https://github.com/pypa/pipx/releases/tag/1.18.7) now requires pip 26.2.2 or later in its shared libraries and replaces an older shared pip on the next pipx command instead of waiting for the 30-day refresh.

## Releases

[Composer 2.11](https://blog.packagist.com/composer-2-11-release/) adds a cooldown dependency policy that withholds newly published versions for a configured period during `update` and `require`, with a `--no-cooldown` flag for installing a security fix straight away. It also removes the source fallback deprecated in 2.10 and lets custom policies block during `composer install`. [2.11.1](https://github.com/composer/composer/releases/tag/2.11.1) fixes GitLab CI job tokens against GitLab's Composer registry.

[pnpm 12.16](https://pnpm.io/blog/releases/12.16.0) adds a global `--env-file` flag and fixes two security issues, one in zstd decompression and one in signing. [12.17](https://pnpm.io/blog/releases/12.17.0) adds `pnpm peers check --global` and dependency-group selectors and wildcards in `overrides`, and `pnpm outdated` and `pnpm update` now cover runtime and package manager versions plus Cargo and Python dependencies. [11.28.9](https://pnpm.io/blog/releases/11.28.9) fixes a crash on registry responses with too many content encodings ([GHSA-xjj6-f33q-929c](https://github.com/advisories/GHSA-xjj6-f33q-929c)) and sizes the install worker pool from the container's CPU quota.

[Homebrew 7.0.11](https://github.com/Homebrew/brew/releases/tag/7.0.11) verifies formula patch downloads from the API and requires verifiable sources for official formulae.

[mise 2026.10.21 to 2026.10.25](https://github.com/jdx/mise/releases/tag/v2026.10.25) adds `mise bootstrap --config-dir` so mise's global config can be kept in a dotfiles checkout, deploys Stow-style packages without a per-package table, and lets `mise bootstrap packages prune --force` remove casks it cannot prove are unchanged.

[Hatch 1.18.2](https://github.com/pypa/hatch/releases/tag/hatch-v1.18.2) and [Hatchling 1.33.0](https://github.com/pypa/hatch/releases/tag/hatchling-v1.33.0) support Python 3.15. Hatch's managed 3.15 distributions are now the final 3.15.0 release, and the default test matrix includes 3.15 and the free-threaded `3.15t`.

[ORAS 1.3.6](https://github.com/oras-project/oras/releases/tag/v1.3.6) narrows the bearer-realm denylist that 1.3.5 introduced. 1.3.5 rejected realms on any private address, which broke self-hosted split-host registries such as GitLab. The default now blocks only loopback, link-local, unspecified and cloud metadata addresses.

[Harbor 2.16.0-rc1](https://github.com/goharbor/harbor/releases/tag/v2.16.0-rc1) replaces Redis with Valkey as the cache backend and builds for amd64 and arm64. It also proxies the referrers API to the upstream registry with paging and local merge.

[Conan 2.34.0](https://github.com/conan-io/conan/releases/tag/2.34.0) makes a third fewer local cache database calls on installs from cache, sends original URLs to backup source remotes in an `X-Conan-Origin-Urls` header, and adds a `command_alias.conf` file for command shortcuts.

[Gradle 9.9.0 RC1](https://github.com/gradle/gradle/releases/tag/v9.9.0-RC1) keeps wrapper settings when upgrading the wrapper, filters non-method JUnit Platform tests, and compiles Kotlin DSL scripts faster.

[Debcraft 1.0](https://optimizedbyotto.com/post/debcraft-1-0-released/) (Otto Kekäläinen) builds Debian packages in a Podman or Docker container made from the suite in `debian/changelog` and the build dependencies in `debian/control`. It diffs the artifacts between two builds and automates importing new upstream versions.

[Renovate 44.189.0](https://github.com/renovatebot/renovate/releases/tag/44.189.0) applies vulnerability alerts to transitive dependencies, opening security updates that change only the lockfile. [44.194.0](https://github.com/renovatebot/renovate/releases/tag/44.194.0) adds a manager for [Paket](https://fsprojects.github.io/Paket/), the .NET dependency manager. [44.184.0](https://github.com/renovatebot/renovate/releases/tag/44.184.0) reports `gh actions-lock` findings when the command fails and re-pins only the updated refs in `actions.lock`.

Also out:

- [RubyGems 4.1.0.beta3](https://blog.rubygems.org/2026/10/28/4.1.0.beta3-released.html)
- [uv 0.13.6](https://github.com/astral-sh/uv/releases/tag/0.13.6)
- [setup-uv 10.3.3](https://github.com/astral-sh/setup-uv/releases/tag/v10.3.3)
- [PDM 2.29.5](https://github.com/pdm-project/pdm/releases/tag/2.29.5)
- [sbt 2.1.0-RC2](https://github.com/sbt/sbt/releases/tag/v2.1.0-RC2)
- [APT 3.3.5](https://salsa.debian.org/apt-team/apt/-/tags/3.3.5)
- [Chocolatey 2.7.5](https://github.com/chocolatey/choco/releases/tag/2.7.5) and [1.4.8](https://github.com/chocolatey/choco/releases/tag/1.4.8)
- [PSResourceGet 1.3.0-rc2](https://github.com/PowerShell/PSResourceGet/releases/tag/v1.3.0-rc2)
- [vcpkg tool 2026-10-29](https://github.com/microsoft/vcpkg-tool/releases/tag/2026-10-29)
- [vlt 1.6.1](https://github.com/vltpkg/vltpkg/releases/tag/v1.6.1)
- [Verdaccio 7.0.2](https://github.com/verdaccio/verdaccio/releases/tag/v7.0.2)
- [EasyBuild 5.4.2](https://docs.easybuild.io/release-notes/)
- [Podman 6.2.0-rc1](https://github.com/podman-container-tools/podman/releases/tag/v6.2.0-rc1)
- [Terraform 1.17.1](https://github.com/hashicorp/terraform/releases/tag/v1.17.1)
- [OpenTofu 1.13.5](https://github.com/opentofu/opentofu/releases/tag/v1.13.5)
- [Dependabot Core 0.402.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.402.0)

## Articles

[tar-codec](https://astral.sh/blog/tar-codec) (William Woodruff, Astral) is a new Rust tar library and uv's default tar reader as of 0.13. It is roughly twice as fast as the previous reader and reduces the risk of parser differentials: it refuses archives whose headers mix tar families, allows at most one GNU long-name and one long-link record per member, and refuses pax tombstones. `UV_LEGACY_TAR_BACKEND=1` restores the old reader.

[A consistent(-ish) npm dependency graph](https://vlt.io/blog/consistent-ish-graph) (Evert Pot, vlt) finds that 22% of new npm versions in a 24-hour window arrived with at least one dependency still missing from the registry. vlt's npm replication now holds a publish until its transitive dependencies are also available, and releases anything still held after an hour.

[PyPI now limits versions to 128 characters](https://blog.pypi.org/posts/2026-10-23-version-length-limit/). Two of the roughly 9.9 million releases on PyPI have a version that long, half have five characters or fewer, and 99% have twenty or fewer. Projects owned by a PyPI organisation now get [higher default limits](https://blog.pypi.org/posts/2026-10-26-higher-limits-for-organization-projects/): 200 MB per file instead of 100 MB, 20 GB per project instead of 10 GB, and ten new projects per day.

[How to fund Rust contributors](https://blog.rust-lang.org/2026/10/26/how-to-fund-rust-contributors/) (Jakub Beránek, Rust Blog) sets out three routes: the Rust Foundation Maintainers Fund or RustNL Maintainers Team for general maintenance, fundable Rust Project Goals for specific features, and GitHub Sponsors for individual contributors.

[Ruby Central's OSS Changelog](https://blog.rubygems.org/2026/10/28/ruby-centrals-oss-changelog-october-2026.html) is back after a long gap. RubyGems.org now validates gem pushes against a schema built from the metadata of all 180,000+ published gems, and it revoked every legacy API key after a report that its CDN could cache that endpoint's responses and serve them to the wrong user. The Gem Security team has scanned about 317 of 619 heavily downloaded gems with AI models. Reviewers rejected 120 of 134 findings, and one that survived was a critical password check bug in [rubyntlm](https://rubygems.org/gems/rubyntlm), fixed in 0.6.6.

[Thirteen backlogs in a trenchcoat](https://www.jvt.me/posts/2026/10/30/renovate-buckets/) (Jamie Tanna) sorts Renovate's open backlog of 1,688 ideas, 1,005 issues and 465 human-authored PRs into 13 buckets of work. Renovate's own bot opened 59% of the project's pull requests in 2025.

## Papers

[The Policies of Programming Language Ecosystems](https://arxiv.org/abs/2610.34187) (Jukka Ruohonen et al., arXiv) codes the published policies of eight package registries against 38 categories. All eight cover malware, intellectual property and content removal, while treatment of package size limits, metric manipulation, typo-squatting and binary uploads varies.

[Supply Chain Insecurity: Exposing Vulnerabilities in iOS Dependency Management Systems](https://arxiv.org/abs/2601.20638) (David Schmidt et al., arXiv) finds that iOS apps expose internal CocoaPods package names, which attackers can then register to run code on developer machines and build servers. Across 9,212 apps, hijacking a single CocoaPod through an abandoned domain could have compromised 63 of them.

## Elsewhere

The call for participation for the [Package Management devroom at FOSDEM 2027](https://stewardshiplab.org/ideas/cfp-package-management-devroom-at-fosdem-27/) is open until 1 December. I'm co-organising with Vlad Miricioiu, Wolf Vollprecht and Travis Hathaway. The [Ruby devroom](https://lists.fosdem.org/hyperkitty/list/fosdem@lists.fosdem.org/thread/AEQLZMEQVYQDLN52AUEDHGYJ3EO4EZ3N/) is also back for the first time in several years.

[EasyBuild has joined the High Performance Software Foundation](https://blog.easybuild.io/2026/10/30/easybuild-hpsf/) at the Core stage, the highest of HPSF's three project stages.

Michał Górny's [The next circle of security hell](https://blogs.gentoo.org/mgorny/2026/10/27/the-next-circle-of-security-hell/) is a follow-up to his 2021 "modern packager's security nightmare" post, on vulnerability report volume and projects that bundle security fixes with feature and API changes.

Josh Bressers [wrote up](https://opensourcesecurity.io/2026/10-embargo/) curl's new policy of handling low and medium severity reports in public, covered here last week, and argues other projects should adopt it.

## git-pkgs

I tagged 6 repos this week:

- [purl2swhid v0.1.0](https://github.com/git-pkgs/purl2swhid/releases/tag/v0.1.0) (new), which turns a Package URL into a Software Heritage identifier and can request archival through Save Code Now
- [skills v0.2.0](https://github.com/git-pkgs/skills/releases/tag/v0.2.0) (new), a Go library for finding and parsing [Agent Skills](https://agentskills.io/specification) in checkouts and package archives
- [typosquatting v0.1.0](https://github.com/git-pkgs/typosquatting/releases/tag/v0.1.0) (new), a Go library that generates package-name variants and checks names against a supplied corpus for PyPI, npm, RubyGems, Cargo, Go and GitHub Actions
- [enrichment v0.7.5](https://github.com/git-pkgs/enrichment/releases/tag/v0.7.5)
- [purl v0.2.1](https://github.com/git-pkgs/purl/releases/tag/v0.2.1)
- [registries v0.13.0](https://github.com/git-pkgs/registries/releases/tag/v0.13.0)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
