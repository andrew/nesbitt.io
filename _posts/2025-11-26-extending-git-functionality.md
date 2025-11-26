---
layout: post
title: "Extending Git Functionality"
date: 2025-11-26 12:00 +0000
description: "A practical guide to the different ways you can extend git: subcommands, filters, hooks, remote helpers, and more."
tags:
  - git
  - tools
  - development
---

I've been researching how to extend git for a project I'm working on. There are six distinct patterns that I've seen people use to add functionality to git without modifying git itself:

- **Subcommands** for adding new commands
- **Clean/smudge filters** for transforming file content
- **Hooks** for enforcing workflows
- **Merge/diff drivers** for custom merging of specific file types
- **Remote helpers** for non-git backends
- **Credential helpers** for custom auth

## Subcommands

Put an executable called `git-foo` anywhere in your `$PATH` and git will run it when you type `git foo`. That's it. No registration, no configuration. Git literally just looks for executables matching the pattern.

This is how most git extensions work: [git-lfs](https://github.com/git-lfs/git-lfs), [git-flow](https://github.com/nvie/gitflow), [git-extras](https://github.com/tj/git-extras), [hub](https://github.com/mislav/hub), [gh](https://github.com/cli/cli). The [awesome-git-addons](https://github.com/stevemao/awesome-git-addons) list has hundreds of examples.

```bash
#!/bin/bash
# Usage: git hierarchize
# Install: brew install git-hierarchize (or put this script in $PATH)
git log --graph --oneline --all
```

The pattern is good for:
- New workflows ([git-flow](https://github.com/nvie/gitflow)'s branching model)
- Integrations with external services ([hub](https://github.com/mislav/hub)/[gh](https://github.com/cli/cli) for GitHub)
- Convenience wrappers ([git-extras](https://github.com/tj/git-extras)' grab-bag of utilities)
- Repository inspection tools ([git-stats](https://github.com/IonicaBizau/git-stats), [git-standup](https://github.com/kamranahmedse/git-standup))

Limitations: You're just adding commands. You can't intercept existing git operations, transform content, or change how git talks to remotes. See the [git docs](https://git-scm.com/docs/git#_git_commands) for more on how git finds commands.

## Clean/Smudge Filters

Filters transform file content on checkout (smudge) and commit (clean). Git pipes the file through your program and stores whatever comes out.

```
# .gitattributes
*.secret filter=vault

# .git/config or ~/.gitconfig
[filter "vault"]
    clean = gpg --encrypt --recipient you@example.com
    smudge = gpg --decrypt
```

The clean filter runs when you `git add`, the smudge filter runs when you `git checkout`, and the repository stores whatever the clean filter outputs.

**[git-crypt](https://github.com/AGWA/git-crypt)** uses this pattern. Your working directory has plaintext files; the repository stores encrypted blobs. Anyone without the key sees garbage, anyone with the key sees the files transparently.

**[git-lfs](https://github.com/git-lfs/git-lfs)** also uses filters. The clean filter uploads the real file to an LFS server and outputs a small pointer file, the smudge filter downloads the real content, and the repository only stores pointers.

```
# What git-lfs stores in the repo (the pointer file)
version https://git-lfs.github.com/spec/v1
oid sha256:4d7a214614ab2935c943f9e0ff69d22eadbb8f32b1258daaa5e2ca24d17e2393
size 12345
```

Filters are good for:
- Transparent encryption (git-crypt)
- Large file handling (git-lfs)
- Normalizing content (converting line endings, stripping trailing whitespace)
- Expanding/collapsing keywords

The constraint: filters must be idempotent. Running clean twice should produce the same output as running it once. And smudge(clean(x)) should equal x for anything you want to round-trip.

One thing to note: filters don't run until checkout. If someone clones a repo using git-lfs without having git-lfs installed, they get the pointer files, not the actual content. Same with git-crypt: without the key, you get encrypted garbage. There's no way for the filter to bootstrap itself. See the [gitattributes docs](https://git-scm.com/docs/gitattributes#_filter) for the full filter specification.

## Hooks

Hooks are scripts that git runs at specific points: before commit, after merge, before push, on the server when receiving a push. There are about 25 different hook points.

```bash
# .git/hooks/pre-commit
#!/bin/bash
npm test || exit 1
```

The hooks most people use:

- **pre-commit**: Run linters, formatters, tests before allowing a commit
- **prepare-commit-msg**: Modify the commit message template
- **commit-msg**: Validate commit message format
- **pre-push**: Run tests before pushing
- **post-checkout**: Update dependencies after switching branches
- **pre-receive** (server): Enforce policies on what can be pushed

Hooks are good for enforcing local workflow (pre-commit linting) and server-side policies (pre-receive rejecting force pushes to main).

One limitation: hooks aren't versioned with the repository. Each developer has to install them locally. Tools like [husky](https://github.com/typicode/husky), [lefthook](https://github.com/evilmartians/lefthook), and [pre-commit](https://github.com/pre-commit/pre-commit) exist specifically to solve this by providing a way to declare hooks in config files that do get committed.

`core.hooksPath` or `init.templateDir` can configure global hooks that apply to every repo. And `post-checkout` fires after clone completes, so a global post-checkout hook can bootstrap dependencies automatically.

**[git-branchless](https://github.com/arxanas/git-branchless)** uses hooks heavily. It installs a post-commit hook that records every commit you make, enabling features like undo and automatic rebasing. The hook-based approach means it can observe git operations without replacing git commands. The [githooks docs](https://git-scm.com/docs/githooks) list all available hooks and when they fire.

## Merge/diff drivers

You can tell git how to merge or diff specific file types.

```
# .gitattributes
*.json merge=json-merge
*.png diff=exif

# .git/config
[merge "json-merge"]
    driver = json-merge %O %A %B

[diff "exif"]
    textconv = exif
```

Merge drivers receive three files (ancestor, ours, theirs) and produce the merged result. Diff drivers can convert binary files to text for diffing.

This is useful for:
- Smarter merging of structured formats (JSON, XML, config files)
- Making binary files diffable (images via exif data, PDFs via text extraction)
- Lock files that shouldn't merge (use the `binary` merge driver)

Most people don't need custom merge drivers. The built-in 3-way merge handles code well. But if you're constantly resolving the same conflicts in generated files, a custom driver might help. See the gitattributes docs for [custom merge drivers](https://git-scm.com/docs/gitattributes#_defining_a_custom_merge_driver) and [custom diff drivers](https://git-scm.com/docs/gitattributes#_defining_a_custom_diff_driver).

## Remote Helpers

If you want git to talk to something that isn't a git server, you write a remote helper. Name it `git-remote-foo` and git will invoke it for URLs like `foo::some-address`.

```bash
# git clone foo::some-address invokes:
git-remote-foo origin some-address
```

The helper communicates with git over stdin/stdout using a line-based protocol. It declares capabilities (fetch, push, import, export) and handles the corresponding operations.

This is how git talks to non-git systems:
- `git-remote-hg` for Mercurial repos
- `git-remote-svn` wraps subversion
- Various cloud storage backends (S3, GCS)

Remote helpers are the most complex extension point. You're implementing a protocol, handling refs, transferring objects. The [gitremote-helpers docs](https://git-scm.com/docs/gitremote-helpers) describe the protocol, but it's dense. Most people end up reading existing helpers as the de facto spec. Still, they're the only way to make git work with foreign systems transparently.

## Credential Helpers

When git needs authentication, it asks a credential helper. Helpers are simpler than remote helpers, they just store and retrieve usernames and passwords.

```
# .gitconfig
[credential]
    helper = osxkeychain
```

Git ships with helpers for OS keychains. The protocol is straightforward: git sends key-value pairs describing what it needs, the helper responds with credentials.

You'd write a custom helper to integrate with a secrets manager (Vault, 1Password) or custom authentication system. The [gitcredentials docs](https://git-scm.com/docs/gitcredentials) cover the protocol and available helpers.

## What Language?

Git doesn't care. Here's what existing projects use:

- **Shell**: [git-extras](https://github.com/tj/git-extras), [git-flow](https://github.com/nvie/gitflow)
- **Go**: [git-lfs](https://github.com/git-lfs/git-lfs), [gh](https://github.com/cli/cli), [hub](https://github.com/mislav/hub)
- **Rust**: [git-branchless](https://github.com/arxanas/git-branchless)
- **C++**: [git-crypt](https://github.com/AGWA/git-crypt)
- **Python**: [pre-commit](https://github.com/pre-commit/pre-commit)
- **Ruby**: [overcommit](https://github.com/sds/overcommit)

For filters specifically, startup time matters because they run once per file. Git does support [long-running filter processes](https://git-scm.com/docs/gitattributes#_long_running_filter_process) that stay alive across multiple files (git-lfs uses this), but you have to implement the protocol.

## Configuration

Extensions need somewhere to store their settings. A few patterns:

**Git config** is the natural choice. Your extension can use `git config` to read/write values under its own namespace:

```bash
git config --global lfs.fetchrecentalways true
git config myextension.somesetting value
```

Config lives in `~/.gitconfig` (global) or `.git/config` (per-repo). Users already know how to edit these.

**Dedicated dotfiles** work when you need more structure. git-lfs uses `.lfsconfig`, git-crypt stores keys in `.git-crypt/`. These can be committed to the repo so settings travel with it.

**`.gitattributes`** declares which files use filters or drivers:

```
*.psd filter=lfs diff=lfs merge=lfs
*.secret filter=git-crypt diff=git-crypt
```

This file should be committed, it's how the repo tells git which extensions to invoke for which paths.

## Interesting Examples

**[git-lfs](https://github.com/git-lfs/git-lfs)**: Combines multiple patterns. It's a subcommand (`git lfs track`), uses clean/smudge filters for the actual file handling, and hooks into pre-push to upload files.

**[git-crypt](https://github.com/AGWA/git-crypt)**: Clean/smudge filters with a subcommand for key management. The C++ implementation keeps the filter fast.

**[git-branchless](https://github.com/arxanas/git-branchless)**: Hook-based observation combined with subcommands for the UI. Shows how to build features on top of git without modifying git itself. The Rust implementation handles large repos well.

**[hub](https://github.com/mislav/hub)/[gh](https://github.com/cli/cli)**: Pure subcommand pattern. Wraps git commands and adds GitHub-specific features. Shows how far you can get with just new commands.

**[overcommit](https://github.com/sds/overcommit)**: Hook manager in Ruby. Lets you configure hooks via YAML and provides a library of built-in checks for linting, security, and commit message formatting.

## Installation Required

Filters and hooks work transparently, users run normal git commands and your extension does its work, but your extension has to be installed first.

If someone clones a repo that uses git-lfs without having git-lfs installed, they don't get an error, they get pointer files instead of content. Git has no mechanism to say "this repo requires extension X".

The best you can do is document requirements, fail loudly when things are wrong, and make installation easy. git-lfs handles this reasonably well, if you try to push without it installed you get an error pointing you to the fix:

```
$ brew install git-lfs && git lfs install  # macOS
$ apt install git-lfs && git lfs install   # Debian/Ubuntu
$ dnf install git-lfs && git lfs install   # Fedora
```

<hr>

If you know of other git extension techniques or projects worth mentioning or have corrections, reach out on [Mastodon](https://mastodon.social/@andrewnez) or submit a pull request on [GitHub](https://github.com/andrew/nesbitt.io/blob/master/_posts/2025-11-26-extending-git-functionality.md).
