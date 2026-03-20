---
layout: post
title: "Package Manager Mirroring"
description: "Every mirroring tool I could find, and the protocols underneath them."
date: 2026-03-20 10:00:00 +0000
tags:
  - package-managers
  - reference
---

[Mike Fiedler](https://www.linkedin.com/in/mikefiedler/) from PyPI asked me recently: which package ecosystems have mirroring tools and what protocols do they use? Here's what I found.

This post primarily covers mirroring: tools and protocols for creating and maintaining copies of package registries. It doesn't cover private registries, artifact storage, or dependency proxying except where those tools also support mirroring.

## Ecosystems with mirroring tools

### apt/deb (Debian, Ubuntu)

The most mature mirroring ecosystem, with several tools at different levels of complexity.

[ftpsync](https://salsa.debian.org/mirror-team/archvsync) is the official tool. It runs a two-stage rsync: first syncing package files, then metadata (`Packages`, `Release`, `InRelease`). This ordering matters because it prevents apt clients from seeing references to packages that haven't arrived yet. Upstream mirrors can trigger syncs over SSH rather than waiting for a cron schedule.

[debmirror](https://wiki.debian.org/debmirror) supports HTTP, HTTPS, FTP, and rsync as transport. It verifies GPG signatures on `Release` files by default using gpgv, and checks downloaded file checksums (MD5, SHA1, SHA256) against what the Release file claims. It also supports pdiffs for incremental metadata updates, downloading diffs to `Packages`/`Sources` files rather than re-fetching them entirely.

[apt-mirror](https://github.com/apt-mirror/apt-mirror) is simpler: it downloads via wget over HTTP/HTTPS/FTP, does a full scan each run comparing against upstream package listings, and doesn't verify GPG signatures itself (leaving that to apt on the client side).

[aptly](https://www.aptly.info/) adds a layer on top. It verifies upstream GPG signatures on sync, then re-signs the published repository with the operator's own GPG key. Its snapshot model lets you capture point-in-time states of a mirror and atomically swap what's published, which is useful if you want to control exactly when updates roll out.

The underlying format ties it all together: `Packages` files list available packages with checksums, `Release` files are signed with GPG, and `InRelease` combines the release metadata and signature into a single file. Clients verify these signatures before trusting any mirror's content, so mirrors don't need to be trusted.

### rpm/yum/dnf (Fedora, RHEL, CentOS)

`reposync` downloads RPMs from a channel over HTTP/HTTPS using yum/dnf internals. `createrepo_c` generates the repository metadata: `repomd.xml` as the root index, plus `primary.xml.gz`, `filelists.xml.gz`, `other.xml.gz`, and `comps.xml` for group metadata. Each entry in `repomd.xml` includes SHA256 checksums and sizes for the corresponding metadata files. RPM packages are individually GPG-signed, and `repomd.xml` itself can carry a detached `.asc` signature. `reposync` requires the system to be subscribed to the channel it syncs, which is a licensing constraint.

[Foreman](https://theforeman.org/)/[Katello](https://theforeman.org/plugins/katello/) (backed by Pulp) adds configurable download policies: Immediate downloads everything on sync, On Demand downloads metadata only and fetches packages when clients request them, and Background syncs metadata first then downloads packages asynchronously. It handles RPM, Deb, OCI, Ansible, and Python content types, each with their own metadata format.

On the client side, package managers support both mirrorlist URLs (a plain list of mirror URLs) and metalink URLs (an XML document per RFC 5854 with multiple download sources and checksums). The metalink approach gives the client integrity information and multiple mirrors in a single response, so it can retry against a different source without another round trip.

### CPAN (Perl)

[File::Rsync::Mirror::Recent](https://metacpan.org/pod/File::Rsync::Mirror::Recent) uses a clever protocol on top of rsync. The upstream publishes cascading YAML files at multiple time intervals: `RECENT-1h.yaml`, `RECENT-6h.yaml`, `RECENT-1d.yaml`, up through `RECENT-1Y.yaml`. Each file lists recently changed paths with timestamps. A mirror client reads the shortest interval file first, syncs those files over rsync, and only falls back to longer interval files when the overlap between adjacent files disappears. Because new entries are prepended to an ordered list, the bulk of each file stays constant between runs, which makes rsync's delta algorithm very efficient. A `dirtymark` mechanism handles consistency: if the upstream breaks its ordering promise, it updates the dirtymark and all downstream mirrors discard their cached state and re-sync.

### CRAN (R)

Mirrors sync via rsync (SSH recommended). No dedicated tooling beyond rsync itself.

### PyPI (Python)

[PEP 381](https://peps.python.org/pep-0381/) defined a mirroring protocol, implemented by [bandersnatch](https://github.com/pypa/bandersnatch). Bandersnatch syncs over HTTPS and generates both HTML index pages ([PEP 503](https://peps.python.org/pep-0503/) Simple Repository API) and JSON index pages ([PEP 691](https://peps.python.org/pep-0691/)). Each package link includes a SHA256 hash for verification. The `bandersnatch verify` command crawls the local mirror and checks every file against PyPI's metadata, fixing missed files and removing anything unowned. Because the output is static files, a mirror doesn't need to run any registry software, just a web server. Supports filtering by package name, platform, and regex.

The PyPI ecosystem doesn't use GPG signing, relying on HTTPS transport and hash verification for integrity.

### npm

The npm registry started as a CouchDB app, and CouchDB's native `_changes` feed made mirroring straightforward: connect, receive a stream of changes, stay connected. The whole "follower" pattern that mirror tools depended on was built on this. As the registry grew, the backend moved to PostgreSQL behind an API that maintained CouchDB compatibility, but the streaming behavior was increasingly difficult to sustain.

In February 2025, GitHub [announced deprecation](https://github.blog/changelog/2025-02-26-changes-and-deprecation-notice-for-npm-replication-apis/) of the CouchDB-style replication APIs. The streaming modes (`feed=longpoll`, `feed=continuous`, `feed=eventsource`) and `include_docs` were all dropped, replaced by a paginated JSON API with a default limit of 1,000 and max of 10,000, using `startkey` for pagination. The [rollout was rough](https://github.com/orgs/community/discussions/152515): sequence number gaps of around 20 million, 503 and 401 errors, broken `startkey` pagination, and thousands of packages missing from the feed despite existing in the registry.

### RubyGems

The [rubygems-mirror](https://github.com/rubygems/rubygems-mirror) gem downloads the full specs index (`specs.4.8.gz`, serialized in Ruby Marshal format) over HTTP, then fetches `.gem` files and gemspec files for anything missing locally. It's a full-scan approach with no incremental changelog mechanism and no checksum verification during sync. Bundler has explicit mirror support built in (`bundle config mirror.https://rubygems.org https://my-mirror.example.com`).

[Geminabox](https://github.com/geminabox/geminabox) is more of a caching proxy than a mirror. With `Geminabox.rubygems_proxy = true`, it serves gems from rubygems.org on demand and caches them locally. It implements the Gemcutter push API and the RubyGems/Bundler dependency API, so `gem push` and `gem install` work against it without configuration changes.

### Maven Central (Java)

The repository format is a directory structure over HTTP with SHA-1 and MD5 checksums alongside each artifact, so any HTTP server or rsync can mirror it. Mirror configuration is built into Maven via `~/.m2/settings.xml`. The format is simple enough that rsync or wget does the job without dedicated tooling.

### Cargo/crates.io (Rust)

[Panamax](https://github.com/panamax-rs/panamax) mirrors both the crate registry and rustup artifacts. The crates.io registry index is a Git repository where each crate has a JSON file listing versions, dependencies, and SHA256 checksums. Panamax syncs the index via `git pull` and downloads crate files over HTTPS for anything not already present locally. Rustup artifacts use TOML-based channel manifests with per-target SHA256 hashes. Panamax includes a built-in HTTP server for serving the mirror.

### Docker/OCI

[Harbor](https://goharbor.io/) implements the OCI Distribution Specification over HTTPS. All content is stored by SHA256 digest (content-addressable), so integrity verification is built into the storage model. Harbor supports both push and pull replication policies between registries, filtered by repository name, tag, and label, triggered on schedule or on push events. It handles Cosign (Sigstore) and Notation (CNCF Notary Project) signatures, storing them as OCI artifacts alongside the images they sign and replicating them together. Replication targets include other Harbor instances, Docker Hub, AWS ECR, GCR, Azure ACR, and any OCI-compliant registry.

### Homebrew

`HOMEBREW_ARTIFACT_DOMAIN` points at alternative bottle sources. Pre-built bottles are distributed as OCI artifacts through GitHub Container Registry, so mirroring means replicating an OCI registry. The formulae/tap repo (git) needs mirroring separately from bottles.

### Conda

[conda-mirror](https://github.com/conda-tools/conda-mirror) syncs over HTTPS, reading `repodata.json` per platform subdirectory (e.g., `linux-64/repodata.json`). Each package entry includes md5 and sha256 checksums. Supports blacklist/whitelist filtering with glob patterns against any field in repodata.json, and platform selection. Incremental on subsequent runs by skipping files already present locally. The newer sharded repodata format ([CEP 16](https://conda.org/learn/ceps/cep-0016/)) uses content-addressable zstandard-compressed msgpack shards.

### Packagist (PHP/Composer)

[composer/mirror](https://github.com/composer/mirror/) syncs package metadata over https by polling the [metadata-changes-url](https://github.com/composer/composer/blob/9d18266945b42009057694ddedd7b159badd5eff/res/composer-repository-schema.json#L52) endpoint — a URL advertised in the repository's packages.json that returns a list of recently changed package metadata files, allowing the mirror to fetch only what has changed rather than rescanning everything.

## Protocols and standards for mirroring

### Rsync

How most mirror networks were built. A mirror operator runs rsync against the upstream on a schedule, gets an exact copy, and serves it locally. Debian, CPAN, CRAN, and Fedora all use this. Efficient for incremental syncs because it only transfers changed blocks, but it requires the upstream to run an rsync daemon or allow SSH access, and it doesn't work over plain HTTP. For a registry the size of PyPI or npm, a full rsync mirror means storing and syncing terabytes of packages that most mirrors will never serve.

### Metalink (RFC 5854)

An XML format listing multiple download URLs for the same file along with checksums, geographic hints, and priority ordering. A client fetching a metalink document gets enough information to pick the nearest mirror, verify the download, and fall back to another source on failure, all in a single round trip. Fedora's dnf uses metalink URLs. Adoption is mostly limited to Linux distros. The core idea of bundling mirror URLs with integrity information in one response could be done more simply with JSON.

### PEP 381 (Python mirroring protocol)

Specifies how to create and maintain a full mirror of PyPI using bandersnatch. The mirror syncs the Simple Repository API (PEP 503/691), which is static HTML or JSON listing packages with download URLs and hashes. Because the API produces static files, a mirror doesn't need to run any registry software. This is the only ecosystem-specific mirroring protocol that's been formally specified as a standard.

### Debian repository format

The most tightly specified mirror format. Signed `Release`/`InRelease` files mean mirrors don't need to be trusted. ftpsync's two-stage sync and metadata ordering prevent clients from seeing inconsistent state. debmirror's pdiff support and aptly's snapshot model show two different approaches to keeping mirrors efficient and controlled.

### OCI Distribution Specification

Content-addressable storage by SHA256 digest, with manifests describing image layers and their relationships. Replication between registries uses the same HTTP API that clients use for pull/push, so any OCI-compliant registry can be a replication target. Artifact signing (Cosign, Notation) travels with the content as linked OCI artifacts rather than requiring a separate trust infrastructure.

### RPM repository metadata (repomd)

`repomd.xml` serves as a root index pointing to compressed XML metadata files, each with checksums and sizes. Individual RPMs carry their own GPG signatures. The format is straightforward enough that `createrepo_c` can regenerate metadata from a directory of RPM files, making it easy to build custom mirrors from arbitrary package sets.

## Pull-through caches

These are reactive only, fetching and caching packages on first client request with no proactive sync:

- [Sonatype Nexus OSS](https://github.com/sonatype/nexus-public) - Maven, npm, Docker, PyPI, NuGet, RubyGems, Helm, Go, and others (proactive sync is Pro-only)
- [JFrog Artifactory OSS](https://jfrog.com/artifactory/) - Maven, Gradle, Ivy, SBT only in the free edition (broader format support requires Pro)
- [Verdaccio](https://github.com/verdaccio/verdaccio) - npm
- [Athens](https://github.com/gomods/athens) - Go modules
- [devpi](https://github.com/devpi/devpi) - Python

[Pulp](https://pulpproject.org/) is the exception. It supports RPM, Deb, Python, npm, Container, Ansible, Maven, Gem, and others through content plugins, and it can proactively sync from upstream rather than waiting for client requests.

Each remote has a download policy:

- `immediate` - downloads all artifacts during sync
- `on_demand` - downloads metadata only, fetches artifacts when clients request them
- `streamed` - proxies without caching

Combined with sync policies:

- `additive` - keeps existing content, adds new from upstream
- `mirror_content_only` - makes local repo match upstream exactly
- `mirror_complete` - bit-for-bit copy including metadata signatures

`immediate` + `mirror_complete` gives you a true proactive mirror rather than a pull-through cache.

Each plugin supports filtering to mirror a subset rather than an entire upstream registry:

- RPM - include/exclude by package name, architecture, version
- Python - filter by package type (sdist, wheel), platform, keep only N latest versions
- Container - tag include/exclude with wildcards
- Deb - handles partial upstream mirrors
- OSTree - wildcard include/exclude on commits

The sync itself is an explicit command (`pulp rpm repository sync --name foo --sync-policy mirror_complete`), scheduled externally via cron or through [Foreman](https://theforeman.org/)/[Katello](https://theforeman.org/plugins/katello/) sync plans since Pulp doesn't include a built-in scheduler.

I've been quietly building [git-pkgs/proxy](https://github.com/git-pkgs/proxy) as a side project. It's a caching proxy written in Go that supports 15 ecosystems (npm, Cargo, RubyGems, Go, PyPI, Maven, NuGet, Composer, Hex, pub.dev, Conan, Conda, CRAN, OCI/Docker, Debian, and RPM) through a single binary. It rewrites upstream metadata to point artifact URLs back through the proxy, then caches artifacts on first request. It also has a version cooldown feature that quarantines newly published versions for a configurable period before serving them, which helps with supply chain attacks that rely on fast consumption of malicious releases.

It shares a lot of code with [git-pkgs](https://github.com/git-pkgs) and its various modules, and I'm hoping to integrate it into [Forgejo](https://forgejo.org/) in the future. Right now it's a pull-through cache. This research is feeding directly into what I build next: selective proactive mirroring, so you can tell the proxy to go fetch specific packages or ecosystems on a schedule rather than waiting for client requests.

If I've missed an ecosystem or got something wrong, reach out on [Mastodon](https://mastodon.social/@andrewnez) or submit a pull request on [GitHub](https://github.com/andrew/nesbitt.io/blob/master/_posts/2026-03-20-package-manager-mirroring.md).
