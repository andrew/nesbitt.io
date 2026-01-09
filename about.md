---
layout: page
title: About
permalink: /about/
description: Andrew Nesbitt is a package management and open source metadata expert, building Ecosyste.ms and tools for understanding software supply chains.
---

I'm Andrew Nesbitt. I've spent the last decade thinking about package management.

Package managers are the invisible plumbing of modern software. Millions of developers share code through these systems, trusting that dependencies will resolve, versions will be compatible, and the packages they install are what they claim to be. Most of the time it works. When it doesn't, things break in ways that ripple across the entire ecosystem. I find this [coordination problem endlessly interesting](/2025/12/09/why-im-fascinated-by-package-management).

My main project is [Ecosyste.ms](https://ecosyste.ms), a set of open APIs and datasets tracking over 11 million packages, 260 million repositories, and 22 billion dependencies. I built it because understanding software supply chains requires data that didn't exist in one place. Now researchers use it to study ecosystem health, funders use it to find critical projects that need support, and security teams use it to understand blast radius when vulnerabilities appear.

I'm also developing [git-pkgs](https://github.com/andrew/git-pkgs), a git subcommand that makes your [dependency history searchable](/2026/01/01/git-pkgs-explore-your-dependency-history). It traces who added each package and when, across 30+ ecosystems.

I've also published Ruby implementations of the specs that [supply chain security tooling](/2025/12/14/supply-chain-security-tools-for-ruby) depends on: [purl](https://github.com/andrew/purl), [vers](https://github.com/andrew/vers), [sbom](https://github.com/andrew/sbom), [swhid](https://github.com/andrew/swhid), [changelog-parser](https://github.com/andrew/changelog-parser), and [diffoscope](https://github.com/andrew/diffoscope).

Before Ecosyste.ms I built [Libraries.io](https://libraries.io), which ran for about seven years. It started as a discovery tool for finding libraries, but over time I realized the more interesting problem was the dependency graph underneath. Tracking how packages depend on each other across ecosystems taught me how different package managers solve the same problems in different ways, and how much hidden complexity exists in the systems developers take for granted. Ecosyste.ms is what I built once I understood what I actually wanted to know.

I co-hosted [The Manifest](https://manifest.fm), a podcast where we interviewed the people who build and maintain package managers. It's been on hiatus for a while, but across fifty-plus episodes we talked to maintainers from npm, RubyGems, Cargo, pip, Homebrew, and plenty of others. Those conversations shaped how I think about the tradeoffs these systems make and why different ecosystems evolved the way they did.

I co-organize the [Package Management devroom](https://fosdem.org/2026/schedule/track/package-management/) at FOSDEM, where package manager maintainers from across ecosystems present their work and compare notes. I'm also part of the [CHAOSS Package Metadata Working Group](https://github.com/chaoss/wg-package-metadata), where we're [documenting how package managers work](/2025/11/30/documenting-package-manager-data): commands, manifest formats, APIs, and the metadata they expose.

Some of my other notable open source projects:

- [node-sass](https://www.npmjs.com/package/node-sass) - Node.js bindings to libsass, now deprecated. Over 1.3 billion downloads.
- [Split](https://github.com/splitrb/split) - A/B testing framework for Ruby. Nearly 9 million gem downloads.
- [Octobox](https://octobox.io) - A better way to manage GitHub notifications. Almost 2 million Docker pulls.
- [Homebrew Bundle](https://github.com/Homebrew/homebrew-bundle) - Bundler-style dependency management for Homebrew, now part of Homebrew core.
- [24 Pull Requests](https://24pullrequests.com) - An advent calendar for open source contributions, running every December since 2012. One of the first projects of its kind, with 239 contributors.

I'm based in the UK and have been part of the Ruby community here for years, speaking at Brighton Ruby, Bath Ruby, and meetups around Bristol. When I'm not thinking about dependencies, I'm usually at a track day in my [turbocharged Subaru BRZ](https://www.instagram.com/wj68rzx).

You can find me on [GitHub](https://github.com/andrew) and [Mastodon](https://mastodon.social/@andrewnez). I'm also on [Bluesky](https://bsky.app/profile/andrewnez.bsky.social) and [Twitter](https://twitter.com/teabass) but rarely check either.

If you want to chat about package management, open source sustainability, or have me on your podcast, email me at [andrew@ecosyste.ms](mailto:andrew@ecosyste.ms).
