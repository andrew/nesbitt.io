---
layout: post
title: "Package Registries and Pagination"
description: "100MB of metadata for 10,451 versions."
date: 2026-04-10 10:00 +0000
tags:
  - package-managers
  - registries
---

Package registries return every version a package has ever published in a single response, with no way to ask for less. The API formats were designed ten to twenty years ago when packages had tens of versions, not thousands, and they haven't changed even as the ecosystems grew by orders of magnitude around them.

npm's registry API dates to 2010 when there were a few hundred packages on the registry. `registry.npmjs.org/vite` now returns 37MB of JSON for 725 versions (gzip brings that to 4.4MB over the wire, but it's still 37MB to parse) because each version entry includes the full README (up to 64KB), every dependency, every maintainer, the full `package.json` as published, and CouchDB revision metadata. `typescript` is 15MB for 3,758 versions, and even `express` is 800KB. None of these responses carry pagination headers of any kind, no `Link`, no `X-Total-Count`, no `X-Per-Page`, just `Content-Type: application/json` and standard cache controls.

npm offers an abbreviated metadata format through an `Accept: application/vnd.npm.install-v1+json` header that strips READMEs and most metadata, shrinking vite from 37MB to about 2MB, but it's still unpaginated and the slimmed-down response drops fields like publication timestamps that tools need for [dependency cooldown periods](/2026/03/04/package-managers-need-to-cool-down), forcing anything that implements cooldown back onto the full 37MB document.

The [Renovate project](https://github.com/renovatebot/renovate/discussions/38341) found the hard ceiling when, at 10,451 versions, their package metadata exceeded 100MB and `npm publish` started returning `E406 Not Acceptable: Your package metadata is too large (100.01 MB > 100 MB)`. The only fix was unpublishing old versions, which also broke their Docker image builds since those depended on the npm package being publishable.

PyPI's Simple API has roots going back to 2003 with setuptools, and PEP 503 formalized it in 2015 when there were about 70,000 packages. `pypi.org/pypi/boto3/json` returns all 2,011 releases in a single 2.8MB JSON response, and the Simple API that pip actually uses for resolution (`/simple/boto3/`) lists every file for every version as HTML anchor elements on one page. PEP 691 modernized the format to JSON in 2022 but didn't add pagination, and the discussion thread shows nobody even raised it as a possibility. The PEP explicitly constrains against increasing the number of HTTP requests an installer has to make.

Packagist returns all 1,261 versions of `laravel/framework` inline and has since 2012. RubyGems' JSON API sends all 516 versions of `rails` in 465KB, a format largely unchanged since 2009. Hex, pub.dev, Maven Central's `maven-metadata.xml`, and Hackage all work the same way, each dating to between 2005 and 2014.

Go's module proxy, designed in 2019 with the benefit of hindsight, keeps its `/@v/list` endpoint as plain text with one version string per line, so 1,865 versions of `aws-sdk-go` is 16KB. Maven's metadata XML is similarly minimal at 12KB for spring-core. When the format only stores version strings the responses stay small regardless of how many versions accumulate.

NuGet's V3 API, redesigned in 2015, is the only major registry that paginates version metadata on the server side, splitting versions into pages of 64 in its registration endpoint. Small packages get versions inlined in the index response while larger packages like `Microsoft.Extensions.DependencyInjection` (159 versions across 3 pages) return page pointers the client fetches separately. [Docker Hub](/2026/02/18/what-package-registries-could-borrow-from-oci) also paginates tags at 100 per page with `next`/`previous` URLs in the response body. crates.io is halfway there: its versions API has a `meta` field with `total` and `next_page`, but for serde's 315 versions it returns everything at once with `next_page: null`, and I haven't found a crate large enough to trigger the second page.

The reason none of these registries paginate is that package managers need all versions visible at once to resolve dependency constraints. If `npm install` had to make ten round trips for every transitive dependency, installs would be painfully slow, so registries optimized for CDN cacheability instead: one canonical URL per package, one response, cache it at the edge. That trade-off made sense when the largest packages had a few dozen versions.

RubyGems' Compact Index, Cargo's sparse index, and Go's `/@v/list` found a better path by stripping the response down to just what a resolver needs, serving it as a static file, and letting CDNs and HTTP range requests handle the rest. RubyGems' compact index reduced dependency data from 202MB to 2.7MB compressed, and the responses stay small because they contain dependency metadata rather than everything a human might want to browse. npm and PyPI never made that split. When `npm install` fetches vite, it parses 37MB of READMEs, maintainer lists, and CouchDB revision history just to find out which version satisfies `^6.0.0`. Even gzipped, that metadata is eight times the size of the 522KB tarball it points to.
