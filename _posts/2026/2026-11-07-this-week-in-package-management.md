---
layout: post
title: "This Week in Package Management: 7 November 2026"
date: 2026-11-07 10:00 +0000
description: "Releases, advisories, and articles from across the package management world"
tags:
  - package-managers
  - weekly
  - twipm
---

This week's package management news, gathered from the [package manager OPML feed collection](https://github.com/ecosyste-ms/package-managers-opml), my posts and boosts on [Mastodon](https://mastodon.social/@andrewnez), and anything people sent me. Version control and forge news is in the Wednesday [This Week in Source Control](/2026/11/04/this-week-in-source-control.html) roundup.

## Security

[Vox Pupuli fixed three critical vulnerabilities](https://voxpupuli.org/blog/2026/11/03/critical-cve-updates/) that a Neodyme researcher reported in OpenVox, the community fork of Puppet. OpenVox Server deserialised Ruby objects embedded in agent run reports, which allowed remote code execution. The shared Trapperkeeper authorisation library matched every plain-string rule in `auth.conf` as a wildcard, so a certificate for `evil.target.example.com` was accepted as `target.example.com`. The OpenVoxDB container image allowed any certificate to reach its API because its allowlist script failed on startup.

All known Puppet implementations are affected, and the fixes are in openvox-agent 8.32.0 and 9.3.0 and openvox-server and openvoxdb 8.18.0 and 9.2.0. Updates to open source Puppet, including security fixes, have ended, so Vox Pupuli recommends migrating to OpenVox.

An [issue on actions/runner-images](https://github.com/actions/runner-images/issues/15228) reports that GitHub's public macOS runners still accept certificates from the compromised eMudhra intermediates covered here last week. Apple has yet to patch the system `/etc/ssl/cert.pem`. Homebrew has shipped patched `ca-certificates`, `curl` and `git`, but the runner images disable Homebrew updates, so jobs run the vulnerable preinstalled versions.

[Docker Engine 29.9.3](https://github.com/moby/moby/releases/tag/docker-v29.9.3) fixes four CVEs in the engine and SwarmKit. It also updates to BuildKit 0.34.2, which fixes a resolver cache poisoning crash when a build resolves the same Git source twice.

## Releases

[mise 2026.11.0](https://github.com/jdx/mise/releases/tag/v2026.11.0) makes `--locked` require checksums, and safe mode now ignores project lockfiles. It adds opt-in Sigstore provenance verification for `npm:` tools, which checks only the tool's own package and requires the embedded aube package manager. Tasks can now declare a `lock` so that runs sharing a database or simulator execute one at a time, even across worktrees.

[pixi 0.84.0](https://github.com/prefix-dev/pixi/releases/tag/v0.84.0) moves `exclude-newer` into the `[workspace]` table and supports exemptions to the cutoff. A workspace can apply the cutoff to new releases by default and exempt vetted security releases. A rattler fix for hash collisions between unequal package versions means lockfiles written by older pixi versions may require a `pixi lock` before pixi accepts them as locked.

[pip 26.3](https://pip.pypa.io/en/stable/news/#v26-3) blocks unexpected imports during installation and warns about unsafe ones afterwards. HTTP redirects to `file:` URLs are now rejected, and PyPI's restriction on direct URL dependencies now covers extras and cached wheels. `-r pylock.toml` now supports extras and non-default dependency groups, and accepts `--no-binary`. The security policy now states that installing untrusted wheels has always been unsafe, since Python's import system can run third-party code during installation.

[zizmor 1.32.0](https://github.com/zizmorcore/zizmor/releases/tag/v1.32.0) adds experimental support for GitHub's new [workflow lockfiles](https://docs.zizmor.sh/usage/#workflow-lockfiles). It now collects only the inputs GitHub Actions reads, so it skips workflows in vendored directories.

[Renovate 44.210.0](https://github.com/renovatebot/renovate/releases/tag/44.210.0) adds a datasource for Julia's General registry, plus Julia and vcpkg versioning schemes. The previous release, [44.209.0](https://github.com/renovatebot/renovate/releases/tag/44.209.0), moved the offline OSV database into `cacheDir`.

Also out:

- [uv 0.13.7](https://github.com/astral-sh/uv/releases/tag/0.13.7)
- [pnpm 11.28.10](https://pnpm.io/blog/releases/11.28.10)
- [vlt 1.6.2](https://github.com/vltpkg/vltpkg/releases/tag/v1.6.2)
- [Homebrew 7.0.12](https://github.com/Homebrew/brew/releases/tag/7.0.12)
- [rustup 1.29.3](https://blog.rust-lang.org/2026/11/03/Rustup-1.29.3/)
- [Zig 0.17.1](https://ziglang.org/news/0.17.1-released/)
- [pipx 1.18.13](https://github.com/pypa/pipx/releases/tag/1.18.13)
- [DNF5 5.4.7.0](https://github.com/rpm-software-management/dnf5/releases/tag/5.4.7.0)
- [Elm 0.19.4-beta](https://github.com/elm/compiler/releases/tag/0.19.4-beta)
- [Dependabot Core 0.403.0](https://github.com/dependabot/dependabot-core/releases/tag/v0.403.0)

## Articles

[Friction in the Python Packaging Standards Process](https://blog.schuetze.link/friction-in-packaging-peps/) (konsti, uv) lists problems with how packaging PEPs get made. The text goes through editing passes before and after discussion and moves between reStructuredText and Markdown. Discussions on discuss.python.org have no concern tracking, and several maintainers avoid the forum. Small changes, such as removing a decade-old unimplemented feature, require a full PEP. The post points to Rust's RFC concern tracking and final comment period as prior art.

[Scrutinize our assessments](https://daniel.haxx.se/blog/2026/11/03/scrutinize-our-assessments/) (Daniel Stenberg) follows up on curl moving low and medium severity vulnerability handling into public GitHub issues. Stenberg explains the `vuln:ASSESS`, `vuln:NONE`, `vuln:LOW` and `vuln:MEDIUM` labels and asks outsiders to challenge the severity calls. CVE IDs are visible from assignment, and the full records are published on the release date.

## Elsewhere

[DCFinder](https://doi.org/10.1177/0926227x261505352) (Xiaoya Zhu et al., Journal of Computer Security) detects dependency confusion in Python projects that use more than one index. It builds the transitive tree from private indexes and PyPI and checks whether the resolver would select a public version. On 28 real projects it reports 88.7% precision and 83.3% recall, against zero detections from the baseline tools.

Vlad Miricioiu, director of the Software Stewardship Lab and one of my FOSDEM devroom co-organisers, [talked to RedMonk](https://redmonk.com/videos/vlad-miricioiu/) about binary dependencies, maintainer burnout, funding models and the Bernies.

## git-pkgs

I tagged [archives v0.10.1](https://github.com/git-pkgs/archives/releases/tag/v0.10.1), [cooldown v0.3.1](https://github.com/git-pkgs/cooldown/releases/tag/v0.3.1), [manifests v0.12.4](https://github.com/git-pkgs/manifests/releases/tag/v0.12.4), [proxy v0.11.0](https://github.com/git-pkgs/proxy/releases/tag/v0.11.0) and [spdx v0.3.6](https://github.com/git-pkgs/spdx/releases/tag/v0.3.6).

Send links for next week to [@andrewnez@mastodon.social](https://mastodon.social/@andrewnez).
