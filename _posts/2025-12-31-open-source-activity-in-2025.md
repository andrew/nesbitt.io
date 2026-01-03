---
layout: post
title: "Open Source Activity in 2025"
date: 2025-12-31 10:00 +0000
description: "A look back at my open source work in 2025: ecosyste.ms, supply chain security tooling, and Ruby gems"
tags:
  - open-source
  - github
---

It's been a busy year for me working full time on open source software. Here's the stats breakdown: 9,485 contributions, 8,893 commits, 127 pull requests (117 merged), 101 issues opened, 336 PR reviews, and 53 new repositories.

I co-founded the [Package Metadata Working Group](https://github.com/chaoss/wg-package-metadata) within CHAOSS and continued working with [Tobias Augspurger](https://github.com/Ly0n) on [Open Sustainable Technology](https://github.com/protontypes/open-sustainable-technology), reviewing hundreds of his pull requests to curate open source projects for climate and sustainability.

[ecosyste.ms](https://ecosyste.ms) gained 26 new repositories this year, including:

- [dashboards](https://github.com/ecosyste-ms/dashboards) - the main interface for exploring data across package ecosystems
- [science](https://github.com/ecosyste-ms/science) - classifies open source scientific software projects
- [oss-taxonomy](https://github.com/ecosyste-ms/oss-taxonomy) - a structured way to categorize open source projects
- [dependabot](https://github.com/ecosyste-ms/dependabot) - indexes Dependabot pull requests across GitHub
- [critical](https://github.com/ecosyste-ms/critical) - database of the most critical open source packages
- [mcp](https://github.com/ecosyste-ms/mcp) - Model Context Protocol server for querying package metadata
- [octorule](https://github.com/ecosyste-ms/octorule) - enforce GitHub repository settings across your organization
- [nexus](https://github.com/ecosyste-ms/nexus) - Maven repository indexer service
- [conditional-rate-limit.lua](https://github.com/ecosyste-ms/conditional-rate-limit.lua) - Apache APISIX plugin for three-tier rate limiting
- [docs](https://github.com/ecosyste-ms/docs) - documentation website for Ecosyste.ms APIs

We also built out package manager documentation:

- [package-manager-resolvers](https://github.com/ecosyste-ms/package-manager-resolvers) - dependency resolution algorithms
- [package-manager-archives](https://github.com/ecosyste-ms/package-manager-archives) - archive formats
- [package-manager-commands](https://github.com/ecosyste-ms/package-manager-commands) - cross-reference of CLI commands
- [package-manager-openapi-schemas](https://github.com/ecosyste-ms/package-manager-openapi-schemas) - OpenAPI specs for registry APIs
- [package-manager-manifest-examples](https://github.com/ecosyste-ms/package-manager-manifest-examples) - manifest and lockfile examples
- [package-managers-opml](https://github.com/ecosyste-ms/package-managers-opml) - RSS/Atom feeds for package manager releases
- [package-manager-hooks](https://github.com/ecosyste-ms/package-manager-hooks) - lifecycle hooks across different package managers
- [typosquatting-dataset](https://github.com/ecosyste-ms/typosquatting-dataset) - known typosquats from security research

On the supply chain side:

- [typosquatting](https://github.com/andrew/typosquatting) - detect potential typosquat packages across ecosystems
- [sbom](https://github.com/andrew/sbom) - parse and generate Software Bills of Materials
- [zizmor-research](https://github.com/andrew/zizmor-research) - analysis of 31,916 GitHub Actions for security issues
- [guarddog](https://github.com/andrew/guarddog) and [oss-rebuild](https://github.com/andrew/oss-rebuild) - forks for malicious package detection and build attestation
- [purl](https://github.com/andrew/purl) - Package URLs
- [vers](https://github.com/andrew/vers) - VERS version comparison spec
- [swhid](https://github.com/andrew/swhid) - Software Heritage identifiers

And quite a few Ruby other general purpose gems:

- [sidekiq-mcp](https://github.com/andrew/sidekiq-mcp) - expose Sidekiq queues via Model Context Protocol
- [hanami-sprockets](https://github.com/andrew/hanami-sprockets) - asset pipeline for Hanami without npm
- [grass-ruby](https://github.com/andrew/grass-ruby) - Rust-based grass Sass compiler wrapper
- [go-bundler](https://github.com/andrew/go-bundler) - Go-style imports for Ruby (clever or cursed, depending on your perspective)
- [changelog-parser](https://github.com/andrew/changelog-parser) - extract structured data from CHANGELOG files
- [jekyll-stats](https://github.com/andrew/jekyll-stats) - site statistics, which I wrote to analyze this blog

I gave a talk at CHAOSScon North America on the state of open source funding, using data from ecosyste.ms. The [slides and data](https://github.com/andrew/state-of-oss-funding) are on GitHub.

I also appeared on a few podcasts:

- [The Changelog #665](https://changelog.com/podcast/665) - open source metadata and the "15,000 people who run the world"
- [Open Source Security](https://opensourcesecurity.io/2025/2025-06-ecosystems_andrew_nesbitt/) - cataloging open source and identifying critical packages
- [Sustain #270](https://podcast.sustainoss.org/270) - ecosyste.ms and Open Source Collective collaboration on funding allocation
- [CHAOSScast #121](https://podcast.chaoss.community/121) - the Package Metadata Working Group

In December I started writing more regularly on this blog, 34 posts and 46,654 words, mostly about package management. The blog received over 1 million views this month. The posts that found the biggest audiences:

- [How uv Got So Fast](/2025/12/26/how-uv-got-so-fast.html)
- [Package Managers Keep Using Git as a Database](/2025/12/24/package-managers-keep-using-git-as-a-database.html)
- [GitHub Actions Has a Package Manager](/2025/12/06/github-actions-package-manager.html)
- [Could Lockfiles Just Be SBOMs?](/2025/12/23/could-lockfiles-just-be-sboms.html)
- [How to Ruin All of Package Management](/2025/12/27/how-to-ruin-all-of-package-management.html)

If you've found any of this work useful and want to support more of it, I'm on [GitHub Sponsors](https://github.com/sponsors/andrew/).
