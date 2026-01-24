---
layout: post
title: "Rewriting git-pkgs in Go"
date: 2026-01-24 08:00 +0000
description: The dependency history tool is now a single Go binary.
tags:
  - open source
  - package-managers
  - git
  - tools
  - git-pkgs
  - go
---

This past week I've rewritten [git-pkgs](/2026/01/01/git-pkgs-explore-your-dependency-history) in Go. git-pkgs is a git subcommand that indexes your dependency history into a SQLite database. It parses manifests and lockfiles across 35+ package managers, tracks every add, update, and remove through your git history, and gives you commands like `git pkgs blame` to see who added each dependency, `git pkgs history <package>` to trace a package's version changes over time, and `git pkgs diff` to compare dependencies between branches or commits.

The Ruby version worked fine, but installing a Ruby gem as a git subcommand has friction: you need Ruby installed, the right version, maybe a version manager, and `gem install` puts binaries somewhere that might not be in your PATH.

Go compiles to a single binary with no runtime dependencies. It's pure Go, so there are no C extensions or platform-specific compilation issues to deal with. You download it and it works.

```bash
brew tap git-pkgs/git-pkgs && brew install git-pkgs
# or
go install github.com/git-pkgs/git-pkgs@latest
```

There are also prebuilt binaries on the [releases page](https://github.com/git-pkgs/git-pkgs/releases) for Linux, macOS, and Windows.

I'm giving a lightning talk about git-pkgs at FOSDEM in the [/dev/random](https://fosdem.org/2026/schedule/track/dev-random/) track if you want to hear more in person.

The Ruby version leaned on libraries that didn't have good Go equivalents, so I had to build them. These ended up being as much work as git-pkgs itself, and they're designed to be useful on their own:

- [manifests](https://github.com/git-pkgs/manifests) parses lockfiles and manifests for 35+ package managers. If you're building any kind of dependency analysis tool in Go, this saves you from writing parsers for package.json, Gemfile.lock, Cargo.toml, go.sum, and dozens more.
- [registries](https://github.com/git-pkgs/registries) fetches package metadata from registry APIs. It handles the differences between npm, RubyGems, PyPI, crates.io, and others behind a single interface.
- [managers](https://github.com/git-pkgs/managers) wraps package manager CLIs behind a common interface. Install, update, remove, and query packages without knowing whether you're dealing with npm, bundler, cargo, or pip.
- [purl](https://github.com/git-pkgs/purl) handles Package URLs, the standard format for identifying packages across ecosystems.
- [spdx](https://github.com/git-pkgs/spdx) parses and validates SPDX license expressions.
- [vers](https://github.com/git-pkgs/vers) compares version ranges according to the VERS spec.

All of these live in the [git-pkgs org](https://github.com/git-pkgs). If you're building dependency tooling in Go, they might save you some time.

The SQLite schema stayed the same, so migration from the Ruby version is just replacing the binary. New commands since the Ruby version:

- `git pkgs install`, `git pkgs add`, `git pkgs remove`, and `git pkgs update` manage dependencies across 35 package managers through a unified interface. The managers library handles the CLI differences so you don't have to remember whether it's `npm install` or `bundle add` or `cargo add`.
- `git pkgs browse rails` opens the installed package in your editor. Add `--path` to just print the filesystem path.
- `git pkgs bisect` does binary search through dependency-changing commits. Like git bisect, but it only stops on commits that touched a manifest or lockfile, and you can filter by ecosystem or package.
- `git pkgs diff-file Gemfile.lock.old Gemfile.lock.new` runs the diff algorithm on two files directly, no git repo needed. Useful for comparing tarballs or dependencies across different projects.
- Man pages are included in releases, so `man git-pkgs-blame` works as expected.

The blame query on rubygems.org (11k commits, 472 deps) dropped from 7.5 seconds to 0.05 seconds after fixing SQLite's join order. The outdated command with a warm cache went from 22 seconds to 0.2 seconds by fixing PURL mismatches and batching database operations.

To shake out more performance issues I built a [test harness](https://github.com/git-pkgs/testing) that runs git-pkgs against 22 real-world repos across different ecosystems. The [results](https://github.com/git-pkgs/testing/blob/main/results/results.csv) cover everything from small libraries to massive projects like Rails (97k commits, 2.4k deps), vscode (144k commits, 7k deps), and React (21k commits, 28k deps). After the initial index, most query commands complete in under a second even on the largest repos.

Beyond easier installation, Go opens up integration possibilities that weren't practical with Ruby. [Forgejo](https://forgejo.org) is written in Go, and embedding git-pkgs would let forges surface dependency information directly in the UI: who added each package, what changed in a pull request, which commits introduced vulnerabilities. This would be a fully open source, self-hostable dependency graph. I've been [prototyping it](https://mastodon.social/@andrewnez/115927160933901700) in a fork.

[gittuf](https://gittuf.dev) enforces policies at the git level independent of any forge. With git-pkgs awareness, gittuf could enforce policies it can't currently express: requiring extra approval for adding new dependencies versus updating existing ones, blocking copyleft licenses or dependencies with critical CVEs, flagging packages with single maintainers.

Neither of these would be practical if integrating meant shelling out to a Ruby process.

The project also has a proper home now at [git-pkgs.dev](https://git-pkgs.dev), built with Hugo and the [hextra](https://github.com/imfing/hextra) theme, with documentation for all the commands and the database schema. The Ruby version is archived at [github.com/git-pkgs/git-pkgs-ruby](https://github.com/git-pkgs/git-pkgs-ruby), and the Go version lives at [github.com/git-pkgs/git-pkgs](https://github.com/git-pkgs/git-pkgs).

Try it on a repo with some history and let me know what's working and what's missing. Contributions welcome at [github.com/git-pkgs/git-pkgs](https://github.com/git-pkgs/git-pkgs).
