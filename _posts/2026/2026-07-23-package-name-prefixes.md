---
layout: post
title: "Package Name Prefixes"
date: 2026-07-23
description: "django plugins, cloud SDKs, and 1,999 homework submissions."
tags:
  - package-managers
  - registries
  - deep-dive
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mrf2w4djmu2b"
---

[PEP 752](https://peps.python.org/pep-0752/) was accepted at the end of June. It lets an organisation apply to PyPI to reserve a package name prefix, after which new uploads matching that prefix are rejected unless they come from the grant holder. Existing packages are grandfathered. The motivation is impersonation: someone publishing malware as `google-cloud-something` or `apache-something` gets the vendor's name in front of it. The PEP names four example prefixes: `google-cloud-`, `opentelemetry-`, `apache-airflow-providers-`, and `types-`.

I pulled every package name from PyPI (912,665 of them, via [ecosyste.ms](https://packages.ecosyste.ms)) and counted prefixes. Those four account for 264, 271, 154, and 1,295 packages respectively, and each is published almost entirely by one organisation. Google publishes `google-cloud-*`, the OpenTelemetry project publishes `opentelemetry-*`, the Apache Airflow team publishes `apache-airflow-providers-*`, and the typeshed maintainers publish `types-*`. Prefix reservation formalises what those publishers already do; one of the PEP's authors, Jarek Potiuk, is on the [Airflow PMC](https://airflow.apache.org/community/).

There are 13,934 prefixes on PyPI shared by five or more packages. The biggest is `django-*` with 17,450, published by thousands of different authors at a rate of about a thousand a year since 2010. `flask-*` has 2,815, `pytest-*` has 2,137, `mkdocs-*` has 764, `sphinxcontrib-*` has 370. `collective.*`, the Plone community's shared prefix using Python's namespace package machinery, has 1,436 packages and has been in use since at least 2008. Anyone publishes a Django app as `django-something`, a pytest plugin as `pytest-something`, a Sphinx extension as `sphinxcontrib-something`, and the host project's documentation tells them to.

An [earlier draft](https://peps.python.org/pep-0752/#open-namespaces) of PEP 752 had a mode for this, letting a grant holder mark a prefix as open so that anyone could still publish under it while the grant holder's own packages got a visual indicator. It was removed as having "insufficient motivation and the fact that repositories could technically satisfy such use cases with standard grant semantics." Multiple organisations can share a grant, which handles a prefix split across a few organisations. Under the accepted design, if the Django Software Foundation reserved `django-`, the existing 17,450 packages would keep publishing new versions and the roughly one thousand new `django-*` packages that would otherwise arrive next year would be blocked. I [compared namespace designs across registries](/2026/02/14/package-management-namespaces.html) earlier this year; NuGet, crates.io and npm have each attached something to prefixes already.

### Seven registries

Splitting package names on runs of `-`, `_` and `.` and grouping by the first token:

| | packages | prefixes with ≥5 packages | packages with a shared prefix | ≥100 | ≥500 |
|---|---:|---:|---:|---:|---:|
| pypi.org | 912,665 | 13,934 | 41% | 427 | 66 |
| crates.io | 311,301 | 9,161 | 54% | 166 | 19 |
| rubygems.org | 209,853 | 4,214 | 46% | 132 | 18 |
| hex.pm | 22,373 | 382 | 32% | 12 | 1 |
| hackage.haskell.org | 19,345 | 521 | 41% | 9 | 0 |
| npmjs.org (unscoped) | 2,678,188 | 37,460 | 68% | 2,604 | 468 |
| nuget.org | 828,361 | 22,377 | 70% | 690 | 72 |

npm has had `@scope/name` since 2014 so its row counts only the 63% of packages that are unscoped. Between a third and two-thirds of every registry's packages share a first token with at least four others. The counts here are first-token only; multi-token prefixes like `apache-airflow-providers-` are counted under `apache-*` in the table and separately when named in the text.

Open plugin conventions, where many authors publish extensions named after a host project, are the largest category among the biggest prefixes on every registry: `django-*` (17,450 pypi), `react-*` (86,142 npm), `jekyll-*` (1,658 rubygems), `bevy-*` (1,870 crates), `phoenix_*` (245 hex), `servant-*` (152 hackage). Some of these are functional, meaning the name has to match the pattern for the host tool to load the plugin: cargo runs `cargo-foo` as the `cargo foo` subcommand, ESLint's config resolver matches `eslint-plugin-foo`, pytest loads `pytest-foo` via entry points.

Generated SDK families, where one organisation publishes hundreds of packages from an API spec, are the next largest. `aws-sdk-*` (473 crates, 481 gems, 92 pypi), `google-cloud-*` (258 crates, 510 gems, 264 pypi, 5 hackage), `azure-mgmt-*` (273 crates, 124 gems, 334 pypi). The Odoo Community Association publishes about 20,000 packages on PyPI across seven versioned prefix trees (`odoo8-addon-*` through `odoo14-addon-*` plus `odoo-addon-*`), which is the largest coordinated prefix use I found on any registry. On npm the generated families are the ones that adopt scopes: `@types/*` 11,388, `@stdlib/*` 5,555, `@fontsource/*` 2,122.

Language and framework tags account for another large block: `python-*` (6,278), `rust-*` (1,692), `ex_*` (1,123 hex, the Elixir convention), `node-*` (23,389 npm), `is-*` (3,754 npm, predicate functions), `use-*` (4,317 npm, React hooks). Hackage has a set of these that mirror module paths (`data-*`, `network-*`, `language-*`).

Getting-started guides produce their own prefixes: `hola-*` on rubygems has 764 packages from people following the [make your own gem](https://guides.rubygems.org/make-your-own-gem/) guide, `example-package-*` and `example-pkg-*` on PyPI have 1,031 between them from the packaging.python.org tutorial, and `guessing-game-*` on crates.io has 125 from chapter 2 of the Rust book. `topsis-*` on PyPI has 1,999 packages with student roll numbers embedded in the names ([TOPSIS](https://en.wikipedia.org/wiki/TOPSIS) is a decision-analysis method that gets set as a programming assignment), from what appears to be a university course run each year since 2020.

Bulk publication accounts for some of the largest recent prefixes: `use-*` on crates.io has 820 packages, 809 of them published in 2026 by one account. `iflow-mcp-*` on PyPI has 2,505 packages of republished MCP servers from one publisher, plus 5,184 more under `@iflow-mcp` on npm from the same account. `free.robux-*` on NuGet has 3,620. `mcp-*` on PyPI, from many publishers, went from 2 packages in 2023 to 3,022 by mid-2026, reaching that count faster than `django-*` reached 3,000.

For the top 1,000 packages by downloads, between 69% and 80% on crates.io, rubygems, and pypi either belong to a prefix cluster or are the package a large cluster is named after (`serde`, `pytest`, `rack`); hex is 45% and hackage 60%. Of the packages [flagged critical](https://packages.ecosyste.ms/critical/) on ecosyste.ms, 226 of rubygems' 974 are `aws-sdk-*` alone, and 74% of NuGet's are under `Microsoft.*` or `System.*`.

### NuGet

PEP 752 cites NuGet's [ID prefix reservation](https://learn.microsoft.com/en-us/nuget/nuget-org/id-prefix-reservation) as prior art. It [went live in October 2017](https://devblogs.microsoft.com/nuget/Package-identity-and-trust/), works the same way (apply by email, matching uploads are rejected unless from the reservation holder, existing packages grandfathered), and adds a checkmark to verified packages in the gallery and Visual Studio. NuGet also supports subprefix delegation, where the `Microsoft.*` holder can delegate `Microsoft.AspNet.*` to a different account, and public reservations, where the holder gets the checkmark on their own packages while other publishers can still upload under the prefix, which is what PEP 752's earlier draft called an open namespace.

Sampling NuGet's per-package `verified` flag via the search API across the top 30 non-spam prefixes shows `Microsoft.*`, `DevExpress.*`, `Syncfusion.*` and `JetBrains.*` fully verified and single-publisher, and `Google.*`, `Amazon.*` and `Azure.*` mostly verified with some grandfathered community packages.

`Serilog.*` is 6% verified across 776 packages, and Serilog is a logging library with a plugin model where sinks and enrichers are published as `Serilog.Sinks.Foo` and `Serilog.Enrichers.Foo` by whoever writes them. Sampling 60 of those and checking first-publish dates against `verified`, the core team's packages (`Serilog`, `Serilog.Sinks.File`) are verified and community packages aren't, including community packages first published in every year through 2025 ([`Serilog.Enrichers.Metrics.Memory`](https://www.nuget.org/packages/Serilog.Enrichers.Metrics.Memory), September 2025, owner Jandini). That is consistent with `Serilog.*` being a public reservation: community sinks are still being accepted eight years in. `Cake.*` (607 packages, Cake build addins) shows the same pattern at 7% verified. The checkmark appears per package; the reservation list itself is private to NuGet.

### crates.io

Cargo's [RFC 3243](https://rust-lang.github.io/rfcs/3243-packages-as-optional-namespaces.html), accepted and currently being implemented, takes a different approach: whoever owns the `foo` crate can publish `foo::bar`, and only they can, with no application process. Of the 166 crates.io prefixes with 100 or more packages, 156 have a bare crate matching the first token, and of those 37% last released more than five years ago and 20% have exactly one version. The `async` crate has two versions, last release 2014, while 844 crates are named `async-*`. The `google`, `aws` and `tree` crates are each owned by individuals with no connection to Google, AWS, or tree-sitter. `bevy`, `serde`, `tokio`, `tauri`, `actix`, `axum`, and `windows` are owned by their respective projects. RFC 3243 explicitly avoids touching the existing hyphenated names (`serde_json` stays where it is; `serde::json` would be a new crate), so the 702 `serde-*` crates from many authors continue alongside anything the serde owners publish under `serde::`.

### npm

npm added `@scope/name` in 2014, and 37% of the 4.26 million live packages use one. Among the unscoped 63%, 68% share a prefix with at least four other packages. For the flat prefixes that also have a matching scope, the flat side is almost always larger, with the core team publishing under the scope and the community under the flat prefix: `babel-*` 6,099 vs `@babel/*` 239, `vue-*` 23,871 vs `@vue/*` 110, `eslint-*` 16,664 vs `@eslint/*` 17. The exceptions are generated families that migrated or started scoped, like `@types/*` (11,388) and `@stdlib/*` (5,555). `eslint-plugin-*` (6,957) and `babel-plugin-*` (3,987) stay flat because the tools string-match those prefixes when resolving config.

Bulk publication appears in scopes as well as flat names: `@hyper.fun` alone has 30,273 packages, alongside a run of scopes with random-string names ending in `npm` (`@wemnyelezxnpm`, `@diahkomalasarinpm`, `@ryniaubenpm`) holding 1,500-1,900 packages each, all created in April 2024 during the [tea.xyz protocol spam wave](/2026/06/11/what-happened-to-tea.html). `dsr-*` (10,742) and `tea-*` (4,486) from the same wave are unscoped.

### Browsing

The projects with the biggest plugin conventions maintain their own directories: [jekyllrb.com/docs/plugins](https://jekyllrb.com/docs/plugins/), [homebridge.io](https://homebridge.io/), [flow.nodered.org](https://flows.nodered.org/), [n8n.io/integrations](https://n8n.io/integrations/), [fastlane's plugin list](https://docs.fastlane.tools/plugins/available-plugins/). These are curated, so a package is listed because the project added it. Registry search returns fuzzy-ranked results across the whole index, so searching rubygems.org for `jekyll` gives popular jekyll-related gems mixed with anything else that mentions the word. NuGet's checkmark and npm's `npmjs.com/org/babel` scope page are the two places a registry currently exposes something membership-like.

A prefix page that lists every `jekyll-*` gem ranked by dependent count, with `jekyll` itself pinned and its direct owners' packages marked, would get most of the way to what those project directories provide, and the data to build it is already in the registry index. Third-party registry browsers like [npmx](https://npmx.dev) are well placed to try it for npm's flat prefixes, and I have the cross-registry data on [ecosyste.ms](https://packages.ecosyste.ms) so I might build one there.

### PEP 755

PEP 752's four named prefixes cover about 2,000 PyPI packages from one organisation each, against about 25,000 under the open-convention prefixes named above. The companion policy [PEP 755](https://peps.python.org/pep-0755/) is still in draft and sets out who can apply for a grant and on what terms, including a proposed queue priority for paid organisations. How it handles an application for `django-` or `pytest-`, from the project or from anyone else, is still to be worked out, and NuGet's handling of `Serilog.*` is one existing precedent.

Data and scripts: [github.com/andrew/package-name-prefixes](https://github.com/andrew/package-name-prefixes).
