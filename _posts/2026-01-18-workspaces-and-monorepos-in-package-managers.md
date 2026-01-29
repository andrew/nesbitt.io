---
layout: post
title: "Workspaces and Monorepos in Package Managers"
date: 2026-01-18 10:00 +0000
description: "How various package managers implement workspaces and their relationship with monorepos."
tags:
  - package-managers
  - monorepo
  - deep-dive
---

I've never needed workspaces. Never used a monorepo either. I've also never worked in a massive team. The projects I work on are small enough that a single package per repo works fine, and when I need to coordinate changes across packages, publishing isn't that painful.

But every major package manager now has workspaces or something like them. In JavaScript: [Yarn](https://yarnpkg.com/features/workspaces), [npm](https://docs.npmjs.com/cli/using-npm/workspaces), [pnpm](https://pnpm.io/workspaces), [Bun](https://bun.sh/docs/install/workspaces). In other ecosystems: [Cargo](https://doc.rust-lang.org/cargo/reference/workspaces.html) (Rust), [uv](https://docs.astral.sh/uv/concepts/workspaces/) (Python), [`go.work`](https://go.dev/doc/tutorial/workspaces) (Go), [Composer](https://getcomposer.org/doc/05-repositories.md#path) (PHP), [pub](https://dart.dev/tools/pub/workspaces) (Dart), [Mix](https://hexdocs.pm/mix/Mix.Tasks.New.html#module-umbrella-projects) (Elixir). Even Bundler and NuGet have workarounds. When every ecosystem independently arrives at the same shape, something structural is going on. So I wanted to understand why.

The basic problem: you have two packages in your repo, and one depends on the other. Without workspaces, you'd have to publish the dependency every time you change it, or manually symlink it and deal with links that persist invisibly across your system, break in subtle ways, and behave differently than published packages.

Workspaces let the package manager wire up local dependencies automatically during install. You edit one package, the other sees the changes immediately. When you publish, normal version resolution takes over.

### Common use cases

People often associate workspaces with monorepos, but you don't need a massive codebase to benefit. Common cases:

- A library and its plugins
- An app with local utilities that won't be published separately
- A package tested against an example app
- Cloning a dependency locally to debug an issue

Workspaces solve "these packages are developed together." Monorepos solve "all our code lives in one place." They overlap but aren't the same thing. Coordinating changes across multiple repos is painful (separate PRs, separate CI, separate release schedules), which is why monorepos became attractive. Workspaces make monorepos practical by handling the dependency wiring.

### How they work in practice

**[npm](https://docs.npmjs.com/cli/using-npm/workspaces)** (v7+) uses a `workspaces` field in the root package.json:

```json
{
  "workspaces": ["packages/*"]
}
```

Running `npm install` creates symlinks from `node_modules` to each workspace package. If package-b lists package-a as a dependency, npm links to the local copy instead of fetching from the registry. Dependencies get hoisted to the root `node_modules` where possible, which can cause phantom dependency issues. npm has no special publish support for workspaces. The escape hatch for manual linking is `npm link`.

**[Yarn](https://yarnpkg.com/features/workspaces)** works similarly but had workspaces from the start. [Yarn 1 popularized the pattern](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/). Yarn Berry (v2+) changed the internals but kept the same configuration. Yarn 1 hoists like npm, but Yarn Berry's [PnP mode](https://yarnpkg.com/features/pnp) eliminates `node_modules` entirely and enforces strict dependency resolution, preventing phantom dependencies. Yarn also supports the [`workspace:` protocol](https://yarnpkg.com/features/workspaces#workspace-ranges-workspace) like pnpm.

**[pnpm](https://pnpm.io/workspaces)** doesn't hoist dependencies to the root. Each package gets its own `node_modules` with symlinks into pnpm's content-addressable store. This means packages can only import what they explicitly declare. pnpm and Yarn Berry both support the [`workspace:` protocol](https://pnpm.io/workspaces#workspace-protocol-workspace):

```json
{
  "dependencies": {
    "sibling-package": "workspace:*"
  }
}
```

This tells pnpm to always resolve from the workspace, never the registry. When you publish, pnpm replaces `workspace:*` with the actual version number. Yarn Berry supports this protocol too. npm doesn't, so with npm it's easier to accidentally publish a package that references a local path.

**[Bun](https://bun.sh/docs/install/workspaces)** supports workspaces with the same configuration as npm and Yarn. It uses the `workspaces` field in package.json and creates symlinks like the others. Bun's speed advantage applies to workspace installs too.

**[Cargo](https://doc.rust-lang.org/cargo/reference/workspaces.html)** uses a `[workspace]` section in Cargo.toml:

```toml
[workspace]
members = ["crates/*"]
```

All workspace members share a single Cargo.lock and build into a single target directory. When one crate depends on another via `path = "../other"`, Cargo handles linking. The shared lockfile provides consistency across the workspace. Cargo also unifies feature resolution: if two crates enable different features of the same dependency, Cargo resolves them across the whole workspace rather than duplicating the dependency. `cargo publish` understands workspace relationships and can publish members in dependency order, making it one of the more complete implementations.

**[Go](https://go.dev/doc/tutorial/workspaces)** took a different approach. Before `go.work` existed, you'd use replace directives:

```
replace example.com/mylib => ../mylib
```

This tells the compiler to resolve that import from a local path instead of fetching it. The directive lives in go.mod and is explicit about what it's doing.

[Go 1.18](https://go.dev/blog/go1.18) added `go.work` files for multi-module workspaces. Instead of adding replace directives to each module's go.mod, you create a `go.work` file at the repo root:

```
go 1.18

use (
    ./app
    ./lib
)
```

This tells Go to resolve imports across these modules locally. The key difference: `go.work` is typically kept out of version control. It's a local development convenience, not part of the published module. For ecosystems like Go (and Swift, which also fetches packages from git), workspaces are partly about short-circuiting the network: without them, you'd have to push a commit just to see if things compile together. Go has no registry to publish to (modules are fetched from version control via proxies like [proxy.golang.org](https://proxy.golang.org)), so the publishing coordination problem doesn't arise in the same way.

**[Bundler](https://bundler.io/man/gemfile.5.html)** has no formal workspace support. You use path dependencies in the Gemfile:

```ruby
gem 'my_gem', path: '../my_gem'
```

This works for development but doesn't compose with publishing. You'd need to change the Gemfile before releasing. There's no isolation between gems and no publish support. [`bundle config local`](https://bundler.io/man/bundle-config.1.html#LOCAL-GIT-REPOS) lets you redirect a git dependency to a local path without editing the Gemfile, which is cleaner but still a workaround.

**[Composer](https://getcomposer.org/doc/05-repositories.md#path)** (PHP) supports path repositories. You add a repository entry pointing to a local directory:

```json
{
  "repositories": [
    { "type": "path", "url": "../my-package" }
  ]
}
```

Composer symlinks the local package. Like Bundler, this is a development convenience without workspace-aware publishing. You'd need to remove the path repository before releasing.

**[Swift Package Manager](https://developer.apple.com/documentation/xcode/editing-a-package-dependency-as-a-local-package)** handles local development through Xcode's UI or by editing Package.swift to use a local path:

```swift
.package(path: "../MyLibrary")
```

SPM doesn't have a central registry (packages are fetched from git), so the publishing coordination problem is similar to Go's.

**[pub](https://dart.dev/tools/pub/workspaces)** (Dart/Flutter) added workspace support. You define a `pubspec.yaml` at the root with a `workspace` field:

```yaml
name: my_workspace
workspace:
  - packages/app
  - packages/shared
```

Members share a resolution, and `pub get` links them together. Dart packages are published to [pub.dev](https://pub.dev) individually.

**[Mix](https://hexdocs.pm/mix/Mix.Tasks.New.html#module-umbrella-projects)** (Elixir) has umbrella projects. You create a parent project with child apps in an `apps/` directory:

```elixir
# mix.exs at root
defmodule MyUmbrella.MixProject do
  use Mix.Project

  def project do
    [
      apps_path: "apps",
      deps: deps()
    ]
  end
end
```

Each app has its own `mix.exs` but they share dependencies and can reference each other. Umbrella apps can be published to [Hex](https://hex.pm/) individually.

**[NuGet](https://learn.microsoft.com/en-us/nuget/consume-packages/central-package-management)** (.NET) uses project references for local dependencies. In a solution, projects reference each other directly:

```xml
<!-- In MyApp.csproj -->
<ItemGroup>
  <ProjectReference Include="..\MyLibrary\MyLibrary.csproj" />
</ItemGroup>
```

For centralized dependency management, NuGet supports `Directory.Packages.props` to share versions across projects. Publishing to nuget.org is per-package.

### Common problems

**Phantom dependencies.** npm and Yarn 1 hoist dependencies to the root `node_modules`. A package can import something it doesn't declare, as long as a sibling declared it and it got hoisted. This works in the workspace but breaks when you publish the package and a consumer installs it standalone. pnpm avoids this by not hoisting.[^1] Yarn Berry's PnP mode also prevents this by enforcing strict dependency resolution.

**Version mismatches.** In a workspace, `"sibling": "^1.0.0"` resolves to whatever version is on disk, even if the local package.json says version 2.0.0. The version constraint is ignored during development. You only find out there's a mismatch after publishing.

**Tooling assumptions.** Jest, TypeScript, ESLint, and other tools need configuration to understand workspace layouts. Some follow symlinks correctly; some don't. You end up with config files that exist solely to make tools aware of the structure.

**CI divergence.** The workspace graph during local development can differ from what CI or consumers see. A dependency that got hoisted locally might resolve differently in a fresh install.

**Build orchestration.** Workspaces solve where code lives, not how it gets built. If package A is TypeScript and package B imports it, you need to compile A before B can see the types. Workspaces handle linking; build order is a separate problem. This is why tools like [Turborepo](https://turbo.build/) and [Nx](https://nx.dev/) exist on top of workspaces: they understand the dependency graph and run builds, tests, and lints in the right order, with caching.

**Publishing coordination.** Workspaces wire up development, but publishing is a separate problem. If you update two packages together, you probably want to release them together with matching versions. Workspaces have no opinion on this. Tools like [Changesets](https://github.com/changesets/changesets) (JavaScript-only) track changes across workspace packages and coordinate version bumps. [Lerna's](https://lerna.js.org/) `lerna publish` does something similar. Cargo's `cargo publish` can publish workspace members in dependency order, but you still manage versioning manually. npm has scoped packages (`@babel/core`, `@myorg/utils`) but scopes are just namespacing for ownership. The registry has no concept of "these packages form a coherent unit." You publish each package individually and hope consumers update them in sync.

---

Looking at all this, my sense is that ecosystems made package creation cheap but left coordination expensive. People created lots of small packages, then needed workspaces to manage the friction that created.

I've never needed workspaces myself. If you use them regularly, I'd be curious to hear what pushed you there and whether they've been worth the complexity. What's worked? What's bitten you? [Let me know on Mastodon](https://mastodon.social/@andrewnez).

[^1]: [pnpm's motivation](https://pnpm.io/motivation) explains their non-flat `node_modules` structure and why it prevents phantom dependencies.
