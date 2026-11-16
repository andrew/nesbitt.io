---
layout: post
title: "This Week in Package Management: 21 November 2026"
date: 2026-11-21 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
  - twipm
---

This week's package management news, gathered from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml), my posts and boosts on [Mastodon](https://mastodon.social/@andrewnez), and anything people sent me. Version control and forge news is in the Wednesday [This Week in Source Control](/2026/11/18/this-week-in-source-control.html) roundup.

## Releases

[RubyGems and Bundler 4.1.0](https://blog.rubygems.org/2026/11/16/4.1.0-released.html) add an `override` method to the Gemfile that rewrites the version constraints dependencies declare, transitive ones included. `override "foo", required_ruby_version: :ignore_upper` installs a gem whose `required_ruby_version` cap excludes the current Ruby. Cooldowns now work in the `gem` command too: `gem install --cooldown 7` skips versions published in the last seven days, and `gem` and Bundler each read the other's cooldown setting.

An opt-in credential store writes the `gem push` API key and Bundler's per-host credentials to the OS keychain instead of plain text files. The release also adds content addressable gems, with a `--content-addressable` flag on `gem build`, and ML-DSA support for signed gems ([summary of six changes](https://blog.rubygems.org/2026/11/16/whats-new-rubygems-bundler-4-1.html)).

[conda 26.10.0](https://conda.org/blog/2026-11-10-october-releases) makes Rattler the default solver for fresh installations and for upgrades without an explicit solver setting. `conda config --set solver libmamba` switches back to libmamba. The classic solver now ships as the separate `conda-pycosat-solver` plugin, and its built-in modules are scheduled for removal in 27.9. conda itself now requires Python 3.11 or newer to run.

[pip-tools 7.7.0](https://github.com/pypa/pip-tools/releases/tag/v7.7.0) is the first release since the project moved to the PyPA organisation. It spent nine years in Jazzband, which is shutting down. The release requires pip 26.2.2 or newer and drops Python 3.9. A new `stable` extra caps pip at the latest version tested in pip-tools CI. It also fixes a bug from 7.6.1 in how PyPI JSON API URLs were built, which made resolution slower.

Stephen Rosen [covers the release](https://sirosen.net/2026/11/15/pip-tools-770.html) and Sviatoslav Sydorenko [describes the move](https://webknjaz.me/prose/pip-tools-moves-to-pypa/). After the repository transfer, releases to the `pypi` deployment environment required approval from a Jazzband team until the environment was reconfigured to use a PyPA one.

[sbt 2.1.0](https://github.com/sbt/sbt/releases/tag/v2.1.0) removes Apache Ivy from its dependencies, including from publishing. The metabuild moves to Scala 3.9 LTS, so plugins published with sbt 2.1.0 work only on 2.1.x.

In [Docker Engine 29.10.0](https://github.com/moby/moby/releases/tag/docker-v29.10.0), setting `insecure-registries` in `daemon.json` or passing `--insecure-registry` replaces the implicit loopback exemption, and only the listed registries count as insecure. Pulls and pushes to a local registry over HTTP or with an untrusted certificate then require an explicit entry such as `localhost:5000`. Packages are now published for AlmaLinux, Oracle Linux and Rocky Linux.

[mise 2026.11.9](https://github.com/jdx/mise/releases/tag/v2026.11.9) adds lock pools, which give a task `lock` several slots, so a fixed number of tasks can use a limited resource such as CPU cores at once. `--deny-unix` and `--allow-unix` on `mise exec` and `mise run` block connections to Unix sockets such as an SSH agent or the container runtime socket, on Linux 7.1 or later.

[Homebrew 7.0.14](https://github.com/Homebrew/brew/releases/tag/7.0.14) vendors the `sigstore` gem and adds a `manifest_sha256` field to bottle blocks. It also generates RSS feed data for casks.

Also out: [Dependabot Core 0.405.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.405.0), [NuGet Client 8.2.0.14](https://github.com/NuGet/NuGet.Client/releases/tag/8.2.0.14).

## Elsewhere

[beer.drv.drv.drv](https://fzakaria.com/2026/11/14/beer-drv-drv-drv) (Farid Zakaria) uses Nix's experimental dynamic derivations to build a chain of 51 derivations, only the first of which exists at evaluation time. Each one outputs the next and prints a verse of 99 Bottles of Beer. Every step adds another `.drv` to the derivation name, and 50 bottles is the most that fits in a store path. He also found that `nix-store --query --deriver` returns `unknown-deriver` when the producing derivation is content-addressed, and filed [NixOS/nix#16823](https://github.com/NixOS/nix/issues/16823).

The maintainer of mpld3 opened [an issue looking for a new maintainer](https://github.com/mpld3/mpld3/issues/551), and an account replied offering to help. [His follow-up](https://github.com/mpld3/mpld3/issues/551#issuecomment-6914937892) links ten similar offers the same account posted to ten other repositories within a minute, three days earlier, and he has left a warning on each of them.

[Collaborations Workshop 2027](https://www.software.ac.uk/news/announcement-youve-been-waiting-collaborations-workshop-2027) runs from 20 to 22 April 2027 in Cambridge, with research software quality and sustainable maintenance and funding among its themes. Applications to join the judging panel and for the Emerging Voices financial support scheme close on 11 December.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
