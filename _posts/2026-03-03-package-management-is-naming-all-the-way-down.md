---
layout: post
title: "Package Management is Naming All the Way Down"
date: 2026-03-03 10:00 +0000
description: "There are two hard problems in computer science, and package managers found at least eight of them."
tags:
  - package-managers
---

Package managers are usually described by what they do: resolve dependencies, download code, build artifacts. But if you look at the structure of the system instead of the process, nearly every part of it is a naming problem, and the whole thing works because we've agreed on how to interpret strings at each layer and because a registry sits in the middle translating between them.

### Registries

When you run `gem install rails`, the client needs to know where to look. RubyGems defaults to rubygems.org, pip to pypi.org, npm to registry.npmjs.org, and that default is just a URL baked into the client configuration. You can change it, which is exactly what makes [dependency confusion](/2025/12/10/slopsquatting-meets-dependency-confusion.html) possible: if your client checks a public registry before a private one and the names overlap, an attacker who registers the right name on the public registry wins.

Companies run private registries with different names for the same packages, or the same names for different packages. Nix, Guix, and Spack layer multiple package repositories with their own namespaces on top of each other. Go uses URL-based module paths where the registry name is literally embedded in the package identity. Which registry you're talking to determines what every other name in the system means, because a registry name is really a lookup context: give it a package name and it hands back a list of versions.

### Namespaces

Some registries insert another naming layer between the registry and the package. Packagist requires vendor prefixes (`symfony/console`), Maven requires reverse-domain group IDs (`org.apache.commons:commons-lang3`), and npm has optional scopes (`@babel/core`) that most of the ecosystem's biggest packages never adopted because they predate the feature. RubyGems and PyPI have flat namespaces where the package name is all there is. Even the separator characters differ: `@scope/name` on npm, `vendor/package` on Packagist, `group:artifact` on Maven, and Cargo's proposed namespaces use `::` because `/` was already taken by the feature syntax.

A namespace is really a claim of authority over a family of names, which makes questions like who gets to publish under `@google/` or who owns the `serde` namespace in Cargo's proposed `serde::derive` scheme into governance problems dressed up as naming problems. They only get harder as registries grow. [Zooko's triangle](/2025/12/21/federated-package-management.html) says you can't have names that are simultaneously human-readable, decentralized, and secure, and registries exist largely to hold two of those three together. I covered the [different namespace models](/2026/02/14/package-management-namespaces.html) in more detail previously.

### Package names

Once you've picked a registry and navigated any namespace, you arrive at a package name, and that name resolves to a list of available versions. `requests`, `express`, `serde`, `rails`. These need to be unique within their registry and namespace, memorable enough to type from recall, and stable enough that renaming doesn't break everything downstream. Name scarcity in flat registries is why you get `python-dateutil` because `dateutil` was taken. PyPI normalizes hyphens, underscores, dots, and case so `my-package`, `my_package`, `My.Package`, and `MY_PACKAGE` all resolve to the same thing, a decision that prevents some squatting but means four different-looking strings in requirements files can point at the same package. npm used to allow uppercase package names and then banned them, so legacy packages like `JSONStream` still exist with capital letters that no new package can use. The package called `node` on npm isn't Node.js.

Sometimes projects bake a major version into the package name itself, like `boto3` or `webpack5`, effectively creating a new package that has its own version history on top of the version number already embedded in its name. `boto3` version `1.34.0` is a different thing from a hypothetical `boto4` version `1.0.0`, even though the underlying project is the same.

Typosquatting exploits the gap between what you meant to type and what the registry resolved; slopsquatting exploits LLM hallucinations of package names that don't exist yet but could be registered by an attacker. The registry will resolve whatever string you give it, no questions asked.

### Versions

Pick a version from that list and you get a particular snapshot of code, along with its metadata: a list of dependencies, a list of builds, and whatever the maintainer wrote in the changelog. Versions look like numbers but they're really strings, which becomes obvious as soon as you see `1.0.0-beta.2+build.456` or Python's `1.0a1.post2.dev3` or the [dozens of versioning schemes](/2024/06/24/from-zerover-to-semver-a-comprehensive-list-of-versioning-schemes-in-open-source.html) people have invented over the years. Prerelease tags, build metadata, epoch prefixes, calver date segments all get bolted onto the version string to carry meaning that a simple three-number tuple can't express, and every ecosystem parses and sorts these strings differently. Debian prepends an epoch (`2:1.0.0`) so that a repackaged version sorts higher than the original even if the version number is lower. Ruby uses `.pre.1` where npm uses `-pre.1`. Is `1.0.0` the same as `v1.0.0`? Depends who you ask. `1.2.3` is supposed to communicate something about compatibility relative to `1.2.2` and `2.0.0`, but that communication happens entirely through convention around the name, with no mechanism to enforce it. Elm is the rare exception, where the registry diffs APIs and rejects publishes that break compatibility without a major bump.

When a maintainer account is compromised, publishing `1.2.4` with malicious code looks indistinguishable from a routine patch release, because the version name carries no provenance. And when a version gets yanked or deleted, lockfiles that pinned to that exact name suddenly point at nothing.

### Dependencies and requirements

Each version carries a list of dependencies, and each dependency is itself a pair of names: a package name and a version constraint. `requests >= 2.28` means "the package named `requests`, at a version whose name satisfies `>= 2.28`". So you're back at the package name layer, looking up another name, getting another list of versions, and the resolver walks this graph recursively trying to find a consistent set of version names that satisfies all the constraints simultaneously. When two packages name the same dependency with incompatible constraints, the resolver has to either find a way through or prove that no path exists.

The same "convention not enforcement" problem from versioning carries over here. The version constraints are a small language for describing sets of version names, and every ecosystem invented its own. `~> 2.0` in Ruby, `^2.0` in npm, `>=2.0,<3.0` in Python all use different syntax with subtly different semantics, especially once you hit edge cases around 0.x versions. A broad constraint like `>=1.0` names a large and growing set of versions; a pinned `==1.2.3` names exactly one. The choice of constraint syntax determines how much of the version namespace a single declaration covers, and there's no cross-ecosystem agreement on what the symbols mean.

Some dependencies are themselves hidden behind yet another name. pip has extras (`requests[security]`), Cargo has features (`serde/derive`), and Bundler has groups (`:development`, `:test`), all of which are named sets of additional dependencies that only activate when someone asks for them by name. `pip install requests` and `pip install requests[security]` install different dependency trees from the same package, selected by a string in square brackets that the package author chose.

These constraint languages also compose with the namespace layer. npm's `@types/node@^18.0.0` combines a scope, a package name, and a version constraint into a single expression, while Maven's `org.apache.commons:commons-lang3:3.12.0` encodes group, artifact, and version as three colon-separated names that only make sense when parsed together.

### Builds and platforms

Once the resolver has settled on a version, the client needs to pick the right build artifact, and that means matching platform names. Unlike the earlier naming layers, which are mostly human-coordination problems, platform identity is inherently fuzzy: an M1 Mac running Rosetta is simultaneously two platforms depending on who's asking, and `manylinux` is a compatibility fiction that keeps getting revised as the definition shifts underneath it. PyPI wheels look like `numpy-1.24.0-cp311-cp311-manylinux_2_17_x86_64.whl`, packing the package name, version, Python version, ABI tag, and platform into a single filename. RubyGems appends a platform suffix to get `nokogiri-1.15.4-x86_64-linux-gnu.gem`, and Conda encodes the channel, platform, and build hash.

If the platform name on the artifact doesn't match the platform name the client computes for its own environment, the package won't install, or the wrong binary gets selected silently. And as I wrote about in [platform strings](/2026/02/17/platform-strings.html), the same M1 Mac is `aarch64-apple-darwin` to LLVM, `arm64-darwin` to RubyGems, `darwin/arm64` to Go, and `macosx_11_0_arm64` to Python wheels, so every tool that works across ecosystems ends up maintaining a translation table between naming schemes that each made sense in their original context.

### Source repositories

The naming doesn't stop at the registry. Most packages point back to a source repository, and that's another stack of names: the host (`github.com`), the owner or organization (`rails`), the repository name (`rails`), branches (`main`, `7-1-stable`), tags (`v7.1.3`), and commits (a SHA that's finally content-addressed rather than human-chosen). Go and Swift skip the registry layer entirely and use these repository URLs as the package identity, which means the naming conventions of GitHub or whatever host you're on become part of your dependency graph directly. Monorepos add another wrinkle: Babel's source lives at `babel/babel` on GitHub but publishes dozens of packages under `@babel/*`, so the mapping from repo name to package name is one-to-many.

Version tags in git are particularly interesting because they're the bridge between two naming systems. A maintainer creates a git tag called `v1.2.3`, and the registry or build tool maps that to a version name in its own scheme. But there's no standard for whether the tag should be `v1.2.3` or `1.2.3` or `release-1.2.3`, so tooling has to guess or be configured. And when an organization renames on GitHub, or a project moves from one owner to another, every downstream reference to the old owner/repo pair breaks unless the host maintains redirects, which GitHub does until someone registers the old name, at which point you have the repo-jacking problem.

### Naming and trust

At each of these layers you're trusting that a name resolves to what you think it does, that the registry URL points to the right service, that the package name belongs to who you think it does, that a version was published legitimately, that a constraint won't pull in something unexpected, that a platform-tagged binary was built from the same source as the one for your colleague's machine. That [trust is transitive](/2026/03/02/transitive-trust.html), flowing through your dependencies' names and their dependencies' names in a chain where nobody has full visibility. The registry is the authority that makes most of these names meaningful, which is why the question of who governs registries keeps coming back to the surface.
