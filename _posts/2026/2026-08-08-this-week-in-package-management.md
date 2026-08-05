---
layout: post
title: "This Week in Package Management: 8 August 2026"
date: 2026-08-08 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week twelve of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[pnpm 11.20](https://pnpm.io/blog/releases/11.20) fixes a package-substitution risk in projects that use multiple named registries. The lockfile previously keyed packages by `name@version` alone, so when two registries served the same name and version they collapsed onto one entry and whichever resolved first supplied the tarball. Packages from named registries are now recorded with registry-qualified keys such as `foo@work:1.0.0`. The release also hardens `pnpm rebuild` against a malicious lockfile and stops empty proxy settings from failing installs.

[mise 2026.8.0–8.2](https://github.com/jdx/mise/releases/tag/v2026.8.2) turns `mise bootstrap` into a declarative host-provisioning system. Alongside packages it can now converge privileged files and directories, Linux users and groups, systemd services, Docker Compose projects and firewall rules, with `mise bootstrap plan` previewing the diff before `apply` runs, per-resource `status` commands, and remote execution over SSH. `ruby.compile=false` is now a strict precompiled-only mode.

[packaging 26.3](https://github.com/pypa/packaging/releases/tag/26.3) adds a `VersionRange` API that represents the versions a specifier set accepts as an interval set with intersection, union and difference operations, plus `is_subset`/`is_superset`/`is_disjoint` on `SpecifierSet`. It also accepts `Metadata-Version: 2.6` per [PEP 808](https://peps.python.org/pep-0808/), which lets build backends extend list and table `[project]` fields that are also declared in `project.dynamic`.

[zizmor 1.29.0](https://docs.zizmor.sh/release-notes/#1290) is the first release to audit inputs beyond GitHub Actions: pre-commit configuration files and hook definitions are now supported, starting with a new `insecure-url-scheme` audit and pre-commit coverage in the existing `impostor-commit` and `forbidden-uses` audits. It also recognises GitHub's new `uses: $/path/to/action` self-repository syntax. A [discussion thread](https://github.com/orgs/zizmorcore/discussions/2253) is collecting requests for further CI platforms.

[Dependabot Core 0.390.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.390.0) adds security-update support for vcpkg ports, beta support for pnpm 11, and has the `github_actions` updater relock [`gh-actions-lock`](https://github.com/github/gh-actions-lock) lockfiles alongside workflow updates. The three-day cooldown default is now unconditional.

[Verdaccio 6.9.2](https://github.com/verdaccio/verdaccio/releases/tag/v6.9.2) applies configured package access controls to the `GET /-/_view/starredByUser` endpoint, which previously returned a user's starred packages without filtering by what the requesting client is authorised to see.

Also out: [RubyGems 4.0.18](https://blog.rubygems.org/2026/08/05/4.0.18-released.html), [pip 26.2.1](https://github.com/pypa/pip/releases/tag/26.2.1), [pipx 1.16.6](https://github.com/pypa/pipx/releases/tag/1.16.6), [Conan 2.31.2](https://github.com/conan-io/conan/releases/tag/2.31.2), [sbt 2.0.5](https://github.com/sbt/sbt/releases/tag/v2.0.5), [Gradle 9.7.0-RC3](https://github.com/gradle/gradle/releases/tag/v9.7.0-RC3), [Homebrew 6.0.15](https://github.com/Homebrew/brew/releases/tag/6.0.15), [Renovate 44.12.0](https://github.com/renovatebot/renovate/releases/tag/44.12.0), [pixi 0.76.1](https://github.com/prefix-dev/pixi/releases/tag/v0.76.1), [npm 11.19.0](https://github.com/npm/cli/releases/tag/v11.19.0).

## Security

NuGet.org is [reducing the maximum API key lifetime](https://devblogs.microsoft.com/dotnet/strengthening-nuget-supply-chain-security-reducing-api-key-lifetime/) from 365 days to 30 days from 17 August, with all keys created before that date expiring on 1 November. Publishers are pointed at OIDC-based Trusted Publishing, which issues a short-lived key per publish operation against a policy configured by the package owner.

npm has [restricted 2FA-bypass granular access tokens](https://github.blog/changelog/2026-07-31-restricting-npm-bypass-2fa-granular-access-tokens) from token management, package access changes and organisation membership operations, which now require an interactive 2FA challenge. The tokens lose direct publish rights entirely in January 2027, with trusted publishing or staged publishing as the replacement for automated pipelines.

## Elsewhere

William Woodruff's EuroPython 2026 keynote [Securing Python for the next decade](https://www.youtube.com/watch?v=wMPe_KepOjc) is online.

[htmx 4: the game](https://sethmlarson.dev/htmx-4-the-game) (Seth Larson): htmx 4 shipped as a physical Game Boy cartridge, and the distribution mechanism for the library source is to finish the game and hand-type it from the screen.

[Stylometric Defenses Against Author Impersonation in Software Repositories](https://arxiv.org/abs/2608.02695) (Ravich et al., arXiv) builds a patch-level authorship verifier from twenty years of Linux kernel commit history and applies it retroactively to real supply-chain incidents: the 2021 PHP backdoor commits surface within about 1% of the maintainer review queue and the 2026 ForceMemo spoofs at a median 0.8% per-repository review burden.

## git-pkgs

I tagged [archives v0.5.0](https://github.com/git-pkgs/archives/releases/tag/v0.5.0), [clone v0.2.0](https://github.com/git-pkgs/clone/releases/tag/v0.2.0), [magic v0.2.0](https://github.com/git-pkgs/magic/releases/tag/v0.2.0), [manifests v0.7.0](https://github.com/git-pkgs/manifests/releases/tag/v0.7.0) and [spdx v0.3.0](https://github.com/git-pkgs/spdx/releases/tag/v0.3.0).

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
