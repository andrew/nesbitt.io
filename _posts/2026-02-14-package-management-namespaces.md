---
layout: post
title: "Package Management Namespaces"
date: 2026-02-14
description: "Comparing namespace models across npm, Maven, Go, Swift, and crates.io."
tags:
  - package-managers
---

Every package needs a name. The rules for how those names work is one of the most consequential decisions a package manager makes, and one of the hardest to change later. I [categorized the approaches](/2025/12/29/categorizing-package-registries.html) previously and touched on the [tradeoffs](/2025/12/05/package-manager-tradeoffs.html) briefly.

### Flat namespaces

RubyGems, PyPI, crates.io, Hex, Hackage, CRAN, and LuaRocks all use flat namespaces: one global pool of names, first-come-first-served. You pick a name, and if nobody has it, it's yours.

This gives you `gem install rails`, `pip install requests`, `cargo add serde`. The names are short, memorable, and greppable, with no punctuation to remember and no organization to look up.

At scale, though, good names run out. Someone registers `database` on day one and never publishes a real package. Or they publish something, abandon it, and the name sits there forever, pointing at a library last updated in 2013. PyPI has over 600,000 projects. Many of the short, obvious names were claimed years ago by packages with single-digit downloads.

Name scarcity creates pressure, and you end up with `python-dateutil` because `dateutil` was taken, `beautifulsoup4` because `beautifulsoup` was the old version, or `pillow` because the original `PIL` package was abandoned and PyPI doesn't recycle names. New developers have to learn not just what to install but which of several similar-sounding packages is the right one.

Flat namespaces also make [typosquatting](/2025/12/17/typosquatting-in-package-managers.html) straightforward. Someone registers `reqeusts` next to `requests` and waits. The attack works because there's nothing between the user's keystrokes and the registry lookup, no organization to verify and no hierarchy to navigate, just a string match against a flat list.

Some registries add normalization rules to limit this. PyPI treats hyphens, underscores, and dots as equivalent, so `my-package` and `my_package` resolve to the same thing. crates.io does similar normalization. RubyGems doesn't, which is why both `stripe` and `stripe-ruby` can coexist as unrelated packages.

### Scoped namespaces

npm added scopes in 2014. Instead of just `babel-core`, you could publish `@babel/core`. Packagist has always used `vendor/package` format: `symfony/console`, `laravel/framework`. JSR, Ansible Galaxy, Puppet Forge, and others follow similar patterns.

Scopes split the package name into two parts: who published it, and what they called it. Different organizations can use the same package name without collision, so `@types/node` and `@anthropic/node` coexist without confusion.

npm's implementation is interesting because scopes are optional. You can still publish unscoped packages to the flat namespace. So npm actually has two systems running in parallel: a flat namespace for legacy packages and a scoped namespace for newer ones.

Most of the ecosystem's most-used packages (`express`, `lodash`, `react`) predate scopes and sit in the flat namespace. Scopes are most common for organizational packages (everything under `@angular/`, for example) and type definitions (`@types/`). And because so much of the ecosystem depends on unscoped names, npm can never require scopes without breaking the world.

Packagist required scopes from the start. Every Composer package is `vendor/package`, no exceptions. This avoided the split-namespace problem npm has, but it means you need to know the vendor name. Is it `guzzlehttp/guzzle` or `guzzle/guzzle`? You have to look it up. And vendor names themselves are first-come-first-served, just pushing the squatting problem up one level. The stakes are higher, though, because squatting a vendor name locks out an entire family of package names rather than just one. Someone could register the `google` vendor on Packagist before Google gets there, and that blocks every `google/*` package at once.

Scopes also require governance. Who decides that `@babel` belongs to the Babel team? npm ties scopes to user accounts and organizations, which means you need account management, ownership transfer procedures, and dispute resolution. When a maintainer leaves a project, their scoped packages might need to move. This is solvable but adds operational overhead that flat registries avoid.

### Hierarchical namespaces

Maven Central uses reverse-domain naming: `org.apache.commons:commons-lang3`, `com.google.guava:guava`. The group ID is supposed to correspond to a domain you control.

The reverse-domain approach ties naming authority to DNS. If you own `example.com`, you can publish under `com.example`. This defers governance to the existing DNS system rather than requiring the registry to manage name ownership. Maven Central enforces this by requiring you to prove domain ownership, or for projects without their own domain, to use `io.github.username` as a fallback.

That fallback is interesting because it quietly undermines the premise: the whole point of reverse-domain naming is that you prove ownership of infrastructure you control, but `io.github.username` just defers to GitHub's namespace. It's URL-based naming wearing a reverse-domain costume.

Organizations with stable domains get clean namespaces out of this. Apache, Google, and Spring all have clear homes. The trade-off is verbose identifiers. `org.springframework.boot:spring-boot-starter-web` is a lot of characters. IDE autocompletion papers over this in Java, but the verbosity is real when reading build files or discussing dependencies.

Domain ownership is also less stable than it looks. Companies get acquired and change domains. Open source projects move between hosting organizations. A package published under `com.sun.xml` in 2005 might need to live under `com.oracle.xml` after the acquisition, except it can't, because changing the group ID would break every project that depends on the old one. So old names persist as historical artifacts.

The hierarchy also doesn't prevent all squatting. Someone could register a domain specifically to claim a Maven namespace. More concerning is domain resurrection: when a domain expires after its owner has already registered a Maven group ID, anyone can buy that domain and potentially claim the namespace. Maven Central [verifies domain ownership](https://central.sonatype.org/register/namespace/) when you first register a group ID, requiring a DNS TXT record, but that verification is a point-in-time check.

In January 2024, security firm Oversecured published [MavenGate](https://blog.oversecured.com/Introducing-MavenGate-a-supply-chain-attack-method-for-Java-and-Android-applications/), an analysis of 33,938 domains associated with Maven group IDs. They found that 6,170 of them, roughly 18%, had expired or were available for purchase. The affected group IDs included widely-used libraries like `co.fs2`, `net.jpountz.lz4`, and `com.opencsv`. A new owner of any of those domains could publish new versions under the existing group ID. Existing artifacts on Maven Central are immutable so old versions wouldn't change, but build files that pull the latest version would pick up the attacker's release.

Sonatype responded by disabling accounts tied to expired domains and tightening their verification process, but they haven't announced ongoing domain monitoring. PyPI, facing the same problem with account email domains, [built automated daily checks](https://blog.pypi.org/posts/2025-08-18-preventing-domain-resurrections/) in 2025 and found around 1,800 accounts to unverify.

Clojars shows what happens when a registry in the Maven ecosystem takes a different approach. Clojure libraries are distributed as Maven artifacts, but Clojars originally let you use any group ID without verification. You could publish under `hiccup` or `ring` with no domain proof. This was simpler for the Clojure community, where most libraries are small and maintained by individuals, but it meant Clojars had a much more relaxed namespace than Maven Central.

Since build tools can pull from both registries, the gap created a dependency confusion risk: an attacker could register an unverified group on Clojars that shadows a legitimate Maven Central library. In 2021, after dependency confusion attacks became widely understood, Clojars [started requiring verified group names](https://github.com/clojars/clojars-web/wiki/Verified-Group-Names) for new projects, adopting the same reverse-domain convention as Maven Central. Existing projects with unverified groups were grandfathered in, so the old flat names still exist alongside the new hierarchical ones.

### URL-based identifiers

Go modules use import paths that are URLs: `github.com/gorilla/mux`, `golang.org/x/crypto`. There's no registration step. The URL points to a repository, and the module system fetches code from there (or from the Go module proxy, which caches it).

This model sidesteps the registry as naming authority entirely. You publish code to a repository and the URL is the identifier, with no approval step required. Name collisions don't arise because URLs are globally unique by construction, and owning the repo means owning the name.

Names become tied to hosting infrastructure, though. When `github.com/user/repo` is the package identity, a GitHub org rename breaks every downstream consumer. Go addressed this with the module proxy, which caches modules so they survive repo disappearance, but the name still reflects the original location even if the code has moved. Import paths like `github.com/golang/lint` that redirect to `golang.org/x/lint` create confusion about which is canonical. And your package identity depends on a third party either way: GitHub controls the `github.com` namespace, so if they ban your account or the organization renames, your package identity changes. You've traded one governance dependency for another, a hosting platform instead of a registry.

"No registration step" has its own consequences. Without a registry to mediate names, there's no obvious place to check for existing packages, no search, no download counts, no centralized vulnerability database. Go built most of these features separately with pkg.go.dev and the module proxy. The URL-based naming stayed, but the surrounding infrastructure converged toward what registries provide anyway, just assembled differently.

Deno launched with raw URL imports and eventually built [JSR](https://jsr.io), a scoped registry with semver resolution, because URL imports created [problems they couldn't solve](https://deno.com/blog/http-imports) at the URL layer: duplicated dependencies when the same package was imported from slightly different URLs, version management scattered across every import statement, and reliability issues when hosts went offline. You can start without a registry, but the things registries do (search, versioning, deduplication, availability) keep needing to be solved, and solving them piecemeal tends to reconverge on something registry-shaped.

### Swift Package Manager

Apple hired Max Howell to build SwiftPM in 2015. He'd created Homebrew and used both CocoaPods and Carthage heavily, so he arrived with strong opinions about how a language package manager should work. As he told [The Changelog](https://changelog.com/podcast/232): "I'd been involved with CocoaPods and Carthage and used them heavily, and obviously made Homebrew, so I had lots of opinions about how a package manager should be." He was drawn to decentralization, something he wished Homebrew had from the start.

Carthage had already demonstrated the approach in the Apple ecosystem, launching in 2014 as a deliberate reaction against CocoaPods' centralized registry, using bare Git URLs with no registry at all. SwiftPM followed the same path, using Git repository URLs as package identifiers with no central registry.

Go made the same choice but then spent years building infrastructure around it: a module proxy that caches source in immutable storage so deleted repos still resolve, a checksum database (`sum.golang.org`) that uses a transparency log to guarantee every user gets identical content for a given version, and pkg.go.dev for search and discovery.

SwiftPM doesn't have any of this yet. Every `swift package resolve` clones directly from the Git host. If a repo disappears, resolution fails with no fallback. SwiftPM records a fingerprint per package version the first time it downloads it, but that fingerprint lives on your machine only. There's no global database to verify that what you downloaded matches what everyone else got, no way to detect a targeted attack serving different content to different users.

A [2022 Checkmarx study](https://checkmarx.com/blog/chainjacking-the-new-supply-chain-attack/) found thousands of packages across Go and Swift vulnerable to repo-jacking, where an attacker registers an abandoned GitHub username and recreates a repo that existing packages still point to. Go's proxy mitigates this because cached modules don't re-fetch from the source, but SwiftPM has no such layer.

The pieces to fix this are partly in place. Apple defined a [registry protocol](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0292-package-registry-service.md) (SE-0292, shipped in Swift 5.7) and built client support for it in SwiftPM, including package signing. JFrog and AWS CodeArtifact already implement the protocol for enterprise use. Rick Ballard mentioned wanting "a real index for Swift packages" with "a standardized namespace" at WWDC 2018.

The client tooling is ready, the protocol is specified, and the ecosystem is still small enough that introducing a namespace layer wouldn't require the kind of painful migration that npm or PyPI face. The [Swift Package Index](https://swiftpackageindex.com), community-run and Apple-sponsored, already tracks around 12,000 packages. What's missing is the public registry service itself and the integrity infrastructure around it, and the window for adding these before the ecosystem's size makes it much harder is not open forever.

### Distro-managed namespaces

Debian, Fedora, Arch, Alpine, Homebrew, Nixpkgs, Conda-forge, and FreeBSD ports all use names controlled by distribution maintainers rather than upstream authors. The upstream project might call itself `imagemagick`, but the Debian package is `libmagickwand-dev`. Homebrew calls it `imagemagick`. Nixpkgs calls it `imagemagick`. Each distribution has its own naming conventions and its own maintainers making naming decisions.

This model works because distro packages are curated rather than self-published. A human reviews the package, decides what it should be called, and takes responsibility for integration. The naming authority is the distribution maintainer rather than the software author, and the naming optimizes for system integration rather than upstream branding. Debian doesn't care what the project calls itself if `libmagickwand-dev` better describes where the package fits in the system.

The disconnect between upstream names and distribution names can be disorienting, though. Python's `requests` library is `python3-requests` in Debian and `python-requests` in Arch. Ruby's `nokogiri` is `ruby-nokogiri` in Debian. These translations are learnable but add friction, especially when following tutorials written for a different platform.

Distro-managed namespaces operate at a different scale than language registries. Debian has around 60,000 source packages. npm has millions. The curation model wasn't designed for that kind of velocity, and doesn't try to be.

### The migration problem

As I wrote about in [Package Management is a Wicked Problem](/2026/01/23/package-management-is-a-wicked-problem.html), once PyPI accepted namespace-less package names, that was permanent. If PyPI added mandatory namespaces tomorrow, every existing `requirements.txt`, every tutorial, every CI script would need updating. The new system would have to support both namespaced and un-namespaced packages indefinitely. You haven't replaced the flat namespace, you've just added a layer on top of it.

npm's experience shows what this looks like in practice. Scoped packages have been available since 2014, but most of the ecosystem still uses flat names. The existence of scopes didn't make `express` become `@expressjs/express` because too much already depends on the existing name. Scopes ended up being used primarily for new packages and organizational groups rather than as a migration path for the existing namespace.

NuGet went through a partial migration. It added package ID prefix reservation in 2017, letting Microsoft reserve the `Microsoft.*` prefix. But this is a bolt-on: the underlying namespace is still flat, and the prefixes are just a verified badge on the registry UI. It helps users identify official packages but doesn't change the naming model.

PyPI is threading this needle right now with [PEP 752](https://peps.python.org/pep-0752/), which proposes letting organizations reserve package name prefixes. Google could reserve `google-cloud-`, Apache could reserve `apache-airflow-providers-`, and future uploads matching those prefixes would require authorization from the namespace owner. Like NuGet's approach, it requires no installer changes and leaves existing packages unaffected. It only applies going forward, though, and the thousands of existing packages with no organizational prefix remain as they are.

Cargo and crates.io are attempting something more ambitious. The Rust community has been discussing namespaces since at least 2014, and after several earlier proposals that leaned toward npm-style user or org scopes, they settled on [RFC 3243](https://rust-lang.github.io/rfcs/3243-packages-as-optional-namespaces.html) ("Packages as Optional Namespaces"), authored by Manish Goregaokar, who had been working on the problem since at least 2018 when the first "packages as namespaces" pre-RFC appeared.

The approach treats existing crate names as potential namespace roots: if you own the `serde` crate, you can publish `serde::derive`, and only owners of `serde` can create crates in that namespace. Ownership flows down automatically. The `::` separator was chosen after extensive debate because it aligns with Rust's existing path syntax, so `serde::derive::Deserialize` reads naturally in Rust source. An earlier proposal used `/` but that conflicted with Cargo's feature syntax.

The design is carefully scoped. Namespaces are optional, so the flat namespace stays and nothing breaks. It's framed around projects rather than organizations, with the primary use cases being things like `serde::derive` or `tokio::macros` rather than org-level grouping. Only single-level nesting is supported for now. And they explicitly chose not to do NuGet-style prefix reservation because in a flat namespace where `serde-derive` already exists, reserving the `serde-` prefix would create confusion about whether existing `serde-*` crates are actually owned by `serde`.

The migration challenges are real even with this careful design. A crate like `tokio-macros` already exists in the flat namespace, and transitioning it to `tokio::macros` means a new name that every downstream consumer would need to update. The RFC suggests maintaining re-export crates during transition, but there's no alias mechanism yet. Some projects face an even harder version of this problem: the `async-std` project manages a family of `async-*` crates, but someone else owns the `async` crate, so they can't use it as their namespace root.

The RFC was accepted and became an official Rust project goal for 2025, led by Ed Page on the Cargo team. As of late 2025, Cargo support is partially implemented but compiler support is still in progress, requiring coordination across the lang, compiler, and crates.io teams. It's the most carefully designed attempt at retrofitting namespaces onto a flat registry that I'm aware of, and the fact that it's taking years of design and implementation work for a well-resourced community with strong governance shows how hard this problem is once a flat namespace is established.

If you're starting a registry today, you don't have to require namespaces from day one, but you could reserve the separator character and the ownership semantics so that namespaces can be added later without conflicting with existing names. The reason crates.io can use `::` is that no existing crate name contains it. If they'd allowed colons in crate names from the start, this whole approach would have been foreclosed. Keeping your options open costs almost nothing at launch and can save years of design work later.
