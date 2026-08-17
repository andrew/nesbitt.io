---
layout: post
title: "This Week in Package Management: 15 August 2026"
date: 2026-08-15 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mtchoxrmz22n"
---

Week thirteen of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

pnpm 12, the Rust rewrite, reached [RC 5](https://github.com/pnpm/pnpm/releases/tag/v12.0.0-rc.5) and the project published [What's different in pnpm 12](https://pnpm.io/blog/whats-different-in-pnpm-12): commands, flags, settings and the lockfile format are unchanged from pnpm 11, so upgrading is not a migration. RC 5 breaks dependency cycles canonically during peer resolution by ordering cycle members by package id and always cutting the closing edge in the same place, so the same dependencies produce the same lockfile regardless of importer or resolution order.

[Hatch 1.18.0](https://github.com/pypa/hatch/releases/tag/hatch-v1.18.0) adds a `sources` environment option that redirects individual dependencies to a local path, Git repository, URL, alternate index or workspace member at install time without altering the published metadata, and `hatch build --all` to build every workspace member at once. [Hatchling 1.32.0](https://github.com/pypa/hatch/releases/tag/hatchling-v1.32.0) lets the `version` command set a version that is statically defined in `project.version`, rewriting `pyproject.toml` in place.

[Renovate 44.24.0–44.30.3](https://github.com/renovatebot/renovate/releases/tag/44.30.3) adds [support](https://github.com/renovatebot/renovate/pull/45199) for GitHub's Actions lockfile, relocking it alongside `uses:` reference updates. 44.28.0 adds a [`gomodTidyAll`](https://github.com/renovatebot/renovate/pull/37138) option to run `go mod tidy` across every module in a Go monorepo after a dependency update, and 44.29.5 [stops updating a PR branch](https://github.com/renovatebot/renovate/pull/45252) while it sits in a GitHub merge queue.

[DNF5 5.4.3.0](https://github.com/rpm-software-management/dnf5/releases/tag/5.4.3.0) ports the bootc integration from DNF4, adds `--allow-vendor-change`/`--no-allow-vendor-change` with a warning when upgrades are silently skipped by the vendor-change restriction, `remove --duplicates` to clear older duplicate packages, and a `gpgcheck_policy` setting.

Also out:

- [uv 0.12.5](https://github.com/astral-sh/uv/releases/tag/0.12.5)
- [PDM 2.28.1](https://github.com/pdm-project/pdm/releases/tag/2.28.1)
- [mise 2026.8.6](https://github.com/jdx/mise/releases/tag/v2026.8.6)
- [Homebrew 6.0.17](https://github.com/Homebrew/brew/releases/tag/6.0.17)
- [pnpm 11.21](https://github.com/pnpm/pnpm/releases/tag/v11.21.0)
- [pixi 0.76.2](https://github.com/prefix-dev/pixi/releases/tag/v0.76.2)
- [pipx 1.16.7](https://github.com/pypa/pipx/releases/tag/1.16.7)
- [snapd 2.76.2](https://github.com/canonical/snapd/releases/tag/2.76.2)
- [Nix 2.35.2](https://github.com/NixOS/nix/releases/tag/2.35.2)
- [APT 3.3.3](https://salsa.debian.org/apt-team/apt/-/tags/3.3.3)
- [Helm 4.2.4](https://github.com/helm/helm/releases/tag/v4.2.4)
- [Helm 3.21.4](https://github.com/helm/helm/releases/tag/v3.21.4)
- [Podman 6.1.0](https://github.com/podman-container-tools/podman/releases/tag/v6.1.0)
- [Go 1.26.6](https://go.dev/doc/devel/release#go1.26.6)
- [winget 1.30.100-preview](https://github.com/microsoft/winget-cli/releases/tag/v1.30.100-preview)
- [Stack 3.3.1](https://github.com/commercialhaskell/stack/releases/tag/v3.3.1-ghc-9.10.3)
- [Dependabot Core 0.391.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.391.0)

## Security

[Flatpak 1.18.1](https://github.com/flatpak/flatpak/releases/tag/1.18.1) and [1.19.0](https://github.com/flatpak/flatpak/releases/tag/1.19.0) fix six advisories including a sandbox escape to full host filesystem read/write via a symlink attack on app data directories ([GHSA-8688-9x26-hhxj](https://github.com/flatpak/flatpak/security/advisories/GHSA-8688-9x26-hhxj)) and a local root privilege escalation via revokefs symlink traversal and commit tampering ([GHSA-qrwq-7qwx-q9rp](https://github.com/flatpak/flatpak/security/advisories/GHSA-qrwq-7qwx-q9rp)).

[Docker Engine 25.0.17](https://github.com/moby/moby/releases/tag/v25.0.17) backports fixes for three symlink and path-traversal vulnerabilities in mount handling and `docker cp` ([CVE-2026-41567](https://www.cve.org/CVERecord?id=CVE-2026-41567), [CVE-2026-41568](https://www.cve.org/CVERecord?id=CVE-2026-41568), [CVE-2026-42306](https://www.cve.org/CVERecord?id=CVE-2026-42306)).

[Podman 5.8.6](https://github.com/podman-container-tools/podman/releases/tag/v5.8.6) fixes [CVE-2026-19730](https://www.cve.org/CVERecord?id=CVE-2026-19730): `podman quadlet install --replace` did not truncate the file being replaced, so replacing a longer file with a shorter one left trailing content from the original.

[GitHub Actions needs OIDC audience constraints](https://blog.yossarian.net/2026/08/10/github-actions-needs-oidc-audience-constraints) (William Woodruff): a workflow job with `id-token: write` can request an identity token for any audience at runtime, so a compromised PyPI publishing job can mint a token for AWS or any other configured relying party. The proposal is to make the permission list allowed audiences statically, e.g. `id-token: [pypi]`, as GitLab CI already supports.

## Articles

[nixpkgs multiverse: every version that ever existed](https://fzakaria.com/2026/08/09/nixpkgs-multiverse-every-version-that-ever-existed) (Farid Zakaria) describes [nixpkgs-multiverse](https://github.com/fzakaria/nixpkgs-multiverse), a flake that exposes every historical package version across all 1,393 nixpkgs channel revisions since 2017. A pair of JSON index files map each package version to its source revision so the target nixpkgs is fetched lazily on use, avoiding the overhead of pinning multiple inputs.

[OxCaml opam guards](https://anil.recoil.org/notes/oxcaml-opam-guards) (Anil Madhavapeddy) explains how the Jane Street OCaml fork is packaged: an opam overlay repository ships patched `+ox` variants of packages that don't compile against the extended compiler, and pairs of conflicting `.guard` and `.enabled` meta-packages use `conflicts:` fields to stop the solver installing an incompatible upstream release once the overlay is enabled.

[I hate packaging my software for Linux](https://getfresh.dev/docs/blog/packaging-for-linux/) (Noam Lewis) walks through the trade-offs of deb, rpm, AUR, Flatpak, AppImage and Nix from the perspective of a TUI editor author, and lands on shipping a statically linked self-updating binary as the primary distribution mechanism instead. There's a long [Lobsters thread](https://lobste.rs/s/ixbrmc/i_hate_packaging_my_software_for_linux).

[PyPI dependencies, resolved and built for you](https://fedora-copr.github.io/posts/pypi-dependencies-resolved-and-built-for-you) (Sundaram Krishnan, Fedora Copr blog) introduces `coprtree`, which resolves a Python package's dependency tree from [ecosyste.ms](https://ecosyste.ms) metadata, drops packages already available in Fedora repositories or the target Copr project, and topologically sorts the remainder into a build order.

[What is a package registry?](https://swiftpackageindex.com/blog/what-is-a-package-registry) (Dave Verwer, Swift Package Index): following the index joining Apple, the two are building a Swift package registry. SwiftPM has resolved `.package(id:from:)` registry dependencies since Swift 5.7, fetching an immutable source archive instead of cloning a repository and checking out a mutable tag. Artifactory, AWS CodeArtifact, Cloudsmith and the read-only Tuist cache already implement the protocol.

## Elsewhere

Following [PEP 833](https://peps.python.org/pep-0833/), PyPI's [HTML simple index representation is now frozen](https://blog.pypi.org/posts/2026-08-11-html-index-is-frozen/): it will keep serving new packages and releases indefinitely but no new metadata fields will be added to it, with future index standardisation targeting only the JSON representation. pip and uv already prefer JSON.

Seventeen candidates are [standing](https://blog.python.org/2026/08/2026-packaging-council-nominees/) for the five seats on the 2026 Python Packaging Council, the [PEP 772](https://peps.python.org/pep-0772/) body with authority over packaging standards and PyPA tools. Voter registration closes 25 August and the vote closes 15 September.

[Soar](https://github.com/pkgforge/soar) is a distro-independent Linux package manager from pkgforge that installs static binaries, AppImages and FlatImages into the user's home directory without root. Packages come from the [soarpkgs](https://github.com/pkgforge/soarpkgs) repository, built on remote CI and verified with BLAKE3 checksums and minisign signatures.

## git-pkgs

I tagged 24 repos this week:

- [git-pkgs v0.19.0](https://github.com/git-pkgs/git-pkgs/releases/tag/v0.19.0)
- [dependents v0.1.0](https://github.com/git-pkgs/dependents/releases/tag/v0.1.0) (new), a Go library that finds and ranks repositories depending on a given package, deduplicating by repository while retaining the package-level relationships
- [nexus v0.1.1](https://github.com/git-pkgs/nexus/releases/tag/v0.1.1) (new), a Go library that reads Maven repository indexes without Java or Lucene, streaming artifact additions and removals in publication order for catalogue importers and proxy services
- [provides v0.2.0](https://github.com/git-pkgs/provides/releases/tag/v0.2.0) (new), a Go library that maps package identities to the names used in source code, for cases such as a Python distribution providing a differently named module or a Maven artifact containing several Java packages
- [archives v0.5.1](https://github.com/git-pkgs/archives/releases/tag/v0.5.1)
- [brief v0.10.0](https://github.com/git-pkgs/brief/releases/tag/v0.10.0)
- [changelog v0.2.0](https://github.com/git-pkgs/changelog/releases/tag/v0.2.0)
- [clone v0.3.0](https://github.com/git-pkgs/clone/releases/tag/v0.3.0)
- [enrichment v0.6.5](https://github.com/git-pkgs/enrichment/releases/tag/v0.6.5)
- [forge v0.8.0](https://github.com/git-pkgs/forge/releases/tag/v0.8.0)
- [licenses v0.4.0](https://github.com/git-pkgs/licenses/releases/tag/v0.4.0)
- [manifests v0.8.0](https://github.com/git-pkgs/manifests/releases/tag/v0.8.0)
- [markup v0.1.1](https://github.com/git-pkgs/markup/releases/tag/v0.1.1)
- [outline v0.2.1](https://github.com/git-pkgs/outline/releases/tag/v0.2.1)
- [pom v0.1.6](https://github.com/git-pkgs/pom/releases/tag/v0.1.6)
- [proxy v0.7.0](https://github.com/git-pkgs/proxy/releases/tag/v0.7.0)
- [purl v0.1.16](https://github.com/git-pkgs/purl/releases/tag/v0.1.16)
- [registries v0.7.0](https://github.com/git-pkgs/registries/releases/tag/v0.7.0)
- [sarif v0.1.2](https://github.com/git-pkgs/sarif/releases/tag/v0.1.2)
- [sbom v0.1.5](https://github.com/git-pkgs/sbom/releases/tag/v0.1.5)
- [sigstore v0.1.3](https://github.com/git-pkgs/sigstore/releases/tag/v0.1.3)
- [spdx v0.3.1](https://github.com/git-pkgs/spdx/releases/tag/v0.3.1)
- [vers v0.3.1](https://github.com/git-pkgs/vers/releases/tag/v0.3.1)
- [vulns v0.2.2](https://github.com/git-pkgs/vulns/releases/tag/v0.2.2)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
