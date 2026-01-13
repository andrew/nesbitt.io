---
layout: post
title: "How I Assess Open Source Libraries"
date: 2025-12-15
description: "What I actually look at when deciding whether to adopt a dependency."
tags:
  - open source
  - package-managers
  - dependencies
---

I was recently invited to give a guest lecture at [Justin Cappos's Secure Systems Lab](https://ssl.engineering.nyu.edu/) at NYU on how to assess open source software, which forced me to articulate what I actually look at after a decade of building tools that analyse dependencies across package ecosystems.

### What I look for

When I'm deciding whether to adopt a library, the first thing I check is how many other packages and repositories depend on it. This single number tells me more than almost any other metric. High dependent counts mean the library works, the documentation is good enough to figure out, the API is stable enough that people stick with it, and there are enough eyeballs that problems get noticed.

It's wisdom of crowds applied to software. Thousands of developers have independently decided this library is worth depending on, and that means something. A library with that kind of adoption has been [stress-tested in production environments](https://link.springer.com/article/10.1007/s10664-017-9589-y) across different use cases in ways no test suite can replicate. If a library has strong usage numbers, I'll overlook weaknesses in other areas, because real-world adoption is the hardest thing to fake.

The second thing I check is what the library itself depends on. Every transitive dependency you bring in [adds risk, attack surface, and maintenance burden](https://www.usenix.org/system/files/sec19-zimmermann.pdf), and dependencies multiply like [tribbles](https://en.wikipedia.org/wiki/Tribble) until one day you look up and realize you're responsible for code from hundreds of strangers. I've watched projects balloon from a handful of direct dependencies to thousands of transitive ones, and at that point you've lost any meaningful ability to audit what you're running. When I have a choice between two libraries that do roughly the same thing, I pick the one with fewer dependencies almost every time.

Licensing has to be sorted. If a library doesn't have an [OSI-approved license](https://opensource.org/licenses), I won't use it, and I don't spend time negotiating or hoping.

I pay attention to who maintains the library. If it's someone whose other work I already depend on, I'm more confident they'll stick around and respond when something goes wrong. Projects with [multiple active maintainers](https://arxiv.org/abs/1604.06766) are better bets than [solo efforts](https://mako.cc/copyrighteous/identifying-underproduced-software), since one person burning out or getting a new job shouldn't mean the library dies.

Good test coverage matters, especially tests that go beyond unit tests to check against spec documents or real-world use cases. Tests that exercise actual scenarios tell me the library does what it claims, and they make it much easier to contribute fixes or debug problems when something goes wrong.

### What I ignore

[Stars and forks tell me almost nothing](https://www.ias.cs.tu-bs.de/publications/GithubTranco.pdf). They measure how many people have looked at a repository, which correlates with marketing and visibility more than quality. Some of the most reliable libraries I use have modest star counts because they're boring infrastructure that just works. Conversely, I've seen heavily-starred projects with broken APIs and unresponsive maintainers.

I also ignore commit frequency. Stable libraries [often don't need regular commits](https://arxiv.org/abs/1707.02327), especially small ones that do one thing well. A library that hasn't been touched in a year might be abandoned, or it might just be finished. The way to tell the difference is to look at whether maintainers respond to issues and pull requests, not at the commit graph.

AI-generated contributions don't bother me either. Some people treat them as a red flag, but if a library has real usage, minimal dependencies, responsive maintainers, and good tests, I don't care how the code got written.

Total contributor counts don't mean much to me. I've never seen a correlation between how many people have touched a codebase and whether it's any good, and if I rejected libraries for having few contributors I'd be rejecting a lot of excellent code, including much of my own.

### What I avoid

I try hard to keep npm out of my Rails applications, preferring to vendor static JavaScript files or pull from a CDN. I still use [Sprockets](https://github.com/rails/sprockets) in all my Rails apps for exactly this reason. The npm ecosystem has become a tire fire of security incidents and maintenance headaches, and the average Node.js application now pulls in [over a thousand transitive dependencies](https://medium.com/frontendweb/find-how-many-packages-we-need-to-run-a-react-hello-world-app-695fbb755af7). I don't want to spend my time triaging hundreds of Dependabot alerts every week for code I didn't choose and don't understand.

I'm wary of binary packages. Ruby gems that bundle C or Rust extensions are faster for CPU-intensive work, but they're painful to install across different environments, slow down CI, and require [trusting pre-built binaries](https://dl.acm.org/doi/10.1145/358198.358210) without much provenance. I'll take the performance hit when the work is happening in the background or offline.

I avoid tiny helper libraries, the ones that provide a single method or a clever little hack. They tend to be someone's pet project, and pet projects have a habit of breaking their APIs on a regular basis ([Pagy](https://github.com/ddnexus/pagy) looking at you) or expanding scope beyond what I originally wanted to use them for ([also Pagy looking at you](https://github.com/ddnexus/pagy/releases/tag/43.0.0)). I've been bitten enough times that I'd rather write twenty lines of code myself.

I also avoid brand new libraries. They haven't worked out the kinks in their API design yet, which means breaking changes are more likely in your future. There's also less usage and community around them, so you're the one finding the problems. I apply the same [cooldown logic](https://blog.yossarian.net/2025/11/21/We-should-all-be-using-dependency-cooldowns) I use for updating dependencies: let other people find the sharp edges first.
