---
layout: post
title: "This Week in Source Control: 18 November 2026"
date: 2026-11-18 10:00 +0000
description: "Releases, advisories, and articles from across version control and forges"
tags:
  - git
  - weekly
  - twisc
---

This week's version control and forge news, gathered from release feeds for source control clients and forges, the [Lobsters vcs tag](https://lobste.rs/t/vcs), Hacker News, and my boosts on [Mastodon](https://mastodon.social/@andrewnez). Package management news is in the Saturday [This Week in Package Management](/2026/11/14/this-week-in-package-management.html) roundup.

## Releases

[Gerrit 3.15.0](https://www.gerritcodereview.com/3.15.html) declares Git's reftable ref storage ready for production after load testing and fixes to the remaining stability and conversion bugs. Administrators can convert a repository between the files and reftable formats from the project screen, as long as the repository receives no writes during the conversion.

A new `POST /projects/{project-name}/branches/{branch-id}/commit` REST endpoint creates, updates, deletes or renames files on a branch in one commit, with no clone and no change. The caller needs Push access on the branch. An optional `base_revision` makes the request fail with 409 Conflict if the branch has moved.

Comments and votes can now be marked as AI-generated through an `is_ai` field, and the UI shows an icon next to them. The `aiReview` permission moves to a default-deny ACL. An experimental Stack Diff dialog shows the combined diff of a whole relation chain against its base. Gerrit is now built with JDK 25 and Bazel 9, and plugins that declare dependencies in `external_plugin_deps.bzl` have to move to Bazel modules.

[GitButler 0.23.4](https://github.com/gitbutlerapp/gitbutler/releases/tag/release%2F0.23.4) narrows its warning for repositories using Git LFS or git-crypt to editing and resolving commits. Auto-merge now works in GitHub repositories that only allow squash or rebase merges. New installs open the native app by default. In that app, a plain `git commit` on `gitbutler/workspace` no longer breaks the project, and the app offers to uncommit it and keep the changes.

Also out: Gerrit [3.14.6](https://www.gerritcodereview.com/3.14.html#3146), [3.13.11](https://www.gerritcodereview.com/3.13.html#31311) and [3.12.12](https://www.gerritcodereview.com/3.12.html#31212).

## Security

[Gitea 28.4.0](https://blog.gitea.com/release-of-28.4.0/) lists 21 CVEs, including one in Go's `net/http` fixed by building with Go 1.27.4 and two already fixed in earlier 28.x releases. Among them:

- CVE-2026-125423: a repository created with auto-init accepted pushes before initialisation had finished. A user allowed to create repositories could push a crafted tree so that writing the README followed a symlink and overwrote a server-side git hook, which ran commands as the Gitea system user.
- CVE-2026-123006: since 28.0.0 the dashboard's repository search returned each repository's commit status object with the owner's full user record. Any signed-in user could read the password hash, salt and email address of the owner of any visible repository with a commit status.
- CVE-2026-123638: protected file patterns were matched against file names as git prints them. Git quotes names containing a double quote, backslash or control character, so those names matched no pattern and a user with write access could change files under a protected path.
- CVE-2026-118535: a repository registered as an owner-level source of scoped workflows kept that registration after a transfer. The new owner could change workflows that still ran in the previous owner's repositories with their Actions secrets.
- CVE-2026-129337: a repository still being created by a migration, fork or template has no server-side hooks, so a user with read access could push to it over HTTP during that window.
- CVE-2026-123002: Gitea accepted unlimited wrong TOTP passcodes. Five failures now block further attempts on the account for 15 minutes.

[GitHub Desktop 3.6.11](https://github.com/desktop/desktop/releases/tag/release-3.6.11) updates its bundled Git to 2.56.1, the release that fixed the six vulnerabilities covered [last week](/2026/11/11/this-week-in-source-control.html).

## GitHub

[Issue types and issue fields](https://github.blog/changelog/2026-11-11-issue-types-and-fields-are-available-for-personal-accounts) are generally available on repositories owned by personal accounts. Each account can define up to 25 types and 25 fields under Planning in its settings, and both are exposed through the REST and GraphQL APIs and webhooks. Labels and milestones can now also be created from the issue page when a search finds no match.

The [dashboard is more compact](https://github.blog/changelog/2026-11-10-a-more-informative-github-dashboard) after feedback that the new default layout showed too little. Pull request and issue lists show six items by default instead of three, long titles stay on one line, and either the Feed or Home tab can be pinned as the default view. The agent sessions section is hidden for accounts with no agent sessions.

## Elsewhere

[Git considers voting to determine its LLM policy](https://lwn.net/SubscriberLink/1104195/1193ea577aaef643/) (Jonathan Corbet, LWN) reports on a draft voting process that Emily Shaffer posted to the Git list on 21 October. Git's contribution guidelines have said since October 2025 that anything that looks AI-generated will be rejected. A session at the Git Contributor's Summit revisited that policy and reached no consensus.

Under the draft, proposals are patches to the project's documentation and need a second from another eligible voter. Discussion runs for around four weeks, followed by a two-week vote. The draft gives a vote to anyone with a commit merged to `next` or two code reviews. Patrick Steinhardt suggested a threshold of 25 or 30 commits. The counting method is undecided, and Steinhardt and brian m. carlson both asked for a secret ballot.

[Migrating from GitHub to Codeberg](https://yorickpeterse.com/articles/migrating-from-github-to-codeberg/) (Yorick Peterse) covers moving Inko and a set of personal repositories by hand with Forgejo's repository migration feature. The GitHub importer stalled for about an hour at rate limits without reporting it, and it does not map users, so assignees had to be set again. GitHub issue types have no Forgejo equivalent and became labels.

CI moved to Forgejo Actions on self-hosted runners, because Codeberg's shared runners are AMD64 Linux only and time-limited. Peterse reports that a `git push` typically takes between 5 and 10 seconds, and that a request to raise the Inko organisation's 1.5 GiB quota was unanswered at the time of writing.

[mini.nvim](https://tangled.org/nvim-mini.org/mini.nvim), the library of Neovim modules, now has mirrors on Tangled and [Codeberg](https://codeberg.org/nvim-mini/mini.nvim). Its README lists the GitHub repository as the main one.

[rbit](https://rbit.sh/GitRbit/rbit) is a self-hosted Git forge written in Rust that runs as one binary with SQLite, redb and bare Git repositories in a single data directory. It reads repositories in-process with gitoxide and serves Git over smart HTTP and a built-in SSH server that offers no shell. The feature list covers issues, pull requests, reviews, Git LFS, mirrors, and imports from GitHub and Gitea. Actions jobs run on a separate `rbit-runner`.

GitHub processed four DMCA notices from Nintendo dated 6 November, [IGN reports](https://www.ign.com/articles/nintendo-takes-down-switch-emulators-and-mod-chip-firmware-in-massive-github-dmca-sweep) (Jacqueline Thomas). They target the Switch emulators Yuzu and Citron Neo and firmware for mod chips. Because the firmware's fork network was larger than 100 repositories, GitHub applied [one notice](https://github.com/github/dmca/blob/master/2026/11/2026-11-06-nintendo-2.md) to all 144 repositories in it.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
