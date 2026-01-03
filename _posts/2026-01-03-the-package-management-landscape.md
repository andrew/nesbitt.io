---
layout: post
title: "The Package Management Landscape"
date: 2026-01-03 10:00 +0000
description: "A directory of tools, systems, and services that relate to package management."
tags:
  - package-managers
---

A directory of tools, libraries, registries, and standards across package management. I put this together partly as a reference, partly to track which areas I've covered in other posts.

**Contents:** [Language package managers](#language-package-managers) · [System package managers](#system-package-managers) · [Frontends](#package-manager-frontends) · [Universal tools](#universal-and-cross-language-tools) · [Resolution libraries](#dependency-resolution-libraries) · [Manifest parsing](#manifest-and-lockfile-parsing) · [Registry software](#registry-software) · [Enterprise tools](#enterprise-tools) · [Security tools](#security-and-analysis-tools) · [Metadata platforms](#metadata-and-discovery-platforms) · [SBOM tools](#sbom-and-supply-chain-tools) · [Trusted publishing](#trusted-publishing) · [Monorepo tools](#monorepo-and-workspace-tools) · [Build tools](#build-tools-with-dependency-management) · [Research](#research) · [Standards](#standards-and-specifications)

## Language package managers

Each programming language ecosystem has at least one package manager, often several. The [categorizing clients](/2025/12/29/categorizing-package-manager-clients.html) post covers their resolution algorithms, lockfile strategies, and manifest formats in detail.

**JavaScript/TypeScript:** [npm](https://www.npmjs.com), [Yarn](https://yarnpkg.com), [pnpm](https://pnpm.io), [Bun](https://bun.sh), [Deno](https://deno.land), [jsr.io](https://jsr.io), [Corepack](https://github.com/nodejs/corepack), [jspm](https://github.com/jspm/jspm)

**Python:** [pip](https://pip.pypa.io), [Poetry](https://python-poetry.org), [uv](https://github.com/astral-sh/uv), [pdm](https://pdm-project.org), [pipenv](https://pipenv.pypa.io), [Hatch](https://github.com/pypa/hatch), [Conda](https://docs.conda.io), [Mamba](https://mamba.readthedocs.io), [Pixi](https://pixi.sh)

**Ruby:** [RubyGems](https://rubygems.org), [Bundler](https://bundler.io)

**Rust:** [Cargo](https://doc.rust-lang.org/cargo/)

**Go:** [Go modules](https://go.dev/ref/mod)

**Java/JVM:** [Maven](https://maven.apache.org), [Gradle](https://gradle.org), [sbt](https://www.scala-sbt.org), [Leiningen](https://leiningen.org), [Ivy](https://ant.apache.org/ivy/), [Coursier](https://github.com/coursier/coursier)

**C#/.NET:** [NuGet](https://www.nuget.org), [Paket](https://fsprojects.github.io/Paket/)

**PHP:** [Composer](https://getcomposer.org)

**Elixir:** [Mix](https://hexdocs.pm/mix/Mix.html), [Hex](https://hex.pm)

**Haskell:** [Cabal](https://www.haskell.org/cabal/), [Stack](https://docs.haskellstack.org)

**Swift/Objective-C:** [Swift Package Manager](https://www.swift.org/documentation/package-manager/), [CocoaPods](https://cocoapods.org), [Carthage](https://github.com/Carthage/Carthage)

**Dart:** [pub](https://pub.dev)

**R:** [CRAN](https://cran.r-project.org), [renv](https://rstudio.github.io/renv/), [pak](https://pak.r-lib.org)

**Julia:** [Pkg](https://pkgdocs.julialang.org)

**Perl:** [CPAN](https://www.cpan.org), [cpanm](https://cpanmin.us)

**Lua:** [LuaRocks](https://luarocks.org)

**Elm:** [elm-package](https://package.elm-lang.org)

**OCaml:** [opam](https://opam.ocaml.org), [esy](https://github.com/esy/esy)

**Racket:** [raco pkg](https://docs.racket-lang.org/pkg/)

**Zig:** [Zig package manager](https://ziglang.org/learn/build-system/)

**Clojure:** [Leiningen](https://leiningen.org), [deps.edn](https://clojure.org/guides/deps_and_cli)

**C/C++:** [Conan](https://conan.io), [vcpkg](https://vcpkg.io), [Hunter](https://hunter.readthedocs.io), [CPM.cmake](https://github.com/cpm-cmake/CPM.cmake), [Rez](https://github.com/AcademySoftwareFoundation/rez)

**Nim:** [Nimble](https://github.com/nim-lang/nimble)

**Fortran:** [fpm](https://fpm.fortran-lang.org)

**Crystal:** [Shards](https://crystal-lang.org/reference/the_shards_command/)

**V:** [VPM](https://vpm.vlang.io)

**Raku:** [zef](https://github.com/ugexe/zef)

**Erlang:** [rebar3](https://rebar3.org), [Hex](https://hex.pm)

**Scala:** [sbt](https://www.scala-sbt.org), [Mill](https://mill-build.org)

**Kotlin:** [Gradle](https://gradle.org)

**Mojo:** [Magic](https://docs.modular.com/magic/)

## System package managers

Operating system package managers handle system-level software: libraries, applications, kernel modules. The [categorizing registries](/2025/12/29/categorizing-package-registries.html) post covers their architectures and governance.

**Debian/Ubuntu:** [apt](https://wiki.debian.org/Apt), [dpkg](https://wiki.debian.org/dpkg)

**Fedora/RHEL/CentOS:** [dnf](https://dnf.readthedocs.io), [yum](http://yum.baseurl.org), [rpm](https://rpm.org)

**Arch:** [pacman](https://wiki.archlinux.org/title/Pacman), [yay](https://github.com/Jguer/yay), [paru](https://github.com/Morganamilo/paru)

**Alpine:** [apk](https://wiki.alpinelinux.org/wiki/Alpine_Package_Keeper)

**openSUSE:** [zypper](https://en.opensuse.org/Portal:Zypper)

**Gentoo:** [Portage](https://wiki.gentoo.org/wiki/Portage)

**Slackware:** [pkgtool](http://www.slackware.com/config/packages.php), [slackpkg](https://slackpkg.org)

**Source Mage:** [Sorcery](https://sourcemage.org/Sorcery)

**Void:** [xbps](https://docs.voidlinux.org/xbps/index.html)

**macOS:** [Homebrew](https://brew.sh), [MacPorts](https://www.macports.org)

**Windows:** [winget](https://learn.microsoft.com/en-us/windows/package-manager/), [Chocolatey](https://chocolatey.org), [Scoop](https://scoop.sh)

**FreeBSD:** [pkg](https://www.freebsd.org/cgi/man.cgi?pkg(7)), [ports](https://www.freebsd.org/ports/)

**OpenBSD:** [pkg_add](https://man.openbsd.org/pkg_add)

**NetBSD:** [pkgsrc](https://www.pkgsrc.org)

**NixOS:** [nix](https://nixos.org)

**Solus:** [eopkg](https://help.getsol.us/docs/packaging)

**Android:** [APK](https://developer.android.com/studio/command-line/apkanalyzer)

**Termux:** [pkg](https://wiki.termux.com/wiki/Package_Management)

## Package manager frontends

Abstraction layers and graphical interfaces for system package managers.

**Abstraction layers:** [PackageKit](https://www.freedesktop.org/software/PackageKit/)

**GUI frontends:** [Synaptic](https://github.com/mvo5/synaptic), [GNOME Software](https://apps.gnome.org/Software/), [Pamac](https://gitlab.manjaro.org/applications/pamac), [Octopi](https://tintaescura.com/projects/octopi/), [Apper](https://userbase.kde.org/Apper), [Discover](https://apps.kde.org/discover/)

**Package converters:** [Alien](https://sourceforge.net/projects/alien-pkg-convert/), [debtap](https://github.com/helixarch/debtap)

**Local build integration:** [CheckInstall](https://en.wikipedia.org/wiki/CheckInstall)

## Universal and cross-language tools

These tools work across language boundaries, managing runtimes, environments, or entire system configurations.

**Universal Linux packages:** [Flatpak](https://flatpak.org), [Snap](https://snapcraft.io), [AppImage](https://appimage.org)

**Reproducible environments:** [Nix](https://nixos.org), [Guix](https://guix.gnu.org), [devbox](https://www.jetify.com/devbox), [tea](https://tea.xyz)

**Version/environment managers:** [asdf](https://asdf-vm.com), [mise](https://mise.jdx.dev), [anyenv](https://github.com/anyenv/anyenv)

**Container registries:** [Docker Hub](https://hub.docker.com), [GitHub Container Registry](https://ghcr.io), [Quay.io](https://quay.io), [Amazon ECR](https://aws.amazon.com/ecr/), [Google Artifact Registry](https://cloud.google.com/artifact-registry)

**Infrastructure packages:** [Terraform Registry](https://registry.terraform.io), [Ansible Galaxy](https://galaxy.ansible.com), [Puppet Forge](https://forge.puppet.com), [Chef Supermarket](https://supermarket.chef.io)

**Scientific computing:** [Conda](https://docs.conda.io), [Mamba](https://mamba.readthedocs.io), [Spack](https://spack.io), [EasyBuild](https://easybuild.io), [modules](https://modules.readthedocs.io)

## Dependency resolution libraries

Reusable libraries that solve the version constraint satisfaction problem. Package managers either use one of these or roll their own.

**[PubGrub](https://github.com/pubgrub-rs/pubgrub):** Conflict-driven solver with good error messages. Used by Dart's pub, Poetry, uv, Hex, recent Bundler.

**[libsolv](https://github.com/openSUSE/libsolv):** SAT-based solver. Used by DNF, Zypper, Conda, Mamba.

**[Rattler](https://github.com/mamba-org/rattler):** Rust implementation of Conda package management. Powers Pixi.

**[Molinillo](https://github.com/CocoaPods/Molinillo):** Backtracking resolver tuned for Ruby. Used by older Bundler, CocoaPods.

**[Clingo](https://potassco.org/clingo/):** Answer set programming solver. Used by Spack.

**[pip-resolver](https://pip.pypa.io/en/stable/topics/dependency-resolution/):** pip's backtracking resolver, built-in since pip 20.3.

**[CUDF](https://www.mancoosi.org/cudf/):** Common Upgradeability Description Format. Used by opam with external solvers.

**[resolvo](https://github.com/mamba-org/resolvo):** SAT solver for package management from the Mamba team.

## Manifest and lockfile parsing

Libraries that read dependency files across ecosystems, used by security scanners, dependency update tools, and metadata platforms.

**[bibliothecary](https://github.com/librariesio/bibliothecary):** Ruby library parsing 30+ manifest formats. Used by Libraries.io.

**[syft](https://github.com/anchore/syft):** Go library that parses manifests and lockfiles as part of SBOM generation.

**[osv-scalibr](https://github.com/google/osv-scalibr):** Google's extraction library for inventory discovery, vulnerability detection, and SBOM generation. Powers OSV-Scanner.

**[pipdeptree](https://github.com/tox-dev/pipdeptree):** Visualizes Python dependency trees.

**[npm-packlist](https://github.com/npm/npm-packlist):** Determines which files npm will include in a package.

**[cargo-tree](https://doc.rust-lang.org/cargo/commands/cargo-tree.html):** Built into Cargo for dependency tree visualization.

**[packageurl](https://github.com/package-url):** Libraries for parsing Package URLs in [Python](https://github.com/package-url/packageurl-python), [Go](https://github.com/package-url/packageurl-go), [JavaScript](https://github.com/package-url/packageurl-js), and other languages.

**[oras](https://github.com/oras-project/oras):** OCI Registry As Storage, for pushing and pulling arbitrary content to OCI registries.

**Version constraint parsers:** [node-semver](https://github.com/npm/node-semver), [packaging](https://github.com/pypa/packaging) (Python), [Gem::Version](https://github.com/rubygems/rubygems) (Ruby), [semver](https://github.com/Masterminds/semver) (Go), [semver](https://github.com/dtolnay/semver) (Rust)

## Registry software

Self-hosted registries for private packages or local mirrors.

**npm-compatible:** [Verdaccio](https://verdaccio.org)

**PyPI-compatible:** [devpi](https://github.com/devpi/devpi), [Warehouse](https://github.com/pypi/warehouse)

**Maven-compatible:** [Archiva](https://archiva.apache.org)

**NuGet-compatible:** [NuGet.Server](https://github.com/NuGet/NuGet.Server), [BaGet](https://github.com/loic-sharma/BaGet)

**Docker-compatible:** [Harbor](https://goharbor.io), [Distribution](https://github.com/distribution/distribution), [Dragonfly](https://d7y.io)

**Gem-compatible:** [Gemstash](https://github.com/rubygems/gemstash), [geminabox](https://github.com/geminabox/geminabox)

**Go module proxy:** [Athens](https://github.com/gomods/athens), [goproxy](https://github.com/goproxy/goproxy)

**Cargo-compatible:** [Kellnr](https://kellnr.io), [Alexandrie](https://github.com/Hirevo/alexandrie)

**Helm-compatible:** [ChartMuseum](https://chartmuseum.com), [Harbor](https://goharbor.io)

## Enterprise tools

Artifact repositories, fleet management, and package distribution for organizations.

**Artifact repositories:** [JFrog Artifactory](https://jfrog.com/artifactory/), [Sonatype Nexus](https://www.sonatype.com/products/sonatype-nexus-repository), [GitHub Packages](https://github.com/features/packages), [GitLab Package Registry](https://docs.gitlab.com/ee/user/packages/package_registry/), [AWS CodeArtifact](https://aws.amazon.com/codeartifact/), [Azure Artifacts](https://azure.microsoft.com/en-us/products/devops/artifacts), [Google Artifact Registry](https://cloud.google.com/artifact-registry), [Cloudsmith](https://cloudsmith.com), [Quay](https://quay.io), [Gitea Packages](https://docs.gitea.com/usage/packages/overview), [Pulp](https://pulpproject.org)

**macOS fleet:** [Workbrew](https://workbrew.com), [Munki](https://github.com/munki/munki), [AutoPkg](https://github.com/autopkg/autopkg), [Jamf](https://www.jamf.com)

**Linux fleet:** [Landscape](https://ubuntu.com/landscape), [SUSE Manager](https://www.suse.com/products/suse-manager/), [Foreman](https://theforeman.org), [Spacewalk](https://spacewalkproject.github.io)

**Windows fleet:** [Intune](https://learn.microsoft.com/en-us/mem/intune/), [SCCM](https://learn.microsoft.com/en-us/mem/configmgr/), [PDQ](https://www.pdq.com)

## Security and analysis tools

Tools for scanning dependencies, detecting vulnerabilities, and keeping packages updated.

**Vulnerability scanning:** [Snyk](https://snyk.io), [Socket](https://socket.dev), [Grype](https://github.com/anchore/grype), [Trivy](https://trivy.dev), [npm audit](https://docs.npmjs.com/cli/commands/npm-audit), [pip-audit](https://github.com/pypa/pip-audit), [bundler-audit](https://github.com/rubysec/bundler-audit), [cargo-audit](https://github.com/rustsec/rustsec), [safety](https://github.com/pyupio/safety), [OSV-Scanner](https://google.github.io/osv-scanner/), [Dependency-Check](https://owasp.org/www-project-dependency-check/)

**Dependency updates:** [Dependabot](https://github.com/dependabot), [Renovate](https://www.mend.io/renovate/), [Snyk](https://snyk.io), [Depfu](https://depfu.com), [pip-tools](https://github.com/jazzband/pip-tools), [OpenRewrite](https://github.com/openrewrite/rewrite)

**Malware detection:** [Socket](https://socket.dev), [Stacklok](https://stacklok.com), [GuardDog](https://github.com/DataDog/guarddog)

**License compliance:** [FOSSA](https://fossa.com), [Snyk](https://snyk.io), [Mend](https://www.mend.io), [Black Duck](https://www.synopsys.com/software-integrity/security-testing/software-composition-analysis.html), [FOSSology](https://www.fossology.org), [licensee](https://github.com/licensee/licensee), [ScanCode Toolkit](https://github.com/aboutcode-org/scancode-toolkit), [ScanCode.io](https://github.com/aboutcode-org/scancode.io), [DejaCode](https://github.com/aboutcode-org/dejacode), [cargo-deny](https://github.com/EmbarkStudios/cargo-deny), [pip-licenses](https://github.com/raimon49/pip-licenses), [license_finder](https://github.com/pivotal/LicenseFinder)

**Software composition analysis:** [Snyk](https://snyk.io), [Sonatype](https://www.sonatype.com), [Black Duck](https://www.synopsys.com/software-integrity/security-testing/software-composition-analysis.html), [Veracode SCA](https://www.veracode.com/products/software-composition-analysis), [FOSSA](https://fossa.com)

**CI security:** [Zizmor](https://woodruffw.github.io/zizmor/), [StepSecurity](https://www.stepsecurity.io), [Harden-Runner](https://github.com/step-security/harden-runner), [OpenSSF Allstar](https://github.com/ossf/allstar)

**Fuzzing:** [OSS-Fuzz](https://github.com/google/oss-fuzz)

**GitHub Actions lockfiles:** [ghasum](https://github.com/chains-project/ghasum), [gh-actions-lockfile](https://github.com/gjtorikian/gh-actions-lockfile)

## Metadata and discovery platforms

Services that aggregate package data across ecosystems.

**Cross-ecosystem:** [ecosyste.ms](https://ecosyste.ms), [deps.dev](https://deps.dev), [Libraries.io](https://libraries.io), [Snyk Advisor](https://snyk.io/advisor/), [OpenSSF Scorecard](https://scorecard.dev), [PurlDB](https://github.com/aboutcode-org/purldb)

**Ecosystem-specific:** [npms.io](https://npms.io), [bundlephobia](https://bundlephobia.com), [pkg-size](https://pkg-size.dev), [PyPI Stats](https://pypistats.org), [deps.rs](https://deps.rs)

**Cross-distro:** [Repology](https://repology.org), [pkgs.org](https://pkgs.org)

**Dependency graphs:** [deps.dev](https://deps.dev), [GitHub Dependency Graph](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph), [GitLab Dependency List](https://docs.gitlab.com/ee/user/application_security/dependency_list/), [Sourcegraph](https://sourcegraph.com)

**Advisory databases:** [OSV](https://osv.dev), [GitHub Advisory Database](https://github.com/advisories), [NVD](https://nvd.nist.gov), [Snyk Vulnerability Database](https://security.snyk.io), [RubySec](https://rubysec.com), [PyUp Safety DB](https://github.com/pyupio/safety-db), [VulnerableCode](https://github.com/aboutcode-org/vulnerablecode)

**Package manager documentation:** [ecosyste.ms docs](https://github.com/ecosyste-ms) covering [resolvers](https://github.com/ecosyste-ms/package-manager-resolvers), [archives](https://github.com/ecosyste-ms/package-manager-archives), [CLI commands](https://github.com/ecosyste-ms/package-manager-commands), [manifest examples](https://github.com/ecosyste-ms/package-manager-manifest-examples), [lifecycle hooks](https://github.com/ecosyste-ms/package-manager-hooks)

## SBOM and supply chain tools

Tools for generating and consuming Software Bills of Materials, and for supply chain security more broadly.

**SBOM generators:** [Syft](https://github.com/anchore/syft), [Trivy](https://trivy.dev), [CycloneDX tools](https://cyclonedx.org/tool-center/), [SPDX tools](https://spdx.dev/use/tools/), [Tern](https://github.com/tern-tools/tern), [Bom](https://github.com/kubernetes-sigs/bom), [cdxgen](https://github.com/CycloneDX/cdxgen), [sbom-tool](https://github.com/microsoft/sbom-tool)

**SBOM management:** [sbomify](https://github.com/sbomify/sbomify), [Dependency-Track](https://dependencytrack.org), [GUAC](https://guac.sh)

**SBOM libraries:** [Protobom](https://github.com/protobom/protobom)

**SBOM formats:** [CycloneDX](https://cyclonedx.org), [SPDX](https://spdx.dev), [SWID](https://csrc.nist.gov/projects/Software-Identification-SWID)

**SBOM quality:** [sbom-scorecard](https://github.com/eBay/sbom-scorecard), [sbomqs](https://github.com/interlynk-io/sbomqs), [ntia-conformance-checker](https://github.com/spdx/ntia-conformance-checker)

**Provenance:** [SLSA](https://slsa.dev), [slsa-verifier](https://github.com/slsa-framework/slsa-verifier), [GitHub Artifact Attestations](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations), [Witness](https://github.com/in-toto/witness), [Notary](https://notaryproject.dev)

**Reproducible builds:** [Reproducible Builds](https://reproducible-builds.org), [oss-rebuild](https://github.com/google/oss-rebuild), [rebuilderd](https://github.com/kpcyrd/rebuilderd), [diffoscope](https://diffoscope.org)

**Policy enforcement:** [OPA](https://www.openpolicyagent.org)/[Gatekeeper](https://open-policy-agent.github.io/gatekeeper/), [Kyverno](https://kyverno.io), [ratify](https://github.com/ratify-project/ratify)

## Trusted publishing

Infrastructure for verifying package provenance and integrity.

**[Sigstore](https://sigstore.dev):** Keyless signing infrastructure (cosign, fulcio, rekor). Used by npm, PyPI, and others for provenance. [policy-controller](https://github.com/sigstore/policy-controller) enforces signature policies in Kubernetes.

**[The Update Framework (TUF)](https://theupdateframework.io/):** Framework for secure software update systems. Used by PyPI, RubyGems, Homebrew.

**[in-toto](https://in-toto.io/):** Supply chain layout and verification. Ensures each step in the build pipeline was performed correctly.

**[SBOMit](https://sbomit.dev/):** Generates signed, in-toto attested SBOMs.

**[Go checksum database](https://go.dev/ref/mod#checksum-database):** sum.golang.org provides a transparency log for Go module checksums.

**[npm provenance](https://docs.npmjs.com/generating-provenance-statements):** Links published packages to source commits and build logs via Sigstore.

**[PyPI Trusted Publishers](https://docs.pypi.org/trusted-publishers/):** OIDC-based publishing from GitHub Actions, GitLab CI, and other CI providers.

## Monorepo and workspace tools

Tools for managing multiple packages in a single repository.

**JavaScript:** [Turborepo](https://turbo.build), [Nx](https://nx.dev), [Lerna](https://lerna.js.org), [Rush](https://rushjs.io), [Bolt](https://github.com/boltpkg/bolt), [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces), [Yarn workspaces](https://yarnpkg.com/features/workspaces), [pnpm workspaces](https://pnpm.io/workspaces)

**Multi-language:** [Bazel](https://bazel.build), [Pants](https://www.pantsbuild.org), [Buck](https://buck.build), [Please](https://please.build), [Nx](https://nx.dev), [Repo](https://gerrit.googlesource.com/git-repo/)

**Task runners:** [Turborepo](https://turbo.build), [Nx](https://nx.dev), [moon](https://moonrepo.dev), [wireit](https://github.com/google/wireit)

**Publishing:** [Lerna](https://lerna.js.org), [changesets](https://github.com/changesets/changesets), [semantic-release](https://semantic-release.gitbook.io), [release-it](https://github.com/release-it/release-it)

## Build tools with dependency management

Build systems that include package management features.

**Bazel:** [bzlmod](https://bazel.build/external/module)

**CMake:** [FetchContent](https://cmake.org/cmake/help/latest/module/FetchContent.html), [CPM](https://github.com/cpm-cmake/CPM.cmake)

**Meson:** [wraps](https://mesonbuild.com/Wrap-dependency-system-manual.html)

**Container builds:** [Earthly](https://github.com/earthly/earthly), [Cloud Native Buildpacks](https://buildpacks.io)

## Research

A longer list of academic work is in [Package Management Papers](/2025/11/13/package-management-papers.html).

**Dependency analysis:** [FASTEN](https://github.com/fasten-project), [Software Heritage](https://www.softwareheritage.org), [Mancoosi](https://www.mancoosi.org)

**Datasets:** [GH Archive](https://www.gharchive.org), [World of Code](https://worldofcode.org), [npm-follower](https://github.com/donald-pinckney/npm-follower), [Code Commons](https://codecommons.org/)

**Bloat detection:** [DepClean](https://github.com/castor-software/depclean), [deptry](https://github.com/fpgmaas/deptry)

## Standards and specifications

Specifications that enable interoperability between tools.

**Package identification:** [PURL](https://github.com/package-url/purl-spec), [VERS](https://github.com/package-url/purl-spec/blob/master/VERSION-RANGE-SPEC.rst), [CPE](https://nvd.nist.gov/products/cpe), [SWHID](https://www.swhid.org/)

**Vulnerability exchange:** [OSV](https://ossf.github.io/osv-schema/), [CVE](https://www.cve.org), [CWE](https://cwe.mitre.org), [OpenVEX](https://github.com/openvex/spec), [vexctl](https://github.com/openvex/vexctl)

**SBOM formats:** [CycloneDX](https://cyclonedx.org), [SPDX](https://spdx.dev)

**Supply chain:** [SLSA](https://slsa.dev), [in-toto](https://in-toto.io), [TUF](https://theupdateframework.io)

**Versioning:** [SemVer](https://semver.org), [PEP 440](https://peps.python.org/pep-0440/) (Python versions), [node-semver](https://github.com/npm/node-semver) (npm range syntax)

**Container:** [OCI](https://opencontainers.org/) (image and distribution specs), [OCI Artifacts](https://github.com/opencontainers/image-spec/blob/main/artifacts-guidance.md)

**Signing envelopes:** [DSSE](https://github.com/secure-systems-lab/dsse) (Dead Simple Signing Envelope)

---

Missing something? [Send a pull request](https://github.com/andrew/nesbitt.io) or [open an issue](https://github.com/andrew/nesbitt.io/issues).
