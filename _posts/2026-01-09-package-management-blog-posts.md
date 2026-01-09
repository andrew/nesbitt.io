---
layout: post
title: "Package Management Blog Posts"
date: 2026-01-09 10:00 +0000
description: "Blog posts, talks, and essays that changed how people think about dependency management."
tags:
  - package-managers
  - history
---

I've been collecting posts about package management for a while. Not academic papers (those are in a [separate list](/2025/11/13/package-management-papers.html)) and not the historical events themselves (that's the [timeline](/2025/11/15/package-manager-timeline.html)), but the blog posts, talks, and essays where practitioners worked through ideas, explained incidents, or just vented.

## Foundational explanations

**[Unix Philosophy and Node.js](https://blog.izs.me/2013/04/unix-philosophy-and-nodejs/)** (Isaac Schlueter, 2013). The case for small modules: do one thing well, compose through simple interfaces, trade development cost for maintenance cost. npm's founder explaining the philosophy that shaped the ecosystem.

**[So you want to write a package manager](https://medium.com/@sdboyer/so-you-want-to-write-a-package-manager-4ae9c17d9527)** (Sam Boyer, 2016). The clearest explanation of the difference between a language package manager and a project dependency manager. Covers manifests vs lockfiles, why version constraints exist, and what "solving" actually means. Written while Boyer was building dep for Go, before Go modules existed. Still the post I'd send someone who wants to understand the fundamentals.

**[Version SAT](https://research.swtch.com/version-sat)** (Russ Cox, 2016). Proves that package version selection is NP-complete by converting 3-SAT into a dependency problem. Most real package managers face this, which is why many adopted SAT solvers. Also suggests escape hatches: minimum version selection, allowing multiple versions, or both.

**[Spec-ulation](https://www.youtube.com/watch?v=oyLBGkS5ICk)** (Rich Hickey, 2016). A Clojure/conj keynote arguing that semantic versioning is broken by design. Hickey's position: version numbers can't communicate meaning, breaking changes shouldn't exist, and we should grow APIs by accretion instead. Controversial, widely cited, and influenced how some ecosystems think about compatibility.

**[A universal package manager](https://pfultz2.com/blog/2017/10/27/universal-package-manager/)** (Paul Fultz II, 2017). Instead of building one universal C++ package manager, standardize specifications so existing tools can interoperate. A package spec for metadata and dependencies, a toolchain spec for build environments. More pragmatic than trying to replace everything.

**[Our Software Dependency Problem](https://research.swtch.com/deps)** (Russ Cox, 2019). We've embraced dependencies without understanding the risks. Developers now trust vast amounts of code from anonymous strangers with minimal oversight. Proposes a framework for evaluating whether to take on a dependency and how to manage it safely.

**[Semantic Versioning Will Not Save You](https://hynek.me/articles/semver-will-not-save-you/)** (Hynek Schlawack, 2021). Even well-intentioned maintainers can't predict all breaking changes. Per Hyrum's Law, every observable behavior becomes a contract. Pinning major versions just postpones problems while blocking security updates. Users must test updates regardless of version numbers.

**[The golden rule of software distributions](https://www.haskellforall.com/2022/05/the-golden-rule-of-software.html)** (Gabriella Gonzalez, 2022). Locally coherent package managers require globally coherent distributions. If your system only allows one version of each package, someone has to curate a set of versions that all work together. Explains why "Cabal hell" happened and how Stackage fixed it.

**[Thinking about dependencies](https://sunshowers.io/posts/dependencies/)** (Rain, 2024). Reframes dependency management as fundamentally a human trust problem. Technical tools like lockfiles and semver help, but deciding whether to depend on something requires evaluating both code quality and maintainer reliability. Proposes frameworks for making that judgment.

## Technical deep dives

**[Let's Dev: A Package Manager](https://classic.yarnpkg.com/blog/2017/07/11/lets-dev-a-package-manager/)** (Maël Nison, 2017). A Yarn maintainer walks through building a package manager from scratch, covering fetching, version resolution, dependency trees, and filesystem installation.

**[PubGrub: Next-Generation Version Solving](https://nex3.medium.com/pubgrub-2fb6470504f)** (Natalie Weizenbaum, 2018). Explains the algorithm that now powers Dart's pub, Python's uv, and others. Previous resolvers gave cryptic errors when they failed; PubGrub produces explanations of why no solution exists.

**[Minimal Version Selection](https://research.swtch.com/vgo-mvs)** (Russ Cox, 2018). Part of the vgo series that became Go modules. Argues that most version selection algorithms are overcomplicated and proposes picking the minimum version that satisfies constraints. Sparked debates about whether this simplicity comes at the cost of security updates.

**[Writing a package manager](https://antonz.org/writing-package-manager/)** (Anton Zhiyanov). How to build a package manager for SQLite extensions in Go. Practical design decisions: using a folder as source of truth, skipping dependency resolution for self-contained extensions, adding lockfiles and checksums. Finished in weeks of evening work.

**[The birth of a package manager](https://ochagavia.nl/blog/the-birth-of-a-package-manager/)** (Adolfo Ochagavía). Building rattler, a Rust library for the conda ecosystem. Covers SAT-based dependency resolution and performance optimization that cut resolution time from 20 seconds to 300 milliseconds.

**[Behind the scenes of bun install](https://bun.sh/blog/behind-the-scenes-of-bun-install)** (Bun team). How Bun made npm install fast: syscall batching, custom allocators, parallel resolution. Useful for understanding what "performance" actually means in package management.

**[Can Bundler be as fast as uv?](https://tenderlovemaking.com/2025/12/29/can-bundler-be-as-fast-as-uv/)** (Aaron Patterson, 2025). uv is fast because of what it doesn't do, not because it's written in Rust. Patterson analyzes Bundler's bottlenecks and argues most improvements don't require a rewrite.

**[go.sum is not a lockfile](https://words.filippo.io/gosum/)** (Filippo Valsorda, 2026). Stop parsing go.sum to analyze dependencies—it's a cache for the checksum database, not a lockfile. In Go, go.mod serves as both manifest and lockfile, which confuses people applying mental models from other ecosystems.

**[How we made Python's packaging library 3x faster](https://iscinumpy.dev/post/packaging-faster/)** (Henry Schreiner, 2026). The `packaging` library underpins pip's version resolution. Schreiner and pip maintainer Damian Shaw cut version parsing time in half and specifier checking by 3x through profiling with Python 3.15's statistical profiler, removing intermediate string conversions, and tuning the core regex with possessive quantifiers.

## Design rationales

**[CocoaPods](https://nshipster.com/cocoapods/)** (NSHipster, 2014). How CocoaPods brought dependency management to Objective-C. Inspired by Bundler and RubyGems, it resolved dependencies and configured Xcode projects automatically. Transformed iOS development from "every developer for themselves" into a collaborative ecosystem.

**[Cargo: Rust's package manager](https://blog.rust-lang.org/2014/11/20/Cargo.html)** (Yehuda Katz, 2014). Early announcement of Cargo's design principles. Many of its ideas became conventional wisdom: lockfiles by default, semantic versioning enforced, reproducible builds as a goal.

**[How Does Bundler Work, Anyway?](https://andre.arko.net/2015/04/28/how-does-bundler-work-anyway/)** (André Arko, 2015). A history of Ruby dependency management from `require` through RubyGems to Bundler. Explains why runtime dependency resolution causes activation errors and why we need resolution before runtime.

**[Why we built Yarn](https://engineering.fb.com/2016/10/11/web-development/yarn-a-new-package-manager-for-javascript/)** (Facebook Engineering, 2016). Explains the problems with npm at the time: non-deterministic installs, slow performance, security concerns. Introduced lockfiles to the JavaScript mainstream and pushed npm to improve. See also Yehuda Katz's companion post [I'm excited to work on Yarn](https://yehudakatz.com/2016/10/11/im-excited-to-work-on-yarn-the-new-js-package-manager-2/).

**[A History of Bundles: 2010 to 2017](https://andre.arko.net/2017/11/16/a-history-of-bundles/)** (André Arko, 2017). The evolution of Bundler from a long-time maintainer: source priority bugs, dependency confusion risks, and why Bundler needed thousands of hours of work despite appearing unchanged.

**[Go Modules in 2019](https://go.dev/blog/modules2019)** (Russ Cox, 2019). The roadmap for moving Go from GOPATH to modules. Covers the module index, authentication via a notary service, and mirrors. Decentralization is valuable but requires infrastructure for discovery and verification.

**[Making conda fast again](https://wolfv.medium.com/making-conda-fast-again-4da4debfb3b7)** (Wolf Vollprecht, 2019). The original mamba announcement. 300 lines of Python, 600 lines of C++ wrapping libsolv, the same SAT solver used in Fedora's dnf and openSUSE's zypper.

**[Open Software Packaging for Science](https://medium.com/@QuantStack/open-software-packaging-for-science-61cecee7fc23)** (QuantStack, 2020). Positions conda/mamba as a general-purpose package manager (not just Python), and explains the ecosystem vision: mamba, quetz (server), boa (builder).

**[Deno 1.28: Featuring npm compatibility](https://deno.com/blog/v1.28)** (Deno team, 2022). After years of avoiding npm, Deno adds compatibility. Explains how they import npm packages without node_modules and why they changed course.

**[Something new is brewing](https://medium.com/teaxyz/tea-brew-478a9e736638)** (Max Howell, 2022). The Homebrew creator announces tea, an attempt to build a decentralized package registry. Packages on-chain, immutable, signed by maintainers. Whether it works out or not, it's a serious rethinking of registry architecture.

**[uv: Unified Python Packaging](https://astral.sh/blog/uv-unified-python-packaging)** (Astral, 2024). Announces uv's expansion from pip replacement to full project manager. Positions it as "Cargo for Python" and argues a single fast tool can replace Poetry, PDM, pyenv, and pipx.

**[JSR is not another package manager](https://deno.com/blog/jsr-is-not-another-package-manager)** (Ryan Dahl, 2024). JSR as a modern JavaScript registry: ESM-only, TypeScript-first, with provenance via Sigstore. Complements npm rather than replacing it. See also Kitson Kelly's [JSR first impressions](https://www.kitsonkelly.com/posts/jsr-first-impressions).

**[A new Rust packaging model for Guix](https://guix.gnu.org/en/blog/2025/a-new-rust-packaging-model/)** (Guix team, 2025). Guix's approach to packaging Rust crates as proper distro packages rather than using Cargo directly. Shows the tension between language package managers and system package managers.

**[FAIR: A path forward for WordPress](https://joost.blog/path-forward-for-wordpress/)** (Joost de Valk, 2025). WordPress builds a decentralized distribution layer for plugins and themes. Not a fork, but a new package management system with federation, cryptographic signing, and support for commercial plugins. Inspired by Composer and Linux package managers.

## Incident postmortems

**[I've Just Liberated My Modules](https://kodfabrik.com/journal/i-ve-just-liberated-my-modules)** (Azer Koçulu, 2016). The left-pad author explaining why he unpublished his packages from npm. An 11-line string padding function disappeared and broke builds across the JavaScript ecosystem. Forced npm to change its unpublish policy.

**[kik, left-pad, and npm](https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm)** (npm, 2016). The institutional response to left-pad. npm restricts unpublishing after 24 hours, adds placeholder packages for abandoned names, and acknowledges they "dropped the ball." Pairs with Azer's post as the other side of the story.

**[Could Rust have a left-pad incident?](https://edunham.net/2016/03/24/could_rust_have_a_left_pad_incident.html)** (E. Dunham, 2016). Short answer: no. Cargo's yank doesn't delete code, it just prevents new dependencies. The only way to remove code from crates.io is direct intervention by the Rust team, making registry immutability a design choice rather than an accident.

**[How I broke Cargo for Windows](https://sasheldon.com/blog/2017/05/07/how-i-broke-cargo-for-windows/)** (Steven Sheldon, 2017). Publishing a crate named `nul` broke Cargo for all Windows users because NUL is a reserved filename dating back to DOS 1.0. The Rust team added 22 reserved names to the crates.io blacklist afterward.

**[The event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident)** (npm, 2018). A popular package's maintainer handed it off to someone who turned out to be an attacker. Malicious code targeted a specific Bitcoin wallet. Changed how people think about maintainer succession and trust.

**[Dependency Confusion: How I Hacked Into Apple, Microsoft and Dozens of Other Companies](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610)** (Alex Birsan, 2021). The discovery of dependency confusion: squatting internal package names on public registries. Changed how people think about private vs public resolution priority.

**[XZ Backdoor Attack CVE-2024-3094: All You Need To Know](https://jfrog.com/blog/xz-backdoor-attack-cve-2024-3094-all-you-need-to-know/)** (JFrog, 2024). Technical timeline of the multi-year social engineering operation: sock puppet accounts pressuring a burned-out maintainer, gradually gaining commit access, hiding payloads in test files.

## Ecosystem critiques

**[Thoughts on the Python packaging ecosystem](https://pradyunsg.me/blog/2023/01/21/thoughts-on-python-packaging/)** (Pradyun Gedam, 2023). A pip maintainer on why Python has so many competing tools. The ecosystem accidentally produced N roughly equivalent choices instead of one good default or N specialized tools. See also Chris Warrick's [How to improve Python packaging](https://chriswarrick.com/blog/2023/01/15/how-to-improve-python-packaging/) and [one year later](https://chriswarrick.com/blog/2024/01/15/python-packaging-one-year-later/) follow-up.

**[Why it took 4 years to get a lock files specification](https://snarky.ca/why-it-took-4-years-to-get-a-lock-files-specification/)** (Brett Cannon, 2025). The journey from 2019 discussions to PEP 751's acceptance, with 1,800+ community posts along the way. Lock files are simple in concept but getting consensus across uv, Poetry, and PDM required years of negotiation. See also his [other packaging posts](https://snarky.ca/tag/packaging/).

**[Winning a bet about six](https://sethmlarson.dev/winning-a-bet-about-six-the-python-2-compatibility-shim)** (Seth Larson, 2025). The Python 2/3 compatibility library `six` is still in PyPI's top 20 most-downloaded packages, years after Python 2's end of life. Transitive dependencies through libraries like `python-dateutil` keep it there. Legacy dependencies persist longer than anyone expects.

**[Flakes aren't real and cannot hurt you](https://jade.fyi/blog/flakes-arent-real/)** (Jade, 2024). Nix flakes are just an entry point with pinning, not a replacement for proper Nix patterns. The flakes-everywhere tutorials are teaching bad architecture. Use callPackage, overlays, and modules instead.

**[My failed attempt to shrink all npm packages by 5%](https://evanhahn.com/my-failed-attempt-to-shrink-all-npm-packages-by-5-percent/)** (Evan Hahn). An attempt to remove unnecessary files from npm packages. Reveals how much cruft gets published and how hard it is to change ecosystem norms.

**[Web deps](https://lea.verou.me/blog/2026/web-deps/)** (Lea Verou, 2026). The web platform has no first-class dependency management. Adding one dependency forces you to configure a bundler, a tool meant for optimization, not basic package resolution. Verou examines the workarounds (CDNs, copying files, direct node_modules imports) and finds them all broken.

## Anti-dependency philosophy

**[Micro-libraries need to die already](https://bvisness.me/microlibraries/)** (Ben Visness). Tiny packages should be copy-pasted, not depended on. A 245-byte utility balloons to 9.62 KB installed, and the supply chain risk isn't worth it.

**[npm: everything](https://boehs.org/node/npm-everything)** (Evan Boehs). Chronicles the absurdity of the npm ecosystem's small-module culture, equal parts documentation and exasperation.

**[Package managers are evil](https://www.gingerbill.org/article/2025/09/08/package-managers-are-evil/)** (Gingerbill, 2025). Argues package managers automate dependency hell instead of preventing it. Manual dependency management forces you to think about what you actually need. Advocates vendoring and robust standard libraries.

## Economics and governance

**[Roads and Bridges: The Unseen Labor Behind Our Digital Infrastructure](https://www.fordfoundation.org/work/learning/research-reports/roads-and-bridges-the-unseen-labor-behind-our-digital-infrastructure/)** (Nadia Eghbal, 2016). The Ford Foundation report that named the problem. Two-thirds of actively used GitHub projects rely on one or two developers. OpenSSL received less than $2,000/year in donations while encrypting two-thirds of the web. Money alone won't fix it; stewardship matters more than control.

**[A Year of Ruby, Together](https://andre.arko.net/2016/09/26/a-year-of-ruby-together/)** (André Arko, 2016). Why volunteer-maintained infrastructure doesn't scale. Experiments with funding models for Bundler and RubyGems.org.

**[The economics of package management](https://github.com/ceejbot/economics-of-package-management/blob/master/essay.md)** (C.J. Silverio, 2019). How JavaScript's package commons became controlled by a VC-backed company. Early contributors gave away valuable IP while npm Inc retained ownership. Silverio helped create Entropic as a federated alternative. Essential reading on who owns the infrastructure.

**[Making Homebrew financially sustainable](https://mikemcquaid.com/making-homebrew-financially-sustainable/)** (Mike McQuaid). How Homebrew achieved sustainable funding without exploitation. Partner with Software Freedom Conservancy for legal structure, add a one-time donation message, and be honest about needs. Now brings in $2,500-3,000/month on Patreon.

**[RubyGems contribution data with Homebrew's tooling](https://mikemcquaid.com/rubygems-contribution-data-with-homebrews-tooling/)** (Mike McQuaid). Using contribution metrics to analyze who has org access. Principle of least privilege applied to open source governance. Homebrew publishes both contribution data and finances publicly.

**[Security work isn't special](https://sethmlarson.dev/security-work-isnt-special)** (Seth Larson). Security shouldn't be isolated as the maintainer's sole burden. Proposes a model where trusted security contributors from the broader community help projects, enabled by reproducible builds and provenance tooling that scale trust beyond individual maintainers.

## Practical defense

**[Early promising results with SBOMs and Python packages](https://sethmlarson.dev/early-promising-results-with-sboms-and-python-packages)** (Seth Larson, 2024). Python wheels often bundle C libraries that vulnerability scanners can't see. Embedding a Software Bill of Materials fixes this. A proof-of-concept with Pillow went from detecting 1 component to 11.

**[We should all be using dependency cooldowns](https://blog.yossarian.net/2025/11/21/We-should-all-be-using-dependency-cooldowns)** (William Woodruff, 2025). Wait a week before auto-updating dependencies. Most supply chain attacks have exploitation windows under seven days. A simple Dependabot/Renovate config change that prevents most compromises. See also the [follow-up](https://blog.yossarian.net/2025/12/13/cooldowns-redux).

## System packaging debates

**[Debian discusses vendoring—again](https://lwn.net/Articles/842319/)** (LWN, 2021). The tension between distro packaging and language ecosystems. Debian's rule: one copy of each library, packaged separately. Go and npm make this nearly impossible. Kubernetes got a special exception. No consensus, just "bundling will likely be the path of least resistance."

**[Introducing distri](https://michael.stapelberg.ch/posts/2019-08-17-introducing-distri/)** (Michael Stapelberg, 2019). A research Linux distribution exploring faster package management. What if we designed a distro around fast package operations from the start?

**[Haiku package management](https://www.markround.com/blog/2023/02/13/haiku-package-management/)** (Mark Round, 2023). How Haiku OS does package management differently, worth reading because it's not constrained by compatibility with anything else.

**[Flatpak Is Not the Future](https://ludocode.com/blog/flatpak-is-not-the-future)** (Nicholas Fraser). Containerized app packaging bundles entire runtimes for megabytes of actual code. Graphics drivers need constant updates that runtimes can't track. The security claims are oversold. Advocates native binaries against stable system libraries.

---

What's missing? I'm sure there are influential posts from ecosystems I know less well. [Let me know](https://mastodon.social/@andrewnez) or [open a PR](https://github.com/andrew/nesbitt.io).
