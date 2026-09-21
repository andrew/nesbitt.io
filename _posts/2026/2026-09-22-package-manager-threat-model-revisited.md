---
layout: post
title: "Package Manager Threat Model, Revisited"
date: 2026-09-22 10:00 +0100
description: "Path traversal via a manifest field appeared in eight of ten package managers audited and thirty-three times in four months of everyone else's advisories."
tags:
  - package-managers
  - security
---

I've spent a fair chunk of the last four months pointing the [package manager CWE list](/2026/05/04/package-manager-cwes.html) and the [threat model questions](/2026/05/05/package-manager-threat-models.html) at real package managers, in some cases with [help](/2026/06/25/scrutineer.html). Ten targets, mostly clients, a couple of registries, a mix of tools I'd used and tools I'd only read about. I also re-ran the advisory search that produced the original CWE list, filtered to everything published since May, to see what everyone else had been finding in the same window. The two lists have now been merged into a maintained page at [/package-manager-threat-model/](/package-manager-threat-model/).

## Advisories

126 advisories against 23 package managers and registries between May and mid-September. About a quarter of everything ever filed against the same set of tools, which is mostly explained by three coordinated audits (one of pnpm producing twenty advisories over June and July, one of Homebrew, which I help maintain, producing thirteen, one of Flatpak producing ten in a single day) plus the OCI-registry implementations working through the same authorisation and DoS bugs the self-hosted language registries had five years earlier.

Path traversal is still the top of the table by a distance, 33 advisories, and almost all of them come from manifest fields rather than archive entries: a package `name`, a `version`, a `bin` field, an entry-point script name, a lockfile alias, a patch target, a hash used as a directory. The May post had a paragraph noting the pattern extended beyond the archive; that paragraph now covers most of the category, so on the page the field-as-path case is the primary framing and the archive entry is the historical example. Four Python installers (uv, pip, pdm, conda) had the same entry-point-name traversal filed against them within five weeks of each other, and Composer had a `bin` field traversal fixed on July 20 and the fix [bypassed](https://github.com/composer/composer/security/advisories/GHSA-96h3-5x6v-m776) on August 27.

Argument injection got its predicted recurrence in a new VCS driver: Composer's Perforce backend, matching the May post's line about the git-driver fix leaving the p4 driver open almost exactly. The `--end-of-options` [survey](/2026/07/21/end-of-options.html) belongs here too.

The pattern that recurred enough to name is credential leakage via a server-controlled response header. Nine advisories share one mechanism: the client asks registry A, registry A returns a `Location`, `Link`, or `WWW-Authenticate` realm pointing at host B, the client follows and sends credentials to B. ORAS had three, Renovate had four (one per registry type it pages through), Cargo and Homebrew one each. The May CWE-522 entry had the redirect case; the Link and realm variants are the same idea applied to headers a browser would ignore and a registry client parses.

Five headings had zero entries in the window (unsafe deserialisation, terminal escapes, registry XSS, manifest confusion, weak crypto parameters), which says those categories were quiet rather than that they're fixed.

## Audits

A pattern scanner has rules for tainted-string-reaches-eval and unescaped-param-reaches-view; the rule it lacks is "which code paths grant ownership of a package name, and does any path's precondition get satisfied by a different path's output." The design questions in the threat-model half are attacker-goal-shaped, and that turned out to be the gap a general-purpose scanner leaves: they ask what an attacker would want from a package manager specifically (a name, a publish credential, code on the machine that resolves dependencies) and then trace back to what confers it. Running Brakeman and CodeQL over the same repositories for calibration produced findings that were almost entirely disjoint from the audit's.

The CWE list catches mechanical clusters the design questions miss: four separate predictable-tempfile sites, six places a credential reaches a string that gets logged, five places package-controlled text reaches a terminal unstripped. Each is low severity; together they show the codebase lacks discipline around a class of operation, which is a useful thing to be able to say to maintainers with line numbers attached.

Running both over the same code and letting them overlap was more useful than expected. When six independent framings (three CWEs, three design dimensions) all point at the same file, that convergence is a stronger signal than one rule firing, and it fell out of the structure for free. The write-up shows one finding with "also flagged under: …" and a maintainer reads that as six different attacker models flagging this line.

Verifying each finding adversarially before reporting it, which in practice meant a second pass by an agent instructed to argue the finding was wrong, refuted about a fifth of raw findings with a specific reason: this looks like SSRF but the request goes through a filtering relay, this looks like unchecked deserialisation but `permitted_classes` is set three frames up. Those refutations turned out to be worth keeping, because each one documents an invariant the codebase relies on that is otherwise undocumented. The page now requires a negative-results list as an output for the same reason: a dimension with zero findings still records why, and an empty search establishes only that the search came back empty. A separate unverified-assumptions list holds the suspicions that trace to neither a finding nor an invariant, which gives an auditing agent somewhere to put uncertainty.

The targets were a deliberate mix rather than a sample, so the counts describe those ten codebases rather than package managers in general. Across the ten:

- Path traversal via a manifest field: eight
- A command the user would expect to be read-only (`--list-steps`, `env`, `serve`, editor open, `--dry-run`) that runs dependency code: five
- The tool's own install script, release workflow, or bootstrap step downloading something without a hash check: six
- Argument injection into git or an equivalent: four
- Plain HTTP or an HTTPS-to-HTTP downgrade accepted silently: four
- A lockfile or expiry field that's recorded in the schema and ignored on install: three

## Additions

Every audit that produced a useful write-up started by naming the trust boundary, who the tool places inside it and who outside, because that's what sorts a finding into bug, accepted design, or non-issue. A build system that runs dependency code with full user privileges has, by design, put dependency authors inside the boundary; a finding of "dependency code runs unsandboxed" is then a design note, and the interesting findings are the ones that fire before that point. The page now asks for that statement first.

The CDN and middleware layer was absent from both halves of the May checklist. [GHSA-9j48-x3c3-mrp2](https://github.com/rubygems/rubygems.org/security/advisories/GHSA-9j48-x3c3-mrp2) is a per-user API-key response cached by Fastly and served to the next requester, and the bug is in Rack middleware ordering plus CDN defaults rather than any controller line, which both the CWE list and the design questions would have missed because both read application code. The page has a CWE-524 entry for it now, and the audit prompt is: for every response carrying per-user data, what is between the app and the client, and what would make it cache.

Mirrors and caching proxies get their own Part II heading. Most corporate clients resolve against an Artifactory, Nexus, or Verdaccio instance rather than the public registry, and the proxy shifts several answers at once: which source is authoritative for a name, whether a yank or a malicious-version flag upstream propagates through the cache, whether the proxy re-verifies checksums or serves whatever it cached first, whether the lockfile records the proxy URL or the origin, and how per-origin credential scoping handles a host that terminates one credential and holds a stronger one of its own. The questions were previously scattered under manifest confusion, integrity checks, and multi-source resolution.

Feature composition produced the highest-severity findings across two audits, each of them two features whose trust assumptions differed at the seam: a grant of authority whose precondition one feature was designed to satisfy for the user's own resources, satisfied instead by a different feature acting on someone else's. It fits no CWE and there is no dangerous call to grep for. The page now has it as an explicit design question: for each grant of authority, list every code path that produces it and check the pairs.

The sandbox hand-off is a related gap: a build that runs confined and then writes an install manifest, a step list, or a cache entry that the tool acts on with full privileges has moved the boundary to whatever validates that output. Several tools have a sandbox around the build while leaving what the build writes back unvalidated.

The tool's own release pipeline, split from its own dependencies, produced findings in six of ten audits (an unchecksummed install script, CI actions on floating tags in a job holding a publish credential, an unguarded `workflow_dispatch`, a bootstrap binary fetched unhashed during the build) and was a distinct enough surface from "what's in the lockfile" to warrant its own heading. The heading also covers the client's self-update path, `rustup self update` or `brew update` pulling the tool's own source, and whether it meets the verification bar the tool sets for the packages it installs.

Editor and language-server integration belongs under code-before-install: for several ecosystems the first thing that runs code on an untrusted checkout is the LSP the editor starts on folder open, before the user has typed a command.

CWE-693 is broadened from build-sandbox escape to protection-mechanism bypass generally. Cooldowns, install-script allowlists, tap allowlists, and anti-downgrade checks all had bypasses filed in the window and they're the same class of bug: a configurable protection with one code path that skips consulting it.

CWE-326 covers weak parameters: a truncated hash, a 64-bit non-cryptographic hash used for integrity, a token from a non-cryptographic RNG, an iteration count set for 2010 hardware. The check runs and the parameter is small enough that it offers little protection.

A few smaller adjustments: tagging every entry client / registry / both so an auditor knows which repo to read; adding filesystem normalisation (case-insensitive collisions, APFS Unicode) alongside registry name normalisation; noting under lockfile guarantees that verify-before-extract stops a network attacker while the pinned bytes can still be upstream-authored hostile input to the extractor; adding an audit-event-coverage prompt under maintainer lifecycle since "state change lacking a durable record" kept showing up.

The May CWE post closed with a suggestion to subscribe to five or six other package managers' advisory feeds because this month's bug in someone else's tar extractor is a decent description of the bug in yours. Four months of doing roughly that, plus running the list directly, has mostly confirmed it: the list of patterns is stable enough that new advisories slot into existing headings about nineteen times out of twenty, and the twentieth is what the additions above are for. The [page](/package-manager-threat-model/) now holds the maintained version; the two May posts stay as the dated snapshots.
