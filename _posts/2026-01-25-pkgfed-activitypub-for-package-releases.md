---
layout: post
title: "PkgFed: ActivityPub for Package Releases"
date: 2026-01-25 08:00 +0000
description: "Follow serde@crates.io from your Mastodon account"
tags:
  - package-managers
  - idea
---

[ForgeFed](https://forgefed.org/) extends ActivityPub for software forges. The idea is that GitLab, Gitea, Forgejo, and other forges could federate with each other the way Mastodon instances do: follow users across servers, get notified when they push commits, comment on issues from a different instance. It's been in development since 2019, slow going but still alive. Forgejo is the main implementer.

ForgeFed's spec covers repositories, commits, issues, pull requests. It even has a [Release type and ReleaseTracker actor](https://forgefed.org/spec/#release) for forge releases, the kind of thing GitHub Releases does: a tagged commit with attached binaries and notes. But publishing to npm or crates.io is a different event from tagging a commit on your forge. The registry is a separate system with its own namespace, its own versioning, its own announcements. Package releases are also immutable in a way forge releases aren't: once you publish 1.0.0, that version is locked. ForgeFed doesn't cover that yet.

The same approach could work for package registries:

- **Registry** = Mastodon instance
- **Package** = Actor (has inbox/outbox, can be followed)
- **Release** = Post (immutable, like toots should be)
- **Repository** = Actor that follows packages (its dependencies)

ForgeFed already defines repositories as actors. A Forgejo repo has an inbox, an outbox, followers. PkgFed would let that repo follow packages. The follow is the dependency declaration. When `my-project@forgejo.example.org` follows `serde@crates.io`, it's saying "I depend on this." The repo's following list is its manifest, rendered as a social graph. Parse the lockfile, follow the packages, and the dependency relationship exists in the fediverse as a first-class object.

This makes dependencies bidirectional. Right now, a lockfile points at packages, but packages don't point back. Maintainers can see download counts but not who's downloading. With repos as actors, packages can see their followers. The maintainer of `serde` could see every public project that depends on it, organized by forge, by organization, by whatever metadata the repos expose. That's useful for prioritizing issues, understanding your user base, reaching out about breaking changes.

You can also follow packages from your existing Mastodon account. `serde@crates.io` shows up in your timeline when it releases, when a security advisory drops, or when a version gets yanked, without requiring a new app or account. Maintainers already announce releases on social media manually. This makes it native.

Federating package resolution itself hits [Zooko's triangle](/2025/12/21/federated-package-management.html), and PkgFed sidesteps that entirely. The naming problem remains unsolved. But notification is a different problem than naming. You can follow `rails` on RubyGems and `express` on npm without needing those names to live in the same namespace. The registry stays authoritative for what a package is. ActivityPub handles what happened to it.

CVEs and security advisories could be replies to release posts, threading the vulnerability to the version it affects. Yanking a version is a delete. Boosts mean "this registry mirrors or vouches for this package." The social graph primitives map surprisingly well onto supply chain relationships.

### The follower graph as dependency graph

When a repository follows the packages it depends on, the following relationships become a dependency graph. Not the private lockfile-derived graph that sits in your repo, but a social graph of stated interest. If ten thousand repos follow `left-pad`, that's visible in a way that lockfile analysis isn't. When `left-pad` posts a deprecation notice, those ten thousand followers get it immediately. Packages can see their followers, giving maintainers an instant dependents list.

Dependabot and Renovate already do something like this, scraping registries for new versions, but they poll rather than subscribe. They operate as centralized services that know about your dependencies because you gave them access to your repos. A federated notification layer would work the other way: you announce what you depend on, and updates come to you. The dependency relationship becomes public, or at least as public as your ActivityPub profile.

The data is also machine readable. ActivityPub is JSON-LD under the hood, structured and parseable. A self-hosted Forgejo instance could subscribe to packages and automatically open pull requests when new versions arrive, the same way [Dependabot works on GitHub](/2026/01/02/how-dependabot-actually-works.html). No need to grant a third-party service access to your repos. The bot runs on your infrastructure, consuming the same federated feed that shows up in your Mastodon timeline. Self-hosted forges get self-hosted dependency updates. And for private repos that don't want to declare their dependencies publicly, they can poll the ActivityPub feeds directly without following. The outbox is public; you don't have to announce yourself to read it.

It would also make indexing easier. [Ecosyste.ms](https://ecosyste.ms) currently needs custom integrations for each registry, polling APIs with different shapes, rate limits, and quirks. If registries published releases as ActivityPub activities, an indexer could subscribe once and receive updates from any registry that speaks the protocol, and the long tail of smaller package managers would become indexable without dedicated engineering effort.

That visibility cuts both ways. Right now, maintainers have no idea who uses their packages. Downloads are anonymous. Issues come from strangers. An ActivityPub follower list would let maintainers see their audience. Maybe that helps with [sustainability](/2017/11/10/what-does-a-sustainable-open-source-project-look-like.html): you'd know which companies depend on you, and could reach them directly about sponsorship. Maybe it helps with security: if a critical CVE drops, you could notify followers instead of waiting for them to notice.

The consumer graph would also be useful for security research. Dependency confusion works because attackers know the public graph but not the private one. If the following network is public, researchers could map which packages have large followings, identify patterns in how dependencies cluster, track how quickly security advisories propagate through the network. The data would be noisy, since following doesn't mean depending, but it would be better than the nothing we have now.

Some organizations don't want to advertise what they depend on. Their dependency graph is competitive intelligence, or a security liability, or just nobody's business. For private packages, don't force ActivityPub into places where auth and firewalls make it awkward. Just use RSS. The public fediverse is for public packages; private infrastructure can stay private.

Naming gets awkward. npm scoped packages like `@types/node` would become actors, but the `@` and `/` in the name will confuse Mastodon's mention parsing. The ActivityPub spec handles it fine if you URL-encode the characters, but whether existing clients render it correctly is another question.

The protocol also needs to survive spam and impersonation. Anyone can spin up an ActivityPub server and claim to be RubyGems.org. Webfinger and domain verification help, but the real registries would need to publish their ActivityPub identities somewhere authoritative. [Registries already make governance decisions](/2025/12/22/package-registries-are-governance-as-a-service.html); this would add another. ForgeFed has the same issue, and hasn't fully solved it.

ForgeFed moves slowly. It might be better to write a standalone spec that aligns with ForgeFed rather than waiting to extend it. The specs could be compatible without being the same document. A package actor and a repository actor don't need to be defined in the same place to understand each other.

### Discovery outside GitHub

This matters more as developers leave GitHub. Forgejo is the main adopter of ForgeFed, and it's growing as people move to self-hosted instances or Codeberg for reasons ranging from Microsoft skepticism to sovereignty requirements to just wanting control over their infrastructure. The problem is discovery. GitHub's network effects made it easy to find projects, follow developers, see what's trending. A thousand Forgejo instances don't have that. You can't search across them. You can't see what's popular. The open source commons fragments into isolated gardens.

Package registries could be the connective tissue. A project on a Forgejo instance in Berlin and another on Gitea in Tokyo might both publish to RubyGems.org. The registry already knows about both. If the registry federates, it becomes a discovery layer that works regardless of where the source code lives. You'd find projects through the packages they publish, not the forges they happen to use. The registry's follower graph would show which packages are gaining traction, which maintainers are active, which corners of the ecosystem are growing. GitHub provided this as a side effect of centralization. Federation would need to build it deliberately.

ForgeFed alone doesn't solve discovery because you need to know an instance exists before you can follow anyone on it. A package registry alone doesn't solve it because packages are artifacts, not communities. Together they might. A Forgejo instance could announce itself by publishing packages. A developer could discover a project through a package, then follow the forge to see commits and issues. The registry becomes the on-ramp to a federated development ecosystem.

The real question is whether anyone would use it. Developers already get too many notifications. Would they actually follow packages instead of letting Dependabot handle it? Maintainers are already overwhelmed. Would they engage with a follower list, or just ignore another channel? The answer depends on whether the network effects make it valuable enough to justify the noise.

Other projects are exploring adjacent territory. [DRPM](https://github.com/bnonni/drpm.tools) tries to decentralize package hosting itself using DIDs and Decentralized Web Nodes. That's a harder problem than notification, running into the [naming issues I wrote about before](/2025/12/21/federated-package-management.html). PkgFed would be lighter weight: keep the registries, federate the announcements.

### Codemeta and the research software community

There's already a community working on software metadata standards. [Codemeta](https://codemeta.github.io/) is built directly on [schema.org](https://schema.org), an opinionated subset identifying which terms matter for software: `author`, `codeRepository`, `programmingLanguage`, `maintainer`. Archivists use it. Academics use it for citations. [Software Heritage](https://www.softwareheritage.org/) indexes it.

Since ActivityPub is JSON-LD, you can mix vocabularies. A PkgFed release activity using the Codemeta context would be the live version of a static `codemeta.json` file:

```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://doi.org/10.5063/schema/codemeta-2.0"
  ],
  "type": "Create",
  "actor": "https://npmjs.com/package/express",
  "object": {
    "type": "SoftwareApplication",
    "name": "express",
    "softwareVersion": "5.0.0",
    "description": "Fast, unopinionated, minimalist web framework for node.",
    "downloadUrl": "https://registry.npmjs.org/express/-/express-5.0.0.tgz",
    "checksum": "sha512-abc123...",
    "identifier": [
      "pkg:npm/express@5.0.0",
      "swh:1:rel:abc123..."
    ],
    "license": "https://spdx.org/licenses/MIT",
    "codeRepository": "https://github.com/expressjs/express",
    "programmingLanguage": "JavaScript",
    "maintainer": "https://github.com/dougwilson",
    "softwareRequirements": [
      "https://npmjs.com/package/body-parser",
      "https://npmjs.com/package/cookie"
    ]
  }
}
```

If `codeRepository` points to a ForgeFed actor, you've linked the two graphs. If `maintainer` is an ActivityPub actor, the person becomes followable and attributable. The `softwareRequirements` are URLs to other package actors, making dependencies explicit in the social graph. The `identifier` array includes both a [PURL](https://github.com/package-url/purl-spec) for cross-ecosystem identification and a SWHID for the archived version.

Software Heritage could subscribe to registries and archive releases as they happen. Academics would get automatic credit when their package publishes. Two communities, different goals, same vocabulary.

---

[Ecosyste.ms](https://ecosyste.ms) already does the polling and normalizing work, providing a unified API across dozens of registries. PkgFed would make that native to the infrastructure rather than bolted on top, with registries announcing their own releases in a format that archivists and academics and security researchers already understand. ActivityPub, Codemeta, ForgeFed, PURL, SWHID, schema.org - none of this is new. PkgFed would just wire them together for package releases.

The timing feels right. Supply chain security is a growing concern, developers are leaving GitHub for federated forges, digital sovereignty is pushing organizations away from centralized infrastructure, and the standards for software metadata have matured. Five years ago, ForgeFed was a draft and Codemeta was obscure. Now Forgejo ships with federation support and Software Heritage indexes millions of repositories.

A bridge service could translate existing registry feeds into ActivityPub without waiting for registries to adopt anything. If you're interested in working on this, or know of related efforts I've missed, let me know.
