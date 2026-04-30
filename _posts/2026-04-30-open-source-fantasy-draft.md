---
layout: post
title: "Announcing the 2026 Open Source Fantasy Draft"
date: 2026-04-30 10:00 +0000
description: "Twelve teams, snake draft, standard scoring, no salary cap"
tags:
  - open-source
  - maintainers
  - satire
---

Registration is now open for the sixth season of the Open Source Fantasy League. Twelve teams, snake draft, standard scoring. The board goes live next Tuesday and as commissioner I'm publishing the rule changes and some notes on this year's class before everyone starts arguing in the group chat.

For anyone joining fresh: you draft a roster of maintainers, you score points when their packages get downloaded, you lose points when their packages get a CVE, and at the end of the season the winner chooses which charity receives the prize pool we forgot to collect. It's exactly like regular fantasy football except the players don't know they're playing, aren't paid, and can retire mid-season by archiving a repository.

### Roster slots

One BDFL, two Core, two Flex (a Flex can be a maintainer or a bot, so yes, you can still start Dependabot at Flex if you enjoy ninety pull requests and four points a week), one Defence, one Nebraska, four bench. The Nebraska slot is unchanged from last year: it must be filled by a single individual nobody in your household has heard of whose project is a transitive dependency of at least ten thousand other packages. Verification is on the honour system because there is no other system.

### Scoring

One point per million weekly downloads. Five points for cutting a release with actual release notes, two points if the release notes just say "bump". Minus ten for a CVE, minus forty if it gets a name and a logo, charged to the maintainer regardless of who actually introduced it or whether the reporter ran it past anyone before filing. The committee did consider charging these points to the companies that shipped the vulnerable version for eighteen months instead, but none of them are in the league. Three points for closing an issue without the reporter immediately reopening it. Fifteen bonus points if your maintainer replies to "is this project still maintained?" with a commit rather than a paragraph. Minus fifty, flat, if any maintainer on your active roster posts the words "stepping back" on a personal blog. You will not be warned in advance. Neither were they.

The salary cap remains at zero. There was a proposal over the summer to introduce one but the committee couldn't locate enough salaries to cap. We have instead introduced a luxury tax on any manager who drafts more than two maintainers employed by the same Foundation, payable in conference talk recordings nobody watches.

### Injury report

It's been a rough preseason. Two of last year's top ten are listed as Questionable (employer dissolved the open source program office), one is Doubtful (had a second child), one is Out (became a goat farmer), and one has been moved to Long Term IR after what the league office is describing only as "a very persistent new contributor with excellent test coverage". We wish them all well and remind managers that under Article 9 you cannot drop a maintainer from IR until they have logged back into the repository of their own free will.

### Defence

You draft one security researcher and they score whenever they find something in a package owned by an opposing manager. Anyone from Project Zero is once again ineligible on the grounds that it isn't fun for anyone else. Special Teams has been removed entirely after last season's incident where three managers started typosquat packages against each other and the registry had to get involved.

### Rookie class

This year's rookie pool is the deepest on record, in the sense that there are four hundred thousand new packages and roughly nine of them were written by a person. The league has reluctantly instituted a Combine. To be draft eligible a package must demonstrate one human-authored commit, a README that does not begin with the word "Certainly", and at least one function that cannot be replaced by a ternary. `is-even` has been grandfathered in as a Hall of Fame exhibit and is not eligible for selection, though it may be used as a tiebreaker.

The big board has the usual suspects at the top and I won't insult you by listing them. The interesting picks are in rounds four through seven, where you're choosing between a maintainer who ships every week but has visibly started replying to issues at 3am, and one who ships twice a year but has visibly started gardening. Historically the gardener outscores the insomniac over a full season but the insomniac wins you September. Draft for your conscience.

Sleepers I like: anyone who maintains a build tool people complain about daily, because nobody complains about software they've stopped using. Anyone whose project just got rewritten in Rust by someone else, because the original always outlives the rewrite by at least three seasons. Anyone who has turned off GitHub notifications, because the floor on a maintainer who can't see the comments is very high.

Sleepers I don't like: anyone whose package was recently added as a dependency by a company with a market cap over a trillion, because that's load with a press release. Anyone who has recently accepted their first co-maintainer after years alone, for reasons the league lawyers have asked me not to put in writing. Any project described in its own README as "blazingly" anything.

### Trades and keepers

The trade deadline is week eight. All trades are reviewed for collusion, which in this league means checking whether the two managers work for the same series-B startup and are about to vendor everything anyway. Trading a maintainer for exposure or for equity remains prohibited, and following last season's unpleasantness so is trading one to a private equity firm and continuing to score their downloads after the licence changes. Keeper eligibility now requires having merged something other than a lockfile in the last ninety days, after a manager kept a project last year on the strength of two hundred consecutive bot merges and a green badge.

A reminder that the Bus Factor stat displayed on the draft board is calculated, not measured, and the league accepts no responsibility for its accuracy. Several managers learned this the hard way last season when a project listed at BF 4 turned out to be one person and three OpenClaw bots in the contributor graph.

Finally, the committee has voted to retire the number 11 across the league in honour of `left-pad`. A small ceremony will be held before the week one fixtures during which we will all run `npm install` and sit quietly until it finishes.

Good luck to all managers. Draft sensibly, rotate your bench, and remember that under league rules you are permitted to say thank you to your roster at any time, even though it's not worth any points.
