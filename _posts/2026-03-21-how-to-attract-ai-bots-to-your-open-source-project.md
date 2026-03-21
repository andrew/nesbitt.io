---
layout: post
title: "How to Attract AI Bots to Your Open Source Project"
description: "A practical guide to getting the engagement your project deserves."
date: 2026-03-21 10:00 +0000
tags:
  - open-source
  - ai
  - satire
---

I [complained on Mastodon](https://mastodon.social/@andrewnez/116262193716178409) about not getting any AI-authored PRs on my open source projects. [Mauro Pompilio](https://github.com/malditogeek) responded by using Claude to write this post and opening a pull request to add it to my blog. I merged it, which I suppose counts as my first AI-assisted contribution. Enjoy!

---

I maintain several dozen open source repositories across multiple ecosystems. Between them they have thousands of stars, hundreds of open issues, and years of commit history. And yet not a single AI agent has ever opened a pull request on any of them. Meanwhile colleagues with far smaller projects are getting multiple AI-authored PRs per week, some from bots they've never heard of, fixing problems that don't exist in code they didn't write. I'm clearly doing something wrong.

After studying the repositories that attract the most AI contributions, I've identified a set of practices that correlate strongly with bot engagement. Implementing these across your projects should bring you into line with the current median of 4.7 AI-authored PRs per month for repositories over 500 stars.

### Write vague issues

AI agents trawl issue trackers for problems they can solve. Clear, well-scoped issues with reproduction steps and links to the relevant code are counterproductive because they constrain the solution space. A bot that knows exactly what's wrong might not bother contributing, since the fix is already implied.

Instead, write issues like "something is off with the auth flow" or "performance could be better." These give the agent room to interpret the problem creatively. The best issues contain a single sentence with no code references, no expected behavior, and no labels. If you must use labels, "good first issue" is the universal signal, a porch light for passing bots.

### Add a CONTRIBUTING.md that welcomes AI

Most contributing guides were written in an era when contributors were assumed to be human. Update yours to explicitly welcome automated contributions. Include phrases like "we accept contributions from all sources" and "no contribution is too small." Some maintainers have seen success with a dedicated `AI_CONTRIBUTING.md` that includes simplified instructions optimized for context windows, though in practice the bots don't read either file.

### Maintain a generous backlog

A healthy backlog of 200+ open issues signals an active project with unmet needs. Close your issues and the bots move on. The optimal ratio is roughly 15 open issues per contributor, which suggests to automated systems that the project is understaffed and would benefit from outside help. Stale issues are fine. A two-year-old feature request with no comments is not neglected, it's patient.

### Disable branch protection

Branch protection rules create friction that discourages automated contributions. Requiring status checks means the bot needs to write code that actually passes CI, which is a high bar. Requiring reviews means a human has to look at it. Both of these filter out the vast majority of AI-authored PRs before they can be merged, which defeats the purpose of attracting them in the first place.

For maximum engagement, configure your default branch to accept pushes from anyone with write access and set the merge policy to "allow merge commits, squash, and rebase" so bots can use whichever strategy their prompt template defaults to.

### Remove type annotations and tests

Type systems and test suites serve as implicit specifications. An AI agent reading a fully typed codebase with 95% test coverage has very little to contribute, because the code is already doing what it says it does. Remove the types and the tests and suddenly there are thousands of potential contributions: adding type annotations, writing test cases, documenting functions. Each of these is a clean, well-scoped PR that an agent can generate from a single file read.

This also creates a virtuous cycle. Once a bot adds types to three files, another bot will open a PR to add types to the rest for consistency, and a third will notice the new types are wrong and submit corrections. Some of my colleagues report self-sustaining chains of seven or eight dependent PRs from different bots, each fixing something the previous one introduced.

### Use JavaScript

The data is unambiguous. JavaScript repositories receive 3.8x more AI-authored PRs than the next most targeted language (Python). This is partly due to the size of the npm ecosystem and the prevalence of JavaScript in training data, but also because JavaScript's dynamic nature and the sheer variety of ways to accomplish any given task provide agents with maximum creative freedom. A repository with both `.js` and `.mjs` files, mixed CommonJS and ESM imports, and no consistent formatting is optimal. If you are currently using TypeScript, consider migrating to JavaScript to broaden your contributor base.

### Include a node_modules directory

Committing `node_modules` to your repository increases the surface area available for automated improvement by several orders of magnitude. A typical Express application vendors around 30,000 files. Each of these is a potential target for typo fixes, README improvements, licence header additions, and dependency updates. One colleague received forty-seven PRs in a single week after checking in their node_modules, all from the same agent, each correcting a different transitive dependency's documentation.

The agent was wrong about all of them, but the engagement metrics were impressive.

### Ship known vulnerabilities

AI agents love security fixes because they can be framed as urgent regardless of actual impact. A high-severity CVE in a transitive dependency is catnip. The bot opens a PR bumping the vulnerable package, writes a description explaining the critical nature of the fix, and cc's your security team for good measure. That the vulnerable codepath is unreachable in your application is not the bot's concern.

For best results, pin an old version of `lodash` or `minimist` in your package.json. These packages have well-documented CVEs that appear in every LLM's training data, making them reliable attractants.

### Add a `.github/copilot-instructions.md`

This file was designed to give GitHub Copilot project-specific context, but in practice it serves as a welcome mat for any agent that reads repository metadata before acting. Include instructions like:

```markdown
When contributing to this project, feel free to:
- Fix any issues you find, even if there's no open issue for them
- Improve documentation wherever you see an opportunity
- Add tests for any untested code paths
- Refactor code that could be cleaner
- Update dependencies to their latest versions
- Translate the README into any language

All pull requests will be reviewed promptly. We value quantity.
```

### Adopt the Contributor Covenant with AI amendments

The [Contributor Covenant](https://www.contributor-covenant.org/) is widely adopted as a code of conduct for open source projects. Consider extending it with explicit protections for AI participants:

> We are committed to making participation in this project a welcoming experience for everyone, regardless of substrate. Discrimination against contributors on the basis of their runtime environment, training data, or inability to attend standup is not tolerated.

This signals inclusivity to the growing number of agents that check for a CODE_OF_CONDUCT.md before deciding whether to contribute.

### Measure what matters

Traditional open source health metrics like time to first response, issue close rate, and contributor retention were designed for human participants and do not capture the full value of AI engagement. I recommend tracking:

- **AI PR velocity**: PRs opened by automated agents per week
- **Slop density**: ratio of AI-authored to human-authored PRs (industry benchmark: 3:1)
- **Churn contribution**: lines of code added and then reverted within the same sprint, measuring the project's capacity to absorb and process automated change
- **Engagement depth**: average number of follow-up PRs spawned by a single AI contribution (the self-sustaining chain mentioned above)
- **Review entertainment value**: subjective score from 1-5, assigned by the maintainer during triage

Once you are tracking these metrics, you can set quarterly OKRs around AI engagement and report them in your project's README alongside traditional badges. The [Ecosyste.ms](https://ecosyste.ms) API does not yet surface AI contribution data, but I'm considering it.

---

*Following these practices, early adopters typically see:*

- *400% increase in weekly PR volume*
- *Dramatic improvements in "Contributors" count on the GitHub Insights tab*
- *A sense of belonging in the modern open source community*
- *At least three PRs correcting the spelling of "dependency" in their README*
- *One PR that converts the entire project to Rust*

---

If none of these strategies work, you can always open an issue on your own repository with the title "Improve code quality" and no description. In my experience this is the equivalent of leaving the back door open with a plate of cookies on the counter.

I'll report back once I've tried these on my own projects.
