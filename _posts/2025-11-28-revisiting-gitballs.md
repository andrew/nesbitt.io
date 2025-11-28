---
layout: post
title: "Revisiting Gitballs"
date: 2025-11-28 01:00 +0000
description: "Nine years ago I experimented with storing package tarballs as git objects. A visit to Software Heritage got me thinking about it again."
tags:
  - open source
  - package managers
  - git
  - software heritage
---

Nine years ago I made a small experiment called [Gitballs](https://github.com/andrew/gitballs). Package registries store every release as a complete tarball, but most releases are just a few lines changed from the previous version. Git is good at storing diffs efficiently. What if you committed each release to a git repo and let git's delta compression do the work?

The script downloads every release of a package, extracts each one, commits it to a git repo in version order, then runs `git gc --aggressive`. The result is a single `.git` folder containing every release.

The space savings were significant for packages with many releases:

| package    | releases | tarball size | gitball size | saving |
| ---------- | -------- | ------------ | ------------ | ------ |
| rails      | 288      | 159M         | 7.4M         | 95%    |
| sass       | 309      | 74M          | 2.0M         | 97%    |
| bundler    | 225      | 42M          | 1.9M         | 95%    |
| lodash     | 88       | 79M          | 8.1M         | 90%    |
| nokogiri   | 94       | 275M         | 33M          | 88%    |

But for packages with few releases, the git overhead made things worse:

| package          | releases | tarball size | gitball size | saving |
| ---------------- | -------- | ------------ | ------------ | ------ |
| left-pad         | 11       | 52K          | 348K         | -569%  |
| i18n-active_record | 4      | 52K          | 360K         | -590%  |

It was an afternoon experiment. Life got busy and I forgot about it.

## Why I'm thinking about it again

Last week I was in Paris for a [CodeMeta unconference](https://github.com/codemeta/codemeta/discussions/445) hosted by [Software Heritage](https://www.softwareheritage.org/). I got to meet Roberto Di Cosmo and Stefano Zacchiroli and talk about integration points with [ecosyste.ms](https://ecosyste.ms).

Software Heritage archives all publicly available source code using [SWHIDs](https://docs.softwareheritage.org/devel/swh-model/persistent-identifiers.html) (Software Heritage Identifiers), content-addressed identifiers where two identical files always have the same SWHID regardless of where they're stored.

That's the same principle gitballs was exploring. Git stores snapshots at each commit (much like package releases), but the packfile format finds similar objects, computes deltas between them, and compresses everything together. Every blob, tree, and commit is identified by its SHA hash, so identical content is automatically deduplicated.

I've been writing a [Ruby gem for generating SWHIDs](https://github.com/andrew/swhid), partly to learn the standard, partly because I'm hoping to [generate SWHIDs for every version of every package](https://github.com/ecosyste-ms/packages/issues/1206) in [packages.ecosyste.ms](https://packages.ecosyste.ms) at some point. Working on that got me thinking about gitballs again, because if you're computing content hashes for millions of package releases anyway, you're most of the way to a deduplication scheme.

The same principle shows up in Nix and Guix, which use content-addressed stores for reproducible builds. And pnpm, which deduplicates packages across projects by storing them in a content-addressed cache.

## Still relevant?

I haven't re-run the gitballs numbers yet. The original data is from 2016, and packages like Rails have had hundreds more releases since then. It would be interesting to see if the compression ratios still hold, or if modern packages (with more dependencies, more generated files) compress differently.

Putting every version of every package in a single git repo probably isn't practical. The write path is slow and you'd need to handle concurrent writes. But the experiment did show that sequential releases of the same package compress well, and identical files across packages (MIT-LICENSE, .gitignore, tsconfig.json) would dedupe automatically with content-addressing.

What if you focused on the top 1% of packages that make up 99% of downloads? Most registry bandwidth goes to a small number of popular packages. Deduplicating just those might get you most of the savings without the complexity of handling the long tail. Managing packfiles across hundreds of millions of releases globally would be expensive, but a targeted approach might be practical.

## Related ideas

If you're interested in content-addressed storage for packages:

- [Software Heritage](https://www.softwareheritage.org/) archives source code with content-addressed identifiers
- [Nix](https://nixos.org/) and [Guix](https://guix.gnu.org/) use content-addressed stores for reproducible builds
- [pnpm](https://pnpm.io/) deduplicates node_modules across projects
- [OCI registries](https://github.com/opencontainers/distribution-spec) use content-addressed layers for container images

SWHIDs can actually encompass git repos and their history. When Software Heritage ingests a git repository, the content hashes for blobs and trees match git's SHAs. SWHIDs add a type prefix and can reference things git can't (like snapshots of entire repositories), but they're built on the same foundations.

The [gitballs code](https://github.com/andrew/gitballs) is still on GitHub if you want to try it yourself.
