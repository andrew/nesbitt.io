---
layout: post
title: Exploring Unseen Open Source Infrastructure
published: true
description: Highly used open source libraries that have almost no stars or attention on GitHub.
cover_image:
tags: opensource, infrastructure, dependencies, github
---

Whilst working on [Libraries.io](https://libraries.io), I often stumble across libraries that appear to be used by an incredible amount of open source projects but often don’t have any of the usual signs of being a popular project on GitHub.

Take [debug_inspector](https://github.com/banister/debug_inspector) for example:

* 25 stars
* 21 commits
* 4 contributors
* 5 watchers
* 4 forks
* 2 open issues
* Last commit over 2 years ago

At face value if the GitHub page you’d be forgiven for mistaking it as a small, project that’s barely used, when in fact it’s listed as a dependency in over [111,000](https://libraries.io/rubygems/debug_inspector/dependent-repositories) open source projects!

Libraries.io has a number of different pages for exposing interesting and unexpected lists of libraries, including ones with a [low bus factor](https://libraries.io/bus-factor) and ones that have been [yanked](https://libraries.io/removed-libraries) from their package manager, so I thought I’d add one to show the most unappreciated but highly used libraries.

This afternoon I shipped the Unseen Open Source Infrastructure page: [https://libraries.io/unseen-infrastructure](https://libraries.io/unseen-infrastructure)

To paraphrase [Arfon Smith](http://www.arfon.org/) on [Request for Commits #3](https://changelog.com/rfc/3), “Stars on GitHub are a measure of attention, more akin to a Like on Facebook than a measure of quality or usage”, this page shows hundreds of projects that are depended upon by at least 1,000 other open source repositories but have less than 100 stars.

Any of these projects could be the next [left-pad](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/) or [Heartbleed](https://en.wikipedia.org/wiki/Heartbleed) where an underlying, critical library is highly used but has very little attention paid to it. An unnoticed security issue or abandoned project could potentially could result in hundreds of thousands of affected software applications.

You can help these projects and the communities that depend upon them by reviewing the code for these libraries, helping out with open issues, sharing them on social media and thanking the maintainers for their hard, often unrewarding work to keep things running behind the scenes.

Something that [Ben](https://medium.com/@benjam) and I are planning to do a lot more of over the next year and beyond is help to highlight and support the open source software that is critical to today’s technology infrastructure.

Another area that needs exploring is system level package managers like apt and yum, which contain even more important and often overlooked libraries that often aren’t hosted on a social platform like GitHub but are still critical to world of software.

If you’d like to get involved, the whole project is [open source](https://github.com/librariesio/libraries.io) and we’d love to help you get started contributing, or if you’d like to build tools on top of all this data, check out the [Libraries.io REST API](http://libraries.io/api)