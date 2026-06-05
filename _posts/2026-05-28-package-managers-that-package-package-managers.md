---
layout: post
title: "Package managers that package package managers"
date: 2026-05-28 10:00 +0000
description: "brew install spack install conda install cargo install uv tool install pip install poetry add pdm add conan"
tags:
  - package-managers
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mnklpslu7u2v"
---

[Mike Fiedler](https://github.com/miketheman) sent me a cursed table he'd put together while trying to close a loop of languages whose package managers each install the next one's runtime. He got there in two hops: PyPI ships a Node binary as [`nodejs-wheel`](https://pypi.org/project/nodejs-wheel/) and npm ships a portable CPython as [`@bjia56/portable-python`](https://www.npmjs.com/package/@bjia56/portable-python), so `pip install` and `npm install` can hand control back and forth indefinitely. I wanted the version where both axes are package managers rather than runtimes, partly because the diagonal then shows which ones ship themselves, and partly because once you start chaining `brew install uv` into `uv tool install conan` it's natural to wonder how far you get before the chain bottoms out at `curl | sh`.

So I [built one](/package-manager-matrix/) covering the 42 clients from the [categorisation post](/2025/12/29/categorizing-package-manager-clients.html), with data pulled from [ecosyste.ms](https://packages.ecosyste.ms) for the language registries and [Repology](https://repology.org) for the distros, and each filled cell linking through to the package it found.

[![Matrix of which package managers package other package managers](/images/package-manager-matrix.png)](/package-manager-matrix/)

The dense rows are the system package managers, and packaging arbitrary binaries is what they're for. The AUR carries [40 of the 42](/package-manager-matrix/), with nixpkgs, Homebrew, the DNF repos and Debian not far behind. The same tools are almost empty as columns, because nothing needs to redistribute apt or DNF when they already arrive with the operating system. Homebrew is the slightly odd case among the system managers since it isn't tied to an operating system image, and the only place I found it packaged is [the AUR](https://aur.archlinux.org/packages/brew-git), where someone has wrapped the install script as `brew-git`.

Conda sits between the two groups, with conda-forge carrying twenty-odd package managers alongside its compilers and runtimes in much the same way Homebrew does. There used to be a `conda` package on PyPI you could pip-install like any other Python tool, but every release of it has [since been yanked](https://github.com/conda/conda/issues/11715) because a pip-installed conda has no base environment to work from, so the only routes into conda now are the system rows and Spack's [`miniconda3`](https://packages.spack.io/package.html?name=miniconda3).

PyPI more generally is the densest of the language registries as a source, since a fair amount of cross-language tooling happens to be written in Python: [Conan](https://pypi.org/project/conan/) for C++ and the [meson](https://pypi.org/project/meson/) build system live there, as do the four competing PyPI clients which can all install each other. The npm registry covers the four JavaScript clients and [Elm](https://www.npmjs.com/package/elm). RubyGems carries Bundler and [CocoaPods](https://rubygems.org/gems/cocoapods), and crates.io has [uv](https://crates.io/crates/uv) because uv is a Rust binary that publishes there as well as to PyPI. Maven Central turns out to redistribute npm, Yarn and Bun as jars via [WebJars](https://www.webjars.org/) and [mvnpm](https://mvnpm.org/), which exist so that a Gradle or Maven build can fetch frontend dependencies without running a second package manager alongside it.

Twenty-five of the forty-two ship themselves on their own registry. For apt, DNF, pacman and apk that's just how the tool gets updated, since the package manager is one more system package among the rest. On the language side `pip install --upgrade pip` is in a lot of people's muscle memory, and npm, Cargo, Composer and Maven all use their own registries as the release channel for the same reason. Homebrew has no `brew` formula and updates by running `git pull` on its own checkout, which is why its diagonal cell stays empty.

A CVE filed against pip lands as `pkg:pypi/pip` and perhaps `pkg:deb/python3-pip`, but the Homebrew, conda-forge, nixpkgs and Spack packages in pip's column are the same software with the same bug, and each of those redistributors has to file or map their own entry. Mapping Homebrew formulae back to upstream advisories was annoying enough that I [wrote a tool for it](/2026/01/08/brew-vulns-cve-scanning-for-homebrew.html), and that's one column of forty-two.

A first attempt at filling the matrix probed each registry for a package literally named after each other manager. That doesn't work, because every short name is already taken on every flat-namespace registry and almost never by the right thing: [`pip` on npm](https://www.npmjs.com/package/pip) is a 2012 CLI for the Freckle time tracker, [`homebrew` on PyPI](https://pypi.org/project/homebrew/) is an empty 0.0.0.1 with no description, and [`pacman` on npm](https://www.npmjs.com/package/pacman) is a static site generator. Going the other way and asking ecosyste.ms which packages point at each manager's canonical source repo gave [much cleaner results](https://github.com/andrew/nesbitt.io/blob/master/_data/package_manager_matrix.csv), at the cost of a handful of false positives where someone has set `repository` in their `package.json` to `rust-lang/cargo` for a hello-world WASM tutorial.

The longest chain I've found without reusing a client runs fourteen hops from an Arch box to a working Elm compiler, with the middle stretch getting progressively more nested because Poetry and pdm only install into projects:

```sh
yay -S brew-git                                     # AUR
brew install spack
spack install miniconda3                            # gives conda
conda install -c conda-forge rust                   # bundles cargo
cargo install --locked uv
uv tool install pip
pip install poetry
poetry init -n && poetry add pdm
poetry run pdm init -n && poetry run pdm add conan
poetry run pdm run conan install --requires=nodejs/22.20.0 -g VirtualBuildEnv
source conanbuild.sh                                # nodejs bundles npm
npm install -g yarn
yarn global add pnpm
pnpm add -g bun
bun add -g elm
```

An earlier eleven-hop version of this went `pip → poetry → pdm → uv → conda` for the Python stretch until [Jean-Christophe Morin pointed out](https://github.com/andrew/nesbitt.io/pull/63) that the PyPI `conda` package has been yanked, and rerouting around that turned up the Spack and Cargo detours. If you can beat fourteen the [CSV is on GitHub](https://github.com/andrew/nesbitt.io/blob/master/_data/package_manager_matrix.csv) and pull requests adding `manual` rows are welcome.
