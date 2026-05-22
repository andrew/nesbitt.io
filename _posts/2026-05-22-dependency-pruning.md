---
layout: post
title: "Dependency Pruning"
date: 2026-05-22 10:00 +0000
description: "A survey of unused-dependency detectors"
tags:
  - supply-chain
  - dependencies
  - package-managers
---

The best time to prune your dependency tree was three years ago. The second best time is right now.

Every package in your lockfile is a door someone else holds the key to. Install scripts run on your CI with whatever credentials your CI has, the maintainer's account can be phished or the registry entry handed to a new owner, and the next patch release can be something quite different from the last one. A dependency you stopped calling two refactors ago is exposed to all of that exactly as much as one you hit on every request, and you still get paged when a CVE lands in it. The cheapest supply-chain hardening you can do is to stop supplying yourself with things you don't use.

Lately my first response to a Dependabot CVE alert, and a fair few of the routine version bumps, has been to check whether I still need the dependency at all before looking at what changed in it. A CVE in something I barely use is a better reason to delete it than to patch it, and ripping it out closes that alert and all the future ones at the same time. You don't need any tooling for that beyond the alert itself.

Most of the existing writing about trimming dependencies is aimed at frontend bundle size, tree-shaking and dead-code elimination to get your JavaScript payload under some KB budget. What's much thinner on the ground is tooling and advice for the manifest itself, working out which entries in your `Gemfile` or `pyproject.toml` or `Cargo.toml` can be deleted outright, in whatever language you happen to be writing.

There are two questions here, and they need different tools. The first is binary: which of my declared dependencies does my code never import at all? Something got added for a feature that was later removed, or vendored in, or replaced, and nobody cleaned up the manifest. The second is proportional: of the ones I do import, how much of each am I actually reaching? Pulling in a 60,000-line library because you call one helper from it is a different problem from a dead manifest entry, but it's still tens of thousands of lines of someone else's code sitting in your supply chain doing nothing for you.

Mike Fiedler's [unladen](https://github.com/miketheman/unladen) is the only tool I've found that seriously attempts the second. It builds a call graph from your code into each dependency, computes what fraction of the library's logical lines you actually activate, and reports a "heft ratio" per package. If you've used an SCA scanner that does reachability analysis to decide whether a CVE actually affects you, this is the same machinery aimed at the whole dependency rather than one flawed function inside it.

Low heft is a prompt to consider inlining the bit you use, or finding a smaller library that does only that. This is Rob Pike's "[a little copying is better than a little dependency](https://go-proverbs.github.io/)" with a number attached. unladen is Python-only and still early, and as far as I can tell nobody has tried the same approach for any other package manager yet. Until someone does, the practical answer in most languages is to point a coding assistant at your repo and ask it which dependencies it could inline, which works more often than it probably should.

### Python

Python is unusually well served here, possibly because dynamic imports and the `requirements.txt`-vs-actually-installed gap have been biting people for long enough that several groups have independently built scanners. [deptry](https://github.com/osprey-oss/deptry) and [creosote](https://github.com/fredrikaverpil/creosote) both do a static AST walk over your source, collect the imports, and diff against what's declared in `pyproject.toml` or `requirements.txt`; deptry also flags the inverse case where you're importing something you only get transitively.

[FawltyDeps](https://github.com/tweag/FawltyDeps) from Tweag takes the same approach with better handling of the import-name-to-package-name mapping, which is where these tools usually go wrong (`import PIL` comes from the `Pillow` package, `import sklearn` from `scikit-learn`, and so on endlessly). [pip-check-reqs](https://github.com/adamtheturtle/pip-check-reqs) is the oldest of the set and ships a `pip-extra-reqs` command that does the declared-but-unused check against a plain `requirements.txt`. All four are maintained, so pick whichever fits your project layout.

### JavaScript

For finding unused entries in `package.json`, [knip](https://github.com/webpro-nl/knip) is now the tool to reach for. The older [depcheck](https://github.com/depcheck/depcheck) was the standard for years but the repo was archived in early 2025 and its README points you at knip, which builds a full module graph from your entry points, ships plugins for a hundred-odd frameworks and config files so your `eslint-plugin-whatever` counts as "used" even though no source file imports it, and can auto-remove what it finds with `--fix`.

None of npm, pnpm or Yarn ship anything for this natively, which still surprises me given how much of the supply-chain incident history has been in this ecosystem. Christoph Nakazawa's [Dependency Managers Don't Manage Your Dependencies](https://cpojer.net/posts/dependency-managers-dont-manage-your-dependencies) is five years old now and remains the best argument for why you have to do this work yourself.

### Rust

Cargo doesn't have anything built in but the third-party options are good. [cargo-machete](https://github.com/bnjbvr/cargo-machete) does a fast text-level scan for crate references without compiling anything, which makes it cheap enough to run in CI on every push at the cost of occasional false positives on macros and re-exports. [cargo-shear](https://github.com/Boshen/cargo-shear) parses the source properly for a more accurate read while still avoiding a full build. [cargo-udeps](https://github.com/est31/cargo-udeps) goes the other way and actually compiles the project to see which crates get linked, which is the most precise approach but needs nightly Rust and takes as long as a build. I'd run machete in CI and one of the others occasionally by hand.

### Go

Go is the one place where this is properly solved in the toolchain. `go mod tidy` walks every `.go` file, works out the actual import set, and rewrites `go.mod` and `go.sum` to match, dropping anything unreferenced. Because it's a standard command that everyone already runs, Go projects mostly don't accumulate dead dependencies in the first place, which is a decent argument for every package manager shipping an equivalent rather than leaving it to third parties. If something survives `tidy` and you're not sure why, `go mod why -m <module>` shows which import path is keeping it.

### Java

Maven has had `mvn dependency:analyze` in [maven-dependency-plugin](https://maven.apache.org/plugins/maven-dependency-plugin/analyze-mojo.html) for a very long time. It works on bytecode after compilation, comparing referenced classes against declared dependencies, and reports both "unused declared" and "used undeclared" (things you're getting transitively and should probably declare directly). On Gradle, the [Dependency Analysis Gradle Plugin](https://github.com/autonomousapps/dependency-analysis-gradle-plugin) has become the standard and produces structured advice that includes unused dependencies alongside other dependency-hygiene findings; Netflix's [Nebula Lint](https://github.com/nebula-plugins/gradle-lint-plugin) has an `unused-dependency` rule that does a similar bytecode-vs-declarations check.

Bytecode analysis can't see reflection or annotation processors, so anything loaded by class-name string or used only at compile time will be flagged as unused when it isn't, which describes a fair amount of enterprise Java. If you want evidence that the exercise pays off in security terms, Ponta et al. at SAP [debloated a real industrial Java application](https://arxiv.org/abs/2108.05115) and measured a real drop in CVE exposure afterwards.

### PHP

[composer-unused](https://github.com/composer-unused/composer-unused) matches class and namespace usage against the autoload maps in `composer.json` to find packages nothing references. ShipMonk's [composer-dependency-analyser](https://github.com/shipmonk-rnd/composer-dependency-analyser) is faster and also catches shadow dependencies and packages that belong in `require-dev` rather than `require`. Both are maintained.

### .NET

There's no `dotnet` CLI verb for this. Visual Studio has a Roslyn-backed "Remove Unused References" action in Solution Explorer, and [ReferenceTrimmer](https://github.com/dfederm/ReferenceTrimmer) wraps the same Roslyn analysis into the build for CI. [snitch](https://github.com/spectresystems/snitch) finds packages you've declared that you'd already get transitively, which is adjacent but doesn't actually shrink the closure.

### Elixir

Mix ships `mix deps.unlock --unused`, which clears lockfile entries for anything no longer in `mix.exs`, and `--check-unused` to fail CI if there are any. That's lockfile hygiene rather than code-level analysis though; it won't surface a package that's still listed in `mix.exs` but that no module in your app actually calls. I couldn't find a maintained third-party tool that does the full source-vs-manifest check, so if you're in Elixir you may be reading `mix.exs` by hand.

### Ruby

Ruby is where I most expected to find good tooling and came up shortest. Bundler has no built-in check; `bundle clean` removes installed gems that aren't in the lockfile, which is a different thing. [degem](https://github.com/3v0k4/degem) does a static scan for `require` calls and constant references against your `Gemfile` and is the only option I found with commits in the last couple of years.

Beyond that there's a small graveyard of 2015-era attempts that grep for gem names or run the test suite under coverage to see which gem files get loaded. Given how much Ruby leans on autoloading and metaprogramming, the static approach is always going to be noisy here, and the runtime-coverage approach is only as good as your test suite, but degem with a sceptical eye on its output is better than nothing. If someone built an unladen for Ruby, I'd be one of the first users.

### Caveats

Static analysis can't see dynamic imports, plugin systems that load by entry-point or string name, packages that only provide a CLI you shell out to, or type-stub packages that only the type checker touches, so all of these tools will flag some things as unused when they aren't. Most of the maintained ones have ignore-lists for exactly this and you should expect to populate them. There are false negatives too: a package can be reported as used because one file imports it while that file is itself dead code nothing calls, so pruning dead code before dead dependencies gets a cleaner result, and knip in particular does both passes together.

If you're worried about breakages, beef up your test coverage. If a scanner reports a dependency as unused, you remove it, CI is green, and then production breaks, the more interesting finding is that you have a code path nothing tests, and you'd want to know that whether or not you were pruning. The boundary where your code calls into someone else's is a good place to have a test anyway, since it's where their behaviour change becomes your bug on the next minor version, and a pruning pass that flushes out a few of those gaps has earned its keep before you've deleted anything.
