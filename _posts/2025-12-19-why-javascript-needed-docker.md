---
layout: post
title: "Why JavaScript Needed Docker"
date: 2025-12-19 10:00 +0000
description: "How Docker became JavaScript's real lockfile"
tags:
  - package-managers
  - npm
  - docker
  - deep-dive
---

At a Node.js conference years ago, I heard a speaker claim that npm had finally "solved" dependency hell. The ecosystem wasn't solving dependency conflicts so much as deferring them to production.

Docker's adoption in Node.js was partly a response to this. When local builds aren't deterministic, containers become the only way to ensure what you test is what you deploy. The Dockerfile compensated for reliability the package manager didn't provide.

Many developers have moved to pnpm or Yarn. But to understand why npm struggled with correctness for so long, look at the incentives. Every [package manager tradeoff](/2025/12/05/package-manager-tradeoffs.html) has a growth-friendly side and a correctness-friendly side. npm consistently chose growth.

### Dependency resolution

Most package managers make you solve version conflicts. Bundler will error if two gems need incompatible versions of the same dependency. This is annoying, but it forces you to understand your dependency tree.

npm took a different approach: just install both versions. Nest them in separate node_modules folders and let each dependency have whatever it wants. No conflicts, no errors, no friction.

This was brilliant for adoption. New developers never hit "dependency hell." Everything just worked, or appeared to. The JavaScript ecosystem exploded. In the context of 2010, this was a revelation: while other communities were struggling with manual conflict resolution, Node.js developers were shipping code. This velocity is arguably what allowed JavaScript to move from a browser-only language to a dominant server-side force.

The tradeoff was bloat and fragility. A single `npm install` might pull hundreds of packages, many of them the same library at slightly different versions. node_modules became a meme. And because resolution didn't have to be deterministic—just install everything—npm spent most of its history without the machinery to [guarantee two machines got the same tree](https://npm.github.io/how-npm-works-docs/npm3/non-determinism.html).

### Lockfiles

Shrinkwrap arrived in 2012, opt-in and fragile. Few projects used it seriously. The ecosystem grew anyway.

[Yarn's emergence in 2016](https://engineering.fb.com/2016/10/11/web/yarn-a-new-package-manager-for-javascript/) highlighted a growing need for deterministic builds at scale. Facebook needed reproducible builds across thousands of engineers, and Yarn had reliable lockfiles from day one. This signaled that the ecosystem's requirements were outgrowing npm's original design assumptions.

npm responded in 2017 with package-lock.json. But even then, `npm install` updated the lockfile by default. The deterministic command, [`npm ci`, was added in 2018](https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable) as a separate thing you had to know about. Reproducibility remained opt-in.

npm 5's lockfile wasn't even deterministic in practice. Platform differences, install order, optional dependencies, and outright bugs meant two machines could generate different lockfiles from the same package.json. [npm 7 in 2020 finally improved this](https://www.infoq.com/news/2021/02/npm-7-generally-available/), but by then the pattern was set: Node builds were flaky, and if you wanted reliability, you containerized.

### Docker as workaround

When npm's resolution diverged between machines, the failures showed up in production. A developer runs `npm install`, commits the lockfile, CI runs `npm install` again and gets a slightly different tree, staging gets a third variation. The bug that crashes production doesn't reproduce locally because your node_modules isn't the same node_modules.

Docker provided a pragmatic solution. Freeze the result of `npm install` in an image, push that image, and every environment gets the same bytes. The Dockerfile became an alternative mechanism for achieving the reproducibility that lockfiles were meant to provide.

This reduced the pressure on npm to change. The teams hitting reproducibility problems had already found their workaround. The teams who hadn't hit problems yet didn't need one.

### Incentives all the way down

Every decision made sense if your goal was adoption:

- Nested resolution removes friction for new users
- Silent lockfile updates mean fewer confusing errors
- Opt-in strictness means the default path stays smooth

Strict correctness was often traded for a lower barrier to entry. And when correctness failures got bad enough to cause problems, Docker was there to provide an alternative.

npm occupies a unique position as one of the few major registries managed within a corporate structure, alongside Maven Central. Most others are open source and community-governed. This has historically allowed for rapid scaling, though it inevitably influences how technical priorities are balanced.

In 2024, `npm install` still mutates the lockfile by default. Fifteen years in, determinism is still opt-in. The ecosystem learned to work around it, first with Yarn, then with Docker, now with pnpm. npm made incremental improvements, but the pressure to change the fundamentals was reduced because the ecosystem kept finding its own solutions. The transition to npm 7 in 2020 represented a major architectural pivot, allowing the team to address long-standing structural constraints.

Every [anti-pattern I've documented in GitHub Actions' package management](https://nesbitt.io/2025/12/06/github-actions-package-manager.html)—non-deterministic resolution, mutable versions, missing lockfiles—follows the same pattern. Until 2014, [`npm publish --force`](https://github.com/npm/npm/commit/94e1571f24395a76ac53abfd988e2013ba5fafb3) let you overwrite published versions, and it took three years before anyone decided that was a bad idea. The pressure to fix these problems was lower because workarounds existed.

The same low-friction design has security implications. Sonatype's 2024 report found that [npm represents 98.5% of observed malicious packages](https://www.sonatype.com/press-releases/open-source-malware-reaches-778500-packages) across open source registries. The sheer volume of packages makes npm a larger target, but the trust model of the early 2010s is also being tested by the security requirements of 2025. The JavaScript ecosystem's micro-package culture means more dependencies per project, low publishing friction makes it easy to upload packages, and install-time scripts run arbitrary code by default.

Last year, npm's creator and former CEO Isaac Schlueter, along with former npm CLI lead Darcy Clarke, started [vlt](https://blog.vlt.sh/blog/the-team) to build a new JavaScript package manager. That npm's original leadership is now building from scratch is perhaps the clearest admission that the current architecture has reached its limits. Clarke's post on [the massive hole in the npm ecosystem](https://blog.vlt.sh/blog/the-massive-hole-in-the-npm-ecosystem) documents a manifest validation flaw that's existed since npm's inception. Package managers are nearly impossible to change once they have adoption, because millions of projects depend on existing behavior. Some of those bugs are now load-bearing.