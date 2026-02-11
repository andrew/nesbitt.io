---
layout: post
title: "Community Tools Bring Lockfile Support to GitHub Actions"
date: 2025-12-30 10:00 +0000
description: "Community projects gh-actions-lockfile and ghasum address GitHub's missing lockfile support with SHA pinning and integrity verification"
tags:
  - package-managers
  - github
  - git
  - tools
---

Earlier this month I wrote about [GitHub Actions' missing lockfile](/2025/12/06/github-actions-package-manager.html). After the post was featured on [Hacker News](https://news.ycombinator.com/item?id=46189692) and [Lobste.rs](https://lobste.rs/s/zbqvyu/github_actions_has_package_manager_it), the authors of two projects reached out to share their work solving the problem from different angles.

[gh-actions-lockfile](https://github.com/gjtorikian/gh-actions-lockfile) by Garen Torikian is a TypeScript tool that generates a lockfile recording 40-character commit SHAs and SHA-256 integrity hashes for every action in your workflows. It resolves transitive dependencies from composite actions too, so you can see and pin the full tree. It also checks for known CVEs against the discovered actions. Run the CLI locally to generate the lockfile, then add the action to your workflow to verify against it. If an action's content changes, the hash mismatch fails your build.

[ghasum](https://github.com/chains-project/ghasum) by Eric Cornelissen, a Go tool from the CHAINS research project at KTH that's been under development since February 2024, takes a similar approach. Initialize with `ghasum init` to create a `gha.sum` file containing checksums of all your actions. Verify with `ghasum verify` in CI. It also exposes your full dependency hierarchy, making the invisible transitive dependencies visible.

They both address a number of the issues I pointed out in my previous post:

- Discover the full transitive dependency graph of actions used in workflows
- SHA-256 integrity verification of the contents alongside commit SHAs
- Recording all this in a lockfile that can be committed to source control
- A verification step that can be added to workflows to ensure actions haven't changed unexpectedly

Building this outside the runner has its limits though:

- Verification runs as a workflow step, so the runner has already resolved and downloaded actions before the check happens. For JavaScript actions, the `post` cleanup phase runs after all jobs complete regardless of verification failures. A compromised action could do damage in that window.
- Re-runs from the GitHub UI might skip verification depending on which job you re-run.
- Private actions need separate authentication that the runner handles automatically.
- Docker-based actions pull images through a different supply chain that these tools don't cover.
- Neither tool handles reusable workflows (`uses: org/repo/.github/workflows/foo.yml@ref`), which have the same transitive resolution problem.
- Both tools re-implement [action resolution](https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionManager.cs) by parsing action.yml files themselves, hoping GitHub's undocumented behavior doesn't diverge from their implementation.

Native integration would make verification atomic with execution, reject bad hashes before any code runs, and work uniformly across action types without extra configuration but getting that merged directly into the GitHub Actions runner is a much bigger lift.

Another possible feature: since they already resolve the full transitive graph, they could generate SBOMs for GitHub Actions dependencies. Few tools do this today, and with the EU Cyber Resilience Act requiring SBOMs for software products, knowing what runs in your CI pipeline becomes a compliance question too.
