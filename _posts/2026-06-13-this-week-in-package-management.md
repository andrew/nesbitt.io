---
layout: post
title: "This Week in Package Management: 13 June 2026"
date: 2026-06-13 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week four of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Security

GitHub announced the [breaking changes coming in npm v12](https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/), estimated for July. `npm install` will stop running dependency lifecycle scripts unless they're allowed via the `allowScripts` field that [11.16.0 introduced](https://github.com/npm/cli/releases/tag/v11.16.0) in advisory mode, covered in the [install-script allowlists post](/2026/06/05/install-script-allowlists.html) I wrote last week. Implicit `node-gyp` builds are blocked too, so a package with a `binding.gyp` and no install script needs approval like any other. Git dependencies and remote URL tarballs also stop resolving by default, each behind a new `--allow-git` / `--allow-remote` flag. Everything ships behind warnings in npm 11.16.0+ today.

[uv audit](https://astral.sh/blog/uv-audit) is a new preview command that scans Python dependencies for known vulnerabilities and adverse project statuses like deprecation, a uv-native alternative to pip-audit. The same announcement covers an experimental malware check: `uv add` and `uv sync` can look up previously-resolved packages against OSV on every sync, behind `UV_MALWARE_CHECK=1`.

## Releases

[RubyGems and Bundler 4.0.14](https://blog.rubygems.org/2026/06/10/4.0.14-released.html) follow up on last week's Cooldown feature: Bundler now preserves per-source cooldown settings when converging sources from the lockfile and stops excluding the locked version from cooldown during `bundle update`. On the RubyGems side, the gem installer validates executables and bindir, and C1 control characters are stripped from displayed gem text.

[Dependabot Core 0.381.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.381.0) adds Bundler 4 support and disables the npm minimal-age gate for Yarn Berry security updates, the same cooldown-bypass-for-security-fixes pattern it applied to pnpm last week. Go module updates now respect `GONOPROXY` and `GONOSUMDB`.

[mise 2026.6.2](https://github.com/jdx/mise/releases/tag/v2026.6.2) adds excludes to its minimum release age setting, so a cooldown policy can carve out specific tools.

[Flatpak 1.18.0](https://github.com/flatpak/flatpak/releases/tag/1.18.0) exposes AMD's compute interface (`/dev/kfd`) through the DRI device permission, prints failure causes in `flatpak update` output, and speeds up fish shell integration at startup.

Also out: [pixi 0.70.2](https://github.com/prefix-dev/pixi/releases/tag/v0.70.2), [Mamba 2.8.1](https://github.com/mamba-org/mamba/releases/tag/2.8.1), [sbt 2.0.0-RC15](https://github.com/sbt/sbt/releases/tag/v2.0.0-RC15).

## Articles

[What We're No Longer Seeing: AI and the Invisible Newcomer in Open Source](https://blog.stdlib.io/ai-and-the-invisible-newcomer-in-open-source/) (Mara Averick, stdlib blog) argues that the friction of a newcomer's first clumsy issue or pull request is how communities spot and welcome new contributors, and that AI assistance now smooths that friction away before anyone sees it.

[We have to change the rules of security](https://opensourcesecurity.io/2026/06-rules-of-security/) (Josh Bressers) makes the case for deliberately choosing what security work to stop doing, rather than letting tasks fall through the cracks at random.

[A Strategic Approach to Demonstrating the Value of OSS Efforts](https://fastwonderblog.com/2026/06/08/a-strategic-approach-to-demonstrating-the-value-of-oss-efforts/) (Dawn Foster) collects a year of her writing and talks on showing leadership the value of open source work in one place.

[The Guix Nix Abomination: Leveraging Guix derivations in Nix](https://fzakaria.com/2026/06/05/the-guix-nix-abomination-leveraging-guix-derivations-in-nix) (Farid Zakaria) registers a Guix derivation in a Nix store and has Nix build it, showing the two tools share the same derivation machinery underneath the rivalry.

## Papers

[When LLMs Invent Rust Crates: An Empirical Study of Hallucination Patterns and Mitigation](https://arxiv.org/abs/2606.08444) (Zheng et al., arXiv) is the first large-scale study of crate hallucination in LLM-generated Rust code, building its dataset from Stack Overflow and GitHub tasks rather than the Python and JavaScript ecosystems earlier package-hallucination work measured.

[Skilldex: A Package Manager and Registry for Agent Skill Packages with Hierarchical Scope-Based Distribution](https://arxiv.org/abs/2604.16911) (Saha et al., arXiv) proposes a package manager and registry design for distributing agent skills with scoped namespaces.

## Elsewhere

[Inside PyPI: Maria Ashna on Supporting Python's Package Index](https://www.youtube.com/watch?v=OGIznDrFa2U) is a Behind the Commit interview about the day-to-day work of running PyPI.

[Fixing Fedora's Packaging Pipeline](https://www.youtube.com/watch?v=m59OdC3BLp0) is a Fedora Podcast episode with Jakub Kadlčík of the Copr build service on RPM packaging tooling.

Two versioning schemes: [PaceVer](https://pacever.org/) versions user-facing apps as `MARKETING.NATIVE.OTA`, bumping by which channel a release ships through, the slow store-reviewed binary or the fast over-the-air update. [Kelvin versioning](https://wiki.xxiivv.com/site/kelvin_versioning.html) (Devine Lu Linvega) counts versions down in Kelvin towards absolute zero, where the software is frozen and no further releases are possible.

## git-pkgs

I tagged [proxy v0.5.0](https://github.com/git-pkgs/proxy/releases/tag/v0.5.0).

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
