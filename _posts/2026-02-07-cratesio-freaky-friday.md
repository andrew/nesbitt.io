---
layout: post
title: "Crates.io's Freaky Friday"
date: 2026-02-07
description: "What happens when Rust's package registry wakes up with Debian's design choices?"
tags:
  - package-managers
  - crates.io
  - debian
  - deep-dive
---

The maintainers of [crates.io](https://crates.io/) wake up Friday morning to find their registry has swapped design philosophies with Debian. They still serve the Rust ecosystem, Debian still serves Linux distributions, but the tradeoffs they've chosen have reversed. 

Like Tess and Anna in [Freaky Friday](https://www.imdb.com/title/tt0322330/), they're stuck in each other's bodies, forced to navigate constraints they've spent years criticizing from the outside.

The crates.io team reaches for their coffee and tries to ship a hotfix, only to discover they can't publish without a signed GPG key from a designated sponsor and a three-day waiting period for linting and policy review. Meanwhile, Debian maintainers watch in horror as packages flow into their repository without coordination, breaking stable in ways that won't surface until someone's server fails to boot.

### Waking up with snapshots

Freaky Friday crates.io splits into multiple coexisting suites. There's a "stable" suite with older, well-tested crate versions, a "testing" suite with recent versions undergoing integration testing, and an "unstable" suite with the latest uploads. Within each suite, only one version of each crate exists, but the suites themselves persist simultaneously, and when you configure your project, you choose which suite to track. The entire collection of crates within a suite is tested together to ensure compatibility. If your crate depends on `tokio ^1.0` and `hyper ^1.0` in the stable suite, you can trust those specific versions work together because someone actually built them in combination.

Within a suite, there's no version selection because there are no versions to select. But the resolver still needs to handle feature unification across the dependency graph, optional dependencies that conditionally activate features, default features, and platform-specific dependencies. Debian's resolver still deals with alternatives, virtual packages, and conflicts even within a single suite. Builds become reproducible by default within a suite since the suite itself acts as the lockfile, fixing both versions and the available feature combinations.

Breaking changes in popular crates create suite-wide coordination problems. When `tokio` wants to ship 2.0 to the unstable suite, either every dependent crate adapts before it migrates to testing and stable, or the breaking change waits, or incompatible crates get dropped. Projects tracking stable can stay on `tokio` 1.x while the ecosystem adapts, but they can't cherry-pick updates since you get the whole suite or none of it, and the suite model forces coordination within each channel while allowing different migration speeds across suites.

Rust promises that code compiling on Rust 1.x will compile on Rust 1.y where y > x. But in Freaky Friday crates.io, switching suites can break your build even if your code hasn't changed and the compiler version is compatible.

Freaky Friday Debian collapses its suites into a single rolling repository where [every version ever published stays available](/2025/12/05/package-manager-tradeoffs). When `libc6` releases a new version, the old ones remain fetchable alongside it. Projects can pin to specific versions and stay there for years. The resolver now has to choose among thousands of versions for popular packages, optimizing for the newest compatible set. Dependency conflicts that would have been caught by Debian's suite-based integration testing now surface at runtime when packages make incompatible assumptions about shared libraries or system state. Debian would need to implement lockfiles. Right now each suite acts as an implicit lockfile, but with all versions available in a single repository, you need a way to freeze exact package versions or installations drift as new versions appear.

The Debian team would face a new class of bugs. Two packages both depend on different versions of `libssl`, and because there's no coordinated testing, conflicts emerge. Many would surface at install time when dpkg detects incompatible dependencies, but some slip through: if the versions are ABI-compatible, everything works until one package calls a function that behaves differently across versions, creating subtle runtime failures. The careful integration testing that made Debian stable can't happen when packages target arbitrary version combinations.

### Moving on someone else's schedule

Freaky Friday crates.io manages transitions between its suites by allowing crates to enter unstable immediately upon upload while requiring them to build cleanly and show no obvious breakage for a period before migrating to testing, and then pass integration tests against the entire stable suite and wait for the next stable release window before migrating to stable. Packages flow through suites based on demonstrated stability rather than author intent.

The six-week Rust compiler cadence provides a natural rhythm for stable releases, with packages that have proven stable in testing migrating to a new stable suite every six weeks. Projects tracking stable get coordinated updates on this schedule, projects tracking unstable get updates immediately but accept the instability, and projects tracking testing find a middle ground between the two.

When a vulnerability drops in a popular crate like `tokio` or `rustls`, projects tracking unstable get the fix immediately. Projects tracking testing get it after automated migration checks pass. Projects tracking stable might wait until the next stable release, which could mean nearly six weeks for a vulnerability announced just after a release.

Right now when `rustls` ships a security fix, it might inadvertently break something else. Projects pulling the update immediately discover this the hard way. In Freaky Friday crates.io, the security fix goes through testing's integration checks before reaching stable. By the time stable-tracking projects get it, the registry has verified it doesn't break anything.

Freaky Friday crates.io would need a security update mechanism like Debian's stable-security suite. Critical fixes could bypass the normal migration process and flow directly to stable with lighter testing. Different environments would choose differently. Rapidly-developed web services might track unstable to get fixes within minutes. Embedded systems might track stable with security updates only, avoiding any destabilization between planned upgrade windows.

Freaky Friday Debian becomes rolling, where package maintainers can upload new versions of `systemd` or `nginx` that go live immediately without the extensive integration testing that characterized Debian stable. Individual packages work fine, but combinations are untested, leaving users who relied on Debian stable for servers that run for years without breaking in need of a new distribution.

### Who decides what exists

Freaky Friday crates.io requires review before publication. You don't publish your own crate directly. Instead, you submit it for review by a team of packagers who evaluate the code, check for duplicates, ensure it meets quality standards, and decide whether it belongs in the registry. The packagers might not be the original authors. Sometimes they're downstream users who want a library available and volunteer to maintain the packaging. Sometimes they're registry maintainers filling gaps.

Right now, the friction of publishing to crates.io is so low that people publish tiny utility crates for their own convenience. With review as a gate, you'd only submit crates you think are worth someone else's time to evaluate. The ecosystem would have fewer packages, but each one would represent a more deliberate decision. The explosion of micro-dependencies that characterizes the npm ecosystem would slow down.

The packagers become a new power center. They decide not just whether code is safe, but whether it's useful, whether it duplicates existing crates, whether it meets their standards for documentation or API design. In Debian this works because the community of package maintainers is accountable to the broader Debian community through democratic governance. Without that structure, the crates.io packagers would be making subjective judgments with limited oversight. Whose standards are they enforcing?

Freaky Friday Debian removes the gatekeeping. Anyone can publish a package to their own namespace without review. The namespace structure prevents collisions, and there's no central authority deciding what deserves to exist. Debian would get new software faster, but it would break something deeper than just technical quality control.

Debian's curation is part of its social contract and legal guarantees. The Debian Free Software Guidelines aren't just about code quality, they're about license compliance and user freedoms. When software makes it into Debian, you know someone verified those guarantees. In Freaky Friday Debian, being in the repository just means someone published it. Organizations using Debian because it's curated would need to build their own curation layer on top, including their own license vetting and policy enforcement.

When Azer Koçulu unpublished left-pad from npm in 2016, thousands of builds broke because npm trusted authors to control their packages. The registry had to override that trust and restore the package. Crates.io learned from this and implemented yanking instead of deletion: authors can mark versions as unavailable for new projects, but existing lockfiles still work. Freaky Friday crates.io wouldn't need yanking at all. Once a crate passes review and enters a suite, the packagers own it. Authors can submit updates for future suites, but they can't retroactively remove what's already shipped.

### The breakage contract

Rust's ecosystem has internalized "stability without stagnation." The edition system lets the language evolve without breaking existing code, while crates follow semantic versioning religiously, with breaking changes incrementing the major version so that projects can depend on multiple major versions simultaneously if needed. The cultural expectation is that you can always add but should rarely remove. When a popular crate releases a new major version, the old major version often gets security fixes for years.

Debian's model accepts that breakage happens between major releases. When Debian 12 ships with Python 3.11 and Debian 13 ships with Python 3.12, packages that depended on 3.11-specific behavior need to adapt or get dropped. The suite system contains this breakage by keeping stable frozen while allowing the transition from one stable release to the next to introduce breaking changes. The cultural expectation is that major releases are upgrade points where you deal with accumulated breakage all at once.

When `tokio` 2.0 enters testing in Freaky Friday crates.io, crates that haven't adapted yet either block its migration to stable or get dropped from stable. You can't have five different major versions of `tokio` in the same suite because the suite is tested as a unit. Projects tracking stable would face a new kind of disruption: suite upgrades that break their dependencies in ways the current model avoids. The Rust cultural expectation that "my dependencies won't break if I don't explicitly upgrade them" doesn't survive the suite model.

Freaky Friday Debian adopts Rust's approach and allows multiple major versions of packages to coexist. When Python 3.12 releases, 3.11 sticks around indefinitely so that packages can depend on whichever version they want and the resolver can figure it out. Debian's security team now has to backport fixes to an unbounded number of actively-used package versions. The current model works because Debian can say "we only support the versions in stable." With all versions available, the security burden becomes unbounded unless they say "we only support the newest version of each major series," which recreates the forced migration they were trying to avoid.

### The build farm swap

Crates.io currently distributes source, pushing build costs to users. Debian runs a build farm and distributes binaries, concentrating costs on the registry operators.

Freaky Friday crates.io adopts the build farm model, compiling every crate for every supported platform and Rust version, then distributing pre-built artifacts. First-time builds drop from twenty minutes to seconds. But the registry now handles Rust's platform matrix spanning multiple operating systems, toolchain variants (gnu, musl, mingw), architectures, and Rust versions going back years. Debian's build farm handles [multiple architectures](https://wiki.debian.org/SupportedArchitectures) for a curated package set. Rust has 150,000 crates with a broader platform matrix and faster churn. The infrastructure costs scale differently.

### Surviving the week

Freaky Friday crates.io would struggle most with user expectations about iteration speed. Rust developers expect to publish a new version and have it immediately available. You push `serde` 1.0.215 with a bug fix, other developers pull it minutes later, find issues, you publish 1.0.216 the same afternoon. That feedback loop is how the ecosystem works. In Freaky Friday crates.io, your update enters unstable immediately but sits in review before that, then waits for testing migration, then waits for the next stable release up to six weeks away for projects tracking stable. By the time most users can try your fix, you've already identified and fixed three more bugs, but those are stuck in the pipeline too.

The review bottleneck compounds this. When Rust adds language features, thousands of crates rush to adopt them in the same week. The current crates.io team is seven people managing over 150,000 packages. Debian handles this by having far fewer packages and slower language evolution, but Rust's pace of change makes that model impractical. Even if suite releases align with the six-week compiler cadence, the stable suite would likely lag behind as crates take time to stabilize in testing, creating a version gap where new compiler features remain unusable because the stable suite's crates haven't adopted them yet, which would fragment the ecosystem between developers tracking unstable for new features and those tracking stable for reliability.

But Freaky Friday crates.io would gain something Debian has: confidence that the pieces fit together. Right now when a popular crate publishes a breaking change, you only discover the fallout when your build breaks. The ecosystem fragments as some projects upgrade and others don't. With coordinated suites and integration testing, breaking changes get caught before they reach stable. The `tokio` maintainers would see exactly which crates break before the new version migrates from testing to stable, allowing them to coordinate with those maintainers or delay the migration, which would smooth out the churn that makes Rust dependency management exhausting.

Rolling Debian would fix a problem that drives users to testing and unstable: staleness. Debian stable is often years behind upstream, which is fine for servers but painful for desktop users who want recent software. The careful integration testing that makes Debian reliable also makes it slow. By accepting rolling releases, Freaky Friday Debian could ship current software at the cost of occasional breakage, which some users would consider a better tradeoff.

### The morning meeting

Rust's foundation model works because the ecosystem moves fast and decisions need to happen quickly, with six-week compiler releases requiring a tight feedback loop where small teams with clear ownership can make decisions and respond when something breaks without waiting for consensus.

Debian's democratic governance works because the conditions are different. The distribution moves slowly, giving time for deliberation. Decisions have long-term consequences that affect thousands of downstream distributions and millions of users. The contributor-to-package ratio is higher, so more people have the context to vote meaningfully on technical decisions. The social contract and democratic process are what hold the community together across decades. A vote on systemd adoption takes months because Debian will live with the choice for years, and the legitimacy of the decision matters as much as its technical correctness.

Freaky Friday crates.io with Debian's democratic governance would struggle to coordinate suite releases. Deciding which crates make it into each suite's stable release would become a political process where the packagers with the most voting weight push their priorities and niche crates maintained by newcomers get deprioritized. Votes on technical decisions would take weeks, consistently missing the six-week release window. The pace of language evolution would either slow to match the governance speed or the governance would become a rubber stamp, breaking the democratic accountability that makes the model legitimate.

Freaky Friday Debian with foundation governance would face legitimacy problems. Debian's community trust comes from transparent decision-making and the knowledge that anyone sufficiently invested can participate in governance. The volunteers who maintain packages do so partly because they have a voice in the project's direction. A board making policy decisions behind closed doors would break that social contract, potentially driving volunteers away and giving corporate sponsors more influence, which might improve funding but would change what Debian optimizes for and transform the distribution that prides itself on being "the universal operating system" built by its users into something else.

Nix and Guix already combine all-versions-available flexibility with centralized recipes and build farms, sidestepping the suite coordination problem by storing everything in content-addressed paths instead of a shared directory.

At the end of the week, [Adam Harvey](https://github.com/LawnGnome) finds the fortune cookie. Everyone wakes up the next day with things back to normal, but with a better understanding of the tradeoffs and benefits of each choice.