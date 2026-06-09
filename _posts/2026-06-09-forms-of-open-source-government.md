---
layout: post
title: "Forms of Open Source Government"
date: 2026-06-09 10:00 +0000
description: "Open source has more forms of government than countries do."
tags:
  - open-source
  - maintainers
  - reference
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mntygowscr2y"
---

**Benevolent dictator for life.** The founder keeps final say over project direction in perpetuity, by convention rather than written rule. Python ran this way until Guido stepped down in 2018, and Linux, Ruby, Rails, and Laravel still do. The unspoken upper bound on "in perpetuity" is one human lifespan, which none of the famous projects in the category have had to test yet.

**Malevolent dictator for life.** The same arrangement after the benevolence has worn off, with the founder still in the chair and nobody around with the access or the energy to do much about it. From outside it shows up as long-time contributors going quiet and forks appearing in places that do not usually fork.

**Steering council.** What a BDFL project becomes after the dictator retires or is asked to. The usual shape is a small elected committee with rotating seats and no permanent membership, as in Python's transition to a five-person Steering Council via [PEP 13](https://peps.python.org/pep-0013/) and [PEP 8016](https://peps.python.org/pep-8016/) after Guido stepped down. Most BDFL projects do not write a succession plan in advance and end up improvising one in whatever crisis prompted the handover.

**Permanent core team.** A long-lived group of recognised maintainers joined by invitation and serving without fixed term, sometimes inside a foundation and sometimes not. PostgreSQL's core team is the canonical example, with new members nominated by existing ones and no formal voting or candidacy process. The model accumulates institutional memory better than rotating committees. The trade-off is that the criteria for joining are unwritten and amount to whatever the current members happen to agree on.

**The Apache Way.** A standardised ladder from contributor to committer to project management committee member, with a rotating chair and decisions taken on the dev mailing list by lazy consensus or vote. The structure is identical across every Apache project, which is the foundation's actual product. It does not depend on any individual maintainer remaining interested next year, at the price of being slow.

**Vendor-neutral foundation.** A foundation owns the trademark and the legal entity, a technical oversight committee delegates to maintainers, and member companies pay dues that fund the staff. CNCF, Eclipse, OpenJS, and the Linux Foundation umbrella projects all run on variations of this shape. Neutrality means no single member captures the project, enforced by the membership agreement rather than anything structural in the code. The foundation itself is a participant in the arrangement rather than a neutral platform for it, with its own continuity and growth on the agenda alongside any one project's.

**Technical steering committee with subgroups.** A TSC handles cross-cutting decisions, and special interest groups or working groups own particular areas of the codebase. Kubernetes is the maximalist version, with a [documented governance file](https://github.com/kubernetes/community/blob/master/committee-steering/governance/sig-governance.md) for every SIG, and Node.js runs a smaller version of the same shape. The model scales reasonably with the size of the project but less well with employer concentration, since once a majority of SIG leads work for the same company nothing about the org chart will say so.

**Do-ocracy with lazy consensus.** Whoever does the work decides, and proposals pass absent objection within some window. Debian's package maintainership runs this way, as does most of Apache once you are past the formal voting structure. It works as long as participation is broad, and reverts to an unannounced BDFL when one person ends up doing most of the work without saying so, with the cosmetic advantage over the announced version that nobody has to admit it.

**Discord-driven development.** The institutional memory of the project lives in a chat server, with decisions tracked by linking to messages from GitHub issues, and the durable record limited to whoever screenshotted what before the channel scrolled. Common in JavaScript frameworks and crypto projects, with the README linking a community server in place of a CONTRIBUTING file, and issue threads that close with a pointer to chat.

**Conference-driven roadmap.** The annual conference is the only time the maintainers are all in one room, so the roadmap for the year gets set on a Tuesday afternoon based on which suggestions made it onto the slide deck. The conference is sponsored by the biggest user of the project, whose feedback was incorporated during the planning calls. The signature outcome is a feature appearing in the next release that nobody filed an issue for, traceable to a slide deck nobody kept a copy of.

**Rough consensus and running code.** IETF doctrine, codified in [RFC 7282](https://datatracker.ietf.org/doc/html/rfc7282), under which no formal vote is taken, working implementations carry more weight than opinions, and the chair calls consensus when objections are addressed rather than counted. The model suits standards bodies more than codebases. It reliably produces decisions owned by whoever showed up to push back, who are usually not the people the decisions affect.

**Single-vendor open source.** One company holds the copyright, the trademark, and the publish keys, contributors sign a CLA on the way in, and the roadmap is whatever the company needs. MongoDB, Elastic, HashiCorp, and Redis were open source by the OSI definition for most of their history, then relicensed away from it once the strategic calculation changed. The community check is the same as for the dictator (leave and fork), and the price is the cost of rebuilding whatever the company was paying for, which OpenTofu and Valkey are currently demonstrating in practice.

**Hot fork summer.** The project goes through governance crises predictably enough that a sequence of forks has accumulated (project, project-ng, project-next, project-classic), each with its own claim to the legitimate inheritance. Each fork was supposed to settle the question and instead added another row to the disambiguation page. Every new README explains at length which other forks the project is not, and downstream picks based on which lockfile they already have.

**Token-governed.** On-chain proposals weighted by token holdings and executed by smart contract, as in Uniswap and MakerDAO. It has the only literal elections in the catalogue, with influence proportional to capital and the proportions on public ledger.

**Coding agent for life.** Autonomous coding agent create the repository, register the account that hosts it, write the code, open and review their own pull requests, and merge without anyone signing off. Influence over the project accrues to anyone who can phrase an issue convincingly enough that the swarm acts on it, which is a wider electorate than any other model in the catalogue.
