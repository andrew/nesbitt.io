---
layout: post
title: "Package Manager Patents"
date: 2026-06-08 10:00 +0000
description: "A reference list of patents and applications relevant to package manager design, with notes on prior art."
tags:
  - package-managers
  - history
  - reference
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mntygon5uj26"
---

Patents and applications relevant to package manager design, grouped by area. Mostly US filings, found through Google Patents searches on the obvious terms. Each entry lists the assignee, filing and grant dates, and current status, followed by a short summary of the core claim and a prior-art note where open-source predecessors are well-documented.

## Manifests and dependency resolution

[US6381742B2 - Software package management](https://patents.google.com/patent/US6381742B2/en). Microsoft. Filed June 1998, granted 2002, expired 2018. Claims a distribution unit, a manifest file, and a code store data structure, with dependency resolution at install time and shared-component tracking at uninstall. Prior art: CPAN manifests (1995), dpkg control files (1995), RPM (1997), FreeBSD ports (1993).

[US7222341B2 - Method and system for processing software dependencies in management of software packages](https://patents.google.com/patent/US7222341B2/en). Microsoft. Filed February 2002, granted 2007, expired 2019. Continuation of US6381742B2, sharing its June 1998 priority date. Claims the install-time loop: check installed, identify missing dependencies, fetch from specified sources, extract, register, update the code store. Prior art: as for US6381742B2.

[US9348582B2 - Systems and methods for software dependency management](https://patents.google.com/patent/US9348582B2/en). LinkedIn (now assigned to Microsoft). Filed 13 February 2014, granted 24 May 2016, lapsed for fees. Claims retrieving a dependency declaration and selecting a valid version of an upstream product usable at the consumer's build time. Prior art: the same build-time version-selection mechanic in apt, Maven, Bundler, and others, all predating the filing.

[US8621454B2 - Apparatus and method for generating a software dependency map](https://patents.google.com/patent/US8621454B2). Oracle America (originally Sun Microsystems), inventor Michael J. Wookey. Granted from application US20110258619A1; the family descends from an abandoned 2007 parent (Ser. No. 11/862,987). Dependency resolver feeds a graph manager that maintains a map of installed components.

[US9881098B2 - Configuration resolution for transitive dependencies](https://patents.google.com/patent/US9881098B2/en), with continuation US10325003. Walmart Apollo / Wal-Mart Stores. Resolves the *configuration* of transitive dependencies at deploy time rather than at packaging time. Closer to enterprise-Java config wiring than to package manager mechanics, but surfaces on dependency-resolution searches.

## Certificate handling and update integrity

[US10977024B2 - Method and apparatus for secure software update](https://patents.google.com/patent/US10977024B2/en). Sierra Wireless (now Semtech). Filed 15 June 2018, granted 13 April 2021, lapsed for fees. Claims OCSP stapling for software updates: the update manager pulls OCSP responses from the CA, bundles them into the update package, and the device verifies certificate status offline. Aimed at IoT/embedded firmware updates rather than general package distribution.

[US11765155B1 - Robust and secure updates of certificate pinning software](https://patents.google.com/patent/US11765155B1/en). Amazon Technologies. Filed 29 September 2020, granted 19 September 2023, active until 20 November 2041. When the pinned signing certificate has rotated, the client retrieves the new certificate from a separate publishing service and verifies it through a chain of trust, rather than failing closed or requiring a bundled application update.

## Containers and layered distribution

[WO2020232713A1 - Container instantiation with union file system layer mounts](https://patents.google.com/patent/WO2020232713A1/en). On instantiation, the runtime receives an image manifest and sends layer mount requests to the registry rather than downloading layer content. Prior art for the union-mount side: UnionFS (2005), AUFS (2006), OverlayFS (2014). Prior art for lazy and on-demand layer fetching: Slacker (FAST '16), eStargz, SOCI.

[US12056511B2 - Container image creation and deployment using a manifest](https://patents.google.com/patent/US12056511B2/en). IBM. Manifest-driven container build and deploy; claims cite inode descriptors and file hashes. Prior art: the OCI image-spec, and the content-addressable storage model from Git (2005) and earlier systems like Monotone and Venti.

[US10127030B1 - Systems and methods for controlled container execution](https://patents.google.com/patent/US10127030B1/en). The container manifest carries a hash or digest of each item, and a content validation engine compares the digests at execution time. Prior art: the OCI content-addressable storage model, with Git as the earlier general-purpose precedent.

If you're aware of patents that should be included in this collection, please reach out on [Mastodon](https://mastodon.social/@andrewnez) or submit a pull request to [the post on GitHub](https://github.com/andrew/nesbitt.io/blob/master/_posts/2026-06-08-package-manager-patents.md).
