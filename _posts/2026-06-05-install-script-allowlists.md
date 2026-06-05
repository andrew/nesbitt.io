---
layout: post
title: "Install-script allowlists"
date: 2026-06-05 12:00 +0000
description: "A survey of install-script allowlist mechanisms across package managers and language ecosystems."
tags:
  - package-managers
  - security
  - reference
---

In most package managers a dependency's [install-time code runs by default](/2026/04/15/the-tuesday-test.html) the moment you install it: an npm postinstall, a Setuptools `setup.py`, a CPAN `Makefile.PL`, an RPM scriptlet, a Conda post-link, a Debian `postinst`. A handful require explicit per-package opt-in before any of that code runs, usually called an allowlist or a trusted-dependencies list depending on the tool.

Per-package opt-in lists name which dependencies may run their install code: npm, pnpm, Bun, Deno, and Composer plugins all work this way. Global sandboxes (opam, Swift Package Manager, Nix, Guix, Portage) take a different shape, executing everything but constraining what that execution can reach. Identity and signature verification (RubyGems trust policies, Gradle dependency verification, NuGet trustedSigners, apt-secure) gates which artifacts get installed in the first place by who signed them, with no bearing on what their code subsequently does.

An npm postinstall, a setup.py, a Makefile.PL or an RPM scriptlet fires during fetch or unpack. A Cargo `build.rs` or a Zig `build.zig` runs when the project is compiled, which on a fresh build is functionally the next step but is structurally distinct. JVM build files (Gradle's Groovy or Kotlin, Maven's plugin goal invocations, SBT's Scala) execute earlier still, before any project source touches the compiler.

## JavaScript

npm shipped per-package allowlists in [11.10.0](https://github.blog/changelog/2026-02-18-npm-bulk-trusted-publishing-config-and-script-security-now-generally-available/) (February 2026) via an `allowScripts` field in `package.json`, managed by [`npm approve-scripts`](https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts/) and [`npm deny-scripts`](https://docs.npmjs.com/cli/v11/commands/npm-deny-scripts/), with entries pinned to a specific version (`pkg@1.2.3: true`) by default and denials written name-only.

Behaviour in 11.x is advisory: scripts still execute, an end-of-install summary names anything unreviewed, and a hard block is signposted for npm 12. The similarly-named [`npm trust`](https://docs.npmjs.com/cli/v11/commands/npm-trust/) command added in the same release is for OIDC trusted publishing rather than script execution.

pnpm v10 (January 2025) [blocked install scripts by default](https://pnpm.io/supply-chain-security), reading the allowlist from `onlyBuiltDependencies` / `neverBuiltDependencies` in `package.json` or `pnpm-workspace.yaml`. v11 consolidated those into a single `allowBuilds` map, with `dangerouslyAllowAllBuilds` as the escape hatch. The companion [`pnpm approve-builds`](https://pnpm.io/cli/approve-builds) (added in 10.1.0) is an interactive picker that accepts `--all` for CI and from v11 takes positional arguments like `pnpm approve-builds esbuild fsevents !core-js`. Packages not on the list fail the install when `strictDepBuilds` is true (the v11 default) and warn otherwise.

Yarn Classic (v1) has no native per-package mechanism, only the global `--ignore-scripts` flag, with [yarnpkg/yarn#7338](https://github.com/yarnpkg/yarn/issues/7338) tracking the feature request. The [`@lavamoat/allow-scripts`](https://lavamoat.github.io/guides/allow-scripts/) project retrofits one across Yarn v1.22+, Yarn Berry v3+, npm v8+, and pnpm: it disables scripts at the package-manager level then drives execution from a `lavamoat.allowScripts` map in `package.json`. Yarn Berry (v2+) is declarative: set [`enableScripts: false`](https://yarnpkg.com/configuration/yarnrc) globally in `.yarnrc.yml`, then opt packages back in via `dependenciesMeta.<pkg>.built: true`. No interactive approval command exists, and workspace packages always run their own scripts regardless of the global setting.

Bun blocks install scripts for dependencies by default and ships a built-in default allowlist of well-known packages (`esbuild`, `fsevents`, others) auto-trusted only when sourced from the npm registry. The [`trustedDependencies`](https://bun.com/docs/guides/install/trusted) array in `package.json` overrides that list, so opting a single package in drops the default-trusted set entirely. Trust is added by name via `bun pm trust <pkg>` or `bun add --trust <pkg>` (which pulls in the package's transitive deps), and `bun pm untrusted` lists packages with install scripts that haven't been granted trust.

Deno never runs npm lifecycle scripts unless explicitly approved, via the [`--allow-scripts=<pkg>`](https://docs.deno.com/runtime/reference/cli/install/) flag on `deno install` and `deno cache` (Deno 1.45/1.46, mid-2024) that accepts comma-separated specifiers like `npm:sqlite3,npm:esbuild@0.21.5`. Deno 2.6 (December 2025) added [`deno approve-scripts`](https://docs.deno.com/runtime/reference/cli/approve_scripts/), which persists per-package decisions into `deno.json`. Packages without approval have their scripts skipped at install time and listed in an end-of-install warning so they can be reviewed before the next run.

## PHP

Composer's top-level `scripts` field carries lifecycle hooks tied to events like `pre-install-cmd` and `post-update-cmd`, but only the root package's scripts run during install: a dependency's scripts never execute in the parent project, unlike npm's `postinstall`. Plugins are the actual transitive execution surface, and the [`allow-plugins`](https://getcomposer.org/doc/06-config.md#allow-plugins) configuration key (Composer 2.2, 2021-12-22) made plugin activation explicit per package.

The key takes `"vendor/package": true|false` entries with wildcard support (`"vendor/*": true`), defaults to `{}`, and prompts interactively for unlisted plugins while persisting the answer. Non-interactive runs (`--no-interaction`, CI) error rather than silently skipping, so an install that succeeded locally fails in CI until the plugin is on the list.

## Python

Python wheels conventionally have no install-time hooks, so for Python the install-script question becomes whether a package may execute [PEP 517](https://peps.python.org/pep-0517/) build backend code locally when the resolver picks an sdist over a prebuilt wheel.

Pip has no per-package allowlist for that. [pypa/pip#425](https://github.com/pypa/pip/issues/425), opened in 2012 under the title "pip should not execute arbitrary code from the Internet", captures the historical position. The closest controls are global: `pip install --only-binary :all:` refuses source distributions entirely, with `--no-binary <pkg>` available as a per-package exception. [Secure installs](https://pip.pypa.io/en/stable/topics/secure-installs/) recommends pairing `--only-binary :all:` with `--require-hashes`. The inverse `--only-binary-except=<pkg>` is tracked at [pypa/pip#10724](https://github.com/pypa/pip/issues/10724).

[pypa/pip#13079](https://github.com/pypa/pip/issues/13079) (fixed in pip 25.0) showed that wheels aren't inert in practice: a malicious wheel could overwrite pip's own internal modules and execute code at the tail of `pip install`.

uv has per-package source-build controls via a set of [settings](https://docs.astral.sh/uv/reference/settings/) that pair global and per-package toggles: `no-build` and `no-build-package` refuse sdists, `no-binary` and `no-binary-package` force source builds, `no-build-isolation` and `no-build-isolation-package` toggle PEP 517 build isolation. The combination amounts to a per-package allowlist for which packages may execute build backend code locally. [astral-sh/uv#11682](https://github.com/astral-sh/uv/issues/11682) asked for `only-binary` to gain a persistent project-level form alongside the existing CLI flag.

Poetry exposes `installer.only-binary` (Poetry 2.0.0+) and `installer.no-binary` as comma-separated package lists or the special values `:all:` / `:none:`. Combining `installer.only-binary = ":all:"` with `installer.no-binary = "pkgA"` produces a per-package source-build allowlist by composition, since the [docs](https://python-poetry.org/docs/configuration/) state that explicit package names override `:all:`. PDM has `--no-isolation` for build isolation but no `no-binary-package` equivalent in the [CLI reference](https://pdm-project.org/en/latest/reference/cli/). Pipenv has neither natively. The documented workaround is `--extra-pip-args="--only-binary=:all:"` or setting `PIP_NO_BINARY` / `PIP_ONLY_BINARY` for pip to read directly.

Conda packages can ship `pre-link`, `post-link`, and `pre-unlink` shell scripts that run on the user's machine during install and uninstall. The [link-scripts documentation](https://docs.conda.io/projects/conda-build/en/latest/resources/link-scripts.html) advises authors to avoid them but documents no allowlist, no `.condarc` toggle, and no CLI flag to disable them. Conda's security configuration knobs (`safety_checks`, `extra_safety_checks`, `signing_metadata_url_base`, channel allowlist/denylist) cover artifact integrity and channel provenance, not per-package script execution. Mamba and micromamba reimplement the install model and inherit the same gap.

The indirect mitigation is that `noarch: python` packages are required by policy not to ship link scripts, so restricting yourself to `noarch: python` deps avoids the surface for pure-Python work.

## Ruby

RubyGems and Bundler have no per-gem allowlist for install-time code execution. Gems with `ext/<name>/extconf.rb` run arbitrary Ruby at install time to configure native extension builds, and the same applies to Rakefile / `mkrf_conf` variants declared under a gem's `extensions` list. The signing and trust-policy mechanism at [guides.rubygems.org/security](https://guides.rubygems.org/security/) (`LowSecurity`, `MediumSecurity`, `HighSecurity`) checks who published a gem, not whether it may run install-time code. `bundle config build.<gem> -- --with-foo` passes arguments to native builds without gating whether they happen.

## Perl

CPAN distributions ship a `Makefile.PL` (ExtUtils::MakeMaker) or `Build.PL` (Module::Build) which are ordinary Perl scripts executed at install time by [`cpan`](https://perldoc.perl.org/CPAN), [`cpanm`](https://metacpan.org/pod/App::cpanminus), or `cpm`. There is no per-distribution capability gate, no first-time prompt, and no equivalent of `allow-plugins`. CPAN.pm exposes `makepl_arg`, `mbuildpl_arg`, and `prerequisites_policy` knobs for tuning how `Makefile.PL` is invoked and how dependencies are resolved, none of which gate whether the code runs.

## Systems languages

Cargo runs `build.rs` and proc-macros as ordinary host-native Rust code during every `cargo build`, `test`, `run`, and `install` against the affected crates. Proc-macros execute inside the `rustc` process during compilation, so any procedural-macro dependency runs its code on every build. There is no global flag to disable proc-macros and no sandbox around the script process. A crate's own `Cargo.toml` can set `build = false` to suppress its own build script, but consumers cannot disable a dependency's `build.rs`.

The long-running tracking issues are [rust-lang/cargo#5720](https://github.com/rust-lang/cargo/issues/5720) (sandbox/jail build scripts, July 2018) and [rust-lang/cargo#13681](https://github.com/rust-lang/cargo/issues/13681) (build script allowlist mode, April 2024), plus the [compiler-team MCP](https://github.com/rust-lang/compiler-team/issues/475) proposing an isolating runtime shipped via rustup, none of which has landed. [cargo-vet](https://mozilla.github.io/cargo-vet/) and [cargo-crev](https://github.com/crev-dev/cargo-crev) flag `custom-build` crates for reviewer attention; neither prevents execution.

Go modules don't run downloaded code beyond compiling it, with `go run`, `go test`, and `go generate` documented as the explicit exceptions in [Russ Cox's "Command PATH security in Go"](https://go.dev/blog/path-security). There is no per-module trust mechanism because nothing third-party runs in the first place. The cgo `#cgo CFLAGS:` and `LDFLAGS:` directives have been the escape hatch. [CVE-2018-6574](https://github.com/golang/go/issues/23672), [CVE-2024-24787](https://github.com/golang/go/issues/67119), and [#42559](https://github.com/golang/go/issues/42559) were each mitigated by extending a hard-coded allowlist of permitted compiler/linker flags in the toolchain. [CVE-2023-39323](https://github.com/golang/go/issues/63211) addressed an adjacent surface by restricting `//line` directives in cgo-generated files. No per-module grant was added in any of these cases.

Swift Package Manager runs both `Package.swift` manifest evaluation and package plugins inside a sandbox (sandbox-exec on macOS) with no network access and writes restricted to a per-plugin temporary directory by default. Plugins that need more declare permissions in their target definition using [`PluginPermission`](https://developer.apple.com/documentation/packagedescription/pluginpermission): `writeToPackageDirectory(reason:)` and `allowNetworkConnections(scope:reason:)` with scope `none`, `local(ports:)`, `all(ports:)`, `docker`, or `unixDomainSocket`. The user is prompted on a TTY ([PR #5483](https://github.com/apple/swift-package-manager/pull/5483)) or must pass `--allow-writing-to-package-directory` / `--allow-network-connections` non-interactively, with decisions scoped per package.

The permission-grant model covers command plugins but not build tool plugins. Build tool plugins still run inside the sandbox by default but cannot declare or be granted `writeToPackageDirectory` / `allowNetworkConnections`. The [build-tool sandbox permissions pitch](https://forums.swift.org/t/pitch-swiftpm-plugins-explicit-buildtool-sandbox-permissions/68963) tracks the extension to that surface.

Zig's `build.zig` is arbitrary Zig code compiled to a native host binary and executed by `zig build`, including for every transitive dependency pulled in by the package manager. There is no sandbox and no per-package gate. The proposal at [ziglang/zig#14286](https://github.com/ziglang/zig/issues/14286) (open, labelled `urgent`) has no merged implementation yet. It would compile every `build.zig` to `wasm32-wasi` and emit the build graph as data for a separate `build_runner` to execute under whatever permissions are granted.

## JVM

JVM dependencies are passive JARs that don't execute on resolve or install. Build-time plugins are the execution surface.

Maven has no built-in allowlist of which plugins may load. Plugin goals execute as ordinary Java during the build [lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html). The [Maven Enforcer plugin's `bannedPlugins`](https://maven.apache.org/enforcer/enforcer-rules/bannedPlugins.html) and `bannedDependencies` rules are blocklists with `includes` carve-outs, so an allowlist has to be expressed as banning `*` and re-including specific GAVs. Core extensions declared in [`.mvn/extensions.xml`](https://maven.apache.org/guides/mini/guide-using-extensions.html) load into Maven's core classloader before the build starts, with no signature check or allowlist.

Gradle's `build.gradle(.kts)`, `settings.gradle(.kts)`, convention plugins, and applied plugins all execute arbitrary Kotlin/Groovy at configuration time, with no per-plugin code-execution allowlist. [Dependency verification via `verification-metadata.xml`](https://docs.gradle.org/current/userguide/dependency_verification.html) covers regular dependencies and plugins through checksum and PGP signature verification of artifact identity. That establishes who published the artifact, not what its code may do. Init scripts (`-I`, `$GRADLE_USER_HOME/init.gradle(.kts)`, [`init.d/*.init.gradle(.kts)`](https://docs.gradle.org/current/userguide/init_scripts.html)) run unconditionally with no signature check. The configuration cache serialises the configured task graph for performance, not to restrict what plugin code may do.

SBT plugins declared in `project/plugins.sbt` run at build configuration time with full JVM access. The [official docs](https://www.scala-sbt.org/1.x/docs/Plugins.html) describe classloader-level encapsulation between plugins and build definitions as an authoring convenience, not a security boundary. There is no allowlist or signature verification analogous to Gradle's `verification-metadata.xml`, and SBT inherits whatever artifact-verification posture the underlying Ivy or Coursier resolver provides. Leiningen and [Mill](https://mill-build.org/) take the same approach, with `project.clj` in Clojure and `build.sc` in Scala running as configuration-time programs and neither providing a per-plugin allowlist.

Bazel sits at the opposite end of the JVM build-tool spectrum. `BUILD` files and `.bzl` extensions are written in [Starlark](https://bazel.build/rules/language), a Python dialect with no clock access, no recursion, no mutable global state, and no filesystem or network calls outside declared inputs. Build actions run in a sandbox that sees only what the rule declares. The escape hatches exist (`repository_rule` for fetching, `genrule` for shell, custom toolchains), but the default posture is that a BUILD file cannot observe its host, and the per-action sandbox covers what would otherwise need an allowlist.

## .NET

Under PackageReference (NuGet 4.0+ and the default for SDK-style projects), the historical `install.ps1` and `uninstall.ps1` PowerShell scripts no longer execute on install or uninstall, per the [migration guide](https://learn.microsoft.com/en-us/nuget/consume-packages/migrate-packages-config-to-package-reference).

The replacement execution surface is MSBuild [`build/`, `buildMultiTargeting/`, and `buildTransitive/` `.props` and `.targets` files](https://learn.microsoft.com/en-us/nuget/concepts/msbuild-props-and-targets), auto-imported into the consumer's build through NuGet-generated `{projectName}.nuget.g.props` and `.nuget.g.targets`. `buildTransitive` lets a transitive dependency contribute targets to your project without you naming it as a direct dependency. There is no per-package allowlist for MSBuild target imports. The `<trustedSigners>` configuration in `nuget.config` controls which signed packages are accepted by signer identity, without bearing on what their MSBuild contributions then do.

## Other languages

Hex/Mix (Elixir) evaluates each dependency's `mix.exs` and runs its compile task on [`mix deps.compile`](https://hexdocs.pm/mix/Mix.Tasks.Deps.Compile.html), with no per-package allowlist and no separate install-script field beyond compilation. Rebar3 (Erlang) supports [`pre_hooks`, `post_hooks`, `provider_hooks`](https://rebar3.org/docs/configuration/configuration/) and plugins loaded from Hex, all of which execute when their declaring dependency is built, again without any allowlist.

Cabal and Stack (Haskell) historically run arbitrary `Setup.hs` programs for packages with `build-type: Custom`. The recent [`build-type: Hooks`](https://well-typed.com/blog/2025/01/cabal-hooks/) in Cabal 3.14 (2024) replaces wholesale Setup replacement with a fixed set of named hook points, narrowing the surface without introducing an allowlist.

Opam (OCaml) wraps every package's `build:` and `install:` commands with [`sandbox.sh`](https://opam.ocaml.org/doc/FAQ.html) (opam 2.0, 2018), using bubblewrap on Linux and sandbox-exec on macOS. The build phase can write to the build directory and `/tmp` but sees the switch as read-only; the install phase can write to the switch. Network access is denied throughout. The sandbox is global rather than per-package, and `opam init --disable-sandboxing` turns it off.

Pub (Dart/Flutter) historically ran no dependency code on resolution. The [`hook/build.dart`](https://dart.dev/tools/hooks) mechanism started as an experiment in Dart 3.2 behind `--enable-experiment=native-assets` and stabilised in Dart 3.10. The design is advertised as "semi-hermetic" for reproducibility, not for adversarial isolation.

LuaRocks rockspecs can declare `command`, `make`, `cmake`, or `builtin` [build backends](https://github.com/luarocks/luarocks/blob/main/docs/rockspec_format.md), with the `command` backend executing arbitrary shell during `luarocks install` and no allowlist over which rocks may do so.

Nimble (Nim) supports `before` and `after` template hooks in `.nimble` NimScript files, with `exec` of external processes as the documented escape hatch from NimScript's own FFI restrictions. [zef](https://github.com/ugexe/zef) (Raku) runs a `Build.rakumod` or a `builder` module declared in `META6.json` unconditionally during the build phase. The `--/build` flag disables the build phase globally; no per-distribution gate is documented.

Crystal Shards supports a `postinstall` field in [`shard.yml`](https://github.com/crystal-lang/shards/blob/master/docs/shard.yml.adoc) with a global `--skip-postinstall` flag as the only opt-out. The community forum thread ["postinstall considered harmful"](https://forum.crystal-lang.org/t/shards-postinstall-considered-harmful/3910) covers the case for changing this. Julia Pkg runs [`deps/build.jl`](https://pkgdocs.julialang.org/v1/creating-packages/) on first install of each dependency, with the modern alternative being BinaryBuilder-produced `_jll` packages referenced by hash, although `build.jl` remains supported.

R source packages on CRAN run a `configure` Bourne shell script (and `configure.win` on Windows) before anything else, plus arbitrary code in `R/zzz.R`'s `.onLoad` and `.onAttach`. CRAN's mitigation is editorial review and pre-built Windows/macOS binaries from the [build farm](https://cran.r-project.org/doc/manuals/r-release/R-exts.html), with no per-package mechanism.

CocoaPods displays a per-install warning the first time a Podfile pulls in a pod with [`script_phase`](https://blog.cocoapods.org/CocoaPods-1.4.0/) build phases, plus on every update where the pod still contains them, without persisting a stored allowlist. Carthage clones each dependency's repo and invokes `xcodebuild` against its shared schemes, which executes any Run Script build phases declared in the dependency's `.xcodeproj` without warning or allowlist.

## C/C++

Conan recipes are full Python modules whose `source()`, `build()`, `package()`, and `package_info()` methods run in the host Python process during [`conan install` and `conan create`](https://docs.conan.io/2/reference/conanfile.html). There is no sandbox or allowlist; curation of the ConanCenter index is the trust boundary.

vcpkg ports are `portfile.cmake` files interpreted by CMake's script mode and able to call `execute_process` and `vcpkg_execute_build_process`, with no per-port allowlist or sandbox per the [ports documentation](https://learn.microsoft.com/en-us/vcpkg/concepts/ports).

Spack `package.py` files are arbitrary Python with `install()` methods and build phases that run during `spack install`. Spack's [security framing](https://spack.readthedocs.io/en/latest/packaging_guide.html) covers download integrity (checksummed tarballs, pinned git commits), not per-recipe capability.

## OS distributions

On dpkg/apt, RPM/dnf, pacman, and Alpine's apk, install-time maintainer scripts (`preinst`/`postinst`/`prerm`/`postrm` for dpkg, `%pre`/`%post`/`%preun`/`%postun` for RPM, `.INSTALL` for pacman, `$pkgname.{pre,post}-install` plus `.{pre,post}-upgrade`, `.{pre,post}-deinstall`, and `.trigger` for apk) run as root with no sandbox, no chroot, and no seccomp filter. The trust model is the archive itself, with [`apt-secure(8)`](https://manpages.debian.org/testing/apt/apt-secure.8.en.html) gating which packages enter the install pipeline via repository GPG signing. There is no per-package allowlist or opt-in flag, and the Debian wiki's [UntrustedDebs](https://wiki.debian.org/UntrustedDebs) page treats installing a `.deb` from outside the trusted archive as effectively giving the package author root.

The pacman official repositories follow the same archive-curation model. The [AUR](https://wiki.archlinux.org/title/Arch_User_Repository) exposes raw PKGBUILDs and `.INSTALL` files to users for review, with AUR helpers (yay, paru, pikaur, others compared in the [helpers table](https://wiki.archlinux.org/title/AUR_helpers)) differing on whether they prompt for a diff of PKGBUILDs before sourcing them.

Nix and Guix run every derivation's builder inside a chroot with a fresh PID/network/mount namespace, an unprivileged build user (Nix's `nixbld` pool, Guix's `guixbuild` pool), and no network access except for fixed-output derivations whose output hash is declared up front. The model is documented in the [Nix configuration reference](https://nix.dev/manual/nix/2.23/command-ref/conf-file.html) and the [Guix Build Environment Setup chapter](https://guix.gnu.org/manual/devel/en/html_node/Build-Environment-Setup.html). Every builder runs inside the box, with fixed-output derivations and the small `trusted-users` set as the remaining trust surface. CVE-2024-27297 was a fixed-output-derivation sandbox bypass affecting both Nix and Guix.

Portage (Gentoo) enables `FEATURES="sandbox"` by default, an LD_PRELOAD shim that intercepts filesystem syscalls and blocks writes outside permitted build directories. `userpriv` runs ebuild phases as the `portage` user, and `usersandbox` combines the two. The mechanism is LD_PRELOAD-based, so static binaries and direct syscalls bypass it, as documented on the [Gentoo wiki's Sandbox (Portage)](https://wiki.gentoo.org/wiki/Sandbox_(Portage)) page. Trust still flows from the curated Portage tree's signed Manifest files, with no per-ebuild capability grant. Overlays sit explicitly outside that boundary.

## Userland package managers

Homebrew, MacPorts, Scoop, and Chocolatey locate trust at the repository (tap, ports tree, bucket) level rather than per-package: tapping a repository or adding a bucket grants it the same trust as the core repository, and individual formulae, ports, or manifests have no per-package allowlist. Homebrew's [security policy](https://github.com/homebrew/brew/security/policy) makes the tap-level boundary explicit.

MacPorts signs the ports tarball ([GHSA-2j38-pjh8-wfxw](https://github.com/google/security-research/security/advisories/GHSA-2j38-pjh8-wfxw), disclosed December 2024, covered an rsync filter bypass that let a malicious mirror deliver unsigned Portfiles past the signed-archive boundary and trigger Tcl execution during `portindex`). Scoop bakes a known-bucket list into the client with per-manifest hash verification. Chocolatey adds human moderation of community submissions on top of optional package signing, with Trusted Packages bypassing manual review based on author track record.

winget differs because its YAML manifests don't include arbitrary install-time scripts. The supported `InstallerType` values are real installer formats (`msi`, `msix`, `appx`, `exe`, `inno`, `nullsoft`, `wix`, `burn`, `portable`, `zip`, `font`, `msstore`), and the manifest declares a SHA256 of the installer binary. `winget validate` checks manifest format; PR review on the `winget-pkgs` repo plus Azure Pipelines bot validation covers submission integrity, alongside an optional local [`SandboxTest.ps1`](https://github.com/microsoft/winget-pkgs/blob/master/doc/tools/SandboxTest.md) that authors can run to test a candidate inside Windows Sandbox before submitting.

## Version managers

asdf plugins are Git repositories of shell scripts (`bin/install`, `bin/list-all`, others) that run as the user during `asdf install`, with no allowlist or sandbox: adding a plugin is functionally equivalent to running its bash. mise reduces the plugin surface by routing most tools through non-shell backends: [mise discussion #4054](https://github.com/jdx/mise/discussions/4054) maps most tools to `aqua`, `ubi`, `vfox`, or `core` in the default registry, with asdf plugins forked under the `mise-plugins` GitHub org so commit access is controlled.

[`mise trust` and `trusted_config_paths`](https://mise.jdx.dev/configuration/settings.html) gate execution of `[env]`, `[hooks]`, and `[tasks]` blocks in project-level `mise.toml` files, prompting on first `cd` into a directory with an untrusted config and persisting the decision per file.

