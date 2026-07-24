---
layout: post
title: "This Week in Package Management: 25 July 2026"
date: 2026-07-25 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week ten of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[RubyGems and Bundler 4.0.17](https://blog.rubygems.org/2026/07/22/4.0.17-released.html) validate the spec name before writing to the spec cache, escape glob metacharacters in install paths, and fix a run of Windows path-handling bugs in `gem open`, `bundle open` and the `MAKE`/`rake` environment variables.

[uv 0.11.31](https://github.com/astral-sh/uv/releases/tag/0.11.31) lets workspace sources reference members of a different workspace by path, supports `.venv` files that point at a centralised project environment, and adds `audit.malware-check` and `audit.malware-check-url` settings. There is also a preview `hash-algorithm` setting per index for lockfile generation. [0.11.32](https://github.com/astral-sh/uv/releases/tag/0.11.32) followed, rejecting non-canonically formatted lockfiles in `uv lock --check` and regenerating them with `uv lock --refresh`.

[opam 2.6.0-alpha1](https://github.com/ocaml/opam/releases/tag/2.6.0-alpha1) is the first alpha of the 2.6 series. The shell env hook now updates opam's bin directory in `PATH` in place instead of always moving it to the front, repositories are read from `index.tar.gz` in memory via `ocaml-tar` so `opam update` needs one syscall instead of tens of thousands on slow filesystems, and build directories are deleted sooner to cut disk use.

[pnpm 11.11–11.14](https://pnpm.io/blog/releases/11.11-11.14) is a wrap-up post covering four minors. New since [last week](/2026/07/18/this-week-in-package-management): `pnpm doctor` for end-to-end installation diagnosis, `pnpm access` for managing package permissions on the registry, convergence overrides, scheme-carrying `peerDependencies` specifiers, a path-traversal fix, and roughly 30% lower peak memory during cold-cache resolution.

[mise 2026.7.11](https://github.com/jdx/mise/releases/tag/v2026.7.11) is the first published release since 2026.7.7; 2026.7.8 through 2026.7.10 were tagged but never went out because of a release-pipeline problem. Structured tool definitions now accept `version`, `path`, `prefix` and `ref` selectors consistently across root `[tools]`, task definitions and templates, and shell activation does less redundant work. [2026.7.12](https://github.com/jdx/mise/releases/tag/v2026.7.12) adds a `MISE_SAFE=1` mode that turns mise into an inert config reader, so CI and bots can run `mise lock --bump` against untrusted branches without trust prompts or arbitrary code execution. The `npm:` backend no longer needs node installed, and skopeo, crane and gpg are replaced with built-in implementations.

[Conan 2.31.0](https://github.com/conan-io/conan/releases/tag/2.31.0) moves the Workspace feature out of incubating, adds regex support to `replace_in_file`, and lets a `conanws.py` define workspace member versions dynamically via a new `get_ref(folder)` method.

[vcpkg 2026-07-24](https://github.com/microsoft/vcpkg-tool/releases/tag/2026-07-24) switches dependency snapshots to canonical vcpkg PURLs and adds Git tree gitoids to its SPDX SBOMs.

Also out: [Homebrew 6.0.12](https://github.com/Homebrew/brew/releases/tag/6.0.12), [Deno 2.9.4](https://github.com/denoland/deno/releases/tag/v2.9.4), [Podman 6.0.2](https://github.com/podman-container-tools/podman/releases/tag/v6.0.2), [snapd 2.76.3](https://github.com/canonical/snapd/releases/tag/2.76.3), [Cabal 3.18.1.0](https://github.com/haskell/cabal/releases/tag/Cabal-hooks-v3.18.1.0), [pipx 1.16.2](https://github.com/pypa/pipx/releases/tag/1.16.2), [winget 1.30.70-preview](https://github.com/microsoft/winget-cli/releases/tag/v1.30.70-preview), [sbt 2.0.3](https://github.com/sbt/sbt/releases/tag/v2.0.3), [pnpm 11.15.1](https://github.com/pnpm/pnpm/releases/tag/v11.15.1), [pnpm 12.0.0-alpha.20](https://github.com/pnpm/pnpm/releases/tag/v12.0.0-alpha.20), [Renovate 43.279.2](https://github.com/renovatebot/renovate/releases/tag/43.279.2), [Dependabot Core 0.388.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.388.0).

## Security

[RubyGems.org disclosed](https://blog.rubygems.org/2026/07/22/security-advisory-legacy-api-key-leak.html) a CDN caching bug that could serve one account's legacy API key to another user signing in through the same edge node for up to an hour. It affects sign-ins from gem clients older than v3.2.0, still 18% of `gem signin` traffic, and for the first several years of the bug that was every client. All legacy keys were revoked on 23 July; scoped and OIDC keys were unaffected.

[PyPI now rejects new files uploaded to releases older than 14 days](https://blog.pypi.org/posts/2026-07-22-releases-now-reject-new-files-after-14-days), so a compromised publishing token can no longer add files to a long-stable release. Of the top 15,000 packages, only 56 had added Python 3.14 wheels to an existing release more than 14 days after it shipped; formal semantics for closed releases are planned for the Upload 2.0 API.

## Articles

[Securing our GitHub Actions workflows with zizmor](https://blog.packagist.com/securing-our-github-actions-workflows-with-zizmor/) (Packagist blog) continues their supply-chain security series: every action pinned to a commit SHA, token permissions cut to read-only, and `pull_request_target` workflows removed across the Composer and Packagist repositories.

[Who's responsible for bug reports on old software versions?](https://pointieststick.com/2026/07/19/whos-responsible-for-bug-reports-on-old-software-versions/) (Nate Graham) argues that distributors shipping frozen versions carry the support burden for those versions, and that a high-quality discrete-release OS is more work than a competent rolling release, not less.

[Guix: creating a package from a binary](https://aloysberger.com/posts/guix-packaging-a-binary-as-a-guix-beginner.html) (Aloys Berger) walks through packaging the Caddy binary in Guix as a stopgap, because a from-source build would require packaging a dozen Go dependencies first.

## Elsewhere

EuroPython 2026 ran in Kraków last week with a full-day [Packaging Summit](https://programme.europython.eu/europython-2026/talk/SBREFN/) hosted by Jannis Leidel. Packaging-track talks included [Demystifying CRA for the community](https://programme.europython.eu/europython-2026/talk/Y3DGWB/) (Anwesha Das) on the first wave of Cyber Resilience Act obligations landing in September, [Should you trust Trusted Publishing?](https://programme.europython.eu/europython-2026/talk/M8Q77Z/) (Nikita Karamov) reviewing three years of PyPI's OIDC-based publishing, and [Binary Dependencies: Identifying the Hidden Packages We All Depend On](https://programme.europython.eu/europython-2026/talk/UY9UAG/) (Vlad-Stefan Harbuz) on the compiled dependencies that manifests like `pyproject.toml` don't record.

[CHRONO-RESOLUTION](https://arxiv.org/abs/2607.15315) (arXiv) is a dataset of dependency-resolution results computed at each package's release point across npm, PyPI and crates.io, for research that needs the historical dependency graph rather than today's.

[Scrutineer](https://github.com/alpha-omega-security/scrutineer), the Alpha-Omega scanner mentioned in [last week's Rust Foundation post](https://rustfoundation.org/media/my-first-month-as-ai-security-engineer-in-residence-at-the-rust-foundation/), is [now in Homebrew](https://formulae.brew.sh/formula/scrutineer).

## git-pkgs

I tagged [git-pkgs v0.18.1](https://github.com/git-pkgs/git-pkgs/releases/tag/v0.18.1), [enrichment v0.6.3](https://github.com/git-pkgs/enrichment/releases/tag/v0.6.3), [registries v0.6.3](https://github.com/git-pkgs/registries/releases/tag/v0.6.3), [vulns v0.2.1](https://github.com/git-pkgs/vulns/releases/tag/v0.2.1) and [purl v0.1.15](https://github.com/git-pkgs/purl/releases/tag/v0.1.15).

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
