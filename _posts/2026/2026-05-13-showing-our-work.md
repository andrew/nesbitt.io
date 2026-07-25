---
layout: post
title: "Showing Our Work"
date: 2026-05-13 10:00 +0000
description: "An independent benchmark of the ecosyste.ms Python fund"
tags:
  - open-source
  - ecosyste.ms
  - research
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mnklpr635i2t"
---

A preprint went up on arXiv this week from Alexandros Tsakpinis, Emil Schwenger and Alexander Pretschner at fortiss and TU Munich: [Modeling Dependency-Propagated Ecosystem Impact of Changes in Maintenance Activities](https://arxiv.org/abs/2605.06164). They built a model of how maintenance changes propagate through the Python dependency graph, ran it over 718,750 PyPI packages and two million dependency edges, and then benchmarked three real-world support mechanisms against it to see how well each one's package selection lined up with where the model says support would do the most good.

The three were Tidelift's lifted packages, GitHub Sponsors, and the [ecosyste.ms Python fund](https://funds.ecosyste.ms/funds/python). The fund is something we [run with Open Source Collective](https://blog.ecosyste.ms/2024/12/09/ecosystem-funds-curated-support-for-your-critical-software-dependencies.html): organisations put money in for a language ecosystem as a whole rather than picking individual projects, and we distribute it across the packages our dependency data says are most critical, paying out through whatever funding channel each maintainer already has set up.

At 97 packages, that selection accounted for 25.9% of the total modelled improvement impact and 38.0% of the total modelled regression impact across all of PyPI. From the paper: "Ecosyste.ms shows comparatively strong alignment with high-impact packages despite its small size." Of the mechanisms tested it was the most efficient per package by a comfortable margin.

I run ecosyste.ms, so I'm not a neutral reader of that result, and I don't normally use this blog to talk up my own projects. But I didn't design this test, choose its metric, or know it was being run. An independent group built their own model from raw PyPI data and found that our selection lines up with it better than anything else they could measure. That kind of external validation doesn't come along often, and I think it's worth writing about.

### Ten years of dependency graphs

Ben Nickolls and I have spent the last decade working on this, starting with [Libraries.io](https://libraries.io) in 2015. The premise from the beginning was that the dependency graph, rather than download counts or stars, is the right structure for working out which open source projects actually matter. Downloads mostly measure CI runners reinstalling the world, and stars measure visibility among people who have GitHub accounts and click buttons.

Declared dependents are the closest thing we have to a direct measure of who is actually using a library, and unlike either of those they go down as well as up: when people migrate off something the dependent count drops, where the star stays clicked and the download number keeps ticking over from old CI. A usage signal that moves in both directions lets you infer a great deal about a project's standing without having to measure any of it separately.

[ecosyste.ms](https://ecosyste.ms) is what that work turned into, and it has long since outgrown the original project. It currently indexes over 14 million packages and 157 million versions across dozens of registries, with close to two billion version-level dependency declarations between them, and advisories, committers, funding links and release history joined on. PyPI alone is 860,000 packages and 8.9 million versions. The paper builds its graph from the latest version of each package; we keep the dependencies of every version ever published, which is what you need if you want to watch the graph change over time rather than take a single snapshot of it.

Sitting on top of that is a second, larger graph of 292 million source repositories and 24 billion edges back to the packages they install, which is how you find out what relies on a library beyond the boundaries of its own registry. All of it is open source, the data is openly licensed, and the APIs are serving around 1.6 billion requests a month.

The paper's core equation is the number of packages that transitively depend on you, multiplied by how much your maintenance state could change. That's a dependency-graph metric built on the same kind of data as the fund's selection, and two groups working independently from the same premise and arriving at heavily overlapping lists is more or less what validation looks like.

The authors spent five days in February assembling their PyPI snapshot, throttled the whole way by GitHub and registry rate limits. That same graph already exists in ecosyste.ms for npm, RubyGems, Maven, Cargo, Go, Packagist, Hex and a couple of dozen others, refreshed continuously and queryable today. The method in this paper could be applied across every major language ecosystem tomorrow morning without anyone writing another crawler, and I'd very much like someone to do that.

The paper's optimal selection is 730 packages for 80% of modelled impact. The [ecosyste.ms critical set for PyPI](https://packages.ecosyste.ms/registries/pypi.org/packages?critical=true), picked by a different method and for a different purpose, is currently 523. I pulled the replication package and ran our 523 through the same model: they cover roughly 64% of total improvement impact and 76% of total regression impact, within a few points of the paper's optimum and well past anything in its comparison table. 333 of their 730 are already in our list, and on the regression side specifically, the "what hurts most if it stops being maintained" question, it's 165 of their 204.

Identifying the critical packages is step one of almost every serious attempt to support open source, and most of those attempts are still doing it from scratch, per ecosystem, with whatever a registry API will give them in an afternoon. Money routed through [Open Collective](https://opencollective.com) and companies signed up to the [Open Source Pledge](https://opensourcepledge.com/), security engineering coming out of [Alpha-Omega](https://alpha-omega.dev/), governments trying to enumerate digital infrastructure: all of it needs a defensible answer to "which packages, and why these ones." The dependency graph is the best basis I know of for giving that answer, and ecosyste.ms exists so that nobody has to rebuild it before they can start.

### What it doesn't measure

The maintenance signal, which the authors themselves flag as a limitation, is the OpenSSF Scorecard Maintained check: ninety days of commit and issue activity on a GitHub repository. I [wrote last week](/2026/05/09/the-mismeasure-of-open-source.html) about why activity-based signals are getting steadily less trustworthy as bots and scheduled agents keep contribution graphs green on projects no human is reading. The top of the paper's own improvement ranking is `idna`, `colorama`, `six`, `python-dateutil`, `zipp` and `pyyaml`, all sitting at a Maintained score of zero with somewhere between 90,000 and 200,000 PyPI packages transitively depending on each. Those packages are finished rather than abandoned, and a 90-day activity window can't tell the difference. The study is also PyPI only, GitHub only, and a handful of high-reach packages fell out of the analysis entirely for lack of a repository URL, though none of that changes the comparative result since every mechanism was scored the same way.

The regression half of the result says that if those 97 packages all fell to a maintenance score of zero, that alone would account for 38% of the total possible maintenance collapse across PyPI. The paper treats that as a hypothetical to be simulated, but I spent the week before last [trying to measure](/2026/05/08/weekend-at-bernies.html) how hypothetical it actually is across the equivalent critical sets in sixteen ecosystems, and found about 12% of the repositories behind them already gone, another 20% one tired person away from it, and a further 19% untested because nobody's knocked. I think we now have very good data for working out which packages are structurally critical. What state the people behind them are in is a different and harder question, and that's where the next ten years of this goes.
