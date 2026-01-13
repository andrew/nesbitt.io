---
layout: post
title: "Package managers keep using git as a database, it never works out"
date: 2025-12-24 10:00 +0000
description: "Git repositories seem like an elegant solution for package registry data. Pull requests for governance, version history for free, distributed by design. But as registries grow, the cracks appear."
tags:
  - package-managers
  - git
  - rust
  - go
  - deep-dive
---

Using git as a database is a seductive idea. You get version history for free. Pull requests give you a review workflow. It's distributed by design. GitHub will host it for free. Everyone already knows how to use it.

Package managers keep falling for this. And it keeps not working out.

## Cargo

The crates.io index started as a git repository. Every Cargo client cloned it. This worked fine when the registry was small, but the index kept growing. Users would see progress bars like "Resolving deltas: 74.01%, (64415/95919)" hanging for ages, the visible symptom of Cargo's libgit2 library grinding through [delta resolution](https://github.com/rust-lang/cargo/issues/9069) on a repository with thousands of historic commits.

The problem was worst in CI. Stateless environments would download the full index, use a tiny fraction of it, and throw it away. Every build, every time.

[RFC 2789](https://rust-lang.github.io/rfcs/2789-sparse-index.html) introduced a sparse HTTP protocol. Instead of cloning the whole index, Cargo now fetches files directly over HTTPS, downloading only the metadata for dependencies your project actually uses. (This is the "[full index replication vs on-demand queries](/2025/12/05/package-manager-tradeoffs.html)" tradeoff in action.) By April 2025, 99% of crates.io requests came from Cargo versions where sparse is the default. The git index still exists, still growing by thousands of commits per day, but most users never touch it.

## Homebrew

[GitHub explicitly asked Homebrew to stop using shallow clones.](https://github.com/Homebrew/brew/pull/9383) Updating them was ["an extremely expensive operation"](https://brew.sh/2023/02/16/homebrew-4.0.0/) due to the tree layout and traffic of homebrew-core and homebrew-cask.

Users were downloading 331MB just to unshallow homebrew-core. The .git folder approached 1GB on some machines. Every `brew update` meant waiting for git to grind through delta resolution.

Homebrew 4.0.0 in February 2023 switched to JSON downloads for tap updates. The reasoning was blunt: "they are expensive to git fetch and git clone and GitHub would rather we didn't do that... they are slow to git fetch and git clone and this provides a bad experience to end users."

Auto-updates now run every 24 hours instead of every 5 minutes, and they're much faster because there's no git fetch involved.

## CocoaPods

CocoaPods is the package manager for iOS and macOS development. It hit the limits hard. The Specs repo grew to hundreds of thousands of podspecs across a deeply nested directory structure. Cloning took minutes. Updating took minutes. CI time vanished into git operations.

GitHub imposed CPU rate limits. The culprit was shallow clones, which force GitHub's servers to compute which objects the client already has. The team tried various band-aids: stopping auto-fetch on `pod install`, converting shallow clones to full clones, [sharding the repository](https://blog.cocoapods.org/Sharding/).

The CocoaPods blog captured it well: ["Git was invented at a time when 'slow network' and 'no backups' were legitimate design concerns. Running endless builds as part of continuous integration wasn't commonplace."](https://blog.cocoapods.org/Master-Spec-Repo-Rate-Limiting-Post-Mortem/)

CocoaPods 1.8 [gave up on git entirely](https://blog.cocoapods.org/CocoaPods-1.8.0-beta/) for most users. A CDN became the default, serving podspec files directly over HTTP. The migration saved users about a gigabyte of disk space and made `pod install` nearly instant for new setups.

## Nixpkgs

Nix already solved the client-side problem. The package manager fetches expressions as [tarballs via channels](https://releases.nixos.org/nix/nix-2.13.6/manual/package-management/channels.html), served from S3 and CDN, not git clones. Binary caches serve built packages over HTTP. End users never touch the git repository.

But the repository itself is stress-testing GitHub's infrastructure. In November 2025, GitHub contacted the NixOS team about [periodic maintenance jobs failing](https://discourse.nixos.org/t/nixpkgs-core-team-update-2025-11-30-github-scaling-issues/72709) and causing "issues achieving consensus between replicas." If unresolved, the repository could have become read-only.

The repository totals 83GB with half a million tree objects and 20,000 forks. A local clone is only 2.5GB. The rest is GitHub's fork network storing every pull request branch and merge commit. The CI queries mergeability daily, creating new merge commits each time.

## vcpkg

vcpkg is Microsoft's C++ package manager. It uses git tree hashes to version its ports, with the curated registry at [github.com/Microsoft/vcpkg](https://github.com/Microsoft/vcpkg) containing over 2,000 libraries.

The problem is that vcpkg needs to retrieve specific versions of ports by their git tree hash. When you specify a `builtin-baseline` in your vcpkg.json (functioning like a lockfile for reproducible builds), vcpkg looks up historical commits to find the exact port versions you need. This only works if you have the full commit history.

Shallow clones break everything. GitHub Actions uses shallow clones by default. DevContainers [shallow-clone vcpkg](https://github.com/devcontainers/images/issues/398) to save space. CI systems optimize for fast checkouts. All of these result in the same error: "vcpkg was cloned as a shallow repository... Try again with a full vcpkg clone."

The workarounds are ugly. One [proposed solution](https://github.com/devcontainers/images/issues/398) involves parsing vcpkg.json to extract the baseline hash, deriving the commit date, then fetching with `--shallow-since=<date>`. Another suggests including twelve months of history, hoping projects upgrade before their baseline falls off the cliff. For GitHub Actions, you need `fetch-depth: 0` in your checkout step, [downloading the entire repository history](https://github.com/microsoft/vcpkg/issues/25349) just to resolve dependencies.

A vcpkg team member [explained the fundamental constraint](https://github.com/microsoft/vcpkg/issues/25349): "Port versions don't use commit hashes, we use the git tree hash of the port directory. As far as I know, there is no way to deduce the commit that added a specific tree hash." An in-product fix is infeasible. The architecture baked in git deeply enough that there's no escape hatch.

Unlike Cargo, Homebrew, and CocoaPods, vcpkg hasn't announced plans to move away from git registries. Custom registries must still be git repositories. The documentation describes filesystem registries as an alternative, but these require local or mounted paths rather than HTTP access. There's no CDN, no sparse protocol, no HTTP-based solution on the horizon.

## Go modules

[Grab's engineering team](https://engineering.grab.com/go-module-proxy) went from 18 minutes for `go get` to 12 seconds after deploying a module proxy. That's not a typo. Eighteen minutes down to twelve seconds.

The problem was that `go get` needed to fetch each dependency's source code just to read its go.mod file and resolve transitive dependencies. Cloning entire repositories to get a single file.

Go had security concerns too. The original design wanted to remove version control tools entirely because ["these fragment the ecosystem: packages developed using Bazaar or Fossil, for example, are effectively unavailable to users who cannot or choose not to install these tools."](https://arslan.io/2019/08/02/why-you-should-use-a-go-module-proxy/) Beyond fragmentation, the Go team worried about security bugs in version control systems becoming security bugs in `go get`. You're not just importing code; you're importing the attack surface of every VCS tool on the developer's machine.

GOPROXY became the default in Go 1.13. The proxy serves source archives and go.mod files independently over HTTP. Go also introduced a [checksum database (sumdb)](/2025/12/21/federated-package-management.html#gos-experiment-with-dns) that records cryptographic hashes of module contents. This protects against force pushes silently changing tagged releases, and ensures modules remain available even if the original repository is deleted.

## Beyond package managers

The same pattern shows up wherever developers try to use git as a database.

Git-based wikis like Gollum (used by GitHub and GitLab) become ["somewhat too slow to be usable"](https://github.com/gollum/gollum/issues/1940) at scale. Browsing directory structure takes seconds per click. Loading pages takes longer. [GitLab plans to move away from Gollum entirely.](https://docs.gitlab.com/ee/development/wikis.html)

Git-based CMS platforms like Decap hit GitHub's API rate limits. A Decap project on GitHub [scales to about 10,000 entries](https://decapcms.org/blog/git-based-cms-definition-features-best-practices/) if you have a lot of collection relations. A new user with an empty cache makes a request per entry to populate it, burning through the 5,000 request limit quickly. If your site has lots of content or updates frequently, use a database instead.

Even GitOps tools that embrace git as a source of truth have to work around its limitations. ArgoCD's repo server [can run out of disk space](https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/) cloning repositories. A single commit invalidates the cache for all applications in that repo. Large monorepos need special scaling considerations.

## The pattern

The hosting problems are symptoms. The underlying issue is that git inherits filesystem limitations, and filesystems make terrible databases.

**Directory limits.** Directories with too many files become slow. CocoaPods had [16,000 pod directories](https://blog.cocoapods.org/Sharding/) in a single Specs folder, requiring huge tree objects and expensive computation. Their fix was hash-based sharding: split directories by the first few characters of a hashed name, so no single directory has too many entries. Git itself does this internally with its objects folder, splitting into 256 subdirectories. You're reinventing B-trees, badly.

**Case sensitivity.** Git is case-sensitive, but macOS and Windows filesystems typically aren't. [Check out a repo containing both `File.txt` and `file.txt` on Windows](https://learn.microsoft.com/en-us/azure/devops/repos/git/os-compatibility), and the second overwrites the first. [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/repos/git/case-sensitivity) had to add server-side enforcement to block pushes with case-conflicting paths.

**Path length limits.** Windows restricts paths to [260 characters](https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation), a constraint dating back to DOS. Git supports longer paths, but Git for Windows inherits the OS limitation. This is painful with deeply nested node_modules directories, where `git status` fails with "Filename too long" errors.

**Missing database features.** Databases have CHECK constraints and UNIQUE constraints; git has nothing, so every package manager builds its own validation layer. Databases have locking; git doesn't. Databases have indexes for queries like "all packages depending on X"; with git you either traverse every file or build your own index. Databases have migrations for schema changes; git has "rewrite history and force everyone to re-clone."

The progression is predictable. Start with a flat directory of files. Hit filesystem limits. Implement sharding. Hit cross-platform issues. Build server-side enforcement. Build custom indexes. Eventually give up and use HTTP or an actual database. You've built a worse version of what databases already provide, spread across git hooks, CI pipelines, and bespoke tooling.

None of this means git is bad. Git excels at what it was designed for: distributed collaboration on source code, with branching, merging, and offline work. The problem is using it for something else entirely. Package registries need fast point queries for metadata. Git gives you a full-document sync protocol when you need a key-value lookup.

If you're building a package manager and git-as-index seems appealing, look at Cargo, Homebrew, CocoaPods, vcpkg, Go. They all had to build workarounds as they grew, causing pain for users and maintainers. The pull request workflow is nice. The version history is nice. You will hit the same walls they did.
