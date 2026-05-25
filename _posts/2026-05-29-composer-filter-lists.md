---
layout: post
title: "Composer's filter lists"
date: 2026-05-29 10:00 +0000
description: "uBlock Origin for composer install"
tags:
  - package-managers
  - security
  - supply-chain
---

Composer 2.10, currently at [RC2](https://github.com/composer/composer/releases/tag/2.10.0-RC2), ships a new [`config.policy`](https://getcomposer.org/doc/06-config.md#policy) block that puts security advisories, malware reports, abandoned packages, and arbitrary custom blocklists under a single configuration object. Each list has the same three knobs: `block` (remove matching versions from the resolver pool), `audit` (`ignore`/`report`/`fail`), and `ignore` (per-package exemptions with optional version constraints). The model is the one [uBlock Origin](https://github.com/gorhill/uBlock) and other ad blockers use for their filter lists: named lists published at URLs by whoever maintains them, with a default set enabled and a config slot to subscribe to more or drop any.

The malware list is on by default and, unlike the others, also blocks during `composer install` from a lockfile. A version that was clean when you locked it and has been flagged since is blocked at install, which is a stronger guarantee than `composer audit` reporting it after the fact.

A Composer repository advertises support by setting `filter.metadata: true` in its `packages.json` alongside the names of the lists it serves, and Packagist.org [currently advertises](https://repo.packagist.org/packages.json) one, `malware`, fed by [Aikido's](https://www.aikido.dev/) feed via [composer/packagist#1681](https://github.com/composer/packagist/pull/1681). The per-package metadata files that Composer already fetches during resolution gain a new `filter` key next to the version list, so there's no extra round-trip during `composer update`.

For `composer install` and `composer audit`, where Composer wouldn't otherwise hit the registry for every locked package, the repository can advertise a [`summary-url`](https://github.com/composer/composer/pull/12833) returning a single JSON document of every flagged package and constraint, or an [`api-url`](https://github.com/composer/composer/pull/12839) that takes a POST of [PURLs](https://github.com/package-url/purl-spec) and returns only the matches. Packagist's [summary file](https://repo.packagist.org/lists/all/summary.json) is currently 69 packages.

A flagged entry on the wire looks like this, from the metadata for a package Aikido reported last October:

```json
"filter": {
  "malware": [
    {
      "constraint": "0.1.1",
      "url": "https://packagist.org/packages/techghoshal/my-library/filter-lists/malware/",
      "reason": "malware",
      "id": "PKFE-h151-2jj1-7rrv",
      "source": "aikido"
    }
  ]
}
```

The first iteration shipped in [#12766](https://github.com/composer/composer/pull/12766) at the start of April as `config.filter`, was reworked into the unified `config.policy` object in [#12804](https://github.com/composer/composer/pull/12804), and the existing `config.audit.*` keys for advisories and abandoned packages now fall back to it with a deprecation path planned for 2.11. Stephan Vock did most of the implementation across both [composer/composer](https://github.com/composer/composer/pull/12766) and [composer/packagist](https://github.com/composer/packagist/pull/1681), and Private Packagist [already serves the lists](https://blog.packagist.com/whats-new-in-private-packagist-may-2026-update/) to organisations running pre-release Composer.

The bit I find most interesting is that `malware` isn't a reserved name. It's a well-known list with built-in defaults, but any other key under `config.policy` defines a custom list with the same `block`/`audit`/`ignore` options, and the data for it can come from a Composer repository that advertises a list of that name, from one or more HTTPS endpoints configured under `sources`, or from both merged together. Composer POSTs the project's dependency PURLs and the configured list names to each source URL and gets back filter entries in the same shape Packagist serves.

```json
{
  "config": {
    "policy": {
      "company-policy": {
        "sources": [{"type": "url", "url": "https://acme.example.com/filter.json"}],
        "block": true,
        "audit": "fail"
      }
    }
  }
}
```

Aikido is the default malware source on packagist.org but it's wired in as a named source, so `malware.ignore-source: ["aikido"]` drops it entirely and another vendor's endpoint can run instead or alongside. The same slot works for lists nobody is selling: a community-maintained typosquat list, or an organisation's "packages legal hasn't cleared yet" list, plugs in next to the built-in ones with the same exemption syntax and no vendor in a privileged position. The [tracking issue](https://github.com/composer/composer/issues/12786) reserves `license`, `support`, `maintenance`, and `minimum-release-age` as future built-in names, which will presumably arrive through the same mechanism rather than as separate features.

One flip the wire format could already support is allowlists: a package-to-constraint mapping describes permitted versions as readily as forbidden ones, and the only difference is whether the client drops the matches or drops everything else. [cargo-vet](https://mozilla.github.io/cargo-vet/) is the working example of that model in Rust, requiring every crate in `Cargo.lock` to be covered by an audit record that's either local or [imported](https://mozilla.github.io/cargo-vet/importing-audits.html) from a published set like [Mozilla's](https://hg.mozilla.org/mozilla-central/file/tip/supply-chain/audits.toml) or [Google's](https://github.com/google/rust-crate-audits), with anything unaudited failing the build. A Composer list configured as allow-mode and backed by a community-published "packages someone has actually read" feed would give PHP the same federated-audit model. The reserved `license` name rather implies allow semantics are on the roadmap anyway, since licence policy is almost always a set of permitted SPDX identifiers rather than forbidden ones.

### Prior art

Most registries deal with confirmed malware by making it disappear server-side. PyPI's [project quarantine](https://blog.pypi.org/posts/2024-12-30-quarantine/), live since August 2024, hides a project from the simple index so `pip install` can't find it while admins investigate, and [PEP 792](https://peps.python.org/pep-0792/) status markers now expose the quarantined state in the JSON API for clients to act on. npm's process [removes the package and publishes a security-holding placeholder](https://docs.npmjs.com/reporting-malware-in-an-npm-package/) under the same name. RubyGems and crates.io yank. Hex.pm [retires](https://hex.pm/docs/publish#retiring-a-package) a release, which prints a warning at resolve time but doesn't block.

Server-side removal has the advantage that every client gets it for free, including ten-year-old installs that will never be upgraded. Its limitation is that the registry admins' judgement is the only one available: there's one list, it's whatever they've actioned so far, and a security vendor that spotted something an hour ago can publish a blog post but can't get between you and `pip install`. In Composer's design the package stays on the registry with a flag attached and which flags are honoured is set in client config, including ones supplied by third parties, with the corresponding cost that a Composer 2.8 install will fetch a flagged version without complaint.

Time-based cooldowns, which I [surveyed in March](/2026/03/04/package-managers-need-to-cool-down.html), are the other client-side defence that's spread across package managers in the last year. pnpm, Yarn, Bun, npm, uv, pip, and Poetry all now refuse versions younger than a configured age. A cooldown blocks everything published in the last N days on the assumption that anything malicious gets caught and removed inside that window, where a filter list names specific versions and is only as good as the latency of whoever populates it. The `minimum-release-age` name reserved in Composer's policy schema suggests both will eventually live under the same config block, and one reasonable configuration is a short cooldown plus a malware list for anything that slips past it.

Third-party install-time blocking has existed for a while as CLI wrappers. Socket's [`safe npm`](https://socket.dev/blog/introducing-safe-npm) and Aikido's own [Safe Chain](https://www.aikido.dev/blog/introducing-safe-chain) alias `npm` to a command that checks each package against the vendor's database before writing anything to disk, and Socket's [Firewall](https://docs.socket.dev/docs/socket-firewall-free) does the same as a local registry proxy. [cargo-deny](https://embarkstudios.github.io/cargo-deny/) takes a `deny.toml` of banned crates, advisories, and licences and fails CI if any appear in `Cargo.lock`, which is the closest existing thing to Composer's custom-list shape, though it runs as a separate check rather than inside `cargo` resolution. I wrote about how [none of these policy formats line up](/2026/03/19/the-fragmented-world-of-dependency-policy.html) a couple of months ago, and Composer's `config.policy` adds yet another. The source protocol underneath it, a PURL list in and filter entries out, is a reasonable candidate for the cross-tool format I was after in that post.

I'd like to see more package managers copy this wholesale, because the design is simple and open: the same config options for every kind of policy list, with data sources anyone can publish.
