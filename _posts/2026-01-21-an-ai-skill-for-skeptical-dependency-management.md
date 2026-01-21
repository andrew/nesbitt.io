---
layout: post
title: "An AI Skill for Skeptical Dependency Management"
date: 2026-01-21
description: "A skill that makes Claude Code evaluate packages before suggesting them."
tags:
  - package-managers
  - tools
---

AI coding assistants will suggest packages that don't exist, pin to versions from two years ago, and never mention that the standard library already does what you need. I've written a [skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) that makes Claude Code and similar agents more careful.

The skill is called [managing-dependencies](https://github.com/andrew/managing-dependencies). It's a markdown file that the agent lazy-loads when it decides it's working on a relevant task, rather than always taking up space in the context window. The format follows the [Agent Skills](https://agentskills.io) specification, so it works with Claude Code, Codex CLI, and other agents that support it.

I looked for an existing skill that covered this. There are ecosystem-specific ones for [uv](https://github.com/wshobson/agents/blob/main/plugins/python-development/skills/uv-package-manager/SKILL.md), [NuGet](https://github.com/github/awesome-copilot/blob/main/skills/nuget-manager/SKILL.md), and others, but nothing that handled the cross-ecosystem judgment calls around whether to add a dependency at all, so I built it.

The goal is making the agent back up its suggestions with evidence. Ask an LLM to add a package and it will suggest one, often pinned to an old version from its training data, without mentioning that it has two downloads, hasn't been updated in three years, has known CVEs, or that the standard library already handles your use case. It won't check that the name it's suggesting isn't a hallucination.

The skill tells the agent to verify packages exist before suggesting them, check if stdlib already handles the use case, and refuse when verification fails.

There's guidance on:

- Typosquatting patterns
- Dependency confusion attacks
- [Slopsquatting](/2025/12/10/slopsquatting-meets-dependency-confusion), where attackers register package names that LLMs tend to hallucinate
- Version constraint syntax across ecosystems
- Lockfile hygiene
- When to vendor
- Handling vulnerabilities without patches
- Safe criteria for auto-merging dependency updates
- Provenance and attestation verification

The skill also includes commands for querying the [ecosyste.ms](https://ecosyste.ms) API. Package registries expose basic metadata like version numbers and descriptions, but ecosyste.ms aggregates data across registries and source repositories that's harder to find: how many other packages depend on this one, when the last release was, whether the upstream repo is archived, known security advisories, and how commit activity is distributed across maintainers. It also normalizes this data across package managers, so the same API call works whether you're evaluating a gem, a crate, or a pip package. The skill teaches the agent to query this API and interpret the results, so when you ask "is this package well-maintained?" it can give you an answer based on actual data rather than guessing.

Installing it in Claude Code is one command:

```
/plugin marketplace add andrew/managing-dependencies
```

Or copy SKILL.md into your skills directory manually. Once installed, it activates automatically when you ask Claude Code about dependencies, packages, or supply chain security. You can also invoke it directly with `/managing-dependencies`.

I've been using and tweaking this myself for a few days, and without the skill I've seen Claude confidently suggest gems that don't exist, or pin to versions that were current two years ago when the training data was cut. With it, the agent checks RubyGems before recommending anything and tells me when it can't verify a package. That alone has saved me from a few "gem not found" errors and, more importantly, from potentially installing something malicious that an attacker registered under a hallucinated name.

The [repository](https://github.com/andrew/managing-dependencies) is public domain under CC0 if you want to fork it or adapt it for your own use.
