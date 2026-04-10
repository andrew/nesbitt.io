---
layout: post
title: "Package Security Defenses for AI Agents"
description: "Lockfiles, sandboxes, and cooldown timers."
date: 2026-04-09 10:00 +0000
tags:
  - security
  - package-managers
  - ai
---

Yesterday I wrote about [the package security problems AI agents face](/2026/04/08/package-security-problems-for-ai-agents): typosquatting, registry poisoning, lockfile manipulation, install-time code execution, credential theft, and cascading failures through the dependency graph. Agents inherit all the old package security problems but resolve, install, and propagate faster than any human can review.

There's no silver bullet for securing agent coding workflows because LLMs can't reliably distinguish safe packages and metadata from malicious ones, but these defenses can reduce the blast radius when something gets through. Some of them introduce friction, but agents can absorb that friction better than humans.

## For people using AI coding platforms

### Disable install scripts by default

npm has `--ignore-scripts`, pip has `--only-binary :all:` to refuse sdists and force wheels, but neither defaults to off. Agent platforms should ship with install scripts disabled and require explicit opt-in per package. The `postinstall` script is the single most common vector for malicious packages, and agents have no way to evaluate whether a script is legitimate. Bun already defaults to not running lifecycle scripts for installed dependencies.

### Dependency cooldown periods

New package versions shouldn't be installable by agents for some window after publication, maybe 24-72 hours. I wrote about [cooldown support across package managers](/2026/03/04/package-managers-need-to-cool-down) in more detail last month. Most malicious packages are detected and removed within days of upload. A cooldown means agents only resolve versions that have survived initial community and automated review. npm's provenance attestations help here but aren't sufficient alone. This could be enforced at the registry level, the resolver level, or the AI coding platform level.

### Sandbox package installation

Agents should install packages in isolated environments with no network access after the download phase and no access to credentials, SSH keys, or environment variables. Container-based sandboxes or something like Landlock on Linux would work here, where the install step gets network access to fetch packages but everything after that runs without it. Even if a malicious install script executes, it can't reach anything worth stealing.

### Limit which registries agents can resolve from

Agent configurations should support an allowlist of registries and scopes. An agent that only needs packages from your company's private registry and a handful of vetted public packages shouldn't be able to resolve arbitrary names from npm or PyPI. Companies already do this in their CI pipelines to prevent dependency confusion, and agents need the same treatment.

### Pin and verify lockfiles

Agents should never regenerate a lockfile unless explicitly asked to. If a lockfile exists, the agent should install from it exactly. If the agent's task requires adding a new dependency, it should produce the lockfile diff for review rather than installing and continuing. Lockfile-lint and similar tools should run as a gate before any agent-modified lockfile is accepted.

### Require package provenance

Where registries support it (npm with sigstore, PyPI with Trusted Publishers), AI coding platforms should default to requiring provenance attestation. Packages without provenance get flagged or blocked. This doesn't prevent all supply chain attacks but it makes account takeover and registry compromise harder.

### Scope agent permissions to the task

An agent updating a README doesn't need `npm install` permissions, and one running tests doesn't need network access. Agent platforms should support task-scoped permission profiles rather than giving every agent the same broad access, covering both what packages an agent can install and what those packages can do once installed.

### Treat agent tool metadata as untrusted input

MCP server descriptions, agent cards, skill descriptors, and plugin manifests should be treated as untrusted input, not as instructions. Agent platforms should parse metadata into structured fields and reject or sanitize freeform text before it reaches the LLM context.

### Monitor agent dependency behavior

Log every package install, version resolution, and registry query an agent makes, and diff these against expected behavior for the task. If an agent asked to fix a CSS bug runs `npm install crypto-utils`, that should page someone the same way an unexpected outbound network connection would in production. If an agent resolves a package version different from what's in the lockfile, the task should halt and wait for human approval. Traditional package security tooling already surfaces these signals but most AI coding platforms don't wire them into their agent workflows.

Failed installs matter too. When an agent tries to install a package that doesn't exist, that's likely a hallucinated name, and those names are [slopsquatting](/2025/12/10/slopsquatting-meets-dependency-confusion) targets. Registries and AI coding platforms that log failed resolution attempts have an early warning system for which package names attackers should be racing to register.

### Namespace reservation for agent ecosystems

MCP server registries, A2A discovery services, and skill marketplaces should implement namespace reservation and verification, the way npm has org scopes and PyPI has verified publishers. Unverified packages in agent-specific namespaces should carry visible warnings, and agents should be configurable to reject unverified sources entirely.

## For people designing AI coding platforms

### Your agent's dependency resolver is a security boundary

Every time your agent runs a package install, it's making a trust decision. Treat the resolver the same way you'd treat an authentication system: define what it's allowed to do, log what it actually does, and fail closed when something unexpected happens. If your agent can install arbitrary packages from public registries without approval, you've given the internet write access to your execution environment.

### Separate the package installation phase from the execution phase

Don't let agents install and run in a single step. The install phase should fetch and verify packages against an allowlist or lockfile, and the execution phase should run in a sandboxed environment built from what was installed. You don't `npm install` at runtime in production, and your agent shouldn't either.

### Design for the agent not knowing what it doesn't know

A human developer might hesitate before installing a package they've never heard of, but an agent will install whatever it thinks solves the task. Require packages to come from a vetted list, flag new dependencies for human review, and reject packages below a popularity or age threshold.

### Treat every MCP server and plugin as a dependency

If your system connects to MCP servers, installs skills, or loads plugins, those are dependencies with the same risk profile as npm packages. Pin versions, verify provenance where possible, and audit what they do at install and runtime. Calling them "tools" or "skills" instead of "packages" doesn't change the threat model.

### Don't give agents ambient credentials

Agents that inherit the developer's shell environment get their SSH keys, API tokens, cloud credentials, and registry auth tokens, and a malicious package installed by the agent can read all of it. Provision agents with scoped, short-lived credentials that only cover what the current task requires. If your agent doesn't need to push to a registry, it shouldn't have a registry auth token in its environment.

### Assume your agent will be prompted to install something malicious

Attackers will try to get your agent to install a bad package, and sometimes they'll succeed. Design your system so that a single malicious install can't exfiltrate credentials, can't persist across tasks, can't modify other agents' environments, and can't propagate to downstream systems. The blast radius of a compromised dependency should be one sandboxed task.

### Build a dependency audit trail

Every package your agent installs, every version it resolves, every registry it queries should be logged and attributable to a specific task. When something goes wrong, you need to answer: which agent installed this, when, why, and what else did it touch? Traditional SCA tools can scan the result, but you also need the provenance of how that result was assembled, the same way you'd want reproducible builds.

### Don't forget about dependencies after installation

Agents are good at installing packages and bad at revisiting them. A dependency an agent pulled in six months ago to fix a one-off task is still in the tree, still getting loaded, and nobody has checked whether it's been flagged since. Human developers at least occasionally see Dependabot PRs or hear about compromised packages through the grapevine. Agents don't have a grapevine. If your platform lets agents add dependencies, it also needs a mechanism for surfacing when those dependencies go stale, get deprecated, or turn up in vulnerability databases.
