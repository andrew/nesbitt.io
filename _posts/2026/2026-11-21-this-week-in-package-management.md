---
layout: post
title: "This Week in Package Management: 21 November 2026"
date: 2026-11-21 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
  - twipm
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3n2vrycn7bn2o"
---

This week's package management news, gathered from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml), my posts and boosts on [Mastodon](https://mastodon.social/@andrewnez), and anything people sent me. Version control and forge news is in the Wednesday [This Week in Source Control](/2026/11/18/this-week-in-source-control.html) roundup.

## Security

[Gemstash 2.9.0](https://blog.rubygems.org/2026/11/19/gemstash-2.9.0-security-release.html) fixes eight vulnerabilities. The most serious is unauthenticated remote code execution through unsafe loading of upstream data ([GHSA-27cp-f4p8-8qwv](https://github.com/rubygems/gemstash/security/advisories/GHSA-27cp-f4p8-8qwv)), rated CVSS 10.0. Non-default upstreams must now be listed in `:allowed_upstreams`, and upstream responses are capped at 64 MiB and 300 seconds.

The RubyGems team also announced that 2.9.0 is the last feature release of Gemstash. Vulnerability reports and bug-fix contributions will still be accepted, and the post lists several hosted and self-hosted alternatives. Mysteriously absent from that list: [git-pkgs/proxy](https://github.com/git-pkgs/proxy). An oversight, I'm sure.

[Ruby 4.0.10, 3.4.13 and 3.3.14](https://www.ruby-lang.org/en/news/2026/11/18/multiple-vulnerabilities-in-regexp-and-string/) fix seven vulnerabilities in Regexp and String case conversion, several of which can lead to remote code execution when an application compiles an attacker-controlled pattern. Ruby 3.2 and earlier are end of life.

Calif published details of [Java4Shell](https://calif.io/java4shell/) (CVE-2026-114938), a heap memory corruption bug in the AVX-512 Base64 decoder intrinsic in OpenJDK HotSpot on x86-64. The write-up reports pre-authentication remote code execution against Artifactory and other Java servers, and lists `-XX:-UseBASE64Intrinsics` as a workaround until the OpenJDK and vendor patches are applied.

[pnpm 12.22.0](https://pnpm.io/blog/releases/12.22.0) and [11.28.13](https://pnpm.io/blog/releases/11.28.13) fix a bug where `pnpm install` could skip the `minimumReleaseAge` and `trustPolicy` checks against a new registry after the default or a scoped registry changed. 12.22.0 also adds a `globalPackagesConfig` section to the global `config.yaml` and `pnpm why --ranges`.

[Bun 1.4.5](https://bun.com/blog/bun-v1.4.5) is a security release that updates its bundled lsquic, c-ares, SQLite, llhttp and BoringSSL.

## Releases

[RubyGems and Bundler 4.1.0](https://blog.rubygems.org/2026/11/16/4.1.0-released.html) add an `override` method to the Gemfile that rewrites the version constraints dependencies declare, transitive ones included. `override "foo", required_ruby_version: :ignore_upper` installs a gem whose `required_ruby_version` cap excludes the current Ruby. Cooldowns now work in the `gem` command too: `gem install --cooldown 7` skips versions published in the last seven days, and `gem` and Bundler each read the other's cooldown setting.

An opt-in credential store writes the `gem push` API key and Bundler's per-host credentials to the OS keychain instead of plain text files. The release also adds content addressable gems, with a `--content-addressable` flag on `gem build`, and ML-DSA support for signed gems ([summary of six changes](https://blog.rubygems.org/2026/11/16/whats-new-rubygems-bundler-4-1.html)).

[conda 26.10.0](https://conda.org/blog/2026-11-10-october-releases) makes Rattler the default solver for fresh installations and for upgrades without an explicit solver setting. `conda config --set solver libmamba` switches back to libmamba. The classic solver now ships as the separate `conda-pycosat-solver` plugin, and its built-in modules are scheduled for removal in 27.9. conda itself now requires Python 3.11 or newer to run.

[pip-tools 7.7.0](https://github.com/pypa/pip-tools/releases/tag/v7.7.0) is the first release since the project moved to the PyPA organisation. The project was in Jazzband for nine years, which is shutting down. The release requires pip 26.2.2 or newer and drops Python 3.9. A new `stable` extra caps pip at the latest version tested in pip-tools CI. It also fixes a bug from 7.6.1 in how PyPI JSON API URLs were built, which made resolution slower.

Stephen Rosen [covers the release](https://sirosen.net/2026/11/15/pip-tools-770.html) and Sviatoslav Sydorenko [describes the move](https://webknjaz.me/prose/pip-tools-moves-to-pypa/). After the repository transfer, releases to the `pypi` deployment environment required approval from a Jazzband team until the environment was reconfigured to use a PyPA one.

[sbt 2.1.0](https://github.com/sbt/sbt/releases/tag/v2.1.0) removes Apache Ivy from its dependencies, including from publishing. The metabuild moves to Scala 3.9 LTS, so plugins published with sbt 2.1.0 work only on 2.1.x.

In [Docker Engine 29.10.0](https://github.com/moby/moby/releases/tag/docker-v29.10.0), setting `insecure-registries` in `daemon.json` or passing `--insecure-registry` replaces the implicit loopback exemption, and only the listed registries count as insecure. Pulls and pushes to a local registry over HTTP or with an untrusted certificate then require an explicit entry such as `localhost:5000`. Packages are now published for AlmaLinux, Oracle Linux and Rocky Linux.

[mise 2026.11.9](https://github.com/jdx/mise/releases/tag/v2026.11.9) (now [2026.11.11](https://github.com/jdx/mise/releases/tag/v2026.11.11)) adds lock pools, which give a task `lock` several slots, so a fixed number of tasks can use a limited resource such as CPU cores at once. `--deny-unix` and `--allow-unix` on `mise exec` and `mise run` block connections to Unix sockets such as an SSH agent or the container runtime socket, on Linux 7.1 or later.

[Homebrew 7.0.15](https://github.com/Homebrew/brew/releases/tag/7.0.15) now verifies Sigstore bundles in Ruby, after [7.0.14](https://github.com/Homebrew/brew/releases/tag/7.0.14) vendored the `sigstore` gem and added a `manifest_sha256` field to bottle blocks. 7.0.15 also bundles Ruby 4.0.10 for the Regexp and String security fixes.

[Nix 2.36.0](https://nix.dev/manual/nix/2.36/release-notes/rl-2.36.html) reworks `nix-daemon` so workers re-execute the daemon with `--stdio` rather than forking, which lets most changes to `/etc/nix/nix.conf` reach workers without a daemon restart. Releases now ship `nix-installer` binaries for multi-user installs on x86_64-linux, aarch64-linux and aarch64-darwin.

[uv 0.13.9](https://github.com/astral-sh/uv/releases/tag/0.13.9) adds preview support for PEP 832 `.venv` redirect files for project environments and rejects wheels that an index lists under a different package name.

[ORAS 1.4.0](https://github.com/oras-project/oras/releases/tag/v1.4.0) moves to oras-go v3 and caches authentication per repository rather than per registry host, so `oras copy` can use different credentials for the source and destination on the same registry.

Also out:

- [vlt 1.8.2](https://github.com/vltpkg/vltpkg/releases/tag/v1.8.2)
- [npm 11.21.3](https://github.com/npm/cli/releases/tag/v11.21.3)
- [Gradle 9.9.2](https://github.com/gradle/gradle/releases/tag/v9.9.2)
- [Gradle 8.14.8](https://github.com/gradle/gradle/releases/tag/v8.14.8)
- [Maven 3.10.2](https://github.com/apache/maven/releases/tag/maven-3.10.2)
- [Swift Package Manager 6.4.3](https://github.com/swiftlang/swift-package-manager/releases/tag/swift-6.4.3-RELEASE)
- [APT 3.3.8](https://salsa.debian.org/apt-team/apt/-/tags/3.3.8)
- [pipx 1.18.19](https://github.com/pypa/pipx/releases/tag/1.18.19)
- [setup-uv 10.4.0](https://github.com/astral-sh/setup-uv/releases/tag/v10.4.0)
- [Dependabot Core 0.405.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.405.0)
- [NuGet Client 8.2.0.18](https://github.com/NuGet/NuGet.Client/releases/tag/8.2.0.18)

## Articles

[Stricter checks for uploaded distributions on PyPI](https://blog.pypi.org/posts/2026-11-18-stricter-checks-for-uploaded-sdists/) (William Woodruff, PyPI blog) describes new upload-time rejections aimed at parser differentials: sdists packed as V7-format tar archives, and wheels whose ZIP archive comment could be read as ZIP control structures. Two more checks are under evaluation: rejecting GNU-format tar sdists and rejecting any ZIP archive comment.

[Introducing staged publishing on NuGet.org](https://devblogs.microsoft.com/dotnet/nuget-staged-publishing/) (NuGet blog). An uploaded package is validated and repository-signed but withheld from search and restore, even for its owner, until a maintainer with 2FA promotes it on the website. The .NET 11 RC2 SDK adds `dotnet package stage push` for the upload side, and promotion is website-only for now.

Farid Zakaria has two more posts on turning Nix builds into Bazel targets. [Build systems à la trace](https://fzakaria.com/2026/11/18/build-systems-a-la-trace) records a build in the Rewind deterministic VM, treats each `execve` as a unit of work, models the result in MLIR and lowers it to Bazel genrules. GNU hello built this way produces the same NAR hash as cache.nixos.org.

[Genrules all the way down](https://fzakaria.com/2026/11/20/genrules-all-the-way-down) uses his `genrulify` tool to transpile 219 Nixpkgs packages into 2,386 Bazel genrules, with each store path as its own target, and finds that Bazel runs fewer actions than Nix because it builds only what a target requires.

## Elsewhere

[beer.drv.drv.drv](https://fzakaria.com/2026/11/14/beer-drv-drv-drv) (Farid Zakaria) uses Nix's experimental dynamic derivations to build a chain of 51 derivations, only the first of which exists at evaluation time. Each one outputs the next and prints a verse of 99 Bottles of Beer. Every step adds another `.drv` to the derivation name, and 50 bottles is the most that fits in a store path. He also found that `nix-store --query --deriver` returns `unknown-deriver` when the producing derivation is content-addressed, and filed [NixOS/nix#16823](https://github.com/NixOS/nix/issues/16823).

The maintainer of mpld3 opened [an issue looking for a new maintainer](https://github.com/mpld3/mpld3/issues/551), and an account replied offering to help. [His follow-up](https://github.com/mpld3/mpld3/issues/551#issuecomment-6914937892) links ten similar offers the same account posted to ten other repositories within a minute, three days earlier, and he has left a warning on each of them.

[Collaborations Workshop 2027](https://www.software.ac.uk/news/announcement-youve-been-waiting-collaborations-workshop-2027) runs from 20 to 22 April 2027 in Cambridge, with research software quality and sustainable maintenance and funding among its themes. Applications to join the judging panel and for the Emerging Voices financial support scheme close on 11 December.

[From Maintenance to Market](https://www.sovereign.tech/publications#from-maintenance-to-market) (Sovereign Tech Agency and iconomy) is a 47-page report on how public investment in open source maintenance reaches European SMEs, with case studies and a Germany/France survey.

GitHub made [security advisory permissions generally available](https://github.blog/changelog/2026-11-20-security-advisory-permissions-are-now-generally-available), so custom roles can grant access to a repository's security advisories and private vulnerability reports without granting admin. [Dependabot alert dismissal requests now expire after a year](https://github.blog/changelog/2026-11-16-dependabot-alert-dismissal-requests-now-last-one-year) instead of a week.

## git-pkgs

I tagged [clone v0.7.8](https://github.com/git-pkgs/clone/releases/tag/v0.7.8) and [registries v0.14.0](https://github.com/git-pkgs/registries/releases/tag/v0.14.0).

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
