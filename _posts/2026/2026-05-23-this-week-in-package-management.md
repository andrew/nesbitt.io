---
layout: post
title: "This Week in Package Management: 23 May 2026"
date: 2026-05-23 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mnklps5cmz2s"
---

I'm trying out a weekly roundup built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez).

npm is [removing `npm-shrinkwrap.json` entirely](https://github.com/npm/cli/releases/tag/libnpmversion-v9.0.0-pre.0.0) in the v12 prereleases. The command, the config alias, and the loader all gone; project-root shrinkwraps need renaming to `package-lock.json` and shipping a locked tree inside a tarball now means `bundleDependencies`.

## Security

[uv 0.11.15](https://github.com/astral-sh/uv/releases/tag/0.11.15) fixes two issues worth patching for: a [TAR parser differential](https://github.com/astral-sh/uv/pull/19463) and [entry points escaping the scripts directory](https://github.com/astral-sh/uv/security/advisories/GHSA-4gg8-gxpx-9rph). [0.11.16](https://github.com/astral-sh/uv/releases/tag/0.11.16) followed with `uv audit` now refusing locked installs that match known-malware records.

[Ruby 4.0.5](https://www.ruby-lang.org/en/news/2026/05/20/ruby-4-0-5-released/) shipped with a fix for CVE-2026-46727; anyone on 4.0.0 through 4.0.4 should update.

GitHub confirmed that around 4,000 of its own internal repositories were exfiltrated this week. [The Register reports](https://www.theregister.com/devops/2026/05/20/github-says-internal-repos-exfiltrated-after-poisoned-vs-code-extension-attack/5243206) the entry point was a poisoned VS Code extension and attributes it to TeamPCP, the group behind the Shai-Hulud worm.

The Nx team published a [postmortem of the Nx Console v18.95.0 compromise](https://nx.dev/blog/nx-console-v18-95-0-postmortem), another poisoned VS Code extension. The detail that stands out: the affected contributor had `minimum-release-age` set in `.npmrc`, but their pnpm was old enough to silently ignore the unknown key, so a 77-minute-old malicious package sailed through.

A [dependabot-core issue](https://github.com/dependabot/dependabot-core/issues/13078) points out that the cooldown setting can be bypassed by an attacker who controls the version timestamps, which is most of them. Worth knowing if you've been treating it as a security control rather than a noise filter.

## Releases

[Deno 2.8](https://deno.com/blog/v2.8) makes npm the default registry: `deno add` and `deno install` now treat an unprefixed name as an npm package, with `jsr:` becoming the thing you opt into. It also ships `deno pack` for turning a Deno or JSR project into an npm-publishable tarball, plus `deno ci`, `deno why`, `deno audit fix`, a pnpm-style `catalog:` protocol, optional hoisted `node_modules`, and `min-release-age` support in `.npmrc`. Hard not to read a direction of travel into that list.

[pnpm 11.2.2](https://github.com/pnpm/pnpm/releases/tag/v11.2.2) adds an opt-in preview where adding `@pnpm/pacquet` to `configDependencies` hands the materialisation phase of `pnpm install` to the Rust port. Resolution stays in pnpm; pacquet just fetches and links from the lockfile.

[conda 26.5.0](https://github.com/conda/conda/releases/tag/26.5.0) lands parser support for conditional dependencies, optional dependency groups, and variant flags from [CEP 164–166](https://github.com/conda/ceps).

[Composer 2.10.0-RC2](https://github.com/composer/composer/releases/tag/2.10.0-RC2) is out with a call for testers; `composer self-update --preview` to try it, `--stable` to bail.

[Homebrew 5.1.12](https://github.com/Homebrew/brew/releases/tag/5.1.12) adds `brew exec`, an npx-style launcher that finds which formula provides an executable and runs it. [5.1.13](https://github.com/Homebrew/brew/releases/tag/5.1.13) followed with RubyGems licence checking in audit.

[RubyGems and Bundler 4.0.12](https://github.com/ruby/rubygems/releases/tag/v4.0.12) tidy up `BUNDLE_VERSION` handling and add a warning when an indirect dependency might be confused with a direct one.

[Verdaccio 6.7.0](https://github.com/verdaccio/verdaccio/releases/tag/v6.7.0) bumps the Node baseline to 24 and starts soft-warning on older runtimes. [PDM 2.27.0](https://github.com/pdm-project/pdm/releases/tag/2.27.0) does the same for Python, now requiring 3.10.

## Articles

The Go team [announced an official pkg.go.dev API](https://go.dev/blog/pkgsite-api): stateless GET endpoints for modules, versions, symbols, vulnerabilities, and search. No more scraping the HTML.

npm [announced staged publishing and new install-source controls](https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/). `npm stage publish` uploads to a holding queue and a human with a 2FA challenge has to promote it before anyone can install. Alongside it, `--allow-file`, `--allow-remote`, and `--allow-directory` join `--allow-git` so you can lock installs to registry sources only; `--allow-git` flips to `none` by default in v12.

The NuGet blog wrote up [package pruning in .NET 10](https://devblogs.microsoft.com/dotnet/nuget-package-pruning-in-dotnet-10/), which trims transitive packages that the shared framework already provides and cuts the corresponding noise out of vulnerability reports.

Gábor Bernát posted his [Python Packaging Summit recap](https://bernat.tech/posts/pycon-us-2026-packaging-summit-recap/) from PyCon US, covering what got argued about in the room this year.

A Bloomberg-authored piece in [ACM Queue](https://spawn-queue.acm.org/doi/full/10.1145/3799738) argues that companies need to move from passive consumption to active stewardship of the open source they depend on.

The PHP Foundation [announced an Ecosystem Security Team](https://thephp.foundation/blog/2026/05/18/announcing-ecosystem-security-team/) funded by an Alpha-Omega grant. Packagist meanwhile has [malware filter list support live in Private Packagist](https://blog.packagist.com/whats-new-in-private-packagist-may-2026-update/) ahead of Composer 2.10.

Trail of Bits [wrote up several months of contributions to zizmor](https://blog.trailofbits.com/2026/05/22/we-hardened-zizmors-github-actions-static-analyzer/). A [typosquatting audit](https://github.com/zizmorcore/zizmor/pull/1985) for Actions references that I wrote also landed this week.

## Elsewhere

[pypitoken-cli](https://pypi.org/project/pypitoken-cli/) from Catherine takes an account-scoped PyPI token and narrows it to a package-scoped one from the command line.

[diffify](https://diffify.com/) shows what changed between two versions of a CRAN or PyPI package: function signatures, dependencies, namespace exports. [listen to PyPI](https://miketheman.github.io/listen-to-pypi/) plays a note for every upload to the index, in the [Listen to Wikipedia](http://listen.hatnote.com/) tradition.

Anil Madhavapeddy has been [resurrecting OCaml system packaging](https://anil.recoil.org/notes/oxcaml-packages) and writing up how it fits together.

The GitHub incident prompted an [open VS Code issue](https://github.com/microsoft/vscode/issues/272765) asking for cooldowns on extension auto-updates. The Dependabot bypass above is a useful read before treating that as solved.

## git-pkgs

I tagged [git-pkgs v0.16.1](https://github.com/git-pkgs/git-pkgs/releases/tag/v0.16.1) along with a bunch of new versions other repos in the git-pkgs org: [brief](https://github.com/git-pkgs/brief/releases/tag/v0.8.0), [proxy](https://github.com/git-pkgs/proxy/releases/tag/v0.4.0), [manifests](https://github.com/git-pkgs/manifests/releases/tag/v0.5.0), [registries](https://github.com/git-pkgs/registries/releases/tag/v0.6.1), [resolve](https://github.com/git-pkgs/resolve/releases/tag/v0.2.0), [forge](https://github.com/git-pkgs/forge/releases/tag/v0.5.1), [enrichment](https://github.com/git-pkgs/enrichment/releases/tag/v0.2.3), [spdx](https://github.com/git-pkgs/spdx/releases/tag/v0.1.4), [outline](https://github.com/git-pkgs/outline/releases/tag/v0.1.3), and [gitignore](https://github.com/git-pkgs/gitignore/releases/tag/v1.2.0).

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
