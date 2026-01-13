---
layout: post
title: "Package Manager Timeline"
date: 2025-11-15 12:00 +0000
description: "A chronological timeline of package manager releases, major milestones, and significant events in the history of software dependency management."
tags:
  - package-managers
  - history
  - dependencies
  - reference
---

Package managers have had a significant impact on how we build, distribute, and consume software. This timeline documents the evolution of package management systems across both system-level and language-specific ecosystems, from early archive networks to modern dependency managers.

This is a living document—if you know of events that should be included, please reach out on [Mastodon](https://mastodon.social/@andrewnez) or open a pull request on [GitHub](https://github.com/andrew/nesbitt.io/blob/master/_posts/2025-11-15-package-manager-timeline.md).

<style>
.timeline-event {
  margin-bottom: 1.5rem;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.event-type {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.85rem;
  margin-right: 0.5rem;
}

.type-creation {
  background-color: #d4edda;
  color: #155724;
}

.type-release {
  background-color: #cce5ff;
  color: #004085;
}

.type-milestone {
  background-color: #fff3cd;
  color: #856404;
}

.type-incident {
  background-color: #f8d7da;
  color: #721c24;
}

.type-rename {
  background-color: #e7d4f7;
  color: #6f42c1;
}
</style>

<hr>

## 1992

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/CTAN">CTAN established</a></strong>
<br>The Comprehensive TeX Archive Network (CTAN) site structure was put together at the start of 1992, officially announced at EuroTeX conference at Aston University in 1993.
</div>

<hr>

## 1993

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/FreeBSD_Ports">FreeBSD Ports collection</a></strong>
<br>August 26, 1993: Jordan Hubbard committed his package install suite Makefile, with port make macros following on August 21, 1994.
</div>

<hr>

## 1994

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Dpkg">dpkg initial release</a></strong>
<br>January 1994: Ian Murdock created dpkg for Debian as a Shell script, later rewritten in Perl, then in C by Ian Jackson.
</div>

<hr>

## 1995

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://www.linux.co.cr/distributions/review/1995/0920.html">RPM Package Manager released</a></strong>
<br>September 20, 1995: Red Hat Linux 2.0 was released with RPM (Red Hat Package Manager), the first distribution to include this packaging system.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/CPAN">CPAN launched</a></strong>
<br>October 1995: Jarkko Hietaniemi and Andreas König created the Comprehensive Perl Archive Network, one of the first language-specific package repositories.
</div>

<hr>

## 1997

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Pkgsrc">pkgsrc created</a></strong>
<br>October 3, 1997: NetBSD developers Alistair Crooks and Hubert Feyrer created pkgsrc, based on FreeBSD ports.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/R_package#Comprehensive_R_Archive_Network_(CRAN)">CRAN established</a></strong>
<br>The Comprehensive R Archive Network (CRAN) was founded in 1997 by Kurt Hornik and Friedrich Leisch to host R's source code, executable files, documentation, and user-created packages.
</div>

<hr>

## 1998

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/APT_(software)">APT introduced</a></strong>
<br>Advanced Package Tool version 0.0.1 was released by Scott K. Ellis. First test builds were circulated on IRC.
</div>

<hr>

## 1999

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/PHP_Extension_and_Application_Repository">PEAR founded</a></strong>
<br>Stig S. Bakken founded PEAR (PHP Extension and Application Repository) to promote reusable PHP components.
</div>

<hr>

## 2002

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/MacPorts">DarwinPorts project started</a></strong>
<br>Landon Fuller, Kevin Van Vechten, and Jordan Hubbard at Apple started DarwinPorts (later renamed MacPorts in 2006).
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Arch_Linux">Pacman released</a></strong>
<br>March 2002: Judd Vinet created pacman alongside Arch Linux's launch.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Portage_(software)">Gentoo Linux 1.0 and Portage released</a></strong>
<br>March 31, 2002: Gentoo Linux 1.0 was released with Portage, a source-based package management system inspired by FreeBSD's ports.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://lists.baseurl.org/pipermail/yum/2002-June/011067.html">YUM created</a></strong>
<br>June 7, 2002: Seth Vidal and Michael Stenner at Duke University created YUM (Yellowdog Updater Modified) for RPM-based Linux distributions.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://www.sonatype.com/blog/the-history-of-maven-central-and-sonatype-a-journey-from-past-to-present">Maven created</a></strong>
<br>Jason van Zyl created Maven as a sub-project of Apache Turbine.
</div>

<hr>

## 2003

<div class="timeline-event">
<span class="event-type type-milestone">Milestone</span>
<strong><a href="https://maven.apache.org/docs/history.html">Maven accepted as Apache top-level project</a></strong>
<br>Maven was accepted as a top level Apache Software Foundation project.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Nix_(package_manager)">Nix package manager created</a></strong>
<br>Eelco Dolstra created Nix as part of his doctoral research at Utrecht University, introducing purely functional package management.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Python_Package_Index">PyPI launched</a></strong>
<br>The Python Package Index came online, originally as a pure index without hosting capabilities.
</div>

<hr>

## 2004

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://blog.rubygems.org/2004/03/14/0.2.0-released.html">RubyGems released</a></strong>
<br>March 14, 2004: RubyGems version 0.2.0 was publicly released on Pi Day by Chad Fowler, Jim Weirich, David Alan Black, Paul Brannan, and Richard Kilmer.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://maven.apache.org/docs/history.html">Maven 1.0 released</a></strong>
<br>July 13, 2004: Maven 1.0 was released as the first critical milestone.
</div>

<hr>

## 2005

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Cabal_(software)">Cabal specification designed</a></strong>
<br>The Haskell Cabal specification was presented at the Haskell Workshop 2005, defining a common architecture for building applications and libraries.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://maven.apache.org/docs/history.html">Maven 2.0 released</a></strong>
<br>October 2005: Maven 2.0 was released after six months in beta cycles.
</div>

<hr>

## 2006

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/ZYpp">zypper introduced</a></strong>
<br>December 7, 2006: zypper was introduced with openSUSE 10.2 as the command-line interface for ZYpp.
</div>

<hr>

## 2007

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/LuaRocks">LuaRocks released</a></strong>
<br>August 9, 2007: Hisham Muhammad released LuaRocks version 0.1, the package manager for Lua modules.
</div>

<hr>

## 2008

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Gradle">Gradle first release</a></strong>
<br>April 21, 2008: Gradle was released under the Apache License 2.0, building on concepts from Apache Ant and Maven.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Pip_(package_manager)">pip introduced</a></strong>
<br>October 15, 2008: Ian Bicking introduced pip (originally "pyinstall") as an alternative to easy_install.
</div>

<hr>

## 2009

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Homebrew_(package_manager)">Homebrew created</a></strong>
<br>May 21, 2009: Max Howell created Homebrew, addressing package management gaps on macOS.
</div>

<hr>

## 2009

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Leiningen_(software)">Leiningen 1.0 released</a></strong>
<br>December 5, 2009: Phil Hagelberg released Leiningen 1.0.0 as a build automation and dependency management tool for Clojure.
</div>

<hr>

## 2010

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Npm">npm first release</a></strong>
<br>January 12, 2010: Isaac Z. Schlueter released the first version of npm for Node.js.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://metacpan.org/dist/App-cpanminus">cpanminus released</a></strong>
<br>February 20, 2010: Tatsuhiko Miyagawa released cpanminus (cpanm), a lightweight CPAN client.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Alpine_Linux">Alpine Linux 2.0 and APK released</a></strong>
<br>August 17, 2010: Alpine Linux 2.0 was released with APK (Alpine Package Keeper) as its package manager.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://andre.arko.net/2017/11/16/a-history-of-bundles/">Bundler 1.0 released</a></strong>
<br>August 2010: Bundler 1.0 was released, becoming the de facto dependency manager for Ruby projects.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://maven.apache.org/docs/history.html">Maven 3.0 released</a></strong>
<br>October 8, 2010: Maven 3.0 was released with re-worked core, support for parallel builds, and backwards compatibility with Maven 2.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/NuGet">NuGet introduced</a></strong>
<br>October 6, 2010: NuGet (originally "NuPack") was introduced as a package manager for the .NET ecosystem.
</div>

<hr>

## 2011

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://blog.chocolatey.org/2016/03/celebrating-5-years/">Chocolatey released</a></strong>
<br>March 23, 2011: Chocolatey version 0.6.0 was released as a package manager for Windows, inspired by apt and other Linux package managers.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://nodejs.org/en/blog/npm/npm-1-0-released">npm 1.0 released</a></strong>
<br>May 1, 2011: npm 1.0 was released, a significant milestone for Node.js package management.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/CocoaPods">CocoaPods released</a></strong>
<br>September 1, 2011: Eloy Durán released CocoaPods for iOS/macOS development, inspired by RubyGems and Bundler.
</div>

<hr>

## 2012

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Composer_(software)">Composer released</a></strong>
<br>March 1, 2012: Nils Adermann and Jordi Boggiano released Composer, a dependency manager for PHP inspired by npm and Bundler.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://news.dartlang.org/2012/10/dart-m1-release.html">pub released with Dart M1</a></strong>
<br>October 16, 2012: pub package manager was included in the Dart M1 SDK release, one year after Dart's initial announcement.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="http://ilan.schnell-web.net/prog/anaconda-history/">Conda released</a></strong>
<br>October 2012: Anaconda 1.1 included the first release of conda, a cross-platform package and environment manager originally developed for Python data science.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://guix.gnu.org/en/blog/2012/introducing-guix-a-package-manager-and-distro-for-gnu/">Guix announced</a></strong>
<br>November 2012: GNU announced the first alpha release of GNU Guix, a package manager based on Nix.
</div>

<hr>

## 2013

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://github.com/ocaml/opam">OPAM 1.0 released</a></strong>
<br>March 2013: OPAM 1.0 was released as the official package manager for OCaml.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Docker_(software)">Docker released</a></strong>
<br>March 13, 2013: Solomon Hykes publicly demoed Docker at PyCon in Santa Clara, introducing containerization to mainstream development.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Scoop_Package_Manager">Scoop released</a></strong>
<br>May 5, 2013: Scoop was released as a command-line package manager for Windows.
</div>

<hr>

## 2014

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://lists.debian.org/debian-devel/2014/04/msg00013.html">APT 1.0 released</a></strong>
<br>April 1, 2014: APT 1.0 was released, celebrating its "sweet sixteen" exactly 16 years after initial conception.
</div>

<hr>

## 2015

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://blog.rust-lang.org/2015/01/09/Rust-1.0-alpha.html">Cargo released with Rust 1.0-alpha</a></strong>
<br>January 9, 2015: Rust 1.0-alpha was released including Cargo as the official package manager.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://docs.haskellstack.org/">Stack released</a></strong>
<br>April 29, 2015: Stack, a cross-platform build tool for Haskell, had its first public commit.
</div>

<div class="timeline-event">
<span class="event-type type-milestone">Milestone</span>
<strong><a href="https://en.wikipedia.org/wiki/DNF_(software)">DNF becomes default in Fedora 22</a></strong>
<br>May 2015: DNF (Dandified Yum) became the default package manager in Fedora 22, replacing YUM.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://blogs.gnome.org/alexl/2018/06/20/flatpak-a-history/">xdg-app first release</a></strong>
<br>September 2015: First release of xdg-app, a sandboxed application system for Linux (later renamed to Flatpak in 2016).
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://helm.sh/docs/community/history/">Helm introduced</a></strong>
<br>October 19, 2015: First commit to Helm, the Kubernetes package manager, by Matt Butcher at Deis.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://github.com/swiftlang/swift-package-manager">Swift Package Manager announced</a></strong>
<br>December 3, 2015: Apple released Swift Package Manager alongside open-sourcing Swift.
</div>

<hr>

## 2016

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Pnpm">pnpm development began</a></strong>
<br>January 27, 2016: Rico Sta. Cruz made the initial commit to pnpm, later developed by Zoltan Kochan.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Vcpkg">vcpkg launched</a></strong>
<br>September 2016: Microsoft launched vcpkg as a C/C++ library manager for Windows, Linux, and macOS.
</div>

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm.html">npm left-pad incident</a></strong>
<br>March 22, 2016: Developer Azer Koçulu unpublished the left-pad package, breaking thousands of projects including React and Babel. npm changed its unpublish policy as a result.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Snap_(software)">Snap bundled with Ubuntu 16.04</a></strong>
<br>April 21, 2016: Canonical released Ubuntu 16.04 LTS with Snap pre-installed, introducing sandboxed cross-distribution packages to mainstream use.
</div>

<div class="timeline-event">
<span class="event-type type-rename">Rename</span>
<strong><a href="https://flatpak.org/press/2016-06-21-flatpak-released/">xdg-app renamed to Flatpak</a></strong>
<br>May 2016: xdg-app 0.6.0 was released with the new name "Flatpak", officially announced June 21, 2016.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://en.wikipedia.org/wiki/Homebrew_(package_manager)">Homebrew 1.0 released</a></strong>
<br>September 21, 2016: Homebrew reached version 1.0.0 after 7 years of development.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://engineering.fb.com/2016/10/11/web/yarn-a-new-package-manager-for-javascript/">Yarn released</a></strong>
<br>October 11, 2016: Facebook, Exponent, Google, and Tilde released Yarn as a fast, reliable npm alternative.
</div>

<hr>

## 2017

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://medium.com/pnpm/pnpm-version-1-is-out-935a07af914">pnpm 1.0 released</a></strong>
<br>June 28, 2017: pnpm version 1.0 was released by Zoltan Kochan, introducing a novel symlinked node_modules structure.
</div>

<hr>

## 2017

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://kennethreitz.org/essays/2017-01-announcing_pipenv">Pipenv announced</a></strong>
<br>January 2017: Kenneth Reitz announced Pipenv, combining Pipfile, pip, and virtualenv into one toolchain.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://www.hashicorp.com/en/blog/hashicorp-terraform-module-registry">Terraform Registry launched</a></strong>
<br>September 2017: HashiCorp launched the Terraform Module Registry at HashiConf 2017.
</div>

<hr>

## 2018

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://blog.conan.io/2018/01/10/Conan-C-C++-Package-Manager-Hits-1.0.html">Conan 1.0 released</a></strong>
<br>January 10, 2018: Conan 1.0.0 was released as a stable C/C++ package manager.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://github.com/python-poetry/poetry/releases">Poetry released</a></strong>
<br>February 28, 2018: Sébastien Eustace released Poetry 0.1.0, a Python dependency management and packaging tool.
</div>

<div class="timeline-event">
<span class="event-type type-milestone">Milestone</span>
<strong><a href="https://nex3.medium.com/pubgrub-2fb6470504f">pub adopts PubGrub algorithm</a></strong>
<br>April 2, 2018: Natalie Weizenbaum introduced PubGrub, a next-generation version solving algorithm, to Dart's pub package manager.
</div>

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://www.theregister.com/2018/07/12/npm_eslint/">eslint-scope compromised</a></strong>
<br>July 12, 2018: Attacker gained access to an npm maintainer account and published malicious eslint-scope 3.7.2 that harvested npm credentials from ~4,500 accounts.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://github.com/pypa/pip/issues/5516">pip 18.0 released</a></strong>
<br>July 22, 2018: pip 18.0 was released, adopting Calendar Versioning (CalVer) with a 3-month release cadence.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://go.dev/wiki/Modules">Go modules introduced</a></strong>
<br>August 24, 2018: Go 1.11 introduced modules with go.mod files, though not enabled by default until Go 1.14.
</div>

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://www.theregister.com/2018/11/26/npm_repo_bitcoin_stealer/">event-stream backdoor</a></strong>
<br>November 26, 2018: The popular event-stream npm package was compromised with Bitcoin-stealing code via the flatmap-stream dependency, targeting Copay wallets.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://blog.rubygems.org/2018/12/19/3.0.0-released.html">RubyGems 3.0 released</a></strong>
<br>December 19, 2018: RubyGems 3.0.0 was released with performance improvements and new features.
</div>

<hr>

## 2019

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://podman.io/release/2019/01/16/podman-release-v1.0.0">Podman 1.0 released</a></strong>
<br>January 16, 2019: Podman 1.0.0 was released as a daemonless container engine and Docker alternative.
</div>

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://www.theregister.com/2019/08/20/ruby_gem_hacked/">rest-client RubyGem compromised</a></strong>
<br>August 19, 2019: RubyGems.org account was compromised via credential stuffing, leading to malicious rest-client v1.6.13 being published to steal credentials.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://bundler.io/blog/2019/01/03/announcing-bundler-2.html">Bundler 2.0 released</a></strong>
<br>January 3, 2019: Bundler 2.0 was released, removing support for end-of-life versions of Ruby and RubyGems.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://en.wikipedia.org/wiki/Homebrew_(package_manager)">Homebrew 2.0 released</a></strong>
<br>February 2, 2019: Homebrew 2.0.0 was released with improved Linux support.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://github.com/mamba-org/mamba">mamba released</a></strong>
<br>March 2019: Wolf Vollprecht released the first alpha of mamba, a fast reimplementation of conda using C++ and libsolv.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://github.blog/2019-05-10-introducing-github-package-registry/">GitHub Package Registry launched</a></strong>
<br>May 10, 2019: GitHub introduced Package Registry supporting npm, Maven, RubyGems, NuGet, and Docker.
</div>

<div class="timeline-event">
<span class="event-type type-rename">Rename</span>
<strong><a href="https://github.blog/changelog/2019-11-13-github-package-registry-is-now-github-packages/">GitHub Package Registry renamed</a></strong>
<br>November 13, 2019: GitHub Package Registry was renamed to GitHub Packages.
</div>

<hr>

## 2020

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://yarnpkg.com/blog/release/2.0">Yarn 2 (Berry) released</a></strong>
<br>January 25, 2020: Yarn 2.0 "Berry" was released with a complete rewrite in TypeScript and Plug'n'Play installation strategy.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://blog.packagist.com/composer-2-0-is-now-available/">Composer 2.0 released</a></strong>
<br>October 24, 2020: Composer 2.0 was released with significant performance improvements and parallel downloads.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Deno_(software)">Deno 1.0 released</a></strong>
<br>May 13, 2020: Ryan Dahl released Deno 1.0, a JavaScript/TypeScript runtime with built-in package management.
</div>

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a">SolarWinds supply chain attack</a></strong>
<br>December 2020: Discovery of the SolarWinds Orion platform compromise, where attackers injected malicious code into software updates beginning March 2020, affecting ~18,000 customers.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Windows_Package_Manager">Windows Package Manager preview</a></strong>
<br>May 19, 2020: Microsoft released Windows Package Manager (winget) in preview at Build developer conference.
</div>

<hr>

## 2021

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://brew.sh/2021/02/05/homebrew-3.0.0/">Homebrew 3.0 released</a></strong>
<br>February 5, 2021: Homebrew 3.0.0 was released with official Apple Silicon support and a new bottle format.
</div>

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://www.cisa.gov/news-events/alerts/2021/04/30/codecov-releases-new-detections-supply-chain-compromise">Codecov Bash Uploader compromise</a></strong>
<br>April 15, 2021: Codecov disclosed that attackers modified their Bash Uploader script from January 31 to April 1, exfiltrating environment variables from ~23,000 customers' CI environments.
</div>

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://www.theregister.com/2021/10/25/in_brief_security/">ua-parser-js hijacked</a></strong>
<br>October 22, 2021: The ua-parser-js npm package (8M weekly downloads) was hijacked via account takeover, with malicious versions published containing cryptocurrency miners and password stealers.
</div>

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://www.theregister.com/2021/12/10/log4j_remote_code_execution_vuln_patch_issued/">Log4Shell vulnerability disclosed</a></strong>
<br>December 9, 2021: Critical remote code execution vulnerability CVE-2021-44228 disclosed in Apache Log4j (distributed via Maven Central), affecting millions of Java applications worldwide.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://www.ghacks.net/2021/05/27/windows-package-manager-1-0-final-is-out/">Windows Package Manager 1.0 released</a></strong>
<br>May 27, 2021: Microsoft released version 1.0 of Windows Package Manager (winget) at Build 2021, the first stable version after a year in preview.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://yarnpkg.com/blog/release/3.0">Yarn 3.0 released</a></strong>
<br>July 26, 2021: Yarn 3.0 was released with ESBuild integration and improved performance.
</div>

<hr>

## 2022

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://www.theregister.com/2022/01/10/npm_fakerjs_colorsjs/">colors and faker sabotaged</a></strong>
<br>January 9, 2022: Developer Marak Squires intentionally sabotaged his own widely-used npm packages colors.js (23M weekly downloads) and faker.js (2.4M weekly downloads) in protest over lack of compensation.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://discuss.python.org/t/hatch-1-0-0-is-available/15359">Hatch 1.0 released</a></strong>
<br>April 2022: Ofek Lev released Hatch 1.0.0, completing a multi-year rewrite of the Python project manager.
</div>

<div class="timeline-event">
<span class="event-type type-incident">Incident</span>
<strong><a href="https://www.theregister.com/2022/05/24/pypi_ctx_package_compromised/">PyPI ctx package compromised</a></strong>
<br>May 24, 2022: The ctx package on PyPI was hijacked after an expired domain was re-registered, allowing attackers to upload malicious code that exfiltrated environment variables to ~27,000 downloads.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://en.wikipedia.org/wiki/Bun_(software)">Bun beta released</a></strong>
<br>July 12, 2022: Jarred Sumner released Bun beta, an all-in-one JavaScript runtime with built-in package manager.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://github.blog/changelog/2022-10-24-npm-v9-0-0-released/">npm 9.0 released</a></strong>
<br>October 19, 2022: npm 9.0.0 was released to standardize defaults and clean up legacy configurations.
</div>

<hr>

## 2023

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://brew.sh/2023/02/16/homebrew-4.0.0/">Homebrew 4.0 released</a></strong>
<br>February 16, 2023: Homebrew 4.0.0 was released with faster tap updates via JSON downloads instead of Git clones.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://github.com/pnpm/pnpm/releases">pnpm 8.0 released</a></strong>
<br>March 27, 2023: pnpm 8.0.0 was released with performance improvements and new features.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://blog.chocolatey.org/2023/05/announcing-chocolatey-products-2-and-6/">Chocolatey 2.0 released</a></strong>
<br>May 31, 2023: Chocolatey CLI 2.0.0 was released with NuGet v3 feed support and .NET 4.8.
</div>

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://github.com/prefix-dev/pixi">pixi launched</a></strong>
<br>August 16, 2023: prefix.dev launched pixi, a cross-platform package manager built on the conda ecosystem.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://bun.sh/blog/bun-v1.0">Bun 1.0 released</a></strong>
<br>September 8, 2023: Bun 1.0 was released, the first stable version of the JavaScript runtime with built-in package manager.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://github.com/npm/cli/releases">npm 10.0 released</a></strong>
<br>October 6, 2023: npm 10.0.0 was released to standardize defaults and clean up legacy configurations.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://yarnpkg.com/blog/release/4.0">Yarn 4.0 released</a></strong>
<br>October 23, 2023: Yarn 4.0 was released after 53 release candidates with significantly improved install performance.
</div>

<hr>

## 2024

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://astral.sh/blog/uv">uv released</a></strong>
<br>February 15, 2024: Astral released uv, an extremely fast Python package installer and resolver written in Rust.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://github.com/pnpm/pnpm/releases">pnpm 9.0 released</a></strong>
<br>April 2024: pnpm 9.0.0 was released with breaking changes to the lockfile format.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://github.com/npm/cli/releases/tag/v11.0.0">npm 11.0 released</a></strong>
<br>December 16, 2024: npm 11.0.0 was released with new features and improvements.
</div>

<hr>

## 2025

<div class="timeline-event">
<span class="event-type type-creation">Creation</span>
<strong><a href="https://github.com/spinel-coop/rv">rv released</a></strong>
<br>August 26, 2025: Spinel Cooperative released rv 0.1.0, all-in-one tooling for Ruby version and dependency management, inspired by uv.
</div>

<div class="timeline-event">
<span class="event-type type-release">Major Release</span>
<strong><a href="https://brew.sh/2025/11/12/homebrew-5.0.0/">Homebrew 5.0 released</a></strong>
<br>November 12, 2025: Homebrew 5.0.0 was released with download concurrency by default and official Linux ARM64 support.
</div>

<hr>

To suggest additions or corrections, please reach out on [Mastodon](https://mastodon.social/@andrewnez) or [open a pull request](https://github.com/andrew/nesbitt.io/blob/master/_posts/2025-11-15-package-manager-timeline.md).
