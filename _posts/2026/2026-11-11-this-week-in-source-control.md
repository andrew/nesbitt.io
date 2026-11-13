---
layout: post
title: "This Week in Source Control: 11 November 2026"
date: 2026-11-11 10:00 +0000
description: "Releases, advisories, and articles from across version control and forges"
tags:
  - git
  - weekly
  - twisc
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3n26uuwjrqr2g"
---

This week's version control and forge news, gathered from release feeds for source control clients and forges, the [Lobsters vcs tag](https://lobste.rs/t/vcs), Hacker News, and my boosts on [Mastodon](https://mastodon.social/@andrewnez). Package management news is in the Saturday [This Week in Package Management](/2026/11/07/this-week-in-package-management.html) roundup.

## Scaling

[Inside GitHub's new Git storage architecture](https://github.blog/engineering/architecture-optimization/inside-githubs-new-git-storage-architecture/) (Karthik Raman and Brian Celenza, GitHub) describes Rubicon, the design announced at GitHub Universe. Packs go to Azure Blob Storage. References and the list of packs are stored in Ref-CAS, a replicated log service where each reference update is a compare-and-swap committed by a quorum, so a push waits only on other pushes to the same reference. In internal tests one repository accepted 7,200 pushes per second from 5,000 concurrent agents.

Requests still arrive at Spokes, which routes each one to a small group of virtual replicas, disposable compute nodes whose local disk is a cache. A replica handling a write indexes the pack, uploads it to Blob Storage, then commits one Ref-CAS transaction. For reads it sends the version in its cache, and the reply includes references only if they have changed since that version.

Two earlier prototypes stored reference state in blobs. The first, a write-ahead log indexed by a single blob, reached a limit of writes in the mid-hundreds per second. Hashing references across several segment blobs raised the write limit, but every read then had to check every segment.

Compaction runs on separate nodes that lease a shard of the repository's packs and merge them into larger ones. Each node checks that the new packs contain exactly the same objects before publishing them. The architecture is in a limited private preview, with a broader rollout planned for early next year. The follow-up list includes an atomic multi-file commit API, reading files straight from the server, and event streams.

[Optimizing reference deletions in Git](https://nayak.im/posts/optimizing-reference-deletion/) (Karthik Nayak) covers deleting refs in the files backend in repositories with millions of them, such as GitLab's own with over 15 million. Deleting a packed ref rewrites the whole `packed-refs` file, which can reach several GB. Nayak had an LLM write a Rust version of the files backend to measure the overhead of the C to Rust boundary, and the Rust version deleted refs about 17% faster.

For every record being retained, the C code rebuilt the line with `fprintf()` and `oid_to_hex()`, where the Rust version copied the original bytes. Nayak's patch writes retained records with `fwrite()` and matches the Rust version's speed. It is merged and will ship in Git 2.98, the version number that follows 2.56, with Git 3.0 due two releases after that.

## Releases

[jj 0.47.0](https://github.com/jj-vcs/jj/releases/tag/v0.47.0) adds a built-in `:editor` merge tool for `jj resolve`, which opens the conflicted file with conflict markers in a text editor and supports conflicts with more than two sides. Templates have a new top-level `revset()` function for evaluating revsets. In colocated workspaces, `jj describe -r@` and `jj restore --into=@` now preserve the Git staging area, and two race conditions with concurrent Git processes are fixed.

Updating remote-tracking Git refs in non-colocated workspaces moves from `jj git fetch` and `push` to `jj git export`. `Timestamp.format()` now uses jiff's strftime syntax in place of chrono's. [0.47.1](https://github.com/jj-vcs/jj/releases/tag/v0.47.1) fixes a dependency error that broke Linux builds of 0.47.0, and deprecates the `git.sign-on-push` boolean in favour of a `revsets.git-sign-on-push` revset of the commits to sign.

[GitButler 0.23.3](https://github.com/gitbutlerapp/gitbutler/releases/tag/release%2F0.23.3) updates linked worktrees when the workspace is updated, and preserves conflicting uncommitted changes in them with conflict markers. It fixes branch apply, unapply and update writing encrypted files or Git LFS pointers in place of file contents in git-crypt and Git LFS repositories.

On the command line, `but commit`, `amend`, `discard` and `diff` accept Git-style paths, and `but diff` and `but show` take `--stat`. `but commit` runs Git commit hooks again in the main checkout. `but push --dry-run` lists the branches that would be refused and exits non-zero if there are any.

[forges 0.3.2](https://github.com/danielroe/forges/releases/tag/v0.3.2) adds providers for Entire and GitBucket, which brings the capability table to 14 forges. The Cursor Origin provider goes from 13 verified capabilities to 35, and the GitHub provider adds `users.sponsorableMany`. Two sourcehut fixes cover parsing web URLs on an instance's root host and accepting a service host as `baseUrl`.

The [Pushin changelog for 6 November](https://pushin.eu/docs/blog/2026-11-06-changelog) (Peter, Pushin) adds branch and tag rulesets that can block history rewrites and deletion, and require a minimum number of approvals and passing workflow checks before a merge. Personal access tokens can now be scoped per permission group and limited to selected repositories. Existing tokens are migrated with full access and their expiry dates removed.

Webhooks are set up once per account or organisation and reused across repositories. The release also adds repository transfers that the new owner has to accept, runner groups shared across repositories, and Atom feeds for commits, releases, issues and pull requests.

## Security

[Git 2.56.1](https://github.blog/open-source/git/git-security-vulnerabilities-announced-7/) (Elijah Newren, GitHub) fixes six vulnerabilities, with backports in 2.55.1, 2.54.1, 2.53.1, 2.52.1, 2.51.3 and 2.50.2:

- CVE-2026-111760: an integer truncation in index handling let an extremely long path pass validation under one name and be written under a shorter one. A malicious repository could use it to replace a submodule's `.git` file with a symlink to a directory of attacker-supplied config or hooks, which then ran during a recursive clone.
- CVE-2026-113408: when cloning an empty repository over protocol v2, a server could advertise a HEAD symref whose target contained path-traversal components. With the files ref backend, a later update to that branch could write outside the reference directory.
- CVE-2026-114467: the code that strips GPG signatures from a message had a fixed-size stack array with room for two. Merging a tag with more than two wrote past the end of it, and hosting services that run merges for users are affected too.
- CVE-2026-114469: the 1 GiB patch size limit checked only the size of the input, so a small binary patch that inflates past the limit caused an out-of-bounds read.
- CVE-2026-105437: the size calculation for a merge result could overflow with many conflicts and a large `conflict-marker-size`, and Git then wrote outside the undersized buffer.
- CVE-2026-114466: `git fast-import` now accepts `rewrite-submodules-from`, `rewrite-submodules-to` and `export-pack-edges` in an input stream only when the caller passes `--allow-unsafe-features`. The first two could read arbitrary files and the third could create or append to them.

GitHub has deployed the fixes on github.com and released GitHub Enterprise Server 3.19.15, 3.20.11, 3.21.9 and 3.22.4. [Git for Windows 2.56.1](https://github.com/git-for-windows/git/releases/tag/v2.56.1.windows.1) includes the same six fixes, and GitHub says patched GitHub Desktop builds will follow.

[lazygit 0.66.3](https://github.com/jesseduffield/lazygit/releases/tag/v0.66.3) skips submodules whose name or path in `.gitmodules` resolves outside the repository. lazygit parses `.gitmodules` itself, and [the pull request](https://github.com/jesseduffield/lazygit/pull/6187) explains that removing a submodule named `../../../victim` deleted the `victim` directory next to the repository. Anyone able to commit a `.gitmodules` file could set that up. Git skips such names, and lazygit now applies the same check and removes a submodule only when its git dir is inside `.git/modules`.

[Gerrit 3.14.5](https://www.gerritcodereview.com/3.14.html#3145) fixes a vulnerability where any user able to read a change could use `on_behalf_of` to act as a project owner and remove another reviewer's vote. The release also speeds up tag listing by building the full tag details only for the page being returned. Listing 26 tags in a repository with 20,000 annotated tags went from around 450ms to between 15 and 35ms.

## GitHub

A [new pull request overview page](https://github.blog/changelog/2026-11-05-new-pull-request-overview-page-in-public-preview) is in opt-in public preview. It moves merge status to the top of the page in a redesigned merge box that takes less than half the space, with checks, comments and approvals summarised beside it. Conversations can be filtered to unresolved threads or the viewer's own comments, and sorted newest first. A button in the header switches the preview on, and the same menu switches back to the classic page.

[Secret scanning now covers GitHub Actions workflow logs](https://github.blog/changelog/2026-11-09-secret-scanning-detects-secrets-in-github-actions-workflow-logs) in public preview, for GitHub Enterprise Cloud customers with Secret Protection or Advanced Security. Logs are scanned for provider patterns when a run completes, and the alerts are retained when the logs are deleted. Scanning is limited to provider patterns in logs from new runs, which excludes existing logs, generic patterns, custom patterns and secrets already masked by Actions.

## Elsewhere

Anil Madhavapeddy is [using Brief to power auto-CI](https://amok.recoil.org/@avsm/117581872386695231) in a new Tangled spindle. [Brief](https://github.com/git-pkgs/brief) is my tool for detecting the languages and toolchains in a repository. In [the pipeline for Madhavapeddy's xdge library](https://tangled.org/anil.recoil.org/xdge/pipelines/3mzsusqp3zf22/workflow/detect), a `detect` workflow runs first, followed by an `ocaml-ci` workflow that builds on Debian 13 across several OCaml versions on x86_64 and arm64.

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
