---
layout: post
title: "Package Manager Magic Files"
date: 2026-03-05 10:00 +0000
description: "Package manager magic files and where to find them: .npmrc, MANIFEST.in, Directory.Packages.props, .pnpmfile.cjs, and more."
tags:
  - package-managers
  - reference
---

A follow-up to my post on [git's magic files](/2026/02/05/git-magic-files.html). Most package managers have a manifest and a lockfile, and most developers stop there. But across the ecosystems I track on [ecosyste.ms](https://ecosyste.ms), package managers check for dozens of other files beyond the manifest and lockfile, controlling where packages come from, what gets published, how versions resolve, and what code runs during installation. These files tend to be poorly documented, inconsistently named, and useful once you know they exist.

### Configuration

Registry URLs, auth tokens, proxy settings, cache behavior. Every package manager has a way to configure these, and they almost always live outside the manifest.

[`.npmrc`](https://docs.npmjs.com/cli/v11/configuring-npm/npmrc) is an INI-format file that can live at the project root, in your home directory, or globally. npm and pnpm both read it. It controls the registry URL, auth tokens for private registries, proxy settings, and dozens of install behaviors like `legacy-peer-deps` and `engine-strict`. There's a footgun here: if an `.npmrc` ends up inside a published package tarball, npm will silently apply those settings when someone installs your package in their project. Less well known are the `shell`, `script-shell`, and `git` settings, which point at arbitrary executables that npm will invoke during lifecycle scripts and git operations. [Research by Snyk and Cider Security](https://snyk.io/blog/exploring-npm-security-vulnerabilities/) showed these as viable attack vectors: a malicious `.npmrc` committed to a repository can redirect script execution without touching `package.json` at all.

[`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc) replaced the INI format of Yarn Classic's `.yarnrc`. It configures which linker to use (PnP, pnpm-style, or traditional `node_modules`), registry auth, and the `pnpMode` setting that controls how strictly Yarn enforces its dependency resolution. The `yarnPath` setting is security-sensitive: it points to a JavaScript file that Yarn will execute as its own binary, so a malicious `.yarnrc.yml` can hijack the entire package manager.

[`bunfig.toml`](https://bun.sh/docs/runtime/bunfig) is Bun's config file, covering registry config, install behavior, and the test runner all in one TOML file.

[`pip.conf`](https://pip.pypa.io/en/stable/topics/configuration/) on Unix and `pip.ini` on Windows, searched at `~/.config/pip/pip.conf`, `~/.pip/pip.conf`, and `/etc/pip.conf`. The `PIP_CONFIG_FILE` environment variable can override all of these or point to `/dev/null` to disable config entirely. Malformed config files are silently ignored rather than producing errors, so you can have broken configuration for months without realizing it.

[`uv.toml`](https://docs.astral.sh/uv/concepts/configuration-files/) or the `[tool.uv]` section in `pyproject.toml`.

[`.bundle/config`](https://bundler.io/man/bundle-config.1.html) stores Bundler's per-project config, created by `bundle config set`. RubyGems has its own `.gemrc` file, which Bundler deliberately ignores because it calls `Gem::Installer` directly. The credentials file at `~/.gem/credentials` must have `0600` permissions or RubyGems refuses to read it.

[`.cargo/config.toml`](https://doc.rust-lang.org/cargo/reference/config.html) is the most interesting of the bunch because it's hierarchical: Cargo walks up the directory tree merging config files as it goes, so you can have workspace-level settings that individual crates inherit. It controls registries, proxy settings, build targets, and command aliases. A backwards-compatibility quirk means Cargo still reads `.cargo/config` without the `.toml` extension, and if both files exist, the extensionless one wins, which is an easy way to have a stale config file shadow your actual settings.

[`.condarc`](https://docs.conda.io/projects/conda/en/stable/user-guide/configuration/use-condarc.html) is searched at six different paths from `/etc/conda/.condarc` through `~/.condarc` to `$CONDA_PREFIX/.condarc`, plus `.d/` directories at each level for drop-in fragments, and you can put one inside a specific conda environment to configure just that environment. Every setting also has a `CONDA_UPPER_SNAKE_CASE` environment variable equivalent.

[`~/.m2/settings.xml`](https://maven.apache.org/settings.html) holds Maven's repositories and credentials, plus `~/.m2/settings-security.xml` stores the master password used to decrypt encrypted passwords in the main settings file. Most developers don't know `settings-security.xml` exists. `.mvn/maven.config` holds per-project default CLI arguments (since Maven 3.9.0, each arg must be on its own line), and `.mvn/jvm.config` sets JVM options.

[`gradle.properties`](https://docs.gradle.org/current/userguide/build_environment.html) lives at both project and user level. Init scripts in `~/.gradle/init.d/` run before every build, which is how enterprises inject internal repository configurations across all projects.

[`auth.json`](https://getcomposer.org/doc/articles/authentication-for-private-packages.md) keeps Composer credentials separate from `composer.json` (per-project or at `~/.composer/auth.json`) so you can gitignore it.

[`nuget.config`](https://learn.microsoft.com/en-us/nuget/reference/nuget-config-file) is XML searched hierarchically from the project directory up to the drive root, then at the user level. Like pip, malformed XML is silently ignored.

[`deno.json`](https://docs.deno.com/runtime/fundamentals/configuration/) is both configuration and import map, controlling formatting, linting, test config, lock file behavior, and dependency imports in a single file. If you have a separate `import_map.json`, Deno reads that too, though the trend is toward folding everything into `deno.json`.

### Publishing

What gets included or excluded when you publish a package. People accidentally ship secrets and accidentally omit files they need in roughly equal measure.

[`.npmignore`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files) works like `.gitignore` but for `npm pack` and `npm publish`. If it doesn't exist, npm falls back to `.gitignore`. But if you create an `.npmignore`, it completely replaces `.gitignore` for packaging purposes, they are not merged. This means patterns you had in `.gitignore` to keep `.env` files or credentials out of version control no longer protect you from publishing them.
`npm-shrinkwrap.json` is identical in format to `package-lock.json` but gets included inside published tarballs. It's the only npm lock file that travels with a published package, intended for CLI tools and daemons that want locked transitive dependencies for their consumers rather than letting the consumer's resolver pick versions.

[`MANIFEST.in`](https://packaging.python.org/en/latest/guides/using-manifest-in/) controls what goes into a Python source distribution using directives like `include`, `exclude`, `recursive-include`, `graft`, and `prune`. It only matters for sdists, not wheels.

`.helmignore` controls what gets excluded when packaging a Helm chart, following `.gitignore` syntax.

### Workspaces

Monorepo topology and inter-package relationships. The JavaScript ecosystem has the most options here, which probably says something about the JavaScript ecosystem.

[`pnpm-workspace.yaml`](https://pnpm.io/pnpm-workspace_yaml) defines workspace membership with a `packages:` field. Where npm and Yarn put this in a `workspaces` field in `package.json`, pnpm requires a separate file.

`lerna.json` handles versioning and publishing across workspace packages, though Lerna's remaining value is mostly the publishing workflow (changelogs, version bumps). `nx.json` and `turbo.json` configure task pipelines and caching for Nx and Turborepo monorepo builds.

[`go.work`](https://go.dev/ref/mod#workspaces) (added in Go 1.18) lists `use` directives pointing to local module directories so you can develop across multiple modules without `replace` directives scattered through your `go.mod` files. It generates a companion `go.work.sum` checksum file.

`settings.gradle` / `settings.gradle.kts` declares all Gradle subprojects with `include` statements and is mandatory for multi-project builds. Maven uses `<modules>` in a parent `pom.xml`.

### Overrides and resolution

When a transitive dependency has a bug or a security vulnerability and you can't wait for every package in the chain to release an update, override files let you force a specific version or patch a package in place. Most developers don't know these mechanisms exist and spend hours working around dependency conflicts that a single config line would fix.

In the JavaScript ecosystem, npm has [`overrides`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides), Yarn has [`resolutions`](https://yarnpkg.com/configuration/manifest#resolutions), and pnpm has [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides), all fields in `package.json` that force specific versions of transitive dependencies. Yarn Berry and pnpm also support patching dependencies in place: Yarn's `patch:` protocol stores diff files in `.yarn/patches/`, and pnpm's `pnpm.patchedDependencies` references diffs in a `patches/` directory, built into the workflow via `pnpm patch` and `pnpm patch-commit`.

[`.pnpmfile.cjs`](https://pnpm.io/pnpmfile) goes further than any of these: the `readPackage` hook lets you programmatically rewrite any package's `package.json` at install time, and `afterAllResolved` can modify the lockfile after resolution. It's the nuclear option for dependency problems, living next to the lockfile and running before anything gets installed.

[`constraints.txt`](https://pip.pypa.io/en/stable/user_guide/#constraints-files) is used via `pip install -c constraints.txt` to pin versions of packages without triggering their installation. It's been available since pip 7.1, yet almost nobody uses it despite being exactly what large organizations need for base image management and reproducible environments. uv has `override-dependencies` in `[tool.uv]` for the same purpose with better ergonomics.

[`Directory.Packages.props`](https://learn.microsoft.com/en-us/nuget/consume-packages/central-package-management) is worth knowing about if you work in .NET. NuGet's Central Package Management (6.4+) lets you put a single file at the repo root that sets `<PackageVersion>` for all projects, so individual `.csproj` files use `<PackageReference>` without version numbers. It eliminates version drift across large solutions and is one of the better implementations of centralized version management I've seen. `Directory.Build.props` can inject shared package references into all projects too.

[`gradle/libs.versions.toml`](https://docs.gradle.org/current/userguide/version_catalogs.html) is Gradle's version catalog, with sections for `[versions]`, `[libraries]`, `[bundles]`, and `[plugins]`, referenced in build files as typed accessors like `libs.someLibrary`.

`cabal.project` supports `constraints:` stanzas for pinning transitive Haskell deps, and `cabal.project.freeze` locks everything down.

### Vendoring and integrity

Beyond lockfiles, some package managers support vendoring all dependency source code into the repository and tracking its integrity.

`.cargo-checksum.json` lives in each vendored crate directory after running [`cargo vendor`](https://doc.rust-lang.org/cargo/commands/cargo-vendor.html), containing the SHA256 of the original tarball and per-file checksums. If you need to patch vendored source (which you sometimes do for air-gapped builds), setting `"files": {}` in the checksum file disables integrity checking for that crate, which is the known workaround and also completely defeats the purpose of the checksums.

[`GONOSUMCHECK` and `GONOSUMDB`](https://go.dev/ref/mod#private-modules) are Go environment variables that bypass the checksum database for private modules, which is how enterprises use Go modules without leaking internal module paths to Google's infrastructure. Go's `vendor/modules.txt` (generated by `go mod vendor`) lists vendored packages and their module versions, and the Go toolchain verifies it matches `go.mod`. If your repo has a `vendor/` directory and `go.mod` specifies Go 1.14+, vendoring is automatically enabled without any flag, which surprises people who have a stale vendor directory they forgot about.

`.yarn/cache/` and `.pnp.cjs` make up Yarn Berry's zero-install setup: compressed zip archives of every dependency and the Plug'n'Play loader mapping package names to zip locations, both committed to version control. After `git clone`, the project works without running `yarn install`, though your repository size will grow substantially.


[`.terraform.lock.hcl`](https://developer.hashicorp.com/terraform/language/files/dependency-lock) records Terraform provider version locks with platform-specific hashes, which means a lock file generated on macOS may fail verification on Linux CI unless you've run `terraform providers lock` for multiple platforms.

### Hooks and scripts

Lifecycle scripts that run during install, build, or publish. Supply chain attacks often hide here, but so does a lot of useful automation.

[`.pnpmfile.cjs`](https://pnpm.io/pnpmfile) isn't just for overrides. pnpm's hooks API includes `readPackage` for rewriting manifests, `afterAllResolved` for modifying the resolved lockfile, and custom fetchers for alternative package fetching logic.

`.yarn/plugins/` contains committed plugin files that hook into Yarn Berry's lifecycle. `.yarn/sdks/` holds editor integration files generated by `@yarnpkg/sdks` to make PnP work with IDEs.

`.mvn/extensions.xml` loads Maven extensions that hook into the build lifecycle before anything else runs. Gradle's init scripts in `~/.gradle/init.d/` execute before every build and can inject repositories, apply plugins, or configure all projects. Cargo's `build.rs` is a build script that runs before compilation, generating code, linking native libraries, or setting cfg flags. Go's `//go:generate` directives in source files run via `go generate` for code generation, though they're not part of the build itself.

<hr>

I'll keep updating this post as I find more. If you know of package manager magic files I've missed or have corrections, reach out on [Mastodon](https://mastodon.social/@andrewnez) or submit a pull request on [GitHub](https://github.com/andrew/nesbitt.io).
