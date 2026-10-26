---
layout: post
title: "Package Management Devroom at FOSDEM 2027: Call for Participation"
date: 2026-10-26 10:00 +0000
description: "Submissions close 1 December."
tags:
  - package-managers
  - fosdem
  - conferences
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3myrj7amfz32c"
---

*Cross-posted from the [Software Stewardship Lab](https://stewardshiplab.org/ideas/cfp-package-management-devroom-at-fosdem-27/).*

The Package Management devroom is back at FOSDEM 2027, on Sunday 31 January from 13:15 to 17:00 at the Université libre de Bruxelles. The call for participation is open and submissions close on 1 December at 23:59 UTC, through [pretalx](https://pretalx.fosdem.org/fosdem-2027/cfp).

Wolf Vollprecht and I ran the devroom at FOSDEM 2026 after putting out [last year's call for participation](https://blog.ecosyste.ms/2025/11/06/fosdem-2026-package-managers-devroom-cfp.html) on the Ecosystems blog. The devroom had nine talks, listed in the [schedule post](/2025/12/20/fosdem-2026-package-managers-devroom-schedule.html) and written up alongside the rest of the weekend's package management content in [Package Management at FOSDEM 2026](/2026/02/04/package-management-at-fosdem-2026.html). This year there are four of us, with Vlad Miricioiu from the Stewardship Lab, who spoke last year, and Travis Hathaway from Anaconda joining Wolf and me.

I'd happily take more talks like these from last year:

- Matthew Suozzo showed how [OSS Rebuild instruments](https://archive.fosdem.org/2026/schedule/event/EP8AMW-oss-rebuild-observability/) the build environment, with a transparent network proxy and an eBPF-based system analyzer, to catch suspicious behaviour that a reproducible build check would pass.
- Ryan Gibb presented the [Package Calculus](https://archive.fosdem.org/2026/schedule/event/3SANYS-package-managers-a-la-carte/), a formal model of dependency resolution that reduces the features of different package managers to one core calculus.
- Vlad Miricioiu covered [binary dependencies](https://archive.fosdem.org/2026/schedule/event/7NQJNU-binary_dependencies_identifying_the_hidden_packages_we_all_depend_on/) that are missing from package manifests, like numpy's reliance on OpenBLAS.
- Adam Harvey walked through the [phishing campaign against crates.io owners](https://archive.fosdem.org/2026/schedule/event/GFA3RJ-a_phishy_case_study/) and how the Rust Project, Rust Foundation and Alpha-Omega shut it down.

We want talks from package manager and registry maintainers on the problems they keep running into: dependency resolution, namespaces, signing, reproducibility, metadata standards, cross-ecosystem dependencies, and this year's new supply chain attacks. We'd especially like talks on under-discussed parts of package management rather than more AI-augmented security tooling, and from people and communities underrepresented in free and open source software.

Pick "Package Management" as the track when you submit. Talks are 20 minutes by default, and if you'd prefer a 10 minute slot, say so in the "Submission Notes" field and we should be able to fit it in. Include a list of related previous work and a short bio for each speaker. Submitting means agreeing to the [FOSDEM Code of Conduct](https://fosdem.org/2027/practical/conduct/).

We'll be in touch with selected speakers on 4 December, and the schedule will be published on 7 December. Send any questions about the devroom or your submission to [package-management-devroom-manager@fosdem.org](mailto:package-management-devroom-manager@fosdem.org).
