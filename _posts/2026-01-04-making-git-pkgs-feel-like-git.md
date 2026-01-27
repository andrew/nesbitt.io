---
layout: post
title: "Making git-pkgs feel like Git"
date: 2026-01-04 10:00 +0000
description: What it takes to make a git subcommand feel native.
tags:
  - open source
  - package-managers
  - git
  - tools
  - git-pkgs
---

**Update:** git-pkgs has been [rewritten in Go](/2026/01/24/rewriting-git-pkgs-in-go) and now lives at [github.com/git-pkgs/git-pkgs](https://github.com/git-pkgs/git-pkgs).

Since releasing [git-pkgs](/2026/01/01/git-pkgs-explore-your-dependency-history) I've been focused on one thing: making it feel like you're using git, not some tool that happens to work with git.

Git has strong conventions for colors, pagers, environment variables, and configuration that users expect without thinking about them. I wrote about [extending git](/2025/11/26/extending-git-functionality.html) a while back, covering the extension points git provides. But knowing the patterns exist is different from implementing them well. If your subcommand ignores these conventions, it feels foreign. Getting them right is fiddly, but people notice when you skip them.

Colors now respect `NO_COLOR`, `color.ui`, and a tool-specific `color.pkgs` setting. Pagers follow git's precedence chain: `GIT_PAGER`, then `core.pager`, then `PAGER`, then `less -FRSX`. Most tools just check `PAGER` and call it done, but users who've configured git specifically expect consistent behavior.

Configuration uses git's own config system (`git config --add pkgs.ecosystems rubygems`) rather than inventing a new file format, so settings travel with your git configuration and work in CI the same way as locally.

The original version required you to remember to run `git pkgs update` after commits. Now `git pkgs init` installs post-commit and post-merge hooks by default, appending to existing hooks rather than clobbering them.

I'm also working on bash and zsh tab completion, so `git pkgs h<tab>` expands to `git pkgs history` and `git pkgs blame --<tab>` shows the available flags.

## New commands

Three new commands since launch:

- `git pkgs show HEAD~1` displays dependency changes for a single commit (like `git show` but for dependencies)
- `git pkgs log --author=dependabot` lists commits that changed dependencies with author and change counts
- `git pkgs where nokogiri` finds where a package is declared in your manifest files

## Diff driver

The feature I'm most pleased with is `git pkgs diff-driver`, which installs a git textconv driver that transforms lockfile diffs into dependency changes:

```bash
$ git pkgs diff-driver --install

$ git diff HEAD~1 -- Gemfile.lock
Modified: nokogiri 1.16.7 -> 1.18.1
Modified: racc 1.8.1 -> 1.8.2 (nokogiri)
```

Instead of 200 lines of lockfile internals, you see what actually changed. It works for 29 lockfile formats, and once installed it applies to `git diff`, `git log -p`, and anywhere else git shows diffs.

## Benchmarks

I've been testing against popular open source repos to find edge cases and measure performance:

| Repository | Commits | Dependencies | Init Time | DB Size |
|---|---|---|---|---|
| sinatra/sinatra | 4,666 | 300 | 2.7s | 1.7MB |
| jekyll/jekyll | 11,857 | 371 | 5.2s | 3.6MB |
| pallets/flask | 5,474 | 240 | 3.9s | 1.9MB |
| mastodon/mastodon | 20,195 | 5,346 | 238s | 105MB |

Libraries process at 1,000-2,500 commits per second. Mastodon is slower because 26% of its commits touch a manifest file, compared to 3-6% for most repos. One in four commits changing dependencies is a lot of supply chain churn. Once the initial index is built, all the query commands are snappy since they're just SQLite queries, but the init step could still use optimization for larger repos.

I've submitted a lightning talk to the [/dev/random](https://fosdem.org/2026/news/2025-12-10-dev-random/) track at FOSDEM, and I'm running the [package managers devroom](/2025/12/20/fosdem-2026-package-managers-devroom-schedule.html) if you want to chat in person. I'm working on enriching the database with metadata from package registries using [PURLs](https://github.com/package-url/purl-spec), which would enable CVE history (which vulnerabilities affected your dependencies over time) and SBOM export from any commit.

If you tried it when it launched and hit rough edges, it's smoother now. I'd love to hear what's working and what's missing, and contributions are welcome. There's a [good first issue](https://github.com/andrew/git-pkgs/issues/10) for adding an `--exclude-bots` flag if you want to get involved.
