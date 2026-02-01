---
layout: post
title: "The Dependency Layer in Digital Sovereignty"
date: 2026-01-28 10:00 +0000
description: "Where package management fits in the digital sovereignty discussion."
tags:
  - package-managers
  - idea
---

David Eaves recently argued that [the path to tech sovereignty runs through commodification](https://www.techpolicy.press/the-path-to-a-sovereign-tech-stack-is-via-a-commodified-tech-stack/), not duplication. Europe shouldn't try to build its own AWS. Instead, governments should use procurement power to enforce interoperability standards. The S3 API became a de facto standard that lets you move between providers, reducing switching costs. If governments required that kind of compatibility as a condition for contracts, smaller providers could compete. Sovereignty through standards rather than state-owned infrastructure.

The same logic applies to [the software supply chain](/2026/01/03/the-package-management-landscape.html), though that layer gets less attention in sovereignty discussions than cloud and storage.

Most git forges are US-based:

| Forge | Owner | Country |
|-------|-------|---------|
| GitHub | Microsoft | US |
| GitLab | GitLab Inc | US |
| Gitea | Gitea Ltd | US |
| HuggingFace | Hugging Face Inc | US |

Codeberg runs [Forgejo](https://codeberg.org/forgejo/forgejo), which doesn't have dependency graph features yet, so it's outside the scope here.

The dependency intelligence layer built on top of these forges is almost entirely US-based:

| Service | Owner | Country |
|---------|-------|---------|
| Snyk | Snyk Ltd | US |
| Socket | Socket Inc | US |
| Sonatype | Sonatype Inc | US |
| Veracode | Veracode Inc | US |
| Black Duck | Synopsys | US |
| Dependabot | Microsoft | US |
| Renovate | Mend.io | US |
| deps.dev | Google | US |
| GitHub Dependency Graph | Microsoft | US |
| GitHub Advisory Database | Microsoft | US |
| NVD | NIST | US |
| Sigstore | Google/OpenSSF | US |
| JFrog Artifactory | JFrog | US |
| GitHub Packages | Microsoft | US |
| AWS CodeArtifact | Amazon | US |
| Azure Artifacts | Microsoft | US |
| Google Artifact Registry | Google | US |
| Docker Hub | Docker Inc | US |
| Amazon ECR | Amazon | US |
| Quay | Red Hat/IBM | US |

The [package registries](/2025/12/29/categorizing-package-registries.html) follow a similar pattern, with a few European exceptions:

| Registry | Owner | Country |
|----------|-------|---------|
| npm | Microsoft | US |
| PyPI | Python Software Foundation | US |
| RubyGems | Ruby Central | US |
| Maven Central | Sonatype | US |
| NuGet | Microsoft | US |
| Crates.io | Rust Foundation | US |
| Go module proxy | Google | US |
| Docker Hub | Docker Inc | US |
| Conda/Anaconda | Anaconda Inc | US |
| CocoaPods | CocoaPods | US |
| Pub.dev | Google | US |
| CPAN | Perl Foundation | US |
| Homebrew | Homebrew | US |
| Hex.pm | Six Colors AB | Sweden |
| Packagist | Private Packagist | Netherlands |
| CRAN | R Foundation | Austria |
| Clojars | Clojars | Germany |

The security and metadata tooling built on top of these registries tends to be US-based regardless of where the registry itself is hosted.

A European company running Forgejo for code hosting still typically uses US services for dependency updates, vulnerability scanning, license compliance, and SBOM generation. Self-hosting the forge doesn't change the intelligence layer.

Ploum made a related point: [Europe doesn't need a European Google](https://ploum.net/2026-01-22-why-no-european-google.html). The European contribution to software has been infrastructure that serves as collective commons: the web, Linux, Git, VLC, OpenStreetMap. "We don't want a European Google Maps! We want our institutions at all levels to contribute to OpenStreetMap." The same framing applies to dependency tooling. Rather than building European alternatives to each US service, invest in open infrastructure that anyone can use.

Dries Buytaert [extended this to procurement](https://dri.es/funding-open-source-for-digital-sovereignty): governments buy from system integrators who package and resell open source, but that money doesn't reach the maintainers who build it. If procurement scoring rewarded upstream contributions, money would flow differently. Open source is "the only software you can run without permission" and therefore useful for sovereignty, but it needs funding to work.

### Where standards exist and where they don't

Eaves's commodification argument depends on standards to reduce switching costs. In [the package management landscape](/2026/01/03/the-package-management-landscape.html), some de facto standards have emerged. Git is nearly universal for source hosting. Semver is the dominant versioning scheme, even if ecosystems interpret it differently. [Lockfile formats](/2026/01/17/lockfile-format-design-and-tradeoffs.html) vary by ecosystem, but they've become standards in practice: every dependency scanning company builds the same set of parsers to extract dependency information from all of them. Syft, bibliothecary, gemnasium, osv-scalibr, and others all parse the same formats. I made a [dataset covering manifest and lockfile examples](https://github.com/ecosyste-ms/package-manager-manifest-examples) across ecosystems, and a similar [collection of OpenAPI schemas](https://github.com/ecosyste-ms/package-manager-openapi-schemas) for registry APIs. These are what made git-pkgs come together quickly.

Beyond those de facto standards, some areas have formal specifications. PURL provides a standardized way to reference packages across ecosystems. OSV and OpenVEX let advisory data flow between systems. CycloneDX and SPDX handle SBOMs. SLSA, in-toto, and TUF cover provenance. OCI standardizes container images.

Other areas don't, which keeps switching costs high. Dependency graph APIs vary by platform, vulnerability scanning integration is proprietary per forge, Dependabot and Renovate each have their own config format, and package metadata APIs differ across registries.

Most standards work in this space focuses on compliance artifacts: SBOMs for the Cyber Resilience Act, attestations for procurement requirements. Less attention goes to the underlying tools developers actually use. The dependency graph that feeds the SBOM generator, the metadata lookup that powers vulnerability scanning, the notification when a new version ships.

The gap between these columns is where standardization would reduce switching costs. A common dependency graph API would matter more than a European deps.dev. Standardizing how dependency updates get proposed would matter more than a European Dependabot. [A protocol for package management](/2026/01/22/a-protocol-for-package-management.html) could let different implementations compete on the same interfaces.

GitHub and GitLab bundle dependency features into their platforms: dependency graphs, vulnerability alerts, automated updates. A self-hosted Forgejo or Gitea instance doesn't have equivalent tooling. But if those features were built on open standards and open data sources, switching forges wouldn't mean losing supply chain visibility. The dependency intelligence could come from any provider that implements the same interfaces, rather than being locked to the forge vendor.

Some gaps need new standards rather than adoption of existing ones. There's no good specification for package version history across registries. Codemeta describes a package at a point in time, not its release history. [PkgFed](/2026/01/25/pkgfed-activitypub-for-package-releases.html) proposes using ActivityPub to federate release announcements, similar to how ForgeFed handles forge events.

### What governments and funders could do

The strategy is to [unbundle the parts of a package manager](/2025/12/02/what-is-a-package-manager.html) and standardize them individually. Registry APIs, dependency graphs, vulnerability feeds, update notifications. Each piece can be commodified without replacing entire systems.

Treat dependency intelligence as infrastructure worth funding directly. The Sovereign Tech Fund model applies: direct funding to open source projects that serve as foundations. Ecosyste.ms, VulnerableCode, OSV, PURL implementations, CycloneDX/SPDX tooling, Forgejo's dependency features all fit this category.

Procurement requirements could include open supply chain tooling. If an agency requires SBOMs, they could also require that generation doesn't depend on proprietary services. If they require vulnerability scanning, the scanner could consume open advisory databases. Germany's ZenDiS and openCode.de initiatives are relevant here. Connecting them with existing open solutions would be more efficient than starting fresh.

Supporting Forgejo with work on dependency features would help too. The goal would be feature parity with GitHub and GitLab so self-hosted forges work with the same security tooling.

[Package management is a wicked problem](/2026/01/23/package-management-is-a-wicked-problem.html), but the dependency intelligence layer is more tractable. Standards exist (PURL, OSV, CycloneDX) and open implementations exist (ecosyste.ms, VulnerableCode), so the gap is investment rather than invention.
