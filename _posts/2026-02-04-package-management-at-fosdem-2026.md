---
layout: post
title: "Package Management at FOSDEM 2026"
date: 2026-02-04
description: "Summary of package management talks from FOSDEM 2026, covering supply chain security, attestations, SBOMs, dependency resolution, and distribution packaging across multiple devrooms."
tags:
  - package-managers
  - conferences
  - fosdem
  - security
  - sbom
  - supply-chain
---

[FOSDEM 2026](https://fosdem.org/2026/) ran last weekend in Brussels with its usual dense schedule of talks across open source projects and communities. Package management had a strong presence again this year, with a [dedicated devroom](https://fosdem.org/2026/schedule/track/package-management/) plus related content scattered across the [Distributions](https://fosdem.org/2026/schedule/track/distributions/), [Nix and NixOS](https://fosdem.org/2026/schedule/track/nix-and-nixos/), and [SBOMs and Supply Chains](https://fosdem.org/2026/schedule/track/sboms-and-supply-chains/) tracks.

## Main Track Talks

Kenneth Hoste presented [How to Make Package Managers Scream](https://fosdem.org/2026/schedule/event/DCAVDC-how_to_make_package_managers_scream/), a follow-up to his FOSDEM 2018 talk about making package managers cry. Hoste showcased creative and effective ways open source software projects take things to the next level to make package managers scream, along with tools that try to counter these practices.

Mike McQuaid gave [What happened to RubyGems and what can we learn?](https://fosdem.org/2026/schedule/event/YUJUKD-what_happened_to_rubygems_and_what_can_we_learn/) examining the February 2024 RubyGems and Bundler infrastructure incident.

## Package Management Devroom

The Package Management devroom, which I organized with Wolf Vollprecht, ran on Saturday with nine talks covering security, standards, and practical implementation challenges.

Adam Harvey opened with [A phishy case study](https://fosdem.org/2026/schedule/event/GFA3RJ-a_phishy_case_study/) about the September 2024 phishing attack on crates.io. The attack targeted popular crate owners as part of a wider campaign across language ecosystems. Harvey detailed how the Rust Project, Rust Foundation, and Alpha-Omega collaborated to mitigate it rapidly. Mike Fiedler
[posted a follow-up on Mastodon](https://hachyderm.io/@miketheman/116008792409955286) describing how attackers were able to circumvent 2FA.
In short, TOTP 2FA does not include phishing resistance (compared to WebAuthn or Passkeys), so the TOTP codes can be collected and forwarded
to the target service the same way that passwords are.

Zach Steindler presented [Current state of attestations in programming language ecosystems](https://fosdem.org/2026/schedule/event/BCFZP7-current-state-programming-language-attestations/), comparing how npm, PyPI, RubyGems, and Maven Central have implemented attestations over the past few years. These attestations provide build provenance by linking packages to exact source code and build instructions, distributed as Sigstore bundles. Steindler covered the APIs for accessing attestations in each ecosystem and discussed implementation tradeoffs.

Gábor Boskovits explored [Name resolution in package management systems - A reproducibility perspective](https://fosdem.org/2026/schedule/event/BJCN93-name-resolution-in-package-managers/), comparing how different systems handle package dependencies. He looked at language-specific package managers with lock files (Cargo), typical distributions (Debian), and functional package managers (Nix and Guix), then reflected on these approaches from a reproducible builds angle.

Ryan Gibb presented [Package managers à la carte: A Formal Model of Dependency Resolution](https://fosdem.org/2026/schedule/event/3SANYS-package-managers-a-la-carte/), introducing the Package Calculus. This formalism aims to unify the core semantics of diverse package managers, showing how real-world features reduce to the core calculus. Gibb demonstrated Pac, a language for translating between distinct package managers and performing dependency resolution across ecosystems.

Matthew Suozzo gave [Trust Nothing, Trace Everything: Auditing Package Builds at Scale with OSS Rebuild](https://fosdem.org/2026/schedule/event/EP8AMW-oss-rebuild-observability/). While reproducible builds confirm artifacts match expectations, they treat the build process as a black box. OSS Rebuild instruments the build environment to detect malicious behavior in real-time using a transparent network proxy for uncovering hidden remote dependencies and an eBPF-based system analyzer for examining build behavior.

Philippe Ombredanne returned with [PURL: From FOSDEM 2018 to international standard](https://fosdem.org/2026/schedule/event/P8AAT3-purl/). Package-URL was [first presented at FOSDEM](https://archive.fosdem.org/2018/schedule/event/purl/) eight years ago and has now become an international standard for referencing packages across ecosystems. Ombredanne highlighted PURL's adoption in CVE format, security tools, and SCA platforms, and its journey from community project to Ecma standard with plans for ISO standardization.

Vlad-Stefan Harbuz spoke about [Binary Dependencies: Identifying the Hidden Packages We All Depend On](https://fosdem.org/2026/schedule/event/7NQJNU-binary_dependencies_identifying_the_hidden_packages_we_all_depend_on/), examining dependencies that don't appear in standard package manager manifests. Related: [the C-shaped hole in package management](/2026/01/27/the-c-shaped-hole-in-package-management.html).

Michael Winser discussed [The terrible economics of package registries and how to fix them](https://fosdem.org/2026/schedule/event/8WJKEH-package-registry-economics/), looking at the sustainability challenges facing package registry infrastructure.

Mike McQuaid closed the devroom with [Package Management Learnings from Homebrew](https://fosdem.org/2026/schedule/event/FGBYKV-package_management_learnings_from_homebrew/), covering lessons from 16 years of maintaining Homebrew and the recent v5.0.0 release.

## Distributions Devroom

The Distributions devroom on Sunday covered 16 talks about building and maintaining Linux distributions.

Daniel Mellado and Mikel Olasagasti tackled [Packaging eBPF Programs in a Linux Distribution: Challenges & Solutions](https://fosdem.org/2026/schedule/event/VSXPA8-packaging-ebpf-in-linux-distros/). eBPF introduces unique challenges including kernel dependencies, CO-RE relocations, pinning behavior, and version-aligned tooling. They explored specific issues in Fedora like pinned maps, privilege models, reproducible builds, SELinux implications, and managing kernel updates.

František Lachman and Cristian Le presented [From Code to Distribution: Building a Complete Testing Pipeline](https://fosdem.org/2026/schedule/event/MCNHUF-from-code-to-distribution-testing-pipeline/) about the Packaging and Testing Experience (PTE) project. The project bridges upstream-to-downstream testing with tmt (test management framework), Testing Farm (on-demand test infrastructure), and Packit (integration glue).

Robin Candau discussed [Relying on more transparent & trustworthy sources for Arch Linux packages](https://fosdem.org/2026/schedule/event/FFWA7E-transparent-sources-for-arch-linux-packages/). Recent supply chain attacks prompted Arch Linux to establish updated guidelines for selecting trustworthy package sources to prevent or mitigate security threats.

Fabio Valentini presented [Distributing Rust in RPMs for fun (relatively speaking) and profit](https://fosdem.org/2026/schedule/event/HZFHZV-distributing-rust-in-rpms-for-fun-and-profit/), covering his work as the main maintainer of Rust packages in Fedora and primary developer of the tooling for packaging Rust crates as RPMs.

Till Wegmüller discussed [(Re)Building a next gen system package Manager and Image management tool](https://fosdem.org/2026/schedule/event/3M7TRM-illumos-ips-a-different-system-package-manager/) about IPS (Image Packaging System), a component from OpenSolaris used extensively in OpenIndiana. Wegmüller covered IPS history, current capabilities, core concepts including repositories, packages, FMRI, facets, variants, and manifests, plus plans to [port IPS to Rust](https://www.phoronix.com/news/OpenIndiana-Next-Gen-IPS).

## Nix and NixOS Devroom

The Nix devroom on Saturday packed in 19 talks about the functional package manager and operating system.

Philippe Ombredanne presented [Nixpkgs Clarity: Correcting Nix package license metadata](https://fosdem.org/2026/schedule/event/EBPDES-nixpkgs-clarity/) on improving package license metadata quality.

Julien Malka and Arnout Engelen introduced [LILA: decentralized reproducible-builds verification for the NixOS ecosystem](https://fosdem.org/2026/schedule/event/HGC788-lila_decentralized_reproducible-builds_verification_for_the_nixos_ecosystem/), a system for verifying reproducible builds across the Nix ecosystem.

TheComputerGuy spoke about [Describing Nix closures using SBOMs](https://fosdem.org/2026/schedule/event/8SNMXT-describing_nix_closures_using_sboms/), bridging Nix's dependency model with SBOM standards.

Ryan Gibb also presented [Opam's Nix system dependency mechanism](https://fosdem.org/2026/schedule/event/ERQ8FQ-opam-nix/), exploring how OCaml's opam package manager integrates with Nix for system dependencies.

## SBOMs and Supply Chains

Philippe Ombredanne and Steve Springett presented [Forget SBOMs, use PURLs](https://fosdem.org/2026/schedule/event/DRGX73-purl/) in the SBOMs and supply chains devroom, arguing that Package URLs provide a more practical foundation for identifying software components than full SBOMs in many contexts.

Karen Bennet discussed [What is new in SPDX 3.1 which is now a Living Knowledge Graph](https://fosdem.org/2026/schedule/event/9Q9EEL-what_is_new_in_spdx_3_1_which_is_now_a_living_knowledge_graph/), covering the latest SPDX specification updates and its evolution into a knowledge graph model.

Ariadne Conill presented [C/C++ Build-time SBOMs with pkgconf](https://fosdem.org/2026/schedule/event/ELPHEA-pkgconf-sbom/), showing how to generate SBOMs during the build process for C/C++ projects.

Ev Cheng and Sam Khouri spoke about [Enhancing Swift's Supply Chain Security: Build-time SBOM Generation in Swift Package Manager](https://fosdem.org/2026/schedule/event/MAL9ZQ-swiftpm-sboms/), demonstrating similar capabilities for Swift.

## HPC and Scientific Computing

Harmen Stoppels presented [Spack v1.0 and Beyond: Managing HPC Software Stacks](https://fosdem.org/2026/schedule/event/DHUQAN-spack-one-zero-and-beyond/), covering the first stable release of Spack, a package manager for supercomputers that now handles builds for systems with tens of thousands of cores.

Ludovic Courtès spoke about [Package management in the hands of users: dream and reality](https://fosdem.org/2026/schedule/event/QKNMJN-package-management-in-the-hands-of-users/), discussing Guix deployment in high-performance computing environments.

Helena Vela Beltran gave [Status update on EESSI, the European Environment for Scientific Software Installations](https://fosdem.org/2026/schedule/event/RQD9AD-status-update-eessi/), covering the project that builds on EasyBuild and Spack to provide a shared software stack for HPC systems across Europe.

## Other Tracks

The Python track included Jarek Potiuk's [Modern Python monorepo with uv, workspaces, prek and shared libraries](https://fosdem.org/2026/schedule/event/WE7NHM-modern-python-monorepo-apache-airflow/), covering uv, the new Python package manager that's been gaining adoption.

Simon Josefsson presented [Guix Container Images - and what you can do with them](https://fosdem.org/2026/schedule/event/ZELSB8-guix-containers/) in the declarative computing track, showing how to build and use container images with Guix.

The Security track included [Using Capslock analysis to develop seccomp filters for Rust (and other) services](https://fosdem.org/2026/schedule/event/QGCFDA-using_capslock_analysis_to_develop_seccomp_filters_for_rust_and_other_services/) by Adam Harvey, connecting package build analysis with security policies.

The Design track featured [Designing attestations UI: The Security and Safety of OSS package supply chain](https://fosdem.org/2026/schedule/event/HCQRVT-designing_attestations_ui_the_security_and_safety_of_oss_package_supply_chain/), examining user interface design for package attestation systems.

I also presented [git blame for your dependencies](https://fosdem.org/2026/schedule/event/E7BQKK-git_blame_for_your_dependencies/) in the /dev/random track about [git-pkgs](/2026/01/01/git-pkgs-explore-your-dependency-history).

