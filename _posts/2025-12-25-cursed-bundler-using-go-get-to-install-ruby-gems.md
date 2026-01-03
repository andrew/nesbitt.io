---
layout: post
title: "Cursed Bundler: Using go get to install Ruby Gems"
date: 2025-12-25 12:00 +0000
description: "Go's module system accidentally created a universal, content-addressed, transparency-logged package CDN. You could abuse this for any language."
tags:
  - package-managers
  - go
  - ruby
---

Here's a thought experiment. What if Ruby had `require "github.com/rails/rails"` and you used `go get` to fetch it? Set GOPATH to a Ruby load path, and Go's module fetcher becomes your transport layer. The Go team did not intend this. But it works. Consider this a gift from the Ghost of Package Managers Yet to Come.

The setup would look something like this:

```
export GOPATH=/usr/local/lib/ruby/vendor_gems
go get github.com/rack/rack@v3.1.8
```

Go fetches the module, and now you have:

```
/usr/local/lib/ruby/vendor_gems/pkg/mod/
  github.com/
    rack/
      rack@v3.1.8/
        lib/
          rack.rb
          rack/
            request.rb
            response.rb
            ...
```

Build your load path from the lockfile:

```
RUBYLIB=/usr/local/lib/ruby/vendor_gems/pkg/mod/github.com/rack/rack@v3.1.8/lib
```

Now `require "rack"` just works. Ruby doesn't care how the files got there. The version resolution happened once, when you built the load path. And because each version lives in its own directory on disk, multiple versions coexist without conflict. Go's filesystem layout handles what Ruby's load path never did gracefully.

### Self-describing paths

Go's import path convention makes this possible. When you write `import "github.com/foo/bar"`, Go doesn't look up "bar" in some central index. The path itself contains everything needed to find the code: the hosting domain, the org, the repo. It's self-describing. Compare this to `gem install foo`, where "foo" is a magic string that only means something if you know to ask [rubygems.org](https://rubygems.org/). Without the registry, "foo" is just noise.

This decentralisation is unusual in package management. Most systems work the other way: short names resolve through a central index. npm's `lodash` is meaningless without npmjs.com. PyPI's `requests` is meaningless without pypi.org. Central indexes come with social costs too: governance, trust, gatekeeping, decisions about who gets to publish what. Go's approach embeds the registry into the import path itself. You can host your own modules anywhere, and the path tells clients exactly where to find them.

### The proxy and the sumdb

Now here's where it gets interesting. Go doesn't just fetch code from GitHub directly. It goes through [proxy.golang.org](https://proxy.golang.org/), a caching proxy run by Google that mirrors every public Go module. And every module version gets an entry in [sum.golang.org](https://sum.golang.org/), a transparency log that records cryptographic hashes of module contents. First fetch wins: once a hash is logged, it's permanent. This matters because a compromised maintainer can't silently replace a version. If they try, the hash won't match and every Go client will refuse the download. Anyone can audit the log for tampering. The security properties are genuinely good.

When you run `go get github.com/rack/rack@v3.1.8`, here's what actually happens:

```
1. Ask proxy.golang.org for github.com/rack/rack@v3.1.8
2. Proxy checks its cache, or fetches from GitHub
3. Proxy returns a zip file of the module contents
4. Go computes SHA-256 hash of the zip
5. Ask sum.golang.org: "what's the hash for this module?"
6. If first fetch ever: sumdb records the hash permanently
7. If seen before: verify hash matches the logged one
8. Unzip to $GOPATH/pkg/mod/github.com/rack/rack@v3.1.8/
```

Your Ruby gem just got the same integrity guarantees as a Go module. The hash is in a Merkle tree. It's auditable. It's permanent.

What does the proxy actually check? Not much. It would like a go.mod file in the repo, but versions come from git tags. The go.mod doesn't even need to be valid Go. Run `go mod init github.com/you/your-gem` in your Ruby project, push, and you're done. The sumdb hashes whatever zip file it receives. It doesn't parse Go code. It doesn't verify that the module contains valid Go packages. It just slurps up the zip and logs the hash.

People already abuse this. You'll find protobuf definitions hosted as Go modules, with no Go code at all. JSON schemas. Terraform modules. Random data files. As long as there's a go.mod at the root, proxy.golang.org will cache it and sum.golang.org will log it. The Go infrastructure doesn't care what's inside.

So: put a go.mod in your Ruby gem's repo. Push a tag. Run `go get`. Your gem is now cached forever in Google's infrastructure, with a cryptographic hash in a tamper-evident transparency log. You've achieved better supply chain integrity than actual RubyGems by pretending your gems are Go modules. RubyGems doesn't have a transparency log. sum.golang.org does. And you've quietly sidestepped rubygems.org entirely.

To make this a real package manager, you'd need recursion. Parse the gemspec, find dependencies, `go get` those too. You're one SAT solver away from reinventing [Bundler](https://bundler.io/) with Go as the transport layer. The dependency resolution logic doesn't change. Only the fetching does.

```
# Hypothetical go-bundler
1. go get github.com/rack/rack@v3.1.8
2. Parse rack.gemspec, find: depends on "github.com/rack/rack-session"
3. go get github.com/rack/rack-session@v2.1.0
4. Parse rack-session.gemspec, find: depends on "github.com/rack/rack"
5. Already have rack, skip
6. Write go.sum (it's a lockfile now)
```

The dependency graph is the same graph Bundler would compute. You've just outsourced the fetching and integrity checking to Google.

One difference: Go uses [Minimal Version Selection](https://research.swtch.com/vgo-mvs). If you require v1.2.0, you get v1.2.0, not the latest. This makes go.sum almost an afterthought. Bundler and most package managers prefer the newest matching version, which means [Gemfile.lock](https://bundler.io/guides/rationale.html) is load-bearing. Without it, you get whatever's latest today, which might not be what you tested against yesterday. Go's approach trades "always up to date" for "boringly predictable." If you actually built this, you might find yourself adopting MVS too. It's simpler than SAT solving and doesn't need backtracking. Faster, more deterministic, but more restrictive.

There are some cursed details. Go has case-folding escapes because macOS and Windows treat `A` and `a` as the same file. A repo named `BurntSushi/toml` becomes `!burnt!sushi/toml` on disk. If you're building Ruby tooling on top of this, you inherit Go's filesystem workarounds whether you want them or not. Your `require` statements would get weird.

Native extensions are where this falls apart. Go expects source or pre-compiled binaries. Ruby gems often need to run `make` to compile C code. Pure Ruby gems work fine; anything with native code doesn't.

### Trade-offs

Why hasn't anyone done this for real? Partly because it's absurd. But also because the Go import style has real trade-offs, and most language communities decided they weren't worth it.

Deno tried URL imports. `import { serve } from "https://deno.land/std/http/server.ts"` looks a lot like Go imports. It has the same self-describing property: the URL tells you exactly where the code lives. No central registry required. It also has the same problems: verbose paths, no human-friendly short names, squatting is hard because you'd need to squat the domain. Deno eventually [retreated to JSR](https://deno.com/blog/http-imports), a more traditional registry with short names.

The trade-offs stack up differently depending on what you value:

Self-describing paths mean no registry lookup, but they're long and ugly. `require "github.com/rails/rails"` is worse than `require "rails"` if you're typing it by hand. Decentralisation means no single point of failure, but also no single point of governance. Who removes malware from GitHub? Central registries can act on abuse reports. Git hosting is a different trust model.

Short names are ergonomic but enable squatting. Anyone can register `request` on npm and hope you typo `requests`. Domain-based paths are squatting-resistant because you'd need to actually control the domain. But they're verbose, and nobody wants to type `require "github.com/psf/requests"` in every Python file.

Go's approach works for Go because Go chose it from the start and the community built around it. Retrofitting it onto Ruby or Python or JavaScript would require changing how everyone writes import statements. The tooling works. The migration doesn't.

Still, the underlying idea is sound. What if every package manager shared a content-addressed, transparency-logged, globally-cached distribution layer? You wouldn't need to pretend your gems are Go modules. You'd just have the same infrastructure available natively. The costs of running a reliable package CDN are substantial.

In the meantime, Go's module system sits there, accidentally universal, logging hashes of whatever you throw at it. The FOSDEM talk writes itself: "We achieved cryptographic supply chain integrity for Ruby by pretending all gems were Go modules. The Go team was confused about why their sumdb was full of .rb files."

Nobody should actually do this. I couldn't resist anyway: [go-bundler](https://github.com/andrew/go-bundler) is a proof of concept. But it reveals something interesting about package management design.

This thought experiment is part of a larger question I've been exploring: [what are the fundamental components of a package manager](/2025/12/02/what-is-a-package-manager), and which ones could be shared across ecosystems? Most people think of package managers as monolithic, but they're really several systems bolted together:

- **Naming** - how you refer to packages
- **Discovery** - finding what exists
- **Resolution** - solving the version constraint problem
- **Transport** - fetching bits
- **Integrity** - verifying you got what you expected
- **Installation** - putting files where they need to go

Go made unusual choices at naming, transport, and integrity that happen to be language-agnostic. That's what makes the Ruby hack possible. It hints at infrastructure we maybe should have built intentionally. Go built an anonymous, transparency-logged package proxy with minimal governance, then let anyone use it for free.

Somewhere in Mountain View, a Go module proxy is serving a zip file full of Ruby code, hashing it into a Merkle tree, and wondering what it did to deserve this.
