---
layout: post
title: "This Week in Package Management: 15 August 2026"
date: 2026-08-15 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week thirteen of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

pnpm 12, the Rust rewrite, reached [RC 3](https://github.com/pnpm/pnpm/releases/tag/v12.0.0-rc.3) and the project published [What's different in pnpm 12](https://pnpm.io/blog/whats-different-in-pnpm-12): commands, flags, settings and the lockfile format are unchanged from pnpm 11, so upgrading is not a migration. The listed differences are that a globally installed `node`, `deno` or `bun` now follows the version the current project pins rather than the global install, and `--resolution-only` is removed in favour of `pnpm peers check`.

[Hatch 1.18.0](https://github.com/pypa/hatch/releases/tag/hatch-v1.18.0) adds a `sources` environment option that redirects individual dependencies to a local path, Git repository, URL, alternate index or workspace member at install time without altering the published metadata, and `hatch build --all` to build every workspace member at once. [Hatchling 1.32.0](https://github.com/pypa/hatch/releases/tag/hatchling-v1.32.0) lets the `version` command set a version that is statically defined in `project.version`, rewriting `pyproject.toml` in place.

Also out: [uv 0.12.3](https://github.com/astral-sh/uv/releases/tag/0.12.3), [PDM 2.28.1](https://github.com/pdm-project/pdm/releases/tag/2.28.1), [mise 2026.8.4](https://github.com/jdx/mise/releases/tag/v2026.8.4), [Homebrew 6.0.17](https://github.com/Homebrew/brew/releases/tag/6.0.17), [pixi 0.76.2](https://github.com/prefix-dev/pixi/releases/tag/v0.76.2), [snapd 2.76.2](https://github.com/canonical/snapd/releases/tag/2.76.2), [Renovate 44.25.0](https://github.com/renovatebot/renovate/releases/tag/44.25.0), [Dependabot Core 0.391.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.391.0).

## Security

[Flatpak 1.18.1](https://github.com/flatpak/flatpak/releases/tag/1.18.1) and [1.19.0](https://github.com/flatpak/flatpak/releases/tag/1.19.0) fix six advisories including a sandbox escape to full host filesystem read/write via a symlink attack on app data directories ([GHSA-8688-9x26-hhxj](https://github.com/flatpak/flatpak/security/advisories/GHSA-8688-9x26-hhxj)) and a local root privilege escalation via revokefs symlink traversal and commit tampering ([GHSA-qrwq-7qwx-q9rp](https://github.com/flatpak/flatpak/security/advisories/GHSA-qrwq-7qwx-q9rp)).

[GitHub Actions needs OIDC audience constraints](https://blog.yossarian.net/2026/08/10/github-actions-needs-oidc-audience-constraints) (William Woodruff): a workflow job with `id-token: write` can request an identity token for any audience at runtime, so a compromised PyPI publishing job can mint a token for AWS or any other configured relying party. The proposal is to make the permission list allowed audiences statically, e.g. `id-token: [pypi]`, as GitLab CI already supports.

## Articles

[nixpkgs multiverse: every version that ever existed](https://fzakaria.com/2026/08/09/nixpkgs-multiverse-every-version-that-ever-existed) (Farid Zakaria) describes [nixpkgs-multiverse](https://github.com/fzakaria/nixpkgs-multiverse), a flake that exposes every historical package version across all 1,393 nixpkgs channel revisions since 2017. A pair of JSON index files map each package version to its source revision so the target nixpkgs is fetched lazily on use, avoiding the overhead of pinning multiple inputs.

[OxCaml opam guards](https://anil.recoil.org/notes/oxcaml-opam-guards) (Anil Madhavapeddy) explains how the Jane Street OCaml fork is packaged: an opam overlay repository ships patched `+ox` variants of packages that don't compile against the extended compiler, and pairs of conflicting `.guard` and `.enabled` meta-packages use `conflicts:` fields to stop the solver installing an incompatible upstream release once the overlay is enabled.

## Elsewhere

Following [PEP 833](https://peps.python.org/pep-0833/), PyPI's [HTML simple index representation is now frozen](https://blog.pypi.org/posts/2026-08-11-html-index-is-frozen/): it will keep serving new packages and releases indefinitely but no new metadata fields will be added to it, with future index standardisation targeting only the JSON representation. pip and uv already prefer JSON.

[Soar](https://github.com/pkgforge/soar) is a distro-independent Linux package manager from pkgforge that installs static binaries, AppImages and FlatImages into the user's home directory without root. Packages come from the [soarpkgs](https://github.com/pkgforge/soarpkgs) repository, built on remote CI and verified with BLAKE3 checksums and minisign signatures.

## git-pkgs

I tagged 7 repos this week:

- [dependents v0.1.0](https://github.com/git-pkgs/dependents/releases/tag/v0.1.0) (new), a Go library that finds and ranks repositories depending on a given package, deduplicating by repository while retaining the package-level relationships
- [provides v0.1.0](https://github.com/git-pkgs/provides/releases/tag/v0.1.0) (new), a Go library that maps package identities to the names used in source code, for cases such as a Python distribution providing a differently named module or a Maven artifact containing several Java packages
- [changelog v0.2.0](https://github.com/git-pkgs/changelog/releases/tag/v0.2.0)
- [enrichment v0.6.5](https://github.com/git-pkgs/enrichment/releases/tag/v0.6.5)
- [manifests v0.7.1](https://github.com/git-pkgs/manifests/releases/tag/v0.7.1)
- [outline v0.2.0](https://github.com/git-pkgs/outline/releases/tag/v0.2.0)
- [sbom v0.1.4](https://github.com/git-pkgs/sbom/releases/tag/v0.1.4)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
