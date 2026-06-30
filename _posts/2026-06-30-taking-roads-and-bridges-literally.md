---
layout: post
title: "Taking Roads and Bridges literally"
date: 2026-06-30 10:00 +0000
description: "Reflections on UN Open Source Week 2026"
tags:
  - open-source
  - maintainers
  - sustainability
---

I spent last week at [UN Open Source Week](https://www.unopensource.org), where officials from a dozen governments stood up in turn and described open source as critical infrastructure. That framing has been the standard one since Nadia Eghbal's [*Roads and Bridges*](https://www.fordfoundation.org/work/learning/research-reports/roads-and-bridges-the-unseen-labor-behind-our-digital-infrastructure/) report for the Ford Foundation in 2016, and after ten years it has finally reached the audience it describes. Sitting in a UN conference room full of people whose job is public infrastructure, I started wondering what it would mean to stop treating the title as a metaphor and look at how bridges are actually maintained.

*Roads and Bridges* was pitched at the audience that was listening in 2016, technology companies and philanthropic foundations, neither of which maintains bridges: they drive over them for free, pay for them through tax, and leave the upkeep to the state. Spelling out the National Bridge Inspection Standards and the Highway Trust Fund to that room would have meant describing a government programme to a non-government audience, so the report stopped at the analogy and asked the people present to help.

The decade since produced GitHub Sponsors, Open Collective, corporate OSPO budgets, and foundation grants: voluntary contributions from users of the infrastructure. The civil-engineering equivalent is [Adopt-a-Highway](https://en.wikipedia.org/wiki/Adopt-a-Highway), where a local business pays to pick litter from a stretch of road and gets its name on a sign. Adopt-a-Highway is a real programme that does some good, and no state relies on it to keep a bridge from falling into a river.

## The National Bridge Inspection Standards

In the United States, every public-road bridge with a span longer than twenty feet is maintained under a federal regime that has been running since 1971, set up after the [Silver Bridge collapse](https://en.wikipedia.org/wiki/Silver_Bridge) killed 46 people in 1967. The [National Bridge Inspection Standards](https://www.fhwa.dot.gov/bridge/nbis2022.cfm) are codified at [23 CFR 650 Subpart C](https://www.ecfr.gov/current/title-23/chapter-I/subchapter-G/part-650/subpart-C) and they specify, among other things:

- **Mandatory inspection.** Every bridge is inspected on a fixed cycle by a [certified inspector](https://www.fhwa.dot.gov/bridge/nbis/index.cfm), regardless of who owns it or whether the owner consents: 24 months is the default routine interval, with shorter cycles for higher-risk structures and longer risk-based intervals where the data supports it.
- **Component condition ratings.** Each inspection produces a 0–9 rating for the deck, the superstructure, and the substructure. "Poor condition," and the older ["structurally deficient"](https://highways.dot.gov/highway-history/structurally-deficient-bridge-meaning-term) label it replaced in 2018, are defined terms tied to those numbers rather than a judgement call.
- **Load posting.** A bridge that has degraded below its design load is legally [derated](https://www.fhwa.dot.gov/bridge/loadrating/): a sign goes up restricting the weight of vehicles that may cross, so the bridge stays open at reduced capacity instead of being either ignored or closed.
- **An inventory of record.** Every bridge has a structure number in the [National Bridge Inventory](https://www.fhwa.dot.gov/bridge/nbi.cfm), with an owner of record, and the whole dataset is [public and queryable](https://infobridge.fhwa.dot.gov/).
- **Formula funding.** Federal fuel tax flows into the [Highway Trust Fund](https://www.fhwa.dot.gov/highwaytrustfund/) and is allocated to states by formula. The money is recurring and predictable, not at the discretion of whoever happens to be feeling generous this quarter.
- **Post-incident investigation.** After a major collapse the NTSB produces a formal accident report with findings of probable cause and recommendations: [I-35W in Minneapolis](https://www.ntsb.gov/investigations/AccidentReports/Reports/HAR0803.pdf), [Fern Hollow in Pittsburgh](https://www.ntsb.gov/investigations/Pages/HWY22MH003.aspx).

Recognising a structure as a public bridge switches all of that on automatically: the inventory entry, the inspection cycle, the condition ratings, the funding line, the closure authority. For an open source project, the same recognition currently switches on a speech.

The government action that has followed regulates the *consumers* of open source rather than the infrastructure. The EU [Cyber Resilience Act](https://eur-lex.europa.eu/eli/reg/2024/2847/oj), US [Executive Order 14028](https://www.federalregister.gov/documents/2021/05/17/2021-10460/improving-the-nations-cybersecurity), and the various SBOM mandates put obligations on companies that ship products containing open source, which in bridge terms is requiring haulage firms to certify which bridges their trucks crossed while not employing any bridge inspectors.

## Ownership

Critical open source projects generally have identifiable owners (named maintainers, a foundation, a company), and the [single-maintainer statistic](https://opensourcesecurity.io/2025/08-oss-one-person/) is alarming because the number is one rather than because it is unknown. What they lack is a *state* owner of record, but the bridge regime does not require one. The [Ambassador Bridge](https://en.wikipedia.org/wiki/Ambassador_Bridge) between Detroit and Windsor carries around a quarter of road-borne US–Canada merchandise trade, is owned by a [private company](https://www.ambassadorbridge.com/), and is still subject to federal inspection because the regime attaches to the function the structure performs, not to who holds the title. We know exactly who owns it, and we have left them to it.

## Null results

The part of NBIS with the least open source equivalent is the most boring: an inspection that finds nothing wrong is filed with exactly the same formality as one that finds a crack in a girder. The inspector records a 9 for the deck and a 9 for the superstructure, dates and signs it, and it goes into the National Bridge Inventory next to all the others, with date of last inspection a queryable field in its own right.

In open source, a review that finds nothing wrong is almost never published, because the only outputs with anywhere to go are findings: issues, pull requests, CVEs. The absence of a CVE against a project cannot distinguish "someone competent checked this and it was fine" from "nobody has looked." Bug bounties, CVE credit, advisory acknowledgements, and conference talks all pay out on findings, and time spent confirming that a library is sound earns nothing and leaves no trace, which makes a clean review [economically irrational](/2026/06/18/open-source-vs-the-invisible-hand.html) to perform. A bridge inspector is paid the same for a 9 as for a 3, and that flat rate is what makes routine inspection a job rather than a hobby.

A certified inspector's "found sound" is a legal record because the state has defined who counts as an inspector and what an inspection consists of, whereas a drive-by GitHub comment saying "I looked at this and it seems fine" is correctly discounted to zero because there is no way to know who looked, how hard, or at what. Without a definition of what an inspection is and who is qualified to perform one, a clean report has no weight, so nobody bothers to write one.

## Procurement

Germany's [Sovereign Tech Agency](https://www.sovereign.tech/) is the clearest example I know of a government treating open source as infrastructure it has some responsibility for, and the telling detail is the legal form. It was set up in 2022 as the Sovereign Tech *Fund* and [renamed](https://www.sovereign.tech/news/sovereign-tech-agency) in 2024 to the Sovereign Tech *Agency*, a shift from a thing that disburses money to a thing that does work, and it pays maintainers under [service contracts](https://www.sovereign.tech/programs/applications#what-format-does-the-investment-take) rather than grants, because German public-spending law makes it difficult for the government to give money away without defined consideration in return.

That constraint is usually described as a bureaucratic obstacle, but it is doing the same job here that it does in civil engineering, where state departments of transportation [procure](https://www.fhwa.dot.gov/bridge/nbis/docs/contractingoutbridgeinspection.pdf) inspection and repair from contractors under agreements specifying scope, deliverables, schedule, and acceptance criteria. A contract casts the maintainer as a professional the state is buying from because it needs the work done, which is a more accurate and more dignified relationship than the grantee-and-benefactor one that most open source funding has settled into.

The procuring agency writes its own scope of work (which project, which components, what methodology, what gets published and by when), so a review delivered against that scope to a public agency carries weight because of who commissioned it and what they specified, not because of any certification the reviewer holds. Engineering standards have generally propagated this way, from large public buyers writing down what they will pay for and contractors converging on whatever wins the work, which also avoids the argument about who has the authority to set norms for open source: a scope of work claims no authority over the ecosystem, only over the purchase order.

## Scope of work

A maintenance contract for an open source project has an obvious scope, and most of it is work maintainers already do unpaid:

- Test coverage
- Documentation
- Performance benchmarks
- Security review
- Compatibility matrices against supported language and platform versions
- Dependency updates

Every item on that list produces an artifact whether or not it turns up a problem, since coverage is a percentage regardless, a compatibility matrix has a value in every cell, and a security review conducted on a given date against a stated methodology is a record even when the finding count is zero. Those artifacts map onto component condition ratings, a dated profile across several dimensions instead of a [single health score](/2026/05/09/the-mismeasure-of-open-source.html), each of which can be re-measured on a cycle. A profile can also carry the equivalent of a load posting, where the report records that the project is sound within stated limits ("maintained for LTS platforms only," "not hardened against untrusted input") without having to choose between a clean bill and a warning label, which is a state open source currently has no way to express. Aggregate the reports across enough contracts and the result is an inventory with a structure number, an owner of record, a date of last inspection, and a condition by component.

Documentation goes stale, dependencies become outdated, and CI matrices stop matching the platforms people use, on a shorter cycle than concrete weathers because the environment a library runs in is other software that is also changing. The right instrument is a maintenance contract on a term, not a one-off grant or a bounty, and "we funded that project in 2024" should sound as odd as "we inspected that bridge in 2024." The boundary of that contract is condition assessment and upkeep rather than feature development, so the state is buying "keep it standing and report its condition," which answers in advance the worry that government money would put government hands on a project's roadmap.

The institution the *Roads and Bridges* metaphor pointed at already exists, with fifty years of regulation, case law, and procurement practice behind it, and none of it was built by asking trucking companies to sponsor their favourite overpass.
