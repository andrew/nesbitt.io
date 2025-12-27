---
layout: post
title: "Podcast Interviews 2025"
date: 2025-11-17 12:00 +0000
description: "A collection of podcast interviews discussing ecosyste.ms, open source metadata, package management, and software sustainability."
tags:
  - podcasts
  - ecosyste.ms
  - open source
  - sustainability
---

Over the past few months I've had the pleasure of appearing on several podcasts to discuss my work on [ecosyste.ms](https://ecosyste.ms), open source metadata, package management ecosystems, and software sustainability. Here's a round-up of those conversations:

## The Changelog with Adam Stacoviak and Jerod Santo

I joined Adam and Jerod on [episode 665 of The Changelog](https://changelog.com/podcast/665) for a deep dive into the world of open source metadata. It was great to return to the podcast after [my last appearance back in 2018](https://changelog.com/podcast/327). Over 104 minutes, we explored what I've learned from tracking over a decade of package ecosystem data, who's using this open dataset, and how others can build on top of it.

We discussed everything from the technical architecture and data storage to the "15,000 people who run the world" concept (identifying the relatively small number of maintainers who control the most critical packages). The conversation touched on tracking funding flows, the challenges of maintaining such a large system, and exciting new uses for the data including the [OSS Taxonomy](https://github.com/ecosyste-ms/oss-taxonomy) project.

## Open Source Security Podcast with Josh Bressers

On the [Open Source Security podcast](https://opensourcesecurity.io/2025/2025-06-ecosystems_andrew_nesbitt/), I chatted with Josh Bressers about how ecosyste.ms catalogs open source projects by tracking packages, dependencies, repositories, and more. We discussed the sheer scale of the data — 11.4 million packages, 262 million repositories, and 22 billion dependencies — and how this dataset can provide insights into the world of open source.

We covered topics like identifying "critical" packages (those that account for 80% of downloads despite being a tiny fraction of available packages), the concept of "blast radius" for understanding vulnerability impact, and the technical challenges of managing terabytes of data in Postgres. Josh was particularly interested in how this data could help focus security efforts on the projects that matter most.

## Sustain Podcast with Richard Littauer

On [episode 270 of the Sustain podcast](https://podcast.sustainoss.org/270), Ben Nickolls and I joined host Richard Littauer to discuss the collaboration between ecosyste.ms and Open Source Collective. We explored how ecosyste.ms collects and analyzes metadata from open-source projects to create algorithms that support funding allocation across entire ecosystems through [funds.ecosyste.ms](https://funds.ecosyste.ms/).

The conversation covered the importance of funding the most critical open-source projects based on actual usage data rather than popularity metrics. We talked about the challenges of maintaining such a large dataset, reaching out to project maintainers, and the broader implications for the open-source community. The partnership with Open Source Collective enables algorithmic distribution of funds to the packages that are most used, not just most popular.

## CHAOSScast with Alice Sowerby

I appeared on [episode 121 of CHAOSScast](https://podcast.chaoss.community/121) alongside Damián Vicino to discuss the new [Package Metadata Working Group](https://github.com/chaoss/wg-package-metadata) within the CHAOSS community. We covered the complex issues surrounding package manager metadata, its interoperability challenges, and how the working group aims to address these through mapping and standardization efforts.

The conversation highlighted how different package managers have evolved independently, often with incompatible metadata schemas and semantics. Even identically named fields can carry different meanings across ecosystems. The working group's goal is to provide guidance and analysis to help maintainers make informed metadata decisions and to accelerate research by providing unified references for package metadata across ecosystems.

---

If you'd like to invite me on your podcast to discuss open source, package management, or software sustainability, reach out on [Mastodon](https://mastodon.social/@andrewnez) or [email me](mailto:andrew@ecosyste.ms).
