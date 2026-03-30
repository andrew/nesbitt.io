---
layout: post
title: "Git Diff Drivers"
date: 2026-03-30 10:00 +0000
description: "What git's diff drivers can do, from built-in language support to custom textconv filters."
tags:
  - git
  - tools
  - reference
---

When I added a diff driver to [git-pkgs](https://github.com/git-pkgs/git-pkgs), most of the work was already done. git-pkgs could parse 29 lockfile formats and extract dependency lists, so wiring that into git's textconv mechanism was a small addition that turned `git diff` on a lockfile from 200 lines of resolver noise into a handful of dependency changes. That got me looking at what else people had built on top of git's diff driver system, and at the 28 built-in drivers that git ships, none of which has made it into any forge or GUI client.

### Built-in drivers

The [built-in drivers](https://github.com/git/git/blob/master/userdiff.c) are defined in `userdiff.c` and activated by setting `diff=<name>` in `.gitattributes`. Each one provides two things: a `xfuncname` regex that git uses to find function or section headers for hunk context, and a `wordRegex` that controls how `--word-diff` tokenizes lines.

The full list as of git 2.53: ada, bash, bibtex, cpp (which covers both C and C++), csharp, css, default, dts, elixir, fortran, fountain, golang, html, ini, java, kotlin, markdown, matlab, objc, pascal, perl, php, python, r, ruby, rust, scheme, and tex. The two most recent additions are ini (2.50) and r (2.51). GitHub's [linguist](https://github.com/github-linguist/linguist) uses these same names for language detection, so if you set `*.rs diff=rust` in your `.gitattributes`, both git locally and GitHub's code view will understand the intent, though GitHub doesn't actually use the driver for its web diffs.

```
*.rs diff=rust
*.go diff=golang
*.kt diff=kotlin
```

Kotlin was [proposed as a patch](https://patchwork.kernel.org/project/git/patch/20220303181517.70682-1-jaydeepjd.8914@gmail.com/) in 2022 and merged. A [TypeScript driver PR](https://github.com/git/git/pull/1746) was submitted and then retracted, though the cpp driver covers enough of TypeScript's syntax that most people don't notice. Languages without a built-in driver still get the default driver, which tries a few generic heuristics for function headers but often latches onto something unhelpful. The difference shows up in hunk headers. Without a driver, a change inside a Ruby method might show `@@ -10,3 +10,4 @@ end` or latch onto a blank line. With `diff=ruby`, the same hunk header becomes `@@ -10,3 +10,4 @@ def process_payment`, which tells you where you are without scrolling up.

### Custom diff drivers

Git supports three kinds of custom diff driver configuration, all set under `[diff "<name>"]` in your git config.

**textconv** is the most useful: a command that takes a filename as its argument and writes human-readable text to stdout. Git runs this on both sides of a diff and then diffs the text output instead of the raw file. If you have `exiftool` installed, you can diff image metadata:

```ini
[diff "exif"]
    textconv = exiftool
    cachetextconv = true
```

```
# .gitattributes
*.png diff=exif
*.jpg diff=exif
```

Now `git diff` on a JPEG shows you which EXIF fields changed rather than a wall of binary gibberish. The `cachetextconv` option stores conversion results in git notes (`refs/notes/textconv/exif`) so repeated diffs don't re-run the conversion every time. Without it, something like `git log -p` on a repository with PDF files will re-run `pdftotext` for every commit that touched one, which gets painful fast.

The textconv mechanism is one-way: git can display the diff but you can't apply it as a patch, because the original binary content can't be reconstructed from the converted text.

**command** replaces git's entire diff pipeline for matched files. It receives seven arguments (the same interface as `GIT_EXTERNAL_DIFF`) and takes full responsibility for producing output. Most people don't need this unless they want visual side-by-side diffs or output in a non-unified format.

**wordRegex** redefines what constitutes a "word" for `--word-diff`. The built-in drivers already set language-appropriate word regexes, but for custom file formats you might want to change how tokens are split. A JSON driver might treat entire quoted strings as single tokens so that `--word-diff` highlights changed values rather than individual characters within strings.

A driver with `binary = true` and a `textconv` command will suppress the "Binary files differ" message and show the textconv output instead, and adding `xfuncname` gives you meaningful hunk headers even for custom formats.

### Notable custom drivers

**Documents**

- [idogawa.dev](https://idogawa.dev/p/2024/01/git-diff-epub.html) -- writeup on diffing epub, docx, pptx, and sqlite via textconv

**Images**

- [ewanmellor/git-diff-image](https://github.com/ewanmellor/git-diff-image) -- uses ImageMagick to generate visual diffs and open them in a viewer
- [pascaliske's gist](https://gist.github.com/pascaliske/53648334378d592c0c2cc62b989a027e) -- uses `exiftool` for metadata-level image diffs

**Apple / Xcode**

- Binary plist files have a well-established one-liner: `git config diff.plist.textconv "plutil -convert xml1 -o -"` converts them to readable XML
- [jmah/xibition](https://github.com/jmah/xibition) -- textconv driver for XIB/NIB files, converts them to a lossy human-readable format showing names, labels, actions, and outlets

**Game engines**

- [madsbangh/unity2text](https://github.com/madsbangh/unity2text) -- textconv driver for Unity YAML scene files (.unity, .prefab), inserts readable GameObject names and hierarchies into the diff output
- Unity also ships UnityYAMLMerge as an official merge driver for three-way merging scene files

**Databases**

- [cannadayr/git-sqlite](https://github.com/cannadayr/git-sqlite) -- diffs SQLite databases by dumping schema and data as SQL, following the approach in [Diego Ongaro's post](https://ongardie.net/blog/sqlite-in-git/)
- [CpanelInc/diff-tools](https://github.com/CpanelInc/diff-tools) -- cPanel's textconv and merge tools for SQLite, tarballs, and patchfiles

**Spreadsheets**

- [DiefBell/XLSX-Diff](https://github.com/DiefBell/XLSX-Diff) -- xlsx textconv driver
- [pismute/node-textconv](https://github.com/pismute/node-textconv) -- node-based textconv for xlsx

**Notebooks**

- [nbdime](https://github.com/jupyter/nbdime) -- diff and merge drivers for Jupyter notebooks that strip output cells and render structural changes to the cell list

**Data files**

- [ryan-williams/parquet-helpers](https://github.com/ryan-williams/parquet-helpers) -- textconv for Parquet files showing metadata, schema, and sample rows

**Lockfiles**

- [npm/npm-merge-driver](https://github.com/npm/npm-merge-driver) -- merge driver that regenerates the lockfile rather than three-way merging the text
- [git-pkgs](https://github.com/git-pkgs/git-pkgs) -- textconv driver I built that parses 29 lockfile formats and outputs only dependency-level changes

A single dependency update in `Gemfile.lock` or `package-lock.json` can produce hundreds of changed lines of internal resolver state, but with a textconv driver you only see what actually changed:

```bash
$ git pkgs diff-driver --install

$ git diff HEAD~1 -- Gemfile.lock
+ kamal 2.0.0
- puma 5.6.8
+ puma 6.4.2
+ thruster 0.1.0
```

The install command registers the textconv for each supported lockfile format in your git config and appends the corresponding patterns to `.gitattributes`. Once installed it applies everywhere git shows diffs, including `git log -p` and `git show`, and you can bypass it with `--no-textconv` when you need the raw lockfile.

### Gaps

- **Xcode .pbxproj** -- UUIDs everywhere, sections reorder on every save, adding one file touches dozens of lines. Merge drivers exist ([Kintsugi](https://github.com/Lightricks/Kintsugi), [mergepbx](https://github.com/simonwagner/mergepbx)) and [xcdiff](https://github.com/bloomberg/xcdiff) can compare project files standalone, but nobody has wired up a textconv driver.
- **Xcode storyboards** -- XML with machine-generated attributes that reorder on save. XIBs have [xibition](https://github.com/jmah/xibition) but storyboards have nothing equivalent.
- **Godot .tscn/.tres** -- already text, so they diff natively, but [non-deterministic subresource ordering](https://github.com/godotengine/godot/issues/5889) and embedded scripts make the diffs noisy. A normalizing textconv could help but nobody has built one.
- **Generated OpenAPI / Swagger specs** -- one endpoint change cascades through the whole document. Standalone semantic diff tools like [oasdiff](https://github.com/oasdiff/oasdiff) exist but none are wired into git as a textconv.
- **Protobuf descriptors (.pb / .desc)** -- compiled binary that `protoc --decode_raw` can decode, but nobody has published the textconv config for it.
- **Font files (.ttf/.otf)** -- [fonttools](https://github.com/fonttools/fonttools)' `ttx` command can convert to XML and [fdiff](https://github.com/source-foundry/fdiff) can diff fonts standalone, but neither is packaged as a git driver.

### Configuration gotcha

The split between `.gitattributes` (which can be committed) and `[diff]` config (which lives in `.git/config` or `~/.gitconfig`) means that diff drivers are inherently local. You can commit a `.gitattributes` that says `*.db diff=sqlite`, but every developer on the team still needs to configure the `[diff "sqlite"]` section themselves and have the converter tool installed. Some projects include a setup script or document the required config in their README, but there's no mechanism for a repository to declaratively ship its own diff driver configuration that git will auto-apply on clone, which is also why forge integration has been so slow.

### Forge support

GitHub has built bespoke rich diff renderers for [several non-code file types](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files): side-by-side image comparison with swipe and onion-skin modes, CSV rendered as searchable tables, prose files with both source and rendered diff views, GeoJSON on Leaflet maps, [STL files in a WebGL viewer](https://github.blog/news-insights/product-news/3d-file-diffs/), Jupyter notebooks, and PDF rendering. These are all hardcoded server-side renderers with no user configuration. If your file type isn't on the list, you get "Binary files differ" in the web UI regardless of what your `.gitattributes` says.

GitLab has a similar set of built-in renderers (images, notebooks, CSV) with no extension mechanism. [Gitea has an open issue from 2020](https://github.com/go-gitea/gitea/issues/12288) requesting custom diff rendering support, still unresolved. Forgejo inherits Gitea's limitation. None of these forges read or respect `[diff]` config from the repository, and none of them support textconv.

[Sublime Merge](https://github.com/sublimehq/sublime_merge/issues/428), [GitHub Desktop](https://github.com/desktop/desktop/issues/11524), and [Fork](https://github.com/fork-dev/TrackerWin/issues/1566) all have open requests for textconv support too, some dating back years.

A textconv command is arbitrary code execution, and on a forge it would be triggered implicitly when someone opens a PR, with no confirmation step. CI gets away with running arbitrary user code because workflow execution is an explicit opt-in with a visible trust boundary, but diff rendering happens the moment you click on a file, so a malicious repo with a crafted `[diff]` config could execute code on the forge server without anyone choosing to run anything.

One way around this is installing textconv tools in the server's global gitconfig rather than reading config from repositories, which is what [Gitea issue #12288](https://github.com/go-gitea/gitea/issues/12288) proposes. That shifts the burden to the forge operator, who has to choose which formats to support, install the tools, and maintain them, all for a feature most users don't know exists. GitHub's bespoke renderers sidestep the problem entirely by being richer than anything textconv can produce (interactive image sliders, searchable CSV tables, 3D model viewers) without executing any user-supplied commands.

GitHub and GitLab also use [libgit2](https://github.com/libgit2/libgit2/blob/52294c413100ed4930764addc69beadd82382a4c/src/userdiff.h) rather than the git CLI, and executing external commands from a library embedded in a web application server is architecturally different from shelling out. libgit2 does have the built-in driver definitions though, so the hunk-header improvements from the 28 language drivers could be surfaced in web diffs without running any external commands at all.
