---
layout: post
title: "Package Management Papers"
date: 2025-11-13 12:00 +0000
description: "A collection of academic research papers on package management systems, dependency resolution, supply chain security, and software ecosystems."
tags:
  - package-managers
  - research
  - dependencies
  - history
  - reference
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mnklp4jqq72w"
---

There's been all kinds of interesting academic research on package management systems, dependency resolution algorithms, software supply chain security, and package ecosystem analysis over the years. Below is a curated list of papers I've found interesting, it's not exhaustive but covers a good chunk of the literature.

**[An Overview and Catalogue of Dependency Challenges in Open Source Software Package Registries](https://arxiv.org/abs/2409.18884)** ([archive](http://web.archive.org/web/20251228192129/https://arxiv.org/abs/2409.18884)) (2024)
*Tom Mens, Alexandre Decan*
arXiv preprint

Comprehensive literature review and survey of package dependency management research. Catalogues dependency-related challenges including dependency hell, technical lag, security vulnerabilities, and supply chain attacks. Covers SCA tools, SBOMs, and SLSA security levels. Good starting point for researchers and practitioners new to the field.

The papers are organized by topic and include brief descriptions along with author names and publication years. This is a living document—if you know of papers that should be included, please reach out on [Mastodon](https://mastodon.social/@andrewnez) or open a pull request to [the data file on GitHub](https://github.com/andrew/nesbitt.io/blob/master/_data/package_management_papers.yml).

<input type="text" id="search-input" placeholder="Search package manager papers" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
<div id="papers-count"></div>

{% include package_management_papers.md %}

---

If you're aware of research that should be included in this collection, please reach out on [Mastodon](https://mastodon.social/@andrewnez) or submit a pull request to [the data file on GitHub](https://github.com/andrew/nesbitt.io/blob/master/_data/package_management_papers.yml).

<script src="/papers-search.js"></script>
