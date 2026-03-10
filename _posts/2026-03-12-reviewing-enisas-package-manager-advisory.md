---
layout: post
title: "Reviewing ENISA's Package Manager Advisory"
date: 2026-03-12 10:00:00
description: "Notes on ENISA's Technical Advisory for Secure Use of Package Managers."
tags:
  - package-managers
  - security
  - supply-chain
---

ENISA, the EU's cybersecurity agency, published a [Technical Advisory for Secure Use of Package Managers](https://www.enisa.europa.eu/publications/enisa-technical-advisory-for-secure-use-of-package-managers) in March 2026, a 26-page guide aimed at developers consuming third-party packages. I've been writing about package management since [November 2025](/2025/11/13/package-management-papers) and wanted to see how their recommendations line up with what I've found.

ENISA ran a public feedback call from December 2025 to January 2026 and received fifteen contributions. I was publishing nearly every day on these same topics during that exact window and had no idea the consultation was happening.

Their risk taxonomy splits threats into packages with inherent vulnerabilities (bugs, abandonware) and supply chain attacks (malicious packages, account takeover, typosquatting, dependency confusion), which is the right framing. The section on compromised legitimate packages walks through event-stream, ua-parser-js, and colors/faker with enough detail that a developer unfamiliar with these incidents would understand the attack patterns.

I was pleased to see their discussion of reachability. Most security guidance treats "you have a vulnerable dependency" as binary, but ENISA distinguishes between installed code and reachable code. A vulnerability in a function your application never calls is less urgent than one in your hot path. Teams can waste a lot of time on Dependabot PRs for code that never runs.

They organize advice around a four-stage lifecycle: select, integrate, monitor, mitigate. Each stage gets concrete recommendations and a cheat sheet with actual commands, though the cheat sheets lean heavily on npm, which limits their usefulness outside JavaScript. I've been building a [cross-walk of equivalent commands](https://github.com/ecosyste-ms/package-manager-commands/blob/main/commands.csv) across package managers that could help fill that gap.

### Package selection

ENISA recommends checking "project stars, downloads and commits" when evaluating packages, and I [mostly disagree](/2025/12/15/how-i-assess-open-source-libraries). Stars and forks measure visibility, not quality, and some of the most reliable libraries I use have modest star counts because they're boring infrastructure that just works. The metric I trust most is how many other packages depend on a library, because that's thousands of developers independently deciding it's worth using. ENISA does note that popularity metrics "can be misleading or artificially inflated and should not be relied upon in isolation," but then lists them alongside more meaningful signals as though they're equivalent.

Their typosquatting section covers the basics without going into the [range of generation techniques](/2025/12/17/typosquatting-in-package-managers) that attackers actually use: omission, repetition, transposition, homoglyphs, delimiter confusion, combosquatting. Knowing the techniques matters because it shapes what detection tools need to catch. "Verify package names carefully" is fine advice but reactive. Registry-side detection, defensive squatting, and tools that generate and check typosquat variants are all more scalable responses.

On lockfiles, the advisory recommends using them and committing them to source control, which is correct but undersells the complexity. There's a lot more to say about [lockfile format design](/2026/01/17/lockfile-format-design-and-tradeoffs): merge-friendliness, what metadata to include, schema versioning, how external tooling depends on format stability. Each ecosystem navigates these tradeoffs differently, and many haven't settled on good answers yet.

ENISA recommends SBOMs and mentions Syft and CycloneDX alongside lockfiles, treating them as separate concerns. But lockfiles and SBOMs [record much of the same information](/2025/12/23/could-lockfiles-just-be-sboms), and the conversion between them is a source of friction and data loss that the advisory doesn't acknowledge.

### Gaps

The advisory focuses entirely on language package managers and explicitly excludes operating system package managers, but the most interesting security gaps live at the boundaries between these worlds. System libraries like OpenSSL get pulled in by language packages through native extensions, creating a dependency that no lockfile tracks and no SBOM captures cleanly. I've written about this as [the C-shaped hole in package management](/2026/01/27/the-c-shaped-hole-in-package-management).

GitHub Actions goes unmentioned, despite having a dependency resolver, a namespace, transitive dependencies, and running arbitrary code from third parties. It [lacks lockfiles, integrity verification, and dependency tree visibility](/2025/12/06/github-actions-package-manager), and trusted publishing now means the supply chain security of PyPI, npm, and RubyGems depends on Actions, a system with weaker security guarantees than the registries it publishes to.

Registry architecture barely appears either. ENISA mentions using "official and verifiable package registries" without discussing what makes a registry trustworthy: [governance models](/2025/12/22/package-registries-are-governance-as-a-service), review policies, namespace design, or the [tradeoffs between open publishing and gated review](/2025/12/05/package-manager-tradeoffs). The document treats registries as a given.

The advisory's recommendations all sound straightforward in isolation: use lockfiles, check provenance, scan for vulnerabilities. In practice they interact in complex ways, and organizations struggle to implement even the basics consistently. [Package management is a wicked problem](/2026/01/23/package-management-is-a-wicked-problem), and I don't expect a technical advisory to solve that.

### Vibe coding

Section 5.2 on AI-assisted development flags slopsquatting and the risk that LLM-suggested packages might be malicious or hallucinated. The problem is worse than the advisory suggests: LLMs can leak internal package names from their training data and enable [targeted dependency confusion attacks](/2025/12/10/slopsquatting-meets-dependency-confusion) without the manual reconnaissance that traditionally bottlenecked them.

ENISA notes that reduced developer scrutiny during vibe coding shifts the security burden to monitoring and detection, but their mitigations stay vague. I built [a skill for Claude Code](/2026/01/21/an-ai-skill-for-skeptical-dependency-management) that makes the agent verify packages exist and check their health metrics before suggesting them. Baking security checks into the AI workflow itself, rather than hoping developers remember to do it manually, seems like the more realistic path.

If you've been following this space closely there's little new here. But when someone inside an organization needs to justify spending time on dependency security, "ENISA says so" carries weight that blog posts don't.
