---
layout: post
title: "gittuf - a signed log for git refs"
date: 2026-06-04 10:00 +0000
description: "Branch protection is a row in someone else's database"
tags:
  - git
  - security
  - supply-chain
---

Commit signatures are part of git. Branch protection isn't. It's a row in a database run by the forge, checked by the forge's API before accepting a push. Most of the interesting source-repository attacks have landed in the gap between the two.

### What the forge enforces

Branch protection, required reviews, [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), merge queues, status checks, required signatures: every one is administered by the forge, and none follow the repository when you clone it. A server presenting the repository can serve whatever ref pointers it likes. The rules can also be changed without any record in git. A flipped toggle in the settings page disables required reviews for the time it takes to push a commit, and re-enables it after. The only record sits in an audit log run by the same forge.

In March 2021 someone pushed two commits onto the [self-hosted PHP git server](https://news-web.php.net/php.internals/113838), into php-src, falsely attributed to Rasmus Lerdorf and Nikita Popov. The post-mortem points at the server itself, not at either developer's account. The project's response was to stop running their own git server and move canonical hosting to GitHub. Commit signing wouldn't have stopped this on its own: the commits weren't signed, and nothing would have forced a check on them if they had been.

In [June 2018 the Gentoo GitHub organisation was taken over](https://wiki.gentoo.org/wiki/Project:Infrastructure/Incident_Reports/2018-06-28_Github) after an administrator reused a password that had leaked elsewhere. The attacker removed the legitimate developers, added dummy admin accounts, and pushed commits to gentoo/gentoo, gentoo/musl, and gentoo/systemd containing `rm -rf` in ebuilds and obfuscated deletes in the systemd configure script.

Malicious refs sat at the tip of master for eight to ten hours depending on the repo, and recovery involved getting GitHub support to freeze the organisation before force-pushing clean history over the top. Branch protection was enforced by the same forge admin role the attacker had just taken over.

In March 2025 a leaked PAT on the [tj-actions/changed-files](https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-action-is-compromised) maintainer's bot account let an attacker create one malicious commit and retarget almost every existing tag to point at it. The action was in use by around twenty-three thousand repositories, and any that pulled it by tag during the compromise window got the new payload, which dumped CI secrets into the build log.

Tag objects are immutable: their content can't change without their hash changing. The ref pointing at a tag is a pointer like any other, and a force push can move it if the forge accepts the push.

### Refs aren't signed

The [2016 USENIX paper](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/torres-arias) that came up in the [previous post](/2026/05/24/signing-is-for-the-bad-days.html) described this pattern: a hostile server can roll a ref back to an earlier commit, or swap it for a different valid commit on another branch. The fetching client gets a tip that verifies cleanly, a real commit properly signed, just not the one the maintainers most recently advanced the branch to. Git does not sign refs, and the repository carries no record of which commit was the last legitimate tip.

### The Reference State Log

[gittuf](https://gittuf.dev), written up in a [2026 NDSS paper](https://www.ndss-symposium.org/ndss-paper/rethinking-trust-in-forge-based-git-security/) from the same research group, records every ref update as a signed entry in a hash chain stored in the repository, under `refs/gittuf/reference-state-log`. Each entry names a ref, the new commit hash, and the hash of the previous entry, signed by keys the policy allows to advance that ref.

Verifying a clone means walking the RSL forward and checking each ref movement against the policy in force at the time. If the tip your clone holds for main is not the tip the RSL ends on, something between you and the maintainers served you a ref they didn't sign for.

Reviews and other approvals sit alongside the RSL as separate signed attestations, not folded into the ref-advancement entries themselves. Verification can then check both that an authorised key moved the ref and that the approvals the policy required are present.

Verification runs outside the forge, against policy and keys the forge doesn't hold. For the PHP and Gentoo shape, an attacker on a compromised forge can produce a valid commit, and can push an RSL entry pointing at it, but can't produce a valid one. A verifier walking the log stops at the last entry that satisfies the policy. A tag move is a ref update like any other, signed by keys the policy permits to advance tags, so the tj-actions attack would leave the log either inconsistent or signed by a key the attacker doesn't hold.

### Policy, delegations, and thresholds

The policy lives in `refs/gittuf/policy`, in metadata derived from [TUF](https://theupdateframework.io/). A root policy lists trusted key holders and the threshold required to change the root. The root delegates to rule files of the form "two of these three keys can advance `refs/heads/main`", or "this set governs anything under `src/crypto/`", or "only release manager keys can move tags matching `v*`".

Delegations chain: a rule can hand off authority over a path to another rule file signed by a different set of keys. A child rule can only add requirements on its scope, not weaken what it inherited, so granting infra owners authority over `infra/` can't drop the threshold the root set on `main`. The verifier walks the graph and checks whether each ref update satisfied a permitting rule.

Threshold signing is the bit people have started asking GitHub for as a product feature. Required reviewers today is a setting in the forge, checked by its API before a push lands. gittuf's M-of-N is the cryptographic version, answerable from the repository alone. The same pattern handles CODEOWNERS-style controls on sensitive paths: a delegation can scope a rule to `refs/heads/main` and paths under `infra/`, requiring two signatures from a named set.

### Where it sits with the signing stack

The artifact-signing stack from the previous post assumes the tree the artifact came from is the tree the maintainers approved. gittuf provides that check. Sigstore covers the journey from a tree state to an artifact in a registry, with attestations describing who built it from what source. An in-toto attestation can name the commit the build came from, but it doesn't record whether that commit was a legitimate tip of the ref. The RSL adds that record.

The chain a client checks then runs from the registry, through the build, through the RSL entry authorising the commit, out to keys held outside the forge.

I'd like to see forges build gittuf in directly, so the workflows people rely on (editing a file in the web UI, clicking merge on a PR) produce signed RSL entries on the maintainer's behalf. The closest thing today is the gittuf project's own [GitHub App](https://github.com/gittuf/github-app), which records PR review approvals as attestations from outside the forge, but the merge itself still comes from a forge with no key in the delegation graph. A forge holding a key and using it to advance refs in response to authenticated user actions would become a participant in the chain, and most of the daily workflow could stay as it is.
