---
layout: post
title: "The C-Shaped Hole in Package Management"
date: 2026-01-27 10:00 +0000
description: "System package managers and language package managers are solving different problems that happen to overlap in the middle."
tags:
  - package-managers
  - deep-dive
---

System package managers and language package managers are both called package managers. They both resolve dependencies, download code, and install software. But they evolved to solve different problems, and the overlap is where all the friction lives. If you drew a venn diagram, C libraries would sit right in the middle: needed by language packages, provided by system packages, understood by neither in a way the other can use. As Kristoffer Grönlund [put it in 2017](https://lwn.net/Articles/712318/): "Why are we trying to manage packages from one package manager with a different package manager?"

apt, dnf, pacman, and the rest emerged because Linux distributions had to [assemble a coherent system from parts built independently by different groups](https://utcc.utoronto.ca/~cks/space/blog/unix/PackagingHistory). Nobody was writing all the pieces. The kernel came from one place, libc from another, coreutils from another. Packaging systems were the glue that made this work, tracking what was installed and what depended on what. Decomposing things into shared libraries and managing security updates came later. A package like `python3-requests` isn't there because the Python ecosystem wanted it. It's there because some GUI application or system tool needed it, and the distro maintainers packaged it.

System package managers generally keep only one version of each package at a time. This massively simplifies dependency resolution, but it means getting a newer or older version is hard for individual users without upgrading the whole system. It's a stop-the-world model. Hacks like naming packages `python3` and `python2` exist to work around this when you really need multiple versions, but they're exceptions.

npm, pip, cargo, and gem went the other direction. They're dependency assembly tools that help developers build projects. They keep every version around indefinitely, letting projects pin exactly what they need. They're also cross-platform by design: pip doesn't know if it's running on Debian or Fedora or macOS, so it can't just shell out to the system package manager to install C dependencies even if it wanted to. The fact that you can `pip install httpie` and get a working command-line tool is a side effect, not the purpose. These tools exist so you can declare `requests>=2.28` in a manifest and get a working dependency tree.

The difference shows up in how they handle the same library. A distro maintainer sees a new OpenSSL release and asks: will this break existing applications? Can we backport security fixes without changing behavior? A language package manager asks: does this satisfy version constraints? Can multiple versions coexist? When you need both, the seams show.

Edward Yang [wrote about this in 2014](https://blog.ezyang.com/2014/08/the-fundamental-problem-of-programming-language-package-management/): "The different communities don't talk to each other." They don't need to, most of the time. But language packages that wrap C libraries have to deal with C dependencies somehow, and that's system package manager territory. The language package manager has no vocabulary for it.

### The C-shaped hole

C never developed a canonical package registry. It predates the model of "download dependencies from the internet," and by the time that model became standard, the ecosystem was too fragmented to converge. pkg-config exists as a partial vocabulary for discovering installed libraries, but it's a query mechanism for what's already on your system, not a way to declare or fetch dependencies. [Conan](https://conan.io/) and [vcpkg](https://vcpkg.io/) exist now and are actively maintained, but neither has the cultural ubiquity of crates.io or npm. There's no default answer to "how do I depend on libcurl" the way there is for "how do I depend on serde."

System package managers filled this gap by default. If you need libcurl or OpenSSL or zlib, you install them through apt or dnf or brew. This makes your system package manager the de facto C package manager whether it was designed for that or not. And every distro names packages differently: libssl-dev on Debian, openssl-devel on Fedora, openssl on Alpine, openssl@3 on Homebrew. Same library, four names, no mapping between them.

Every language that needs C bindings solves distribution independently. Python has wheels that bundle compiled extensions. Node has node-gyp that compiles against system headers at install time. Rust has build.rs scripts that call pkg-config. Go has cgo with its own linking story. Ruby has native extensions that compile on `gem install`.

None of these mechanisms really declare C dependencies in a machine-readable way. If your Python package needs libffi, that requirement lives in a README or a Dockerfile or maybe just tribal knowledge. There's no field in pyproject.toml that says "requires libffi >= 3.4" in a way that pip can act on. [PEP 725](https://peps.python.org/pep-0725/) proposes adding exactly this, but it's been in draft since 2023.

You end up with two dependency graphs that overlap on C libraries but can't communicate. pip knows your Python dependencies. apt knows your system dependencies. Neither knows what the other is doing, and the place where they meet is held together by humans who know which system packages to install before running pip install. Or the language package just bundles the C library inside itself: Nokogiri ships libxml2, NumPy ships OpenBLAS, and the system package manager never sees them.

Rust is starting to create a similar gap. Python packages that wrap Rust libraries need cargo available at build time, and the Rust dependencies don't appear in Python's dependency metadata. It's not as messy as C: cargo handles its own resolution cleanly, and there's no equivalent of the header/library version mismatch problem. But the cross-language boundary is structurally the same: two dependency graphs that can't see each other.

Containers solved the deployment side of this. As I [wrote previously](/2025/12/18/docker-is-the-lockfile-for-system-packages.html), Docker acts as the lockfile that system package managers never provided. Build an image and every machine running it gets identical bytes. But containers don't solve the visibility problem. The C dependencies are still invisible to tooling, still not in any manifest that connects to vulnerability scanning or funding flows. The Dockerfile lists apt packages, but nothing maps those to the upstream projects or the language packages that need them. Tools like [Syft](https://github.com/anchore/syft) crawl container filesystems looking for known binaries and package manifests in well-known locations. It's a blunt instrument because it has to be: the metadata doesn't exist, so Syft reconstructs what it can from filesystem heuristics.

### Phantom dependencies

Endor Labs coined the term "phantom dependencies" for this: dependencies bundled into packages but not represented in metadata. Vlad Harbuz covers [how binary dependencies actually work](https://vlad.website/how-binary-dependencies-work) at the technical level. Seth Larson, Security Developer-in-Residence at the Python Software Foundation, has been [working on solutions](https://www.youtube.com/watch?v=zIE8QW4vx2A) involving standards and tooling.

NumPy depends heavily on OpenBLAS, but that dependency doesn't appear in its package metadata. The wheel bundles a compiled libopenblas.so.0 inside the package, invisible to pip and invisible to any tool that only looks at Python dependency information. If you want to know what NumPy actually depends on, you need tools like `nm` or `readelf` to inspect the binary symbols. The [pypackaging-native](https://pypackaging-native.github.io/key-issues/native-dependencies/) project documents this problem thoroughly: "The key problems are (1) not being able to express dependencies in metadata, and (2) the design of Python packaging and the wheel spec forcing vendoring dependencies."

### The middle ground

[Conda](https://docs.conda.io/) is probably the most successful attempt at bridging these worlds. It packages C libraries, Python, R, and other languages in a single dependency graph. You can declare dependencies on both libcurl and requests (or libcurl and an R package), and Conda understands what that means.

This took off in scientific Python, where C dependencies are a nightmare. NumPy linking against BLAS, SciPy needing LAPACK, HDF5 bindings for data science work. These projects have complex native codebases that are painful to compile from source and need careful matching between Python wrappers and underlying C libraries. Conda packages all of this with proper metadata and version constraints.

But Conda never became universal. Part of the reason is that it bundles the hard problem (managing C dependencies) with a less compelling solution for the easy problem (pure Python packages). If you don't need compiled extensions, Conda is more than you need. And even when you do need it, conda environments are heavier than virtual environments and the resolver used to be infamously slow. Mamba exists largely because conda's dependency resolution took forever on nontrivial environments.

[Spack](https://spack.io/) and [EasyBuild](https://easybuild.io/) occupy similar territory but for HPC, where you need fine-grained control over compiler flags, MPI implementations, and hardware-specific optimizations. Spack in particular has an exceptionally sophisticated dependency model, versioning compilers at various points in the dependency chain and recording everything involved in a build for reproducibility. It's impressive engineering, but the complexity is justified by use cases most developers never encounter.

[Nix](https://nixos.org/) and [Guix](https://guix.gnu.org/) come at it another way, with content-addressed storage and reproducibility as core design goals. They're still system package managers, still delivering applications, but they have a better model for mapping language packages into that world. They repackage what's on PyPI and npm, expressing C dependencies alongside Python ones in a single dependency graph. There's a large community keeping these mappings current, encoding which Python and npm packages depend on which system libraries. It works, but it's still one system absorbing the other rather than the two talking to each other, and the mappings live in nixpkgs, not in the upstream package metadata where other tools could use them.

### Making the invisible visible

Today the gap gets filled by humans. You run pip install, hit a compilation error about missing headers, google which apt package provides them. Dockerfiles accumulate RUN apt-get install lines that encode this knowledge.

Vlad and I have been [investigating how to automate this](https://github.com/ecosyste-ms/packages/issues/1261) through ecosyste.ms: mine symbols from binaries across ecosystems, build an index that maps symbols to system libraries to upstream projects.

Tools like `nm`, `objdump`, and `readelf` can list the symbols a library exports. Run this across apt, apk, rpm, and Homebrew packages, and you get a database: the symbol `SSL_connect` comes from libssl, packaged as libssl3 in Debian and openssl in Alpine and openssl@3 in Homebrew. Do the same for wheels and gems and native Node modules, recording which symbols are undefined and which libraries are bundled inside the package. Then cross-reference: when a wheel has an undefined symbol, the database tells you which system library provides it. When a wheel bundles a library, you can identify the upstream project and version.

The output might look like: numpy@1.26.0 (PyPI) depends on libopenblas.so.0 (bundled), which is OpenBLAS 0.3.21 upstream, packaged as libopenblas0 in apt, openblas in apk, openblas in rpm, and openblas in brew. Ultimately I want to index these links into [ecosyste.ms](https://ecosyste.ms/) alongside the regular dependency data, so the cross-ecosystem connections become queryable like any other dependency.

The motivation here is sustainability. Vlad works on the [Open Source Pledge](https://opensourcepledge.com/), which asks companies to pay maintainers of their dependencies. But dependencies on system libraries aren't surfaced anywhere, which means they're invisible to funding. NumPy depends heavily on OpenBLAS, but that relationship doesn't show up when someone sponsors NumPy or analyzes its dependency tree. The OpenBLAS maintainers don't get credit for the work that makes NumPy fast. Tracing these connections across package managers and languages is the first step toward fixing that. If [software citation](https://force11.org/info/software-citation-principles-published-2016/) takes off in academia, the same problem applies: papers citing NumPy should propagate credit to BLAS, but only if we can trace the dependency.

The same data has security applications. If a C library has a CVE, nobody can currently tell which wheels or npm packages or gems bundle an affected version. Vulnerability scanners look at language package metadata and see nothing. With a symbol database, you could trace from CVE to upstream library to every package that vendors it, across ecosystems. It also makes SBOMs more accurate: right now, generating an SBOM for a project misses all the C libraries bundled inside packages.

Vlad is presenting this at [FOSDEM 2026](https://fosdem.org/2026/schedule/track/package-management/) in the Package Management devroom, which I'm co-organizing.

I'm not proposing solutions here, it's a [wicked problem](/2026/01/23/package-management-is-a-wicked-problem.html). The point is that any serious attempt at [a protocol for package management](/2026/01/22/a-protocol-for-package-management.html) needs to grapple with this. Cross-ecosystem dependencies aren't an edge case; they're everywhere, just invisible. Making these implicit dependencies first-class is the missing layer between the two worlds, and it needs to be part of the conversation when that protocol gets investigated further.
