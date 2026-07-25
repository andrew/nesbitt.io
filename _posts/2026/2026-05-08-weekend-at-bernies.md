---
layout: post
title: "Weekend at Bernie's"
date: 2026-05-08 10:00 +0000
description: "Which of your dependencies are wearing sunglasses"
tags:
  - open-source
  - security
  - supply-chain
  - maintainers
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mnklpqcgtd2d"
---

In the [1989 film](https://en.wikipedia.org/wiki/Weekend_at_Bernie%27s), two junior employees turn up at their boss's beach house to find him dead, and spend the rest of the weekend wheeling him around the party with sunglasses on so nobody notices. The other guests keep slapping him on the back and putting drinks in his hand. It works because nobody looks too closely and because everyone has a strong incentive for Bernie to still be alive.

I have spent the last couple of weeks trying to work out how many of the open source packages we all depend on are in roughly that condition: resolving in every install, pulling millions of downloads a week, accepting new issues, with nobody behind the sunglasses. I'm asking now rather than a few years ago because AI-assisted vulnerability discovery is changing how often somebody actually checks for a pulse.

This matters most at the point where one of those packages gets a security report. Sometimes nobody responds at all, the embargo expires, and a CVE is published with no fixed version to point at. Sometimes a fix does get written, often by the reporter or a drive-by contributor, and it lands in git or sits in an open PR, but the one account with publish rights on the registry has gone and the patched code never reaches anyone's `install` command.

Linux distributions deal with that second case routinely because distro packagers have always carried patches without waiting for upstream, but language package managers have no equivalent role. The registry namespace belongs to whoever registered it, and if they're gone there is nobody standing between you and the unpatched tarball. There are per-application workarounds, which I went through in [some detail last week](/2026/05/01/patching-and-forking-in-package-managers.html), but they put the work on every downstream consumer individually rather than fixing the published artifact once.

There's also a quieter way an unmaintained package causes problems that doesn't need a vulnerability in the package itself. If it declares a tight version range on one of its own dependencies, and that dependency is actively maintained and ships a security release in a new major version, the resolver can't reach the fix because the dead package's constraint won't allow it. Everything downstream gets held on the vulnerable version by a single line in a manifest that nobody is around to edit, which is more or less the situation byroot [describes](https://byroot.github.io/ruby/bundler/2026/04/20/bundle-features.html) hitting with `openssl` in Bundler.

## What counts as dead

The naive way to do this is to look at the last commit date, call anything over two years old "abandoned", and publish a scary number. I didn't want to do that, because a package with no commits since 2019 isn't necessarily dead. A lot of the most depended-on packages in any ecosystem are forty lines long, finished, and don't need commits. The thing I actually want to know is whether anyone would answer if you knocked, and the commit log on its own doesn't tell you that.

So I started from the [ecosyste.ms](https://ecosyste.ms) critical package set, which is the top packages per registry by a blend of downloads and dependent repos, across sixteen package managers. That gave me 8,606 packages backed by 5,874 distinct repositories. For each repo I pulled a year of commit activity, a year of issue and PR activity, who closed or merged anything, who has publish rights on the registry, the date of the last release, and any security advisories filed against the package. Then I sorted them into four buckets.

- **Active**: regular non-bot commits to the default branch, or a release, in the past year.
- **Dormant**: little or no development, but someone with write access has closed an issue, merged a PR, or pushed a commit in the past year, so a fix could plausibly land.
- **Dead**: the repo is archived, or issues/PRs were filed in the past year and nobody with write access closed, merged, committed or released anything in response.
- **Unknown**: no issues or PRs filed and no activity, so responsiveness hasn't been tested.

Dead requires evidence of non-response rather than just inactivity, because I'd rather undercount than put a package on a list whose author happened to take a year off.

## The numbers

Of those 5,874 critical repos, 48.8% are active, 20.2% are dormant, 12.1% are dead, and 18.9% are unknown. So just under half are unambiguously maintained. Twelve percent confirmed dead doesn't sound enormous, but those 713 repositories back packages whose dependent-repo counts sum to about 290 million (these are edges in the dependency graph, not deduplicated repositories), and adding the dormant and unknown buckets takes that sum well past a billion.

Broken down by ecosystem the dead share wobbles a bit, but it's in double figures almost everywhere I have enough repos to say anything:

| ecosystem | repos | active | dormant | dead | unknown | dead % |
|-----------|------:|-------:|--------:|-----:|--------:|-------:|
| npm       | 1599  | 578    | 385     | 181  | 455     | 11.3   |
| rubygems  |  683  | 347    | 158     |  74  | 104     | 10.8   |
| cargo     |  580  | 365    |  95     |  69  |  51     | 11.9   |
| packagist |  547  | 380    |  62     |  66  |  39     | 12.1   |
| go        |  530  | 188    | 122     | 107  | 113     | 20.2   |
| pypi      |  458  | 335    |  73     |  37  |  13     |  8.1   |
| hackage   |  396  | 100    | 105     |  69  | 122     | 17.4   |
| maven     |  370  | 234    |  36     |  27  |  73     |  7.3   |
| conda     |  302  | 202    |  53     |  12  |  35     |  4.0   |
| julia     |  173  |  34    |  34     |  37  |  68     | 21.4   |
| hex       |  153  |  73    |  35     |  17  |  28     | 11.1   |

A repo appears under every ecosystem it publishes to, so the columns sum to more than 5,874. I've left out the five smallest registries (swiftpm, nuget, cocoapods, pub, cpan) where the sample is under 100 repos and the percentages are mostly noise.

Go's 20% is high enough not to be noise, and I suspect part of it is import paths going stale when repositories move while the [module proxy](https://proxy.golang.org/) keeps the old path installable, so nobody downstream is forced to notice. npm sits near the middle on dead share but dominates by absolute volume, and its unknown column is enormous. That's mostly an artifact of what npm's critical set looks like: hundreds of tiny utilities that nobody files issues against because there's nothing to file.

The top of the dead list, sorted by dependent repos, is almost entirely those tiny npm utilities. `fast-deep-equal`, `fast-json-stable-stringify`, `utils-merge`, `require-directory`, each with somewhere between three and five million repos depending on them and no maintainer activity in years. About a third of the non-active packages have zero runtime dependencies of their own, so they're leaves. The most depended-on dead code is also the code with the least in it, which is simultaneously reassuring (very little to go wrong in forty lines) and the entire problem, since there's also very little reason for anyone to ever read those forty lines again.

## Knocking on the door

Of the 713 dead repos, 322 are formally archived on GitHub, where the owner has at least put up a sign saying so. The other 391 are the Bernies: not archived, often with green squares on the contribution graph from Dependabot commits to branches nobody will ever merge, and an issue tab that's still accepting input.

321 of them had at least one issue filed by a human in the past year. 243 had at least one pull request opened in the past year with zero merged, and some of those PRs are the fix, sitting there with the patch attached and nobody left who can press the button.

The registry side is often worse than the repo side: 1,414 of the dead-or-dormant packages have exactly one account with publish rights, and for a lot of the dead ones it's reasonable to assume that account's owner has moved on, lost the 2FA device, or forgotten the package exists.

I'm more worried about the dormant bucket than the dead one, since there are considerably more of them and 156 have exactly one person with write access who has done anything in the past year. That one person is also on the receiving end of all the AI-generated report spam and entitled drive-by demands that make solo maintainership steadily less appealing as a way to spend your evenings, and every one of those repos is a single goat-farming career change from the dead column.

## Why now

A dead package with five million dependents and zero CVEs is unexamined rather than safe, and for most of the last decade that distinction barely mattered. The supply of people willing to spend an afternoon auditing a 200-line string-escaping utility from 2017 was roughly zero, so "nobody has bothered to look" was, in practice, a perfectly good defence.

It is becoming a much worse one, because the same AI tooling that's [filling maintainer inboxes with slop reports](https://sethmlarson.dev/slop-security-reports) is also, increasingly, finding real things. The cost of pointing a model at a tarball and asking what's wrong with it has dropped to almost nothing, and the population of people doing that for bounties or for a foothold is growing a great deal faster than the population able to act on what they send in.

Across the whole critical set there are already 110 published advisories with no patched version available, by which I mean no `first_patched_version` in the advisory data at all rather than a fix that's tagged in git but never released. Some are against packages that were dead long before the advisory was filed, so the disclosure process ran its course, the CVE was published, and there is no version to upgrade to. Every other package in the dead bucket is in the same position with respect to the next advisory filed against it.

The unknown 18.9% bothers me about as much as the dead 12.1%, since those are repos where nobody has filed an issue or a PR in a year and there's been no test of whether anyone is home. The first security report against any of them will be that test.

A lot of people are about to start running that test at once, on purpose, across whole registries, and a meaningful fraction of what they find will be real. When the report lands on a package in the dead column there is currently no good path for it: no distro-style downstream packager who can publish under the same name, and abandoned-package policies at most registries that assume someone wants to take ownership of the name rather than just get one fix out.

Treating every entry in the lockfile as though there's a maintainer behind it who'll handle whatever comes in has been a workable assumption mainly because so few reports were ever filed. Registries and the communities around them are going to need an actual process for a valid CVE against a package with nobody to receive it, and right now most of them don't have one.
