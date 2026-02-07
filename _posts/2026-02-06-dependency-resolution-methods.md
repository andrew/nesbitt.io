---
layout: post
title: "Dependency Resolution Methods"
date: 2026-02-06 12:00 +0000
description: "A reference on how package managers solve the version constraint satisfaction problem, from SAT solvers to content-addressed stores."
tags:
  - package-managers
  - reference
  - dependencies
---

Every package manager faces the same core problem: given a set of packages with version constraints, find a compatible set of versions to install. The classic example is the diamond dependency: A depends on B and C, both of which depend on D but at incompatible versions. The resolver has to find a version of D that satisfies both, prove that none exists, or find some other way out. Di Cosmo et al. [proved in 2005](https://www.researchgate.net/publication/278629134_EDOS_deliverable_WP2-D21_Report_on_Formal_Management_of_Software_Dependencies) that this problem is NP-complete, encoding it as 3SAT for Debian and RPM constraint languages. In practice, real-world dependency graphs are far more tractable than the worst case, and different ecosystems have landed on different resolution strategies that make different tradeoffs between completeness, speed, error quality, and simplicity.

These approaches fall roughly into complete solvers (SAT, PubGrub, ASP), heuristic solvers (backtracking, Molinillo, system resolvers), constraint relaxation strategies (deduplication with nesting, version mediation), and approaches that avoid the problem entirely (minimal version selection, content-addressed stores).

The [categorizing package manager clients](/2025/12/29/categorizing-package-manager-clients.html) post lists which package managers use which approach. The [package management papers](/2025/11/13/package-management-papers.html) post has the full bibliography. The [package-manager-resolvers](https://github.com/ecosyste-ms/package-manager-resolvers) repo has per-ecosystem detail and comparison tables.

### SAT solving

Encode version constraints as a boolean satisfiability problem. Each package-version pair becomes a boolean variable, and dependencies and conflicts become clauses. A SAT solver then searches for an assignment where all clauses are satisfied. If one exists, you get a compatible install set. If none exists, the solver can prove it, which is something simpler algorithms cannot do.

The [OPIUM paper](https://cseweb.ucsd.edu/~lerner/papers/opium.pdf) (Tucker et al. 2007) was the first to build a complete dependency solver this way, combining SAT with pseudo-boolean optimization and Integer Linear Programming. They showed that in simulated upgrade scenarios, 23.3% of Debian users encountered cases where apt-get's incomplete heuristics failed to find valid solutions that existed. [Di Cosmo et al. (2012)](https://www.sciencedirect.com/science/article/pii/S0164121212000477) later argued that dependency solving should be separated from the rest of the package manager entirely, using generic external solvers rather than ad-hoc heuristics baked into each tool.

SAT solving is computationally expensive in theory but modern solvers handle real-world package instances well. The [Still Hard retrospective](https://arxiv.org/abs/2011.07851) (Abate et al. 2020) confirmed that SAT-based approaches are gaining adoption and that practical solvers perform well despite the NP-completeness result. More recent work by [Pinckney et al. (2023)](https://dl.acm.org/doi/10.1109/ICSE48619.2023.00124) builds on this with a Max-SMT formulation that extends SAT with optimization objectives, providing a unified formulation where soft constraints (preferences like "prefer newer versions") and hard constraints (compatibility requirements) coexist naturally rather than being bolted on after the fact.

Used by Composer, DNF, Conda/Mamba (via libsolv), Zypper (via libsolv), and opam (via built-in CUDF solver mccs, with optional external solvers). libsolv implements CDCL with watched literals, the same core algorithm as MiniSat, but adds domain-specific optimizations for package management that make it faster in practice.

### PubGrub

PubGrub is a variant of conflict-driven clause learning (the technique behind modern SAT solvers) designed specifically for version solving. It's conceptually SAT-like but operationally domain-specific, replacing generic clause structures with version ranges and incompatibility records that map directly to the problem. Its key advantage is the UX of failure. Before PubGrub, "unsolvable dependency conflict" was a dead end that left developers guessing which constraint to relax. PubGrub tracks exactly which incompatibilities caused the failure and produces human-readable explanations, turning a resolution error into something closer to a task list.

Natalie Weizenbaum created PubGrub for Dart's pub package manager and [described the algorithm in 2018](https://nex3.medium.com/pubgrub-2fb6470504f). The algorithm maintains a set of incompatibilities (facts about which version combinations cannot coexist) and uses unit propagation and conflict-driven learning to narrow the search. When it hits a dead end, it derives a new incompatibility from the conflict, which both prunes the search space and records the reason for future error reporting.

Poetry, uv, Swift Package Manager, Hex, and Bundler (which migrated from Molinillo) all use PubGrub now. The adoption story is partly about the algorithm and partly about the availability of quality implementations in multiple languages: [pubgrub-rs](https://github.com/pubgrub-rs/pubgrub) in Rust (used by uv), [pub_grub](https://github.com/jhawthorn/pub_grub) in Ruby (used by Bundler), Poetry's internal solver in Python, and [hex_solver](https://github.com/hexpm/hex_solver) in Elixir. Having reusable libraries matters as much as the theoretical properties; a better algorithm that nobody can embed doesn't get adopted.

### Backtracking

The simplest approach: try versions in preference order (usually newest first), recurse into dependencies, and back up when you hit a conflict. No encoding step, no external solver, just depth-first search with rollback.

Backtracking works well when the dependency graph is reasonably constrained, which covers most real-world cases. It struggles with pathological inputs where conflicts hide deep in the tree and the solver wastes time exploring doomed branches before discovering the root cause. Justin Cappos [documented this approach](https://www.cs.arizona.edu/sites/default/files/TR08-04.pdf) in the Stork dissertation, noting that despite its simplicity, it worked well in practice for their adopters.

pip (via resolvelib), Cargo, and Cabal use backtracking. In practice the line between "backtracking" and "SAT-like" is blurry: modern backtracking solvers often add learning and backjumping, where the solver records which choices caused a conflict and skips irrelevant decisions when backing up. Cabal's solver does both, which helps significantly on Haskell's deep dependency trees. At that point you're doing much of what PubGrub does, just without the structured incompatibility tracking that produces good error messages.

### ASP solving

Answer Set Programming expresses the entire resolution problem as a logic program and lets a general-purpose ASP solver find valid models. Where SAT works with boolean variables and clauses, ASP works with rules and constraints in a declarative language closer to the problem domain.

This is particularly suited to HPC, where "which versions are compatible" is only part of the problem. Spack needs to reason about compiler versions, build variants (debug/release, MPI implementations, GPU backends), microarchitecture targets, and build options alongside version constraints. Encoding all of that in SAT would be painful. In ASP, each constraint type maps naturally to rules. [Gamblin et al. (2022)](https://dl.acm.org/doi/abs/10.5555/3571885.3571931) describe Spack's ASP encoding and how they structure optimization criteria to mix source and binary builds by reusing existing installations when compatible.

The [aspcud solver](https://doi.org/10.4204/EPTCS.65.2) (Gebser et al. 2011) was the first to apply ASP to package dependency solving, demonstrating competitive performance on Debian package problems with the benefit of declarative optimization criteria. Spack uses Clingo as its ASP solver, encoding the full concretization problem (versions, compilers, variants, targets) as a logic program.

### Minimal version selection

Pick the oldest version that satisfies each constraint rather than the newest. This makes resolution deterministic and reproducible without a lockfile: the same go.mod always produces the same versions, because there is only one valid answer. Russ Cox designed this for Go modules and [wrote extensively about it](https://research.swtch.com/vgo-mvs), including [why the SAT problem doesn't apply](https://research.swtch.com/version-sat) when you choose minimum versions. The intuition: if every constraint names a minimum and you always pick that minimum, the search space collapses to a single candidate per package with no backtracking needed. What was a search problem becomes a graph traversal.

The tradeoff is that you get "known good" rather than "latest compatible." When a dependency releases a new version with a bug fix you need, you must explicitly bump your requirement rather than getting it automatically. Cox's argument is that this predictability is worth more than automatic upgrades, and that automatic upgrades cause more subtle breakage than they prevent. His [Surviving Software Dependencies](https://dl.acm.org/doi/10.1145/3329781.3344149) essay (2019) makes the broader case.

Go modules and vcpkg both use minimal version selection, with vcpkg's approach explicitly modelled on Go's.

### Deduplication with nesting

A constraint relaxation strategy rather than a resolution algorithm. Instead of requiring one version of each package across the whole dependency tree, allow multiple versions when different dependents need incompatible ranges. If package A needs lodash@3 and package B needs lodash@4, install both and wire each to its own copy.

This avoids resolution failure by relaxing the single-version constraint. The cost is disk space and, more subtly, runtime complexity: multiple copies of the same library mean multiple copies of its global state, so two modules that think they're sharing a singleton or checking `instanceof` against the same class can silently disagree. npm, Yarn, and pnpm all use this approach, with varying strategies for flattening the tree to reduce duplication while preserving correctness. npm's hoisting algorithm tries to lift shared-compatible versions to the top of node_modules so they're shared, only nesting when versions actually conflict.

Cargo does a limited form: it allows one version per semver-compatible range (one per major version, or one per minor if pre-1.0), so `foo 1.2` and `foo 1.3` unify but `foo 1.x` and `foo 2.x` can coexist.

### Version mediation

No solver at all. When two dependencies require different versions of the same package, the build tool picks a winner by convention. Maven uses nearest-definition (the version declared closest to the root of the dependency tree wins). Gradle uses highest-version. NuGet uses lowest-applicable.

This is fast and predictable but can silently break things. If the "winner" version is incompatible with what the "loser" dependency actually needs, you get runtime errors rather than a resolution failure at install time. Maven in particular is notorious for this: a transitive dependency quietly gets a different version than it was tested with, and you find out when something throws a NoSuchMethodError. Gradle's "highest version wins" sounds safer until you realize it can pull in a major version bump transitively, breaking API compatibility for a dependency that never asked for it. In some cases that's worse than Maven's behaviour, since at least Maven's nearest-definition tends to keep you closer to versions that were explicitly chosen.

Maven, Gradle, NuGet, sbt, and Ivy all use version mediation. In the Clojure ecosystem, Leiningen uses Maven's nearest-definition algorithm via Aether, while tools.deps picks the newest version instead.

### Molinillo

A backtracking solver with heuristics tuned for Ruby's ecosystem, maintained by the CocoaPods team. [Molinillo](https://github.com/CocoaPods/Molinillo) tracks the state of resolution as a directed graph and uses heuristics about which package to resolve next to avoid unnecessary backtracking.

RubyGems and CocoaPods use Molinillo. Bundler used it for years before switching to PubGrub, partly for better error messages when resolution fails.

### System package resolution

System package managers have a structural advantage that simplifies resolution: within a given repository or suite, there's typically only one version of each package available. Debian stable doesn't offer you a choice between openssl 1.1 and openssl 3.0; the suite maintainers already made that decision. As I wrote about in the [Crates.io's Freaky Friday](/2026/02/06/cratesio-freaky-friday.html) post, this collapses what would be a version selection problem into something closer to a compatibility check. The resolver still has real work to do, but the search space is radically smaller than what language-level resolvers face with thousands of candidate versions per package.

What system resolvers handle instead are constraints that language-level tools don't encounter: file conflicts between packages, virtual packages, architecture-specific dependencies, and triggers that run during installation. The virtual packages concept has no real equivalent in language package managers. When a Debian package declares `Provides: mail-transport-agent`, any of postfix, exim4, or sendmail can satisfy that dependency. The resolver has to pick one, and the choice interacts with the rest of the installed system in ways that a language-level resolver never faces, since removing one mail transport agent to install another can break unrelated packages that assumed it was there.

apt uses a scoring-based approach with immediate resolution, evaluating candidate solutions against user preferences (minimize removals, prefer already-installed versions). It processes dependencies greedily rather than searching for a global optimum, which is why it occasionally proposes removing half your desktop environment to install a library. aptitude added backtracking on top of apt's dependency handling, which produces better solutions but is slower. apt's internal solver has grown more capable over time, and aptitude can optionally use external CUDF solvers for harder upgrade scenarios.

RPM-based systems (Fedora, openSUSE, RHEL) use libsolv, which gives them genuinely complete resolution. DNF and Zypper encode the full RPM dependency model including weak dependencies (Recommends, Suggests, Supplements, Enhances) that were added in RPM 4.12. These let packages express optional relationships without hard failures when they can't be satisfied, which matters for minimal container installs where you want a stripped-down system without pulling in documentation or GUI toolkits.

pacman resolves dependencies but doesn't handle conflicts with a full solver, relying instead on Arch's packaging policy of avoiding library version conflicts in the first place. The whole repository is meant to be installable together, so the resolver's job is mostly topological sorting rather than constraint satisfaction. apk (Alpine) is similar in philosophy but adds a rollback mechanism that can undo failed upgrades atomically.

Portage (Gentoo) has a harder problem than most because packages are built from source with USE flags that control compile-time features, the dependency graph changes shape depending on which flags are set. Enabling the `qt` USE flag on one package can pull in dozens of new dependencies. Portage resolves this with a backtracking solver that re-evaluates the graph when USE flag changes propagate, but the interaction between USE flags and dependencies means users sometimes hit circular dependencies that require manual intervention. FreeBSD ports and pkgsrc face similar source-build resolution challenges.

### Content-addressed / explicit

Nix and Guix side-step the version resolution problem entirely. Every package is identified by a hash of all its inputs: source code, build dependencies, compiler flags, everything. There is no "which version of openssl should I pick" because each package explicitly pins its exact dependencies by hash. Two packages can depend on different versions of the same library without conflict because the versions live at different paths in the store, identified by different hashes.

This gives you reproducibility by construction rather than by lockfile, but it trades solver complexity for maintainer complexity. Instead of a resolver finding a compatible path through the version graph, a human (or a tool like `niv` or `nix-init`) must explicitly define every input. The failure mode shifts too: instead of runtime breakage from incompatible versions, you get human fatigue from maintaining explicit input sets across a large package collection. Builds are slower because there's less sharing of intermediate artifacts than in version-based systems; if two packages differ in any input, they get separate builds even when the output would be identical. The Nix expression language has a steep learning curve compared to a TOML manifest. And the store grows large, though `nix-store --optimise` (which deduplicates identical files via hardlinks) and content-addressed derivations (which hash outputs rather than inputs, enabling more sharing) are closing that gap.

### Resolution libraries

Reusable libraries that package managers can embed rather than writing their own solver.

- [PubGrub](https://github.com/pubgrub-rs/pubgrub) (Rust) - Conflict-driven solver producing human-readable error messages. Used by uv. Separate implementations exist in Ruby ([pub_grub](https://github.com/jhawthorn/pub_grub), used by Bundler), Python (Poetry's internal solver), Elixir ([hex_solver](https://github.com/hexpm/hex_solver)), and Swift (Swift PM). Dart's pub uses the original Dart implementation.
- [libsolv](https://github.com/openSUSE/libsolv) (C) - SAT-based solver from openSUSE. Handles the full range of RPM and Debian dependency types including provides, conflicts, obsoletes, and supplements. Used by DNF, Zypper, Conda, and Mamba.
- [Molinillo](https://github.com/CocoaPods/Molinillo) (Ruby) - Backtracking resolver with Ruby-ecosystem heuristics. Used by RubyGems and CocoaPods. No longer used by Bundler, which switched to PubGrub.
- [Clingo](https://potassco.org/clingo/) (C++) - General-purpose ASP solver. Spack encodes its dependency problem as an ASP program and hands it to Clingo.
- [Resolvelib](https://pypi.org/project/resolvelib/) (Python) - pip's backtracking resolver since pip 20.3. Provides the resolution algorithm; pip supplies the package metadata interface.
- [CUDF](https://www.mancoosi.org/cudf/) - Common Upgradeability Description Format, a standard for describing package upgrade problems. opam exports its constraints as CUDF and feeds them to external solvers.
- [resolvo](https://github.com/prefix-dev/resolvo) (Rust) - SAT solver for package management from the Mamba team. Newer alternative to libsolv with a Rust API.
- [Rattler](https://github.com/conda/rattler) (Rust) - Rust implementation of Conda package management, including resolution. Powers Pixi.

### Key papers

The most relevant research, pulled from the [full bibliography](/2025/11/13/package-management-papers.html):

- [Di Cosmo et al. (2005)](https://www.researchgate.net/publication/278629134_EDOS_deliverable_WP2-D21_Report_on_Formal_Management_of_Software_Dependencies) - First proof that package installation is NP-complete, with 3SAT encoding for Debian and RPM.
- [Tucker et al. (2007) "OPIUM"](https://cseweb.ucsd.edu/~lerner/papers/opium.pdf) - Complete solver using SAT, pseudo-boolean optimization, and ILP. Showed apt-get's incompleteness affects a quarter of Debian users.
- [Abate, Di Cosmo, Treinen, Zacchiroli (2012)](https://www.sciencedirect.com/science/article/pii/S0164121212000477) - Argued for generic external solvers over ad-hoc heuristics.
- [Michel & Rueher (2010)](https://doi.org/10.4204/EPTCS.29.1) - Mixed Integer Linear Programming as alternative to SAT for package upgradeability.
- [Argelich et al. (2010)](https://doi.org/10.4204/EPTCS.29.2) - Pseudo-boolean optimization for Linux package upgradeability.
- [Abate, Di Cosmo, Gousios, Zacchiroli (2020)](https://arxiv.org/abs/2011.07851) - Retrospective showing SAT approaches gaining adoption, practical solvers performing well despite NP-completeness.
- [Gebser, Kaminski, Schaub (2011) "aspcud"](https://doi.org/10.4204/EPTCS.65.2) - First ASP-based dependency solver.
- [Gamblin, Culpo, Becker, Shudler (2022)](https://dl.acm.org/doi/abs/10.5555/3571885.3571931) - Spack's ASP encoding for versions, variants, and mixed source/binary builds.
- [Weizenbaum (2018)](https://nex3.medium.com/pubgrub-2fb6470504f) - PubGrub's algorithm design and its error-message advantage.
- [Cappos (2008) "Stork" Ch. 3.8](https://www.cs.arizona.edu/sites/default/files/TR08-04.pdf) - Practical backtracking resolution in Stork.
- [Cox (2019) "Surviving Software Dependencies"](https://dl.acm.org/doi/10.1145/3329781.3344149) - The case for predictable resolution via minimum versions.
- [Gibb et al. (2025)](https://arxiv.org/abs/2506.10803) - Hypergraph model for cross-ecosystem dependency resolution. (arXiv preprint)
- [Pinckney et al. (2023)](https://dl.acm.org/doi/10.1109/ICSE48619.2023.00124) - Max-SMT formulation for dependency resolution with formal guarantees.
