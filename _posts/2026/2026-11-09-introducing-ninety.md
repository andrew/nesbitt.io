---
layout: post
title: "Introducing Ninety"
date: 2026-11-09 12:00 +0000
description: "Now trading: curl, OpenSSL, lodash and PHP"
tags:
  - security
  - maintainers
  - satire
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mzzlr66ida2v"
---

We're excited to announce Ninety, the first prediction market for open source security, launching today in partnership with Lanternfish, the frontier AI lab for software security. Security report volumes at major projects are [four to five times higher than in 2024](https://daniel.haxx.se/blog/2026/05/26/the-pressure/). Attackers and defenders are both running frontier models against the same few thousand packages, and everything those models turn up is scattered across disclosure inboxes, private chats, embargo lists and exploit brokers, with no price attached.

Ninety puts a price on it. Anyone can take a position on whether an open source project will have a vulnerability disclosed, how severe it will be, and how long the fix will take. Researchers earn from the markets they called correctly, and defenders who harden code earn when contracts resolve NO. Everyone who depends on open source gets a per-project price for how secure their dependencies are, updated every second.

### Rationale

Bug bounties make one payment to whoever finds a bug, after the report is in. Grant programs fund a handful of projects a year after a long application process. Both fall behind when a single model run can produce forty plausible reports before lunch, and this year several bounties closed. curl [ended its bug bounty](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/) in January and Google [paused its open source VRP](https://techcrunch.com/2026/10/04/google-froze-its-open-source-bug-bounty-program-due-to-a-significant-rise-in-ai-submissions/) in October, citing "a significant rise in automated submissions, the vast majority of which are not valid." HackerOne's Internet Bug Bounty [paused new submissions and cut its medium-severity payout from $1,843 to $297](https://www.theregister.com/security/2026/05/21/hackerone-takes-an-axe-to-its-bug-bounty-rewards/5244458). Ninety replaces the submission queue with an order book, and every new report moves the price.

Writing about curl's bug bounty in 2024, Daniel Stenberg called it ["an absolute and undisputed success"](https://daniel.haxx.se/blog/2024/10/09/curl-bug-bounty-stats/). Ninety takes the same incentive and makes it continuous and open to anyone with a verified account.

### Mechanics

Each market is a binary contract on a single project over a fixed window. The standard term is ninety days, matching the industry disclosure deadline and giving Ninety its name. Contracts trade between $0 and $1, and the price is the traders' current estimate of the probability that the event happens. Launch markets include:

- curl: Will a CVE rated High or Critical be published before 31 January 2027?
- OpenSSL: Will the next major release ship before the next High-severity advisory?
- Linux: Over/under on kernel CVEs published in December, line set by Lanternfish.
- lodash: Will the maintainers respond to the next security report within 14 days?
- PHP: Will a follow-up fix for php2shell be needed before 1 February 2027?

Every listed project also has a set of standard side markets: days-to-patch, whether a fix gets backported to older release lines, whether the advisory gets a name and a logo, and whether the repository is archived or its sole maintainer steps down before expiry.

Contracts can be chained into parlays, which pay out when every leg resolves YES, with odds set by Lanternfish. A dependency parlay has a leg for each step of a fix through the graph, such as a High-severity advisory in zlib followed by a CVE for each listed project that vendors it. The most popular parlay in beta was the Long Weekend, with legs for a Critical CVE published on a Friday, the first fix released after Monday, and the sole maintainer stepping down within the contract window.

### Results

Ninety has been in private beta with a few hundred traders since the summer. The PHP "CVSS 9+ before Halloween" contract traded at four cents for most of September. It closed at 97 cents on the afternoon of 20 October, the day before PHP shipped fixes for [CVE-2026-109618 and CVE-2026-109619](https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching), and CISA's addition of both to the KEV catalog on 26 October settled the follow-on exploitation contract. Congratulations to whoever was buying in September.

Our most traded contract of the year is the exploit count over/under on [Copy Fail](https://www.vulncheck.com/blog/routinely-targeted-vulnerabilities-may-2026), the Linux kernel privilege escalation found with AI assistance in April. It resolved at 132 public proofs of concept.

Backtested against historical data, the 2024 xz-utils backdoor would have been the most profitable position in open source history. The account best placed to take it had commit access to the project and would have been barred under our insider rules.

"I used to send reports to maintainers and wait months for a reply," said Max Tokens, the top-earning YES trader in the beta. "These days I buy YES on the project first and then file the report."

"We run Lanternfish against every project we hold NO on, and the returns cover the compute," said Ram Hoarder, who leads a four-person defensive trading desk on the NO side. "Patches go into our fork until the contract expires, which protects the position."

### Lanternfish

Ninety is sponsored by Lanternfish, whose models are used by most of the researchers who find open source vulnerabilities and most of the teams who fix them. Every verified trader gets Lanternfish credits on signup. Lanternfish is Ninety's designated market maker and provides liquidity on both sides of every contract. On the Copy Fail over/under it made the market on both sides while traders using its models generated most of the 132 proofs of concept being counted. Each of those model runs counted toward the Security Investment Score of the trader who ran it, which tracks Lanternfish usage and is shown on their public profile next to their returns.

"Security in 2026 is a compute problem," said Chip Shortage, CEO of Lanternfish. "Attackers are using frontier models to find bugs, so defenders have to use them too, and Ninety pays both sides back for the compute."

### Integrity

Ninety has strict insider rules to keep prices fair. Trading on a project is blocked for anyone with commit, release or publish access to it, anyone named in its maintainers file, code owners or security policy, and anyone who received an embargoed report about it in the last twelve months. We match identities against commit history, registry ownership records and signing keys automatically, so maintainers are excluded without signing up. "Maintainers are excluded the day their project is listed," said Chuck Sum, Ninety's Head of Market Integrity. "Most of them have no idea Ninety exists, which is exactly what you want from an insider control."

A trader who opens a pull request against a listed project becomes an insider for that project when the pull request is opened, and their positions are closed at the current price. Most traders hold fixes in a private fork until their contracts expire.

Maintainers know more about their own projects than anyone else, so they're the one group permanently excluded. We expect most of them to be fine with that. As Daniel Stenberg wrote earlier this year, ["I am not in this game for the money or the extravagant life style."](https://daniel.haxx.se/blog/2026/05/26/the-pressure/)

Traders may research the projects they hold positions in, including submitting security reports, requesting CVEs, opening issues, and asking for status updates on existing reports. Any contact with a maintainer intended to influence a market outcome must be disclosed on the trader's profile within 24 hours.

Markets resolve when any CNA publishes a CVE record for the project, and resolution is based on publication alone. Records that are later disputed or rejected still resolve YES if they were published inside the contract window.

### Listing

Any project with a package on a major registry and at least one CVE in its history is listed automatically. Ninety lists projects without asking their maintainers, because the security of widely used software is a matter of public interest and the markets reflect information that already exists.

Maintainers can request delisting from any market page. A delisting request is material non-public information about the project, so it's disclosed to traders as soon as it's received and marked on the price chart. Archiving a repository settles that project's abandonment markets, and its other markets run to expiry.

0.1% of all trading fees go into the Maintainer Appreciation Pool, paid out quarterly to the maintainers of listed projects as Lanternfish credits, with the largest shares going to projects whose markets resolve NO most often. Credits can be spent on Lanternfish's report triage models. Each listed project also gets one complimentary read-only dashboard seat, and maintainers can apply for delayed market data on their own projects, released ninety days after each contract settles.

### Organisations

Teams can buy YES across their dependency tree as a hedge, so a critical CVE in a transitive dependency pays out when your exposure is highest, and for most organisations a hedged dependency tree costs less than a support contract. "We moved our open source sponsorship budget into a YES position across our whole dependency tree," said Audrey Trail, CISO at a Fortune 100 retailer. "It's paid out four times this year."

Upload an SPDX or CycloneDX SBOM and Ninety builds the hedge for you. Each listed component gets its own YES contract. Teams now have a financial reason to update the SBOM whenever a dependency changes.

Since 11 September, manufacturers selling into the EU have had to [report actively exploited vulnerabilities](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting) under the Cyber Resilience Act. The early warning is due within 24 hours. Ninety's CRA hedge adds an exploitation contract for every component in your SBOM. Each position is sized to the Act's maximum fine: €15 million or 2.5% of worldwide turnover, whichever is higher. When one of your dependencies is exploited, the payout arrives before your early warning is due.

The Ninety price feed is available to software composition analysis vendors as a per-package security signal, and procurement teams can set a minimum NO price for any dependency entering their software.

### Availability

Ninety is live today in 41 jurisdictions. Sign up, verify your identity, and connect a Lanternfish key. Your first ten trades are free. Know the odds.

If you maintain a listed project, thank you for creating value for the Ninety ecosystem.

*Editor's note: This is satire, not a product spec. Please don't build it. [How to Ruin All of Package Management](/2025/12/27/how-to-ruin-all-of-package-management) covers what happens when markets get attached to open source metrics. If you have money for open source security, give it to the projects. Daniel Stenberg's [The pressure](https://daniel.haxx.se/blog/2026/05/26/the-pressure/) describes the current volume of reports from the receiving end.*
