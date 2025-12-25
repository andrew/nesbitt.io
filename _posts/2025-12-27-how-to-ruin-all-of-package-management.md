---
layout: post
title: "How to Ruin All of Package Management"
date: 2025-12-27
description: "Attach financial incentives to open source metrics and watch the spam flood in."
tags:
  - package-managers
  - security
---

Prediction markets are having a moment in America. After Polymarket called the 2024 election better than the pollsters, the model is expanding everywhere. Sports, weather, celebrity gossip, whether your flight will be delayed, how many times the president will say "tremendous" in his next speech. Kalshi, the first CFTC-regulated prediction market, now lets Americans bet on Fed interest rate decisions. The thesis is that markets aggregate information better than polls or experts. Put money on the line and people get serious about being right.

Which brings us to package metrics.

Will lodash hit 50 million weekly downloads by March? Will the mass-deprecated package that broke the internet last month recover its dependents? What's the over/under on GitHub stars for the hot new AI framework? These questions have answers that resolve to specific numbers on specific dates. That's all a prediction market needs.

Imagine you could bet on these numbers. Go long on stars, buy a few thousand from a Fiverr seller, collect your winnings. Go long on downloads, publish a hundred packages that depend on it, run npm install in a loop from cloud instances. The manipulation is one-directional: you can only pump, not dump. Nobody unstars a project. But you can still short if you know something others don't. Find a zero-day in a popular library, take a position against its download growth, then publish the vulnerability for maximum impact. Time your disclosure for when the market's open. It's like insider trading, but for software security.

The attack surface includes anyone who can influence any metric: maintainers who control release schedules, security researchers who control vulnerability disclosures, and anyone with a credit card and access to a botnet.

The beautiful thing about prediction markets is that they're supposed to be hard to manipulate because manipulation is expensive and the market corrects. This assumes you can't cheaply manufacture the underlying reality. In package management, you can. The entire npm registry runs on trust and free API calls.

This sounds like a dystopian thought experiment. It's not. We're already running it.

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

Fake stars become a liability long-term. Once GitHub detects and removes them, the sudden drop in stars is a red flag. The manipulation only works for hit-and-run attacks, not sustained presence. But hit-and-run is enough when you're distributing malware.

### Why it's so easy to break

Publishing a package costs nothing. No identity verification. No deposit. No waiting period. You sign up, you push, it's live. This was a feature: low barriers to entry let unknown developers share useful code without gatekeepers. The npm ecosystem grew to over 5 million packages because anyone could participate.

Downloading costs nothing too. Add a line to your manifest and the package manager fetches whatever you asked for. No verification that you meant to type that name. No warning that the package was published yesterday by a brand new account. The convenience that made package managers successful is the same property that makes them exploitable.

Metrics are just counters. Downloads increment when someone runs `npm install`. Stars increment when someone clicks a button. Dependencies increment when someone publishes a `package.json` that references you. None of these actions require demonstrating that the thing being measured (quality, popularity, utility) actually exists. When the value of gaming these systems was low, the honor system worked well enough. That's changing.

### The metrics were never real

Stars, downloads, and dependency counts were always proxies for the things we actually care about: quality, trustworthiness, active maintenance. We're now discovering they were never very good proxies. We just didn't stress-test them.

When nobody was gaming the numbers, high stars loosely correlated with decent software. A maintainer might buy a few stars for vanity. A startup might inflate numbers for a pitch deck. But the manipulation stayed artisanal, small-scale, not enough to break the signal.

Package management now underpins most of the software industry. Every major company depends on code pulled from public registries. Governments are starting to care about software supply chains. Investors fund developer tools based on ecosystem metrics. The numbers are starting to matter for real decisions, which means the numbers are starting to be worth manufacturing.

A prediction market on package metrics wouldn't create new problems. It would be a mirror. The moment you attach money to a metric, you discover what that metric was actually measuring all along. GitHub stars are already traded for money, just informally, through Fiverr gigs and Telegram channels. Downloads are already farmed. The only thing missing is a liquid market to make the arbitrage efficient.

### AI makes it worse

AI coding assistants are trained on the same metrics being gamed. When Copilot or Claude suggests a package, it's drawing on training data that includes stars, downloads, and how often packages appear in code. A package with bought stars and farmed downloads looks popular to an LLM in the same way it looks popular to a human scanning search results.

The difference is that humans might notice something feels off. A developer might pause at a package with 10,000 stars but three commits and no issues. An AI agent running `npm install` won't hesitate. It's pattern-matching, not evaluating.

The threat models multiply. An attacker who games their package into enough training data gets free distribution through every AI coding tool. Developers using [vibe coding](https://simonwillison.net/2025/Mar/19/vibe-coding/) workflows accept suggestions without scrutinizing each import. Agents running in CI/CD pipelines have elevated permissions and no human in the loop. The attack surface isn't just the registry anymore; it's every model trained on registry data.

There's also the feedback loop. More code gets written by AI. That code includes package choices influenced by gamed metrics. The code gets scraped for future training data. The next generation of models is even more likely to recommend the gamed packages. The manipulation compounds.

As more code gets written by tools that treat package selection as a pattern-matching problem, the payoff for gaming those patterns goes up.

### What's left

When you see a package with 10,000 stars, you're not looking at 10,000 developers who evaluated it and clicked a button. You're looking at a number that could mean anything. Maybe it's a beloved tool. Maybe it's a marketing campaign. Maybe it's a malware distribution front with a [Stargazer Goblin](https://socket.dev/blog/3-7-million-fake-github-stars-a-growing-threat-linked-to-scams-and-malware) account network behind it. The star count can't tell you which.

If you're going to use metrics at all, the long game helps. Historical trends are harder to fake than snapshots. A package that's grown steadily over three years looks different from one that spiked last month. Relative numbers matter more than absolute ones: how does this package compare to others in the same space? And no single metric tells you much. Stars plus downloads plus commit activity plus issue response times plus how long the maintainers have been around starts to build a picture. Any one of those can be gamed. All of them together, over time, is harder.

Package management worked because almost everyone played fair. As the stakes rise, more people will try to take advantage.
