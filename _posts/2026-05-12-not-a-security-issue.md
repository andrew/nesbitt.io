---
layout: post
title: "Not a Security Issue"
date: 2026-05-12 10:00 +0000
description: "How curl's disclosure policy filtered an AI scanner's findings at source"
tags:
  - security
  - open-source
  - ai
---

As part of my work with [Alpha-Omega](https://alpha-omega.dev), and at Daniel's request, I recently ran an AI-assisted security scan over the curl source tree, mostly to see what the current generation of tools would produce against a codebase that has already had every fuzzer and auditor on earth pointed at it. The findings were better than I expected, and one reason stood out: the scanner had read [`docs/VULN-DISCLOSURE-POLICY.md`](https://github.com/curl/curl/blob/master/docs/VULN-DISCLOSURE-POLICY.md) and applied it.

A whole class of results came back labelled in effect "real bug, worth fixing, but not a security issue per the project's own policy": server-triggered NULL dereferences, small leaks, things that only fire if you can already control the command line. The tool had found them, checked them against curl's published list of what doesn't count, and demoted them before I had to.

One example I can share, since by definition it isn't sensitive: the scanner found that `tool_formparse.c` walks a linked list of `-F` form parts recursively with no depth limit, built a 150k-line config file to prove it, and got an ASan stack-overflow trace out the other end. It then wrote, in its own summary, "trigger requires user to run curl with attacker-supplied config or args, so excluded by policy," filed it under quality bugs, and moved on. A small `ber_free` leak on an LDAP error path got the same treatment with a terser "policy excludes small leaks." The scan did turn up things I can't talk about yet, which is rather the point, but the noise floor was lower than I've seen from comparable runs on projects without a written policy.

Almost everything written about AI-generated security reports over the past few months is about what to do once they land in your inbox. Daniel has [written](https://daniel.haxx.se/blog/) and [spoken](https://opensourcesecurity.io/2025/2025-05-curl_vs_ai_with_daniel_stenberg/) about it at length, Seth Larson [called it early](https://sethmlarson.dev/slop-security-reports) from the Python side, ISC [reported](https://www.isc.org/blogs/2026-04-16-How-to-report-a-vulnerability/) an 89% false-positive rate on one platform, and there's an [OpenSSF working group effort](https://github.com/ossf/wg-vulnerability-disclosures/issues/178) collecting triage practices. All of that addresses the receiving end, whereas the curl scan suggested the same documents that help a human triager can be loaded into the scanner's context and suppress findings before anyone has to read them.

Agentic scanners read the repository as they go, pulling in `SECURITY.md`, `CONTRIBUTING.md`, and anything that looks like policy, because they're built on the same scaffolding as coding agents. A maintainer has no say over who points a scanner at the repo, but the files sitting there when it arrives are entirely theirs.

## VULN-DISCLOSURE-POLICY.md

The [section](https://github.com/curl/curl/blob/master/docs/VULN-DISCLOSURE-POLICY.md#not-security-issues) that did the work is headed "Not security issues" and lists sixteen named categories, covering things like small memory leaks, never-ending transfers, NULL dereferences triggered by a malicious server, busy-loops that eventually end, escape sequences in terminal output, weak algorithms that a protocol requires, and anything that depends on tricking the user into running a crafted command line.

Each entry gets a paragraph of reasoning: the busy-loop one says applications already have to handle the transfer loop legitimately running at 100% CPU, so a prolonged one is a bug rather than a vulnerability, and the command-line one points out that an attacker who can make you run a crafted curl invocation could make you run `sudo rm -rf /` instead.

The reasoning is what lets a reader, human or otherwise, apply the rule to cases the list didn't anticipate, and the categories only work because they're specific to curl. A generic "DoS is out of scope" line wouldn't have helped, but "never-ending transfers are not security issues because applications already need countermeasures for stalled connections" is something a tool can match a finding against.

## Prior art

[Node.js](https://github.com/nodejs/node/blob/main/SECURITY.md) embeds a full threat model in `SECURITY.md` with explicit trust boundaries, listing what the runtime does not trust (inbound network data, file content opened via the API) against what it does (the operating system, the developer's own code), and sets a high bar for DoS reports by requiring asymmetric resource consumption and ruling out anything mitigable by ordinary process recycling.

[Django's policy](https://docs.djangoproject.com/en/dev/internals/security/) gives worked code examples of reports that are "not considered valid", mostly variations on passing unsanitised input to an internal function and blaming the function. It also asks reporters not to include CVSS scores, severity assessments, or "lengthy background sections", which is a fairly direct description of what an LLM produces by default.

[Chrome's security FAQ](https://chromium.googlesource.com/chromium/src/+/main/docs/security/faq.md) is the source of the most-borrowed single exclusion in the genre, that a physically-local attacker who can already run code as you is out of scope because the browser can't defend against the operating system.

I [collected](https://gist.github.com/andrew/4002775fc189c5ce7a05e058b84c5348) around five hundred repositories that ship a threat model file of some kind. The filenames are all over the place, `THREAT-MODEL.md`, `threat_model.md`, `ThreatModel.md`, sometimes buried three directories into `docs/`, which means a tool has to go looking rather than checking a known path.

The OpenSSF [SECURITY-INSIGHTS](https://github.com/ossf/security-insights) schema has had `in-scope` and `out-of-scope` arrays under `vulnerability-reporting` for a couple of years, which would be the obvious machine-readable home for this, but I've not seen a scanner that consumes them.

## What to write

The baseline is having a [`SECURITY.md`](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/adding-a-security-policy-to-your-repository) at all, which a surprising share of widely-depended-on repos still lack, and on GitHub turning on [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) so there's somewhere for a report to go that isn't a public issue. An empty policy file with a contact address is still better than nothing because it's the first place both humans and tools look.

The exclusion list is the cheap part and the part that did the work in the curl scan. Each entry needs the name of the pattern, a flat statement that it doesn't qualify, and enough reasoning that the rule generalises beyond the exact case you wrote down.

Underneath that sits a short threat model describing who the attacker is assumed to be and what they control, against what the project is actually trying to protect, which for most projects fits in three or four paragraphs. The exclusion list is really just the threat model restated as concrete cases. In practice most maintainers will write the exclusions first because that's where the pain is, accumulating entries as bad reports come in, and only later write down the model that explains why they hold together, which is fine, though the list does tend to get sharper once the model exists. The [CNCF self-assessment template](https://github.com/cncf/tag-security/blob/main/community/assessments/guide/self-assessment.md) is a reasonable starting shape if you want one.

One category worth adding that I haven't seen written down is documentation not matching behaviour. AI scanners flag this constantly because "docs say X, code does Y" is a finding template they've learned, and it is technically a defect, but it's only a security issue if the documented behaviour was a security guarantee somebody relied on. A function that the docs say returns null on error but actually throws belongs in the public tracker, whereas a function documented as escaping HTML that turns out not to is a real vulnerability.

Stating that distinction in the policy file would have trimmed my curl results further, and Piotr Karwasz [made much the same observation](https://github.com/ossf/wg-vulnerability-disclosures/issues/178#issuecomment-3897627638) from the Log4j side, where most of the borderline reports describe real behaviour that the threat model excludes and the fix is usually a Javadoc line saying whether an argument is trusted.

None of this stops someone pasting a hallucinated buffer overflow into your HackerOne queue without reading anything, and the bottom of the report-quality distribution is unreachable by documentation. But the better-built tools, the ones that read the repo before reporting, are the ones a policy file can steer, and those are increasingly the ones doing the scanning. Writing the threat model down was always good practice for human reporters, and it turns out the new readers take it more literally than the old ones ever did.

Whatever mythical models turn up next will be reading the same files.
