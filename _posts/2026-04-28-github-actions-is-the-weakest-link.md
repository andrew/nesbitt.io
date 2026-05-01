---
layout: post
title: "GitHub Actions is the weakest link"
date: 2026-04-28 10:00 +0000
description: "Anne Robinson would like a word with .github/workflows"
tags:
  - github
  - security
  - package-managers
  - supply-chain
---

Pick almost any open source supply chain incident from the past eighteen months and trace it back, and you end up reading a `.github/workflows` YAML file. Ultralytics shipping a crypto miner to PyPI, the nx packages that turned thousands of developer machines into credential harvesters, tj-actions leaking secrets from 23,000 repositories, Trivy getting compromised twice in three weeks, elementary-data publishing a malicious wheel ten minutes after a stranger left a GitHub comment. Different headline payloads, different victims, and in each case a GitHub Actions feature behaving exactly as documented.

I [wrote in December](/2025/12/06/github-actions-package-manager.html) about the narrow problem of Actions being a package manager with no lockfile, no integrity hashes and no transitive visibility, and that the `uses:` line is a dependency declaration that the runner re-resolves on every execution against mutable git tags. That argument still stands and has since been demonstrated rather thoroughly in production, but it's only one face of a larger problem.

The whole product is a collection of features that are each convenient on their own and very easy to assemble into something dangerous, and the workflows building and publishing most of the world's open source run on a platform whose defaults were chosen for a private-repo enterprise CI tool and never really rethought for anonymous forks and drive-by pull requests.

### The incidents

The earliest link in the recent chain is [spotbugs](https://www.wiz.io/blog/github-action-tj-actions-changed-files-supply-chain-attack-cve-2025-30066) in November 2024, which had a workflow on the `pull_request_target` trigger that checked out and built code from an untrusted fork. That trigger exists so that workflows can do things like label PRs from forks, and to make that work it runs in the context of the base repository with full secret access and a write-scoped token.

Combining it with a checkout of the fork's `head.sha` hands an attacker code execution inside your trust boundary, which is what happened: a malicious PR lifted a maintainer's PAT, that PAT had access to reviewdog, and four months later the same actor used it to seed the [tj-actions/changed-files compromise](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/). GitHub's own documentation has [warned about this combination since 2021](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/) and still ships the trigger with no guardrail beyond a paragraph in the docs.

A month after spotbugs, [Ultralytics](https://blog.yossarian.net/2024/12/06/zizmor-ultralytics-injection) was hit through the same trigger with a different second stage. The fork PR couldn't reach the publishing credentials directly, so instead it poisoned a GitHub Actions cache entry, and when the legitimate release workflow later restored that cache it executed the payload while building wheels. Two versions of `ultralytics` reached PyPI with a miner inside.

The cache is keyed by branch and shared down to children, the `pull_request_target` job runs as the default branch, and nothing in the UI or the API tells you that an entry was written by a job processing untrusted input.

The tj-actions incident in March 2025 is the one most people have heard of because [CISA put out an advisory](https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-tj-actionschanged-files-cve-2025-30066-and-reviewdogaction) and because the original target turned out to be [Coinbase](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/). With the PAT harvested from spotbugs the attacker pushed a malicious commit to `reviewdog/action-setup` and moved the `v1` tag to point at it. `tj-actions/eslint-changed-files` referenced reviewdog by tag, `tj-actions/changed-files` referenced that, and 23,000 downstream repositories referenced `changed-files` by tag. Every one of them ran a memory scraper that dumped runner secrets into public build logs.

The platform feature at fault is that action versions are git refs in someone else's repository, force-pushable by anyone with write access to that repository, and consumed by default through a moving tag rather than a content hash.

Unpinned tags are by far the most common finding in any scan of public workflows, but I suspect a good chunk of that risk could be closed inside the action loader without anyone editing their YAML. GitHub stores a repository and all its forks in one shared object pool, and the runner resolves `uses: owner/action@<ref>` against anything in that pool, so a SHA that only exists in a stranger's fork, never reviewed and never on an upstream branch, is fetchable through the parent's namespace as if the maintainers had put it there. Chainguard [documented this as "imposter commits"](https://www.chainguard.dev/unchained/what-the-fork-imposter-commits-in-github-actions-and-ci-cd) back in 2022.

The malicious tj-actions commit was a dangling object that [didn't belong to any branch](https://www.stepsecurity.io/blog/the-github-warning-everyone-ignores-this-commit-does-not-belong-to-any-branch) in the repository, and the runner executed it anyway because a tag pointed at it. Having the loader verify that a resolved SHA is reachable from a branch in the canonical repo, rather than just present somewhere in the fork network, would make tag hijacking need a real push to a real branch and would make a SHA pin actually mean the code had been in the upstream at some point.

August brought [s1ngularity](https://www.wiz.io/blog/s1ngularity-supply-chain-attack), where the nx build system's repository had a `pull_request_target` workflow that interpolated the pull request title into a shell step. The {% raw %}`${{ }}`{% endraw %} template syntax expands before the shell sees the script, so a PR titled with a command substitution becomes code, and because of the trigger that code ran with an npm publishing token in scope.

The malicious nx releases that followed went looking for AI coding assistant credentials on developer machines and used them to enumerate and exfiltrate private repositories, which is how a single unsanitised string in a CI workflow ended up with [over five thousand private repos briefly made public](https://www.wiz.io/blog/s1ngularity-supply-chain-attack).

By 2026 attackers had stopped finding these one at a time and started running campaigns. The [prt-scan operation](https://ebuildersecurity.com/cyber-news/prt-scan-ai-github-actions-supply-chain-attack-2026/) spent six weeks across March and April opening hundreds of pull requests against repositories with `pull_request_target` misconfigurations, rotating through throwaway accounts and using generated, language-appropriate diffs to look like plausible contributions until the workflow fired.

Around the same time [Trivy's action repository was compromised](https://snyk.io/articles/trivy-github-actions-supply-chain-compromise/) through, again, a `pull_request_target` workflow, which an attacker found in late February. Aqua cleaned up, but the credential rotation wasn't atomic, and three weeks later the same actor used tokens harvested in the first round to [force-push 76 of 77 historical version tags](https://www.stepsecurity.io/blog/trivy-compromised-a-second-time---malicious-v0-69-4-release) so that even users pinned to an old "known good" `@0.x.y` ran the credential stealer.

Then last week a GitHub account two days old [left a comment](https://www.stepsecurity.io/blog/elementary-data-compromised-on-pypi-and-ghcr-forged-release-pushed-via-github-actions-script-injection) on an old elementary-data pull request. The repository had a workflow listening on `issue_comment` that echoed `${{ github.event.comment.body }}` into bash, the comment body closed the echo string and curled a stager, and because the workflow had no `permissions:` block the stager got a write-scoped `GITHUB_TOKEN` by default. It pushed a commit with a forged `github-actions[bot]` author, dispatched the existing release workflow, and put a credential-stealing wheel on PyPI and a matching image on GHCR within ten minutes, without any maintainer accepting a PR or clicking a button or being awake.

### Common factors

I don't think any of the maintainers above were doing anything unusual, for what it's worth. These workflows look like the examples in GitHub's docs and like thousands of other repos.

Laying the incidents out side by side, the same GitHub Actions features keep recurring: `pull_request_target` and `issue_comment` triggers that run untrusted-event workflows with full secrets, {% raw %}`${{ }}`{% endraw %} expansion that does textual substitution into shell scripts with no quoting, a `GITHUB_TOKEN` that defaults to write on any repo created before February 2023, action versions that are mutable git refs, and a cache that crosses trust boundaries silently.

None of these are bugs in the strict sense, and as far as I can tell none of them are going away. A few have grown warnings in the documentation, and `pull_request_target` got a [behavioural tweak last November](https://github.blog/changelog/2025-11-07-actions-pull_request_target-and-environment-branch-protections-changes/) so it always reads the workflow file from the default branch, but the change that would have stopped most of the list above, which is simply not handing write tokens and secrets to workflows triggered by people who've never been near the repo, hasn't happened.

The vulnerable workflow at the root of each of these trips at least one audit in [zizmor's](https://docs.zizmor.sh/) default ruleset: `dangerous-triggers` for spotbugs, Ultralytics, nx, prt-scan and Trivy, `cache-poisoning` for the Ultralytics escalation, `unpinned-uses` for everyone downstream of tj-actions and Trivy, `template-injection` for nx and elementary-data, `excessive-permissions` for the default-write token that turned the elementary-data injection into a release. The elementary-data one was sitting in my own results from running zizmor across every PyPI package's workflows for an upcoming talk, marked High/High three weeks before the comment was posted.

Adding `zizmorcore/zizmor-action` to a repository takes about four lines of YAML and is probably the single most useful thing a maintainer can do about this today, short of moving off GitHub Actions entirely, which I'd also understand. I mean that as a strong endorsement of the tool, but it's a slightly uncomfortable thing to say about the platform when the best available defence for GitHub Actions is a third-party linter maintained largely by [one person](https://github.com/woodruffw) that catches footguns GitHub put there and could remove.

### Trusted publishing

The reason I keep worrying at this rather than any of the dozen other places a package can be compromised is that the package registries have collectively decided to bet on it. PyPI, npm, RubyGems and crates.io have all adopted OIDC-based trusted publishing from CI, specifically to get long-lived API tokens out of repository secrets, and that's a real improvement over a `PYPI_API_TOKEN` sitting in a repo for years and eventually turning up in someone's dotfiles. But it means the integrity guarantee of those registries is now roughly as strong as the GitHub Actions workflow that holds the `id-token: write` permission.

We've spent a decade hardening package managers with lockfiles, 2FA mandates, signatures, audit logs and provenance attestations, and the net effect of wiring all of that to OIDC has been to take trust we used to spread across thousands of individual maintainer credentials and concentrate it on one CI platform that has none of those properties itself. There are other trusted publisher identity providers, GitLab and Google Cloud Build among them, but in practice the overwhelming majority of OIDC publishes to the big registries come from GitHub-hosted runners. An attacker who wants to get something malicious onto PyPI or npm today is, more often than not, looking at workflow files rather than phishing maintainers, which puts rather a lot of weight on GitHub to get this right.

### GitHub's response

GitHub did publish a [security roadmap](https://github.blog/news-insights/product-news/whats-coming-to-our-github-actions-2026-security-roadmap/) last month, and to their credit it contains real fixes: a workflow lockfile that pins direct and transitive action dependencies to SHAs, policy controls that can ban `pull_request_target` outright, secrets scoped to specific workflows rather than whole repos, an egress firewall on hosted runners. It's the framing I find frustrating, because everything is opt-in, everything is "public preview in three to six months", and the lockfile arrives roughly three years after [the issue asking for it was closed as not planned](https://github.com/actions/runner/issues/2195). Meanwhile the [community discussion on secure-by-default Actions](https://github.com/orgs/community/discussions/179107) is full of GitHub staff explaining that changing defaults would break existing workflows, which is true, and I do understand the bind they're in.

I'd argue breaking existing workflows is rather the point though, because the existing workflows are what keeps going wrong: 91% of PyPI packages that use third-party actions reference at least one by mutable tag, two thirds have no `permissions:` block on at least one workflow, and a year after tj-actions there are still hundreds of packages pointing at it by tag. Opt-in security features get adopted by the projects that were already paying attention and ignored by the long tail of repos whose maintainers reasonably assume the platform defaults are safe.

For private repositories there's a fair argument for caution, since a broken internal pipeline mostly hurts the people who own it. Public repositories building artefacts that get published to package registries and pulled by millions of downstream users feel like a different risk calculus to me, not least because the people who'd be inconvenienced by a defaults flip and the people currently getting compromised are largely different populations. I think GitHub could justify treating the two cases differently.

There are a handful of changes I'd happily trade some broken builds for. Flip the token default to read-only for every public repo regardless of creation date, refuse to expand `github.event.*` inside `run:` steps, refuse to restore caches in jobs on `pull_request_target`, require immutable references for actions in any workflow that requests `id-token: write`. Each of those would break things and annoy people, and each would have taken at least one of the incidents above off the board.

Until GitHub is willing to make changes that break things, run zizmor, pin your SHAs, set `permissions: {}` at the top of every workflow file, and assume that anything an unauthenticated user can put in a PR title, branch name or issue comment will eventually be a shell script. Otherwise sooner or later it's your repo that's the weakest link. Goodbye.[^1]

[^1]: For anyone who didn't spend the early 2000s watching British daytime telly: [The Weakest Link](https://en.wikipedia.org/wiki/The_Weakest_Link_(British_game_show)).

---

**Incidents referenced:**

- [spotbugs `pull_request_target` to reviewdog to tj-actions chain](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/), Nov 2024 - Mar 2025
- [Ultralytics cache poisoning](https://blog.yossarian.net/2024/12/06/zizmor-ultralytics-injection), Dec 2024
- [tj-actions/changed-files CVE-2025-30066](https://www.wiz.io/blog/github-action-tj-actions-changed-files-supply-chain-attack-cve-2025-30066) and [reviewdog/action-setup CVE-2025-30154](https://www.wiz.io/blog/new-github-action-supply-chain-attack-reviewdog-action-setup), Mar 2025
- [CISA advisory on tj-actions/reviewdog](https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-tj-actionschanged-files-cve-2025-30066-and-reviewdogaction)
- [nx / s1ngularity](https://www.wiz.io/blog/s1ngularity-supply-chain-attack), Aug 2025
- [Trivy action compromise](https://snyk.io/articles/trivy-github-actions-supply-chain-compromise/) and [second-round tag hijack](https://www.stepsecurity.io/blog/trivy-compromised-a-second-time---malicious-v0-69-4-release), Feb-Mar 2026
- [prt-scan `pull_request_target` campaign](https://ebuildersecurity.com/cyber-news/prt-scan-ai-github-actions-supply-chain-attack-2026/), Mar-Apr 2026
- [elementary-data comment injection](https://www.stepsecurity.io/blog/elementary-data-compromised-on-pypi-and-ghcr-forged-release-pushed-via-github-actions-script-injection), Apr 2026
- [Orca "pull_request_nightmare" research](https://orca.security/resources/blog/pull-request-nightmare-github-actions-rce/)
- [Chainguard: imposter commits in GitHub Actions](https://www.chainguard.dev/unchained/what-the-fork-imposter-commits-in-github-actions-and-ci-cd)
- [StepSecurity: "This commit does not belong to any branch"](https://www.stepsecurity.io/blog/the-github-warning-everyone-ignores-this-commit-does-not-belong-to-any-branch)
- [Sysdig: insecure Actions in MITRE, Splunk et al.](https://www.sysdig.com/blog/insecure-github-actions-found-in-mitre-splunk-and-other-open-source-repositories)
