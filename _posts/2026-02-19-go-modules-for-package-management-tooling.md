---
layout: post
title: "Go Modules for Package Management Tooling"
date: 2026-02-19
description: "The Go modules behind git-pkgs, rebuilt from my Ruby supply chain libraries."
tags:
  - go
  - sbom
  - package-managers
  - tools
---

I've been working on a reusable layer for building ecosystem-agnostic package and supply chain tools in Go: fourteen modules under [git-pkgs](https://github.com/git-pkgs) covering manifest parsing, registry clients, license normalization, platform translation, vulnerability feeds, and more.

These are rebuilds of libraries I've written and used in Ruby for years, some going back to [Libraries.io](https://libraries.io) and more recently for [Ecosyste.ms](https://ecosyste.ms), which I wrote about [previously](/2025/12/14/supply-chain-security-tools-for-ruby). I built the Go versions for [git-pkgs](/2026/01/24/rewriting-git-pkgs-in-go), a tool for exploring the dependency history of your repositories that [compiles to a single binary](/2026/01/24/rewriting-git-pkgs-in-go) with no runtime dependencies, which matters for a git subcommand that needs to just work on any machine. When I went looking for Go equivalents of my Ruby libraries, most were either abandoned, incomplete, or only covered a single ecosystem, so I rebuilt them.

## Identification

### [purl](https://github.com/git-pkgs/purl)

[Package URL](https://github.com/package-url/purl-spec) (now [ECMA-427](https://ecma-international.org/publications-and-standards/standards/ecma-427/)) is the standard format for identifying packages across ecosystems. This handles parsing, generation, and type-specific configuration for around 40 ecosystems, including registry URL generation and the reverse: parsing a registry URL back into a PURL.

```go
p, _ := purl.Parse("pkg:npm/%40babel/core@7.24.0")
p.FullName()  // "@babel/core"

url, _ := p.RegistryURL()  // "https://www.npmjs.com/package/@babel/core"

// Reverse lookup
p, _ = purl.ParseRegistryURL("https://crates.io/crates/serde")
p.String()  // "pkg:cargo/serde"
```

### [vers](https://github.com/git-pkgs/vers)

[VERS](https://github.com/package-url/vers-spec) is the version range specification that accompanies PURL. Different ecosystems have incompatible range syntaxes: npm uses `^1.2.3`, Ruby uses `~> 1.2`, Maven uses `[1.0,2.0)`. VERS provides one syntax to normalize everything to.

It parses both VERS URIs and native ecosystem syntax, using a mathematical interval model internally to check whether a given version falls within a range:

```go
r, _ := vers.Parse("vers:npm/>=1.0.0|<2.0.0")
r.Contains("1.5.0")  // true

// Native ecosystem syntax works too
r, _ = vers.ParseNative("~> 1.2.3", "gem")
r.Contains("1.2.5")  // true
r.Contains("1.3.0")  // false
```

### [spdx](https://github.com/git-pkgs/spdx)

Package registries are full of informal license strings like "Apache 2", "MIT License", "GPL v3" that need normalizing into valid SPDX identifiers before you can do anything useful with them. This handles that, along with parsing compound expressions with AND/OR operators, checking license compatibility, and categorizing licenses using the scancode-licensedb database (updated weekly).

```go
id, _ := spdx.Normalize("Apache 2")  // "Apache-2.0"

expr, _ := spdx.Parse("Apache 2 OR MIT License")
expr.String()  // "Apache-2.0 OR MIT"

spdx.Satisfies("MIT OR Apache-2.0", []string{"MIT"})  // true
spdx.IsPermissive("MIT")                               // true
spdx.HasCopyleft("MIT OR GPL-3.0-only")                // true
```

### [platforms](https://github.com/git-pkgs/platforms)

I wrote about [platform string fragmentation](/2026/02/17/platform-strings) recently: Go uses `darwin/arm64`, Node uses `darwin-arm64`, Rust uses `aarch64-apple-darwin`, RubyGems uses `arm64-darwin`, all for the same chip on the same OS. This translates between 14 ecosystems through a canonical intermediate representation:

```go
p, _ := platforms.Parse(platforms.Go, "darwin/arm64")
// p.Arch == "aarch64", p.OS == "darwin"

s, _ := platforms.Format(platforms.Rust, p)
// "aarch64-apple-darwin"

// Or translate directly
s, _ = platforms.Translate(platforms.Go, platforms.RubyGems, "darwin/arm64")
// "arm64-darwin"
```

## Data sources

### [registries](https://github.com/git-pkgs/registries)

Talks to 25 package registry APIs (npm, PyPI, Cargo, RubyGems, Maven, NuGet, Hex, Pub, CocoaPods, Homebrew, and more) and returns normalized package information including versions, dependencies, maintainers, and licenses. Works a lot like the internals of [packages.ecosyste.ms](https://packages.ecosyste.ms), taking PURLs as input so you don't need to know the quirks of each registry's API.

```go
import (
    "github.com/git-pkgs/registries"
    _ "github.com/git-pkgs/registries/all"
)

pkg, _ := registries.FetchPackageFromPURL(ctx, "pkg:cargo/serde", nil)
fmt.Println(pkg.Repository)  // "https://github.com/serde-rs/serde"
fmt.Println(pkg.Licenses)    // "MIT OR Apache-2.0"

// Bulk fetch with parallel requests
packages := registries.BulkFetchPackages(ctx, []string{
    "pkg:npm/lodash@4.17.21",
    "pkg:cargo/serde@1.0.0",
    "pkg:pypi/requests@2.31.0",
}, nil)
```

Private registries work through PURL qualifiers, and rate-limited APIs get automatic retries with exponential backoff.

### [forges](https://github.com/git-pkgs/forges)

Fetches repository metadata from GitHub, GitLab, Gitea, Forgejo, and Bitbucket, normalizing it into a common structure similar to how [repos.ecosyste.ms](https://repos.ecosyste.ms) works under the hood. Point it at a self-hosted domain and it'll probe the API to figure out which forge software is running:

```go
client := forges.NewClient(
    forges.WithToken("github.com", os.Getenv("GITHUB_TOKEN")),
)

repo, _ := client.FetchRepository(ctx, "https://github.com/octocat/hello-world")
repo.License          // "MIT"
repo.StargazersCount  // 12345

// Auto-detect forge type for self-hosted instances
client.RegisterDomain(ctx, "git.example.com", token)
```

### [enrichment](https://github.com/git-pkgs/enrichment)

Where `registries` talks to one registry at a time, `enrichment` routes requests across four data sources: [ecosyste.ms](https://ecosyste.ms), [deps.dev](https://deps.dev), [OpenSSF Scorecard](https://securityscorecards.dev), and direct registry queries via the `registries` module. PURLs with a `repository_url` qualifier go directly to custom registries, others go through ecosyste.ms or deps.dev, and each result records which source it came from.

```go
client, _ := enrichment.NewClient()

results, _ := client.BulkLookup(ctx, []string{
    "pkg:npm/lodash",
    "pkg:pypi/requests",
})

info := results["pkg:npm/lodash"]
fmt.Println(info.LatestVersion)  // "4.17.21"
fmt.Println(info.License)        // "MIT"
fmt.Println(info.Source)         // "ecosystems", "registries", or "depsdev"

// Scorecard is a separate client for repo-level security scores
sc := scorecard.New()
result, _ := sc.GetScore(ctx, "github.com/lodash/lodash")
fmt.Println(result.Score)  // 6.8
```

### [vulns](https://github.com/git-pkgs/vulns)

Seven vulnerability data sources behind one interface: [OSV](https://osv.dev), [deps.dev](https://deps.dev), [GitHub Security Advisories](https://github.com/advisories), [NVD](https://nvd.nist.gov), [Grype](https://github.com/anchore/grype), [VulnCheck](https://vulncheck.com), and [Vulnerability-Lookup](https://vulnerability.circl.lu). Results are normalized to OSV format with built-in CVSS parsing for v2.0 through v4.0:

```go
source := osv.New()

results, _ := source.Query(ctx, purl.MakePURL("npm", "lodash", "4.17.20"))
for _, v := range results {
    fmt.Printf("%s: %s (severity: %s)\n", v.ID, v.Summary, v.SeverityLevel())
    if fixed := v.FixedVersion("npm", "lodash"); fixed != "" {
        fmt.Printf("  Fixed in: %s\n", fixed)
    }
}
```

All sources support batch queries, with limits ranging from 1,000 to 5,000 packages per request depending on the source.

## File handling

### [manifests](https://github.com/git-pkgs/manifests)

Parses manifest and lockfiles across 40+ ecosystems, auto-detecting file types and extracting dependencies with version constraints, scopes, integrity hashes, and PURLs. It distinguishes between manifests (declared dependencies), lockfiles (resolved versions), and supplements (extra metadata).

```go
content, _ := os.ReadFile("package.json")
result, _ := manifests.Parse("package.json", content)

fmt.Println(result.Ecosystem)  // "npm"
fmt.Println(result.Kind)       // "manifest"
for _, dep := range result.Dependencies {
    fmt.Printf("%s@%s (%s)\n", dep.Name, dep.Version, dep.Scope)
}
```

Supported formats range from the obvious (package.json, Gemfile.lock, go.mod) to the less common (APKBUILD, PKGBUILD, .rockspec, dub.sdl). Each dependency includes its name, version constraint, scope (runtime, development, test, build, optional), integrity hash when available, and whether it's a direct or transitive dependency.

### [resolve](https://github.com/git-pkgs/resolve)

Where `manifests` parses static files, `resolve` parses the runtime output of package manager CLI commands (`npm ls --json`, `go mod graph`, `uv tree`, etc.) into a normalized dependency graph with PURLs. It supports 24+ managers and preserves tree structure when the manager provides it:

```go
import (
    "github.com/git-pkgs/resolve"
    _ "github.com/git-pkgs/resolve/parsers"
)

output, _ := exec.Command("npm", "ls", "--json", "--long").Output()
result, _ := resolve.Parse("npm", output)

for _, dep := range result.Direct {
    fmt.Printf("%s@%s (%s)\n", dep.Name, dep.Version, dep.PURL)
    for _, transitive := range dep.Deps {
        fmt.Printf("  %s@%s\n", transitive.Name, transitive.Version)
    }
}
```

### [archives](https://github.com/git-pkgs/archives)

Reads and browses archive files entirely in memory, with a unified Reader interface across ZIP, tar (with gzip, bzip2, xz compression), jar, wheel, nupkg, egg, and Ruby gems. Includes prefix stripping for packages that wrap content in a directory (like npm's `package/` wrapper). No [OCI support](/2026/02/18/what-package-registries-could-borrow-from-oci) yet, but pulling and browsing image layers through the same Reader interface is on the list.

```go
reader, _ := archives.Open("package.tar.gz", f)
defer reader.Close()

files, _ := reader.List()
for _, fi := range files {
    fmt.Println(fi.Path, fi.Size)
}

rc, _ := reader.Extract("README.md")
defer rc.Close()
```

### [changelog](https://github.com/git-pkgs/changelog)

Parses changelog files into structured entries, auto-detecting [Keep a Changelog](https://keepachangelog.com), markdown header, and setext/underline formats. You can supply custom regex patterns for non-standard formats, and there's a finder that searches for common changelog filenames in a directory:

```go
p, _ := changelog.FindAndParse(".")

for _, v := range p.Versions() {
    entry, _ := p.Entry(v)
    fmt.Printf("%s (%v): %s\n", v, entry.Date, entry.Content)
}

// Content between two versions, like Dependabot uses
content, _ := p.Between("1.0.0", "2.0.0")
```

### [gitignore](https://github.com/git-pkgs/gitignore)

Matches paths against [gitignore rules](/2026/02/12/the-many-flavors-of-ignore-files) using a direct implementation of git's wildmatch algorithm rather than converting patterns to regexes, tested against git's own wildmatch test suite. Handles nested `.gitignore` files scoped to their directories, global excludes, negation patterns, and all 12 POSIX character classes:

```go
m := gitignore.NewFromDirectory("/path/to/repo")

m.Match("vendor/lib.go")  // true if matched

r := m.MatchDetail("app.log")
if r.Matched {
    fmt.Printf("ignored by %s (line %d of %s)\n", r.Pattern, r.Line, r.Source)
}

// Walk a directory, skipping ignored entries
gitignore.Walk("/path/to/repo", func(path string, d fs.DirEntry) error {
    fmt.Println(path)
    return nil
})
```

## Tooling

### [managers](https://github.com/git-pkgs/managers)

Wraps 34 package manager CLIs behind a common interface where you describe what you want (add a dependency, list installed packages, update) and get the correct CLI invocation back. Package managers are defined in YAML files, so adding a new one doesn't require code changes:

```go
translator := managers.NewTranslator()

cmd, _ := translator.BuildCommand("npm", "add", managers.CommandInput{
    Args:  map[string]string{"package": "lodash"},
    Flags: map[string]any{"dev": true},
})
// ["npm", "install", "lodash", "--save-dev"]

cmd, _ = translator.BuildCommand("bundler", "add", managers.CommandInput{
    Args:  map[string]string{"package": "rails"},
    Flags: map[string]any{"dev": true},
})
// ["bundle", "add", "rails", "--group", "development"]
```

The command definitions started as data from the [package manager command crosswalk](https://github.com/ecosyste-ms/package-manager-commands) I built for Ecosyste.ms. Because it can drive any package manager agnostically, it opens up some interesting possibilities: setting up GitHub Actions workflows that work regardless of ecosystem, installing dependencies in git hooks without hardcoding the manager, or building tools like Dependabot that operate across all 34 managers with the same code. There's an [example Dependabot-style workflow](https://github.com/git-pkgs/managers) in the repo.

It can auto-detect which manager is in use from lockfiles or manifests, and has a pluggable policy system that runs checks before commands execute: a `PackageBlocklistPolicy` prevents installing known-bad packages, and you can write your own to enforce license compliance, restrict registries, or gate operations behind approval.

---

PURLs act as the common identifier across all of these, which is what makes them composable. You might parse a lockfile with `manifests` to get a list of dependencies as PURLs, enrich them with `registries` to pull in license and repository metadata, check them against `vulns` for known vulnerabilities, and normalize their license strings with `spdx` for compliance reporting. Four modules, no translation layer between them.

All the modules are MIT licensed and available under the [git-pkgs org](https://github.com/git-pkgs).
