---
layout: post
title: "git-pkgs: explore your dependency history"
date: 2026-01-01 10:00 +0000
description: A git subcommand to explore the dependency history of your repositories.
tags:
  - open source
  - package-managers
  - git
  - tools
  - git-pkgs
---

**Update:** git-pkgs has been [rewritten in Go](/2026/01/24/rewriting-git-pkgs-in-go) and now lives at [github.com/git-pkgs/git-pkgs](https://github.com/git-pkgs/git-pkgs).

Your dependency graph has a history, but it's buried in lockfile diffs that no one reads. GitHub even hides them by default in pull requests. You can `git log` any source file and trace who changed it, when, and why, but try that on a lockfile and you get thousands of lines of noise per commit.

With [97% of applications](https://venturebeat.com/programming-development/github-releases-open-source-report-octoverse-2022-says-97-of-apps-use-oss) depending on open source, most of your codebase is stuff you didn't write, and someone on your team decided to trust each piece of it. I wanted a way to trace those decisions: who added this package and why? So I built [git-pkgs](https://github.com/andrew/git-pkgs), a git subcommand that makes your dependency history searchable.

It runs entirely offline with no external services, and works across ecosystems (RubyGems, npm, Cargo, Go, PyPI, Docker, GitHub Actions, and [30+ more](https://github.com/ecosyste-ms/bibliothecary#supported-package-manager-file-formats)) because it builds on [bibliothecary](https://github.com/ecosyste-ms/bibliothecary), the manifest parsing library behind [ecosyste.ms](https://ecosyste.ms).

```bash
git pkgs init              # one-time, ~300 commits/sec
git pkgs blame             # who added each dependency
git pkgs history rails     # full timeline of a package
git pkgs diff --from=v2.0  # what changed since a release
git pkgs stats             # overview of your dependency history
```

The blame command shows who added each dependency:

```
$ git pkgs blame --ecosystem=rubygems

Gemfile (rubygems):
  bootsnap                        Andrew Nesbitt     2018-04-10  7da4369
  factory_bot                     Lewis Buckley      2017-12-25  f6cceb0
  omniauth-rails_csrf_protection  dependabot[bot]    2021-11-02  02474ab
  rails                           Andrew Nesbitt     2016-12-16  e323669
```

You can see which dependencies were human decisions versus bot updates, and how old each one is. The history command shows every change to a specific package over time:

```
$ git pkgs history rails

2016-12-16 Added = 5.0.0.1
  Commit: e323669 Hello World
  Author: Andrew Nesbitt

2024-11-21 Updated = 7.2.2 -> = 8.0.0
  Commit: 86a07f4 Upgrade to Rails 8
  Author: Andrew Nesbitt
```

The diff command compares dependencies between git refs, so you can see what changed between releases or across branches (`git pkgs diff --from=main --to=feature`) without wading through lockfile noise. And because the full history is indexed, you can search for packages that were dependencies in the past even if they've since been removed.

I tested on [Octobox](https://github.com/octobox/octobox), a Rails app with 5,191 commits spanning eight years. Indexing the full history took 18 seconds and produced an 8.3 MB database, covering 2,531 commits with dependency changes and 250 dependencies across RubyGems, Docker, and GitHub Actions. I spent a fair amount of time making sure the commands stay fast after indexing too, not just the initial import. The database lives in `.git/pkgs.sqlite3` and stays updated via git hooks, so once you run init you don't have to think about it again. If you want to run your own queries, the [schema is documented](https://github.com/andrew/git-pkgs/blob/main/docs/schema.md).

Since everything runs locally, you can use it in CI to surface dependency changes in pull requests:

```yaml
- name: Dependency changes
  run: git pkgs diff --from=origin/main >> $GITHUB_STEP_SUMMARY
```

All commands support `--format=json` for scripting and integration with other tools.

I'm thinking about adding CVE history to see which vulnerabilities affected your dependencies over time, and instant SBOM export from any commit or branch. It's a query tool for your own history, no account required, no data leaves your machine. If you try it on a repo with some history, I'd like to hear what works and what's missing. [Open an issue](https://github.com/andrew/git-pkgs/issues) or find me on [Mastodon](https://mastodon.social/@andrewnez).

`gem install git-pkgs` / [github.com/andrew/git-pkgs](https://github.com/andrew/git-pkgs)
