---
layout: post
title: "GitHub Actions security in Python packages"
date: 2026-05-25 10:00 +0000
description: "Thank you Dr. Zizmor"
tags:
  - security
  - supply-chain
  - python
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mnklpseafh2e"
---

_This is a written version of a talk I gave at PyCon US 2026 in Long Beach. [Slides (PDF)](https://github.com/andrew/pycon/raw/main/slides.pdf), scripts, and datasets are at [github.com/andrew/pycon](https://github.com/andrew/pycon)._

Of the roughly 864,000 packages PyPI lists, about 387,000 declare a repository URL on GitHub, mapping to 343,000 distinct repositories once you collapse the monorepos. 152,000 of those have something in `.github/workflows/`, and for practical purposes open source Python has one CI system: Travis CI, the previous default, accounts for 11% of the same population and stopped offering free open source builds in 2023, with everything else below 2%.

Around 56,000 of those repositories reference `pypa/gh-action-pypi-publish` somewhere in a workflow file, which is to say they tag a commit, a runner spins up, a wheel gets built, and `twine upload` puts it on PyPI. About 22% of them have migrated to [trusted publishing](https://docs.pypi.org/trusted-publishers/), where PyPI accepts a short-lived OIDC token minted by the workflow instead of a stored API key, and the publisher configuration on PyPI's side names the repository, the workflow file, and optionally a deployment environment. The other 44,000 or so still have a `PYPI_API_TOKEN` sitting in repository secrets.

I think trusted publishing is one of the better things to have happened to Python packaging in years, and it also means the workflow's identity is now the credential, so PyPI's trust in a release rests on the integrity of an Actions run. [PEP 740](https://peps.python.org/pep-0740/) attestations, Sigstore signatures, and SLSA provenance all bind an artifact to the workflow and commit it came from, which tells you where it was built but says nothing about whether something tampered with the workflow before the upload step ran. Signing is the last thing that happens, so every preceding step is in scope for an attacker who can reach any of them, which is the argument I made at length in [GitHub Actions is the weakest link](/2026/04/28/github-actions-is-the-weakest-link.html) last month.

### Actions as a package manager

A `uses:` line in a workflow is a dependency declaration that pulls code from somebody else's repository and runs it on your runner with whatever permissions the job has, which is functionally `pip install` except that the thing after the `@` is a git ref rather than an immutable version, and whoever controls the source repository can move it.

```
git tag -f v41 <new-sha>
git push -f origin v41
```

After those two commands every workflow on `@v41` runs the new commit on its next execution, including re-runs of last week's green build. There's no lockfile recording which SHA you accepted yesterday, nothing equivalent to `--require-hashes`, and a hijacked tag stays hijacked until somebody force-pushes it back because there's no [PEP 592](https://peps.python.org/pep-0592/) yank either. Composite actions resolve their own `uses:` lines at runtime, so an action you've pinned to a SHA can still pull `other/helper@main` internally and you'd never see it from your own workflow file. The longer version of that argument is the [December post](/2025/12/06/github-actions-package-manager.html); what's changed since is that the list of incidents demonstrating it in production has reached ten, six of which end with a malicious wheel on PyPI.

| When | Project | Compromise |
|---|---|---|
| Nov 2024 | spotbugs | `pull_request_target` ran fork code, maintainer PAT stolen |
| Dec 2024 | Ultralytics | cache poisoning from fork PR -> crypto miner on PyPI |
| Mar 2025 | tj-actions / reviewdog | tags force-pushed, secrets dumped from ~23k repos |
| Mar 2026 | Trivy | `pull_request_target` ran fork code, CI tokens harvested |
| Mar 2026 | Trivy (again) | 75 of 76 tags force-pushed three weeks later with stolen tokens |
| Mar 2026 | LiteLLM | PyPI token harvested via Trivy chain -> malicious wheel |
| Mar 2026 | Telnyx | PyPI token harvested via Trivy chain -> malicious wheel |
| Apr 2026 | elementary-data | issue comment -> shell injection -> malicious wheel |
| Apr 2026 | lightning | stale long-lived token, no OIDC -> malicious wheel |
| May 2026 | mistralai, guardrails-ai | cache poison + OIDC token theft -> malicious wheels |

Five of those six PyPI uploads are from March to May this year. The lightning row is the useful counter-example, since nothing was wrong with that workflow; it had a long-lived API token that leaked through some other route, and trusted publishing on its own would have stopped it. elementary-data and the mistralai chain are the opposite case, where trusted publishing was configured or wouldn't have helped, because the attacker ended up holding a valid OIDC token minted by the real workflow. LiteLLM, Telnyx, and Ultralytics sit in between, with stored tokens stolen from a runner that an Actions misconfiguration let the attacker reach.

[Ultralytics](https://blog.pypi.org/posts/2024-12-11-ultralytics-attack-analysis/) is worth walking through in detail because it stacks three failure modes in one incident. A `pull_request_target` workflow checked out and ran code from a fork PR with the cache write permission in scope, and the fork's branch name interpolated into a shell step, which gave the attacker enough to poison a GitHub Actions cache entry. The legitimate publish workflow later restored that cache, built a wheel containing a crypto miner, and uploaded it to PyPI as 8.3.41 and 8.3.42 using a stored token. Then, because the token had already been lifted from the runner during phase one, two more malicious versions were uploaded directly without touching CI at all. The template injection bug had been [reported and patched](https://blog.yossarian.net/2024/12/06/zizmor-ultralytics-injection) in August 2024 and reintroduced in a regression ten days after the advisory.

### Method

What turns this from a list of anecdotes into something you can study is [zizmor](https://docs.zizmor.sh/), William Woodruff's static analyser for Actions workflows, which reads `.github/workflows/` and reports findings as named audits with a severity and a confidence, running locally or in CI in a couple of seconds.

I took the [ecosyste.ms](https://ecosyste.ms) index of every PyPI package with a linked GitHub repository, shallow-cloned each one, ran `zizmor --format=json` on the workflows directory, and separately extracted every `uses:` line into an actions inventory, with both outputs going into SQLite. The scan ran 9-11 May 2026 with zizmor pinned to 1.24.1. About 20% of the linked repository URLs failed to clone (404, gone private, or renamed without a redirect), and those packages still `pip install` fine even though their source is no longer publicly readable, which probably deserves its own write-up.

zizmor reads YAML files and nothing else. It can't see if a repository's "Workflow permissions" default has been flipped to read-only in the settings UI, or if a secret is environment-scoped behind a required reviewer, or if branch protection would stop the push that an injection would otherwise enable. Read the numbers below as counting workflows whose YAML permits a pattern, which is an upper bound on what's exploitable today.

### Findings

There are currently 49 advisories filed under `ecosystem:actions` in the GitHub Advisory Database. Bucketing them against zizmor's audit names and counting affected PyPI repositories gives this:

| Audit | PyPI repos | GHSA advisories |
|---|---:|---:|
| `excessive-permissions` | 102,235 | 6 |
| `unpinned-uses` | 85,774 | 4 |
| `use-trusted-publishing` | 44,181 | n/a |
| `template-injection` | 21,166 | 27 |
| `cache-poisoning` | 15,371 | 2 |
| `dangerous-triggers` | 7,025 | 8 |

The advisory column counts how often each audit class has been the documented root cause of a published compromise, which is a different thing from how dangerous a single finding is. An `excessive-permissions` finding on its own is harmless, and a `template-injection` on its own often is too, so most of what follows reads better as combinations of audits than as a ranking; those two together, for instance, are how somebody else gets a release out of your repository.

`excessive-permissions` fires when a workflow has no `permissions:` block, so the job's `GITHUB_TOKEN` inherits the repository default. For any repository created before February 2023 that default includes `contents: write` and `actions: write`, which means a step compromised by any other means can push commits and dispatch other workflows. About two thirds of the corpus, 102,000 repositories, have at least one workflow in this state, and `permissions: {}` at the top of the file with explicit grants per job closes it.

`unpinned-uses` is in about 86,000 repositories, which is 91% of those that use any third-party action at all. The four advisories in this bucket are exactly the four known tag-hijack compromises: tj-actions, reviewdog, Trivy, and xygeni. A month after the second Trivy compromise 403 PyPI packages were still on `aquasecurity/trivy-action` by tag, and 336 are still referencing `tj-actions/changed-files` by a moveable ref a full year after CVE-2025-30066. The fix is a 40-character commit SHA after the `@`, which both Dependabot and Renovate will keep up to date for you. `zizmor --fix=all` rewrites every tag in a repo to its current SHA in place, given a `GH_TOKEN`. Pinning `actions/*` itself is mostly a wash, since GitHub's own organisation being compromised already invalidates the runner image you're executing on.

`template-injection` accounts for 27 of the 49 published advisories, the majority of the table, and about 21,000 PyPI repositories have at least one. The pattern is a {% raw %}`${{ }}`{% endraw %} expression containing attacker-influenced data interpolated into a `run:` block. The expansion happens before the shell parses the script, so a PR title or branch name or issue body becomes shell source. In the [elementary-data](https://www.stepsecurity.io/blog/elementary-data-compromised-on-pypi-and-ghcr-forged-release-pushed-via-github-actions-script-injection) case an `issue_comment` trigger echoed `github.event.comment.body` into bash, and an account created two days earlier left a comment that closed the echo and appended `curl | bash`. Because there was no `permissions:` block the default `GITHUB_TOKEN` was write-scoped, and ten minutes after the comment there was a malicious 0.23.3 on PyPI exfiltrating SSH keys and cloud credentials.

That repository was already in my dataset when it happened, and zizmor had flagged the exact line three weeks earlier with three separate audits, any one of which would have broken the chain if remediated. Narrowing the 21,000 repositories down to those where the interpolated expression actually carries attacker-controlled data gives 1,396, and filtering those for triggers like `issues` and `issue_comment` where secrets are always in scope leaves 99. After deduplicating shared monorepos and checking job-level permissions, ten of those have a write-scoped token in the same job as a stored PyPI credential. All ten are going through coordinated disclosure and aren't named here. The fix for all of them is to pass the value through `env:` and reference the shell variable, which carries the same data without the pre-parse expansion.

`use-trusted-publishing` is in about 44,000 repositories, roughly 78% of `gh-action-pypi-publish` users, and has no GHSA advisories because nobody files a CVE for storing a long-lived token, though that token is what makes the other audits worth an attacker's time. The largest packages still on stored tokens include `six` at 896M monthly downloads, `fsspec` at 616M, `pyasn1` at 430M, `tomli` at 377M, `greenlet` at 337M, and `sqlalchemy` at 335M. One caveat is that PyPI's trusted publishing [doesn't yet support reusable workflows](https://github.com/pypi/warehouse/issues/11096), so packages publishing through something like Speakeasy's shared release workflow have a legitimate excuse. zizmor also misses those callers entirely because the `twine upload` lives in a different repository, and `mistralai` was one of them, which is why it wasn't among the 44,000 despite having a stored token and partly why it ended up in the incidents table instead.

`cache-poisoning` fires for about 15,000 repositories where a privileged job restores from a cache namespace that a lower-privilege job can write into, with Ultralytics as one of the two published advisories. The May 2026 [mistralai and guardrails-ai compromise](https://x.com/MsftSecIntel/status/2054041471280423424) was the same shape on the entry side: a `pull_request_target` job ran fork code, the fork code poisoned a cache, the publish workflow restored it, and the cached code lifted the runner's OIDC token from memory. Trusted publishing didn't help because the workflow had a legitimate `id-token: write` and the attacker was already executing inside it. 1,348 PyPI repositories have `dangerous-triggers` and `cache-poisoning` findings together, which is the population that exact chain applies to, and the remediation in every case is to not restore caches in jobs that build or publish artifacts.

`dangerous-triggers` is the smallest of the six at about 7,000 repositories with eight advisories. It fires on `pull_request_target` and `workflow_run`, both of which run in the base repository's context with secrets available, and the usual mistake is to then check out the PR's head and run its tests. The [spotbugs](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/) PAT theft that started the reviewdog and tj-actions chain four months later was this pattern, as was the Ultralytics entry point and the [Trivy](https://snyk.io/articles/trivy-github-actions-supply-chain-compromise/) entry point. For most workflows the answer is plain `pull_request`, where fork PRs get a read-capped token and no secrets, and the cases that do need `pull_request_target` should never check out the PR head and never restore caches.

`archived-uses` isn't in the table above because there are no advisories against it, but it catches about 3,600 repositories depending on at least one action whose maintainer has archived it on GitHub. `actions/create-release` is the standout, in nearly 2,000 repositories at 98.7% unpinned, archived by GitHub itself in March 2021. I wrote about this shape, dependencies that still install but that nobody is fixing any more, in [Weekend at Bernie's](/2026/05/08/weekend-at-bernies.html) a couple of weeks ago, and `actions/create-release` is one of the more on-the-nose Bernies in the dataset.

### Who Python CI depends on

Alongside the audit findings, extracting every `uses:` line gives an inventory of who Python's CI actually depends on. `pypa/gh-action-pypi-publish` is in about 56,000 repositories at 84% unpinned, `codecov/codecov-action` in 21,000 at 92%, `astral-sh/setup-uv` in 17,000 at 86%, then `softprops/action-gh-release`, `pre-commit/action`, the docker actions, and `pypa/cibuildwheel`. After the first few names the owners are increasingly individuals (`softprops`, `peter-evans` with sixteen separate actions, `dtolnay`, `ncipollo`, `JamesIves`), each a single account whose key compromise would propagate across thousands of dependents.

zizmor's audits stop at the workflow YAML, leaving what an action does at runtime as a separate question, so as a one-action case study I looked harder at `pypa/cibuildwheel`, which is in about 2,700 publish workflows and already runs zizmor on itself with one Low finding. Its `action.yml` is a thin composite wrapper around `python -m cibuildwheel`, and that Python code fetches CPython, PyPy, GraalPy, virtualenv, Node.js, nuget, and python-build-standalone from seven different upstream hosts at runtime over HTTPS with no hash pin, a transitive dependency tree that doesn't appear in any `action.yml` and that every consuming workflow inherits without seeing. The other popular composites I checked either pin their internal `uses:` to SHAs or only call `actions/*`, with a few long-tail counterexamples that pull third-party actions by tag from inside the composite definition.

Slicing for third-party actions that run in the same job as `pypa/gh-action-pypi-publish` narrows the picture again.

| Action | Publish jobs | Unpinned |
|---|---:|---:|
| `astral-sh/setup-uv` | 3,819 | 90.5% |
| `softprops/action-gh-release` | 2,448 | 93.7% |
| `python-semantic-release/python-semantic-release` | 451 | 87.0% |
| `snok/install-poetry` | 381 | 95.9% |
| `salsify/action-detect-and-tag-new-version` | 265 | 99.6% |

A tag hijack on any of those would run alongside PyPI credentials across hundreds or thousands of packages. Astral at the top of that list is a funded company with a security team, but everything below it is back to individual maintainers, which is a different risk profile even at the same unpinned percentage. The one outlier further down the list is `step-security/harden-runner` at 144 publish jobs and 2.4% unpinned, an order of magnitude better than anything else on the list, which mostly tells you that the people already running an Actions security tool are also the people who pin.

### GitHub's roadmap

Python packaging spent fifteen years building the controls that Actions doesn't have. A `requirements.txt` with `--require-hashes`, a `uv.lock`, or a [PEP 751](https://peps.python.org/pep-0751/) lockfile means yesterday's resolution is tomorrow's install regardless of what tags moved upstream. [PEP 592](https://peps.python.org/pep-0592/) yanking lets a maintainer pull a release so resolvers stop selecting it, where in Actions a hijacked tag stays live until somebody force-pushes it back, and the tj-actions tags were malicious for hours before that happened.

GitHub published a [2026 security roadmap](https://github.blog/news-insights/product-news/whats-coming-to-our-github-actions-2026-security-roadmap/) in March that announces workflow dependency locking for direct and transitive action SHAs, policy controls that can ban `pull_request_target` outright at the organisation level, secrets scoped so repository write access no longer implies secret access, and an egress firewall for hosted runners. None of these has a committed ship date and the document reads as a statement of intent more than a release plan, but the locking feature is the lockfile, arriving roughly thirteen years after pip got `--require-hashes`. The roadmap doesn't mention malware detection on the marketplace, a yank or recall mechanism, CVE alerts for actions you depend on, or any enforcement by default, all of which PyPI already has in some form.

### Hardening a publish workflow

If you maintain a Python package that publishes from Actions, the change with the best ratio of effort to effect is migrating to trusted publishing with a deployment environment, where the environment has either required reviewers or a branch restriction, and the trusted publisher on PyPI is bound to the environment name.

```yaml
jobs:
  pypi-publish:
    environment: release
    permissions:
      id-token: write
    steps:
      - uses: actions/download-artifact@v4
      - uses: pypa/gh-action-pypi-publish@release/v1
```

OIDC on its own removes the long-lived credential, but it's the environment binding that stops the elementary-data pivot, where an injected step with `actions: write` dispatches the real publish workflow and gets a valid OIDC token because the workflow filename and repository claims still match. The [intercom-client compromise](https://www.upwind.io/feed/intercom-client-7-0-4-supply-chain-attack) in April, on npm rather than PyPI but the mechanism is registry-agnostic, was `id-token: write` on a tag-push trigger with no environment configured: attacker pushed a tag, the workflow ran, the OIDC token was valid, and the workflow run was deleted afterwards so the audit trail went with it. The mistralai compromise is the third variant: code already executing inside the publish job can mint the OIDC token from runner memory regardless of environment, which is the case the environment binding can't close and the reason keeping the publish job minimal and not restoring caches in it matter independently.

Inside the workflow file, `permissions: {}` at the top with explicit grants per job removes the write-by-default inheritance. Third-party actions get pinned to a 40-character SHA (`zizmor --fix=all` will do the whole repo in one pass), with Dependabot or Renovate keeping the pins current. {% raw %}`${{ github.event.* }}`{% endraw %} values referenced inside `run:` blocks go through `env:` instead. The publish job itself can be `actions/checkout`, `actions/download-artifact`, and `pypa/gh-action-pypi-publish`, with the wheel built in a separate job that hands the artifact across. A hijack of any third-party action then never runs in the same process as the publish credential.

Wiring zizmor into CI is four lines:

```yaml
name: zizmor
on: [push, pull_request]
permissions: {}
jobs:
  zizmor:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - uses: zizmorcore/zizmor-action@v0
```

Findings show up on the PR and in the Security tab, and the check fails by default. As proof that zero findings is achievable on a real project, `requests`, `pytest`, `stamina`, `flask`, `django`, and `boto3` all currently scan clean on their default branches, and their release workflows are reasonable templates to copy.

I've been re-scanning the PyPI critical set at intervals to see whether publicised incidents change behaviour.

| Audit | 6 Apr | 28 Apr | 11 May |
|---|---:|---:|---:|
| `unpinned-uses` | 7,446 | 6,320 | 6,406 |
| `artipacked` | 2,755 | 2,337 | 2,376 |
| `excessive-permissions` | 2,186 | 1,887 | 1,900 |

The first interval spans the second Trivy compromise and elementary-data, and finding counts dropped roughly fifteen percent across the board, with `apispec`, `awscli`, and `babel` going to zero entirely. The second interval had no comparable incident in the news and the numbers are flat to slightly up. Maintainers respond to compromises they see in their feeds and then attention moves on, which is roughly what you'd expect, and the argument for putting the check in CI as a blocking step is that it runs on every change without anyone having to remember.

Thanks to [William Woodruff](https://github.com/woodruffw) for building and maintaining zizmor, without which none of this analysis would have been possible, and for fielding a lot of questions while I was putting it together. zizmor is largely one person's work; if it saves you an incident, or you'd just rather the best available defence for the dominant open source CI platform wasn't running on one volunteer's spare time, please consider supporting him through [GitHub Sponsors](https://github.com/sponsors/woodruffw), [thanks.dev](https://thanks.dev/u/gh/woodruffw), or [ko-fi](https://ko-fi.com/woodruffw).

---

**Incidents referenced:**

- [spotbugs -> reviewdog -> tj-actions chain](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/), Nov 2024 - Mar 2025
- [Ultralytics cache poisoning](https://blog.yossarian.net/2024/12/06/zizmor-ultralytics-injection) and [PyPI's analysis](https://blog.pypi.org/posts/2024-12-11-ultralytics-attack-analysis/), Dec 2024
- [tj-actions/changed-files CVE-2025-30066](https://www.wiz.io/blog/github-action-tj-actions-changed-files-supply-chain-attack-cve-2025-30066), Mar 2025
- [CISA advisory on tj-actions/reviewdog](https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-tj-actionschanged-files-cve-2025-30066-and-reviewdogaction)
- [Trivy action compromise](https://snyk.io/articles/trivy-github-actions-supply-chain-compromise/) and [second-round tag hijack](https://www.stepsecurity.io/blog/trivy-compromised-a-second-time---malicious-v0-69-4-release), Feb-Mar 2026
- [LiteLLM and Telnyx via the Trivy chain](https://blog.pypi.org/posts/2026-04-02-incident-report-litellm-telnyx-supply-chain-attack/) and [Datadog's TeamPCP write-up](https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/), Mar 2026
- [elementary-data comment injection](https://www.stepsecurity.io/blog/elementary-data-compromised-on-pypi-and-ghcr-forged-release-pushed-via-github-actions-script-injection), Apr 2026
- [lightning credential stealer](https://www.stepsecurity.io/blog/lightning-obfuscated-javascript-credential-stealer-bundled-in-pypi-wheel) and [intercom-client OIDC bypass on npm](https://www.upwind.io/feed/intercom-client-7-0-4-supply-chain-attack), Apr 2026
- [mistralai / guardrails-ai compromise](https://x.com/MsftSecIntel/status/2054041471280423424) and [CSA Mini Shai-Hulud research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-mini-shai-hulud-multi-ecosystem-supply-cha/), May 2026
