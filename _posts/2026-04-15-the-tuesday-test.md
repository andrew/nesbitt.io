---
layout: post
title: "The Tuesday Test"
date: 2026-04-15 10:00 +0000
description: "Like the Turing test but with more tacos."
tags:
  - package-managers
---

[Yesterday](/2026/04/14/standing-on-the-shoulders-of-homebrew.html) I wrote about the fast Homebrew rewrites and ended on the line that the bottleneck for that whole class of project is not Rust or Ruby, it is the absence of a stable declarative package schema. Someone on Mastodon picked up that thread and asked the obvious follow-on: which package managers actually have one? Going through the list, the honest answer is hardly any of them, and there is a quick test that makes the answer easy to check.

Ask this of any package manager: if I install this package on a Tuesday, could it do something different than if I install it on a Wednesday? If the answer is yes, the package manager is not really declarative, no matter what the manifest file looks like on the surface.

Somewhere in the install pipeline there is a place where arbitrary code runs, and that code can read the clock, check an environment variable, look at the hostname, phone a server, or do anything else a program can do. The Tuesday test is a quick way to separate the declarative tools from the ones that have a programming language hiding underneath a declarative-looking file format.

The test is not about whether the code is malicious, or whether it is a supply chain risk, or whether it could in principle do something terrible. Those are all separate questions with their own answers.

It is also not about the registry changing under you between the two days: new versions, yanks and the like are all real concerns, but they are concerns about the data the package manager is fetching rather than about the package manager itself. Pretend the registry is frozen and the lockfile is pinned.

The question here is narrower. Given the same manifest, the same lockfile and the same registry contents, is the install allowed to read anything the manifest does not declare as an input? The day of the week is the simplest example of such a hidden input, but the real point is that a package that passes the Tuesday test has no way to reach outside its declared inputs at all. A package that fails it can, and once it can, the manifest is no longer the whole story. Going through the list of well known package managers from [the landscape post](/2026/01/03/the-package-management-landscape.html), it turns out that almost none of them pass.

### Homebrew

Start with the one that started this. A [Homebrew formula](https://docs.brew.sh/Formula-Cookbook) is a Ruby class with an `install` method and a `post_install` hook, and the entire class body is evaluated by the Homebrew client every time it touches the formula. Even the parts that look like data, such as `url`, `sha256`, `version`, and `depends_on`, are method calls on the formula class, evaluated in a Ruby context that can `require` anything, shell out to anything, and read the clock from any method.

The [cask format](https://docs.brew.sh/Cask-Cookbook) is a Ruby DSL with the same property. So is the [`Brewfile`](https://docs.brew.sh/Manpage#bundle-subcommand) consumed by `brew bundle`, which was invented as a Homebrew analogue of Bundler's `Gemfile` and inherits the same "executable Ruby file posing as a manifest" shape: a Brewfile can call `brew`, `cask`, `tap`, `mas`, `vscode` and friends, but it can also `if Time.now.wday == 2` in between.

Homebrew fails the Tuesday test by design, which is the whole reason the [`formula.json`](https://formulae.brew.sh/api/formula.json) API had to exist as a separate thing for fast clients to consume: there is no other way to extract package metadata without running the package definition. The JSON file is what passes the Tuesday test, and it only exists because the formula format does not.

Generating it is not free either. Homebrew's own [`brew generate-formula-api`](https://github.com/Homebrew/brew/blob/master/Library/Homebrew/dev-cmd/generate-formula-api.rb) command has to flip the `Formula` class into a special `generating_hash!` mode and wrap the run in a [`SimulateSystem`](https://github.com/Homebrew/brew/blob/master/Library/Homebrew/simulate_system.rb) block that lies to every formula about the host OS and architecture, so that calls which would normally branch on the real system instead return a stable answer. It is in-process monkey patching to stop the formula from noticing where it is, in order to coax a declarative-looking file out of a format that is anything but.

### Ruby

The [`Gemfile`](https://bundler.io/man/gemfile.5.html) is a Ruby file. The first line is often `source "https://rubygems.org"`, which looks like configuration, but `source` is a method call on an implicit DSL object, and anything else you can write in Ruby is valid above, below, or inside it. You can open a socket in your Gemfile. You can check `Time.now.wday` and add a different gem on Tuesdays.

The [`.gemspec`](https://guides.rubygems.org/specification-reference/) file that ships inside every gem is also Ruby, and it is evaluated every time someone installs the gem, which means a gem author can put arbitrary code in the specification itself and have it run on the installer's machine before anything has been built. Native extensions run [`extconf.rb`](https://guides.rubygems.org/gems-with-extensions/), which is yet more Ruby, and post-install messages are generated at install time.

CocoaPods is the same story in a different namespace. The CocoaPods client is itself a Ruby program, a [`Podfile`](https://guides.cocoapods.org/syntax/podfile.html) is a direct descendant of a `Gemfile`, and a [`.podspec`](https://guides.cocoapods.org/syntax/podspec.html) is a direct descendant of a `.gemspec`, right down to the DSL, the block syntax, and the fact that both files are evaluated as Ruby every time you install. Everything said about Ruby above applies to CocoaPods without a single change.

### Python

Python is the same story with different file names. A [`setup.py`](https://setuptools.pypa.io/en/latest/userguide/index.html) is a Python script that runs at install time, and `setup.py` is where Python packaging started, so an enormous amount of the existing ecosystem still goes through it.

The move to [`pyproject.toml`](https://packaging.python.org/en/latest/specifications/pyproject-toml/) looks like a shift to a declarative manifest, and in the limited sense that the file itself is TOML it is, but the whole job of that TOML file is to nominate a program to run. The `[build-system]` table points at a [build backend](https://peps.python.org/pep-0517/), and the build backend is a Python package that executes arbitrary Python to produce a wheel. [Setuptools](https://setuptools.pypa.io/), [Hatchling](https://hatch.pypa.io/latest/), [Poetry-core](https://python-poetry.org/docs/pyproject/), [PDM-backend](https://backend.pdm-project.org/), [Flit](https://flit.pypa.io/en/stable/), [Maturin](https://www.maturin.rs/) and [scikit-build-core](https://scikit-build-core.readthedocs.io/) are all real programs, all capable of reading the date.

Wheels themselves are the one part of the Python pipeline that does pass the test: [PEP 427](https://peps.python.org/pep-0427/) deliberately has no pre or post install hooks, and installing a wheel is meant to be a pure file-unpacking step. If a wheel does not already exist for your platform, pip and uv and Poetry and pdm will transparently build one from the sdist by invoking the build backend, which puts you back in arbitrary-Python territory.

### JavaScript

JavaScript is the canonical example people reach for, because `package.json` is famously JSON, which is as declarative a format as you can get, and yet npm install runs arbitrary code through the `preinstall`, `install`, and `postinstall` [lifecycle scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts). Those scripts are shell commands that run in the package directory, and nothing stops them from checking `date +%u` and branching on the result.

Yarn, pnpm, and Bun all inherit the same lifecycle script contract for compatibility with the existing ecosystem, though recent [pnpm](https://pnpm.io/settings) and [Bun](https://bun.com/docs/cli/install) releases have started refusing to run scripts for dependencies that are not on an explicit allowlist. The contract is still there, the defaults have just got more cautious.

### Deno 🌮

[Deno](https://deno.com/) fetches and caches modules on demand, either at import time or up front with `deno install`, and no code the package author supplies runs against the installer's machine before the module itself is imported. Deno 2 added first-class `package.json` and `node_modules` support on top of the existing `npm:` specifiers, but even then [it refuses to run the npm lifecycle scripts](https://docs.deno.com/runtime/reference/cli/install/) by default and requires an explicit `--allow-scripts=<pkg>` opt-in for any package that wants them.

### Rust

Rust looks declarative at a glance. `Cargo.toml` is TOML, Cargo resolves everything from the lockfile, and the whole ecosystem leans heavily on the idea that a crate is a well defined thing.

Then you notice [`build.rs`](https://doc.rust-lang.org/cargo/reference/build-scripts.html), which is a Rust file that Cargo compiles and runs before building the crate proper, so it can generate source code, link against system libraries, probe the host, and, yes, check the date. [Procedural macros](https://doc.rust-lang.org/reference/procedural-macros.html) are the same story from a different angle: they are Rust code that runs at compile time in the compiler's own process, and they can do anything a Rust program can do. Both mechanisms are considered normal and widely used.

### Go 🌮

[Go modules](https://go.dev/ref/mod) come closer to passing than almost anything else in this list. The `go.mod` file is a small declarative format with no scripting in it, `go get` does not run post-install hooks, and the module proxy and checksum database make the fetch step reproducible and auditable in a way that most other ecosystems are not.

The escape hatch is [cgo](https://pkg.go.dev/cmd/cgo), which invokes the system C compiler with arguments specified by `#cgo` directives in source files, and those directives can include whatever paths and flags the package author wants. The core dependency resolution and fetching pipeline is declarative. The build pipeline is not, as soon as C is involved.

### JVM languages

The JVM ecosystem is split between the declarative-looking and the openly imperative. Maven's [`pom.xml`](https://maven.apache.org/pom.html) is XML and describes the project as data, but a pom can include plugin executions, and Maven plugins are Java code that runs during the build.

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) does not even pretend: `build.gradle` is a Groovy script, and `build.gradle.kts` is a Kotlin script, and both are full programming languages with access to the filesystem, the network, and the clock. [sbt](https://www.scala-sbt.org/)'s build definition is Scala. [Leiningen](https://leiningen.org/)'s `project.clj` is Clojure. [Mill](https://mill-build.org/) is Scala again.

The JVM world has spent twenty years treating the build file as a program, and the package management step is a side effect of running that program.

### Swift

Swift Package Manager is in the same category. [`Package.swift`](https://developer.apple.com/documentation/packagedescription) is a Swift file that is compiled and run to produce the package description, which means every resolve of a Swift package involves executing Swift code from the package author. Apple added a manifest API version comment at the top of the file so that the compiler knows which stable API to expose, but the underlying mechanism is still "run the author's Swift program."

### Zig

Zig is worth pulling out because it is a modern language that looked at all of the above and decided, deliberately, that the build file should be a real program. [`build.zig`](https://ziglang.org/learn/build-system/) is Zig source compiled and run by the Zig toolchain, and the package manager is a set of APIs exposed to that program. The rationale is that builds in C-adjacent languages are already programs in disguise (makefiles, shell, CMake), and making the language of the build the same as the language of the project is more honest than pretending otherwise. It is a defensible position, and it fails the test completely.

### Bazel 🌮

Bazel is the one entry on this list that tries to pass the Tuesday test at the language design level. `BUILD` files and `.bzl` extensions are written in [Starlark](https://bazel.build/rules/language), a dialect of Python that Google stripped back on purpose: no `while` loops, no recursion, no mutable global state, no way to read the clock, the filesystem outside declared inputs, or the network. Evaluation is guaranteed to terminate, and two evaluations of the same inputs are guaranteed to produce the same output. It is the only manifest language on this page that cannot observe what day it is even if the author wants it to.

The execution side is hedged the same way. Actions run inside a sandbox with only their declared inputs visible, and Bazel's remote execution and remote cache assume that identical inputs produce identical outputs, so any non-determinism shows up as a cache miss and gets investigated.

The usual escape hatches are still there if you want them: `repository_rule` can call out to the host to fetch code, `genrule` runs shell, and custom toolchains can shell out to anything the sandbox allows, so a sufficiently motivated `BUILD` author can still reach the system `date` command. But the default posture is the opposite of everywhere else on this list, and the design is organised around passing the Tuesday test as an explicit goal.

### Haskell

A Haskell package is described by a `.cabal` file, which is a custom declarative format, not Haskell source, so the metadata layer on its own passes the Tuesday test. Tools can parse a `.cabal` file and extract dependencies, versions and compiler flags without running any of the package author's code.

The escape hatch is the `build-type` field. `build-type: Simple` uses a stock Setup script and is fine. `build-type: Custom` (and the newer `Hooks`) tells Cabal to compile and run the package's own [`Setup.hs`](https://cabal.readthedocs.io/en/stable/cabal-package.html), which is a real Haskell program with `preBuild`, `postBuild`, `preInst` and `postInst` hooks that can do anything Haskell can do, including read the clock.

Because `.cabal` is declarative metadata, it can also be mechanically translated into something else, which is a large part of why Haskell has such a big footprint in the Nix ecosystem. [`cabal2nix`](https://github.com/NixOS/cabal2nix) reads a `.cabal` file and emits a Nix expression, Nixpkgs ships a Haskell package set regenerated from Hackage and Stackage through that pipeline, and [`haskell.nix`](https://input-output-hk.github.io/haskell.nix/) is an alternative infrastructure built around the same idea.

### Everything else with a manifest that's a program

The rest of the list is short because the pattern is by now predictable.

- **PHP / Composer:** `composer.json` is JSON, but a [`scripts` section](https://getcomposer.org/doc/articles/scripts.md) hooks events like `post-install-cmd` and `post-update-cmd` with shell commands or PHP callables.
- **Elixir / Mix:** [`mix.exs`](https://hexdocs.pm/mix/Mix.html) is Elixir.
- **Dart / pub:** `pubspec.yaml` is declarative, but pub supports [hook scripts](https://dart.dev/tools/pub/hooks) for native and data assets, written in Dart and run at build time.
- **Perl / CPAN:** [`Makefile.PL`](https://metacpan.org/pod/ExtUtils::MakeMaker) and [`Build.PL`](https://metacpan.org/pod/Module::Build) are Perl programs, and have been since the nineties.
- **Lua / LuaRocks:** [rockspecs](https://github.com/luarocks/luarocks/wiki/Rockspec-format) are Lua tables, but the build section can include a `build_command` that runs shell.
- **Nim / Nimble:** [nimble files](https://github.com/nim-lang/nimble#nimble-reference) support `before install` and `after install` hooks written in NimScript.
- **Julia / Pkg:** packages run [`deps/build.jl`](https://pkgdocs.julialang.org/v1/creating-packages/) at install time, which is a Julia program.
- **Raku / zef:** runs Perl or Raku build scripts.

### opam and Portage

OCaml's [opam](https://opam.ocaml.org/doc/Manual.html#opam) is unusually honest: the opam file is a declarative-looking S-expression format, but the `build` and `install` fields contain explicit lists of shell commands to run, and everyone knows what they are and where they live. The same is true, in a different flavour, of Gentoo's Portage: an [ebuild](https://devmanual.gentoo.org/ebuild-writing/) is a bash script that sources a set of library functions and defines phases like `src_compile` and `src_install`, so the package is a program and no one pretends otherwise.

### System package managers

System package managers all fail, and most of them fail in several places at once. Debian packages carry [`preinst`, `postinst`, `prerm`, and `postrm` maintainer scripts](https://www.debian.org/doc/debian-policy/ch-maintainerscripts.html) that dpkg runs around the unpack step, and they are shell by default. RPM packages embed [`%pre`, `%post`, `%preun`, and `%postun` scriptlets](https://rpm-software-management.github.io/rpm/manual/spec.html), plus file triggers, which are shell scripts.

Arch's pacman runs `.INSTALL` scripts from inside the package tarball, which are again shell, and [PKGBUILDs](https://wiki.archlinux.org/title/PKGBUILD) themselves are shell programs evaluated at build time. Alpine's apk has pre and post install scripts, plus [APKBUILDs](https://wiki.alpinelinux.org/wiki/APKBUILD_Reference) that are shell scripts.

[MacPorts Portfiles](https://guide.macports.org/chunked/reference.html) are Tcl. [Chocolatey packages](https://docs.chocolatey.org/en-us/create/create-packages) are PowerShell. Conda belongs on this list too, even though it is often filed next to Python: it is a cross-language binary package manager that happens to have grown up in the scientific Python community, and it ships explicit [`pre-link` and `post-link`](https://docs.conda.io/projects/conda-build/en/latest/resources/link-scripts.html) shell scripts that run when a package is linked into an environment.

Every one of these can look at the clock and do one thing on Monday and a different thing on Tuesday without bending any rules, and Homebrew at the top of the post is the same shape as all of them.

### Nix and Guix 🌮

[Nix](https://nixos.org/) is the interesting case, because it is the one package manager on the list that has been designed from the start around the idea that the install step should not be allowed to notice what day it is. A Nix expression is a program in the Nix language, but it is a pure lazy functional language with no I/O primitives of the sort you would need to read a clock, so the evaluation step that produces a derivation cannot observe the day of the week at all.

The derivation is then realised by running a builder inside a sandbox that has no network, a scrubbed environment, and its own view of the filesystem. The sandbox itself does not pin the clock, so a determined builder can still call `date` and get a real answer. In practice Nixpkgs and the wider [reproducible-builds.org](https://reproducible-builds.org/) project paper over this with [`SOURCE_DATE_EPOCH`](https://reproducible-builds.org/docs/source-date-epoch/), an environment variable that well-behaved build tools read instead of the real clock when stamping timestamps into their output, often set to the Unix epoch or the commit time of the source. The Tuesday test passes cleanly at the evaluation layer and passes in most cases at the realisation layer, with the remaining gaps treated as bugs rather than features.

[Guix](https://guix.gnu.org/) tells the same story with different syntax. The package definitions are written in Guile Scheme, which is a full language in the way that the Nix language deliberately is not, but package records are a restricted form and the build is run inside the same kind of sandbox, inherited from the same [derivation model](https://edolstra.github.io/pubs/phd-thesis.pdf) that Eelco Dolstra wrote up in his thesis. Guix ships with a `--check` mode that rebuilds a package and compares the output to the previous build, and the whole project treats a mismatch as something to fix. Guix passes the Tuesday test about as well as anything on this list does.

---

The common thread in the failing cases is that building a package and installing a package are the same step. A gemspec is Ruby because gems get built on the installer's machine from it. System package managers are the opposite shape of the same problem: installing a package means dropping files into a live filesystem and reconciling them with whatever was already there.

Happy Taco Tuesday to Deno, Go, Bazel, Nix and Guix. 🌮
