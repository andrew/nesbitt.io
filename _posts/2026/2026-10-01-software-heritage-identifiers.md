---
layout: post
title: "Software Heritage Identifiers"
date: 2026-10-01 12:00 +0100
description: "Notes from CodeCommons: SWHIDs, the SWH archive, and connecting both to package metadata."
tags:
  - open-source
  - package-management
  - swhid
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mwuwjnvolf2q"
---

I spent Monday at the Software Heritage offices in Paris speaking at the CodeCommons plenary, and the [slides are on GitHub](https://github.com/andrew/code-commons/blob/main/slides.pdf). The talk was about connecting package identities to archived source code. Getting ready for it meant a couple of weeks poking at the SWH archive and its identifier scheme with a to-do list that kept growing, and I've ended up with a small pile of tools that are now feeding into ecosyste.ms, starting with the [research software service](https://science.ecosyste.ms/swhids).

### Software Heritage

[Software Heritage](https://www.softwareheritage.org/) has been building a universal archive of source code since Inria launched the project in 2016. It crawls GitHub, GitLab, Bitbucket and a long tail of smaller forges, plus package registries and distro sources, and stores what it finds in one deduplicated Merkle DAG. As I write this that DAG holds about 30 billion source files, 23 billion directories and 6 billion commits from 445 million origins.

A file that turns up in both an npm tarball and a Debian source package is stored once, addressed by the hash of its bytes, and the graph records every place it was seen. The [Vault](https://docs.softwareheritage.org/devel/swh-web/uri-scheme-api-vault.html) reconstructs any snapshot, commit or directory on request as a git bundle or tarball you can download, so retrieval is by content rather than by whichever URL the code was hosted at.

### SWHIDs

Every object in the archive has a [SoftWare Hash IDentifier](https://www.swhid.org/) of the form `swh:1:<type>:<sha1>`. The five types are `cnt` for a file's bytes, `dir` for a directory tree, `rev` for a commit, `rel` for a tag and `snp` for a snapshot of a repository's refs at one point in time. Optional qualifiers after a semicolon pin an origin URL, a visit, a path inside a directory or a line range inside a file. Version 1.2 of the spec was published as ISO/IEC 18670 last year, the first ISO standard for intrinsic software identifiers.

A SWHID is intrinsic, computed from the bytes with no registry and no issuing authority, and because the hashes are git's own object hashes any git checkout on your disk is already full of valid SWHIDs whether or not Software Heritage has crawled it yet. A purl like `pkg:pypi/astropy@7.1.0` is at a different corner of [Zooko's triangle](https://en.wikipedia.org/wiki/Zooko%27s_triangle): a human can read it and it's unique within PyPI's namespace, but resolving it to actual bytes depends on PyPI still being there to serve that release. I spend a lot of time in ecosyste.ms holding both kinds of identifier for the same software, and that mapping was the subject of the CodeCommons talk.

### swh-git

The most direct way I've found to get code back out is [swh-git](https://github.com/andrew/swh-git), a git remote helper that adds an `swh::` transport. With `git-remote-swh` on your `PATH` you can clone by origin URL or by SWHID:

```
git clone swh::github.com/octocat/Hello-World
git clone swh::swh:1:snp:f72e9d06dd0e58236a34328f094ca894a809f230
```

The first form resolves to the origin's most recent archived snapshot, and the second pins a specific one and produces the same bytes on every run. Behind the transport, the helper requests a git-bare bundle from the Vault, polls while it's prepared (which can take several minutes for a large repository the first time), downloads it into your user cache directory, and serves the clone from there with `git upload-pack`.

Fetch, `ls-remote` and shallow clones all work against the cached bundle, and push is refused since the archive is append-only from the crawler side. There's also an HTTP proxy mode for tooling that expects a plain URL rather than a custom transport, so `git clone http://127.0.0.1:8080/github.com/octocat/Hello-World.git` does the same thing through `git http-backend`.

I built this for the recovery case, where an origin URL now 404s or the forge it was on has shut down, and `git clone swh::<the old url>` gets you back to a working repository with full history and tags. The helper also accepts `rev`, `rel` and `dir` identifiers, so a directory SWHID from a paper citation or an SBOM component becomes a checkout in the same way.

### Computing SWHIDs

Since a SWHID is derived from content, you can compute one anywhere you have the bytes, and I wanted that in the two languages I use most. The [swhid gem](https://github.com/andrew/swhid) covers Ruby with parsing, qualifiers and generation for all five object types, and it's what the ecosyste.ms services use. [swhid-go](https://github.com/andrew/swhid-go) does the same in Go with a CLI on top and SHA-1 collision detection built in. Both are wired into the upstream [conformance test suite](https://github.com/swhid/test-suite) that the SWHID working group maintains, so they're checked against the reference vectors alongside the Python and Rust implementations.

Compiling swhid-go to WebAssembly gives you [swhid-wasm](https://github.com/andrew/swhid-wasm), a browser page that fetches a package by name from npm, PyPI, crates.io, RubyGems or pub.dev, or takes a local archive you drop onto it, then unpacks and hashes the whole tree client-side. You get content and directory SWHIDs for every file, executable bits, symlinks and duplicate detection, and the package bytes stay on your machine. Once the tree is hashed the page batch-posts the identifiers to the archive's [`/api/1/known/`](https://archive.softwareheritage.org/api/1/known/doc/) endpoint to colour in which ones are already preserved, and there's a button to submit the package's public URL to Software Heritage for archival.

Early builds of the wasm page needed a same-origin relay for that lookup, because the browser's CORS preflight for a JSON `POST` was reaching the [Anubis](https://anubis.techaro.lol/) bot-protection layer in front of the archive and getting an HTML challenge back instead of CORS headers. I reported it and the SWH team have since adjusted the Anubis configuration so preflights pass through, and the page can now call the archive directly, though by that point the identifiers are already computed and the lookup itself is optional.

### Web API

All of the above ends up calling `archive.softwareheritage.org/api/1`, which SWH document thoroughly in prose. There's no machine-readable spec yet, though it's something the team are interested in, so [swh-openapi](https://github.com/andrew/swh-openapi) is my stopgap, generating an OpenAPI description from the same docstring data the published reference is built from. [swh-go](https://github.com/andrew/swh-go) is a Go client generated from that with pagination, auth and rate-limit handling written by hand, and both should be retired once there's an official spec.

### Critical package coverage

With a client in hand I ran a coverage check, [swh-critical](https://github.com/andrew/swh-critical), over the roughly 9,800 packages in the packages.ecosyste.ms [critical set](https://packages.ecosyste.ms/critical) and their 7,000-odd source repositories on 23 and 24 September. Of those repositories, 71.3% had their current default-branch commit already in the archive, and 89.9% of matched release tags were present as revisions.

Among the repositories whose current commit was missing, 95.1% still had an older snapshot once I checked the former URLs ecosyste.ms records across renames as well as the current one. The 46 hardest cases in the audit had no snapshot at any URL I tried and no matching release objects either, and drilling into those with full clones and tree hashes from the published package tarballs still turned up archived content for every one. Across the whole audit the pattern was older history already in the archive with only recent commits missing.

I think ecosyste.ms can be most useful to Software Heritage as a partner on that last part, since the archive tracks over 445 million origins, far more than the crawler can revisit at a uniform cadence, while ecosyste.ms has dependent counts, download numbers and a criticality score for each package that give a decent signal for which repositories matter most to keep fresh. Feeding that back as a ranked stream of [Save Code Now](https://archive.softwareheritage.org/save/) requests means the crawler's next visit goes to the source of something with a hundred thousand dependents rather than an abandoned fork.

### science.ecosyste.ms

The first place that feedback loop is running in production is [science.ecosyste.ms](https://science.ecosyste.ms), the ecosyste.ms service that tracks research software. For each project with a high enough science score, a background job clones the repository, computes revision and directory SWHIDs with the Ruby gem, and posts them in batches to `/api/1/known/`. Projects with objects missing from the archive get their origin submitted through Save Code Now, another job polls the visit until it completes, and any SWHID newly known after our request is recorded as a confirmed contribution.

The [stats page](https://science.ecosyste.ms/swhids) rolls those up every six hours with a JSON API alongside, and individual project pages now show SWHIDs next to the DOIs and citation metadata they already had. Research software was the right place to start because that community already cares about persistent identifiers and long-term reproducibility.

### packages.ecosyste.ms

The next step is doing the same for package versions on [packages.ecosyste.ms](https://packages.ecosyste.ms), which means computing directory SWHIDs for published tarballs as well as git checkouts and storing the purl-to-SWHID mapping as a first-class field. At that point an SBOM component like `pkg:npm/lodash@4.17.21` resolves through ecosyste.ms to a `swh:1:dir:` you can verify against the tarball you downloaded and fetch from the archive independently of npm. It also turns the one-off swh-critical audit into a rolling measurement, with coverage tracked per registry and new gaps fed back through the same Save Code Now route.

### Scanning the archive

The scanners I've been building under [git-pkgs](https://github.com/git-pkgs) can also treat the archive as a corpus rather than a backup, since they already run against any checkout. [manifests](https://github.com/git-pkgs/manifests) parses package-manager manifest and lockfiles across ecosystems, [licenses](https://github.com/git-pkgs/licenses) does fast SPDX detection against the ScanCode rule corpus, and [brief](https://github.com/git-pkgs/brief) reports a project's whole toolchain and conventions as structured JSON.

With swh-git in front of them the checkout comes from the archive by SWHID instead of a live forge, and any of their outputs anchored to a `swh:1:rev:` is reproducible by anyone with the same identifier. Longer term I'd like to try running these against the [SWH graph dataset export](https://docs.softwareheritage.org/devel/swh-export/graph/dataset.html) directly rather than one Vault checkout at a time, which would make questions about lockfile adoption or license drift across whole registries answerable from preserved source rather than whatever happens to still be online.

Software Heritage has already built the archive and standardised the identifier; what I've been doing is plumbing to reach it from the package-management side and to point ecosyste.ms data at the repositories where another crawl would help most. All of it is MIT or Apache-2.0 licensed, and I'd be very happy to see any of it picked up or replaced by something better.
