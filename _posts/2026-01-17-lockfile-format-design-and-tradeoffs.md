---
layout: post
title: "Lockfile Format Design and Tradeoffs"
date: 2026-01-17 10:00 +0000
description: "Lockfile format tradeoffs, best practices, and a survey of existing formats across package managers."
tags:
  - package-managers
  - deep-dive
---

Lockfiles record which packages were installed, at what versions, from where, with what checksums. Most package managers have one: Gemfile.lock, package-lock.json, Cargo.lock, poetry.lock, pnpm-lock.yaml. (Go splits this across go.mod and go.sum.) They solve the same problem but make different decisions about format, structure, and what to include.[^tradeoffs]

[^tradeoffs]: For broader package manager design decisions beyond lockfiles, see [Package Manager Design Tradeoffs](/2025/12/05/package-manager-tradeoffs).

A good lockfile format optimizes for mergeability, determinism, and external tooling compatibility, even when that means sacrificing compactness or human readability.

Early lockfile formats prioritized getting resolution right over optimizing for version control. npm's nested JSON matched its `node_modules` structure. Bundler's custom format made dependency trees visible. Considerations like merge-friendliness came later, as projects grew and lockfile conflicts became a regular pain point.

## What lockfiles contain

**Package identity.** Name and version, sometimes with namespace or scope.

**Resolved source.** Where the package came from. A registry URL, a git repository, a local path.

**Integrity hash.** A checksum to verify the download matches what was resolved. SHA-256 or SHA-512, though some older formats still use SHA-1.

**Dependencies.** The resolved dependency graph: what each package actually depends on at the pinned versions, not just what the manifest declared. Some formats nest these inline, others list them flat, others (like Go) skip them and rely on re-resolution from the manifest.

**Metadata.** Schema versions, platform constraints, tool versions. Enough context for the package manager to interpret the file correctly.

## Format tradeoffs

**Flat vs nested.** Flat structures merge better. When each package is an independent entry, two developers adding different dependencies don't touch the same lines. Git merges these automatically. Nested structures mirror dependency trees but cascade changes: if two branches update the same transitive dependency, the path to that dependency in the tree differs, causing a conflict even when both branches resolved to the same version.

**JSON vs YAML vs TOML vs custom.** JSON lacks trailing commas, so adding an entry modifies two lines. Deeply nested JSON produces noisy diffs. YAML is more readable but has parsing ambiguities; pnpm avoids this by using a strict subset, but that's discipline most projects won't maintain. TOML allows trailing commas, keeps entries at consistent indentation, and parsers agree on edge cases. Custom line-based formats like `go.sum` diff best of all but can't represent structured metadata.

**Combined vs separated.** Go splits requirements (`go.mod`) from verification (`go.sum`). The lockfile is purely checksums, one line per module. This keeps `go.sum` simple and merge-friendly while `go.mod` handles the more complex constraint information. Most other formats combine everything into one file, which means that file has to do several jobs with competing requirements.

**What to include.** There's a distinction between intrinsic data (what you need to fetch and verify: name, version, source, checksum, dependencies) and extrinsic data (metadata about the package: descriptions, licenses, authors). Lockfiles need the intrinsic data. Beyond that, opinions diverge. Poetry includes descriptions and Python version constraints for every package. uv strips that metadata and stores only what's needed for installation. The more extrinsic metadata you include, the more the lockfile drifts toward being a quasi-SBOM, and the more every change ripples through diffs.[^sbom]

[^sbom]: The line between lockfiles and SBOMs is blurry. See [Could lockfiles just be SBOMs?](/2025/12/23/could-lockfiles-just-be-sboms) for more on this tension.

**Schema versioning.** Bundler records which Bundler version created the file (`BUNDLED WITH`), which causes friction when developers use different versions. npm's `lockfileVersion` tracks format compatibility rather than tool version. Cargo's approach (a version field for schema changes only) causes the least friction.

**Self-contained vs manifest-dependent.** A lockfile (or lockfile pair, in Go's case) should contain enough information to download all dependencies without consulting the manifest. Package names, versions, source URLs, and checksums. If you need both files to fetch, you've split information that belongs together. Go is the deliberate counterexample: `go.mod` pins versions, `go.sum` verifies integrity, and the split works because both files are line-based and merge cleanly.

## What works

1. **Optimize for mergeability over compactness.** A lockfile that causes merge conflicts costs more than a slightly larger one that git handles automatically.

2. **Sort entries deterministically.** By package name, alphabetically. Same input should always produce the same output.

3. **Keep entries independent.** Each package should be its own block that can be added or removed without touching other entries.

4. **Include integrity hashes.** SHA-256 or SHA-512. Store them with the package entry, or in a separate file like `go.sum` if that makes the main file simpler.

5. **Version the schema, not the tool.** A `lockfile_version` field lets you evolve the format. Recording which tool version created the file causes unnecessary friction.

6. **Generate by default.** Go's lockfile gets committed in nearly every project because `go mod tidy` creates it automatically. Gradle's barely gets used because it requires explicit opt-in and configuration. Cargo and npm also generate lockfiles automatically. The single biggest predictor of lockfile adoption is whether the tool creates one without being asked.[^kth]

7. **Design for the common case.** Most lockfile operations are adding or removing dependencies. Optimize the format for clean diffs on those operations.

8. **Make it self-contained for fetching.** Package names, versions, source URLs, and checksums. Everything needed to download without re-resolving.

[^kth]: [The Design Space of Lockfiles Across Package Managers](https://arxiv.org/pdf/2505.04834) studies this across seven ecosystems.

## Existing formats

### go.mod + go.sum ([example](https://github.com/ecosyste-ms/package-manager-manifest-examples/tree/main/golang))

Go splits lockfile duties across two files. `go.mod` pins versions:

```
module example.com/myproject

go 1.21

require (
    github.com/go-check/check v0.0.0-20180628173108-788fd7840127
    github.com/gomodule/redigo v2.0.0+incompatible
)
```

`go.sum` provides integrity verification:

```
github.com/go-check/check v0.0.0-20180628173108-788fd7840127 h1:0gkP6mzaMqkmpcJYCFOLkIBwI7xFExG03bbkOkCvUPI=
github.com/gomodule/redigo v2.0.0+incompatible h1:K/R+8tc58AaqLkqG2Ol3Qk+DR/TlNuhuh457pBFPtt0=
```

As Filippo Valsorda explains, [`go.sum` is not a lockfile](https://words.filippo.io/gosum/) in the traditional sense. `go.mod` handles version pinning (recording exact versions, not ranges, even for indirect dependencies); `go.sum` only stores hashes to verify those versions weren't tampered with. The separation keeps each file simple. Both use line-based formats that merge cleanly. Neither file has a schema version; the `go 1.21` directive specifies language version, not file format.

### Cargo.lock ([example](https://github.com/ecosyste-ms/package-manager-manifest-examples/blob/main/cargo/Cargo.lock))

```toml
version = 3

[[package]]
name = "aho-corasick"
version = "0.7.18"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1e37cfd5e7657ada45f742d6e99ca5788580b5c529dc78faf11ece6dc702656f"
dependencies = ["memchr"]
```

TOML with one `[[package]]` section per dependency. Sorted alphabetically. Schema version at top. Merges well because each package block is independent.

### Gemfile.lock ([example](https://github.com/ecosyste-ms/package-manager-manifest-examples/blob/main/gem/Gemfile.lock))

```
GEM
  remote: https://rubygems.org/
  specs:
    actionmailer (4.2.3)
      actionpack (= 4.2.3)
      mail (~> 2.5, >= 2.5.4)

PLATFORMS
  ruby

DEPENDENCIES
  rails (= 4.2.3)

BUNDLED WITH
   2.4.0
```

Custom format with clear sections. Dependencies indented under their parent, which is readable but structurally hostile to merging (changes ripple through indentation levels). No schema version field; `BUNDLED WITH` records the tool version that generated the file, which causes unnecessary conflicts when developers use different Bundler versions and doesn't help external tooling detect format changes. Checksums were added as an opt-in feature in [Bundler 2.6](https://bundler.io/blog/2024/12/19/bundler-v2-6.html) (December 2024) and remain optional.

### pnpm-lock.yaml ([example](https://github.com/ecosyste-ms/package-manager-manifest-examples/blob/main/npm/pnpm-lock.yaml))

```yaml
lockfileVersion: '6.0'

dependencies:
  chalk: 1.1.3

packages:
  /chalk/1.1.3:
    resolution: {integrity: sha1-qBFcVeSnAv5NFQq9OHKCKn4J/Jg=}
    dependencies:
      ansi-styles: 2.2.1
```

One of the best-designed YAML lockfiles. The [v6 format](https://github.com/pnpm/spec/blob/master/lockfile/6.0.md) was explicitly designed for readability and merge-friendliness, removing hashes from package IDs to improve scannability. The [pnpm team cited merge conflict reduction](https://github.com/pnpm/pnpm/issues/6342) as motivation for the redesign.

### yarn.lock ([example](https://github.com/ecosyste-ms/package-manager-manifest-examples/blob/main/npm/yarn.lock))

```
body-parser@^1.15.2:
  version "1.16.1"
  resolved "https://registry.yarnpkg.com/body-parser/-/body-parser-1.16.1.tgz#51540d045adfa7a0c6995a014bb6b1ed9b802329"
  dependencies:
    bytes "2.4.0"
    content-type "~1.0.2"
```

Yarn v1 used a custom format that looks like YAML but isn't (note the lack of colons after dependency names). No schema version field, making format changes hard to detect. Early versions had no integrity hashes; later versions added them. Yarn Berry (v2+) moved to actual YAML but [changed how checksums are computed](https://github.com/yarnpkg/berry/discussions/6275), breaking external tooling that expected npm-compatible hashes.

### package-lock.json ([example](https://github.com/ecosyste-ms/package-manager-manifest-examples/blob/main/npm/package-lock.json))

```json
{
  "lockfileVersion": 1,
  "dependencies": {
    "chalk": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-1.1.3.tgz",
      "integrity": "sha1-qBFcVeSnAv5NFQq9OHKCKn4J/Jg="
    }
  }
}
```

Nested JSON matching `node_modules` structure. Made sense for reconstructing the install tree but scales poorly for diffs. Lockfile versions 1, 2, and 3 have different structures as npm evolved the format. JSON's lack of trailing commas means every addition modifies at least two lines.

### bun.lock ([example](https://github.com/ecosyste-ms/package-manager-manifest-examples/blob/main/bun/bun.lock))

```jsonc
{
  "lockfileVersion": 1,
  "workspaces": {
    "": {
      "name": "my-project",
      "dependencies": {
        "lodash": "^4.17.21",
      },
    },
  },
  "packages": {
    "lodash": ["lodash@4.17.21", "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz", {}, "sha512-v2kDEe57..."],
  },
}
```

JSONC (JSON with comments and trailing commas) with array-based entries in the `packages` section. Each entry is `[name@version, url, metadata, hash]`. The `workspaces` section records dependency types separately. The positional array encoding is compact but hostile to external tooling: parsers need to know the array indices, and adding fields risks breaking them. Bun also has a binary format (bun.lockb) that abandons human readability entirely; projects using it regenerate on conflicts rather than merging.

### poetry.lock ([example](https://github.com/ecosyste-ms/package-manager-manifest-examples/blob/main/pypi/poetry.lock))

```toml
[[package]]
name = "django"
version = "3.2.25"
description = "A high-level Python Web framework..."
python-versions = ">=3.6"
files = [
    {file = "Django-3.2.25-py3-none-any.whl", hash = "sha256:a52ea7fcf..."},
]

[package.dependencies]
asgiref = ">=3.3.2,<4"
```

TOML with detailed metadata per package. Includes descriptions, Python version constraints, and hashes for every distribution file (wheels and sdists). No schema version field; a comment records which Poetry version generated the file, but comments aren't reliable for tooling to parse. Verbose but handles Python's platform-specific builds.

### uv.lock ([example](https://github.com/ecosyste-ms/package-manager-manifest-examples/blob/main/pypi/uv.lock))

```toml
version = 1
requires-python = ">=3.9"

[[package]]
name = "alabaster"
version = "0.7.16"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/...", hash = "sha256:75a8b99c...", size = 23776 }
wheels = [
    { url = "https://files.pythonhosted.org/...", hash = "sha256:b46733c0...", size = 13511 },
]
```

Leaner TOML than Poetry. Skips descriptions and optional flags. Stores URLs, hashes, and file sizes for both sdists and wheels. uv prioritizes [speed throughout its design](/2025/12/26/how-uv-got-so-fast), and the lockfile reflects that. Python has multiple competing lockfile formats (Poetry, PDM, pip-tools, uv); [PEP 751](https://peps.python.org/pep-0751/) proposes a standard but adoption is uncertain.

## Format comparison

| Format | File format | Integrity | Source URLs | Merge-friendly |
|--------|-------------|-----------|-------------|----------------|
| go.mod + go.sum | Line-based | SHA-256 | Implied | Excellent |
| Cargo.lock | TOML | SHA-256 | Yes | Good |
| Gemfile.lock | Custom | SHA-256 | Registry | Okay |
| pnpm-lock.yaml | YAML | SHA-512 | Registry | Okay |
| poetry.lock | TOML | SHA-256 | Yes | Okay |
| uv.lock | TOML | SHA-256 | Yes | Okay |
| yarn.lock (v1) | Custom | None/SHA-1 | Yes | Okay |
| yarn.lock (Berry) | YAML | SHA-512 (incompatible) | Yes | Okay |
| package-lock.json | JSON | SHA-512 | Yes | Poor |
| bun.lock | JSONC | SHA-512 | Yes | Poor |

## Libraries vs applications

Applications deploy with specific versions, so lockfiles ensure production matches testing. Libraries get consumed by other projects, so their lockfile doesn't follow them to downstream users.

Library maintainers often skip lockfiles, and some ecosystems actively discourage committing them for libraries (the argument: it creates noise, and the pinned versions give false confidence since consumers won't use them anyway). But lockfiles still matter for the library's own CI. A library without a lockfile can have its tests start failing when a transitive dependency releases a bad version, even though nothing in the library changed. The tradeoff is real, but reproducible CI usually wins.

## The determinism alternative

There's a school of thought, associated with Nix, that [lockfiles are a workaround for non-deterministic resolution](http://www.chriswarbo.net/blog/2024-05-17-lock_files_considered_harmful.html). If your resolver always produces the same output for the same inputs, you don't need to cache the result.

Go's minimal version selection moves in this direction. Given the same `go.mod`, the resolver always picks the same versions because it chooses the minimum version satisfying constraints rather than the maximum. The `go.sum` file is then purely for integrity verification, not for pinning resolution. The cost: you don't automatically get bug fixes or security patches in dependencies without explicitly requesting them.

Nix takes this further. Derivations are content-addressed: the hash of all inputs determines the output path. Pin the input hashes and you've pinned the build. Ironically, Nix flakes introduced [`flake.lock`](https://github.com/ecosyste-ms/package-manager-manifest-examples/blob/main/nix/flake.lock) to pin input revisions, which looks a lot like the lockfiles the philosophy argues against. The tradeoff is ecosystem isolation: Nix packages live in their own world, and bridging to standard language tooling adds friction.

The limitation of pure determinism: it assumes inputs stay available. Packages get yanked, registries go down, old things get pruned. Nix can guarantee the same build if you can fetch the same inputs, but it can't conjure deleted packages. Lockfiles with integrity hashes have the same limitation, but they at least let you verify that whatever you did fetch matches what was originally resolved.

## External consumers

Package managers aren't the only tools that parse lockfiles. GitHub's [dependency graph](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph) extracts dependencies from lockfiles to power Dependabot alerts and security advisories. [Dependabot](https://github.com/dependabot) itself parses lockfiles to propose version updates. Security scanners like [Snyk](https://snyk.io/), [Trivy](https://github.com/aquasecurity/trivy), and [Grype](https://github.com/anchore/grype) read lockfiles to check for vulnerable versions. SBOM generators like [sbomify](https://github.com/sbomify/sbomify) convert lockfiles to CycloneDX or SPDX. Research infrastructure and discovery services like [ecosyste.ms](https://ecosyste.ms) and [Libraries.io](https://libraries.io) index lockfiles to map the dependency graph across open source.

These tools need to parse every lockfile format. Each new format means new parser code, new edge cases, new maintenance burden. When Yarn Berry changed its checksum algorithm, external tools that validated integrity hashes broke. When npm moved from lockfileVersion 1 to 2 to 3, parsers had to handle all three. When bun.lock uses positional arrays instead of named fields, parsers become brittle.

Format stability matters more than format elegance. A lockfile format that changes frequently, even if each change improves it, imposes costs on every tool in the ecosystem. Undocumented fields, ambiguous encodings, and breaking changes without version bumps make external parsing fragile.

If you're designing a lockfile format, assume it will be parsed by tools you've never heard of. Use standard formats (TOML, JSON, YAML) over custom grammars. Document the schema. Version it explicitly. Keep field names descriptive. The package manager is just one consumer; the security and research ecosystem is the other.

