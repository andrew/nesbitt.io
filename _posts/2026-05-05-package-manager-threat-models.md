---
layout: post
title: "Package Manager Threat Models"
date: 2026-05-05 10:00 +0000
description: "The non-CVE half of package manager security"
tags:
  - package-managers
  - security
---

The [previous post](/2026/05/04/package-manager-cwes.html) catalogued the bugs that get filed against package managers: path traversal in the extractor, argument injection in the git driver, XSS in the registry's README renderer. Things you can find by reading code, point at a line number, and patch.

This post is the other half. The properties below are working as designed, so nobody files a CVE for them. They're also where almost every supply-chain incident with a name actually came from. In [event-stream](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident), [ua-parser-js](https://github.com/advisories/GHSA-pjwm-rvh2-c87w), [left-pad](https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm), and [xz](https://www.openwall.com/lists/oss-security/2024/03/29/4), the package manager did exactly what it was built to do.

If the first post was a list of patterns to grep for, this one is a list of questions to answer in prose. The output of working through it is a few paragraphs per heading describing what the tool actually does, because the answers differ a lot from one tool to the next and most of them aren't written down anywhere except the source.

## Client

### Code execution at install time

The single biggest design decision a package manager makes, and the one most of the incident record hangs off, is whether `install` runs code from the package: on the user's machine, with their privileges, with access to their environment, before they've seen a line of it.

Most language package managers do by default. npm runs `postinstall`, pip runs `setup.py`, Cargo compiles and runs `build.rs`, gem runs native extension builds. The mechanism exists for good reasons (you need to compile the C bits somehow) and it's also the mechanism behind event-stream, ua-parser-js, [node-ipc](https://github.com/advisories/GHSA-97m3-w2cp-4xx6), [colors](https://snyk.io/blog/open-source-npm-packages-colors-faker/), and every install-script worm since.

List which lifecycle hooks exist, which run by default, which run for transitive dependencies as well as direct ones, what user they run as, whether there's a flag to turn them off and whether anything actually works with that flag set. Then the same again for global installs, which on some platforms means root, and for dev and optional dependencies, which some tools install and run hooks for unless told otherwise. Go and Deno are interesting reference points precisely because they answered "nothing runs" and built the rest of the design around that constraint.

### Code execution before install time

The less obvious version of the same question. The user's mental model is usually that `install` is the dangerous command and `lock`, `audit`, `outdated`, and `metadata` are safe. The CVE record from the last post shows where that model is wrong by accident; this section is about where it's wrong by design.

A `setup.py` is a Python program, and for a long time getting the version number out of one meant running it. A `build.gradle` is a Groovy program and resolving the dependency graph means evaluating it. Manifest formats that are data (TOML, JSON, a locked-down YAML subset) draw a hard line here that manifest formats that are programs can't. Work out which commands a cautious user can run on an untrusted checkout; for several tools the honest answer is none of them.

### Lockfile guarantees by design

The previous post covered lockfile bugs: code paths that ignore the lock when they shouldn't. The design question underneath is what the lockfile is even trying to promise.

Lockfiles that pin a content hash (`go.sum`, `package-lock.json`, `Cargo.lock` since 1.0) guarantee the bytes you get are the bytes that were locked. Others pin only a name and version and trust the registry to keep serving the same bytes for that pair (`Gemfile.lock`, classic `yarn.lock`). On top of that, several tools have two install commands, one that respects the lock strictly and one that's allowed to update it; `npm install` versus `npm ci` is the pair most people meet first.

Go's [checksum database](https://go.dev/ref/mod#checksum-database) is the most developed answer here: a public append-only log of every module version's hash that the client verifies against by default, so neither a proxy nor the origin can change what a version resolves to after the fact. It sits outside both client and registry, which is part of why it's interesting.

Record what's pinned, which commands honour it, and whether the CI template uses the strict one.

### Package name identity

The rules for when two package names count as equal vary by registry, and nearly all of them normalise something: case, `-` vs `_` vs `.`, Unicode width. Clients have repeatedly disagreed with their registries about exactly which of those apply, and the space between the two normalisers is where one package can shadow another. Document the client's normalisation rules and confirm they match the registry's exactly, including for names that arrive via a lockfile or a transitive manifest rather than user input.

### Resolution across multiple sources

Most clients can be configured with more than one place to fetch from: a public registry plus a private one, or a primary plus a mirror. The [2021 dependency confusion research](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610) showed what happens when the same name exists in both and the resolver picks by version rather than by source. An attacker registers an internal package name on the public registry with a higher version number and the resolver prefers it. pip's `--extra-index-url` treating all indexes as equivalent is [documented behaviour](https://github.com/pypa/pip/issues/8606), and the CVE filed for it was disputed on exactly those grounds.

Determine what the resolver does when a name is satisfiable from more than one configured source: highest version across all of them, first source that has it, explicit per-dependency pinning, or refuse. Then whether a source added for one dependency is allowed to satisfy others, and whether the lockfile records which source each package actually came from.

## Registry

### Namespace allocation

First-come, first-served is the default for almost every public registry, and it means the security of the name `requests` rests on whoever happened to register it in 2011 still being a good actor in 2026. There's no fix for this that doesn't also destroy what makes open registries useful, but the policies around the edges vary a lot and matter a lot.

Find out whether a name can be transferred, and who decides; what happens to a name when its owner deletes their account; whether a deleted name can be re-registered by someone else, and after how long. That last one is the [revival hijack](https://jfrog.com/blog/revival-hijack-pypi-hijack-technique-exploited-22k-packages-at-risk/) surface, and a registry that allows immediate re-registration of freed names is handing an attacker every package whose maintainer ever rage-quits. Scoped or org-prefixed namespaces (`@scope/pkg`, `group:artifact`) shrink the problem and are worth noting where they exist.

The adjacent surface is [typosquatting](https://incolumitas.com/2016/06/08/typosquatting-package-managers/): names that are different to the registry and the same to a human. It has been demonstrated against every major registry, and the design question is whether publish-time checks do anything about it: similarity scoring against existing names, reserved prefixes, blocking confusable Unicode, or nothing.

### Maintainer lifecycle

The xz incident is the reference case: nothing was hacked, a new maintainer was added through the normal process, and the trust users had placed in the original author transferred silently to someone with different intentions. The package manager can't solve a social-engineering campaign, but it does decide how visible the handover is.

Establish how a maintainer is added to a package (invite, request, automatic via org membership), whether existing users get any signal when the set changes, whether a newly added maintainer can publish immediately or there's a delay, and whether there's any concept of role (publish vs admin vs read). Most registries treat all maintainers as equivalent and notify nobody when one is added; write that down too.

### Immutability of published versions

Once `foo 1.2.3` is published, the bytes should never change. On most modern registries that holds, though the path there went through left-pad and the edges are still worth checking.

Check whether a version can be deleted, and if so whether the name+version becomes available again or is tombstoned; what "yank" means (hidden from resolution but still installable by lockfile, or actually gone); whether there's a window after publish during which a version can be silently replaced; and whether the answers differ between the CDN, the API, and any mirrors. A registry that allows republishing a deleted version is one where a lockfile that pins by version alone guarantees nothing.

### Provenance from source to artifact

For most of the history of package registries there has been no verifiable link between a tarball on the registry and the repository it claims to come from. The `repository` field in the manifest is a string the publisher typed. The 3.0.1 on the registry and the `v3.0.1` tag on GitHub are correlated by convention alone.

This is changing. [Trusted publishing](https://docs.pypi.org/trusted-publishers/) (PyPI, RubyGems, crates.io, npm and others) ties the publish credential to a specific CI workflow, and [provenance attestations](https://docs.npmjs.com/generating-provenance-statements) record which commit and workflow produced the artifact in a way the client can verify. Note whether the registry supports either, whether the client surfaces it, and roughly what fraction of the popular packages actually use it, because an opt-in attestation on three percent of packages is a very different security property from a mandatory one.

### The minimum viable publish credential

The publish token is the thing attackers exfiltrate from CI logs, phish from maintainers, and find in old commits, so its shape matters more than almost anything else on the registry side. The previous post covered tokens whose scope enforcement is buggy; here it's what scopes exist in the first place.

Map out the dimensions: scope (one package, or everything the owner can publish), capability (publish-only, or also add maintainers and change settings), expiry (mandatory, optional, none), and whether the 2FA-on-publish requirement comes with an automation-token bypass and how narrow that bypass can be made. On a registry where the only credential is a session-equivalent API key with no expiry, one leaked CI variable is the whole account, forever. On one with short-lived OIDC-exchanged tokens scoped to one package, it's a single bad release.

### Blast radius and detection

The last question is what happens after a compromise rather than before. If a maintainer account publishes a malicious version, how far does it spread before anyone can plausibly notice, and what does the registry give incident responders to work with?

Look for anomaly detection on publish (new maintainer, long-dormant package, version published from a new country); a way to mark a published version as malicious so that clients refuse it rather than just hiding it from resolution; an audit log of who published what from where; and a way for the registry to tell downstream users they've installed something that's since been pulled. None of this prevents the compromise, but the difference between "pulled in twenty minutes with a list of affected installs" and "noticed by a third party after three weeks" is mostly down to whether these exist.

## The tool's own supply chain

Both halves apply recursively. The client is software with dependencies, usually from the ecosystem it serves: npm is an npm package, Bundler is a gem, Cargo is built with Cargo. The registry is an application with a manifest that often resolves against itself: rubygems.org has a Gemfile, crates.io has a `Cargo.toml`. A compromised package in either tree is code execution inside the thing the rest of the ecosystem has to trust.

So the questions above apply to the tool's own manifests. How the client's and registry's dependencies are handled: vendored into the source tree, pinned by content hash in a committed lockfile, or resolved at build time from the live registry. pip [vendors everything](https://pip.pypa.io/en/stable/development/vendoring-policy/) under `pip._vendor` to break the loop on the client side. On the registry side the sharper version is whether anything in the deploy's dependency tree runs install-time hooks, because that's where a dependency becomes code on the box that holds everyone's publish credentials.

---

A project that answers all of these in writing has something close to a published threat model. A few already do: npm's [threats and mitigations](https://docs.npmjs.com/threats-and-mitigations) page covers most of this list from the maintainer's side. The CVE catalogue in the previous post will keep growing as bugs are found and fixed. This list mostly won't, which is the argument for writing the answers down somewhere users can read them instead of leaving them implicit in the source.
