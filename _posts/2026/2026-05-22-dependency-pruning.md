---
layout: post
title: "Dependency Pruning"
date: 2026-05-22 10:00 +0000
description: "A survey of unused-dependency detection across language ecosystems."
tags:
  - supply-chain
  - dependencies
  - package-managers
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mnklprzubd2d"
---

The best time to prune your dependency tree was three years ago. The second best time is right now.

Every package in your lockfile is a door someone else holds the key to. Install scripts run on your CI with whatever credentials your CI has, the maintainer's account can be phished or the registry entry handed to a new owner, and the next patch release can be something quite different from the last one. A dependency you stopped calling two refactors ago is exposed to all of that exactly as much as one you hit on every request, and you still get paged when a CVE lands in it. The cheapest supply-chain hardening you can do is to stop supplying yourself with things you don't use.

Lately my first response to a Dependabot CVE alert, and a fair few of the routine version bumps, has been to check whether I still need the dependency at all before looking at what changed in it. A CVE in something I barely use is a better reason to delete it than to patch it, and ripping it out closes that alert and all the future ones at the same time. You don't need any tooling for that beyond the alert itself.

Most of the existing writing about trimming dependencies is aimed at frontend bundle size, tree-shaking and dead-code elimination to get your JavaScript payload under some KB budget. What's much thinner on the ground is tooling and advice for the manifest itself, working out which entries in your `Gemfile` or `pyproject.toml` or `Cargo.toml` can be deleted outright, in whatever language you happen to be writing.

There are two questions here, and they need different tools. The first is binary: which of my declared dependencies does my code never import at all? Something got added for a feature that was later removed, or vendored in, or replaced, and nobody cleaned up the manifest. The second is proportional: of the ones I do import, how much of each am I actually reaching? Pulling in a 60,000-line library because you call one helper from it is a different problem from a dead manifest entry, but it's still tens of thousands of lines of someone else's code sitting in your supply chain doing nothing for you.

Mike Fiedler's [unladen](https://github.com/miketheman/unladen) is the only tool I've found that seriously attempts the second. It builds a call graph from your code into each dependency, computes what fraction of the library's logical lines you actually activate, and reports a "heft ratio" per package. If you've used an SCA scanner that does reachability analysis to decide whether a CVE actually affects you, this is the same machinery aimed at the whole dependency rather than one flawed function inside it.

Low heft is a prompt to consider inlining the bit you use, or finding a smaller library that does only that. This is Rob Pike's "[a little copying is better than a little dependency](https://go-proverbs.github.io/)" with a number attached. unladen is Python-only. SAP's [Eclipse Steady](https://github.com/eclipse-steady/steady) computed a similar reachable-share metric for Maven dependencies years earlier, and I haven't found an equivalent in any other ecosystem. For now the practical answer in most languages is to point a coding assistant at your repo and ask it which dependencies it could inline, which works more often than it probably should.

Tanmay Singla and James Davis [measured that approach](https://doi.org/10.4230/LIPIcs.ESEM.2026.64) by having an agent regenerate only the part of a dependency each repository called, across 180 repository-dependency pairs covering nine JavaScript and TypeScript packages. The local replacements kept 99.8% of the behaviour the repositories' validation checks observed and cut the exported API surface by 93%. Peng Ding and Rick Stevens [built 44 stdlib-only Python modules](https://arxiv.org/abs/2605.21405) with LLM assistance as replacements for popular libraries, and most ran within 2x of the original, except the libraries backed by a C extension. Their set removes 88 transitive dependencies maintained by 128 PyPI accounts. Singla and Davis list what the local copy needs in exchange: behavioural validation, a record of provenance, and a way to refresh it when upstream changes.

### Python

Python is unusually well served here, possibly because dynamic imports and the `requirements.txt`-vs-actually-installed gap have been biting people for long enough that several groups have independently built scanners. [deptry](https://github.com/osprey-oss/deptry) and [creosote](https://github.com/fredrikaverpil/creosote) both do a static AST walk over your source, collect the imports, and diff against what's declared in `pyproject.toml` or `requirements.txt`; deptry also flags the inverse case where you're importing something you only get transitively.

[FawltyDeps](https://github.com/tweag/FawltyDeps) from Tweag takes the same approach with better handling of the import-name-to-package-name mapping, which is where these tools usually go wrong (`import PIL` comes from the `Pillow` package, `import sklearn` from `scikit-learn`, and so on endlessly). [pip-check-reqs](https://github.com/adamtheturtle/pip-check-reqs) is the oldest of the set and ships a `pip-extra-reqs` command that does the declared-but-unused check against a plain `requirements.txt`.
[PyTrim](https://github.com/TrimTeam/PyTrim) does the removal as well as the detection, editing the imports in your source along with `requirements.txt`, `pyproject.toml`, `setup.py`, Pipfiles and Dockerfiles, and it can open the pull request. Its authors [ran it over 971 packages](https://arxiv.org/abs/2510.00674), trimmed dependencies in 39 of them, and had six of the resulting pull requests merged.

### JavaScript

For finding unused entries in `package.json`, [knip](https://github.com/webpro-nl/knip) is now the tool to reach for. The older [depcheck](https://github.com/depcheck/depcheck) was the standard for years and its README now points you at knip, which builds a full module graph from your entry points, ships plugins for a hundred-odd frameworks and config files so your `eslint-plugin-whatever` counts as "used" even though no source file imports it, and can auto-remove what it finds with `--fix`.

None of npm, pnpm or Yarn ship anything for this natively, which still surprises me given how much of the supply-chain incident history has been in this ecosystem. Christoph Nakazawa's [Dependency Managers Don't Manage Your Dependencies](https://cpojer.net/posts/dependency-managers-dont-manage-your-dependencies) is five years old now and remains the best argument for why you have to do this work yourself.

### Rust

Cargo 1.100 [stabilised its own lint system](https://doc.rust-lang.org/nightly/cargo/CHANGELOG.html), and the [`unused_dependencies`](https://doc.rust-lang.org/cargo/reference/lints.html) lint in it warns by default about anything in `[dependencies]` or `[build-dependencies]` that none of the package's targets use. The warning is only emitted when every target that could use the dependency is built, so `cargo check --bin foo` skips it. The lint also skips `[dev-dependencies]`, because Cargo has no way to select all the targets that use them. A dependency declared only to activate a feature on a transitive crate comes up as a false positive. A second lint, `unused_workspace_dependencies`, flags entries in `[workspace.dependencies]` that no member inherits.

Before that the nearest built-in was rustc's [`unused_crate_dependencies`](https://doc.rust-lang.org/rustc/lints/listing/allowed-by-default.html#unused-crate-dependencies) lint,[^1] which is off by default because it checks each compilation target separately against the package-wide `Cargo.toml`, so a dependency only your tests or binary uses gets flagged when the library builds. The third-party tools work at the package level and predate both: [cargo-machete](https://github.com/bnjbvr/cargo-machete) does a fast text-level scan for crate references without compiling anything, which makes it cheap enough to run in CI on every push at the cost of occasional false positives on macros and re-exports. [cargo-shear](https://github.com/Boshen/cargo-shear) parses the source properly for a more accurate read while still avoiding a full build. [cargo-udeps](https://github.com/est31/cargo-udeps) goes the other way and actually compiles the project to see which crates get linked, which is the most precise approach but needs nightly Rust and takes as long as a build.
### Go

Go is the one place where this is properly solved in the toolchain. `go mod tidy` walks every `.go` file, works out the actual import set, and rewrites `go.mod` and `go.sum` to match, dropping anything unreferenced. Because it's a standard command that everyone already runs, Go projects mostly don't accumulate dead dependencies in the first place, which is a decent argument for every package manager shipping an equivalent rather than leaving it to third parties. If something survives `tidy` and you're not sure why, `go mod why -m <module>` shows which import path is keeping it.

### Java

Maven has had `mvn dependency:analyze` in [maven-dependency-plugin](https://maven.apache.org/plugins/maven-dependency-plugin/analyze-mojo.html) for a very long time. It works on bytecode after compilation, comparing referenced classes against declared dependencies, and reports both "unused declared" and "used undeclared" (things you're getting transitively and should probably declare directly). On Gradle, the [Dependency Analysis Gradle Plugin](https://github.com/autonomousapps/dependency-analysis-gradle-plugin) has become the standard and produces structured advice that includes unused dependencies alongside other dependency-hygiene findings; Netflix's [Nebula Lint](https://github.com/nebula-plugins/gradle-lint-plugin) has an `unused-dependency` rule that does a similar bytecode-vs-declarations check.

[DepClean](https://github.com/ASSERT-KTH/depclean) is a Maven plugin that covers the whole tree: dependencies declared in the `pom.xml`, ones resolved transitively, and ones inherited from a parent POM. It came out of [a study of 9,639 Maven Central artifacts](https://arxiv.org/abs/2001.07808) by Soto-Valero, Harrand, Monperrus and Baudry, which classed 75.1% of the 723,444 dependency relationships between them as bloated. The authors sent removals to projects as pull requests, and 18 of the 21 that got an answer were merged. A [follow-up across 31,515 versions of dependency trees](https://arxiv.org/abs/2105.14226) found that 84.3% of bloated dependencies were bloated from the version that added them, and that 22% of the dependency updates developers made were to bloated dependencies. Dependabot suggested updates to them at a similar ratio.

Bytecode analysis can't see reflection or annotation processors, so anything loaded by class-name string or used only at compile time will be flagged as unused when it isn't, which describes a fair amount of enterprise Java. If you want evidence that the exercise pays off in security terms, Ponta et al. at SAP [debloated a real industrial Java application](https://arxiv.org/abs/2108.05115) and measured a real drop in CVE exposure afterwards.

### PHP

[composer-unused](https://github.com/composer-unused/composer-unused) matches class and namespace usage against the autoload maps in `composer.json` to find packages nothing references. ShipMonk's [composer-dependency-analyser](https://github.com/shipmonk-rnd/composer-dependency-analyser) is faster and also catches shadow dependencies and packages that belong in `require-dev` rather than `require`.
### .NET

There's no `dotnet` CLI verb for this. Visual Studio has a Roslyn-backed "Remove Unused References" action in Solution Explorer, and [ReferenceTrimmer](https://github.com/dfederm/ReferenceTrimmer) wraps the same Roslyn analysis into the build for CI. [snitch](https://github.com/spectresystems/snitch) finds packages you've declared that you'd already get transitively, which is adjacent but doesn't actually shrink the closure.

.NET 10 turned on [package pruning](https://devblogs.microsoft.com/dotnet/nuget-package-pruning-in-dotnet-10/) by default for projects targeting `net10.0` or later. Transitive packages that the target framework already provides are removed from the restore graph, which takes them out of both the download and the audit report, and a direct `PackageReference` to one raises [NU1510](https://learn.microsoft.com/en-us/nuget/reference/errors-and-warnings/nu1510) with an instruction to delete it. The check covers packages the framework has made redundant, while ReferenceTrimmer covers a package your code stopped calling.

### Elixir

Mix ships `mix deps.unlock --unused`, which clears lockfile entries for anything no longer in `mix.exs`, and `--check-unused` to fail CI if there are any. That's lockfile hygiene rather than code-level analysis though; it won't surface a package that's still listed in `mix.exs` but that no module in your app actually calls. I couldn't find a third-party tool that does the full source-vs-manifest check, so if you're in Elixir you may be reading `mix.exs` by hand.

### Haskell

Since 8.10 GHC has had [`-Wunused-packages`](https://downloads.haskell.org/ghc/latest/docs/users_guide/using-warnings.html#ghc-flag--Wunused-packages), which warns about any package passed with `-package` that went unused during compilation. Cabal and Stack generate those flags from `build-depends`, so the warning names the entries you can delete from each component. `-Wall` excludes it, so you add it to `ghc-options` yourself. [packunused](https://hackage.haskell.org/package/packunused) did the same job before the flag existed.

### Dart

Workiva's [dependency_validator](https://github.com/Workiva/dependency_validator) compares imports against `pubspec.yaml` and reports unused dependencies alongside missing ones, ones used in `lib/` but declared only under `dev_dependencies`, and the reverse. A package that provides an executable or an auto-applied builder counts as used without an import. The commercial DCM tool has a [`check-dependencies`](https://dcm.dev/docs/cli/check-dependencies) command that reports the same four categories.

### Swift

SwiftPM has no built-in check, and [swift-dependency-audit](https://github.com/tonyarnold/swift-dependency-audit) parses `Package.swift` and scans each target's sources for `import` statements. It reports declared dependencies that lack a matching import as well as undeclared imports, with output formats for Xcode and GitHub Actions.

### Ruby

Ruby is where I most expected to find good tooling and came up shortest. Bundler has no built-in check; `bundle clean` removes installed gems that aren't in the lockfile, which is a different thing. [degem](https://github.com/3v0k4/degem) does a static scan for `require` calls and constant references against your `Gemfile`, and [gemxray](https://github.com/ydah/gemxray) checks each gem for a `require`, a constant reference, a gemspec dependency or a Rails autoload signal. gemxray separately flags gems that another top-level gem already brings in and gems that your Ruby or Rails version already bundles.

Beyond that there's a handful of 2015-era attempts that grep for gem names or run the test suite under coverage to see which gem files get loaded. Given how much Ruby leans on autoloading and metaprogramming, the static approach is always going to be noisy here, and the runtime-coverage approach is only as good as your test suite, but either scanner with a sceptical eye on its output is better than nothing.
### Transitive dependencies

All of the scanners above compare your imports with your manifest, and the manifest lists direct dependencies only. Liu, Tiwari, Bogdan and Baudry [traced runtime file access](https://arxiv.org/abs/2405.17939) for 91 CommonJS packages and classed 13.8% of their direct dependencies as bloated against 51.3% of the indirect ones, so most of the removable packages are lockfile entries pulled in by packages you do use.

A Cargo dependency enables its default features unless you write [`default-features = false`](https://doc.rust-lang.org/cargo/reference/features.html), and each feature can switch on optional dependencies of its own. `cargo tree -e features` shows which features are enabled and which crate requested them. Cargo builds a crate with the union of the features every dependent requests. [cargo-unused-features](https://github.com/TimonPost/cargo-unused-features) automates the search by removing enabled features one at a time and recompiling, and its README warns to expect false positives. Python's equivalent is extras: [`[project.optional-dependencies]`](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/#dependencies-optional-dependencies) lets a library declare the dependencies for one feature separately from the base install, and a project that installs `package[all]` gets the dependencies for every feature, including the ones it skips.

Where the dependency lacks a switch for the part you skip, some package managers let you cut the transitive package from outside:

- Maven has `<exclusions>` on a dependency declaration, under a heading in [its own guide](https://maven.apache.org/guides/introduction/introduction-to-optional-and-excludes-dependencies.html) that reads "as a last resort!".
- Gradle's [`exclude`](https://docs.gradle.org/current/userguide/how_to_exclude_transitive_dependencies.html) only applies when every declaration that reaches the module carries the same exclusion.
- pnpm's [`overrides`](https://pnpm.io/settings/dependency-resolution#overrides) accepts `"foo>bar": "-"` to drop `bar` from under `foo`.
- npm's [`overrides`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) can swap a package for a different one.

Each of these depends on your code path avoiding the excluded package, and a code path that does reach it fails at runtime.

In JavaScript much of the transitive tree is small utility packages and compatibility code for old runtimes, which James Garbutt's [The Three Pillars of JavaScript Bloat](https://43081j.com/2026/03/three-pillars-of-javascript-bloat) sorts by cause. The e18e project maintains [module-replacements](https://github.com/e18e/module-replacements), a dataset mapping those packages to native APIs, micro-utility snippets or preferred alternatives. Several tools read that dataset:

- [replacements.fyi](https://replacements.fyi/) looks up one package or scans a `package.json`.
- The [e18e CLI](https://github.com/e18e/cli) has an `analyze` command that reports replaceable dependencies in a project and a `migrate` command that rewrites some of them.
- [eslint-plugin-depend](https://github.com/es-tooling/eslint-plugin-depend) raises replaceable dependencies as lint findings.
- npmx [shows the dataset](/2026/04/16/features-everyone-should-steal-from-npmx.html) on its package pages.

npm also installs [several versions of one package](/2026/07/28/why-npm-dependency-trees-are-so-big.html) side by side when dependents declare different ranges. [`npm dedupe`](https://docs.npmjs.com/cli/v11/commands/npm-dedupe) moves shared dependencies further up the tree, [`pnpm dedupe`](https://pnpm.io/cli/dedupe) removes older lockfile entries where a newer version satisfies the range, and pnpm 12.6 added an [`autoDedupe`](https://pnpm.io/settings/dependency-resolution#autodedupe) setting that does this on every install. `cargo tree -d` lists the crates present in more than one version. Deduplication reduces how many distinct releases you run, and the set of maintainers you depend on is the same before and after.

Since Go 1.17 the [module graph is pruned](https://go.dev/ref/mod#graph-pruning) to drop the transitive requirements of dependencies that your build leaves unused, but the unit is the package, so a library package that imports a web framework brings the framework to everyone who imports that package. oapi-codegen [cut its vendored size from 40 MB to 6 MB](https://www.jvt.me/posts/2023/10/23/oapi-codegen-v2-decrease/) and its indirect dependencies from 95 to 34 by moving its runtime, examples and tests into separate modules. Datadog [shrank its Agent binaries by up to 77%](https://www.datadoghq.com/blog/engineering/agent-go-binaries/) in part by putting imports behind build tags and moving the symbols that needed a large dependency into their own package.

Tree-shaking and dead-code elimination run after all of this, stripping unreachable code from the bundle or binary you ship once the whole package has been resolved and downloaded and any install scripts have run on your CI. The tree-shaken dependency's lockfile entry receives advisories and version bumps the same as before.

### Caveats

Static analysis can't see dynamic imports, plugin systems that load by entry-point or string name, packages that only provide a CLI you shell out to, or type-stub packages that only the type checker touches, so all of these tools will flag some things as unused when they aren't. Most of them have ignore-lists for exactly this and you should expect to populate them. There are false negatives too: a package can be reported as used because one file imports it while that file is itself dead code nothing calls, so pruning dead code before dead dependencies gets a cleaner result, and knip in particular does both passes together.

If you're worried about breakages, beef up your test coverage. If a scanner reports a dependency as unused, you remove it, CI is green, and then production breaks, the more interesting finding is that you have a code path nothing tests, and you'd want to know that whether or not you were pruning. The boundary where your code calls into someone else's is a good place to have a test anyway, since it's where their behaviour change becomes your bug on the next minor version, and a pruning pass that flushes out a few of those gaps has earned its keep before you've deleted anything.

[^1]: An earlier version of this post said Rust had nothing built in. Thanks to [Poliorcetics](https://social.treehouse.systems/@poliorcetics) for the correction.
