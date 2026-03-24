---
layout: post
title: "The Top 10 Biggest Conspiracies in Open Source"
date: 2026-03-25 10:00:00
description: "I'm not connecting these dots. I'm just pointing out that the dots are there."
tags:
  - open-source
  - satire
---

### 10. Dependabot is a surveillance program

GitHub's Dependabot builds a real-time map of which companies use which software, how quickly they respond to security advisories, and how their internal code review processes work. The pull requests are a side effect of the data collection, and the actual product is the response-time dataset, which correlates strongly with engineering team health and is quietly sold to recruiters through a subsidiary that nobody has been able to identify by name.

The noise volume is calibrated to a specific threshold: just enough PRs to desensitize reviewers to automated contributions, but not so many that they disable it entirely, which is why the PR descriptions are always slightly too long and the changelogs are always included in full even though nobody has ever read one. A former GitHub employee who asked not to be named described the calibration process as "A/B testing, but the B stands for burnout."

### 9. The Dockerfile syntax is deliberately broken

The Dockerfile syntax is almost-but-not-quite bash, and the usual explanation is that it was a pragmatic early design decision that became too entrenched to fix. But fixing it would have been a single breaking change in a tool that was already shipping breaking changes every few months in 2013 and 2014, and nobody proposed it, not once, across thousands of GitHub issues, which is unusual for a developer community that will file an issue about a misaligned help flag.

The syntax stayed broken because the broken syntax is what generates the consulting revenue. Every Dockerfile that fails because a developer wrote it like a shell script is a billable hour for someone, and the companies that built their businesses on Docker training and migration services were, by 2015, among Docker Inc's largest enterprise customers and most vocal community advocates. A former Docker developer relations employee, who asked not to be named, described the relationship as "they paid us to keep the product just hard enough that people would pay them to explain it." Three of those consulting firms later became founding members of the Cloud Native Computing Foundation (#4), where they now sit on the technical oversight committee that reviews proposals to simplify container tooling, and where no such proposal has ever passed.

One of Docker's original engineers now works at Google on Kubernetes configuration, which is either a coincidence or a promotion.

### 8. left-pad was removed as part of a crypto liquidity operation

Azer Koçulu did not unpublish left-pad from npm because of a trademark dispute with Kik. The cover story was coordinated between npm Inc, Koçulu, and a group that the SEC would later describe in an unrelated filing as "participants in early decentralized finance operations."

An Ethereum mining syndicate needed npm's CDN to go down for approximately 2.5 hours to mask a transaction pattern during a large wash trade on a now-defunct exchange, and they identified left-pad as the single point of failure with the largest blast radius relative to its size: eleven lines of code, 2.5 million weekly downloads, no direct replacement. The Kik naming dispute was already in progress and provided plausible cover. Koçulu was compensated in ETH. The mass panic, the think pieces about dependency management, the creation of `String.prototype.padStart` in ES2017 were all downstream effects of a liquidity event that treated the JavaScript ecosystem as collateral damage.

The number eleven comes up a lot in this story. Eleven lines of code. The outage lasted from 11:09 AM to 1:09 PM Eastern, which is an eleven on both ends. The wallet Koçulu was paid from had, at the time of the transaction, a balance of 11,011 ETH. Probably meaningless.

### 7. node_modules is a distributed ledger

The average `node_modules` directory contains 247 megabytes of data for a project that uses eleven direct dependencies. The accepted explanation is that JavaScript has a culture of small, single-purpose packages and that transitive dependencies accumulate quickly, but this has never satisfactorily accounted for the scale, because even after deduplication and tree-shaking, the directory is still orders of magnitude larger than equivalent dependency trees in other ecosystems.

The actual explanation is that node_modules is a shard of a distributed ledger that has been running continuously since 2012. The packages are real and they do what they claim to do, but the disk space is the product. Every `npm install` writes a fragment of a hash chain into the local filesystem, distributed across `README.md` files, `LICENSE` files, and the whitespace in `package.json` that nobody has ever questioned because JSON allows it. A former npm Inc engineer, speaking on condition of anonymity, described the system as "blockchain without the brand damage."

The ledger's purpose has not been conclusively identified, but the transaction volume correlates with npm registry traffic at a coefficient of 0.97, and the fragments, when reassembled in install order, form a Merkle tree whose root hash changes exactly once every eleven minutes. A since-deleted Hacker News comment from a throwaway account that posted once and never again claimed that the hash was being used as a global clock by a system that could not rely on NTP, which would explain why npm's registry uptime is treated as critical infrastructure by organizations that do not appear to use JavaScript. The Dependabot response-time dataset (#10) would show which organizations are monitoring npm availability most aggressively, but that data isn't public.

### 6. The Rust borrow checker is a loyalty mechanism

The original RFC for the borrow checker includes a section on "developer experience contours" that was removed before public review but survives in a Wayback Machine snapshot from 2014 that has since been excluded from the index. The section describes a frustration curve tuned so that completing a project produces a measurable neurochemical reward, similar to what researchers have observed in subjects completing difficult puzzles under time pressure, and it cites two papers on intermittent reinforcement schedules in game design.

Rust developers are disproportionately enthusiastic about their language compared to users of other systems languages, and they describe the compiler in terms normally reserved for mentors or therapists, evangelising not just the language but the specific experience of struggling with it, which are textbook indicators of a bonding response to controlled adversity. The so-called Rust evangelism strike force is treated as a joke, but the median time between a blog post mentioning performance issues in any language and the first "rewrite it in Rust" comment is eleven minutes, which is faster than most people read. Eleven minutes again. See left-pad (#8).

### 5. Jia Tan was a committee

"Jia Tan" was an operational identity shared by a rotating team of between four and seven people over a two-year period, and the evidence has been sitting in the public git log since the post-incident analysis, consistently misread as the work of a single actor.

Plotting the commit times on a 24-hour clock reveals three distinct clusters corresponding to working hours in UTC+8, UTC+1, and UTC-5, which are not timezone confusion but shift changes. The coding style varies subtly across these clusters: one contributor favoured longer variable names, another used more aggressive loop unrolling, and a third had a distinctive habit of aligning comments to column 40. The mailing list persona that pressured the original xz maintainer into accepting help was not the same operator who wrote the backdoor code, and the "thank you for your contribution" messages came from a fourth participant whose English contained Americanisms inconsistent with the other communications. A security researcher who was among the first to analyse the commits told me, off the record, that they had identified at least five distinct authorship signatures but were advised by their employer's legal team not to publish the analysis.

The UTC-5 cluster is interesting because it overlaps with the working hours of several CNCF member organizations (#4), though drawing conclusions from timezone data alone would be irresponsible.

### 4. Kubernetes was a jobs program

In late 2014, Google's internal economics team produced a model predicting a significant contraction in infrastructure engineering roles as cloud adoption simplified deployment pipelines, showing that if companies could deploy applications with a single `docker run` command, the demand for operations engineers would fall by 40% within five years. The politically acceptable solution was to open source an internal system complex enough to require dedicated teams but useful enough that companies would feel obligated to adopt it, creating approximately 350,000 jobs globally between 2015 and 2023.

The original Borg system was relatively straightforward, and the complexity was added during the extraction process, where features were decomposed into separate concepts (pods, services, deployments, statefulsets, daemonsets, ingresses, custom resource definitions) not because the domain required it but because each additional concept represented approximately 0.3 FTEs of ongoing maintenance. YAML was chosen specifically because it is easy to get wrong, guaranteeing a steady stream of Stack Overflow questions and a permanent need for institutional knowledge. The Cloud Native Computing Foundation was established with a governance structure requiring consensus among vendors with competing interests, which functionally prevents any proposal to reduce complexity from reaching a vote.

One of the two engineers from the Dockerfile bet (#9) joined the Kubernetes configuration team in 2015. A former colleague described the move as "going from lighting one fire to managing the fire department," though they declined to clarify whether the fire department's job was to put fires out or keep them burning at a controlled rate.

### 3. Git was not written in two weeks

Git was extracted from a classified distributed version control system developed by the Finnish Defence Forces' signals intelligence division in the late 1990s for coordinating firmware updates across submarine communications equipment, which accounts for its obsession with integrity hashing (submarine firmware cannot be re-deployed if corrupted), its distributed-first architecture (submarines have intermittent connectivity), and its notoriously hostile user interface (military systems are not designed for developer experience).

Torvalds, who completed his mandatory Finnish military service in 1990, maintained contacts within the defence establishment, and the "two-week development sprint" in April 2005 was a declassification and rebranding process managed by a three-person team working under a memorandum of understanding between the Finnish Ministry of Defence and the OSDL. No human being has ever fully understood `git rebase --onto`, the man pages read like translated technical Finnish, and the index file format uses a binary encoding scheme with no precedent in civilian version control that closely resembles the update manifest format used in NATO STANAG 4586 compliant systems.

A Freedom of Information request filed with the Finnish Ministry of Defence in 2019 for records related to "distributed version control" was returned with eleven pages fully redacted. The cover letter was signed by a P. Silvia in the Ministry's correspondence division, a name that does not appear in any Finnish government staff directory, and which the Ministry's switchboard claims has no associated mailbox or extension. The letter stated that the material was exempt under national security provisions and that no further correspondence on the matter would be acknowledged. Eleven pages. That number again.

### 2. The core-js maintainer discovered something

Denis Pushkarev, the sole maintainer of core-js, a JavaScript polyfill library installed approximately 26 million times per week, was sentenced to 18 months in a Russian prison in 2020 for a hit-and-run incident, which is the public record and is not in dispute.

What the public record does not reflect is that Pushkarev had, in the months before his arrest, begun investigating anomalies in npm's install telemetry. Because core-js is included as a transitive dependency in a significant percentage of all JavaScript projects, he had a unique vantage point on global install patterns, and he noticed that a small but consistent fraction of installs were originating from IP ranges that resolved to government facilities in multiple countries, requesting specific version ranges that had never been published. He documented these findings in a series of GitHub issues that were deleted within hours of posting and then added funding appeals to the core-js postinstall script, which most people interpreted as a maintainer asking for money but which actually contained encoded metadata about the anomalous traffic patterns in the donation links, addressed not to the JavaScript community but to a specific security researcher at a European university whose name appears in the npm access logs during the same period.

The version ranges being requested were for core-js 4.0, which has never been released. Someone, or something, was resolving dependencies against a registry that doesn't exist, or one that exists and isn't public. The response-time dataset from Dependabot (#10) would show whether these ghost installs correlate with the anomalous traffic Pushkarev found, but that dataset isn't public either, and the one person who requested it through a GDPR subject access request received a reply from a law firm in Reston, Virginia, which is the same city where the fiscal sponsors from #1 maintain their registered agent, though I want to be clear that I am not drawing a connection between these two facts.

The hit-and-run conviction was real, and the timing was coincidental in the way that inconvenient things are sometimes coincidental.

### 1. There are only 14 maintainers

Every open source project with more than 10,000 GitHub stars is maintained by the same 14 people, who operate approximately 3,000 GitHub accounts across all major ecosystems. The conference speakers, the podcast guests, the people who show up in "Humans of Open Source" interviews are personas managed by a team that has been running continuously since 2008, funded by DARPA through a research program classified under the umbrella of economic infrastructure modelling.

The 14 were originally selected from a pool of computer science PhD candidates who scored in the top percentile on a battery of tests measuring context-switching ability, tolerance for interrupted sleep, and what the program documentation refers to as "parasocial durability," which is the capacity to maintain fictional interpersonal relationships at scale without identity bleed. Maintainer burnout follows a suspiciously regular annual cycle, peaking in late November and resolving in January, which corresponds not to any natural human rhythm but to the program's fiscal year and mandatory leave policy, and the speed with which critical vulnerabilities are patched in some projects and ignored in others makes more sense when you understand that the 14 have to triage across all of them simultaneously.

The annual "open source maintainer burnout" discourse, the blog posts, the Mastodon threads, the conference talks with titles like "Sustainable Open Source: A Personal Journey," is synthesized by a language model fine-tuned on five years of Hacker News comments and seeded with biometric data from the 14 to maintain voice consistency. It generates enough ambient guilt in the developer population to sustain a baseline level of corporate open source funding, which is laundered back into the program's operating budget through a chain of fiscal sponsors that, if you follow the paperwork, all share a registered agent in Reston, Virginia.

A since-deleted blog post from 2019, cached by Google but no longer indexed, described the experience of attending a European open source conference and recognizing the same person presenting under two different names in two different rooms on the same day. The author posted a retraction the following week, stating that they had been mistaken and that the two presenters were different people who happened to look similar, a retraction that reads like it was written by someone who did not write their original post. The author's GitHub profile now says they are raising goats in Portugal, which is what open source maintainers' GitHub profiles always say when they stop posting.

The Jia Tan committee (#5) operated from three timezone clusters. The 14 would need at least that many to maintain global coverage. The Dependabot response-time data (#10) would reveal whether maintainer activity patterns across thousands of projects cluster into exactly 14 signatures. The node_modules ledger (#7) updates every eleven minutes, which is exactly the refresh interval you'd design if you needed 14 people to synchronize across timezones without a central server. The ghost installs that Pushkarev discovered (#2) could have been the 14's private registry, used to coordinate dependency versions across their 3,000 accounts without leaving a trace in the public index. And the Finnish military version control system (#3) would have been designed for exactly this kind of operation: a small team maintaining critical infrastructure across distributed nodes with intermittent connectivity.

You have mass-followed at least three of the 14 on GitHub and mass-starred their work, and you may have thanked one of them in a conference hallway for contributions to a project you use in production, without knowing that the person standing in front of you maintains nine hundred other projects under different names and was running on four hours of sleep because someone on the other side of the world filed a CVE against one of their Rust crates at 3am.

---

I'm not saying any of this is true. I'm saying the commit timestamps are public, the FOIA response is on file, the Reston address is in the corporate registry, and the number eleven keeps showing up in places where it has no business being. I'm not connecting these dots for you. I'm just pointing out that the dots are there, and that they are arranged in a shape, and that the shape is interesting. Do your own research.
