---
layout: post
title: "Package Management as Org Chart"
date: 2026-07-10 10:00 +0000
description: "Conway's Law applied to dependency management designs."
tags:
  - package-managers
  - dependencies
  - satire
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mqc3k7wsam26"
---

Conway's Law says organisations produce systems that copy their own communication structure. Dependency management tooling is part of the system. A resolution strategy is an opinion about how disagreements get settled; a manifest format records who is allowed to depend on whom.

**Monorepo, single version policy**: every package in the tree must agree on one version of each dependency; upgrading anything means upgrading everyone at once. The org chart has been forbidden from appearing in the code. It works when there's a standing migration workforce whose job is dragging every consumer along.

**Monorepo with workspaces**: one repository, but each package keeps its own manifest and can pin its own versions. One strong platform team, and leadership that believes coordination was solved at the 2019 offsite.

**Git submodules**: a dependency is referenced by exact commit SHA in a separate repository, and updating it is a manual two-step that never gets automated. Two teams agreed to collaborate and recorded, to the commit hash, exactly how little they meant it.

**Bazel**: every dependency edge between targets is declared explicitly in a BUILD file; nothing is ambient or inferred. Adopted when the org grew past the point where anyone knew who depended on whom by asking, so the build system was made to enforce what the humans had lost track of. Typically legible to one person, who came from Google.

**Nix / Guix**: builds are pure functions of their declared inputs; anything not listed in the derivation doesn't exist at build time. "Works on my machine" has been made a structurally impossible sentence, at the cost of most of the hiring pipeline.

**Maven nearest-wins mediation**: when two paths through the tree want different versions of the same artifact, Maven picks whichever is fewer hops from the root, regardless of which is newer or satisfies more constraints. Conflict resolution by proximity to the top, which is also how the org settles most disagreements.

**Artifactory in front of the public registries, private namespace full of forks**: every install goes through a proxy the org controls, and packages that needed patching were forked in rather than contributed back. Trust is granted by a system rather than a person, and the forks date from an argument Legal won that hasn't been reopened since.

**deb/rpm packages for the in-house application**: the app is built into an OS package and installed by the system package manager, and releasing goes through the same gate as a kernel update. Ops won, and has governed since. Releases are events with a runbook and at least one person whose job title contains the word "release".

**Docker**: the application ships with its own copy of the operating system, so the deployment environment is whatever the developer decided at build time. Dev seceded from Ops and took the OS with them, and Ops can no longer reject an artifact that contains everything Ops used to control. The company finds out how many copies of Debian it's running when the next xz happens.

**Terraform modules from a private registry**: infrastructure is packaged as versioned modules that application teams consume like any other dependency. The infra team built an interface so application teams would stop paging them, and now gets paged about the interface.

**[Module federation](https://module-federation.io/)**: separately built and deployed JavaScript bundles negotiate shared dependency versions with each other at runtime, in the browser. Teams report to different VPs who won't share a meeting, so version resolution was deferred to the last possible moment, on the user's machine, because nowhere earlier in the pipeline could agreement be reached.

**peerDependencies**: the package declares a version constraint on a dependency its host must provide, without shipping anything to satisfy it. A framework team issuing policy to application teams: you will be on React 18, we will check, satisfying the constraint is your problem.

**Vendored dependencies**: the source of each dependency is copied into the repository and committed; upstream can change or vanish without effect. An org that was hurt by an upstream once and now takes hostages; the cost is a manual merge that lives permanently in next sprint.

**No lockfile, `latest` everywhere**: each install resolves fresh against the registry, and the dependency set is whatever's newest at that moment. The founder still commits to main, had a bad experience with `npm-shrinkwrap.json` years ago, and won't touch a lockfile.

**semantic-release on every merge**: the version number is computed from [Conventional Commits](https://www.conventionalcommits.org/) prefixes and a release is cut automatically whenever main changes. Publishing became a side effect of the commit prefix, because being the person who cut the release had become a liability.

**Go MVS**: resolves each dependency to the highest version anything in the graph explicitly requires, and no higher; nothing upgrades just because a newer version exists. Designed by someone who looked at SAT-solver resolution and concluded the problem was self-inflicted, and it encodes an org where change only happens when someone puts the requirement in writing.

**Brewfile**: the development environment is declared as a list of Homebrew packages that `brew bundle` installs in order. Onboarding as ritual: the file fails on line 14, and the actual mechanism for getting a working machine is a Slack thread called `#dev-setup-help`.

---

Most dependency strategies are attempts to avoid interpersonal negotiation. The tooling doesn't remove the disagreement, it just picks who loses by default.
