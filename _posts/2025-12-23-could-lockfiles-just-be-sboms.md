---
layout: post
title: "Could lockfiles just be SBOMs?"
date: 2025-12-23 10:00 +0000
description: "Lockfiles and SBOMs record the same information in different formats. What if package managers used SBOMs directly, instead of converting later?"
tags:
  - package-managers
  - sbom
  - deep-dive
---

Every package manager has its own lockfile format. Gemfile.lock, package-lock.json, yarn.lock, Cargo.lock, poetry.lock, composer.lock, go.sum. They all record roughly the same information: which packages were installed, at what versions, with what checksums, from where.

Lockfiles are SBOMs.

Meanwhile, the security world has been pushing [CycloneDX](https://cyclonedx.org/) and [SPDX](https://spdx.dev/) as standardized formats for describing software components. Lockfiles do the same job, just in bespoke formats. Adoption in open source projects remains low, but that's changing: the EU's [Cyber Resilience Act](https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act) will push vendors toward providing SBOMs, and that pressure will flow upstream. The typical workflow involves generating an SBOM from a lockfile, which means running a tool like [Syft](https://github.com/anchore/syft) or [Trivy](https://github.com/aquasecurity/trivy) to convert one format to another. This conversion is sometimes lossy.

What if we cut out the middle step? What if package managers wrote SBOMs directly as their lockfile format? The short answer is: yes, mostly, with some sharp edges. I wanted to map out exactly where the gaps are.

## What lockfiles record

Looking across the major package managers, lockfiles generally contain:

**Package identity**: Name, version, and where it came from. npm records a resolved URL. Bundler records the registry and gem source. Cargo uses a source field. Go uses module paths.

**Integrity**: Some form of checksum. npm uses SHA-512 integrity hashes. Cargo stores checksums. Go puts SHA-256 hashes in go.sum. Bundler historically didn't include checksums in Gemfile.lock, though newer versions do.

**Dependencies**: The relationship between packages. Most lockfiles record which packages depend on which, either inline (Bundler lists dependencies under each gem) or as a separate structure (npm's packages object, Cargo's dependencies array).

**Scope**: Whether something is a dev dependency or a production one. npm marks this with dev/optional flags. Bundler separates groups in the Gemfile but flattens them in the lockfile. Poetry distinguishes packages from packages-dev.

**Metadata**: Tool versions, platform constraints, runtime versions. Bundler records BUNDLED WITH and RUBY VERSION. npm stores lockfileVersion. Cargo has a format version. These ensure the right tool interprets the file correctly.

Here's how the major lockfile formats compare (you can find [examples of each format](https://github.com/ecosyste-ms/package-manager-manifest-examples) if you want to dig deeper):

| Field | [Gemfile.lock](https://bundler.io/guides/rationale.html) | [package-lock.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json) | [yarn.lock](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/) | [Cargo.lock](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html) | [poetry.lock](https://python-poetry.org/docs/basic-usage/#installing-with-poetrylock) | [composer.lock](https://getcomposer.org/doc/01-basic-usage.md#commit-your-composer-lock-file-to-version-control) | [go.sum](https://go.dev/ref/mod#go-sum-files) |
|-------|--------------|-------------------|-----------|------------|-------------|---------------|--------|
| Package name | yes | yes | yes | yes | yes | yes | yes |
| Version | yes | yes | yes | yes | yes | yes | yes |
| Checksum | yes | yes | yes | yes | yes | yes | yes |
| Source URL | registry[^1] | yes | yes | yes | no | yes | no |
| Dependencies | inline[^2] | nested[^3] | inline[^2] | list[^4] | table[^5] | nested[^3] | no |
| Dev/prod scope | no | yes | no | no | yes | yes | no |
| Platform variants | yes | no | no | no | no | no | no |
| Tool version | yes | yes | no | yes | yes | no | no |
| Runtime version | yes | no | no | no | yes | yes | no |

[^1]: Records the registry name (e.g. `https://rubygems.org/`) but not the full URL to each gem.
[^2]: Dependencies listed directly under each package entry.
[^3]: Each package contains a nested object of its dependencies.
[^4]: Dependencies listed as an array of package name strings.
[^5]: Dependencies stored in a separate `[package.dependencies]` table.

The formats differ in structure but the core data is similar. The interesting variations are in the metadata: Bundler cares about the Ruby runtime and platforms because gems can have native extensions. npm tracks dev dependencies because it matters for production installs. Go's go.sum is a bit of an outlier: it's purely an integrity file (checksums only), not a resolution record. The actual version selection lives in go.mod. This weakens the "lockfiles are SBOMs" claim, but an integrity-only SBOM is still an SBOM, just an incomplete one. The pattern holds for most ecosystems.

## What CycloneDX provides

[CycloneDX](https://github.com/CycloneDX/specification) is designed for [software bills of materials](https://en.wikipedia.org/wiki/Software_supply_chain), but its data model maps reasonably well to lockfile concepts. It's now an ECMA standard ([ECMA-424](https://ecma-international.org/publications-and-standards/standards/ecma-424/)), and package URL (purl) is also standardized as [ECMA-427](https://ecma-international.org/publications-and-standards/standards/ecma-427/).

For each component, you can record:
- name, version, and group
- [purl](https://github.com/package-url/purl-spec) (package URL), which encodes type, namespace, name, version, and optionally a `repository_url` qualifier for internal or third-party registries
- hashes (MD5, SHA-1, SHA-256, SHA-512, and others)
- externalReferences for source URLs and documentation
- scope (required, optional, excluded)

For relationships:
- A [dependencies array](https://cyclonedx.org/use-cases/software-dependencies/) links components by their bom-ref
- Each entry lists what a component depends on

For metadata:
- tools records what generated the BOM
- [properties](https://cyclonedx.org/use-cases/cyclonedx-properties/) allow arbitrary key-value pairs

That properties mechanism is both the strength and the weakness. CycloneDX explicitly supports extension through namespaced properties. A package manager could store its platform constraints, runtime version requirements, and other metadata there. But once everything important lives in properties, you've effectively reinvented a bespoke format inside CycloneDX. Generic tooling won't understand it. This is already happening: different SBOM generators use different property conventions, and consumers have to know which tool produced the file to interpret it correctly.

## A compatibility table

Here's how lockfile fields could map to [CycloneDX's component model](https://cyclonedx.org/specification/overview/):

| Lockfile field | CycloneDX equivalent | Notes |
|----------------|---------------------|-------|
| Package name | component.name | Direct mapping |
| Version | component.version | Direct mapping |
| Checksum | component.hashes | Multiple algorithms supported |
| Source URL | purl + `repository_url` [qualifier](https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst#known-qualifiers-keyvalue-pairs) | Handles internal/third-party registries |
| Dependencies | dependencies array | Uses bom-ref |
| Dev scope | component.scope = "optional" | Not a perfect fit |
| Platform constraints | component.properties | Custom namespace needed |
| Tool version | metadata.tools | Direct mapping |
| Runtime version | metadata.properties | Custom namespace needed |
| Platform-specific variants | purl qualifiers (`arch`, `os`) | Each variant is a separate component |

Most fields have reasonable mappings. The gaps:

**Dev vs production**: CycloneDX's scope field has three values: required, optional, and excluded. This doesn't cleanly map to npm's dev/devOptional/optional/peer distinctions. The mismatch isn't accidental: SBOM scope is consumer-centric (what does the end user need?), while lockfile scope encodes resolver semantics (how should I install this?). You could use properties, but then tooling needs to understand your custom namespace.

**Platform-specific packages**: Bundler handles gems like ffi that have different builds for different platforms (ffi-1.17.2-arm64-darwin vs ffi-1.17.2-x86_64-linux-gnu). purl qualifiers can encode this (`pkg:gem/ffi@1.17.2?arch=arm64&os=darwin`), though each variant becomes a separate component rather than a single entry with multiple platforms.

**Peer dependencies**: npm's peer dependency concept has no direct equivalent. A package declaring a peer dependency expects the parent to provide it. CycloneDX's dependency graph is simpler.

**Direct vs transitive**: Some lockfiles distinguish what you asked for (Gemfile) from what got pulled in transitively. CycloneDX can represent this through the dependency graph but doesn't have an explicit flag. This matters more than it sounds: policy engines often treat direct and transitive dependencies differently for licensing or vulnerability remediation. It's a philosophical gap, not just a missing field.

## What we'd gain

If package managers adopted a standard lockfile format:

**No conversion step**. Security scanners could read lockfiles directly without ecosystem-specific parsers. Vulnerability databases already index by purl; a purl-native lockfile would be immediately queryable.

**Cross-ecosystem tooling**. Dependency graph analysis, license compliance, and supply chain tools could work the same way across languages. Today each tool needs to understand Gemfile.lock, package-lock.json, Cargo.lock, and a dozen others.

**Better interoperability**. Multi-language projects wouldn't need multiple tools to get a complete picture. A monorepo with Ruby, JavaScript, and Rust could have lockfiles in the same format.

**First-class SBOMs**. Projects would ship SBOMs by default because the lockfile is the SBOM. No extra generation step, no drift between what's installed and what's documented.

## What we'd lose

**Human readability**. Gemfile.lock and Cargo.lock are reasonably readable. CycloneDX supports JSON, XML, and YAML, but even the YAML format is more verbose than purpose-built lockfiles. You could tune the output, but it would never be as scannable as a format designed for the task.

**Machine diffability**. This is distinct from human readability. Many lockfile formats are deliberately designed to minimize merge conflicts. Cargo.lock and yarn.lock sort entries deterministically. Line-based formats diff cleanly. Some package managers even structure their lockfiles so that adding a dependency only touches one section. CycloneDX in any format would produce noisier diffs. Adding one dependency in package-lock.json might touch a handful of lines; in CycloneDX it could expand into dozens of lines, guaranteeing a messy diff. CycloneDX YAML would be friendlier than JSON for this, but it's still more verbose than purpose-built formats. This might be the biggest practical blocker. Developers hit lockfile conflicts constantly, and the pain of resolving them could kill adoption before any other benefits materialize.

**Ecosystem-specific semantics**. Each package manager has evolved its lockfile format to handle specific needs: Bundler's platform handling, npm's peer dependencies, Poetry's extras. CycloneDX properties could store all of this, but generic SBOM tooling wouldn't understand the semantics. A vulnerability scanner could read the components, but wouldn't know how to interpret npm's peer dependency rules or Bundler's platform resolution.

**Intentional incompleteness**. Some lockfile splits are deliberate. Go separates go.mod (requirements) from go.sum (checksums) because they serve different purposes and change at different times. A unified format might force awkward decisions about what belongs together.

**Migration cost**. Every package manager would need to support reading and writing a new format. Every CI pipeline, every deployment script, every lockfile parser would need updates. The ecosystem has a lot of inertia.

## We're already halfway there

Many package managers already generate SBOMs. npm has [`npm sbom`](https://docs.npmjs.com/cli/v10/commands/npm-sbom) built in. Cargo has [cargo-sbom](https://crates.io/crates/cargo-sbom). Python has [cyclonedx-bom](https://github.com/CycloneDX/cyclonedx-python). Ruby has [cyclonedx-ruby](https://github.com/CycloneDX/cyclonedx-ruby-gem) and [bundler-sbom](https://github.com/hsbt/bundler-sbom). Go, PHP, .NET [all have tools](https://cyclonedx.org/tool-center/). The machinery exists.

These tools read lockfiles and output CycloneDX or SPDX. The reverse operation (reading an SBOM and using it for installation) is the missing piece. But if a package manager can generate a complete SBOM from a lockfile, in theory it contains enough information to reverse the process.

A gradual path forward:

1. Package managers that already have `sbom` commands could add an experimental flag: `--lockfile-format=cyclonedx`. Write the lockfile as an SBOM. Read it back the same way.

2. Standardize a "lockfile profile" within CycloneDX. This is the most important step. Without it, CycloneDX-as-lockfile is a dead end. Define exactly how package managers should use properties for runtime versions, platforms, and scope distinctions. CycloneDX has a [property taxonomy](https://github.com/CycloneDX/cyclonedx-property-taxonomy) for registering namespaces. [Several package manager namespaces already exist](https://cyclonedx.github.io/cyclonedx-property-taxonomy/cdx.html): `cdx:npm`, `cdx:composer`, `cdx:gomod`, `cdx:maven`, `cdx:poetry`, and others. But these are mostly for ecosystem-specific metadata, not lockfile semantics. Something like `cdx:lockfile:direct` or `cdx:lockfile:runtime-version` would need to land there too. Otherwise every package manager invents its own conventions and we get the same fragmentation problem inside CycloneDX that we have outside it.

3. Let projects opt in. If your tooling works with CycloneDX and you don't need platform-specific edge cases, use it. Keep the native format as fallback.

The Python ecosystem is trying something related with [PEP 751](https://peps.python.org/pep-0751/), which proposes a standardized pylock.toml format. It's not CycloneDX, but it addresses the same fragmentation problem ([Poetry](https://python-poetry.org/), [PDM](https://pdm-project.org/), [pip-tools](https://pip-tools.readthedocs.io/), and [uv](https://github.com/astral-sh/uv) all have different lockfile formats).

This is where the question shifts from formats to trust. [SBOMit](https://sbomit.dev/) takes a different approach entirely. Rather than scanning lockfiles after the fact, it uses [Witness](https://github.com/in-toto/witness) to capture cryptographically signed attestations during each step of the build process: version control, dependency resolution, testing, packaging. The SBOM becomes a verified record of what actually happened, not a best-effort reconstruction from whatever files are lying around.

Package managers could do the same thing. During `bundle install` or `npm install`, the resolver already knows exactly which packages it fetched, from where, with what checksums. It could emit attestations as it goes. Combined with [Sigstore](https://www.sigstore.dev/) for artifact signing and [trusted publishing](https://repos.openssf.org/trusted-publishers-for-all-package-repositories.html) for verifying upload provenance, the lockfile becomes not just a list of versions, but a cryptographically verifiable record of the entire dependency graph.

## What the mapping reveals

The exercise of mapping lockfiles to CycloneDX reveals something interesting: these formats are more similar than they look. Strip away the syntax differences and you have packages, versions, checksums, sources, and dependencies. The variations are mostly in metadata and edge cases. The conversion tools exist because we built two systems for the same purpose.

Whether unification happens doesn't really matter. What matters is recognizing that lockfiles are software supply chain artifacts. They deserve the same attention we give to SBOMs. The security properties we want from SBOMs (integrity, provenance, completeness) are the same properties we want from lockfiles.

If you maintain a package manager, consider what it would take to output CycloneDX. If you work on SBOM tooling, consider what lockfile features you're not capturing. The gap between these worlds is smaller than it appears.

There's also a bigger problem neither lockfiles nor SBOMs currently solve well: system dependencies. Python wheels bundle compiled C libraries. Ruby gems link against libxml2 or openssl. These [phantom dependencies](https://sethmlarson.dev/early-promising-results-with-sboms-and-python-packages) are invisible to both lockfiles and most SBOM generators. [PEP 770](https://peps.python.org/pep-0770/) proposes embedding SBOM documents inside Python packages to capture what's actually bundled. That's a step toward complete software composition, but it highlights how much is still missing from the picture.
