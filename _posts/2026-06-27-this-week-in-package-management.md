---
layout: post
title: "This Week in Package Management: 27 June 2026"
date: 2026-06-27 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week six of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[Spack 1.2.0](https://github.com/spack/spack/releases/tag/v1.2.0) makes the rewritten parallel installer the default, adds concretization groups and concretization caching, and ships SBOM generation alongside experimental build sandboxing and a `spack isolate` command.

[pnpm 11.9](https://pnpm.io/blog/releases/11.9) computes a tarball's integrity from the downloaded file when a registry generates tarballs on demand and cannot supply a checksum in its metadata, storing it in the lockfile so later installs can verify it. The release also adds `pnpm sbom --exclude-peers` and speeds up audits on cyclic lockfiles.

[pixi 0.71.0](https://github.com/prefix-dev/pixi/releases/tag/v0.71.0) makes the conda-to-PyPI name mapping configurable, so you can supplement the generated mapping with your own entries rather than overwriting the whole file, which helps people on corporate networks hosting their own mappings.

[uv 0.11.24](https://github.com/astral-sh/uv/releases/tag/0.11.24) makes project environments relocatable under preview and adds CPython 3.15.0b3.

[RubyGems 4.0.15](https://github.com/ruby/rubygems/releases/tag/v4.0.15) reduces peak memory when loading the full index and during `bundle install`, and [Bundler 4.0.15](https://github.com/ruby/rubygems/releases/tag/bundler-v4.0.15) resolves Git LFS files in git sources from the real remote and implements a make jobserver.

[Dependabot Core 0.383.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.383.0) bumps bundled npm from 11.8.0 to 11.17.0, adds a `blocked_versions.ignored` metric for security-blocked update checks, and preserves the original bundler checksum on Bundler 4.0.11+ lockfile updates.

[winget 1.29.280](https://github.com/microsoft/winget-cli/releases/tag/v1.29.280) adds an experimental source priority setting, letting you assign a numerical priority to a source so its results sort first when other things are equal.

[pdm 2.28.0](https://github.com/pdm-project/pdm/releases/tag/2.28.0) adds experimental workspace support for managing local member projects in a shared root lockfile.

[pipx 1.15.0](https://github.com/pypa/pipx/releases/tag/1.15.0) adds a `--dry-run` flag to `pipx ensurepath` and fixes `uninject` for uv-backed virtualenvs.

[mise 2026.6.14](https://github.com/jdx/mise/releases/tag/v2026.6.14) adds `mise bootstrap packages import`/`prune` for Homebrew formulae and a `mise bootstrap status` report aggregating packages, dotfiles, repos and shell activation into one view.

[Deno 2.9.0](https://github.com/denoland/deno/releases/tag/v2.9.0) adds a canary-only `deno desktop` command that compiles a project into a self-contained desktop binary, defaulting to the OS native WebView and able to switch to the Chromium Embedded Framework backend.

[Docker Engine 29.6.0](https://github.com/moby/moby/releases/tag/docker-v29.6.0) adds a `GET /images/{name}/attestations` endpoint for retrieving in-toto attestation statements such as SLSA provenance and SPDX SBOMs attached to an image, with platform selection and predicate-type filtering.

[Homebrew 6.0.4](https://github.com/Homebrew/brew/releases/tag/6.0.4) adds `type` and `resolves` fields to the `patch` DSL for annotating patches, in a [change I wrote](https://github.com/Homebrew/brew/pull/22466).

Also out: [sbt 1.12.13](https://github.com/sbt/sbt/releases/tag/v1.12.13), [Verdaccio 6.7.4](https://github.com/verdaccio/verdaccio/releases/tag/v6.7.4), [NuGet 7.9.0.60](https://github.com/NuGet/NuGet.Client/releases/tag/7.9.0.60), [Gradle 9.6.1](https://github.com/gradle/gradle/releases/tag/v9.6.1), [Helm 3.21.2](https://github.com/helm/helm/releases/tag/v3.21.2).

## Security

[Podman 6.0.0](https://github.com/podman-container-tools/podman/releases/tag/v6.0.0) fixes [CVE-2026-57231](https://github.com/advisories/GHSA-4hq8-gpf5-8p68), where a malicious image with malformed `Env` entries could leak host environment variables into containers, including using the `*` glob to pull large numbers of variables without knowing their names. The release also has breaking changes that require matching Buildah, Skopeo, Netavark and Aardvark versions.

[Docker Engine 29.6.1](https://github.com/moby/moby/releases/tag/docker-v29.6.1) fixes several vulnerabilities, including one where a malicious image supplying a malformed `/etc/passwd` or `/etc/group` file could drive excessive memory use and an out-of-memory kill ([GHSA-mjcv-p78q-w5fw](https://github.com/advisories/GHSA-mjcv-p78q-w5fw), [GHSA-jpcc-p29g-p8mq](https://github.com/advisories/GHSA-jpcc-p29g-p8mq), [GHSA-72x6-4j93-7w86](https://github.com/advisories/GHSA-72x6-4j93-7w86)).

[zizmor 1.26](https://docs.zizmor.sh/release-notes/#1260), the GitHub Actions static analysis tool, adds three audits: `typosquat-uses` for misspelled action references, [which I added](https://github.com/zizmorcore/zizmor/pull/1985), plus `unsound-ternary` and `adhoc-packages` for packages installed from outside a package manager.

## Articles

[Swift Package Index joins Apple](https://www.swiftpackageindex.com/blog/swift-package-index-joins-apple) and says the two are building a package registry for the Swift community together.

[The Sorry State of Skill Distribution](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/) (Trail of Bits) built four agent skills that bypassed every skill scanner they tested, and argues the tools meant to catch malicious skills do not work.

[Scrutineer](https://ai-skeptic.bress.net/posts/0016-scrutineer/) (Josh Bressers) runs the same kind of skill scanning against local models to avoid a large token bill.

[Vulnerability reports are not special anymore](https://words.filippo.io/vuln-reports/) (Filippo Valsorda) argues the confidentiality and scarce insight that set vulnerability reports apart no longer hold once LLMs can find the same bugs for everyone.

[One month of ecosystem security engineering](https://thephp.foundation/blog/2026/06/23/one-month-of-ecosystem-security-engineering/) (PHP Foundation) is an update on what the Ecosystem Security Team has shipped for Packagist and Composer in its first month.

[Packagist's security improvements](https://opensourcesecurity.io/2026/2026-06-packagist-security-jordi/) (Josh Bressers, Open Source Security) is an interview with Jordi Boggiano on malware detection, transparency logs and immutable tags, extending the same Packagist series Nils Adermann's PHPVerse slides covered.

[Bridging conda and PyPI ecosystems](https://conda.org/blog/2026-06-25-bridging-conda-and-pypi-ecosystems) (conda.org) covers a conda-pypi channel that translates PyPI metadata into repodata the conda solver reads, plus a plugin that unpacks the wheels and registers them with conda, so you can pull PyPI packages through `conda install` rather than pip inside the environment.

[Too many new packages on CRAN?](https://rworks.dev/posts/too-many-R-packages/) (R Works) notes 40 of 323 recent new CRAN packages shipped with no README, and links a [GitHub discussion](https://github.com/r-community-works/rworks-website/issues/68#issuecomment-4719264802) on whether the bottleneck is submission volume or maintainer capacity.

## Papers

[Ensuring Open Source Integrity: The Intersection of Copy-Based Reuse and License Compliance](https://arxiv.org/abs/2606.23495) (Jahanshahi et al., arXiv) uses the World of Code infrastructure to build a copy-based code reuse network mapping direct copying across projects, then quantifies how far that copying carries potential license noncompliance past explicit package manager dependencies.

[What You See Is Not What You Execute: Memory-Based Runtime SBOM Generation for Supply Chain Security](https://arxiv.org/abs/2606.22827) (Alia et al., arXiv) generates SBOMs from the components actually loaded at runtime rather than from metadata or filesystem artifacts, aimed at dynamic ecosystems such as Python where the two diverge.

[VeriPort: Automated and Verified Patch Backporting](https://arxiv.org/abs/2606.22704) (Ghebremichael et al., arXiv) backports a security fix to multiple prior versions at once and produces evidence that each backport blocks exploitation and preserves functionality, instead of targeting one version chosen in advance.

[A Longitudinal Study of Android Apps Signing Key Protection](https://arxiv.org/abs/2606.21487) (Meng et al., arXiv) mines public repositories for Android signing credentials, recovers compromised keys via exposed passwords, and matches them against signatures from over 4,000 apps.

## Elsewhere

The Python Security Response Team has [open-sourced psrt-ghsa-bot](https://github.com/python/psrt-ghsa-bot), the cron bot it uses to automate advisory tasks and work around GitHub limitations.

Open Collective is [pausing its security bounty program](https://framapiaf.org/@Betree/116799545927857584) for the summer, following curl's lead, and is considering paying for only the first three reports per researcher per week when it returns.

[replacements.fyi](https://replacements.fyi/) lets you search an npm package name and get suggested lighter or safer alternatives, aimed at trimming dependency bloat.

## git-pkgs

I tagged [brief v0.8.2](https://github.com/git-pkgs/brief/releases/tag/v0.8.2) and [enrichment v0.4.0](https://github.com/git-pkgs/enrichment/releases/tag/v0.4.0).

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
