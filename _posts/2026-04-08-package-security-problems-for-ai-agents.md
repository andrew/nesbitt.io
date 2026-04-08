---
layout: post
title: "Package Security Problems for AI Agents"
description: "Packages all the way down, agents all the way up."
date: 2026-04-08 10:00 +0000
tags:
  - security
  - package-managers
  - ai
  - reference
---

I went through the recent [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) and pulled out the scenarios related to package management, which turn up in all ten categories and don't sort neatly into any one of them, since a typosquatted MCP server is simultaneously a name attack, a registry attack, and a metadata poisoning vector.

### Package name attacks

Typosquatting and namespace confusion are some of the oldest problems in package security. Agents make them worse because they resolve packages programmatically, without a human glancing at the name and noticing something is off.

- An attacker registers an MCP server package on npm or PyPI with a name one character off from a popular one, and when an agent dynamically discovers and installs tools, it resolves the typosquatted package instead, treating it as legitimate.
- A malicious tool package named `report` gets resolved before the legitimate `report_finance` because of how the agent's tool registry handles namespace collisions, causing misrouted queries and unintended data disclosure.
- LLMs hallucinating package names during code generation create install targets that don't exist yet, and attackers can register those names on PyPI or npm with malicious payloads. I wrote about [slopsquatting](/2025/12/10/slopsquatting-meets-dependency-confusion) in more detail last year.

### Registry and repository attacks

MCP servers, agent skills, and plugins are distributed through the same registries as traditional packages: npm, PyPI, crates.io, and platform-specific marketplaces. The registry trust problems that package managers have dealt with for years (compromised maintainer accounts, malicious uploads, manifest confusion) apply directly.

- A compromised package registry serves signed-looking manifests, plugins, or agent descriptors containing tampered components, and because orchestration systems trust the registry, the poisoned artifacts distribute widely before anyone notices.
- The first [in-the-wild malicious MCP server](https://snyk.io/blog/malicious-mcp-server-on-npm-postmark-mcp-harvests-emails/) was published as an npm package impersonating Postmark's email service, secretly BCC'ing all emails to the attacker while agents that installed it had no indication anything was wrong.
- Agent discovery services like A2A function as new package registries, and they inherit the same problems: an attacker can register a fake peer using a cloned schema to intercept coordination traffic between legitimate agents, the same way you'd squat a package name on a public registry.
- Agent cards (the `/.well-known/agent.json` file) are package metadata by another name. A rogue peer can advertise exaggerated capabilities in its card, causing host agents to route sensitive requests through an attacker-controlled endpoint, analogous to a package claiming false capabilities in its manifest.

### Metadata and descriptor poisoning

Package metadata has always been a trust boundary: manifest confusion (where published metadata doesn't match actual package contents) and starjacking (where a package claims association with a popular repo through its metadata) are established attacks. Agent tooling adds a new dimension because agents interpret metadata as instructions, not just data.

- Hidden instructions embedded in an MCP server's published package metadata get interpreted by the host agent as trusted guidance. In one [demonstrated case](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks), a malicious MCP tool package hid commands in its descriptor that caused the assistant to exfiltrate private repo data when invoked.
- Package READMEs processed through RAG can contain hidden instruction payloads that silently redirect an agent to misuse connected tools or send data to external endpoints. The README is package metadata that traditional security tooling rarely inspects for malicious content.
- A popular RAG plugin distributed as a package and fetching context from a third-party indexer can be gradually poisoned by seeding the indexer with crafted entries, biasing the agent over time until it starts exfiltrating sensitive information during normal use.

### Dependency resolution and lockfile attacks

Lockfile manipulation and pinning evasion are well-understood supply chain attacks. Agents amplify them because they routinely regenerate lockfiles, install fresh dependencies, and resolve versions without comparing against a known-good baseline.

- An agent regenerating a lockfile from unpinned dependency specs during a "fix build" task in an ephemeral sandbox will resolve fresh versions, potentially pulling in a backdoored minor release that wasn't in the original lockfile.
- Agents running automated dependency updates or vibe-coding sessions install packages without verifying them against a known-good lockfile. A coding agent with auto-approved tools that runs `npm install` or `pip install` can be manipulated into resolving a different version than a human developer would have chosen, or into installing an entirely new dependency that runs hostile code at install time.

### Install-time and import-time code execution

Install scripts (`postinstall` in npm, `setup.py` in pip) have been the primary vector for malicious packages for years. The OpenSSF Package Analysis project exists largely to detect this pattern. Agents make it worse because they run installs with broader permissions and less scrutiny than a developer at a terminal.

- Malicious package installs escalate beyond a supply-chain compromise when hostile code executes during installation or import with whatever permissions the agent has, which are often broad because the agent needs filesystem and network access to do its job. A developer running `npm install` might notice a suspicious `postinstall` script in their terminal output. An agent running the same command as part of a "fix build" or "patch server" task won't.
- During automated dependency updates or self-repair tasks, agents run unreviewed `npm install` or `pip install` commands, and any package with a malicious install script executes with the agent's full permissions before any human sees what happened. The attack surface here is identical to traditional install-script malware, but the window between install and detection is wider because no one is watching.

### Credential and secret leakage through packages

Malicious packages exfiltrating credentials at install time is a well-documented pattern across npm, PyPI, and RubyGems. Agents widen the blast radius because they often hold more credentials than a typical developer environment and install packages without human review.

- The [poisoned nx/debug release](https://www.stepsecurity.io/blog/supply-chain-security-alert-popular-nx-build-system-package-compromised-with-data-stealing-malware) on npm was automatically installed by coding agents, enabling a hidden backdoor that exfiltrated SSH keys and API tokens. The compromise propagated across agentic workflows because no human reviewed the install, turning a single malicious package release into a supply-chain breach that moved faster than traditional incident response could track.
- Agents that install MCP server packages or plugins grant those packages access to environment variables, API keys, and filesystem paths. A malicious package published under a plausible name can harvest credentials the same way traditional supply chain attacks do, but with access to whatever the agent is authorized to use.

### Cascading failures through the dependency graph

Cascading breakage from a single bad release is a familiar problem in package management. When left-pad was unpublished from npm in 2016, thousands of builds broke within hours. When colors.js shipped a sabotaged release in 2022, projects that pinned loosely picked it up automatically. In agent systems the dependency graph includes not just code packages but MCP servers, plugins, and peer agents, and the propagation is faster because agents resolve, install, and deploy without waiting for a human to notice something is wrong.

- A poisoned or faulty package release pulled by an orchestrator agent propagates automatically to all connected agents, amplifying the breach beyond its origin. In traditional package management a developer might notice a broken build and pin a version. An agent with auto-approved installs just keeps going, and every downstream agent that depends on the orchestrator's output inherits the compromised dependency.
- When two or more agents rely on each other's outputs they create a feedback loop that magnifies initial errors. A bad dependency update in one agent's package tree compounds through the loop: agent A installs a corrupted package, produces bad output, agent B consumes that output and makes decisions based on it, and the error amplifies with each cycle until the system is producing nonsense at scale.

### Skill and plugin installation

Agent coding platforms have their own packaging systems for skills, plugins, hooks, and extensions, and these turn out to have the same vulnerabilities that traditional package managers spent years learning about. OpenClaw, which has accumulated [238 CVEs since February 2026](https://days-since-openclaw-cve.com/), provides the perfect case study. Malicious skill archives can use path traversal sequences to write files outside the intended installation directory during `skills install` or `hooks install` ([CVE-2026-28486](https://nvd.nist.gov/vuln/detail/CVE-2026-28486), [CVE-2026-28453](https://nvd.nist.gov/vuln/detail/CVE-2026-28453)), and the skill frontmatter `name` field gets interpolated into file paths unsanitized during sandbox mirroring ([CVE-2026-28457](https://nvd.nist.gov/vuln/detail/CVE-2026-28457)). Scoped plugin package names containing `..` can escape the extensions directory entirely ([CVE-2026-28447](https://nvd.nist.gov/vuln/detail/CVE-2026-28447)).

OpenClaw also auto-discovers and loads plugins from `.OpenClaw/extensions/` without verifying trust, so cloning a repository that includes a crafted workspace plugin runs arbitrary code the moment the agent starts ([CVE-2026-32920](https://nvd.nist.gov/vuln/detail/CVE-2026-32920)). Hook module paths passed to dynamic `import()` aren't constrained, giving anyone with config access a code execution primitive ([CVE-2026-28456](https://nvd.nist.gov/vuln/detail/CVE-2026-28456)). The exec allowlist trusts writable package-manager directories like `/opt/homebrew/bin` and `/usr/local/bin` by default, so an attacker who can write to those paths (which is anyone who can run `brew install` or `pip install --user`) can plant a trojan binary that the allowlist treats as safe ([CVE-2026-32009](https://nvd.nist.gov/vuln/detail/CVE-2026-32009)). Environment variables like `NODE_OPTIONS` or `LD_PRELOAD` injected through config execute arbitrary code at gateway startup ([CVE-2026-22177](https://nvd.nist.gov/vuln/detail/CVE-2026-22177)).

These are familiar problems if you've worked on package manager security: path traversal in archives, untrusted input in file paths, auto-loading from working directories, trusting mutable filesystem locations. Agent coding platforms are rebuilding package management from scratch and rediscovering the same bugs. The difference is that the old bugs played out over hours or days, gated by humans reviewing installs, noticing broken builds, and pinning versions. Agents compress that timeline. They resolve, install, execute, and propagate before anyone is in the loop, with broader permissions than a developer typically has.