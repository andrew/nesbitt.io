---
layout: post
title: "A year of AI disclosure in critical packages"
description: "Assisted-By: Daniel Stenberg"
tags:
  - open-source
  - ai
  - metrics
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mshwg7syug2a"
---

Stephen O'Grady's [RedMonk analysis of who is writing open source code](https://redmonk.com/sogrady/2026/07/30/writing-open-source/) looked at commits to fifteen large projects during the first half of 2026 and counted two forms of declared AI involvement: a known autonomous agent as the commit author, or a known AI identity in a `Co-Authored-By` trailer. The result was under one percent, framed as a floor.

I ran a wider version of the same measurement over the [packages.ecosyste.ms](https://packages.ecosyste.ms/) critical set: 5,682 GitHub repositories behind the most-depended-on packages across sixteen registries, using the [CHAOSS disclosure](https://github.com/chaoss/disclosure) library to detect four kinds of explicit signal instead of two. Over the same six months the rate was 4.13%. Over the year ending 29 July 2026 it was 2.93% (17,279 of 589,798 non-merge commits), rising from 0.48% last August to 5.32% this July.

These are counts of commits where someone left an explicit marker in git metadata. Undeclared use is not measured, and a commit is one unit regardless of whether it changed one line or ten thousand.

## Sample selection versus detector choice

Running my scanner against RedMonk's fifteen repositories with only their two signals found 94 matches in 23,346 first-half commits including merges, or 0.40%, against RedMonk's "~24K commits" and a match count "in the dozens". Excluding merges leaves 17,323 commits and the same 94 matches, or 0.54%; `espressif/esp-idf` and `openssl/openssl` supply 71 of them, matching RedMonk's reported 73% concentration in two projects.

| sample and signals | commits | marked | share |
|--------------------|--------:|-------:|------:|
| RedMonk 15, agent author or known AI co-author | 17,323 | 94 | 0.54% |
| RedMonk 15, all validated disclosure signals | 17,323 | 182 | 1.05% |
| Critical GitHub set, agent author or known AI co-author | 308,354 | 11,002 | 3.57% |
| Critical GitHub set, all validated disclosure signals | 308,354 | 12,720 | 4.13% |

Adding the two extra signal types moved the rate by about half a percentage point on either sample. Changing the sample moved it by three points. RedMonk's fifteen were chosen by contributor-base size with, in O'Grady's words, a deliberate bias towards C; the critical package set is whatever sits at the top of each registry's dependency graph, which pulls in a lot of smaller, newer, company-run repositories.

## What I counted

The critical snapshot contained 8,605 packages, with repository URLs and metadata pulled from the same package cache I built for [Weekend at Bernie's](/2026/05/08/weekend-at-bernies.html). Merging packages that share a repository, following renames, restricting to GitHub, and dropping malformed URLs left 5,707 candidates. 5,682 cloned successfully; the other 25 were deleted or private. 3,533 had at least one non-merge commit in the year ending 29 July 2026.

Each repository was cloned bare with a tree filter and a shallow date boundary, streamed through the disclosure library, and deleted. The full pass transferred about 1 GB and the retained checkpoint is 16 MB of per-repository summaries and matched commit SHAs.

Rename following checks GitHub's stable repository ID as well as the redirect. The npm package `base` still lists `node-base/base` as its repository. GitHub reused the org name, so that path now redirects to the Base blockchain monorepo, which would have contributed 3,135 commits and 273 AI signals to a nine-year-old npm utility. The ID check excluded it.

Every non-merge commit was checked for:

- a known AI agent as author or committer
- a known AI identity in `Co-Authored-By`
- an `Assisted-By` trailer naming an AI tool or model
- a tool-specific attribution format that disclosure supports

Merges are excluded so projects that squash, rebase, or merge count on the same basis. Commits are bucketed by committer time, when the change landed on the current branch. Mentions of tool names in ordinary commit prose are ignored. `Assisted-By` values are validated because the trailer is also used for people: raw matches included `Assisted-By: Daniel Stenberg` and `Assisted-By: Automated Tooling, Human Reviewed.` The clones did not fetch `refs/notes/ai`, so declarations recorded as git notes are absent.

## Over the year

![Line chart of monthly explicit AI signals. Total signals rise from 0.48% in August 2025 to 5.32% in July 2026. Declared assistance supplies nearly all of the increase, while autonomous-agent identities end close to where they began after varying during the year.](/data/ai-contributions/monthly-disclosure.svg)

The monthly rate passed 3% in February and 5% in March, then held between 4.58% and 5.32% through July. Counting repositories instead of commits, a signal appeared in 41 of the 1,734 repositories with commits in August 2025 (2.4%) and 276 of 1,793 in July 2026 (15.4%).

Of the 17,279 findings, 4,625 carry only an autonomous-agent identity, 12,628 carry only a declared-assistance signal, and 26 carry both. Declared assistance went from 0.08% of commits in August to 4.92% in July. Agent authorship started at 0.40% and ended at 0.41%, peaking at 1.33% in between; 4,613 of those commits have GitHub Copilot's agent as author, 38 have Devin's, and Claude, Cursor, Codex, and Amazon Q account for 25 between them. Copilot agent commits reached 745 in March across 85 repositories and fell to 208 across 35 in July, with individual projects running the agent in short bursts: `pycqa/isort` had 49 in March and none after, `azure/azure-sdk-for-net` had 275 in February and 28 in March.

The February and March step in the total is Claude Code `Co-Authored-By` trailers. Those went from 97 commits in December to 325, 753, and 2,037 over the following three months, and from 39 distinct repositories to 190. Cursor's co-author trailers rose from 1 to 48 over the same months and Copilot's from 1 to 2, so the step is specific to one tool rather than a general change in disclosure practice. Anthropic released [Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6) on 5 February and [Sonnet 4.6](https://www.anthropic.com/news/claude-sonnet-4-6) on 17 February; March is the first full month with both available.

The findings carry 231 distinct declared tool strings across 17,392 occurrences. Grouping them by client family, and separately by model or provider where no client is named:

| declared as | occurrences | share |
|-------------|------------:|------:|
| Claude Code | 9,974 | 57.35% |
| GitHub Copilot | 4,857 | 27.93% |
| Cursor | 773 | 4.44% |
| Codex | 236 | 1.36% |
| OpenCode | 69 | 0.40% |
| Claude or Anthropic (model only) | 1,135 | 6.53% |
| OpenAI or GPT (model only) | 118 | 0.68% |
| Gemini or Google (model only) | 70 | 0.40% |

The raw declared strings are in the summary JSON; the grouping is mine and a value naming two clients counts in both.

At the repository level, 687 of the 3,533 active repositories recorded at least one signal over the year, so the median active repository's rate is zero. The ten repositories with the most findings account for 40.8% of the total and the top hundred for 84.9%.

<object type="image/svg+xml" data="/data/ai-contributions/repository-concentration.svg" style="width:100%" aria-label="Treemap of 17,279 validated AI findings across 687 repositories, area proportional to finding count. llvm-project (1,351), dotnet/runtime (955), harfbuzz (799), storybook (758), and pandas (680) are the largest; the remaining 637 repositories share 4,673 findings between them. 2,846 further active repositories had zero findings and are not shown."></object>

## By ecosystem

`go-git` shows what the extra detectors add in one repository: 269 of its 731 commits carry a validated signal, 12 of which match RedMonk's narrow rules. The rest are `Assisted-By` trailers and tool attributions.

Nine of the sixteen ecosystems had at least 30,000 commits in the window:

| package ecosystem | commits | validated share | repositories | with instructions |
|-------------------|--------:|----------------:|-------------:|------------------:|
| NuGet | 41,523 | 6.84% | 74 | 40.54% |
| npm | 87,357 | 3.72% | 1,578 | 3.11% |
| RubyGems | 40,889 | 3.59% | 670 | 6.12% |
| Conda | 144,227 | 3.31% | 264 | 12.12% |
| Go | 34,117 | 3.07% | 545 | 5.87% |
| PyPI | 124,641 | 2.57% | 451 | 12.42% |
| Cargo | 30,620 | 1.96% | 570 | 2.46% |
| Packagist | 37,267 | 1.73% | 547 | 10.24% |
| Maven | 100,539 | 1.60% | 273 | 16.12% |

The other seven, from CocoaPods at 13,581 commits down to Julia at 682, are in the summary JSON. Julia's 51 findings in 682 commits give it the highest rate in the set at 7.47%, on the smallest sample.

NuGet's 6.84% is a Microsoft deployment. Repositories under `aspnet`, `azure`, `azuread`, `dotnet`, `microsoft`, and `nuget` supplied 2,716 of the 2,842 NuGet findings (95.6%), and 2,634 of those are autonomous-agent identities. Remove those owners and NuGet falls to 126 findings in 14,283 commits, or 0.88%, below Maven. I have only run that owner exclusion for NuGet; the per-repository CSV has what's needed to do it for the others.

## Instruction files

A separate pass over the same 5,682 default-branch heads checked for committed instructions to coding agents: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and the documented Copilot, Cursor, Cline, Windsurf, and Continue rule paths. 353 repositories (6.21%) have at least one, holding 1,091 files between them. A file's presence records that someone set up guidance for an agent; it attributes nothing to any commit.

| instruction type | repositories | share of scanned repositories | files |
|------------------|-------------:|------------------------------:|------:|
| `AGENTS.md` | 240 | 4.22% | 571 |
| `CLAUDE.md` | 204 | 3.59% | 340 |
| GitHub Copilot instructions | 84 | 1.48% | 154 |
| Cursor rules | 11 | 0.19% | 14 |
| `GEMINI.md` | 8 | 0.14% | 8 |
| Cline rules | 1 | 0.02% | 4 |
| Windsurf rules | 0 | 0% | 0 |
| Continue rules | 0 | 0% | 0 |

![Line chart of the cumulative share of critical GitHub repositories with a current AI instruction file. The share rises from 0.07% in March 2025 to 6.21% in July 2026, with the fastest growth during 2026.](/data/ai-contributions/instruction-file-adoption.svg)

Each repository is counted once, in the month its earliest surviving instruction file was added, so Cypress with 118 files counts the same as a project with one. Only files present on current heads are visible, so anything added and later deleted is absent from the timeline.

228 of the 353 repositories also have a disclosed commit in the year. 94 of those added their earliest instruction file before their first disclosed commit, 98 added it after, and 36 on the same day; the median gap is zero. The other 125 have an instruction file and no disclosed commit in the window.

## Data

The scanner and report generator are at [andrew/critical-ai-scan](https://github.com/andrew/critical-ai-scan). The [summary JSON](https://github.com/andrew/critical-ai-scan/blob/main/data/critical-github-summary.json) has the overall, monthly, ecosystem, signal, tool, and leading-repository counts. The [repository CSV](https://github.com/andrew/critical-ai-scan/blob/main/data/critical-github-repositories.csv) has one row per successful scan with the exact default-branch head used, so individual cases can be checked without recloning. The [instruction-file report](https://github.com/andrew/critical-ai-scan/blob/main/data/critical-github-instructions.json) lists every matched path with its category and the commit that added it.
