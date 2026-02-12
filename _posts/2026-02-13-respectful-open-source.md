---
layout: post
title: "Respectful Open Source"
date: 2026-02-13
description: "Maintainer attention as a finite resource."
tags:
  - open-source
  - idea
---

I found and fixed a bug in a popular open source project last week. Went to look at the repository and saw a maintainer drowning in issues and pull requests, clearly underwater, and I didn't submit the fix.

I've been on both sides of this for a long time. I ran [24 Pull Requests](https://github.com/24pullrequests/24pullrequests) for years, a project that actively encouraged people to send PRs to open source maintainers every December. The incoming was so overwhelming that I ended up building [Octobox](https://github.com/octobox/octobox) just to help maintainers manage the flood of GitHub notifications. I've spent a decade building tools to help maintainers cope with inbound, and I still couldn't bring myself to add to someone else's pile.

When I mentioned this on Mastodon, most people got it immediately. A couple said send it anyway, which I think misses something about what it's like to be on the receiving end. A fix from a stranger still carries cognitive load beyond just merging: triage, review, checking for regressions, responding, managing expectations when you can't get to it quickly. And once you merge someone's code, you're maintaining it. They move on, but you're the one who gets the bug report a year later when something breaks in a way the original patch didn't anticipate.

Even a perfect PR with a note saying "no rush" creates a low-grade obligation the moment it appears. The maintainer now knows it exists, unanswered. Someone in the thread suggested framing it as a gift with no expectations, and another person put it well: it doesn't matter how carefully you word it, it still lands as a thing that needs a decision.

The fix exists on my fork. If discovery were good, anyone hitting the same bug could find it there, but nobody will because fork discovery is effectively broken.

### Git was pull-based

The open source contribution model is almost entirely push-based. You do the work, then you push it at a maintainer and wait. Issues, PRs, @mentions, automated updates, audit findings, all of it puts something in front of a person who didn't ask for it.

[`git request-pull`](https://git-scm.com/docs/git-request-pull) generates a summary of changes in your repo and asks someone to pull from it, a genuine peer-to-peer request where the maintainer decides if and when to look. The contributor publishes their work and the maintainer pulls at their own pace, which is about as respectful of someone's attention as a collaboration model gets. GitHub took that name and bolted it onto what is functionally a push-based review queue. GitLab is at least honest about it by calling them merge requests.

Nobody can really use the `git request-pull` workflow anymore because it depends on the other person being able to find and browse your repo, which is a discovery problem that doesn't have good answers right now. If the default were flipped so that fixes exist publicly without requiring maintainer attention, the contributor's job would be done when the fix is public rather than when it's merged, and other users could find and benefit from fixes independently of upstream.

### Fork discovery is broken

The best tools for fork discovery are a handful of browser extensions that filter GitHub's fork list to show forks with commits ahead of upstream, and the most ambitious one I found clones all forks into a single repo and lets you grep across them locally.

GitHub made forking easy and fork discovery nearly impossible. The old fork graph rarely works for popular repos because so many people use the fork button as a bookmark, and Dependabot, CI bots, and AI agents all generate forks that are nothing but noise. Someone in the thread mentioned installing a browser plugin just to look at forks.

GitHub have said they'll let maintainers turn off PRs on their repos, which makes sense as a pressure valve, but turning off PRs without an alternative channel doesn't make fixes discoverable elsewhere.

It might be more interesting to pair that switch with better discovery. Imagine a maintainer triaging issue #347 and being able to see "three forks have patches touching this code" without anyone having submitted anything, because the signal is already there in git, just not surfaced anywhere.

### Everything is push

PRs are just the most visible channel. Bug reports, feature requests, support questions, and bot-generated updates all land in the same inbox with the same zero friction and the same assumption that someone on the other end has time to look at them.

Compliance and audit requests add another layer, where someone runs a scanner, finds something, and opens an issue that reads like a demand. "Your project has a licensing problem." "This code has a known vulnerability." The maintainer didn't ask for the audit, didn't agree to the compliance framework, and is now expected to respond on someone else's timeline. With the EU CRA pushing more software supply chain accountability, there's a growing class of inbound that amounts to "prove to me that your free software meets my requirements," which is a lot to push at a volunteer.

Private vulnerability disclosure is different because it needs a direct channel by nature, and that channel has its own AI spam crisis as anyone following curl's experience with HackerOne can attest. But for everything else, the problem isn't bad faith on anyone's part, it's that every one of these interactions assumes the maintainer has capacity to receive, and there's no mechanism for them to control that.

Open source sustainability conversations tend to focus on money, and maintainers absolutely need more of it, but maintainer attention and mental health are at least as scarce a resource, and nobody's trying to conserve them. Miranda Heath's [report on burnout in open source](https://mirandaheath.website/report-on-burnout-in-open-source-software/) names six causes, and workload is only one of them: toxic community behaviour, hyper-responsibility, and the pressure to keep proving yourself all compound the problem. The [communities around projects aren't fungible](https://www.joanwestenberg.com/communities-are-not-fungible/) either, built on years of shared context and ambient trust that can't be rebuilt once the people holding them together burn out. Unsolicited PRs, drive-by issues, and automated audits are all withdrawals from a finite account. A pull model, where people log problems and publish fixes somewhere discoverable and the maintainer engages on their own schedule, would at least stop treating that account as bottomless.

### AI slop accelerates the problem

All of this was already a problem before AI coding agents, but the past six months have made it noticeably worse. The volume of low-quality inbound to popular projects has exploded. Daniel Stenberg watched [AI-generated reports grow to 20% of curl's bug bounty submissions](https://opensourcesecurity.io/2025/2025-05-curl_vs_ai_with_daniel_stenberg/) through 2025, added a checkbox requiring AI disclosure, then finally killed the bounty program entirely in January 2026 after receiving seven submissions in sixteen hours. [Ghostty implemented a policy](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md) where submitting bad AI-generated code gets you permanently banned. [tldraw stopped accepting external PRs altogether](https://tldraw.dev/blog/stay-away-from-my-trash).

These are experienced maintainers who tried graduated responses and ended up at the nuclear option because nothing else worked. The [pattern](https://dri.es/ai-creates-asymmetric-pressure-on-open-source) is the same every time: add disclosure requirements, then add friction, then restrict access, then close the door, with each step costing maintainer energy on policy rather than code. That might work for individual projects, but it's hard to see it scaling when the number of potential contributors becomes effectively infinite and the tooling to generate plausible-looking code keeps getting better. And if GitHub's answer is letting maintainers turn off PRs entirely, AI pressure is going to force that switch on more and more repos, which only widens the discovery gap. GitHub made forking a one-click operation a decade ago without ever investing in making the resulting graph navigable, and now that turning off PRs is becoming a reasonable response to the AI firehose, all those would-be contributions just pile up as diverging forks that nobody can find.

A pull-based model would sidestep most of this, because agents can fork and generate garbage all day without anything landing in anyone's inbox. The maintainer never has to evaluate it, write a policy about it, or spend emotional energy closing it with a polite note. Generated code that happens to be good sits in a fork where someone might eventually find it useful, and the rest is invisible.

The empathy of not adding to the pile, the choice to fix something and walk away, is invisible in open source sustainability discussions, and I suspect the contributions people deliberately don't make out of respect for maintainer capacity might matter just as much as the ones they do. The fix is on my fork, and for now that's where it stays.
