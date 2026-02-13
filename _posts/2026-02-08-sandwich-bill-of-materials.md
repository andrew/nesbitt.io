---
layout: post
title: "Sandwich Bill of Materials"
date: 2026-02-08
description: "SBOM 1.0: A specification for sandwich supply chain transparency."
tags:
  - package-managers
  - sbom
  - satire
---

**Specification:** SBOM 1.0 (Sandwich Bill of Materials)<br>
**Status:** Draft<br>
**Maintainer:** The SBOM Working Group<br>
**License:** MIT (Mustard Is Transferable)

### Abstract

Modern sandwich construction relies on a complex graph of transitive ingredients sourced from multiple registries (farms, distributors, markets). Consumers have no standardized way to enumerate the components of their lunch, assess ingredient provenance, or verify that their sandwich was assembled from known-good sources. SBOM addresses this by providing a machine-readable format for declaring the full dependency tree of a sandwich, including sub-components, licensing information, and known vulnerabilities.

### Motivation

A typical sandwich contains between 6 and 47 direct dependencies, each pulling in its own transitive ingredients. A "simple" BLT depends on bacon, which depends on pork, which depends on a pig, which depends on feed corn, water, antibiotics, and a farmer whose field hasn't flooded yet. The consumer sees three letters, but the supply chain sees a directed acyclic graph with cycle detection issues (the pig eats the corn that grows in the field that was fertilized by the pig).

The 2025 egg price crisis was a cascading failure equivalent to a left-pad incident, except it affected breakfast. A single avian flu outbreak took down the entire egg ecosystem for months. Post-incident analysis revealed that 94% of affected sandwiches had no lockfile and were resolving eggs to `latest` at assembly time.

### Specification

An SBOM document MUST be a JSON file with the `.sbom` extension, after YAML was considered and rejected on the grounds that the sandwich industry has enough problems without adding whitespace sensitivity.

Each sandwich component MUST include the following fields:

**surl** (required): A Sandwich URL uniquely identifying the ingredient. Format: `surl:type/name@version`. Follows the same convention as [PURL](https://github.com/package-url/purl-spec) but for food. Examples:

```
surl:dairy/cheddar@18m
surl:grain/sourdough@2.1.0
surl:produce/tomato@2025-07-14
surl:condiment/mayonnaise@hellmanns-3.2
surl:mystery/that-sauce-from-the-place@latest
```

**name** (required): The canonical name of the ingredient as registered in a recognized food registry. Unregistered ingredients (e.g., "that sauce from the place") MUST be declared as `unverified-source` and will trigger a warning during sandwich linting.

**version** (required): The specific version of the ingredient. Tomatoes MUST use calendar versioning (harvest date). Cheese MUST use age-based versioning (e.g., `cheddar@18m`). Bread follows semver, where a MAJOR version bump indicates a change in grain type, MINOR indicates a change in hydration percentage, and PATCH indicates someone left it out overnight and it's a bit stale but probably fine.

**supplier** (required): The origin registry. Valid registries include `farm://`, `supermarket://`, `farmers-market://`, and `back-of-the-fridge://`. The latter is considered an untrusted source and components resolved from it MUST include a `best-before` integrity check.

**integrity** (required): A SHA-256 hash of the ingredient at time of acquisition.

**license** (required): The license under which the ingredient is distributed. Common licenses include:

- **MIT** (Mustard Is Transferable): The ingredient may be used in any sandwich without restriction. Attribution appreciated but not required.
- **GPL** (General Pickle License): If you include a GPL-licensed ingredient, the entire sandwich becomes open-source. You must provide the full recipe to anyone who asks. Pickle vendors have been particularly aggressive about this.
- **AGPL** (Affero General Pickle License): Same as GPL, but if you serve the sandwich over a network (delivery apps), you must also publish the recipe. This is why most restaurants avoid AGPL pickles.
- **BSD** (Bread, Sauce, Distributed): Permissive. You can do whatever you want as long as you keep the original baker's name on the bread bag, and also a second copy of the baker's name, and also don't use the baker's name to promote your sandwich without permission. There are four variants of this license and nobody can remember which is which.
- **SSPL** (Server Side Pickle License): You may use this pickle in your sandwich, but if you offer sandwich-making as a service, you must open-source your entire kitchen, including the weird drawer with all the takeaway menus. Most cloud sandwich providers have stopped serving SSPL pickles entirely.
- **Proprietary**: The ingredient's composition is not disclosed. Common for "secret sauces." Consumption is permitted but redistribution, reverse-engineering, or asking what's in it are prohibited by the EULA you agreed to by opening the packet.
- **Public Domain**: The ingredient's creator has waived all rights. Salt, for example, has been public domain since approximately the Jurassic period, though several companies have attempted to relicense it.

### Dependency Resolution

Sandwich assembly MUST resolve dependencies depth-first. If two ingredients declare conflicting sub-dependencies (e.g., sourdough requires `starter-culture@wild` but the prosciutto's curing process pins `salt@himalayan-pink`), the assembler SHOULD attempt version negotiation. If negotiation fails, the sandwich enters a conflict state and MUST NOT be consumed until a human reviews the dependency tree and makes a judgement call.

Circular dependencies are permitted but discouraged. A sandwich that contains bread made with beer made with grain from the same field as the bread is technically valid but will cause the resolver to emit a warning about "co-dependent sourdough."

### Vulnerability Scanning

All SBOM documents SHOULD be scanned against the National Sandwich Vulnerability Database (NSVD). Known vulnerabilities include:

- **CVE-2024-MAYO**: Mayonnaise left at room temperature for more than four hours. Severity: Critical. Affected versions: all. No patch available; mitigation requires refrigeration, which the specification cannot enforce.
- **CVE-2023-GLUTEN**: Bread contains gluten. This is not a bug; it is a feature of wheat. However, it must be disclosed because approximately 1% of consumers will experience adverse effects, and the remaining 99% will ask about it anyway.
- **CVE-2025-AVO**: Avocado ripeness window is approximately 17 minutes. Version pinning is ineffective. The working group recommends vendoring avocado (i.e., buying it already mashed) to reduce exposure to ripeness drift.
- **CVE-2019-SPROUT**: Alfalfa sprouts were found to be executing arbitrary bacteria in an unsandboxed environment. Severity: High. The vendor disputes this classification.

### Provenance and Attestation

Each ingredient MUST include a signed provenance attestation from the supplier. The attestation MUST be generated in a hermetic build environment and MUST NOT be generated in a build environment where other food is being prepared simultaneously, as this introduces the risk of cross-contamination of provenance claims.

For farm-sourced ingredients, the attestation chain SHOULD extend to the seed or animal of origin. A tomato's provenance chain includes the seed, the soil, the water, the sunlight, the farmer, the truck, the distributor, and the shelf it sat on for a period the supermarket would prefer not to disclose.

Eggs are worse, because an egg's provenance attestation is generated by a chicken that may itself lack a valid attestation chain. The working group has deferred the question of chicken-or-egg provenance ordering to version 2.0.

### Reproducible Builds

A sandwich MUST be reproducible. Given identical inputs, two independent assemblers MUST produce bite-for-bite identical sandwiches, which in practice is impossible. The specification handles this by requiring assemblers to document all sources of non-determinism in a `sandwich.lock` file, including:

- Ambient temperature at time of assembly
- Knife sharpness (affects tomato slice thickness, which affects structural integrity)
- Whether the assembler was "just eyeballing it" for condiment quantities
- Gravitational constant at location of assembly

Reproducible sandwich builds remain aspirational. A compliance level of "close enough" is acceptable for non-safety-critical sandwiches. Safety-critical sandwiches SHOULD target full reproducibility.

### Transitive Dependency Auditing

Consumers SHOULD audit their full dependency tree before consumption. A `sbom audit` command will flag any ingredient that:

- Has not been updated in more than 12 months
- Is maintained by a single farmer with no succession plan (see also: goat farming)
- Has more than 200 transitive sub-ingredients
- Was sourced from a registry that does not support 2FA
- Contains an ingredient whose maintainer has mass-transferred ownership to an unknown entity in a different country (see: the `left-lettuce` incident)

### Adoption and Compliance

Early adoption has been mixed. The artisanal sandwich community objects to machine-readable formats on philosophical grounds, arguing that a sandwich's ingredients should be discoverable through the act of eating it. The fast food industry has expressed support in principle but notes that their sandwiches' dependency trees are trade secrets and will be shipped as compiled binaries.

The EU Sandwich Resilience Act (SRA) requires all sandwiches sold or distributed within the European Union to include a machine-readable SBOM by Q3 2027. Sandwiches without a valid SBOM will be denied entry at the border. The European Commission has endorsed the specification as part of its broader lunch sovereignty agenda, arguing that member states cannot depend on foreign sandwich infrastructure without visibility into the ingredient graph. A working paper on "strategic autonomy in condiment supply chains" is expected Q2 2027.

The US has issued Executive Order 14028.5, which requires all sandwiches served in federal buildings to include an SBOM. The order does not specify whether it means Sandwich or Software Bill of Materials. Several federal agencies have begun submitting both.

### The Sandwich Heritage Foundation

The [Software Heritage](https://www.softwareheritage.org/) foundation archives all publicly available source code as a reference for future generations, and the Sandwich Heritage Foundation has adopted the same mission for sandwiches, with less success.

Every sandwich assembled under SBOM 1.0 is archived in a content-addressable store keyed by its integrity hash. The archive currently holds 14 sandwiches because most contributors cannot figure out how to hash a sandwich without eating it first. A BLT submitted in March was rejected because the tomato's checksum changed during transit. The Foundation suspects condensation.

Long-term preservation remains an open problem. Software can be archived indefinitely on disk, but sandwiches introduce material constraints the specification was not designed for. The Foundation has explored freeze-drying, vacuum sealing, and "just taking a really detailed photo," but none of these produce a bit-for-bit reproducible sandwich from the archive. The working group considers this a storage layer concern and out of scope for the specification.

Funding comes from individual donations and a pending grant application to the EU's Horizon programme under the call for "digital preservation of cultural food heritage." The application was rejected once already on the grounds that sandwiches are not digital, a characterization the Foundation disputes given that every sandwich under SBOM 1.0 is, by definition, a digital artifact with a hash.

### Acknowledgments

This specification is dedicated to a small sandwich shop on Folsom Street in SoMA that made the best BLT the author has ever eaten, and which closed in 2019 without producing an SBOM or publishing its recipe in any machine-readable format.

---

*This specification is provided "AS IS" without warranty of any kind, including but not limited to the warranties of edibility, fitness for a particular meal, and non-contamination. The SBOM Working Group is not responsible for any sandwich constructed in accordance with this specification that nonetheless tastes bad.*
