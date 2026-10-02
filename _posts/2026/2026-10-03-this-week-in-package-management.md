---
layout: post
title: "This Week in Package Management: 3 October 2026"
date: 2026-10-03 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week twenty of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[mise 2026.10.0](https://github.com/jdx/mise/releases/tag/v2026.10.0) requires keyless cosign bundles to match a pinned signer identity and stops GitHub attestation workflow checks accepting partial matches. [2026.9.18](https://github.com/jdx/mise/releases/tag/v2026.9.18) added an `include` key that lets `mise.toml` pull a shared config fragment from a git repository or OCI registry, limited to tools, env, vars, hooks and aliases, with paranoid mode requiring a full commit sha or OCI digest.

[npm 12.2.0](https://github.com/npm/cli/releases/tag/v12.2.0) accepts OIDC authentication for `npm dist-tag`, previously token-only. On the registry side, trusted publishing configurations now have an [opt-in dist-tag permission](https://github.blog/changelog/2026-09-30-opt-in-dist-tag-permissions-for-npm-trusted-publishing), off by default, so a workflow can manage `latest`, `next` and similar tags without a long-lived token.

[pnpm 12.8](https://pnpm.io/blog/releases/12.8) warns when `pnpm pack` or `pnpm publish` would put a `.env` or `.env.*` file in the tarball when the `files` field of `package.json` omits it. Templates such as `.env.example` are exempt.

[RubyGems 4.0.22](https://blog.rubygems.org/2026/09/30/4.0.22-released.html) keeps credentials on redirects only within the same origin. It also validates the `version` field in `Gem::Installer#verify_spec` and adds a `--source` option to `gem exec`.

[OpenTofu 1.13.0](https://github.com/opentofu/opentofu/releases/tag/v1.13.0) ships official Windows on ARM64 packages and adds functions that reduce unknown values during planning by letting module authors assert facts beyond what OpenTofu infers. Two experiments ship with it: built-in linting, and "symbol libraries", a reusable collection of values, functions and type aliases importable from the same sources as modules. This is the last series with 32 bit CPU releases, and it drops the WinRM provisioner.

[Scoop 0.6.0](https://github.com/ScoopInstaller/Scoop/releases/tag/v0.6.0) searches the bucket's git history for a versioned manifest when installing `app@version`, and auto-generates one from `autoupdate` only if that search fails. `checkver` GitHub mode now needs an explicit `github:` key to opt into the GitHub token path, the GitHub `checkver` defaults for `jsonpath` and `regex` have changed, and new installs write `scoop-install.json` and `scoop-manifest.json`, so an app's own `install.json` and `manifest.json` are preserved.

[Conan 2.33.0](https://github.com/conan-io/conan/releases/tag/2.33.0) supports CPS component configurations and takes CPEs for a component through `extra_info`. A new `core.net.http:trust_store` conf verifies HTTPS certificates against the OS trust store, remotes accept a `force_auth` capability, and recipe and package metadata now download in parallel with regular files, where they previously downloaded afterwards. Python 3.7 support is removed.

[Git 2.56.0](https://github.com/git/git/releases/tag/v2.56.0) adds `create`, `delete`, `update` and `rename` subcommands to `git refs`, and a `promisor.acceptFromServerURL` setting that governs whether the other side may add to the list of promisor remotes. The experimental `git history` command adds a `drop` subcommand, which removes a commit and replays its descendants onto the parent.

[Rust 1.99.0](https://blog.rust-lang.org/2026/10/01/Rust-1.99.0/) ships Cargo 0.100.0, which disables incremental compilation by default when the `CI` environment variable is set and adds a built-in `debug` profile ahead of moving the `dev` profile toward faster iteration defaults.

[conda 26.9.0](https://github.com/conda/conda/releases/tag/26.9.0) schedules implicit installation of pip alongside Python for deprecation. It stays enabled in this release and becomes deprecated in 27.3; `add_pip_as_python_dependency` defaults to false from 27.9. Environments that need pip should request it explicitly.

Also out:

- [Homebrew 7.0.7](https://github.com/Homebrew/brew/releases/tag/7.0.7)
- [pipx 1.17.9](https://github.com/pypa/pipx/releases/tag/1.17.9)
- [uv 0.12.22](https://github.com/astral-sh/uv/releases/tag/0.12.22)
- [pnpm 11.28.3](https://github.com/pnpm/pnpm/releases/tag/v11.28.3)
- [Athens 0.19.2](https://github.com/gomods/athens/releases/tag/v0.19.2)
- [Cabal 3.18.2.0](https://github.com/haskell/cabal/releases/tag/cabal-install-v3.18.2.0)
- [Pkg.jl 1.13.1](https://github.com/JuliaLang/Pkg.jl/releases/tag/v1.13.1)
- [Maven 3.10.0](https://github.com/apache/maven/releases/tag/maven-3.10.0)
- [sbt 2.1.0-M3](https://github.com/sbt/sbt/releases/tag/v2.1.0-M3)
- [Elm 0.19.3-beta](https://github.com/elm/compiler/releases/tag/0.19.3)
- [OpenTofu 1.12.7](https://github.com/opentofu/opentofu/releases/tag/v1.12.7)
- [Renovate 44.132.1](https://github.com/renovatebot/renovate/releases/tag/44.132.1)
- [Dependabot Core 0.398.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.398.0)

## Security

LuaRocks.org published an [incident report](https://luarocks.org/security-incident-september-2026) for a remote code execution in its rockspec parser. The parser called `loadstring` without restricting input to text mode, so an attacker could upload precompiled bytecode as a rockspec and escape the sandbox. The vulnerability was exploited between 9 July and 20 August, three malicious packages were uploaded on 7 August, and usernames, email addresses, bcrypt password hashes, API keys, 2FA secrets and GitHub linking tokens were exposed. LuaRocks.org has moved to new infrastructure, revoked all API keys and sessions, and removed the three packages. There is no evidence existing packages were modified.

[Flatpak 1.18.4](https://github.com/flatpak/flatpak/releases/tag/1.18.4) fixes six CVEs, each of which requires an already-installed malicious app. [1.19.2](https://github.com/flatpak/flatpak/releases/tag/1.19.2) includes the same fixes on the development branch.

- [CVE-2026-97023](https://github.com/flatpak/flatpak/security/advisories/GHSA-5p67-xh8x-rq54), privileged deletion of arbitrary files
- [CVE-2026-97024](https://github.com/flatpak/flatpak/security/advisories/GHSA-8xgq-v545-vgvf), privileged overwrite of arbitrary files with an empty file or a symlink to `/run/host/monitor/resolv.conf`
- [CVE-2026-97025](https://github.com/flatpak/flatpak/security/advisories/GHSA-7rvf-rqr3-43j4), an authentication token exposed to other users when downloading from an OCI repository that requires authentication
- [CVE-2026-97026](https://github.com/flatpak/flatpak/security/advisories/GHSA-r9w3-qx54-qvc8), loose permissions on temporary repository directories under `/var/tmp/flatpak-cache-*`
- [CVE-2026-97027](https://github.com/flatpak/flatpak/security/advisories/GHSA-v64f-hrwr-j4vh), `.desktop` and D-Bus `.service` files now filtered against an allowlist of fields to stop denial of service and unintended interactions with host services
- [CVE-2026-97029](https://github.com/flatpak/flatpak/security/advisories/GHSA-f3p8-vr7v-gxf2), signals sent to a process group that includes a parent outside the app, which kills the desktop environment

[Podman 6.1.3](https://github.com/podman-container-tools/podman/releases/tag/v6.1.3) and [5.8.8](https://github.com/podman-container-tools/podman/releases/tag/v5.8.8) fix [CVE-2026-94603](https://github.com/podman-container-tools/podman/security/advisories/GHSA-2cvf-wqm6-wr9g), where `podman run` on a checkpoint image, meaning any image carrying the `io.podman.annotations.checkpoint.runtime.name` annotation, could disable all sandboxing, including the sandboxing the user specified. Both releases remove support for running checkpoint images, on the grounds that checkpoints override user-specified security configuration and are difficult to run safely.

[Moby 25.0.18](https://github.com/moby/moby/releases/tag/v25.0.18) backports the fix for [CVE-2026-17106](https://nvd.nist.gov/vuln/detail/CVE-2026-17106), where the tar extraction routines in `moby/go-archive` allowed filesystem operations outside the destination directory, so anyone controlling an archive's contents could write to arbitrary paths. Docker Engine 29.7.0 and Docker Desktop 4.86.0 include the same fix.

[CVE-2026-92543](https://github.com/moby/moby/security/advisories/GHSA-7cfq-22r6-qp73), fixed in Docker Engine 29.8.2, let a DNS response that paired a loopback address with an attacker-controlled address make the engine treat a registry as insecure. The insecure-registry check matched on the loopback entry while the transport layer re-dialled the hostname, so pulls reached the attacker's server with certificate verification disabled. Digest pinning or signature verification blocks it.

Python [released](https://blog.python.org/2026/10/python-31022-31117/) 3.14.8, 3.13.16, 3.12.15, 3.11.17 and 3.10.22 with fixes for eight CVEs across tarfile, zipfile, SSL and urllib. 3.10.22 is the final 3.10 release. uv 0.12.22 bundles the new interpreters.

The mise releases above also close a trust bypass, where a `mise.toml` in an untrusted directory could put options inside a tool key, such as a `github:` key with `[api_url=...]` pointing at another host. mise treated the value as a plain version string, so it loaded the file before any trust check, and `mise ls`, `env`, `current`, `outdated`, `upgrade --dry-run` and `latest` then sent `GITHUB_TOKEN` to that host. Any tool key containing `[` now requires trust, and 2026.10.0 extends the same requirement to inline options in `.tool-versions`.

## Articles

[15 years of Packagist](https://blog.packagist.com/15-years-of-packagist-over-200-billion-package-installs/) counts from monolog/monolog becoming package ID 1 on 27 September 2011. Packagist now lists over 469,000 packages across 5.8 million versions, and installs have passed 201.6 billion, with more than 36 billion in 2026 so far, ahead of the 2025 total. It ran on a single personal server with 100 Mbps until April 2015, and served around 67 million installs a month by the move to AWS.

[One version per process](https://phpunit.expert/articles/one-version-per-process.html) (Sebastian Bergmann) works through what PHP's one-definition-per-name rule does to Composer: every dependency resolves to a single version, and whoever introduced a conflict has to resolve it. Bergmann argues that is why PHP dependency lists stay short and version ranges stay wide. PHPUnit's PHAR works around the rule with php-scoper, which renames bundled namespaces so `SebastianBergmann\Exporter` becomes `PHPUnitPHAR\SebastianBergmann\Exporter`.

[Don't couple your Go code to GitHub](https://iain.rocks/blog/dont-couple-your-go-code-to-github) (Iain Cambridge) argues for vanity module paths over `github.com/...` imports. A domain the author controls serves a `go-import` meta tag pointing at the current host, so moving the repository changes one meta tag instead of every consumer's import statements. The example configures nginx to redirect browsers to GitHub while serving the meta tag to the Go toolchain.

Seth Larson published [more than ten posts](https://blog.python.org/2026/09/language-summit-2026/) from the Python Language Summit 2026, held at EuroPython in Kraków. The [namespaces session](https://blog.python.org/2026/09/language-summit-2026-namespaces/) is the one for packaging readers: Pablo Galindo Salgado proposed a `std` namespace for the standard library, so `import std.json` would work while `import json` keeps working indefinitely. Part of the motivation is that new stdlib module names must differ from names already taken on PyPI. `tomllib`, `graphlib` and `zoneinfo` were named that way for this reason. The session left open whether new modules should be reachable only under `std`.

## Elsewhere

The PHP Foundation [opened applications](https://thephp.foundation/blog/2026/09/30/applications-for-2027-are-open/) for 2027 contractor positions across its core development areas. The form closes on 20 October 2026.

GitHub added [per-user daily rate limits](https://github.blog/changelog/2026-10-01-rate-limits-for-private-vulnerability-reports/) on private vulnerability reports, with a repository-level trusted-reporter allowlist, and [structured report forms](https://github.blog/changelog/2026-10-01-structured-forms-for-private-vulnerability-reports/) configured through `.github/VULNERABILITY_REPORT.yml` using issue-form syntax.

## git-pkgs

I tagged 17 repos this week:

- [codemeta v0.3.0](https://github.com/git-pkgs/codemeta/releases/tag/v0.3.0) (new), a zero-dependency Go library for parsing `codemeta.json` and validating software metadata, which preserves source positions, unknown fields and numeric spelling
- [peek v0.1.0](https://github.com/git-pkgs/peek/releases/tag/v0.1.0) (new), which extracts explicit claims such as an `SPDX-License-Identifier` line from files and from bounded file prefixes, including the roughly 1 KB prefixes in Software Heritage exports
- [archives v0.8.1](https://github.com/git-pkgs/archives/releases/tag/v0.8.1)
- [brief v0.14.0](https://github.com/git-pkgs/brief/releases/tag/v0.14.0)
- [clone v0.7.5](https://github.com/git-pkgs/clone/releases/tag/v0.7.5)
- [enrichment v0.7.2](https://github.com/git-pkgs/enrichment/releases/tag/v0.7.2)
- [forge v0.10.1](https://github.com/git-pkgs/forge/releases/tag/v0.10.1)
- [licenses v0.9.0](https://github.com/git-pkgs/licenses/releases/tag/v0.9.0)
- [magic v0.5.0](https://github.com/git-pkgs/magic/releases/tag/v0.5.0)
- [manifests v0.12.3](https://github.com/git-pkgs/manifests/releases/tag/v0.12.3)
- [outline v0.2.3](https://github.com/git-pkgs/outline/releases/tag/v0.2.3)
- [proxy v0.9.0](https://github.com/git-pkgs/proxy/releases/tag/v0.9.0)
- [registries v0.9.3](https://github.com/git-pkgs/registries/releases/tag/v0.9.3)
- [roles v0.1.3](https://github.com/git-pkgs/roles/releases/tag/v0.1.3)
- [sarif v0.1.3](https://github.com/git-pkgs/sarif/releases/tag/v0.1.3)
- [scan v0.1.1](https://github.com/git-pkgs/scan/releases/tag/v0.1.1)
- [vers v0.7.2](https://github.com/git-pkgs/vers/releases/tag/v0.7.2)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
