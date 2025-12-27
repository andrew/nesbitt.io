---
layout: post
title: "How uv got so fast"
date: 2025-12-26 10:00 +0000
description: "uv's speed comes from engineering decisions, not just Rust. Static metadata, dropping legacy formats, and standards that didn't exist five years ago."
tags:
  - package-managers
  - python
---

uv installs packages faster than pip by an order of magnitude. The usual explanation is "it's written in Rust." That's true, but it doesn't explain much. Plenty of tools are written in Rust without being notably fast. The interesting question is what design decisions made the difference.

Charlie Marsh's [Jane Street talk](https://www.janestreet.com/tech-talks/uv-an-extremely-fast-python-package-manager/) and a [Xebia engineering deep-dive](https://xebia.com/blog/uv-the-engineering-secrets-behind-pythons-speed-king/) cover the technical details well. The interesting parts are the design decisions: standards that enable fast paths, things uv drops that pip supports, and optimizations that don't require Rust at all.

## The standards that made uv possible

pip's slowness isn't a failure of implementation. For years, Python packaging required executing code to find out what a package needed.

The problem was [setup.py](https://setuptools.pypa.io/). You couldn't know a package's dependencies without running its setup script. But you couldn't run its setup script without installing its build dependencies. [PEP 518](https://peps.python.org/pep-0518/) in 2016 called this out explicitly: "You can't execute a setup.py file without knowing its dependencies, but currently there is no standard way to know what those dependencies are in an automated fashion without executing the setup.py file."

This chicken-and-egg problem forced pip to download packages, execute untrusted code, fail, install missing build tools, and try again. Every install was potentially a cascade of subprocess spawns and arbitrary code execution. Installing a source distribution was essentially `curl | bash` with extra steps.

The fix came in stages:

- [PEP 518](https://peps.python.org/pep-0518/) (2016) created pyproject.toml, giving packages a place to declare build dependencies without code execution. The TOML format was borrowed from Rust's Cargo, which makes a Rust tool returning to fix Python packaging feel less like coincidence.
- [PEP 517](https://peps.python.org/pep-0517/) (2017) separated build frontends from backends, so pip didn't need to understand setuptools internals.
- [PEP 621](https://peps.python.org/pep-0621/) (2020) standardized the `[project]` table, so dependencies could be read by parsing TOML rather than running Python.
- [PEP 658](https://peps.python.org/pep-0658/) (2022) put package metadata directly in the Simple Repository API, so resolvers could fetch dependency information without downloading wheels at all.

PEP 658 went live on PyPI in May 2023. uv launched in February 2024. uv could be fast because the ecosystem finally had the infrastructure to support it. A tool like uv couldn't have shipped in 2020. The standards weren't there yet.

Other ecosystems figured this out earlier. Cargo has had static metadata from the start. npm's package.json is declarative. Python's packaging standards finally bring it to parity.

## What uv drops

Speed comes from elimination. Every code path you don't have is a code path you don't wait for.

uv's [compatibility documentation](https://docs.astral.sh/uv/pip/compatibility/) is a list of things it doesn't do:

**No .egg support.** Eggs were the pre-wheel binary format. pip still handles them; uv doesn't even try. The format has been obsolete for over a decade.

**No pip.conf.** uv ignores pip's configuration files entirely. No parsing, no environment variable lookups, no inheritance from system-wide and per-user locations.

**No bytecode compilation by default.** pip compiles .py files to .pyc during installation. uv skips this step, shaving time off every install. You can opt in if you want it.

**Virtual environments required.** pip lets you install into system Python by default. uv inverts this, refusing to touch system Python without explicit flags. This removes a whole category of permission checks and safety code.

**Stricter spec enforcement.** pip accepts malformed packages that technically violate packaging specs. uv rejects them. Less tolerance means less fallback logic.

**Ignoring requires-python upper bounds.** When a package says it requires `python<4.0`, uv ignores the upper bound and only checks the lower. This reduces resolver backtracking dramatically since upper bounds are almost always wrong. Packages declare `python<4.0` because they haven't tested on Python 4, not because they'll actually break. The constraint is defensive, not predictive.

**First-index wins by default.** When multiple package indexes are configured, pip checks all of them. uv picks from the first index that has the package, stopping there. This prevents dependency confusion attacks and avoids extra network requests.

Each of these is a code path pip has to execute and uv doesn't.

## Optimizations that don't need Rust

Some of uv's speed comes from Rust. But not as much as you'd think. Several key optimizations could be implemented in pip today:

**HTTP range requests for metadata.** [Wheel files](https://packaging.python.org/en/latest/specifications/binary-distribution-format/) are zip archives, and zip archives put their file listing at the end. uv tries PEP 658 metadata first, falls back to HTTP range requests for the zip central directory, then full wheel download, then building from source. Each step is slower and riskier. The design makes the fast path cover 99% of cases. None of this requires Rust.

**Parallel downloads.** pip downloads packages one at a time. uv downloads many at once. Any language can do this.

**Global cache with hardlinks.** pip copies packages into each virtual environment. uv keeps one copy globally and uses [hardlinks](https://en.wikipedia.org/wiki/Hard_link) (or copy-on-write on filesystems that support it). Installing the same package into ten venvs takes the same disk space as one. Any language with filesystem access can do this.

**Python-free resolution.** pip needs Python running to do anything, and invokes build backends as subprocesses to get metadata from legacy packages. uv parses TOML and wheel metadata natively, only spawning Python when it hits a setup.py-only package that has no other option.

**PubGrub resolver.** uv uses the [PubGrub algorithm](https://github.com/dart-lang/pub/blob/master/doc/solver.md), originally from Dart's pub package manager. Both pip and PubGrub use backtracking, but PubGrub applies conflict-driven clause learning from SAT solvers: when it hits a dead end, it analyzes why and skips similar dead ends later. This makes it faster on complex dependency graphs and better at explaining failures. pip could adopt PubGrub without rewriting in Rust.

## Where Rust actually matters

Some optimizations do require Rust:

**Zero-copy deserialization.** uv uses [rkyv](https://rkyv.org/) to deserialize cached data without copying it. The data format is the in-memory format. Libraries like FlatBuffers achieve this in other languages, but rkyv integrates tightly with Rust's type system.[^1]

**Thread-level parallelism.** Python's GIL forces parallel work into separate processes, with IPC overhead and data copying. Rust can parallelize across threads natively, sharing memory without serialization boundaries. This matters most for resolution, where the solver explores many version combinations.[^1]

**No interpreter startup.** Every time pip spawns a subprocess, it pays Python's startup cost. uv is a single static binary with no runtime to initialize.

**Compact version representation.** uv packs versions into u64 integers where possible, making comparison and hashing fast. Over 90% of versions fit in one u64. This is micro-optimization that compounds across millions of comparisons.

These are real advantages. But they're smaller than the architectural wins from dropping legacy support and exploiting modern standards.

## Design over language

uv is fast because of what it doesn't do, not because of what language it's written in. The standards work of PEP 518, 517, 621, and 658 made fast package management possible. Dropping eggs, pip.conf, and permissive parsing made it achievable. Rust makes it a bit faster still.

pip could implement parallel downloads, global caching, and metadata-only resolution tomorrow. It doesn't, largely because backwards compatibility with fifteen years of edge cases takes precedence. But it means pip will always be slower than a tool that starts fresh with modern assumptions.

Other package managers could learn from this: static metadata, no code execution to discover dependencies, and the ability to resolve everything upfront before downloading. Cargo and npm have operated this way for years. If your ecosystem requires running arbitrary code to find out what a package needs, you've already lost.

[^1]: An earlier version of this post overstated how Rust-specific these techniques are. Thanks to [tef](https://tef.computer/) for the correction.
