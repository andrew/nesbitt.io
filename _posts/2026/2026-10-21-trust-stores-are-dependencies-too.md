---
layout: post
title: "Trust Stores Are Dependencies Too"
date: 2026-10-21 17:00 +0100
description: "26 of 29 CA bundles in critical packages contain roots Mozilla has removed."
tags:
  - security
  - package-managers
  - supply-chain
---

eMudhra generated eight of its [intermediate CA certificates](https://emudhra.we-have-a-problem.com/) incorrectly, so their private keys can be recovered from the certificates themselves. Firefox (OneCRL and CRLite) and Chrome (CRLSets) blocked the intermediates on 17 October, Apple on the 19th, and Microsoft on the 20th through Windows' automatic trust list updates. The disclosure page states that "many other clients do not consume revocation information and require software updates", and its fix table lists the packages that carry their own copy of the roots:

- certifi 2026.10.19 and pip 26.2.2
- uv 0.13.4 and pixi 0.82.1
- webpki-roots and webpki-root-certs 1.0.10, rustls-webpki 0.103.16, rustup 1.29.2
- Node.js 22.23.4, 24.22.1 and 26.12.1
- Go 1.27.3 and 1.26.10
- Composer's ca-bundle, Elixir's castore 1.0.22, Perl's Mozilla::CA 20261020
- the curl CA bundle, NSS 3.131.1, and a row of Linux distributions
- the `pip3` shipped with macOS, which uses "its own outdated copy of the roots"

Michał Górny, who maintains a large part of Gentoo's Python packaging, [traced where certifi alone ends up](https://social.treehouse.systems/@mgorny/117476539516487756). Gentoo's certifi is patched to use the system store, so system Python picks up the change when `ca-certificates` updates. Everywhere else needs its own update:

- Each virtualenv and conda environment that installs certifi has its own copy.
- pip vendors certifi, so every environment's pip needs upgrading, using the old pip to fetch the new one.
- Python vendors pip through ensurepip to bootstrap new environments, so anywhere ensurepip installs its bundled wheel you wait for a Python release, or upgrade pip after every `python -m venv`.
- Lockfiles need certifi bumped, and dependency cooldowns need an exception for it, because a cooldown on a trust store delays the fix.
- Rust tools like uv compile webpki-roots into the binary, so each one needs a rebuild and a release, and so does any container image that includes them.
- Flatpak runtimes each carry their own `ca-certificates`, and some Flatpak apps carry another copy inside that.

### Bundles in critical packages

To find the routes beyond the well-known ones, I pointed [git-pkgs/certs](https://github.com/git-pkgs/certs) at the 6,877 packages that [ecosyste.ms marks as critical](https://packages.ecosyste.ms/critical) across PyPI, npm, crates.io, Go, Maven Central, Packagist, NuGet and RubyGems. It downloads each package archive, reads every file statically, and pulls out anything that parses as an X.509 certificate. 116 of those packages contained certificates, about 1.7%, mostly test fixtures and package-signing certs. 28 of them ship something that works as a CA bundle. A separate RubyGems sample added a 29th, honeybadger, from outside the critical list. The [full results for all 29](https://gist.github.com/andrew/4ee27639efb1eb539f36e791942e6617) give each package's version and how it loads its bundle.

The real number may be higher, because the scanner reads PEM, DER, JKS and PKCS#12 and skips certificates compiled into native code, and 49 of the 50 platform-specific Python wheels in the sample contained compiled binaries outside those formats. Across the 29, the same `cacert.pem` sets the trusted roots for every TLS connection in some packages and is loaded only on request, or not at all, in others:

- Excon, pip and redshift-connector load their bundle alongside the system roots. A root removed from the OS store stays trusted, because the bundle adds it back.
- Stripe's Ruby library and httpclient on MRI build their own `OpenSSL::X509::Store` from the bundle and hand it to the connection, so a `ca-certificates` update leaves them trusting the same roots as before.
- Honeybadger, aws-sdk-v1, Guzzle 3, stripe-php and braintree_php point OpenSSL or curl at their own file by default, and a configured path overrides it. gRPC's Ruby, PHP and Python packages register their bundled roots as the default.
- botocore and the AWS CLI use their bundled file when certifi is absent. httplib2 uses its own after checking configured paths, and two of Google's Java clients fall back to a bundled keystore when the Java installation store is missing. Whether a given deployment hits the fallback depends on what else is installed there.
- aws-sdk-core uses system roots by default and switches to its bundle when you call `Aws.use_bundled_cert!`, and gocertifi, Composer's ca-bundle and ioredis's RedisCloud profile likewise take effect only when code selects them. nap uses its bundled file once the caller turns on certificate verification.
- libv8 carries a bundle inside its vendored copy of depot_tools, and App Engine's API stubs use theirs for the local development server. virtualenv's embedded pip wheels each contain a certifi. These ship to every install and are separate from an application's own HTTPS requests, except that virtualenv installs its wheels as the pip in each environment it creates.

### Removed roots

Matching the certificate sets against historical Mozilla releases dates honeybadger's bundle to 2011 and httpclient's to 2014 or 2015. Both gems are maintained: httpclient 2.9.0 came out in February 2025 and honeybadger 6.9.3 in September 2026, and both releases still ship those bundles.

Algoliasearch, aws-sdk-v1 (last released in April 2017) and Guzzle 3 (whose repository is archived) still contain StartCom roots that Mozilla [removed in Firefox 58](https://blog.mozilla.org/security/2017/08/30/removing-disabled-wosign-startcom-certificates-firefox-58/) in 2017, and those roots stay valid until 2036 and 2039. 26 of the 29 bundle packages contain at least one root that Mozilla has removed from its programme and that is still inside its validity period. Matching exact fingerprints against [CCADB's records](https://ccadb.my.salesforce-sites.com/ccadb/AllCertificateRecordsCSVFormatV5) gives 95 such roots across those packages.

eMudhra issued the compromised intermediates from its emSign Root TLS CA - G3, which emSign ECC Root CA - G3 cross-signs. Root TLS CA - G3 itself is in none of the scanned bundles, so the cross-signing root is the one that matters here. Sectigo also cross-signed each intermediate from its AAA Certificate Services root, a 2004 Comodo certificate valid until 2028. A client that uses a bundle containing emSign ECC Root CA - G3 or AAA Certificate Services as its trust anchors, and skips revocation checks, will accept a chain running from a leaf through a compromised intermediate to that root, because the attacker supplies the intermediates in the TLS handshake.

Mozilla removed emSign ECC Root CA - G3 in response to the incident, as its [20 October notice](https://groups.google.com/a/mozilla.org/g/dev-tech-crypto/c/vSxZxnOMMvs) records, so it is one of the 95. The root is in ten of the packages I scanned: Excon, Stripe's Ruby and PHP libraries, gRPC for Ruby, PHP and Python, Composer's ca-bundle, gocertifi, App Engine's API stubs and virtualenv. certifi carried it through 2026.7.22 and dropped it in 2026.10.18, a day before the 2026.10.19 release in the fix table, and a lockfile pinned to 2026.7.22 or another release that included it still installs it.

Mozilla ended AAA's TLS trust in 2025, and certifi dropped it in [2025.4.26](https://pypi.org/project/certifi/2025.4.26/). It isn't among the 95 above, which only counts certificates Mozilla removed from its programme outright. It's still in 17 of the packages I scanned, including honeybadger, httpclient, aws-sdk-v1, Guzzle 3, algoliasearch, nap, gocertifi, httplib2 and botocore's fallback. Honeybadger, httpclient on MRI, aws-sdk-v1 and Guzzle 3 use that file as the trust anchor by default, and algoliasearch adds it to an existing store, while the other twelve use it as a fallback or when code selects it.

pip 26.2.2 vendors certifi 2026.10.19, which contains neither root. botocore [merged a fix](https://github.com/boto/botocore/pull/3838) removing AAA from its fallback bundle on 20 October, but the latest botocore release still ships it. AWS [updated aws-sdk-core's 2018 bundle](https://github.com/aws/aws-sdk-ruby/pull/3461) the same day [the issue](https://github.com/aws/aws-sdk-ruby/issues/3460) was reported and Excon [replaced its bundle](https://github.com/excon/excon/pull/925) in 1.8.0, released on 21 October, while gRPC's [backport](https://github.com/grpc/grpc/pull/43700) is still open.

### Package metadata

Finding all of this took downloading and parsing every file in nearly seven thousand archives, because the only record of a bundled trust store is the file itself. The manifest, lockfile and SBOM for an app using httpclient record `httpclient 2.9.0`, a checksum, and `pkg:gem/httpclient@2.9.0`. What the app depends on for TLS is Mozilla's root list as it stood in 2014, and those documents record it only as httpclient's name and version. When a root gets pulled, vulnerability scanners and dependency bots downstream match on those names and versions, so a search for "contains AAA Certificate Services" has to start from archive contents.

Vlad Miricioiu describes the same gap for compiled code in [Binary Dependencies: Identifying the Hidden Packages We All Depend On](https://vlad.website/binary-dependencies-identifying-the-hidden-packages-we-all-depend-on/). A Python wheel that bundles a precompiled C library depends on that library, "even though these dependency relationships are invisible to us", because the wheel's metadata lists only its Python dependencies. A CA bundle is what he calls a phantom binary dependency, with a PEM file in place of a `.so`. It's third-party data, maintained upstream by Mozilla's root programme on its own release schedule, copied into a package by hand at some point and then carried forward through every release after.

When an application depends on certifi directly, its lockfile names certifi and a version, and tools can track it. pip vendors certifi and records the version in `src/pip/_vendor/vendor.txt`, but that file is a convention of pip's source repository, and the installed wheel's metadata lists pip alone. webpki-roots shows up in uv's `Cargo.lock`, but the uv binary you install from PyPI or Homebrew ships as a single executable with the roots compiled in and the lockfile left behind.

A file called `cacert.pem` inside a gem appears only in the archive's file listing, and finding out which roots it holds means parsing it. Few registry schemas have a field for "this package vendors a copy of X at version Y". Debian's [`Built-Using`](https://www.debian.org/doc/debian-policy/ch-relationships.html#additional-source-packages-used-to-build-the-binary-built-using) field records statically linked sources, and CycloneDX's [`pedigree`](https://cyclonedx.org/docs/1.6/json/#components_items_pedigree) records where a component's contents came from. The generators that produce most SBOMs build from lockfiles, so httpclient's entry records `httpclient 2.9.0` and omits the 2014 root list inside it.
