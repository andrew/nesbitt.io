---
layout: post
title: "This Week in Package Management: 6 June 2026"
date: 2026-06-06 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Third week of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez). Five new project blog feeds and the NixOS announcements feed landed in the OPML this week.

## Security

[Bundler 4.0.13](https://github.com/ruby/rubygems/releases/tag/bundler-v4.0.13) ships [Cooldown](https://blog.rubygems.org/2026/06/03/cooldown-let-new-gems-be-vetted.html), a configurable time window that holds back resolution to gem versions younger than N days, so a freshly published malicious release ages past the window before a `bundle install` will pick it up. The companion [RubyGems 4.0.13](https://github.com/ruby/rubygems/releases/tag/v4.0.13) release blocks gem extraction from escaping the destination directory via pre-existing symlinks.

The Packagist supply-chain series continues. [Closing Composer's Download Fallback Paths](https://blog.packagist.com/closing-composers-download-fallback-paths-in-private-packagist/) covers how the dist-to-source fallback, originally designed for resilience, can be used to fetch a different artifact than the one Composer expected. [Blocking Malware Downloads for Every Composer Version](https://blog.packagist.com/blocking-malware-downloads-for-every-composer-version-in-private-packagist/) describes how Private Packagist enforces malware blocking for installs from Composer versions older than 2.10, before the dependency policy framework existed. [Enforce a Safe Composer Version Across Your Organization](https://blog.packagist.com/enforce-a-safe-composer-version-across-your-organization/) closes the loop by letting Private Packagist organisations restrict which Composer client versions can fetch the repository at all, rejecting older clients with an error that surfaces in the developer's terminal.

[New HexDocs URLs: per-package subdomains](https://hex.pm/blog/hexdocs-per-package-subdomains) moves public Elixir and Erlang package docs from `hexdocs.pm/package` to `package.hexdocs.pm`, and organization docs to a separate registrable domain (`hexorgs.pm`). The browser's same-origin policy now isolates packages from each other, addressing a finding from Hex's recent security audit that docs pages run maintainer-controlled HTML, CSS, and JavaScript under a shared origin.

Homebrew's [Tap-Trust documentation](https://docs.brew.sh/Tap-Trust) describes an upcoming change to how non-official taps are loaded. Today any installed tap contributes formulae, casks, and commands by default. Under Tap-Trust, taps need explicit approval via `brew trust user/repo` (or a per-formula variant) before Homebrew evaluates their code. The change becomes the default in Homebrew 6.0.0 or 5.2.0, whichever ships first. `HOMEBREW_REQUIRE_TAP_TRUST=1` opts in early.

[Composer 2.10.1](https://github.com/composer/composer/releases/tag/2.10.1) fixes shell escaping when opening an editor and verifies the backup phar's signature before `self-update --rollback` restores it.

[NuGet.Server 3.4.3](https://github.com/NuGet/NuGet.Server/releases/tag/3.4.3) fixes an unauthenticated denial-of-service on the package upload endpoint (CWE-696/CWE-400) by moving API key validation ahead of the file I/O and package processing it used to do first.

## Releases

[Yarn 4.16.0](https://github.com/yarnpkg/berry/releases/tag/%40yarnpkg%2Fcli%2F4.16.0) adds `yarn npm stage` for npm's staged publishing queue, alongside editor SDK support for oxc's formatter and linter.

[Hatch 1.17.0](https://github.com/pypa/hatch/releases/tag/hatch-v1.17.0) deprecates `hatch fmt` in favour of a new `hatch check` command group with `code`, `fmt`, and `types` subcommands. Type checking is wired up to Pyrefly. The release also adds `hatch env lock` for locking environments and switches the HTTP client from httpx to httpx2.

[NixOS 26.05 "Yarara"](https://nixos.org/blog/announcements/2026/nixos-2605/) is the latest six-monthly release of Nixpkgs and NixOS. The Nixpkgs side added 20,442 new packages and updated 20,641 since 25.11, and dropped 17,532. This is also the final release with `x86_64-darwin` support, since upstream Apple has deprecated the platform.

[Stack 3.11.0.1 RC](https://github.com/commercialhaskell/stack/releases/tag/rc%2Fv3.11.0.1) switches the default 64-bit Windows MSYS environment from MINGW64 to CLANG64, following the MSYS2 project's deprecation of MINGW64 in March.

[Dependabot Core 0.380.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.380.0) adds a lockfile generator for bun via PR [#14882](https://github.com/dependabot/dependabot-core/pull/14882). The same release passes `--config.minimumReleaseAge=0` to pnpm security updates, bypassing any `pnpm-workspace.yaml` cooldown setting so security PRs aren't blocked behind the release-age policy.

[mise 2026.6.0](https://github.com/jdx/mise/releases/tag/v2026.6.0) wires npm into Corepack when `node.corepack=true` and `node.npm_shim=false`, so the Corepack-managed npm shim sits alongside yarn and pnpm, and aligns aqua's Windows extension handling with upstream.

[Windows Package Manager 1.29.250](https://github.com/microsoft/winget-cli/releases/tag/v1.29.250) is the 1.29 release candidate. Sources can now be assigned a numeric priority (experimental). When several sources offer the same package, installs prefer the higher-priority source without prompting. Export and import round-trip override and custom installer arguments, and the MCP server gained upgrade actions.

Also out: [Cargo 0.97.1](https://github.com/rust-lang/cargo/releases/tag/0.97.1), [uv 0.11.19](https://github.com/astral-sh/uv/releases/tag/0.11.19), [pip 26.1.2](https://github.com/pypa/pip/releases/tag/26.1.2), [Conda 26.5.2](https://github.com/conda/conda/releases/tag/26.5.2), [Mamba 2.8.0](https://github.com/mamba-org/mamba/releases/tag/2.8.0), [pixi 0.70.1](https://github.com/prefix-dev/pixi/releases/tag/v0.70.1), [pnpm 11.5.2](https://github.com/pnpm/pnpm/releases/tag/v11.5.2), [pipx 1.14.0](https://github.com/pypa/pipx/releases/tag/1.14.0), [Deno 2.8.2](https://github.com/denoland/deno/releases/tag/v2.8.2), [Homebrew 5.1.15](https://github.com/Homebrew/brew/releases/tag/5.1.15), [Docker Engine 29.5.3](https://github.com/moby/moby/releases/tag/docker-v29.5.3), [Go 1.25.11](https://github.com/golang/go/releases/tag/go1.25.11), [Go 1.26.4](https://github.com/golang/go/releases/tag/go1.26.4), [sbt 2.0.0-RC14](https://github.com/sbt/sbt/releases/tag/v2.0.0-RC14), [cargo-semver-checks 0.48.0](https://github.com/obi1kenobi/cargo-semver-checks/releases/tag/v0.48.0).

## Articles

[Where does the money come from?](https://ddbeck.com/where-does-the-money-come-from/) (Daniel D. Beck) is a catalogue of every channel he knows that gets technical-documentation authors and maintainers paid, from foundation grants and staff tech-writer roles to docs-for-hire arrangements and tip jars.

[How OSPOs can measure the impact of OSS funding](https://fastwonderblog.com/2026/06/02/how-ospos-can-measure-the-impact-of-oss-funding/) (Dawn Foster) is the case OSPOs can make internally when budgets tighten and the funded projects don't translate directly into product revenue. Dawn also has a [four-page piece in IEEE Computer](https://doi.org/10.1109/MC.2026.3667269) on how governance choices shape open source project sustainability, aimed at project leads.

The [Rust Foundation Maintainers Fund](https://blog.rust-lang.org/2026/06/02/launching-the-rust-foundation-maintainers-fund/) launched this week as a "Maintainer in Residence" programme that pays existing Rust Project maintainers from a donor-funded pool.

[Rendering a lock file with pipdeptree](https://pipdeptree.readthedocs.io/en/latest/tutorial/getting-started.html#render-a-lock-file) is a new tutorial for the `from-lock` subcommand, which prints the dependency tree of a PEP 751 lock file offline without resolving or installing anything.

The [Reproducible Builds May 2026 report](https://reproducible-builds.org/reports/2026-05/) leads with [Debian's decision](https://lists.debian.org/debian-devel-announce/2026/05/msg00001.html) to require reproducibility for packages migrating into the next release ("forky"), blocking unreproducible packages from migration.

## Papers

[Poking Around in the Dark: Why a Shared Understanding of Components Matters](https://arxiv.org/abs/2606.02442) (Reichmann et al., arXiv) finds that SBOM generators disagree on what counts as a component in the same software, leaving gaps in supply-chain vulnerability identification.

[PyFEX: Uncovering Evasive Python-based Threats via Resilient and Exhaustive Path Exploration](https://arxiv.org/abs/2606.02196) (Wang et al., arXiv) is a forced-execution engine for Python that recovers from crashes mid-run and flagged 212 previously unknown malicious uploads on PyPI.

## Elsewhere

[crates.io PR #13855](https://github.com/rust-lang/crates.io/pull/13855) proposes surfacing standard-library replacements on crate pages: a banner on the crate page and a marker in dependency lists, each linking to the `std` API that covers what the crate did. Seeded with `lazy_static`, `once_cell`, `matches`, and `num_cpus`. The PR cites my [features everyone should steal from npmx](/2026/04/16/features-everyone-should-steal-from-npmx.html) post as one of the inspirations.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
