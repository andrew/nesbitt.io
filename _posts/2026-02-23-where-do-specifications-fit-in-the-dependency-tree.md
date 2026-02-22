---
layout: post
title: "Where Do Specifications Fit in the Dependency Tree?"
date: 2026-02-23
description: "RFC 9110 is a phantom dependency with thousands of transitive dependents."
tags:
  - package-managers
  - dependencies
  - deep-dive
---

Your Ruby gem declares `required_ruby_version >= 3.0`. That constraint references the Ruby 3.0 language specification, expressed through the implementation version, checked against whichever runtime happens to be running, with no distinction between MRI and JRuby, and no connection to the specification document that defines what Ruby 3.0 even is.

Runtimes at least show up somewhere in the tooling. Your HTTP library also depends on RFC 9110, your JSON parser on ECMA-404, your TLS implementation on RFC 8446, and none of those appear in any manifest, lockfile, or SBOM.

Library dependencies get the full treatment: manifests declare them, lockfiles pin them, SBOMs track them, scanners check them for vulnerabilities. Runtime versions sit one layer down, handled differently by every ecosystem. Python has `Requires-Python` in package metadata, enforced by pip but ignored by trove classifiers that may disagree with it. Ruby has `required_ruby_version` in the gemspec, enforced by both RubyGems and Bundler. Node.js has the `engines` field in package.json, advisory by default in npm unless you flip a config flag. Go's `go` directive in go.mod was advisory until Go 1.21, when it flipped to a hard minimum in a single release and started auto-downloading the required toolchain if yours is too old.

Developers keep inventing new layers because none of these are reliable enough on their own. A Ruby project might have `required_ruby_version >= 3.0` in the gemspec, `ruby "3.2.2"` in the Gemfile, and `ruby 3.2.2` in `.tool-versions` for asdf or mise. That's the same dependency declared in three places with three enforcement mechanisms, and they can disagree. The `.tool-versions` file exists because the gemspec constraint is too loose and the Gemfile directive doesn't control which binary is on your PATH.

Runtime implementation is barely tracked at all. JRuby 9.4 reports `RUBY_VERSION` as `"3.1.0"`, so a gem requiring `>= 3.0` passes. If the gem has a C extension, it fails at build time because JRuby can't run C extensions, and the gemspec has no way to express that it needs MRI specifically. .NET is the only ecosystem that formally addressed this with .NET Standard, a versioned API surface that works across .NET Framework, .NET Core, Mono, and Xamarin, essentially a spec for the spec implementations.

And below all of this sit the specifications themselves, language definitions and protocol standards and encoding rules, none of which appear in any dependency graph.

### Spack

Spack, the HPC package manager, spent seven years learning what happens when you leave a dependency implicit.

Before Spack v1.0, compilers were a special "node attribute" rather than actual nodes in the dependency graph. You configured them in `compilers.yaml` as external tools. Every package carried a compiler annotation, but compilers weren't dependencies in any meaningful sense.

Compiler runtime libraries like `gcc-runtime` (libgcc, libstdc++) were invisible. If you needed clang for C but gfortran for Fortran, the monolithic compiler attribute couldn't express that. Build tools like cmake inherited the same exotic compiler as your main software even when they could have used a standard one. And if a Fortran compiler was missing, you'd find out deep in the dependency tree at build time rather than upfront during resolution.

The idea to fix this was [filed in 2016](https://github.com/spack/spack/issues/896). The motivation came from a debugging story: a sysadmin installed a large dependency graph, gfortran was missing, openmpi built without Fortran support, and then hypre failed much later. If packages declared language dependencies, resolution itself would have caught the missing compiler before anything started building.

It took until March 2025 for [PR #45189](https://github.com/spack/spack/pull/45189) ("Turn compilers into nodes") to merge. In Spack v1.0, languages like `c`, `cxx`, and `fortran` are virtual packages. Compilers are providers of those virtuals. A package declares `depends_on("c")` and `depends_on("cxx")`, and the resolver finds a compiler that satisfies both. The DAG now shows gcc injecting `gcc-runtime` as a visible runtime dependency, and the compiler wrapper is an explicit node included in the hash. The whole journey spanned dozens of intermediate issues, a [FOSDEM 2018 talk](https://archive.fosdem.org/2018/schedule/event/spack/), and a complete rethinking of how Spack's concretizer works.

Nix has always treated the compiler as a hashed dependency. Every derivation gets its build tools through `stdenv`, and the compiler toolchain is a content-addressed derivation like anything else. Bazel does something similar with hermetic toolchains. conda-forge uses `{{ compiler('c') }}` in recipe metadata, which expands to platform-specific compiler packages. But even Nix stops at the same boundary, with the runtime, compiler, and glibc as content-addressed nodes while the specifications those tools implement remain outside the graph entirely.

### Spec transitions

When Chrome and Firefox enabled TLS 1.3 for testing in February 2017, failure rates were unexpectedly high. Chrome-to-Gmail connections succeeded 98.3% of the time with TLS 1.2 but only 92.3% with TLS 1.3. The culprit was middleboxes: corporate proxies and firewalls that had hardcoded expectations about TLS handshake fields. The TLS spec always allowed those fields to change, but because they had been stable for so long, middlebox developers treated them as constants.

TLS 1.3 now lies about its own version. The ClientHello claims to be TLS 1.2, includes dummy session_id and ChangeCipherSpec fields that TLS 1.3 doesn't need, and uses a `supported_versions` extension to negotiate the real protocol. Separately, GREASE (Generate Random Extensions And Sustain Extensibility, RFC 8701) has implementations advertise reserved IANA values for cipher suites, extensions, and other fields, training middleboxes to tolerate unknown values rather than ossifying around a fixed set. A spec had to disguise itself as an older version of itself because the ecosystem had ossified around implicit assumptions about the previous version.

Unicode releases new versions roughly annually, and each version can change character properties for existing characters, not just add new ones. When Chrome updated its ICU data, the wrestler and handshake emoji lost their `Emoji_Base` classification, causing emoji with skin tone modifiers to visually split into a base character and an orphaned modifier. Most software has no way to declare "I depend on Unicode 14.0 character properties." The Unicode version is baked into whatever runtime you happen to be using, and it changes when you update your JDK or system ICU library. Breakage happens not because developers chose to upgrade the spec, but because they upgraded something else and the spec came along for the ride.

PyPI classifiers let packages declare `Programming Language :: Python :: 3`, and Brett Cannon built `caniusepython3` to analyze dependency trees and report which packages blocked the Python 2 to 3 migration. But classifiers were optional and often wrong. If `python_requires` had been mandatory and machine-enforced from the start, pip could have refused to install incompatible packages automatically. The [Python 3 Wall of Shame](https://python3wos.appspot.com/), launched in February 2011, showed only 9% of the top 200 packages supporting Python 3 more than two years after its release. Guido van Rossum later called the transition a mistake, not because Python 3 was wrong, but because the core team underestimated how much Python 2 code existed.

CommonJS and ES Modules in Node.js are two incompatible module specs: ESM can import CJS, but CJS cannot `require()` ESM because ESM loads asynchronously and supports top-level `await`. If package.json had required declaring module system compatibility from the start, npm could have flagged incompatibilities at install time instead of leaving developers to discover them at runtime.

SMTP's transition to ESMTP negotiates at the protocol level: clients send `EHLO` instead of `HELO`, and if the server doesn't understand it, they fall back. The server's response lists supported extensions, essentially runtime dependency resolution for protocol capabilities. HTTP/1.1 to HTTP/2 used similar ALPN negotiation.

### Executable specs

Web Platform Tests has over 56,000 tests and 1.8 million subtests, each mapped to a specific section of a W3C or WHATWG specification. The [WPT Dashboard](https://wpt.fyi/about) shows which browser engines pass which tests. TC39's Test262 does the same for ECMAScript. When a browser team says "we implement CSS Grid Level 1," what they mean in practice is that they pass a specific set of WPT tests.

These test suites are closer to something you could declare as a dependency than any prose RFC. They're versioned, concrete artifacts with commit hashes. If you wanted a PURL-like identifier for spec dependencies, the test suite version might be more useful than the spec document version: `pkg:spec/w3c/wpt-css-grid@sha256:abc123` pins actual behavior, while `pkg:spec/w3c/css-grid@level-1` pins intent. They don't always agree, and they don't always change at the same time. A browser can pass all current WPT tests for a spec while the spec itself is still being revised, or a spec can be finalized while the test suite lags behind.

Most specs have no conformance suite at all, though. IETF RFCs rarely ship with official tests. Where tests exist, they tend to emerge from interoperability testing during standardization and then go unmaintained. The dependency chain for most software is still `package -> implementation -> implicit understanding of a prose document`, with no machine-readable contract in between.

TypeScript's DefinitelyTyped ecosystem already does something like this for runtime APIs. `@types/node` describes what the Node.js runtime provides as a versioned npm package with its own semver, tracked in lockfiles and resolved by the same dependency machinery as any other package, but it declares the shape of an API without providing it. They version independently from the runtime they describe, so `@types/node@20` might not match the actual Node 20 API surface perfectly, and the mismatch only surfaces when someone notices. Developers voluntarily create and maintain these artifacts because the tooling rewards it, which suggests the main barrier to spec-as-a-package isn't willingness but infrastructure.

### De facto specifications

Not all specifications live in standards bodies. Node.js module resolution has no formal spec; it's defined by Node's behavior, and anything that resolves modules the same way is depending on that behavior whether or not anyone writes it down.

Oracle donated Java EE to the Eclipse Foundation but retained the Java trademark, which prevented the Eclipse Foundation from modifying the `javax` namespace. The compromise was renaming every package from `javax.*` to `jakarta.*` in Jakarta EE 9, keeping the APIs identical under different names. Every application, library, and framework that imported `javax.servlet` or `javax.persistence` broke. Tools like OpenRewrite automated the rename, but it remains one of the most disruptive compatibility events in Java's history, caused entirely by a trademark dispute rather than any technical change. If Java EE's spec dependency had been an explicit, versioned node in the graph, the scope of the breakage would at least have been visible before the rename happened.

### Spec-to-spec dependencies

Specifications have their own dependency graphs. JSON relies on UTF-8 and through it on Unicode. HTTP sits on TLS, which sits on X.509 and ASN.1, so a breaking change to ASN.1 encoding would ripple through TLS implementations into HTTP libraries and from there into everything that makes network requests. CSS Grid builds on the Box Model and Visual Formatting contexts.

The [rfcdeps](https://github.com/raybellis/rfcdeps) tool graphs these relationships by parsing the "obsoletes" and "updates" headers from the RFC Editor's XML index, but it has no way to connect the spec graph to the software dependency graph, and as far as I know nobody has tried.

### Existing pieces

[SPDX 3.0](https://spdx.github.io/spdx-spec/v3.0.1/) includes a `hasSpecification` relationship type linking software elements to specifications, with an [open issue](https://github.com/spdx/spdx-3-model/issues/958) for the inverse `hasImplementation` that the maintainers have resisted. [CycloneDX 1.6](https://cyclonedx.org/) introduced "definitions" for standards and "declarations" for conformance attestation; security standards like OWASP ASVS are already available in CycloneDX format, and the data model could express spec dependencies more broadly.

No package manager reads any of this, and no SBOM generator populates it automatically, so the data model exists but the pipeline doesn't.

### Naming

[Package management is naming](/2026/02/14/package-management-namespaces.html), and the naming problem for specifications is worse than for packages.

The IETF uses sequential numbers where a new version of a spec gets a new number entirely. RFC 9110 obsoletes RFC 7231, which obsoleted RFC 2616. If you want to reference "HTTP semantics," you need to pick which RFC number, and that choice encodes a point in time rather than a version range. W3C uses levels for CSS (CSS Grid Level 1, Level 2), numbered versions for older specs (HTML 4.01), and maturity stages (Working Draft, Candidate Recommendation, Recommendation). WHATWG abandoned versioning entirely; HTML is a "Living Standard" with no version number and no snapshots. ECMA uses both edition numbers and year names (ECMA-262 6th Edition is also ES2015). ISO uses structured identifiers with amendment and corrigenda layers (`ISO/IEC 5962:2021`). IEEE uses base number plus year (IEEE 754-2019).

An Internet-Draft ([draft-claise-semver-02](https://datatracker.ietf.org/doc/html/draft-claise-semver-02)) proposed applying semver to IETF specifications, giving RFCs the same kind of machine-comparable version identifiers that packages use, but it expired without adoption. The barriers weren't really technical; standards bodies have versioned things their own way for decades, and the conventions are embedded in their tooling, citation practices, and organizational processes. Getting the IETF, W3C, WHATWG, ECMA, ISO, and IEEE to agree on a common versioning scheme is a harder coordination problem than getting package managers to agree on lockfile formats.

If you wanted a PURL-like scheme for specifications, something like `pkg:spec/ietf/rfc9110@2022`, you'd need to normalize across all of these conventions. PURL already handles per-ecosystem naming differences for packages, so the approach isn't unprecedented, but someone would need to define the type mappings and get buy-in from communities that see no reason to change. PURL itself is now a spec (ECMA-427), so the identifier scheme for tracking spec dependencies would itself be a spec dependency that needs tracking.

Making specs explicit doesn't require solving the whole problem at once. A `spec` field in package metadata, even if it were just a list of RFC numbers or W3C shortnames, would let tooling answer questions that are currently impossible: which packages implement RFC 9110, how many depend on Unicode 15 character properties, which of your dependencies still implement TLS 1.2 and need to migrate. Spec authors, currently invisible in the software supply chain, would get the same transitive-dependent counts that help make the case for funding open source libraries. The Sovereign Tech Agency funds protocol implementations like curl and OpenSSL and is [starting to explore](https://bsky.app/profile/sovereign.tech/post/3menmziyjy225) supporting standards work directly, but nobody can yet point to a number and say this RFC has 400,000 transitive dependents.
