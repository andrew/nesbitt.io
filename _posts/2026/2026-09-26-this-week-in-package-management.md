---
layout: post
title: "This Week in Package Management: 26 September 2026"
date: 2026-09-26 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week nineteen of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[pnpm 12.6](https://pnpm.io/blog/releases/12.6) adds an `autoDedupe` setting that resolves compatible dependency versions to a single one during install, and `pnpm add --save-types` for the matching `@types/*` package. [12.7](https://pnpm.io/blog/releases/12.7) has the global node shim read `.nvmrc` and `.node-version` when `devEngines.runtime` is unset, and adds `pnpm publish --publish-wait-timeout` to block until a published package is available before dependents publish.

[RubyGems 4.1.0.beta1](https://github.com/ruby/rubygems/releases/tag/v4.1.0.beta1) adds content-addressable gems, an opt-in OS credential store for gem and Bundler credentials, ML-DSA post-quantum signatures for the signed-gem workflow, and a `--cooldown` flag on `gem install`, `update` and `outdated`.

[npm 12.1.0](https://github.com/npm/cli/releases/tag/v12.1.0) supports `read-write-stage-only` granular access tokens for staged publishing, and `npm stage` reports the status of packages held in staging. A `--provenance-file` argument now takes precedence over OIDC-generated provenance.

[Poetry 2.5.0](https://github.com/python-poetry/poetry/releases/tag/2.5.0) adds an `installer.builtin-uninstall` setting that removes packages itself instead of calling pip, supports Python 3.15, and stops sending credentials configured for an HTTPS repository over plain HTTP. [2.5.1](https://github.com/python-poetry/poetry/releases/tag/2.5.1) fixes a `TypeError` in the new uninstaller.

[Terraform 1.17.0-beta2](https://github.com/hashicorp/terraform/releases/tag/v1.17.0-beta2) allows variables and locals in provider requirements and adds a `-minimal-refresh` planning option that only refreshes resources with proposed changes. Terraform Policy is now generally available and no longer requires the experimental-features flag.

[Windows Package Manager 1.29.380](https://github.com/microsoft/winget-cli/releases/tag/v1.29.380) adds an experimental source priority setting: sources can be assigned a numeric priority via `winget source add` or `source edit` and are ordered by it in results.

[mise 2026.9.14](https://github.com/jdx/mise/releases/tag/v2026.9.14) lets registry entries require a verified GitHub attestation before a tool installs, and fetches release metadata for any public GitHub repo from mise-versions rather than the GitHub API.

Also out:

- [Homebrew 7.0.6](https://github.com/Homebrew/brew/releases/tag/7.0.6)
- [pipx 1.17.6](https://github.com/pypa/pipx/releases/tag/1.17.6)
- [Hatchling 1.32.4](https://github.com/pypa/hatch/releases/tag/hatchling-v1.32.4)
- [uv 0.12.19](https://github.com/astral-sh/uv/releases/tag/0.12.19)
- [pnpm 11.28](https://pnpm.io/blog/releases/11.28)
- [Yarn 4.18.1](https://github.com/yarnpkg/berry/releases/tag/%40yarnpkg%2Fcli%2F4.18.1)
- [asdf 0.20.2](https://github.com/asdf-vm/asdf/releases/tag/v0.20.2)
- [sbt 2.1.0-M2](https://github.com/sbt/sbt/releases/tag/v2.1.0-M2)
- [Maven 4.0.0-rc-7](https://github.com/apache/maven/releases/tag/maven-4.0.0-rc-7)
- [Gradle 9.8.0](https://github.com/gradle/gradle/releases/tag/v9.8.0)
- [vcpkg 2026-09-26](https://github.com/microsoft/vcpkg-tool/releases/tag/2026-09-26)
- [DNF5 5.4.6.0](https://github.com/rpm-software-management/dnf5/releases/tag/5.4.6.0)
- [Terraform 1.16.4](https://github.com/hashicorp/terraform/releases/tag/v1.16.4)
- [Harbor 2.15.3-rc2](https://github.com/goharbor/harbor/releases/tag/v2.15.3-rc2)
- [Renovate 44.115.10](https://github.com/renovatebot/renovate/releases/tag/44.115.10)
- [Dependabot Core 0.397.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.397.0)
- [setup-uv 10.2.0](https://github.com/astral-sh/setup-uv/releases/tag/v10.2.0)
- [diffoscope 331](https://diffoscope.org/news/diffoscope-331-released/)

## Security

The Rust security response WG [reported](https://blog.rust-lang.org/2026/09/21/github-actions-leaking-secrets-when-miri-output-is-cached/) that Miri wrote every environment variable to `target/`, so caching that directory in GitHub Actions could expose job secrets to pull requests that read from the cache. The nightly dated 2026-09-22 restricts persisted variables to `CARGO_*` (excluding `CARGO_*_TOKEN`) and `OUT_DIR`; the post recommends clearing existing caches and rotating any secrets that were in scope.

[uv 0.12.18](https://github.com/astral-sh/uv/releases/tag/0.12.18) fixes [GHSA-2cv4-cqwr-gwf7](https://github.com/astral-sh/uv/security/advisories/GHSA-2cv4-cqwr-gwf7), a path traversal during wheel installation on Windows. It also adds `--check` and `--output-format json` to `uv pip install` and `uv pip sync`, so planned changes can be reported while leaving the environment unchanged.

[Flatpak 1.18.3](https://github.com/flatpak/flatpak/releases/tag/1.18.3) updates its vendored bubblewrap to 0.12.0 for [CVE-2026-87766](https://nvd.nist.gov/vuln/detail/CVE-2026-87766), where sandbox setup could follow a parent symlink through `/oldroot` to write files on the host, and its vendored xdg-dbus-proxy to 0.1.8 for [CVE-2026-93676](https://nvd.nist.gov/vuln/detail/CVE-2026-93676), where D-Bus broadcast filtering ignored the configured path, interface and member restrictions.

## Elsewhere

The Rust project [announced](https://blog.rust-lang.org/2026/09/22/announcing-a-maintainer-in-residence-scott-schafer-for-the-cargo-team/) Scott Schafer as a full-time Maintainer in Residence for the Cargo team, funded through the Rust Foundation Maintainers Fund with additional money from the Rust Leadership Council's Project Priorities budget and AWS. Separately the Rust Foundation [added](https://rustfoundation.org/media/rust-foundation-welcomes-new-members-codspeed-haevek-perplexity-and-software-stewardship-lab/) CodSpeed, Haevek and Perplexity as Silver members and the Software Stewardship Lab as an Associate member.

Jamie Tanna [reviewed](https://www.jvt.me/posts/2026/09/21/renovate-1-year/) his first year as Renovate project lead: 1,813 releases, managers up from 110 to 118, datasources from 76 to 82, and external commits up 48% in the first half of 2026. Discussion-forum help requests fell 43% over the same period as users turned to LLM tools instead.

Josh Bressers [interviewed](https://opensourcesecurity.io/2026/2026-09-curl-bliss-stefan-daniel/) Daniel Stenberg and Stefan Eissing about curl's month-long pause on accepting vulnerability reports and the volume of AI-generated submissions that prompted it.

Farid Zakaria [wrote up omnibin](https://fzakaria.com/2026/09/24/every-package-is-already-installed), a FUSE filesystem that presents every binary nixpkgs has shipped since 2013, 881,933 in total, by looking up store paths in Hydra's published metadata and fetching them on first access; a cold `python3@3.6.2` start takes about 2.7 seconds.

[TrustBOM: A Scalable Architecture for Confidentiality-Preserving SBOMs Across Organizations](https://arxiv.org/abs/2609.21419) (Nguyen et al., arXiv) proposes a CI/CD-integrated attestation scheme in which a supplier proves that a given vulnerability or restricted licence is absent from its software while keeping the dependency graph private.

[Git 2.56.0-rc2](https://github.com/git/git/releases/tag/v2.56.0-rc2) was tagged.

## git-pkgs

I tagged eight repos this week:

- [citation v0.1.0](https://github.com/git-pkgs/citation/releases/tag/v0.1.0) (new), a pure-Go library for parsing and validating `CITATION.cff` files that preserves source positions, unknown fields and numeric spelling
- [scan v0.1.0](https://github.com/git-pkgs/scan/releases/tag/v0.1.0) (new), a pure-Go library that matches many regular expressions against byte blocks by compiling patterns into shared literal filters and regex automata along Hyperscan lines
- [secrets v0.1.0](https://github.com/git-pkgs/secrets/releases/tag/v0.1.0) (new), which scans Git history for leaked credentials by running the Betterleaks rule corpus over every blob and attributing findings to the commits and paths that introduced them
- [spam v0.1.0](https://github.com/git-pkgs/spam/releases/tag/v0.1.0) (new), an offline library for measuring promotional text in package manifests and READMEs
- [archives v0.8.0](https://github.com/git-pkgs/archives/releases/tag/v0.8.0)
- [clone v0.7.4](https://github.com/git-pkgs/clone/releases/tag/v0.7.4)
- [history v0.1.1](https://github.com/git-pkgs/history/releases/tag/v0.1.1)
- [roles v0.1.1](https://github.com/git-pkgs/roles/releases/tag/v0.1.1)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
