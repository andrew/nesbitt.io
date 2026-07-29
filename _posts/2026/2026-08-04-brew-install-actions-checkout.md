---
layout: post
title: "brew install actions/checkout"
date: 2026-08-04 10:00 +0000
description: "What would it take to make a Homebrew tap the registry for GitHub Actions?"
tags:
  - homebrew
  - github
  - idea
---

In December I went through why [`uses:` is a package manager with no lockfile, no integrity hashes and no transitive visibility](/2025/12/06/github-actions-package-manager.html), and in April through the [run of incidents](/2026/04/28/github-actions-is-the-weakest-link.html) that followed from that. GitHub's [2026 security roadmap](https://github.blog/news-insights/product-news/whats-coming-to-our-github-actions-2026-security-roadmap/) has since committed to a lockfile, now in preview as [`gh-actions-lock`](https://github.com/github/gh-actions-lock), and made immutable actions the preferred resolution path. Neither of those changes adds any review between an action author tagging a release and the runner executing it. Homebrew has run that kind of curated index for fifteen years and, as of the immutable-actions rollout, stores its artifacts as OCI manifests on ghcr.io alongside the actions themselves, so I spent some time working out how much of a GitHub Actions registry you could assemble from Homebrew parts.

### Shared storage

Immutable actions and Homebrew bottles are both OCI artifacts on ghcr.io: [`actions/publish-immutable-action`](https://github.com/actions/publish-immutable-action) tars the action directory, pushes it as a layer with `artifactType: application/vnd.github.actions.package.v1+json`, attaches a sigstore bundle through the OCI referrers API, and tags the manifest with the semver, after which a workflow referencing `actions/checkout@4.2.2` [resolves through `pkg.actions.githubusercontent.com`](https://github.blog/changelog/2024-12-05-notice-of-upcoming-releases-and-breaking-changes-for-github-actions/) instead of the git tarball. `brew pr-pull` pushes bottles under the same manifest schema at `ghcr.io/homebrew/core/<name>` with a `com.github.package.type: homebrew_bottle` annotation and a [sigstore attestation](https://blog.trailofbits.com/2024/05/14/a-peek-into-build-provenance-for-homebrew/) that `brew verify` checks against Homebrew's CI identity, so `crane manifest ghcr.io/homebrew/core/jq:1.7.1` and `crane manifest ghcr.io/actions/checkout:4.2.2` return the same document type, as you'd expect from [last week's post](/2026/07/30/wheels-bottles-images.html).

The [comparison table in the December post](/2025/12/06/github-actions-package-manager.html) marked Actions ✗ on integrity hashes, transitive visibility, dependency-tree inspection and immutable versions, and homebrew-core provides all four for its 8,400 formulae through the index rather than the storage: each formula pins a source URL to a sha256, declares dependencies that `brew deps --tree` can walk, passes [`brew audit`](https://docs.brew.sh/Formula-Cookbook#audit-the-formula) and human review on every change, gets autobumped by `livecheck` when upstream tags a release, and can carry `deprecate!` or `disable!` when it shouldn't be installed.

### A tap of actions

That index is a tap, one formula per action:

```ruby
class ActionsCheckout < Formula
  desc "Checks out a repository for a GitHub Actions workflow"
  homepage "https://github.com/actions/checkout"
  url "https://github.com/actions/checkout/archive/refs/tags/v4.2.2.tar.gz"
  sha256 "63e9c07ff6c9ddf3a3b39d30e59f0bf3a..."
  license "MIT"

  livecheck do
    url :stable
    strategy :github_latest
  end

  def install
    prefix.install Dir["*"]
  end
end
```

For a JavaScript action that ships a built `dist/` in its release tarball, that's sufficient: the tarball is pinned to a content hash, `brew audit` and `brew verify` apply as they would to any formula, and `brew bump-formula-pr` opens a reviewed PR when checkout tags v4.2.3. Everything above `def install` is already static data. Homebrew is in the middle of [migrating install hooks to declarative steps](https://github.com/Homebrew/brew/pull/23196) so that bottle and cask installs need no Ruby evaluation at all, at which point an actions tap could be `.json` files with no code execution on install.

The [transitive problem](/2025/12/06/github-actions-package-manager.html) is specific to composite actions, whose `action.yml` carries its own `uses:` lines that the runner re-resolves at execution time regardless of how the outer action was pinned. In a formula those become `depends_on` entries plus an `inreplace` at build time. For a composite that internally calls `actions/cache@v4`:

<!-- TODO: if $/ inside a locally-loaded composite roots at that composite's own
     directory (ask actions-dispatch team), the rewrite target becomes
     "uses: $/../actions-cache" or the dep gets vendored into the tree and
     referenced as "uses: $/deps/actions-cache". Leaving ./../ until confirmed. -->
```ruby
depends_on "actions-cache"

def install
  inreplace "action.yml",
    "uses: actions/cache@v4",
    "uses: ./../actions-cache"
  prefix.install Dir["*"]
end
```

The resulting bottle has no floating refs left in it, `brew deps --tree` prints the transitive graph that no runner command exposes today, the tap's git log records which `actions-cache` revision the composite was built against, and moving that pin is a reviewed PR rather than a `git tag -f` in someone else's repository.

Every incident in the [weakest-link post](/2026/04/28/github-actions-is-the-weakest-link.html) would have been stopped by a Debian-style curator gating that PR, where an npm-style per-project lockfile would only have reduced the number of downstream repositories exposed. A workflow that pins `@v4` today has already delegated the version decision to whoever can push a tag to the action repo, and a tap moves that delegation to a reviewer instead. It also matches Homebrew's rolling-release design, where `Brewfile.lock.json` was [removed in November 2024](https://github.com/Homebrew/homebrew-bundle/pull/1509) and per-project pinning is [currently out of scope](https://docs.brew.sh/Brew-Bundle-and-Brewfile). I'd like to see the lockfile come back this year, and until it does a workflow that needs stricter reproducibility than the tap's HEAD can pin the tap itself to a commit.

An `audit_formula` extension for the tap would run [zizmor](https://docs.zizmor.sh/) over the extracted `action.yml` and reject anything that trips `dangerous-triggers` or `template-injection`, and reject composites whose internal `uses:` lines aren't fully covered by `depends_on`. The Marketplace's "verified creator" badge checks the publisher's identity and nothing about the action's contents, so a static-analysis gate at index time would be new. Bottles built from the tap are attested by the tap's CI the same way homebrew-core bottles are. Each formula's `url` points at a GitHub repository, which is the input `brew vulns` [already keys OSV lookups on](/2026/07/17/plumbing-homebrew-into-the-vulnerability-ecosystem.html), so an advisory against `actions/download-artifact` surfaces through the same path as one against `openssl`.

### Getting the runner to use it

The runner has three `ActionSourceType` values in [`ActionStepDefinitionReference.cs`](https://github.com/actions/runner/blob/main/src/Sdk/DTPipelines/Pipelines/ActionStepDefinitionReference.cs) (repository, container registry, script) and none of them is "an installed package on disk", so consuming a Homebrew-installed action means picking one of three integration points at increasing cost.

The runner already accepts `uses: ./path/to/action` relative to `$GITHUB_WORKSPACE`, and Homebrew is [preinstalled on `ubuntu-latest`](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md). A composite `Homebrew/actions/setup` step at the top of a job runs `brew bundle --file .github/Actionfile` and copies each keg into `./.brew-actions/<name>` (copies rather than symlinks, so a composite's relative `uses:` resolves against siblings in the workspace and not against `$(brew --cellar)`), and downstream steps reference `uses: ./.brew-actions/<name>`:

```yaml
steps:
  - uses: actions/checkout@11bd719...
  - uses: Homebrew/actions/setup@<sha>
  - uses: ./.brew-actions/actions-setup-python
    with:
      python-version: "3.13"
  - uses: ./.brew-actions/ruby-setup-ruby
```

This works with the runner as shipped and covers composite transitives because the bottle's `action.yml` was rewritten to relative paths at packaging time. It costs one round-trip to fetch the setup action itself the old way, and `checkout` stays on a plain SHA pin because it runs before the workspace has anything in it to `uses: ./` from.

<!-- TODO: confirm before publish - "this week" from the actions-dispatch team on
     2026-07-29. README section is live, runner-side enablement date TBC. -->
The copy-into-workspace step and the `checkout` bootstrap are both consequences of `./` being anchored at `$GITHUB_WORKSPACE`. `gh-actions-lock` is [introducing a `$/` prefix](https://github.com/github/gh-actions-lock#self-repository-actions-) that anchors at the repository containing the defining file, resolved at the running commit. In a workflow `$/` is readable before any step has run, inside a composite it roots at that composite's own tree, and it's also valid for reusable workflows (`uses: $/.github/workflows/foo.yml`), which `./` never supported. `gh-actions-lock` rewrites existing `./` references to `$/` by default and treats the result as inherently pinned, so no lockfile entry is generated for it. Whether `$/` inside a composite that was loaded from a local path roots at that composite's on-disk directory determines whether the setup step above can drop the workspace copy and point straight at `$(brew --prefix)/opt`, and I've asked.

On self-hosted runners, [`ActionManager.cs`](https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionManager.cs) reads `ACTIONS_RUNNER_ACTION_ARCHIVE_CACHE` and, if `<owner>_<repo>/<resolved-sha>.tar.gz` exists there, skips the download. A `brew bundle` on the runner host could populate that directory from the tap. The cache key is the SHA that GitHub's server-side resolver already returned for the ref, though, so this controls where the bytes for a given SHA come from and not which SHA `@v4` resolves to, which makes it an offline mirror rather than a resolution override.

The clean version is a fourth `ActionSourceType` that reads a formula's JSON from `formulae.brew.sh` (or any tap's API endpoint), verifies the bottle attestation, and extracts to `_actions/`. On hosted runners the ref-to-tarball resolution happens in a server-side `ResolveActionsDownloadInfoAsync` call rather than in the open-source runner, so a client-side patch takes effect on self-hosted runners and the compatible forks ([act](https://github.com/nektos/act), [Forgejo's runner](https://code.forgejo.org/forgejo/runner)) without any change to GitHub's backend. `$/` covers the same-repo case, and the remaining upstream change that would make the setup-step option clean is a `$/`-style anchor whose root is a runner-side directory outside any repository.

Reusable workflows referenced across repositories (`uses: org/repo/.github/workflows/foo.yml@ref`) go through a different loader and have no local-path form even with `$/`, so they still need the runner patch rather than the setup step. Docker actions already resolve through a container registry and get whatever pinning the image reference carries.

### Built in

The version that doesn't route around the resolver keeps `uses: actions/checkout@v4` exactly as written and makes the tap transparent: an organisation or repository setting alongside the existing [action allowlists](https://docs.github.com/en/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization) names the index the resolver consults, and that index maps `actions/checkout` to a bottle manifest digest instead of a git ref. The runner pulls the layer from ghcr.io, verifies the attestation against the tap's CI identity, and extracts to `_actions/`, and because a composite's internal refs were rewritten at bottling time the index response can carry the resolved dependency closure, so the whole transitive tree is one index query plus N content-addressed blob fetches. Re-running last week's job against an unchanged tap commit produces identical bytes, and switching an organisation from GitHub's default index to a community tap or an internal one with stricter audit rules is a settings change, not a rewrite of every workflow file, roughly the choice apt users make between Debian stable and a private mirror.

Making the identifier explicit rather than the index gets you the same result through [package URLs](https://github.com/package-url/purl-spec), where the purl type selects the resolver:

```yaml
steps:
  # current git-ref behaviour, via the registered pkg:github type
  - uses: pkg:github/actions/checkout@4.2.2

  # via the tap; unversioned because the tap commit is the pin
  - uses: pkg:brew/actions-setup-python

  # direct OCI digest pin
  - uses: pkg:oci/setup-ruby@sha256:7f3e2a1...?repository_url=ghcr.io/ruby/setup-ruby
```

Org policy allowlists which types and namespaces are permitted, and every option lands on the same OCI fetch and attestation check. `pkg:github` and [`pkg:brew`](/2026/07/17/plumbing-homebrew-into-the-vulnerability-ecosystem.html) are already registered purl types; a dedicated `pkg:githubactions` type was [proposed and closed unmerged](https://github.com/package-url/purl-spec/pull/243), and the runner accepting purls in `uses:` would be a reasonable prompt to reopen it. Homebrew's role in either design is producing one index in the [formulae.brew.sh JSON schema](https://formulae.brew.sh/docs/api/), and once the declarative-install work above lands the tap and the index are the same JSON, so any other curator could produce a compatible one without going near Homebrew's Ruby.

[Gitea's `act_runner`](https://gitea.com/gitea/act_runner) and [Forgejo's runner](https://code.forgejo.org/forgejo/runner) implement the same `uses:` semantics with no closed server-side resolution call, so either the transparent-index or the purl form could land there first. Codeberg, Forgejo and Gitea each already maintain an `actions` org ([codeberg.org/actions](https://codeberg.org/actions), [code.forgejo.org/actions](https://code.forgejo.org/actions), [gitea.com/actions](https://gitea.com/actions)) that mirrors a hand-picked subset of upstream actions so their users' workflows resolve without touching github.com. Those orgs are the curated index a tap would produce, maintained by hand, and the Forgejo maintainers have been [vocal about wanting](https://codeberg.org/forgejo/discussions/issues/214) something better than inheriting GitHub's resolution model.

### Effort

<!-- TODO before publish (Tue 2026-08-04): actually generate formulae for the 70
     from https://packages.ecosyste.ms/critical?registry=github+actions - fetch each
     action.yml, classify node/composite/docker, extract composite uses: -> depends_on,
     run zizmor, and replace "is a script" below with the real numbers / tap link. -->
Generating draft formulae for the [70 most-used actions in ecosyste.ms data](https://packages.ecosyste.ms/critical?registry=github+actions) is a script, and the `depends_on` graph falls out of parsing each `action.yml`, which the [community lockfile tools](/2025/12/30/community-tools-bring-lockfile-support-to-github-actions.html) already do. A `brew audit` extension that shells out to zizmor and checks `depends_on` coverage is a couple of hundred lines against the existing audit framework, and the setup-step shim is one composite action. None of that requires anyone at GitHub to agree to anything. Homebrew is already installed on every hosted Linux and macOS runner image (Windows runners would need the setup step to pull bottles some other way), and the curated-index piece is the one part of the December table that GitHub's roadmap leaves unaddressed. If someone wants to try the tap, I'd help.
