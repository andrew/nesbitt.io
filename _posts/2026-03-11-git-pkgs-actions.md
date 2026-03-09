---
layout: post
title: "git-pkgs/actions"
description: "How to add git-pkgs to your GitHub Actions workflows."
date: 2026-03-11 10:00:00 +0000
tags:
  - git-pkgs
  - github-actions
  - supply-chain
---

Until now [git-pkgs](https://github.com/git-pkgs/git-pkgs) has been a local tool, you run it in your terminal to query dependency history, scan for vulnerabilities, check licenses. Getting it into CI meant downloading the binary yourself, initializing the database, and wiring up whatever checks you wanted by hand.

[git-pkgs/actions](https://github.com/git-pkgs/actions) is a set of reusable GitHub Actions that handle all of that. A `setup` action downloads the binary and initializes the database, and the rest build on top of it. A dependency diff on pull requests is three lines of YAML:

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0

  - uses: git-pkgs/actions/setup@v1
  - uses: git-pkgs/actions/diff@v1
```

That posts a comment on the PR listing every dependency that was added, removed, or changed, and updates the same comment on subsequent pushes rather than creating a new one.

### Vulnerabilities

The `vulns` action syncs against the [OSV database](https://osv.dev) and can fail the build above a severity threshold:

```yaml
- uses: git-pkgs/actions/vulns@v1
  with:
    severity: "high"
```

Without `severity` it reports findings but doesn't block, which is a reasonable way to start before making it a hard gate. Setting `sarif: "true"` uploads results to GitHub Advanced Security so vulnerability alerts show up alongside CodeQL in the Security tab.

### Licenses

```yaml
- uses: git-pkgs/actions/licenses@v1
  with:
    allow: "MIT,Apache-2.0,BSD-2-Clause,BSD-3-Clause,ISC"
```

An allow list permits only those licenses and rejects everything else. You can use a deny list instead if you only want to block a few specific licenses like GPL-3.0 or AGPL-3.0 while accepting the rest. Either way, the "can we use this license" conversation happens at PR time rather than after something ships.

### SBOMs

```yaml
- uses: git-pkgs/actions/sbom@v1
  with:
    format: "cyclonedx"
```

Generates a [CycloneDX](https://cyclonedx.org/) or [SPDX](https://spdx.dev/) Software Bill of Materials and uploads it as a workflow artifact. You can also disable the upload and attach the file to a GitHub release instead, which is what I do for git-pkgs itself.

### All together

```yaml
name: Dependencies
on: pull_request

permissions:
  contents: read
  pull-requests: write

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: git-pkgs/actions/setup@v1
      - uses: git-pkgs/actions/diff@v1
      - uses: git-pkgs/actions/vulns@v1
        with:
          severity: "high"
      - uses: git-pkgs/actions/licenses@v1
        with:
          deny: "GPL-3.0-only,AGPL-3.0-only"
```

The `setup` action runs `git-pkgs init` once and the other steps share the same database. All the actions are composite -- shell scripts, no Node.js or Docker -- and the repo passes [zizmor](https://github.com/zizmorcore/zizmor) in pedantic mode with inputs going through environment variables, action refs pinned by SHA, and credentials not persisted.

There's a lot git-pkgs can do that doesn't have an action yet: integrity drift detection, outdated dependency reports, enforcing package policy through notes. I'm curious what would actually be useful in practice, so if you have ideas or want something specific, open an issue on the [actions repo](https://github.com/git-pkgs/actions/issues) or find me on [Mastodon](https://mastodon.social/@andrewnez).
