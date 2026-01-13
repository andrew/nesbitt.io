---
layout: post
title: "Package Manager Glossary"
date: 2026-01-13
description: "A cross-ecosystem glossary of package management terms."
tags:
  - package-managers
---

These are the definitions I use when writing about package management and in my work on [ecosyste.ms](https://ecosyste.ms), [Libraries.io](https://libraries.io), and [git-pkgs](https://git-pkgs.github.io/). The same word often means different things in npm, pip, Cargo, and Bundler, so I've noted where ecosystems diverge. This is a living document; [contributions welcome](https://github.com/andrew/nesbitt.io).

## Ecosystem

A package management system defined by its manifest and archive format. npm, PyPI, Cargo, Maven are ecosystems. Each has its own registry, tooling, conventions, and community.

Ecosystems are defined by their package format more than their language. Python has PyPI and Conda as separate ecosystems with different manifest formats and archives. JavaScript has npm and Deno/JSR diverging. Some ecosystems span languages (Maven serves Java, Kotlin, Scala, Clojure).

## Package

A distributable unit of code with metadata. The metadata typically includes a name, version, dependencies, and whatever else the ecosystem cares about (author, license, entry points, etc.). Packages are what you publish to registries and install into projects. Some people call them modules, libraries, or dependencies, but those words all have other meanings too.

**Ecosystem variations:** Nearly universal, though Ruby uses "gem" and some ecosystems call them "crates" (Rust) or "pods" (CocoaPods). Go is weird here: a "package" is a directory of source files that compile together, while "module" is the distributable unit.

## Version

An identifier for a specific release of a package. Usually follows some versioning scheme, often [semver](https://semver.org/)-ish.

Versions are strings, not numbers. "1.10.0" is greater than "1.9.0" even though 1.10 < 1.9 numerically. This trips up more tooling than you'd expect.

**Ecosystem variations:** Most ecosystems encourage or require [semantic versioning](https://semver.org/) (major.minor.patch), but enforcement varies widely. Elm actually enforces semver by diffing APIs and rejecting publishes that break compatibility without a major bump. Go modules encode the major version in the import path, so v2 of a module is effectively a different package. [CalVer](https://calver.org/) (like Ubuntu's 24.04) and [various other schemes](/2024/06/24/from-zerover-to-semver-a-comprehensive-list-of-versioning-schemes-in-open-source.html) exist too. Pre-release version handling (1.0.0-alpha, 1.0.0-rc.1) is inconsistent across ecosystems.

## Module

A unit of code organization within a language's import/require system. Modules define namespaces and control what's exported.

The confusion: "module" sometimes means the same thing as "package" and sometimes means a subdivision within a package. When someone says "module" without context, you can't know which they mean.

**Ecosystem variations:** In Go, a module is the unit you publish (containing packages). In Python, a module is a single .py file, while packages are directories with __init__.py. In Node, every file is a module, and packages contain modules. JavaScript has "[ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)" vs "[CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules" which is about the import syntax, not the packaging; Node packages can contain both (dual-publishing), which is a major source of current friction. Java added [Project Jigsaw](https://openjdk.org/projects/jigsaw/) modules in Java 9, a layer above packages that controls visibility and dependencies at the JVM level, distinct from Maven artifacts.

## Library

Often shortened to "lib." Code intended to be used by other code rather than run directly. The alternative is an application or CLI tool, which is run directly by users. Both get distributed as packages, and many packages contain both (a library and an executable that uses it).

**Ecosystem variations:** Rust distinguishes library crates from binary crates. npm packages can declare a `main` entry point (library) and `bin` entry points (executables) in the same package. The terminology is mostly consistent across ecosystems, though some people use "library" only for compiled languages.

## Dependency

A package your code needs to function. Dependencies form [directed graphs](https://en.wikipedia.org/wiki/Directed_graph), and that graph is where most package management complexity lives.

**Direct dependencies** (also called top-level, immediate, or explicit dependencies) are packages you explicitly declare in your manifest. These are the ones you chose.

**Transitive dependencies** (also called indirect, nested, deep, or sub-dependencies) are dependencies of your dependencies. These are the ones you inherited, and they often outnumber your direct dependencies by an order of magnitude or more.

**Dev dependencies** (also called development dependencies or, loosely, test dependencies) are only needed during development: test frameworks, linters, build tools. They don't ship to production. The line between runtime and dev is blurrier than it looks; some tools are needed at build time in production CI.

**Peer dependencies** are dependencies your package expects the consuming project to provide. Common for plugins that need to share a single instance of a framework. npm's peer dependency handling has changed multiple times and still confuses people.

**Optional dependencies** (called "extras" in Python, enabled by "features" in Rust) are nice to have but not required. The package should work without them, possibly with reduced functionality. Most package managers handle optional dependencies inconsistently.

**Circular dependencies** (also called cyclic dependencies) occur when A depends on B and B depends on A, either directly or through intermediaries. Most package managers forbid them at the package level because they make resolution and installation order ambiguous. Some allow them at the module level within a package.

**Reverse dependencies** (also called dependents) are packages that depend on yours. Knowing your reverse dependencies helps assess the impact of breaking changes, deprecations, or security fixes. Registries and tools like [deps.dev](https://deps.dev) and [Libraries.io](https://libraries.io) track these.

**Upstream and downstream** describe direction in the dependency graph. Your dependencies are upstream of you; your dependents are downstream. A bug fix flows downstream when you update your package; a breaking change in an upstream dependency forces you to adapt. The terms come from rivers: water flows from upstream to downstream, and so do changes.

**Ecosystem variations:** The terminology is fairly consistent across ecosystems, but the semantics differ in important ways. npm's devDependencies don't get installed when you install a package as a dependency of your project, and Bundler's :development group works similarly. Some ecosystems like Go don't have peer dependencies at all because they handle the problem differently. Maven uses "declared" and "derived" instead of direct and transitive.

## Registry

Also called a package index. A server that hosts packages and provides an API for publishing and downloading them. The canonical source for a package ecosystem, and often a [governance chokepoint](/2025/12/22/package-registries-are-governance-as-a-service.html) for who can publish what.

Some ecosystems call these "repositories" (apt, Maven), but I use "registry" for package hosting and "repository" for git repos to avoid confusion. Forges like GitHub and GitLab host source repositories, and [some registries use git repositories as their index](/2025/12/24/package-managers-keep-using-git-as-a-database.html).

Most ecosystems have a single canonical public registry, but many also support private or alternative registries. Artifactory and Nexus can proxy multiple upstream registries. [Verdaccio](https://verdaccio.org) gives you a private npm registry. Organizations run internal PyPI mirrors.

**Ecosystem variations:** npm, PyPI, RubyGems, crates.io, Maven Central are registries. Homebrew's registry is a git repository (homebrew-core) containing formulae. Go uses the source host directly via proxy.golang.org. Linux distributions (distros) like Debian and Ubuntu maintain their own registries per major version, served via apt from filesystem-based repositories that get mirrored worldwide.

## Mirror

A copy of a registry, maintained for speed, reliability, or policy reasons. Mirrors sync packages from an upstream source and serve them locally.

Organizations run internal mirrors to reduce external network traffic, ensure availability if the upstream goes down, or comply with air-gapped security requirements. Geographic mirrors reduce latency for users far from the primary registry. Some mirrors are official (run by the registry operators), others are third-party.

**Ecosystem variations:** PyPI has an official CDN and many organizations run internal mirrors with tools like devpi or Artifactory. apt and yum ecosystems rely heavily on geographic mirrors. Go's proxy.golang.org acts as both a cache and a transparency log. npm doesn't have official mirrors but [Verdaccio](https://verdaccio.org) and Artifactory can proxy it.

## Forge

A platform that hosts source code repositories. GitHub, GitLab, Bitbucket, SourceForge, Codeberg. Forges provide version control, issue tracking, pull requests, and often CI/CD.

Forges are distinct from registries: the forge hosts your source code, the registry hosts your published packages. But they increasingly overlap. GitHub Packages is a registry. GitLab has a package registry. Go uses the forge URL as the package identifier. Some registries like Homebrew store their index in a git repository on a forge.

**Ecosystem variations:** GitHub dominates, but GitLab is common for self-hosted installations. Codeberg and SourceHut appeal to those avoiding large platforms. Some ecosystems like Go treat the forge as the registry, fetching source directly.

## Maintainer

A person with permission to publish new versions of a package to a registry. Different from a contributor (who commits code to the repository) or an owner (who controls the repository on a forge).

Maintainership is a registry-level concept, not a source-level one. You can be a maintainer on npm without having commit access to the GitHub repo, or vice versa. This separation causes confusion and occasional security issues when maintainer accounts are compromised.

**Ecosystem variations:** npm has owners and maintainers with different permission levels. PyPI has owners and maintainers. RubyGems has owners. crates.io has owners and teams. Some registries support organization accounts; others only have individual maintainers.

## Manifest

Also called a package file, spec file, or by its ecosystem-specific name (package.json, Gemfile, etc.). The file that declares your project's dependencies and metadata. The source of truth for what your project needs.

Every ecosystem has one: package.json, Gemfile, Cargo.toml, pyproject.toml, go.mod. Some ecosystems have competing manifest formats (Python had setup.py, setup.cfg, requirements.txt, and pyproject.toml all doing overlapping things).

**Ecosystem variations:** The format varies (JSON, TOML, YAML, DSL, XML), but the concept is universal. Some manifests include more than dependencies: npm's package.json has scripts, Cargo.toml has feature flags, Gemfile can include git sources. Maven's pom.xml does everything and is XML and nobody is happy about it.

## Lock file

Also written "lockfile" as one word. A file that records the exact versions of every dependency that were resolved, including transitive dependencies. Committing your lock file means everyone gets identical dependencies.

Lock files solve the reproducibility problem: your manifest says "give me version 1.x" and the lock file says "specifically version 1.4.3, with checksum abc123."

**Ecosystem variations:** package-lock.json, yarn.lock, Gemfile.lock, Cargo.lock, poetry.lock, uv.lock, [pylock.toml](https://pip.pypa.io/en/stable/cli/pip_lock/). Go doesn't have a lock file because [Minimal Version Selection](https://research.swtch.com/vgo-mvs) makes go.mod deterministic; go.sum records checksums for verification, not resolution decisions. Maven relies on external tooling.

## Integrity hash

A cryptographic hash of a package's contents, used to verify that what you downloaded matches what was published. If the hash doesn't match, the package was corrupted or tampered with.

Lock files typically include integrity hashes for every resolved dependency. This means you can verify that the exact bytes you're installing are the same bytes everyone else installed, even if you're downloading from a mirror or cache.

**Ecosystem variations:** npm uses SHA-512 hashes in package-lock.json. Go's go.sum records SHA-256 hashes and uses a transparency log (sum.golang.org) to detect tampering. Cargo.lock includes checksums. pip can verify hashes if you specify them, but doesn't require them by default. [Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) uses the same concept for browser scripts.

## Release

A specific published version of a package. "Release" emphasizes the act of publishing, while "version" emphasizes the identifier.

In practice, release and version are used interchangeably. A package "has 47 versions" means the same as "has 47 releases." The distinction matters more for software projects generally than for package management specifically.

**Ecosystem variations:** GitHub has Releases as a distinct feature from git tags, adding release notes and downloadable assets on top of a tag. Some registries distinguish between releases and pre-releases in their APIs and UI. The term is loose enough that context usually clarifies what someone means.

## Deprecation, yanking, and unpublishing

Three different ways to discourage or prevent use of a package version, often conflated.

**Deprecation** marks a version as outdated but leaves it installable. Users see a warning but can still use it. Use this for versions superseded by newer releases or packages replaced by alternatives.

**Yanking** hides a version from new installs but allows existing lock files to continue resolving it. Use this for broken releases that shouldn't be chosen by the resolver but shouldn't break existing builds.

**Unpublishing** (also called deletion) removes a version entirely. Existing lock files break. Most registries restrict this to prevent supply chain attacks where someone republishes a deleted package with malicious code (the left-pad incident).

**Ecosystem variations:** npm allows unpublishing within 72 hours, then only with support intervention. crates.io only allows yanking, never deletion. PyPI allows deletion but warns against it. RubyGems allows yanking. Most registries learned from left-pad that deletion is dangerous.

## Source vs binary

Packages can be distributed as source code or as pre-compiled binaries. Source packages are portable across platforms but require build tools and can be slow to install. Binary packages are fast to install but must be built separately for each platform and architecture.

**Ecosystem variations:** Python distinguishes sdist (source) from wheels (binary), and PyPI serves both. npm and Go are source-only. Debian, RPM, and Homebrew are binary-only. Rust's crates.io is source-only, though [cargo-binstall](https://github.com/cargo-bins/cargo-binstall) can fetch pre-built binaries from elsewhere. The choice affects install speed, portability, and whether users need compilers.

## Artifact

Sometimes called a build artifact or release artifact. A file produced by a build process. In package management, usually the distributable archive (tarball, wheel, jar).

Maven uses "artifact" heavily: an artifact has a groupId, artifactId, and version. Other ecosystems use the term less formally. In CI/CD, "artifact" often means any file produced by a build job.

**Ecosystem variations:** Maven has artifact as a core concept with coordinates (group:artifact:version). npm, pip, and RubyGems don't use "artifact" in their official terminology but developers use it generically. GitHub Actions has artifacts as build outputs. In Rust and Go, the built binary is an artifact, distinct from the crate/module that produces it.

## Namespace

Also called scope in npm. A way of partitioning package names to avoid collisions and indicate ownership. Without namespaces, popular short names get claimed early and squatted.

Namespaces can be organizational (`@babel/core`), hierarchical (`org.apache.commons:commons-lang3`), or URL-based (`github.com/user/repo`). Flat namespaces (RubyGems, PyPI, crates.io) have no built-in ownership signal beyond who registered the name first.

**Ecosystem variations:** npm uses scopes (`@org/package`), Maven uses groupId with reverse domain notation, and Go uses the source URL as the identifier. Python and Ruby have flat namespaces with no ownership partitioning, which is why name squatting and [typosquatting](/2025/12/17/typosquatting-in-package-managers.html) are bigger concerns there. Some registries retroactively added optional namespacing after launching with flat names. Confusingly, Maven uses "scope" for something unrelated: when a dependency is needed (compile, test, runtime, or provided).

## Version constraint

Also called version range, version specifier, or version requirement depending on the ecosystem. A specification of which versions of a dependency are acceptable. The manifest declares constraints; the resolver finds concrete versions that satisfy them.

Common constraint syntaxes: `>=1.0.0` (at least), `^1.0.0` (compatible with), `~1.0.0` (approximately), `1.0.0` (exactly). The caret and tilde mean different things in different ecosystems, which is a constant source of confusion.

**Ecosystem variations:** npm's `^` means "compatible changes" (minor and patch updates for 1.x, patch only for 0.x), and Cargo follows the same semantics. Bundler's `~>` is the pessimistic constraint operator, and the number of version segments matters: `~> 1.0` allows any 1.x, but `~> 1.0.0` only allows 1.0.x. pip uses `>=`, `==`, and `~=` with different meanings than the npm-style operators. Poetry and uv adopted npm's caret convention. The symbols look similar across ecosystems but the semantics diverge in ways that cause real bugs.

## Resolution

Also called dependency resolution or version resolution. The process of turning version constraints into concrete versions. Given a set of dependencies with overlapping constraints, the resolver finds a set of versions that satisfies all of them, or reports that no such set exists.

Resolution is [NP-complete](https://en.wikipedia.org/wiki/NP-completeness) in the general case, meaning the resolver may need to explore an exponential number of version combinations before finding a solution or proving none exists. Different resolvers make different tradeoffs: [SAT solvers](https://en.wikipedia.org/wiki/SAT_solver) can prove unsatisfiability, backtracking is simpler but can be slow, [minimal version selection](https://research.swtch.com/vgo-mvs) is fast but picks old versions.

**Ecosystem variations:** See [Categorizing Package Manager Clients](/2025/12/29/categorizing-package-manager-clients.html) for a breakdown of resolution algorithms. [PubGrub](https://nex3.medium.com/pubgrub-2fb6470504f) (used by pub, Poetry, uv, Bundler) gives better error messages by tracking why versions were excluded. Go's MVS avoids the complexity entirely by always picking the minimum version that satisfies constraints.

## Pinning

Also called version pinning or freezing (from Python's `pip freeze`). Specifying an exact version in the manifest rather than a range. Pinning `requests==2.28.1` in requirements.txt means you'll get that exact version, not whatever the latest 2.x happens to be.

Pinning is different from lock files: pinning happens in the manifest and affects what the resolver can choose; lock files record what the resolver chose. You can pin direct dependencies while letting transitive dependencies float, or pin everything.

**Ecosystem variations:** The term is universal but the practice varies. Some teams pin everything; others pin nothing and rely on lock files. Python's requirements.txt often contains pinned versions because pip historically lacked a lock file. Bundler users typically use ranges in Gemfile and let Gemfile.lock handle pinning.

## Vendoring

Copying dependencies directly into your repository rather than fetching them at install time. The dependencies become part of your source tree.

Vendoring trades disk space and repo size for independence from registries and networks. If npm goes down, vendored projects still build. It's also a supply chain security strategy: vendored dependencies can be audited, scanned, and frozen in ways that dynamically-resolved dependencies can't. Before lock files existed, vendoring was the only way to guarantee reproducible builds. Go made vendoring a first-class feature before modules existed. Rails used to vendor everything in `vendor/plugins`.

**Ecosystem variations:** Go has `go mod vendor` as a built-in command, and vendoring was the standard approach before Go modules existed. Node projects used to commit `node_modules` directly, though this is rare now that lock files exist. Ruby projects sometimes use `vendor/bundle`. The CPAN Security glossary calls bundled dependencies "vendored-in," and you'll also hear people say "checking in dependencies."

## Workspace

A package manager feature that lets multiple packages share a single dependency tree and build process. Workspaces mean you can have `packages/foo` and `packages/bar` in the same repo, each with their own manifest, but sharing a single lock file and node_modules (or equivalent). Changes to shared dependencies update everywhere at once.

Workspaces are commonly used in **monorepos** (also spelled mono-repo): repositories containing multiple projects or packages. But the terms aren't interchangeable. Monorepo describes a repository structure; workspace is a package manager feature. You can have a monorepo without workspaces (just multiple unrelated projects in subdirectories) or workspaces without a monorepo. [Google famously keeps nearly everything in one massive repository](https://research.google/pubs/why-google-stores-billions-of-lines-of-code-in-a-single-repository/). Smaller monorepos might have a frontend and backend together, or a library alongside its documentation.

**Ecosystem variations:** npm, Yarn, and pnpm all have workspaces, and Cargo has had them for years. Go added multi-module workspaces more recently. [Lerna](https://lerna.js.org/) was the original JavaScript monorepo tool, predating native package manager support and still used for publishing workflows. Python's tooling has historically lacked workspace support, though this is changing (as of 2025). Tools like [Nx](https://nx.dev/), [Turborepo](https://turbo.build/), [Bazel](https://bazel.build/), and [Buck](https://buck.build/) add task orchestration and caching on top.

## References

These companion posts cover specific aspects of package management in more detail:

- [What is a Package Manager?](/2025/12/02/what-is-a-package-manager.html) breaks down the many responsibilities modern package managers have accumulated
- [Categorizing Package Manager Clients](/2025/12/29/categorizing-package-manager-clients.html) covers resolution algorithms, lockfile strategies, build hooks, and manifest formats across ecosystems
- [Categorizing Package Registries](/2025/12/29/categorizing-package-registries.html) covers architecture, review models, namespacing, and governance

Other glossaries worth reading:

- [Cargo Glossary](https://doc.rust-lang.org/cargo/appendix/glossary.html) is rigorous about package/crate/module distinctions that confuse even Rust developers
- [Python Packaging Glossary](https://packaging.python.org/glossary) covers sdist, wheel, distribution, project, release in detail
- [CPAN Security Group Glossary](https://security.metacpan.org/docs/glossary) goes deep on dependency subtypes and SBOM terminology
- [Chainguard Security Glossary](https://edu.chainguard.dev/software-security/glossary) covers SBOM, SLSA, and supply chain terms
- [ecosyste.ms Glossary](https://docs.ecosyste.ms/docs/guides/glossary/) covers terms used across the ecosyste.ms APIs

---

Missing something? [Send a pull request](https://github.com/andrew/nesbitt.io) or [open an issue](https://github.com/andrew/nesbitt.io/issues).
