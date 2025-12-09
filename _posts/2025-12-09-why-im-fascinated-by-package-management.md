---
layout: post
title: "Why I'm Fascinated by Package Management"
date: 2025-12-09 10:00 +0000
description: "From gaming magazine CDs to dependency graphs"
tags:
  - package-managers
---

Before I had broadband, software updates came on CDs bundled with gaming magazines. Growing up in rural England, I had no idea these CDs even carried patches until I stumbled across one. Finding a new Half-Life patch or Quake map pack felt like discovering treasure. Software could get better after you bought it.

Years later, `gem update` gave me that same feeling. Run a command, gain new capabilities. Newer versions of Rails, Rake, RSpec. Other people were doing the work to improve this software, and I got to benefit just by running a command.

### The lockfile

Then Bundler came along and introduced the lockfile. Before that, deploying Ruby apps was an exercise in hope. You'd specify which gems you needed, but their dependencies could shift between installs. A library you never directly used would release a new version, and suddenly your production server behaved differently from your laptop. Teams would waste hours tracking down bugs that only existed because two machines had slightly different dependency trees. And if you had two versions of a gem installed locally, Ruby would sometimes load the wrong one. Every Ruby developer knew the pain of `You have already activated rack 1.5.2`.

The lockfile fixed this by recording the exact version of every dependency, direct and transitive, in a single file you could commit to version control. The technical problem was harder than it sounds. Bundler had to solve dependency resolution, finding a set of versions that satisfied all constraints across potentially hundreds of packages. That's NP-complete in the general case. But when it worked, you got something unprecedented: deterministic builds. Run `bundle install` on any machine, get the exact same code every time.

This changed how teams collaborated. You could share your entire dependency tree in a single file. New developers could set up in minutes instead of days. Deployments became predictable. The lockfile was such a good idea that [nearly every](/2025/12/06/github-actions-package-manager) language package manager since has copied it.

System package managers like apt and yum never really adopted this pattern. They coordinate releases differently, freezing an entire distribution at a point in time rather than letting each project pin its own dependencies. There's a gap between the application-level world of Bundler and npm and the system-level world of apt and rpm, and interesting things happen at that boundary. Docker became popular partly because it bridged that gap, giving you a reproducible system-level environment the way a lockfile gives you a reproducible application-level one.

I was so taken with the concept that I wrote [Brewdler](https://rubygems.org/gems/brewdler), bringing the same idea to Homebrew. It eventually became homebrew-bundle and is now part of Homebrew itself. That pattern of seeing something work in one ecosystem and wanting to bring it to another has repeated throughout my career.

### Patterns across ecosystems

As I got deeper into this world, the magic became more interesting rather than less. Package managers turn global, uncoordinated effort into something any developer can tap into. Thousands of maintainers work on their own schedules, release when they're ready, and somehow it all composes into working software. Nobody is coordinating this. Nobody could. And yet coordination happens anyway, through shared conventions: how to name things, how to version things, how to declare what you need. These conventions emerged organically and now hold the whole system together.

Semver is the most visible of these conventions. A version number is an extremely low-fidelity signal, [just three numbers](/2024/06/24/from-zerover-to-semver-a-comprehensive-list-of-versioning-schemes-in-open-source), but it compresses enough intent to enable automation. A major version bump says "something might break." A patch says "this is safe to take automatically." It's remarkable that something so coarse works at all, but it does. When a security fix lands in a library you depend on, you can have it in production within hours.

Of course, semver only works if maintainers follow it, and they often don't. Breaking changes slip into minor releases. Patches introduce new bugs. The version number is a promise, but there's no enforcement. What's interesting is that the system mostly works anyway. The failures are frequent enough to cause pain but rare enough that automation remains worthwhile. That tension between what semver promises and what it actually delivers is one of the things I keep coming back to.

Building Libraries.io meant writing integrations for dozens of package managers. I started [a podcast](https://manifest.fm/) about it and ran [a devroom at FOSDEM](https://archive.fosdem.org/2018/schedule/track/package_management/). Each one had its own API, its own metadata format, its own quirks. But after the tenth or twentieth integration, patterns emerged. The same problems kept appearing: how to handle namespaces, what to do when packages get deleted, how to express version constraints, whether to allow build-time code execution. Different ecosystems made [different choices](/2025/12/05/package-manager-tradeoffs), and you could see the consequences play out over years.

Some decisions looked reasonable at the time but aged badly. Allowing arbitrary code at install time enabled powerful native integrations but opened massive security holes. Lenient version constraints kept things working until they didn't. You see RubyGems make a choice, then watch PyPI or npm face the same decision years later and sometimes learn from it, sometimes repeat the mistake.

These defaults shape more than just security. They shape the culture of the ecosystem. npm's ease of publishing led to an explosion of tiny packages, which created the left-pad situation in the first place. Go's decision to pull directly from git repos means the community thinks differently about releases. Cargo's strict semver enforcement creates different expectations than PyPI's anything-goes approach. The technical choices become social norms.

The more you look, the more there is. [What even is a package manager?](/2025/12/02/what-is-a-package-manager) It's a client, a resolver, a lockfile format, a registry, a CDN, a publishing platform, a namespace, a search engine, a security scanner, a signing system, an advisory database. Each of these is its own deep topic, touching cryptography, distributed systems, API design, and trust models. Most developers see only the surface.

### The dependency graph

The dependency graph is the other thing that keeps me here. Following the relationships between packages reveals the actual structure of an ecosystem. Not just which libraries exist, but which ones matter, which ones everything depends on.

Millions of developers depending on libraries maintained by a handful of people. A single burned-out maintainer can mass-delete packages and break half the internet, as left-pad showed. A single compromised account can push malicious code to thousands of projects downstream, as event-stream showed. The graph makes this concentration visible.

Libraries like [debug_inspector](/2017/02/24/exploring-unseen-open-source-infrastructure) in Ruby: barely any stars, a handful of contributors, mass depended upon. The graph exposes this kind of hidden infrastructure that stars and forks completely miss.

This graph data looks a lot like the web graph that PageRank was built for. Links between packages encode something similar to links between web pages: a form of implicit endorsement. If a thousand packages depend on a library, that library is probably important even if it has twelve GitHub stars. The graph also reveals clusters and boundaries, where one language ecosystem connects to another, where platform-specific code lives, how different communities solve similar problems.

There's something satisfying about seeing the whole picture. Open source development has no central planning, no coordination meetings, just people building things and publishing them. Package managers and registries are the infrastructure that makes that work.

Most developers use package managers every day without thinking about how they work. Understanding the machinery changes how you see software. You start noticing the tradeoffs, the historical accidents, the places where something could break. You see how your code connects to code written by strangers on the other side of the world, and how their decisions affect you whether you know it or not.

### What I'm building now

There's still a huge amount of low-hanging fruit in this space. The data is there, sitting in registries and lockfiles and git histories, but we're barely using it. That's what I've been building with [ecosyste.ms](https://ecosyste.ms/).

Mining dependencies from Docker images reveals what's actually running in production, not just what's declared in package manifests. [docker.ecosyste.ms](https://docker.ecosyste.ms/) does this across millions of images. Tracking Dependabot activity at [dependabot.ecosyste.ms](https://dependabot.ecosyste.ms/) shows how the ecosystem actually updates, which version bumps get merged and which get ignored. [sponsors.ecosyste.ms](https://sponsors.ecosyste.ms/) exposes the real data behind GitHub Sponsors, making it possible to see where funding is actually flowing.

This kind of cross-ecosystem analysis barely exists elsewhere. The same vulnerability patterns repeat across npm, PyPI, and RubyGems, but each community rediscovers them independently. Lessons from Cargo's success with strict semver enforcement could inform other ecosystems, but there's no systematic way to transfer that knowledge. Even [documenting how package managers actually work](/2025/11/30/documenting-package-manager-data) turns out to be useful, because nobody had done it comprehensively before.

We could be much better at identifying which maintainers need support before they burn out, routing funding to the libraries that actually matter rather than the ones with the most stars, detecting malicious packages faster by looking at behavioral patterns across the graph.

Maintainers themselves are often working in the dark, with almost no visibility into how people actually use their software. Download counts and GitHub stars tell you almost nothing useful. The goal is to connect the data from the dependency graph back to the people who create it, giving them real insight into their users and helping them make better decisions about where to focus their effort.

Small improvements at this layer go a long way. A better default in a package manager affects every project that uses it. Better data about which libraries need help could direct resources where they matter most. There's still so much to figure out. I'm running [another FOSDEM devroom](https://fosdem.org/2026/schedule/track/package-management/) next year to keep the conversation going.
