---
layout: post
title: "This Week in Package Management: 12 September 2026"
date: 2026-09-12 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week seventeen of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

## Releases

[pnpm 12.4](https://pnpm.io/blog/releases/12.4) can manage npm, Cargo, and Python dependencies in the same workspace: enable Cargo and Python in `pnpm-workspace.yaml` and one `pnpm install` handles all three, each from its own manifest, backed by pnpm's shared store, authentication, and offline cache. It also adds a `pnpm pipeline` command for CI-style task graphs and binaries for six more architectures. [12.4.1](https://github.com/pnpm/pnpm/releases/tag/v12.4.1) fixes installs on filesystems that refuse hard links or copy-on-write clones. On the 11.x line, [11.26](https://pnpm.io/blog/releases/11.26) backports `workspace:` ranges in catalogs, the trust-policy flags on `remove` and `update`, and `pnpm change check` for CI.

[RubyGems and Bundler 4.1.0.beta1](https://blog.rubygems.org/2026/09/09/4.1.0.beta1-released.html) adds content-addressable gem support, ML-DSA post-quantum signatures for the signed-gem workflow, an opt-in OS credential store for gem and bundler credentials, and a `--cooldown` flag on `gem install`, `update` and `outdated`.

[Pixi 0.80.0](https://github.com/prefix-dev/pixi/releases/tag/v0.80.0) adds experimental `conda-script` support: a comment header in a script file declares channels, dependencies, and an entrypoint, and Pixi solves and caches the environment then runs the script without a separate workspace, in the style of PEP 723 inline metadata extended to any language conda-forge covers.

[uv 0.12.13](https://github.com/astral-sh/uv/releases/tag/0.12.13) adds GraalPy 3.13.0 to the managed Python builds and verifies hashes when downloading PEP 658 metadata sidecars; full wheel downloads during resolution are now skipped when a hash from a direct URL fragment can be reused.

[mise 2026.9.5](https://github.com/jdx/mise/releases/tag/v2026.9.5) extends macOS bootstrap with `defaults_entries` blocks for setting system preferences and lets dotfiles and tasks vary by platform; complete lockfile generation is available as an opt-in trial.

[Stack 4.1.0.1 RC](https://github.com/commercialhaskell/stack/releases/tag/rc%2Fv4.1.0.1) is the first 4.x release candidate. The major-version bump is for cross-package Backpack support: Stack now generates the extra instantiation build steps Cabal requires when a package depends on an abstract interface provided by another.

[Terraform 1.17.0-beta1](https://github.com/hashicorp/terraform/releases/tag/v1.17.0-beta1) supports variables and locals in `required_providers` blocks and adds a `-minimal-refresh` planning option that only refreshes resources with proposed changes; Terraform Policy is now generally available.

[Gradle 9.8.0 RC1](https://github.com/gradle/gradle/releases/tag/v9.8.0-RC1) adds Java 27 support and reuses Maven `settings.xml` mirror configuration.

[winget 1.30.140-preview](https://github.com/microsoft/winget-cli/releases/tag/v1.30.140-preview) adds `--ignore-unavailable` to `install`, so a multi-package install continues past packages missing from the configured sources instead of failing outright.

Also out: [Helm 4.3.0](https://github.com/helm/helm/releases/tag/v4.3.0) and [3.22.0](https://github.com/helm/helm/releases/tag/v3.22.0), [Terraform 1.16.2](https://github.com/hashicorp/terraform/releases/tag/v1.16.2), [Poetry 2.4.3](https://github.com/python-poetry/poetry/releases/tag/2.4.3), [opam 2.6.0-rc1](https://github.com/ocaml/opam/releases/tag/2.6.0-rc1), [snapd 2.78](https://github.com/canonical/snapd/releases/tag/2.78), [Harbor 2.15.3-rc1](https://github.com/goharbor/harbor/releases/tag/v2.15.3-rc1), [Dependabot Core 0.395.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.395.0), [Renovate 44.82.0](https://github.com/renovatebot/renovate/releases/tag/44.82.0).

## Security

[Verdaccio 6.10.3](https://github.com/verdaccio/verdaccio/releases/tag/v6.10.3) stops fetching client-controlled `dist.tarball` URLs from hosts outside the configured uplinks, which previously could send an uplink `Authorization` header to an unrelated host; a locally published package now returns 404 and the off-uplink fetch is skipped.

RubyGems [posted an update](https://blog.rubygems.org/2026/09/11/update-may-spam-publishing-campaign.html) on the May spam-publishing campaign following research by Nightingale Collective reported in the Wall Street Journal: over 500 packages from newly registered accounts contained shared code for fetching public web data and stealing API keys. Nightingale attribute the activity to OpenAI agents; the RubyGems team says it can't confirm what created or published the packages.

## Elsewhere

The PHP internals RFC [End PEAR Endorsement](https://wiki.php.net/rfc/end_pear_endorsement) proposes unbundling PEAR from PHP 8.7 and replacing `pear.php.net` with a static archive scraped from the current site, since the PHP project lacks access to the PEAR infrastructure despite it running under a `php.net` subdomain and 534 of 603 packages are unmaintained. The CLI channel endpoints would stay working so existing installs keep resolving.

[Trusting-Trust Attack against an Entire Linux Distribution through Binary Manipulation](https://arxiv.org/abs/2607.24888) (Malka et al., arXiv) builds a complete Thompson-style attack around GNU `strip` in place of a compiler: a single compromised `strip` in the NixOS bootstrap seed propagates through successive rebuilds and ends up in nearly every binary of the finished graphical installer.

GitHub Actions added a [`cache-mode`](https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode/) setting at the workflow and job level with `read`, `write`, `write-only` and `none` options, so a job that only needs to restore a cache can be prevented from writing one back, which cuts off one cache-poisoning path.

Voting for the inaugural [Python Packaging Council](https://www.python.org/nominations/elections/2026-python-packaging-council/nominees/) is open until 15 September, with nineteen candidates standing.

The FOSDEM 2027 [call for devrooms](https://fosdem.org/2027/news/call-for-devrooms/) is open, and [Git 2.56.0-rc0](https://github.com/git/git/releases/tag/v2.56.0-rc0) was tagged.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
