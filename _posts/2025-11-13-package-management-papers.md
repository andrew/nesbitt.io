---
layout: post
title: "Package Management Papers"
date: 2025-11-13 12:00 +0000
description: "A collection of academic research papers on package management systems, dependency resolution, supply chain security, and software ecosystems."
tags:
  - package-managers
  - research
  - dependencies
  - history
  - reference
---

There's been all kinds of interesting academic research on package management systems, dependency resolution algorithms, software supply chain security, and package ecosystem analysis over the years. Below is a curated list of papers I've found interesting, it's not exhaustive but covers a good chunk of the literature.

**[An Overview and Catalogue of Dependency Challenges in Open Source Software Package Registries](https://arxiv.org/abs/2409.18884)** (2024)
*Tom Mens, Alexandre Decan*
arXiv preprint

Comprehensive literature review and survey of package dependency management research. Catalogues dependency-related challenges including dependency hell, technical lag, security vulnerabilities, and supply chain attacks. Covers SCA tools, SBOMs, and SLSA security levels. Good starting point for researchers and practitioners new to the field.

The papers are organized by topic and include brief descriptions along with author names and publication years. This is a living document—if you know of papers that should be included, please reach out on [Mastodon](https://mastodon.social/@andrewnez) or open a pull request on [GitHub](https://github.com/andrew/nesbitt.io/blob/master/_posts/2025-11-13-package-management-papers.md).

## Package Management Security

Research on security vulnerabilities, attack vectors, and defense mechanisms in package management systems.

**[A Look in the Mirror: Attacks on Package Managers](https://dl.acm.org/doi/10.1145/1455770.1455841)** (2008)
*Justin Cappos, Justin Samuel, Scott Baker, John H. Hartman*
ACM Conference on Computer and Communications Security (CCS)

Seminal paper analyzing ten popular package managers (APT, YUM, YaST, Portage) discovering vulnerabilities in all systems exploitable by man-in-the-middle attackers or malicious mirrors. Demonstrated attackers controlling mirrors could compromise hundreds to thousands of clients weekly. Identified replay attacks, freeze attacks, extraneous dependencies attacks, and endless data attacks while proposing a layered security approach.

A broader, more "textbook" analysis of these attacks is also available in [a technical report](https://www2.cs.arizona.edu/people/jsamuel/papers/TR08-02.pdf) by the authors.  This further fleshes out a host of related attacks that rely on manipulation of dependency information by mirrors to cause package resolution to behave in ways that harm security or stability.

**[Package Managers Still Vulnerable](https://www.usenix.org/publications/login/february-2009-volume-34-number-1/package-managers-still-vulnerable)** (2009)
*Justin Samuel, Justin Cappos*
;login: The USENIX Magazine

Follow-up analysis examining how package managers responded to disclosed vulnerabilities, finding that while some (YaST, APT) made improvements, many remained vulnerable to replay, freeze, and endless data attacks.

**[Secure Software Updates: Disappointments and New Challenges](https://www.usenix.org/legacy/events/hotsec06/tech/full_papers/bellissimo/bellissimo.pdf)** (2006)
*Anthony Bellissimo, John Burgess, Kevin Fu*
USENIX Workshop on Hot Topics in Security (HotSec)

Early analysis of popular software update mechanisms demonstrating that despite research progress, deployed systems relied on trusted networks and were susceptible to man-in-the-middle attacks. Examining McAfee VirusScan, Mozilla Firefox, and Windows Update, the study found none properly authenticated connections.  While technically not package manager research, this work demonstrated that security was lacking in the general space of software update systems.

**[Mercury: Bandwidth-Effective Prevention of Rollback Attacks Against Community Repositories](https://www.usenix.org/conference/atc17/technical-sessions/presentation/kuppusamy)** (2017)
*Trishank Kuppusamy, Vladimir Diaz, Justin Cappos*
USENIX Annual Technical Conference (USENIX ATC)

Presented bandwidth-efficient techniques for preventing rollback attacks on package repositories in a way that scales to very large software repositories, such as PyPI.  The techniques described here reduce metadata overhead by 95% compared to standard TUF while maintaining security properties. Using delta compression, Mercury achieves about 3.5% of average package size per month for PyPI users.

**[Artemis: Defanging Software Supply Chain Attacks in Multi-repository Update Systems](https://ssl.engineering.nyu.edu/papers/moore_artemis_2023.pdf)** (2023)
*Marina Moore, Trishank Kuppusamy, Justin Cappos*
Annual Computer Security Applications Conference (ACSAC)

Discusses ways to securely use multiple repositories with a package manager.  This includes a mechanism to 1) blocking or pinning a repository name to a specific repository, 2) a means for multiple parties to have different package namespaces on the same repository, and 3) a means to require a threshold of approvers for all of these operations. This paper presents lessons learned both from deployments of [Uptane](https://ssl.engineering.nyu.edu/papers/kuppusamy_escar_16.pdf) (the automotive variant of TUF which is widely used in automotive) and other TUF deployments across millions of devices.

**[Small World with High Risks: A Study of Security Threats in the npm Ecosystem](https://www.usenix.org/conference/usenixsecurity19/presentation/zimmerman)** (2019)
*Markus Zimmermann, Cristian-Alexandru Staicu, Cam Tenny, Michael Pradel*
USENIX Security Symposium

Systematically analyzed dependencies, maintainers, and security issues in npm, finding that 20 maintainers can reach more than half the ecosystem and two-thirds of advisories remain unpatched. Demonstrated small-world network properties create concentrated security risks.

**[The impact of security vulnerabilities in the npm package dependency network](https://dl.acm.org/doi/10.1145/3196398.3196401)** (2018)
*Alexandre Decan, Tom Mens, Eleni Constantinou*
International Conference on Mining Software Repositories (MSR)

Analyzed propagation of security vulnerabilities through npm dependency network, studying how vulnerabilities affect downstream packages and the time required for ecosystem-wide fixes.

**[Demystifying the vulnerability propagation and its evolution via dependency trees in the npm ecosystem](https://dl.acm.org/doi/10.1145/3510003.3510142)** (2022)
*Chengwei Liu, Sen Chen, Lingling Fan, Bihuan Chen, Yang Liu, Xin Peng*
IEEE/ACM International Conference on Software Engineering (ICSE)

Analyzes vulnerability propagation within dependency trees by applying npm-specific dependency resolution rules, recommending lockfiles for managing dependencies.

**[Empirical Analysis of Security Vulnerabilities in Python Packages](https://ieeexplore.ieee.org/document/9678615)** (2021)
*Various authors*
IEEE conference proceedings

Analysis of 550 vulnerability reports affecting 252 Python packages in PyPI ecosystem, providing empirical evidence about vulnerability patterns in Python packages.

**[Surviving Software Dependencies](https://dl.acm.org/doi/10.1145/3329781.3344149)** (2019)
*Russ Cox*
ACM Queue

Influential essay on managing software dependencies at scale. Discusses version selection, minimum version selection (used in Go), and the tradeoffs between different dependency management approaches. Required reading for anyone working on package managers.

**[The Impact of Regular Expression Denial of Service (ReDoS) in Practice](https://dl.acm.org/doi/10.1145/3236024.3236027)** (2018)
*James Davis, Christy Coghlan, Francisco Servant, Dongyoon Lee*
ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/FSE) - Distinguished Paper Award

Ecosystem-scale study of ReDoS vulnerabilities in npm and PyPI. Found thousands of super-linear regexes affecting over 10,000 modules. 93% of vulnerable regexes are polynomial rather than exponential, missed by common detection tools.

**[Thou Shalt Not Depend on Me: Analysing the Use of Outdated JavaScript Libraries on the Web](https://www.ndss-symposium.org/wp-content/uploads/2017/09/ndss2017_02B-1_Lauinger_paper.pdf)** (2017)
*Tobias Lauinger, Abdelberi Chaabane, Sajjad Arshad, William Robertson, Christo Wilson, Engin Kirda*
Network and Distributed System Security Symposium (NDSS)

First comprehensive study of client-side JavaScript library usage across 133K websites. Found 37% include at least one library with a known vulnerability. Median site uses library versions released 1,177 days before newest available release.

## Lockfiles

Research on lockfile design, usage, and their role in dependency management.

**[The Design Space of Lockfiles Across Package Managers](https://arxiv.org/pdf/2505.04834)** (2025)
*Yogya Gamage, Deepika Tiwari, Martin Monperrus, Benoit Baudry*
arXiv preprint

First study of lockfiles across seven package managers (npm, pnpm, Cargo, Poetry, Pipenv, Gradle, Go). Analyzes lockfile content and lifecycle differences, finding Go has near 100% lockfile commit rate while Gradle is close to zero. Interviews with 15 developers reveal benefits (build determinism, integrity verification, transparency) and challenges (readability, delayed updates, library locking). Recommends generating lockfiles by default and committing them for all projects.

**[Reproducible builds: Increasing the integrity of software supply chains](https://ieeexplore.ieee.org/document/9648644)** (2022)
*Chris Lamb, Stefano Zacchiroli*
IEEE Software

Overview of the reproducible builds movement and its importance for software supply chain security. Discusses how bit-for-bit reproducibility enables independent verification of build artifacts.

**[It's Like Flossing Your Teeth: On the Importance and Challenges of Reproducible Builds for Software Supply Chain Security](https://ieeexplore.ieee.org/document/10179304)** (2023)
*Marcel Fourné, Dominik Wermke, William Enck, Sascha Fahl, Yasemin Acar*
IEEE Symposium on Security and Privacy (S&P)

24 semi-structured interviews with Reproducible-Builds.org participants. Found self-effective work by highly motivated developers and collaborative communication with upstream projects are key to achieving reproducible builds. Identifies path for R-Bs to become commonplace.

**[Investigating the reproducibility of npm packages](https://ieeexplore.ieee.org/document/9240691)** (2020)
*Pronnoy Goswami, Saksham Gupta, Zhiyuan Li, Na Meng, Daphne Yao*
IEEE International Conference on Software Maintenance and Evolution (ICSME)

Empirical study of npm package reproducibility, analyzing factors that affect whether packages can be rebuilt identically from source.

**[Pinning is futile: You need more than local dependency versioning to defend against supply chain attacks](https://arxiv.org/abs/2502.06662)** (2025)
*Hao He, Bogdan Vasilescu, Christian Kästner*
arXiv preprint

Study finding that local pinning leads to more security vulnerabilities due to bloated and outdated dependencies. Suggests risk of malicious package updates can be reduced when core dependencies pin their versions and keep them updated regularly.

**[Maven-Lockfile: High Integrity Rebuild of Past Java Releases](https://arxiv.org/abs/2510.00730)** (2025)
*Larissa Schmid, et al.*
arXiv preprint

Addresses Maven's lack of native lockfile support. Presents Maven-Lockfile to generate and update lockfiles capturing all direct and transitive dependencies with checksums. Enables high integrity builds and can detect tampered artifacts.

**[Does Functional Package Management Enable Reproducible Builds at Scale? Yes.](https://arxiv.org/abs/2501.15919)** (2025)
*Julien Malka, Stefano Zacchiroli, Théo Zimmermann*
International Conference on Mining Software Repositories (MSR) - Distinguished Paper Award

First large-scale study of bitwise reproducibility in Nix, rebuilding 709,816 packages from historical snapshots of nixpkgs sampled between 2017 and 2023. Achieved reproducibility rates between 69% and 91% with an upward trend, and rebuildability rates over 99%. Found about 15% of unreproducibility failures are due to embedded build dates. Released a dataset with build statuses, logs, and recursive diffs showing where unreproducible artifacts differ.

**[Improving Reproducibility of Scientific Software Using Nix/NixOS: A Case Study on the preCICE Ecosystem](https://eceasst.org/index.php/eceasst/article/view/2613)** (2025)
*Max Hausch, Simon Hauser, Benjamin Uekermann*
Electronic Communications of the EASST

Case study applying Nix to scientific software reproducibility in the preCICE coupling library ecosystem. Demonstrates how functional package management provides guarantees that packages and their dependencies can be built reproducibly, addressing challenges in computational science where results must be independently verifiable.

## Dependency Resolution Algorithms and Challenges

Research establishing the theoretical complexity of dependency resolution and practical solutions.

**[EDOS deliverable WP2-D2.1: Report on Formal Management of Software Dependencies](https://www.researchgate.net/publication/278629134_EDOS_deliverable_WP2-D21_Report_on_Formal_Management_of_Software_Dependencies)** (2005)
*Roberto Di Cosmo*
INRIA Technical Report

First document to show that the package installation problem is NP-complete. First to
show a 3SAT encoding for Debian and RPM solves. Compares package constraint languages
and proposes improvements for metadata.

**[OPIUM: Optimal Package Install/Uninstall Manager](https://cseweb.ucsd.edu/~lerner/papers/opium.pdf)** (2007)
*Chris Tucker, David Shuffelton, Ranjit Jhala, Sorin Lerner*
International Conference on Software Engineering (ICSE)

Introduced complete dependency solver using SAT, pseudo-boolean optimization, and Integer Linear Programming. OPIUM guarantees completeness and optimizes user-defined objectives. Demonstrated 23.3% of Debian users encounter apt-get's incompleteness failures.

**[Automated dependency resolution for open source software](https://ieeexplore.ieee.org/document/5463346)** (2010)
*Joel Ossher, Sushil Bajracharya, Cristina Lopes*
IEEE Working Conference on Mining Software Repositories (MSR)

Proposed techniques for automatically resolving dependencies in open source projects by mining and analyzing source code repositories, addressing challenges when dependency metadata is incomplete or unavailable.

**[Handling software upgradeability problems with MILP solvers](https://doi.org/10.4204/EPTCS.29.1)** (2010)
*Claude Michel, Michel Rueher*
International Workshop on Logics for Component Configuration (LoCoCo)

Demonstrated how Mixed Integer Linear Programming solvers can handle package upgradeability problems, offering an alternative to SAT-based approaches with different performance characteristics.

**[Solving Linux Upgradeability Problems Using Boolean Optimization](https://doi.org/10.4204/EPTCS.29.2)** (2010)
*Josep Argelich, Daniel Le Berre, Inês Lynce, João P. Marques Silva, Pascal Rapicault*
International Workshop on Logics for Component Configuration (LoCoCo)

Applied pseudo-boolean optimization techniques to Linux package upgradeability, showing how boolean optimization can find optimal solutions while respecting user preferences.

**[Dependency solving: A separate concern in component evolution management](https://www.sciencedirect.com/science/article/pii/S0164121212000532)** (2012)
*Pietro Abate, Roberto Di Cosmo, Ralf Treinen, Stefano Zacchiroli*
Journal of Systems and Software (JSS)

Argued for modular package manager architecture where dependency solving separates from other concerns. Reviewed state-of-the-art package managers and proposed generic external solvers (SAT, PBO, MILP) rather than ad-hoc heuristics.

**[Modelling and Resolving Software Dependencies](https://www.researchgate.net/publication/229012671_Modelling_and_resolving_software_dependencies)** (2005)
*Daniel Burrows*
Technical Report

Presented abstract model of dependency relationships and restartable best-first-search technique for dependency resolution. Documents theoretical approach behind aptitude's problem resolver.

**[Dependency Solving Is Still Hard, but We Are Getting Better at It](https://arxiv.org/abs/2011.07851)** (2020)
*Pietro Abate, Roberto Di Cosmo, Georgios Gousios, Stefano Zacchiroli*
IEEE International Conference on Software Analysis, Evolution and Reengineering (SANER)

Retrospective analysis conducting census of dependency solving capabilities in state-of-the-art package managers, showing SAT-based approaches are gaining adoption. Demonstrated that despite NP-completeness, practical solvers perform well on real-world instances.

**[aspcud: A Linux Package Configuration Tool Based on Answer Set Programming](https://doi.org/10.4204/EPTCS.65.2)** (2011)
*Martin Gebser, Roland Kaminski, Torsten Schaub*
Electronic Proceedings in Theoretical Computer Science

Introduced aspcud, a dependency solver using Answer Set Programming rather than SAT or MILP. Demonstrates ASP as a viable alternative for package configuration, with declarative specification of optimization criteria and competitive performance on Debian package problems.

**[On software component co-installability](https://dl.acm.org/doi/10.1145/2025113.2025149)** (2011)
*Roberto Di Cosmo, Jérôme Vouillon*
SIGSOFT Symposium on the Foundations of Software Engineering (FSE)

Addressed fundamental challenge of determining which software components can be installed together, developing formal framework with graph-theoretic transformations to simplify dependency repositories while preserving co-installability properties.

**[Strong dependencies between software components](https://dl.acm.org/doi/10.1109/ESEM.2009.5314231)** (2009)
*Pietro Abate, Roberto Di Cosmo, Jaap Boender, Stefano Zacchiroli*
ACM/IEEE International Symposium on Empirical Software Engineering and Measurement (ESEM)

Studied strong dependency relationships where packages are tightly coupled, analyzing patterns of mandatory co-installation and implications for system evolution.

**[Watchman: Monitoring dependency conflicts for python library ecosystem](https://dl.acm.org/doi/10.1145/3377811.3380426)** (2020)
*Ying Wang, Ming Wen, Yepang Liu, Yibo Wang, Zhenming Li, Chao Wang, Hai Yu, Shing-Chi Cheung, Chang Xu, Zhiliang Zhu*
IEEE/ACM International Conference on Software Engineering (ICSE)

Identifies factors leading to dependency conflicts in Python ecosystem and proposes monitoring approach for detecting conflicts.

**[smartpip: A smart approach to resolving python dependency conflict issues](https://dl.acm.org/doi/10.1145/3551349.3560437)** (2023)
*Chenyang Wang, Rongxin Wu, Haoran Song, Junjie Shu, Guozhu Li*
IEEE/ACM International Conference on Automated Software Engineering (ASE)

Highlights issues related to inefficiency and excessive resource usage by dependency resolution strategies in Python, proposing improved resolution approach.

**[ConflictJS: Finding and understanding conflicts between javascript libraries](https://dl.acm.org/doi/10.1145/3180155.3180184)** (2018)
*Jibesh Patra, Pooja N. Dixit, Michael Pradel*
IEEE/ACM International Conference on Software Engineering (ICSE)

Analyzes dependency conflicts in JavaScript arising from namespace collisions, proposing detection and understanding mechanisms.

**[Could I Have a Stack Trace to Examine the Dependency Conflict Issue?](https://doi.org/10.1109/ICSE.2019.00068)** (2019)
*Ying Wang, Ming Wen, Rongxin Wu, Zhenwei Liu, Shin Hwei Tan, Zhiliang Zhu, Hai Yu, Shing-Chi Cheung*
IEEE/ACM International Conference on Software Engineering (ICSE)

Proposes approach to help developers diagnose dependency conflicts in Java/Maven by generating stack traces that reveal how conflicts manifest at runtime, making abstract version incompatibilities concrete and actionable.

**[Hero: On the chaos when path meets modules](https://dl.acm.org/doi/10.1109/ICSE43902.2021.00022)** (2021)
*Ying Wang, Liang Qiao, Chang Xu, Yepang Liu, Shing-Chi Cheung, Na Meng, Hai Yu, Zhiliang Zhu*
IEEE/ACM International Conference on Software Engineering (ICSE)

Studies conflicts in Go ecosystem caused by coexistence of two library referencing modes: GOPATH and Go modules.

**[Stork: Secure Package Management For VM Environments](https://www.cs.arizona.edu/sites/default/files/TR08-04.pdf)** (2008)
*Justin Cappos*
Dissertation (University of Arizona) -- Chapter 3.8

Describes backtracking dependency resolution.  In contrast to more mathematically advanced techniques, this tries the best match greedily for each package and then rewinds state if there is a conflict.  Through practical use in Stork, this was found to work well for adopters, despite its simplcity.

**[Solving Package Management via Hypergraph Dependency Resolution](https://arxiv.org/abs/2506.10803)** (2025)
*Ryan Gibb, Patrick Ferris, David Allsopp, Michael Winston Dales, Mark Elvers, Thomas Gazagnaire, Sadiq Jaffer, Thomas Leonard, Jon Ludlam, Anil Madhavapeddy*
arXiv preprint

Introduces HyperRes, a formal framework modeling dependencies as hypergraphs to address fragmentation across package managers. Demonstrates translation of metadata between different package managers and solving dependency constraints across ecosystems without forcing users to abandon their preferred tools.

**[Using Answer Set Programming for HPC Dependency Solving](https://dl.acm.org/doi/abs/10.5555/3571885.3571931)** (2022)
*Todd Gamblin, Massimiliano Culpo, Gregory Becker, Sergei Shudler*
Supercomputing

Describes the ASP encoding used for Spack's dependency solver: how to model versions, variants, and dependencies. Also describes how to structure optimization criteria to mix source and binary builds by reusing existing installations/build caches (if they're compatible).

**[Using Answer Set Programming for HPC Dependency Solving](https://dl.acm.org/doi/abs/10.5555/3571885.3571931)** (2022)
*Todd Gamblin, Massimiliano Culpo, Gregory Becker, Sergei Shudler*
Supercomputing

Describes the ASP encoding used for Spack's dependency solver: how to model versions, variants, and dependencies. Also describes how to structure optimization criteria to mix source and binary builds by reusing existing installations/build caches.

**[Bridging the Gap Between Binary and Source Based Package Management in Spack](https://dl.acm.org/doi/10.1145/3712285.3759791)** (2025)
*John Gouwar, Greg Becker, Tamara Dahlgren, Nathan Hanford, Arjun Guha, and Todd Gamblin*
Supercomputing

Discusses some differences beteween source and binary package solving. Describes how to
avoid the rigid ABI requirements of Spack's (and Nix's and Guix's) hashing model and not
rebuild the world when an ABI-stable package like zlib changes, while preserving
reproducibility for mixed (or "impure" in nix-speak) installations.

## Software Supply Chain Security

Research on supply chain attacks, detection methods, and prevention frameworks.

**[in-toto: Providing Farm-to-Table Guarantees for Bits and Bytes](https://www.usenix.org/conference/usenixsecurity19/presentation/torres-arias)** (2019)
*Santiago Torres-Arias, Hammad Afzali, Trishank Kuppusamy, Reza Curtmola, Justin Cappos*
USENIX Security Symposium

Presented framework for securing the entire software supply chain from development to deployment using cryptographic metadata. Analyzed 30 major supply chain attacks and demonstrated in-toto would have prevented 23 (77%) outright. Deployed at Datadog, Debian, and Kubernetes.

**[Backstabber's Knife Collection: A Review of Open Source Software Supply Chain Attacks](https://arxiv.org/abs/2005.09535)** (2020)
*Marc Ohm, Henrik Plate, Arnold Sykosch, Michael Meier*
International Conference on Detection of Intrusions and Malware, and Vulnerability Assessment (DIMVA)

Presented dataset and analysis of 174 malicious packages from npm, PyPI, and RubyGems used in real-world attacks between November 2015 and November 2019. Introduced attack trees categorizing injection techniques and execution triggers.

**[Towards Measuring Supply Chain Attacks on Package Managers for Interpreted Languages](https://arxiv.org/abs/2002.01139)** (2020)
*Ruian Duan, Omar Alrawi, Ranjita Pai Kasturi, Ryan Elder, Brendan Saltaformaggio, Wenke Lee*
arXiv preprint

Proposed comparative framework for assessing security features of package managers for interpreted languages. Developed MalOSS pipeline for automated malware detection, finding and reporting 339 new malicious packages, with 278 (82%) confirmed by maintainers.

**[SoK: Taxonomy of Attacks on Open-Source Software Supply Chains](https://ieeexplore.ieee.org/document/10179304)** (2023)
*Piergiorgio Ladisa, Henrik Plate, Matias Martinez, Olivier Barais*
IEEE Symposium on Security and Privacy (S&P)

Systematized knowledge about attacks on open-source software supply chains, proposing taxonomy independent of specific languages or ecosystems. Identified 12 distinct attack categories and analyzed their prevalence.

**[SoK: Analysis of Software Supply Chain Security by Establishing Secure Design Properties](https://dl.acm.org/doi/10.1145/3560835.3564556)** (2022)
*Chinenye Okafor, James Davis, et al.*
ACM Workshop on Software Supply Chain Offensive Research and Ecosystem Defenses (SCORED)

Systematized knowledge about secure software supply chain patterns, identifying four stages of supply chain attacks and proposing three security properties: transparency, validity, and separation.

**[Research directions in software supply chain security](https://dl.acm.org/doi/10.1145/3709359)** (2025)
*Laurie Williams, Grace Benedetti, Samuel Hamer, Ranindya Paramitha, Imranur Rahman, Mahzabin Tamanna, Gabriel Tystahl, Nusrat Zahan, Patrick Morrison, Yasemin Acar, Michel Cukier, Christian Kästner, Alexandros Kapravelos, Dominik Wermke, William Enck*
ACM Transactions on Software Engineering and Methodology (TOSEM)

Survey identifying key research directions in software supply chain security including dependency management, vulnerability detection, and trust models across package ecosystems.

**[Modeling Interconnected Social and Technical Risks in Open Source Software Ecosystems](https://arxiv.org/abs/2205.04268)** (2022)
*William Schueller, Johannes Wachs*
arXiv preprint

Examines how social and technical factors interact to create systemic risks in open source ecosystems. Developers often maintain multiple interdependent libraries, meaning individual departures can cascade failures across projects. Develops a framework measuring risk based on both dependency networks and developer involvement, applied to the Rust ecosystem.

**[Out of Sight, Out of Mind? How Vulnerable Dependencies Affect Open-Source Projects](https://link.springer.com/article/10.1007/s10664-021-09959-3)** (2021)
*Gede Artha Azriadi Prana, Abhishek Sharma, Lwin Khin Shar, Darius Foo, Andrew Santosa, Asankhaya Sharma, David Lo*
Empirical Software Engineering

Analyzed vulnerabilities in 450 Java, Python, and Ruby projects using industrial SCA tool. Found vulnerabilities persist 3-5 months after fixes become available. Highlights importance of managing dependency count and performing timely updates.

**[Software Supply Chain: Review of Attacks, Risk Assessment Strategies and Security Controls](https://arxiv.org/abs/2308.07920)** (2023)
*Betul Gokkaya, et al.*
arXiv preprint

Systematic literature review analyzing common software supply chain attacks and providing latest trends. Identified security risks for open-source and third-party software supply chains.

**[Challenges of Producing Software Bill Of Materials for Java](https://arxiv.org/abs/2303.11102)** (2023)
*Musard Balliu, Benoit Baudry, Sofia Bobadilla, Mathias Ekstedt, Martin Monperrus, Javier Ron, Aman Sharma, Gabriel Skoglund, César Soto-Valero, Martin Wittlinger*
arXiv preprint

Evaluated six SBOM generation tools on complex open-source Java projects, identifying hard challenges for accurate SBOM production and usage in software supply chain security contexts.

**[On the way to sboms: Investigating design issues and solutions in practice](https://dl.acm.org/doi/10.1145/3660773)** (2024)
*Tingting Bi, Boming Xia, Zhenchang Xing, Qinghua Lu, Liming Zhu*
ACM Transactions on Software Engineering and Methodology (TOSEM)

Investigates SBOM design issues and solutions, noting lockfiles as related to SBOM generation.

**[On the correctness of metadata-based sbom generation: A differential analysis approach](https://ieeexplore.ieee.org/document/10646632)** (2024)
*Songqiang Yu, Wei Song, Xiaolong Hu, Heng Yin*
IEEE/IFIP International Conference on Dependable Systems and Networks (DSN)

Differential analysis evaluating correctness of SBOM generation from metadata, using lockfiles as source of truth for comparison.

**[SBOM.EXE: Countering Dynamic Code Injection based on Software Bill of Materials in Java](https://arxiv.org/abs/2407.00246)** (2024)
*Aman Sharma, Martin Wittlinger, Benoit Baudry, Martin Monperrus*
arXiv preprint

Proposes a runtime defense mechanism for Java applications that constructs an allowlist of legitimate classes using complete software supply chain information, then enforces this list during execution to block unauthorized classes. Tested against critical vulnerabilities including Log4Shell-style threats with minimal performance impact.

**[Dirty-Waters: Detecting Software Supply Chain Smells](https://arxiv.org/abs/2410.16049)** (2024)
*Raphina Liu, Sofia Bobadilla, Benoit Baudry, Martin Monperrus*
arXiv preprint

Introduces "software supply chain smell" as a novel concept for identifying problematic dependency patterns. Presents Dirty-Waters tool for detecting these smells in JavaScript projects, finding many patterns that reveal potential supply chain risks.

**[LastPyMile: Identifying the Discrepancy Between Sources and Packages](https://dl.acm.org/doi/10.1145/3468264.3468588)** (2021)
*Duc-Ly Vu, Fabio Massacci, Ivan Pashchenko, Henrik Plate, Antonino Sabetta*
ACM Joint Meeting on European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/FSE)

Proposed methodology for identifying discrepancies between source code repositories (GitHub) and distributed packages (PyPI). Analyzed 2,438 popular PyPI packages, finding on average 5.8% of artifacts and 2.6% of files have changes.

**[Towards Using Source Code Repositories to Identify Software Supply Chain Attacks](https://dl.acm.org/doi/10.1145/3411508.3421375)** (2020)
*Duc-Ly Vu, Ivan Pashchenko, Fabio Massacci, Henrik Plate, Antonino Sabetta*
ACM Conference on Computer and Communications Security (CCS)

Earlier work exploring use of source code repository analysis for detecting supply chain attacks, establishing foundation for LastPyMile approach by identifying that attackers inject minimal code changes.

**[Software Composition Analysis and Supply Chain Security in Apache Projects: An Empirical Study](https://dl.acm.org/doi/10.1145/3643991.3644909)** (2025)
*Sabato Nocera, Sira Vegas, Giuseppe Scanniello, Natalia Juristo*
International Conference on Mining Software Repositories (MSR)

Investigated effects of adopting OWASP Dependency-Check (SCA tool) in Apache Software Foundation Java Maven projects. Found adoption causes significant reduction in vulnerabilities including high-severity CVEs.

## Package Repository Analysis and Ecosystems

Large-scale empirical studies of package ecosystems and their structural properties.

**[A Look at the Dynamics of the JavaScript Package Ecosystem](https://dl.acm.org/doi/10.1145/2901739.2901743)** (2016)
*Erik Wittern, Philippe Suter, Shriram Rajagopalan*
International Conference on Mining Software Repositories (MSR)

First analysis of npm ecosystem examining package descriptions, dependencies, download metrics, and historical evolution. Analyzed 230,000+ packages over 6 years.

**[npm-follower: A Complete Dataset Tracking the NPM Ecosystem](https://dl.acm.org/doi/10.1145/3611643.3613867)** (2023)
*Donald Pinckney, Federico Cassano, Arjun Guha, Jonathan Bell*
ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering (FSE)

Introduced dataset architecture that archives metadata and code of all npm packages as published, including deleted versions (330,000+ versions deleted between July 2022-May 2023).

**[npm-miner: An Infrastructure for Measuring the Quality of the npm Registry](https://dl.acm.org/doi/10.1145/3196398.3196465)** (2018)
*Kyriakos Chatzidimitriou, Michail Papamichail, Themistoklis Diamantopoulos, Michail Tsapanos, Andreas Symeonidis*
International Conference on Mining Software Repositories (MSR)

Infrastructure that crawls npm and analyzes packages using static analysis to extract quality metrics including maintainability and security. Identified ecosystem issues like packages with broken GitHub URLs and copied-pasted projects with only package names changed.

**[On the accuracy of github's dependency graph](https://dl.acm.org/doi/10.1145/3661167.3661175)** (2024)
*Daniele Bifolco, Sara Nocera, Simone Romano, Massimiliano Di Penta, Rita Francese, Giuseppe Scanniello*
International Conference on Evaluation and Assessment in Software Engineering (EASE)

Assesses accuracy of GitHub dependency graph in Java and Python projects, using lockfiles as source of truth for comparison.

**[Understanding and Detecting Peer Dependency Resolving Loop in npm Ecosystem](https://dl.acm.org/doi/10.1109/ICSE55347.2025.00054)** (2025)
*Xiaohui Wang, Mingyu Wang, Weijian Shen, Rui Chang*
IEEE/ACM International Conference on Software Engineering (ICSE)

In-depth study of conflicts between peer dependencies in npm, examining how circular peer dependencies create resolution loops.

**[An Empirical Analysis of Technical Lag in npm Package Dependencies](https://link.springer.com/chapter/10.1007/978-3-319-90421-4_6)** (2018)
*Ahmed Zerouali, Eleni Constantinou, Tom Mens, Gregorio Robles, Jesús M. González-Barahona*
International Conference on Software Reuse (ICSR)

Introduced technical lag metric to assess how outdated packages are compared to latest releases, finding strong presence caused by dependency constraints indicating reluctance to update.

**[An Empirical Analysis of the Python Package Index (PyPI)](https://arxiv.org/abs/1907.11073)** (2019)
*Ethan Bommarito, Michael J. Bommarito II*
arXiv preprint

Empirical summary covering 178,592 packages, 1,745,744 releases, 76,997 contributors, and 156.8M+ import statements. Found 47% CAGR for active packages, 39% for new authors.

**[Analyzing the Accessibility of GitHub Repositories for PyPI and NPM Libraries](https://arxiv.org/abs/2403.03923)** (2024)
*Alexandros Tsakpinis, Alexander Pretschner*
arXiv preprint

Analyzed accessibility of GitHub repositories for libraries using page rank algorithm, finding up to 80.1% of PyPI and 81.1% of npm libraries have repository URLs within dependency chains.

**[A Study of Bloated Dependencies in the Maven Ecosystem](https://link.springer.com/article/10.1007/s10664-020-09914-8)** (2021)
*César Soto-Valero, Nicolas Harrand, Martin Monperrus, Benoit Baudry*
Empirical Software Engineering

Analyzed 9,639 Java artifacts with 723,444 dependency relationships using DepClean tool, finding that bloated dependencies significantly increase binary size and maintenance effort.

**[Goblin: A Framework for Enriching and Querying the Maven Central Dependency Graph](https://dl.acm.org/doi/10.1145/3643991.3644914)** (2024)
*Damien Jaime, Joyce El Haddad, Pascal Poizat*
International Conference on Mining Software Repositories (MSR)

Introduced customizable framework comprising dependency graph metamodel with temporal information, miner for Maven Central, and tool for metric weaving.

**[The Ripple Effect of Vulnerabilities in Maven Central](https://arxiv.org/abs/2504.04175)** (2025)
*Multiple authors*
arXiv preprint

Most recent large-scale Maven vulnerability study analyzing 4 million releases. Found only 1% of releases have direct vulnerabilities, but 46.8% are affected by transitive vulnerabilities. Patch time often spans several years even for critical vulnerabilities. Demonstrates more central artifacts are not necessarily less vulnerable.

**[Out of Sight, Still at Risk: The Lifecycle of Transitive Vulnerabilities in Maven](https://arxiv.org/abs/2504.04803)** (2025)
*Piotr Przymus, Mikołaj Fejzer, Jakub Narębski, Krzysztof Rykaczewski, Krzysztof Stencel*
IEEE/ACM International Conference on Mining Software Repositories (MSR)

Uses survival analysis to measure how long projects remain exposed after CVE introduction. Shows vulnerabilities at deeper dependency levels persist longer due to compounded resolution delays. Mean time to fix rises from 215 days at level 0 to 2,075 days at level 10.

**[How Deep Does Your Dependency Tree Go? An Empirical Study of Dependency Amplification Across 10 Package Ecosystems](https://arxiv.org/abs/2512.14739)** (2025)
*Jahidul Arafat*
arXiv preprint

Studies dependency amplification (ratio of transitive to direct dependencies) across 500 projects in 10 ecosystems. Maven exhibits highest mean amplification at 24.7x compared to 4.3x for npm. Challenges prevailing assumptions that npm's preference for small packages leads to highest amplification.

**[Understanding Software Vulnerabilities in the Maven Ecosystem](https://arxiv.org/abs/2503.22391)** (2025)
*Multiple authors*
MSR 2025 Mining Challenge

Vulnerability analysis of 77,393 vulnerable releases with 226 unique CWEs. Found 25 CWEs account for nearly 70% of all vulnerabilities. Vulnerabilities take approximately 5 years to document and 4.4 years to resolve on average. Input validation and access control issues dominate.

**[Tracing Vulnerabilities in Maven: A Study of CVE lifecycles](https://arxiv.org/abs/2502.04621)** (2025)
*Corey Yang-Smith et al.*
arXiv preprint

Brand new lifecycle and response time analysis of 3,362 CVEs in Maven. Documents "Publish-Before-Patch" scenarios. Response time reduced 48.3% for critical vs low severity vulnerabilities (78 vs 151 days). Contributor absence and issue activity correlate with CVE occurrences.

**[A Large-Scale Security-Oriented Static Analysis of Python Packages in PyPI](https://arxiv.org/abs/2107.12699)** (2021)
*Multiple authors*
arXiv preprint

Largest static analysis of PyPI at time of publication, analyzing 197,000+ packages with 749,000+ security issues. Found 46% of Python packages have at least one security issue. Exception handling and code injections most common. Subprocess module identified as particularly problematic.

**[An Empirical Analysis of the R Package Ecosystem](https://arxiv.org/abs/2109.03251)** (2021)
*Ethan Bommarito, Michael J. Bommarito II*
arXiv preprint

Analysis of 25,000+ packages, 150,000 releases across CRAN, Bioconductor, and GitHub over two decades. Found top 5 packages imported by 25% of all packages, top 10 maintainers support packages imported by 50%+ of ecosystem.

**[A Complex Network Analysis of the Comprehensive R Archive Network (CRAN) Package Ecosystem](https://www.sciencedirect.com/science/article/pii/S0164121220301527)** (2020)
*Multiple authors*
Journal of Systems and Software

Applied complex network analysis to CRAN dependency graph from macroscopic, microscopic, and modular perspectives. Demonstrated how network theory helps profile ecosystem strengths, practices, and risks.

**[Evolution and Prospects of the Comprehensive R Archive Network (CRAN) Package Ecosystem](https://onlinelibrary.wiley.com/doi/10.1002/smr.2288)** (2020)
*Marcelino Mora-Cantallops, Salvador Sánchez-Alonso, Elena García-Barriocanal*
Journal of Software: Evolution and Process

20-year empirical analysis of CRAN evolution considering laws of software evolution and CRAN policies. Found progress consistent with continuous growth/change laws but relevant increase in complexity in recent years.

**[An Empirical Comparison of Dependency Network Evolution in Seven Software Packaging Ecosystems](https://link.springer.com/article/10.1007/s10664-017-9589-y)** (2019)
*Alexandre Decan, Tom Mens, Philippe Grosjean*
Empirical Software Engineering

Quantitative analysis of seven packaging ecosystems (Cargo, CPAN, CRAN, npm, NuGet, Packagist, RubyGems) using libraries.io dataset. Demonstrated important structural differences that complicate cross-ecosystem generalization.

**[The Multibillion Dollar Software Supply Chain of Ethereum](https://arxiv.org/abs/2202.07029)** (2022)
*César Soto-Valero, Martin Monperrus, Benoit Baudry*
arXiv preprint

Examines how Java Ethereum nodes depend on third-party software maintained by various organizations, analyzing the supply chain supporting blockchain infrastructure and highlighting reliability and security challenges from diverse external dependencies.

**[A Closer Look at the Security Risks in the Rust Ecosystem](https://dl.acm.org/doi/10.1145/3624738)** (2024)
*Multiple authors*
ACM Transactions on Software Engineering and Methodology (TOSEM)

First security investigation of Rust ecosystem. Analyzed dataset of 433 vulnerabilities across 300 vulnerable code repositories. Found vulnerable code is localized at file level and contains significantly more unsafe functions/blocks. More popular packages have more vulnerabilities, while less popular packages remain vulnerable for more versions.

**[An empirical study of yanked releases in the rust package registry](https://ieeexplore.ieee.org/document/9732248)** (2023)
*Hao Li, Filipe Cogo, Cor-Paul Bezemer*
IEEE Transactions on Software Engineering

Reveals that 46% of Rust packages adopted yanked releases and the proportion keeps increasing. In Cargo, yanked releases can only be resolved if a lockfile is present.

**[Evolving collaboration, dependencies, and use in the rust open source software ecosystem](https://www.nature.com/articles/s41597-022-01819-z)** (2022)
*William Schueller, Johannes Wachs, Vito D.P. Servedio, Stefan Thurner, Vittorio Loreto*
Scientific Data

Dataset curating Rust ecosystem data over eight years, capturing developer activity, library dependencies, and usage trends.

**[Why do software packages conflict?](https://ieeexplore.ieee.org/document/6224287)** (2012)
*Cyrille Artho, Roberto Di Cosmo, Kuniyasu Suzaki, Stefano Zacchiroli*
IEEE Working Conference on Mining Software Repositories (MSR)

Empirical investigation of root causes of package conflicts in Debian ecosystem, categorizing conflict types and their frequencies.

**[Are There Too Many R Packages?](https://www.ajs.or.at/index.php/ajs/article/view/vol41,%20no1%20-%205)** (2012)
*Multiple authors*
Austrian Journal of Statistics

Analysis questioning the growth and sustainability of the R package ecosystem.

**[The Evolution of the R Software Ecosystem](https://ieeexplore.ieee.org/document/6498472/)** (2013)
*Multiple authors including Ahmed E. Hassan*
Academic publication

Historical analysis of R ecosystem evolution and growth patterns.

**[On the Maintainability of CRAN Packages](https://ieeexplore.ieee.org/document/6747183/)** (2014)
*Tom Mens et al.*
Academic publication

Study examining maintainability challenges in the CRAN ecosystem.

**[On the Development and Distribution of R Packages: An Empirical Analysis of the R Ecosystem](https://dl.acm.org/doi/10.1145/2797433.2797476)** (2015)
*Multiple authors*
Academic publication

Empirical analysis of R package development and distribution patterns.

**[When GitHub meets CRAN: An analysis of inter-repository package dependency problems](https://ieeexplore.ieee.org/document/7476669/)** (2016)
*Multiple authors*
IEEE conference proceedings

Analysis of dependency problems arising from packages split between GitHub and CRAN.

## Version Constraints and Semantic Versioning

Research on versioning practices, semantic versioning adoption, and breaking changes.

**[Dependency Versioning in the Wild](https://dl.acm.org/doi/10.1109/MSR.2019.00059)** (2019)
*Jens Dietrich, David Pearce, Jacob Stringer, Amjed Tahir, Kelly Blincoe*
International Conference on Mining Software Repositories (MSR)

Large-scale empirical study of versioning practices across 17 package managers, analyzing over 70 million dependencies, complemented by survey of 170 developers. Found many package managers support flexible versioning but developers struggle to balance predictability and agility.

**[What do package dependencies tell us about semantic versioning?](https://ieeexplore.ieee.org/document/9240691)** (2021)
*Alexandre Decan, Tom Mens*
IEEE Transactions on Software Engineering

Analyzed relationship between dependency declarations and semantic versioning across multiple package ecosystems, revealing disconnect between versioning theory and developer practices.

**[Technical Lag in Software Compilations: Measuring How Outdated a Software Deployment Is](https://link.springer.com/chapter/10.1007/978-3-319-57735-7_17)** (2017)
*Jesús M. González-Barahona, Paul Sherwood, Gregorio Robles, Daniel Izquierdo*
IFIP International Conference on Open Source Systems (OSS)

Introduces the concept of technical lag for measuring how outdated a deployed system is. Proposes theoretical model to assist decisions about upgrading in production, balancing being up-to-date against keeping working versions.

**[A Formal Framework for Measuring Technical Lag in Component Repositories](https://onlinelibrary.wiley.com/doi/10.1002/smr.2157)** (2019)
*Ahmed Zerouali, Tom Mens, Jesús González-Barahona, Alexandre Decan, Eleni Constantinou, Gregorio Robles*
Journal of Software: Evolution and Process

Formalizes a generic model of technical lag quantifying how outdated a deployed collection of components is. Operationalizes the model for npm and analyzes 500K+ packages over seven years, considering direct and transitive dependencies.

**[On the Evolution of Technical Lag in the npm Package Dependency Network](https://ieeexplore.ieee.org/document/8530047)** (2018)
*Alexandre Decan, Tom Mens, Eleni Constantinou*
IEEE International Conference on Software Maintenance and Evolution (ICSME)

Studied technical lag (outdatedness of dependencies) in npm ecosystem, examining tension between stability and freshness in dependency management.

**[Understanding Breaking Changes in the Wild](https://dl.acm.org/doi/10.1145/3597926.3598140)** (2023)
*Dhanushka Jayasuriya, Valerio Terragni, Jens Dietrich, Samuel Ou, Kelly Blincoe*
ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA)

Empirical study finding 11.58% of dependency updates contain breaking changes that impact clients. Almost half of detected breaking changes violate semantic versioning by appearing in non-major releases.

**[Breaking-Good: Explaining Breaking Dependency Updates with Build Analysis](https://arxiv.org/abs/2407.03880)** (2024)
*Frank Reyes, Benoit Baudry, Martin Monperrus*
arXiv preprint

Automated tool that generates explanations for compilation errors caused by incompatible dependency version changes. Analyzes logs and dependency trees to identify root causes across direct/indirect dependencies, Java version conflicts, and configuration issues. Successfully identified causes for 70% of 243 real breaking updates.

**[Bump: A benchmark of reproducible breaking dependency updates](https://ieeexplore.ieee.org/document/10589731)** (2024)
*Frank Reyes, Yogya Gamage, Gabriel Skoglund, Benoit Baudry, Martin Monperrus*
IEEE International Conference on Software Analysis, Evolution and Reengineering (SANER)

Benchmark dataset of reproducible breaking dependency updates for evaluating tools that detect or explain breaking changes in dependency updates.

**[I depended on you and you broke me: An empirical study of manifesting breaking changes in client packages](https://dl.acm.org/doi/10.1145/3583565)** (2023)
*Daniel Venturini, Filipe Cogo, Igor Polato, Marco Gerosa, Igor Wiese*
ACM Transactions on Software Engineering and Methodology (TOSEM)

Quantitative evaluation of the impact of breaking updates on dependent packages in npm, examining how breaking changes manifest and propagate through the ecosystem.

**[Semantic Versioning versus Breaking Changes: A Study of the Maven Repository](https://www.sciencedirect.com/science/article/pii/S0164121217300018)** (2014, 2017)
*Steven Raemaekers, Arie van Deursen, Joost Visser*
IEEE International Working Conference on Source Code Analysis and Manipulation (SCAM) / Journal of Systems and Software

Analyzed 100,000+ JAR files from Maven Central over 7 years covering 22,000+ libraries. Found approximately one-third of all releases introduce breaking changes, often violating semantic versioning conventions.

**[Breaking Bad? Semantic Versioning and Impact of Breaking Changes in Maven Central](https://link.springer.com/article/10.1007/s10664-021-10052-y)** (2021)
*Lina Ochoa, Thomas Degueule, Jean-Rémy Falleri, Jurgen Vinju*
Empirical Software Engineering

External replication of Raemaekers et al. with different findings: 83.4% of upgrades comply with semver regarding backwards compatibility. Found most breaking changes affect code not used by any client, and only 7.9% of clients are affected by breaking changes.

**[How Java APIs Break – An Empirical Study](https://www.sciencedirect.com/science/article/abs/pii/S0950584915000506)** (2015)
*Kamil Jezek, Jens Dietrich, Premek Brada*
Information and Software Technology

Study of 109 Java open-source programs and 564 versions showing APIs are commonly unstable. Analyzes patterns of API breaking changes and their impact on dependent systems.

**[Why and How Java Developers Break APIs](https://ieeexplore.ieee.org/document/8330214/)** (2018)
*Aline Brito, Laerte Xavier, André Hora, Marco Tulio Valente*
IEEE International Conference on Software Analysis, Evolution and Reengineering (SANER)

Four-month field study with developers of 400 popular Java libraries. Found breaking changes are mostly motivated by implementing new features, simplifying APIs, and improving maintainability. Developers rarely deprecate elements before changes due to maintenance overhead.

**[Has My Release Disobeyed Semantic Versioning? Static Detection Based on Semantic Differencing](https://dl.acm.org/doi/10.1145/3551349.3556956)** (2022)
*Lyuye Zhang, Chengwei Liu, Zhengzi Xu, Sen Chen, Lingling Fan, Bihuan Chen, Yang Liu*
IEEE/ACM International Conference on Automated Software Engineering (ASE) - Distinguished Paper Award

Addresses semantic breaking where APIs have identical signatures but inconsistent semantics. Proposes Sembid tool achieving 90.26% recall. Empirical study on 1.6M APIs found 2-4x more semantic breaking than signature-based issues.

**[When and How to Make Breaking Changes: Policies and Practices in 18 Open Source Software Ecosystems](https://dl.acm.org/doi/10.1145/3447245)** (2021)
*Chris Bogart, Christian Kästner, James Herbsleb, Ferdian Thung*
ACM Transactions on Software Engineering and Methodology (TOSEM)

Comparative study of breaking change policies across 18 ecosystems combining repository mining, document analysis, and large-scale survey. Found practices and values are cohesive within ecosystems but diverse across them. Eclipse's "prime directive" never permits breaking changes; other ecosystems balance differently.

**[Possible directions for improving dependency versioning in R](https://arxiv.org/abs/1303.2140)** (2013)
*Multiple authors*
arXiv preprint

Proposal for improving version handling in the R ecosystem.

## Package Manager Design and Architecture

Research on package manager design principles, architectures, and implementation.

**[LUDE: A Distributed Software Library](https://www.usenix.org/conference/lisa-93/lude-distributed-software-library)** (1993)
*Multiple authors*
USENIX LISA

Early distributed software library system.

**[The Comprehensive TeX Archive Network](https://www.tug.org/TUGboat/Contents/contents14-2.html)** (1993)
*Multiple authors*
TUGboat

Description of CTAN, one of the earliest package repositories.

**[Nix: A Safe and Policy-Free System for Software Deployment](https://edolstra.github.io/pubs/nspfssd-lisa2004-final.pdf)** (2004)
*Eelco Dolstra, Merijn de Jonge, Eelco Visser*
USENIX LISA

Introduced Nix, a purely functional package manager with unique approach to dependency management. Packages are stored in isolation from each other using cryptographic hashes, preventing dependency conflicts and enabling atomic upgrades and rollbacks.

**[The Purely Functional Software Deployment Model](https://edolstra.github.io/pubs/phd-thesis.pdf)** (2006)
*Eelco Dolstra*
PhD Thesis, Utrecht University

The comprehensive treatment of functional package management that the LISA paper summarizes. Develops the theoretical foundations for treating software deployment as a pure function from inputs to outputs, where the cryptographic hash of all build inputs determines the output path. Covers the Nix expression language, the store model, and techniques for achieving reproducible builds.

**[An adaptive package management system for Scheme](https://dblp.org/rec/conf/dls/SerranoG07.html)** (2007)
*Erick Gallesio et al.*
Academic publication

Adaptive package management approach for Scheme programming language.

**[NixOS: a purely functional Linux distribution](https://dl.acm.org/doi/10.1145/1411204.1411255)** (2008)
*Eelco Dolstra, Andres Löh*
ACM SIGPLAN International Conference on Functional Programming (ICFP)

Description of NixOS, a Linux distribution built on Nix package manager. Extends functional package management to system configuration, treating the entire operating system as a function from a declarative specification to a running system.

**[Functional Package Management with Guix](https://arxiv.org/abs/1305.4584)** (2013)
*Ludovic Courtès*
European Lisp Symposium

Introduces GNU Guix, a purely functional package manager building on Nix's deployment model but using Scheme as its implementation and extension language. Demonstrates how an embedded domain-specific language for package definitions allows users to benefit from a general-purpose programming language while maintaining the reproducibility guarantees of functional package management.

**[Reproducible and User-Controlled Software Environments in HPC with Guix](https://link.springer.com/chapter/10.1007/978-3-319-27308-2_47)** (2015)
*Ludovic Courtès, Ricardo Wurmus*
International Conference on High Performance Computing (ISC)

Addresses how HPC support teams struggle to balance conservative system administration with user demands for up-to-date tools. Presents GNU Guix as a solution allowing unprivileged users to install and manage their own software environments while maintaining reproducibility, without requiring root access or containers.

**[The Comprehensive R Archive Network](https://wires.onlinelibrary.wiley.com/doi/abs/10.1002/wics.1212)** (2012)
*Multiple authors*
Wiley Interdisciplinary Reviews

Detailed description of CRAN architecture and design.

**[EasyBuild: Building Software With Ease](https://ieeexplore.ieee.org/document/6495863/)** (2012)
*Multiple authors*
PyHPC Workshop

Framework for building and installing scientific software.

**[maintaineR: A web-based dashboard for maintainers of CRAN packages](https://ieeexplore.ieee.org/document/6976148/)** (2014)
*Multiple authors*
ICSME Tool Demo

Tool for CRAN package maintainers.

**[The Spack Package Manager: Bringing Order to HPC Software Chaos](https://dl.acm.org/doi/10.1145/2807591.2807623)** (2015)
*Todd Gamblin, Matthew LeGendre, Michael R. Collette, Gregory L. Lee, Adam Moody, Bronis R. de Supinski, Scott Futral*
Supercomputing

Package manager designed for HPC environments.

**[SPAM: a Secure Package Manager](https://www.usenix.org/conference/hotsec17/conference-program/presentation/stefan)** (2017)
*Multiple authors*
Academic publication

Design for a security-focused package manager.

**[Managing the Complexity of Large Free and Open Source Package-Based Software Distributions](https://ieeexplore.ieee.org/document/4019575/)** (2006)
*Multiple authors*
ASE

Analysis of complexity challenges in large package distributions.

**[Toward Decentralized Package Management](https://www.researchgate.net/publication/278797326_Toward_a_distributed_package_management_system)** (2011)
*Multiple authors*
Academic publication

Proposal for decentralized package management approaches.

**[MPM: a modular package manager](https://dl.acm.org/doi/10.1145/2000229.2000255)** (2011)
*Multiple authors*
ACM publication

Design of a modular package manager architecture.

**[A modular package manager architecture](https://www.sciencedirect.com/science/article/abs/pii/S0950584912001851)** (2013)
*Roberto Di Cosmo et al.*
Technical report

Detailed architecture for modular package managers.

**[Towards efficient optimization in package management systems](https://alexeyignatiev.github.io/assets/pdf/ijms-icse14-preprint.pdf)** (2014)
*Alexey Ignatiev et al.*
Academic publication

Approaches for optimizing package management operations.

**[Flexible and optimal dependency management via max-smt](https://dl.acm.org/doi/10.1109/ICSE48619.2023.00124)** (2023)
*Donald Pinckney, Federico Cassano, Arjun Guha, Jonathan Bell, Massimiliano Culpo, Todd Gamblin*
IEEE/ACM International Conference on Software Engineering (ICSE)

Introduced unified framework built on Max-SMT solvers to resolve dependencies more systematically, moving beyond ad-hoc algorithms. Demonstrates practical solvers can handle real-world dependency resolution with formal guarantees.

**[Automatic Software Dependency Management using Blockchain](https://norma.ncirl.ie/3300/)** (2018)
*Gavin D'Mello*
Technical report

Exploration of blockchain for dependency management.

**[PubGrub: Next-Generation Version Solving](https://nex3.medium.com/pubgrub-2fb6470504f)** (2018)
*Natalie Weizenbaum*
Medium article

Description of PubGrub algorithm used in Dart's pub package manager.

**[Contour: A Practical System for Binary Transparency](https://arxiv.org/abs/1712.08427)** (2018)
*Multiple authors*
Academic publication

System for binary transparency in software distribution.

## Software Distribution Systems

Research on secure software update systems and distribution frameworks.

**[Survivable Key Compromise in Software Update Systems](https://dl.acm.org/doi/10.1145/1866307.1866315)** (2010)
*Justin Samuel, Nick Mathewson, Justin Cappos, Roger Dingledine*
ACM Conference on Computer and Communications Security (CCS)

Introduced The Update Framework (TUF), a secure software update system that remains secure even when repository keys are compromised. TUF uses role separation, threshold signatures, and offline keys. Led to adoption by Docker, Python, and automotive update systems.

**[Diplomat: Using Delegations to Protect Community Repositories](https://www.usenix.org/conference/nsdi16/technical-sessions/presentation/kuppusamy)** (2016)
*Trishank Karthik Kuppusamy, Santiago Torres-Arias, Vladimir Diaz, Justin Cappos*
USENIX Symposium on Networked Systems Design and Implementation (NSDI)

Extended TUF to work efficiently with large community repositories like PyPI and RubyGems. Introduced delegation mechanisms allowing package repositories to scale to hundreds of thousands of packages while maintaining security guarantees.

**[CHAINIAC: Proactive Software-Update Transparency via Collectively Signed Skipchains and Verified Builds](https://www.usenix.org/conference/usenixsecurity17/technical-sessions/presentation/nikitin)** (2017)
*Kirill Nikitin, Eleftherios Kokoris-Kogias, Philipp Jovanovic, Nicolas Gailly, Linus Gasser, Ismail Khoffi, Justin Cappos, Bryan Ford*
USENIX Security Symposium

Proposed decentralized software-update framework eliminating single points of failure through independent witness servers. Evaluation shows clients achieve security comparable to verifying every update while consuming only one-fifth of the bandwidth.

**[Uptane: Securing Software Updates for Automobiles](https://ieeexplore.ieee.org/document/8278174)** (2016, 2018)
*Trishank Karthik Kuppusamy, Akshay Dua, Russ Bielawski, Cameron Mott, Sam Lauzon, Andre Weimerskirch, Akan Brown, Sebastien Awwad, Damon McCoy, Justin Cappos*
escar Europe / IEEE Vehicular Technology Magazine

First software update framework for automobiles capable of resisting nation-state level attacks. Based on TUF but adapted for automotive constraints. Became IEEE/ISTO standard in 2019.

**[Your Firmware Has Arrived: A Study of Firmware Update Vulnerabilities](https://www.usenix.org/conference/usenixsecurity24/presentation/wu-yuhao)** (2024)
*Yuhao Wu, Jinwen Wang, Yujie Wang, Shixuan Zhai, Zihan Li, Yi He, Kun Sun, Qi Li, Ning Zhang*
USENIX Security Symposium

Proposed ChkUp tool to detect firmware update vulnerabilities by resolving program execution paths. Analyzing 12,000 firmware images, identifies vulnerabilities stemming from incomplete or incorrect verification steps.

**[Formal Security Analysis of Electronic Software Distribution Systems](https://link.springer.com/chapter/10.1007/978-3-540-87698-4_14)** (2008)
*M. Maidl, D. von Oheimb, P. Hartmann, R. Robinson*
International Conference on Computer Safety, Reliability, and Security (SAFECOMP)

Introduced software distribution system architecture with generic core component for secure software transport. Used formal methods to validate system security for critical embedded systems.

**[Reflections on Trusting Trust](https://dl.acm.org/doi/10.1145/358198.358210)** (1984)
*Ken Thompson*
Communications of the ACM

Classic paper on trust in software compilation and distribution.

## Malicious Packages and Typosquatting

Research on detection and analysis of malicious packages in ecosystems.

**[An Empirical Study of Malicious Code in PyPI Ecosystem](https://ieeexplore.ieee.org/document/10298430)** (2023)
*Wenbo Guo, et al.*
IEEE/ACM International Conference on Automated Software Engineering (ASE)

Large-scale empirical study with dataset of 4,669 malicious code samples from PyPI. Found 74.81% of malicious packages enter user systems via source code installation.

**[Killing Two Birds with One Stone: Malicious Package Detection in NPM and PyPI using a Single Model of Malicious Behavior Sequence](https://arxiv.org/abs/2309.02637)** (2024)
*Junan Zhang, Kaifeng Huang, et al.*
ACM Transactions on Software Engineering and Methodology

Proposed Cerebro, unified detection model for malicious packages across npm and PyPI using behavior sequence analysis with BERT. Detected 683 malicious PyPI packages and 799 npm packages.

**[Malicious Package Detection using Metadata Information](https://arxiv.org/abs/2402.07444)** (2024)
*S. Halder, et al.*
ACM Web Conference (WWW)

Introduced MeMPtec, metadata-based malicious package detection model. Demonstrates resistance to adversarial attacks with 85.2% precision and 91.8% recall.

**[On the Feasibility of Detecting Injections in Malicious npm Packages](https://dl.acm.org/doi/10.1145/3524842.3528494)** (Year TBD)
*Various authors*
ACM conference proceedings

Analyzed 361 malicious npm artifacts covering typosquatting, combosquatting, and package hijacking, providing insights into attack patterns.

**[SpellBound: Defending Against Package Typosquatting](https://arxiv.org/abs/2003.03471)** (2020)
*Matthew Taylor, Ruturaj K. Vaidya, Drew Davidson, Lorenzo De Carli, Vaibhav Rastogi*
arXiv preprint

Proposed TypoGard, a detection technique based on analysis of npm and PyPI leveraging lexical similarity between names and package popularity. Evaluation showed TypoGard flags up to 99.4% of known typosquatting cases while generating limited warnings (0.5% of package installs) and low overhead (2.5% of package install time).

**[Typosquatting and Combosquatting Attacks on the Python Ecosystem](https://ieeexplore.ieee.org/document/9229803/)** (2020)
*Duc-Ly Vu, Ivan Pashchenko, Fabio Massacci, Henrik Plate, Antonino Sabetta*
IEEE European Symposium on Security and Privacy Workshops (Euro S&P)

Studies typosquatting and combosquatting attacks on PyPI. Combosquatting exploits mistakes in the order of package names consisting of multiple nouns (e.g., "python-nmap" typed as "nmap-python"). Proposes automated approach to identify combosquatting and typosquatting package names.

**[Practical Automated Detection of Malicious npm Packages](https://dl.acm.org/doi/10.1145/3510003.3510104)** (2022)
*Adriana Sejfia, Max Schäfer*
IEEE/ACM International Conference on Software Engineering (ICSE)

Presents Amalfi, combining ML classifiers, a reproducer for identifying packages rebuildable from source, and a clone detector for known malicious packages. Identified 95 previously unknown malicious packages over seven days. Found malicious packages more likely to contain minified code or binaries.

**[TypoSmart: A Low False-Positive System for Detecting Malicious and Stealthy Typosquatting Threats in Package Registries](https://arxiv.org/abs/2502.20528)** (2025)
*Multiple authors*
arXiv preprint

First scalable deployment of a typosquatting detection system that addresses key limitations by leveraging package metadata. Improved neighbor search speeds by 73-91% and reduced false positives by 70.4% compared to prior work. Being used in production, contributing to removal of 3,658 typosquatting threats in one month.

**[Dependency Confusion: How I Hacked Into Apple, Microsoft and Dozens of Other Companies](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610)** (2021)
*Alex Birsan*
Medium blog post / Security research

Revealed dependency confusion attack that exploits package managers pulling higher-versioned packages from public repositories when private packages exist with the same name. Successfully compromised over 35 major companies including Microsoft, Apple, PayPal, Shopify, Netflix, and Tesla. Awarded over $130,000 in bug bounties.

## Package Metadata and Trust Models

Research on metadata systems, signing, and trust frameworks.

**[Why Software Signing (Still) Matters: Trust Boundaries in the Software Supply Chain](https://arxiv.org/abs/2407.20861)** (2024)
*Multiple authors*
arXiv preprint

Analyzed when registry hardening renders signing redundant versus when signing is necessary, examining trust boundaries in software distribution.

**[An Industry Interview Study of Software Signing for Supply Chain Security](https://www.usenix.org/conference/usenixsecurity25/presentation/kalu)** (2025)
*Kelechi G. Kalu, James C. Davis*
USENIX Security Symposium

Qualitative study interviewing 18 experienced security practitioners across 13 organizations to understand software signing practices and challenges. Shows that experts disagree on signing importance.

**[Signing in Four Public Software Package Registries: Quantity, Quality, and Influencing Factors](https://ieeexplore.ieee.org/document/10646685)** (2024)
*Taylor R. Schorlemmer, Kelechi G. Kalu, Luke Chigges, Kyung Myung Ko, Elizabeth A. Ishgair, Saurabh Bagchi, Santiago Torres-Arias, James C. Davis*
IEEE Symposium on Security and Privacy (S&P)

Study of software signing adoption in Maven, PyPI, DockerHub and Huggingface, finding strict signature rules increase the quantity of signatures and registry policies impact developer decisions.

**[A systematic literature review on trust in the software ecosystem](https://link.springer.com/article/10.1007/s10664-022-10238-y)** (2022)
*Multiple authors*
Empirical Software Engineering

Systematic literature review examining trust in software ecosystems, including relationships between end-users and software products, package managers, software producing organizations, and software engineers. Addresses how trust is frequently violated by bad actors and vulnerabilities in the software supply chain.

**[Sigstore: Software Signing for Everybody](https://dl.acm.org/doi/10.1145/3548606.3560596)** (2022)
*Zachary Newman, John Speed Meyers, Santiago Torres-Arias*
ACM Conference on Computer and Communications Security (CCS)

Academic analysis of Sigstore's keyless signing infrastructure. Describes formal attacker model and possible attack avenues. Sigstore uses identity-based signing (OAuth/OIDC) rather than traditional key management, now adopted by npm, PyPI, and major Linux distributions.

## Dependency Management Bots

Research on automated dependency management tools like Dependabot and Renovate.

**[On the use of dependabot security pull requests](https://ieeexplore.ieee.org/document/9463091)** (2021)
*Mahmoud Alfadel, Diego Elias Costa, Emad Shihab, Moiz Mkhallalati*
IEEE/ACM International Conference on Mining Software Repositories (MSR)

Evaluates how developers respond to security updates suggested by Dependabot, finding varying acceptance rates across ecosystems.

**[Investigating the resolution of vulnerable dependencies with dependabot security updates](https://ieeexplore.ieee.org/document/10172658)** (2023)
*Hadi Mohayeji, Ani Agaronian, Eleni Constantinou, Nicola Zannone, Alexander Serebrenik*
IEEE/ACM International Conference on Mining Software Repositories (MSR)

Investigates how Dependabot helps mitigate vulnerabilities, noting it uses lockfiles to create dependency graphs.

**[Securing dependencies: A comprehensive study of dependabot's impact on vulnerability mitigation](https://link.springer.com/article/10.1007/s10664-025-10638-w)** (2025)
*Hadi Mohayeji, Ani Agaronian, Eleni Constantinou, Nicola Zannone, Alexander Serebrenik*
Empirical Software Engineering

Follow-up study on Dependabot's effectiveness for vulnerability mitigation across projects.

**[There's no such thing as a free lunch: Lessons learned from exploring the overhead introduced by the greenkeeper dependency bot in npm](https://dl.acm.org/doi/10.1145/3583029)** (2023)
*Benjamin Rombaut, Filipe Cogo, Bram Adams, Ahmed E. Hassan*
ACM Transactions on Software Engineering and Methodology (TOSEM)

Studies whether Greenkeeper reduces developer effort or introduces unnecessary workload. Mentions lockfiles as a way to overcome in-range breaking changes.

## Software Composition Analysis

Research on library usage, updates, and composition analysis tools.

**[Software ecosystem call graph for dependency management](https://doi.org/10.1145/3183399.3183417)** (2018)
*Joseph Hejderup, Arie van Deursen, Georgios Gousios*
IEEE/ACM International Conference on Software Engineering: New Ideas and Emerging Results (ICSE-NIER)

Proposes moving beyond package-level dependency analysis to call-graph level, enabling finer-grained understanding of which functions are actually used from dependencies.

**[Präzi: From Package-based to Call-based Dependency Networks](https://arxiv.org/abs/2101.09563)** (2021)
*Joseph Hejderup, Moritz Beller, Konstantinos Triantafyllou, Georgios Gousios*
arXiv preprint

Extends call-graph dependency analysis with Präzi, constructing fine-grained dependency networks at the function level rather than package level. Enables more precise vulnerability impact analysis and identifies unused transitive dependencies.

**[Towards Understanding Third-Party Library Dependency in C/C++ Ecosystem](https://dl.acm.org/doi/10.1145/3551349.3556898)** (2022)
*Wei Tang, Zhengzi Xu, Chengwei Liu, Jiahui Wu, Shouguo Yang, Yi Li, Ping Luo, Yang Liu*
IEEE/ACM International Conference on Automated Software Engineering (ASE)

First large-scale C/C++ dependency study addressing lack of unified package manager. Analyzed 24K repositories revealing 71.5% dependencies handled in Install phase.

**[A Machine Learning Approach for Vulnerability Curation](https://dl.acm.org/doi/10.1145/3379597.3387470)** (2020)
*Chen Yang, Andrew Santosa, Ang Ming Yi, Abhishek Sharma, Asankhaya Sharma, David Lo*
International Conference on Mining Software Repositories (MSR)

Designed ML system to automatically predict vulnerability-relatedness of data items for software composition analysis databases.

**[An Exploratory Study on Library Aging by Monitoring Client Usage in a Software Ecosystem](https://ieeexplore.ieee.org/document/7884643/)** (2017)
*Multiple authors*
SANER

Study of library aging patterns through client usage monitoring.

**[Do Developers Update Their Library Dependencies?](https://link.springer.com/article/10.1007/s10664-017-9521-5)** (2018)
*Raula Gaikovina Kula, Daniel M. German, Ali Ouni, Takashi Ishio, Katsuro Inoue*
Empirical Software Engineering

Empirical study on library migration covering 4,600+ GitHub projects and 2,700 library dependencies. Found 81.5% of systems keep outdated dependencies, and developers rarely respond to security advisories. Introduced the Library Migration Plot (LMP) visualization.

**[A Large-Scale Empirical Study on Java Library Migrations: Prevalence, Trends, and Rationales](https://dl.acm.org/doi/10.1145/3468264.3468571)** (2021)
*Hao He, Runzhi He, Haiqiao Gu, Minghui Zhou*
ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/FSE)

Commit-level analysis of 19,652 Java projects extracting 1,194 migration rules and 3,163 migration commits. Found migrations dominated by logging, JSON, testing, and web service domains. Identified 14 migration reasons, 7 not discussed in prior work.

**[Modeling Library Dependencies and Updates in Large Software Repository Universes](https://arxiv.org/abs/1709.04626)** (2017)
*Raula Gaikovina Kula, Coen De Roover, Daniel M. German, Takashi Ishio, Katsuro Inoue*
arXiv preprint

Proposes the Software Universe Graph (SUG) to model library dependency and update information mined from Maven. Leverages "wisdom of the crowd" to recommend library updates based on what other projects have adopted.

**[The emergence of software diversity in maven central](https://arxiv.org/abs/1903.05394)** (2019)
*Multiple authors*
arXiv preprint

Analysis of software diversity patterns in Maven Central.

**[On the use of package managers by the C++ open-source community](https://dl.acm.org/doi/10.1145/3167132.3167290)** (2018)
*Multiple authors*
SAC

Study of package manager adoption in C++ open source.

**[Beyond Dependencies: The Role of Copy-Based Reuse in Open Source Software Development](https://dl.acm.org/doi/10.1145/3712057)** (2025)
*Mahmoud Jahanshahi, David Reid, Audris Mockus*
ACM Transactions on Software Engineering and Methodology

Studies how code copying (not just dependency declaration) affects software reuse patterns, examining the relationship between formal dependencies and actual code reuse in open source.

**[A Longitudinal Analysis of Bloated Java Dependencies](https://www.researchgate.net/publication/351978531_A_Longitudinal_Analysis_of_Bloated_Java_Dependencies)** (2021)
*Multiple authors*
ResearchGate / Academic publication

Longitudinal study examining bloated dependencies in Java projects over time. Analyzes how dependency bloat evolves and accumulates in Maven-based projects.

**[Longitudinal Analysis of Software Dependencies in Large-Scale Systems](https://link.springer.com/article/10.1007/s10664-025-10638-w)** (2025)
*Multiple authors*
Empirical Software Engineering

Recent longitudinal analysis of software dependencies examining long-term patterns and evolution of dependency management practices in large-scale systems.

## Ecosystem Evolution and Developer Behavior

Research on how ecosystems and developer practices evolve over time.

**[An Empirical Study of API Stability and Adoption in the Android Ecosystem](https://ieeexplore.ieee.org/document/6624028)** (2013)
*Tyler McDonnell, Baishakhi Ray, Miryung Kim*
IEEE International Conference on Software Maintenance (ICSM) - Most Influential Paper Award 2023

Found Android API evolves at 115 updates per month on average, but client adoption doesn't keep pace. Established API stability and adoption as a vital research area, inspiring subsequent work on automating API migration and change impact analysis.

**[Understanding the Response to Open-Source Dependency Abandonment in the npm Ecosystem](https://www.cs.cmu.edu/~ckaestne/pdf/icse25_abandonment.pdf)** (2025)
*Courtney Miller, Mahmoud Jahanshahi, Audris Mockus, Bogdan Vasilescu, Christian Kästner*
IEEE/ACM International Conference on Software Engineering (ICSE)

Studies how developers respond when their dependencies are abandoned, analyzing response patterns and mitigation strategies in the npm ecosystem.

**[Underproduction: An Approach for Measuring Risk in Open Source Software](https://ieeexplore.ieee.org/document/9426043/)** (2021)
*Kaylea Champion, Benjamin Mako Hill*
IEEE International Conference on Software Analysis, Evolution and Reengineering (SANER)

Introduces framework for identifying underproduction where software engineering labor supply is misaligned with demand. Applied to 21,902 Debian packages and 461,656 bugs, finding at least 4,327 packages are underproduced. Desktop environments particularly at risk.

**[Deprecation of Packages and Releases in Software Ecosystems: A Case Study on npm](https://ieeexplore.ieee.org/document/9351569/)** (2022)
*Filipe Cogo, Gustavo Oliva, Ahmed E. Hassan*
IEEE Transactions on Software Engineering

Examines npm's deprecation mechanism. Found 3.7% of packages have at least one deprecated release, and 66% of those have deprecated all releases, preventing migration to replacements. Transitive adoption of deprecated releases is challenging to track.

**[The Evolution of Project Inter-dependencies in a Software Ecosystem: The Case of Apache](https://ieeexplore.ieee.org/document/6676899/)** (2013)
*Gabriele Bavota, Gerardo Canfora, Massimiliano Di Penta, Rocco Oliveto*
IEEE International Conference on Software Maintenance (ICSM)

Exploratory study of 147 Apache Java projects over 14 years (1,964 releases), examining how dependency relationships evolve and when projects decide to upgrade dependencies.

**[How the Apache Community Upgrades Dependencies: An Evolutionary Study](https://link.springer.com/article/10.1007/s10664-014-9325-9)** (2015)
*Gabriele Bavota, Gerardo Canfora, Massimiliano Di Penta, Rocco Oliveto, Sebastiano Panichella*
Empirical Software Engineering

Follow-up study examining when and why Apache projects upgrade their dependencies, identifying patterns in upgrade decisions.

**[A Graph-Based Approach to API Usage Adaptation](https://dl.acm.org/doi/10.1145/1869459.1869486)** (2010)
*Hoan Anh Nguyen, Tung Thanh Nguyen, Gary Wilson Jr., Anh Tuan Nguyen, Miryung Kim, Tien Nguyen*
ACM SIGPLAN Conference on Object-Oriented Programming, Systems, Languages, and Applications (OOPSLA)

Introduces LIBSYNC, which learns complex API usage adaptation patterns from other clients that already migrated to a new library version, guiding developers through API migrations.

**[Influences on developer participation in the Debian software ecosystem](https://www.sciencedirect.com/science/article/abs/pii/S0167624508000346)** (2011)
*Multiple authors*
Academic publication

Analysis of factors affecting developer participation in Debian.

**[A historical analysis of Debian package incompatibilities](https://ieeexplore.ieee.org/document/7180081/)** (2015)
*Multiple authors*
Academic publication

Historical perspective on package incompatibilities in Debian.

**[Why Do Developers Use Trivial Packages? An Empirical Case Study on npm](https://dl.acm.org/doi/10.1145/3106237.3106267)** (2017)
*Suhaib Mujahid et al.*
Academic publication

Investigation of why developers depend on trivial packages.

**[On the Impact of Using Trivial Packages: An Empirical Case Study on npm and PyPI](https://link.springer.com/article/10.1007/s10664-019-09792-9)** (2020)
*Rabe Abdalkareem, Vinicius Oda, Suhaib Mujahid, Emad Shihab*
Empirical Software Engineering

Follow-up study finding 16% of npm and 10.5% of PyPI packages are trivial. Survey of 125 developers found they believe trivial packages are well-tested, but only 28% of npm and 49% of PyPI trivial packages actually have tests. 18.4% of npm trivial packages have more than 20 dependencies.

**[Towards Smoother Library Migrations: A Look at Vulnerable Dependency Migrations at Function Level for npm JavaScript Packages](https://ieeexplore.ieee.org/document/8530065/)** (2018)
*Multiple authors*
IEEE publication

Study of library migration patterns for vulnerability fixes.

**[On the diversity of software package popularity metrics: An empirical study of npm](https://arxiv.org/abs/1901.04217)** (2019)
*Multiple authors*
arXiv preprint

Analysis of different popularity metrics in npm ecosystem.

**[Are Software Dependency Supply Chain Metrics Useful in Predicting Change of Popularity of npm Packages?](https://dl.acm.org/doi/10.1145/3273934.3273942)** (2018)
*Tapajit Dey, Audris Mockus*
International Conference on Predictive Models and Data Analytics in Software Engineering (PROMISE)

Investigates whether supply chain metrics (dependency relationships, update patterns) can predict changes in npm package popularity.

**[Ecosystem-Level Determinants of Sustained Activity in Open-Source Projects: A Case Study of the PyPI Ecosystem](https://dl.acm.org/doi/abs/10.1145/3236024.3236062)** (2018)
*Multiple authors*
FSE

Study of factors contributing to sustained activity in PyPI.

**[When It Breaks, It Breaks: How Ecosystem Developers Reason about the Stability of Dependencies](https://ieeexplore.ieee.org/document/7426643/)** (2015)
*Multiple authors*
CMU Technical Report

Investigation of how developers reason about dependency stability.

**[How to Break an API: Cost Negotiation and Community Values in Three Software Ecosystems](https://dl.acm.org/doi/10.1145/2950290.2950325)** (2016)
*Multiple authors*
ACM publication

Study of API breaking changes across three ecosystems.

**[An ecosystemic and socio-technical view on software maintenance and evolution](https://ieeexplore.ieee.org/document/7816449/)** (2016)
*Multiple authors*
Academic publication

Socio-technical perspective on ecosystem maintenance.

**[On the topology of package dependency networks: a comparison of three programming language ecosystems](https://dl.acm.org/doi/10.1145/2993412.3003382)** (2016)
*Multiple authors*
Academic publication

Topological analysis of dependency networks.

**[Structure and Evolution of Package Dependency Networks](https://ieeexplore.ieee.org/document/7962360/)** (2017)
*Multiple authors*
TU Delft publication

Analysis of dependency network structure and evolution.

**[An Empirical Comparison of Developer Retention in the RubyGems and npm Software Ecosystems](https://arxiv.org/abs/1708.02618)** (2017)
*Multiple authors*
arXiv preprint

Comparison of developer retention across ecosystems.

**[Culture and Breaking Change: A Survey of Values and Practices in 18 Open Source Software Ecosystems](https://kilthub.cmu.edu/articles/dataset/Culture_and_Breaking_Change_A_Survey_of_Values_and_Practices_in_18_Open_Source_Software_Ecosystems/5108716)** (2017)
*Multiple authors*
Figshare

Survey of cultural values around breaking changes.

**[A generalized model for visualizing library popularity, adoption, and diffusion within a software ecosystem](https://ieeexplore.ieee.org/document/8330217/)** (2018)
*Raula et al.*
NAIST publication

Model for visualizing library adoption patterns.

**[Release synchronization in software ecosystems](https://ieeexplore.ieee.org/document/8802690/)** (2019)
*Multiple authors*
ACM publication

Study of release coordination across ecosystem projects.

**[Steering insight: An exploration of the ruby software ecosystem](https://link.springer.com/chapter/10.1007/978-3-642-21544-5_5)** (2011)
*Multiple authors*
Academic publication

Exploration of Ruby ecosystem characteristics.

**[Socio-technical evolution of the Ruby ecosystem in GitHub](https://ieeexplore.ieee.org/document/7884607)** (2017)
*Constantinou, Mens*
SANER

Analysis of Ruby ecosystem evolution on GitHub.

**[How do developers react to API deprecation? The case of a Smalltalk ecosystem](https://dl.acm.org/doi/10.1145/2393596.2393662)** (2012)
*Multiple authors*
FSE

Study of developer responses to API deprecation.

**[A study of ripple effects in software ecosystems](https://ieeexplore.ieee.org/document/6032548/)** (2011)
*Multiple authors*
ICSE

Analysis of how changes ripple through ecosystems.

**[How do developers react to API evolution? The Pharo ecosystem case](https://inria.hal.science/hal-01185736)** (2015)
*Multiple authors*
HAL archives

Case study of API evolution in Pharo.

**[How do developers react to API evolution? A large-scale empirical study](https://link.springer.com/article/10.1007/s11219-016-9344-4)** (2018)
*Multiple authors*
Academic publication

Large-scale study of API evolution responses.

**[Software engineering with reusable components](https://link.springer.com/book/10.1007/978-3-662-03345-6)** (1997)
*Multiple authors*
Academic publication

Early work on component reuse in software engineering.

**[A method to generate traverse paths for eliciting missing requirements](https://dl.acm.org/doi/10.1145/3290688.3290697)** (2019)
*Multiple authors*
ACM publication

Method for identifying missing requirements through path analysis.

**[Mining component repositories for installability issues](https://ieeexplore.ieee.org/document/7180064/)** (2015)
*Roberto Di Cosmo et al.*
MSR

Mining approach for finding installability problems.

**[Measuring the Health of Open Source Software Ecosystems: Beyond the Scope of Project Health](https://www.sciencedirect.com/science/article/abs/pii/S0950584914000871)** (2014)
*Slinger Jansen*
Information and Software Technology

First model for measuring open source ecosystem health, evaluating productivity, robustness, and niche creation. Distinguishes ecosystem health from project health, recognizing that ecosystem health involves multiple interrelated projects, contributors, and end-users.

**[Software Ecosystems Governance - A Systematic Literature Review and Research Agenda](https://www.scitepress.org/Papers/2017/62694/)** (2017)
*Carina Alves, Joyce Oliveira, Slinger Jansen*
ICEIS

Systematic literature review examining how software ecosystems should be managed and controlled. Analyzed 63 studies and classified governance mechanisms into value creation, coordination of players, and organizational openness and control.

**[Giving Back: Contributions Congruent to Library Dependency Changes in a Software Ecosystem](https://arxiv.org/abs/2205.13231)** (2022)
*Supatsara Wattanakriengkrai, Dong Wang, Raula Gaikovina Kula, Christoph Treude, Patanamon Thongtanunam, Takashi Ishio, Kenichi Matsumoto*
arXiv preprint

Empirical study of how developers contribute to open-source libraries in relation to dependency changes within npm. Analyzed over 5.3 million commits across 107,242 packages to measure dependency-contribution congruence. Found a statistically significant relationship between such contributions and whether packages become dormant.

**[An empirical study of software ecosystem related tweets by npm maintainers](https://peerj.com/articles/cs-1669/)** (2023)
*Syful Islam, Yusuf Sulistyo Nugroho, et al.*
PeerJ Computer Science

Analyzed approximately 1,176 tweets from npm package maintainers to categorize discussion topics, communication styles, and emotional tone. Found package management issues dominate discussions and maintainers express predominantly neutral sentiment about technical matters.

## LLMs and Package Hallucinations (Slopsquatting)

Recent research on how large language models hallucinate non-existent packages, creating new supply chain attack vectors.

**[We Have a Package for You! An Analysis of Package Hallucinations by Code Generating LLMs](https://arxiv.org/abs/2406.10279)** (2024)
*Multiple authors from University of Texas at San Antonio, Virginia Tech, University of Oklahoma*
arXiv preprint | [GitHub](https://github.com/Spracks/PackageHallucination)

Analysis using 16 popular LLMs and 2 prompt datasets for Python and JavaScript code generation, producing 576,000 code samples. Found 440,445 (19.7%) were hallucinations, including 205,474 unique non-existent packages. Average hallucination rate of 5.2% for commercial models and 21.7% for open-source models. Demonstrates how attackers can exploit LLM hallucinations by registering fake packages.

**[Importing Phantoms: Measuring LLM Package Hallucination Vulnerabilities](https://arxiv.org/abs/2501.19012)** (2025)
*Arjun Krishna, Erick Galinkin, Leon Derczynski, Jeffrey Martin*
arXiv preprint

Examines package hallucinations across multiple programming languages (Python, JavaScript, Rust) for different tasks across different LLMs. Found package hallucination rate depends on model choice, programming language, model size, and task specificity. Discovered inverse correlation between package hallucination rate and HumanEval coding benchmark. Shows coding models are not being optimized for secure code generation.

**[HFuzzer: Testing Large Language Models for Package Hallucinations via Phrase-based Fuzzing](https://arxiv.org/abs/2509.23835)** (2025)
*Multiple authors*
arXiv preprint

First framework to introduce fuzzing into testing LLMs for package hallucinations. Adopts phrase-based fuzzing to guide models to generate diverse coding tasks. Triggers package hallucinations across all tested models. Identifies 2.60× more unique hallucinated packages compared to mutational fuzzing frameworks. Found 46 unique hallucinated packages when testing GPT-4o.

**[AI-Induced Supply-Chain Compromise: A Systematic Review of Package Hallucinations and Slopsquatting Attacks](https://www.researchsquare.com/article/rs-8007192/v1)** (2025)
*Multiple authors*
Research Square preprint

Systematic review of package hallucinations and slopsquatting attacks where malicious actors exploit LLMs' tendency to generate non-existent package names. Coined term "slopsquatting" by security researcher Seth Larson. Analyzes how adversaries can register hallucinated package names in public registries with malware payloads.

**[An Empirical Study of Vulnerable Package Dependencies in LLM Repositories](https://arxiv.org/abs/2508.21417)** (2025)
*Multiple authors*
arXiv preprint

Empirical analysis of 52 open-source LLMs examining third-party dependencies and vulnerabilities. Found half of vulnerabilities in LLM ecosystem remain undisclosed for more than 56.2 months, and 75.8% of LLMs include vulnerable dependencies. GitHub's Top 100 AI projects reference on average 208 direct and transitive dependencies, with 15% containing 10+ known vulnerabilities.

**[The Hidden Risks of LLM-Generated Web Application Code: A Security-Centric Evaluation](https://arxiv.org/abs/2504.20612)** (2025)
*Multiple authors*
arXiv preprint

Security evaluation of LLM-generated web application code finding over 40% of AI-generated solutions contain security flaws. Common issues include missing input sanitization, authentication mechanism vulnerabilities, and dependency overuse that expands attack surface.

**[Large Language Models and Code Security: A Systematic Literature Review](https://arxiv.org/abs/2412.15004)** (2024)
*Multiple authors*
arXiv preprint

Systematic literature review examining LLMs in code security, covering vulnerabilities to remediation approaches. Analyzes common security vulnerabilities in AI-generated code across multiple languages and models.

If you're aware of research that should be included in this collection, please reach out on [Mastodon](https://mastodon.social/@andrewnez) or submit a pull request on [GitHub](https://github.com/andrew/nesbitt.io/blob/master/_posts/2025-11-13-package-management-papers.md).
