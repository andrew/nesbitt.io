---
layout: post
title: "This Week in Package Management: 28 November 2026"
date: 2026-11-28 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
  - twipm
---

This week's package management news, gathered from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml), my posts and boosts on [Mastodon](https://mastodon.social/@andrewnez), and anything people sent me. Version control and forge news is in the Wednesday [This Week in Source Control](/2026/11/25/this-week-in-source-control.html) roundup.

## Security

Hex.pm [disclosed](https://hex.pm/blog/security-incident-on-hexpm) that on 23 November an attacker ran commands on its web servers through CVE-2026-129514. The decoder for the `application/vnd.hex+erlang` content type ran before routing and authentication, and accepted maps with a `__struct__` key. A crafted struct then reached error reporting code that applied a module, function and arguments taken from the request. The attacker sent 69 requests over 13 minutes before all six servers were replaced with a patched build.

The team checked packages and the database and found both unchanged. All 23 releases published during the incident match audit log entries, and package and registry files match their checksums. Database reads are not logged, so email addresses, bcrypt password hashes and 2FA secrets may have been read.

Hex users should change their password and reset 2FA, and until a Hex client release with a new signing system arrives in the coming days, the post advises fetching from repo.hex.pm rather than mirrors. Ash 3.38.0 fixes a related bug, CVE-2026-124283, where keyset pagination accepted crafted structs in client cursors.

[Composer 2.11.3](https://github.com/composer/composer/releases/tag/2.11.3) and [2.2.33](https://github.com/composer/composer/releases/tag/2.2.33) fix [GHSA-374h-4mh9-7rpm](https://github.com/composer/composer/security/advisories/GHSA-374h-4mh9-7rpm), a bypass of the fix for CVE-2024-24821. Running Composer in a directory with an attacker-prepared `composer.json` and vendor directory could execute code as the current user, even through read-only commands such as `composer validate`. Package descriptions, support links and licence names are also no longer rendered as console markup.

[pnpm 12.23.0](https://pnpm.io/blog/releases/12.23.0) and [11.29.0](https://pnpm.io/blog/releases/11.29.0) stop reading `otp` from config files, which a repository could use to leak `${NPM_TOKEN}` to its own registry. Both reject `file:` and `link:` dependencies declared by registry packages and send registry credentials only over HTTPS or loopback HTTP. `--minimum-release-age` is now also a command line option.

[12.24.0](https://pnpm.io/blog/releases/12.24.0) adds `pnpm audit deprecations` and `pnpm audit engines`, and fixes a parser differential: pnpm and npm could install different files from a tarball with a malformed PAX header. `pnpm edit`, `pnpm catalog migrate` and `pnpm link --hard` are new in 12.23.0, which also removes platform variants, so maintainers who publish them have to switch to `optionalDependencies`.

[Flatpak 1.18.6](https://github.com/flatpak/flatpak/releases/tag/1.18.6) fixes a bug where an app, runtime or extension with extra-data could create setuid root files on the host when installed ([CVE-2026-133842](https://github.com/flatpak/flatpak/security/advisories/GHSA-p4mw-6jfq-r82r)), and a sandbox escape through file descriptor passing in flatpak-portal ([CVE-2026-133845](https://github.com/flatpak/flatpak/security/advisories/GHSA-5jrj-948r-2wx6)).

[Docker Engine 29.10.1](https://github.com/moby/moby/releases/tag/docker-v29.10.1) fixes [CVE-2026-135124](https://github.com/moby/moby/security/advisories/GHSA-vfmq-r373-x89f), where a process in a running container could make a read-only bind mount writable during `docker cp` and have the copied files modify the host directory. It also fixes unbounded reads when parsing user, group and ID mapping files ([CVE-2026-135844](https://github.com/moby/sys/security/advisories/GHSA-ffh6-8jcg-cjmw)).

[uv 0.13.10](https://github.com/astral-sh/uv/releases/tag/0.13.10) fixes [GHSA-vjvj-3m3f-fgmm](https://github.com/astral-sh/uv/security/advisories/GHSA-vjvj-3m3f-fgmm), a low severity parser differential. A ZIP with a data descriptor and an understated compressed size in its central directory installed a full file under uv and a prefix of it under pip. uv now rejects archives where the two sizes differ. The release also validates that dependency requirements in `uv.lock` match the locked package versions.

## Releases

[mise 2026.11.12](https://github.com/jdx/mise/releases/tag/v2026.11.12) (now [2026.11.14](https://github.com/jdx/mise/releases/tag/v2026.11.14)) adds `mise audit`, which checks installed tool versions against OSV.dev and exits 1 on findings, and `mise upgrade --vulnerable`, which upgrades only the affected tools. 2026.11.14 adds an experimental `cache.sandbox` option that uses Landlock on Linux to fail a cached task when it reads or writes outside its cache declaration.

[pixi 0.85.0](https://github.com/prefix-dev/pixi/releases/tag/v0.85.0) renames the `platform` key in workspace platform definitions to `subdir`, with the old key still accepted under a deprecation warning. Dependencies on virtual packages can now use operators other than `>=`, and `pixi tree` has a `--json` flag. Lock files from older versions may need a fresh `pixi lock`.

The [winget 1.30](https://github.com/microsoft/winget-cli/releases/tag/v1.30.310) release candidate adds source priorities through `winget source add --priority`, an `--output-locale` option on every command, and `--ignore-unavailable` on `install` to continue when some packages are not found. An experimental setting shows numbered choices when several packages match a single-package command.

[Yarn 4.19.0](https://github.com/yarnpkg/berry/releases/tag/%40yarnpkg%2Fcli%2F4.19.0) prints registry notices from all commands that change registry state, isolates npm metadata caches by registry URL, and supports Node.js 28 in the PnP ESM loader.

[packaging 26.4](https://github.com/pypa/packaging/releases/tag/26.4) drops Python 3.9 and adds `prepare_environment()` and `Marker.evaluate_prepared()` for evaluating many markers against one environment. `VersionRange` adds `from_bounds()`, `snap_bounds()` and `relation()`. Henry Schreiner [reports](https://fosstodon.org/@henryiii/117668969672230026) that around 40 of the project's 46 benchmarks got faster.

[zizmor 1.33](https://docs.zizmor.sh/release-notes/#1330) adds a `dangerous-checkout` audit, which flags `actions/checkout` steps that set `allow-unsafe-pr-checkout: true`. The `impostor-commit` and `ref-confusion` audits now account for workflow lockfiles.

[Poetry 2.5.2](https://github.com/python-poetry/poetry/releases/tag/2.5.2) fixes `poetry install` building an sdist before checking it against its lock file hash.

[Homebrew 7.0.16](https://github.com/Homebrew/brew/releases/tag/7.0.16) enforces the attestation trust policy, and `brew info` now lists installed build dependents and labels incompatible formulae and casks.

[pipx 1.19.0](https://github.com/pypa/pipx/releases/tag/1.19.0) (now [1.19.1](https://github.com/pypa/pipx/releases/tag/1.19.1)) shows each environment's shell completions in `pipx list` and flags missing or misplaced completion files.

Also out:

- [RubyGems and Bundler 4.1.1](https://blog.rubygems.org/2026/11/25/4.1.1-released.html)
- [RubyGems and Bundler 4.0.25](https://blog.rubygems.org/2026/11/25/4.0.25-released.html)
- [OpenTofu 1.13.10](https://github.com/opentofu/opentofu/releases/tag/v1.13.10)
- [sbt 2.1.1](https://github.com/sbt/sbt/releases/tag/v2.1.1)
- [Podman 6.2.1](https://github.com/podman-container-tools/podman/releases/tag/v6.2.1)
- [Podman 5.8.11](https://github.com/podman-container-tools/podman/releases/tag/v5.8.11)
- [npm 10.9.11](https://github.com/npm/cli/releases/tag/v10.9.11)
- [Dependabot Core 0.406.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.406.0)
- [NuGet Client 8.2.0.25](https://github.com/NuGet/NuGet.Client/releases/tag/8.2.0.25)
- [norwegianblue 0.27.0](https://github.com/hugovk/norwegianblue/releases/tag/0.27.0)

## Articles

[Transparency log & first stage of organizations](https://blog.packagist.com/transparency-log-first-stage-of-organizations/) (Igor Benko, Packagist blog) describes an append-only public log of security-relevant events on Packagist: maintainers added or removed, packages transferred, versions created with their commit reference, and blocked attempts to change a reference. The work was funded by the Sovereign Tech Fund through the PHP Foundation.

Stable versions have been immutable since June, which the post says would have blocked the April attack that force-pushed a malicious commit behind the 5.0.2 tag of `intercom/intercom-php`. Organisations with individual member accounts are partly live. A tamper-evident design that would detect changes made through a compromised Packagist database is in development.

Nils Adermann and Jordi Boggiano's [SymfonyCon Warsaw slides](https://naderman.de/slippy/slides/2026-11-26-SymfonyCon-2026-Warsaw-Composer-and-Packagist-Supply-Chain-Security-Report-from-the-trenches.pdf) list the year's attacks on PHP packages and a 2027 roadmap. Alpha-Omega is funding artifact integrity work in five phases:

- Packagist stores Zstd archives of all tagged versions with checksums
- Composer verifies Sigstore signatures and build provenance
- Scoped API tokens with expiry
- Trusted Publishing from chosen CI workflows
- A `composer publish` command with staged releases approved by hardware key

FIDO2 security keys and passkeys are due on Packagist in the coming weeks. The funding slide lists 2026 running costs of about $1M and roadmap work of about $1.4M. Private Packagist and a sponsor programme launched in July each contribute around $500K. Packagist served 7.4 billion installs in October, up from 3.1 billion in October 2025.

[Content-Addressable Gems](https://blog.rubygems.org/2026/11/23/content-addressable-gems.html) (Jenny Shen, RubyGems blog) explains the RubyGems 4.1 feature where a precompiled gem is built for a single Ruby ABI and named by a prefix of its SHA-256, such as `rubydex-0.4.4-aff68219.gem`. A platform gem bundles one copy of the extension per Ruby. Maintainers can publish a build for a new Ruby under the existing version number. Lockfiles have new `CONTENT ADDRESSES` and `RUBY ABIS` sections, and older clients skip these gems.

[Securing Python projects from supply-chain attacks](https://astral.sh/blog/securing-from-supply-chain-attacks) (Konstantin Schütze, Astral) lists nine measures with the configuration for each. They include pinning GitHub Actions to full SHAs, Trusted Publishing behind an environment that requires approval, three-day dependency cooldowns in uv, Dependabot and Renovate, locking CI tools and scripts with `uv lock --script`, and `no-build = true` to install from wheels only.

[Needles, Haystacks, and Numbers Between 0 and 1](https://rustfoundation.org/media/needles-haystacks-and-numbers-between-0-and-1/) (Adam Harvey, Rust Foundation) reports on an experiment that scores every newly published crate file from 0.0 to 1.0 for whether it looks malicious. Humans review every flagged crate.

It scanned 135,548 crate files published between 11 and 21 November. Four crates scored 0.9 or higher and all four were malicious. Lowering the threshold to 0.35 flagged 332 crates, and the same four were the only malicious ones. A false-negative evaluation is planned for January 2027.

[GitHub's new "Security Advisory Permissions" feature](https://sethmlarson.dev/github-security-advisory-permissions-sustainability) (Seth Larson) describes the change from the Python Security Response Team's side, which was in the private beta. Before it, only repository admins could score severity, close duplicates, assign CVE IDs or publish an advisory, so triage fell to a few highly privileged people. Several PSRT members now triage more actively.

[Allowing Nix packages to override your version in Go](https://www.jvt.me/posts/2026/11/23/go-no-vcs/) (Jamie Tanna). Nix builds have no `.git` directory, so Go's VCS-derived build info is empty. He declares a `version` variable that packagers set with `-ldflags='-X main.version=1.2.3'` and falls back to `debug.ReadBuildInfo()` when it is unset.

[GitHub Actions accepts invalid YAML](https://yossarian.net/til/post/github-actions-accepts-invalid-yaml/) (William Woodruff). GitHub runs workflows containing a multi-line single-quoted scalar whose closing line is indented at the same level as its parent key, which YAML 1.2.2 forbids. zizmor rejected a real workflow for this, and he suspects a guard in YamlDotNet that only fixed the double-quoted form.

Farid Zakaria's [trynix.dev](https://fzakaria.com/2026/11/23/2035-came-early) now runs GUI programs from Nix packages, including Firefox, in a browser tab. It uses unkernel, a Linux kernel compiled to WebAssembly, so only user programs are emulated. [Browser tabs as a container runtime](https://fzakaria.com/2026/11/25/browser-tabs-as-a-container-runtime) builds an OCI runtime called tabc on the same base. `docker run --runtime tabc alpine` runs each container in a Chromium tab, with no Linux VM on macOS, at 11 to 36 times slower than runc.

## Elsewhere

[PEP 847](https://peps.python.org/pep-0847/), Problem Details for the Simple Repository API, was [accepted](https://discuss.python.org/t/pep-847-problem-details-for-the-simple-repository-api/108996/31) on 23 November. Indexes should send RFC 9457 JSON bodies with `Content-Type: application/problem+json` on error responses, so clients can show a specific reason for a failure. Hugo van Kemenade [notes](https://mastodon.social/@hugovk/117667756035295222) that it is the first PEP accepted by the new Python Packaging Council.

The Software Stewardship Lab [announced seven research programs](https://stewardshiplab.org/programs/), each funded through Open Collective. They include an annual report on maintainer well-being, a study of AI's effect on maintainers, work on Python's binary dependencies and on declaring non-Rust dependencies in Rust packages, an observatory for critical projects at risk of being unmaintained, and a growth fund for ecosyste.ms, which I run.

[What is an OSS Ecosystem Steward, and can we have one?](https://security.metacpan.org/presentations/lpw2026-ecosystem-steward/) (Salve J. Nilsen, London Perl & Raku Workshop) proposes a community-owned European cooperative to take the Cyber Resilience Act's open source steward role for CPAN. Manufacturers would pay subscriptions for attestations issued by maintainers and signed by the steward, with the money passed on to members.

[Considering open source viability for digital sovereignty](https://fastwonderblog.com/2026/11/23/considering-open-source-viability-for-digital-sovereignty/) (Dawn Foster) argues that swapping a proprietary vendor for single-vendor open source trades one dependency for another, and points to the CHAOSS practitioner guide on assessing viability.

Josh Bressers [talked to Sivana Hamer](https://opensourcesecurity.io/2026/2026-11-sivana-attestations/) about software attestations and in-toto on the Open Source Security podcast.

The Sovereign Tech Agency's [survey for the EU Sovereign Tech Fund pilot](https://survey.sovereign.tech/eustf) closes on 30 November. It asks respondents to name up to three important open source projects or technologies and say why they matter.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
