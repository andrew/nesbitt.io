---
layout: post
title: "GitHub Actions Has a Package Manager, and It Might Be the Worst"
date: 2025-12-06 10:00 +0000
description: "GitHub Actions has a package manager that ignores decades of supply chain security best practices: no lockfile, no integrity verification, no transitive pinning"
tags:
  - package-managers
  - github
  - git
---

After putting together [ecosyste-ms/package-manager-resolvers](https://github.com/ecosyste-ms/package-manager-resolvers), I started wondering what dependency resolution algorithm GitHub Actions uses. When you write `uses: actions/checkout@v4` in a workflow file, you're declaring a dependency. GitHub resolves it, downloads it, and executes it. That's package management. So I went spelunking into the runner codebase to see how it works. What I found was concerning.

Package managers are a critical part of software supply chain security. The industry has spent years hardening them after incidents like left-pad, event-stream, and countless others. Lockfiles, integrity hashes, and dependency visibility aren't optional extras. They're the baseline. GitHub Actions ignores all of it.

Compared to mature package ecosystems:

| Feature | npm | Cargo | NuGet | Bundler | Go | Actions |
|---------|-----|-------|-------|---------|-----|---------|
| Lockfile | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Transitive pinning | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Integrity hashes | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Dependency tree visibility | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Resolution specification | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |

The core problem is the lack of a lockfile. Every other package manager figured this out decades ago: you declare loose constraints in a manifest, the resolver picks specific versions, and the lockfile records exactly what was chosen. GitHub Actions has no equivalent. Every run re-resolves from your workflow file, and the results can change without any modification to your code.

[Research from USENIX Security 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/koishybayev) analyzed over 200,000 repositories and found that 99.7% execute externally developed Actions, 97% use Actions from unverified creators, and 18% run Actions with missing security updates. The researchers identified four fundamental security properties that CI/CD systems need: admittance control, execution control, code control, and access to secrets. GitHub Actions fails to provide adequate tooling for any of them. A [follow-up study](https://www.usenix.org/conference/usenixsecurity23/presentation/muralee) using static taint analysis found code injection vulnerabilities in over 4,300 workflows across 2.7 million analyzed. Nearly every GitHub Actions user is running third-party code with no verification, no lockfile, and no visibility into what that code depends on.

**Mutable versions.** When you pin to `actions/checkout@v4`, that tag can move. The maintainer can push a new commit and retag. Your workflow changes silently. A lockfile would record the SHA that `@v4` resolved to, giving you reproducibility while keeping version tags readable. Instead, you have to choose: readable tags with no stability, or unreadable SHAs with no automated update path.

GitHub has added mitigations. [Immutable releases](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/immutable-releases) lock a release's git tag after publication. Organizations can enforce SHA pinning as a policy. You can limit workflows to actions from verified creators. These help, but they only address the top-level dependency. They do nothing for transitive dependencies, which is the primary attack vector.

**Invisible transitive dependencies.** SHA pinning doesn't solve this. Composite actions resolve their own dependencies, but you can't see or control what they pull in. When you pin an action to a SHA, you only lock the outer file. If it internally pulls `some-helper@v1` with a mutable tag, your workflow is still vulnerable. You have zero visibility into this. A lockfile would record the entire resolved tree, making transitive dependencies visible and pinnable. [Research on JavaScript Actions](https://doi.org/10.1145/3643991.3644899) found that 54% contain at least one security weakness, with most vulnerabilities coming from indirect dependencies. The [tj-actions/changed-files incident](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/) showed how this plays out in practice: a compromised action updated its transitive dependencies to exfiltrate secrets. With a lockfile, the unexpected transitive change would have been visible in a diff.

**No integrity verification.** npm records `integrity` hashes in the lockfile. Cargo records checksums in `Cargo.lock`. When you install, the package manager verifies the download matches what was recorded. Actions has nothing. You trust GitHub to give you the right code for a SHA. A lockfile with integrity hashes would let you verify that what you're running matches what you resolved.

**Re-runs aren't reproducible.** GitHub staff have [confirmed this explicitly](https://github.com/orgs/community/discussions/27083): "if the workflow uses some actions at a version, if that version was force pushed/updated, we will be fetching the latest version there." A failed job re-run can silently get different code than the original run. Cache interaction makes it worse: caches only save on successful jobs, so a re-run after a force-push gets different code *and* has to rebuild the cache. Two sources of non-determinism compounding. A lockfile would make re-runs deterministic: same lockfile, same code, every time.

**No dependency tree visibility.** npm has `npm ls`. Cargo has `cargo tree`. You can inspect your full dependency graph, find duplicates, trace how a transitive dependency got pulled in. Actions gives you nothing. You can't see what your workflow actually depends on without manually reading every composite action's source. A lockfile would be a complete manifest of your dependency tree.

**Undocumented resolution semantics.** Every package manager documents how dependency resolution works. npm has a spec. Cargo has a spec. Actions resolution is undocumented. The [runner source is public](https://github.com/actions/runner), and the entire "resolution algorithm" is in [ActionManager.cs](https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionManager.cs). Here's a simplified version of what it does:

```csharp
// Simplified from actions/runner ActionManager.cs
async Task PrepareActionsAsync(steps) {
    // Start fresh every time - no caching
    DeleteDirectory("_work/_actions");

    await PrepareActionsRecursiveAsync(steps, depth: 0);
}

async Task PrepareActionsRecursiveAsync(actions, depth) {
    if (depth > 10)
        throw new Exception("Composite action depth exceeded max depth 10");

    foreach (var action in actions) {
        // Resolution happens on GitHub's server - opaque to us
        var downloadInfo = await GetDownloadInfoFromGitHub(action.Reference);

        // Download and extract - no integrity verification
        var tarball = await Download(downloadInfo.TarballUrl);
        Extract(tarball, $"_actions/{action.Owner}/{action.Repo}/{downloadInfo.Sha}");

        // If composite, recurse into its dependencies
        var actionYml = Parse($"_actions/{action.Owner}/{action.Repo}/{downloadInfo.Sha}/action.yml");
        if (actionYml.Type == "composite") {
            // These nested actions may use mutable tags - we have no control
            await PrepareActionsRecursiveAsync(actionYml.Steps, depth + 1);
        }
    }
}
```

That's it. No version constraints, no deduplication (the same action referenced twice gets downloaded twice), no integrity checks. The tarball URL comes from GitHub's API, and you trust them to return the right content for the SHA. A lockfile wouldn't fix the missing spec, but it would at least give you a concrete record of what resolution produced.

Even setting lockfiles aside, Actions has other issues that proper package managers solved long ago.

**No registry.** Actions live in git repositories. There's no central index, no security scanning, no malware detection, no typosquatting prevention. A real registry can flag malicious packages, store immutable copies independent of the source, and provide a single point for security response. The Marketplace exists but it's a thin layer over repository search. Without a registry, there's nowhere for immutable metadata to live. If an action's source repository disappears or gets compromised, there's no fallback.

**Shared mutable environment.** Actions aren't sandboxed from each other. Two actions calling `setup-node` with different versions mutate the same `$PATH`. The outcome depends on execution order, not any deterministic resolution.

**No offline support.** Actions are pulled from GitHub on every run. There's no offline installation mode, no vendoring mechanism, no way to run without network access. Other package managers let you vendor dependencies or set up private mirrors. With Actions, if GitHub is down, your CI is down.

**The namespace is GitHub usernames.** Anyone who creates a GitHub account owns that namespace for actions. Account takeovers and typosquatting are possible. When a popular action maintainer's account gets compromised, attackers can push malicious code and retag. A lockfile with integrity hashes wouldn't prevent account takeovers, but it would detect when the code changes unexpectedly. The hash mismatch would fail the build instead of silently running attacker-controlled code. Another option would be something like Go's checksum database, a transparent log of known-good hashes that catches when the same version suddenly has different contents.

### How Did We Get Here?

The Actions runner is forked from Azure DevOps, designed for enterprises with controlled internal task libraries where you trust your pipeline tasks. GitHub bolted a public marketplace onto that foundation without rethinking the trust model. The addition of composite actions and reusable workflows created a dependency system, but the implementation ignored lessons from package management: lockfiles, integrity verification, transitive pinning, dependency visibility.

This matters beyond CI/CD. Trusted publishing is being rolled out across package registries: PyPI, npm, RubyGems, and others now let you publish packages directly from GitHub Actions using OIDC tokens instead of long-lived secrets. OIDC removes one class of attacks (stolen credentials) but amplifies another: the supply chain security of these registries now depends entirely on GitHub Actions, a system that lacks the lockfile and integrity controls these registries themselves require. A compromise in your workflow's action dependencies can lead to malicious packages on registries with better security practices than the system they're trusting to publish.

Other CI systems have done better. GitLab CI added an `integrity` keyword in version 17.9 that lets you specify a SHA256 hash for remote includes. If the hash doesn't match, the pipeline fails. Their documentation explicitly warns that including remote configs "is similar to pulling a third-party dependency" and recommends pinning to full commit SHAs. GitLab recognized the problem and shipped integrity verification. GitHub closed the feature request.

GitHub's design choices don't just affect GitHub users. Forgejo Actions maintains compatibility with GitHub Actions, which means projects migrating to Codeberg for ethical reasons inherit the same broken CI architecture. The Forgejo maintainers [openly acknowledge the problems](https://codeberg.org/forgejo/discussions/issues/214), with contributors calling GitHub Actions' ecosystem "terribly designed and executed." But they're stuck maintaining compatibility with it. Codeberg mirrors common actions to reduce GitHub dependency, but the fundamental issues are baked into the model itself. GitHub's design flaws are spreading to the alternatives.

[GitHub issue #2195](https://github.com/actions/runner/issues/2195) requested lockfile support. It was closed as "not planned" in 2022. Palo Alto's ["Unpinnable Actions" research](https://www.paloaltonetworks.com/blog/cloud-security/unpinnable-actions-github-security/) documented how even SHA-pinned actions can have unpinnable transitive dependencies.

Dependabot can update action versions, which helps. Some teams vendor actions into their own repos. [zizmor](https://zizmor.sh/) is excellent at scanning workflows and finding security issues. But these are workarounds for a system that lacks the basics.

The fix is a lockfile. Record resolved SHAs for every action reference, including transitives. Add integrity hashes. Make the dependency tree inspectable. GitHub closed the request three years ago and hasn't revisited it.

---

**Further reading:**

- [Characterizing the Security of GitHub CI Workflows](https://www.usenix.org/conference/usenixsecurity22/presentation/koishybayev) - Koishybayev et al., USENIX Security 2022
- [ARGUS: A Framework for Staged Static Taint Analysis of GitHub Workflows and Actions](https://www.usenix.org/conference/usenixsecurity23/presentation/muralee) - Muralee et al., USENIX Security 2023
- [New GitHub Action supply chain attack: reviewdog/action-setup](https://www.wiz.io/blog/new-github-action-supply-chain-attack-reviewdog-action-setup) - Wiz Research, 2025
- [Unpinnable Actions: How Malicious Code Can Sneak into Your GitHub Actions Workflows](https://www.paloaltonetworks.com/blog/cloud-security/unpinnable-actions-github-security/)
- [GitHub Actions Worm: Compromising GitHub Repositories Through the Actions Dependency Tree](https://www.paloaltonetworks.com/blog/cloud-security/github-actions-worm-dependencies/)
- [setup-python: Action can be compromised via mutable dependency](https://github.com/actions/setup-python/issues/377)
