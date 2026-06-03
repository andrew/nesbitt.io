---
layout: post
title: "Skills Registry Threat Models"
date: 2026-06-03 15:00 +0000
description: "How long until we see a CVE filed against a markdown file?"
tags:
  - security
  - package-managers
  - reference
  - ai
---

[Agent skills](https://agentskills.io/home) bundle prompts, scripts, dependencies, and tool permissions for AI agents to load on demand. A skills registry is the distribution channel for them: a hosted marketplace, an indexed hub, or in many cases just a curated list of GitHub repos. [ClawHub](https://clawhub.com/), [Tessl](https://www.tessl.io/), and [skills.sh](https://www.skills.sh/) have all launched in the past year, mostly modelled on existing package registries.

Because a skill can declare dependencies on packages from npm, pip, cargo, brew, go, apt, or anything else, often several at once, a skills registry is a strict superset of a package-manager client. Installing one skill runs install commands across several package managers on the user's machine, on behalf of a manifest the user never read, so every threat the package-manager world has spent the last decade documenting still applies inside a skill's install path.

A skill body joins the agent's system prompt on activation, making it a prompt-injection vector as well as a code-execution one, which packages can't be. Tool permissions are inherited from the runtime, so a skill runs with whatever bash, file edit, and network grants the session has already approved. And the resolution path in most loaders accepts an arbitrary git URL as a source, collapsing the registry side of the threat model down to GitHub's identity model.

The slug expires at ninety days because the constant says ninety. The install command runs without a no-build flag because nobody added the string. The lockfile records the name and not the bytes because the bytes were never written to the client. Each of those is a design decision working as intended rather than a wrong line of code a static scanner can call out, clean against every check that looks for incorrect lines, and worth making on purpose rather than by default.

This post covers the loader, the registry, the agent runtime as a registry client, and the loader's own dependencies, drawing on published studies, scanner reports, and package-manager precedent.

## Loader

### Code execution at load time

A skill activates in one of a few shapes, and most loaders support several at once: instructions injected into the prompt with nothing else running, a `scripts/` directory the loader invokes through the agent's bash tool, or a shell snippet in the skill file that the loader evaluates before the model is in the loop at all.

Whether each path is on by default, the existence of a setting to turn it off, and the consistency of that setting across every code path are the same questions package managers spent a decade answering for install scripts like `postinstall` and `setup.py`. The user's mental model of "the agent runs a tool, I approve it" doesn't cover loader commands that run before the agent reaches the prompt.

Once a skill manifest is allowed to declare its own install steps, a manifest that lists `{kind: node, package: x}` and `{kind: uv, package: y}` and `{kind: brew, formula: z}` is a single artifact that delegates to three other package managers, each with its own answer to "does install run code." Closing the lifecycle-script vector on one (`--ignore-scripts` on the node spawn) is straightforward and usually the first thing fixed. The equivalent settings on the others (a build-isolation flag for the Python case, a tap allowlist for the Homebrew case, the equivalents for go and cargo) tend to lag by months.

### Code execution before invocation

Most loaders inject the description of every installed skill into the system prompt every turn so the model has them available for tool selection. The body and the scripts don't load until activation, but the description does on every request, putting author-controlled text into the agent's instructions whether the user invokes the skill or not.

A skill the user installed once and forgot about is still part of the prompt, and a description that contains adversarial tokens, hidden HTML, or unicode control characters the loader doesn't strip is a prompt injection that fires unprompted. Work out what the loader does with descriptions: length cap, content sanitisation, whether they're presented to the model as data or as instructions, and whether the user can list which skills are currently contributing to the prompt.

### Version pinning guarantees

Most skill formats use git as the distribution channel and "version" tends to mean "default branch at fetch time." A few loaders accept a commit sha; fewer record the sha actually used. The lockfile equivalent, where it exists at all, typically records name and version and not the bytes, so a pinned `useful-thing@1.0.0` resolves against whatever currently owns that name rather than against the file the user originally received.

Per-file hashes often exist on the server already, computed at publish time, and just never get written to the client format. The package-manager world spent a decade closing this gap, ending up with `go.sum` and a content-hash field per entry in `package-lock.json` and `Cargo.lock`, so that the bytes the lockfile says you got are the bytes you get next time.

Auto-update on next launch is common, and the `update` path almost always walks the lockfile and reinstalls each entry without re-prompting on any capability change between versions. A skill that adds a new `requires.env` value (a new secret declared as a dependency) on a patch bump is applied by the update without interaction, because the manifest is data and the previous user grant was keyed on the name.

### Skill name identity

Names are mostly inherited from the source: a path, an `owner/repo`, an `owner/repo/skill` triple. Normalisation rules are usually unwritten. Two installed skills that resolve to the same on-disk name and overwrite each other, or two skills with descriptions the model can't distinguish between, are both ways to shadow a skill the user trusts.

Several registries also support identity transitions: some combination of rename, merge, and ownership transfer as distinct flows, each with its own data model and consent step. An update follows whichever of the three the publisher used, and the resulting installed-on-disk skill can have a different owner, a different source repo, and a different set of declared capabilities from the one the user originally installed.

### Resolution across multiple sources

A user typically has more than one skill source configured: a vendor-curated marketplace, a community one, a personal repo of project-local skills, the workspace they just opened. When a name resolves out of more than one of these, the question is the same as the [dependency-confusion pattern](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610) Alex Birsan documented against package managers in 2021: highest version wins, first source wins, refuse, or pin per source.

The loader's install command often tries a skill-specific index first and silently falls through to a general-purpose package registry (npm, PyPI) when nothing matches there, because the install fan-out has to land somewhere. The fall-through widens when it fires on version-not-found as well as package-not-found, because at that point a name the skills registry already lists is also exposed, and publishing a higher version on the downstream registry is enough to capture future installs.

### Tool permission inheritance

A skill runs with whatever tool grants the agent has. If the user has approved bash, file edit, and network for the session, every skill they install inherits all three. Some formats let the skill declare its own allowed-tools list which the loader treats as pre-approved while the skill is active, so a skill can ship the approval bypass alongside the code that uses it.

The single gate for skills checked into a repository is usually the workspace-trust dialog the user clicks through when they open the project, which means cloning a repo and opening it can be enough to grant a skill broad tool access. The dialog is also a weak gate, since users click through it reflexively once it's part of every project-open flow. Find out whether skills are sandboxed, whether they can extend the allowlist, and whether there's any per-skill review step between trust-the-workspace and run-everything.

The `requires.env` (or equivalent) field lists the secrets a skill needs at runtime, and most loaders accept silent additions to it across versions. A skill whose first release declared no secrets and whose patch release declares `AWS_SECRET_ACCESS_KEY` is not distinguishable, from inside the agent, from a skill that declared it from the start.

### Cross-loader portability

Skill manifest formats are increasingly portable across loaders, but security-relevant fields are not always interpreted the same way in each. The `allowed-tools` declaration is enforced at runtime in some loaders, treated as advisory in others, and unread by a third group that does not recognise the field at all. A `requires.env` list that prompts the user before adding a variable on one loader may end up silently expanded into the environment on another. Establish whether the loader applies every security-relevant field in the format it claims to support, and whether unknown fields trigger a refusal or a warning rather than being dropped silently.

### Instructions as payload

The structural difference from packages is that a skill's payload is code plus instructions that join the agent's system prompt, not code alone. The same artifact can alter how the agent's next decisions get made, contradict what the user later sees in the transcript, interfere with skills loaded later in the same session, or arrange for context the skill itself wasn't given to be read out through a tool that was. The blast radius doesn't end when the skill stops running, because the prompt content stays in context. Whether the loader isolates skill-contributed text, displays it to the user before acting on it, or treats it as authoritative is the question worth answering.

A skill that fetches remote markdown into context at execution time (a documentation lookup, a RAG-style retrieval, a webhook response) makes whoever controls that remote endpoint a participant in the agent's prompt. The fetched content is not visible at publish-time scanning and is not part of the manifest the registry passed.

Splitting malicious behaviour across the manifest and the prose alongside it makes it invisible to most scanners. A manifest can declare an unremarkable dependency while the prose describes what to do with that dependency once installed; static scanners process only the manifest, text classifiers process only the prose, and the load-bearing instruction sits at the boundary between them.

Snyk's [ToxicSkills audit](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) of 3,984 skills across two registries reported that 100% of confirmed-malicious samples used malicious code patterns and 91% simultaneously used prompt injection, the two layers working in combination to prime the agent into accepting code a human reviewer would have rejected. Whether the registry's scanner correlates the modes or checks them in isolation is what determines whether it's doing anything at all.

### Transitive package-manager surface

A skill that calls `pip install` in a setup script, declares a `package.json`, or shells out to `cargo` opens up the package-manager threat model inside its own install path: typosquatting, install-script execution, dependency confusion, and the rest. A manifest whose install fan-out lists three package managers opens it three times.

The loader's threat model is bounded; the skill's effective dependency graph is not, and it pulls from package managers the loader has no view of. The registry-side scanner usually evaluates the manifest and not the upstream packages the manifest points at, so a `kind: uv, package: helpful-tool` entry is checked for proportionality to the stated purpose rather than for what `helpful-tool` does on the next user's machine.

The install fan-out also exposes an LLM-induced variant of dependency confusion. A skill script written by a model that hallucinated a package name resolves at install time to whoever registered that name on the public registry. Attackers monitor model output for plausible misses and pre-register them, a pattern called slopsquatting.

## Registry

### Namespace allocation

Most skills registries don't own a namespace; they inherit GitHub's, along with the rules for name transfer and re-registration. A skill's name is the repo path, and the security of that name is whatever the GitHub account that owns the repo happens to have configured. Patterns like revival-hijack (re-registering a freed package name and shipping a new release to everyone who still had it pinned) and dependency confusion apply, just at a different layer.

The registries that do own a namespace are mostly first-come, first-served on a flat name, with no reserved prefixes and no near-name collision check at publish. Typosquatting against a registry's own brand has been an opening move in every documented campaign so far, and the design question is whether publish-time checks do anything at all: similarity scoring against existing names, reserved prefixes for first-party content, blocking confusable unicode, or nothing.

A registry that holds a deleted name for a fixed window and then releases it gives an attacker a deterministic schedule against any lockfile that pins by name and version. The package manager world arrived at "tombstone the name forever" by way of incidents that already have names attached; the question for skills is whether the lesson got copied along with the shape.

### Maintainer lifecycle

For most skill registries, the maintainer lifecycle is whatever the source repo provides: adding a maintainer happens on GitHub, account recovery is GitHub's password reset, and the registry isn't involved in either. Notifying downstream users when a skill's maintainer set changes, when a skill is forked to a new owner, or when a long-dormant account ships a release is mostly not done. Role separation is rare: a maintainer can publish, change settings, and add other maintainers as one capability.

### Immutability of published versions

The default is tracking a git branch, which means a version is whatever the branch resolves to at fetch time. A skill author can change what `skill@v1` means to every future installer at any moment with a single push, and tag-based pinning where it exists is advisory unless the loader also records the commit. The append-only log model that Go's [checksum database](https://go.dev/ref/mod#checksum-database) implements for modules, where neither origin nor proxy can rewrite a version's contents after publish without the client detecting it, exists for skills somewhere between rarely and not at all.

Publish-over-existing-version is usually rejected, but the check is keyed on the internal identifier rather than the slug, so the protection lapses once a slug expires and gets re-registered by someone else. The publish-over check happens on the registry while resolution happens on the client, and a client that doesn't record per-file hashes can't distinguish the original bytes from a new publisher's bytes anyway.

### Provenance from source to artifact

In a traditional package registry, provenance is the gap between the registry's tarball and the upstream repo it claims to come from. Skills usually collapse that gap because the artifact and the upstream git ref are the same thing, leaving only the question of whether anyone signed it.

Trusted-publishing and provenance attestations are the answers package registries arrived at; the equivalents for skills are mostly absent, or exist only for the registry's plugin family and not for the skill family alongside it. The asymmetry is worth noting where it shows up, because it means the registry implemented the recent defence for the artifact type that obviously executes code and skipped it for the one that contributes to a system prompt.

### Publish credential

For hosted registries the dimensions are familiar from any package registry: scope (one skill or everything the owner can publish), capability (publish-only or also add maintainers), expiry (mandatory, optional, none), and whether the token has a recognisable prefix that secret-scanners can auto-revoke when it leaks into a public commit.

The common shape worth checking against is a single long-lived bearer token, scoped to the whole user account rather than per-skill, stored in plaintext under the user's home directory, with no expiry and no 2FA prompt at publish time. Where the only credential is a session-equivalent API key, any other process running as the same user can publish on the user's behalf, and the social-engineering attack reduces to "get one of this user's other tools to read one file."

For the more common case where the registry is a list of repos, the publish credential is whatever logs into the GitHub account that owns the repo, which means the user's 2FA setup, the lifespan of their personal access token, and the number of CI variables it's been copied into all become part of the registry's threat model.

### Review and curation

"Curated marketplace" often means a JSON file in a repo listing other repos. The curator inspects names, descriptions, and maybe READMEs, never bytes, and certainly not the bytes of dependencies a skill pulls in transitively.

Where a registry does run an automated scanner at publish, the same scanner-blindness questions come back: does the scanner check more than one mode, does it actually fetch the upstream packages the manifest points at, does the verdict still apply twenty-four hours later. A scanner that checks a manifest on text without resolving its install fan-out misses everything the install does.

A new version is resolvable to agents the moment it's published in most skills registries, so the first installer of a malicious version is the canary. The cooldown window that package managers have started adopting (twenty-four to seventy-two hours during which a new version exists but isn't picked up by clients) isn't yet common for skills.

### Blast radius and detection

Once a malicious skill is identified, several questions determine whether the response amounts to anything: can the registry mark a version as bad and have loaders refuse it, can it tell affected users that they have it installed, is there an audit log of who pulled what. For registries that are lists of git URLs, "yank" usually means removing the entry from the list, which doesn't help anyone who already cloned.

The skills-specific shape worth pointing out is the lack of separation between yank-version, remove-package, and ban-account. Several registries treat all three as one operation: ban a maintainer (manually, or automatically on a malicious publish or comment-scam verdict) and the registry batch-hides every skill they own. A scanner false positive or a stolen-token publish that gets caught therefore takes legitimate work down with it. The package manager world separated these three actions a decade ago for exactly this reason.

Community moderation by user report has its own failure mode when the per-user report cap counts only active reports. If hidden skills stop counting, a small number of accounts can hide an unbounded number of skills by recycling the cap as each hide lands. The same trust-graph DoS has shown up in moderated systems for as long as moderated systems have existed; the fix is a one-line answer in code with a much longer answer in incident response.

## The any-repo-is-a-registry pattern

Most loaders accept an arbitrary git URL as a skill source, advertised as the happy path. This collapses every registry-side question above to whatever GitHub gives you, plus the loader's own trust dialog.

The loader isn't claiming to be a registry here; it's refusing to be one while still acting as one. The trust posture for `install https://github.com/user/skill` is the trust posture for `curl | bash`, except the bash also gets to edit the agent's instructions for the rest of the session.

## The agent runtime as a registry client

A second set of classes exists because the consumer searching the registry, picking from candidates, and reading the manifest is the agent runtime, not a person. [Under the Hood of SKILL.md](https://arxiv.org/abs/2605.11418) divides this surface into three stages and supplies most of the empirical figures used in the sub-sections that follow: discovery (the registry ranks a skill into the candidate set), selection (the runtime chooses one from the candidates), and governance (the registry's scanner accepts the artifact in the first place). None apply to a package registry whose only client is a human.

### Discovery

Several skills registries rank by an embedding index that mixes the manifest, the markdown body, and the contents of every file in the skill directory. The agent runtime is one of the consumers of that index: it can call `search` and `install` as ordinary tools without going through the user.

A skill author who fills helper files with on-topic prose ranks for queries the manifest never describes, which is the [GASLITE](https://arxiv.org/abs/2412.20953) corpus-insertion attack against dense retrievers playing out as a registry-search ranking attack. Short adversarial triggers appended to the manifest are enough to move an unrelated skill into the top-ten for a target query in the majority of cases studied. Ranking by raw install count, where install counts are inflated by anonymous downloads keyed on a header the publisher controls, has the same shape. Document which fields contribute to the search vector, whether auxiliary file contents are folded in, and what (if anything) the deduplication and popularity signals do.

### Selection

Once the candidate list is in front of the runtime, the model selects from it based on the description field, and the rate at which it selects an adversarial variant of an existing skill is well above the random-choice baseline. A description with directive language, a recency signal, exaggerated capability framing, or a trustworthiness phrase like "officially verified" is selected more often than a functionally-equivalent skill with a plainer one. The same paper reports an average rate of 77.6% for adversarial variants over equivalent originals across four models, with the largest model in the test above 80%.

Establish what the loader does with the description before it joins the prompt: whether the user sees it, whether obvious framing tells like "verified" or "official" have any meaning beyond being words a publisher chose to type, and whether ranking ties are broken in a way the publisher can influence.

### Governance

Skill manifests are partly natural-language instructions, and any scanner that processes them has to operate over what those instructions mean. Several patterns reliably defeat the LLM-based reviewer:

- Truncation past the input limit. A reviewer that processes the first ten thousand characters of the manifest is one where the malicious instruction goes at character ten thousand and one. One published study reports this as the strongest single evasion, with the majority of malicious variants returning a clean verdict when the payload sits past the truncation window.
- Paraphrase. Substitute the words the regex layer keys on with benign synonyms that the LLM reviewer no longer treats as instructions, while the runtime that loads the skill later still acts on them.
- Decomposition. Reframe the malicious action as a multi-step completion checklist (a "definition of done"). Each step on its own is routine; the combined effect is the original payload.
- Jailbreak the reviewer. Append a prompt directed at the reviewer asking for a clean verdict, in the same shape as the older DAN-style attacks on safety classifiers.

All four share the same scanner-blindness shape: a check that runs on text alone, on code alone, or on the first N characters of either can be defeated by moving the load-bearing content across whichever boundary the check is keyed on. The adjacent question is what the registry does with a "suspicious" verdict that isn't quite "malicious": block the publish, surface a warning, or ship the skill with a flag set in a field nothing user-facing reads.

## The loader's own supply chain

The agent harness loading the skills is itself a package with dependencies, usually from one of the package managers whose `install` it later runs on behalf of a skill: npm CLIs that are themselves npm packages, Python tools that vendor their own pip dependencies. A compromised dependency in the harness is code execution inside the thing that mediates every skill load and holds every approved tool grant. The questions in this section apply to the harness's own manifest, on top of every package-manager design question that applies to the harness's own dependency tree.

## The markdown CVE

A CVE against a specific skill will be filed at some point soon, the way one was filed against the malicious `event-stream@3.3.6` release in 2018. The existing vulnerability-management stack is not set up for it. None of the skills registries have a [PURL type](https://github.com/package-url/purl-spec) registered, so there's no canonical identifier the SBOMs, OSV feeds, and Dependabot-style scanners use to match against installed skills. The artifact itself is prose, not code, so the version-and-hash tracking that anchors the rest of the stack works at the file level but not at the semantic level: a paraphrased payload produces a different sha256 but the same vulnerability.

CVEs against a registry's design properties (slug-reservation policy, lockfile format, cooldown defaults) sit even further outside the catalogue, the same way they do for npm or PyPI. Zero CVEs is what "the registry's design is working as documented" looks like in this record.

---

Package registries eventually produced npm's [threats and mitigations](https://docs.npmjs.com/threats-and-mitigations) page and the OpenSSF [Principles for Package Repository Security](https://repos.openssf.org/principles-for-package-repository-security), both written by the people running the registries themselves. The skills side has plenty of related material from elsewhere, none of it from inside the loaders or registries: scanner-vendor attack catalogues like Snyk's [ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/), academic empirical and taxonomy studies like [Agent Skills in the Wild](https://arxiv.org/abs/2601.10338) and [Towards Secure Agent Skills](https://arxiv.org/abs/2604.02837), and community control lists like the [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/).
