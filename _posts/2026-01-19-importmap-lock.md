---
layout: post
title: "importmap.lock: a lockfile for the web"
date: 2026-01-19 10:00 +0000
description: "Extending import maps with package metadata to improve dependency management and security for browser-native JavaScript."
tags:
  - package-managers
  - javascript
  - importmap
---

The web is the only major software platform without a native dependency manifest. The web runs on URLs and runtime resolution; npm runs on filesystems and build steps. Bundlers have been papering over that mismatch for a decade. Lea Verou's [recent post on web dependencies](https://lea.verou.me/blog/2026/web-deps/) nerd sniped me.

There's a security angle too. The [EU Cyber Resilience Act](https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act) and [US Executive Order 14028](https://www.nist.gov/itl/executive-order-14028-improving-nations-cybersecurity) increasingly mandate SBOMs for software. But if you're loading JavaScript from CDNs without a bundler, there's no manifest for SBOM tools to read. The web has no native way to declare what dependencies a site uses. That's a problem as compliance requirements tighten, and "manually document your CDN dependencies" is a non-compliance trap waiting to happen.

Import maps seem like an interesting starting point for both problems, at least for sites that skip the bundler and load modules directly in the browser.

## Import maps are almost a lockfile

Lea identifies import maps as the obvious primitive to build on. Browser-native specifier resolution, no build step to consume. But they're missing most of the bits that make lockfiles useful, and [I do love a good lockfile](/2026/01/17/lockfile-format-design-and-tradeoffs/):

- No package identity (the browser sees URLs, not packages)
- No version metadata
- No provenance
- No dependency graph

An import map tells the browser "resolve `vue` to this URL" but nothing about where that came from or whether it's what you expected.

## Integrity already exists

Chrome 127 and Safari 18 added an [`integrity` field to import maps](https://shopify.engineering/shipping-support-for-module-script-integrity-in-chrome-safari), thanks to work from Shopify. You can now map module URLs to SRI hashes:

```json
{
  "imports": { "lit": "https://cdn.jsdelivr.net/npm/lit@3.1.0/..." },
  "integrity": {
    "https://cdn.jsdelivr.net/npm/lit@3.1.0/...": "sha384-..."
  }
}
```

[JSPM's generator](https://jspm.org/getting-started) supports this, and [ES Module Shims](https://github.com/guybedford/es-module-shims) polyfills it for older browsers, so integrity verification is already possible.

But integrity tells you *what* you got, not *why* you got it. What's still missing is the package metadata layer. Where did this URL come from? What version constraint produced it? What are its dependencies? That's the gap between an import map and a lockfile.

## Borrowing from other ecosystems

Cargo.lock, Gemfile.lock, go.sum, poetry.lock all capture resolved versions, checksums, and dependency relationships - to make resolution inspectable and repeatable. The web could add the same. Something like:

```json
{
  "imports": {
    "vue": "/deps/vue@3.4.2/vue.esm-browser.js",
    "lodash-es": "/deps/lodash-es@4.17.21/lodash.js"
  },
  "scopes": {
    "/deps/vue@3.4.2/": {
      "@vue/reactivity": "/deps/@vue/reactivity@3.4.2/index.js"
    }
  },
  "integrity": {
    "/deps/vue@3.4.2/vue.esm-browser.js": "sha384-abc123...",
    "/deps/lodash-es@4.17.21/lodash.js": "sha384-def456...",
    "/deps/@vue/reactivity@3.4.2/index.js": "sha384-ghi789..."
  },
  "packages": {
    "vue@3.4.2": {
      "purl": "pkg:npm/vue@3.4.2",
      "from": "^3.4.0",
      "dependencies": ["@vue/reactivity@3.4.2"]
    },
    "lodash-es@4.17.21": {
      "purl": "pkg:npm/lodash-es@4.17.21",
      "from": "^4.17.0",
      "dependencies": []
    },
    "@vue/reactivity@3.4.2": {
      "purl": "pkg:npm/%40vue/reactivity@3.4.2",
      "from": "^3.4.2",
      "dependencies": []
    }
  }
}
```

Browsers see a valid import map with integrity and ignore the `packages` block. That block captures the resolved graph with [purl](https://github.com/package-url/purl-spec) (package URL) identifiers, a standard format for identifying packages across ecosystems - which packages, what versions, what constraints produced them, how they relate to each other.

This deliberately avoids `package.json`, Node resolution rules, and build-time tooling. npm's model is built around Node and the filesystem - `node_modules`, the `exports` field, platform-specific resolution. Browsers don't work that way. The purl might reference npm as a source, but npm is just an identifier, not an endorsement of Node as runtime.

Because purls are standardized, an importmap.lock could be scanned by GitHub Dependency Graph or Snyk just by looking at the repo - no Node.js required.

## Connecting to SBOMs

I've written before about [lockfiles and SBOMs recording the same information](/2025/12/23/could-lockfiles-just-be-sboms/). The `packages` block with purl identifiers means this format could generate CycloneDX or SPDX SBOMs directly.

Right now, if you're loading dependencies via CDN or script tags without a bundler, SBOM generation is basically manual. [Retire.js](https://github.com/RetireJS/retire.js) can fingerprint known libraries and produce a partial SBOM, but it's heuristic - if the library isn't in their database or is minified differently, it's invisible. Tools like [Syft](https://github.com/anchore/syft) and [cdxgen](https://github.com/CycloneDX/cdxgen) can scan containers, filesystems, and source code, but they can't see what's loaded via script tags pointing at CDNs. The [standard advice](https://sbomify.com/guides/javascript/) for CDN dependencies is "manually document them" or "migrate to npm." A format like this would give SBOM tools something to actually read.

## What browsers could do with this

DevTools could show a dependencies tab listing every package the page loaded, with versions and where they came from. Right-click to export as CycloneDX or SPDX. Security researchers and compliance teams could inspect any site's dependency graph without needing access to the source.

Extensions like Retire.js and [Vojtěch Randýsek's thesis work](https://www.vut.cz/www_base/zav_prace_soubor_verejne.php?file_id=217116) already try vulnerability detection by fingerprinting known libraries. But they're heuristic-based and miss what they don't recognize. With actual package metadata in the import map, detection becomes reliable rather than best-effort.

Take it further: browsers already ship with certificate transparency and safe browsing checks. They could query [OSV.dev](https://osv.dev/) against the packages in the import map and surface advisories in DevTools. A "Security" panel showing which dependencies have known vulnerabilities, linked to the CVEs.

The stretch version: browsers warning end users about severely vulnerable dependencies, the way they warn about expired certificates or known-bad sites. "This page uses a JavaScript library with a critical security vulnerability." Most users would ignore it, but the pressure on site operators would be real. Certificate warnings drove HTTPS adoption faster than any amount of developer evangelism.

## Prior art

Deno already has `deno.json` and `deno.lock` solving similar problems in their own format. JSPM has been experimenting with import map generation for years. Micro-frontend architectures often use import map overrides to ensure version consistency across different apps, essentially hacking lockfile-like behavior by dynamically injecting import maps. All the pieces exist, but they're fragmented across ecosystems. A shared format could be the convergence layer.

Even the purl spec is still figuring out web dependencies - there are open proposals for [Deno, esm.sh, and unpkg](https://github.com/package-url/purl-spec/issues/302) and [JSR](https://github.com/package-url/purl-spec/issues/457) types that haven't landed yet.

The manifest side is less clear. Using `package.json` drags in too much Node baggage. Deno's import map approach of just listing specifiers and URLs is closer, though you'd want version constraints rather than pinned URLs in the source file.

There's a cautionary tale in [GitHub Actions](/2025/12/06/github-actions-package-manager/). When you write `uses: actions/checkout@v4`, you're declaring a dependency that gets resolved and executed. It's package management, but without the safety mechanisms other ecosystems developed: no lockfile, no transitive pinning, no dependency graph visibility. Import maps with integrity are better - you get hash verification - but still no record of the resolution that produced them.

## Prototyping

The format and tooling can be tested now, without waiting for browser changes. [ES Module Shims](https://github.com/guybedford/es-module-shims) polyfills import map integrity for browsers that don't support it natively. [JSPM's generator](https://jspm.org/getting-started) can resolve dependency graphs and output import maps with integrity hashes.

A proof of concept could wire these together: resolve dependencies, generate an importmap.lock with the packages metadata, serve it with ES Module Shims handling the integrity verification. Whether that's a separate file or an inline `<script type="importmap">` with extra fields is a deployment detail - separate files cache better and work with strict Content Security Policy (many high-security environments ban inline scripts), inline is simpler.

The more interesting experiment would be SBOM export: take the packages block, transform it to CycloneDX, and see if standard SBOM tooling can consume it without modification. Or go further and sign the lockfile with [Sigstore](https://www.sigstore.dev/) to create an attestation of what was resolved.

## Open questions

- Should the lockfile be served to the browser, or is the `packages` block purely tooling metadata? That's the core design tension - is this a browser format or a tooling format that happens to contain a valid import map?
- How would this interact with Lea's `specifier:` protocol idea?
- Is there enough overlap between Deno's lockfile and this shape to converge, or are the use cases too different?
- Would SBOM tooling actually adopt this, or is the web too much of a special case?
