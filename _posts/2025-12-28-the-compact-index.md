---
layout: post
title: "The Compact Index: How Bundler Scales Dependency Resolution"
date: 2025-12-28 10:00 +0000
description: "The append-only index format that saved RubyGems.org, inspired Cargo's sparse index, and could speed up npm and PyPI too."
tags:
  - package-managers
  - ruby
  - rust
---

In October 2012, Bundler's success was killing RubyGems.org. Dependency resolution requires knowing what each version of each gem depends on, and dependencies form a graph, not a tree. You can't resolve one package without potentially needing metadata about hundreds of others. Unlike curated distribution repositories, language registries rarely remove packages or old versions, so the index only ever grows. Fetching that information one gem at a time over HTTP is painfully slow, so Bundler had a dependency API that returned everything in bulk. It made `bundle install` fast, but it was consuming so many server resources that the site faced periodic outages and emergency throttling. 

The solution took four years to build, from the 2012 crisis to the 2016 release: an append-only text format that could be cached on a CDN and updated incrementally. Today it's called the compact index, and it's one of the cleverest pieces of package management infrastructure I know of. But it wasn't a straight line from outage to solution.

The story of how we got here involves several iterations on the same problem, a server meltdown, and a design that other package managers are still learning from. André Arko's [history of Bundler](https://andre.arko.net/2017/11/16/a-history-of-bundles/) covers the full arc, but here's the technical essence.

## The index formats that came before

RubyGems started with Marshal.4.8.gz (the "4.8" refers to the Marshal format version, stable since Ruby 1.8), a single file containing serialized `Gem::Specification` objects for every gem:

```ruby
[#<Gem::Specification name="rack" version="1.0.0"
    authors=["Christian Neukirchen"]
    dependencies=[<Gem::Dependency name="test-spec" type=:development>]
    description="..."
    homepage="http://rack.rubyforge.org"
    ...>,
 #<Gem::Specification name="rails" version="3.0.0" ...>,
 ...]
```

Download it, deserialize it, and you have everything. This worked when the registry was small. By 2014, there were nearly 100,000 gems. The file was massive, and you had to download all of it even if you only needed one dependency.

The Marshal format had other problems. Ruby's serialization format has had [security vulnerabilities](https://blog.rubygems.org/2017/10/09/unsafe-object-deserialization-vulnerability.html), including a 2017 RCE on RubyGems.org itself. Deserializing untrusted data is risky.

specs.4.8.gz was lighter. Instead of full specifications, it contained just name, version, and platform tuples:

```ruby
# specs.4.8.gz
[["rack", Gem::Version.new("1.0.0"), "ruby"],
 ["rack", Gem::Version.new("1.0.1"), "ruby"],
 ["rails", Gem::Version.new("3.0.0"), "ruby"],
 ...]
```

Smaller, but still a list of everything. You'd download this, find the gems you needed, then make additional requests for each gem's dependencies.

latest_specs.4.8.gz cut the list down further by including only the newest version of each gem. This made the file manageable but broke when you needed an older version. If gem A requires gem B version 1.2, and B is now at 2.0, you're out of luck.

The Bundler API tried a different approach: on-demand queries. Instead of downloading any index, Bundler would ask RubyGems.org for the dependencies of specific gems via `/api/v1/dependencies`:

```ruby
GET /api/v1/dependencies?gems=rack,sinatra

[{name: "rack", number: "1.0.0", platform: "ruby",
  dependencies: [["test-spec", ">= 0"]]},
 {name: "rack", number: "1.0.1", platform: "ruby",
  dependencies: []},
 {name: "sinatra", number: "1.0", platform: "ruby",
  dependencies: [["rack", ">= 1.0"]]},
 ...]
```

No wasted bandwidth on gems you don't need. The server would look up each gem, compute its dependencies, and return the result.

This worked beautifully until it didn't.

## The day Bundler took down RubyGems.org

The dependency API was computationally expensive. Every request required database queries and JSON serialization. There was no caching because each request could ask for a different combination of gems, and the response depended on whatever versions existed at that moment. The number of possible queries was effectively infinite. As Bundler adoption grew, so did API traffic.

By late 2012, the dependency API was effectively DDoSing RubyGems.org. The community scrambled to build a separate Bundler API application, but this created synchronization nightmares. Newly published gems wouldn't appear in Bundler for minutes or hours. The API also ran on Sinatra, which made it harder for the Rails-focused RubyGems.org team to maintain.

The separate API helped, but the fundamental problem remained: serving dependency information on-demand required computation that didn't scale. Every `bundle install` anywhere in the world hit servers in a single US data center.

## The compact index design

[André Arko](https://andre.arko.net/2014/03/28/the-new-rubygems-index-format/), Samuel Giddins, and the rest of the Bundler team spent 2014-2015 designing something new, shipping it in [Bundler 1.12](https://bundler.io/blog/2016/04/28/the-new-index-format-fastly-and-bundler-1-12.html) in April 2016. The requirements were clear: no server-side computation, cacheable on a CDN, and efficient for clients that already have most of the data. Every [package manager design involves trade-offs](/2025/12/05/package-manager-tradeoffs.html), and this one optimised for scale.

The [compact index](https://guides.rubygems.org/rubygems-org-compact-index-api/) has three endpoints.

`/names` returns a newline-separated list of every gem name. Simple, cacheable, rarely needed in practice.

`/versions` is the main index. Each line contains a gem name, its versions, and an MD5 checksum of the gem's info file (used for cache invalidation, not security):

```
rack 0.9.2,1.0.0,1.0.1,1.1.0 abc123
sinatra 1.0,1.0.1,1.1 def456
```

Versions are comma-separated, newest last. A minus sign before a version indicates it's been yanked. The checksum lets clients know whether their cached info file is current.

`/info/<gem>` contains the actual dependency information for a single gem. One line per version:

```
1.0.0 rake:>= 0.7.1|checksum:sha256=abc...
1.1.0 rake:>= 0.8.0,ruby:>= 1.8.7|checksum:sha256=def...
```

The format is plain text. No serialization, no code execution, much smaller attack surface. A client can read these files with string splitting. The server-side logic lives in the [compact_index gem](https://github.com/rubygems/compact_index), which handles file generation and the append-only versioning logic. It doesn't handle HTTP Range requests directly; that's left to your web server or CDN. If you're building a private gem server, you'd use this gem to generate the files and configure nginx or your CDN to serve Range requests.

## Why it's fast

The append-only design is what makes incremental updates possible. New gem versions get appended to the end of their respective files. The `/versions` file grows by one line per new gem, and existing lines don't change. Individual `/info/<gem>` files grow by one line per release.

This makes HTTP Range requests possible. If you have a cached copy of `/versions` that's 1MB, and the current file is 1.1MB, you request `Range: bytes=1000000-`. The server returns only the new data, you append it to your cache, and you're current. Bundler's [CompactIndexClient::Updater](https://github.com/rubygems/rubygems/blob/master/bundler/lib/bundler/compact_index_client/updater.rb) handles this logic.

The response includes a digest header with a SHA256 checksum of the complete file. Bundler checks for both `Repr-Digest` (the modern RFC 9530 name) and the older `Digest` header for compatibility. After appending the new data, clients verify the checksum matches. If it doesn't, something went wrong, and they fetch the whole file again.

ETags provide a fallback when `Repr-Digest` isn't available. A conditional request with `If-None-Match` returns 304 Not Modified if nothing has changed. No bandwidth used at all.

Combine this with a CDN, and suddenly `bundle install` is fast everywhere in the world. The first request for `/versions` might go to the origin server. Every subsequent request hits a cached copy at an edge node near you. Range requests work against the cached copy. The RubyGems.org servers barely notice.

The contrast with the old Bundler API is stark. That system required computation for every request. The compact index requires computation only when gems are published. Generate the text files once, serve them statically forever.

Append-only data plus CDN caching plus client-side logic beats server-side computation at scale. This same pattern shows up in Cargo's sparse index, Go's module proxy, and increasingly in tools like uv that push work to the client.

## The monthly recalculation

There's a catch. Append-only files grow forever, and eventually you need to break the append-only guarantee. Yanked versions stay in the file with a minus sign. Old versions accumulate even if nobody uses them.

RubyGems.org recalculates the `/versions` file monthly. All the yanked gems get removed. All the versions get compressed onto single lines. The file shrinks, checksums change, and clients need to re-download the whole thing.

This is an acceptable trade-off. A monthly full download is nothing compared to daily full downloads. In practice, the first `bundle install` after recalculation takes a few extra seconds to re-download the index. Most of the time, you're downloading a few kilobytes of appended data.

Individual `/info/<gem>` files don't get recalculated. A heavily-versioned gem like Rails accumulates a longer info file over time. But even Rails, with hundreds of versions, has an info file measured in kilobytes.

## Trade-offs and limitations

You still need round-trips. Bundler fetches `/versions`, identifies which gems it needs, then fetches `/info/<gem>` for each one. For a large Gemfile, that's dozens of HTTP requests. HTTP/2 multiplexing helps, but it's not as fast as having everything locally.

The format requires exact byte alignment. If a CDN or proxy modifies the response in any way, appending breaks. Line ending normalization, whitespace changes, or transcoding will corrupt the cache. Clients need to handle this gracefully.

Yanked versions get a minus sign immediately, but the tombstone stays in the file until the monthly recalculation removes it. You can see that version 1.2.3 was yanked, and when. Some maintainers want yanked versions invisible immediately.

All of these are acceptable because failure modes degrade to a full download, not incorrect resolution. The worst case is slower, not wrong.

## Cargo's sparse index

Cargo faced the same problem Bundler did, just later. The crates.io index is [a git repository](/2025/12/24/package-managers-keep-using-git-as-a-database.html) with one JSON file per crate. Clone it and you have everything offline. But by 2019, that clone was 215MB. The actual content compresses to about 10MB with xz. Twenty times the necessary bandwidth, every time.

[RFC 2789](https://rust-lang.github.io/rfcs/2789-sparse-index.html) proposed a sparse index, and it explicitly credits Bundler: "Bundler used to have a full index fetched ahead of time, similar to Cargo's, until it grew too large."

The sparse index fetches individual crate files over HTTP. The URL structure mirrors the git layout: `https://index.crates.io/se/rd/serde` for serde. No new server infrastructure, just static files on a CDN.

Cargo's approach differs from Bundler's in one key way. The compact index uses append-only files and HTTP Range requests to download only new bytes. Cargo's sparse index fetches whole files but uses HTTP caching aggressively. ETag and If-Modified-Since headers mean unchanged files return 304 Not Modified. Brotli compression shrinks the largest crate file from 1MB to 26KB.

HTTP/2 parallelism makes this fast. Cargo can request multiple crate files simultaneously, so latency depends on the depth of your dependency tree rather than the total number of crates. A project with 100 dependencies that form a shallow tree resolves quickly.

The sparse index became the default in Rust 1.70 in June 2023.

## Could other registries adopt this?

There's no technical reason npm, PyPI, NuGet, or Packagist couldn't adopt something similar. Cargo already did with its sparse index. These registries currently rely on per-package API queries or registry-specific protocols, but the compact index pattern would work for any of them. The challenge is scale: RubyGems has 200,000 packages while npm has 5.3 million, and the `/versions` file scales linearly with package count, so a naive implementation for npm would be 25 times larger.

This got me thinking: do you actually need to index everything?

[Ecosyste.ms tracks](https://packages.ecosyste.ms/critical) which packages account for 80% of all downloads in each ecosystem. For npm, that's around 2,300 packages out of 5.3 million. For RubyGems, it's 974 out of 200,000. The [long tail](https://en.wikipedia.org/wiki/Long_tail) is very, very long.

Most packages on any registry are never depended upon by anything else. A package with zero dependents and ten downloads doesn't need to be in the dependency resolution index. It only matters when someone explicitly adds it to their project, and at that point you can fetch its metadata directly.

That tail isn't just unmaintained experiments. In November 2025, [Amazon Inspector found 150,000 malicious packages](https://aws.amazon.com/blogs/security/amazon-inspector-detects-over-150000-malicious-packages-linked-to-token-farming-campaign/) on npm linked to a token farming campaign. That's 3% of the registry, all spam. These packages had minimal or duplicated code, existed only to game tea.xyz rewards, and nobody will ever intentionally install them.

A selective index that included only packages with at least one dependent or above some download threshold would be far smaller. A simple heuristic: exclude packages over a year old with negligible downloads and no dependents. New packages stay in, popular packages stay in, packages that others depend on stay in. Only the stale, unused, isolated ones drop out. The client would check the index first, then fall back to a direct metadata fetch for packages not found. An index miss wouldn't mean "package doesn't exist," just "fetch from the registry directly." You'd trade one extra HTTP request on cache miss for a much smaller index to maintain and download.

A selective index changes what's feasible. npm's 5.3 million packages make a full compact-style index impractical, but 2,300 packages covering 80% of downloads? That's a single file measured in kilobytes. Registries that couldn't adopt the compact index because of scale might find a selective version tractable. PyPI, Packagist, and NuGet could all serve a small, cacheable dependency index covering the packages that actually matter for resolution, with fallback queries for the rest.

RubyGems and crates.io could shrink their existing indexes the same way. The index doesn't need to be exhaustive to be effective.
