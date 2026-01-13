---
layout: post
title: "Docker is the Lockfile for System Packages"
date: 2025-12-18 10:00 +0000
description: "Why Docker filled the reproducibility gap that system package managers left open"
tags:
  - package-managers
  - docker
  - deep-dive
---

Back when I worked in a large office in London, I remember a team pulling their hair out as they moved to the cloud. They were trying to autoscale, spinning up new machines and installing packages on boot. Each instance resolved dependencies against whatever apt's mirrors had at launch time, so they'd debug a problem on one server only to find other servers had slightly different package versions. A security patch landed between instance launches, or a minor release appeared, and suddenly their servers diverged.

Language package managers solved this years ago. Bundler shipped Gemfile.lock in 2010, and the basic promise is simple: commit a lockfile, and any machine running `install` gets the exact same dependency tree. Cargo and nearly every other language ecosystem has something equivalent now.

System package managers never followed. apt and yum still don't have lockfiles. You can pin versions, write `/etc/apt/preferences.d/` files, and use `versionlock` plugins, but there's no single file capturing "this exact set of packages at these exact versions, reproducible across machines and time." You can get determinism through internal mirrors, Debian snapshot, and careful versioning, but that's a significant operational investment. The tools assume you want the latest compatible packages from your distribution's current state, so you get resolution-time nondeterminism rather than a captured artifact you can share.

Docker solved this almost by accident. It was selling developer experience and deployment consistency, not reproducibility. The image-as-artifact emerged from implementation choices like union filesystems and content-addressable storage rather than explicit design goals around determinism.

To be precise: Docker solved deployment determinism, not build determinism. Running `docker build` twice on the same Dockerfile can produce different images due to timestamps, package manager state, and metadata. What Docker guarantees is that once you have an image, every machine running it gets identical bytes. That's a weaker property than a true lockfile, which can be regenerated from its manifest. But it was enough. Teams didn't need to rebuild from scratch on every deploy; they needed the thing they built to behave the same everywhere they ran it.

The Dockerfile isn't quite a lockfile. It's more like a build script. But the resulting image acts like one, capturing the full resolved state of every system package, every library, and every binary in a form you can version, share, and deploy identically everywhere. Docker gave teams something they couldn't get any other way: a lockfile for the operating system layer.

That autoscaling team switched to Docker and their problem disappeared. They built once and every new instance was identical regardless of when it launched. The broader shift was already underway: cloud infrastructure meant treating servers as cattle, not pets. You couldn't hand-tune each machine's package state when you might spin up fifty instances in an hour and tear them down by morning. VM images could do this too, but at much higher cost in size, build time, and tooling. Docker made it cheap enough to be the default.

The reason apt doesn't have a lockfile is that it's designed for systems, not applications. A system needs to be patched in place; an application needs to be immutable. **Docker effectively turned the system into an application**, and with web applications as its primary use case, immutability was exactly what people wanted. Distribution maintainers try to keep things compatible, but "compatible" and "identical" aren't the same thing. When you need identical, the Docker image gives you that.

Docker's approach has real limitations. The Dockerfile tells apt to install packages but doesn't record which versions it got, so rebuilding tomorrow might produce a different image. You can't edit a Docker image after the fact the way you'd edit a lockfile to bump one dependency. Updating one system package invalidates the whole layer and forces reinstallation of everything in that layer. There's a security tension too: freezing system packages means inheriting whatever vulnerabilities existed at build time.

Tools like [apko](https://github.com/chainguard-dev/apko) from Chainguard take this seriously, producing bitwise-reproducible images by design through declarative configs rather than imperative Dockerfiles. Nix and Guix prove that system-level lockfiles are technically possible, with [Nix flakes](https://lwn.net/Articles/962788/) pinning every input to a specific git revision. But Nix didn't win because the learning curve is measured in months rather than hours. Docker asked almost nothing of developers: write a Dockerfile that looks like a shell script, run `docker build`, push the result.

A [recent analysis of lockfile design](https://arxiv.org/html/2505.04834) found that ecosystems where lockfiles generate by default have near-universal adoption, while adoption craters when lockfiles are optional or awkward. System package managers made lockfiles awkward so almost nobody used them, and Docker made reproducible deploys easy so everyone used that instead.

The uapi-group has [proposed](https://github.com/uapi-group/specifications/issues/70) adding lockfile specifications to traditional Linux package managers. The fact that it's still in discussion after two years tells you something about how the ecosystem prioritizes this problem. Docker already papered over it.

Docker is not a lockfile in any formal sense. It's a build system that happens to produce immutable artifacts. But it papered over a gap that system package managers left open for decades, and close enough shipped.
