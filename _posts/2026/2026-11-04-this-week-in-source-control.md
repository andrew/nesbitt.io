---
layout: post
title: "This Week in Source Control: 4 November 2026"
date: 2026-11-04 10:00 +0000
description: "Releases, advisories, and articles from across version control and forges"
tags:
  - git
  - weekly
  - twisc
---

This week's version control and forge news, gathered from release feeds for source control clients and forges, the [Lobsters vcs tag](https://lobste.rs/t/vcs), Hacker News, and my boosts on [Mastodon](https://mastodon.social/@andrewnez). Package management news is in the Saturday [This Week in Package Management](/2026/10/31/this-week-in-package-management.html) roundup.

## Scaling

[Scaling Git at OpenAI](https://openai.com/index/scaling-git-at-openai/) (Aaron Friel, Taylor Blau and Ted Nyman, OpenAI) describes Pando, a Rust backend for git repositories that now serves all development in OpenAI's monorepo. Each push is stored as an immutable packfile in blob storage, and each branch update records a ref version in a metadata store, so pushes contend only when they target the same ref. The trade-off is causal consistency, so a client reading several branches can see them at different points in time.

When a new branch is pushed, Pando advertises only trunk, which keeps the pushed pack reusable for anyone who already has trunk, and the median pack produced this way was under 20 KiB. On a fetch, Pando sends an empty packfile in the response and lists the packs the client needs as packfile-uri links. The client downloads those packs from a regional cache with a hit rate above 99%.

Background compaction merges small packs into larger ones in levels, up to L4 in the monorepo, and the levels double as a skip list for choosing which packs a client needs. OpenAI reports median push latency down by nearly 80% and nearly a petabyte of git data served a day. Fixes to packfile-uri downloads have gone upstream, and other changes, such as downloading and indexing packs in parallel, are in [OpenAI's git fork](https://github.com/openai/git).

[An outsider's perspective on Scion and Mononoke](https://typesanitizer.com/blog/scion.html) (typesanitizer) responds to Anthropic's Scion post from someone on the source control team at Databricks, whose monorepo's main branch history is 20-50GB. The author lists the parts of Scion's design that already exist in Mononoke, Perforce or Piper, such as per-directory ACLs, server-side history queries and changesets in place of git trees.

They also question Anthropic's mirror count: Databricks serves CI from fewer than 10 git mirrors and reference repositories refreshed every two hours, while Anthropic reported running several hundred mirrors at its peak.

[Building fine-grained version control for agents](https://delta.dev/blog/fine-grained-version-control-for-agents) (Antonio Scandurra, Delta) describes DeltaDB from the team behind Zed. Each agent thread is a DAG of CRDT deltas stored in SQLite on the client and synced to one Cloudflare Durable Object per thread.

Worktrees are layered on top of git, starting from a commit and recording edits as deltas, and creating a commit adds a delta that links the DAG back to git's history. Subagents work on separate timelines in the same DAG and merge back into it, and coordinating agents this way needs no git commit.

[GitHub saw 7.4B commits in September](https://thenewstack.io/github-7-4b-commits-september/) (Frederic Lardinois, The New Stack) reports figures from GitHub Universe. GitHub had 1.4 billion commits a month in April and 2.9 billion in August. It has added 4 million CPU cores and 160 PB of storage this year, alongside the move to separate compute and storage covered in [last week's issue](/2026/10/28/this-week-in-source-control.html).

## Releases

[Sapling 0.2.20261028](https://github.com/meta/sapling/releases/tag/0.2.20261028-123539%2B7415fb2f) makes `sl worktree` work in checkouts made with `git clone`, using `git worktree add` underneath, and ships it in builds without EdenFS, including the open source ones. `sl drop -r REV` is now on by default and removes commits from a stack, rebasing their descendants.

This release also adds a `--plan` flag to `histedit` for giving the plan on the command line, plus an `into` verb that folds the previous commit in while keeping the current message. Rewriting a commit in the middle of a stack now works with `uncommit` too. [0.2.20261102](https://github.com/meta/sapling/releases/tag/0.2.20261102-153821%2Ba53273dc) fixes a regression from that release, where files under directories matched by rules like `target/` showed up as untracked and nested `.gitignore` files were skipped.

[OmniDiff 0.3.0](https://github.com/ivankovic/omnidiff/releases/tag/v0.3.0) is the latest release of Marko Ivankovic's content-aware difftool in Rust. It was on Hacker News this week and diffs code by syntax, along with pictures, fonts, archives and PDFs. This release diffs code embedded in strings as its own language, for example shell in a YAML `run:` block or CSS in template literals, and diffs CSS class lists one class at a time.

The [GitRoot 0.5.0 plugins](https://gitroot.dev/blog/version-0.5.0-plugins.html) include Firefly, which is written in Zig and generates status pages inside the forge. Silo, which builds indexes from files and their metadata, can now render them to the web grouped by any property, and Apex, the plugin that renders repository files to the web, adds a slide layout.

[gt 1.0.0](https://blog.gitea.com/release-of-gitea-cli-1.0.0/) is the first stable release of the Gitea command line tool [introduced last week](/2026/10/28/this-week-in-source-control.html), and it replaces tea as Gitea's official CLI. tea is discontinued and its repository archived. A migration guide maps its commands and flags to gt's. Commands, flags, `--json` fields and exit codes now follow semantic versioning. Changes since 0.1.0 include:

- `gt upgrade` replaces the binary after checking its SHA-256 checksum, or names the package manager command when gt came from Homebrew, Nix, a Linux package or `go install`.
- Extensions named `gt-NAME` install from any Gitea instance, and GitHub CLI extensions that avoid GitHub's APIs also run.
- `gt pr backport` cherry-picks a merged pull request onto one or more release branches and opens a pull request into each.
- Every command with `--json` also takes `--csv`.

[git-loom 1.0](https://github.com/narnaud/git-loom/releases/tag/v1.0.0) merges a set of feature branches into one integration branch, where they are built and tested together. Its commands commit, amend, split and move changes between those branches while the integration branch stays checked out, and rewrite history so each stays a side branch joined by a merge.

Stacked branches are pushed as one pull request each to GitHub, GitLab, Azure DevOps or Gerrit. Commits get short IDs from a `Change-Id` trailer, so the IDs stay the same across rewrites. With 1.0 the commands, `loom.*` settings and agent mode follow semantic versioning, and it requires Git 2.43 or later.

[difftastic 0.72.0](https://github.com/Wilfred/difftastic/releases/tag/0.72.0) changes its preprocessing heuristics so it falls back to text diffing less often, and updates the Haskell and Kotlin parsers. Verilog, F# and Smali support is removed. The Verilog and F# parsers made the `difft` binary large, and the upstream Smali parser is unmaintained. It also fixes terminal width detection when stdin, stdout and stderr are all redirected, which broke in 0.71 and was most noticeable when running difft from jj.

[GitButler 0.23.2](https://github.com/gitbutlerapp/gitbutler/releases/tag/release%2F0.23.2) stops commits and amends from disturbing staged files, and undo now restores deleted branches after a git garbage collection. Merge request listing also works on older GitLab instances. On the command line, `but agent setup` adds Amp support, and `but worktree new --above` takes branch names and IDs as well as git revisions.

Also out: [forges v0.3.1](https://github.com/danielroe/forges/releases/tag/v0.3.1).

## Security

[Gitea 28.3.0](https://blog.gitea.com/release-of-28.3.0/) fixes 21 CVEs, many of them places where public-only tokens could reach private data or admin actions. Among them:

- With `ACCOUNT_LINKING = auto` and open registration, someone signing in through an OAuth2 provider could enter another user's name or email and be linked to that existing account with only the OAuth2 sign-in (CVE-2026-120263).
- A user with read access could submit a pull request review whose `commit_id` named their own commit, so `pull_request_review` workflows ran from that commit with the repository's secrets and a write token (CVE-2026-118386).
- A site administrator's public-only token could use the admin API to list every user's email address and create new administrators (CVE-2026-117635).
- An organization owner's public-only token had enough access to delete all of the organization's repositories, private ones included (CVE-2026-119441).
- Release binaries are built with Go 1.27.3, which rejects certificates chained through the eMudhra intermediates, for Gitea's outgoing connections to OAuth2 providers, webhooks, mirrors and migrations (CVE-2026-111943). Saturday's [package management roundup](/2026/10/31/this-week-in-package-management.html) has more on that incident, including a test page showing that the git Apple ships with macOS still accepts those certificates.

Alpine Linux [rebuilt its GitLab instance](https://alpinelinux.org/posts/GitLab-security-incident-CVE-2026-97229.html) after an attacker tried to exploit CVE-2026-97229 on 20 and 21 October. The bug is in Onigmo, Ruby's regular expression engine, and GitLab's fix is a patch applied to the Ruby in its official packages. Alpine's image used standard Ruby, so upgrading GitLab on 22 October left it vulnerable.

The attacker crashed worker processes eight times, and Alpine found no evidence of code execution. A check on 26 October turned up the unpatched Ruby, and the instance was rebuilt and reopened on 29 October. The aports repository and packages, including the 21 October releases, were checked against outside records, and all passwords were reset. GitLab installs that use their own Ruby also need Ruby 3.3.13, 3.4.12, 4.0.9 or later.

[Scanning 7.25M public repositories on Gitee for secrets](https://www.mongodb.com/company/blog/technical/scanning-7-point-25-million-public-repositories-chinas-largest-git-platform-for-secrets) (Ben Zimmermann, MongoDB) found 26,400 unique verified-live credentials using TruffleHog and Kingfisher. The only official Gitee API endpoint that returned useful data at that size was user search, so the repository list was built from that, Explore feeds, per-user pages and the Elasticsearch widget behind the site's search. GitHub runs secret-scanning partnerships with credential issuers, and Gitee has no public equivalent.

## GitHub

[GitHub Desktop 3.6.10 and later can sign in with short-lived tokens](https://github.blog/changelog/2026-11-02-github-desktop-adds-short-lived-authentication-tokens) that refresh automatically for API requests and git operations. The rollout is gradual and covers github.com only. Existing tokens stay as they are, and an installation gets short-lived tokens at its first sign-in after the rollout reaches it.

The [3.6.8 release notes](https://github.com/desktop/desktop/releases/tag/release-3.6.8) list the change alongside Git 2.56.0, Git LFS 3.8.1 and Git Credential Manager 2.9.1. [3.6.10](https://github.com/desktop/desktop/releases/tag/release-3.6.10) bundles [Git for Windows 2.56.0.windows.4](https://github.com/git-for-windows/git/releases/tag/v2.56.0.windows.4), whose brotli upgrade to 1.2.1 fixes CVE-2026-111497.

Pull request limits can now [exempt contributors by account age or by number of merged pull requests](https://github.blog/changelog/2026-10-28-pull-request-limits-exempt-contributors-by-age-or-history) in that repository. A contributor who meets either enabled rule can open pull requests beyond the cap.

[Push protection can block AI-detected secrets](https://github.blog/changelog/2026-10-28-push-protection-beyond-predefined-secret-patterns), in public preview, using a classifier that scores a value by how the surrounding code uses it, in place of format matching. GitHub reports it more than doubled the number of pushes where push protection caught a secret. It is opt-in and requires AI-detected secret scanning and push protection to be enabled first.

The Meta API now lists [three more IP ranges for webhook deliveries](https://github.blog/changelog/2026-10-29-webhook-ip-ranges-added-to-the-meta-api) in its `hooks` field. Static allowlists for incoming webhooks need the new CIDR prefixes added.

## Elsewhere

Tangled has [relaunched as a federated code forge](https://tangled.org/blog/forge) on the AT Protocol. Knot2, a rewrite of its git server in Rust, stores issues, pull requests, comments and labels in the repository as collaborative objects, chains of git objects synced over the AT Protocol firehose. Each edit also writes an attestation record to the author's own PDS.

The release adds organization accounts and stacked pull requests with interdiffs for git and jj users. A new Svelte frontend is served from read-only Rust indexers in 11 or more regions, and self-hosted knots need upgrading to v1.20.0.

David Bushell [responded to the new Tangled UI](https://dbushell.com/2026/11/01/tangled-accessibility/) with an accessibility review. The interface sets text at 12px, and a `font-size: 16px` on the `<html>` element fixes the root size regardless of browser settings. Forcing a 200% resize clips and truncates text, which fails WCAG 2.2's 1.4.4 Resize Text criterion.

Forgejo is [removing OpenID 2.0 sign-in](https://forgejo.org/2026-11-removing-openid/) in v19, due on 25 March 2027, and keeping OpenID Connect and OAuth. The v15 LTS keeps OpenID 2.0 until its end of life on 15 July 2027, and v17 and v18 keep it until 29 April 2027.

[Git Rev News 140](https://git.github.io/rev_news/2026/10/31/edition-140/) leads with a fix for `git push --force-if-includes`, which rejected valid force pushes when the remote-tracking ref had no reflog. A ref created by `git clone` with the files backend gets its first reflog entry when it moves, and before that a cut-off timestamp was left uninitialised.

Aleksei Sviridkin's one-line patch sets it to 0. In review Junio Hamano suggested a 90-day cut-off, then agreed to 0 after Tyler Cipriani described a case with default gc settings where the cut-off gives the wrong answer.

The first version of the patch carried an `Assisted-by: LLM` trailer following Linux kernel practice. After Junio pointed to the AI section of Git's `SubmittingPatches`, version 3 of the patch dropped the trailer.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
