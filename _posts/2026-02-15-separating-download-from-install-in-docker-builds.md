---
layout: post
title: "Separating Download from Install in Docker Builds"
date: 2026-02-15
description: "Most package managers could separate download from install for better Docker layer caching."
tags:
  - package-managers
  - docker
  - idea
---

Docker layer caching works best when each layer's inputs are narrow, and a layer that only depends on a lockfile can survive most builds untouched because you're usually changing application code, not dependencies. Most package managers combine downloading and installing into a single command though, so the layer that fetches from the registry also depends on source files, and any source change invalidates the layer and forces every dependency to re-download even when the lockfile is identical to last time.

That costs more than build time. crates.io, rubygems.org, and pypi.org all run on bandwidth donated by Fastly, and every redundant download in a Docker build is a cost someone else is volunteering to cover. npm is backed by Microsoft and Go's module proxy by Google, so they can absorb it, but for the community-funded registries it adds up. It feels instant from the developer's side, a few seconds of progress bars, so nobody thinks about the hundreds of HTTP requests firing against those services on every build where the lockfile has changed by even one line, or when you're debugging a failed install and rebuilding the same image over and over.

If package managers exposed a `download` that populates the local cache from the lockfile and an `install` that works offline from that cache, Docker layer caching would handle the rest:

```dockerfile
COPY lockfile .
RUN pkg download
COPY . .
RUN pkg install --offline
```

### go mod download

Go modules shipped with Go 1.11 in August 2018, and the community figured out the Docker pattern [within weeks](https://blog.container-solutions.com/faster-builds-in-docker-with-go-1-11). It's now the canonical Go Dockerfile pattern, recommended by [Docker's own documentation](https://docs.docker.com/guides/golang/build-images/):

```dockerfile
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /app .
```

`go mod download` reads `go.mod` and `go.sum` and fetches everything without doing any resolution or building, and the layer caches when those two files haven't changed.

Before Go 1.11, `GOPATH`-based dependency management didn't have a clean two-file manifest that could be separated from source code for layer caching, and the design of `go.mod` and `go.sum` as small standalone files made this Docker pattern fall out naturally once modules landed.

`go build` can still contact the checksum database (`sum.golang.org`) after `go mod download` to verify modules not yet in `go.sum`. Setting `GOFLAGS=-mod=readonly` after the download step prevents any network access during the build.

### pnpm fetch

pnpm is the only JavaScript package manager with a download-only command, and [`pnpm fetch`](https://pnpm.io/cli/fetch) was designed specifically for Docker. It reads `pnpm-lock.yaml` and downloads all packages into pnpm's content-addressable store without reading `package.json` at all:

```dockerfile
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch --prod
COPY . .
RUN pnpm install -r --offline --prod
```

The download layer only depends on the lockfile, and the install step uses `--offline` so it never touches the network. In monorepos this is particularly useful because you don't need to copy every workspace's `package.json` before the download step, and pnpm's authors thinking about container builds when they designed the CLI is the same kind of design awareness that made `go mod download` standard in Go.

### cargo fetch

[`cargo fetch`](https://doc.rust-lang.org/cargo/commands/cargo-fetch.html) reads `Cargo.lock` and downloads all crate source into the registry cache. After fetching, `--frozen` (which combines `--locked` and `--offline`) prevents any network access during the build:

```dockerfile
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && touch src/main.rs
RUN cargo fetch --locked
COPY . .
RUN cargo build --release --frozen
```

The dummy `src/main.rs` is needed because `cargo fetch` requires a valid project structure even though it's only reading the lockfile, and there's been an [open issue](https://github.com/rust-lang/cargo/issues/2644) about removing that requirement since 2016.

Almost nobody uses `cargo fetch` in Dockerfiles. The Rust community skipped straight to caching compilation with [cargo-chef](https://github.com/LukeMathWalker/cargo-chef), because compiling hundreds of crates is where builds spend most of their wall-clock time and downloads feel cheap by comparison. But every `cargo build` without a prior `cargo fetch` is still hitting crates.io for every crate whenever the layer rebuilds, and Fastly is absorbing that traffic whether it takes three seconds or thirty.

### pip download

[`pip download`](https://pip.pypa.io/en/stable/cli/pip_download/) fetches distributions into a directory, and `pip install --no-index --find-links` installs from that directory offline:

```dockerfile
COPY requirements.txt .
RUN pip download -r requirements.txt -d /tmp/pkgs
COPY . .
RUN pip install --no-index --find-links /tmp/pkgs -r requirements.txt
```

There's a [known bug](https://github.com/pypa/pip/issues/7863) where build dependencies like setuptools aren't included in the download, so packages that ship only as source distributions can fail during the offline install, though most Python projects in 2026 ship as prebuilt wheels unless you're doing something unusual with C extensions.

Neither Poetry nor uv have download-only commands. Poetry has had an [open issue](https://github.com/python-poetry/poetry/issues/2184) since 2020, and uv has [one](https://github.com/astral-sh/uv/issues/3163) with over a hundred upvotes. Both suggest exporting to `requirements.txt` and falling back to pip.

### bundle cache

Bundler has `bundle cache --no-install`, which fetches `.gem` files into `vendor/cache` without installing them, and `bundle install --local` installs from that cache without hitting the network:

```dockerfile
COPY Gemfile Gemfile.lock ./
RUN bundle cache --no-install
COPY . .
RUN bundle install --local
```

In practice this has enough rough edges that it rarely gets used in Dockerfiles. Git-sourced gems [still try to reach the remote](https://github.com/ruby/rubygems/issues/6499) even with `--local`, and platform-specific gems need `--all-platforms` plus `bundle lock --add-platform` to work across macOS development and Linux containers. The command was designed for vendoring gems into your repository rather than for Docker layer caching.

### npm and yarn

npm has no download-only command. `npm ci` reads the lockfile and skips resolution, but downloads and installs as one atomic operation with no way to separate them, and there's no `--download-only` flag or RFC proposing one.

Yarn Classic has an offline mirror that saves tarballs as a side effect of install, but no standalone download command. Yarn Berry has no fetch command either, despite [multiple](https://github.com/yarnpkg/berry/issues/4529) [open](https://github.com/yarnpkg/berry/issues/5998) issues requesting one.

The standard JavaScript Docker pattern is still:

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

When the lockfile hasn't changed the layer caches and nothing gets downloaded, but when it has changed every package re-downloads from the registry, and pnpm is the only JavaScript package manager where you can avoid that.

### BuildKit cache mounts

Docker BuildKit has `--mount=type=cache`, which persists a cache directory across builds so package managers can reuse previously downloaded packages even when the layer invalidates:

```dockerfile
RUN --mount=type=cache,target=/root/.npm npm ci
```

Cache mounts solve the problem from the wrong end. The package manager has the lockfile and knows the cache format, but Docker doesn't know any of that, which is why the Dockerfile author has to specify internal cache paths that vary between tools and sometimes between versions of the same tool. Not every build system supports BuildKit cache mounts either, and not every CI environment preserves them between builds, so a download command in the package manager itself would be more broadly useful.

| Registry | Funding | Download command | Offline install | Used in practice? |
|---|---|---|---|---|
| Go module proxy | Google | `go mod download` | implicit | Yes, canonical |
| npm registry | Microsoft | `pnpm fetch` (pnpm only; npm and yarn have nothing) | `--offline` | pnpm yes, others no |
| crates.io | Fastly (donated) | `cargo fetch` | `--frozen` | Rarely |
| PyPI | Fastly (donated) | `pip download` (pip only; Poetry and uv have nothing) | `--no-index --find-links` | Rarely |
| rubygems.org | Fastly (donated) | `bundle cache --no-install` | `--local` | Rarely |

Most package managers were designed around a persistent local cache on a developer's laptop, `~/.cache` or `~/.gem` or `~/.npm`, that warms up over time and stays warm. Ephemeral build environments start clean every time, and Docker layers are the only caching mechanism available, which means the network-dependent part of a build needs to be isolated from the rest for caching to work.

Opportunities:

- npm could add an `npm fetch` that reads `package-lock.json` and populates the cache without installing
- Poetry has had an [open issue](https://github.com/python-poetry/poetry/issues/2184) requesting a download command since 2020, and uv has [one](https://github.com/astral-sh/uv/issues/3163) with strong community interest
- Bundler's `bundle cache --no-install` would work if it handled git gems and cross-platform builds more reliably
- Cargo's `cargo fetch` shouldn't need a dummy source file to run a command that only reads the lockfile
