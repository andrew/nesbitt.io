---
layout: post
title: "Centrality is not vitality"
date: 2026-05-14 10:00 +0000
description: "Don't automatically reach for PageRank on dependency graphs"
tags:
  - open-source
  - metrics
  - research
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mnklprgkue2v"
---

Working through the data behind [Weekend at Bernie's](/2026/05/08/weekend-at-bernies.html) and [The Mismeasure of Open Source](/2026/05/09/the-mismeasure-of-open-source.html) these past couple of weeks, I've been running into the same metric again and again: PageRank applied to package dependency graphs. It turns up in almost every academic paper that wants to say something quantitative about a dependency graph, often as the entire definition of "criticality" or "importance" or "centrality". It's in every graph library, it produces one number per node, and the graph looks superficially like the web that PageRank was designed for, so it tends to be picked up as the default centrality measure when someone needs one.

Pfeiffer's [MSR 2021 paper](https://studwww.itu.dk/~ropf/blog/assets/msr2021_pfeiffer.pdf) on PageRank and truck factor, Mujahid et al.'s [ASE 2023 paper](https://arxiv.org/abs/2308.08667) on recommending alternatives to declining npm packages, Tsakpinis and Pretschner's [2024 study](https://arxiv.org/html/2404.17403v2) of repository accessibility, Chowdhury and Abdalkareem's [npm trivial-packages paper](https://www.semanticscholar.org/paper/On-the-Untriviality-of-Trivial-Packages:-An-Study-Chowdhury-Abdalkareem/1e5a0421e3ff826b769f65a312170079c16e9286), and the recent [Maven Central topology analysis](https://link.springer.com/chapter/10.1007/978-3-032-08649-5_9) all reach for it as a first-class signal, and a great deal of other ecosystem-graph work from the last five years sits in the same territory.

Dependency graphs are the strongest structure available for mapping how open source ecosystems actually connect and intertwine, which is why ecosyste.ms currently indexes around 25 billion dependency edges across dozens of registries and hundreds of millions of source repositories. Most of the last ten years of [my work](/2026/05/13/showing-our-work.html) has been spent on top of them, and PageRank is only one of many things people compute over those graphs, and a less informative one than the popularity of the academic literature would suggest.

### PageRank's assumptions

PageRank was designed for a graph where edges represent endorsements and where a user moves between nodes by following links, with the occasional teleport when bored. Neither of those assumptions survives translation to a dependency graph. Borgatti's [Centrality and network flow](http://www.analytictech.com/borgatti/papers/centflow.pdf) makes the general argument that every centrality measure encodes assumptions about how things flow through a network, and reusing one whose flow process doesn't match the domain produces a number with no defensible interpretation.

Adding a dependency means the consumer's code needs something the target provides, and the declaration carries no information about whether the consumer reviewed the target, formed an opinion of it, or has even seen its source. Many transitive dependencies arrive without anyone in the consuming project having heard of them at all.

Resolution proceeds by solving a constraint problem rather than walking the graph, with packages picked together as a set, and the damping factor that models a bored surfer jumping to a random page has no analogue in `npm install` or `cargo build`. Dependency graphs are also mostly acyclic in the direction that matters for resolution, so the stationary-distribution intuition that makes PageRank well-behaved on the web is doing very little of the work it was designed to do.

### What the number measures

Computing the number works regardless: the output is well-defined, monotonic in inlinks, and has all the properties a centrality score is supposed to have. The harder question is what it ends up describing, which is roughly the node's position in the graph. Readers tend to take it as a stand-in for something more, such as a package's importance, its risk, its usage, or whether anyone is still maintaining it.

A healthy package can read as in decline because its direct dependents are themselves fading and passing on less centrality to it, so most of the flux in a centrality ranking is propagating in from somewhere unrelated to the package being scored.

Cross-ecosystem comparison runs into a different problem, where the numbers don't sit on the same scale. PyPI's convention publishes one package where npm's micro-package culture publishes thirty, and a single Rust workspace might ship forty crates that all cite each other. The PageRank of a notionally equivalent project then varies by an order of magnitude depending on packaging convention alone, which leaves the absolute numbers incomparable across registries even though the same algorithm produced them.

The metric is sometimes reported as a trend rather than an absolute value, and much of the apparent rigour disappears at that point. The trend in centrality moves with the trend in declared dependents, and both move with the trend in downloads. A count of declared dependents tells you the same thing as a PageRank trend, without anyone having to compute an eigenvector, which is what ecosyste.ms uses for this kind of analysis.

### Four questions, one scalar

There's a category error in folding several distinct questions about a package into one scalar: how much breaks if it disappears (criticality), how much risk you carry by depending on it (exposure), whether anyone is still behind the maintainer account (vitality), how easily you could swap it out (substitutability).

PageRank tells you about a node's position in a graph, which is a fact about the graph rather than the package itself, and that position only partially answers the first of those four questions while barely touching the others.

The packages I wrote about in [Weekend at Bernie's](/2026/05/08/weekend-at-bernies.html) all score high on centrality, because a dead package with stable inlinks and millions of dependents has high PageRank: what's missing in a Bernie is activity rather than incoming edges. `fast-deep-equal`, `fast-json-stable-stringify`, `utils-merge`, and `require-directory` sit in the top fraction of a percent of npm by any centrality measure, and they will continue to sit there for years after the last maintainer commit.

From the bernies.db run, about 12% of the most-depended-on packages across sixteen ecosystems are confirmed dead, and another 19% are untested because nobody has filed an issue or a PR to test whether anyone is home, which puts roughly a third of the top of the graph in some flavour of the Bernie condition.

### A worked example

Mujahid et al.'s ["Where to Go Now? Finding Alternatives for Declining Packages in the npm Ecosystem"](https://arxiv.org/abs/2308.08667) builds a real recommender on top of PageRank, and what they do with it shows the category error in operation. The method uses the PageRank trend over time to flag packages in decline, then proposes as alternatives any packages whose PageRank is not declining.

The four selection criteria the authors list (source declining, target not declining, recent migration evidence, migration performed by a popular project) are all graph-position signals or consumer-behaviour signals, with no check on whether anyone with publish rights at the destination is responsive to issues or pull requests. A destination that has quietly become a Bernie can pass the test, and the recommendation can route a project from a known-dead source to a target that's also no longer maintained.

Recommending a package as a migration target also raises its dependent count, and the PageRank trend rises with it. The next time the model runs, the same package scores as an even better alternative. None of that loop is visible in a metric built from graph position alone, and the recommender can wheel a Bernie around as the answer indefinitely without the score noticing.

[Abandabot](https://cmustrudel.github.io/papers/icse2026dependabot.pdf) takes a different route: its design acknowledges that graph signals alone don't settle whether an abandoned dependency matters, and uses a language model to reason about impact on the consuming project. The question put to the model is about impact rather than maintainer presence, but the design at least treats graph position as insufficient to answer on its own.

The dependency graph is what there's cheap, plentiful, machine-readable data for, so the questions that can be expressed as graph operations are the ones that get asked, regardless of whether they're the questions anyone wanted answered, and the same pattern shows up in [Weekend at Bernie's](/2026/05/08/weekend-at-bernies.html) and [the mismeasurement post](/2026/05/09/the-mismeasure-of-open-source.html) from other angles. PageRank's prominence in this literature comes from the data being available, not from anything specific about how dependency graphs actually work.
