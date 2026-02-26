---
layout: post
title: "Announcing New Working Groups"
date: 2026-03-06
description: "The Open Source Foundations Consortium announces seven new working groups."
tags:
  - open-source
  - governance
  - satire
---

**FOR IMMEDIATE RELEASE**

**Contact:** working-groups@osfc.org<br>
**Subject:** Open Source Foundations Consortium Announces Seven New Working Groups<br>
**Embargo:** None

The Open Source Foundations Consortium (OSFC) has formed seven new working groups for open source ecosystem governance. The working groups were approved by the OSFC Steering Committee following a six-month consultation period during which fourteen comments were received, twelve of which were from bots.

Each working group operates under the OSFC Charter and reports to the Technical Advisory Board, which reports to the Governing Board, which reports to the Executive Director, who reports to the Steering Committee, which chartered the working groups. 

---

### Supply Chain Health Assessment and Monitoring Entity

SHAME is chartered to develop a standardized scoring methodology for open source project health, producing a single numeric score between 0 and 850 that reflects a project's maintenance status, security posture, community governance, and bus factor.

Each project's SHAME score will be published to the registry alongside package metadata. Projects scoring below 300 will receive a yellow banner in package manager search results. Projects below 150 will receive a red banner and a recommendation to "consider alternatives." SHAME scores are updated weekly and there is no appeals process, though an appeals process working group has been proposed and referred to YAGNI.

Early drafts of the rubric weight "time since last commit" heavily enough that finished software may be penalized, a concern that has been noted for a future meeting.

---

### Package Availability Notification and Incident Coordination

PANIC coordinates the ecosystem response when a package maintainer goes silent, mass-transfers ownership, or mass-deletes packages. PANIC maintains a 24/7 hotline staffed by volunteers in compatible time zones, though the hotline number is not yet public because the voicemail system requires a procurement decision that has been deferred to the next Governing Board meeting. In the interim, incidents can be reported by opening a GitHub issue on the PANIC repository, which is monitored during business hours, Pacific time.

The working group is developing a taxonomy of maintainer disappearance events, ranging from Level 1 ("maintainer is on vacation and will return") through Level 5 ("maintainer has mass-transferred all packages to an unrecognized account"). Most incidents are Level 1, but the ecosystem's response to all levels is currently identical.

---

### Barely Resourced Open-source Kind Enthusiasts

BROKE represents the interests of unfunded open source maintainers within the OSFC governance structure and has no budget, which is consistent with standard OSFC working group policy. Members serve on a voluntary basis.

The working group is producing a report on open source sustainability titled "The State of Open Source Funding," which is also the title of four previous reports by other organizations that reached similar conclusions. The report was not commissioned and has no designated audience. BROKE meetings conflict with SHAME meetings on the calendar, and a scheduling request has been filed.

---

### Cross-Upstream Registry Security Evaluation

CURSE conducts security evaluations across package registries. Unlike existing advisory databases, which are voluntary, CURSE findings are binding and can result in package removal, credential revocation, or formal censure. Once a CURSE evaluation is opened, it cannot be closed without a finding, as there is no "no issue found" outcome in the current process.

Evaluations are conducted by a rotating panel of three auditors who are required to have published at least one CVE or to have been the subject of at least one CVE, as both qualifications are accepted. Evaluations take between three weeks and fourteen months, during which the package is listed as "under CURSE review" in registry metadata. Packages under review have seen a measurable decline in downloads, which the working group considers outside its scope.

CURSE has completed nine evaluations and issued findings against all nine. An early draft advisory recommending the removal of all packages matching the regex `is-[a-z]+-[a-z]+` from npm was tabled after it was determined this would affect 14,000 packages.

---

### Best-practice Initiative for Kubernetes, Engineering Standards, Habitual Endless Discussion

BIKESHED is the OSFC standards body, responsible for defining best practices across the open source ecosystem, and has been in formation since 2023 while its charter remains under review by BIKESHED. The format for BIKESHED standards documents was drafted in Markdown, but a motion was raised to use AsciiDoc, which led to a six-month evaluation period that concluded both formats were acceptable, after which a motion was raised to define "acceptable" more precisely.

BIKESHED currently has 340 open issues, 12 approved standards, and one published standard, which is the standard for how to propose a standard. That standard is under revision because it references itself and the self-reference creates an ambiguity in section 4.2 that three members have filed competing amendments to resolve.

---

### Yet Another Governance & Naming Initiative

YAGNI is the meta-governance working group, overseeing the creation, naming, and dissolution of all other OSFC working groups. YAGNI voted to establish itself in a unanimous vote from which several members abstained.

YAGNI also approves working group names, evaluating proposed names for "clarity, professionalism, and alignment with OSFC values." All seven names announced today passed the naming review, though YAGNI does not evaluate acronyms.

---

### Label Governance and Trust Marks

LGTM administers a trust mark programme for open source packages. Packages that complete the LGTM review process receive a trust mark displayed in registry search results and CI output, confirming that the package has been reviewed per the criteria in LGTM Standard 001. To date, all packages that have applied for a trust mark have received one, which the working group attributes to the quality of applicants.

Three PRs have been accidentally merged as a result of discussions about LGTM governance in code review threads, and a proposal to rename the working group was submitted to YAGNI and rejected.

---

### Getting Involved

Working group meetings are open to OSFC members at the Contributor tier and above. Meeting times are listed on the OSFC community calendar, which is hosted on a shared Google Calendar.

Non-members may observe working group meetings but may not speak, vote, or appear on camera. Written comments may be submitted to the working group mailing list, which is moderated. Moderation turnaround is approximately three weeks.

---

*The OSFC is a 501(c)(6) trade association incorporated in Delaware. The consortium's mission is to promote the sustainability, security, and governance of open source software through multi-stakeholder collaboration, working group formation, and the publication of standards, reports, and other deliverables that the ecosystem may find useful.*
