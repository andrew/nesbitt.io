---
layout: post
title: "Standing on the shoulders of Homebrew"
date: 2026-04-14 10:00 +0000
description: "Rewriting the easy parts of Homebrew."
tags:
  - package-managers
  - homebrew
---

[zerobrew](https://github.com/lucasgelfond/zerobrew) and [nanobrew](https://github.com/justrach/nanobrew) have been doing the rounds as fast alternatives to Homebrew, one written in Rust with the tagline "uv-style architecture for Homebrew packages" and the other in Zig with a 1.2 MB static binary and a benchmark table comparing itself favourably against the first. Both are upfront, once you scroll past the speedup numbers, that they resolve dependencies against homebrew-core, download the bottles that Homebrew's CI built and Homebrew's bandwidth bill serves, and parse the cask definitions that Homebrew contributors maintain.

They're alternative clients for someone else's registry, which is a perfectly reasonable thing to build, but the framing as a replacement glosses over what running a system package manager actually involves.

nanobrew's README has a "what doesn't work yet" section listing Ruby `post_install` hooks, build-from-source with custom options, conditional blocks in Brewfiles, and any complex Ruby DSL, while zerobrew handles source builds by falling back to "Homebrew's Ruby DSL", which I read as shelling out to the thing it's meant to be replacing.

The parts of Homebrew they skip are the parts that are slow for a reason: evaluating arbitrary Ruby to discover what a package needs, running post-install hooks that touch the filesystem in package-specific ways, and handling the long tail of formulae that don't reduce to "download this tarball and symlink it into a prefix". Implementing only the bottle path and declaring the rest out of scope covers the easy 80% of packages and most of the benchmark wins.

zerobrew's table reports a 4.4x speedup installing ffmpeg from a warm cache, nanobrew gets the same operation down to 287 milliseconds, and I keep trying to picture the developer who installs ffmpeg, uninstalls it, and installs it again on the same machine often enough for warm-cache reinstall time to be the number they care about.

A warm install is measuring how quickly you can clonefile a directory out of a content-addressable store, which is a fine thing to optimise but says almost nothing about the experience of setting up a new laptop or adding a tool you didn't have yesterday. The cold-cache numbers are much closer together, occasionally slower than Homebrew when the bottle is large, because at that point everyone is waiting on the same CDN and there's no clever data structure that makes bytes arrive faster.

I wrote about [why uv is fast](/2025/12/26/how-uv-got-so-fast.html) a few months ago. The language rewrite was the least interesting part of that story. uv is fast because PEP 658 finally let Python resolvers fetch package metadata without executing `setup.py`, and because uv dropped eggs and `pip.conf` and a dozen other legacy paths that pip still carries. Homebrew already shipped its equivalent of PEP 658 in the `formula.json` API, and that's the thing that made zerobrew and nanobrew possible in the first place, neither of them is solving the metadata-without-Ruby-evaluation problem because Homebrew already solved it for them.

zerobrew's content-addressable store and APFS clonefile tricks would work equally well from Ruby, and nanobrew's parallel downloads have been on by default in Homebrew since [4.7.0 last November](https://github.com/Homebrew/brew/pull/20975). The architectural choices are real improvements but they aren't "we rewrote it in Zig" improvements, and a zero-startup-time binary matters a lot less when the operation behind it is a 40 MB download either way.

Most of the work in a package manager is the long tail: formulae that want a specific libiconv on an old macOS release, casks with notarisation quirks, post-install scripts that edit config files in ways you can't predict in advance. None of it benchmarks. Whether either project still has a maintainer paying attention a year from now, once those issues start piling up in the tracker, is an open question. Both also chose Apache-2.0 rather than inheriting Homebrew's BSD-2-Clause, which is legally fine and suggests the authors see themselves as building independent projects rather than contributing to the ecosystem they depend on.

The formula format is Turing-complete Ruby, which means the package definition and the client that interprets it are effectively the same artifact, and any move toward declarative package data has to either break the existing formulae or ship a Ruby evaluator as part of every client forever.

The [formula API](https://formulae.brew.sh/api/formula.json) currently lists 8,308 formulae in homebrew-core and the [cask API](https://formulae.brew.sh/api/cask.json) another 7,617 casks, plus [roughly 34,000 `homebrew-*` Ruby repositories on GitHub](https://github.com/search?q=homebrew-+in%3Aname+language%3Aruby&type=repositories) that look like third-party taps, all written against an internal DSL that was never meant to be a stable interchange format. The fast clients get to sidestep that problem by declaring it out of scope, which is a freedom the project they depend on doesn't have.

The bottleneck isn't Rust or Ruby, it's the absence of a stable declarative package schema. Until that exists, every fast client is fast because Homebrew already did the slow work.
