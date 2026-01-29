---
layout: post
title: "Will AI Make Package Managers Redundant?"
date: 2026-01-30 10:00 +0000
description: "Following the prompt registry idea to its logical conclusion."
tags:
  - package-managers
  - ai
  - deep-dive
---

A [recent post by Marcelo Emmerich](https://medium.com/@marcelo.emmerich/the-package-manager-of-the-future-95408980478f) proposes replacing package managers with a "prompt registry." Instead of publishing code, library authors would publish AI prompts. Developers paste the prompt into their AI tool, which generates a self-contained implementation on the spot. No transitive dependencies, no supply chain attacks, no version conflicts. The code is generated fresh each time, tailored to your language and project.

It's a naive vision, but it points at real problems. Supply chain attacks are serious. Transitive dependency trees are genuinely hard to reason about. The appeal of generating exactly what you need, with nothing extra, is obvious.

The generated code still has to implement TLS, parse JSON, handle Unicode. The complexity doesn't vanish because you stopped calling it a dependency; it just moves elsewhere. But I love going down a rabbit hole, so let's see where this leads.

### Down the rabbit hole

Suppose you're writing the prompt for an HTTP client library. The prompt needs to describe the behavior precisely enough that the AI generates something correct. Not just the happy path. You need to specify connection pooling, redirect handling, timeout behavior, retry logic, TLS certificate verification, proxy support. Each of those has edge cases that vary across operating systems, architectures and runtime versions.

So you write tests. The prompt needs to come with a test suite, or at least a prompt that generates a test suite, because otherwise you have no way to know whether the generated code actually works. Those tests need to cover the matrix of platforms and runtimes. An HTTP client that works on Linux x86 with Python 3.12 but silently drops headers on macOS ARM with Python 3.10 isn't a working HTTP client. And the model itself is another axis in the matrix: GPT-4o might generate correct TLS handling where Claude produces a subtle bug, or vice versa, or the same model might produce different code after a provider updates it. You'd need to re-run your test suite every time a model version changes. By the time you've written a prompt detailed enough to specify all this behavior, plus a test generation prompt thorough enough to verify it, you've likely produced something larger than the library you were trying to replace.

Now the prompt author improves the prompt. Maybe they add HTTP/2 support, or fix the connection pooling specification. Downstream users need to know about this. They need to choose when to adopt the new version. So you version the prompts. You need a way to say "I'm using v2.3 of the HTTP client prompt" and have that mean something stable. You'll want a changelog. You'll want the ability to pin to a known-good version while others test the new one.

Then you notice the test cases for an HTTP client are very similar regardless of the target language. The edge cases around TLS verification don't change just because you're generating Python instead of Go. So you extract the shared test specifications into reusable modules. Other prompt authors want to use those modules too. Now the test spec modules need their own versions, because a change to the shared TLS test suite shouldn't silently break the HTTP client prompt or the WebSocket prompt that also depends on it.

At this point the HTTP client prompt declares that it works with v1.2 to v1.x of the TLS test module, and v2.0 or higher of the connection pooling spec module. These are dependency declarations. You need a resolver to figure out which versions of these prompt modules are compatible with each other. You need a lockfile (a `Promptfile.lock`, if you will) so that everyone on the team generates from the same set of prompt versions.

The prompts themselves are getting long and repetitive. You find yourself writing the same patterns over and over: "handle timeouts by...", "verify certificates by...", "follow redirects up to N hops, preserving headers except..." You start defining shorthand. "Implements HTTP-REDIRECT-SPEC-v2" instead of spelling it out every time. Other prompt authors adopt your shorthand. Someone writes a document defining exactly what HTTP-REDIRECT-SPEC-v2 means, and now you have a specification language.

The specification language gets more precise over time, because natural language is ambiguous and different models interpret the same prompt differently. You add more structure. You define exact function signatures. You specify return types. You nail down error handling behavior with enough precision that two different models should produce interchangeable output. The specification starts looking less like English prose and more like a programming language. A formal, deterministic description of behavior that a machine can reliably execute.

At this point, you have built a package manager. You just avoid calling it one. You have versioned prompt modules, a dependency resolver, a lockfile, a specification language, and the growing realization that what you actually want is a deterministic, formally specified description of behavior that produces the same output every time. Or, to borrow [Greenspun's tenth rule](https://en.wikipedia.org/wiki/Greenspun%27s_tenth_rule):

> Any sufficiently complicated prompt registry contains an ad-hoc, informally-specified, bug-ridden, slow implementation of half of a package manager.

This assumes good faith throughout. The prompt registry would also face supply chain attacks targeted directly at LLMs and AI coding agents, from [prompt injection via package metadata](/2025/12/01/promptver.html) to [slopsquatting combined with dependency confusion](/2025/12/10/slopsquatting-meets-dependency-confusion.html).

### What packages provide

A package's value isn't primarily its implementation code. Anyone can rewrite curl in Rust in a weekend, as Daniel Stenberg has [heard many times](https://daniel.haxx.se/blog/2021/05/20/i-could-rewrite-curl/). What they can't rewrite is the twenty years of bug reports, the weird edge cases someone hit in production and took the time to fix, the arguments in issue threads that eventually settled on the right behavior. That knowledge is spread across the package's history and it grew organically. No prompt captures it.

Package names and version numbers are flags that people rally around. They're points of coordination that developers come back to later to check whether someone made an improvement. When a maintainer fixes a bug in a widely-used library, that fix flows outward through the dependency graph. Thousands of projects get the improvement by running a version update. Nobody coordinated this. The maintainer didn't know most of the downstream consumers existed. The downstream developers didn't need to understand the internals of the fix. Semver gave them a protocol for expressing "this is safe to take" without requiring explicit coordination between every pair of producer and consumer.

Michiel Buddingh wrote about the [enclosure feedback loop](https://michiel.buddingh.eu/enclosure-feedback-loop) in AI: as developers move from public forums to private AI assistants, collective knowledge gets fenced off and the commons degrades. Package ecosystems are the opposite dynamic. Knowledge flows outward through shared code, and improvements compound over time. Each independently maintained library gets better over time through bug reports, security patches, performance work and feature additions from people who actually use it in production. The improvements are unevenly distributed and sometimes messy, but they accumulate. A project with 200 dependencies is quietly benefiting from the maintenance work of hundreds of people it has no direct relationship with.

In the prompt registry world, that loop is broken. You generate your HTTP client code from a prompt. Six months later, someone discovers a subtle TLS verification bug in the pattern that prompt tends to produce. In the package manager world, the library maintainer fixes it, cuts a release, and you update. In the prompt world, your code is already generated, sitting in your repo, probably modified since then. The prompt itself might produce different code now because the underlying model has changed. You have no stable identity for what you're running and no way to diff it against what the prompt produces today. Nobody else is running your exact output, so there's no community finding bugs in the same code. Each generation is isolated.

There's something else the prompt registry assumes: that the prompt author has fully specified the behavior they want. But half the value of a mature library is behavior the author never thought to specify. It's emergent correctness from years of bug reports. Someone hit a weird proxy configuration in 2019 and filed an issue. Someone else found a race condition under high concurrency in 2021. A third person noticed that a particular header combination broke on older TLS stacks. Each of those fixes is now baked into the library. You can't prompt your way into a decade of production bug reports.

### Who governs the prompts

Package registries aren't just file hosts. They decide who owns names, how disputes resolve, what gets removed, and how compromised accounts are handled. They're [governance providers](/2025/12/22/package-registries-are-governance-as-a-service.html), making judgment calls that keep ecosystems healthy: removing malware, transferring abandoned packages, enforcing naming policies. When npm restored left-pad after Azer Koçulu unpublished it, that was a governance decision that kept thousands of builds from breaking. A prompt registry has none of this. Who decides that a prompt is malicious? Who resolves conflicts when two prompt authors claim the same specification name? Who steps in when a widely-used prompt starts producing vulnerable code? These are governance questions, and they need institutions to answer them.

Yes, we've automated a lot of this collaboration, maybe too much if you've ever looked inside a node_modules folder. But underneath the automation there's still a core human process: people building on each other's work without needing to talk to each other, and that kind of coordination can't be specified in a prompt.

AI agents aren't going to stop using packages. Packages feature heavily in the training data, and every coding agent already reaches for `npm install` or `pip install` as a first instinct. The interesting work is happening in the opposite direction: making agents better at working *with* package managers rather than replacing them. I've been building [a skill that makes coding agents evaluate packages skeptically](/2026/01/21/an-ai-skill-for-skeptical-dependency-management.html) before suggesting them, checking that they exist, that they're maintained, that the standard library doesn't already cover the use case. There's also a broader opportunity to give agents a [shared protocol for package management](/2026/01/22/a-protocol-for-package-management.html), a common vocabulary for resolution, publishing and governance that works across ecosystems. [Package management is a wicked problem](/2026/01/23/package-management-is-a-wicked-problem.html), and AI that understands package managers deeply seems more useful than AI that tries to make them disappear.
