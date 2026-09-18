---
layout: post
title: "Good Morning, Your Toaster Is Compromised"
date: 2026-09-17 10:00 +0100
description: "Rise & Grind goes live to the software supply chain."
tags:
  - open-source
  - security
  - satire
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mvrrnummpm2c"
---

*The following is a transcript of the 7am hour of Rise & Grind, a nationally syndicated breakfast news programme, first broadcast Thursday 17 September 2026. Transcription by OpenClaw-4.2. Portions of this segment were pre-blurred at the request of the network.*

**CHIP:** Good morning, good morning, welcome back to Rise & Grind, I'm Chip Halloran.

**BRIE:** And I'm Brie Kensington. Chip, we have to start with the story that has been, and I'm sorry, *burning up* our inbox all morning.

**CHIP:** [laughs] She's been holding that one since four a.m., folks. But it is a serious story. If you own a smart toaster, a connected espresso machine, certain models of pet feeder, you may have woken up on Tuesday to find those devices producing images that we are, frankly, not able to show you before the watershed.

**BRIE:** We're going to put some of those on screen now, heavily blurred. What you're looking at there is a slice of sourdough from a viewer in Nebraska, and burned into that slice is a cartoon fox, wearing sunglasses, in what our legal team have asked me to describe only as "a pose."

**CHIP:** The same image, or variations of it, has appeared in latte foam, on the little screens on the front of smart fridges, and in at least one case spelled out in kibble by an automatic pet feeder. One school district in Ohio has pulled its entire cafeteria line. Three manufacturers have issued recalls. And nobody, Brie, seems to be able to tell us who did this or why.

**BRIE:** Which is why we've brought in an expert. Joining us now from her home is Karen Oyelaran, she is an open source security advocate,

**KAREN:** Researcher.

**BRIE:** Researcher, thank you Karen, and Karen, I understand you've actually been tracking this particular hack for some time?

**KAREN:** So it's not really one hack, it's the same underlying library being compromised for the third time in about two years. The component is called vulpine-lz4, it's a compression library written in Rust, twelve stars on GitHub, and it ends up in appliance firmware because a build tool called snekpack vendors it, and most of these manufacturers use snekpack in their over-the-air update pipeline. The original library stopped getting releases when the maintainer left, so snekpack switched to a community fork called foxhole-lz4, and on Tuesday that fork pushed a release with a modified decompression routine. Instead of unpacking the manufacturer's splash-screen assets it unpacks a hardcoded image buffer, which is the fox. It's actually the library's own mascot. Someone has just drawn it in a way the maintainer definitely didn't.

**CHIP:** OK so, a lot to unpack there, if you'll pardon the

**BRIE:** [laughs]

**CHIP:** But let me make sure I've got the headline. Vulpine. Is that an individual, is that a group? Where are they based?

**KAREN:** No, sorry, vulpine just means fox-like. It's the name of the software. The person who wrote it isn't the attacker, he's actually the first victim in a sense, his package keeps getting

**BRIE:** So there IS a he. There's a person behind Vulpine.

**KAREN:** There's a person who wrote it, yes. Years ago. He's not involved in this.

**CHIP:** And who does he work for? Which of the appliance companies?

**KAREN:** None of them. He wrote it on his own time and published it for free, and then the appliance companies, and honestly thousands of other companies, built it into their products. That's just how modern software gets made, you pull in hundreds of these small components and most of them are maintained by one or two volunteers.

**BRIE:** For free.

**KAREN:** Yes.

**BRIE:** Free like a trial, or,

**KAREN:** Free like nobody pays him anything. There's a donate button. I think it's had about forty dollars through it.

**CHIP:** Forty dollars total? For software that's in, you said millions of appliances?

**KAREN:** Somewhere north of thirty million devices, based on the firmware strings. And that's just the appliances. It's also a transitive dependency of cargo, which is the tool that builds most Rust software, so realistically it's on almost every developer machine in the world as well. This is actually the point I'd really like to get across if I can, because the manufacturers shipping these toasters are

**CHIP:** And I do want to come back to that Karen, but I think what viewers at home want to know first is, this individual, the Vulpine developer. Where is he now? Have authorities been in contact?

**KAREN:** He won the EuroMillions in 2024 and moved to Portugal to farm goats. He hasn't committed to the repository in about two years. Which, again, he's allowed to do, it's a hobby project, nobody was paying him to

**BRIE:** I'm sorry, he *walked away*? From thirty million devices?

**KAREN:** He didn't walk away from thirty million devices, there weren't thirty million devices when he wrote it. He wrote a compression library, put it online, and other people put it in toasters. He wasn't consulted about the toasters.

**CHIP:** Our producers did actually reach out to him overnight, and Brie, I believe we have his statement?

**BRIE:** We do. I'll read it in full. "Thank you so much for reaching out. I hear your concerns and I'm committed to doing better, both as a maintainer and as a model. In the meantime, please find below my recipe for a soft-rind chèvre. Warmest regards." And then there is, in fact, a recipe.

**CHIP:** So he IS engaging. That's encouraging, at least.

**KAREN:** No, that's not him, that's an AI auto-responder. He won't have seen your email, everyone who writes to that address gets the recipe.

**BRIE:** The recipe looks quite good, actually.

**KAREN:** It is, I've made it. Look, can I just, the reason this keeps happening to this specific library is that it's underneath billions of dollars of hardware and nobody funds it. There was CVE-2024-YIKES, same package. There was another one in June, CVE-2026-LGTM, same package again, that time it was AI security scanners approving it because the malware asked them nicely. After that one there was a working group set up specifically to look at

**CHIP:** So there IS a working group. That's reassuring.

**KAREN:** It's never met. It was scheduled into the same slot as the retrospective for the previous incident, which also never met.

**CHIP:** But it exists.

**KAREN:** A calendar invite exists.

**BRIE:** Karen, I want to bring it back to the images for a second because I think that's what's alarming people. We've had the network's standards team look at these and they've confirmed that the fox is, and I'm quoting the memo, "depicted as over eighteen and the sunglasses remain on throughout," so we are able to discuss it. But who *drew* this? Is this the same person who broke into the software?

**KAREN:** So the artwork actually predates this attack. It first showed up embedded in the June incident as a decoy, the idea being that automated scanners would hit the image, refuse to describe it, and never reach the actual malware forty lines further down. Which worked, incidentally. This time someone's just taken that same asset and pointed it at the toast. Honestly the artwork is the least interesting part, the interesting part is that a fork with eleven downloads can push a release on a Tuesday and be on your kitchen counter by Thursday because none of the vendors in between are checking, and none of them are checking because none of them think of this as *their* code, because they didn't pay for it, because nobody

**CHIP:** And the eleven, sorry, you said eleven downloads, earlier you said something about twelve stars, help me out here. Twelve out of what?

**KAREN:** It's not out of anything, it's just twelve people clicked a button that says star.

**CHIP:** So it's not a rating.

**KAREN:** It's more like a bookmark.

**CHIP:** Twelve bookmarks. And that's holding up thirty million toasters.

**KAREN:** *Yes.* That is exactly the problem. And the companies selling those thirty million toasters, we're talking about firms with nine and ten figure revenues, have collectively contributed zero engineering time and about forty dollars to the component they're all standing on. If even one of them had funded a part-time maintainer, or an audit, or just read the

**BRIE:** So who's *liable*, Karen? If I'm a viewer and my four-year-old has seen this fox on her breakfast, who do I call?

**KAREN:** I mean, you'd call the manufacturer, they sold you the toaster. But they'll point at the firmware vendor, and the firmware vendor will point at snekpack, and snekpack will point at a repository whose owner is currently milking a goat. There isn't a throat to choke here, that's what I'm trying to

**CHIP:** But surely someone *owns* open source. There's a company behind Linux, isn't there?

**KAREN:** There's a foundation. Several foundations. None of them own vulpine-lz4, it's one person's repo. Was one person's repo.

**CHIP:** And he's just allowed to leave it there? Unlocked? For anyone to put foxes in?

**KAREN:** He put a licence on it that says anyone can use it for anything and he's not responsible for what happens. Every one of those manufacturers agreed to that licence when they pulled it in. They just didn't read it, because again, they weren't paying for it, so nobody thought of it as procurement, so nobody

**BRIE:** I have to say, Chip, the more I hear about this the more it sounds like these open sources are a bit of a wild west.

**CHIP:** It really does. Karen, last question because we're up against the break. Practically speaking. Should people be unplugging their toasters this morning?

**KAREN:** The manufacturers have all pulled the update, so anything that's rebooted since yesterday is fine. And I'd just point out that the *toast* was never dangerous. It's bread. The dangerous version of this attack is the one you don't see, where instead of drawing a fox it just reads your wifi credentials, and that version has almost certainly already happened to the same devices via the same library and nobody booked a segment about it because there wasn't a picture. That's really what I'd like people to take away, the fox is

**CHIP:** So the toast is safe to eat.

**KAREN:** The toast was always safe to eat.

**CHIP:** There you go. Toast is safe, reboot your appliances, and I'm sure the authorities will get this Vulpine character sorted out. Karen Overland, open source advocate, thank you so much for joining us.

**KAREN:** It's Oyelaran, and it's, no, that's fine. Thank you for having me.

**BRIE:** Fascinating stuff. When we come back: he's fluffy, he's fearless, and his owners say he simply cannot be contained. Kubernetes the golden retriever is scaling new heights this morning after landing his very first skateboarding sponsorship. That's next on Rise & Grind. Don't go anywhere.

*[BREAK]*
