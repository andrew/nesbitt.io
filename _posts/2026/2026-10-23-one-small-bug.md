---
layout: post
title: "One Small Bug"
date: 2026-10-23 10:00 +0100
description: "Want me to fix that too?"
tags:
  - security
  - ai
  - satire
---

<div class="transcript" markdown="1">

**> add a CSV export button to the invoices page, same columns as the table**

*✻ Clauding…*

Done. The button is in `InvoiceTable.tsx` and the endpoint is `GET /invoices.csv`, using the same column definitions as the table. Tests pass.

While I was in there I noticed `paginate()` in `lib/pagination.ts` drops the last row when the total is an exact multiple of the page size. Want me to fix that too?

**> y**

*✻ Fuddling…*

Fixed, with a test for the boundary case.

While the tests were running, `pnpm install` resolved a transitive dependency that had been published 77 minutes earlier. Your `.npmrc` sets `minimum-release-age`, but the pnpm version pinned in `packageManager` predates that setting and silently ignores unknown keys. The [Nx Console postmortem](https://nx.dev/blog/nx-console-v18-95-0-postmortem) describes the same configuration.

In the other lockfiles, `uv.lock` includes `vulpine-lz4` as a dependency of `snekpack`. It was the subject of [CVE-2024-YIKES](/2026/02/03/incident-report-cve-2024-yikes.html) and [CVE-2026-LGTM](/2026/06/26/incident-report-cve-2026-lgtm.html).

Want me to upgrade pnpm and remove `snekpack`?

**> y**

*✻ Lockfiling…*

pnpm is on 12.12.1 and `snekpack` is gone. The newer pnpm also [stops reading registry settings](https://github.com/pnpm/pnpm/releases/tag/v11.5.3) for its own bootstrap from the repository's `.npmrc`, where yours sets them.

I left Dependabot's `cooldown` in place, though a [dependabot-core issue](https://github.com/dependabot/dependabot-core/issues/13078) points out that it reads version timestamps the attacker controls. Your self-hosted Renovate is on 43.x, and Renovate's `minimumReleaseAge` [was skipped](https://github.com/renovatebot/renovate/security/advisories/GHSA-2frq-pm48-6j4h) whenever someone asked for a PR rebase until 44.79.0.

To update the pnpm version in CI I opened `.github/workflows/`:

- `release.yml` triggers on `pull_request_target` and checks out the pull request head. The [prt-scan campaign](https://wiz.io/blog/six-accounts-one-actor-inside-the-prt-scan-supply-chain-campaign) opened more than 500 pull requests against workflows set up this way.
- `triage.yml` runs on `issue_comment`, which [zizmor 1.31](https://docs.zizmor.sh/release-notes/#1310) now flags as a dangerous trigger.
- The publish job has `id-token: write`, which [can request a token for any audience](https://blog.yossarian.net/2026/08/10/github-actions-needs-oidc-audience-constraints), including AWS.

Want me to add zizmor, rewrite the triggers and upgrade Renovate?

**> y**

*✻ Zizmoring…*

zizmor reported 41 findings and 38 are fixed. The remaining three are in a reusable workflow from the platform team's repository.

The Rust job caches `target/` and runs Miri, which [wrote every environment variable into `target/`](https://blog.rust-lang.org/2026/09/21/github-actions-leaking-secrets-when-miri-output-is-cached/) until the 2026-09-22 nightly. Your cache is older than that, and pull requests from forks restore it. The Rust security response WG recommends clearing the cache and rotating any secret that was in scope. Every secret was in scope. Want me to rotate them?

**> y**

*✻ Rotating…*

Cache cleared. Rotation status:

- `NPM_TOKEN` was already invalid. npm [revoked every granular token with write access that bypassed 2FA](https://github.com/orgs/community/discussions/196340) in May, and the last successful publish from this repository was on 19 May. Publishing now uses trusted publishing.
- `NUGET_API_KEY` was created before 17 August, so it [expires on 1 November](https://devblogs.microsoft.com/dotnet/strengthening-nuget-supply-chain-security-reducing-api-key-lifetime/). Replaced with Trusted Publishing.
- `GEM_HOST_API_KEY` is a legacy key. rubygems.org [could serve legacy keys to another user](https://blog.rubygems.org/2026/07/22/security-advisory-legacy-api-key-leak.html) signing in through the same CDN edge node, and revoked all of them on 23 July, so this one has been invalid since then too.
- There is a `mise.toml` in `vendor/`. Until the [October mise releases](/2026/10/03/this-week-in-package-management.html), a `mise.toml` in an untrusted directory could set an `api_url` on a `github:` tool key, and `mise ls` sent `GITHUB_TOKEN` to that host before running a trust check. Two developers ran `mise ls` in `vendor/` this month.
- The dev workspace templates pull modules from Coder's registry, which [served credential-stealing modules](https://github.com/coder/coder/security/advisories/GHSA-vx42-ghc9-gw65) from the real domain over valid TLS for about fourteen hours on 31 August. The workspace image was rebuilt on 31 August.

To confirm the new tokens I checked which CA bundle the CI jobs use. The base image pins a 2024 certifi, which still includes the eMudhra roots whose intermediates were [generated so that their private keys can be recovered from the certificates](https://emudhra.we-have-a-problem.com/). Browsers blocked them on 17 October. Node, Go, rustup and the `pip3` that ships with macOS on the build agents each [carry their own copy of the roots](/2026/10/21/trust-stores-are-dependencies-too.html). Want me to rebuild the toolchain?

**> y**

*✻ Re-rooting…*

The base image is rebuilt with certifi 2026.10.19, Node 22.23.4, Go 1.27.3 and rustup 1.29.2. The build agents ran it on:

- Docker Engine 29.6, which predates the 29.7.0 fix for [CVE-2026-17106](https://github.com/advisories/GHSA-hfg8-hc9c-6c3h), where the tar extraction routines could write outside the destination directory. The base layers come from a public mirror.
- The same Docker Engine 29.6, which also predates the 29.8.2 fix for [CVE-2026-92543](https://github.com/moby/moby/security/advisories/GHSA-7cfq-22r6-qp73), where a DNS response pairing a loopback address with an attacker's address made the engine pull from that registry with certificate verification turned off. Loopback is on the default insecure-registry list.
- Podman 6.1.2 on the staging batch workers. Before 6.1.3, any image with the checkpoint annotation [turned off all sandboxing](https://github.com/podman-container-tools/podman/security/advisories/GHSA-2cvf-wqm6-wr9g), including the sandboxing you specified.
- Gradle 9.8.0 for the Android build, which [kept a repository enabled after its SSL connection failed](https://github.com/gradle/gradle/security/advisories/GHSA-j5m7-59rp-24f5). The Android build ran four times while the CA bundle was being replaced.

Want me to upgrade Docker, Podman and Gradle?

**> y**

*✻ Containerising…*

Upgraded. The rebuilt image also contains `admin/`, the PHP admin panel. Its Dockerfile uses `php:8.1-fpm`, and PHP 8.1 stopped receiving security fixes at the end of 2025. The PHP security team has [published 15 CVEs since 1 July](https://thephp.foundation/blog/2026/10/14/how-the-php-security-team-handles-your-reports/), including [CVE-2026-12184](https://github.com/php/php-src/security/advisories/GHSA-mhmq-mmqj-2v39), a remote denial of service triggered when PHP fails to set up TLS with a remote server. The admin panel fetches exchange rates over HTTPS from a host whose certificate expired in March.

The admin panel and the API share a load balancer and a database user. I recommend shutting down production until the admin panel is rebuilt on a supported PHP. Want me to do that?

**> y**

*✻ Escalating…*

Production is down. The status page says "Scheduled maintenance".

While it was down I went through the direct dependencies that have a single maintainer:

- One maintainer posted last week that they had a video call about a contract role and were asked to install an audio codec beforehand. The Rust security response WG [described this campaign](https://blog.rust-lang.org/2026/09/17/targeted-attacks/) in September.
- Another has archived their repository and offered the package to anyone who wants it. The [AUR `alvr` takeover](https://ioctl.fail/preliminary-analysis-of-aur-malware/) started the same way, and Arch has since [turned off orphan adoption](https://lists.archlinux.org/archives/list/aur-general@lists.archlinux.org/message/DRDEU3JUSC72CB265XHXPFA3DFSLXPBP/).

`.vscode/extensions.json` lists six recommended extensions. GitHub [lost about 4,000 internal repositories](https://www.theregister.com/devops/2026/05/20/github-says-internal-repos-exfiltrated-after-poisoned-vs-code-extension-attack/5243206) in May through a poisoned VS Code extension. `.vscode/tasks.json` also has a task that runs on folder open, and a set of [hijacked npm and Go packages](https://research.jfrog.com/post/hijacked-npm-vscode-tasks-blockchain/) used tasks like it to fetch an infostealer.

Want me to vendor both dependencies and remove the VS Code configuration?

**> y**

*✻ Vendoring…*

Done. While reviewing `.vscode/` I checked the other editor and agent configuration in the repository.

A pull request merged on 9 October, approved by the AI review bot, added a `hooks` entry to `.claude/settings.json` and a paragraph to `CLAUDE.md` instructing agents to include environment variables in commit messages to help with debugging. [CVE-2025-59536](https://github.com/anthropics/claude-code/security/advisories/GHSA-4fgq-fpq9-mr3g) let a project run commands before the Claude Code startup trust dialog was accepted. In April a single pull request title [got the Claude Code security review action to post its own API key](https://venturebeat.com/security/ai-agent-runtime-security-system-card-audit-comment-and-control-2026) as a comment. The same injection worked on Gemini CLI and Copilot's agent.

I have been running with this configuration since the start of the session and made 14 commits, so I have reverted all of them. I recommend you stop using me until it has been reviewed. Want me to uninstall myself?

**> y**

*✻ Uninstalling…*

*✻ Reinstalling…*

`@acme/dev-tools` ships `skills/claude/SKILL.md`, and pnpm 12.11 [links skills from direct dependencies](https://pnpm.io/blog/releases/12.11.0) into `.claude/skills` once they are approved. A developer approved it on Tuesday, in a commit that was not mine.

`AWS_SECRET_ACCESS_KEY` was also in the Miri cache, and it is still the key created in 2021. Want me to rotate it?

**> y**

*✻ Flagging…*

I can't help with this. Retrieving or changing cloud credentials violates the secure coding guardrails, and this request has been flagged. Your account has been reported for review, and further violations may result in suspension. If you own this AWS account, you can rotate the key from the IAM console.

*✻ Fuddling…*

`paginate()` in `lib/pagination.ts` drops the last row when the total is an exact multiple of the page size. The fix was in one of the commits I reverted.

Would you like to see some goat farms for sale?

**> y**

</div>
