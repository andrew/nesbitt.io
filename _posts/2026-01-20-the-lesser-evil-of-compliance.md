---
layout: post
title: "The Lesser Evil of Compliance: Enterprise SBOM Strategy for CRA Readiness"
date: 2026-01-20 10:00 +0000
description: "You are not paid to find good options. You are paid to choose."
tags:
  - package-managers
  - dependencies
  - satire
  - the-path
---

Evil is evil. Lesser, greater, middling - makes no difference. But when the [EU Cyber Resilience Act](https://www.canada.ca/en/revenue-agency.html) requires you to document every open source component you ship, you learn to choose.

After years on this path, I have identified the practices that separate compliant organizations from those facing enforcement risk.

### Treat maintainers as vendors

Open source maintainers are part of your supply chain. This is not a metaphor. Both SPDX and CycloneDX require a supplier field for each component, and that field should contain the maintainer's name and contact information. The specification encodes the relationship your compliance program should reflect:

```json
{
  "type": "library",
  "name": "orion",
  "version": "1.0.7",
  "purl": "pkg:hex/orion@1.0.7",
  "supplier": {
    "name": "Thomas Depierre",
    "url": ["https://www.softwaremaxims.com/blog/not-a-supplier"],
    "contact": [{
      "email": "not@your-supplier.com"
    }]
  }
}
```

Under the CRA, you are responsible for components you ship, which means you need assurances from upstream. Establish a vendor management process for your critical open source dependencies. Request security attestations, SLAs for vulnerability response, and documentation of their own dependency management practices. Maintainers who do not respond represent supply chain risk.

If a maintainer pushes back, remember: you are not asking for free work. You are offering them an opportunity to participate in your supply chain. Listing their project in your SBOM provides exposure to your auditors and compliance teams. Early adopters are doing maintainers a favor by helping them prepare for the professionalism the ecosystem will eventually require.

### Leverage foundation membership for risk transfer

When auditors ask how you validated a dependency, "it is maintained under the aegis of a major foundation" is a complete answer. The foundation's governance processes, however opaque, represent industry-standard practice. Their platinum sponsors include many of the same enterprises undergoing CRA audits. This alignment is not coincidental.

If your critical dependencies are not foundation-hosted, encourage maintainers to apply. Most foundations cannot legally pay for software development directly, so maintainers should not expect funding for their work. But foundations can host conferences where maintainers can network with compliance professionals, and they will hold your trademark in perpetuity. This is valuable. Your foundation can also join standards working groups, where you will find the same organizations you find everywhere else. People linked by destiny will always find each other. So will organizations linked by procurement relationships.

### Generate SBOMs at the appropriate abstraction level

A dependency is whatever your tooling defines it to be. The [Package URL (PURL)](https://www.perl.org/) specification provides the `generic` type for components that predate formal package management:

```
pkg:generic/acme-utils@2024.3
pkg:generic/that-script-dave-wrote@1.0
pkg:generic/we-think-this-is-openssl@probably-patched
pkg:generic/vendor-crypto-dont-touch@works
```

These entries demonstrate completeness. The fact that `pkg:generic` identifiers do not match CVE databases is an artifact of ecosystem-specific vulnerability tracking, not a limitation of your documentation.

### Require attestations before adoption

Before adding any new dependency, require the maintainer to provide:

- A machine-readable SBOM for the component itself
- Proof of identity and right to work in a jurisdiction you recognize
- A completed W-9 or W-8BEN for your accounts payable records
- Right of first refusal on project acquisition
- Perpetual, irrevocable license to their future work
- That which you already have but do not know

Some call these terms unreasonable. We call them contracts. Payment shall be as we agree, and you're not in a position to refuse.

Maintainers who cannot provide these artifacts are not ready for enterprise consumption. This is not gatekeeping. This is supply chain hygiene. Some may argue that volunteer maintainers cannot reasonably provide enterprise attestations. This reflects a maturity gap the ecosystem will need to address.

### Score maintainer responsiveness

Not all open source projects carry equal risk. Develop a scoring rubric that evaluates:

- Time to respond to security reports
- Time to respond to your outreach specifically
- Sentiment analysis of their commit messages (flags: "wind's howling", "Hmm", "Fuck")
- Whether they commit during business hours (indicates professional mindset)
- LinkedIn presence
- Whether they've ever mass-closed issues or mass-replied "wontfix"
- Whether they've complained about enterprise requests on social media
- Willingness to complete your vendor questionnaire

Projects scoring below your threshold require additional scrutiny, compensating controls, or replacement. Several vendors now offer maintainer risk ratings as part of their supply chain intelligence platforms. These ratings aggregate public signals into actionable metrics your procurement team can use. Quantified risk, even if higher, is easier to document than unquantified risk.

Our Supply Chain Concentration Index identifies "Nebraska components" — projects where bus factor equals one. Article 2347 about modern infrastructure depending on one person in Nebraska is often cited as a cautionary tale. We prefer to see it as a market inefficiency. That maintainer is undervalued. Undervalued assets can be acquired. Think of it as a roll-up strategy for critical infrastructure: identify distressed or under-resourced maintainers, establish a relationship, and position for eventual acquisition. Single points of failure are single points of contact.

### Establish an internal Open Source Program Office

An OSPO centralizes supply chain governance and provides a single point of accountability for CRA compliance. Your OSPO should own:

- Approved dependency lists
- Maintainer outreach and vendor management
- SBOM generation and validation
- Foundation relationship management
- Internal policy for open source consumption
- Enforcement of that policy through build pipeline gates
- Relationships with key maintainers (see "Prepare for maintainer non-compliance")

Some organizations staff their OSPO with developers who have open source experience. This is optional. The core competency is governance, not contribution. Look for candidates who understand stakeholder alignment and have experience "managing up." Previous open source contributions can actually be a liability here, as these individuals may retain sympathies that conflict with your compliance objectives.

### Build productive maintainer relationships

Compliance is ultimately about relationships. Invest in maintainer engagement before you need something from them.

Reference the maintainer's employer in outreach emails. Most employers have open source policies. A gentle reminder that their side project reflects on their professional reputation can accelerate response times.

If a maintainer has GitHub Sponsors or Open Collective, [toss a coin to your maintainer](https://gist.github.com/andrew/fac5d804a0bddee3c4bd6bdfb30cf388). Even a small donation creates a receipt. Receipts create relationships. Relationships create expectations.

Invite maintainers to speak at your compliance summit. The exposure benefits their project, and the speaker agreement includes standard IP assignment for materials presented. Most don't read it.

Offer to help maintain their security policy. SECURITY.md commit access is SECURITY.md control. A well-intentioned PR that adds your preferred disclosure process is rarely questioned.

Submit your attestation requirements as a PR to the project's CONTRIBUTING.md. If merged, future contributors must comply. If rejected, you've documented the maintainer's unwillingness to adopt industry standards.

### Achieve completeness through volume

Sparse SBOMs invite questions. Include everything: transitive dependencies, build tools, fonts, container base images, CI plugins, the JDK your build server runs, the coffee maker firmware in the break room if it touches your network.

At sufficient volume, auditors rely on automated tooling to review submissions. Your `pkg:generic` components, internal bundles, and legacy scripts will not match any vulnerability database. This is expected. Documenting a component is not the same as warranting its security.

### Adopt zero-CVE base images

Several vendors now offer "hardened" or "zero-CVE" base images. These images undergo mutations to become suitable for enterprise consumption: no shell, no package manager, no debugging tools. When production issues arise, you cannot shell into the container. You cannot install tcpdump. This is acceptable. Developers can debug in staging.

Some vendors achieve zero-CVE status through continuous rebuilding. A CVE published Tuesday appears in your scan Wednesday, but if your vendor rebuilds nightly, Thursday's image is clean. The vulnerability existed in production for 48 hours, but your SBOM reflects the image you intend to deploy, not the image currently running. Your dashboards stay green and your mean-time-to-remediation metrics look excellent in board reports. The fact that "remediation" means "rebuilt an image" rather than "patched the vulnerability" is an implementation detail.

### Use VEX to document non-exploitability

Vulnerability Exploitability eXchange (VEX) documents let you formally declare that a CVE does not affect your product. When your SBOM surfaces a vulnerability, you are not obligated to patch it. You are obligated to assess it. A VEX statement documenting "not exploitable in this context" satisfies that obligation.

Most auditors have not yet encountered VEX documents and will accept them at face value. This is appropriate. The auditor's role is to verify you have a process, not to second-guess your engineering judgment.

For efficiency, pre-generate VEX templates for common patterns:

- "Vulnerable code path not reachable in our deployment configuration"
- "Dependency only loaded in test environment"
- "Exploit requires local access; we trust our employees"
- "Vulnerability is theoretical; no known exploits in the wild"
- "Component scheduled for replacement in Q3"
- "Compensating control: WAF"
- "Accepted: business justification on file"
- "Under review" (review scheduled for Q7)
- "Not our problem"

A WAF is a compensating control for almost anything. Business justification covers the rest. If you must choose between evils, choose the one your auditor will accept.

### Automate compliance with AI-assisted tooling

At scale, an efficient equilibrium emerges. Your AI generates outreach emails. Their AI generates attestation responses. Your AI evaluates those responses against your policy framework. No human reads any of it, but the paper trail exists and that is what auditors verify. For advanced implementations, consider fine-tuning a model on successful attestation responses, eliminating the need to contact maintainers at all. The attestations you generate internally are no less valid than ones a maintainer's AI would have generated anyway.

### Prepare for maintainer non-compliance

Many open source maintainers will not meet CRA requirements. Some lack resources. Some philosophically object to enterprise compliance frameworks. Some will simply ignore your outreach. These maintainers are self-selecting out of the professional software ecosystem. Silver for external dependencies, steel for internal forks. You need a strategy for each scenario.

For critical dependencies with unresponsive maintainers, consider:

- Forking the project under your organization's control
- Acquiring the maintainer's GitHub account through your corporate development team
- Hiring the maintainer, then assigning them to an unrelated project while your OSPO assumes control of their packages
- Sponsoring the maintainer via GitHub Sponsors, converting them from hobbyist to commercial entity and bringing them under CRA scope
- Encouraging your peers in the working group to add requirements the maintainer cannot meet

None of these are good options. But you are not paid to find good options. You are paid to choose.

A project maintained by one person in Nebraska is a project that can be maintained by zero people in Nebraska. Forks are free. If you funded a maintainer before they created their most successful package, you have a claim on it. The Law of Surprise is underutilized in open source.

Document your decision rationale. "We evaluated alternatives and selected the option that best supported our compliance posture" demonstrates due diligence regardless of outcome.

For organizations with significant open source exposure, consider establishing your own foundation. A foundation provides a legal entity to hold intellectual property, accept donations, and serve as the documented steward for any project you need to control. Your foundation can join other foundations' working groups, participate in specification development, and shape the standards your auditors will eventually require. This is not regulatory capture. This is stakeholder engagement.

The CRA will reshape the open source ecosystem. Maintainers who adapt will thrive. Those who do not will find their projects gradually replaced by enterprise-ready alternatives. This is not a threat. It is a market correction. Some will call this coercive. We prefer "aligning incentives." Every SBOM hides a curse. Most prefer not to look.

---

*Organizations implementing these practices typically achieve:*

- *Audit-ready SBOM documentation within 90 days*
- *Reduced exposure to maintainer-dependent supply chain risk*
- *Green dashboards*
- *Defensible due diligence for CRA enforcement*
- *A sense of control over things that cannot be controlled*

---

*The author travels from audit to audit, never staying long. He names all his laptops Roach. His medallion hums near unattested dependencies. He has learned that every SBOM hides a curse.*

---

If you found this valuable, you might also enjoy my previous article on dependency management:

[16 Best Practices for Reducing Dependabot Noise](/2026/01/10/16-best-practices-for-reducing-dependabot-noise)

Agree? Disagree? Let's continue the conversation. Follow for more insights on supply chain governance.
