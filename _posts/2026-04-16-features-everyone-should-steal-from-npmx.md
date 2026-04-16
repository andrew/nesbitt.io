---
layout: post
title: "Features everyone should steal from npmx"
date: 2026-04-16 10:00 +0000
description: "What happens when users design their own package registry frontend"
tags:
  - package-managers
  - npm
---

For most of the time GitHub has owned npm, the public-facing website at npmjs.com has been effectively frozen, with the issue tracker accumulating years of requests that nobody on the inside seemed to be reading. In January [Daniel Roe](https://roe.dev) started [npmx.dev](https://npmx.dev) as an alternative web frontend over the same registry data, posted about it on Bluesky, and within a fortnight years of pent-up demand had turned into a thousand issues and pull requests on a repo that would actually merge them, with the contributor count passing a hundred a couple of days after that. It helps that every npmjs.com URL works with the hostname swapped to `npmx.dev` or `xnpmjs.com`, the same trick Invidious and Nitter used, so browser extensions and muscle memory carry straight over. The competitive pressure appears to have worked: npmjs.com shipped dark mode last month, the single most upvoted feature request on the tracker for something like five years, and there are signs of other long-dormant tickets being picked up.

Whether or not that continues, npmx has turned into a useful catalogue of ideas for anyone building a package registry website, and the [whole thing is MIT licensed](https://github.com/npmx-dev/npmx.dev) where the npm registry and website remain closed source, so every feature below comes with a working reference implementation rather than just screenshots. Prior art from other ecosystems is noted where it exists.

- **Transitive install size.** The number shown is the unpacked size of the package plus every dependency it pulls in, which is what actually lands on disk, rather than the single tarball size that crates.io and PyPI show. JavaScript developers have been getting this from [bundlephobia](https://bundlephobia.com) and [packagephobia](https://packagephobia.com) for years.

- **Install script disclosure.** Any `preinstall`, `install`, or `postinstall` script in the manifest is rendered on the package page along with the `npx` packages those scripts would fetch, with links into the code browser so you can read what runs. Worth having in front of you given how many supply-chain incidents start with a postinstall hook.

- **Outdated and vulnerable dependency trees.** Rather than a flat list of declared dependencies, you get an expandable tree where each node is annotated with how far behind latest it is and whether it appears in [OSV](https://osv.dev), recursively through transitives. Google's [deps.dev](https://deps.dev) does something similar across ecosystems.

- **Version range resolution.** Wherever a semver range like `^1.0.0` appears it is shown alongside the concrete version it currently resolves to, which saves a round trip to the CLI when you are trying to work out what you would actually get.

- **Module replacement suggestions.** Packages that appear in the [e18e module-replacements dataset](https://github.com/es-tooling/module-replacements) get a banner pointing at the native API or lighter alternative, with MDN links for the native cases.

- **Module format and types badges.** ESM, CJS, or dual is shown next to the package name, as is whether TypeScript types are bundled or need a separate `@types/*` install, plus the declared Node engine range. JavaScript-specific in the details but the general idea of "will this work with my toolchain" badges travels; crates.io's MSRV field and edition badge are in the same spirit.

- **Multi-forge repository stats.** Star and fork counts are fetched from [GitHub, GitLab, Bitbucket, Codeberg, Gitee, Sourcehut, Forgejo, Gitea, Radicle, and Tangled](https://docs.npmx.dev/guide/features#supported-git-providers), depending on where the `repository` field points, rather than special-casing GitHub.

- **Cross-registry availability.** Scoped packages that also exist on [JSR](https://jsr.io) are flagged as such. The npm/JSR pairing is particular to JavaScript but "this is also on registry X" applies anywhere ecosystems overlap, like Maven and Clojars or the various Linux distro repos, and the same lookup doubles as a dependency-confusion check when the name exists elsewhere but the publisher does not match.

- **Side-by-side package comparison.** Up to ten packages can be loaded into a [compare view](https://npmx.dev/compare) that lays out all the metrics above in a table, plus a scatter plot with aggregate "traction" on one axis and "ergonomics" on the other so the popular-but-heavy and small-but-unknown options separate visually.

- **Version diffing.** Any two published versions can be diffed file-by-file in the browser, which Hex has had for years via [diff.hex.pm](https://diff.hex.pm) and which exists in the Rust world through `cargo-vet` tooling.

- **Release timeline with size annotations.** Every version of a package is plotted on a timeline with markers where install size jumped by a meaningful percentage, which is a neat way to spot the release where someone accidentally started shipping their test fixtures.

- **Download distribution by version.** The weekly download chart can be broken down by major or minor line so you can see how much of the ecosystem is still on v2 of something now on v5, similar to [RubyGems' per-version download counts](https://rubygems.org/gems/rails/versions) but rendered as a distribution rather than a table.

- **Command palette.** `⌘K` opens a palette with every action available on the current page plus global navigation, and on a package page typing a semver range filters the version list to matches. Borrowed from editors and from GitHub itself rather than from any registry.

- **Internationalisation.** The interface ships in [over thirty locales](https://github.com/npmx-dev/npmx.dev/tree/main/i18n/locales) including RTL languages, with [PyPI's Warehouse](https://hosted.weblate.org/projects/pypa/warehouse/) being the other registry that has invested in this.

- **Accessibility as a default.** Charts and demo videos in the release notes carry long-form `aria-label` and `figcaption` text, the command palette works with screen readers, and there is a dedicated [accessibility statement](https://npmx.dev/accessibility).

- **Playground link extraction.** StackBlitz, CodeSandbox, CodePen, JSFiddle, and Replit links found in a package's README are pulled out into a dedicated panel so you can try the thing without cloning it.

- **Agent skill detection.** Packages that contain [Agent Skills](https://www.anthropic.com/news/skills) manifests have them listed with declared tool compatibility, which is very 2026, though detecting non-code payloads in published packages is useful.

- **Social features on AT Protocol.** Package "likes" are [atproto](https://atproto.com) records rather than rows in a private database, blog comment threads are Bluesky threads, and the custom record types are [public lexicons in the repo](https://github.com/npmx-dev/npmx.dev/tree/main/lexicons) so other tools can read and write the same data without talking to npmx. If you have ever wanted to add reviews or comments to a registry and balked at the moderation burden of running another silo, borrowing an existing network's identity and content layer is a defensible answer, and while I am personally sceptical that leaning on Bluesky's infrastructure will work out long term, npmx at least runs [its own PDS at npmx.social](https://npmx.dev/pds) so the records stay under their control either way.

- **Local-CLI admin connector.** Management actions like claiming a package name or editing access are proxied through your local `npm` CLI rather than requiring you to log into the site, which sidesteps the need for npmx to hold credentials for a registry it does not own.

- **Dark mode and custom palettes.** Listed last because this is the one npm has now copied, joining pkg.go.dev, crates.io, and PyPI which already had it.

---

Someone in the .NET world has already built an equivalent: [nugx.org](https://nugx.org/), in its own words "inspired by npmx", is doing the same thing for NuGet.
