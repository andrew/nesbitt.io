---
layout: post
title: "The Cathedral and the Catacombs"
date: 2026-04-06 10:00 +0000
description: "Stretching a metaphor deep into the floor."
tags:
  - open-source
  - dependencies
  - security
---

Eric Raymond's [The Cathedral and the Bazaar](http://www.catb.org/~esr/writings/cathedral-bazaar/) is almost thirty years old and people are still finding new ways to extend the metaphor. Drew Breunig recently described a third mode, the [Winchester Mystery House](https://www.dbreunig.com/2026/03/26/winchester-mystery-house.html), for the sprawling codebases that agentic AI produces: rooms that lead nowhere, staircases into ceilings, a single builder with no plan. That piece got me thinking, though it shares a blind spot with every other response to Raymond I've read.

As the P2P Foundation [pointed out](https://blog.p2pfoundation.net/revisiting-the-cathedralbazaar-metaphor-why-both-eric-raymond-and-nicholas-carr-got-it-partly-wrong/2007/08/11), historical cathedrals were communal projects that mobilized entire communities through donations and voluntary labour, not top-down designs imposed by a single architect, and the bazaar isn't really a market when nothing is priced and there are no merchants. But the responses all stay within the same frame: process, governance, and who builds.

I find it odd that in nearly three decades of cathedral-and-bazaar discourse, nobody has written about the catacombs: the dependency graph underneath every project, the deep network of transitive packages and shared libraries and unmaintained infrastructure that the visible building rests on, regardless of whether a cathedral architect or a bazaar crowd built it.

When Raymond wrote that "given enough eyeballs, all bugs are shallow", he was talking about the thing you can see: the project, its source, its public development process. Linus's law assumes people are looking. The dependency tree breaks that assumption.

A typical JavaScript project can pull in hundreds of transitive dependencies that nobody on the team has read, written by maintainers they've never heard of, last updated at various points over the past several years. The cathedral's architects didn't inspect the catacombs before building on top of them, and the bazaar's crowd didn't either, because in both cases the construction process is what gets all the attention while the foundations are treated as someone else's concern.

Josh Bressers [argued](https://opensourcesecurity.io/2026/01-cathedral-megachurch-bazaar/) that successful open source projects are really megachurches now, large structured organizations with budgets and governance, while the actual bazaar is the neglected hobbyist layer underneath. He comes closest to this when he identifies that neglected layer, and Nadia Eghbal's [Roads and Bridges](https://www.fordfoundation.org/work/learning/research-reports/roads-and-bridges-the-unseen-labor-behind-our-digital-infrastructure/) documented the same neglect as an infrastructure funding problem back in 2016. But both are talking about maintainers and their working conditions, which is still a question about people and process.

It's not just that the maintainers of your transitive dependencies are overworked or under-resourced (though they are). It's that the dependency graph itself is a load-bearing structure that nobody designed and nobody audits as a whole. There are partial efforts: lockfiles, SBOMs, dependency scanners, distro maintainers who vet packages one at a time. But none of them look at the graph as a connected system. It assembled itself through thousands of independent decisions by maintainers who each added whatever looked useful, and the result is an unmapped network of tunnels under the building that happens to hold the floor up.

Real catacombs are underground networks that were built for one purpose, repurposed for another, and eventually forgotten about until someone discovers they've been structurally compromised or that unauthorized people have been using them to get into buildings above. A package gets written to solve a small problem, other packages start depending on it, applications pull it in transitively, and eventually it's load-bearing infrastructure maintained by someone who wrote it on a weekend years ago and barely remembers it exists.  Every package ecosystem has some version of this, though [npm's defaults](/2026/03/31/npms-defaults-are-bad.html) are especially good at making it worse.

And like real catacombs, they get used as ways in. The [xz backdoor](https://www.openwall.com/lists/oss-security/2024/03/29/4) didn't try to get through the front door of any distribution. A co-maintainer spent two years building trust in a compression library that sits deep in the dependency graph of almost every Linux system, then planted obfuscated code in the build system. The [event-stream attack](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident) took over a single abandoned npm package and used it to target a completely different application downstream. Neither attack targeted the cathedral or the bazaar directly, they used the dependency graph as a tunnel network to reach targets that were well-defended at every visible entrance.

Whether your project is built cathedral-style with careful central control, or bazaar-style with open contribution, or Winchester Mystery House-style by an AI that doesn't know what a staircase is for, makes very little difference to the structural risk underneath. A cathedral with meticulous code review and a strict merge process installs its dependencies from the same registries as the most chaotic bazaar project, inherits the same transitive chains, runs the same lifecycle scripts during build. The governance model describes how the floors are laid, but the dependency graph underneath comes from the same place.

Can you imagine what the basement of the Winchester Mystery House looks like? AI coding agents tend to pull in dependencies much more aggressively than most humans would, extending the graph in ways that are hard to review even in principle. And since early 2026, a growing number of people have been pointing AI at open source projects to find security vulnerabilities, sending automated explorers into the catacombs and filing reports faster than maintainers can triage them.
