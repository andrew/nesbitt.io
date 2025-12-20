---
layout: post
title: "Package Managers Devroom at FOSDEM 2026: Schedule Announced"
date: 2025-12-20 12:00 +0000
description: "Nine talks on supply chain security, dependency resolution, and registry economics"
tags:
  - package-managers
  - fosdem
  - conferences
---

*Cross-posted from the [Ecosystems blog](https://blog.ecosyste.ms/2025/12/20/fosdem-2026-package-managers-devroom-schedule.html).*

Wolf Vollprecht and I are co-organizing the Package Managers devroom at FOSDEM 2026, and the [schedule](https://fosdem.org/2026/schedule/track/package-management/) is now live. We have nine talks covering supply chain security, dependency resolution, build reproducibility, and the economics of running package registries.

**Saturday, 31 January 2026**<br/>
Room K.3.201 (capacity 80) / 10:30-14:25

### [A phishy case study](https://fosdem.org/2026/schedule/event/GFA3RJ-a_phishy_case_study/)
*Adam Harvey / 10:30-10:55*

Adam walks through a phishing attack that targeted owners of popular Rust crates in September 2024. The talk covers how the attack unfolded and how collaboration between the Rust Project, Rust Foundation, and Alpha-Omega helped shut it down quickly.

### [Current state of attestations in programming language ecosystems](https://fosdem.org/2026/schedule/event/BCFZP7-current-state-programming-language-attestations/)
*Zach Steindler / 11:00-11:25*

Zach surveys how npm, PyPI, RubyGems, and Maven Central have adopted attestations to link packages to their source code and build instructions. He'll explain Sigstore bundle verification, compare implementation approaches across registries, and discuss what this means for ecosystems that haven't adopted attestations yet.

### [Name resolution in package management systems](https://fosdem.org/2026/schedule/event/BJCN93-name-resolution-in-package-managers/)
*Gábor Boskovits / 11:30-11:55*

Gábor examines how different package managers handle dependency resolution through the lens of reproducible builds. The talk compares language-specific lock files (Cargo), traditional distribution packaging (Debian), and declarative approaches (Nix, Guix).

### [Package managers à la carte: A Formal Model of Dependency Resolution](https://fosdem.org/2026/schedule/event/3SANYS-package-managers-a-la-carte/)
*Ryan Gibb / 12:00-12:25*

Ryan introduces the Package Calculus, a formal framework for unifying how different package managers resolve dependencies. The talk addresses three problems: multi-language projects can't express cross-language dependencies precisely, system and hardware dependencies remain implicit, and security vulnerabilities in full dependency graphs are hard to track.

### [Trust Nothing, Trace Everything: Auditing Package Builds at Scale with OSS Rebuild](https://fosdem.org/2026/schedule/event/EP8AMW-oss-rebuild-observability/)
*Matthew Suozzo / 12:30-12:55*

Matthew argues that reproducible builds aren't enough if you don't understand what happens during the build itself. He presents OSS Rebuild's open-source observability toolkit, including a transparent network proxy and an eBPF-based system analyzer for detecting suspicious build behavior. The talk responds to supply chain attacks like the XZ backdoor.

### [PURL: From FOSDEM 2018 to international standard](https://fosdem.org/2026/schedule/event/P8AAT3-purl/)
*Philippe Ombredanne / 13:00-13:10*

Philippe traces Package-URL's journey from its FOSDEM 2018 debut to becoming an international standard for referencing packages across ecosystems. PURL now appears in CVE formats for vulnerability tracking and is used by security tools, SCA platforms, and package registries for SBOM and VEX generation.

### [Binary Dependencies: Identifying the Hidden Packages We All Depend On](https://fosdem.org/2026/schedule/event/7NQJNU-binary_dependencies_identifying_the_hidden_packages_we_all_depend_on/)
*Vlad-Stefan Harbuz / 13:15-13:25*

Vlad tackles a gap in package management: while source dependencies are well documented, binary dependencies like numpy's reliance on OpenBLAS binaries remain invisible. He proposes a global index of binary dependencies using a linker that tracks symbols across the open source ecosystem.

### [The terrible economics of package registries and how to fix them](https://fosdem.org/2026/schedule/event/8WJKEH-package-registry-economics/)
*Michael Winser / 13:30-13:55*

Michael examines why package registries struggle financially despite being used by almost all software. Most rely on grants, donations, and in-kind resources while facing increased costs and security expectations. He discusses how the Alpha-Omega project has funded security improvements and piloted sustainable revenue models with major registries.

### [Package Management Learnings from Homebrew](https://fosdem.org/2026/schedule/event/FGBYKV-package_management_learnings_from_homebrew/)
*Mike McQuaid / 14:00-14:25*

Mike discusses Homebrew's v5.0.0 release from November 2025, covering what other package managers could learn from Homebrew's approach and what Homebrew has adopted from elsewhere.

See you in Brussels on January 31st.
