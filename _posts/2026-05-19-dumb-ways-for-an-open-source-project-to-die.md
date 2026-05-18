---
layout: post
title: "Dumb Ways for an Open Source Project to Die"
date: 2026-05-19 10:00 +0000
description: "How your dependencies became Bernies"
tags:
  - open-source
  - maintainers
  - supply-chain
---

[Weekend at Bernie's](/2026/05/08/weekend-at-bernies.html) showed that a good chunk of the most-depended-on open source packages are dead, and there are a lot of different ways for a project to end up that way.

## The maintainer left

**Ghost maintainer.** The simplest and most common case: last human commit some years back, issues accumulating unanswered, the repo not archived so it doesn't show up in any filter that would flag it. Usually the maintainer just moved on to other things and the project wasn't important enough to them to formally hand over or shut down, though the same silence covers everything up to and including the maintainer having died, which neither the registry nor the repo has any way to represent. From outside it's indistinguishable from a long holiday until enough unanswered issues have piled up to make the silence unambiguous, and the npm utilities at the top of the [Bernie's dead list](/2026/05/08/weekend-at-bernies.html) are mostly this.

**Corporate orphan.** A company built and open-sourced it with a team to run it, then a pivot or a layoff round took the team out and nobody updated the README. The GitHub org persists with the company logo and the last people who had admin rights have left, so often nobody still at the company knows the project is theirs. Google's various graveyards are the famous case but every company past a certain size has a few of these, and the ones that were infrastructure rather than products tend not to even get a deprecation notice.

**Thesis orphan.** Built by a grad student for a master's project or a PhD chapter, and they've since graduated and moved on. The lab that hosted it nominally owns the repo, but nobody there has the context to continue it and academia gives them no reason to try: maintaining someone else's software earns no citations and counts for nothing at review next to publishing something new. Research software is full of these, often with a paper still being cited years after the code it describes stopped building.

**Funding cliff.** The project ran on a grant or a fixed-term sponsorship, often from a foundation or one of the public software funds, and the money ended on schedule. The maintainers went back to whatever pays the rent, and a project that had grown to fit full-time capacity is now getting evenings and weekends, which for that scope rounds to nothing. The funder's logo usually stays in the README long after the funding stopped, which makes this one easy to mistake for a healthy sponsored project.

**Hired away.** The maintainer was hired by a company and either the employment contract or just the new workload means the project stops. Occasionally that's a competitor removing a problem, but the more common case isn't malicious at all: Apple is the classic example of an employer that simply doesn't let most staff do outside open source, so a maintainer joining means their projects go quiet by default. Handing over before you start is the obvious fix and almost nobody does it in time.

**Succession deadlock.** The original maintainer is unreachable and there are people willing to take over, but the publish rights on the registry are tied to an account nobody else can access and the GitHub repo has no other admins, while the registry's abandoned-package process needs either the original maintainer's consent or a months-long dispute that nobody has obvious standing to start. The [PEP 541](https://peps.python.org/pep-0541/) process and npm's dispute policy both exist for exactly this case and both routinely take longer than forking and renaming would.

## The maintainer is still there

**Burnout plateau.** Still active by any metric you'd run. Typo fixes and dependency bumps get merged with the occasional "thanks, will look at this" on an issue, but anything that needs an actual design decision or a debugging session sits open indefinitely because those take energy the maintainer hasn't had for the project in a long time. There's often just enough response that anyone who suggests forking gets pointed at the recent activity but never enough to actually ship, and it can hold that shape for years without being quite dead enough for anyone to feel justified taking over.

**Benevolent zombie.** The contribution graph is solid green and every commit is a bot. Dependabot bumps, an auto-merge rule, possibly automated releases triggered by the bumps, and now scheduled coding agents that can keep the lights on indefinitely without a human reading anything. Every recency-based health score rates this as fine, which is more or less the [whole problem](/2026/05/09/the-mismeasure-of-open-source.html) with recency-based health scores.

**Custody battle.** Two or more co-maintainers have fallen out, each with enough access to block the other and not enough to proceed alone, and the project is frozen between them. It might resolve into a fork or end with one party walking away, but plenty just sit there with the issue tracker filling up with users asking what's going on and getting two contradictory answers.

**Tribal knowledge gone.** The code works and the tests pass, but the person who understood why has left, and nobody remaining is confident enough to touch anything load-bearing. The project goes read-only in practice: small patches at the edges are fine, anything structural is too risky to attempt. Particularly common in numerical and parsing code where the hard part is an algorithm one person implemented from a paper a decade ago and never wrote up.

**Toxic gatekeeping.** The maintainer is right there and hostile with it. New contributors get one bruising review and don't come back, and the bus factor stays at one because nobody else can stand to share the repo. It looks healthy on every metric that counts commits and closed issues, and when the one person eventually stops it's a ghost-maintainer case with no successor pool because everyone who might have taken over was driven off years ago.

## Sabotage and capture

**Captured maintainer.** Commit or publish access ends up with someone hostile. xz is the elaborate version, a two-year social-engineering campaign against an overworked solo maintainer to get a co-maintainer added who then shipped a backdoored release. event-stream in 2018 was the simpler one, where the original author handed the package to a volunteer who asked nicely and then added a wallet-stealer to a downstream dependency. In both cases the project looked healthier than before during the capture, because the new maintainer was the one putting the work in.

**Protestware.** The legitimate maintainer deliberately breaks their own package. colors and faker were sabotaged by their author in 2022, node-ipc shipped a payload targeting Russian and Belarusian IP ranges the same year, and left-pad was unpublished entirely during a dispute with npm in 2016. The motivations vary and the effect on downstream is the same: the code in the registry stops being what people thought they were running, usually without warning.

## The release pipeline broke

**Maintained-not-shipping.** Development is happening and fixes land in git, but nobody can cut a release. The one account with publish rights is gone, lost its 2FA device, or belonged to a company that no longer exists. Downstream is stuck on the last published version while the fix they need sits in a commit they can see in the repo and can't install from the registry, which is the case the original Bernie's post spent most of its time on.

**Unreleasable main.** The default branch has drifted far enough from the last tag that releasing it would be a breaking change for everyone, and nobody wants to own that, so nobody tags it. New contributors land patches on main while users run something from years ago, and the gap widens until cutting a release becomes a project in itself that never gets staffed.

**Build archaeology.** The published artifacts work and nobody can reproduce them. The build depended on a CI service that's gone, or a base image that's been deleted, or a tool version that one maintainer had on a laptop they no longer own. Making a new release means reconstructing a build environment first, and the knowledge of what was in it left with whoever set it up.

**Shadow-maintained.** Real development happens inside a company's private monorepo, and the public repo gets a periodic squashed code dump with a commit message along the lines of "sync." Issues and PRs filed against the public repo go nowhere because that isn't where anyone works. The open source project has become a publishing channel for a closed one, and from outside it's indistinguishable from a ghost maintainer except on the days a sync lands.

**Stranded major.** The project is on v4 and actively maintained, but most of the ecosystem is still on v1 because v2 was a rewrite they never migrated past and v1 hasn't had maintainer attention in years. Whether "the project" is dead depends entirely on which major version you're asking about, and the versions with the most installs are usually not the ones getting the attention.

**Registry orphan.** The package resolves from the registry and the source repo URL in its metadata 404s: deleted, made private, moved without updating the registry, or the hosting service it was on shut down. There's nowhere to file an issue or fork from, and no way to verify the tarball matches anything that was ever in source control. About 1.7% of npm and 4% of Packagist [point at a repo that isn't there](/2026/05/11/proxy.html), and a fair number of those are still being installed.

## Force majeure

**Sanctions-stranded.** The maintainer is able and willing and can't push, because the registry has blocked their jurisdiction or their account has been frozen under export controls. A handful of npm and GitHub accounts have been suspended this way over the past few years, and from downstream it looks identical to a ghost maintainer except that the maintainer is often loudly explaining the situation on another platform entirely.

**Takedown casualty.** Removed from the registry or the host after a DMCA claim or a trademark dispute. youtube-dl came back after its 2020 takedown; a lot of smaller projects don't, and whether the claim was valid has no bearing on whether the package still resolves.

## The world moved on

**Platform-stranded.** Chained to an end-of-life runtime: Python 2 only, requires a Node version that's dropped out of CI images, depends on a compiler extension that was removed. Porting it forward is more work than anyone left is willing to do, so it stays where it is while the platform it needs slowly disappears from everywhere you'd want to run it.

**Transitive death.** The project is fine and the maintainer is present and willing, but something two or three levels down in its own dependency tree has died by one of the routes on this list and can't be swapped out without a rewrite. The project inherits the death without anything in its own repo changing, which is the recursive case: every entry here is also a way to kill the things that depend on you.

**API rug-pull.** The project wraps something external that its owner withdrew. At the service layer that's a client library for an API that was shut down or repriced out of reach, and Twitter's 2023 changes followed by Reddit's killed a generation of those in one go. At the platform layer it's a browser dropping an interface or an OS locking down a capability, which accounts for everything built on NPAPI, Flash, or Chrome apps. Either way the maintainer has nothing they can do about it from their end.

**Superseded.** What the project does is no longer needed, either because the spec it implements has been replaced or because the language now does the same thing natively. `object-assign` after `Object.assign`, the lodash single-function packages after ES2015, the various promise and `fetch` polyfills, and at the protocol level any number of libraries for formats nobody emits any more. The maintainer reasonably stops, and a few hundred thousand lockfiles keep installing it because removing a dependency that still resolves is nobody's priority.

## The project split

**Fork limbo.** A disagreement or a maintainer departure split the project across two or more forks, none of which has clearly won. Downstream froze at the last pre-split version rather than bet on a fork that might lose, so the original keeps its install count while all the development effort happens elsewhere under other names. io.js and Node eventually merged back, libav eventually folded back into FFmpeg, and plenty of smaller splits never resolve at all.

**Licence rug-pull aftermath.** The project relicensed to something that isn't open source, and a community fork under the old licence exists but adoption hasn't consolidated behind it. Terraform/OpenTofu and Redis/Valkey are both somewhere along this path, with Elasticsearch a few years further down it. Most lockfiles still point at the last open-licensed version of the original, which is now a fixed point that nobody maintains.

**Open-core hollowing.** The interesting development moved to the commercial edition and the open source repo is kept around as the free tier. It still gets releases, mostly version bumps and whatever doesn't differentiate the paid product, and the project people originally adopted has effectively become a different, smaller one without ever being renamed.

---

The [Melbourne Metro safety campaign](https://en.wikipedia.org/wiki/Dumb_Ways_to_Die) this post is named after closes with "be safe around trains," which is more actionable than anything I've got. Whichever of the above applies, the package resolves the same, and your lockfile will keep wheeling it round the party with the sunglasses on for as long as nobody checks too closely.
