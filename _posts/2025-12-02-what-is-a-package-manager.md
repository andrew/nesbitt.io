---
layout: post
title: "What is a Package Manager?"
date: 2025-12-02 10:00 +0000
description: "What is a package manager? Perhaps quite a few more components than you might think"
tags:
  - package-managers
  - deep-dive
---

When people think of package managers they usually picture installing a library but these days package managers and their associated registries handle dozens of distinct functions.

A package manager is a tool that automates the process of installing, updating, configuring, and removing software packages. In practice, modern language package managers have accumulated responsibilities far beyond this definition.

### The client

**An installer:** downloads a package archive from the registry, extracts it and places it in your language's load path so your code can import it.

**An updater:** checks for newer versions of installed packages, downloads them, and replaces the old versions, either one at a time or everything at once.

**A dependency resolver:** when you install a package, you install its dependencies, and their dependencies, and so on, and the resolver figures out which versions can coexist, which is NP-complete and therefore slow, difficult, and full of trade-offs.

**A local cache:** stores downloaded packages on disk so subsequent installs don't hit the network, enabling offline installs and faster builds while raising questions about cache invalidation when packages change.

**A command runner:** executes a package's CLI tool without permanently installing it by downloading the package, running the command, and cleaning up, which is useful for one-off tasks or trying tools without committing to them.

**A script executor:** runs scripts defined in your manifest file, whether build, test, lint, deploy, or any custom command, providing a standard way to invoke project tasks without knowing the underlying tools.

### Project definition

**A manifest format:** a file that declares your project's dependencies with version constraints, plus metadata like name, version, description, author, license, repository URL, keywords, and entry points, serving as the source of truth for what your project needs.

**A lockfile format:** records the exact versions of every direct and transitive dependency that were resolved, often with checksums to verify integrity, ensuring everyone working on the project gets identical dependencies.

**Dependency types:** distinguishes between runtime dependencies, development dependencies, peer dependencies, and optional dependencies, each with different semantics for when they get installed and who's responsible for providing them.

**Overrides and resolutions:** lets you force specific versions of transitive dependencies when the default resolution doesn't work, useful for patching security issues or working around bugs before upstream fixes them.

**Workspaces:** manages multiple packages in a single repository, sharing dependencies and tooling across a monorepo while still publishing each package independently.

### The registry

**An index:** lists all published versions of a package with release dates and metadata, letting you pick a specific version or see what's available, and is the baseline data most tooling relies on.

**A publishing platform:** packages your code into an archive, uploads it to the registry, and makes it available for anyone to install, handling versioning, metadata validation, and release management.

**A namespace:** every package needs a unique name, and most registries use flat namespaces where names are globally unique and first-come-first-served, making short names scarce and valuable, though some support scoped names for organizations or use reverse domain notation to avoid conflicts.

**A search engine:** the registry website lets you find packages by name, keyword, or category, with results sorted by downloads, recent activity, or relevance, and is often the first place developers go when looking for a library.

**A documentation host:** renders READMEs on package pages, displays changelogs, and sometimes generates API documentation from source code, with some registries hosting full documentation sites separate from the package listing.

**A download counter:** tracks how often each package and version gets downloaded, helping developers gauge popularity, identify abandoned projects, and make decisions about which libraries to trust.

**A dependency graph API:** exposes the full tree of what depends on what, both for individual packages and across the entire registry, which security tools use to trace vulnerability impact and researchers use to study ecosystem structure.

**A CDN:** distributes package downloads across edge servers worldwide, and since a popular registry handles billions of requests per week, caching, geographic distribution, and redundancy matter because outages affect millions of builds.

**A binary host:** stores and serves precompiled binaries for packages that include native code, with different binaries for different operating systems, architectures, and language versions, saving users from compiling C extensions themselves.

**A build farm:** some registries compile packages from source on their own infrastructure, producing binaries that users can trust weren't tampered with on a developer's laptop and ensuring consistent build environments.

**A mirror:** organizations run internal copies of registries for reliability, speed, or compliance, since some companies need packages to come from their own infrastructure, and registries provide protocols and tooling to make this work.

**A deprecation policy:** rules for marking packages as deprecated, transferring ownership of abandoned packages, or removing code entirely, addressing what happens when a maintainer disappears or a package becomes harmful and balancing immutability against the need to fix mistakes.

### Security

**An authentication system:** publishers need accounts to upload packages, so registries handle signup, login, password reset, two-factor authentication, and API tokens with scopes and expiration, since account security directly affects supply chain security.

**An access control system:** registries determine who can publish or modify which packages through maintainer lists, organization teams, and role-based permissions, with some supporting granular controls like publish-only tokens or requiring multiple maintainers to sign off on releases.

**Trusted publishing:** some registries allow CI systems to publish packages using short-lived OIDC tokens instead of long-lived secrets, so you don't have to store credentials in your build environment and compromised tokens expire quickly.

**An audit log:** registries record who published what package, when, from what IP address, and using what credentials, useful for forensics after a compromise or just understanding how a package evolved.

**Integrity verification:** registries provide checksums that detect corrupted or tampered downloads independent of signatures, so even without cryptographic verification you know you got what the registry sent.

**A signing system:** registries support cryptographic signatures that verify who published a package and that it hasn't been tampered with. Build provenance attestations can prove a package was built from specific source code in a specific environment.

**A security advisory database:** registries maintain a catalog of known vulnerabilities mapped to affected package versions, so when a CVE is published they track which packages and version ranges are affected and tools can warn users.

**A vulnerability scanner:** checks your installed dependencies against the advisory database and flags packages with known security issues, often running automatically during install or as a separate audit command.

**A malware scanner:** registries analyze uploaded packages for malicious code before or after they're published, where automated static analysis catches obvious patterns but sophisticated attacks often require human review.

**A typosquatting detector:** registries scan for package names that look like misspellings of popular packages, which attackers register to catch developers who mistype an install command, and try to detect and block them before they cause harm.

**An SBOM generator:** produces software bills of materials listing every component in your dependency tree, used for compliance, auditing, and tracking what's actually running in production.

**A security team:** registries employ people who triage vulnerability reports, investigate suspicious packages, coordinate takedowns, and respond to incidents, because automation helps but humans make the judgment calls.

So what is a package manager? It depends how far you zoom out. At the surface, it's a command that installs libraries. One level down, it's a dependency resolver and a reproducibility tool. Further still, it's a publishing platform, a search engine, a security operation, and part of global infrastructure.

And how does all of this get funded and supported on an ongoing basis? Sponsorship programs, foundation grants, corporate backing, or just volunteer labor - it varies widely and often determines what's possible.
