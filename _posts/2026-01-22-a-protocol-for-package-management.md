---
layout: post
title: "A Protocol for Package Management"
date: 2026-01-22 10:00 +0000
description: "A shared vocabulary for resolution, publishing, and governance across ecosystems."
tags:
  - package-managers
  - idea
---

Writing about [testing package managers like Jepsen tests databases](/2026/01/19/a-jepsen-test-for-package-managers.html) got me thinking about what sits underneath all the ecosystem-specific details. We can describe HTTP without talking about Apache or nginx. We can discuss database consistency models without reference to PostgreSQL or MySQL. But when we talk about package management, the conversation immediately becomes about npm's node_modules hoisting or Cargo's semver-compatible version deduplication or Go's minimal version selection, rather than the underlying operations those are all implementations of.

Individual package managers have specifications. Cargo documents its resolver. npm documents its registry API. RubyGems has the [compact index spec](/2025/12/28/the-compact-index.html). But there's no shared language for talking about what package managers do in the abstract, independent of any particular implementation.

I've written about package manager [components](/2025/12/02/what-is-a-package-manager.html), [tradeoffs](/2025/12/05/package-manager-tradeoffs.html), [terminology](/2026/01/13/package-manager-glossary.html), and [categorization](/2025/12/29/categorizing-package-manager-clients.html). This post tries to go one level higher: what would a reference model for package management look like? Something that names the layers, actors, operations, and properties that all package managers share, even when their implementations differ.

If this existed, it might look like: a document that defines "resolution determinism" precisely enough that you could compare npm and Cargo on the same terms. A taxonomy of failure modes that tool builders could implement against. A vocabulary for governance operations that lets researchers compare how different registries handle disputes. A shared frame that makes the similarities and differences legible, without forcing convergence.

I should say upfront that I have no experience writing or defining protocols or reference models. I don't know what's actually involved in that work, or what the right process would be. What follows is more a sketch of what such a model might need to cover, not a proposal for how to build one. I'm throwing out ideas to see if they resonate with people who do know this stuff, more conversation starter than spec draft.

Most of what follows focuses on language package managers (npm, pip, Cargo, Bundler) rather than system package managers (apt, dnf, pacman, Homebrew). The two categories overlap but have different concerns. System package managers deal with file conflicts, coordinated releases, maintainer curation, and post-install scripts running as root. Language package managers deal with per-project isolation, transitive dependency graphs, and lockfile reproducibility. A complete reference model would need to cover both, but I know the language side better.

### The layers

**User commands.** What developers type at the terminal. `install`, `add`, `remove`, `update`, `audit`, `publish`. These are the interface layer, and despite different names across ecosystems (`npm install` vs `pip install` vs `cargo add`), they map to a small set of underlying operations. A protocol could define what each command is expected to do without specifying the CLI syntax.

**Manifest format.** How projects declare their dependencies. package.json, Gemfile, Cargo.toml, pyproject.toml. Each uses different syntax (JSON, Ruby DSL, TOML, TOML again) but expresses similar concepts: package name, version constraints, dependency types, metadata. The [glossary](/2026/01/13/package-manager-glossary.html) covers the terminology; a protocol would specify the semantic model underneath.

**Lockfile format.** How resolved dependencies get recorded. [Lockfiles vary wildly](/2026/01/17/lockfile-format-design-and-tradeoffs.html) in what they include (just versions? checksums? full URLs? resolver metadata?) and how they structure it. But they all serve the same purpose: making resolution reproducible. A protocol could specify what a lockfile must capture without dictating the serialization format.

**Registry protocol.** How clients talk to registries. REST APIs, sparse indexes, full replication, proprietary protocols. This is where the [compact index](/2025/12/28/the-compact-index.html) lives, and where decisions about caching, consistency, and availability get made. Different [data flow patterns](#data-flow-patterns) have different tradeoffs.

**Archive format.** How packages get bundled for distribution. Tarballs, wheels, jars, crates. Some include metadata inside the archive; others serve metadata separately. Some are source distributions; others are prebuilt binaries. The format determines what's possible at install time.

**Dependency resolution.** The algorithmic core of package management. Given a manifest with version constraints, produce a concrete dependency graph that satisfies all of them. This is [NP-complete in the general case](/2025/12/29/categorizing-package-manager-clients.html), so every resolver makes tradeoffs. [SAT solvers](/2025/12/29/categorizing-package-manager-clients.html#resolution-algorithms) can prove unsatisfiability but are expensive. Backtracking is simpler but can be slow. [Minimal version selection](https://research.swtch.com/vgo-mvs) sidesteps complexity by always picking the oldest version. [PubGrub](https://nex3.medium.com/pubgrub-2fb6470504f) gives better error messages by tracking why versions were excluded. A protocol would need to specify what resolution means without mandating a particular algorithm.

**Publishing workflow.** How packages go from a developer's machine to a registry. Authentication, validation, signing, propagation. [Trusted publishing](https://docs.pypi.org/trusted-publishers/) from CI systems is changing this layer. The protocol would need to cover both the mechanics and the security properties.

**Security model.** What guarantees the system provides and what threats it addresses. Client-side concerns (verifying checksums, validating signatures, detecting tampering) differ from registry-side concerns (authenticating publishers, scanning for malware, enforcing policies). The [landscape](/2026/01/03/the-package-management-landscape.html) shows how many tools exist around these concerns.

### The actors

**Publishers** create packages and make them available. They have identities (accounts, keys, or domain ownership) and permissions to write to certain namespaces.

**Consumers** install packages into projects. They specify what they need (through manifests with version constraints) and receive resolved dependency graphs. Automated consumers (CI systems, dependency update tools, AI coding assistants) now account for a significant share of registry traffic, with different access patterns than human developers.

**Registries** store packages and serve metadata. They map names to artifacts, enforce namespace rules, and maintain the index that makes resolution possible.

**Proxies and mirrors** sit between consumers and registries. They cache, filter, and sometimes transform what passes through. Organizations run them for reliability, speed, or policy enforcement.

**Resolvers** turn abstract constraints into concrete versions. They might run on the client, on a server, or both. They need access to package metadata and produce deterministic (or at least reproducible) results.

These roles can be combined. A consumer might also be a publisher. A registry might include a resolver. But the functions are distinct even when the implementations merge them.

The interesting cases are the interactions between actors. A proxy caches package metadata, but what happens when the upstream registry yanks a version? The proxy might keep serving the yanked version to clients that haven't refreshed their cache. Is that a bug or a feature? It depends on whether you prioritize reproducibility (the cached version still works) or security (the version was yanked for a reason).

Resolvers can run on the client or on the registry. Client-side resolution means you control the algorithm but need to fetch metadata for every candidate version. Server-side resolution means fewer round trips but you're trusting the registry to resolve correctly. Some registries offer both. When they disagree, which one is authoritative?

Mirrors introduce another layer. An organizational mirror might lag behind upstream by hours or days. A developer resolves against the mirror, gets version 1.2.3, commits a lockfile. A CI server resolves against upstream, sees that 1.2.3 was yanked, fails the build. Whose view of the world is correct? The protocol would need to define how staleness propagates through the system.

### The data types

**Package identifier**: a name in a namespace. `express` in npm, `rails` in RubyGems, `github.com/gin-gonic/gin` in Go. [PURL](https://github.com/package-url/purl-spec) already standardizes how to reference packages across ecosystems. The identifier space is the registry's most valuable asset and its hardest governance problem.

**Version**: an identifier for a specific release. Usually follows some structure (semver, calver, or [various other schemes](/2024/06/24/from-zerover-to-semver-a-comprehensive-list-of-versioning-schemes-in-open-source.html)). Versions are partially ordered, and that ordering is load-bearing for resolution.

**Version constraint**: a predicate over versions. `>=1.0.0`, `^2.3.4`, `~> 1.5`. The syntax varies wildly but the semantics are similar: given a set of available versions, which ones satisfy this constraint? [VERS](https://github.com/package-url/purl-spec/blob/master/VERSION-RANGE-SPEC.rst) attempts to standardize this.

**Manifest**: a declaration of what a project needs. Direct dependencies with constraints, plus metadata about the project itself.

**Lockfile**: a record of what was actually resolved. Concrete versions for every dependency (direct and transitive), often with integrity hashes.

**Package artifact**: the distributable unit. A tarball, wheel, jar, or crate. Contains code plus metadata in some structured format.

**Dependency graph**: the result of resolution. A directed acyclic graph where nodes are package-versions and edges are "depends on" relationships.

**Platform target**: the combination of operating system, CPU architecture, and runtime version that a binary artifact is built for. Python wheels encode this in filenames (`cp311-manylinux_x86_64`). Rust has target triples (`x86_64-unknown-linux-gnu`). System packages are built per-distro and architecture. Resolution needs to filter artifacts by what the consumer's environment can actually run, and the ways ecosystems represent this vary widely.

### The operations

**Publish**: a publisher submits an artifact and metadata to a registry. The registry validates the submission (name ownership, version uniqueness, format compliance) and makes it available for resolution.

**Resolve**: given a manifest, produce a dependency graph that satisfies all constraints. This is the hard part, [NP-complete in the general case](/2025/12/29/categorizing-package-manager-clients.html), and where most of the interesting design decisions live. Different [resolution algorithms](/2025/12/29/categorizing-package-manager-clients.html#resolution-algorithms) (SAT solving, backtracking, minimal version selection) make different tradeoffs.

**Install**: given a resolved graph (from a lockfile or fresh resolution), fetch artifacts and place them where the runtime can find them.

**Update**: given an existing lockfile, resolve again with newer constraints or newer available versions, producing a new lockfile.

**Yank/deprecate**: a publisher marks a version as unavailable for new resolution while keeping it accessible for existing lockfiles.

**Query**: ask the registry for metadata about a package, its versions, its dependencies, or its dependents.

### Governance operations

Registries don't just host files. They [make political decisions](/2025/12/22/package-registries-are-governance-as-a-service.html) about who owns names, how disputes resolve, and what gets removed. These governance operations are as much a part of what package managers do as resolution or installation, but they're rarely described in compatible terms.

**Namespace allocation.** Who can claim a name? First-come-first-served? Domain verification? Organizational scopes? Different registries make different choices, but the underlying question is the same: how does an identifier get bound to an owner?

**Ownership transfer.** What happens when a maintainer abandons a package, or dies, or has their account compromised? npm has a process. RubyGems has a different process. The concept of "transferring ownership" is universal; the policies vary.

**Dispute resolution.** Two parties claim the same name. A trademark holder wants a package removed. A maintainer claims their account was hijacked. How do these get resolved? By whom? With what appeals process?

**Content removal.** Malware gets found, or a package violates terms of service, or a court orders a takedown. What gets removed? Who decides? Is it reversible? How fast does it propagate to mirrors?

**Account recovery.** A maintainer loses access. How do they prove identity? What happens to their packages during the recovery process? Who has authority to restore access?

A protocol could define shared vocabulary for these governance operations without mandating specific policies. "Ownership transfer" could have a common definition even if npm and PyPI have different rules about when it's allowed. This would let researchers compare governance models across registries, and might help smaller registries learn from decisions larger ones have already worked through.

### The consistency properties

What guarantees should these operations provide? Naming these properties explicitly is part of what a reference model would do.

**Resolution determinism**: given the same manifest and the same registry state, resolution should produce the same graph. "Same registry state" is doing a lot of work here, since registries are distributed systems with CDN caching and eventual consistency.

**Lockfile integrity**: installing from a lockfile should produce identical results regardless of when or where you run it, as long as the referenced artifacts still exist.

**Publish atomicity**: when a version is published, it should become visible atomically. Consumers shouldn't see partial states where the metadata exists but the artifact doesn't, or vice versa.

**Monotonic versions**: once a version number is used, its meaning shouldn't change. Republishing the same version with different contents violates this, which is why most registries forbid it.

**Yank semantics**: yanked versions should be excluded from new resolution but included when resolving existing lockfiles that reference them.

**Version ordering**: given two versions, which one is newer? This sounds obvious until you hit pre-releases. Does `^1.0.0` match `2.0.0-alpha`? npm says no by default. What's the "latest" version of a package? Most registries exclude pre-releases from `latest` unless there's no stable release, but the rules vary. Sorting versions correctly matters for resolution and for tools that display changelogs or upgrade paths.

Each of these has subtleties that different package managers handle differently. Go's [minimal version selection](https://research.swtch.com/vgo-mvs) achieves determinism without lockfiles by always picking the oldest satisfying version. npm's resolution used to produce different trees depending on installation order. [The compact index](/2025/12/28/the-compact-index.html) that Bundler and Cargo use is append-only specifically to provide consistency guarantees that the old full-index approach couldn't.

The edge cases are where things get interesting. "Same registry state" sounds simple until you consider that npm's registry sits behind Fastly's CDN with eventually consistent replicas. Publish atomicity involves writing to multiple stores that can partially fail. Yank semantics interact with caching in subtle ways when a lockfile references a version that's been yanked since last resolution. Different clients handle these cases differently.

### Missing concepts

**Time.** I've talked about staleness and caching, but there's no explicit notion of time in the model. Distributed systems specs usually need concepts like epochs, snapshots, or logical clocks. When did a publish become visible? What's the maximum propagation delay? Can a lockfile reference a point-in-time view of the registry? Package managers don't typically expose these concepts, but they're operating under temporal assumptions that users don't see.

**Authority.** Who is authoritative for what? The registry is authoritative for package metadata, but what about a proxy that's been caching for six months? The lockfile is authoritative for what versions to install, but what if the registry says one of those versions is now malware? Clients trust registries, registries trust publishers, publishers trust CI systems. A reference model would need to map these trust boundaries and say what happens when authorities disagree.

**Observability.** What can you see when things go wrong? Logs, error messages, introspection APIs. If resolution fails, what information is available to debug it? If a publish doesn't propagate, how do you know? Tool builders and researchers need to observe what package managers are doing, but observability isn't typically part of the specification. It's an implementation detail that varies widely and matters a lot.

### Data flow patterns

**Full replication**: the client downloads the complete index and resolves locally. apt does this. Resolution is fast once synced, works offline, but initial sync is expensive and data goes stale.

**On-demand queries**: the client fetches metadata per-package during resolution. npm and PyPI work this way. Always current, but requires network access and many round trips.

**Sparse indexing**: the client fetches only metadata for packages it actually needs, but in a cacheable format. [Cargo's sparse index](https://blog.rust-lang.org/2023/03/09/Cargo-1.68.0.html#sparse-registry-support) and RubyGems' [compact index](/2025/12/28/the-compact-index.html) use this approach.

**Proxy caching**: an organizational proxy intercepts requests and caches responses. Reduces load on upstream registries and provides availability if upstream goes down.

Each pattern makes different tradeoffs between freshness, bandwidth, latency, and offline capability. A protocol spec would need to accommodate all of them.

### Failure modes

A protocol needs to specify not just what happens when things work, but what happens when they don't. This is where ecosystems diverge most and where shared vocabulary would help most.

**Checksum mismatch.** Clients vary: fail hard, warn, or skip verification entirely.

**Unavailable dependency.** Do you fail immediately? Try mirrors? Fall back to cache? npm, pip, and Cargo all handle this differently.

**Unsatisfiable resolution.** PubGrub tracks the chain of conflicts. Other resolvers provide less detail.

**Partial install.** npm leaves partial installs in place. Some tools use atomic installs.

**Cascading failures.** A transitive dependency four levels deep becomes unavailable. Some ecosystems fail fast; others degrade gracefully.

These failure modes matter because they're where the user experience diverges most. Shared vocabulary for failure conditions would help both tool builders and users.

### What this enables

**Portable security research.** [Dependency confusion](/2025/12/10/slopsquatting-meets-dependency-confusion.html) was discovered in npm, then checked in PyPI and RubyGems. [Typosquatting](/2025/12/17/typosquatting-in-package-managers.html) techniques transfer between ecosystems, but defenses don't always follow. A protocol would let researchers describe attacks and defenses in terms that apply everywhere.

**Systematic comparison.** Comparing npm and Yarn on consistency guarantees is hard because they don't describe those guarantees in compatible terms. A shared vocabulary would let us ask: which package managers provide publish atomicity? Which guarantee resolution determinism? Where does each fall on the [tradeoff space](/2025/12/05/package-manager-tradeoffs.html)?

**Learning from each other.** When Cargo adopted [sparse indexes](https://blog.rust-lang.org/2023/03/09/Cargo-1.68.0.html#sparse-registry-support), they were borrowing an idea RubyGems had [proven out years earlier](/2025/12/28/the-compact-index.html). When pip rewrote its resolver, they [borrowed test cases from Ruby and Swift](https://pradyunsg.me/blog/2020/03/27/pip-resolver-testing/). A shared model would make these patterns more visible.

**Support for smaller ecosystems.** Dependabot prioritizes npm, PyPI, Maven, Go because each integration is significant work. Smaller package managers (Nimble, Shards, jpm) get pushed to the back of the queue. If tools could implement against a protocol and write thin adapters, the long tail might actually get tooling support.

### What this isn't

Yes, I've seen [the xkcd](https://xkcd.com/927/). This isn't a proposal to standardize package managers. Existing ecosystems have differences that matter. Some take advantage of runtime features that can't be replicated everywhere: Bundler's Gemfile is a Ruby DSL, Mix is deeply integrated with OTP. A protocol has to sit above these language-specific capabilities, which means it can't capture everything.

It's also not something existing package managers would easily adopt. npm's registry isn't going to change its API to match a theoretical spec. The value is shared vocabulary for reasoning about these systems.

[PURL](https://github.com/package-url/purl-spec) already does this for identifiers. It has problems with edge cases and ecosystems that don't fit its model, but it's proven useful enough that tools adopted it anyway. A protocol for the rest of package management would have similar imperfections and similar utility.

### Why this is hard

Abstracting over ecosystem differences is hard. A "version constraint" in npm might match pre-releases differently than in Cargo. The [glossary](/2026/01/13/package-manager-glossary.html) can define these terms, but a protocol would need to handle edge cases where ecosystems diverge.

Some registries are closed source, which means understanding their behavior requires black-box observation rather than reading the code. Others like crates.io, RubyGems.org, and PyPI are open source.

There's a coordination problem: who maintains the spec? And an adoption problem: the vocabulary only has value if people use it. PURL succeeded because SBOMs needed a standard way to identify packages. A protocol would need a similar forcing function.

The [package management landscape](/2026/01/03/the-package-management-landscape.html) suggests demand exists. [Syft](https://github.com/anchore/syft), [Dependabot](https://github.com/dependabot/dependabot-core), [deps.dev](https://deps.dev), [bibliothecary](https://github.com/librariesio/bibliothecary), [osv-scalibr](https://github.com/google/osv-scalibr) each build their own abstraction layer over multiple ecosystems. The fact that they all independently arrived at similar abstractions suggests those abstractions want to exist.

### Related work

Some cross-ecosystem infrastructure exists: [PURL](https://github.com/package-url/purl-spec) for identifiers, [VERS](https://github.com/package-url/purl-spec/blob/master/VERSION-RANGE-SPEC.rst) for version constraints, [SPDX](https://spdx.dev/)/[CycloneDX](https://cyclonedx.org/) for SBOMs, [Sigstore](https://www.sigstore.dev/)/[SLSA](https://slsa.dev)/[TUF](https://theupdateframework.io/) for signing. None reach the protocol level: they specify interchange formats, not resolution semantics or publish consistency. There's also [academic work](/2025/11/13/package-management-papers.html) (Di Cosmo's [formal models](https://www.researchgate.net/publication/278629134_EDOS_deliverable_WP2-D21_Report_on_Formal_Management_of_Software_Dependencies), Russ Cox's [Surviving Software Dependencies](https://dl.acm.org/doi/10.1145/3329781.3344149)) that hasn't coalesced into something practitioners use.

Building a protocol would mean documenting what existing package managers actually do in practice, including the edge cases. The spec would emerge from implementations.

If you work on cross-ecosystem tooling, registry infrastructure, or dependency research, I'd like to know whether this gap feels real to you too.

