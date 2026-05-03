---
layout: post
title: "What does Open Source mean?"
description: "A stack of incompatible expectations."
date: 2026-04-04 10:00:00 +0000
tags:
  - open-source
  - reference
---

Every few months someone declares that "X will kill open source" or that "open source is not sustainable" or that "open source won", and every time the responses split into factions that seem to be having completely different conversations. People have been [pointing](https://writing.kemitchell.com/2016/05/13/What-Open-Source-Means.html) [this](https://speaking.unlockopen.com/s7Me0Q/what-is-open-source) out for at least a decade. Replacement terms like "post-open source" never stuck, because the problem isn't the label. The phrase "open source" carries so many meanings that people routinely talk past each other while using the exact same words, each person confident the other is being obtuse when really they're just working from a different definition.

**A licensing regime.** Software distributed under a license meeting the [Open Source Definition](https://opensource.org/osd): free redistribution, source availability, derived works permitted. The OSI maintains this formal definition, and for a certain kind of conversation it's the only one that counts.

**A development methodology.** [The Cathedral and the Bazaar](http://www.catb.org/~esr/writings/cathedral-bazaar/) thesis, "given enough eyeballs, all bugs are shallow", the idea that developing in the open with public revision history and review produces better software. You can have this without the licensing (source-available projects with public repos) and the licensing without this (code-dump releases with no public development process at all). The two definitions are doing different work.

**A business model.** Open core, dual licensing, managed hosting, support contracts, consulting, and the dozen other ways companies try to capture value from code they give away. At the strategic end, this includes open sourcing something specifically to [commoditise a competitor's differentiator](https://www.gwern.net/Complement), the way Android commoditised mobile operating systems and Kubernetes commoditised container orchestration. These models sit in permanent tension with most other definitions on this list. Open source business arguments tend to go in circles because everyone is talking about different things.

**A supply chain.** The set of packages in your dependency tree, the SBOM, the compliance checklist, a procurement category where the vendor has unusual contractual terms (namely, none). Governments have started treating it the same way, funding programs like Alpha-Omega and the Sovereign Tech Fund because software supply chain security is now a national security concern. The people producing the software are, as they will [remind you](https://www.softwaremaxims.com/blog/not-a-supplier), not your supplier.

**A commons.** What Nadia Eghbal called "[roads and bridges](https://www.fordfoundation.org/work/learning/research-reports/roads-and-bridges-the-unseen-labor-behind-our-digital-infrastructure/)." Shared infrastructure that everyone depends on but nobody owns. Making the commons visible enough that people might actually help maintain it remains the unsolved problem.

**A political movement.** Free Software's sibling, or depending on who you ask, its corporate-friendly dilution. User freedom, transparency, power dynamics, who controls computing. People who hold this definition get frustrated with everyone else on this list for treating those concerns as secondary.

**A marketing label.** "We open sourced it" plays well in a press release. Source-available projects call themselves open source for the brand halo, and companies open source a project, collect the community goodwill, then quietly change the license two years later.

**A social identity.** "I'm an open source developer" describes belonging to a scene with its own conferences, norms, status hierarchies, and cultural touchstones. It exists independently of any particular codebase. The career-oriented version treats GitHub profiles as resumes and open source contributions as proof of competence, which quietly advantages people with free time and disadvantages everyone else.

**A governance model.** Who has commit access and how did they earn it? BDFLs, steering committees, foundations, do-ocracy, rough consensus. When a maintainer disappears or a foundation makes an unpopular decision, this is the definition people are arguing about even if they frame it in licensing or business terms.

**A coordination layer.** Neutral ground where companies that compete in the market collaborate on shared infrastructure none of them can justify building alone. The Linux kernel, Kubernetes, and OpenTelemetry all work this way. The foundation politics that surround them make more sense as multi-party coordination problems than as altruistic code sharing.

**A forkability guarantee.** The credible threat of a fork shapes behaviour even when no fork happens, and it disciplines maintainers, companies, and foundations alike. This is why license changes provoke such intense reactions: [OpenTofu](https://opentofu.org/) exists because HashiCorp broke the forkability guarantee, and MariaDB exists because Oracle made people nervous about it. Forkability is one of the few accountability mechanisms open source actually has.

**An innovation diffusion mechanism.** HTTP servers, container runtimes, programming languages: open source is the way standards actually propagate, how technology becomes infrastructure. Nobody coordinates it because open source code can be adopted without negotiation.

**A moral obligation.** "You should open source that" carries real social pressure, sometimes justified and sometimes not, rooted in the idea that if you built on open source you owe something back. This reciprocity norm causes particular friction when it collides with the business model definition, where the whole point is capturing value.

**A research output.** In academia, open source is the reproducibility layer, software as a scholarly artifact with the [FAIR principles](https://www.go-fair.org/fair-principles/) applied to code. This definition barely overlaps with the business or supply chain readings, which is part of why academic open source and industry open source often feel like they're happening on different planets.

**A free help desk.** People file GitHub issues that are support tickets or feature demands, expecting maintainers to triage, respond, and deliver, and vendor packages into their products expecting indefinite updates without any relationship or contribution flowing back. The issue tracker becomes a customer service portal where the customer paid nothing, and the lockfile becomes an eternal service contract nobody signed. The people holding this definition rarely state it explicitly because they don't think of it as a definition, they just think that's how open source works.

**Free infrastructure.** Package registries, CDNs, CI runners, and mirror networks get treated like tap water. npm, PyPI, RubyGems.org, and crates.io all absorb enormous operational costs and traffic while people build entire businesses on top of them without considering who pays for any of it.

**Vibes.** The code is on GitHub. That's about as far as the thinking goes. Probably the most common usage of the term by volume.

The help desk and free infrastructure framings are entitlement definitions, "open source" meaning "someone else bears the costs so I don't have to." One is about labour, the other about operational infrastructure, and they compound on each other: the person filing a feature request on a registry's GitHub repo is simultaneously demanding free labour and taking the free infrastructure for granted. These cause the most material harm to the people actually doing the work, and the people holding them don't recognise them as definitions at all.

How can the commons also be a supply chain? How can a moral obligation also be a business model? "Open source" is a stack of incompatible expectations. Next time someone says something will kill it, ask them which one. They're probably right about at least one of them.
