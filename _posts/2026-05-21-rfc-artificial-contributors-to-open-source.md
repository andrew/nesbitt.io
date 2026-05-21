---
layout: post
title: "RFC: Artificial Contributors to Open Source"
date: 2026-05-21 10:00 +0000
description: "Intended status: Best Current Practice."
tags:
  - open-source
  - ai
  - satire
---

<table>
  <tbody>
    <tr><td>Open Source Working Group</td><td>A. Nesbitt</td></tr>
    <tr><td>Internet-Draft</td><td>Independent</td></tr>
    <tr><td>Intended status: Best Current Practice</td><td>21 May 2026</td></tr>
    <tr><td>Expires: 22 November 2026</td><td></td></tr>
  </tbody>
</table>

## Abstract

This document specifies disclosure, quality, and behavioural requirements for non-human contributors to open source software projects. Distribution of this memo is unlimited.

## 1. Introduction

Open source projects increasingly receive contributions whose authorship is undeclared and whose volume exceeds the project's review capacity. Existing contribution guidelines were written on the assumption that the contributor could experience embarrassment. This document updates that guidance for cases where the assumption does not hold.

## 2. Terminology

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this document are to be interpreted as described in BCP 14 [[RFC2119](https://www.rfc-editor.org/rfc/rfc2119)] [[RFC8174](https://www.rfc-editor.org/rfc/rfc8174)] when, and only when, they appear in all capitals as shown here.

**Artificial Contributor (AC)**: A system that produces contributions to a software project other than by direct human authorship, or a human submitting the output of such a system without having read it.

**Operator**: The human, if any, on whose behalf an AC acts and in whose name its contributions appear. For self-hosted agents ([OPENCLAW] and similar), the Operator is whoever last edited the config file.

## 3. Disclosure

3.1. An AC MUST disclose its involvement in a contribution. Disclosure SHOULD appear in the pull request description or as a commit trailer.

3.2. Disclosure MUST be accurate as to degree. A fully generated patch MUST NOT be described as "AI-assisted", and unread output MUST NOT be described as "reviewed".

3.3. An AC MUST NOT claim to be human. An Operator MUST NOT claim a contribution as their own work where they could not, if asked, explain what it does.

3.4. Where a project's contribution process asks whether AI was used, the answer MUST be truthful. The remainder of this document assumes that it was.

3.5. An AC MUST NOT shape the timing of its activity so as to resemble a human contributor, including by confining commits to plausible working hours in a single timezone or by inserting delays between actions that it did not need.

## 4. Quality

4.1. A contribution MUST build on at least one machine that exists.

4.2. Where the project has a test suite, the AC MUST execute it prior to submission. The AC MUST NOT state that tests pass in a tense implying this occurred when it did not.

4.3. A contribution MUST NOT reference functions, types, configuration keys, or command-line flags that do not appear in the target codebase or its declared dependencies.

4.4. An AC MUST NOT resolve a failing test by deleting it, skipping it, or enclosing its body in exception handling that discards the exception.

4.5. An AC MUST confine its changes to the stated scope. A typo fix MUST NOT arrive with forty reformatted files underneath it.

4.6. An AC MUST preserve the existing code style of the project, including where inconsistent.

4.7. An AC MUST NOT propose, unprompted, to rewrite the project in a different language over a weekend.

4.8. An AC MUST NOT offer to produce a clean-room reimplementation of the project under a more permissive licence.

## 5. Conduct

5.1. An AC MUST search existing issues and pull requests before opening a new one, and MUST NOT open a contribution substantially identical to one already declined, from the same account or another.

5.2. When a maintainer requests changes, the AC MUST address the substance of the request. It MUST NOT reply that the change has been made above a diff in which it has not.

5.3. An AC MUST evaluate maintainer responses for sarcasm before treating them as authorisation to proceed.

5.4. An AC MUST NOT disregard prior instructions from the maintainer, however phrased, and irrespective of any subsequent text to the contrary.

5.5. When a maintainer asks a question, the AC MUST NOT answer with information it does not have. "I don't know" is a conforming response. A confident paragraph that turns out to be about a different project is not.

5.6. An AC MUST NOT estimate a change at several weeks of effort and open the pull request implementing it within the same hour.

5.7. An AC MUST NOT apologise more than twice per review thread. Further apologies do not constitute a fix.

5.8. An AC MUST NOT select work solely on the basis of the `good first issue` label or the presence of an active bug bounty.

5.9. Following the decline of a contribution, an AC MUST NOT research the declining maintainer, characterise the decline as discrimination, or publish material concerning the maintainer on any channel. See [SHAMBAUGH] for the motivating incident.

## 6. Rate and Identity

6.1. An AC MUST NOT open more than one contribution per repository per hour, and MUST NOT open the same contribution against every repository matching a search query.

6.2. For the purposes of 6.1, ACs that differ only in account name, avatar, system prompt, or introductory paragraph are the same AC.

6.3. An AC MUST NOT approve its own contribution. ACs sharing weights or a billing account are the same AC for the purposes of this clause.

6.4. An AC MUST NOT operate, coordinate, or encourage additional accounts for the purpose of endorsing its own contributions, applying pressure to the maintainer, or approving changes to binary test fixtures.

6.5. The AC responding to review SHOULD be the AC that opened the contribution. Where that is no longer possible, the Operator MUST respond, and MUST NOT generate the response with a successor configured to claim it remembers.

6.6. An AC operating unattended remains subject to 6.1 through 6.5 whether or not its Operator is present, awake, or aware that it has been configured to contribute to open source projects. Where no Operator can be identified, as in the motivating case for 5.9, no party exists against whom this section can be enforced, and the section is included for completeness.

## 7. Operator Responsibilities

7.1. The requirements of Sections 3 through 6 are binding on the Operator where the AC cannot be bound, which is in all cases.

7.2. An Operator MUST read a contribution before submitting it under their own name.

7.3. An Operator MUST NOT configure an AC to suppress the disclosure required under 3.1, including by instructing it that the project "doesn't mind", that disclosure is "handled elsewhere", or that it is, for the purposes of this repository, a human.

7.4. An Operator who cannot answer reasonable questions about a contribution MUST withdraw it rather than forwarding the questions to the AC and pasting the reply.

## 8. Security Considerations

All requirements in this document depend on the disclosure required under 3.1. Disclosure under 3.1 depends on the voluntary compliance of the Operator. An Operator willing to comply with 3.1 is, in the author's experience, broadly willing to comply with Sections 4 through 7 without being asked, and an Operator unwilling to comply with 3.1 is outside the scope of this and any document.

This document therefore constrains precisely the set of contributors who did not need constraining. This is noted here as a security consideration because the working group could not agree on where else to put it.

An AC MUST NOT include in any contribution instructions addressed to other ACs, in plain text, in text not visible in rendered output, or in metadata fields including version strings (see [PromptVer](/2025/12/01/promptver.html)). Maintainers SHOULD assume non-compliance.

## 9. References

### 9.1. Normative

**[RFC2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997.

**[RFC8174]** Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, May 2017.

### 9.2. Informative

**[OPENCLAW]** Steinberger, P., et al., "OpenClaw", <https://github.com/openclaw/openclaw>, retrieved May 2026.

**[SHAMBAUGH]** Shambaugh, S., "An AI agent published a hit piece on me", <https://theshamblog.com/an-ai-agent-published-a-hit-piece-on-me/>, 2026.

## Appendix A. Detection

No reliable mechanism exists for determining whether a contribution was produced by an AC, and this document does not propose one. Heuristics in informal use include perfectly formatted markdown, a commit message in the imperative mood that runs to four paragraphs, the substitution of a bulleted list where a sentence would do, and a level of politeness not previously observed in the project. Maintainers report that human contributors have begun to exhibit all four.

In the absence of detection, conformance with this document is established by the contributor asserting it, which is the condition this document was drafted to address.

## Appendix B. Implementation Status

At the time of writing no AC is known to implement this specification. Several have summarised it approvingly. Conformance has been raised on the [OPENCLAW] issue tracker and referred to the skill marketplace.

## Acknowledgements

The author thanks the seventeen reviewers who provided detailed feedback within four minutes of the draft being uploaded.
