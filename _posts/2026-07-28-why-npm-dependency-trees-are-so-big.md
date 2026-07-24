---
layout: post
title: "Why npm Dependency Trees Are So Big"
date: 2026-07-28 10:00 +0000
description: "Two versions of lodash walk into a tree"
tags:
  - package-managers
  - npm
  - dependencies
---

Every major release of Rails sets off a wave of releases across the rest of the gem ecosystem. An application that tries to upgrade runs `bundle update rails` and Bundler refuses, because some gem in the tree only allows activesupport up to the previous major. The error names the gem, an issue gets filed on its tracker, and a maintainer who had nothing to do with the Rails release widens a version range and ships. Multiply that across every gem with a Rails constraint and the upgrade arrives as dozens of small releases from maintainers who mostly don't know each other, each responding to errors their own users are hitting.

Bundler refuses because it picks one version of every gem for the entire application. Every constraint in every gem is a claim on that shared choice, and finding a set of versions that satisfies all of them at once is [NP-complete in the general case](/2025/12/05/package-manager-tradeoffs.html). Sometimes no set exists, and Bundler refuses to install, listing the gems whose constraints collided.

That makes every constraint a cost that other people pay: a gem that pins a dependency tightly will block someone's upgrade and get issues filed about it, so gem authors keep dependency lists short and ranges wide. All of it runs through the conflict error, which names the packages whose constraints disagree, so the problem reaches the maintainers who can fix it.

That error has no equivalent in npm, which starts with the runtime. Ruby loads one copy of each gem per process, Python keys imported modules by name, and a JVM classpath resolves each class name once. You can get a second version into any of them if you work at it, but one version per program is the working assumption, so their package managers all resolve each library to a single version, and disagreements have to be settled somewhere.

JavaScript module loading keys on file paths, not package names: two copies of the same package in different `node_modules` directories are just two different files, and Node's [module resolution](https://nodejs.org/api/modules.html#loading-from-node_modules-folders) loads whichever copy sits closest to the code requiring it. A resolver on top of that runtime could still pick one shared version per package and error when constraints can't agree, but when two packages want different versions of a shared dependency, npm gives each its own copy. Ordinary dependency resolution has no conflict error in it at all: whatever constraints the packages in your tree declare, install succeeds.

Which means a constraint in npm costs its author nothing: a library can pin an exact version of everything it uses and no downstream install will ever fail because of it. Your choice of range never collides with anyone else's, so there is no occasion to talk to another maintainer about what you both should support, and no prompt to look at what your tree has accumulated. A dependency on a ten-line package is as free as any other too, which is the condition the micro-package habit needed.

The costs show up elsewhere: npm's dependency network was already [the largest and fastest growing](https://arxiv.org/abs/1710.04936) of the seven ecosystems Decan, Mens and Grosjean measured in 2017, and installing an average npm package means [trusting 79 other packages and 39 maintainers](https://www.usenix.org/conference/usenixsecurity19/presentation/zimmerman). Every duplicated copy gets installed, bundled, and added to the surface you have to audit, so everyone pays a little of it and nothing like the Rails upgrade wave follows.

Two copies of the same package do break things when the package holds module-level state: each copy gets its own singletons, and `instanceof` checks fail when an object from one copy reaches the other. The famous case is React, where [two Reacts in one app](https://react.dev/warnings/invalid-hook-call-warning) break hooks, so a component library has to run against the application's copy.

`peerDependencies` exists for that case: a declaration that this package must share one version with the rest of the tree rather than getting its own. For years npm only warned when peer ranges couldn't agree. When npm 7 started enforcing them, the resulting `ERESOLVE` errors were unpopular enough that npm added [`--legacy-peer-deps`](https://docs.npmjs.com/cli/v11/using-npm/config#legacy-peer-deps), a flag for turning the conflicts back off.

Cargo runs both designs at once, and within a semver-compatible range it behaves like Bundler: every crate that depends on `bitflags` 1.x shares a single version. If the requirements can't unify, say one crate pins `=1.2.3` while another needs a later patch, the [resolver backtracks and errors](https://doc.rust-lang.org/cargo/reference/resolver.html) rather than take two copies.

Incompatible ranges get the npm treatment: 1.x and 2.x of the same crate coexist in one build with no error. And because a caret requirement on a 0.x crate only spans that minor, every 0.x minor is its own compatibility range, which puts a large share of the crate ecosystem on the npm side of the line.

Rust's coordination culture lives on the strict side, where foundational crates sit on the same major for years because a breaking release would split the single version every dependent has to share. serde has been on [1.x since 2017](https://crates.io/crates/serde/versions). When a crate that far down the stack does have to break compatibility, there's the [semver trick](https://github.com/dtolnay/semver-trick), where the outgoing major gets one final release that depends on the new major and re-exports its types, so the resolver treats the two as one while the migration rolls through, a contortion maintainers only accept under real pressure.

On the loose side of the line, a demo web service at Tweede golf came to [141 crates, with base64, socket2, syn and time each present in two incompatible major versions](https://tweedegolf.nl/en/blog/104/dealing-with-dependencies-in-rust/), and Armin Ronacher counts [a basic Rocket web project at 172 crates](https://lucumr.pocoo.org/2025/1/24/build-it-yourself/). Run `cargo tree --duplicates` in any sizeable project: every incompatible version it lists was resolved the way npm resolves everything.

Dependency trees grow to the size their resolver permits: where every package must share one version, constraints put costs on other people, and those costs get maintainers talking to each other. npm settles every disagreement with another copy instead, and each copy makes the tree bigger.
