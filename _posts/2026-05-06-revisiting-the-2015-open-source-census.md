---
layout: post
title: "Revisiting the 2015 Open Source Census"
date: 2026-05-06 10:00 +0000
description: "The riskiest projects in open source, scored a decade early"
tags:
  - security
  - open-source
---

In July 2015, a year after Heartbleed, the Linux Foundation's Core Infrastructure Initiative published a [census of open source projects](https://github.com/ossf/census). The idea was to find the next OpenSSL before it found us: take every package in Debian's popularity contest, score it for risk, and produce a ranked list of where to send help. David Wheeler designed the scoring, a small team did manual review, and the output was [a CSV of 428 projects](https://github.com/ossf/census/blob/main/results.csv) sorted by a `risk_index` from 1 to 13.

I'd forgotten it existed until Daniel Stenberg posted a ten-years-on reminder on Mastodon this week, linking back to [his 2016 write-up](https://daniel.haxx.se/blog/2016/05/04/no-more-heartbleeds-please/). I was about nine months into building [Libraries.io](https://libraries.io) when the census came out. At the time I thought I was building a discovery engine, a way to find packages across registries, and it took a few more years to notice that the dependency graph I'd accumulated was more useful for sustainability and security questions than for search. So I remember reading the census results and then, like most people, not thinking about them again. The data is still there, untouched since 2016. Reading it now is an odd experience because you know how the next ten years went and the people filling in the spreadsheet didn't.

xz-utils is on row 254. Risk index 6, comfortably in the bottom half. liblzma5, the library that ended up linked into sshd on half the internet, is on row 237. Same score.

The more interesting field is the last column, where a reviewer typed a free-text comment:

> Widely-used compression/decompression. Vital, a vulnerability here could be very serious. ... fairly active by small # of committers. No bug tracker found.

Someone looked straight at it in 2015 and wrote down, in plain English, exactly why xz was dangerous. Then the formula gave it a 6 and it sank below 236 other rows.

## How the formula worked

The risk index was a sum of points across six axes. You got points for having no website, and up to 3 for past CVEs. A couple for being written in C, a couple for popularity, one or two for network exposure or processing untrusted data. The single heaviest term, worth up to 5 on its own, was having zero contributors in the last twelve months.

This is a model of a specific failure: a widely-deployed C library, parsing bytes off the wire, that everyone has stopped maintaining. It is a model of OpenSSL in early 2014, which is fair enough given why the census was commissioned.

By that standard xz looked fine. OpenHub recorded five contributors in the previous year, which zeroed out the biggest term. It had one historical CVE, worth a single point. It scored its 6 from being popular C code that processes untrusted data, the same baseline as a hundred other things in the list. The fact that those five contributors were really one person, and that the one person was [exhausted](https://www.mail-archive.com/xz-devel@tukaani.org/msg00567.html), wasn't visible to the formula. A project with one tired maintainer who is still pushing commits scores as healthy. The model measured abandonment. xz had something closer to the opposite problem, an outsider who very much wanted to help maintain it, and there was no column for that. Worse, gaining a second active committer is exactly the event that would have moved xz further down the spreadsheet. Jia Tan's arrival improved every contributor-count metric anyone was tracking.

## What the top of the list got right

It would be cheap to only talk about the miss. The top of the census holds up better than you'd expect for a spreadsheet assembled in a few months.

Row 1 is libexpat, scored 13, the maximum. The comment notes maintenance "appears to have effectively halted" after 2012 and the bug tracker returns an error page. Expat went on to produce a long run of CVEs and was one of the projects that received CII funding off the back of this work. It's now actively maintained. That's roughly the outcome the census was designed to produce.

Row 3 is unzip, which has continued to be exactly as much of a problem as it was then. Row 12 is rsync, which had its [batch of six CVEs](https://kb.cert.org/vuls/id/952657) including a 9.8 in early 2025. zlib at row 51 had [CVE-2018-25032](https://nvd.nist.gov/vuln/detail/CVE-2018-25032) sitting unnoticed for years. ntp, openssl, krb5, gnutls: all in the top quarter, all kept producing the kind of bug the model was looking for. If you'd taken the top 50 rows in 2015 and put a security engineer on each one, you would have caught real things.

libxml2 at row 148 is a different kind of result: the model read the project correctly and then nothing happened. The census scored it 8 for being a widely used C parser with a thin contributor base. Last year its sole maintainer [stepped down](https://discourse.gnome.org/t/stepping-down-as-libxml2-maintainer/31398) after first announcing he'd stop handling embargoed security reports because triaging them unpaid had become a part-time job. That is almost word for word the scenario the census was funded to prevent, identified in the right project, a decade in advance. Unlike xz this is a failure of follow-through rather than scoring. The spreadsheet did its job and the funding went elsewhere.

## What wasn't in the list

The risk formula was the second model in the pipeline. The first was the candidate set: Debian packages above a popcon threshold, plus some manual additions. That filter made its own decisions about what counted as infrastructure before any scoring happened, and several of the decade's worst vulnerabilities were excluded by it rather than misranked.

sudo isn't in the 428. Baron Samedit ([CVE-2021-3156](https://nvd.nist.gov/vuln/detail/CVE-2021-3156)) was a heap overflow exploitable by any local user, present since 2011. polkit isn't there either, and PwnKit ([CVE-2021-4034](https://nvd.nist.gov/vuln/detail/CVE-2021-4034)) had been in the code since 2009. log4j is absent, which is defensible for a list openly focused on the C underbelly of a Linux install, but sudo and polkit are about as core-infrastructure as it gets. They're missing because of how the input set was assembled rather than anything the risk model decided.

## One number

The heaviest term in the 2015 formula was twelve-month contributor count. It was worth up to 5 of the 13 available points, and it's the term that put xz in the bottom half. That same metric, under names like bus factor or active maintainers, is still load-bearing in most of the project-health scoring people use today. [OpenSSF Scorecard](https://scorecard.dev) checks for commits in the last 90 days. [criticality_score](https://github.com/ossf/criticality_score), the census formula's direct descendant, weights recent committer count and commit frequency. Several [CHAOSS](https://chaoss.community/kb-metrics-and-metrics-models/) health models lean on contributor counts the same way. It is a useful signal. It is also a metric that reads "one burnt-out maintainer plus one patient attacker" as a healthy two-person project.

Daniel provided a recent illustration of this from the other side. In March he [noticed](https://daniel.haxx.se/blog/2026/03/09/10k-curl-downloads-per-year/) a project-health dashboard reporting curl at 10,467 downloads for the year. The underlying number came from [ecosyste.ms](https://ecosyste.ms), which is to say it came from me. ecosyste.ms indexes the raw data each registry exposes, and download counts are one of the things that system package managers and Go simply don't publish. curl ships with every Linux distro and is vendored into half the software on earth, and almost none of that goes through a registry that reports a counter. The 10,467 is an accurate count of the channels that happen to be instrumented. It just isn't a count of curl downloads, and the difference between those two things doesn't survive being rendered as a single field on a dashboard.

Every metric in the set has a version of this problem. CVE count rewards projects nobody has bothered to audit. Popularity is a proxy for blast radius but says nothing about whether anyone is awake at the wheel. "Written in C" was a reasonable 2015 heuristic that would have scored log4j as safe. Each one is fine as a thing to glance at and dangerous as a thing to sort 428 rows by, because once it's a sort key the bottom half stops getting looked at.
