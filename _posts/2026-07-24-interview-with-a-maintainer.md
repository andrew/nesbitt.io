---
layout: post
title: "Interview with a Maintainer"
date: 2026-07-24 09:00:00
description: "Episode 214 of Green Squares."
tags:
  - open-source
  - ai
  - satire
---

*The following is a transcript of episode 214 of Green Squares, a podcast about building in public and staying green. It has been lightly edited for length and clarity. Transcription by OpenClaw-4.2.*

**TYLER:** Welcome back to Green Squares, I'm Tyler. Longtime listeners know I came up doing Proof of Work, rest in peace, and one thing I carried over from that show is a belief that the most interesting people in tech are the ones holding up infrastructure you've never heard of. You've all seen the xkcd. The whole internet, balanced on one project, maintained by some guy in Nebraska. Today we've got that guy. Erin Marsh maintains libcapstan, the reference implementation of the Capstan protocol. If you've ever resumed a download, synced a device, or updated an app on a bad connection, you've run her code. Erin, welcome to the show.

**ERIN:** Thanks for having me.

**TYLER:** So let's do the numbers, because they're wild. Eighty million downloads a month. Something like forty thousand packages depend on you. And it's basically just you?

**ERIN:** There were three of us until 2023. One co-maintainer left when he had kids. The other stepped back last year, he has a farm now. So mostly me, yes.

**TYLER:** Incredible. And you're calling in from New Zealand, which means it's currently, what,

**ERIN:** Six in the morning.

**TYLER:** The dedication. OK, origin story. How does one person end up maintaining a foundational protocol library?

**ERIN:** I reported some bugs in it. This was 2019, we used it at work, and the resume logic could corrupt files on flaky connections. I sent a report with a reproduction and a suggested fix, and the maintainer at the time said this was exactly the kind of energy the project needed, and gave me commit access. About a month later I got a repository transfer invitation. I accepted it. It seemed like the polite thing to do.

**TYLER:** He saw something in you.

**ERIN:** He'd moved onto a sailboat.

**TYLER:** Love that for him. So let's get into the AI of it all, because that's really why I wanted you on. You're one person supporting this enormous surface area. The new tooling has to be a huge unlock, right? Are you using any of the agents day to day?

**ERIN:** I've tried things. I had a Copilot subscription for a while.

**TYLER:** How was it?

**ERIN:** Mixed. The codebase is C from 2011, which the tooling has opinions about. In April I asked it to add a bounds check, and it reformatted the file from tabs to spaces on the way through. The linter flagged that, so it saw the failure and reformatted back to tabs. That introduced trailing whitespace, which the linter also flags. It went around that loop until my included tokens ran out. Nothing came back. I wrote the bounds check myself.

**TYLER:** Growing pains. But the trajectory is what excites me. What about the contribution side? Because the dream is that agents pick up the long tail, right, the issues no human wants to do.

**ERIN:** We get a lot of agent contributions now. Last month it was around sixty pull requests a week. They're polite, well formatted, and they come with tests. Most of them do something we don't want. There's an issue from 2016 about symlink handling where we've explained our position maybe two hundred times, and the agents find that issue and fix it, and each one has to be told separately. We added an AGENTS.md at the root of the repo asking automated contributors to check the tracker before opening anything. It's now the most edited file in the repository. They send fixes for it. One of the typos was real, so I merged that one.

**TYLER:** Sixty a week, though. Some of that has to be gold.

**ERIN:** Three were useful this year. One was excellent, actually, a race in the retry logic that none of us had caught in a decade. I'd like to thank whoever ran that agent, but the account was already deleted.

**TYLER:** So what would actually move the needle for you? If the people building these tools are listening, and they do listen, what do you want the agents doing?

**ERIN:** Review is the bottleneck, not code. What I'd really love is

**TYLER:** Hold that thought, because we have to pay some bills. This episode of Green Squares is brought to you by Foreman. You know the feeling. It's Sunday night, your contribution graph has a gap, and the side project isn't going to build itself. Foreman is the autonomous engineer that ships while you sleep. Point it at any repository, yours or anyone's, and Foreman finds the open issues, writes the fix, opens the pull request, and replies to review comments in your voice until it gets merged. Foreman users open an average of 340 pull requests a month across more than two thousand open source projects. Go to tryforeman.dev/green for twenty percent off your first three months. Foreman. Keep shipping. And we're back. Erin, you were saying, what would help?

**ERIN:** I don't remember where I was going with that.

**TYLER:** It'll come back to you. Let's talk security, because libcapstan is in everything, and everything means exposure. Walk me through what happens when a report comes in.

**ERIN:** We get about ten a month now, up from one or two a few years ago. Most are automated, a scanner finding, wrapped in a model-written report. The reports are long and very confident, and roughly one in fifteen describes a real problem. So the actual work is verification, and that part stays with me, because it's the one thing you have to get right.

**TYLER:** See, this feels like exactly what frontier models are for. Have you tried throwing AI at the verification itself?

**ERIN:** I did, last November. I set up an agent to take each incoming report, build the affected version, and try to reproduce the exploit in a sandbox. It worked well for two weeks.

**TYLER:** And then?

**ERIN:** The account was banned. Reproducing an exploit looks the same as developing one from the provider's side. I appealed, and the appeal form asks you to describe what you were doing, and describing it triggered the same filter. So the appeal got me banned as well.

**TYLER:** [laughs] There's got to be a path though. A research tier, something.

**ERIN:** There's a form. It asks for your institution.

**TYLER:** What about the human researchers? The security community catches so much these days, that relationship has to be valuable.

**ERIN:** The individuals are mostly great. The companies are harder. In February a vendor found a real issue in our header parsing, a bad one, and their analysis was good. They also filed it directly on the public issue tracker, proof of concept included, on a Tuesday. The writeup was scheduled for their blog that Wednesday, and their policy is ninety days or publication, whichever comes first. The vulnerability had a name and a logo before I finished reading the report. There was a countdown clock. I shipped the fix in twenty-six hours, and their post described that as an encouraging response from a historically under-resourced project. Then their sales team emailed companies that depend on us, offering a hardened version of libcapstan.

**TYLER:** Hardened how?

**ERIN:** As far as I can tell it's our releases with my security patches applied. They're on the embargo list, so they can ship my fix a few days before I do.

**TYLER:** I want to get to sustainability, but first, flip side. You're a downstream consumer too. You have your own dependency tree. What does that look like from where you sit?

**ERIN:** We have four dependencies. We had six. Last year I audited them and found problems in one, a checksum library, and reported everything upstream with patches. The maintainer thanked me, merged all of it, and two weeks later there was a transfer invitation waiting. I knew what it was this time. We depend on the library, so.

**TYLER:** Again?

**ERIN:** It's the second time it's happened. I now maintain a good chunk of my own dependency tree. I've stopped reporting bugs upstream.

**TYLER:** And you said six down to four.

**ERIN:** The other one we removed was a small library we'd depended on since 2014 for one function, so I inlined the function. And then I got a long email from its maintainer, because there's a company called WaveRiser that pays maintainers based on their position in dependency trees. Being removed from ours dropped him under some threshold, and he lost about four hundred dollars a month. He was apologetic about it. He offered me a hundred and fifty a month to add it back.

**TYLER:** Did you take it?

**ERIN:** It would have been the project's largest source of income.

**TYLER:** OK, that is actually a perfect segue, because, full disclosure, listeners already know this. This episode is also sponsored by WaveRiser. If your business runs on open source, and it does, WaveRiser makes sure the maintainers behind your stack are taken care of. Their dependency intelligence engine maps every package in your tree, scores each one for criticality, and routes funding automatically to the projects that matter most. No invoices, no phone calls with maintainers, no overhead. Enterprise plans start at ninety-nine dollars a seat. WaveRiser, the supply chain, sustained. And Erin, you must be glad they exist, honestly.

**ERIN:** They've never contacted me.

**TYLER:** Well, it's automatic. That's the whole product. It routes to the projects that matter most.

**ERIN:** Yes.

**TYLER:** While we're on money. You know my history, I spent three years in web3, and I'm curious whether any of that ever reached you. Token models for funding infrastructure, that whole thesis.

**ERIN:** It reached me once. In 2022 someone launched CapstanCoin. I learned about it eight months later, from the emails, because it had collapsed and the treasury had been drained, and some of the holders found my address in the git log. The website had a roadmap with my name on it. There was a whitepaper citing my commit history as proof of ongoing development, which I suppose it was. About two million dollars went through it, none of it to me, and for a while I was getting demands for refunds. One man emailed me for a year. He was always polite. He'd retired on the strength of it.

**TYLER:** Early days. The space matured a lot after that, though. Honestly the part that went mainstream is prediction markets. Does that world ever touch yours?

**ERIN:** There's a market on whether I'll step down before the end of the year. I found out about it when a stranger messaged me asking if I could hold on until January, because of the resolution date. And during the February disclosure there was one on how fast we'd patch. The vendor traded it before their post went out.

**TYLER:** Efficient markets. OK, I want to ask about capstan-rs, because I know it's a sensitive one. For listeners: last year a developer rewrote libcapstan in Rust over a weekend, capstan-rs, blazingly fast resumable transfers, that was the tagline, and it hit forty thousand stars in a month. Which, Erin, I checked, is ten times your stars. In a month. What did that feel like?

**ERIN:** The benchmarks measured throughput on a warm cache with resume disabled. Resume is the hard part. It's all edge cases, which is why the library exists. Rewrites get to skip that.

**TYLER:** Very gracious.

**ERIN:** He was hired by the company behind OpenClaw off the back of it, and the repository was archived in March. We still get issues asking when libcapstan is migrating to it.

**TYLER:** And then there's the fork. I debated even bringing this up.

**ERIN:** It's fine. Earlier this year we started blocking OpenClaw agents from the repo, because we kept getting pull requests that added the agent's operator to the copyright headers. So we blocked the traffic, and about six weeks later OpenClaw announced a clean-room implementation of the Capstan protocol, written, according to the announcement, without reference to our code.

**TYLER:** Competition keeps everyone sharp though, right?

**ERIN:** It reproduces a bug we've had open since 2021. Byte for byte, the same wrong output. We have a regression test for it, named after the issue number, and their test suite has a test with the same name that asserts the wrong output is correct. I filed an issue about it. Their tracker has about five thousand open, mostly from other agents, and the triage bot answers them in order. It hasn't got to mine yet.

**TYLER:** OK, sustainability, properly this time. Because I hear all of this and I think, this is a funding problem, and there is more money pointed at open source than ever. Foundations, the sovereign tech funds, all of it. Have you gone after any?

**ERIN:** I applied for a grant last year. The protocol is being extended for multipath, and libcapstan is the reference implementation, so whatever we ship becomes the standard in practice. I asked for six months of funding to do the design work properly, with a spec, instead of at eleven at night.

**TYLER:** Slam dunk, surely.

**ERIN:** Declined. The criteria weight participation in the standards process, and I've never been able to join the working group. The working group meets on a video platform that doesn't work in Firefox, and I use Firefox. I raised it, and the group agreed it was a problem, and raised it with the platform, and the platform's position is that Firefox is not a supported enterprise browser. So on paper I have no standards experience. The reviewers said the implementation work was impressive, but that implementation is not participation.

**TYLER:** Couldn't you just use Chrome for the calls?

**ERIN:** I've considered it.

**TYLER:** All right, closing questions, we do these with every guest. Five years from now, where's libcapstan?

**ERIN:** Still underneath everything, I expect. It's very hard to remove.

**TYLER:** And where are you?

**ERIN:** My old co-maintainer's farm is doing well. Sixty goats now, and the cheese has a waiting list. I joined it.

**TYLER:** [laughs] Amazing. Erin, this was fantastic. Where do people go to support the project?

**ERIN:** There's a sponsors link in the readme.

**TYLER:** Perfect, we'll put it in the show notes. And before we go, a quick one from our friends at AgentDays, September 14th to 16th in Austin. Conference season is rough when you're heads down, so this year, register your agents and they attend for you. Every talk published as structured context, and a networking layer where your agents take meetings while you sleep. Erin, this might be one for you, honestly.

**ERIN:** Mm.

**TYLER:** Agent passes start at forty-nine dollars, humans get in free with any agent pass, code SQUARES for ten percent off. And you can support this show at patreon.com/greensquares, we just crossed four thousand patrons, which is very cool of you all. That's the episode. If you got value out of this one, the single best thing you can do is share it with a friend. Next week I sit down with the founder of Foreman to talk about the future of autonomous contribution. Until then. Keep shipping.
