---
layout: post
title: "Forge-Specific Repository Folders"
date: 2026-02-22 10:00 +0000
description: "Magic folders in git forges: what .github/, .gitlab/, .gitea/, .forgejo/ and .bitbucket/ do."
tags:
  - git
  - reference
---

Git doesn't know about CI, code review, or issue templates, but every forge that hosts git repositories has added these features through the same trick: a dot-folder in your repo root that the forge reads on push. The folder names differ, the contents overlap in some places and diverge in others, and the portability story between them is worse than you'd expect. A companion to my earlier post on [git's magic files](/2026/02/05/git-magic-files.html).

### .github/

GitHub's folder holds:

- **workflows/** — GitHub Actions CI/CD configuration (`.github/workflows/*.yml`)
- **ISSUE_TEMPLATE/** and **PULL_REQUEST_TEMPLATE/** — issue and PR templates
- **dependabot.yml** — automated dependency updates
- **CODEOWNERS** — required reviewers for paths
- **FUNDING.yml** — sponsor button configuration

GitHub also reads some files from the repo root or from `.github/`: **SECURITY.md**, **CONTRIBUTING.md**, **CODE_OF_CONDUCT.md**. **LICENSE** must be in the repo root for GitHub's license detection to pick it up.

The `.github/workflows/` directory contains YAML files defining Actions workflows. Each file is a separate workflow that runs on events like push, pull request, or schedule.

CODEOWNERS uses [gitignore-style](/2026/02/12/the-many-flavors-of-ignore-files.html) glob patterns to map paths to GitHub users or teams who must review changes:

```
# .github/CODEOWNERS
*.js @frontend-team
/docs/ @docs-team
* @admins
```

### .gitlab/

GitLab uses `.gitlab/` for:

- **ci/** — reusable CI/CD templates
- **merge_request_templates/** — MR templates
- **issue_templates/** — issue templates
- **CODEOWNERS** — approval rules
- **changelog_config.yml** — built-in changelog generation config

GitLab's main CI config is `.gitlab-ci.yml` at the repo root, not in the folder. Projects often keep reusable CI templates in `.gitlab/ci/` and pull them in with `include:local`, though the directory name is convention rather than something GitLab treats specially.

GitLab's CODEOWNERS works similarly to GitHub's but with different approval rule options and integration with GitLab's approval workflows.

### .gitea/ and .forgejo/

Gitea and Forgejo (a fork of Gitea) support:

- **workflows/** — Gitea/Forgejo Actions (`.gitea/workflows/*.yml` or `.forgejo/workflows/*.yml`)
- **ISSUE_TEMPLATE/** and **PULL_REQUEST_TEMPLATE/** — templates

Forgejo checks `.forgejo/` then `.gitea/` then `.github/` in that order, while Gitea checks `.gitea/` then `.github/`, so you can keep shared config in `.github/` and add platform-specific overrides in the forge's own folder.

Gitea's CODEOWNERS uses Go regexp instead of gitignore-style globs. Patterns look like `.*\.js$` instead of `*.js`.

### .bitbucket/

Bitbucket keeps two files in `.bitbucket/`:

- **CODEOWNERS** — required reviewers
- **teams.yaml** — ad-hoc reviewer groups

CI config lives at `bitbucket-pipelines.yml` in the repo root, similar to GitLab's approach.

Bitbucket's CODEOWNERS has reviewer selection strategies baked into the syntax:

```
# .bitbucket/CODEOWNERS
*.js random(1) @frontend-team
/api/ least_busy(2) @backend-team
/critical/ all @security-team
```

`random(1)` picks one random reviewer from the team, `least_busy(2)` picks the two reviewers with the fewest open PRs, and `all` requires every team member to review. No other forge has reviewer selection strategies in the CODEOWNERS syntax.

The `.bitbucket/teams.yaml` file lets you define ad-hoc reviewer groups without creating formal Bitbucket teams:

```yaml
# .bitbucket/teams.yaml
security:
  - alice
  - bob
frontend:
  - carol
  - dave
```

These can then be referenced in CODEOWNERS with the `@teams/` prefix, like `@teams/security` or `@teams/frontend`.

### Fallback chains

If you host the same repository on multiple platforms, shared config in `.github/` will be picked up by Gitea and Forgejo, with platform-specific overrides in `.gitea/` or `.forgejo/` taking priority. Bitbucket and GitLab only check their own folders, so multi-platform support across all forges still requires some duplication.

### Gotchas

GitHub's org-level `.github` repository lets you set default issue templates, PR templates, and community health files for every repo in the org, but the fallback is all-or-nothing: if a repo has any file in its own `.github/ISSUE_TEMPLATE/` folder, none of the org-level templates are inherited and there's no way to merge them. The org `.github` repo must also be public, so your default templates are visible to everyone.

GitHub looks for CODEOWNERS in three places: `.github/CODEOWNERS`, then `CODEOWNERS` at the root, then `docs/CODEOWNERS`. First one found wins and the others are silently ignored. The syntax looks like `.gitignore` but [doesn't support](https://docs.github.com/articles/about-code-owners) `!` negation, `[]` character ranges, or `\#` escaping. A syntax error used to cause the entire file to be silently ignored, meaning no owners were assigned to anything. GitHub has since added error highlighting in the web UI but there's still no push-time validation.

GitLab supports [optional CODEOWNERS sections](https://docs.gitlab.com/user/project/codeowners/advanced/) with a `^` prefix, but "optional" only applies to merge requests. If someone pushes directly to a protected branch, the docs say approval from those sections is "still required," though how that actually works for a command-line push is [unclear even to GitLab users](https://forum.gitlab.com/t/optional-codeowners-what-does-approval-required-if-pushing-directly-to-protected-branch-mean/107795).

The Gitea/Forgejo workflow fallback is all-or-nothing too: if `.gitea/workflows/` contains any workflow files, `.github/workflows/` is [completely ignored](https://github.com/go-gitea/gitea/issues/31456), so you can't run platform-specific workflows side by side.

Gitea's CODEOWNERS doesn't check `.github/CODEOWNERS` at all, only `./CODEOWNERS`, `./docs/CODEOWNERS`, and `.gitea/CODEOWNERS`. If you migrate from GitHub with your CODEOWNERS in `.github/`, it silently does nothing. And even when it works, CODEOWNERS on Gitea [isn't enforceable](https://github.com/go-gitea/gitea/issues/32602): it adds reviewers but there's no branch protection option to require their approval. Anyone with write access can approve. A regression in Gitea 1.21.9 also [broke CODEOWNERS for fork PRs](https://github.com/go-gitea/gitea/pull/30476), which wasn't fixed until 1.21.11.

Forgejo and Gitea both inherited the `pull_request_target` trigger from GitHub Actions compatibility, which means they also inherited the "[pwn request](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)" attack surface. The workflow runs from the base branch with access to secrets, and if it checks out and executes the fork's PR code, those secrets can be exfiltrated. Forgejo added a trust-based approval system for fork PRs, but `pull_request_target` workflows still run with write tokens.

[CVE-2025-68937](https://www.cvedetails.com/cve/CVE-2025-68937/) is a symlink-following vulnerability in template repository processing, filed against Forgejo. An attacker creates a template repository with symlinks pointing at sensitive paths like the git user's `authorized_keys`, and when someone creates a new repo from that template, the symlinks get dereferenced during template expansion, allowing the attacker to write arbitrary files on the server. Forgejo was affected through v13.0.1 (and v11.0.6 on LTS). Gitea had the same bug since v1.11 and fixed it in v1.24.7 under a separate advisory.

The Forgejo runner also fixed a [cache poisoning vulnerability](https://codeberg.org/forgejo/security-announcements/issues/38) in v10.0.0 where PR workflows could write to the shared action cache, letting a malicious PR poison future privileged workflow runs. It's unclear whether Gitea's runner is affected or fixed this quietly, as they haven't published a corresponding advisory.

GitHub Actions [expressions are case-insensitive](https://yossarian.net/til/post/github-actions-is-surprisingly-case-insensitive/). `${{ github.ref == 'refs/heads/main' }}` matches whether the branch is `main`, `MAIN`, or `mAiN`. Context accesses like `secrets.MY_SECRET` and `SECRETS.my_secret` resolve to the same thing. Git itself is case-sensitive, so if your workflow security depends on branch naming conventions, there's a mismatch that's easy to miss.

<hr>

If you know of other forge-specific folders or have corrections, reach out on [Mastodon](https://mastodon.social/@andrewnez) or submit a pull request on [GitHub](https://github.com/andrew/nesbitt.io).
