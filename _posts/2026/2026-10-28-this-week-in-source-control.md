---
layout: post
title: "This Week in Source Control: 28 October 2026"
date: 2026-10-28 10:00 +0000
description: "Releases, advisories, and articles from across version control and forges"
tags:
  - git
  - weekly
  - twisc
---

Alongside package management, I follow new features and security fixes in source control clients and in the forges that host repositories, since a lot of what I build, like [git-pkgs](https://github.com/git-pkgs), reads git repositories and calls forge APIs. [This Week in Package Management](/2026/10/24/this-week-in-package-management.html) has been published every Saturday since May, and I kept putting git releases and forge news in its Elsewhere section.

Starting this week, I'm publishing that material as a separate roundup on Wednesdays. It covers clients like git, jj, gitoxide, Sapling, Mercurial and Git LFS, and forges like GitHub, GitLab, Forgejo, Gitea, Codeberg, sourcehut, Radicle and Tangled. Package managers resolving git dependencies and CI systems like GitHub Actions are covered in the Saturday post.

This first issue covers the fortnight since 11 October, with links from release feeds for those tools and forges, the [Lobsters vcs tag](https://lobste.rs/t/vcs), Hacker News and my boosts on [Mastodon](https://mastodon.social/@andrewnez). In that fortnight Anthropic, GitHub and Enroute each published a post about rebuilding source control or git hosting for the volume of pushes and checkouts from coding agents.

## Scaling

[Redesigning source control at Anthropic](https://www.anthropic.com/engineering/redesigning-source-control) (Anthropic Engineering) describes Scion, an in-house version control system that replaced git for the company's monorepo in five months. Merges went from around 2,500 a day in May to over 30,000 a day in September. The main branch history is almost 100 GB, and CI performs around 25 million checkouts a day. Scion is designed for clients that are always online. The server stores changesets in a write-ahead log on Spanner and runs blame, history and merge queries server-side, and clients fetch only the trees and blobs they request through regional caches. Anthropic reports the new infrastructure uses 200x less CPU and memory than the git mirror fleet it replaced. In [notes on the post](https://simonwillison.net/2026/Oct/13/redesigning-source-control-at-anthropic/), Simon Willison compares it to centralised systems like Subversion.

[Anthropic's Scion is heavily inspired by Mononoke](https://sunshowers.io/posts/anthropic-mononoke/) (sunshowers) points out that Scion's "derived data" for fast blame and history queries matches the design of Mononoke, the server side of Meta's Sapling. The original post credited Sapling only for "hard-won lessons". [A follow-up](https://sunshowers.io/posts/anthropic-mononoke-2/) compares Scion's changesets with Mononoke's Bonsai changesets. Anthropic has since updated its post with more detail on the projects Scion is based on.

[The bridge to agent-scale Git infrastructure](https://github.blog/engineering/architecture-optimization/the-bridge-to-agent-scale-git-infrastructure/) (Eleanor White and Victoria Dye, GitHub Blog) covers the move of GitHub's repositories to Azure. Most repositories have two of their five replicas there, and Azure serves about half of Git traffic. Moving the busiest repositories was blocked by a repository-wide lock that every write held across a 25ms cross-region round trip. Spokes is switching to per-reference serialisation, so only writes to the same ref wait for each other, which gave 3-4x write throughput in internal tests. Object storage then joins the write quorum as a "virtual replica", so read replicas can be stateless.

[Everyone is doing Git on S3 wrong](https://enroute.sh/blog/everyone-is-doing-git-on-s3-wrong) (Enroute) looks at the write-ahead log designs for git on object storage that followed Cursor's Continuity. Those designs send every push to a repository through one primary, and every replica keeps a full copy of the repository on disk. Enroute keeps each repository's refs and a list of immutable object layers in a Raft-replicated log. Packfiles are rewritten on ingestion so a read from object storage needs only a few requests, and Enroute reports more than 7,600 pushes per second into a single repository. Against stock git serving a repacked linux.git, full clones are about 17% slower and shallow clones more than twice as fast.

## Releases

[GitLab 19.5](https://docs.gitlab.com/releases/19/gitlab-19-5-released/) makes the GitLab MCP server and GitLab Secrets Manager, built on OpenBao, generally available. Smaller changes include a commit count variable for commit message templates, and commits signed by revoked GPG identities now show as unverified.

[Forgejo 17.0](https://forgejo.org/2026-10-release-v17-0/) resolves absolute links in rendered documents against the repository root, as other forges do, and deprecates action run webhook events in favour of workflow run events. It also adds a Donate button driven by `FUNDING.yml`, migration from Bitbucket Data Center, and opt-in invitations for organisation membership. The project [advises waiting before upgrading](https://floss.social/@forgejo/117450533397721524) while it investigates an issue in 17.0.0 that can block pushes, merges and other code operations. [Forgejo 16.0.6 and 15.0.10](https://floss.social/@forgejo/117428260816677602) are security releases.

[GitRoot 0.5.0](https://gitroot.dev/blog/version-0.5.0.html), a self-hosted forge with no database that is extended through WASM plugins, now references plugins by PURL with a checksum qualifier in place of separate URL, checksum and version fields. New per-forge and per-repository settings cap how many branches anonymous users can push before further anonymous pushes are rejected.

[Pushin.eu](https://pushin.eu), an invite-only forge hosted in the EU, shipped several releases this fortnight according to its [changelog](https://pushin.eu/pjullrich/pushin/changelog). 0.3.26 adds tag-based releases with a GitHub-compatible API and GoReleaser publishing, and 0.3.29 serves public repository files from `raw.pushin.eu`. 0.3.32 adds runner groups for self-hosted runners and removes the per-repository `allow_persistent_runners` setting.

[forges](https://forges.link/) (Daniel Roe) is a TypeScript version of my Go library [git-pkgs/forge](https://github.com/git-pkgs/forge), with one interface for issues, pull requests, notifications, checks and webhooks across GitHub, GitLab, Bitbucket, Forgejo, Gitea, Gitee, Azure DevOps, Cursor Origin, Tangled, Pushin.eu and Sourcehut. Each provider declares which operations it supports, and the release notes show the capability changes per forge. [0.1.0](https://github.com/danielroe/forges/releases/tag/v0.1.0) came out on 11 October, and [0.3.0](https://github.com/danielroe/forges/releases/tag/v0.3.0) adds branch rules and review threads.

[gt 0.1.0](https://blog.gitea.com/release-of-gitea-cli-0.1.0/) replaces `tea`, Gitea's command line tool, with a rewrite under a new name and repository. Every list and view command supports `--json` and `--jq`, and `gt pr checkout` and `gt pr diff` handle fork and AGit pull requests. It requires Gitea 28 or newer.

[gitoxide 0.61.0](https://github.com/GitoxideLabs/gitoxide/releases/tag/v0.61.0) moves the plumbing crates to a standard `std::error::Error` compatible error type and improves tracing across commands, along with security fixes.

## Security

[Git LFS 3.8.1](https://github.com/git-lfs/git-lfs/releases/tag/v3.8.1) fixes four CVEs:

- unquoted arguments in remote commands sent over SSH
- Cookie headers forwarded to other hosts after a redirect
- an arbitrary program run from a malicious repository through line feeds in a submodule URL
- an arbitrary program run from a malicious repository through a custom transfer adapter set in `.lfsconfig`

GitLab shipped two critical patch releases for integer overflows in its regular expression compiler that allowed unauthenticated code execution. The [first, on 12 October](https://www.bleepingcomputer.com/news/security/gitlab-warns-of-max-severity-rce-flaw-in-regex-compiler-engine/), fixed CVE-2026-97229 in CI configuration patterns, and a [21 October release](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-5-1-released/) fixed CVE-2026-110264, which affects every version from 7.0 and was backported as far as 18.11.13. The underlying bugs are in Ruby's Onigmo, whose fixes were in [last week's package management roundup](/2026/10/24/this-week-in-package-management.html).

[Gitea 28.2.0](https://blog.gitea.com/release-of-28.2.0/) discloses 13 CVEs, two of them fixed in earlier releases. One fix limits which stored public keys an SSH certificate principal is matched against. Before the fix, matching against every stored key let a certificate authenticate as a different user.

An attacker took over a developer's GitHub account and [replaced OVHcloud CLI releases 0.11.0 to 0.15.0](https://www.bleepingcomputer.com/news/security/ovhcloud-cli-releases-backdoored-on-github-to-steal-developer-secrets/) with builds that read secrets from disk. Release immutability was turned off on the repository, so the existing releases could be modified directly, bypassing CI.

## GitHub

[Push attribution](https://github.blog/changelog/2026-10-12-push-attribution-public-preview), in limited preview for Enterprise customers, records the authenticated user who pushed each commit alongside the author and committer fields. A new "Committer must match pusher" ruleset condition accepts a push only when the committer matches one of the pusher's verified email addresses.

During periods of unusual traffic, [unauthenticated HTTPS clones and fetches of public repositories may require authentication](https://github.blog/changelog/2026-10-19-some-git-over-https-may-temporarily-require-authentication), while SSH, authenticated HTTPS and pushes work as before.

[GitHub CLI 2.103.0](https://github.blog/changelog/2026-10-21-github-cli-opt-in-to-expiring-auto-refreshing-oauth-tokens) adds `gh auth login --expiring` for refreshable tokens that expire within hours. Used as a git credential helper, it requires git 2.46 or newer, which discards a cached credential when it expires.

Repositories can now [convert all their branch protection rules to rulesets](https://github.blog/changelog/2026-10-20-bulk-migrate-branch-protections-to-rulesets-for-a-repository) in one step, with a preview before anything changes. A new [`repository_creation:write` permission](https://github.blog/changelog/2026-10-13-github-app-improvements-for-least-privilege-and-management) lets apps and fine-grained tokens create repositories with only that permission instead of full repository administration.

[Email notifications for push events](https://github.blog/changelog/2026-10-15-email-notifications-for-repository-push-events-have-been-retired) have been retired because recipients could be added without consenting.

## Elsewhere

[Haxy](https://try.haxy.net/haxy:haxy), now in preview, is a local-first forge written in Zig that stores issues, pull requests and discussions as events on a `haxy/events` branch and serves a TUI over SSH alongside its web interface.

[Making git hooks visible in fish shell](https://offby1.website/posts/making-git-hooks-visible-in-fish-shell.html) (Chris R) ports Ned Batchelder's zsh function, which lists a repository's executable hooks when you `cd` into it, after Frank Wiles nearly fell for an attack hidden in a shared hooks folder.

jwz has created [a GitHub repository](https://github.com/xscreensaver-official/xscreensaver) whose only content is a README stating that XScreenSaver releases are published only as tarballs on the XScreenSaver website and that other repositories are unofficial.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
