---
layout: post
title: "All the Ways Git Submodules Don't Work"
date: 2026-09-01 10:00 +0100
description: "linked worktrees containing submodules cannot be moved with this command."
tags:
  - git
  - package-managers
  - dependencies
---

I added a worktree to a repository last week to try a branch alongside the main checkout, ran `git submodule update --init` in it because the build needed the vendored dependencies, and when I was done went to clean up with `git worktree remove`, which git refused. Per [the man page](https://git-scm.com/docs/git-worktree) only clean worktrees can be removed, and "unclean worktrees or ones with submodules" need `--force`. Submodules get their own clause in that sentence, distinct from dirty state. `git worktree move` is stricter again and [refuses outright](https://git-scm.com/docs/git-worktree#Documentation/git-worktree.txt-move) on any worktree containing submodules. I'd spent [the previous week](/2026/08/25/hardening-the-override-flag.html) cataloguing how command-line tools harden their `--force` flags, and here was git requiring one because two of its own features had collided.

A populated submodule has its own HEAD, index, refs, and potentially its own uncommitted work, and `worktree remove` treats the presence of one the same as a dirty tree. Submodules are also git's built-in dependency manager. The gitlink in the superproject's tree, a commit SHA recorded at a path with mode `160000`, is a lockfile entry. The [`.gitmodules` file](/2026/02/05/git-magic-files.html) mapping paths to fetch URLs is a manifest. `git submodule update` reads both and populates the working tree, which is the install step. The pin itself is as precise as any package manager's: an exact commit identified by object ID.

## Worktrees

GitHub's [git 2.5 announcement](https://github.blog/2015-07-29-git-2-5-including-multiple-worktrees-and-triangular-workflows/) introduced `git worktree` in July 2015 with a one-line caveat: "It's not recommended to use `git worktree` with a repository that contains submodules." Eleven years later the [current man page](https://git-scm.com/docs/git-worktree) still requires `--force` to remove a worktree that has submodules and refuses to move one. In between, `worktree add` had to be [patched to ignore `submodule.recurse`](https://github.com/git/git/commit/4782cf2ab686bacca8d2908319981ac27d54ca25) because honouring it made the internal `reset --hard` recurse into submodule paths that were still empty in the fresh worktree.

A linked worktree shares the superproject's `$GIT_DIR` but has its own working tree, HEAD, and index under `$GIT_DIR/worktrees/<id>/`. A submodule also has its own working tree, HEAD, and index, kept under the superproject's `$GIT_DIR/modules/<name>/` and connected to the checkout by a `gitdir:` pointer file plus a `core.worktree` setting pointing back the other way. Put two worktrees on different superproject branches and they reference the same submodule at two different commits, so each needs its own submodule working tree, its own submodule HEAD and index, and pointer files tying those to storage that's partly per-worktree and partly shared. `worktree remove` skips checking whether that state is disposable and requires the override, and `worktree move` refuses because the pointer-file rewrite it would need is unimplemented.

Xavier Morel [asked on the git list this March](https://www.spinics.net/lists/git/msg520955.html) whether a submodule checkout could itself be a worktree of an existing shared clone, having found bare repositories plus worktrees worked well for a set of related projects but that adding submodules on top always cloned fresh. An [RFC](https://www.spinics.net/lists/git/msg523846.html) and a [three-patch series](https://www.spinics.net/lists/git/msg523988.html) proposing `--recurse-submodules` for `git worktree add` followed in April, giving each linked worktree its own submodule git directory under `$GIT_COMMON_DIR/worktrees/<id>/modules/` and sharing the object storage between them by hardlink.

## Resolution

The gitlink records only which commit to check out, so `.gitmodules` carries a `url` per submodule and `update` clones from there. That URL is the only resolution mechanism. If the upstream repository is renamed, transferred to a different host, or taken private, every downstream pin breaks, even though the SHA is unchanged and the objects still exist in every clone that already has them. The manifest hard-codes a host because git has no lookup from a commit ID to servers that hold it.

Git also copies each URL into the superproject's `.git/config` the first time `git submodule init` runs, under `submodule.<name>.url`, and later commands read it from there, ignoring `.gitmodules`. Editing the committed `.gitmodules` to point at a mirror or a fork leaves an already-initialised clone unchanged until [`git submodule sync`](https://git-scm.com/docs/git-submodule) copies the new value across. The manifest and the local config can differ indefinitely, and git reads the local one.

The usual workaround in CI is git's global [`url.<base>.insteadOf`](https://git-scm.com/docs/git-config) config, which rewrites any URL with a matching prefix before fetching. That's most often rewriting `https://github.com/` to `git@github.com:` so an SSH deploy key applies, or redirecting an internal hostname to a mirror, and it covers submodule URLs along with everything else.

## The install step

A plain `git clone` writes the gitlink into the index so the submodule directory exists, and leaves it empty until `git submodule update --init` runs or the clone was made with `--recurse-submodules`. The [`submodule.recurse`](https://git-scm.com/docs/git-config) config setting makes `checkout`, `fetch`, `pull`, `grep` and several other commands recurse automatically, and it defaults to off.

`update` does one of three things depending on flags:

- no flags: check out the gitlink commit, detached
- `--init`: copy any missing `.gitmodules` entries into `.git/config` first (required on first run, a no-op after), then check out the gitlink commit
- `--remote`: ignore the gitlink and check out the remote-tracking branch configured for the submodule (the remote's `HEAD` if `submodule.<name>.branch` is unset)

The [command reference](https://git-scm.com/docs/git-submodule) documents all three, though the flag names conflate "install what's pinned" with "update to latest".

Switching branches in the superproject changes the gitlink in the index and leaves the submodule's working tree wherever it already was, so `git status` immediately shows the submodule as modified. Passing `--recurse-submodules` to `checkout`, or setting `submodule.recurse`, brings the submodule working tree along with the branch switch. The Rust project's [account of moving compiler subprojects off submodules](https://blog.rust-lang.org/inside-rust/2026/06/04/how-josh-helps-rust-manage-code-across-multiple-repositories/) lists this cluster from experience: checkouts left empty or on the wrong commit after clone, unrelated submodule bumps landing in pull requests because a branch switch left the submodule dirty, and custom logic in the `bootstrap` build tool to check each submodule out to the right commit before building.

## Storage

A submodule's git directory is stored under the superproject's `$GIT_DIR/modules/<name>/`, with a `.git` file in the submodule's working tree containing a `gitdir:` pointer back to it. [`git submodule absorbgitdirs`](https://git-scm.com/docs/git-submodule) migrates older clones that still have a nested `.git/` directory. Each entry under `modules/` is a git directory with its own refs, HEAD, index, config, hooks, and by default its own object store, and the April worktree patches above are one attempt to split that into shared object storage and per-checkout everything else. Removing a submodule is correspondingly spread across three places: `git rm <path>` drops the gitlink and the `.gitmodules` entry, `git submodule deinit <path>` clears the working tree and the `.git/config` entry, and the absorbed `$GIT_DIR/modules/<name>` directory that both leave behind is [documented](https://git-scm.com/docs/gitsubmodules#_forms) as a manual `rm -rf`.

The same multiplication happens in a single-worktree clone when two submodules both depend on a third repository. Each path in the superproject gets its own `modules/` entry and its own object store, unless alternates are configured by hand. Package managers with a shared cache (cargo's [registry cache](https://doc.rust-lang.org/cargo/guide/cargo-home.html), pnpm's [content-addressable store](https://pnpm.io/motivation), the [Go module cache](https://go.dev/ref/mod#module-cache)) store the bytes once and check them out per location.

## Updating the pin

The gitlink holds one commit SHA, so moving a submodule forward means entering it, fetching, checking out the new commit, leaving, and `git add <path>` in the superproject to record the new gitlink. `git submodule update --remote` fetches the configured branch's tip and checks that out instead of the recorded gitlink, and committing the result in the superproject is what moves the pin. `.gitmodules` can name a `branch` per submodule for `--remote` and the update bots to follow, and a plain `update` ignores that field and checks out the gitlink SHA regardless. There is no syntax for a version range, a tag pattern, or a minimum commit, so the manifest's only floating reference is a branch name and the gitlink is the only pin.

Dependabot and Renovate can both open pull requests bumping a gitlink. Dependabot's [`gitsubmodule` ecosystem](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file) proposes a new gitlink SHA when the submodule's configured branch moves. Renovate's [`git-submodules` manager](https://docs.renovatebot.com/modules/manager/git-submodules/) does the same and ships disabled by default. Both operate on branch tips because there are no version constraints for them to resolve.

## The security record

`.gitmodules` is committed to the repository, so a hostile upstream controls its contents, and git parses it during `clone --recurse-submodules` before the user has seen any of the fetched files. That combination has produced remote code execution repeatedly. [CVE-2018-11235](https://nvd.nist.gov/vuln/detail/CVE-2018-11235) used `../` in a submodule's name so its git directory, hooks included, was written outside `$GIT_DIR/modules/` and a `post-checkout` hook ran during clone. [CVE-2018-17456](https://nvd.nist.gov/vuln/detail/CVE-2018-17456) started a submodule URL with `-` so the child `git clone` parsed it as an option, the class of bug git's [`--end-of-options`](/2026/07/21/end-of-options.html) delimiter defends against. [CVE-2024-32002](https://github.com/git/git/security/advisories/GHSA-8h77-4q3w-gfgv) combined a symlink with a case-insensitive filesystem to write a hook into `.git/` during recursive clone. I covered the broader pattern of package-manager checkout paths as an attack surface in [the CWE field guide](/2026/05/04/package-manager-cwes.html).

## What's missing

The gitlink is already content-addressed: mode `160000` plus a commit object ID names an exact tree. Git also has [alternates](https://git-scm.com/docs/gitrepository-layout#Documentation/gitrepository-layout.txt-objectsinfoalternates) for sharing object storage between repositories on one machine, [partial clone](https://git-scm.com/docs/partial-clone) and promisor remotes for fetching missing objects on demand, and worktrees for checking one object store out at several paths. Submodules still fetch the pinned commit from a `.gitmodules` URL and each checkout still carries repository state of its own.
