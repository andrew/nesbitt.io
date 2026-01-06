---
layout: post
title: "Documenting Package Manager Data"
date: 2025-11-30 12:00 +0000
description: "Six repositories documenting how package managers work: commands, manifests, APIs, hooks, and more."
tags:
  - open source
  - package-managers
  - ecosyste.ms
---

*Originally posted on [blog.ecosyste.ms](https://blog.ecosyste.ms/2025/11/17/documenting-package-manager-data.html) on November 17, 2025.*

Package managers are the quiet workhorses of computing. They make installing software on a machine trivial, but they have their differences, and as recent events have shown, those differences can lead to vulnerabilities and provide opportunities for attackers to disrupt public and private services alike.

ecosyste.ms is in something of a unique position: having aggregated and normalized package data from over 70 sources we know something about how package managers work, and how they differ from one another.

Working alongside the [CHAOSS Package Metadata Working Group](https://github.com/chaoss/wg-package-metadata) and [Alpha-Omega](https://alpha-omega.dev) we've documented the similarities and differences across package registries and clients, publishing eight repositories of information about how package managers work today. In doing so we hope to identify common problems and work toward better practices:

## [Package Manager Commands](https://github.com/ecosyste-ms/package-manager-commands)

A cross-reference table of commands across 48 package managers. When you switch from npm to cargo, or pip to poetry, this maps the equivalent commands between ecosystems.

The data is extracted from manpages and `--help` outputs and stored as JSON files in `data/managers/` with generated markdown tables and CSV exports.

Check out the whole csv file rendered as a huge table here: [github.com/ecosyste-ms/package-manager-commands/blob/main/commands.csv](https://github.com/ecosyste-ms/package-manager-commands/blob/main/commands.csv)

## [Package Manager Manifest Examples](https://github.com/ecosyste-ms/package-manager-manifest-examples)

Over 145 manifest and lockfile examples from 34 package ecosystems, organized by PURL type.

Manifests include `package.json`, `requirements.txt`, `pyproject.toml`, `Cargo.toml`, `Gemfile`, `composer.json`, `go.mod`, `pom.xml`, and more. Lockfiles include `package-lock.json`, `yarn.lock`, `poetry.lock`, `Cargo.lock`, `Gemfile.lock`, `composer.lock`, `go.sum`, and others.

Initially extracted from [Bibliothecary](https://github.com/ecosyste-ms/bibliothecary), with additional examples from tools like Trivy, Syft, OSV-Scanner, and Grype. Each example documents its filename, type (manifest/lockfile), source project, and what features it demonstrates.

## [Package Manager OpenAPI Schemas](https://github.com/ecosyste-ms/package-manager-openapi-schemas)

OpenAPI 3.0 specifications for 25+ package registry APIs including npm, PyPI, Maven, RubyGems, Cargo, Docker, and Terraform.

Most schemas are generated using the [packages.ecosyste.ms](https://github.com/ecosyste-ms/packages) mapping code. Two registries, crates.io and open-vsx.org, have official OpenAPI specs. Hopefully more registries will publish official specs in the future.

You can use these specs to generate API clients, create documentation with Swagger UI, or build mock servers for testing.

## [Package Managers OPML](https://github.com/ecosyste-ms/package-managers-opml)

RSS and Atom feeds for tracking releases from package managers, registries, and related infrastructure projects. Import the OPML file into any feed reader to follow updates from npm, pip, cargo, Homebrew, Docker, Renovate, Dependabot, and others.

Feeds are organized by language and ecosystem.

## [Package Manager Hooks](https://github.com/ecosyste-ms/package-manager-hooks)

A reference documenting lifecycle hooks across package manager ecosystems, categorizing them into two types: package-defined hooks (scripts embedded by package authors that execute during installation, building, or publishing) and system/plugin hooks (extension points for users and tools to modify package manager behavior globally).

Covers hooks across npm, Yarn, pnpm, Cargo, pip, Composer, RubyGems, Maven, Gradle, and many others. For each ecosystem, it documents when hooks execute, their implementation mechanisms, and security implications.

## [Package Manager Archives](https://github.com/ecosyste-ms/package-manager-archives)

Documentation of archive formats used by package managers, covering both language-specific ecosystems (gems, wheels, npm tarballs, crates) and system-level formats (deb, rpm, apk).

Each entry documents internal archive structure, compression methods, metadata file locations, implementation quirks, and edge cases that commonly cause problems. Ruby gems use nested gzip compression within tar archives; Python wheels are actually ZIP files with specific metadata requirements; npm packages employ pax extended headers for long filenames.

## [Package Manager Resolvers](https://github.com/ecosyste-ms/package-manager-resolvers)

A reference documenting dependency resolution algorithms across package managers. Covers nine algorithm families: SAT solving (Composer, DNF, Conda), PubGrub (Dart pub, Poetry, uv), backtracking (pip, Cargo), minimal version selection (Go modules), deduplication with nesting (npm, Yarn, pnpm), version mediation (Maven, Gradle, NuGet), Molinillo (Bundler, RubyGems), and others.

Each section explains how the algorithm works, its trade-offs, and why certain package managers chose their approach to solving dependency hell.

## Contributing

These repositories collect what we've learned while researching the space. If you're building parsers, SBOM generators, or tools that work across package ecosystems, these might be useful references.

All eight repositories are released under CC0 1.0 Universal and accept contributions if you have corrections or additions.
