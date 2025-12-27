---
layout: post
title: "How to Ruin All of Package Management"
date: 2025-12-27
description: "Attach financial incentives to open source metrics and watch the spam flood in."
tags:
  - package-managers
  - security
---

Prediction markets are having a moment. After Polymarket called the 2024 election better than the pollsters, the model is expanding everywhere: sports, weather, Fed interest rate decisions. The thesis is that markets aggregate information better than polls or experts. Put money on the line and people get serious about being right.

Package metrics would make excellent prediction markets. Will lodash hit 50 million weekly downloads by March? Will the mass-deprecated package that broke the internet last month recover its dependents? What's the over/under on GitHub stars for the hot new AI framework? These questions have answers that resolve to specific numbers on specific dates. That's all a prediction market needs. [Manifold already runs one](https://manifold.markets/AmmonLam/how-many-stars-will-manifold-reach-d4fa3bc2baee) on GitHub stars.[^1]

Imagine you could bet on these numbers. Go long on stars, buy a few thousand from a Fiverr seller, collect your winnings. Go long on downloads, publish a hundred packages that depend on it, run npm install in a loop from cloud instances. The manipulation is mostly one-directional: pumping is easier than dumping, since nobody unstars a project. But you can still short if you know something others don't. Find a zero-day in a popular library, take a position against its download growth, then publish the vulnerability for maximum impact. Time your disclosure for when the market's open. It's like [insider trading, but for software security](https://www.youtube.com/watch?v=Gq3v-Y6cvLI).

The attack surface includes anyone who can influence any metric: maintainers who control release schedules, security researchers who control vulnerability disclosures, and anyone with a credit card and access to a botnet.

Prediction markets are supposed to be hard to manipulate because manipulation is expensive and the market corrects. This assumes you can't cheaply manufacture the underlying reality. In package management, you can. The entire npm registry runs on trust and free API calls.

This sounds like a dystopian thought experiment, but we're already in it.

### The tea.xyz experiment

[Tea.xyz](https://tea.xyz/) promised to reward open source maintainers with cryptocurrency tokens based on their packages' impact. The protocol tracked metrics like downloads and dependents, then distributed TEA tokens accordingly.

The incentive structure was immediately gamed. In early 2024, spam packages started [flooding npm, RubyGems, and PyPI](https://socket.dev/blog/tea-xyz-spam-plagues-npm-and-rubygems-package-registries). Not malware in the traditional sense, just empty shells with `tea.yaml` files that linked back to Tea accounts. By April, about [15,000 spam packages](https://socket.dev/blog/tea-protocol-spam-floods-npm-but-its-not-a-worm) had been uploaded. The Tea team shut down rewards temporarily.

It got worse. The campaigns evolved into coordinated operations with names like "IndonesianFoods" and "Indonesian Tea." Instead of just publishing empty packages, attackers created dependency chains. Package A depends on Package B depends on Package C, all controlled by the same actor, each inflating the metrics of the others. In November 2025, [Amazon Inspector researchers uncovered over 150,000 packages](https://aws.amazon.com/blogs/security/amazon-inspector-detects-over-150000-malicious-packages-linked-to-token-farming-campaign/) linked to tea.xyz token farming. That's nearly 3% of npm's entire registry.

The Tea team [responded](https://www.theregister.com/2025/12/17/tea_ceo_fends_off_token_farmers/) with ownership verification, provenance checks, and monitoring for Sybil attacks. But the damage makes the point: attach financial value to a metric and people will manufacture that metric at scale.

Even well-intentioned open source funding efforts can fall into this trap. If grants or sustainability programs distribute money based on downloads or dependency counts, maintainers have an incentive to split their packages into many smaller ones that all depend on each other. A library that could ship as one package becomes ten, each padding the metrics of the others. More packages means more visibility on GitHub Sponsors, more impressive-looking dependency graphs, more surface area for funding algorithms to notice. The maintainer isn't being malicious, just responding rationally to how the system measures impact. The same dynamic that produced 150,000 spam packages can reshape how legitimate software gets structured.

### GitHub stars for sale

Stars are supposed to signal quality or interest. Developers use them to evaluate libraries. Investors use them to evaluate startups. So there's a market.

A CMU study found approximately [six million suspected fake stars](https://arxiv.org/abs/2412.13459) on GitHub between July 2019 and December 2024. The activity surged in 2024, peaking in July when over 16% of starred repositories were associated with fake star campaigns. You can buy 100 stars for $8 on Fiverr. Bulk rates go down to 10 cents per star. Complete GitHub accounts with achievements and history sell for up to $5,000.

The researchers found that fake stars primarily promote short-lived phishing and malware repositories. An attacker creates a repo with a convincing name, buys enough stars to appear legitimate, and waits for victims. The Check Point security team identified a [threat group called "Stargazer Goblin"](https://socket.dev/blog/3-7-million-fake-github-stars-a-growing-threat-linked-to-scams-and-malware) running over 3,000 GitHub accounts to distribute info-stealers.

Fake stars become a liability long-term. Once GitHub detects and removes them, the sudden drop in stars is a red flag. The manipulation only works for hit-and-run attacks, not sustained presence. But hit-and-run is enough when you're distributing malware. Add a prediction market and the same infrastructure gets a new revenue stream.

### Why it's so easy to break

Publishing a package costs nothing. No identity verification. No deposit. No waiting period. You sign up, you push, it's live. This was a feature: low barriers to entry let unknown developers share useful code without gatekeepers. The npm ecosystem grew to over 5 million packages because anyone could participate.

Downloading costs nothing too. Add a line to your manifest and the package manager fetches whatever you asked for. No verification that you meant to type that name. No warning that the package was published yesterday by a brand new account. The convenience that made package managers successful is the same property that makes them exploitable.

Metrics are just counters. Downloads increment when someone runs `npm install`. Stars increment when someone clicks a button. Dependencies increment when someone publishes a `package.json` that references you. None of these actions require demonstrating that the thing being measured (quality, popularity, utility) actually exists. When the value of gaming these systems was low, the honor system worked well enough. That's changing.

Stars, downloads, and dependency counts were always proxies for quality and trustworthiness. When the manipulation stayed artisanal, the signal held up well enough. Now that package management underpins most of the software industry, the numbers matter for real decisions: government supply chain requirements, investor due diligence, corporate procurement. The numbers are worth manufacturing at scale, and a prediction market would just make the arbitrage efficient.

### AI has entered the chat

AI coding assistants are trained on the same metrics being gamed. When Copilot or Claude suggests a package, it's drawing on training data that includes stars, downloads, and how often packages appear in code. A package with bought stars and farmed downloads looks popular to an LLM in the same way it looks popular to a human scanning search results.

The difference is that humans might notice something feels off. A developer might pause at a package with 10,000 stars but three commits and no issues. An AI agent running `npm install` won't hesitate. It's pattern-matching, not evaluating.

The threat models multiply. An attacker who games their package into enough training data gets free distribution through every AI coding tool. Developers using [vibe coding](https://simonwillison.net/2025/Mar/19/vibe-coding/) workflows, where you accept AI suggestions and fix problems as they arise, don't scrutinize each import. Agents running in CI/CD pipelines have elevated permissions and no human in the loop. The attack surface isn't just the registry anymore; it's every model trained on registry data.

Package management worked because the stakes were low and almost everyone played fair. The stakes aren't low anymore. The numbers feed into government policy, corporate procurement, AI training data, and now, potentially, financial markets.

When you see a package with 10,000 stars, you're not looking at 10,000 developers who evaluated it and clicked a button. You're looking at a number that could mean anything. Maybe it's a beloved tool. Maybe it's a marketing campaign. Maybe it's a malware distribution front with a Stargazer Goblin account network behind it, it's pretty much impossible to tell.

[^1]: Thanks to [@mlinksva](https://mastodon.social/@mlinksva) for the tip.
