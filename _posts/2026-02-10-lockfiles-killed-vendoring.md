---
layout: post
title: "Lockfiles Killed Vendoring"
date: 2026-02-10 10:00 +0000
description: "Why almost nobody vendors their dependencies anymore."
tags:
  - package-managers
  - deep-dive
  - dependencies
---

Whilst I was implementing a [vendor command in git-pkgs](https://github.com/git-pkgs/git-pkgs/pull/98), I noticed that not many package manager clients have native vendoring commands. Go has `go mod vendor`, Cargo has `cargo vendor`, and Bundler has `bundle cache`. That's most of the first-class support I could find, which surprised me for something that used to be the dominant way to manage dependencies. So I went looking for what happened.

### Vendoring under SVN

Before lockfiles and registries, if you wanted reproducible builds you checked your dependencies into source control. The alternative was hoping the internet served you the same bytes tomorrow.

Under Subversion this worked fine. SVN checkouts only pull the current revision of the directories you ask for, leaving everything else on the server. You never download previous versions of vendored files, so a dependency updated twenty times costs you the same as one updated once. A 200MB vendor directory doesn't slow you down if you never check it out, and CI can do the same. Most developers on a project never touched `vendor/` directly, and the cost of carrying all that third-party code was invisible to everyone who wasn't actively updating it.

Rails formalized the convention with `vendor/` for third-party code and `lib/` for your own. You could even freeze the Rails framework itself into your vendor directory with `rake rails:freeze:gems`. Chris Wanstrath's "Vendor Everything" post on [err the blog](https://web.archive.org/web/2007/http://errtheblog.com/posts/50-vendor-everything) in 2007 named the philosophy, though the practice traces back to 2006. Ryan McGeary updated it for the Bundler era in 2011 with ["Vendor Everything Still Applies"](http://ryan.mcgeary.org/2011/02/09/vendor-everything-still-applies/): "Storage is cheap. You'll thank me later when your deployments run smoothly." Bundler's arrival was effectively Rails admitting that physical vendoring was a dead end: pin versions in a lockfile instead. Composer made `vendor/` its default install target. The name stuck because it was already familiar.

### git clone

Git clones the entire repository history by default. Every developer, every CI run, gets everything. A vendored dependency updated twenty times means twenty snapshots of its source tree in your .git directory, forever. Shallow clones and partial clones help, but as I wrote in [package managers keep using git as a database](/2025/12/24/package-managers-keep-using-git-as-a-database/), they're workarounds for a problem SVN never had.

The weight became visible in ways it hadn't been before: code search indexed everything in `vendor/`. GitHub's language statistics counted vendored code unless you added `linguist-vendored` to .gitattributes. Pull requests touching `vendor/` generated walls of diff noise. The developer experience of working with a vendored codebase went from tolerable to actively painful.

Security tooling piled on: GitHub's dependency graph, Dependabot, and similar tools parse lockfiles and manifests to find vulnerable dependencies. Vendored code is invisible to them unless you go out of your way to make it discoverable. The entire vulnerability scanning ecosystem assumed lockfiles won and built around that assumption, which created a feedback loop: the more teams relied on automated scanning, the more vendoring looked like a liability rather than a safety net.

### Lockfiles and registries

Bundler shipped Gemfile.lock in 2010, one of the first lockfiles to pin exact dependency versions with enough information to reproduce an install. But the ecosystem where vendoring arguments ran hottest didn't have one for years. npm launched in 2010 too, and you'd specify `^1.2.0` in package.json and get whatever the registry served that day.

[Yarn launched](https://engineering.fb.com/2016/10/11/web/yarn-a-new-package-manager-for-javascript/) in October 2016 with yarn.lock and content hashes from day one. npm followed with [package-lock.json in npm 5.0](https://blog.npmjs.org/post/161081169345/v500) in May 2017. Once lockfiles recorded exact versions and integrity hashes (I covered the design choices in [lockfile format design and tradeoffs](/2026/01/17/lockfile-format-design-and-tradeoffs/)), you got reproducible builds without storing the code. The lockfile records what to fetch, the registry serves it, and the hash proves nothing changed in transit.

Lockfiles spread to every major ecosystem. The [package manager timeline](/2025/11/15/package-manager-timeline) shows them arriving in waves: Bundler in 2010, Cargo.lock with Rust in 2015, Yarn and npm in 2016-2017, Poetry and uv bringing proper lockfiles to Python. Each one made vendoring less necessary for that community.

### left-pad

In March 2016, a developer [unpublished the 11-line left-pad package](https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm) from npm and broke builds across the ecosystem, including React and Babel. The immediate reaction was a rush back toward vendoring. If the registry can just delete packages, how can you trust it?

The long-term response went the other way: npm [tightened its unpublish policy](https://docs.npmjs.com/policies/unpublish). Lockfiles with content hashes meant even a re-uploaded package with different code would be caught. And enterprise proxy caches like [Artifactory](https://jfrog.com/artifactory/) filled the remaining availability gap: a local mirror that your builds pull from, still serving packages even when the upstream registry goes down or a maintainer rage-quits. The availability guarantee of vendoring, without anything in your git history.

left-pad is sometimes framed as vindication for vendoring. I think it was the moment the industry decided to [fix registry governance](/2025/12/22/package-registries-are-governance-as-a-service/) rather than abandon registries altogether.

### The C-shaped hole

C never went through this transition because it never had the prerequisites: no dominant language package manager, no central registry that everyone publishes to, and no lockfile format. A lockfile is just a pointer to something in a registry, and if there's no reliable registry to point to, you have to bring the code with you.

As I wrote in [The C-Shaped Hole in Package Management](/2026/01/27/the-c-shaped-hole-in-package-management/), developers are still dropping .c and .h files into source trees the way they have since the 1970s. Libraries like SQLite and stb are distributed as single files specifically to make this easy. Conan and vcpkg exist now, but neither has the cultural ubiquity that would make vendoring unnecessary. Without a registry everyone agrees on, vendoring in C remains the path of least resistance.

### Go and the Google problem

Go was one of the last major languages to move past vendoring, and the reason traces straight back to Google. Go was designed at Google, by Google engineers, for Google's development workflow. Google runs a monorepo and prizes hermetic builds: every build must be fully reproducible from what's in the repository, with zero outside dependencies. Vendoring is how you get hermeticity, so all third-party code lives in the repository alongside first-party code, maintained by dedicated teams and managed by advanced tooling.

So Go shipped without a real package manager. `go get` fetched the latest commit from a repository with no versions, no lockfiles, and no registry. Russ Cox later acknowledged this in his [Go += Package Versioning](https://research.swtch.com/vgo) series: "It was clear in the very first discussions of goinstall [in 2010] that we needed to do something about versioning. Unfortunately, it was not clear... exactly what to do." They didn't experience the pain internally because Google's monorepo doesn't need versions, since everything builds at head.

The community filled the gap with godep, glide, and dep, and all of them used a `vendor/` directory. [Go 1.5 formalized vendoring support](https://go.googlesource.com/proposal/+/master/design/25719-go15vendor.md) in 2015, blessing what everyone was already doing. For five years, vendoring was the official answer.

Go modules arrived in Go 1.11 in 2018 with go.mod and go.sum. But the piece that actually replaced vendoring came later: the module proxy at proxy.golang.org and the checksum database at sum.golang.org. Russ Cox argued in [Defining Go Modules](https://research.swtch.com/vgo-module) that the proxy made vendor directories "almost entirely redundant." The proxy caches modules indefinitely and the sum database verifies integrity, so together they provide monorepo-level guarantees to people who don't have a monorepo: if the source disappears, the proxy still has it; if the code changes, the checksum catches it.

As of this writing, Kubernetes still vendors its dependencies, a large project with the discipline to keep vendored code current, the same discipline Google has in its monorepo. Most teams don't have that discipline, and for them, vendored dependencies go stale quietly until someone discovers a CVE six versions behind.

### Nix and Guix

Nix and Guix take the idea in a different direction. They do something that looks a lot like vendoring but with different mechanics, and they go further than anyone else ever did. Nix doesn't just vendor your libraries but the entire build closure: the library, the compiler that built it, the linker, the kernel headers. Every input gets copied into a content-addressed store, pinned by hash. A Nix `flake.lock` file pins exact input revisions and gets committed to the repository, while `nix build` fetches everything into `/nix/store` where it lives alongside every other version of every other package, isolated and immutable.

It's hermeticity without the monorepo. You get offline builds, exact reproducibility, and a verifiable record of what went into your project. But the code lives in the Nix store rather than your repository, so you don't pay the git history cost that made traditional vendoring painful. The tradeoff is complexity: you need to buy into Nix's model of the world, and the learning curve is steep.

If the vendoring instinct was always about control (knowing exactly what code you're running, not depending on a registry being up and honest), then Nix is where that instinct ended up for the people who took it the most seriously.
