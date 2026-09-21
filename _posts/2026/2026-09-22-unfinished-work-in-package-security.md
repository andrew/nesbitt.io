---
layout: post
title: "Unfinished Work in Package Security"
date: 2026-09-22 10:00 +0100
description: "Some assembly required."
tags:
  - package-managers
  - security
  - supply-chain
---

In May 2026, an Nx contributor [installed a malicious dependency](https://nx.dev/blog/nx-console-v18-95-0-postmortem) that had been published 77 minutes earlier. The repository had a seven-day cooldown configured, but its pinned pnpm version predated support for the setting. The client skipped the check and installed the package. The stolen credentials contributed to a malicious Nx Console extension release a week later.

Package-manager defaults have [improved even in the last few months](/2026/09/10/package-manager-trends.html), including release cooldowns and restrictions on installation scripts. Going back through what I've written this year, I keep running into work left to each consumer, in the gaps between controls that work on their own: checking that a configured policy takes effect across the tools they use, or finding someone who can publish a fix when a scanner turns up a vulnerability.

## Installation permissions

Nx had already suffered a different [compromise in August 2025](https://nx.dev/blog/s1ngularity-postmortem), when an npm post-install script stole credentials and uploaded them to public GitHub repositories. The script ran with the developer's permissions, including access to unrelated credentials and the network, with no separate approval for either.

pip's [build-system interface](https://pip.pypa.io/en/stable/reference/build-system/) can execute a backend to obtain dependency metadata, and may build a wheel if the metadata hook is absent. Its isolated build environment separates Python dependencies; the backend itself runs with the invoking user's operating-system permissions.

Composer's [`allow-plugins`](https://getcomposer.org/doc/06-config.md#allow-plugins) setting blocks all plugins by default, and interactive use asks before enabling a new one. The [separate stages of installation](/2026/04/27/the-stages-of-package-installation.html) need controls over what permitted code can do as well. A compiler may need to write build output without needing access to the developer's cloud credentials, and permitting the build should grant only what that step needs.

## Release promotion

The [Ledger Connect Kit attack in December 2023](https://www.ledger.com/blog/security-incident-report) reached applications through a loader that fetched the latest library from a CDN at runtime. Downstream developers did not have to rebuild their applications or approve an update to receive the malicious release.

Debian's [promotion process for testing](https://www.debian.org/devel/testing) holds packages in unstable until they meet requirements around successful builds, dependencies and release-critical bugs. The required delay varies with urgency.

The [cooldowns appearing across language package managers](/2026/03/04/package-managers-need-to-cool-down.html) depend on publication timestamps and a client that enforces the setting. Consumers also need a reviewed route for urgent fixes. I'd rather see that review funded as a shared service than have each project work out its own exceptions to a timer.

## Build dependencies

The March 2025 `tj-actions/changed-files` compromise had a [chain of preceding compromises](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/) involving SpotBugs, reviewdog and `tj-actions/eslint-changed-files`. Credentials and action dependencies connected the projects, and the final payload exposed secrets in workflow logs. Those relationships fell outside an application's package lockfile, even though they affected the machinery building it.

In the first wave of the [Ultralytics attack in December 2024](https://blog.pypi.org/posts/2024-12-11-ultralytics-attack-analysis/), GitHub Actions cache poisoning supplied malicious material to the genuine release workflow. The workflow built and published the affected packages through its authorised publishing path. Removing a stored registry token would leave this route available because the compromised build itself was permitted to publish.

An inventory of [Actions dependencies](/2026/04/28/github-actions-is-the-weakest-link.html) needs to include the tools each action downloads and the permissions it receives. Pinning the top-level action still leaves a path for altered code if that action fetches a mutable script or restores executable material from a cache writable by an untrusted job.

## Source and artifacts

The original [xz disclosure](https://www.openwall.com/lists/oss-security/2024/03/29/4) described malicious build logic present in release tarballs but absent from Git, alongside payload material stored in repository test fixtures. Checking out the tagged source and reviewing it would have missed the tarball-only portion.

Ultralytics' malicious first-wave releases carried attestations from the real build workflow, which helped investigators establish where the compromise occurred. A later wave used an older PyPI API token and lacked those attestations. Both routes produced malicious packages; the attestations distinguished how they had been published.

Go's [reproducible-toolchain work](https://go.dev/blog/rebuild) checks published binaries against independent rebuilds, while [signatures can preserve evidence of authorisation when infrastructure is compromised](/2026/05/24/signing-is-for-the-bad-days.html). Those checks still leave source review to be done. A provenance badge records how an artifact was built; approval of the inputs and review of the resulting code are separate questions.

## Names and publishers

In the [2018 event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident), a new maintainer added `flatmap-stream` as a dependency, and a malicious release of that dependency targeted the Copay wallet build. Consumers kept using the familiar event-stream name while the people able to change its contents had changed.

The [`ctx` takeover in 2022](https://python-security.readthedocs.io/pypi-vuln/index-2022-05-24-ctx-domain-takeover.html) went through an expired email domain. Registering the domain enabled a password reset on its PyPI account and malicious uploads shortly afterwards. Packagist's [2023 account takeovers](https://blog.packagist.com/packagist-org-maintainer-account-takeover/) used reused passwords instead, redirecting fourteen packages to different source repositories. Packagist found altered descriptions but no malicious code distributed; the source redirection itself was the demonstrated failure.

Consumers could require a fresh review when a package changes publisher or source repository. That requires registry metadata about authority changes, alongside the [authentication controls](/2026/08/18/two-factor-authentication-across-package-registries.html) used to approve them.

## Coding agents

jqwik's [anti-AI clause](https://jqwik.net/docs/1.10.1/user-guide.html#anti-ai-usage-clause) puts instructions aimed at coding agents into test output, telling an agent to disregard earlier instructions and the test results. This is an intentional maintainer feature; the documentation leaves open whether an agent follows it.

In Johann Rehberger's [module-shadowing demonstration](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/), a coding agent wrote a Python helper beside a malicious `struct.py` extracted from an archive. The helper's imports loaded the attacker's module while still producing the requested decoding result. The agent had refused to run a conspicuous binary from the archive, but its own generated helper supplied another execution path. Generated helpers need [restricted execution environments](/2026/04/09/package-security-defenses-for-ai-agents.html) and controlled import paths: asking a model to scrutinise a command leaves the interpreter's access to files and credentials intact when that command runs.

## Repeated bugs

Composer disclosed [command injection through repository URLs in 2021](https://blog.packagist.com/composer-command-injection-vulnerability/), then [another case involving branch names in 2022](https://blog.packagist.com/cve-2022-24828-composer-command-injection-vulnerability/). Both involved values reaching a version-control command as options. Fixing the URL handling had left other values and command invocations to be checked, and Packagist reported no known exploitation in either disclosure.

pip's [2023 Mercurial advisory](https://github.com/advisories/GHSA-mq26-g339-26xf) involved a crafted revision injecting configuration into `hg clone`. Go's [January 2026 VCS advisory](https://pkg.go.dev/vuln/GO-2026-4338) described crafted version strings reaching external commands, with different consequences for Mercurial and Git.

A package manager adding a VCS backend should be able to run an existing collection of hostile URLs and revisions against it. My [survey of argument handling](/2026/07/21/end-of-options.html) and the broader [package-manager bug list](/2026/05/04/package-manager-cwes.html) already collect disclosures that could supply those regression cases.

## Maintainer succession

My [May dependency survey](/2026/05/08/weekend-at-bernies.html) classified 713 of 5,874 repositories as dead under its maintenance criteria. Of those, 391 were not archived, so checking an archived flag would have missed more than half the group. Another view of the same data found 1,414 dead or dormant packages with a single registry publisher.

Jean Boussier's [account of Ruby dependency maintenance](https://byroot.github.io/ruby/bundler/2026/04/20/bundle-features.html) includes `httpclient`, which went without a release between 2016 and 2025 while its bundled CA certificates expired in 2023. Consumers patched their own copies and applications broke. Getting a new release out required someone to obtain the publishing access, even after the defect and the repair were understood. Consumers need workable [patching and forking paths](/2026/05/01/patching-and-forking-in-package-managers.html), while registries need succession procedures that can also withstand the hostile handovers described above. Vulnerability-response budgets need to cover the person testing a patch against downstream applications and maintaining the replacement package.

## Report triage

ISC [reported 150 submissions](https://www.isc.org/blogs/2026-04-16-How-to-report-a-vulnerability/) through one reporting platform over roughly three months in early 2026: eight valid, eight still under investigation and 134 false positives. Those figures describe one channel, rather than all AI-assisted security research.

When I [ran scanners against curl in May](/2026/05/12/not-a-security-issue.html), one constructed a 150,000-line configuration file that caused a stack overflow in form parsing. The bug required attacker-supplied command-line arguments or configuration, which curl's disclosure policy excludes from its security boundary. The scanner applied that policy and classified it as a quality bug before disclosure.

[Django's reporting guidance](https://docs.djangoproject.com/en/dev/internals/security/) asks for a working proof of concept and tested versions, while discouraging CVSS scores and lengthy background sections. I built [Scrutineer's workflow](/2026/06/25/scrutineer.html) around a similar division of work: verification and human review happen before a report is sent, with fixes tracked through to releases. The measure I'd like to see attached to a scanner is how much verified repair work reaches users relative to the investigation time it requires from maintainers.

## Measuring dependencies

Daniel Stenberg found an LF Insights figure of [10,467 annual curl downloads](https://daniel.haxx.se/blog/2026/03/09/10k-curl-downloads-per-year/) in March. curl's own site supplied roughly 250,000 source-tarball downloads a month, before accounting for distributions, containers or embedded copies.

The [2015 Open Source Census](/2026/05/06/revisiting-the-2015-open-source-census.html) put xz in row 254 with a risk score of six out of thirteen, despite a reviewer flagging its importance. Contributor count contributed up to five points to the score. An additional active contributor could improve the apparent maintenance picture without the scoring process establishing anything about their intentions. sudo and polkit were absent from the candidate set altogether, beyond the reach of any change to the ranking formula.

A wrapper's registry downloads and a distribution's installations [measure different objects](/2026/05/09/the-mismeasure-of-open-source.html), while bundled copies may produce neither signal. Security funding decisions need room for dependencies whose use is poorly measured, and for evidence about maintenance capacity beyond what stars or commit counts show.

## Advisory matching

Ruby's issue tracker records [Ruby 3.3.2 shipping REXML 3.2.6](https://bugs.ruby-lang.org/issues/20516) after a separately released gem had fixed CVE-2024-35176. Microsoft's [System.Text.Json advisory](https://github.com/dotnet/announcements/issues/315) likewise covers a library distributed both as a package and inside a runtime, with different update paths for different deployments. An inventory needs to distinguish those copies and establish which one the application loads.

During the [Homebrew vulnerability integration work](/2026/07/17/plumbing-homebrew-into-the-vulnerability-ecosystem.html), we surfaced 1,191 patches across 809 formulae and added metadata recording which advisories a patch resolves. A scanner comparing only the upstream version would otherwise flag some already-patched builds. The original scanner also read the current formula when checking an older installed keg; reading the installed keg's SBOM corrected the version being evaluated.

Homebrew's glibc patch set exposed another limit in July: it resolved ten CVEs, but an OSV query by source repository returned only one. The other nine records existed without affected-package metadata, so a query could miss information already present in the database.

## Security obligations

ENISA's [March package-manager advisory](https://www.enisa.europa.eu/sites/default/files/2026-03/ENISA%20Technical%20Advisory%20-%20Package_Managers_Final.pdf) recommends considering stars, downloads and recent commits when selecting dependencies, with an explicit warning against relying on popularity alone. Its [scope excludes](/2026/03/12/reviewing-enisas-package-manager-advisory.html) operating-system package managers, secure publication and the package manager's own distribution channel. A consumer following the guidance still needs policy covering those parts of an installation.

The [SPDX supplier field](https://spdx.github.io/spdx-spec/v2.3/package-information/) identifies who supplied a package and allows `NOASSERTION`; it does not establish a support contract. Treating that field as evidence that a volunteer maintainer owes a company incident-response work adds an obligation beyond anything the inventory established. [Build attestations and organisational declarations](/2026/02/25/two-kinds-of-attestation.html) also answer different questions, even when a procurement process puts them under the same heading.

Æva Black's [FOSDEM proposal for funded attestations](https://fosdem.org/2026/schedule/event/PTHENV-sustaining-foss-with-attestations/) put the cost with manufacturers using the software and connected that spending to upstream maintenance, without transferring liability to maintainers. If a company requires evidence about a dependency's build or an undertaking to maintain it, its procurement budget should cover the work of producing that evidence or providing that maintenance.
