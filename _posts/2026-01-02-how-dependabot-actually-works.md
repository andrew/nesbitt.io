---
layout: post
title: "How Dependabot Actually Works"
date: 2026-01-02 10:00 +0000
description: "Inside dependabot-core's architecture, its reliance on proprietary GitHub infrastructure, and open source alternatives"
tags:
  - package-managers
  - github
  - dependencies
  - deep-dive
---

GitHub, GitLab, and Gitea all have dependency tracking and automated updates, but in each case the interesting parts are premium or closed source. I wanted to understand how these features could be built openly into something like [Forgejo](https://forgejo.org/). Dependabot is a key piece of GitHub's dependency tooling, [dependabot-core](https://github.com/dependabot/dependabot-core) is MIT licensed, and it's written in Ruby, so it seemed like a good place to start.

Most developers think of Dependabot as a smart bot that watches their repositories and creates pull requests when updates are available. It isn't one. The codebase is a stateless Ruby library that knows nothing between runs, wrapped by proprietary GitHub infrastructure that handles all the coordination.

In May 2024, GitHub [relicensed dependabot-core under MIT](https://github.blog/changelog/2024-05-13-dependabot-core-is-now-open-source-with-an-mit-license/), replacing the Prosperity Public License that had restricted commercial use. This covers the update logic: parsing manifests, checking registries, generating file changes. The scheduling, state tracking, and coordination that make Dependabot work as a service remain proprietary. Self-hosting means rebuilding those parts yourself.

### The codebase

The repository is 330,000 lines of Ruby supporting 25+ package ecosystems. The naming is idiosyncratic: `bundler` not `rubygems`, `pip` not `pypi`, `npm_and_yarn` combined, `go_modules` not `golang`, `hex` not `elixir`, `cargo` not `crates`. This differs from [PURL](https://github.com/package-url/purl-spec), the newly minted ECMA standard, which uses registry names, and from other tools which use language names. If you are trying to [map between systems](https://github.com/ecosyste-ms/dependabot/blob/main/app/models/package.rb#L30-L57), expect friction.

Each ecosystem implements four core classes: `FileFetcher` downloads manifest and lockfiles from a repo, `FileParser` extracts dependencies, `UpdateChecker` queries registries for new versions, and `FileUpdater` generates the file changes for a PR. The complexity varies wildly. GitHub Actions `FileParser` is 194 lines. Gradle is 615. The npm ecosystem spans multiple files handling package.json, various lockfile formats, yarn, pnpm, and workspaces. The npm `file_updater_spec.rb` test file alone is 4,000 lines.

To run updates, dependabot-core shells out to native package manager tooling. The [Python Dockerfile](https://github.com/dependabot/dependabot-core/blob/main/python/Dockerfile) is 209 lines because it ships six Python versions (3.9 through 3.14). Older versions are stored compressed with zstd to save space. They copy pre-built Python from official Docker images then rewrite all the shebangs with sed to fix paths. Rust is bundled too because many Python packages have native extensions that need compilation.

The npm ecosystem has its own archaeology. They still ship npm 6 alongside newer @npmcli/arborist from npm 8+. They maintain a fork of Yarn 1.x published as [`@dependabot/yarn-lib`](https://www.npmjs.com/package/@dependabot/yarn-lib). A [patch on pacote](https://github.com/dependabot/dependabot-core/blob/main/npm_and_yarn/helpers/patches/npm%2B%2Bpacote%2B9.5.12.patch) adds `GIT_CONFIG_GLOBAL` to allowed environment variables.

Bundler gets [monkey-patched](https://github.com/dependabot/dependabot-core/tree/main/bundler/helpers/v2/monkey_patches) heavily. One patch converts `git@github.com:` SSH URLs to HTTPS because Dependabot runs without SSH keys. Another manipulates `$LOAD_PATH` to prevent loading problematic gems when evaluating gemspecs. A third injects fake Ruby version metadata into the resolution process so it works without the target Ruby version actually installed.

The test suite includes a fake package ecosystem called ["silent"](https://github.com/dependabot/dependabot-core/tree/main/silent) that makes no network calls. It reads available versions from local JSON files using the [txtar format](https://pkg.go.dev/golang.org/x/tools/txtar). This lets them test the update machinery without real registries.

NuGet pulls in the actual NuGet.Client repository as a [git submodule](https://github.com/dependabot/dependabot-core/blob/main/.gitmodules), pinned to `release-6.12.x`. They also submodule dotnet-core.

When querying registries, dependabot-core [identifies itself](https://github.com/dependabot/dependabot-core/blob/main/common/lib/dependabot/shared_helpers.rb#L23-L27) with a user agent string: `dependabot-core/#{VERSION} ... (+https://github.com/dependabot/dependabot-core)`. I wonder how much Dependabot traffic the major registries see.

### Stateless by design

Despite all this complexity, dependabot-core is stateless. Given a [job definition](https://github.com/dependabot/dependabot-core/blob/main/updater/lib/dependabot/job.rb), it clones your repo, parses manifests, checks registries, outputs file changes, and exits. The next run starts fresh with no memory of previous runs. The job definition must provide all context:

```yaml
job:
  package-manager: bundler
  source:
    provider: github
    repo: owner/repo
    directory: "/"
    commit: abc123
  existing-pull-requests:
    - - dependency-name: "lodash"
        dependency-version: "4.17.21"
  security-advisories:
    - dependency-name: sinatra
      affected-versions:
        - ">= 2.0.0, < 2.2.3"
  updating-a-pull-request: false
```

This job definition is not visible anywhere in the resulting PR. It would be useful if it were embedded in the PR body as a hidden HTML comment, giving external tools machine-readable metadata about what was updated and why. I have been indexing Dependabot PRs at [dependabot.ecosyste.ms](https://dependabot.ecosyste.ms/), and to extract which packages are being updated I had to write [400 lines of regex parsing](https://github.com/ecosyste-ms/dependabot/blob/main/app/models/issue.rb#L155-L542) that reverse-engineers package names and versions from PR titles and descriptions.

Notice `existing-pull-requests`. Dependabot cannot query what PRs it previously created. GitHub's infrastructure finds open Dependabot PRs and passes that list in. Same with `security-advisories`. The library does not maintain a vulnerability database. GitHub fetches from the Advisory Database and injects relevant CVEs per job. The library just pattern-matches package names and version ranges against what it is told.

When refreshing an existing PR (what users call "rebasing"), the job includes `updating-a-pull-request: true` and `dependencies` listing the specific packages. The [refresh logic](https://github.com/dependabot/dependabot-core/blob/main/updater/lib/dependabot/updater/operations/refresh_version_update_pull_request.rb) decides whether to update the existing PR, close it as up-to-date, close it because the dependency was removed, or supersede it with a new PR for a newer version. The close reasons are enumerated internally (`dependency_removed`, `up_to_date`, `update_no_longer_possible`, `dependencies_changed`) but not exposed in the PR metadata either.

GitHub [runs this on Actions infrastructure](https://github.blog/news-insights/product-news/dependabot-on-github-actions-and-self-hosted-runners-is-now-generally-available/). Your dependabot.yml schedule triggers a job, GitHub spins up a runner with the dependabot-core Docker image, passes the job definition via JSON file, and receives back API calls to create, update, or close PRs. The git operations happen on GitHub's side through their API. Dependabot-core outputs instructions; it never pushes commits directly.

The scheduling, PR state tracking, rate limiting, and CVE matching all live in GitHub's proprietary infrastructure. The [dependabot/cli](https://github.com/dependabot/cli) lets you run single jobs locally but provides no scheduler. (Dependabot Alerts and Dependabot Security Updates are separate systems. Alerts scan and notify, Security Updates create PRs. The dependency graph that powers alerts uses different parsing logic from dependabot-core, making three separate systems in total.)

### What the scheduler needs

Statelessness means someone has to track state. GitHub does it proprietarily, but [dependabot-gitlab](https://gitlab.com/dependabot-gitlab/dependabot) shows what it takes to do it openly. It is a Rails application that implements the missing coordinator but for GitLab instead of GitHub. Their PostgreSQL schema reveals what state you need beyond dependabot-core:

- `projects` tracking GitLab repos with their access tokens and last run status
- `configurations` storing parsed dependabot.yml per project
- `update_jobs` with cron expressions, `next_run_at`, and `last_scheduled_at` timestamps
- `update_runs` recording execution history with status and timing
- `merge_requests` tracking open merge requests: which dependency, from/to versions, state, auto-merge settings
- `vulnerabilities` caching GitHub's Advisory Database locally
- `vulnerability_issues` for security issues created in GitLab

A `DynamicJobSchedulerJob` runs on cron, queries for update jobs where `next_run_at <= now`, and enqueues them with row-level locking (`FOR UPDATE SKIP LOCKED`) to prevent double-scheduling. `VulnerabilityUpdateJob` syncs their local database with GitHub's Advisory Database via GraphQL, paginating through all advisories per ecosystem.

The merge request service checks for existing open merge requests before creating new ones, handles rebasing versus recreating when there are conflicts, can auto-approve and auto-merge, and closes superseded merge requests when newer versions appear. All the coordination logic GitHub keeps proprietary, implemented in open source Ruby.

dependabot-gitlab does not track the full dependency list for a repository. Each run still parses manifests from scratch, discovers dependencies, checks each one. The only "memory" is what merge requests are open and what vulnerabilities exist. This is the same brute-force polling model as GitHub's Dependabot.

### Polling versus events

A repository with 500 dependencies on a daily schedule makes about 182,000 registry lookups per year. Most days nothing has changed, but it parses every manifest and checks every registry anyway, only to find nothing and throw it all away.

The alternative is event-driven updates. If you maintained a dependency index across repositories, you could flip the model. When lodash 4.17.22 is published to npm, query which repos use lodash below that version and update just those. When a CVE drops for express, check which repos have affected versions instantly. When a push changes package.json, parse just that repo. React to the two things that actually matter: new versions appearing and repository dependencies changing.

This requires knowing what dependencies exist without parsing. You would need registry watchers subscribing to npm, RubyGems, PyPI feeds for new releases, a dependency index mapping package names to repositories, and webhook receivers for git push events filtered to manifest files. The scheduled full-scan becomes a fallback, not the primary trigger.

The dependency index is the hard part, but it exists. At [ecosyste.ms](https://ecosyste.ms/) we track dependencies across millions of repositories and dozens of ecosystems. The data needed for event-driven updates is already there: which repos use which packages at which versions. What is missing is wiring it to registry feeds and a coordinator that can trigger dependabot-core when something changes.

[Renovate](https://github.com/renovatebot/renovate) has the same architecture. The CLI is AGPL open source but stateless. You run it on a schedule and it exits after processing. The scheduler, webhook handling, and priority queuing that make it feel responsive live in Mend's [closed-source Community and Enterprise editions](https://github.com/mend/renovate-ce-ee/blob/main/docs/overview.md). The difference from Dependabot is that Renovate's closed-source wrapper is available for self-hosting with license keys, while GitHub's coordination layer is not available at all.

The question is whether the pieces around dependabot-core could be wired together differently: dependabot-core for update mechanics, dependabot-gitlab proving the scheduler can be built openly, advisory databases for vulnerability data, registry feeds for new releases. An event-driven coordinator rather than polling. Nobody has built it yet.
