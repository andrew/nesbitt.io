---
layout: post
title: "Patching and forking in package managers"
date: 2026-05-01 10:00 +0000
description: "What to do when upstream ghosts you"
tags:
  - package-managers
  - security
---

When a dependency has a known vulnerability and no maintainer to release a fix, you have to fix it yourself. Clone the source, apply the patch, get the patched version back into your dependency tree. The volume of reported CVEs is going to rise, and many will land in packages where nobody is around to cut a release.

System package managers handled this a long time ago. Debian's `debian/patches/` with quilt and DEP-3 headers, RPM's `Patch0:` directives in spec files, Gentoo's `/etc/portage/patches/`, Nix's `patches` attribute in derivations, Homebrew's `patch do ... end` blocks in formulae. Distribution maintainers are expected to carry deltas against upstream, and the tooling is designed around that assumption.

Language package managers were designed around a different assumption: the registry version is authoritative, the user picks which version they want, and nobody modifies what's inside. When upstream can't or won't release a fix, users hit tooling that wasn't built for the situation they're in.

What you need depends on the situation. Redirecting a dependency to a fork you control is the most common workaround. Overriding what the resolver picks for a transitive dependency buried in your tree requires different tooling. Patching a package in place without maintaining a fork is the lightest option when it's available. And sometimes you need to substitute one package for another entirely.

### Redirecting to a fork

Nearly every language package manager can point a dependency at a git repository or local path instead of the registry. Cargo uses a [`[patch]`](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html) section in `Cargo.toml`:

```toml
[patch.crates-io]
serde = { git = "https://github.com/yourfork/serde.git", branch = "fix-cve" }
```

Go modules have the [`replace`](https://go.dev/ref/mod#go-mod-file-replace) directive:

```
replace github.com/original/pkg => github.com/yourfork/pkg v1.4.1-fixed
```

Bundler takes [`:git` or `:path`](https://bundler.io/guides/git.html) on any gem:

```ruby
gem 'httpclient', git: 'https://github.com/yourfork/httpclient.git', branch: 'fix-ssl'
```

The rest of the field:

- [npm](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#git-urls-as-dependencies), pnpm, Yarn, and Bun accept git URLs and the `npm:` aliasing protocol in `package.json`.
- [pip](https://pip.pypa.io/en/stable/topics/vcs-support/), [Poetry](https://python-poetry.org/docs/dependency-specification/#git-dependencies), and [uv](https://docs.astral.sh/uv/concepts/projects/dependencies/#dependency-sources) support VCS URLs in their respective Python config formats.
- [Mix](https://hexdocs.pm/mix/Mix.Tasks.Deps.html) and [Pub](https://dart.dev/tools/pub/dependencies) take git and path options on dependency entries.
- [Composer](https://getcomposer.org/doc/05-repositories.md#vcs) adds a VCS repository that shadows the Packagist version.
- [Swift PM](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0219-package-manager-dependency-mirroring.md) has dependency mirroring via CLI config.
- [Gradle](https://docs.gradle.org/current/userguide/composite_builds.html) has composite builds. Maven uses the local repository. [NuGet](https://learn.microsoft.com/en-us/nuget/hosting-packages/local-feeds) supports local package feeds.
- [Stack](https://docs.haskellstack.org/en/stable/configure/yaml/project/#extra-deps) and [Cabal](https://cabal.readthedocs.io/en/latest/cabal-project-description-file.html#taking-a-dependency-from-a-source-code-repository) take git dependencies in their project config files.

Go's [gohack](https://github.com/rogpeppe/gohack) automates the manual part of this workflow: it checks out a module's source to a local directory and adds the `replace` directive to `go.mod` in one command, so you can start editing immediately without setting up a fork repo.

### Overriding transitive dependencies

Redirecting a direct dependency is straightforward. The harder case is when the vulnerable package is transitive, pulled in by a dependency of a dependency rather than anything in your manifest.

byroot described this well in [a recent post about Bundler](https://byroot.github.io/ruby/bundler/2026/04/20/bundle-features.html). He wanted to upgrade the `openssl` gem, but `web-push` pinned it to `~> 2.2`. Upgrading `web-push` required a new version of `jwt`, which four other gems pinned to `~> 2.0`. None of those gems had seen a release in years. The dependency tree was stuck on pessimistic version constraints written by maintainers who were no longer around to relax them.

His proposed fix: a `force: true` option that tells Bundler to override any upstream constraint:

```ruby
gem 'openssl', '>= 3.0', force: true
```

Bundler doesn't support this. The workaround is pointing each blocking dependency at a git repo with relaxed constraints, which means maintaining multiple forks to fix what is really a version-bounds problem.

Cargo's [`[patch]`](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html) handles this case because a patch entry replaces the dependency everywhere in the tree, direct or transitive. The patched version must be semver-compatible with the original, so it won't help if you need to cross a major version boundary. Go's [`replace`](https://go.dev/ref/mod#go-mod-file-replace) works the same way but has no such constraint. Go also has [`exclude`](https://go.dev/ref/mod#go-mod-file-exclude) to block specific versions and force the resolver to pick the next valid one.

npm has [`overrides`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides) in `package.json`:

```json
{
  "overrides": {
    "lodash": "4.17.21"
  }
}
```

Nested objects scope the override to a specific path through the tree. The other JavaScript package managers have the same capability:

- [pnpm](https://pnpm.io/settings#overrides) has `pnpm.overrides` with a `parent>child` scoping syntax, and supports the `npm:` protocol inside overrides to substitute one package for another as part of the override.
- [Yarn](https://yarnpkg.com/configuration/manifest#resolutions) has had `resolutions` since v1.
- Bun reads both `overrides` and `resolutions`.

Other ecosystems with built-in override mechanisms:

- [Mix](https://hexdocs.pm/mix/Mix.Tasks.Deps.html) uses `override: true` on dependency entries to force the top-level version constraint.
- [Pub](https://dart.dev/tools/pub/dependencies#dependency-overrides) `dependency_overrides` replaces all references to a package throughout the tree.
- [Gradle](https://docs.gradle.org/current/userguide/resolution_rules.html) has `strictly` constraints and `resolutionStrategy.force`.
- [Maven](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#dependency-management) `dependencyManagement` controls versions for both direct and transitive dependencies.
- [NuGet](https://learn.microsoft.com/en-us/nuget/consume-packages/central-package-management) Central Package Management with transitive pinning does the same.

Haskell takes a different angle with [`allow-newer`](https://cabal.readthedocs.io/en/latest/cabal-project-description.html#cfg-field-allow-newer), which relaxes upper version bounds rather than forcing a specific version:

```
allow-newer: my-package:aeson, my-package:text
```

When a package declares it needs `base < 4.19` and you're on 4.20, `allow-newer` tells the resolver to ignore the upper bound and try it anyway.

uv added [`override-dependencies`](https://docs.astral.sh/uv/concepts/projects/dependencies/#dependency-overrides) in `pyproject.toml`:

```toml
[tool.uv]
override-dependencies = ["werkzeug==2.3.0"]
```

pip has no override mechanism. Constraint files add bounds but can't contradict what packages declare. Poetry had a [feature request](https://github.com/python-poetry/poetry/issues/4991) for overrides in 2022, closed as not planned.

### Applying patches

Applying a diff to a package as it comes off the registry is the lightest-weight fix. You keep the original package, the original version in your lockfile, and layer a change on top. When upstream publishes a proper fix, you drop the patch and update normally. System package managers all work this way. Among language package managers, three have it built in.

[pnpm](https://pnpm.io/cli/patch): run `pnpm patch <package>`, edit the extracted source, run `pnpm patch-commit <path>`. A `.patch` file is saved to the project and recorded in `package.json` under `patchedDependencies`. Patches are reapplied on every install.

[Yarn Berry](https://yarnpkg.com/cli/patch): `yarn patch` with the same workflow. Patches integrate with the `patch:` protocol in the lockfile and go through Yarn's checksum verification.

[Bun](https://bun.sh/docs/install/patch): `bun patch <package>`, edit in `node_modules/`, `bun patch --commit <package>`.

For npm and Yarn Classic, the third-party [patch-package](https://github.com/ds300/patch-package) library fills the gap. Modify the package in `node_modules/`, run `npx patch-package <pkg>`, and wire up a `postinstall` script to reapply on install.

Composer has [cweagans/composer-patches](https://github.com/cweagans/composer-patches), whose 2.0 release added a `patches.lock.json` for reproducibility. Patches can be local files or remote URLs and are applied during `composer install`. [vaimo/composer-patches](https://github.com/vaimo/composer-patches) is an alternative that adds per-package patch definitions (so libraries can ship patches for their own dependencies) and more control over patch application order and depth.

Cargo has the third-party [cargo-patch](https://crates.io/crates/cargo-patch) crate, which downloads crate source, applies `.patch` files, and writes the result to a directory for use with a `[patch.crates-io]` entry pointing at the patched output. [patch-crate](https://github.com/mokeyish/cargo-patch-crate) takes a workflow closer to patch-package: edit the crate source in place and generate the diff automatically.

Maven once had an [official patch plugin](https://maven.apache.org/plugins/maven-patch-plugin/) that applied diffs using GNU `patch` under the hood, but it's been retired.

Beyond those, the remaining language ecosystems expect you to fork. Bundler, Go, uv, Poetry, Mix, Swift PM, NuGet, Stack, and Cabal have no patch-file mechanism, built-in or third-party. pip has [patch-package](https://pypi.org/project/patch-package/), Pub has [patch_package](https://pub.dev/packages/patch_package), and Gradle has [brambolt/gradle-patching](https://github.com/brambolt/gradle-patching), but none are widely adopted.

### Substituting packages

byroot's other proposal for Bundler was the ability to install one gem as a drop-in replacement for another:

```ruby
gem "byroot-httpclient", as: "httpclient"
```

The context was the `httpclient` gem, which went unreleased from 2016 until 2025 while its vendored SSL root certificates expired and broke users. Everyone who needed a working version had to maintain their own fork. If someone publishes a maintained fork under a new name, you need it to satisfy the dependency constraints that other packages declare on the original.

The `npm:` protocol does this in the JavaScript ecosystem:

```json
{
  "dependencies": {
    "original-name": "npm:@yourorg/forked-name@^2.0.0"
  }
}
```

pnpm, Yarn, and Bun support it too. Other ecosystems with substitution mechanisms:

- [Composer](https://getcomposer.org/doc/04-schema.md#replace) `replace` declares that your package provides the same thing as another, preventing both from being installed.
- [Gradle](https://docs.gradle.org/current/userguide/resolution_rules.html#sec:dependency_substitution_rules) `dependencySubstitution` rules can swap any module for another at resolution time.
- ManageIQ's [bundler-inject](https://github.com/ManageIQ/bundler-inject) plugin adds an `override_gem` command that redirects gems to forks or local paths via `bundler.d/*.rb` files without touching the Gemfile itself, the closest thing in the Ruby ecosystem to a built-in substitution mechanism.

---

byroot's broader argument is about control: the application developer's manifest is their domain, and they should be able to override any upstream constraint in it, especially when the person who wrote that constraint is no longer around. Without override and substitution capabilities, the alternative is maintaining forks for what could be a two-line fix, and maintaining them indefinitely if upstream never comes back.

Both approaches bring their own maintenance burden. A fork needs to stay in sync with upstream changes unrelated to the vulnerability. GitHub forks have issues, Actions, Dependabot, and security features all disabled by default, so a fork needs manual setup before it works as a proper maintained project. For a two-line security fix, that's a lot of infrastructure to carry.

Patches are lighter, but they change what the lockfile entry means: you're running code that doesn't match the version recorded in the lock, and tools that audit dependencies against the lockfile won't see the patch. SBOMs generated from the lockfile will list the unpatched version. Under the EU Cyber Resilience Act, which requires accurate dependency inventories for products with digital elements, that gap between what you're running and what your tooling reports becomes a compliance problem.

Vendoring the source into your repository sidesteps the package manager entirely, but trades one set of problems for another: you're now responsible for the entire package, not just the patch.

System package managers were designed around the assumption that carrying patches is part of the job. Language package managers were designed around the assumption that it shouldn't be. As AI tooling makes vulnerability discovery faster, the number of dead packages with known CVEs will grow.
