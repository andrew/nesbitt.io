---
layout: post
title: "Package Registries Are Governance Providers"
date: 2025-12-22 10:00 +0000
description: "Registries host files, but they also decide who owns names, how disputes resolve, and what gets removed. That second job is governance."
tags:
  - package-managers
  - deep-dive
---

Package registries are infrastructure. They host files, serve downloads, run APIs. But they're also governance providers, and that second role gets less attention. When a registry decides who owns a disputed package name, whether an unpublished package should be restored, or how to handle a compromised maintainer account, those aren't infrastructure decisions. They're political choices with real consequences. Registries do both jobs at once: the hosting and the ruling.

A registry decides who owns `express` or `urllib3` or `sinatra`, whether scopes exist, and who can claim them. It determines what happens when a maintainer abandons a popular package, how ownership transfers work, whether malware triggers removal, and whether published versions are reversible. These are political choices about rights and responsibilities, not operational concerns.

[Left-pad](https://en.wikipedia.org/wiki/Npm_left-pad_incident) made this visible. When Azer Koçulu unpublished his packages after a naming dispute with Kik, npm's policies about removal and dependency chains became front-page news. The registry's governance had always been there, embedded in terms of service and incident responses. It just hadn't been tested publicly at scale.

Different registries make different choices, and the variation is telling. npm allows scoped namespaces and relatively permissive unpublishing, at least within time windows. Maven Central requires proving ownership of a group ID through domain verification. RubyGems has a flat namespace with name dispute processes handled by humans. These aren't resource constraints or implementation accidents. They reflect philosophical positions about scarcity, squatting, authority, and reversibility.

Some registries have made their governance explicit: crates.io has [Rust RFCs](https://github.com/rust-lang/rfcs) and PyPI has [PEPs](https://peps.python.org/), providing public processes where policy changes are debated before adoption. If registries were pure infrastructure, they would converge on the same policies the way CDNs converge on caching strategies.

System package distributions make governance explicit in a way language registries don't. Debian maintainers patch upstream code, backport security fixes, and sometimes refuse to ship packages at all. Fedora makes licensing decisions that exclude certain software categories. Alpine strips packages down for size constraints. Homebrew's maintainers decide what gets into core versus casks, and they'll reject formulas that don't meet quality bars. These distributions acknowledge their curatorial role.

Language registries do much of the same work, just less visibly. When npm removes a malicious package, when PyPI disables a compromised account, when RubyGems transfers ownership of an abandoned gem, they are exercising the same authority that Debian exercises when it ships a patched OpenSSL. The difference is framing. Distributions present themselves as curators; registries present themselves as platforms. But the governance function is identical.

This matters for how we fund and legitimize these systems. Infrastructure gets treated as a cost center, something to minimize and optimize. Governance requires expertise, accountability, and deliberation. The people making judgment calls about malware reports, naming disputes, and takedown requests are doing governance work. If we treat registries as governance institutions, not just infrastructure, we have to ask a different set of questions. How they're designed, who they're accountable to, and what values they encode.
