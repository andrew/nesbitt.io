---
layout: post
title: "The Mismeasure of Open Source"
date: 2026-05-09 10:00 +0000
description: "The streetlight effect in project-health scoring"
tags:
  - open-source
  - security
  - metrics
---

Every attempt to score open source projects for criticality, risk, or funding need ends up built on roughly the same dozen signals, because those are the dozen signals you can get from a registry API and the GitHub REST endpoints in an afternoon. I [wrote earlier this week](/2026/05/06/revisiting-the-2015-open-source-census.html) about the 2015 CII census, whose formula scored xz-utils a 6 out of 13 and let it sink to row 254, and which nonetheless got more right than it's usually given credit for.

Ten years on there are several successor efforts running, from foundations, academics, and funders, and I've contributed data to most of them. With far more data and far more people working on the problem they are still largely built on the same inputs, so they inherit most of the same blind spots plus a few new ones, and I wanted to write those down in one place without picking on any single model.

## Missing read as zero

The most consequential mistake is treating the absence of a signal as a low value of that signal. Go modules are fetched from version control via a proxy that publishes no per-module download counts. C libraries reach machines through apt, dnf, apk, vendoring, and static linking, none of which report to anyone. If a model's entry filter is "top N by downloads", or its importance weight is download-derived, both of these ecosystems are largely excluded before any risk scoring runs, and the output contains no indication that they were ever candidates.

I [mentioned](/2026/05/06/revisiting-the-2015-open-source-census.html) Daniel Stenberg finding curl listed at ten thousand downloads a year, which is an accurate count of the channels that happen to be instrumented and bears no relation to the twenty billion or so installations curl actually has.

Zero GitHub issues might mean zero users, or it might mean bugs are tracked in Bugzilla, a mailing list, Launchpad, or the Debian BTS. The absence of a `FUNDING.yml` could equally mean nobody is paying or that three full-time maintainers are on Red Hat's payroll, and a missing OpenSSF Scorecard result tells you nothing about security if the project is hosted on cgit where Scorecard can't run.

Almost every model I've seen handles all of these cases by writing a zero into the cell, or by silently dropping the row, rather than by writing "unknown" and propagating the uncertainty. Once the dashboard renders, a null and a zero look identical, and the project that didn't fit the schema is indistinguishable from the project that genuinely has nothing.

The earlier, harsher version of the same failure is the entry filter that decides what gets scored at all. The scoring formula in a criticality model is the part that gets discussed, but the candidate set it runs over has usually made the bigger decision already. The 2015 census scored Debian packages above a popcon threshold, so sudo and polkit weren't misranked by it, they were never in the input.

Modern equivalents typically start from "top N% of registry downloads" or "packages with a resolvable GitHub URL", and everything those filters exclude is excluded silently. There is no row in the output that says "not considered", and a reader has no way to distinguish "scored as low risk" from "never entered the room".

## Easy to collect, so it must mean something

Availability gets mistaken for relevance: a metric is used because the API returns it, and the justification is worked out afterwards. This is the [streetlight effect](https://en.wikipedia.org/wiki/Streetlight_effect) applied to software, with the GitHub and registry APIs as the lamp post and most of the actual risk lying out in the dark. Download counts are the universal example. The number an npm or PyPI API gives you is dominated by CI runners reinstalling the world on every push, with mirror traffic, bot scans, and the occasional human mixed in. It is not a count of users, or of installations, or of anything that maps cleanly to "how many people are affected if this breaks". It correlates loosely with those things in the fat middle of the distribution and falls apart entirely at the edges, which is unfortunate because the edges are where you're trying to look.

GitHub stars measure the intersection of "people with GitHub accounts who clicked a button" and the project's visibility in that demographic, which skews hard towards web frontend and developer tooling. [ICU](https://icu.unicode.org/) is linked into every browser, Android, the JDK, and Node, and has roughly 3,500 stars. [c-ares](https://c-ares.org/) does async DNS for curl, Node, and gRPC and has about 2,100. [libxml2](https://gitlab.gnome.org/GNOME/libxml2)'s GitHub mirror has 735. Stars are also straightforwardly purchasable. He et al. [identified](https://arxiv.org/abs/2412.13459) around six million suspected fake stars on GitHub between 2019 and 2024, with the rate climbing sharply in the last year of that window, so any model weighting stars is partly weighting whoever paid for a campaign.

CVE count is routinely used as a security signal and measures the opposite of what people assume. OpenSSL and the Linux kernel have hundreds of CVEs because security researchers look at them constantly, while an unfuzzed C parser that nobody has examined since 2014 has none and is more dangerous for it. Treated as a risk input the metric tracks audit attention received rather than vulnerabilities present, which rewards exactly the projects nobody has bothered to check.

It also only counts the subset of fixed vulnerabilities where someone went through the CVE process. Plenty of maintainers find and fix security bugs and ship the patch in a routine release rather than spend a week arguing with a CNA about severity scoring, and none of that history shows up in the column.

Code complexity metrics get used as a proxy for how hard a project would be to replace, but cyclomatic and Halstead scores count branches and operators, which is what a static analyser can see and only loosely tracks what a human would find difficult. [Vlad-Stefan Harbuz](https://vlad.website/) pointed me at the [regex engine](https://git.sr.ht/~sircmpwn/hare/tree/master/item/regex/regex.ha) he wrote for Hare's standard library, which reads to any such tool as unremarkable loops over arrays. The loops are executing a virtual machine for pattern matching, and all of the difficulty is in the automaton they encode, where no metric is looking.

Commit cadence and "last activity" penalise software that is finished. TeX is the canonical case, and bzip2, libogg, and a lot of format-parsing and crypto code that implements a frozen specification are deliberately low-churn because the format is stable and churn is itself a risk. The same metric is trivially gamed in the other direction by Dependabot and Renovate, which will happily keep a repository's activity graph green for years after the last human stopped reading the notifications. That at least leaves a recognisable bot author in the log.

Claude Code and similar coding agents now support scheduled and repeating tasks, so a repository can accumulate a steady stream of plausible-looking maintenance commits authored under a human's name with no human in the loop, and commit frequency stops distinguishing maintained from automated entirely. I've been trying to count how often that [Weekend at Bernie's](/2026/05/08/weekend-at-bernies.html) condition actually holds across the most-depended-on packages, and the bot-only category is large enough that any activity metric ignoring authorship is measuring the bots.

## One number, many units

Comparing absolute values of any of these metrics across ecosystems produces nonsense, because the units are different even when the column header is the same. An npm "download" is mostly a count of CI cache misses, the Homebrew analytics equivalent is an opt-in ping from a macOS developer laptop, and a Debian [popcon](https://popcon.debian.org/) install is an opt-in report from a shrinking population that was never representative of servers or containers. Adding these together, or fitting a coefficient that converts one into another, puts a precise-looking number on a quantity that doesn't exist.

Dependent counts behave the same way: npm's culture of tiny single-purpose packages means a string-padding helper can have tens of thousands of declared dependents. A C compression library that is statically linked into every browser, every database engine, and most games on the planet might have a few dozen, because C dependencies are expressed as `#include`, a vendored source file, a git submodule, or a line in a CMake script, none of which produce a manifest edge that a registry crawler can follow. Ranking these two projects against each other by dependent count tells you about packaging conventions in their respective ecosystems and nothing about which one matters more.

Even within the set of things that do produce manifest edges, package granularity varies enough to break comparisons. A Rust workspace might publish forty crates from one repository and one team where a Python project of the same size would publish a single package, so the Rust project shows up as forty times as many nodes in the graph, internal edges between them inflate its PageRank, and the same handful of maintainers gets counted forty times in any bus-factor sum.

## GitHub as the visible universe

Most models lean on the GitHub API for everything that isn't a registry field: contributors, issues, stars, security policy, sponsors, Scorecard. By package count most open source is on GitHub, so this is a reasonable place to start, but the projects hosted elsewhere are disproportionately the old low-level infrastructure that the models exist to find.

PostgreSQL, SQLite, GnuPG, glibc, FFmpeg, and most GNU projects run primary development on mailing lists, self-hosted cgit, Gerrit, or Savannah. Some have read-only GitHub mirrors, which is its own trap. The mirror has stars and a contributor graph, so the API happily returns numbers for it, but pull requests opened there go nowhere and the contributor graph reflects whoever pushes the sync rather than who writes the code. Nothing in the API response distinguishes a mirror from a primary, so the mirror gets scored as if it were the project.

The GitHub `/contributors` endpoint only counts commit authors it can link to a GitHub account. curl's own [THANKS file](https://github.com/curl/curl/blob/master/docs/THANKS) lists over 3,600 contributors, but the API returns a few hundred, because most of the people in curl's history sent patches from an email address that GitHub has never seen. Bus-factor formulas built on the same data then report curl as 1, since Daniel Stenberg has authored over half the commits, and the formula has no way to distinguish a prolific founder working alongside dozens of active people from a solo maintainer with nobody else around.

The same endpoint misleads in the opposite direction by returning lifetime totals, so a project that had eighty contributors in 2012 and has one exhausted person today shows a reassuring headcount, and there is no field anywhere in the API or the registry metadata for whether that one person is close to walking away.

[OpenSSF Scorecard](https://scorecard.dev) is widely consumed as a security score even though several of its checks (Branch-Protection, Token-Permissions, Dependency-Update-Tool, CI-Tests) detect GitHub features rather than security properties. A project with self-hosted Buildbot CI, mailing-list patch review, and twenty years of careful security process scores worse than a weekend template repo with the default Actions workflow enabled. In the other direction, a project that does tick every box comes out near ten, and that gets read downstream as "secure", as though the checklist covered the whole of security rather than the slice of it a repository scan can reach. And once a score like this becomes an input to funding decisions, [Goodhart](https://en.wikipedia.org/wiki/Goodhart%27s_law) kicks in: projects start enabling the checkboxes that move the number rather than doing the work the checkboxes were meant to proxy for.

## Which project is this

Identity is harder than it looks, and almost every model gets it wrong in at least one direction, starting with the fact that the same code shows up under different names in different places. libcurl is `curl` on Homebrew, `libcurl4` on Debian, `pycurl` on PyPI, `curl-sys` on crates.io, and `curl/curl` on GitHub. A model that doesn't unify these holds five separate low-scoring entries for one risk surface, and any funding or attention directed by the output gets split five ways or pointed at the wrapper instead of the thing being wrapped.

The opposite mapping also breaks things, since LLVM, GCC, coreutils, util-linux, and BusyBox each ship dozens of separately-named artifacts from a single repository. A model that assumes one package maps to one repo either picks one artifact and ignores the rest, or counts the same maintainer team dozens of times. Several models I've looked at simply exclude these projects because computing complexity metrics over a repository that size times out, which means the criticality scoring has a hole exactly where the most critical projects sit.

Forks confuse things further, because when a package's listed repository URL points at a fork, or the original is archived and development has moved to a fork that the registry metadata doesn't know about, every repository-derived metric is describing the wrong tree.

## Funding you can't see

Project health and funding models tend to look for GitHub Sponsors, `FUNDING.yml`, Open Collective, and foundation membership lists, because those are public and machine-readable. The most common funding arrangement for critical infrastructure is none of those. It's a maintainer employed by Red Hat, Google, Intel, Canonical, or a hardware vendor, with the project as some or all of their job, and that arrangement leaves no trace in any file a crawler can fetch. The second most common is consulting and support contracts around the project, which is similarly invisible.

Ben Nickolls and I gave [a talk on this at FOSDEM 2025](https://archive.fosdem.org/2025/schedule/event/fosdem-2025-5576-open-source-funding-you-re-doing-it-wrong/): when we tried to assemble a picture of where open source funding actually comes from and where it goes, the public tip-jar layer that everyone measures turned out to be a thin film over a much larger and almost entirely opaque body of corporate salary, foundation grants disbursed without public reporting, and support revenue. A model reading only the public layer will mark a project with a salaried team as unfunded while treating an enabled but barely-used Sponsors button as evidence of sustainability.

## The compound case

Individually, each of these mismeasures some projects in some direction, and for the bulk of modern, registry-published, GitHub-hosted packages the errors roughly cancel out. The trouble is that the errors correlate, because a project old enough to predate GitHub is disproportionately likely to be written in C, distributed by vendoring rather than a manifest dependency, developed over a mailing list, funded through someone's salary, and low-churn because the format it implements stopped changing years ago.

So the same project gets undercounted on downloads, dropped from the dependency graph, nulled on contributor metrics, scored low on Scorecard, marked unfunded, and flagged as inactive, all at once, for six different expressions of the same underlying fact: it doesn't look like an npm package. The quiet system library with one tired maintainer and no dashboard footprint is exactly what we built all of this tooling to find, and it remains the thing the tooling is structurally worst at seeing.
