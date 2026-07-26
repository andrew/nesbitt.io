---
layout: post
title: "Wheels, Bottles and Images"
date: 2026-07-30 10:00 +0000
description: "Any sufficiently advanced package manager is indistinguishable from a container registry."
tags:
  - package-managers
  - oci
  - registries
---

In February Simon Willison [packaged a Go CLI as Python wheels](https://simonwillison.net/2026/Feb/4/distributing-go-binaries/), one wheel per platform with the compiled binary inside, so `pip install sqlite-scanner` fetches a program containing no Python. His build tool [maps each Go target to a wheel tag](/2026/02/17/platform-strings.html) on the way through: `darwin/arm64` to `macosx_11_0_arm64`, `linux/amd64` to `manylinux_2_17_x86_64`. PyPI accepted the uploads and pip picked the right platforms, and [the thread that followed](https://discuss.python.org/t/use-of-pypi-as-a-generic-storage-platform-for-binaries/106044) was about whether PyPI should store binaries that serve no Python purpose.

Wheels, Homebrew bottles and OCI images are the three big self-service binary distribution systems: the project publishes a compiled artifact and any machine fetches the one matching its platform, with no distro maintainer in between. conda, NuGet's native assets, RubyGems platform gems and plain GitHub Releases do the same job in their own ecosystems. The three big ones share no specification: each was designed against its own stack. Simon's trick works because a wheel is a checksummed archive selected by a platform tag, and that description also fits a bottle and an image. Immutable checksummed files are what CDNs serve cheaply and caches hold safely, and all three systems depend on both.

### Similarities

All three install by downloading a checksummed file over plain HTTP. pip reads the expected hash from the PyPI index and brew reads a sha256 from the formula, while a container client requests each layer by its digest. The files are ordinary zip and tar.gz archives, and no server inspects or transforms them on the way out.

The index and the artifact storage are separate systems, and the storage has been swapped without breaking clients. PyPI's index points at `files.pythonhosted.org`, a different host from the API. Homebrew moved every bottle from Bintray to GitHub Packages in [Homebrew 3.1.0](https://brew.sh/2021/04/12/homebrew-3.1.0/), and an image is copied between Docker Hub, ghcr.io and a private registry with a retag. Static files and content addressing also make a plain HTTP cache a valid mirror of all three, and [Package Manager Mirroring](/2026/03/20/package-manager-mirroring.html) covers how much harder that job is for registries that serve dynamic APIs.

A published artifact never changes and a fix ships as a new version. On PyPI that is policy: [a used filename cannot be re-uploaded](https://pypi.org/help/#file-name-reuse). For bottles and images it comes from the checksums, the sha256 pinned in the formula and the digest computed from the bytes.

pip matches wheel tags against the running interpreter, and brew matches bottle tags against the OS and architecture. Even with OCI, where the registry holds structured platform data, the client downloads the [image index](https://github.com/opencontainers/image-spec/blob/main/image-index.md) and picks a manifest itself, so selection is client-side in all three designs.

The tags being matched cover the same dimensions: CPU architecture, operating system, and enough ABI detail to tell whether a binary will run. Wheel tags, bottle tags, OCI platform objects and the [gem2 proposal](https://traveling.engineer/posts/goals-for-binary-gems/) each spell that set differently, and [Platform Strings](/2026/02/17/platform-strings.html) compares the spellings.

Whatever the host is not guaranteed to provide ships inside the artifact. A wheel carries private copies of the shared libraries it links against, added by [auditwheel](https://github.com/pypa/auditwheel) or [delocate](https://github.com/matthew-brett/delocate), while a bottle includes almost nothing. An image can pack in everything above the kernel.

Each format stores a metadata document next to the payload: a wheel's `.dist-info` directory, a bottle's tab file (`INSTALL_RECEIPT.json`), an image's config object. All three record a name, a version, and the details of the build.

### Differences

A wheel requires an interpreter and a minimum libc from the host, a bottle an OS release and an install prefix, an image only a kernel. manylinux and bottle relocation exist to manage the first two positions, and images carry their own filesystem, so neither mechanism has an OCI equivalent.

Wheels and bottles are entries in a dependency graph: pip resolves a wheel's requirements against the index, and brew resolves the formula tree before pouring a bottle. An image has no dependency model, since layers stack in a fixed order and nothing is resolved at pull time. A bottle can omit most of its runtime because brew resolves the rest of its dependency tree, while an image has to carry the whole userland itself.

When no wheel matches the platform, pip downloads the sdist and builds it, and brew builds a missing bottle from the formula. `docker pull` reads no Dockerfile, so a platform without a published image gets no artifact.

Wheel and bottle filenames carry the platform, in a tag grammar private to each ecosystem. OCI records it in the image index, in fields any client library can read, and it is the only one of the three that external tools consume without a translation table.

### Convergence

Homebrew has been [storing bottles in an OCI registry](https://brew.sh/2021/04/12/homebrew-3.1.0/) since 2021. The bottles for `hello` are artifacts at `ghcr.io/homebrew/core/hello`, published under an image index whose platform fields record `arm64`, `darwin` and `macOS 15.7`. The dimensions the OCI schema has no field for, the glibc version and the CPU variant, are stored as `sh.brew.*` annotations next to the build metadata. [Helm charts moved to the same registries](https://helm.sh/docs/topics/registries/) in Helm 3.8, and [ORAS](https://oras.land) generalises the push and pull to arbitrary artifacts. Media types pass through the registry API unparsed, so bottles and charts fit into infrastructure built for container images with no registry-side changes.

The build attestations in all three are [sigstore](https://www.sigstore.dev/) bundles. PyPI has accepted [attestations alongside uploads](https://blog.pypi.org/posts/2024-11-14-pypi-now-supports-digital-attestations/) since November 2024 under [PEP 740](https://peps.python.org/pep-0740/), generated by default when a project publishes from GitHub Actions through trusted publishing. Homebrew's CI has [attested every homebrew-core bottle](https://blog.trailofbits.com/2024/05/14/a-peek-into-build-provenance-for-homebrew/) since 2024, and brew can check a bottle against its attestation at install time. [cosign](https://github.com/sigstore/cosign) pushes an image's signature or attestation into the registry holding the image, an artifact whose subject field records the digest it covers, and the OCI 1.1 referrers API lists what is attached to any digest. Where the attestation is stored differs: PyPI serves it from the index next to the file, a registry keeps it beside the image, and brew fetches Homebrew's from [GitHub's attestation API](https://docs.github.com/en/rest/users/attestations), separate from both the formula and the bottle storage. [What Package Registries Could Borrow from OCI](/2026/02/18/what-package-registries-could-borrow-from-oci.html) covers what the referrers design offers the other two.

Most of the similarities above are also a feature list of an OCI registry: content-addressed immutable blobs, an index separate from the storage, client-side artifact selection, mirroring through pull-through caches. A registry leaves tag grammar, version resolution, dependency metadata and search undefined, and those are where the three systems differ from each other anyway. pip's resolver, brew's formula tree and an image's ordered layers could not share a registry that defined a dependency model. The [objection from the PSF board](https://discuss.python.org/t/use-of-pypi-as-a-generic-storage-platform-for-binaries/106044/56) to Go binaries arriving on PyPI was sustainability and mission, and the uploads themselves worked.

The remaining design work for an ecosystem adding binary distribution today is narrower than the decade of wheel PEPs suggests: gem2 specifies the tag dimensions, and bottle storage demonstrates that the blob side can be rented from an existing registry. The open decisions are the tag grammar and the index entry.

No tag grammar records a GPU, which is why CUDA wheels [often cannot be hosted on PyPI](https://wheelnext.dev) today. [PEP 817](https://peps.python.org/pep-0817/), drafted in December 2025 out of the NVIDIA-started WheelNext initiative, proposes variant wheels selected by installer plugins that detect GPUs, SIMD levels and BLAS libraries at install time. [PEP 825](https://peps.python.org/pep-0825/) covers the package format for those variants, and [PEP 725](https://peps.python.org/pep-0725/) adds pyproject.toml metadata naming the dependencies a package uses from outside PyPI, the same libraries the bundling rule currently copies into wheels. Container images have the same gap: an image index records os and arch, and GPU access is wired in at run time through the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html) rather than selected at pull time. The existing spellings diverged because each ecosystem named the dimensions on its own, PURL's [request for cross-ecosystem platform qualifiers](https://github.com/package-url/purl-spec/issues/186) has been open since 2022, and the GPU dimension is still unnamed outside Python.
