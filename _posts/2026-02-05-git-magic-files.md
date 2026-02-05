---
layout: post
title: "Git's Magic Files"
date: 2026-02-05 10:00 +0000
description: "Magic files and where to find them: .gitignore, .gitattributes, .mailmap, .git-blame-ignore-revs, .lfsconfig, and more."
tags:
  - git
  - tools
  - development
---

A follow-up to my post on [extending git functionality](/2025/11/26/extending-git-functionality.html). Git looks for several special files in your repository that control its behavior. These aren't configuration files in `.git/`, they're committed files that travel with your code and affect how git treats your files.

If you're building a tool that works with git repositories, like [git-pkgs](https://github.com/git-pkgs/git-pkgs), you'll want to ensure you respect these configs.

### .gitignore

Patterns of files git should never track. One pattern per line, supports wildcards and directory markers.

```
node_modules/
*.log
.env
dist/
```

Git checks multiple ignore files in order: `.gitignore` in each directory, `.git/info/exclude` for local-only ignores, and the global ignore file at `~/.config/git/ignore` or wherever `core.excludesFile` points. Global ignores are good for OS-specific files like `.DS_Store` or `Thumbs.db` that shouldn't clutter every project's `.gitignore`.

The pattern matching supports wildcards (`*.log`), directory markers (`dist/`), negation (`!important.log`), and character ranges. The `**` pattern matches nested directories.

GitHub, GitLab, and Gitea all respect `.gitignore` and won't show ignored files in the web UI. Package managers often ship with their own ignore patterns (`node_modules/`, `vendor/`, `target/`) that you're expected to add to your ignore file.

See the [gitignore docs](https://git-scm.com/docs/gitignore) for the full pattern syntax. GitHub maintains [a collection of .gitignore templates](https://github.com/github/gitignore) for different languages and frameworks.

### .gitattributes

Tells git how to handle specific files. This is where you configure filters, diff drivers, merge drivers, line ending normalization, and language detection overrides.

```
# Clean/smudge filters
*.psd filter=lfs diff=lfs merge=lfs

# Line ending normalization
*.sh text eol=lf
*.bat text eol=crlf

# Treat as binary
*.png binary

# Custom diff driver
*.json diff=json

# Merge strategy
package-lock.json merge=ours

# Language detection override for GitHub Linguist
vendor/* linguist-vendored
*.gen.go linguist-generated
docs/* linguist-documentation
```

The `text` attribute tells git to normalize line endings. The `binary` attribute tells git not to diff or merge, just pick one version. The `merge=ours` strategy always keeps your version during merge conflicts.

GitHub Linguist reads `.gitattributes` to override its language detection. Mark vendored code with `linguist-vendored` to exclude it from language statistics. Mark generated files with `linguist-generated` to collapse them in diffs. Mark documentation with `linguist-documentation` to exclude it from stats.

Like `.gitignore`, git checks `.gitattributes` files in each directory and `.git/info/attributes` for local-only attributes.

The [gitattributes docs](https://git-scm.com/docs/gitattributes) cover all attributes. The [GitHub Linguist docs](https://github.com/github-linguist/linguist/blob/main/docs/overrides.md) list its specific attributes.

### .lfsconfig

Git LFS configuration that travels with the repository. Uses git config format to set the LFS endpoint URL, transfer settings, and other LFS options.

```
[lfs]
    url = https://lfs.example.com/repo
[lfs "transfer"]
    maxretries = 3
```

Git LFS reads `.lfsconfig` automatically when you run LFS commands. This lets you commit LFS configuration so everyone working on the repo uses the same settings. Without it, developers need to manually configure their local LFS setup.

LFS also uses `.gitattributes` to mark which files should be handled by LFS (the `*.psd filter=lfs diff=lfs merge=lfs` pattern shown above). The `.lfsconfig` file handles the LFS-specific settings like where to find the LFS server. If you add file patterns to LFS after files are already committed, you need to run `git lfs migrate` to rewrite history and move those files into LFS.

See the [Git LFS config docs](https://github.com/git-lfs/git-lfs/blob/main/docs/man/git-lfs-config.adoc) for all available options.

### .gitmodules

Configuration for git submodules. Git writes this file when you run `git submodule add` and reads it when you run `git submodule update`.

```
[submodule "vendor/lib"]
    path = vendor/lib
    url = https://github.com/example/lib.git
    branch = main
```

Each submodule gets an entry with its path, URL, and optionally the branch to track. The file lives at the root of your repository.

Submodules let you embed other git repositories as dependencies. Running `git clone` doesn't fetch submodule content automatically, you need `git submodule update --init --recursive` or pass `--recurse-submodules` to clone.

They don't handle versioning well (you track a specific commit, not a version range), they create nested `.git` directories, and forgetting to update them creates confusing states.

But submodules work fine for vendoring code you control or for monorepo structures where you want to check out only part of the tree.

The [git submodules docs](https://git-scm.com/docs/git-submodule) explain the full workflow. The [gitmodules docs](https://git-scm.com/docs/gitmodules) cover the file format.

### .mailmap

Maps author names and email addresses to canonical identities. Git uses this for `git log`, `git shortlog`, and `git blame` output.

```
# Map old email to new email
Jane Developer <jane@company.com> <jane@oldcompany.com>

# Standardize name spelling
Jane Developer <jane@company.com> Jane Dev <jane@company.com>

# Fix both
Jane Developer <jane@company.com> <janed@personal.com>
Jane Developer <jane@company.com> J Developer <janed@personal.com>
```

The format is `Proper Name <proper@email.com> Commit Name <commit@email.com>`. Git looks for entries matching the commit author and rewrites the output.

This matters for contributor statistics. GitHub's contributor graphs use mailmap. `git shortlog -sn` uses it to count commits per author. Tools analyzing commit history use it.

Without mailmap, contributors who changed email addresses or fixed typos in their names show up as multiple people. With it, all their commits aggregate under one identity.

The [gitmailmap docs](https://git-scm.com/docs/gitmailmap) cover the file format. You can put mailmap at `.mailmap` in the repo root or configure `mailmap.file` to point elsewhere.

### .git-blame-ignore-revs

Lists commits that `git blame` should skip. Put the commit SHA of bulk formatting changes, linting passes, or other noise commits in this file and blame will look through them to find the meaningful change.

```
# .git-blame-ignore-revs
# Ran prettier on entire codebase
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0

# Migrated to ESLint flat config
b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1
```

Configure git to use it with `git config blame.ignoreRevsFile .git-blame-ignore-revs`. GitHub, GitLab (15.4+), and Gitea all read this file automatically without configuration.

This solves the problem where running a formatter on the entire codebase makes `git blame` useless. With this file, blame skips those commits and shows the actual author of the logic.

The file format is simple: one commit SHA per line, with `#` for comments. See the [git blame docs](https://git-scm.com/docs/git-blame#Documentation/git-blame.txt---ignore-revs-fileltfilegt) for details.

### .gitmessage

A template for commit messages. You configure this with `git config commit.template .gitmessage` and git will pre-fill the commit message editor with this content.

```
# .gitmessage
# <type>: <subject>
#
# <body>
#
# <footer>
#
# Types: feat, fix, docs, style, refactor, test, chore
```

Unlike the other files in this post, `.gitmessage` requires manual configuration per clone. Each developer needs to run `git config commit.template .gitmessage` after cloning. Some teams automate this with a setup script or use tools like [husky](https://github.com/typicode/husky) to set local configs during installation. This extra step is why most projects prefer `commit-msg` hooks to validate format rather than templates to guide writing.

The [git commit docs](https://git-scm.com/docs/git-commit#_discussion) mention template files. The `prepare-commit-msg` hook is an alternative that can generate dynamic templates.

## Forge-Specific Folders

Git forges extend repositories with their own magic folders: `.github/`, `.gitlab/`, `.gitea/`, `.forgejo/`, `.bitbucket/`. These aren't git features, but they follow the same pattern: configuration that travels with your code.

Inside these folders you'll find CI/CD workflows, issue and PR templates, CODEOWNERS files mapping paths to required reviewers, and other forge-specific configuration. The folders let forges add features without polluting the repository root.

Forgejo and Gitea have fallback chains. Forgejo checks `.forgejo/` → `.gitea/` → `.github/`. Gitea checks `.gitea/` → `.github/`. This lets you override GitHub-specific config when hosting on multiple platforms.

SourceHut uses `.build.yml` at the root or `.builds/*.yml` for CI, without a dedicated folder namespace.

## Other Conventions

**.gitkeep** is a convention, not a git feature. Git doesn't track empty directories. If you want an empty directory in your repository, you put a `.gitkeep` file in it so git has something to track. The filename `.gitkeep` is arbitrary, it could be anything.

**.gitconfig** files sometimes appear in repositories as suggested configuration. Git won't load these automatically (security reasons), but projects include them with instructions to run `git config include.path ../.gitconfig` or manually copy settings. Common in monorepos or projects with specific git settings they want to standardize.

**.gitsigners** or similar files track GPG/SSH signing keys for trusted contributors. Not a native git feature, but used by some projects (notably the Linux kernel) as part of their signing workflow. Git's `gpg.ssh.allowedSignersFile` config can point to a file of trusted SSH keys that `git log --show-signature` uses for verification.

**.gitreview** configures [Gerrit](https://www.gerritcodereview.com/) code review integration. Used by projects hosted on Gerrit (OpenStack, Android, Eclipse) to specify which Gerrit server and project to push to.

```
[gerrit]
host=review.opendev.org
port=29418
project=openstack/nova.git
defaultbranch=master
```

Running [`git review`](https://docs.opendev.org/opendev/git-review/latest/) reads this file and pushes commits to Gerrit for review instead of directly to the branch. It's a canonical example of a tool extending git's workflow through a committed config file.

**.gitlint** configures [gitlint](https://jorisroovers.com/gitlint/) for commit message linting. Follows the same pattern: commit the config, everyone gets the same rules.

```
[general]
ignore=body-is-missing

[title-max-length]
line-length=72
```

Gitlint reads this to validate commit message format. Similar to using a `commit-msg` hook but with the configuration traveling with the repository.

**.jj/** is [Jujutsu](https://github.com/jj-vcs/jj)'s working copy state directory. Jujutsu is a git-compatible VCS that stores its own metadata in `.jj/` while respecting all of git's magic files. If you use `jj`, you'll have both `.git/` and `.jj/` in your repository, and `.gitignore`, `.gitattributes`, `.mailmap` all work the same way.

## Beyond Git

The pattern extends beyond git. Other tools follow the same approach: drop a dotfile in your repository, tools detect it automatically, behavior changes.

**.editorconfig** standardizes editor behavior across teams. Put it at the root of your repo and editors read it to configure indent style, line endings, trailing whitespace, and character encoding.

```
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

VS Code, Vim, Emacs, Sublime, and most other editors either support it natively or have plugins. See [editorconfig.org](https://editorconfig.org/) for the full spec.

**.ruby-version**, **.node-version**, **.python-version** tell version managers which language version to use. Tools like rbenv, nodenv, pyenv, nvm, and asdf read these files when you `cd` into the directory and automatically switch versions.

```
# .ruby-version
3.3.0

# .node-version
20.11.0
```

**.tool-versions** is asdf's multi-language version file. One file for all languages.

```
ruby 3.3.0
nodejs 20.11.0
python 3.12.0
```

**.dockerignore** works like `.gitignore` but for Docker build context. When you run `docker build`, Docker sends files to the daemon. List patterns in `.dockerignore` and Docker won't send them.

```
.git
node_modules
*.log
.env
```

This speeds up builds and keeps secrets out of images. The syntax matches `.gitignore`: wildcards, negation, directory markers.

## Supporting These Files

If you're building tools that interact with git repositories, you probably want to respect these files:

- Read `.gitignore` when walking the repository tree
- Read `.gitattributes` to know which files are binary, vendored, or generated
- Read `.mailmap` when displaying author information
- Read `.gitmodules` if you need to handle submodules

The git config format (used by `.gitmodules` and various other files) is `[section "subsection"] key = value`. Git ships a `git config` command that reads and writes these files correctly. Most languages have git config parsers in their git libraries.

<hr>

If you know of other git magic files or have corrections, reach out on [Mastodon](https://mastodon.social/@andrewnez) or submit a pull request on [GitHub](https://github.com/andrew/nesbitt.io).
