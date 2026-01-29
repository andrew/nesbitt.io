---
layout: post
title: "Zig and the M×N Supply Chain Problem"
date: 2026-01-29 10:00 +0000
description: "Zig's long road to supply chain security."
tags:
  - package-managers
  - idea
---

Zig shipped a built-in package manager in version 0.11 in August 2023. It uses `build.zig.zon` files for manifests and fetches dependencies directly from URLs, usually tarballs on GitHub. There's no central registry yet, though the community runs unofficial indexes like [zpm](https://github.com/zigtools/zpm) and [aquila](https://aquila.red/).[^1]

[^1]: This is similar to how Go modules launched, fetching directly from version control hosts. Go eventually added [proxy.golang.org](https://proxy.golang.org/) and [sum.golang.org](https://sum.golang.org/) to provide caching, checksums, and availability guarantees.

The package manager works well enough for declaring dependencies, fetching them, and building against them. The hard part is everything else: the ecosystem of tools, services, and infrastructure that makes a package manager usable in production.

Look at [the package management landscape](/2026/01/03/the-package-management-landscape.html). Dozens of categories, hundreds of tools. For Zig to have the same tooling support as npm or Cargo, each of those tools either needs to add Zig support, or the Zig community needs to build alternatives.

### What the community has to build

Some things only the Zig community can do. Nobody else will write the `build.zig.zon` parser. Nobody else knows the resolution semantics. These are the parts that require language expertise:

**Manifest and lockfile parsing.** Tools like [bibliothecary](https://github.com/librariesio/bibliothecary), [syft](https://github.com/anchore/syft), and [osv-scalibr](https://github.com/google/osv-scalibr) parse dependency files across ecosystems. Each needs a Zig parser added. Right now, none of them support `build.zig.zon`.

**Vulnerability scanning.** [pip-audit](https://github.com/pypa/pip-audit), [bundler-audit](https://github.com/rubysec/bundler-audit), and [cargo-audit](https://github.com/rustsec/rustsec) are language-specific tools that check dependencies against advisory databases. Zig needs a `zig-audit` equivalent, plus an advisory database to check against.

**SBOM generation.** [cdxgen](https://github.com/CycloneDX/cdxgen) and [syft](https://github.com/anchore/syft) generate SBOMs from project files. They need to understand Zig's dependency format to include Zig packages in the bill of materials.

**Dependency tree visualization.** Cargo has `cargo tree`, npm has `npm ls`. Zig needs something equivalent to show the resolved dependency graph.

**Registry software.** If Zig wants a central registry, someone has to build and run it. Crates.io, RubyGems.org, PyPI all required significant engineering effort. The unofficial indexes exist but aren't authoritative.

**PURL and VERS types.** The [Package URL spec](https://github.com/package-url/purl-spec) and [version range spec](https://github.com/package-url/purl-spec/blob/master/VERSION-RANGE-SPEC.rst) are standards, but they're essentially maps of existing ecosystems rather than higher-order abstractions. Each new package manager has to propose a type, document its semantics, and get the PR merged. Zig doesn't have a PURL type yet, so Zig packages can't be referenced in SBOMs, advisory databases, or cross-ecosystem tooling in a standardized way.

### What vendors need to care about

Other integrations require buy-in from companies who may not care about Zig yet. Market share matters here. If you're a SaaS vendor prioritizing what to support next, Zig is competing against languages with larger user bases. Even if the Zig community does everything right, they're still waiting on Dependabot, Renovate, and Snyk to care. You can't get adoption without tooling, and you can't get tooling without adoption.

**Dependency update tools.** [Dependabot](https://github.com/dependabot) supports a fixed set of ecosystems. Adding a new one requires GitHub engineering time. [Renovate](https://www.mend.io/renovate/) is more extensible but still needs a [manager plugin](https://github.com/renovatebot/renovate/tree/main/lib/modules/manager). Neither supports Zig today. There's a [Dependabot issue](https://github.com/dependabot/dependabot-core/issues/8166) and a [Renovate discussion](https://github.com/renovatebot/renovate/discussions/24309), both from 2023, both stalled.

**Vulnerability databases.** The [GitHub Advisory Database](https://github.com/advisories) and [OSV](https://osv.dev) need advisories filed against Zig packages using Zig's identifier scheme. That requires agreeing on how to identify Zig packages, but there's no PURL type for Zig yet.

**SCA tools.** [Snyk](https://snyk.io), [Socket](https://socket.dev), [Sonatype](https://www.sonatype.com), and others would need to add Zig support. Each vendor makes independent decisions about what's worth supporting.

**Enterprise artifact repositories.** [JFrog Artifactory](https://jfrog.com/artifactory/) and [Sonatype Nexus](https://www.sonatype.com/products/sonatype-nexus-repository) support proxying and hosting packages for many ecosystems. Zig isn't on the list.

**Metadata platforms.** [deps.dev](https://deps.dev), [Libraries.io](https://libraries.io), and [ecosyste.ms](https://ecosyste.ms) aggregate package data across ecosystems. Each needs to understand Zig's package format and index Zig packages from wherever they're published.

**Forge integrations.** GitHub's dependency graph, GitLab's dependency scanning, and Gitea's security features all need to parse Zig manifests to show Zig dependencies in their UIs.

### What else needs updating

**SBOM formats.** CycloneDX and SPDX have ecosystem-specific guidance. Zig needs representation in both.

**Trusted publishing.** PyPI's [Trusted Publishers](https://docs.pypi.org/trusted-publishers/) and npm's [provenance](https://docs.npmjs.com/generating-provenance-statements) rely on Sigstore and registry-specific OIDC flows. If Zig gets a central registry, it needs this infrastructure too.

### How this usually goes

The typical path looks like this:

1. Package manager ships with the language
2. Early adopters manage dependencies manually
3. Community builds minimal tooling (a parser here, an index there)
4. Language gains traction, vendors start noticing
5. Major tools add support one by one, in no particular order
6. Eventually, enough coverage exists that the ecosystem feels complete

This process takes years. Go modules shipped in 2018 and still lacks full tooling parity with older ecosystems. Rust has been around since 2015 and Cargo is well-supported now, but that's a decade of incremental integration.

Somewhere along the way, package manager designers realize that some of their early decisions make integration harder. Maybe they didn't assign unique identifiers to packages. Maybe their version scheme doesn't map cleanly to PURL. Maybe they fetch dependencies from URLs instead of a registry, which breaks assumptions baked into every SBOM tool. By then, users depend on the current behavior. Changing a package manager after launch is like changing the hull of a submarine while it's searching for the Titanic.

Each new package manager goes through the same loop. Each tool vendor reimplements the same patterns: parse a manifest, extract dependencies, check against advisories. The work is duplicated dozens of times across the ecosystem, with each implementation making slightly different decisions about edge cases.

Beyond the engineering, there's human coordination. Shepherding PRs through repos maintained by volunteers with different priorities. Getting PURL proposals reviewed by a committee that meets sporadically. Convincing SCA vendors to prioritize your ecosystem over the next one in line. It's part of why [package management is a wicked problem](/2026/01/23/package-management-is-a-wicked-problem.html): too many stakeholders, no single authority, solutions that create new problems.

### What would make this easier

Package management is in its pre-LSP era. Before the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/), every IDE had to implement support for every language: M editors × N languages = M×N integrations. LSP changed that to M+N. Each editor implements the protocol once, each language implements a server once, and they all work together.

Package management has the same M×N problem. Every tool (Dependabot, Snyk, Syft, deps.dev) implements support for every ecosystem (npm, PyPI, Cargo, Go) separately, each integration custom, and when Zig arrives it goes to the back of every queue.

Every codebase is a dependency graph. The syntax varies, the resolution algorithms differ, the registries have different APIs, but the structure is the same: nodes are packages, edges are version constraints, and the goal is a consistent set of concrete versions. Zig's graph looks like Cargo's graph looks like npm's graph, once you strip away the surface differences.

We need a Dependency Lifecycle Protocol (DLP), an LSP for the package management world. In [A Protocol for Package Management](/2026/01/22/a-protocol-for-package-management.html), I sketched what this might look like: common definitions for manifest structure, resolution behavior, registry APIs. If it existed, a new package manager could implement against it. Tools that speak the protocol would get Zig support without each SCA vendor adding it separately.

### The same problem twice

[The dependency layer in digital sovereignty](/2026/01/28/the-dependency-layer-in-digital-sovereignty.html) makes a similar point from a different angle: dependencies are a chokepoint that nation-states and institutions don't control. The Zig problem and the sovereignty problem are the same problem. One is "why can't a new language ecosystem bootstrap quickly" and the other is "why can't institutions control their own dependency infrastructure." Both point to missing abstraction layers that would allow substitution.

The lack of a protocol creates lock-in by default, not through malice but gravity. If you're Zig, you need Dependabot and Snyk and GitHub's dependency graph. If you're a European institution, you need those same tools because that's where the vulnerability data lives. A protocol would make the dependency layer contestable: run your own registry that federates with others, stand up a regional vulnerability database that speaks the same language, use tooling that isn't controlled by three American companies.

Governments already mandate standards for procurement: accessibility, security certifications, data residency. If US federal or EU procurement required dependency tooling that implements a common protocol, the incentive structure inverts. Government procurement is a massive market that moves in blocks. If you can't sell to governments without protocol compliance, every vendor finds budget for it overnight. Zig gets support as a side effect: if Snyk implements the protocol to keep selling to governments, Zig gets coverage by conforming to the same spec.

The [Cyber Resilience Act](https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act) is already pushing in this direction with SBOM requirements. PURL, OSV, and CycloneDX are attempts at standards, but they're descriptive rather than prescriptive. They document what exists rather than defining what should exist. The CRA mandates outputs without mandating the interoperability layer that would make those outputs meaningful across ecosystems.

Right now, the cost of launching a new package manager includes rebuilding the entire surrounding infrastructure. Languages stick with existing tools even when they're not a great fit, because the integration burden is too high. Zig is going through this now, and [Rue](https://rue-lang.dev/), a research language exploring memory safety with a gentler learning curve than Rust, doesn't have a package manager yet. When it does, it will face the same integration slog, as will every new language until the protocol layer exists.
