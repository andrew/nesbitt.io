---
layout: post
title: "ActivityPub"
date: 2026-02-20
description: "The federated protocol for announcing pub activities, first standardised in 1714 and still in use across 46,000 active instances."
tags:
  - satire
  - activitypub
  - fediverse
---

**ActivityPub** is a federated protocol used by public houses in the United Kingdom and the Republic of Ireland for announcing scheduled events, drink promotions, and community activities to patrons and the wider neighbourhood. Each participating pub operates as an independent **instance**, maintaining its own chalkboard and event schedule while optionally sharing activity information with other instances in the network. First formalised in the early 18th century, the protocol remains in widespread use today, with an estimated 46,000 active instances across the British Isles as of 2024.[^1]

The broader network of interconnected pubs implementing the protocol is colloquially known as the **fediverse** (a portmanteau of "federated" and "diverse," referring to the range of establishments involved, from village locals to central London gastropubs). Individual participants in the protocol are referred to as **actors**, a category that includes landlords, bar staff, and in some implementations, particularly opinionated regulars.[^2]

## Etymology

The term derives from the compound of "activity" (from Latin *activitas*, meaning "a doing") and "pub" (a contraction of "public house"). The earliest known written use appears in a 1714 licensing petition from a Southwark innkeeper requesting permission to "maintain an Activity Pub board of not less than three feet in width" outside his premises.[^3] Earlier informal references to "the activity of the pub" appear in parish records from the 1680s, though scholars debate whether these constitute use of the compound noun or merely coincidental adjacency.[^4]

## History

### Origins

Prior to formalisation, British pubs communicated their activities through a variety of ad hoc methods, including town criers, word of mouth, and what the brewing historian Margaret Eaves has termed "aggressive loitering" — the practice of landlords standing in doorways and shouting at passers-by.[^5] The lack of standardisation led to significant confusion. A 1702 pamphlet from the Borough of Lewes describes a man who attended three consecutive funerals at The King's Head under the impression they were cheese tastings, the landlord's handwriting being "of such character as to render all notices indistinguishable."[^6]

### Chalkboard era (1714–1980s)

The Publican Notices Act of 1714 required all licensed premises to maintain a visible board, specifying chalk on dark-painted board but no format. Historians call the resulting chaos the "Great Inconsistency" — a period in which no two instances in England announced events in the same way.[^7]

Some publicans listed events chronologically. Others grouped them by type. A celebrated board at The Lamb and Flag in Oxford listed everything alphabetically, meaning that "Arm Wrestling (Tuesdays)" perpetually appeared above "Wednesday Pie Night," causing regulars to arrive on the wrong day with a frequency that the landlord described in his diary as "unwavering."[^8]

### The Federation Question

By the mid-19th century, the growth of brewery-owned tied houses created pressure for a more consistent protocol. In 1872, the United Brewers' Federation published *Recommendations for the Uniform Display of Pub Activities*, the first formal specification. The document established conventions still recognisable today: the use of a header line identifying the instance, a chronological listing of weekly events, and the now-ubiquitous phrase "ALL WELCOME" at the bottom, regardless of whether this was true.[^9]

The specification was not universally adopted. Free houses resisted what they termed "the tyranny of federation," and several publicans in the West Country continued to announce events exclusively through the medium of poetry well into the 1920s. A board outside The Bell in Frome reportedly read, in its entirety: "Come Thursday next for song and ale / The pork will not be stale."[^10]

The question of **defederation** — the deliberate severing of communication between instances — first arose during this period. A group of temperance-adjacent pubs in Birmingham refused to acknowledge or relay event information from establishments they considered excessively rowdy, a practice that the publicans of Digbeth described as "the cold shoulder, applied at institutional scale."[^11] The practice persists today; a 2023 survey found that 12% of pubs actively defederate from at least one neighbouring instance, most commonly over noise complaints, poaching of quiz teams, or "personal reasons the landlord declined to elaborate on."[^12]

### Digital transition

The introduction of social media in the early 21st century created a schism in the ActivityPub community. A faction of publicans, predominantly in urban areas, began duplicating their chalkboard announcements on Facebook and Instagram, leading to what the *Morning Advertiser* described in 2016 as "a crisis of protocol."[^13] Traditionalists argued that the canonical source of pub activity information must remain the physical board, and that digital copies were inherently unreliable due to the tendency of pub social media accounts to also post photographs of dogs and unsolicited opinions about the weather.

The controversy intensified when several landlords began **boosting** — the practice of reproducing another pub's activity announcements on one's own board, typically to alert followers of events at nearby instances. While some viewed this as a natural extension of the federated model, others considered it a breach of etiquette. A landlord in Stoke Newington was reportedly barred from three neighbouring pubs in 2019 after boosting their curry night announcements with the annotation "OURS IS BETTER."[^14]

In 2018, the Campaign for Real Ale (CAMRA) published a position paper titled *ActivityPub: Preserving the Chalkboard Standard*, which argued that the physical board remained "the only trustworthy and fully decentralised method of communicating pub activities," noting that it required no internet connection, could not be algorithmically suppressed, and was resistant to outages except in cases of rain or vandalism.[^15]

## Protocol specification

### Actors

The protocol defines three categories of **actor**:

- **Instance administrators** (landlords and landladies): responsible for maintaining the board, scheduling activities, and exercising moderation powers including the authority to **block** disruptive patrons.
- **Staff actors**: permitted to update the board on behalf of the administrator, though in practice often reluctant to do so on grounds that "it's not my handwriting" or "I wasn't told we'd stopped doing Wednesdays."
- **Followers** (regulars): actors who have established a persistent relationship with a specific instance. A patron becomes a follower through repeated attendance; no formal subscription mechanism exists, though some pubs maintain a mailing list which nobody reads.[^16]

The question of **account migration** — the process by which a follower transfers their primary allegiance from one instance to another — is considered one of the most socially fraught aspects of the protocol. Etiquette varies by region, but it is generally understood that a regular who begins frequenting a different pub should not be seen doing so by staff of the former instance, particularly if the new one is visible from the old one.[^17]

### Inbox and outbox

Each instance maintains two conceptual message stores:

- The **outbox**: the externally facing chalkboard, A-board, or other display visible to the public. This is the primary publication mechanism of the protocol.
- The **inbox**: traditionally a physical letterbox, noticeboard, or corner of the bar where community notices, band flyers, and unsolicited offers of DJ services accumulate. The inbox is write-only in practice; items deposited there are seldom read by the instance administrator and are periodically discarded in bulk during cleaning.[^18]

Message delivery between instances occurs through a process known as **inbox forwarding**, in which a patron who has seen an activity announced at one pub mentions it at another. The reliability of this mechanism depends entirely on the patron's memory, sobriety, and willingness to relay information accurately. Studies suggest a message corruption rate of approximately 40% per hop, rising to 70% after 10pm.[^19]

### Format

While no single format is mandated, the *de facto* standard for a compliant ActivityPub board includes the following elements:

- **Header**: The name of the instance, often rendered in a larger or more decorative hand than the body text.
- **Body**: A chronological list of upcoming activities, typically covering the current week.
- **Footer**: A welcoming statement and/or the price of the current guest ale.

Activities are generally expressed as a tuple of day, time, and event name, e.g. "THURSDAY 8PM — QUIZ NIGHT." The use of exclamation marks is permitted but discouraged by CAMRA guidelines, which state that "the activities of a well-run pub should speak for themselves."[^20]

An early attempt to introduce a structured notation for chalkboard content, known as **JSON-LD** (Joint Standardised Notation for Leisure Displays), was proposed by a committee of the British Beer and Pub Association in 2004. The notation required events to be written in a rigid format with bracketed metadata: "[TYPE:quiz][DAY:thu][TIME:20:00] QUIZ NIGHT." It was trialled at four pubs in Reading and abandoned within a week after staff refused to use it on grounds that it "looked like someone had a stroke while writing the board."[^21]

### Content warnings

Some instances prepend **content warnings** to specific activity announcements, alerting patrons to potentially divisive content. Common content warnings include "karaoke," "DJ Dave," "under-12s welcome," and "the landlord's band." CAMRA guidelines suggest that content warnings should be used "sparingly and only where the nature of the activity might cause a patron to make alternative plans," though in practice the mere presence of a content warning has been shown to increase attendance by 15%, curiosity being more powerful than caution.[^22]

### WebFinger

The **WebFinger** protocol provides a mechanism for identifying which instance a given actor is primarily associated with. In its traditional implementation, a patron entering an unfamiliar pub would ask a member of staff, "Do you know [name]?" — a lookup request that, if successful, would return the actor's home instance (e.g., "Oh, Dave? He's usually at The Crown on Thursdays"). The protocol is named for the physical gesture that typically accompanies the response: a pointed finger indicating the direction of the referenced establishment.[^23]

WebFinger queries are subject to privacy considerations. A 2019 CAMRA position paper noted that "no patron should be identifiable to a third party through their pub associations without prior consent," though it acknowledged that in villages with populations under 500, the protocol was "largely redundant, everyone already knowing where everyone drinks and, frequently, how much."[^24]

### Supported activity types

The protocol supports an effectively unlimited range of activity types, though analysis of 12,000 instances conducted by the University of Sheffield in 2019 found that 94% of all announced activities fell into one of the following categories:[^25]

| Activity | Frequency |
|---|---|
| Quiz night | 89% |
| Live music (unspecified) | 72% |
| Curry night | 54% |
| Open mic | 41% |
| Meat raffle | 38% |
| Pub quiz (distinct from quiz night, for reasons that remain unclear) | 27% |
| Karaoke | 24% |
| Bingo | 19% |
| "Live Sport" | 18% |
| Psychic night | 4% |

The study noted that "psychic night" appeared almost exclusively in pubs in the North West of England, and that none of them had predicted the study's findings.[^25]

### Interoperability

Interoperability between instances remains a challenge. A 2022 trial at a Wetherspoons in Basingstoke attempted to introduce machine-readable QR codes linking to event listings, but was abandoned after three weeks when it was discovered that the code linked to the pub's 2017 menu and nobody had noticed.[^27]

Several alternative implementations of the protocol have emerged over the years. **The Mastodon** (a pub in Finsbury Park, London) briefly operated a system in which events were announced by means of a large brass horn mounted above the door, sounded at 500-character intervals. Complaints from neighbours led to the horn's removal in 2017, though the pub continues to operate a compliant ActivityPub instance using conventional chalk.[^28]

## Governance

ActivityPub has no single governing body. CAMRA publishes advisory guidelines, and the British Beer and Pub Association maintains a best-practice document, but compliance is voluntary. A **W3C** (Wessex, Wales, and Cornwall Committee) working group was established in 2015 to develop a formal standard but was dissolved in 2018 after failing to reach consensus on whether "happy hour" constituted an activity or a pricing policy.[^29]

In practice, the protocol is governed by what the sociologist Dennis Ethernet has called "the distributed authority of regulars" — a system in which factual errors on a pub's activity board are corrected not by any formal mechanism but by a patron mentioning it to the landlord, who may or may not act on the information depending on whether they are busy, whether they can find the chalk, and whether they consider the error material.[^30]

Instance **moderation** is handled exclusively by the landlord or designated staff. Moderation actions include verbal warnings, temporary suspensions ("you've had enough, come back tomorrow"), and permanent blocks, colloquially known as "barrings." Unlike digital implementations, there is no appeals process, though a blocked actor may submit an informal unblock request by appearing contrite and buying the administrator a drink.[^31]

## Criticism

Critics have noted that the ActivityPub protocol suffers from several persistent issues:

- **Ambiguity**: The phrase "Live Music Saturday" does not specify genre, start time, volume, or whether the performer is the landlord's nephew.[^32]
- **Chalk supply chain issues**: During the COVID-19 pandemic, several pubs reported difficulty obtaining chalk, though it was noted that this was the least of their problems.[^33]
- **Discovery**: New patrons report difficulty locating active instances, particularly in rural areas where pubs may not be visible from main roads. The protocol provides no native discovery mechanism beyond "walking around and looking."[^34]

## Cultural significance

The ActivityPub board has been described as "the last surviving commons of British civic life"[^37] and "a chalkboard outside a pub."[^38] Its persistence in the digital age has been attributed variously to tradition, the aesthetic appeal of chalk lettering, the unreliability of pub Wi-Fi, and the fact that most instance administrators are too busy to maintain a website.

The term **toot** — meaning a brief, informal announcement made by a pub to its followers, typically shouted from the doorway or written in abbreviated form on an A-board — has seen renewed interest among protocol historians. The word derives from the practice of sounding a horn or whistle to announce last orders, and its use as a general term for any short pub announcement dates to at least the 1890s.[^39] A campaign by the Free House Alliance to replace the term with "post" in 2023 was met with indifference.

The Victoria and Albert Museum acquired a complete ActivityPub board from a closed instance in Bermondsey in 2023, describing it as "a significant example of vernacular British communication design." The board reads: "TUES — QUIZ. WED — CURRY. THURS — KEITH."[^40] The museum was unable to determine who Keith was or what he did on Thursdays, as the pub had been converted into flats.

## See also

- Chalkboard
- Meat raffle
- Pub quiz
- "Keith" (disambiguation)
- Campaign for Real Ale
- A-board (pavement signage)
- The Great Inconsistency (1714–1872)
- Defederation (social policy)
- The Mastodon (pub)

## References

[^1]: British Beer and Pub Association, *Statistical Handbook 2024*, p. 41.
[^2]: Ethernet, D. *The Sociology of the Local*. Polity Press, 2021, p. 12.
[^3]: Eaves, M. (2003). *Signs, Boards, and Barrels: A History of Pub Communication*. Faber & Faber, p. 112.
[^4]: Chegg, S. "On the Etymology of ActivityPub: A Compound or a Coincidence?" *Journal of Brewing History*, vol. 29, no. 3, 2011, pp. 44–51.
[^5]: Eaves (2003), p. 78.
[^6]: Lewes Borough Archives, Pamphlet No. 1702-34, "A Complaint Concerning the Illegible Notices of One Mr. Thos. Harding."
[^7]: Eaves (2003), pp. 115–130.
[^8]: Diary of Dennis Plimsoll, landlord of The Lamb and Flag, 1742–1768. Bodleian Library, MS. Eng. misc. c. 491.
[^9]: United Brewers' Federation. *Recommendations for the Uniform Display of Pub Activities*. London, 1872.
[^10]: Crumpet, G. "Verse and Ale: Poetic ActivityPub in the West Country." *Somerset Archaeological and Natural History Society Proceedings*, vol. 148, 2004, pp. 201–210.
[^11]: Eaves (2003), pp. 142–145.
[^12]: Sausages, S. and Waffle, P. "Inter-Instance Communication Patterns in British Pub Networks." *Leisure Studies*, vol. 42, no. 1, 2023, pp. 88–103.
[^13]: "Is the Chalkboard Dead?" *Morning Advertiser*, 14 March 2016.
[^14]: "Landlord Barred After Boosting Rival Curry Night." *Hackney Gazette*, 4 November 2019.
[^15]: Campaign for Real Ale. *ActivityPub: Preserving the Chalkboard Standard*. CAMRA Publications, 2018.
[^16]: Ethernet (2021), pp. 67–71.
[^17]: Ibid., pp. 89–94. Ethernet devotes an entire chapter to what he calls "the migration problem," noting that in close-knit communities the act of changing one's regular pub carries "a social weight roughly equivalent to divorce."
[^18]: Sausages and Waffle (2019), p. 506.
[^19]: Ibid., p. 509. The authors acknowledge that the post-10pm figure may itself be unreliable, the data having been collected after 10pm.
[^20]: CAMRA (2018), Appendix B, "Guidelines on Tone."
[^21]: British Beer and Pub Association, Internal Report No. 2004-17, "Pilot Study: Structured Notation for Pub Activity Boards." Unpublished; leaked to *The Publican* in 2006.
[^22]: CAMRA (2018), Appendix D, "Content Advisories."
[^23]: Eaves (2003), pp. 201–204.
[^24]: Campaign for Real Ale. *Privacy and the Pub: A Position Paper*. CAMRA Publications, 2019.
[^25]: Sausages, S. and Waffle, P. "A Quantitative Analysis of British Pub Activity Boards." *Leisure Studies*, vol. 38, no. 4, 2019, pp. 502–518.
[^27]: "QR Code Trial Quietly Abandoned." *Basingstoke Gazette*, 8 September 2022.
[^28]: "The Mastodon: A Brief History of the Horn." *Finsbury Park Local*, 12 January 2018.
[^29]: W3C Working Group minutes, 2015–2018. Archived at the British Beer and Pub Association, File No. WG-2015-009.
[^30]: Ethernet (2021), p. 134.
[^31]: Ibid., p. 156. Ethernet notes that the success rate of informal unblock requests correlates strongly with the quality of the drink offered.
[^32]: Sausages and Waffle (2019), p. 514.
[^33]: "Pubs Face Chalk Shortage Amid Pandemic." *The Publican*, 2 November 2020.
[^34]: Ethernet (2021), p. 178.
[^37]: Ethernet (2021), p. 201.
[^38]: Diesel, V. "What Is a Pub Chalkboard?" *The Guardian*, 17 July 2019.
[^39]: Eaves (2003), pp. 88–91.
[^40]: Victoria and Albert Museum. *Recent Acquisitions: Bermondsey Pub Board (Acc. No. 2023-1147)*. V&A Online Collections.
