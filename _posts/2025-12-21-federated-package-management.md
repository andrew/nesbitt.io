---
layout: post
title: "Federated Package Management and the Zooko Triangle"
date: 2025-12-21 10:00 +0000
description: "The trade-offs that make decentralized package management impractical"
tags:
  - package-managers
---

Every time a major package registry has a crisis, someone suggests federation. When npm was acquired by Microsoft, or when PyPI had that outage, or when RubyGems moderation decisions upset people, the same proposal surfaces: what if we had a decentralized registry, like Mastodon but for packages? No single point of failure, no corporate capture, no governance bottlenecks. Just a federated network of registries that can mirror packages, share metadata, and let developers publish wherever they want.

I find the appeal real, having spent years on Mastodon and worked with Protocol Labs on putting package managers on IPFS, but I've never been able to make federation work for package management without running into the same fundamental constraint. The problem is [Zooko's triangle](https://en.wikipedia.org/wiki/Zooko%27s_triangle). In 2001, Zooko Wilcox-O'Hearn observed that naming systems could have at most two of three properties:

- **Human-meaningful**: short, memorable names like `express` or `rails`
- **Decentralized**: no central authority controls who gets what name
- **Secure**: when you ask for `express`, you get the real one, not a malicious package that happens to share the name

You can pick any two, but not all three. For package management, human-meaningful names are table stakes. Package names, namespaces, even version numbers are all human-readable identifiers that developers type, read, and reason about. Version numbers are especially constrained: semver encodes meaning in the structure itself. It's a convention, not an enforced rule, but developers rely on it anyway. They need to see "2.0.0" to know it's a breaking change, "1.1.0" for a new feature, "1.0.1" for a patch. You can't replace versions with hashes or DIDs and still reason about upgrade safety. So the real choice is between decentralized and secure.

Central registries like npm and RubyGems choose secure. A single authority controls the namespace, which means you can trust that `express` resolves to the same thing everywhere. The cost is that authority itself: someone has to run it, govern it, make decisions about name disputes.

A federated registry tries to add decentralization while keeping human-meaningful names, and this is where security falls apart. If anyone can run a node that serves packages, and packages are identified by short names, then `express` on one node might be completely different from `express` on another. This isn't a theoretical concern. [Dependency confusion attacks](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610) already exploit gaps between public and private registries, and [the attack surface is growing](/2025/12/10/slopsquatting-meets-dependency-confusion.html). A federated network multiplies these gaps.

Choosing decentralized over secure doesn't eliminate the security work. It shifts the burden to every individual user. Without a trusted authority vouching for package identity, every developer would need to audit every package, every update, and every transitive dependency themselves. The central registry's curation and moderation work gets replicated thousands of times over, poorly, by people who don't have time to do it. And it's not a one-time decision. Registries can disappear, domains can expire, nodes can be taken over. Staying safe in a federated system requires ongoing vigilance about sources you trusted yesterday.

When you run `npm install express`, a central registry gives you one answer. A federated network has to choose between nodes, and that choice is where attacks happen. A malicious node can serve a compromised package under a popular name. A legitimate node can be compromised and start serving malware. Nodes can disagree about which package owns a name after a dispute. Your CI server might resolve from a different node than your laptop, giving you different code. The federation has no authority to say which `express` is canonical, because rejecting central authority was the whole point.

The obvious fix is scoped names: `express@registry-a.example` instead of just `express`. But this trades one problem for another. Now you need to trust that `registry-a.example` is legitimate, which means trusting whoever controls that domain or namespace. You've moved the authority question from "who runs the registry" to "who controls the namespace," but you haven't eliminated it. And you've changed what names mean: developers now select authority, not functionality. Instead of asking for Express, they're asking for Express-from-this-particular-source.

The practical end state of ActivityPub-style federation would be everyone running their own registry instance and mirroring the packages they depend on into their own namespace. This is just Artifactory everywhere. Organizations already do this for availability and security scanning, and it's a legitimate resilience strategy: canonical upstream, organizational policy mirror, local cache. But it's not the federation people are asking for. You still need a canonical source to mirror from, or you're back to the "which `express` is real" problem. And the trust requirement is subtle: it's not just that a package exists, but that every version matches upstream exactly. A mirror with missing versions could force downgrades to vulnerable releases. A mirror with extra versions could serve compromised code that upstream never published. Version-level integrity matters as much as package-level identity.

## Go's experiment with DNS

Go modules tried a different approach: use the web as the namespace. Package names are URLs. `github.com/gin-gonic/gin` derives its identity from domain ownership. No central registry needs to exist because DNS already exists.

But DNS isn't decentralized either. It's hierarchical authority delegated through ICANN. Go didn't escape centralization; it delegated naming to a different central authority.

This works, sort of. The namespace is decentralized in that Go's maintainers don't decide who gets what name. It's human-meaningful enough that names are readable, though verbose. And it's secure in that domain ownership provides authentication.

In practice, Go module resolution relies on proxy.golang.org, a Google-run service that caches module sources. And sum.golang.org maintains a transparency log of module checksums. These services exist because relying on domains alone would require ongoing vigilance that developers can't provide.

Domain ownership changes, organizations rebrand, hosting providers go away. A URL that pointed to a legitimate package in 2019 might point to malware in 2025. Without the proxy and checksum database, every Go developer would need to continuously monitor whether the domains they depend on still point to legitimate code.

The transparency log and proxy aren't incidental additions. They're where the actual security lives. DNS provides naming, but sum.golang.org provides immutability: once a module version is recorded, its hash can't change without detection. That's the security property that matters, and it requires central infrastructure to enforce. Go used DNS as a bootstrap for naming, then built centralized systems for the properties DNS couldn't provide. Even a system designed without a central registry ended up needing central infrastructure.

## FAIR and the WordPress exodus

The [FAIR project](https://fair.pm/) is the most recent attempt at federated package management, born from the 2024 conflict between Automattic and WP Engine that left WordPress users wondering what happens when access to the central plugin repository becomes a governance weapon.

FAIR chose the cryptographic identity path. Packages are identified by [DIDs](https://www.w3.org/TR/did-1.1/) (Decentralized Identifiers), strings like `did:plc:deoui6ztyx6paqajconl67rz`. This is secure and decentralized: no central authority assigns identifiers, and cryptographic signatures verify authenticity.

But nobody wants to install plugins by DID. Users want to search for "Yoast SEO" and click install. So FAIR built [AspireCloud](https://aspirepress.org/), an aggregator that indexes packages from multiple sources and maps human-readable names to DIDs. They borrowed Bluesky's "labeler" concept for trust: services that vouch for packages, which users can choose to trust or ignore.

FAIR is a useful case study in the triangle's trade-offs. It does improve resilience against some governance failures; if WordPress.org locks you out, you have options. But to make a decentralized identity system usable, they had to reintroduce hubs of trust. AspireCloud is central infrastructure for discovery. Whoever runs the aggregator controls which DID gets associated with "Yoast SEO". If multiple aggregators exist with different mappings, you have dependency confusion: your site installs a different package than you intended because your aggregator mapped the name differently.

The labeler system has the same constraint. Trust has to come from somewhere. FAIR lets you choose your trust sources, but you're still trusting someone. The governance decisions don't disappear; they're distributed across aggregators and labelers instead of concentrated in WordPress.org. This isn't a failure of FAIR's design, it's an illustration of what the triangle forces you to accept.

There's also the infrastructure dependency. FAIR uses `did:plc`, the same DID method as Bluesky, which resolves through [plc.directory](https://web.plc.directory/). Even with plans to spin this into an [independent organization](https://docs.bsky.app/blog/plc-directory-org), it's still a centralized global directory that all DID resolution depends on. FAIR's "decentralized" architecture requires: plc.directory for identity resolution, AspireCloud for discovery, and labelers for trust.

[Early analysis](https://kaspars.net/blog/notes-fair-package-manager) also notes that the signature verification isn't fully implemented. The protocol requires verifying the entire chain of signed operations back to a DID's genesis, which demands heavy cryptographic operations that shared hosting environments may not support.

FAIR chose secure and decentralized, accepting the cost of giving up simple human names. Then, to make it usable, they rebuilt central infrastructure for discovery and trust.

## Why human-meaningful names can't be optional

Human-readable names aren't just a convenience at install time. They're load-bearing in the code itself.

Your code says `require 'express'` or `import "github.com/gin-gonic/gin"`. Those strings are baked into source files across millions of projects. Even Go, with its URL-based naming, creates folder hierarchies that embed the domain. And apart from Go, those require statements contain no information about which registry they came from. `require 'express'` assumes a single global namespace. The package manager stores registry context in manifests and lockfiles, but the code itself knows nothing about it.

This is why content-addressed systems like Nix and IPFS don't escape the triangle either. It helps to separate two problems: identity and discovery. Identity asks "is this code exactly what the author published?" Discovery asks "give me the code for React." Content-addressing solves identity perfectly. Once you have a hash, you can verify you got the right bytes from anywhere in the network. But discovery still requires mapping "React 18.2.0" to a hash, and that mapping requires a namespace. You can decentralize the storage while the phonebook remains centralized, and for package managers the phonebook is most of what the registry does.

Bitcoin has the same problem. You can't send coins to "Alice", you send to a cryptographic address. Human-readable names require someone to map them to addresses, which is why ENS exists for Ethereum and why disputes about ENS names end up in centralized governance.

## Federation doesn't solve governance

The Mastodon/Bluesky comparison is misleading for package management. Social media is a local discovery problem: I don't care if two people are named @bob on different servers. Package management is a global namespace problem: I care very much if two packages are named `express`. In social federation, names are handles for discovery; in package management, names are pointers for execution. We can tolerate two Alices in a timeline, but we cannot tolerate two Reacts in a dependency tree.

Social media federation works because ambiguity is a feature. If I'm `@user@mastodon.social` and the server goes rogue, I can move to another server and rebuild my identity. My followers might not follow, but the stakes are social, not technical. Human context resolves the ambiguity.

Package identity is different. If `express@registry-a.example` is a different package from `express@registry-b.example`, then your build might work or fail depending on which registry you resolve from. If a package moves between registries, all downstream lockfiles break. Package identity needs to be stable across time and across infrastructure changes.

Federation also doesn't solve governance. Mastodon instances have moderators who make decisions about acceptable content. A federated package registry would have node operators making decisions about acceptable packages. The decisions don't go away; they multiply across nodes and become inconsistent with each other.

## Why central registries persist

Central registries persist because they provide something federation can't: a single source of truth for names. When there's one canonical npmjs.com, then `express` means one thing. Disputes get resolved by a single authority. Developers can trust that `npm install` means the same thing in CI as it does locally.

The costs are real: single points of failure, corporate capture, governance concentration. But federation trades these for different problems: inconsistent resolution, name collision, broken builds when nodes disagree.

Mirroring registries for availability makes sense. Running private registries for internal packages is common. But these are supplements to a canonical source, not replacements for it.

The deeper constraint isn't what developers type at the command line. It's that every package.json, Gemfile, and requirements.txt contains bare dependency names with no registry information. When a package declares `"express": "^4.0.0"`, it assumes that name resolves to exactly one thing. Millions of packages embed this assumption in their manifests. Federation would require either adding registry URLs to every dependency declaration across the entire ecosystem, or accepting that the same manifest might install different code depending on which nodes you resolve from. Neither is acceptable.

That's what Zooko's triangle looks like in practice. Someone has to effectively own the namespace, and that ownership is the thing federation claims to eliminate. The question isn't whether to have central registries, but how to make them more transparent, more accountable, and harder to capture. Package managers involve [dozens of design trade-offs](/2025/12/05/package-manager-tradeoffs.html), and this is one where the constraints leave less room than people hope.
