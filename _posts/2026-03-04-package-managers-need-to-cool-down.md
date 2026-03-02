---
layout: post
title: "Package Managers Need to Cool Down"
date: 2026-03-04 10:00 +0000
description: "A survey of dependency cooldown support across package managers and update tools."
tags:
  - package-managers
  - security
  - ecosystems
  - deep-dive
---

This post was requested by [Seth Larson](https://sethmlarson.dev/), who asked if I could do a breakdown of dependency cooldowns across package managers. His framing: all tools should support a globally-configurable `exclude-newer-than=<relative duration>` like `7d`, to bring the response times for autonomous exploitation back into the realm of human intervention.

When an attacker compromises a maintainer's credentials or takes over a dormant package, they publish a malicious version and wait for automated tooling to pull it into thousands of projects before anyone notices. William Woodruff made the case for [dependency cooldowns](https://blog.yossarian.net/2025/11/21/We-should-all-be-using-dependency-cooldowns) in November 2025, then followed up with a [redux](https://blog.yossarian.net/2025/12/13/cooldowns-redux) a month later: don't install a package version until it's been on the registry for some minimum period, giving the community and security vendors time to flag problems before your build pulls them in. Of the ten supply chain attacks he examined, eight had windows of opportunity under a week, so even a modest cooldown of seven days would have blocked most of them from reaching end users.

The concept goes by different names depending on the tool (`cooldown`, `minimumReleaseAge`, `stabilityDays`, `exclude-newer`) and implementations vary in whether they use rolling durations or absolute timestamps, whether they cover transitive dependencies or just direct ones, and whether security updates are exempt. But the adoption over the past year has been remarkably fast.

### JavaScript

The JavaScript ecosystem moved on this faster than anyone else, with [pnpm](https://pnpm.io/supply-chain-security) shipping `minimumReleaseAge` in version 10.16 in September 2025, covering both direct and transitive dependencies with a `minimumReleaseAgeExclude` list for packages you trust enough to skip. [Yarn](https://github.com/yarnpkg/berry/pull/6901) shipped `npmMinimalAgeGate` in version 4.10.0 the same month (also in minutes, with `npmPreapprovedPackages` for exemptions), then [Bun](https://bun.com/docs/runtime/bunfig) added `minimumReleaseAge` in version 1.3 in October 2025 via `bunfig.toml`. [npm](https://socket.dev/blog/npm-introduces-minimumreleaseage-and-bulk-oidc-configuration) took longer but shipped `min-release-age` in version 11.10.0 in February 2026. [Deno](https://github.com/denoland/deno/issues/30751) has `--minimum-dependency-age` for `deno update` and `deno outdated`. Five package managers in six months, which I can't think of a precedent for in terms of coordinated feature adoption across competing tools.

### Python

[uv](https://docs.astral.sh/uv/concepts/resolution/) has had `--exclude-newer` for absolute timestamps since early on and added relative duration support (e.g. `1 week`, `30 days`) in version 0.9.17 in December 2025, along with per-package overrides via `exclude-newer-package`. pip shipped [`--uploaded-prior-to`](https://ichard26.github.io/blog/2026/01/whats-new-in-pip-26.0/) in version 26.0 in January 2026, though it only accepts absolute timestamps and there's an [open issue](https://github.com/pypa/pip/issues/13674) about adding relative duration support.

### Ruby

Bundler and RubyGems have no native cooldown support, but [gem.coop](https://gem-coop.github.io/gem.coop/updates/4/), a community-run gem server, launched a cooldowns beta that enforces a 48-hour delay on newly published gems served from a separate endpoint. Pushing the cooldown to the index level rather than the client is interesting because any Bundler user pointed at the gem.coop endpoint gets cooldowns without changing their tooling or workflow at all.

### Rust, Go, PHP, .NET

These ecosystems are still in the discussion phase. Cargo has an [open issue](https://github.com/rust-lang/cargo/issues/15973), and in the meantime there's [cargo-cooldown](https://crates.io/crates/cargo-cooldown), a third-party wrapper that enforces a configurable cooldown window on developer machines as a proof-of-concept (CI pipelines are expected to keep using plain Cargo against committed lockfiles). Go has an [open proposal](https://github.com/golang/go/issues/76485) for `go get` and `go mod tidy`, Composer has [two](https://github.com/composer/composer/issues/12552) [open](https://github.com/composer/composer/issues/12633) issues, and NuGet has an [open issue](https://github.com/NuGet/Home/issues/14657) though .NET projects using Dependabot already get cooldowns on the update bot side since Dependabot [expanded NuGet support](https://github.blog/changelog/2025-07-29-dependabot-expanded-cooldown-and-package-manager-support/) in July 2025.

### Dependency update tools

[Renovate](https://docs.renovatebot.com/key-concepts/minimum-release-age/) has had `minimumReleaseAge` (originally called `stabilityDays`) for years, long before the rest of the ecosystem caught on, adding a "pending" status check to update branches until the configured time has passed. [Mend Renovate 42](https://www.mend.io/blog/secure-npm-ecosystem-with-mend-renovate/) went a step further and made a 3-day minimum release age the default for npm packages in their "best practices" config via the `security:minimumReleaseAgeNpm` preset, making cooldowns opt-out rather than opt-in for their users. [Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference) shipped cooldowns in July 2025 with a `cooldown` block in `dependabot.yml` supporting `default-days` and per-semver-level overrides (`semver-major-days`, `semver-minor-days`, `semver-patch-days`), with security updates bypassing the cooldown. [Snyk](https://docs.snyk.io/scan-with-snyk/pull-requests/snyk-pull-or-merge-requests/upgrade-dependencies-with-automatic-prs-upgrade-prs/upgrade-open-source-dependencies-with-automatic-prs) takes the most aggressive stance with a built-in non-configurable 21-day cooldown on automatic upgrade PRs. [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) added a `--cooldown` parameter that accepts duration suffixes like `7d` or `12h`.

### Checking your config

[zizmor](https://docs.zizmor.sh/audits/) added a `dependabot-cooldown` audit rule in version 1.15.0 that flags Dependabot configs missing cooldown settings or with insufficient cooldown periods (default threshold: 7 days), with auto-fix support. [StepSecurity](https://www.stepsecurity.io/blog/introducing-the-npm-package-cooldown-check) offers a GitHub PR check that fails PRs introducing npm packages released within a configurable cooldown period. [OpenRewrite](https://docs.openrewrite.org/recipes/github/adddependabotcooldown) has an `AddDependabotCooldown` recipe for automatically adding cooldown sections to Dependabot config files. For GitHub Actions specifically, [pinact](https://github.com/suzuki-shunsuke/pinact) added a `--min-age` flag, and [prek](https://github.com/j178/prek) (a Rust reimplementation of pre-commit) added `--cooldown-days`.

### Gaps

Cargo, Go, Bundler, Composer, and pip don't have native cooldown support yet, which means you're relying on Dependabot or Renovate to enforce the delay. That covers automated updates, but nothing stops someone from running `cargo update` or `bundle update` or `go get` locally and pulling in a version that's been on the registry for ten minutes. I couldn't find any cooldown discussion at all for Maven, Gradle, Swift Package Manager, Dart's pub, or Elixir's Hex, if you know of one, let me know and I'll update this post. The feature also goes by at least ten different configuration names across the tools that do support it (`cooldown`, `minimumReleaseAge`, `min-release-age`, `npmMinimalAgeGate`, `exclude-newer`, `stabilityDays`, `uploaded-prior-to`, `min-age`, `cooldown-days`, `minimum-dependency-age`), which makes writing about it almost as hard as configuring it across a polyglot project.
