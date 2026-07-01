---
layout: post
title: "The CRA is not about open source"
date: 2026-07-01 10:00 +0000
description: "The CRA created an open source steward role and left it unfunded"
tags:
  - open-source
  - sustainability
  - policy
---

At [FOSDEM](https://fosdem.org/2026/) in February and again at [UN Open Source Week](https://www.unopensource.org) last week, the [Cyber Resilience Act](https://eur-lex.europa.eu/eli/reg/2024/2847/oj) was the answer on offer whenever anyone asked what governments are doing about open source security, and the foundations and corporate advocates presenting it framed it as good news for open source. It is the largest piece of software legislation the EU has passed, the open source community spent two years lobbying over its text, and its main obligations come into force in December 2027.

It is also not about open source. Where open source appears in the text, it appears as an exemption, a component risk, a compliance contact, or a paperwork trail.

The CRA is a product-safety law in the [CE-mark](https://single-market-economy.ec.europa.eu/single-market/ce-marking_en) family, the same regime that already covers toys, radio equipment and machinery: rules a manufacturer must meet before selling a product in the EU, with a conformity mark at the end. The CRA extends that to anything with software in it. In [the previous post](/2026/06/30/taking-roads-and-bridges-literally.html) I described this class of regulation as requiring haulage firms to certify which bridges their lorries crossed while employing no bridge inspectors, and the CRA is the regulation most often held up as the counterexample.

## Scope

The things the CRA defines are products, the companies that make or sell them, and components. There is nothing in it corresponding to a project, a package, a registry, or a maintainer. Open source is visible in the regulation only as a property a component of a regulated product can have, so in the CRA's terms there is no OpenSSL, only products that incorporate OpenSSL.

Non-commercial open source is carved out of scope, which took a lot of lobbying and has been treated since as a win for the community. But exclusion from a product regulation is not the same as benefiting from it. A project outside the CRA's scope is in the same position as one the drafters had never heard of.

The regulation establishes no fund and no inspection or maintenance body, and nothing in it requires a manufacturer to contribute upstream. The exemption is the edge of what product law can reach: software nobody is selling offers nothing for a market regulation to attach to.

The phrase "supply chain" appears in the text in its product-law sense, meaning the chain of companies who put a good on the market and can each be held responsible for it. That is a different thing from the transitive dependency graph the same phrase means in open source, and reading the regulation as if it governs the second because the vocabulary overlaps is a category error.

## Dependencies

The clause that bears most directly on open source dependencies requires a manufacturer to exercise due diligence when pulling in third-party components, open source included. A manufacturer discharging that duty has a menu of options:

- vendor the dependency and patch it in-house
- replace it with a different dependency
- buy a commercially supported distribution that comes with its own paperwork
- run a scanner against the dependency tree and file the output

None of those routes money to the upstream author, because the rational response to liability for a component is to reduce exposure to it rather than to invest in it. A haulage firm told it is answerable for the state of every bridge on its route will plan routes with fewer bridges on them before it considers starting a bridge-repair division. When open source licence terms became a perceived corporate risk, the tooling that appeared was [licence scanners](https://en.wikipedia.org/wiki/Software_composition_analysis) and component-replacement policies, and security liability is the same shape of problem.

The closest the text gets to upstream is a clause requiring a manufacturer who finds a vulnerability in a component to report it to the maintainer. That duty assumes a maintainer is still there to receive it, which is what a maintenance regime would ensure and a product regulation cannot.

## Stewards

The steward category covers organisations that support open source intended for commercial use without themselves selling a product. A steward's obligations are lighter than a manufacturer's: have a security policy, cooperate with regulators on request, and handle vulnerability reports for the projects it looks after.

Those are the duties of an organisation that would otherwise be a gap in a manufacturer's paperwork, which in bridge terms means requiring an existing maintenance crew to post a contact number so that a haulier filling in forms has someone to name. Nothing in the steward provisions hires that crew or appoints an inspector, and the lighter obligations are still organised around the manufacturer's product.

For the steward category to route money to open source, manufacturers would need to prefer steward-backed components enough to pay for them. The regulation gives a manufacturer no reason to: its due diligence can be discharged by any of the routes in the previous section with no steward involved. Anyone who does want to buy component assurance can already get it from commercial redistributors. [Red Hat](https://www.redhat.com/) has been selling supported open source for over two decades, and [Chainguard](https://www.chainguard.dev/) sells hardened images with the SBOM and vulnerability handling needed for a CRA technical file. The nearest thing to a saleable steward output is Article 25's voluntary security attestation, left to a future delegated act. Becoming a steward today adds obligations to a foundation without creating anything a manufacturer is obliged to buy from it.

## SBOMs

The SBOM requirement asks for top-level dependencies "at the very least," which makes the transitive graph optional, and the SBOM goes into the manufacturer's technical file alongside the rest of the compliance paperwork. That file is held by the manufacturer and handed to a regulator on request, with no right of access for consumers, researchers, or maintainers. This is how [CE-mark technical files](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52022XC0629(04)) have always worked: a private record between the manufacturer and whoever might one day audit it.

The SBOM that results is a liability artifact rather than a transparency instrument:

- the maintainer of a library inside a CE-marked product does not learn from the CRA process that they are there
- a researcher cannot use CRA filings to map which commercial products depend on which open source projects
- a consumer comparing two products cannot see which has the better-maintained dependency tree

The CRA will not, to take a concrete case, put a public SBOM for Windows anywhere a member of the public can read it. The [National Bridge Inventory](https://infobridge.fhwa.dot.gov/) from the previous post is open to anyone, and because the bridge regime attaches to the function a structure performs, the privately held Ambassador Bridge is federally inspected regardless of title. A library inside thousands of CE-marked products gets no equivalent record, because the CRA's trigger is commercial activity and its technical file is a sealed dossier for apportioning fault after an incident.

## Implementation

The machinery the CRA sets running is all on the product side: the Commission will sort products into risk classes, [ENISA](https://www.enisa.europa.eu/) will run a reporting platform for manufacturers to notify exploited vulnerabilities in their own products, member states will appoint enforcement bodies, and [CEN, CENELEC and ETSI](https://digital-strategy.ec.europa.eu/en/policies/cra-standardisation) are writing the standards manufacturers will be assessed against. None of that touches anything upstream of the manufacturer, because the regulation defines nothing there.

The second-order effects that do reach open source are modest: SBOM tooling will mature because more manufacturers need to produce SBOMs, though [Executive Order 14028](https://www.federalregister.gov/documents/2021/05/17/2021-10460/improving-the-nations-cybersecurity) had already pushed that along. Exploited-vulnerability reporting will be quicker in the specific case of a manufacturer notifying ENISA about its own product. Neither of those is particular to open source or acts on the upstream project where a vulnerability originates.

When [Log4Shell](https://en.wikipedia.org/wiki/Log4Shell) prompted a European policy response, the instrument that came back was product law, which is structurally incapable of acting on the infrastructure that prompted it. The CRA does open source little direct harm, and the exemptions the community fought for are about as good as exemptions get.

The cost is that "we passed the CRA" is now available as the answer when open source maintenance comes up: a regulation with no maintenance regime in it occupies the slot where one would go. The open source community made the CRA an open source story through its own lobbying, and two years on is still reading itself into a text whose subject is manufacturers and consumers.
