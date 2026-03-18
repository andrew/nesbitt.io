---
layout: post
title: "Git Remote Helpers"
description: "Git can talk to anything if you write the right helper."
date: 2026-03-18 10:00:00 +0000
tags:
  - git
  - reference
---

[Bastien Guerry](https://bzg.fr/) from [Software Heritage](https://www.softwareheritage.org/) recently nerd-sniped me with [an idea](https://nanodash.knowledgepixels.com/explore?id=https://w3id.org/np/RAJIQOw50gSAqzKUJoFSbNQghA_b72Y3-ImjTRN4YOF9s&label=Idea:+git+clone+from+SoftWare+Hash+IDentifiers&forward-to-part=true) for a `git-remote-swh` that would let you `git clone` from a [SWHID](https://www.swhid.org/), pulling source code directly from Software Heritage's archive by content hash rather than by URL. Building that means writing a git remote helper, which sent me back to the [gitremote-helpers docs](https://git-scm.com/docs/gitremote-helpers) and down the rabbit hole of how many of these things already exist. I covered remote helpers briefly in my earlier post on [extending git functionality](/2025/11/26/extending-git-functionality.html), but the protocol deserves a closer look.

A `git-remote-swh` would need to be an executable on your `$PATH` so that git invokes it when it sees a URL like `swh://`. The helper and git talk over stdin/stdout using a text-based line protocol. For `git-remote-swh` the end goal would be something like:

```
git clone swh://swh:1:rev:676fe44740a14c4f0e09ef4a6dc335864e1727ca;origin=https://github.com/wikimedia/mediawiki
```

Or using the double-colon form, which reads a bit cleaner when adding a remote:

```
git remote add archive swh::swh:1:rev:676fe44740a14c4f0e09ef4a6dc335864e1727ca;origin=https://github.com/wikimedia/mediawiki
```

The SWHID identifies a specific revision by content hash, and the `origin` qualifier tells the helper where to fall back if that revision isn't in the archive yet. The helper would resolve the SWHID against Software Heritage's archive, and if the revision isn't archived yet, use the `origin` qualifier to ask Software Heritage to [import it](https://archive.softwareheritage.org/save/) first, so the clone always comes through the archive and can be verified against the content hash. You'd end up with `git clone` as a content-addressed fetch primitive rather than just a URL fetch, which is an interesting building block for reproducible builds and supply chain verification.

Git opens by sending `capabilities` and the helper responds with what it can do: `fetch`, `push`, `import`, `export`, `connect`, or some combination. A SWHID helper would only need `import` and `list` since Software Heritage is a read-only archive and its API returns objects individually rather than as packfiles. `import` lets the helper pull snapshots, revisions, trees, and blobs via the REST API and stream them into git's fast-import format, which is easier to implement than `fetch` where you'd have to reconstruct packfiles yourself for not much gain on a read-only helper. `connect` establishes a bidirectional pipe where git speaks its native pack protocol as if it were talking to a real git server, but that only makes sense when the remote actually speaks git's wire protocol.

After capability negotiation, git sends `list` to get the remote's refs, then issues import commands in batches. For a SWHID helper, `list` would resolve the SWHID against Software Heritage's [API](https://archive.softwareheritage.org/api/), translate the archive's snapshot into a ref listing, and then `import` would stream the objects through as fast-import data. Each batch ends with a blank line, and the helper responds with status lines like `ok refs/heads/main` or `error refs/heads/main <reason>`.

Writing a remote helper from scratch is more work than writing a git subcommand but less work than building a full git server. Most implementations are a few hundred to a few thousand lines of code, and the hardest part is mapping git's object model onto whatever storage backend you're targeting. Software Heritage already stores git objects natively, so a SWHID helper might be one of the easier ones to build.

### Built-in

Git ships with remote helpers for its standard network transports, and they follow the same protocol as everything else below.

- **git-remote-http** / **git-remote-https** implement the [smart HTTP protocol](https://git-scm.com/docs/http-protocol) that most hosted git services use
- **git-remote-ftp** / **git-remote-ftps** fetch over FTP, though this is rarely used in practice
- **git-remote-ext** pipes git's protocol through an arbitrary command, which makes it a building block for custom transports without writing a full remote helper

### Cloud and object storage

- [**git-remote-dropbox**](https://github.com/anishathalye/git-remote-dropbox) stores git repos in Dropbox using the Dropbox API, and is one of the better documented remote helpers if you're looking for implementation examples.
- [**git-remote-s3**](https://github.com/awslabs/git-remote-s3) from AWS Labs uses S3 as a serverless git server with LFS support. Written in Rust. There are several other S3-backed helpers floating around but this is the most complete.
- [**git-remote-codecommit**](https://github.com/aws/git-remote-codecommit) provides authenticated access to AWS CodeCommit repositories without needing to configure SSH keys or manage HTTPS credentials manually.
- [**git-remote-rclone**](https://github.com/datalad/git-remote-rclone) pushes and fetches through [rclone](https://rclone.org/), so it gets rclone's 70+ cloud storage providers for free: Google Drive, Azure Blob Storage, Backblaze B2, and the rest.

### Encryption

- [**git-remote-gcrypt**](https://github.com/spwhitton/git-remote-gcrypt) encrypts an entire git repository with GPG before pushing it to any standard git remote. The remote stores only encrypted data, so you can use an untrusted host as a private git server with multiple participants sharing access through GPG's key infrastructure.
- [**git-remote-encrypted**](https://github.com/GenerousLabs/git-remote-encrypted) takes a different approach where each git object is individually encrypted before being stored as a file in a separate git repository. The remote looks like a normal git repo full of encrypted blobs.
- **git-remote-keybase** was part of the [Keybase client](https://github.com/keybase/client) and stored encrypted git repos on Keybase's infrastructure using the Keybase identity and key management system. Keybase was [acquired by Zoom in 2020](https://keybase.io/blog/keybase-joins-zoom) and the service has been winding down since.

### Content-addressed storage

- [**git-remote-ipfs**](https://github.com/cryptix/git-remote-ipfs) maps git objects onto IPFS, storing repositories in a content-addressed merkle DAG. Written in Go using the IPFS API. Several other IPFS-based remote helpers exist ([dhappy/git-remote-ipfs](https://github.com/dhappy/git-remote-ipfs), [git-remote-ipld](https://github.com/ipfs-shipyard/git-remote-ipld), [Git-IPFS-Remote-Bridge](https://github.com/ElettraSciComp/Git-IPFS-Remote-Bridge)) taking slightly different approaches to the same problem.

### VCS bridges

- [**git-remote-hg**](https://github.com/felipec/git-remote-hg) lets you clone and push to Mercurial repositories transparently using git commands, converting between the two object models on the fly using the fast-import/fast-export capabilities.
- [**git-remote-bzr**](https://github.com/felipec/git-remote-bzr) does the same for Bazaar repositories, also by Felipe Contreras.
- [**git-remote-mediawiki**](https://github.com/Git-Mediawiki/Git-Mediawiki) treats a MediaWiki instance as a git remote where each wiki page becomes a file. You can clone a wiki, edit pages locally with your text editor, and push changes back. Written in Perl.

### P2P and decentralised

- [**git-remote-gittorrent**](https://github.com/cjb/GitTorrent) distributed git over BitTorrent, using a DHT for peer discovery and Bitcoin's blockchain for user identity. A research prototype from 2015 that demonstrated the concept but never saw wide adoption.
- [**git-remote-nostr**](https://github.com/gugabfigueiredo/git-remote-nostr) publishes git objects as [Nostr](https://nostr.com/) events, using the relay network for distribution.
- [**git-remote-blossom**](https://github.com/lez/git-remote-blossom) builds on the [Blossom protocol](https://github.com/hzrd149/blossom), a Nostr-adjacent system for content-addressed blob storage.
- [**git-remote-ssb**](https://github.com/clehner/git-remote-ssb) stored repositories on [Secure Scuttlebutt](https://scuttlebutt.nz/), a gossip-based peer-to-peer protocol where data replicates through social connections rather than central servers. Dormant since the SSB ecosystem contracted.

### Transport wrappers

These don't provide their own storage or collaboration model, they wrap existing git remotes with a different transport layer, closer in spirit to the built-in `git-remote-ext` than to the storage-backed helpers above.

- [**git-remote-tor**](https://github.com/agentofuser/git-remote-tor) routes git traffic through Tor hidden services, written in Rust.

### Blockchain

- [**git-remote-gitopia**](https://github.com/harry-hov/git-remote-gitopia) pushes repositories to [Gitopia](https://gitopia.com/), a code collaboration platform built on the Cosmos blockchain where repository metadata and access control live on-chain.

### Other storage backends

- [**git-remote-sqlite**](https://github.com/chrislloyd/git-remote-sqlite) stores git objects as rows in a SQLite database, which can then be replicated using tools like [Litestream](https://litestream.io/).
- [**git-remote-restic**](https://github.com/CGamesPlay/git-remote-restic) bridges git and [restic](https://restic.net/) backup repositories, inheriting restic's encryption and support for dozens of storage backends.
- [**git-remote-couch**](https://github.com/peritus/git-remote-couch) stores git repos in CouchDB, gaining CouchDB's replication and conflict resolution for free.
- [**git-remote-grave**](https://github.com/rovaughn/git-remote-grave) pushes repositories into a content-addressable store that deduplicates across multiple repos.

If I've missed one, reach out on [Mastodon](https://mastodon.social/@andrewnez) or submit a pull request on [GitHub](https://github.com/andrew/nesbitt.io/blob/master/_posts/2026-03-18-git-remote-helpers.md).
