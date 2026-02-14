---
layout: post
title: "Platform Strings"
date: 2026-02-17 10:00 +0000
description: "Every package manager names the same platforms differently, and every divergence made sense at the time."
tags:
  - package-managers
  - deep-dive
---

Ask a dozen ecosystems what platform you're running on and you'll get a dozen different answers. An M1 Mac compiling a library is `aarch64-apple-darwin` to LLVM, `arm64-darwin` to RubyGems, `darwin/arm64` to Go, `macosx_11_0_arm64` to Python wheels, and `darwin-arm64` to npm, all describing the same chip on the same OS. Each naming scheme was designed for its own context with its own constraints, and every tool that needs to work across ecosystems ends up maintaining a translation table between them.

### GNU target triples

The format `cpu-vendor-os` dates to the early 1990s GNU autoconf toolchain. Per Bothner wrote [`config.guess`](https://www.gnu.org/software/autoconf/manual/autoconf-2.68/html_node/Specifying-Target-Triplets.html) in 1992 to detect the build system's architecture. [`config.sub`](https://gcc.gnu.org/install/configure.html) normalized the output using a long list of known CPUs and operating systems. The "triple" described three things: what CPU, what vendor made the hardware, and what OS it runs.[^triple]

[^triple]: The name "triple" stuck even after a fourth field got added. `x86_64-pc-linux-gnu` has four components but everyone still calls it a triple. See ["What the Hell Is a Target Triple?"](https://mcyoung.xyz/2025/04/14/target-triples/) for more on this naming.

GCC adopted this for [cross-compilation](https://gcc.gnu.org/onlinedocs/gccint/Configure-Terms.html), where the build machine, host machine, and target machine might all differ. The vendor field (`pc`, `apple`, `unknown`) is mostly decorative for the compiler itself but serves as a namespace to avoid collisions when the same arch-os pair needs different behavior. LLVM inherited the format through [Clang's cross-compilation support](https://clang.llvm.org/docs/CrossCompilation.html), using `<arch><sub>-<vendor>-<sys>-<env>` with the fourth field encoding ABI details like `gnu`, `musl`, or `msvc`.

ARM naming has been a persistent source of confusion. The architecture ARM calls "AArch64" is what Apple calls "arm64" and what LLVM accepts as both. A [Clang bug](https://groups.google.com/g/llvm-dev/c/PIBNR1EE9R0) meant `--target=aarch64-apple-ios` and `--target=arm64-apple-ios` produced different results. ARM itself used both names at different times before settling on AArch64 as the official designation, and the ambiguity persists everywhere downstream.

### Go

Go uses two environment variables rather than a combined string: `GOOS=darwin GOARCH=arm64` or `GOOS=linux GOARCH=amd64`, with no vendor or ABI field. The [canonical values](https://go.dev/doc/install/source) are maintained in the Go source tree in [`syslist.go`](https://github.com/golang/go/blob/master/internal/platform/syslist_test.go).

This design traces back to Plan 9, where the `$objtype` environment variable selected the target architecture and `mk` used it to pick the right compiler. Go's creators (Rob Pike and Ken Thompson, both Plan 9 veterans) carried forward the idea that [a single environment variable should select the build target](https://9p.io/sys/doc/comp.html). The early Go compilers even used Plan 9's letter-based naming: `8g` for the x86 compiler, `6g` for amd64, `5g` for ARM.

Go can afford two flat variables because it statically links everything. It doesn't need to express which vendor made the hardware or which C library the system uses, because [Go programs don't link against a C library by default](https://eli.thegreenplace.net/2024/building-static-binaries-with-go-on-linux/). CGo changes this, and when it does, cross-compilation gets harder. That's the tradeoff: the simple model works because Go opted out of the C ecosystem.

Go chose `amd64` over `x86_64` following Debian and Plan 9 conventions. This caused confusion early on, with users on Intel hardware wondering if `amd64` downloads would work for them. The Go team eventually [relabeled downloads](https://github.com/golang/go/issues/3125) as "x86 64-bit" while keeping the internal `amd64` naming.

### Node.js

Node exposes `process.platform` and `process.arch`, with platform values like `darwin`, `linux`, `win32`, and `freebsd`, and architecture values like `x64`, `arm64`, `ia32`, and `arm`.

`win32` for Windows and `x64` for 64-bit x86 both come from existing conventions that Node inherited rather than chose. `win32` is the Windows API subsystem name, used even on 64-bit Windows because the Win32 API kept its name, so `process.platform` returns `win32` on a machine that hasn't been 32-bit for a decade. `x64` is the name Microsoft and [V8](https://v8.dev/) use for the architecture, following the Windows SDK convention rather than the Linux `x86_64` or Debian `amd64` convention.

npm's [`package.json`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json/) has `os` and `cpu` fields (`{"os": ["darwin", "linux"], "cpu": ["x64", "arm64"]}`) that filter which platforms a package can install on, but npm itself has no built-in binary distribution mechanism, so the community invented one. Tools like [esbuild](https://github.com/evanw/esbuild/blob/main/lib/npm/node-platform.ts) publish platform-specific binaries as scoped packages (`@esbuild/darwin-arm64`, `@esbuild/linux-x64`) listed as `optionalDependencies` of a wrapper package, with `os` and `cpu` fields on each so npm silently skips the ones that don't match. The wrapper package then uses `process.platform` and `process.arch` at runtime to `require()` the right one. This pattern, popularized by esbuild and adopted by SWC and others, works but it's a convention built on top of npm's dependency resolution, not a feature npm designed for the purpose.

The Node scheme has no way to express libc version, OS version, or ABI, which is fine for most of the JavaScript ecosystem where packages are pure JavaScript. The cost shows up at the edges: native addons that need different builds for glibc vs musl Linux have to encode that information outside the platform string, and the `optionalDependencies` pattern offers no help there.

### Python wheels

Python's [wheel platform tags](https://peps.python.org/pep-0425/) encode the most information of any ecosystem. A wheel filename like `numpy-1.26.0-cp312-cp312-manylinux_2_17_x86_64.whl` contains the Python version (`cp312`), the ABI tag (`cp312`), and the platform tag (`manylinux_2_17_x86_64`).

The platform tag comes from [`sysconfig.get_platform()`](https://docs.python.org/3/library/sysconfig.html) with hyphens and periods replaced by underscores. On macOS it encodes the minimum OS version: `macosx_11_0_arm64` means "macOS 11 or later on arm64." On Windows it's `win_amd64`. On Linux it encodes the glibc version.

The manylinux story is its own saga. [PEP 513](https://peps.python.org/pep-0513/) introduced `manylinux1` (glibc 2.5) so that compiled wheels could run on most Linux distributions. Then came [PEP 571](https://peps.python.org/pep-0571/) for `manylinux2010` (glibc 2.12), then [PEP 599](https://peps.python.org/pep-0599/) for `manylinux2014` (glibc 2.17). Each required a new PEP. [PEP 600](https://peps.python.org/pep-0600/) finally created a pattern, `manylinux_${GLIBCMAJOR}_${GLIBCMINOR}_${ARCH}`, so future glibc versions don't need new PEPs. The old names became aliases: `manylinux1_x86_64` is `manylinux_2_5_x86_64`.

Python needs all this because wheels contain compiled C extensions that link against system libraries. A wheel built on a system with glibc 2.34 may call functions that don't exist on a system with glibc 2.17. The tag encodes the minimum compatible glibc version so pip can select the right wheel. [PEP 656](https://peps.python.org/pep-0656/) added `musllinux` tags for Alpine Linux and other musl-based distributions, which most web developers encounter when they try to `pip install` a compiled package inside an Alpine Docker container and discover that `manylinux` wheels won't work there. The architecture field uses the `uname` convention (`x86_64`, `aarch64`, `i686`), which means no `amd64`, no `arm64`, and no `x64`.

### RubyGems

RubyGems uses `cpu-os` pairs: `x86_64-linux`, `arm64-darwin`, `x86_64-linux-musl`. The format comes from [`Gem::Platform`](https://docs.ruby-lang.org/en/master/Gem/Platform.html), which parses the string into cpu, os, and version components.

For years the Linux version field was unused. Then the musl libc question arrived. Alpine Linux uses musl instead of glibc, and a native extension compiled against glibc won't run on musl. RubyGems [added `linux-musl` and `linux-gnu` platform variants](https://github.com/rubygems/rubygems/pull/5852) starting in RubyGems 3.3.22. The matching logic has a special case: on Linux, "no version" defaults to `gnu`, but when matching a gem platform against the runtime platform, it acts as a wildcard.

[rake-compiler-dock](https://github.com/rake-compiler/rake-compiler) handles cross-compilation of native gems, and its platform naming has its own conventions. `x64-mingw-ucrt` targets Ruby 3.1+ on Windows (which switched to the UCRT runtime), while `x64-mingw32` targets Ruby 3.0 and earlier. Platform names ending in `-linux` are [treated as aliases for `-linux-gnu`](https://github.com/rake-compiler/rake-compiler-dock/issues/117).

RubyGems is now working on a more expressive system inspired by Python's wheels. Samuel Giddins has been building [experimental support for tag-based platform matching](https://blog.rubygems.org/2025/08/21/july-rubygems-updates.html), using a filename format of `{gem_name}-{version}-{ruby tag}-{abi tag}-{platform tag}.gem2`. The proposed dimensions for platform matching are Ruby ABI, OS, OS version, CPU architecture, libc implementation, and libc version. This is [almost exactly the same set of dimensions](https://traveling.engineer/posts/goals-for-binary-gems/) that Python's wheel tags evolved to cover, arrived at independently.

### Debian multiarch tuples

Debian uses [multiarch tuples](https://wiki.debian.org/Multiarch/Tuples) as directory names for architecture-specific library paths. `/usr/lib/x86_64-linux-gnu/` holds 64-bit x86 libraries, `/usr/lib/aarch64-linux-gnu/` holds ARM64 libraries. The format is based on normalized GNU triplets but Debian chose its own canonical forms.

The Debian architecture name `amd64` maps to the multiarch tuple `x86_64-linux-gnu`. The architecture name `arm64` maps to `aarch64-linux-gnu`. `armhf` maps to `arm-linux-gnueabihf`. That last one is notable: the hard-float/soft-float distinction was originally supposed to go in the vendor field, which is what [GCC developers recommended](https://wiki.debian.org/ArmHardFloatPort). But the vendor field is semantically private, not meant for cross-distribution use, so Debian instead appended `hf` to the ABI component: `gnueabihf` vs `gnueabi`. The naming was argued over for months.

Multiarch exists to solve co-installation: running 32-bit and 64-bit libraries side by side on the same system. The tuple goes into the filesystem path, so it has to be a valid directory name, stable across releases, and unique per ABI. This is a different set of constraints than a compiler target triple. GCC and Debian independently developed tuple formats that look similar but diverge in the details, because they're optimizing for different things.

### Rust

Rust uses target triples that look like LLVM triples but are [curated and normalized](https://doc.rust-lang.org/rustc/platform-support.html). `x86_64-unknown-linux-gnu`, `aarch64-apple-darwin`, `x86_64-pc-windows-msvc`. Where LLVM's triples are sprawling and sometimes inconsistent, Rust maintains an explicit list organized into [tiers](https://doc.rust-lang.org/rustc/target-tier-policy.html).

Tier 1 targets are "guaranteed to work" with automated testing on every commit. As of 2025, [aarch64-apple-darwin reached Tier 1](https://blog.rust-lang.org/2025/10/30/Rust-1.91.0/) while x86_64-apple-darwin dropped to Tier 2, reflecting Apple Silicon's dominance. Tier 2 targets build but may not pass all tests. Tier 3 targets are community-maintained.

[RFC 0131](https://rust-lang.github.io/rfcs/0131-target-specification.html) established that Rust target triples map to but aren't identical to LLVM triples. A Rust target specification is a JSON file with an `llvm-target` field that can differ from the Rust-facing name. This lets Rust present clean, consistent names to users while translating to whatever LLVM expects internally. The [target-lexicon](https://github.com/bytecodealliance/target-lexicon) crate from the Bytecode Alliance provides parsing and matching for these triples.

### Zig

Zig inherited LLVM's target triples but is actively redesigning them. An [accepted proposal](https://github.com/ziglang/zig/issues/20690) by Alex Ronne Petersen would turn triples into quadruples, splitting the C library choice (API) from the ABI into separate components: `<arch>-<os>-<api>-<abi>`.

The proposal includes what it calls "a fairly exhaustive survey of the ISA and ABI landscape," and the scale of the problem becomes clear quickly. RISC-V alone defines eight distinct ABIs (ilp32, ilp32f, ilp32d, ilp32e, lp64, lp64f, lp64d, lp64q). PowerPC has multiple ABIs (SVR4, EABI, Apple, ELFv1, ELFv2, AIX) plus variations in `long double` representation. LoongArch is "the only architecture I'm aware of to have done the sane thing" and put the ABI information into the ABI component from the start; the current triple format can't express most of these combinations cleanly.

Under the proposed scheme, `aarch64-linux-gnu` becomes `aarch64-linux-gnu-lp64` and `powerpc64le-linux-musl` becomes `powerpc64le-linux-musl-elfv2+ldbl64`, with the `+` syntax letting ABI options compose like feature flags. The proposal quotes [Zig's design philosophy](https://ziglang.org/learn/overview/): "Edge cases matter" and "Avoid local maximums," arguing that just because GNU triples are ubiquitous doesn't mean they're good. It's the same lesson Python learned from the other direction: it took four PEPs across five years to get manylinux right, discovering at each step that the problem space was bigger than the previous design assumed. Zig is trying to get it right from the compiler side before the package ecosystem calcifies around a format that can't express what it needs to.

### Conan and vcpkg

C and C++ have [no canonical package registry](/2026/01/27/the-c-shaped-hole-in-package-management.html), so the two main C/C++ package managers each invented their own platform identification from scratch.

[Conan](https://conan.io/) doesn't use platform strings at all. It uses [hierarchical settings](https://docs.conan.io/2/reference/config_files/settings.html): `os=Macos`, `arch=armv8`, `compiler=apple-clang`, `compiler.version=15`. The settings are separate key-value pairs rather than a combined string, which means Conan never had to decide on a separator or field order. It also means Conan calls ARM64 `armv8`, adding a fourth name for the architecture alongside `aarch64`, `arm64`, and `x64`. For cross-compilation, Conan 2 uses [dual profiles](https://docs.conan.io/2/tutorial/consuming_packages/cross_building_with_conan.html) (`--profile:build` and `--profile:host`) rather than encoding build and target in a single string.

[vcpkg](https://vcpkg.io/) borrowed the word "triplet" but simplified the format to [`arch-os`](https://learn.microsoft.com/en-us/vcpkg/concepts/triplets) with optional suffixes: `x64-windows`, `arm64-osx`, `x64-linux`, `x64-windows-static`. There's no vendor or ABI field, and vcpkg uses `x64` (the Windows SDK convention) and `osx` rather than `darwin` or `macos`. The [documentation](https://learn.microsoft.com/en-us/vcpkg/users/triplets) cites the Android NDK's naming as inspiration for custom triplets, which is itself a variation on GNU triples with an API level suffix like `aarch64-linux-android21`.

### .NET

.NET has [Runtime Identifiers](https://learn.microsoft.com/en-us/dotnet/core/rid-catalog) (RIDs) that follow an `os[-version]-arch` pattern: `linux-x64`, `win-arm64`, `osx-arm64`, `linux-musl-x64`. The format puts OS first, which is the opposite of most other schemes. Starting with .NET 8, Microsoft [strongly recommends](https://learn.microsoft.com/en-us/dotnet/core/compatibility/deployment/8.0/rid-asset-list) portable RIDs without version numbers, but version-specific RIDs like `win10-x64` and `osx.13-arm64` still exist for backward compatibility. The RID system includes a compatibility fallback graph: `osx-arm64` falls back to `osx` which falls back to `unix` which falls back to `any`. NuGet uses these RIDs to select platform-specific assets from packages.

### Others

[Swift Package Manager](https://swiftinit.org/docs/swift-package-manager/basics/triple) uses LLVM target triples directly (`arm64-apple-macosx15.0`, `x86_64-unknown-linux-gnu`), inheriting both the format and its quirks without adding new ones. [Kotlin Multiplatform](https://kotlinlang.org/docs/native-target-support.html) wraps LLVM triples in camelCase Gradle target names (`linuxX64`, `macosArm64`, `iosSimulatorArm64`) that are friendlier to type but map one-to-one to underlying triples.

Java doesn't have a standard platform string format because most Java code doesn't need one. When it does, the [os-maven-plugin](https://github.com/trustin/os-maven-plugin) normalizes platform detection into a classifier string like `linux-x86_64` or `osx-aarch_64`, adding an underscore to `aarch_64` that no other ecosystem uses.

[Homebrew](https://docs.brew.sh/Bottles) names its bottle builds using macOS marketing names: `arm64_sonoma`, `arm64_ventura`, `ventura` (Intel implied). On Linux it's `x86_64_linux`. This makes Homebrew the only package manager that encodes the OS release name rather than a version number, and bottles break whenever Apple ships a new macOS version until Homebrew adds it.

[Nix](https://nixos.org/) uses simple `arch-os` pairs like `x86_64-linux` and `aarch64-darwin`, clean and minimal but unable to distinguish between glibc and musl Linux in the system string.

### Comparison

The same four platforms, named by each ecosystem:

| | 64-bit x86 Linux | ARM64 macOS | 64-bit x86 Windows | ARM64 Linux |
|---|---|---|---|---|
| GCC/LLVM | x86_64-pc-linux-gnu | aarch64-apple-darwin | x86_64-pc-windows-msvc | aarch64-unknown-linux-gnu |
| Go | linux/amd64 | darwin/arm64 | windows/amd64 | linux/arm64 |
| Node.js | linux-x64 | darwin-arm64 | win32-x64 | linux-arm64 |
| Python wheels | manylinux_2_17_x86_64 | macosx_11_0_arm64 | win_amd64 | manylinux_2_17_aarch64 |
| RubyGems | x86_64-linux | arm64-darwin | x64-mingw-ucrt | aarch64-linux |
| Debian | x86_64-linux-gnu | (N/A) | (N/A) | aarch64-linux-gnu |
| Rust | x86_64-unknown-linux-gnu | aarch64-apple-darwin | x86_64-pc-windows-msvc | aarch64-unknown-linux-gnu |
| Zig (current) | x86_64-linux-gnu | aarch64-macos-none | x86_64-windows-msvc | aarch64-linux-gnu |
| Conan | os=Linux, arch=x86_64 | os=Macos, arch=armv8 | os=Windows, arch=x86_64 | os=Linux, arch=armv8 |
| vcpkg | x64-linux | arm64-osx | x64-windows | arm64-linux |
| .NET | linux-x64 | osx-arm64 | win-x64 | linux-arm64 |
| Nix | x86_64-linux | aarch64-darwin | (N/A) | aarch64-linux |
| Homebrew | x86_64_linux | arm64_sonoma | (N/A) | (N/A) |

The same four platforms yield three names for 64-bit x86 (`x86_64`, `amd64`, `x64`), at least five for ARM64 (`aarch64`, `arm64`, `armv8`, Maven's `aarch_64`, and Homebrew's `arm64` with an underscore separator), three for macOS (`darwin`, `macos`/`osx`, `macosx`, plus Homebrew's version-specific names), and two for Windows (`win32`, `windows`/`win`). RubyGems is interesting here because it uses both ARM64 names: `arm64-darwin` on macOS (following Apple's convention) but `aarch64-linux` on Linux (following the kernel's convention). Two different names for the same architecture within a single ecosystem, while Conan sidesteps the entire format question by not using strings at all.

### Why everything diverges

The architecture naming splits trace back to who each ecosystem inherited from. Go took `amd64` from Plan 9 and Debian, both of which used AMD's name since AMD designed the 64-bit extension to x86. Node got `x64` from V8, which followed the Windows SDK convention. Python's `x86_64` comes straight from `uname -m` on Linux via `sysconfig.get_platform()`. Debian itself uses `amd64` as the architecture name but `x86_64-linux-gnu` as the multiarch tuple, because the two serve different purposes.

The structural differences run deeper and trace to what each ecosystem actually ships. Go statically links by default, so it never needed a vendor or ABI field, while Python wheels contain compiled C extensions that link against system libraries and ended up encoding the glibc version out of necessity. Most npm packages are pure JavaScript, which is why Node's platform strings never grew libc or OS version fields. Rust curates its triple list with a tier system because it wants to guarantee that specific targets work with specific levels of CI coverage. Conan gave up on strings entirely in favor of structured key-value settings, avoiding the parsing and separator problems but making it harder to use where a single identifier is expected, like a filename or URL path. .NET's RIDs put OS first (`linux-x64` rather than `x64-linux`) because the runtime's fallback graph cares more about OS compatibility than architecture when selecting assets.

### Dimensions

A platform identifier that fully describes a compilation target seems to need at least five dimensions: CPU architecture (x86_64, aarch64, riscv64), operating system (linux, darwin, windows), OS version (macOS 11+, sometimes implicit), ABI or calling convention (gnu, musl, msvc, eabihf), and libc implementation and version (glibc 2.17, musl 1.2, Linux-specific but critical for binary compatibility). Five is a lower bound. Zig's ABI survey suggests the real number is higher once you start cataloguing calling convention variations across architectures, and none of these dimensions account for CPU feature levels (AVX2, SSE4.2) that matter for optimized builds.

Different ecosystems cover different subsets depending on what problems they need to solve. Go and Node get by with just arch and OS, while Python needs four dimensions because wheels contain compiled C extensions that care about OS version and glibc compatibility. Conan's structured settings cover four or five dimensions depending on how you count compiler metadata, and Rust sits somewhere in between with three or four. The GNU/LLVM triple format has slots for all five but doesn't enforce consistency in how they're filled. Zig's quadruple proposal is the most explicit attempt I've seen, with the fourth component separating the libc choice (API) from the calling convention (ABI), though the RISC-V and PowerPC examples in the proposal suggest that even this may not be enough without the `+feature` extension syntax.

### Prior art

[archspec](https://github.com/archspec/archspec), extracted from [Spack](https://spack.io/), models CPU microarchitecture naming as a directed acyclic graph. Its [JSON database](https://github.com/archspec/archspec-json/blob/master/cpu/microarchitectures.json) tracks which microarchitectures are compatible with which, including feature sets like AVX2 and SSE4.2 and x86-64 microarchitecture levels (v2, v3, v4). It's probably the most rigorous treatment of the "which CPU can run binaries compiled for which other CPU" question, but it's silent on OS, libc, and ABI.

Python's manylinux system ([PEP 513](https://peps.python.org/pep-0513/), [PEP 600](https://peps.python.org/pep-0600/)) took a different slice of the problem, encoding glibc version into wheel platform tags. Four PEPs across five years to get from `manylinux1` to the general `manylinux_x_y` pattern. Ruby's [binary gems RFC](https://traveling.engineer/posts/goals-for-binary-gems/) arrived at nearly the same set of dimensions: Ruby ABI, OS, OS version, CPU architecture, libc implementation, libc version. The proposed `.gem2` filename format mirrors Python's wheel naming, and I haven't found evidence that either project drew directly from the other. Independent convergence on the same dimensions is arguably stronger evidence that those dimensions are the right ones than if one had simply copied the other's homework.

Zig's [target quadruple proposal](https://github.com/ziglang/zig/issues/20690) goes deeper on ABI enumeration than anything else I've found, cataloging calling convention variations across RISC-V, PowerPC, MIPS, and LoongArch. It's focused on compiler targets rather than package management, so it doesn't touch the libc version compatibility question that Python and Ruby spent years on. The Bytecode Alliance's [target-lexicon](https://crates.io/crates/target-lexicon) crate parses and matches Rust/LLVM triples specifically, and the [platforms](https://crates.io/crates/platforms) crate maintains the tier list, but neither attempts to generalize across ecosystems.

### User agents

Platform strings remind me of browser user agent strings, which went through a similar process of rational local decisions producing global incoherence. [RFC 1945](https://www.rfc-editor.org/rfc/rfc1945) defined the User-Agent header in 1996 with a simple grammar: product name, slash, version. NCSA Mosaic sent `NCSA_Mosaic/2.0 (Windows 3.1)`. Netscape Navigator, codenamed ["Mozilla"](https://en.wikipedia.org/wiki/Mozilla_(mascot)) (a portmanteau of "Mosaic" and "Godzilla"), sent `Mozilla/1.0 (Win3.1)`. Netscape supported frames; Mosaic didn't. Web developers started checking for "Mozilla" in the user agent and sending frames-based pages only to browsers that matched.

When Internet Explorer 3 shipped with frame support, it couldn't get the frames-based pages because it wasn't Mozilla. Microsoft's solution was to declare IE "[Mozilla compatible](https://webaim.org/blog/user-agent-string-history/)": `Mozilla/2.0 (compatible; MSIE 3.02; Windows 95)`. Since most sniffers only checked the prefix, IE passed and got the right pages. Then Konqueror's KHTML engine was being blocked by sites that sniffed for Gecko, so it added `(KHTML, like Gecko)` to its string. Apple forked KHTML to make WebKit and Safari needed to pass checks for both Gecko and KHTML, so Safari's user agent claimed to be Mozilla, said its engine was "like Gecko," and referenced KHTML. When Chrome shipped in 2008 using WebKit, it inherited all of this and [added its own token](https://humanwhocodes.com/blog/2010/01/12/history-of-the-user-agent-string/):

```
Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.13
    (KHTML, like Gecko) Chrome/0.2.149.27 Safari/525.13
```

Every token except `Chrome` is a compatibility claim. It's not Mozilla, not Safari, and its engine descends from KHTML but is no longer KHTML. Chrome has since [frozen most of the string](https://www.chromium.org/updates/ua-reduction/) to reduce fingerprinting, replacing it with structured [Client Hints](https://wicg.github.io/ua-client-hints/) that servers can request individually. But the old string persists because too much code parses it.

Platform strings aren't adversarial in the same way, but they share the path-dependency. Every tool that works across ecosystems maintains its own mapping between formats. [esbuild](https://github.com/evanw/esbuild/blob/main/lib/npm/node-platform.ts) maps Node's `process.platform`/`process.arch` to package names, [cibuildwheel](https://cibuildwheel.pypa.io/) maps Python platform tags to CI matrix entries, and [rake-compiler-dock](https://github.com/rake-compiler/rake-compiler) maps RubyGems platforms to GCC cross-compilation targets. These mappings are maintained independently, and discrepancies between them surface as bugs in specific platform combinations.

In the spirit of [XKCD 927](https://xkcd.com/927/), I've started building [git-pkgs/platforms](https://github.com/git-pkgs/platforms) as an attempt at a shared translation layer. The [spec](https://github.com/git-pkgs/platforms/blob/main/SPEC.md) defines canonical names and parse/format rules, and the [mapping data](https://github.com/git-pkgs/platforms/tree/main/data) lives in three JSON files (`arches.json`, `oses.json`, `platforms.json`) that could be consumed by any language without taking a Go dependency. Writing the mapping data has been a good way to discover just how many special cases exist: RubyGems using `arm64` on macOS but `aarch64` on Linux, Rust calling RISC-V `riscv64gc` while everyone else uses `riscv64`, Debian spelling little-endian MIPS as `mipsel` while Go uses `mipsle`.

### Alignment

The same platform identification problem keeps getting solved because the answers don't seem to travel well. Python's manylinux and Ruby's binary gems RFC converge on the same dimensions but use different names, Zig's ABI research seems directly relevant to Rust's target specification work but lives in a different issue tracker, and archspec's microarchitecture DAG could probably inform platform matching beyond Spack but as far as I can tell nobody else uses it.

Even [PURL](https://github.com/package-url/purl-spec), which solved the "which package" identity problem across ecosystems, punts on platform. Each PURL type defines its own qualifiers: `pkg:deb` uses `arch`, `pkg:gem` uses `platform`, `pkg:conda` uses `subdir`, and `pkg:npm` has no platform qualifier at all. The values use whatever conventions each ecosystem already has, with no normalization. There's been [ongoing pressure](https://github.com/package-url/purl-spec/issues/186) from the security community to standardize `arch` and `platform` qualifiers across types so that vulnerability scanners don't need the massive mapping files that tools like `cibuildwheel` currently maintain, but the discussions have been open since 2022 without resolution. The one standard that was supposed to unify package identity across ecosystems left platform identification as an exercise for each type definition.
