---
layout: post
title: "Weekend at Bernie's II"
date: 2026-11-06 10:00 +0000
description: "Six months on, which of your dependencies are still wearing sunglasses?"
tags:
  - open-source
  - security
  - maintainers
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mzntfbe7ca2q"
---

Six months after [Weekend at Bernie's](/2026/05/08/weekend-at-bernies.html), **421** of the critical repos that were dead, dormant or unknown in May are active again. In the [1993 sequel](https://en.wikipedia.org/wiki/Weekend_at_Bernie%27s_II), Bernie is brought back by a voodoo ceremony that goes slightly wrong, and the result is a corpse that moves whenever it hears music. In nearly a quarter of the revived repos the music shows up in the commit history as a coding agent, with most of those commits made by the repo's own top committer.

In the previous post I sorted the repos behind the [ecosyste.ms](https://ecosyste.ms) critical packages into four buckets, and a follow-up went through the [ways a project ends up dead](/2026/05/19/dumb-ways-for-an-open-source-project-to-die.html):

- Active: regular non-bot commits to the default branch, or a release, in the past year.
- Dormant: little or no development, but someone with write access has closed an issue, merged a PR or pushed a commit in the past year.
- Dead: archived, or with issues and PRs filed in the past year and no response from anyone with write access.
- Unknown: no issues, PRs or activity in the past year, so responsiveness hasn't been tested.

In the previous post I predicted that AI-assisted vulnerability discovery was about to test the quiet ones: "The first security report against any of them will be that test." I re-ran the same pipeline with the same classifier at the start of November, and the headline split is within two points of May's:

|                                      |   May | November | change |
|--------------------------------------|------:|---------:|-------:|
| critical repos                       | 5,874 |    6,106 |   +232 |
| active                               | 48.8% |    49.9% |   +1.1 |
| dormant                              | 20.2% |    18.7% |   -1.5 |
| dead                                 | 12.1% |    11.8% |   -0.3 |
| unknown                              | 18.9% |    19.5% |   +0.6 |
| dead and archived                    |   322 |      361 |    +39 |
| dead and not archived 😎             |   391 |      361 |    -30 |
| advisories with no patched version   |   110 |      133 |    +23 |

Running [May's classifier](https://github.com/andrew/weekend-at-bernies/blob/4783068/classify.rb) over November's data changes only 23 buckets, so the changes come from activity in the repos, plus older issues and releases dropping out of the one-year window. 421 repos went from dormant, dead or unknown to active, and 295 that were active, dormant or unknown in May are now dead.

### Who came back

Registry maintainer lists changed on the packages of only 16 of the 421 revived repos. Checked against the commit history, one of those is a renamed account, seven are staff rotating inside organisations like Docker and Google, and two added an account with no commits since, which leaves six where a new person took on the work. The registry maintainer lists were unchanged on the other 405. Abandoned-package policies at most registries are built around transferring a dead package to a new owner, one of the few [ways projects change hands](/2026/06/16/how-open-source-projects-change-hands.html), and ownership changes were rare among these revivals.

To see what those returning maintainers were working with, I ran CHAOSS's [disclosure](https://github.com/chaoss/disclosure) tool over every commit in the 416 revived repos hosted on GitHub, covering the year since last November, which is the same measurement I [ran across the whole critical set](/2026/08/06/a-year-of-ai-disclosure-in-critical-packages.html) in August. It matches co-author trailers, agent bot emails, agent branch names and similar signals, so the numbers are a lower bound.

In the six months before May, **3.3%** of human-authored commits in those repos carried an AI disclosure, spread over 22 repos. In the six months since, it was **7.9%** over 95 repos, 778 commits in all, and 566 of them came from each repo's own top committer, usually with a Claude Code trailer. Every disclosed AI commit in the dead and unknown revivals dates from after May, and 10 of the 47 dead ones and 8 of the 64 unknown ones have them.

The heaviest agent users among the revivals include:

- [python-json-patch](https://github.com/stefankoegl/python-json-patch) and [lz4](https://github.com/pierrec/lz4) were both dormant in May, and have 123 and 75 agent-assisted commits.
- [rack-proxy](https://github.com/ncr/rack-proxy) was dead. Jacek Becela, who wrote it, has made 39 agent-assisted commits since, the repo now has a `CLAUDE.md` and an `AGENTS.md`, and it shipped [1.0.0](https://github.com/ncr/rack-proxy/releases/tag/v1.0.0) in July as "the modernization + security-hardening release", [2.0.0](https://github.com/ncr/rack-proxy/releases/tag/v2.0.0) in September with HTTP framing hardening, and [1.0.3](https://github.com/ncr/rack-proxy/releases/tag/v1.0.3) as a security patch for the 1.x line.
- [net-sftp](https://github.com/net-ssh/net-sftp) was dead and has 29 agent-assisted commits, a mix of Codex and Claude Code.
- [CEnum.jl](https://github.com/JuliaInterop/CEnum.jl), a Julia package that was dead in May, has 27.
- [zip-archive](https://github.com/jgm/zip-archive), a Haskell package that was unknown in May, now has 16.

My read of these commit logs is that the agents made the backlog on a finished-but-neglected library small enough to clear, and the maintainers who already knew the code were the ones best placed to check what the agent produced. Running the scan also turned up two gaps in the tool's detection, and I've [sent](https://github.com/chaoss/disclosure/pull/120) [fixes](https://github.com/chaoss/disclosure/pull/121) for both.

### Fixes and advisories

Maintainers released fixes for vulnerabilities in their own code in 43 of the revived repos since May. Where the maintainer also published a repository advisory, 19 of 20 went up within a day of the fixed release, and the wait came afterwards, while the advisory was in GitHub's queue for review into the global Advisory Database:

- [crass](https://github.com/rgrove/crass), a Ruby CSS parser, had its last issue, PR or commit more than a year before May. Ryan Grove released [1.0.7](https://github.com/rgrove/crass/releases/tag/v1.0.7) on 25 June with fixes for four denial-of-service bugs and published the four repository advisories the same day. They reached the reviewed database 116 to 125 days later, including [GHSA-6wmf-3r64-vcwv](https://github.com/advisories/GHSA-6wmf-3r64-vcwv) on 20 October.
- [decode-uri-component](https://github.com/SamVerschueren/decode-uri-component) had been dead since 2022. Sam Verschueren rewrote the decoder and published [GHSA-vcc3-ghjq-m6fr](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr) on 29 June, and it was reviewed 63 days later. A second fix and advisory on 23 October, [GHSA-qr28-fpjm-wq7f](https://github.com/advisories/GHSA-qr28-fpjm-wq7f), were reviewed within a week.
- [moment](https://github.com/moment/moment) shipped [2.31.0](https://github.com/moment/moment/releases/tag/2.31.0) on 15 September with a fix for a path traversal through crafted locale names, and published [GHSA-4p3w-j4w9-5jqw](https://github.com/advisories/GHSA-4p3w-j4w9-5jqw) the same day, which was reviewed two weeks later. Matt Johnson-Pint wrote 41 of the 68 commits since July.
- [rubyntlm](https://github.com/WinRb/rubyntlm), dead in May, released [0.6.6](https://github.com/WinRb/rubyntlm/releases/tag/v0.6.6) on 9 September to fix an authentication bypass where NTLMv2 responses were being verified against an empty password. Its repository advisory went up the same day, and two months later it is still missing from the reviewed database.

GitHub [wrote about the backlog](https://github.blog/security/supply-chain-security/inside-the-advisory-database-and-what-happens-when-vulnerability-volume-breaks-records) in June. Private vulnerability reports went from about 550 a week in January to more than 3,000 a week for most of May, and "since mid-April, due to this surge, we have not consistently met our internal goals for publication."

Across the 1,011 advisories since May that have both a repository advisory and a dated fix, the median gap between the fixed release and the maintainer's advisory is zero days in every bucket. The median wait from there to the reviewed database was **11 days** for repos that were active in May and **38 days** for repos that were dormant, dead or unknown. Dependabot and `npm audit` read the reviewed database, so during that wait the users of a revived package get no alert, even though the fixed version and the maintainer's advisory are both public.

GitHub says it prioritises review by "project impact and severity". The previously inactive repos waited longer in every severity band, and the ten of their advisories published in June waited 81 days on average, against 17 for advisories from active repos published the same month. That's 20 advisories in all, five of them from crass, so it's a pattern and not proof, and my guess is that a package with years of silence in its repo scores low on project impact.

Six of the 43 fixes have an AI tool visible in a release note, branch name or commit:

- [fribidi](https://github.com/fribidi/fribidi), dormant in May, lists "Security and robustness fixes found by an automated scan (Anthropic's OSS Scanner)" in its [1.0.18 release](https://github.com/fribidi/fribidi/releases/tag/v1.0.18), including an out-of-bounds write.
- The maintainers of [Spock](https://github.com/agrafix/Spock) and [ruby-domain_name](https://github.com/knu/ruby-domain_name) merged `codex/` branches.
- [openid_connect](https://github.com/nov/openid_connect) has a Copilot Autofix commit, and [ssl_verify_fun](https://github.com/deadtrickster/ssl_verify_fun.erl) and [iqlusioninc/crates](https://github.com/iqlusioninc/crates) have Claude-authored ones.

### Unanswered reports

Of the 1,086 repos that were unknown in May, 189 got an outside issue or PR since then, which is the test the previous post described. In 94 of them a maintainer closed or merged something, and 17 more had maintainer commits while the outside item went unanswered. The other 78 had no maintainer activity and moved to the dead bucket. Of the 1,171 repos that were dormant in May, which I flagged in the previous post as the bigger worry, 107 are now dead and 310 are active, about three revivals for every new death.

1,345 advisories were published against packages in the set between May and November, and 8.5% of the repos that were active in May got at least one, against about 1% of dormant and dead repos and 0.3% of unknown ones. Those rates count reports that became public, and a public advisory needs someone to receive the private report, write the fix and publish the advisory alongside the release. A private report sent to an unattended repo reaches an advisory database only if the reporter publishes it themselves, so the low rate on dead repos is a poor measure of how many reports they received.

In July a security engineer at Datadog [opened an issue](https://github.com/xeipuuv/gojsonschema/issues/389) on [gojsonschema](https://github.com/xeipuuv/gojsonschema), a Go library with about 30,000 dependent repos, saying they'd found what they believed were vulnerabilities and asking the maintainers to turn on GitHub's private vulnerability reporting or share a contact address, and it has had zero comments since. Other reporters filed publicly instead: one now-dead repo has two open issues titled "[security disclosure]", another has two titled "Security Advisory", and all four are unanswered. Finding someone to send a report to is one of the steps I built [Scrutineer](/2026/06/25/scrutineer.html) to handle, because AI scanners have made finding the bugs the easy part.

The repos that were active, dormant or unknown in May and are now dead without being archived have 250 open pull requests from outside contributors, all opened in the same six months. I scanned the 103 I could reach on the formerly unknown repos, and 24 disclose AI use, in a trailer, a branch name, or a line like "Drafted with OpenAI Codex." at the bottom of the description. Those 103 PRs are open against 59 repos, and the latest release on each of them predates May.

Between the end of August and the start of September, Oskar Eichler sent pull requests, most of them from `codex/` branches, to at least 14 Ruby and JavaScript repos in the set: small fixes and hardening changes, some with a severity like `[MEDIUM]` in the title. The maintainers of [net-sftp](https://github.com/net-ssh/net-sftp), which was dead in May, merged 15 of them, and the maintainers of [net-scp](https://github.com/net-ssh/net-scp) merged 10. The ones on repos that are dead now have had no maintainer reply since they were opened.

On faye's [websocket-extensions-ruby](https://github.com/faye/websocket-extensions-ruby), James Coglan [replied](https://github.com/faye/websocket-extensions-ruby/pull/8) within a day asking what bug the changes fixed, and said the project doesn't accept code authored by LLMs or agents without meaningful human input. Eichler closed all seven PRs there himself, saying he couldn't honestly provide that context. As with the AI scanner findings against curl I [wrote about in May](/2026/05/12/not-a-security-issue.html), the project had a stated policy to point to.

### Releases

Of the 3,198 packages in the set that were dormant, dead or unknown in May, 348 have had a new version published since and **2,850** have not. Counted by repo, maintainers published a release for 322 of the 421 revived repos, and on the other 99 the commits and merged PRs since May are unreleased. Until those releases ship, the [patching and forking workarounds](/2026/05/01/patching-and-forking-in-package-managers.html) are the remaining option, and each downstream user has to apply them separately.

In the previous post I counted 110 advisories with no patched version, and the same measure gives 133 now. Two more are on packages whose metadata has no repository URL, which makes 135, and most of them come from how advisories are keyed: an advisory counts as unpatched per package name, so when maintainers rename a project or adopt a new major version path, every advisory on the old name counts as unpatched even when the advisory lists the fix under the new one.

- 61 have a fix recorded in the advisory itself under a different package: [phpoffice/phpexcel](https://packagist.org/packages/phpoffice/phpexcel) alone has 19 that were fixed in [PhpSpreadsheet](https://github.com/PHPOffice/PhpSpreadsheet), [netty](https://github.com/netty/netty) 3 has 9 fixed in netty 4's modules, and [github.com/docker/docker](https://pkg.go.dev/github.com/docker/docker) has 4 fixed in [github.com/moby/moby/v2](https://pkg.go.dev/github.com/moby/moby/v2).
- 17 are against end-of-life lines whose advisories omit the successor, like [log4j 1.x](https://central.sonatype.com/artifact/log4j/log4j) and [jackson-mapper-asl](https://central.sonatype.com/artifact/org.codehaus.jackson/jackson-mapper-asl).
- 15 describe behaviour that's by design or documented, and 9 are misattributed or about code removed years ago.
- 4 were rejected or disputed by NVD, and 4 are versions that were published with malware in them.

25 advisories have no fix in any version, and 20 of those are on active repos. Debian marks 57 of the 135 as resolved in its own packages, and language registries, which [work like Debian unstable](/2026/05/15/language-registries-are-unstable-by-default.html), have no equivalent downstream packager.

### Archived and deleted

44 repos in the set were archived since May, which closes the project on the record instead of leaving the issue tracker open. webpack archived six of its loaders and plugins, including [css-loader](https://github.com/webpack/css-loader) and [copy-webpack-plugin](https://github.com/webpack/copy-webpack-plugin), several with a final commit pointing users at the equivalent now built into webpack. jsdom marked [cssstyle](https://github.com/jsdom/cssstyle) and [js-symbol-tree](https://github.com/jsdom/js-symbol-tree) as unmaintained, and rust-lang archived [lazy-static](https://github.com/rust-lang-nursery/lazy-static.rs) with a deprecation notice and [cfg-if](https://github.com/rust-lang/cfg-if) alongside it. Those ten packages have about 16 million dependent repos between them.

Fourteen repos behind critical packages have been deleted, and seven of them belonged to [substack](https://web.archive.org/web/20220804032815/https://github.com/substack), whose GitHub account is also gone: [wordwrap](https://www.npmjs.com/package/wordwrap), [text-table](https://www.npmjs.com/package/text-table), [commondir](https://www.npmjs.com/package/commondir), [archy](https://www.npmjs.com/package/archy), [semver-compare](https://www.npmjs.com/package/semver-compare) and two more. Those packages still install from npm, where six of the seven list a single maintainer, [nopersonsmodules](https://www.npmjs.com/~nopersonsmodules), and that npm account is the only remaining place to send a report or ask for a release. The classifier reads issue data from the repo, so all fourteen are classified as unknown regardless of how many reports they receive.

See you in another six months. Until then, be suspicious of any dependency wearing sunglasses indoors.

🕶️
