---
layout: post
title: "This Week in Source Control: 25 November 2026"
date: 2026-11-25 10:00 +0000
description: "Releases, advisories, and articles from across version control and forges"
tags:
  - git
  - weekly
  - twisc
---

This week's version control and forge news, gathered from release feeds for source control clients and forges, the [Lobsters vcs tag](https://lobste.rs/t/vcs), Hacker News, and my boosts on [Mastodon](https://mastodon.social/@andrewnez). Package management news is in the Saturday [This Week in Package Management](/2026/11/21/this-week-in-package-management.html) roundup.

## Scaling

[Scaling horizontally: how we moved beyond Multi-Raft](https://enroute.sh/blog/scaling-horizontally-how-we-moved-beyond-multi-raft) (Enroute) covers the 0.4.0 release of Enroute, a Git server that stores object data in S3 and one replicated log of refs and layers per repository. Under Multi-Raft every repository had its own Raft group with its own heartbeats and elections. At 2,048 concurrent writers across 100,000 repositories, late heartbeats set off thousands of elections and the 99th percentile push time reached 83 seconds.

The new design uses failover from Vertical Paxos: a single root log runs Raft and assigns a sequencer to each repository's log, so timers and elections run only in the root log. The root log leader also places each repository's three replicas in distinct zones. The protocol is checked with Stateright against the real implementation and with a Jepsen suite. At 300,000 repositories the team measured up to 24,000 pushes per second.

[Accelerating development for massive Git repositories](https://developers.googleblog.com/accelerating-development-for-massive-git-repositories/) (The Android ABFS Team, Google Developers Blog) announces the open-sourcing of [ABFS](https://github.com/google/abfs), the system Android uses for checkouts and builds. Android 17's open source release has 1,084 Git repositories and 1.62 million files. A `repo sync` took around 36 minutes and a full build around 80.

ABFS replaces the checkout with [CASFS](https://github.com/google/abfs-casfs), a Linux kernel filesystem that exposes Git object hashes as extended attributes and fetches file contents on first read. Server-side processes ingest Git objects from Gerrit into a content-addressable store. [Ninja-go](https://github.com/google/ninja-go) records which files each build step read and reuses cached results only when those files still match. Checkouts now take under 8 seconds and full builds just over 2 minutes, and a Bazel integration exists as a proof of concept.

## Releases

[delta 0.21.1](https://github.com/dandavison/delta/releases/tag/0.21.1) adds a TUI based on a fork of gitu. It can browse `git diff`, `git show` and `git log` output, stage directly from delta-rendered diffs including side-by-side view, fold diffs, and reorder and fixup commits from the log. A new `min-width` option switches side-by-side mode on or off depending on terminal width. [0.21.2](https://github.com/dandavison/delta/releases/tag/0.21.2) lets the TUI open terminal editors such as vim and `emacs -nw`, and shows when a submodule is dirty.

[delta 0.22.0](https://github.com/dandavison/delta/releases/tag/0.22.0) adds experimental difftastic support to the TUI and [moves](https://github.com/dandavison/delta/pull/2360) TUI settings from `[delta-tui ...]` sections into the `[delta]` namespace, where they can be grouped into features. Existing TUI configs break, and `delta --tui --migrate-old-config` prints the converted version.

[GitButler 0.23.5](https://github.com/gitbutlerapp/gitbutler/releases/tag/release%2F0.23.5) is now on Flathub as an official, verified package. Pushing the rest of a stack after several of its branches have merged now succeeds, and loading a large project far behind its upstream no longer uses gigabytes of memory. The CLI adds `but worktree recycle`, which reuses a clean archived worktree, including its build output and dependencies, for a new branch.

[gitoxide v0.62.0](https://github.com/GitoxideLabs/gitoxide/releases/tag/v0.62.0) adds `gix notify` and `gix watch`, which print filesystem events and repository invalidations, and `gix fsmonitor`, which runs and controls a Git-compatible filesystem monitor daemon. A `--repo-trust` option sets the trust level a repository's configuration is read at, and `gix env` prints the effective level. Plumbing crates now return an error type compatible with `std::error::Error`. The CLI now requires Rust 1.91, and the `gix` library requires 1.88.

[gt 2.0.0](https://blog.gitea.com/release-of-gitea-cli-2.0.0/) (bircni, Gitea Blog), the Gitea command-line client, comes just over two weeks after 1.0.0. Its flags now match `gh`'s, so `gt pr merge` accepts `--squash`, `--subject` and `--body`. `--json` now requires a field list, and absent values are always `null`. Logs of a failed Actions run dropped from about 46,800 tokens to about 11,600, because the output drops timestamps and `--failed` prints only the failed steps.

Commands now run with a `GITEA_TOKEN` that lacks the `read:user` scope, so a token limited to `read:repository` can clone through gt's credential helper in CI. Keyring entries are stored under `gitea-cli:HOST`. Local extensions now run only if the executable is owned by the user or root and is not world-writable.

[GitLab 19.6](https://docs.gitlab.com/releases/19/gitlab-19-6-released/) makes Rapid Diffs generally available as the replacement for the classic merge request diff view. Diffs are rendered on the server and streamed to the browser, which cuts the time to the first file from about 4.5 seconds to 1.5. Fine-grained personal access tokens can now read more through the GraphQL API, including blame, CODEOWNERS validation and deploy keys. Every action taken through the GitLab MCP server now creates an audit event.

Also out: [forges v0.4.0](https://github.com/danielroe/forges/releases/tag/v0.4.0) and [v0.4.1](https://github.com/made-in-common/forges/releases/tag/v0.4.1).

## Security

[Forgejo 17.0.2 and 15.0.12](https://code.forgejo.org/forgejo/forgejo/releases/tag/v17.0.2) are security releases. The fixes:

- With the internal SSH server on SQLite, public keys were matched with a case-insensitive SQL `LIKE`. A crafted key matching a target user's key case-insensitively could authenticate as that user through a custom client. Matching is now by exact fingerprint and key content.
- The endpoint that sets a primary email address accepted unverified addresses. An external service using Forgejo for sign-in could be tricked into granting access to the wrong account.
- Commit headers were accepted in any order, so a crafted commit could display an incorrect diff.
- The `/tree-list` and `/find` endpoints listed a repository's files to users who lacked code read access.
- The `/activities/feeds` and `/heatmap` APIs returned data outside the limits of repository-scoped and public-only access tokens.

On 16 November malicious JavaScript was served through Optimizely Web to visitors of 178 organisations, [Report URI found](https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/) (Scott Helme). The attacker added code to the customer-written Project JavaScript field of each snippet, and the modified snippets were served from `cdn.optimizely.com`. The payload swapped cryptocurrency wallet addresses and skimmed payment cards. It also stole cookies and screenshots. Report URI lists `gitlab.com` and `about.gitlab.com` among the affected sites.

## GitHub

[GitHub Desktop 3.7.0](https://github.blog/changelog/2026-11-19-github-desktop-now-supports-multiple-accounts-per-host) supports more than one signed-in account on the same host. Each repository is associated with one account, which is used for clone, publish and other Git operations. Existing repositories are migrated to the account previously associated with them. On the web, the new dashboard has a [Favorite repositories section](https://github.blog/changelog/2026-11-20-pin-your-favorite-repositories-to-your-dashboard) that syncs with pinned repositories in GitHub Mobile, up to 25 across both.

[gh v2.105.0](https://github.blog/changelog/2026-11-18-wait-for-pull-request-events-with-github-cli) adds `gh event listen`, which subscribes to a pull request through Event Streams, [covered last week](/2026/11/18/this-week-in-source-control.html), and prints each event as a line of JSON. By default it exits after the first event, and `--count`, `--follow` and `--timeout` change that. `gh pr view`, `gh run watch` and `gh api` now print a hint pointing to it in place of polling. It requires access to the Event Streams preview.

In the [latest changes](https://github.blog/changelog/2026-11-19-improvements-on-the-pull-request-overview-in-public-preview) to the pull request Overview preview, a mergeable pull request with failed optional checks now shows as mergeable. Force-push entries in the activity link to the old and new commits, commit entries show timestamps, and resolved review threads collapse.

From 1 December GitHub is [changing notification behaviour](https://github.blog/changelog/2026-11-24-more-predictable-notifications-on-github-com) on GitHub.com in a week-long migration. Commenting, submitting a review, changing a thread's state or merge queue activity will stop resubscribing a user who unsubscribed manually, and a mention, an assignment or a review request will resubscribe them as before. Team-mention notifications will be sent according to current team membership, so leaving the team stops them and joining starts them for threads where the team was already mentioned.

The reason shown in the inbox and email footer will be chosen by a fixed priority order in place of the most recent activity, and email headers will list every applicable reason. Threads subscribed to manually will be the only entries on the Subscriptions page. Filters and automations keyed on notification reasons may need updating.

[Issue statuses](https://github.blog/changelog/2026-11-23-issue-statuses-and-repository-boards-are-in-public-preview) are in public preview, with the values Backlog, Todo, In progress, In review, Done, Not planned and Duplicate. Linking a draft pull request moves an issue to In progress, and marking it ready for review or linking an open pull request moves it to In review. Statuses can be read and set through GraphQL, REST and the MCP server. Saved views in a repository can now use a board layout, where dragging an issue between columns changes its status.

The [GitHub Enterprise Server 3.23 release candidate](https://github.blog/changelog/2026-11-20-github-enterprise-server-3-23-release-candidate) adds OAuth app access tokens that expire after eight hours, with refresh tokens. Expiry is the default for new OAuth apps and opt-in for existing ones. [Enterprise Live Migrations from Azure DevOps](https://github.blog/changelog/2026-11-19-enterprise-live-migrations-from-azure-devops-generally-available) is generally available for GitHub Enterprise Cloud with data residency. It syncs Git history, branches, tags and pull requests continuously until cutover, and converts branch policies to rulesets.

Security advisory permissions, in [Saturday's roundup](/2026/11/21/this-week-in-package-management.html), let custom repository roles manage and publish advisories, which previously required admin access. [Seth Larson writes](https://sethmlarson.dev/github-security-advisory-permissions-sustainability) that the Python Security Response Team tested it in a private beta, and that several more PSRT members now take part in triage, work that had fallen to repository admins.

The `microsoft/onnxruntime` repository disappeared on 17 November, [first noticed on Hacker News](https://news.ycombinator.com/item?id=50539610) when CI pipelines started failing, and returns a 404 at the time of writing. The [StableBuild blog](https://www.stablebuild.com/blog/onnx-runtime-disappeared-from-github-without-warning) reports that it was removed with no prior announcement. The PyPI packages were still available, but builds that fetched source or release files from GitHub failed.

## Elsewhere

Codeberg posted a [post-mortem](https://codeberg.org/Codeberg/changelog/issues/7#issuecomment-28100157) of the 18 November domain suspension covered last week. NameSilo had placed `codeberg.org` on client hold over two abuse cases without contacting Codeberg. One was a 2022 report that Codeberg disputes, about a repository archived since 2023. The other was malware in an account created on 16 November, reported only to the registrar, not to Codeberg's abuse address.

Codeberg removed both repositories and is evaluating offers from other registrars. It moved its nameservers from NameSilo to deSEC in July. A switch to its spare `codeberg.eu` domain would affect two-factor authentication and every existing Git remote, and Codeberg is [working with Forgejo](https://codeberg.org/forgejo/forgejo/issues/15329) on multi-domain support.

[Run CI in your Namespace workspace](https://tangled.org/blog/namespace-engine/) (Anirudh, Tangled) announces a new spindle engine that runs workflows in a Namespace workspace. It also covers a Discord integration that posts a public repository's new issues, pull requests and tags to a channel. The post lists knots built by other people, among them yumak, which serves repositories as static files from nginx, and walknot, which stores its data in an S3 bucket.

Knot 1.20.1 fixes `go get` from knots, where `GOPROXY=direct` fetches broke on shallow boundaries and the Go module proxy failed on sha256 repositories. Deleting contribution records such as issues and pull requests is now limited to collaborators. The Go knot has been removed from the tree, with an upgrade guide to knot 2.

[Announcing jj-musubi](https://www.serpentine.com/posts/2026/announcing-jj-musubi/) (Bryan O'Sullivan) introduces [jj-musubi](https://github.com/bos/jj-musubi), which syncs copies of a Jujutsu repository across machines each time jj snapshots the working copy. One machine runs a hub and the others exchange history with it over SSH. Each machine's workspaces appear prefixed with its name, so `jj diff -r devbox/agent-1@` shows another machine's work. Temporary VMs can lease membership, and a repository whose lease is not renewed is forgotten.

Syncs leave the files in each working copy alone, so new history can arrive while a build runs. O'Sullivan started the project that became Sapling and Mononoke at Meta, and cites Sapling's Commit Cloud as the model. Key properties of the sync protocol are proved in Lean, and tests compare the Rust code against the Lean model.

[Jujutsu Primer](https://ethanlowman.com/posts/jj-primer/) (Ethan Lowman) introduces jj to Git users in a colocated repository. It covers changes and commits, revsets, automatic rebasing, conflicts, the op log, the squash workflow, bookmarks, and stacked pull requests.

[TODOs JJ Style](https://bwc9876.dev/blog/jj_todo/) (Ben C) describes keeping a to-do list as empty jj changes with descriptions, rebased onto real work when started. A `git.private-commits` setting of `description('private:*')` excludes them from pushes.

[Mergeon](https://github.com/Spilveru/mergeon) is a new GPL-3.0 desktop Git client modelled on Fork and written in Rust with GPUI, the UI library from Zed. It has a commit graph, staging by file, hunk or line, a three-way conflict resolver, interactive rebase, worktrees and a per-repository undo stack. Signing in to GitHub shows pull requests and CI check status in the sidebar. Linux packages are the tested target, and the Windows and macOS builds are marked beta.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
