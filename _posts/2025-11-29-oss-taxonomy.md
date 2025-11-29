---
layout: post
title: "A Taxonomy for Open Source Software"
date: 2025-11-29 08:00 +0000
description: "I'm working on a structured taxonomy for classifying open source projects across multiple dimensions: domain, role, technology, audience, layer, and function."
tags:
  - open source
  - metadata
  - taxonomy
  - ecosystems
---

There are millions of open source projects across dozens of package registries, but no standard way to classify them. Existing metadata doesn't help: topic and keyword data is inconsistent, unstructured, or missing entirely, even from popular projects. I found some taxonomies for research software ([FAIRsoft](https://academic.oup.com/bioinformatics/article/40/8/btae464/7717992), the [RSE taxonomy](https://github.com/rseng/rseng)), but nothing for open source software more broadly.

I've been interested in improving discovery in open source for a long time, ever since I first launched [24 Pull Requests](https://24pullrequests.com) and saw how hard it was for people to find projects to contribute to. So I've been working on [OSS Taxonomy](https://github.com/ecosyste-ms/oss-taxonomy), a structured classification system. Instead of forcing projects into a single category, it uses multiple facets to describe different dimensions.

A web framework like Django might be classified as:

- **Domain**: web-development, api-development
- **Role**: framework, library
- **Technology**: python, docker
- **Audience**: developer, enterprise
- **Layer**: backend, full-stack
- **Function**: authentication, database-management, routing

Six facets, each capturing something different, and a project can have multiple terms per facet.

The taxonomy is defined as YAML files in a GitHub repo, which keeps it inspectable and easy to extend. Each term has a name, description, examples, related terms, and aliases. New terms are added via pull request. A combined JSON file is generated automatically for easy use in applications.

```yaml
name: web-development
description: Software for building websites, web apps, and APIs.
examples:
  - react
  - nextjs
  - rails
related:
  - frontend
  - backend
aliases:
  - webdev
```

The taxonomy also integrates with CodeMeta, a metadata standard for software that extends schema.org. CodeMeta has a `keywords` field, and you can use namespaced keywords to preserve the faceted structure:

```json
{
  "keywords": [
    "domain:web-development",
    "role:framework",
    "technology:python",
    "audience:developer",
    "layer:backend"
  ]
}
```

This works with existing CodeMeta without any schema changes. It's easy to parse (split on `:`), backward compatible as plain text, and keeps the structure intact.

## Use cases

A shared vocabulary enables a few useful things:

**Discovery and search.** Filter by what software does (function), who it's for (audience), or where it fits in a stack (layer). A developer looking for authentication libraries for the backend can narrow down to exactly that.

**Finding alternatives.** If two projects share the same domain, role, and function classifications, they're probably alternatives. You can build recommendation systems on top of this. And because it's multi-faceted, you can vary one dimension while keeping the others fixed: "find me the Sidekiq of this ecosystem" or "like this, but for researchers."

**Ecosystem analysis.** With consistent classification across registries, you can identify gaps. Which domains are well-served by Python but underserved in Go? Where does a language lack tooling entirely?

**Funding decisions.** Funders can use the taxonomy to identify underinvested areas. If a function like "authentication" is widely depended on but has few maintained options, that matters.

All of these get stronger if more people use and contribute to the taxonomy. The network effect matters: a shared vocabulary is only useful if it's actually shared.

How do projects get classified? I'll infer classifications from existing metadata in ecosyste.ms when it's reliable: READMEs, topics, dependency patterns. Maintainers can add namespaced keywords to their codemeta.json files for manual correction. Both feed back into improving the taxonomy.

I'm planning to use this in [ecosyste.ms](https://ecosyste.ms). The taxonomy is CC0 licensed. If you maintain open source, try classifying one of your projects and open a PR if something's missing. The repo is at [github.com/ecosyste-ms/oss-taxonomy](https://github.com/ecosyste-ms/oss-taxonomy).
