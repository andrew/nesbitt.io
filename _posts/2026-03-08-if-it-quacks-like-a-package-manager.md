---
layout: post
title: "If It Quacks Like a Package Manager"
date: 2026-03-08 10:00 +0000
description: "Some tools waddle like package managers without learning to swim."
tags:
  - package-managers
  - security
  - deep-dive
---

I spend a lot of time studying package managers, and after a while you develop an eye for things that quack like one. Plenty of tools have registries, version pinning, code that gets downloaded and executed on your behalf. But flat lists of installable things aren't very interesting. 

The quacking that catches my ear is when something develops a dependency graph: your package depends on a package that depends on a package, and now you need resolution algorithms, lockfiles, integrity verification, and some way to answer "what am I actually running and how did it get here?"

Several tools that started as plugin systems, CI runners, and chart templating tools have quietly grown transitive dependency trees. Now they walk like a package manager, quack like a package manager, and have all the problems that npm and Cargo and Bundler have spent years learning to manage, though most of them haven't caught up on the solutions.

### GitHub Actions

- **Registry:** GitHub repos
- **Lockfile:** No
- **Integrity hashes:** No
- **Resolution algorithm:** Recursive download, no constraint solving
- **Transitive pinning:** No
- **Mutable versions:** Yes, git tags can be moved. [Immutable releases](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/immutable-releases) lock tags after publication but can still be deleted

I [wrote about this at length](/2025/12/06/github-actions-package-manager) already. When you write `uses: actions/checkout@v4`, you're declaring a dependency that GitHub resolves, downloads, and executes, and the runner's [`PrepareActionsRecursiveAsync`](https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionManager.cs) walks the tree by downloading each action's tarball, reading its `action.yml` to find further dependencies, and recursing up to ten levels deep. There's no constraint solving at all. Composite-in-composite support was [added in 2021](https://github.com/actions/runner/issues/862), creating the transitive dependency problem, and a [lockfile was requested](https://github.com/actions/runner/issues/2195) and closed as "not planned" in 2022.

You can SHA-pin the top-level action, but Palo Alto's ["Unpinnable Actions" research](https://www.paloaltonetworks.com/blog/prisma-cloud/unpinnable-actions-github-security/) documented how transitive dependencies remain unpinnable regardless. The [tj-actions/changed-files incident](https://unit42.paloaltonetworks.com/github-actions-supply-chain-attack/) in March 2025 started with [reviewdog/action-setup](https://github.com/advisories/ghsa-mrrh-fwg8-r2c3), a dependency of a dependency, and cascaded outward when the attacker retagged all existing version tags to point at malicious code that dumped CI secrets to workflow logs, affecting over 23,000 repos. GitHub has since added [SHA pinning enforcement policies](https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/), but only for top-level references.

### Ansible Galaxy

- **Registry:** galaxy.ansible.com
- **Lockfile:** No
- **Integrity hashes:** Opt-in
- **Resolution algorithm:** resolvelib
- **Transitive pinning:** No
- **Mutable versions:** Yes, no immutability guarantees

Ansible collections and roles install via `ansible-galaxy` from galaxy.ansible.com, with dependencies declared in `meta/requirements.yml`. When you install a role, its declared dependencies automatically install too, and those dependencies can have their own dependencies, forming a real transitive tree with collections depending on other collections at specific version ranges. The resolver is [resolvelib](https://github.com/ansible/ansible/pull/72591), the same library pip uses, which is a backtracking constraint solver and more sophisticated than what Terraform or Helm use.

A [lockfile was first requested in 2016](https://github.com/ansible/galaxy-issues/issues/165), that repo was archived, and the request was [recreated](https://github.com/ansible/galaxy/issues/1358) in 2018 where it remains open. The now-archived [Mazer](https://github.com/ansible/mazer/issues/173) tool actually implemented `install --lockfile` before being abandoned in 2020, so the feature existed briefly and then disappeared.

`ansible-galaxy collection verify` can check checksums against the server and GPG signature verification exists, but both are opt-in and off by default. Published versions on galaxy.ansible.com can be overwritten by the publisher, since there's no immutability enforcement on the registry side, and roles sourced from git repos have the same mutable-tag problem as GitHub Actions.

Roles execute with the full privileges of the Ansible process with `become` directives escalating further, and there are [open issues](https://github.com/ansible/ansible/issues/13215) going back years about the inability to exclude or override transitive role dependencies.

### Terraform providers and modules

- **Registry:** registry.terraform.io
- **Lockfile:** .terraform.lock.hcl
- **Integrity hashes:** Yes
- **Resolution algorithm:** Greedy, newest match
- **Transitive pinning:** Yes, for providers; no, for modules
- **Mutable versions:** Providers immutable; modules use mutable git tags

Terraform actually learned from package managers. `.terraform.lock.hcl` records exact provider versions and cryptographic hashes in multiple formats, `terraform init` verifies downloads against those hashes, and providers are GPG-signed. The version constraint syntax (`~> 4.0`, `>= 3.1, < 4.0`) looks like it was lifted straight from Bundler.

The [resolver](https://github.com/hashicorp/terraform/blob/main/internal/providercache/installer.go) collects all version constraints from root and child modules, intersects them, and picks the newest version that fits, with no backtracking or SAT solving. Modules can call other modules which call other modules, creating transitive trees, and the lock file captures the resolved state.

The lock file [only tracks providers, not modules](https://github.com/hashicorp/terraform/issues/31301) though, so nested module dependencies require cascading version bumps with no lockfile protection. Git tags used to pin modules are mutable, meaning a tag-pinned module can be [silently replaced with different content](https://github.com/hashicorp/terraform/issues/29867).

Researchers [demonstrated registry typosquatting](https://medium.com/boostsecurity/erosion-of-trust-unmasking-supply-chain-vulnerabilities-in-the-terraform-registry-2af48a7eb2) (`hashic0rp/aws` with a zero), and a [live supply chain attack demo at NDC Oslo 2025](https://www.classcentral.com/course/youtube-live-demo-supply-chain-attack-in-the-terraform-registry-kyle-kotowick-ndc-oslo-2025-472746) showed this working in practice. The provider side is solid, but the module side of the transitive tree has the same mutable-reference problems as GitHub Actions.

### Helm charts

- **Registry:** Chart repos / OCI registries
- **Lockfile:** Chart.lock
- **Integrity hashes:** Opt-in
- **Resolution algorithm:** Greedy, root precedence
- **Transitive pinning:** Yes
- **Mutable versions:** Depends on registry; OCI digests are immutable, chart repo tags are not

Kubernetes Helm has more package manager DNA than most things here. `Chart.yaml` declares dependencies with version constraints, `Chart.lock` records the exact resolved versions, and subcharts can have their own dependencies, building out genuine transitive trees. The [resolver](https://github.com/helm/helm/blob/main/internal/resolver/resolver.go) picks the newest version matching each constraint, with versions specified closer to the root taking precedence when conflicts arise.

Chart repositories serve an `index.yaml` that works like a package index, and OCI registries work too. Mutability depends on which backend you use: OCI digests are content-addressed and immutable, but traditional chart repos let publishers overwrite a version by re-uploading to the same URL, and nothing in Chart.lock will catch the change since it records version numbers rather than content hashes. Helm supports [provenance files](https://helm.sh/docs/topics/provenance/) for chart signing, though adoption is low.

`helm dependency build` [only resolves first-level dependencies](https://github.com/helm/helm/issues/2247), not transitive ones, so subchart dependencies need manual handling. You [can't set values for transitive dependencies](https://github.com/helm/helm/issues/8289) without explicitly listing them, and there's [no way to disable a transitive subchart's condition](https://github.com/helm/helm/issues/12020).

A [symlink attack via Chart.lock](https://github.com/helm/helm/security/advisories/GHSA-557j-xg8c-q2mm) allowed local code execution when running `helm dependency update`, fixed in v3.18.4. Malicious Helm charts have been used to [exploit Argo CD](https://apiiro.com/blog/malicious-kubernetes-helm-charts-can-be-used-to-steal-sensitive-information-from-argo-cd-deployments/) and steal secrets from deployments.

### If it has transitive execution, it's a package manager

Once a tool develops transitive dependencies, it inherits a specific set of problems whether it acknowledges them or not:

- **Reproducibility.** The tree can resolve differently each time, so you need a lockfile to record what you got.
- **Supply chain amplification.** A single compromised package deep in the tree can [cascade outward](/2025/12/06/github-actions-package-manager) through every project that depends on it.
- **Override and exclusion.** Users need mechanisms to deal with transitive dependencies they didn't choose and don't want.
- **Mutable references.** Version tags that can be moved, rewritten, or force-pushed mean the same identifier can point at different code tomorrow.
- **Full-tree pinning.** Pinning your direct dependencies means nothing if their dependencies use mutable references.
- **Integrity verification.** You need to know that what you're running today is the same thing you ran yesterday.

If your tool has these problems, it's a package manager, and no amount of calling it a "plugin system" or "marketplace" will stop the supply chain attacks from quacking at your door.
