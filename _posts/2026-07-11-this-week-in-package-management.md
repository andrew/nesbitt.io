---
layout: post
title: "This Week in Package Management: 11 July 2026"
date: 2026-07-11 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week eight of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[npm 12.0.0](https://github.com/npm/cli/releases/tag/v12.0.0) is out. `allow-git` and `allow-remote` now default to `none`, so installing git dependencies or user-supplied tarball URLs needs explicit opt-in. `npm shrinkwrap` is removed and `npm-shrinkwrap.json` is no longer honoured at the project root or inside dependency tarballs. Unknown `.npmrc` keys, unknown CLI flags and abbreviated flags now error instead of warn, root `preinstall` runs before dependencies are installed, and `npm adduser`, `star` and `unstar` are gone.

[pnpm 11.10](https://pnpm.io/blog/releases/11.10) adds an `_auth` setting that takes registry credentials as a single URL-keyed structure, so CI can pass them via `pnpm_config__auth` without the shell-quoting problems that broke the per-registry env vars. It also adds `pnpm prefix` and `pnpm issues`, and `pnpm self-update` can now install v12, the Rust port. [11.11](https://github.com/pnpm/pnpm/releases/tag/v11.11.0) followed with a `pnpm access` command for managing registry visibility, MFA requirements and team access, and lets `allowBuilds` entries for git-hosted packages match by repository URL without pinning a commit hash.

[uv 0.11.28](https://github.com/astral-sh/uv/releases/tag/0.11.28) hardens ZIP handling against parser differentials via an updated `astral-async-zip`, so uv may now reject malformed wheels it previously accepted, matching last week's tar work. [0.11.27](https://github.com/astral-sh/uv/releases/tag/0.11.27) preceded it with resolver performance work: SIMD TOML parsing, interned `requires-python` specifiers and cached lock markers.

[Go 1.26.5](https://go.dev/doc/devel/release#go1.26.5) is a security release fixing issues in `crypto/tls` and `os`, alongside bug fixes to the compiler, runtime and `go` command.

[Rust 1.97.0](https://blog.rust-lang.org/2026/07/09/Rust-1.97.0/) stabilises `resolver.lockfile-path` in Cargo config for pointing at a lockfile outside a read-only source directory, and `build.warnings` for turning warnings into errors without `-Dwarnings` invalidating the build cache. `cargo clean` now refuses a `--target-dir` that doesn't look like a Cargo target directory.

[winget 1.29](https://github.com/microsoft/winget-cli/releases/tag/v1.29.280) adds an experimental source priority feature: sources get a numeric priority via `winget source add` or `source edit`, and higher-priority sources sort first when a search matches packages in more than one.

[Spack 1.2.1](https://github.com/spack/spack/releases/tag/v1.2.1) fixes a hang in the new installer when running under `forkserver` and restores solver performance on macOS.

[CocoaPods 1.17.0](https://github.com/CocoaPods/CocoaPods/releases/tag/1.17.0) adds `--no-lint` to `pod repo push` to skip the lint phase when publishing, and updates `ruby-macho` so mergeable libraries are detected.

[Hex 2.5.1](https://github.com/hexpm/hex/releases/tag/v2.5.1) adds `ignore_advisories` and `ignore_retirements` to the `mix.exs` `:hex` block and as environment variables, so acknowledged CVEs and retirements can be listed once and `mix hex.audit` reports them separately without failing. Advisories can be ignored by any aliased identifier.

[mise 2026.7.4](https://github.com/jdx/mise/releases/tag/v2026.7.4) graduates `mise bootstrap` and `mise dotfiles` out of experimental mode, so system packages, repos, user services and shell activation now work without `MISE_EXPERIMENTAL`. [2026.7.5](https://github.com/jdx/mise/releases/tag/v2026.7.5) followed, sharing config trust across git worktrees so trusting a repo once covers every `git worktree add` checkout, and fixing npm-backed tools on npm 12.

Also out: [Homebrew 6.0.9](https://github.com/Homebrew/brew/releases/tag/6.0.9), [RubyGems 4.0.16](https://blog.rubygems.org/2026/07/10/4.0.16-released.html), [Bundler 4.0.16](https://github.com/ruby/rubygems/releases/tag/bundler-v4.0.16), [Cargo 0.98.0](https://github.com/rust-lang/cargo/releases/tag/0.98.0), [asdf 0.20.0](https://github.com/asdf-vm/asdf/releases/tag/v0.20.0), [Hatch 1.17.1](https://github.com/pypa/hatch/releases/tag/hatch-v1.17.1), [Hatchling 1.31.0](https://github.com/pypa/hatch/releases/tag/hatchling-v1.31.0), [pixi 0.72.2](https://github.com/prefix-dev/pixi/releases/tag/v0.72.2), [Yarn 4.17.1](https://github.com/yarnpkg/berry/releases/tag/%40yarnpkg%2Fcli%2F4.17.1), [Deno 2.9.2](https://github.com/denoland/deno/releases/tag/v2.9.2), [Helm 4.2.3](https://github.com/helm/helm/releases/tag/v4.2.3), [Helm 3.21.3](https://github.com/helm/helm/releases/tag/v3.21.3), [Podman 6.0.1](https://github.com/podman-container-tools/podman/releases/tag/v6.0.1), [Nix 2.34.8](https://github.com/NixOS/nix/releases/tag/2.34.8), [Gradle 9.7.0-M3](https://github.com/gradle/gradle/releases/tag/v9.7.0-M3), [Maven 3.10.0-rc-1](https://github.com/apache/maven/releases/tag/maven-3.10.0-rc-1), [Renovate 43.258.0](https://github.com/renovatebot/renovate/releases/tag/43.258.0), [Dependabot Core 0.385.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.385.0), [Go 1.27rc2](https://go.dev/dl/#go1.27rc2).

## Security

[opam 2.5.2](https://github.com/ocaml/opam/releases/tag/2.5.2) fixes CVE-2026-57825: a package could install files anywhere on the system by including a symlink to an external directory, bypassing the user prompt that direct external paths trigger.

pnpm [11.11.0](https://github.com/pnpm/pnpm/releases/tag/v11.11.0) and [10.34.5](https://github.com/pnpm/pnpm/releases/tag/v10.34.5) fix two path traversals: a crafted `pnpm-lock.yaml` dependency key could write package content outside the virtual store, and a dependency whose manifest `name` was a scoped traversal like `@x/../../../<path>` could be written outside `node_modules` during install even with `--ignore-scripts`.

[ORAS 1.3.3](https://github.com/oras-project/oras/releases/tag/v1.3.3) picks up oras-go 2.6.2 to fix [CVE-2026-50163](https://github.com/advisories/GHSA-fxhp-mv3v-67qp): a crafted OCI artifact with a relative hardlink target could get `oras pull` to link into a file in the invoker's working directory rather than the extract directory.

## Articles

[Immutable Versions on Packagist](https://blog.packagist.com/immutable-versions-on-packagist/) (Packagist Blog) is the next post in the Composer supply chain series: once a stable version is published its git reference is now fixed, retag attempts are blocked with an email to the maintainer, and deletions become soft with a public transparency log.

[You shouldn't trust Trusted Publishing](https://blog.yossarian.net/2026/07/07/You-shouldnt-trust-trusted-publishing) (William Woodruff) argues Trusted Publishing is an authentication mechanism between CI and a registry, not a signal that a package is safe, and that PyPI keeps it out of the badge UI for exactly that reason.

## Elsewhere

Trail of Bits published [a proposal for PyPI transparency logs](https://pytransparency.dev/): an append-only log of every distribution file the index serves, with inclusion proofs exposed through the Simple API, so a compromised index serving different artifacts to different users becomes detectable. There is a [draft PEP](https://github.com/trailofbits/pypi-transparency/blob/main/peps/pep-xxxx.rst), a test log, and [source](https://github.com/trailofbits/pypi-transparency).

The [EuroPython 2026 Packaging Summit](https://programme.europython.eu/europython-2026/talk/SBREFN/) schedule is up for 13 July in Kraków, with [public notes](https://hackmd.io/@jezdez/europython2026-packaging-summit) and late topic proposals still open.

[Open Source Security: Rust Foundation Maintainers Fund](https://opensourcesecurity.io/2026/2026-07-rfmf-lori-niko/) (Josh Bressers) is a podcast conversation with Lori Lorusso and Niko Matsakis on how the fund is structured and where the money goes.

The Nix Foundation is [fundraising for a documentation team](https://nixos.org/blog/announcements/2026/docs-funding-2026/) via Open Collective, with itemised monthly and one-off funding targets for paid contributors working on onboarding and reference material.

[Git 2.55](https://github.blog/open-source/git/highlights-from-git-2-55/) adds `git history fixup <commit>` for amending an earlier commit and replaying its descendants in one step, incremental multi-pack index repacking, a built-in inotify filesystem monitor on Linux, and a `hook.<name>.parallel` config for running hooks concurrently.

[Beyond Compliance: A Large Scale Study on the Completeness and Consistency of the GitHub SBOMs](https://arxiv.org/abs/2607.04614) (Bhuiyan et al., arXiv) measures GitHub's auto-generated SBOMs across ecosystems and finds version and licence coverage varies enough by language that reliability depends on which ecosystem you're in.

## git-pkgs

I tagged six repos this week:

- [brief v0.9.3](https://github.com/git-pkgs/brief/releases/tag/v0.9.3)
- [enrichment v0.6.0](https://github.com/git-pkgs/enrichment/releases/tag/v0.6.0)
- [purl v0.1.14](https://github.com/git-pkgs/purl/releases/tag/v0.1.14)
- [sarif v0.1.0](https://github.com/git-pkgs/sarif/releases/tag/v0.1.0)
- [sbom v0.1.3](https://github.com/git-pkgs/sbom/releases/tag/v0.1.3)
- [vulns v0.2.0](https://github.com/git-pkgs/vulns/releases/tag/v0.2.0)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
