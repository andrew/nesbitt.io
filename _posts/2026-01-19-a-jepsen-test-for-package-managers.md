---
layout: post
title: "A Jepsen Test for Package Managers"
date: 2026-01-19 10:00 +0000
description: "Applying Jepsen-style adversarial testing to package managers."
tags:
  - package-managers
  - idea
draft: true
---

When your CI fails because a package got yanked mid-install, or your lockfile resolves differently on a colleague's machine, you're hitting edge cases that nobody tested for. Package managers make promises about consistency and determinism, but those promises rarely get verified under adversarial conditions.

Databases had this problem too, until [Jepsen](https://jepsen.io/) came along. Package managers could use something similar.

### What Jepsen does

Kyle Kingsbury started the Jepsen project in 2013, initially as a [blog series called "Call Me Maybe"](https://aphyr.com/tags/jepsen) examining how databases behave under network partitions. The methodology is straightforward: spin up a cluster, run operations against it, inject faults (network partitions, process crashes, clock skew), and check whether the system's behavior matches its documented guarantees.

The first round of analyses tested PostgreSQL, Redis, MongoDB, and Riak. Kingsbury found that [Redis lost 56% of acknowledged writes](https://aphyr.com/posts/283-jepsen-redis) during certain partition scenarios. MongoDB's default configuration at the time could treat network errors as successful acknowledgements. These weren't obscure edge cases; they were gaps between what the documentation promised and what the software actually did.

Over the next decade, Jepsen [analyzed dozens of systems](https://jepsen.io/analyses): Cassandra, Kafka, Elasticsearch, etcd, CockroachDB, TiDB, YugabyteDB, and many others. The pattern repeated. Vendors claimed strong consistency; testing revealed stale reads, lost writes, replica divergence. Some systems failed catastrophically under partition. Others had subtle anomalies that only appeared under specific timing conditions.

The test harness itself is [open source](https://github.com/jepsen-io/jepsen), written in Clojure. It uses generators to produce random sequences of operations, nemeses to inject failures, and checkers to verify correctness properties. [Elle](https://github.com/jepsen-io/elle), a later addition, can detect transactional anomalies by analyzing operation histories as dependency graphs.

Before Jepsen, database vendors could make consistency claims without rigorous verification. Now, systems that haven't been Jepsen-tested carry an implicit asterisk. Vendors now commission Jepsen analyses proactively, treating a clean report as a credential. The methodology created a standard that the industry adopted.

Package managers don't have an equivalent yet. They ship with implied semantics, and users discover the edge cases in production.

The gap matters because package managers are distributed systems, just not ones we treat that way. A registry is a replicated data store with CDN caching, eventual consistency, and concurrent writes. A resolver is a decision procedure operating on remote state that may be stale, partial, or inconsistent. A lockfile is an attempt to capture a point-in-time snapshot of a distributed system. Mirrors, proxies, and local caches add more layers of replication with their own consistency properties.

These systems operate under partial failure constantly. The network between you and the registry flakes. A new version gets published while you're mid-resolution. Your cache holds metadata that the registry has since invalidated. The mirror your company runs falls behind. At the scale these registries operate, npm serving over 100 billion downloads a month, PyPI handling over a billion requests a day, a one-in-a-million edge case could happen thousands of times a day.

### What to test

What invariants should a package manager guarantee?

- **Resolution determinism.** Given the same manifest and the same registry state, the resolver should produce the same dependency graph.
- **Lockfile integrity.** A fresh install from a committed [lockfile](/2026/01/17/lockfile-format-design-and-tradeoffs) should produce identical results on any machine at any time, assuming the referenced artifacts still exist.
- **Publish atomicity.** When you publish a package, the metadata and the tarball should become visible together or not at all.
- **Registry consistency.** Official mirrors and authorized proxies should not silently diverge from the origin. If they do diverge, the divergence should be bounded and documented.
- **Cache correctness.** A corrupted or stale local cache should not silently alter the resolved graph. Either the cache should self-heal, or the operation should fail loudly.

If you wanted to know what consistency guarantees a registry provides, where would you look? How long does it take for a publish to propagate to all CDN edges? What happens if you install during that window? What if the index updates before the file storage syncs? These questions are hard to answer from the documentation. Users assume these systems are reliable in ways that aren't written down anywhere.

Adversarial testing would expose these undocumented semantics:

- **Partial metadata writes:** the tarball uploads successfully but the index update fails, or vice versa. What do clients see? For how long?
- **Concurrent publishes:** two versions of the same package race each other. What order do clients observe them in? Is that order consistent across CDN edges?
- **Yanks mid-resolution:** a package gets yanked between metadata fetch and tarball download. What happens?
- **Registry partitions:** the upstream is unreachable, the proxy is returning stale data. How stale? Does the client know?
- **Cache poisoning:** the local cache has corrupted entries, or entries that don't match their checksums. When does the manager notice?
- **Lockfile references to dead versions:** the lockfile points to a version that was yanked or deleted. What happens on a fresh install?
- **Time-of-check vs time-of-use:** CI resolves at 10:00, deploys at 10:15, new version published at 10:10 changes the meaning of a floating constraint. The lockfile from resolution no longer matches what would resolve now.

[Workspaces](/2026/01/18/workspaces-and-monorepos-in-package-managers) make this worse. Monorepo tooling, whether pnpm, yarn, or npm workspaces, adds local symlinking, hoisting, and version overrides. Each makes different tradeoffs: pnpm uses a strict content-addressable store with symlinks, yarn can hoist aggressively or use plug'n'play, npm hoists to the root by default. The graph you resolve locally during development can differ from what would resolve in CI, which can differ from what your dependents see after you publish.

A package might work locally because a sibling workspace hoists a dependency, then fail when published because that phantom dependency isn't declared. This isn't user error. It's undefined semantics. None of these tools document what consistency properties the local graph should have relative to the CI graph or the post-publish graph. The "works on my machine" bugs that come from workspace tooling are often the tooling's fault, not the developer's, but there's no specification to point to.

Before Jepsen, most databases shipped with vague claims about consistency and correctness. After Jepsen, they either documented their actual semantics or got embarrassed when those semantics turned out to be weaker than advertised. The testing methodology created accountability.

Package managers are where databases were in 2012. Things work out most of the time, edge cases get fixed when users report them, nobody has a complete picture of the failure modes. That's fine for most workloads. But it also means there's an opportunity: the same methodology that transformed database reliability could work here.

Some pathologies get weirder. Diamond dependency version oscillation: A depends on B and C, both depend on D but at conflicting versions, and the resolver picks differently based on traversal order. Signature key rotation mid-publish: a package signed with the old key, but metadata updated to expect the new one. Lockfile hash algorithm migration: SHA-1 to SHA-256 transition leaves mixed hashes, and the manager can't verify half the entries. Floating tag resolution: the `latest` tag changes between dependency resolution passes within the same install. Pre-release version leakage: `^1.0.0` unexpectedly matching `2.0.0-alpha` on some managers but not others. Each of these is a real failure mode that users have hit.

### What exists today

Some prior art exists, though it's narrower than what a Jepsen-style framework would require. The closest to adversarial testing is Cappos et al.'s 2008 paper ["A Look in the Mirror: Attacks on Package Managers"](https://dl.acm.org/doi/10.1145/1455770.1455841) (see my [package management papers](/2025/11/13/package-management-papers) collection for more), which found vulnerabilities in ten package managers including replay attacks, freeze attacks, and malicious mirror exploits. That work focused on security attacks rather than consistency under failure, but it established that package managers don't hold up well under adversarial conditions. pip's core resolver lives in [resolvelib](https://github.com/sarugaku/resolvelib), a library that deliberately [borrows test cases from Ruby and Swift](https://pradyunsg.me/blog/2020/03/27/pip-resolver-testing/) to verify the algorithm works across ecosystems. Cargo has extensive resolver tests via its [`#[cargo_test]` infrastructure](https://doc.crates.io/contrib/tests/writing.html), and there's [ongoing work adding SAT solver tests](https://github.com/rust-lang/cargo/pull/14614). The [pubgrub-crates-benchmark](https://github.com/Eh2406/pubgrub-crates-benchmark) project tests PubGrub against real crate indices. Node.js has [discussed portable resolver test suites](https://github.com/nodejs/node/issues/49448) for ES module compliance.

All of this focuses on algorithm correctness under normal conditions. What's missing is adversarial testing: network fault injection, concurrent publish races, registry propagation delays, partial failures. The [cdn-tests](https://www.npmjs.com/package/cdn-tests) npm package exists but explicitly states it's "not a conformance test suite, it's just the start of a conversation." I haven't found anyone simulating what happens when Fastly and the npm origin briefly disagree, or when a publish propagates to some CDN edges but not others.

Building a real adversarial test suite would be substantial work. You'd need harnesses for multiple package managers, network fault injection, controllable test registries, instrumentation of resolver behavior. That's a significant engineering project. And since npm's registry is closed source, you could really only test the fully open source registries like crates.io, [RubyGems.org](/2025/12/28/the-compact-index), and PyPI.

But even articulating what the tests would check has value. The first step is naming the invariants. What does "deterministic resolution" actually mean when the underlying data source is eventually consistent? What does "atomic publish" mean when there are multiple data stores that need to update? Forcing these questions creates clarity even before anyone writes test code.

GitHub Actions would fail spectacularly under this kind of testing. I've [written before](/2025/12/06/github-actions-package-manager) about how Actions is a package manager that ignores decades of supply chain security lessons: no lockfile, no integrity verification, no transitive pinning, no dependency visibility. Every run re-resolves from mutable tags. The semantics are undocumented. It's a case study in what happens when you build a dependency system without thinking about the guarantees it should provide. Adversarial testing would surface these problems immediately, which is probably why nobody's done it.

Package managers haven't had that moment yet. Most don't make explicit consistency claims, which means there's nothing to verify. But the implicit expectations are there: users assume deterministic resolution, atomic publishes, reliable mirrors. A testing methodology could make those expectations explicit. Registry maintainers could publish what their systems actually guarantee, and someone could build the test suite that checks whether they're right.

