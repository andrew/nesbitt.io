---
layout: post
title: "Typosquatting in Package Managers"
date: 2025-12-17
description: "A reference guide to typosquatting techniques, real-world examples, and detection tools."
tags:
  - security
  - package-managers
---

Typosquatting is registering a package name that looks like a popular one, hoping developers mistype or copy-paste the wrong thing. It's been a supply chain attack vector since at least 2016, when Nikolai Tschacher [demonstrated](https://incolumitas.com/2016/06/08/typosquatting-package-managers/) that uploading malicious packages with slightly misspelled names could infect thousands of hosts within days. His bachelor thesis experiment infected over 17,000 machines across PyPI, npm, and RubyGems, with half running his code as administrator.

The attack surface is straightforward: package managers accept whatever name you type. If you run `pip install reqeusts` instead of `pip install requests`, and someone has registered `reqeusts`, you get their code. The typo can come from your fingers, from a tutorial you copied, or from an LLM hallucination ([slopsquatting](/2025/12/10/slopsquatting-meets-dependency-confusion.html)).

### Generation techniques

There's a taxonomy of ways to generate plausible typosquats:

**Omission** drops a single character. `requests` becomes `reqests`, `requsts`, `rquests`. These catch fast typists who miss keys or developers working from memory.

**Repetition** doubles a character. `requests` becomes `rrequests` or `requestss`. Easy to type accidentally, especially on phone keyboards.

**Transposition** swaps adjacent characters. `requests` becomes `reqeusts` or `requsets`. This is probably the most common typing error.

**Replacement** substitutes adjacent keyboard characters. `requests` becomes `requezts` (z is next to s) or `requewts` (w is next to e). Varies by keyboard layout.

**Addition** inserts characters at the start or end (not mid-string). `requests` becomes `arequests` or `requestsa`. Catches stray keypresses before or after the name.

**[Homoglyph](https://en.wikipedia.org/wiki/Homoglyph)** uses lookalike characters. `requests` becomes `reque5ts` (5 looks like s) or `requεsts` (Greek epsilon looks like e). In many fonts, `l` (lowercase L), `1` (one), and `I` (uppercase i) are nearly identical. The string `Iodash` (starting with uppercase i) displays identically to `lodash` (starting with lowercase L) in most terminals.

**Delimiter** changes separators between words. `my-package` becomes `my_package` or `mypackage`. Different registries normalize these differently: PyPI treats `my-package`, `my_package`, and `my.package` as equivalent, but npm doesn't.

**Word order** rearranges compound names. `python-nmap` becomes `nmap-python`. Both sound reasonable, and developers might guess wrong.

**Plural** adds or removes trailing s. `request` versus `requests`. Both get registered, and tutorials using the wrong one send traffic to the wrong package.

**[Combosquatting](https://en.wikipedia.org/wiki/Combosquatting)** adds common suffixes. `lodash` becomes `lodash-js`, `lodash-utils`, or `lodash-core`. These piggyback on brand recognition while looking like official extensions.

Less common techniques include **vowel swaps** (`requests` to `raquests`), **[bitsquatting](https://en.wikipedia.org/wiki/Bitsquatting)** (single-bit memory errors that change `google` to `coogle`), and **adjacent insertion** (inserting a key next to one you pressed, like `googhle`).

### Examples from the wild

I've been collecting confirmed typosquats into a [dataset](https://github.com/ecosyste-ms/typosquatting-dataset). It currently has 143 entries across PyPI, npm, crates.io, Go, and GitHub Actions, drawn from security research by OpenSSF, Datadog, IQTLabs, and others.

The existing malicious package databases are large. OpenSSF's [malicious-packages](https://github.com/ossf/malicious-packages) repo has thousands of entries. Datadog's dataset has over 17,000. But most entries just list the malicious package name without identifying what it was targeting. A package called `reqeusts` is obviously squatting `requests`, but `beautifulsoup-numpy` could be targeting either library, and names like `payments-core` require context to understand. The dataset I built maps each malicious package to its intended target and classifies which technique was used. Inclusion requires a clear target: if I can't confidently say what package the attacker was imitating, it doesn't go in. That mapping is what you need to test detection tools: you can't measure recall without knowing what the attacks were trying to hit.

The `requests` library on PyPI has been targeted more than any other package. The dataset includes `reqeusts`, `requets`, `rquests`, `requezts`, `requeats`, `arequests`, `requestss`, `rrequests`, `reque5ts`, `raquests`, and `requists`.

BeautifulSoup has `beautifulsup4` (omission), `BeautifulSoop` (replacement), `BeaotifulSoup` (transposition), and `beautifulsoup-requests` (combosquatting). The variations in capitalization are intentional: PyPI normalizes case, so attackers don't need to match it exactly.

The `crossenv` npm attack from 2017 exploited delimiter confusion with `cross-env`, a popular build tool. Same words, different punctuation. [Over 700 affected hosts](https://www.bleepingcomputer.com/news/security/javascript-packages-caught-stealing-environment-variables/) downloaded the malicious version before it was caught.

Some attacks are creative. The packages `--legacy-peer-deps` and `--no-audit` on npm squat on CLI flag names. If someone copies `npm install example--hierarchical` from a tutorial with a missing space, npm parses `--hierarchical` as a package name to install rather than a flag.

GitHub Actions has its own variant. Orca Security [demonstrated](https://orca.security/resources/blog/typosquatting-in-github-actions/) attacks on workflow files by registering organizations like `actons`, `action`, and `circelci`. They found 158 repositories already referencing a malicious `action` org before they reported it.

Typosquatting also shows up in package metadata. A package's homepage or repository URL might point to a typosquatted domain, accidentally or deliberately. A maintainer who fat-fingers `githb.com` in their gemspec creates a link to someone else's server. An attacker who controls that domain gets traffic from anyone who clicks through from the registry page.

### Detection tools

I've built a [Ruby gem](https://github.com/andrew/typosquatting) that generates typosquat variants and checks if they exist on registries. It supports PyPI, npm, RubyGems, Cargo, Go, Maven, NuGet, Composer, Hex, Pub, and GitHub Actions.

Generate variants for a package name:

```bash
typosquatting generate requests -e pypi
```

Check which variants actually exist:

```bash
typosquatting check lodash -e npm --existing-only
```

This queries the [ecosyste.ms](https://packages.ecosyste.ms) package names API. For `lodash`, it finds `lodas`, `lodah`, and `1odash` already registered.

Scan an SBOM for potential typosquats in your dependencies:

```bash
typosquatting sbom bom.json
```

Check for dependency confusion risks on a package name:

```bash
typosquatting confusion my-internal-package -e npm
```

Other tools: the Rust Foundation maintains [typomania](https://github.com/rustfoundation/typomania), which powers crates.io's typosquatting detection. IQTLabs built [pypi-scan](https://github.com/IQTLabs/pypi-scan) for PyPI (now archived). [typogard](https://github.com/mt3443/typogard) checks npm packages and their transitive dependencies.

SpellBound, a [USENIX paper from 2020](https://arxiv.org/abs/2003.03471), combined lexical similarity with download counts to flag packages that look like popular ones but have suspicious usage patterns. It achieved a 0.5% false positive rate and caught a real npm typosquat during evaluation.

The harder problem is preventing typosquats at registration time. PyPI [discussed](https://github.com/pypi/warehouse/issues/9527) implementing "social distancing" rules that would block names too similar to popular packages. The analysis found that 18 of 40 historical typosquats had a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) of 2 or less from their targets, meaning one or two edits (a dropped letter, a swapped pair) was enough to create the attack name. Edit distance alone misses homoglyphs and keyboard-adjacent replacements, which is why detection tools need multiple techniques. But false positives are politically difficult: blocking `request` because `requests` exists would annoy legitimate package authors.

### The friendly typosquat

Not all typosquats are malicious. Will Leinweber registered the gem [bundle](https://rubygems.org/gems/bundle) back in 2011. If you accidentally type `gem install bundle` instead of `gem install bundler`, you get a package that does one thing: depend on bundler. The description says "You really mean `gem install bundler`. It's okay. I'll fix it for you this one last time..."

It has 8 million downloads. That's 8 million typos caught and redirected to the right place. Defensive squatting like this is a public service.
