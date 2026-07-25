---
layout: post
title: "What Happened to tea.xyz"
date: 2026-06-11 10:00 +0000
description: "Reading the tea leaves"
tags:
  - package-managers
  - supply-chain
  - deep-dive
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mnyzjwtyox2l"
---

On June 4th, [tea.xyz](https://tea.xyz/) launched what it had been promising since 2022: a cryptocurrency that pays open source maintainers. Within the first hour of official trading, the token fell 75% from its opening price. A week later it trades about 90% below its first-day high, the company's GitHub org has been near-silent for six months, and the founder's public commits are going to a different project entirely.

Their own blog post from June 8th, titled [The Work Continues](https://tea.xyz/blog/work-continues), concedes "the right response is not to pretend the launch went the way we wanted. It did not." I've been pulling the public data: GitHub commit history, on-chain trading records, and the long paper trail tea left across the package registries.

## Where tea came from

tea was founded by Max Howell, the creator of Homebrew, with Timothy Lewis. It [came out of stealth in March 2022](https://www.businesswire.com/news/home/20220323005603/en/Tea-Raises-$8-Million-Led-by-Binance-Labs-to-Create-New-Open-Source-Software-on-the-Blockchain) with $8M led by Binance Labs, followed by [an $8.9M seed round in December 2022](https://techcrunch.com/2022/12/06/from-the-creator-of-homebrew-tea-raises-8-9m-to-build-a-protocol-that-helps-open-source-developers-get-paid/). The pitch had two halves: a new package manager (the `tea` CLI), and a blockchain protocol that would reward the maintainers of open source packages with tokens. Howell wrote Homebrew and made nothing from it, and the pitch leaned on that history, famous Google interview rejection included.

The two halves split in October 2023, when the package manager was renamed [pkgx](https://github.com/pkgxdev/pkgx) and moved to its own GitHub org ([the old teaxyz/cli repo still redirects there](https://news.ycombinator.com/item?id=37768300)) while the teaxyz org kept the crypto protocol. pkgx is a decent piece of software, and it never had a token in it. But the separation was only organisational: the company and founders stayed the same, and pkgx remained part of tea's pitch as the eventual "cryptographically aware package register" for the protocol.

## The incentive design

The [white paper](https://docs.tea.xyz/tea-white-paper/white-paper) describes a mechanism called Proof of Contribution. Every package gets a score called [teaRank](https://tea.xyz/learn/proof-of-contribution), computed over the dependency graph and explicitly modelled on Google's PageRank. The more packages depend on yours, the higher your rank, and rewards scale with rank. To claim a package you add a `tea.yaml` file to its repository containing your wallet address.

The protocol paid out tokens in proportion to how many packages you controlled and how connected they were. Registering a thousand packages paid better than one, and declaring dependencies between them pushed their ranks higher still. Nothing in the design was costly to fake, since a package name costs nothing to register and a dependency is one line in a manifest. In February 2024 tea opened [an incentivized testnet](https://chainwire.org/2024/01/29/tea-protocol-announces-incentivized-testnet-launch-setting-a-new-paradigm-in-open-source-software/), a trial version of the protocol where points earned would convert to tokens at launch, and reported [nearly 200,000 signups and 500 projects in the first week](https://www.globenewswire.com/news-release/2024/02/27/2836295/0/en/The-tea-Protocol-s-Incentivized-Testnet-Approaches-200K-Signups-and-500-Open-Source-Software-Projects-in-First-Week.html).

## The spam

The farming started immediately, with pull requests on GitHub adding `tea.yaml` files to other people's projects, trying to claim repos the submitter didn't own. Howell called the PRs ["disgusting and counter productive"](https://socket.dev/blog/tea-xyz-spam-plagues-npm-and-rubygems-package-registries). On the registries, [Phylum documented](https://web.archive.org/web/2024/https://blog.phylum.io/digital-detritus-unintended-consequences-of-open-source-sustainability-platforms/) new npm package publications climbing from mid-February 2024 to over seven times normal daily volume, with around 14,000 tea-registered packages across npm, PyPI, RubyGems, and crates.io. [Sonatype counted roughly 15,000](https://www.sonatype.com/blog/devs-flood-npm-with-10000-packages-to-reward-themselves-with-tea-tokens) on npm alone, with single accounts publishing hundreds of packages.

RubyGems published [an incident report](https://blog.rubygems.org/2024/04/14/the-implications-of-crypto-rewards-on-rubygems_org.html) describing empty gems created to farm rewards, including one six-year-old gem with over 100,000 downloads whose owner retroactively added a `tea.yaml` to cash in on it. In response they tightened publishing limits and blocked the accounts responsible. By August 2024, [DEVCLASS reported research](https://devclass.com/2024/08/07/npm-overflowing-with-tea-spam-spills-out-from-70-of-all-new-packages-research/) estimating that of roughly 890,000 packages published to npm in the prior six months, around 70% were tea farming spam.

In November 2025, Endor Labs analysed the ["IndonesianFoods" campaign](https://www.endorlabs.com/learn/the-great-indonesian-tea-theft-analyzing-a-npm-spam-campaign): 43,000+ packages from at least 11 npm accounts over nearly two years, with auto-generated names from word lists. [Amazon Inspector tied over 150,000 packages](https://aws.amazon.com/blogs/security/amazon-inspector-detects-over-150000-malicious-packages-linked-to-token-farming-campaign/) to the same token-farming campaign. Some coverage called it a worm, though [Socket's analysis](https://socket.dev/blog/tea-protocol-spam-floods-npm-but-its-not-a-worm) found automation rather than self-propagation. The spam packages declared dependencies on each other to inflate teaRank, which meant installing any one of them pulled in the whole tree. [An academic paper](https://ldklab.github.io/assets/papers/scored25-teaspam.pdf) published in 2025 measures the abuse. The cleanup costs landed on npm, RubyGems, PyPI, and every mirror and security scanner downstream.

tea [responded that November](https://tea.xyz/blog/owning-the-fallout-fixing-the-incentives-how-tea-is-responding-to-the-npm-token-farming-campaign) by halting rewards distribution for the affected period and promising redesigned anti-spam rules. Howell [told The Register](https://www.theregister.com/2025/12/17/tea_ceo_fends_off_token_farmers) the protocol would slash farmers' rewards.

## The launch

In September 2025, eight months before the protocol went live, tea ran [a public sale on CoinList](https://coinlist.co/tea), a site that runs token sales for crypto projects: 4 billion TEA at $0.0005 each, implying a $50M valuation for the full 100 billion token supply. The terms unlocked 100% of the tokens on day one. Token sales usually stagger when buyers can sell, releasing tokens over months or years so early buyers can't all exit at once.

The launch plan, [announced May 12th](https://tea.xyz/blog/the-tea-party-begins), put trading on Aerodrome, an exchange that runs as a program on Base, a blockchain built by Coinbase, rather than as a company matching orders. Prices on this kind of exchange come from a pool of paired tokens, TEA on one side and a dollar-pegged token on the other, and each trade moves the price along a curve. The smaller the pool, the more each trade moves it. tea seeded the pool with 2% of the token supply and scheduled the launch for 00:00 UTC on June 4th.

<figure>
<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TEA token price per hour, June 3 to June 11 2026, showing a brief pre-launch spike to $0.00065, then a fall from $0.00046 to $0.00011 in the first hour of official trading" style="max-width:100%;height:auto;font-family:inherit;">
  <line x1="70" y1="315.0" x2="705" y2="315.0" stroke="var(--color-border)" stroke-width="1"/>
  <text x="62" y="319.0" text-anchor="end" font-size="12" fill="var(--color-secondary)">$0</text>
  <line x1="70" y1="268.6" x2="705" y2="268.6" stroke="var(--color-border)" stroke-width="1"/>
  <text x="62" y="272.6" text-anchor="end" font-size="12" fill="var(--color-secondary)">$0.0001</text>
  <line x1="70" y1="222.3" x2="705" y2="222.3" stroke="var(--color-border)" stroke-width="1"/>
  <text x="62" y="226.3" text-anchor="end" font-size="12" fill="var(--color-secondary)">$0.0002</text>
  <line x1="70" y1="175.9" x2="705" y2="175.9" stroke="var(--color-border)" stroke-width="1"/>
  <text x="62" y="179.9" text-anchor="end" font-size="12" fill="var(--color-secondary)">$0.0003</text>
  <line x1="70" y1="129.6" x2="705" y2="129.6" stroke="var(--color-border)" stroke-width="1"/>
  <text x="62" y="133.6" text-anchor="end" font-size="12" fill="var(--color-secondary)">$0.0004</text>
  <line x1="70" y1="83.2" x2="705" y2="83.2" stroke="var(--color-border)" stroke-width="1"/>
  <text x="62" y="87.2" text-anchor="end" font-size="12" fill="var(--color-secondary)">$0.0005</text>
  <line x1="70" y1="36.8" x2="705" y2="36.8" stroke="var(--color-border)" stroke-width="1"/>
  <text x="62" y="40.8" text-anchor="end" font-size="12" fill="var(--color-secondary)">$0.0006</text>
  <line x1="73.6" y1="15" x2="73.6" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="73.6" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jun 4</text>
  <line x1="159.7" y1="15" x2="159.7" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="159.7" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jun 5</text>
  <line x1="245.8" y1="15" x2="245.8" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="245.8" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jun 6</text>
  <line x1="331.9" y1="15" x2="331.9" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="331.9" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jun 7</text>
  <line x1="418.0" y1="15" x2="418.0" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="418.0" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jun 8</text>
  <line x1="504.1" y1="15" x2="504.1" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="504.1" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jun 9</text>
  <line x1="590.2" y1="15" x2="590.2" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="590.2" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jun 10</text>
  <line x1="676.3" y1="15" x2="676.3" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="676.3" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jun 11</text>
  <polyline points="70.0,15.0 73.6,68.2 77.2,261.7 80.8,261.8 84.4,263.4 87.9,263.9 91.5,266.1 95.1,269.9 98.7,272.6 102.3,268.2 105.9,268.4 109.5,268.3 113.1,270.4 116.6,269.4 120.2,270.2 123.8,270.0 127.4,272.3 131.0,273.0 134.6,273.1 138.2,273.0 141.8,272.9 145.3,272.6 148.9,273.3 152.5,273.5 156.1,273.5 159.7,273.4 163.3,273.6 166.9,273.6 170.5,273.4 174.0,272.7 177.6,273.3 181.2,272.5 184.8,273.7 188.4,273.8 192.0,273.8 195.6,273.9 199.2,273.7 202.7,273.7 206.3,273.7 209.9,273.7 213.5,272.9 217.1,273.1 220.7,273.9 224.3,273.6 227.9,274.0 231.4,274.0 235.0,273.0 238.6,273.7 242.2,273.9 245.8,273.7 249.4,273.9 253.0,273.9 256.6,273.9 260.1,273.9 263.7,273.7 267.3,273.7 270.9,273.6 274.5,272.9 278.1,273.9 281.7,273.1 285.3,273.7 288.8,273.9 292.4,273.7 296.0,273.9 299.6,273.9 303.2,272.9 306.8,273.6 310.4,273.1 314.0,272.9 317.5,273.9 321.1,273.7 324.7,273.9 328.3,273.5 331.9,272.9 335.5,273.1 339.1,273.8 342.7,273.2 346.2,273.8 349.8,273.0 353.4,274.0 357.0,273.0 360.6,273.0 364.2,273.8 367.8,273.6 371.4,273.5 374.9,273.7 378.5,273.7 382.1,273.5 385.7,273.6 389.3,272.9 392.9,272.6 396.5,272.7 400.1,273.5 403.6,273.7 407.2,273.5 410.8,273.1 414.4,274.1 418.0,272.9 421.6,273.8 425.2,273.6 428.8,272.8 432.3,273.9 435.9,273.8 439.5,273.6 443.1,272.8 446.7,273.7 450.3,274.0 453.9,273.6 457.5,274.0 461.0,273.6 464.6,272.7 468.2,273.5 471.8,273.9 475.4,273.6 479.0,273.8 482.6,273.8 486.2,273.8 489.7,272.6 493.3,273.6 496.9,272.6 500.5,273.0 504.1,272.8 507.7,273.9 511.3,273.1 514.9,275.5 518.4,276.4 522.0,278.0 525.6,278.0 529.2,278.7 532.8,278.5 536.4,278.4 540.0,278.6 543.6,277.9 547.1,278.7 550.7,277.9 554.3,278.6 557.9,278.7 561.5,278.4 565.1,277.7 568.7,277.7 572.3,277.7 575.8,278.6 579.4,277.8 583.0,277.8 586.6,278.6 590.2,277.9 593.8,277.7 597.4,278.0 601.0,278.0 604.5,278.0 608.1,277.9 611.7,278.7 615.3,278.7 618.9,277.8 622.5,278.5 626.1,278.7 629.7,278.7 633.2,278.5 636.8,278.6 640.4,277.6 644.0,278.0 647.6,278.6 651.2,278.6 654.8,278.5 658.4,278.4 661.9,278.5 665.5,278.4 669.1,278.6 672.7,279.9 676.3,280.4 679.9,283.7 683.5,283.6 687.1,282.1 690.6,282.1 694.2,282.6 697.8,282.2 701.4,282.0 705.0,282.5" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
  <line x1="73.6" y1="15" x2="73.6" y2="315" stroke="var(--color-text)" stroke-width="1" stroke-dasharray="5,4"/>
  <text x="79.6" y="29" font-size="12" fill="var(--color-text)">official launch, 00:00 UTC Jun 4</text>
  <text x="70" y="354" font-size="12" fill="var(--color-secondary)">Hourly $TEA price on Aerodrome (TEA/USDC pool), data from GeckoTerminal</text>
</svg>
</figure>

The pool received its tokens from 22:47 UTC on June 3rd, and [the first trade executed at 23:54 UTC](https://basescan.org/tx/0x0675e1a8a168c2af3132c124ec061094fd9e1d18d395bf9507cc613f394c7f3a), six minutes before the official launch. tea's June 8th post describes this as "onchain liquidity activity occurred ahead of the coordinated plan": the pool was live and tradeable before the launch sequence finished. In those six minutes the price was bid up to $0.00065, above the CoinList sale price. In the first official hour, from 00:00 to 01:00 UTC, the price fell from $0.00046 to $0.00011 on $332,000 of volume, down 75% in 60 minutes.

The CoinList sale's full unlock meant every September buyer was free to sell from the first minute, into a pool holding 2% of supply. The price has kept falling since and now sits around $0.00007, [86% below what CoinList buyers paid](https://www.coingecko.com/en/coins/tea-protocol) eight months ago, valuing the entire 100 billion token supply at roughly $7M against the $50M the sale implied.

The collapse didn't need anyone to withdraw the tokens backing the pool, and the pool still holds around $280K. Per [the project's own pre-launch transparency filing](https://cryptobriefing.com/tea-protocol-token-transparency-filing-tea-launch/), about 20% of supply was circulating at launch, ten times what the pool held.

## The GitHub record

Monthly commits across [the teaxyz org](https://github.com/teaxyz) and [the pkgxdev org](https://github.com/pkgxdev) show how much of the company was still working by launch day:

<figure>
<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Monthly commits to teaxyz and pkgxdev GitHub organisations from January 2024 to June 2026. The teaxyz line falls to near zero after November 2025 while pkgxdev continues with regular activity." style="max-width:100%;height:auto;font-family:inherit;">
  <line x1="50" y1="315.0" x2="705" y2="315.0" stroke="var(--color-border)" stroke-width="1"/>
  <text x="42" y="319.0" text-anchor="end" font-size="12" fill="var(--color-secondary)">0</text>
  <line x1="50" y1="240.0" x2="705" y2="240.0" stroke="var(--color-border)" stroke-width="1"/>
  <text x="42" y="244.0" text-anchor="end" font-size="12" fill="var(--color-secondary)">100</text>
  <line x1="50" y1="165.0" x2="705" y2="165.0" stroke="var(--color-border)" stroke-width="1"/>
  <text x="42" y="169.0" text-anchor="end" font-size="12" fill="var(--color-secondary)">200</text>
  <line x1="50" y1="90.0" x2="705" y2="90.0" stroke="var(--color-border)" stroke-width="1"/>
  <text x="42" y="94.0" text-anchor="end" font-size="12" fill="var(--color-secondary)">300</text>
  <line x1="50" y1="15.0" x2="705" y2="15.0" stroke="var(--color-border)" stroke-width="1"/>
  <text x="42" y="19.0" text-anchor="end" font-size="12" fill="var(--color-secondary)">400</text>
  <line x1="50.0" y1="15" x2="50.0" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="50.0" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jan 2024</text>
  <line x1="185.5" y1="15" x2="185.5" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="185.5" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jul 2024</text>
  <line x1="321.0" y1="15" x2="321.0" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="321.0" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jan 2025</text>
  <line x1="456.6" y1="15" x2="456.6" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="456.6" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jul 2025</text>
  <line x1="592.1" y1="15" x2="592.1" y2="315" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>
  <text x="592.1" y="333" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jan 2026</text>
  <polyline points="50.0,72.8 72.6,165.0 95.2,168.8 117.8,217.5 140.3,243.0 162.9,218.3 185.5,226.5 208.1,252.0 230.7,203.3 253.3,245.3 275.9,238.5 298.4,272.3 321.0,42.8 343.6,165.8 366.2,163.5 388.8,157.5 411.4,194.3 434.0,250.5 456.6,260.3 479.1,283.5 501.7,264.8 524.3,273.0 546.9,256.5 569.5,267.8 592.1,253.5 614.7,72.0 637.2,154.5 659.8,250.5 682.4,219.8 705.0,281.3" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
  <polyline points="50.0,313.5 72.6,313.5 95.2,312.8 117.8,315.0 140.3,315.0 162.9,315.0 185.5,315.0 208.1,315.0 230.7,312.0 253.3,279.0 275.9,310.5 298.4,240.0 321.0,283.5 343.6,314.3 366.2,310.5 388.8,300.0 411.4,301.5 434.0,288.8 456.6,306.8 479.1,308.3 501.7,310.5 524.3,274.5 546.9,306.0 569.5,313.5 592.1,314.3 614.7,313.5 637.2,315.0 659.8,315.0 682.4,315.0 705.0,315.0" fill="none" stroke="#d97706" stroke-width="2"/>
  <rect x="62" y="23" width="12" height="3" fill="var(--color-accent)"/>
  <text x="80" y="29" font-size="12" fill="var(--color-text)">pkgxdev (package manager)</text>
  <rect x="62" y="41" width="12" height="3" fill="#d97706"/>
  <text x="80" y="47" font-size="12" fill="var(--color-text)">teaxyz (protocol)</text>
  <text x="50" y="354" font-size="12" fill="var(--color-secondary)">Commits per month to non-fork repos in each GitHub org, via the GitHub API</text>
</svg>
</figure>

Commits to the protocol org ramped through late 2024 as the team built [chai](https://github.com/teaxyz/chai), their open package dataset, and the token contracts, and even the December 2024 peak was only 100 commits. Activity declined through 2025: chai's main developer stopped committing in August, the dataset repo's last commit was in September, and the token contract repo's last sustained work was in October and November. After November 2025, the month tea halted rewards over the farming campaign, the org had 2 commits in December, 1 in January, 2 in February, and none since.

The chart excludes forks, which hides the one place engineering continued: tea's forks of go-ethereum and Optimism, the infrastructure for their blockchain, received steady commits from a single contributor through May 17th, 2026, two and a half weeks before launch.

Howell wrote 236 commits to pkgxdev repos in January 2025 and kept a steady pace through May, then made only scattered commits until stopping entirely in November 2025. His public GitHub activity in June 2026 is in [automic-vault](https://github.com/automic-vault), a new org created in April with no connection to tea or pkgx, while [he remained tea's CEO in press coverage](https://www.theregister.com/2025/12/17/tea_ceo_fends_off_token_farmers) as recently as December.

pkgx itself is now mostly the work of one maintainer, Jacob Heider, who has carried the package-building pipeline more or less alone since mid-2025, lately assisted by Claude Code-generated pull requests that he reviews and merges. User-filed issues on the pkgx repo (then still teaxyz/cli) peaked at 78 a quarter in early 2023 and have arrived at a rate of 2 a quarter in 2026.

In tea's Discord, the conversation since launch is upset token holders: testnet participants who completed identity verification say they're not eligible for the airdrop, the free distribution of tokens they spent two years earning points toward, and a week after launch the official line in the channel is that nobody has said there won't be one. "The current price is a complete joke for everyone who participated in the project," as one user put it, while the moderation bot issues warnings for bad word usage. The member list shows two people with the Core Contributor role, and neither is a founder. The channels for the open source side of the project, the dev and package dataset discussion, have had no real activity since 2025.

tea's post blames a bad week for crypto generally, and the wider market fell that week too. But the same post admits to "decisions, timing factors, and execution details that we are reviewing internally", and the commit history shows few people left to conduct that review. Four years, roughly $17M in disclosed venture funding, and [about $2M more from the public sale](https://cryptobriefing.com/tea-protocol-token-transparency-filing-tea-launch/) produced several hundred thousand spam packages and a cleanup bill paid by registries that never had any relationship with tea. The maintainers tea set out to pay, the ones with real packages and dependents, are left holding the same token as the farmers.

*Data notes: commit counts are author-dated commits to non-fork repos in each GitHub org, collected via the GitHub API on June 11th 2026. Price data is GeckoTerminal hourly [OHLCV](https://en.wikipedia.org/wiki/Open-high-low-close_chart) for the Aerodrome TEA/USDC pool on Base. Issue counts exclude pull requests, bots, and tea team accounts. The raw data and chart scripts are in [data/tea on GitHub](https://github.com/andrew/nesbitt.io/tree/master/data/tea).*
