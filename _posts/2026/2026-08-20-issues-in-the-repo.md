---
layout: post
title: "Issues in the Repo"
date: 2026-08-20 10:00 +0100
description: "refs/bugs, refs/notes, refs/heads/ticgit, or a directory full of YAML."
tags:
  - git
  - tools
  - reference
---

GitHub had a rough Monday this week, with git operations, Actions, and the issue tracker all unavailable for [several hours](https://www.githubstatus.com/incidents/zkxwbgr0cnmx). Code being unreachable during a forge outage is annoying but survivable because every contributor already has a full clone. Issues and pull request threads going dark is a different matter, since for most projects those exist only in GitHub's database and nowhere else. I [asked on Mastodon](https://mastodon.social/@andrewnez/117111291448638063) about tools that keep issue and review data inside the repository so it clones and pushes with the code, and got pointed at more projects than I expected, spanning about twenty years of people having a go at this.

The projects sort by where they physically put the data, and each storage location brings its own answers to the same handful of questions: whether a plain `git clone` fetches it, what happens when two people edit the same issue offline and then both push, whether you can read it without the tool installed, whether it survives being pushed to a bare git host that has no support for the tool, and who counts as the author of an issue when there are no forge accounts. I [wrote about git's extension points](/2025/11/26/extending-git-functionality.html) last year and several of these tools use the custom-ref mechanism from that post, but here I'm looking at the data model rather than the plumbing.

### Files in the working tree

The oldest approach is to make each issue a text file, or a directory of files, checked in next to the source. [Bugs Everywhere](https://bugs-everywhere.readthedocs.io/) did this in 2005 for Bazaar and later added git and Mercurial backends, and [ditz](https://rubygems.org/gems/ditz) stored issues as YAML from 2008. More recently [GitRoot](https://gitroot.dev) builds an entire self-hosted forge on the same idea, keeping issues as `issues/<id>-<slug>.md` with front-matter status fields, users and permissions as YAML under `.gitroot/`, and a small server that renders the lot as a web UI. [Matthew Martin](https://mastodon.social/@mistersql/117111351359071242) pointed at his own [ticket directory](https://github.com/matthewdeanmartin/keepachangelog-manager/tree/main/tickets) that reuses keep-a-changelog fragments as lightweight work items with no tooling at all, which is about as minimal as this pattern gets.

In Diomidis Spinellis's [git-issue](https://github.com/dspinellis/git-issue) the `.issues/` directory is itself a nested git repository with its own `.git`, sha-bucketed as `issues/ef/1a04f.../description`, `.../tags`, `.../assignee` and so on. That keeps the outer project's history untouched, though the outer clone then doesn't carry the issues at all.

Because the issues are ordinary tracked files, everything git already does works with no extra configuration: `git clone` fetches them, `grep -r` searches them, `cat` reads them, `git bundle` packs them, any dumb HTTP host or cgit instance serves them, and `git log -p .issues/` shows who changed what and when. Concurrent edits to the same issue become a normal three-way text merge. That works cleanly when two people append separate comments to the bottom of a file, and produces a real conflict when they both change the title line, which you resolve the same way you'd resolve a conflict in code. The author of an issue is whoever `git blame` says created the file, backed by whatever commit signing the project already uses, so identity comes from git's existing model rather than needing its own.

The drawback is that issue history and code history share one commit graph. On a busy project `git log` fills with "reword issue #34" interleaved with real changes, `git bisect` lands on issue-edit commits, and creating a feature branch forks the issue state along with the code, so an issue closed on the branch shows as open again the moment you switch back to main. Most of these tools work around the log noise by making each issue operation its own commit with a conventional prefix that's easy to `--invert-grep` away, but the branching problem is unavoidable while mutable metadata is in the same tree as the code it describes.

### Orphan branch

An orphan branch is a ref under `refs/heads/` whose root commit has no parent, so it shares no history with `main` and its files never appear in a normal checkout. Scott Chacon's [ticgit](https://github.com/schacon/ticgit) from 2008 and the later [ticgit-ng](https://github.com/jeffWelling/ticgit) fork keep issues on a branch literally called `ticgit`, with each issue as a directory in that branch's tree, and GitHub's old `gh-pages` convention used the same mechanism for documentation. The very new [haxy](https://github.com/xit-vcs/haxy) forge from the xit project puts an event log on `refs/heads/haxy/events` where each commit has an empty tree and the commit message is a JSON event describing an issue creation, comment, or status change; the server replays the log to build its state.

The tool reads and writes the branch through plumbing or a second worktree, so `git log` on `main` stays free of issue noise, and merging concurrent edits works the same as for any files on a branch. Because the ref is under `refs/heads/` a default `git clone` fetches it automatically, which is the one clear advantage this has over the notes and custom-ref approaches below.

```console
$ git ls-tree ticgit
040000 tree 9b721cc...  1206206148_add-attachment-to-ticket_138
040000 tree 5d14214...  1206206166_download-attached-file_112

$ git ls-tree ticgit:1206206148_add-attachment-to-ticket_138
100644 blob cfdb466...  ASSIGNED_schacon@gmail.com
100644 blob 3074cf0...  COMMENT_1206206148_schacon@gmail.com
100644 blob f510327...  STATE_open
100644 blob 6d44874...  TAG_attach
100644 blob 9ebd07e...  TICKET_ID
```

Ticgit encodes almost everything in filenames (`STATE_open`, `TAG_attach`, `ASSIGNED_<email>`) so `git ls-tree` alone shows the state of an issue without reading any blobs. Haxy puts everything in the commit message instead, so `git log haxy/events` is the entire database, and in both cases the data is legible with stock git and no extra tool installed.

The trouble with an orphan branch is that it shows up in `git branch -a` looking like any other branch, so on a project with enough contributors someone will eventually delete the "stale" `ticgit` branch while tidying up. A `git push --prune` or `git push --mirror` from a clone made with `--single-branch`, or from a CI job that only fetched `main`, deletes it on the remote because the local side has no matching ref. Branch protection on most forges is pattern-based (`main`, `release/*`) and won't cover a branch called `ticgit` unless someone remembers to add it.

Checking the orphan out in your only working tree swaps every file for the issue files, which is why the tools read it through `git show ticgit:path` rather than `git checkout`. The objects are safe from `git gc` for as long as the ref exists, but once the ref is deleted the entire disconnected graph becomes unreachable and the next `gc --prune` removes it, with no server-side reflog to recover from.

### git notes

Git ships with a [notes facility](https://git-scm.com/docs/git-notes) that attaches arbitrary blobs to existing commits without rewriting them, stored under `refs/notes/<namespace>`. The notes ref points at an ordinary commit whose tree maps each annotated commit's SHA to a blob, so adding a note is itself a commit and the full edit history is kept. Google's now-archived [git-appraise](https://github.com/google/git-appraise) built distributed code review entirely on this: review requests are line-delimited JSON under `refs/notes/devtools/reviews`, threaded comments under `refs/notes/devtools/discuss`, and CI status under `refs/notes/devtools/ci`, all attached to the commit being reviewed.

```console
$ git for-each-ref refs/notes/
e70fe480... commit  refs/notes/review

$ git cat-file -p refs/notes/review^{tree}
100644 blob 677b652c...  0a72c46f9a191c6097f708ccdabcd6af13eebede

$ git cat-file -p 677b652c
{"timestamp":"2026-08-18T00:00:00Z","reviewRef":"refs/heads/main",
 "targetRef":"refs/heads/master","description":"Demo review request",
 "requester":"andrew@example.com"}
```

Notes are not fetched by a default clone; you add `fetch = +refs/notes/*:refs/notes/*` to the remote config once and then they travel with every pull and push. Merging has first-class support in git itself via `git notes merge`, and the `cat_sort_uniq` strategy concatenates and dedupes conflicting notes line by line, which is why git-appraise stores one JSON object per line rather than a single pretty-printed document. Any git host accepts the ref, `git log --notes='*'` shows notes inline under each commit, and `git bundle create backup.bundle --all` packs them. The structural limitation is that a note has to hang off an existing commit, which suits code review and CI results very well and suits a bug report that isn't about any particular commit rather less.

### Custom ref namespaces

The approach most of the currently-active projects have settled on is to store data under a ref namespace outside `refs/heads/`, so nothing shows up in `git branch`, nothing touches the working tree, and the tool controls the object layout completely. [git-bug](https://github.com/git-bug/git-bug) is the most developed example: each bug is a chain of commits under `refs/bugs/<id>`, each commit's tree holds an `ops` blob of JSON operations plus zero-byte marker files whose names encode Lamport clock values, and user identities are separate chains under `refs/identities/<id>`.

Gerrit's [NoteDb](https://gerrit-review.googlesource.com/Documentation/note-db.html) keeps every change's review metadata as a commit graph at `refs/changes/NN/NNNN/meta` and has run Google's own code review without a SQL database since Gerrit 3.0. [Radicle](https://radicle.xyz) stores issues and patches as collaborative objects under per-peer `refs/namespaces/<nodeid>/refs/cobs/` and merges them over a gossip protocol rather than push. [git-native-issue](https://github.com/remenoscodes/git-native-issue) keeps each issue as a commit chain under `refs/issues/<uuid>` where the tree is empty and the metadata is carried in commit-message trailers (`State: open`, `Labels: bug`) rather than JSON, with a published [format spec](https://github.com/remenoscodes/git-native-issue/blob/main/ISSUE-FORMAT.md) intended to be readable by any tool. Even the centralised forges use this layer for the code half of a pull request, exposing `refs/pull/N/head` on GitHub and `refs/merge-requests/N/head` on GitLab, though those are written by the forge and read-only to clients.

```console
$ git fetch origin 'refs/bugs/*:refs/bugs/*' 'refs/identities/*:refs/identities/*'
$ git for-each-ref refs/bugs/ | head -1
aecc49e1... commit  refs/bugs/0066216d1e0cc97ad1c9eaa553459ca85a0d57e133e...

$ git cat-file -p aecc49e1^{tree}
100644 blob e69de29b...  create-clock-354
100644 blob e69de29b...  edit-clock-2314
100644 blob 588a2a80...  ops
100644 blob e69de29b...  version-4

$ git cat-file -p 588a2a80
{"author":{"id":"193531e4590156..."},
 "ops":[{"type":1,"timestamp":1722433238,
         "title":"Issue running the example_test.go",
         "message":"Hi y'all, I'm really excited...","files":null}]}
```

A default clone skips these refs entirely, so the first thing every tool does is add its refspec to `.git/config`. After that the data pushes to and pulls from any git host that accepts arbitrary ref names, which today is all of the major ones. Because each edit is appended as a new commit rather than modifying an existing blob, two people editing the same bug offline produce two divergent tips that the tool merges by replaying both operation logs against the Lamport clocks, and there is never a text-level conflict to resolve by hand. The raw objects are inspectable with `git cat-file` as above but not really readable without the tool. Identity is handled inside the data model: git-bug stores name, avatar and login in a versioned identity object, and Radicle derives it from the node's Ed25519 key.

git-bug also ships [bridges](https://github.com/git-bug/git-bug/blob/master/doc/usage/third-party.md) that import from and export to GitHub, GitLab and Jira, so an existing tracker can be mirrored into `refs/bugs/` and kept usable through exactly the kind of outage that started this post. Forgejo has an [open feature request](https://codeberg.org/forgejo/forgejo/issues/2629) for storing its own issues this way, and one proposal in that discussion is to treat `refs/issues/*` as the canonical store with the forge's SQL tables rebuilt from it as a query index.

### Built into the VCS

[Fossil](https://fossil-scm.org) was designed from the start with tickets, wiki pages, forum threads and technotes as artifact types stored alongside check-ins in the same content-addressed store, all packed into a single SQLite database file per repository. A ticket exists as a set of immutable artifacts that each declare changes to named fields, and the current state of a ticket is computed by applying every artifact with a matching ticket id in timestamp order. SourceGear's [Veracity](https://web.archive.org/web/20160305220839/http://veracity-scm.com/) took a similar line around 2011 with a distributed bug database synced alongside the source DAG, though the project has since been discontinued.

```console
$ fossil artifact 94cd0c6265
D 2026-08-18T06:37:37.865
J comment Something\sis\sbroken
J priority Medium
J status Open
J title Demo\sbug
J type Code_Defect
K 821e9e51da937dc2c37227ef8ed57c757e7530f0
U andrew
Z 1c440428fff5e32c7c5304e9f6cd5bec
```

The [card format](https://fossil-scm.org/home/doc/trunk/www/fileformat.wiki#tktchng) is one letter per line type: `D` is the timestamp, each `J` is a field assignment with spaces escaped as `\s`, `K` is the id of the ticket this artifact modifies, `U` is the user, and `Z` is an MD5 of the preceding lines. Syncing exchanges any artifacts the other side lacks, concurrent edits to the same ticket both survive as separate artifacts, and because each `J` card sets one field the effective merge policy is last-writer-wins per field with no conflict markers.

Everything travels with `fossil sync` or `fossil clone` because there is only one file. Identity is the `U` card backed by Fossil's own login system, and the whole thing is readable with `fossil ticket show` or by opening the SQLite file directly. The obvious drawback is that none of this is git, so it composes with git-based tooling only through [import and export](https://fossil-scm.org/home/doc/trunk/www/inout.wiki).

### git bundle

[Aslak Raanes](https://mastodon.social/@aslakr/117111324600445481) asked in the thread whether these approaches survive [`git bundle`](https://git-scm.com/docs/git-bundle), which is the closest thing git has to Fossil's single-file repository and the easiest way to get an offline backup onto a USB stick. I tried it: `git bundle create backup.bundle --all` on a clone of the git-bug repo with `refs/bugs/*` and `refs/identities/*` fetched packs all 454 bug refs and every identity into the bundle, and the same on a repo with `refs/notes/review` includes the notes ref. That works because `--all` to `git rev-list` means everything under `refs/`, and a bundle is just a packfile with a ref list on the front. So for every git-based approach here, files in tree, orphan branches, notes, and custom refs alike, one bundle file holds the code and the issue tracker together.
