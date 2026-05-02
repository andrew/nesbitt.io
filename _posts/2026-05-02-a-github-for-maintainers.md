---
layout: post
title: "A GitHub for maintainers"
date: 2026-05-02 10:00 +0000
description: "Giving dependencies the same treatment the fork got"
tags:
  - github
  - open-source
  - package-managers
  - forges
---

Mat Duggan wrote up [what he'd want from a GitHub replacement](https://matduggan.com/if-i-could-make-my-own-github/) and it's a reasonable list if you're the one at the keyboard. Stacked PRs, pre-push feedback, offline review, lazy history, graduated approval states. Reading through it I kept noticing that almost every item is a client problem, and the clients are already solving it. Jujutsu does stacked changes better than any web UI is going to. Review is moving into editors. Pre-commit feedback wants to run on your machine, where the files are.

The things I want from a forge are the things that can't move to the client because they involve more than one party. Who depends on you, who you depend on, what happened to that project you forked from three years ago, where the active development moved to when the original went quiet. Almost none of that happens inside a single repository. It happens in the relationships between them, and that's the part GitHub has barely touched in years and the part none of the would-be replacements are talking about either.

So my version of Mat's list is mostly about coordination between projects. The only relationship between two repos that GitHub actually models is the fork, because in 2008 the way you used someone else's code was to fork it and send a pull request. In 2026 the way you use someone else's code is to add a line to a manifest, and the forge has no equivalent object for that. It knows about dependencies only as a thing that generates Dependabot PRs. I'd like them to get the same treatment the fork got.

### Downstream testing

When I'm preparing a release of a library, I want the forge to run my test suite, and then check out a sample of the projects that depend on me and run *their* test suites against my change. Rust calls this a crater run and reserves it for the compiler. It should be a button on every release PR. Right now I find out that I've broken a thousand downstreams via a thousand furious tickets after the tag is pushed, and the forge is the only place with both the dependency graph and the compute to tell me beforehand. The tickets are actually the good outcome, because the worse one is that they pin the old version and never upgrade again.

### A feed for dependents

If I'm planning to remove a deprecated function in the next major version, today I write it in a changelog that nobody reads until they're already broken, or emit a runtime deprecation warning that, as Seth Larson [points out for Python](https://sethmlarson.dev/deprecations-via-warnings-dont-work-for-python-libraries), mostly never reaches a human either. I want to post it into a feed that every project with my package in its lockfile is subscribed to by default. The same channel carries "this project is looking for maintainers" and "we're moving the repo" and "there's a CVE, here's the patched version." GitHub put "social coding" on the homepage in 2008 and then built the social layer around following people. Following the code you actually run, subscribed by lockfile, is the version that would be useful.

### Fork networks

When a project goes quiet the community response is usually that everyone [patches or forks it independently](/2026/05/01/patching-and-forking-in-package-managers.html), one of those forks eventually picks up steam, and a long tail of users slowly discover it through word of mouth and a pinned issue. The forge can see all of this. It knows the upstream hasn't merged in eighteen months and that three forks have active release tags and incoming stars. Put that on the original repo's page instead of leaving every user to do the archaeology themselves, and let the fork's maintainers signal that they consider themselves a continuation. The GitHub network graph has shown the same unreadable spaghetti since 2010 and there's an obvious better version waiting to be built.

### Borrowed from the npmx list

Once a forge takes dependencies seriously it starts to overlap with what a package registry frontend does, and [I wrote up the npmx feature list](/2026/04/16/features-everyone-should-steal-from-npmx.html) a couple of weeks ago as a catalogue of what users build when they get to design that themselves. Several of those belong on a repo page as much as a package page:

- A breakdown of which versions of this project downstream users are actually running, so a maintainer can see how many are stuck three majors behind
- A diff view between any two tagged releases, in the browser
- The resolved dependency tree with outdated and vulnerable nodes flagged, transitives included
- Community-curated "use X instead" pointers when a project is unmaintained, which is the registry-side complement of surfacing active forks

### Safer CI defaults

I've written about this twice already, once on [Actions being a package manager with no lockfile](/2025/12/06/github-actions-package-manager.html) and once on [the run of supply-chain incidents that all trace back to a workflow file](/2026/04/28/github-actions-is-the-weakest-link.html), so I won't repeat it here. The short version is that forge-hosted CI is where most open source artifacts now get built and published, and the defaults were designed for private enterprise repos. Anyone building a new forge gets to pick new defaults: pinned actions, isolated caches, no workflows triggered by strangers at all.

### A package cache in CI

Every CI run on every forge starts by downloading the same set of packages from the same public registries, and those registries are mostly run by non-profits paying the bandwidth bill out of donations. A forge-run caching proxy in front of npm, PyPI, RubyGems, crates.io and the rest, wired into the CI runners by default, would take an enormous amount of load off that infrastructure and keep everyone's builds working when a registry has a bad afternoon. [git-pkgs/proxy](https://github.com/git-pkgs/proxy) is one implementation of the idea. The forge already has the lockfile, so it even knows what to pre-warm.

### Rename "issues"

Nothing to do with the dependency graph, but while I'm making a list: a feature request isn't a problem, a question isn't a problem, and calling everything that arrives in a maintainer's inbox an "issue" sets the temperature of the conversation before anyone's typed a word. I think it contributes more than people realise to the ambient hostility of running a popular project. "Tickets" is boring and neutral and that's the point.

### Out of scope

I haven't mentioned AI, federation, or enterprise permissions. I'm not getting into AI right now. I've [written about federation before](/2025/12/21/federated-package-management.html) and the hard part is naming, which I'm not going to pretend to solve here. And I just don't care about enterprise features. If your favourite topic isn't here it's probably one of those.

---

Maintainers need help finding out who's downstream of them, talking to those people before things break, and working across project boundaries instead of in isolation. That side of the job has got harder every year as dependency trees have got deeper, and it's had almost no new tooling to help. There's no enterprise equivalent of any of this, because an internal codebase doesn't have a thousand unknown downstreams, so the only people who'd benefit are open source maintainers with large public dependent graphs and no budget. Which is probably why GitHub hasn't built it. Anyone building a new forge could start there.
