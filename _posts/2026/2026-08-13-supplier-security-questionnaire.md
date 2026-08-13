---
layout: post
title: "Supplier Security Questionnaire"
date: 2026-08-13 17:00 +0000
description: "Estimated time to complete: 20 minutes."
tags:
  - open-source
  - security
  - satire
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3msy53aedon2n"
---

**From:** Third-Party Risk Management  
**To:** [address extracted from package metadata]  
**Subject:** ACTION REQUIRED: Annual Supplier Security Assessment  
**Due:** 5 business days from receipt

Hi,

Our software inventory has identified you as the supplier of a software component in our production estate (the "Component"). All such suppliers are required to complete our standard security assessment annually. We were unable to locate a procurement contact for your organisation and are reaching out to the address in the package manifest.

Where a question does not apply, please state why. Blank responses are scored as a fail.

Estimated time to complete: 20 minutes.

Kind regards,  
D. Ligence  
Third-Party Risk Management

---

## Section 1: General

**1.1** Name of the Component.

**1.2** URL of the primary source repository.

**1.3** The OSI-approved licence under which the Component is distributed.

**1.4** Monitored group mailbox for the maintainer team.

**1.5** Current GitHub star count for the primary repository.

**1.6** Please account for any period of thirty days or more in the past twelve months during which no commits were made to the primary repository.

## Section 2: Security

**2.1** URL of the supplier's published vulnerability disclosure policy.

**2.2** Current OpenSSF Scorecard score for the Component.

**2.3** Are all persons with commit access subject to pre-employment background screening, including criminal record checks?

**2.4** Please attach your current SOC 2 Type II report or ISO/IEC 27001 certificate.

**2.5** Date of the most recent independent security assessment of the Component. Self-assessments are not accepted.

**2.6** Describe the physical access controls at the facility where the Component is developed, including any persons cohabiting at that facility who are not authorised to commit, and confirm that each such person has signed a non-disclosure agreement.

## Section 3: Secure Development

**3.1** What percentage of changes are reviewed and approved by an individual other than the author prior to merge?

**3.2** Describe the controls that prevent a maintainer from inserting malicious code into a release. If you are the sole maintainer, describe the controls that prevent you.

**3.3** Please confirm the following remediation timescales for reported vulnerabilities: Critical, 4 hours; High, 24 hours; Medium, 7 days. Alternative timescales require written approval from our CISO.

**3.4** Please confirm that all contributors to the Component have completed annual secure software development training within the past twelve months.

**3.5** Does the supplier offer a commercially supported distribution of the Component with contractual response times? If not, would the supplier be willing to enter into such an arrangement at no cost to us?

**3.6** Please confirm that a completed copy of this questionnaire has been obtained from the supplier of each of the Component's direct and transitive dependencies, and attach the responses.

**3.7** Please confirm your acceptance of our responsible disclosure policy, under which any vulnerability our security team identifies in the Component may be published 30 days after we notify you, irrespective of fix availability.

## Section 4: Business Continuity & Key-Person Risk

**4.1** How many individuals are currently able and authorised to publish a release of the Component? If fewer than three, this is recorded as a finding.

**4.2** Please identify the deputy maintainer responsible for approving emergency releases outside normal business hours.

**4.3** State the longest period of consecutive leave taken in the past twelve months by any individual identified in 4.1. Periods exceeding ten days are recorded as a finding (key-person absence). Periods below ten days are recorded as a finding (key-person burnout risk).

**4.4** Has any individual identified in 4.1 expressed, in any public forum, an intention to reduce their involvement, "step back", seek a co-maintainer, or pursue an alternative occupation? Our vendor-intelligence provider monitors for such statements and three have been flagged against this supplier in the past year. Please comment on each.

**4.5** Please indicate whether any individual identified in 4.1 regularly commutes by bus, resides in close proximity to a bus route, or has previously been involved in a bus-related incident.

**4.6** In the event of the death or incapacity of the individuals in 4.1, provide the name, relationship, and GitHub username of the person who holds the registry credentials and release signing key, and confirm that this person has been informed of the arrangement and consents to it.

**4.7** Does the supplier consent to our taking out a key-person life insurance policy on each individual identified in 4.1, at our expense, naming ourselves as beneficiary?

## Section 5: Artificial Intelligence

**5.1** Was any portion of the Component generated by an AI system, large language model, or code completion tool? Please identify each model and version and attach the provider's terms of service as in force on the date of generation.

**5.2** Please attach the supplier's AI Acceptable Use Policy.

**5.3** Please describe the controls preventing prompt injection against any AI systems used in the development or maintenance of the Component.

**5.4** Does the supplier accept contributions from autonomous agents? If yes, describe how such contributions are distinguished from those of organic intelligences. If no, describe how you can be sure.

**5.5** Does the supplier consent to the use of the Component and its full commit history as training data for our internal models? This question is for our records only. The Component is already included in our provider's training corpus.

**5.6** Does the supplier consent to the appointment of an autonomous agent, operated by us or our nominee, as an additional maintainer of the Component, for the purpose of meeting the timescales in 3.3?

## Section 6: Legal & Export

**6.1** Confirm that no code in the Component derives from Stack Overflow, a project under an incompatible licence, or the recollection of code seen during any contributor's previous employment.

**6.2** Does the supplier have any intention of changing the licence of the Component? Our approved-component policy requires 180 days' written notice of any licence change, addressed to our General Counsel, prior to public announcement.

**6.3** Confirm that no contributor to the Component is a national of, or ordinarily resident in, any jurisdiction subject to US, UK, or EU sanctions, and describe the process by which this is verified for each pull request.

**6.4** Notwithstanding any disclaimer in the licence identified at 1.3, is the supplier willing to warrant that the Component is free of defects, fit for purpose, and of merchantable quality?

**6.5** Please provide the residential address at which the individuals identified in 4.1 may be served with legal process.

## Section 7: Financial

**7.1** Please attach the supplier's travel and expenses policy.

**7.2** Please provide evidence of cyber liability insurance with a per-claim limit of not less than USD 5,000,000, naming us as an additional insured.

**7.3** Has the supplier received funding from any state or state-affiliated body, including sovereign technology funds? Please identify the state.

**7.4** If the supplier derives no revenue from the Component, explain how its continued maintenance is assured for the duration of our product lifecycle, currently planned through 2034.

**7.5** Confirm that the supplier has no intention of charging for the Component in future, and that we will receive not less than 180 days' written notice should this position change.

**7.6** Please disclose any donations, sponsorships, or other payments received in connection with the Component in the past twelve months, for review by our Anti-Bribery & Corruption function.

---

## Declaration

I certify that the above is complete and accurate and that I am authorised to bind the supplier.

Signed:  
Title:  
Date:

Please return the completed questionnaire and all attachments within five business days. Incomplete responses are treated as not returned.

Submitted questionnaires are reviewed in the order received. Current review time is approximately nine to twelve months. Additional evidence may be requested following review.

In line with our memory-safety policy, where the Component is implemented in Rust, Sections 2 and 3 are scored as satisfactory regardless of the responses given. All questions remain mandatory.

Non-response will result in the Component being recorded as an unassessed dependency and escalated to our Architecture Review Board for a removal decision. Removal would require significant engineering effort on our part and is therefore unlikely to be approved, but the finding will remain open against the supplier indefinitely.

This assessment recurs annually. Next year's questionnaire will be issued automatically to whichever address appears in the package manifest at that time.

Queries may be raised via the Third-Party Risk shared mailbox. Please allow 30 business days for a response.

Completion of this questionnaire does not oblige us to continue using the Component.

There is no compensation associated with the completion of this questionnaire.
