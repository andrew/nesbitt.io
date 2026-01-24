---
layout: post
title: "Introducing Package Chaos Monkey"
date: 2026-01-26 08:00 +0000
description: "Resilience engineering for your software supply chain."
tags:
  - package-managers
  - satire
---

We are excited to announce general availability of Package Chaos Monkey, a new addition to the Resilience Engineering suite designed to help teams build confidence in their software supply chain.

Modern applications rely on hundreds of third-party packages, yet most teams have never validated their systems against the failure modes that occur in production. Package Chaos Monkey addresses this gap by padding left on supply chain resilience, continuously injecting realistic faults into your dependency resolution process, helping you discover weaknesses before they become incidents.

Getting started takes minutes. Simply add our registry proxy to your package manager configuration. Package Chaos Monkey will begin improving your resilience immediately.

### Features

**Registry Propagation Simulation.** Ensures your systems handle the delay between package publication and global CDN availability. When you install a package, there's a small chance we'll return the previous version from one CDN edge while serving the new version from another. Just like in production.

**Yank-in-Flight Testing.** Validates your retry logic by occasionally yanking packages between the metadata fetch and tarball download. Your resolver already fetched the index, committed to a version, and now it's gone. This happens in the wild more often than you'd think.

**Lockfile Integrity Challenges.** Periodically invalidates entries in your lockfile by removing specific versions from our registry mirror. This helps teams discover which of their pinned versions would cause cascading failures if they disappeared, and whether anyone would notice.

**Dependency Oscillation Mode.** Introduces controlled instability in diamond dependency resolution by varying traversal order between runs. If your dependency graph resolves differently depending on which order the resolver visits nodes, you'll want to know that before release day.

**Cache Corruption Scenarios.** Silently alters checksums in your local cache at configurable intervals, helping you verify that your tooling actually validates what it claims to validate. Most don't.

**Concurrent Publish Races.** Simulates the exciting experience of two package versions racing to be published, with different CDN edges observing different outcomes. Your CI server and your laptop might resolve the same manifest differently. Package Chaos Monkey makes this a feature.

**Signature Key Rotation Events.** Randomly rotates signing keys mid-session, verifying that your tooling handles cryptographic transitions gracefully. The package was signed with the old key, but the metadata now expects the new one. We call this "Tuesday at a large registry."

**Transitive Phantom Dependencies.** Occasionally hoists dependencies in ways that make packages work locally but fail when published. If your monorepo's test suite passes because a sibling workspace provides an undeclared dependency, Package Chaos Monkey will help you find out.

**Registry Partition Mode.** Simulates upstream registry outages by returning stale metadata from your proxy while the origin remains unreachable. How stale? You'll find out. Does your tooling know it's working with cached data? Probably not.

**Docker Hub Policy Roulette.** Randomly changes rate limits, authentication requirements, and image retention policies mid-pipeline. We've studied Docker's historical policy announcements and recreated them as a Markov chain. Your CI will never know what to expect, just like the real thing.

**Time Dilation for TOCTOU Testing.** Introduces random delays between dependency resolution phases, maximizing the window for time-of-check to time-of-use discrepancies. Resolve at 10:00, fetch at 10:15. The world has moved on.

**Automated Dependency Reduction.** Our GitHub integration opens pull requests that roll back recent upgrades or remove dependencies entirely, but only when CI continues to pass. This helps teams discover which dependencies their test suites don't actually exercise, and which packages they forgot they were paying for. If the PR merges, you probably didn't need it. If production breaks a week later, now you know your tests need work.

**Weekend Rewrite Simulation.** Occasionally replaces one of your dependencies with a brand new Rust implementation that appeared on Friday afternoon. The API is almost compatible. The maintainer is very excited about it. There are no tests yet but it's blazingly fast.

### Enterprise tier

For teams requiring additional resilience validation, Package Chaos Monkey Enterprise includes:

- **Coordinated Multi-Registry Chaos.** Synchronize failures across npm, PyPI, and RubyGems simultaneously for realistic polyglot incident scenarios.
- **AI-Assisted Fault Selection.** Our models analyze your dependency graph to identify the packages whose failure would cause maximum disruption, then prioritize those for chaos injection. We pay special attention to packages maintained by a single person in Nebraska.
- **Compliance Reporting.** Generate audit logs demonstrating that your systems were tested against supply chain failures, useful for SOC 2 and FedRAMP attestations.
- **SBOM Discrepancy Generator.** Produces SBOMs in SPDX, CycloneDX, and SWID formats that all describe the same build but disagree on package counts, versions, and license classifications. Perfect for testing whether your compliance team actually reads these.
- **Left-Pad Anniversary Mode.** Every March 22nd, we remove a random package from the bottom of your dependency tree. This commemorative feature builds organizational muscle memory.
- **Lottery Factor Testing.** We donate a million dollars to a randomly selected maintainer in your dependency tree and measure how long until their next release. Helps teams identify packages maintained by people who still need the money.
- **Bus Factor Testing.** In partnership with Tesla's new autonomous bus division. Results may vary.
- **Security Fatigue Assessment.** We submit a steady stream of plausible but incorrect vulnerability reports to maintainers in your dependency tree until they disable their HackerOne. Validates whether your supply chain depends on people who still read their security inbox.

### Getting started

Package Chaos Monkey integrates with all major package managers and CI/CD platforms. Point your registry configuration at `chaos.pkg.example`, run your usual install command, and let resilience engineering begin.

Documentation and API references are available at docs.example/chaos. The community tier is free for open source projects.

Build resilient. Build with chaos.

*Package Chaos Monkey is a fictional offering and nothing herein constitutes an offer, solicitation, or invitation to disrupt your supply chain. Any resemblance to actual services, announced, discontinued, or quietly sunsetted, is purely coincidental. Please do not build this. If reading this gave you anxiety, that's the point. The failure modes described are real. See [A Jepsen Test for Package Managers](/2026/01/19/a-jepsen-test-for-package-managers) for the serious version. For more package management think pieces, see [The Lesser Evil of Compliance](/2026/01/20/the-lesser-evil-of-compliance) and [16 Best Practices for Reducing Dependabot Noise](/2026/01/10/16-best-practices-for-reducing-dependabot-noise).*
