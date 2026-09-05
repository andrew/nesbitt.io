---
layout: post
title: "This Week in Package Management: 5 September 2026"
date: 2026-09-05 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
---

Week sixteen of the roundup, built from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml) and whatever I've posted or boosted on [Mastodon](https://mastodon.social/@andrewnez). I added Terraform, OpenTofu, Elm and PSResourceGet release feeds to the OPML this week.

## Releases

[pnpm 12.1](https://pnpm.io/blog/releases/12.1) adds the workspace task scheduler to the Rust CLI, dispatching each package as soon as its dependencies finish where the previous scheduler waited for a whole topological batch, and moves login credentials into structured global config. [12.3](https://github.com/pnpm/pnpm/releases/tag/v12.3.0) makes the global command shims native executables on every platform and extends the trust-policy flags to `pnpm remove` and `pnpm update`. On the 11.x line, [11.25](https://pnpm.io/blog/releases/11.25) backports the task scheduler and adds `--resume-from` for recursive runs.

[rustup 1.29.1](https://blog.rust-lang.org/2026/09/01/Rustup-1.29.1/) checks for toolchain updates in parallel during `rustup update` and installs multiple components concurrently in `rustup component add`.

[Conan 2.32.0](https://github.com/conan-io/conan/releases/tag/2.32.0) adds LoongArch64 host detection, Xcode 26.6 and gcc 16.2 support, and lets `XcodeToolchain` accept arbitrary xcconfig build settings.

[PDM 2.29.0](https://github.com/pdm-project/pdm/releases/tag/2.29.0) exports editable local dependencies with relative paths in requirements files, and restricts locked packages to the platform they were resolved for when appending targets with `pdm lock --platform`.

[zizmor 1.30](https://docs.zizmor.sh/release-notes/#1300), the GitHub Actions workflow auditor, adds a `self-repository` audit and expands pre-commit support.

[Renovate 44.59.0](https://github.com/renovatebot/renovate/releases/tag/44.59.0) adds a manager for Microsoft's Agent Package Manager, and [44.60.0](https://github.com/renovatebot/renovate/releases/tag/44.60.0) lets security-update PRs be rate-limited and stops the Go proxy datasource caching transient errors, a long-standing cause of flapping Go update PRs.

The Maven 3.8.x branch has [reached end of life](https://github.com/apache/maven/releases/tag/archive%2Fmaven-3.8.x); the final state is archived under a tag and the branch removed.

Also out:

- [Homebrew 6.0.22](https://github.com/Homebrew/brew/releases/tag/6.0.22)
- [snapd 2.77.1](https://github.com/canonical/snapd/releases/tag/2.77.1)
- [RubyGems and Bundler 4.0.20](https://blog.rubygems.org/2026/09/02/4.0.20-released.html)
- [Bun 1.4.2](https://github.com/oven-sh/bun/releases/tag/bun-v1.4.2)
- [Verdaccio 6.10.2](https://github.com/verdaccio/verdaccio/releases/tag/v6.10.2)
- [Go 1.27.1 and 1.26.8](https://go.dev/doc/devel/release#go1.27.1)
- [Rust 1.98.1](https://blog.rust-lang.org/2026/09/03/Rust-1.98.1/)
- [uv 0.12.10](https://github.com/astral-sh/uv/releases/tag/0.12.10)
- [pipx 1.17.2](https://github.com/pypa/pipx/releases/tag/1.17.2)
- [conda 26.7.2](https://github.com/conda/conda/releases/tag/26.7.2)
- [Pixi 0.79.0](https://github.com/prefix-dev/pixi/releases/tag/v0.79.0)
- [mise 2026.9.1](https://github.com/jdx/mise/releases/tag/v2026.9.1)
- [Dependabot Core 0.394.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.394.0)
- [Docker Engine 29.8.0](https://github.com/moby/moby/releases/tag/docker-v29.8.0)
- [Terraform 1.16.1](https://github.com/hashicorp/terraform/releases/tag/v1.16.1)
- [Helm 4.3.0-rc.1](https://github.com/helm/helm/releases/tag/v4.3.0-rc.1) and [3.22.0-rc.1](https://github.com/helm/helm/releases/tag/v3.22.0-rc.1)
- [opam 2.6.0-beta2](https://github.com/ocaml/opam/releases/tag/2.6.0-beta2)
- [CPAN-Meta 2.150015](https://github.com/Perl-Toolchain-Gang/CPAN-Meta/releases/tag/2.150015)

## Security

[Podman 6.1.1](https://github.com/podman-container-tools/podman/releases/tag/v6.1.1) fixes [CVE-2026-17106](https://github.com/containers/podman/security/advisories/GHSA-hfg8-hc9c-6c3h), a path traversal where a crafted tar archive could write outside the extraction directory via malicious links.

[Poetry 2.4.2](https://github.com/python-poetry/poetry/releases/tag/2.4.2) fixes three issues: installing an artifact absent from the lockfile when the source omits its hash, a path traversal when downloading from a compromised URL, and a path traversal in sdist extraction on Python 3.10.0-3.10.12 and 3.11.0-3.11.4.

[Coder disclosed](https://github.com/coder/coder/security/advisories/GHSA-vx42-ghc9-gw65) that an attacker gained access to its Cloudflare account and added their own IPs to the module registry pool, serving credential-stealing modules for about fourteen hours on 31 August. Fixed in 2.37.0 with backports to 2.36.4, 2.35.7 and 2.34.9. This is [what artifact signing is for](/2026/05/24/signing-is-for-the-bad-days.html): the tampered modules came from the real domain over valid TLS, so only a signature check against a key held outside the Cloudflare account would have flagged them.

## Articles

[Boring Python: dependency management](https://www.b-list.org/weblog/2022/may/13/boring-python-dependencies/) (James Bennett) is a revised edition of the 2022 post: it now recommends PEP 751 lock files over pinned requirements files, allows uv or PDM for local development while keeping pip-with-hashes for production installs, and adds a section on three-day dependency cooldowns.

[The Holy Grail of Nixpkgs Version Ranges](https://fzakaria.com/2026/09/01/the-holy-grail-of-nixpkgs-version-ranges) (Farid Zakaria) adds version-range constraints to nixpkgs by pairing a 309,000-version index of historical nixpkgs revisions with the clingo Answer Set Programming solver, so a query like `python@>=3.10` resolves to a concrete set of revisions. Mixing revisions can produce glibc symbol mismatches, which the solver constrains against using binary compatibility metadata.

[Security scanning my own code with Scrutineer and local coding models](https://anil.recoil.org/notes/scrutineer-local-llm) (Anil Madhavapeddy): notes on running Scrutineer, the code-scanning workflow tool that I wrote, against his own repos with a local GLM 5.3 model in place of a hosted one. He argues the triage decisions maintainers make on findings should themselves be tracked and fed into later scans across an organisation.

## Papers

[The Software Supply Chain as a Market for Lemons: A Multivocal Review of Trust Signal Collapse](https://arxiv.org/abs/2608.20678) (Paramitha et al., arXiv) reviews 252 web sources and 870 Reddit threads on how practitioners pick dependencies: the cheap signals they rely on (stars, download counts, contributor activity) are now cheaper to fake than to earn, and the authors recommend costly signals such as cryptographic attestation as mandatory defaults.

[A Multi-Month Study of Git Commit Signing](https://arxiv.org/abs/2608.29283) (Shittu et al., arXiv): 22 CS students configured commit signing independently, used it across four coursework projects and a second device, then examined a repository seeded with anomalous commits; nearly all signed every commit but over a quarter missed the anomalies.

[AgOSS: A Dataset and Multi-Layer Characterization of Open-Source Agricultural Software](https://arxiv.org/abs/2609.02591) (Dudhaiya et al., arXiv) applies OpenSSF Scorecard, governance metrics, SBOM dependency analysis and KEV matching to 66 agricultural OSS repositories and non-agricultural controls; the agricultural projects score lower on raw Scorecard results but the gap disappears once project size and maturity are accounted for.

## Elsewhere

NYU Tandon has [launched](https://engineering.nyu.edu/news/nyu-tandon-launches-initiative-close-critical-gap-open-source-security-and-train-students-who) the NYU Software Supply Chain Security Operations Center, led by Justin Cappos, embedding master's students in open source projects for year-long security placements; the first cohort of 8-10 starts January 2027 with support from Google and DTCC.

[Sovereign Tech Agency with Erik Möller](https://opensourcesecurity.io/2026/2026-08-erik-sta/) (Josh Bressers, Open Source Security): an interview with the STA's Director of Programs on the Sovereign Tech Fund, its maintainer fellowships, funding for standards-body participation, and the Sovereign Tech Resilience programme for security audits and post-quantum work.

[Introducing vulnbrocards.com](https://blog.yossarian.net/2026/08/31/Introducing-vulnbrocards-com) (William Woodruff): the vulnerability-triage brocards from earlier posts now each have a stable URL.

[Determining Value and Viability Using CHAOSS Practitioner Guides](https://fastwonderblog.com/2026/09/01/part-3-determining-value-and-viability-using-chaoss-practitioner-guides/) (Dawn Foster) is part three of the series, covering the Demonstrating Organizational Value and Assessing Viability guides for justifying open source contribution work to leadership and evaluating dependency risk.

[Tracking Trends in Open Source AI Policy](https://sunnydeveloper.com/tracking-trends-in-open-source-ai-policy/) (Emma Irwin) applies the CHAOSS AI Alignment working group's use-policy-specificity metric to 39 open source project AI policies: 25 address code contributions, none address environmental impact, infrastructure strain or notetaker bots.

GitHub added a [star history REST endpoint](https://github.blog/changelog/2026-09-04-new-api-endpoint-provides-privacy-safe-star-history-data) that returns timestamped aggregate star counts for a repository without listing the accounts that starred it.

The Cargo team put out a [call for testing](https://github.com/rust-lang/cargo/issues/14136#issuecomment-5519248462) for `-Zchecksum-freshness`, which detects the need to rebuild from file content checksums, replacing the mtime check. The plan is to stabilise it as `build.fingerprint = "content"` in `.cargo/config.toml`.

CERN is [migrating its 2,200 accelerator-control machines](https://www.phoronix.com/news/CERN-Goes-Debian-Leaving-RHEL) from RHEL to Debian 13 by the end of 2026. The announcement calls the `-march=x86-64-v2` compiler default forced obsolescence for older hardware and lists gaps in Debian's standard tooling for automated package building and publishing.

The recording of [Is the InnerSource Commons Good for Open Source?](https://youtu.be/J5XSQZNhwbc), the FOSS Backstage 2026 talk Ben Nickolls and I gave analysing 800 InnerSource Commons member companies, is now up.

FOSDEM 2027 [will be held](https://fosdem.org/2027/) on 30-31 January.

## git-pkgs

I tagged 23 repos this week:

- [git-pkgs v0.20.0](https://github.com/git-pkgs/git-pkgs/releases/tag/v0.20.0)
- [archives v0.7.0](https://github.com/git-pkgs/archives/releases/tag/v0.7.0)
- [artifacts v0.2.1](https://github.com/git-pkgs/artifacts/releases/tag/v0.2.1)
- [brief v0.13.0](https://github.com/git-pkgs/brief/releases/tag/v0.13.0)
- [capcheck v0.1.4](https://github.com/git-pkgs/capcheck/releases/tag/v0.1.4)
- [changelog v0.2.1](https://github.com/git-pkgs/changelog/releases/tag/v0.2.1)
- [clone v0.7.3](https://github.com/git-pkgs/clone/releases/tag/v0.7.3)
- [dependents v0.2.0](https://github.com/git-pkgs/dependents/releases/tag/v0.2.0)
- [distill v0.1.2](https://github.com/git-pkgs/distill/releases/tag/v0.1.2)
- [enrichment v0.7.1](https://github.com/git-pkgs/enrichment/releases/tag/v0.7.1)
- [forge v0.10.0](https://github.com/git-pkgs/forge/releases/tag/v0.10.0)
- [licenses v0.7.0](https://github.com/git-pkgs/licenses/releases/tag/v0.7.0)
- [magic v0.3.1](https://github.com/git-pkgs/magic/releases/tag/v0.3.1)
- [manifests v0.12.0](https://github.com/git-pkgs/manifests/releases/tag/v0.12.0)
- [outline v0.2.2](https://github.com/git-pkgs/outline/releases/tag/v0.2.2)
- [pin v0.2.1](https://github.com/git-pkgs/pin/releases/tag/v0.2.1)
- [provides v0.2.1](https://github.com/git-pkgs/provides/releases/tag/v0.2.1)
- [proxy v0.8.1](https://github.com/git-pkgs/proxy/releases/tag/v0.8.1)
- [purl v0.1.20](https://github.com/git-pkgs/purl/releases/tag/v0.1.20)
- [registries v0.9.1](https://github.com/git-pkgs/registries/releases/tag/v0.9.1)
- [sigstore v0.2.1](https://github.com/git-pkgs/sigstore/releases/tag/v0.2.1)
- [vers v0.7.0](https://github.com/git-pkgs/vers/releases/tag/v0.7.0)
- [vulns v0.2.3](https://github.com/git-pkgs/vulns/releases/tag/v0.2.3)

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
