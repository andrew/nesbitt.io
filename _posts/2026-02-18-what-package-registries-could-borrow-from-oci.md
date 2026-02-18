---
layout: post
title: "What Package Registries Could Borrow from OCI"
date: 2026-02-18
description: "OCI's storage primitives applied to package management."
tags:
  - package-managers
  - oci
  - deep-dive
---

Every package manager ships code as an archive, and every one of them has a slightly different way to do it. npm wraps tarballs in a `package/` directory prefix. RubyGems nests gzipped files inside an uncompressed tar. Alpine concatenates three gzip streams and calls it a package. Python cycled through four distribution formats in twenty years. RPM used cpio as its payload format for nearly three decades before finally dropping it in 2025.

Meanwhile, the container world converged on a single format: OCI, the Open Container Initiative spec. And over the past few years, OCI registries have quietly started storing things that aren't containers at all: Helm charts, Homebrew bottles, WebAssembly modules, AI models. The format was designed for container images, but the underlying primitives turn out to be general enough that it's worth asking whether every package manager could use OCI for distribution.

### What OCI actually is

OCI defines three specifications: a Runtime Spec (how to run containers), an Image Spec (how to describe container contents), and a Distribution Spec (how to push and pull from registries).

At the storage level, an OCI registry deals in two primitives: **manifests** and **blobs**. A manifest is a JSON document that references one or more blobs by their SHA-256 digest. A blob is an opaque chunk of binary content, and tags are human-readable names that point to manifests.

A container image manifest looks like this:

```json
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config": {
    "mediaType": "application/vnd.oci.image.config.v1+json",
    "digest": "sha256:abc123...",
    "size": 1234
  },
  "layers": [
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "digest": "sha256:def456...",
      "size": 56789
    }
  ]
}
```

The config blob holds metadata (what OS, what architecture, what environment variables). Each layer blob holds a tarball of filesystem changes. The registry doesn't care what's inside the blobs, only that each one is identified and verified by its digest.

The [v1.1 update](https://opencontainers.org/posts/blog/2024-03-13-image-and-distribution-1-1/) in February 2024 added `artifactType`, which declares what kind of thing a manifest describes so a registry can distinguish a Helm chart from a container image from a Homebrew bottle, and `subject`, which lets one artifact reference another and is how signatures and SBOMs get attached to the thing they describe. Before 1.1, people stored non-container artifacts by setting custom media types on the config blob, which worked but registries sometimes rejected or mishandled the results.

To push an artifact, you upload each blob (to `/v2/<name>/blobs/uploads/`), then push a manifest that references those blobs by digest and size. To pull, you fetch the manifest, read the digests, and download the blobs. Because everything is addressed by digest, the registry only stores one copy of any given blob even if multiple artifacts reference it.

### Why OCI and not something purpose-built

The format itself carries a lot of container-specific ceremony, but every major cloud provider already runs an OCI-compliant registry: GitHub Container Registry, Amazon ECR, Azure Container Registry, Google Artifact Registry. Self-hosted options like Harbor and Zot are mature. Authentication, access control, replication, and CDN-backed blob storage all exist because container registries already solved those problems at scale, and a package registry built on OCI inherits all of it without reimplementing any of it.

[ORAS](https://oras.land/) (OCI Registry As Storage) is a CNCF project that abstracts the multi-step OCI upload process into simple commands:

```
oras push registry.example.com/mypackage:1.0.0 \
  package.tar.gz:application/vnd.example.package.v1.tar+gzip
```

This uploads the file as a blob, creates a manifest referencing it, and tags it. Helm, Flux, Crossplane, and the Sigstore signing tools all use ORAS or the underlying OCI client libraries.

### What package managers ship today

No individual choice here is wrong, but seventeen different answers to the same basic problem suggests the archive format was never the part anyone thought hard about.

| Ecosystem | Format | What's inside |
|---|---|---|
| npm | `.tgz` (gzip tar) | Files under a `package/` prefix |
| PyPI | `.whl` (zip) or `.tar.gz` | Wheel: pre-built files + `.dist-info`. Sdist: source + `PKG-INFO` |
| RubyGems | `.gem` (tar of gzips) | `metadata.gz` + `data.tar.gz` + `checksums.yaml.gz` |
| Maven | `.jar` (zip) | Compiled `.class` files + `META-INF/MANIFEST.MF` |
| Cargo | `.crate` (gzip tar) | Source + `Cargo.toml` + `Cargo.lock` |
| NuGet | `.nupkg` (zip) | DLL assemblies + `.nuspec` XML metadata |
| Homebrew | `.bottle.tar.gz` | Compiled binaries under install prefix |
| Go | `.zip` | Source under `module@version/` path prefix |
| Hex | Outer tar of inner files | `VERSION` + `metadata.config` + `contents.tar.gz` + `CHECKSUM` |
| Debian | `.deb` (ar archive) | `debian-binary` + `control.tar.*` + `data.tar.*` |
| RPM | Custom binary format | Header sections + cpio payload (v4) or custom format (v6)[^rpm5] |
| Alpine | Concatenated gzip streams | Signature + control tar + data tar |
| Conda | `.conda` (zip of zstd tars) or `.tar.bz2` | `info/` metadata + package content |
| Dart/pub | `.tar.gz` | Source + `pubspec.yaml` |
| Swift PM | `.zip` | Source archive |
| CPAN | `.tar.gz` | `.pm` files + `Makefile.PL` + `META.yml` + `MANIFEST` |
| CocoaPods | No archive format | `.podspec` points to source URLs |

[^rpm5]: v5 was a fork by Jeff Johnson, RPM's long-time maintainer, after he split from Red Hat around 2007. No major distribution adopted it. The mainline project skipped to v6 to avoid confusion.

### The weird ones

**RubyGems** nests compression inside archiving instead of the other way around. A `.gem` is an uncompressed tar containing individually gzipped files. So the outer archive provides no compression, and each component is compressed separately. This means you can extract the metadata without decompressing the data, which is a reasonable optimization, but the format looks strange at first glance because everything else in the Unix world puts gzip on the outside.

**Alpine APK** abuses a quirk of the gzip specification. The gzip format allows concatenation of multiple streams into a single file, and technically any compliant decompressor should handle it. Alpine packages are three separate gzip streams (signature, control, data) concatenated into one file. Since gzip provides no metadata about where one stream ends and the next begins, you have to fully decompress each segment to find the boundary. Kernel modules inside APK packages are often already gzipped, so you get gzip-inside-tar-inside-gzip.

**RPM** used cpio as its payload format from 1995 until RPM v6 shipped in September 2025. The cpio format has a 4GB file size limit baked into its header fields. For 30 years, no RPM package could contain a file larger than 4GB. RPM v6 finally dropped cpio in favor of a custom format.

**Debian** deliberately chose the `ar` archive format from the 1970s. The reasoning was practical: the extraction tools (`ar`, `tar`, `gzip`) are available on virtually every Unix system, even in minimal rescue environments. You can unpack a `.deb` with nothing but POSIX utilities. Probably the most intentional format choice on this list.

**npm's `package/` prefix** means every tarball wraps its contents in a `package/` directory that gets stripped during install. This causes issues with relative `file:` dependencies inside tarballs, where npm tries to resolve paths relative to the tarball rather than the unpacked directory.

**Python** cycled through four distribution formats. Source tarballs with `setup.py` (1990s), eggs (2004, inspired by Java JARs, could be imported while still zipped), sdists (standardized tar.gz), and finally wheels (2012). Eggs lived for nineteen years before PyPI stopped accepting them in August 2023. The wheel format encodes Python version, ABI tag, and platform tag in the filename, which is more metadata than most ecosystems put in the filename but less than what goes in the manifest.

**Conda** maintained two incompatible formats for years. The legacy `.tar.bz2` and the modern `.conda` (a zip containing zstandard-compressed tars). The switch from bzip2 to zstandard yielded significant decompression speedups, but every tool in the ecosystem had to support both formats indefinitely.

**Hex** (Erlang/Elixir) has two checksum schemes in the same package. The deprecated "inner checksum" hashes concatenated file contents. The current "outer checksum" hashes the entire tarball. Both are present for backward compatibility.

### Who's already using OCI

Homebrew is a traditional package manager, not a "cloud-native" tool, and its migration to OCI already happened under pressure.

In February 2021, JFrog [announced](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/) that Bintray would shut down on May 1. Homebrew's bottles were hosted on Bintray. The maintainers had about three months to move their entire archive of precompiled binaries somewhere else, and they landed on GitHub Packages, which stores everything as OCI blobs on `ghcr.io`. [Homebrew 3.1.0](https://brew.sh/2021/04/12/homebrew-3.1.0/) shipped April 12, 2021, with GHCR as the default download location.

The transition was rough in the ways you'd expect. CI pipelines across the industry broke because macOS images on services like [CircleCI](https://discuss.circleci.com/t/macos-image-users-homebrew-brownout-2021-04-26/39872) shipped with old Homebrew versions that still pointed at Bintray. During a brownout on April 26, any system running an older Homebrew got 502 errors. Older bottle versions were never migrated, so anyone pinned to an old formula version got 404s and had to build from source. The fix was `brew update`, but CI environments cached old Homebrew versions and didn't auto-update.

After the dust settled, the OCI-based storage enabled things that wouldn't have been practical on Bintray. Homebrew 4.0.0 (February 2023) switched from git-cloned tap metadata to a [JSON API](https://brew.sh/2023/02/16/homebrew-4.0.0/) that leverages the structured OCI manifests, and `brew update` dropped from running every 5 minutes to every 24 hours.

Manifest-based integrity checking replaced the old checksum approach, though this introduced [its own class of bugs](https://github.com/Homebrew/brew/issues/12300) where manifest checksums wouldn't match. Platform multiplexing came naturally from OCI image indexes, which map platform variants (`arm64_sonoma`, `x86_64_linux`) to individual manifests without Homebrew having to build that logic itself.

When you run `brew install`, the client fetches the OCI image index manifest from `ghcr.io/v2/homebrew/core/<formula>/manifests/<version>`, selects the right platform manifest, then HEADs the blob URL to get a 307 redirect to a signed URL on `pkg-containers.githubusercontent.com` where Fastly's CDN serves the actual bytes. GHCR requires a bearer token even for public images, so Homebrew hardcodes `QQ==` as the bearer token. The bottle inside the blob is still a gzipped tarball with the same internal structure it always had.

Helm charts followed a similar path. Helm v3.8 added native OCI registry support, and the old `index.yaml` repository format is being phased out. Azure CLI retired legacy Helm repository support in September 2025. Charts push with `helm push` using `oci://` prefixed references, and the chart tarball goes into a layer blob.

### What would change

**Platform variants get first-class support.** OCI image indexes map platform descriptors to manifests. A package with builds for five platforms would have an index pointing to five manifests, each pointing to the right blob. This is cleaner than npm's convention of publishing platform-specific binaries as separate `optionalDependencies` packages, or Python's approach of uploading multiple wheels with platform-encoded filenames and letting pip pick the right one.

**Signing and attestation come built in.** Every ecosystem is building its own signing infrastructure independently. npm added [Sigstore-based provenance](https://docs.npmjs.com/generating-provenance-statements) in 2023, PyPI added [attestations](https://docs.pypi.org/attestations/) in 2024, Cargo has [RFC 3403](https://github.com/rust-lang/rfcs/pull/3403) open, and RubyGems has had signature support for years that almost nobody uses because the tooling never reached the point where it was easy enough to be default behavior. Each effort required dedicated engineering time from small registry teams who were already stretched thin.

OCI's `subject` field and referrers API provide a single mechanism for all of this. Cosign and Notation can sign any OCI artifact, storing the signature as a separate artifact in the same registry that references the signed content via `subject`. SBOMs attach the same way, as do build provenance attestations, vulnerability scan results, and license audits: push an artifact with `subject` pointing to the thing it describes, and any client can discover it through the referrers API.

The security ecosystem around OCI registries (cosign, notation, Kyverno, OPA Gatekeeper, Ratify) represents years of investment that package registries could inherit. A policy engine enforcing "all artifacts must be signed before deployment" wouldn't care whether it's looking at a container image or a RubyGem, because the referrers API works the same way for both.

**Deduplication and registry sustainability.** Content-addressable storage identifies every blob by its SHA-256 digest, so if two packages contain an identical file the registry stores it once, and if two concurrent uploads push the same blob the registry accepts both but keeps one copy.

Shared content between unrelated source packages is rare, so this matters more for binary packages where the same shared libraries get bundled into Homebrew bottles for different formulas, the same runtime components appear in multiple Conda packages, and Debian's archive carries the same `.so` files across dozens of packages and versions.

The community-funded registries are where this adds up. rubygems.org, crates.io, PyPI, and hex.pm run on bandwidth donated by CDN providers, primarily Fastly. These registries serve terabytes of package data to millions of developers on infrastructure that someone is volunteering to cover.

Content-addressable storage won't eliminate those costs, but a registry that's been running for ten years has accumulated a lot of identical blobs that a content-addressable backend would collapse into single copies, and the savings compound as the registry grows.

**Content-addressed mirroring.** Mirroring a package registry today requires reimplementing each registry's API and storage format, and every ecosystem's mirror implementation is different: the Simple Repository API for PyPI, the registry API for npm, the compact index for RubyGems. Anyone can stand up an OCI-compliant mirror with off-the-shelf software like Harbor, Zot, or the CNCF Distribution project, which is a much lower bar than reverse-engineering a bespoke registry protocol.

Content-addressable storage changes the trust model. If you have a blob's SHA-256 digest, you can verify its integrity regardless of which server you downloaded it from, because two registries serving the same digest are provably serving the same bytes. This is the same property that makes [Docker images work as lockfiles for system packages](/2025/12/18/docker-is-the-lockfile-for-system-packages.html): once you have the digest, the content is immutable and verifiable no matter where it came from.

A mirror doesn't need to be trusted to be honest, only to be available. The manifest contains the digests, and the blobs can come from anywhere: geographic mirrors, corporate caches, peer-to-peer distribution, even a USB drive with an OCI layout directory. When Fastly has an outage and rubygems.org goes down with it, any alternative source that can serve matching bytes becomes a valid mirror without any special trust relationship.

**Registry infrastructure is already built.** Running rubygems.org or crates.io means running custom storage, custom CDN configuration, and custom authentication. A package registry built on OCI offloads the most expensive parts to infrastructure that already exists with SLAs and dedicated engineering teams, and the registry team can spend more time on what actually matters: [governance](/2025/12/22/package-registries-are-governance-as-a-service.html), the package index, dependency resolution, and search.

### What wouldn't work well

**The two-step fetch.** If a package manager client talks directly to the OCI registry, it needs to fetch the manifest, parse it, then download the blob before extraction can start. The container world doesn't care about this because you're pulling maybe 5-10 layers for a single image. Package installs fan out across the dependency graph: a fresh `npm install` on a mid-sized project might resolve 800 transitive dependencies, each needing its own manifest fetch before the content download can begin.

A client could pipeline aggressively and fetch manifests concurrently, but the OCI Distribution Spec doesn't have a batch manifest endpoint, so 800 packages still means 800 separate HTTP requests that don't exist in the current model where npm can GET a tarball directly by URL.

There's a way around this: if registries included OCI blob digests in their existing metadata responses instead of (or alongside) direct tarball URLs, clients could skip the manifest fetch entirely and download blobs by digest. The difference in request flow looks like this:

A pure OCI pull requires three hops: fetch the manifest, request the blob (which returns a 307 redirect), then download from the signed CDN URL. A smarter integration where the registry resolves the manifest internally reduces that to two: the registry's metadata API returns the digest and a direct CDN URL, and the client downloads the blob and verifies it against the digest.

Homebrew doesn't quite do this yet. The `brew install` flow described earlier requires two extra round-trips on top of the content transfer: one for the manifest, one for the redirect.

The 307 redirect isn't purely a latency cost; it's also how the registry verifies the bearer token before handing off to the CDN, so registries adopting this pattern would need to decide whether their blobs are truly public or whether they want to keep that gatekeeper step. For registries with private package tiers, like npm's paid plans or NuGet's Azure Artifacts integration, the redirect model matters because access control at the blob level is part of the product.

The formula metadata already knows the GHCR repository and tag, so the index service is already doing part of the resolution. If the formula JSON included the blob digest and a direct CDN URL, both hops disappear and the client downloads the blob in a single request while still verifying integrity by digest. Package managers that [separate download from install](/2026/02/15/separating-download-from-install-in-docker-builds.html) could take it further by batching blob fetches during a dedicated download phase.

**Metadata is the actual hard problem.** OCI manifests have annotations (arbitrary key-value strings) and a config blob, but package metadata like dependency trees, version constraints, platform compatibility rules, and license information doesn't fit naturally into either. Each ecosystem would end up defining its own conventions for encoding metadata, its own `mediaType` for its config blob, its own annotation keys.

The reason every package manager invented its own archive format is not because tar and zip are insufficient for archiving files, but because the metadata conventions are what make each ecosystem different. What makes a `.gem` different from a `.crate` is how dependencies are expressed and what platform compatibility means, not the compression algorithm wrapping the source code. OCI standardizes how bytes move between machines, not what those bytes mean to a package manager.

**Small package overhead.** The OCI ceremony of manifests, layers, media types, and digest computation makes sense for multi-layer container images that can be gigabytes. For a 50KB npm package, the manifest JSON, config blob, digest computation for each, and the multi-step chunked upload API add up to several HTTP round-trips and a few hundred bytes of protocol overhead where the current model needs a single PUT. The fixed cost doesn't scale down with the artifact, and a large share of packages on registries like npm and PyPI are small enough that the protocol overhead becomes a meaningful fraction of the payload.

**Registry UI confusion.** When a registry contains both container images and packages, the user experience gets muddled. GitHub Container Registry shows `docker pull` commands for everything, but a Homebrew bottle needs `brew install` and a Helm chart needs `helm pull`. The UX for this is generally not great.

**Not all registries are equal.** The OCI 1.1 features that make non-container artifacts work well (custom `artifactType`, the referrers API, the `subject` field) aren't universally supported. The OCI Image Specification advises that artifacts concerned with portability should follow specific conventions for `config.mediaType`, and not all registries handle custom media types consistently. Registry implementations lag the spec, and the gap between what the spec allows and what any given registry supports is a source of bugs.

**Offline and air-gapped use.** A `.deb` or `.rpm` file is self-contained. You can copy it to a USB drive and install it on an air-gapped machine. An OCI artifact requires a manifest and one or more blobs, stored by digest in a registry's content-addressable layout. Exporting to a self-contained format (OCI layout on disk) is possible but adds a step that simpler archive formats don't need.

**Who pays.** GHCR storage and bandwidth are [currently free](https://docs.github.com/en/billing/concepts/product-billing/github-packages) for public images, with a promise of at least one month's notice before that changes. At standard GitHub Packages rates ($0.25/GB/month for storage, $0.50/GB for bandwidth), Homebrew's bottle archive would cost substantially more than zero. GitHub absorbs that as an in-kind subsidy, and the Homebrew 3.1.0 release notes explicitly thank them for it.

If rubygems.org or PyPI moved all their package storage to GHCR tomorrow, someone would need to have a similar conversation with GitHub, or AWS, or Google. The current model of Fastly donating CDN bandwidth is fragile, but it exists and it's understood.

Adopting OCI for distribution is partly a technical decision about storage and protocols, but it's also a decision about who funds the infrastructure that the ecosystem depends on and what leverage that creates. Shifting from Fastly-donated CDN to GitHub-donated OCI storage changes the answer to that question without necessarily improving it.

### The smarter integration

Package registries do more than serve archives. They maintain an index of all packages, versions, and metadata that clients can search and resolve dependencies against, whether that's npm's registry API, PyPI's Simple Repository API, crates.io's [git-based index](https://github.com/rust-lang/crates.io-index), RubyGems' compact index, or Go's module proxy protocol. OCI registries have no equivalent: you can list tags for a repository, but there's no API for "give me all packages matching this query" or "resolve this dependency tree."

Splitting the roles this way makes more sense than having clients talk to the OCI registry directly. The registry uses OCI as a blob storage backend and integrates the content-addressable properties into the metadata APIs it already operates.

Every package manager client already makes a metadata request before downloading anything. npm fetches the packument, pip fetches the Simple Repository API, Bundler fetches the compact index, `go` hits the module proxy. These responses already include download URLs for specific versions.

If those responses included OCI blob digests and direct download URLs pointing at OCI-backed storage, clients would get the content-addressable integrity checks, the mirroring properties, and the deduplication without ever needing to speak the OCI Distribution protocol themselves. The registry's index service resolves the OCI manifest internally and hands the client a digest and a URL.

The registry keeps full control of discovery, dependency resolution, version selection, and platform matching, all the ecosystem-specific logic that OCI doesn't and shouldn't try to handle. The OCI layer underneath provides content-addressable blob storage, signing via the referrers API, and the ability for mirrors to serve blobs by digest without special trust.

Clients don't need to know they're talking to OCI-backed storage any more than they need to know whether the registry uses S3 or GCS underneath today. Homebrew already works roughly this way: the formula metadata points clients at GHCR, and the OCI manifest and redirect are implementation details of the download path.

A registry doesn't even need to migrate its existing packages to get some of these benefits. OCI 1.1's `artifactType` allows minimal manifests that exist purely as anchors for the referrers API. A registry could push a small OCI manifest for each package version, with the package's digest in the annotations, and use it as the `subject` that signatures and SBOMs attach to. The actual tarball continues to be served from the existing CDN. The signing and attestation infrastructure works without moving a single byte of package data.

The OCI metadata model could also inform how registries design their own APIs. The Distribution Spec separates "list of versions" (the paginated tags endpoint, `?n=<limit>&last=<tag>`) from "metadata for a specific version" (the manifest for that tag). npm's packument does neither: it returns a single JSON document containing metadata for every version of a package, with no pagination.

For a package with thousands of versions that response can be megabytes. When [npm 10.4.0 stopped using the abbreviated metadata format](https://github.com/npm/cli/issues/7529), installing npm itself went from downloading 2.1MB of metadata to 21MB. The full packuments also caused [out-of-memory crashes](https://github.com/npm/cli/issues/7276) when the CLI cached them in an unbounded map during dependency resolution.

Most registries were designed when packages had dozens of versions, not thousands, and pagination wasn't an obvious concern. PyPI's Simple Repository API lists all files for a package in one response, though [PEP 700](https://peps.python.org/pep-0700/) added version listing metadata after the fact. crates.io takes a different approach with a git-based index that stores one file per crate, all versions as line-delimited JSON, while RubyGems' compact index and Go's module proxy both return complete version lists in a single response. None of these designed for pagination early on because the scale wasn't there yet, and retrofitting pagination onto an existing API is harder than building it in from the start.

If a registry is already rethinking its metadata endpoints to integrate OCI blob digests, that's a natural time to adopt the structural pattern of paginated version listing plus per-version metadata fetched on demand.

### Would it actually help

Homebrew's migration happened under duress when Bintray died, and the rough edges were real: broken CI, missing old versions, a new class of checksum bugs. None of it required changing the archive format: the bottles are the same gzipped tarballs they always were, just stored and addressed differently.

Most of the drawbacks, the manifest fan-out, the redirect tax, the metadata gap, come from treating OCI as the client-facing protocol rather than as infrastructure behind the registry's existing API. The technical path through that is less disruptive than adopting a new distribution protocol from scratch.

The registries that would benefit most from OCI's storage and signing primitives are the community-funded ones: rubygems.org, crates.io, PyPI, hex.pm. They're also the ones least able to afford the migration or negotiate the hosting arrangements that make it sustainable. This question is becoming less hypothetical as funding conversations around open source registries increasingly reference OCI adoption, and the registries on the receiving end of those conversations should understand what they'd be gaining and what they'd be giving up.

Converging on shared storage primitives is the easy part of the problem. Each ecosystem's metadata semantics are genuinely different and will stay that way. The harder question is whether the funding arrangements that come with OCI adoption serve the registries or the infrastructure providers offering to host them.
