---
layout: post
title: "Supply Chain Security Tools for Ruby"
date: 2025-12-14
description: "Ruby implementations of PURL, vers, SBOM, and SWHID specs."
tags:
  - ruby
  - security
  - sbom
  - package-managers
---

I've published four Ruby gems that work together to help people build supply chain security tools: [purl](https://github.com/andrew/purl), [vers](https://github.com/andrew/vers), [sbom](https://github.com/andrew/sbom), and [swhid](https://github.com/andrew/swhid). They handle the specs that security tooling depends on.

I built these for [Ecosyste.ms](https://ecosyste.ms), which tracks dependencies across package registries. We deal with a lot of cross-ecosystem data: vulnerability reports that reference packages by PURL, version ranges from security advisories, SBOMs from various sources. If you're building security scanners, registry tooling, or compliance pipelines in Ruby, these might be useful.

Most tooling in this space is written in Java, Python, or Go. Ruby has [cyclonedx-ruby-gem](https://github.com/CycloneDX/cyclonedx-ruby-gem) for generating SBOMs and [packageurl-ruby](https://github.com/package-url/packageurl-ruby) for PURL parsing.

### [purl](https://github.com/andrew/purl)

Package URL is a standardized format for identifying software packages across ecosystems. Instead of saying "the requests package version 2.28.0 from PyPI," you write `pkg:pypi/requests@2.28.0`. The format handles the variations between registries:

- `pkg:npm/%40babel/core@7.24.0` (npm scoped package)
- `pkg:maven/org.apache.logging.log4j/log4j-core@2.17.1` (Maven with group ID)
- `pkg:docker/library/nginx@1.25.0` (Docker image)
- `pkg:gem/rails@7.1.0` (RubyGems)
- `pkg:github/rails/rails@v7.1.0` (GitHub repo at a tag)

It's used in SPDX, CycloneDX, and most security tooling. PURL recently became [ECMA-427](https://ecma-international.org/publications-and-standards/standards/ecma-427/).

The gem parses and generates these identifiers, with type-specific validation for ecosystems like conan, cran, and swift. Use it as a library:

```ruby
purl = Purl.parse("pkg:gem/rails@7.0.0")
purl.type    # => "gem"
purl.name    # => "rails"
purl.version # => "7.0.0"
```

Or from the command line. The CLI integrates with Ecosyste.ms for looking up package metadata and security advisories:

```
$ purl advisories pkg:npm/lodash@4.17.19
```

It also generates registry URLs for most package ecosystems.

### [vers](https://github.com/andrew/vers)

Vers is the version range specification that accompanies PURL. Vulnerability databases need to express "this CVE affects versions 1.0 through 1.4.2, and also 2.0.0-beta." Different ecosystems have incompatible range syntaxes: npm uses `>=1.0.0 <1.4.3`, Ruby uses `>= 1.0, < 1.4.3`, Python uses `>=1.0,<1.4.3`. If you're building cross-ecosystem tooling, you need one syntax to normalize everything to. Vers provides that:

- `vers:gem/>=2.0.0|<2.7.2` (Ruby versions 2.0.0 up to but not including 2.7.2)
- `vers:npm/>=1.0.0|<1.4.3|>=2.0.0|<2.1.0` (two separate ranges)
- `vers:pypi/>=0|<1.2.3` (all versions before 1.2.3)
- `vers:maven/>=1.0|<=1.5|!=1.3` (1.0 through 1.5, excluding 1.3)

```ruby
range = Vers.parse("vers:npm/>=1.2.3|<2.0.0")
range.contains?("1.5.0") # => true
range.contains?("2.1.0") # => false
```

The gem parses these ranges and checks whether a given version falls within them. Internally it uses a mathematical interval model inspired by a [presentation from Open Source Summit NA 2025](https://www.youtube.com/watch?v=EU-TodN27rM) ([slides](https://static.sched.com/hosted_files/ossna2025/74/We%20need%20a%20standard%20for%20open%20source%20package%20requirements.pdf)) by Eve Martin-Jones and Elitsa Bankova. It's also a redo of [semantic_range](https://github.com/librariesio/semantic_range), a library I wrote 10 years ago for Libraries.io that handled version ranges across multiple ecosystems.

### [sbom](https://github.com/andrew/sbom)

There are two main Software Bill of Materials formats: SPDX and CycloneDX. [Of course there are two](https://xkcd.com/927/). SPDX comes from the Linux Foundation and started as a license compliance format. CycloneDX comes from OWASP and started as a security format. Both now try to do everything.

The gem parses, generates, and validates both. SPDX 2.2 and 2.3 in JSON, YAML, XML, RDF, and tag-value. CycloneDX 1.4 through 1.7 in JSON and XML. It auto-detects formats when parsing and validates against the official schemas.

```ruby
sbom = Sbom.parse_file("example.spdx.json")
sbom.packages.each do |pkg|
  puts "#{pkg.name} @ #{pkg.version}"
end
```

The CLI handles parsing, validation, format conversion, and enrichment:

```
$ sbom validate example.cdx.json
$ sbom convert example.cdx.json --type spdx --output example.spdx.json
$ sbom enrich example.cdx.json
```

The enrich command pulls metadata from Ecosyste.ms: descriptions, homepages, licenses, repository URLs, and security advisories.

### [swhid](https://github.com/andrew/swhid)

SoftWare Hash IDentifiers are content-based hashes for software artifacts: files, directories, commits, releases, and snapshots. They originated from [Software Heritage](https://www.softwareheritage.org/), the archive that's preserving all publicly available source code. They're intrinsic identifiers, meaning the same content always produces the same SWHID regardless of where it lives. The spec is now ISO/IEC 18670:2025.

```ruby
swhid = Swhid.parse("swh:1:cnt:94a9ed024d3859793618152ea559a168bbcbb5e2")
swhid.object_type # => "cnt"

Swhid.from_content(File.read("file.txt"))
```

The CLI generates SWHIDs from files, directories, or git objects:

```
$ swhid content < file.txt
$ swhid directory /path/to/project
$ swhid revision /path/to/repo HEAD
```

---

These gems provide Ruby implementations of specs that show up repeatedly in supply chain security work: package identifiers, version ranges, SBOM formats, and content hashes. They're designed to be used as libraries or CLI tools, and to behave predictably across ecosystems.

They were built to support Ecosyste.ms and are used there in production. If you're working with dependency metadata in Ruby, they handle the spec compliance so you don't have to. With the CRA coming into full effect in 2027, you'll probably hear more about SBOMs and supply chain security in the coming years.