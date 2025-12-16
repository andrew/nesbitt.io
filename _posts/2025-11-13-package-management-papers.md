---
layout: post
title: "Package Management Papers"
date: 2025-11-13 12:00 +0000
description: "A collection of academic research papers on package management systems, dependency resolution, supply chain security, and software ecosystems."
tags:
  - package management
  - research
  - security
  - dependencies
  - software ecosystems
---

There's been all kinds of interesting academic research on package management systems, dependency resolution algorithms, software supply chain security, and package ecosystem analysis over the years. Below is a curated list of papers I've found interesting, it's not exhaustive but covers a good chunk of the literature.

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

**[Empirical Analysis of Security Vulnerabilities in Python Packages](https://ieeexplore.ieee.org/document/9678615)** (2021)
*Various authors*
IEEE conference proceedings

Analysis of 550 vulnerability reports affecting 252 Python packages in PyPI ecosystem, providing empirical evidence about vulnerability patterns in Python packages.

## Dependency Resolution Algorithms and Challenges

Research establishing the theoretical complexity of dependency resolution and practical solutions.

**[OPIUM: Optimal Package Install/Uninstall Manager](https://cseweb.ucsd.edu/~lerner/papers/opium.pdf)** (2007)
*Chris Tucker, David Shuffelton, Ranjit Jhala, Sorin Lerner*
International Conference on Software Engineering (ICSE)

Introduced complete dependency solver using SAT, pseudo-boolean optimization, and Integer Linear Programming. OPIUM guarantees completeness and optimizes user-defined objectives. Demonstrated 23.3% of Debian users encounter apt-get's incompleteness failures.

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

**[On software component co-installability](https://dl.acm.org/doi/10.1145/2025113.2025149)** (2011)
*Roberto Di Cosmo, Jérôme Vouillon*
SIGSOFT Symposium on the Foundations of Software Engineering (FSE)

Addressed fundamental challenge of determining which software components can be installed together, developing formal framework with graph-theoretic transformations to simplify dependency repositories while preserving co-installability properties.

**[Strong dependencies between software components](https://dl.acm.org/doi/10.1109/ESEM.2009.5314231)** (2009)
*Pietro Abate, Roberto Di Cosmo, Jaap Boender, Stefano Zacchiroli*
ACM/IEEE International Symposium on Empirical Software Engineering and Measurement (ESEM)

Studied strong dependency relationships where packages are tightly coupled, analyzing patterns of mandatory co-installation and implications for system evolution.

**[Stork: Secure Package Management For VM Environments](https://www.cs.arizona.edu/sites/default/files/TR08-04.pdf)** (2008)
*Justin Cappos*
Dissertation (University of Arizona) -- Chapter 3.8

The earliest known work to describe backtracking dependency resolution.  In contrast to more mathematically advanced techniques, this tries the best match greedily for each package and then rewinds state if there is a conflict.  Through practical use in Stork, this was found to work well for adopters, despite its simplcity.  

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

**[Software Supply Chain: Review of Attacks, Risk Assessment Strategies and Security Controls](https://arxiv.org/abs/2308.07920)** (2023)
*Betul Gokkaya, et al.*
arXiv preprint

Systematic literature review analyzing common software supply chain attacks and providing latest trends. Identified security risks for open-source and third-party software supply chains.

**[Challenges of Producing Software Bill Of Materials for Java](https://arxiv.org/abs/2303.11102)** (2023)
*Musard Balliu, Benoit Baudry, Sofia Bobadilla, Mathias Ekstedt, Martin Monperrus, Javier Ron, Aman Sharma, Gabriel Skoglund, César Soto-Valero, Martin Wittlinger*
arXiv preprint

Evaluated six SBOM generation tools on complex open-source Java projects, identifying hard challenges for accurate SBOM production and usage in software supply chain security contexts.

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

**[Semantic Versioning versus Breaking Changes: A Study of the Maven Repository](https://www.sciencedirect.com/science/article/pii/S0164121217300018)** (2014, 2017)
*Steven Raemaekers, Arie van Deursen, Joost Visser*
IEEE International Working Conference on Source Code Analysis and Manipulation (SCAM) / Journal of Systems and Software

Analyzed 100,000+ JAR files from Maven Central over 7 years covering 22,000+ libraries. Found approximately one-third of all releases introduce breaking changes, often violating semantic versioning conventions.

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
*Multiple authors*
USENIX LISA

Introduced Nix, a purely functional package manager with unique approach to dependency management.

**[An adaptive package management system for Scheme](https://dblp.org/rec/conf/dls/SerranoG07.html)** (2007)
*Erick Gallesio et al.*
Academic publication

Adaptive package management approach for Scheme programming language.

**[NixOS: a purely functional Linux distribution](https://dl.acm.org/doi/10.1145/1411204.1411255)** (2008)
*Multiple authors*
Academic publication

Description of NixOS, a Linux distribution built on Nix package manager.

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
*Multiple authors*
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

## Software Composition Analysis

Research on library usage, updates, and composition analysis tools.

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

**[Do developers update their library dependencies?](https://link.springer.com/article/10.1007/s10664-017-9521-5)** (2018)
*Multiple authors*
Academic publication

Investigation of library update practices among developers.

**[The emergence of software diversity in maven central](https://arxiv.org/abs/1903.05394)** (2019)
*Multiple authors*
arXiv preprint

Analysis of software diversity patterns in Maven Central.

**[On the use of package managers by the C++ open-source community](https://dl.acm.org/doi/10.1145/3167132.3167290)** (2018)
*Multiple authors*
SAC

Study of package manager adoption in C++ open source.

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

**[The Evolution of Project Inter-dependencies in a Software Ecosystem: The Case of Apache](https://ieeexplore.ieee.org/document/6676899/)** (2013)
*Multiple authors*
Academic publication

Analysis of how project dependencies evolve in the Apache ecosystem.

**[How the Apache community upgrades dependencies: an evolutionary study](https://link.springer.com/article/10.1007/s10664-014-9325-9)** (2015)
*Multiple authors*
Academic publication

Study of dependency upgrade patterns in Apache projects.

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

**[Towards Smoother Library Migrations: A Look at Vulnerable Dependency Migrations at Function Level for npm JavaScript Packages](https://ieeexplore.ieee.org/document/8530065/)** (2018)
*Multiple authors*
IEEE publication

Study of library migration patterns for vulnerability fixes.

**[On the diversity of software package popularity metrics: An empirical study of npm](https://arxiv.org/abs/1901.04217)** (2019)
*Multiple authors*
arXiv preprint

Analysis of different popularity metrics in npm ecosystem.

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
