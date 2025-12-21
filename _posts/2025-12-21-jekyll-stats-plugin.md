---
layout: post
title: Jekyll Stats Plugin
date: 2025-12-21 10:37 +0000
description: A Jekyll plugin that adds a stats command to show word counts, reading time, posting frequency, and tag distributions.
tags:
  - open source
  - ruby
---

Jekyll doesn't have a built-in way to see how many words you've written, so I made [jekyll-stats](https://github.com/andrew/jekyll-stats).

There are existing plugins like [jekyll-posts-word-count](https://github.com/mattgemmell/Jekyll-Posts-Word-Count) which use Liquid tags, and Raymond Camden wrote about [generating stats with JSON and Vue.js](https://www.raymondcamden.com/2018/07/21/building-a-stats-page-for-jekyll-blogs). I wanted something simpler: a CLI command that just prints stats, with optional JSON output for a pure Liquid page.

Example output:

```
📊 Site Statistics
───────────────────────────────────
Posts: 28 (34,583 words, ~2h 53m read time)
Avg: 1235 words | Longest: "Package Management Papers" (5,788 words)
First: 2017-02-24 | Last: 2025-12-21 (8.8 years)
Frequency: 0.3 posts/month

Posts by Year:
  2025: ████████████████████ 22
  2024: █ 1
  2023: █ 1
  2018: ██ 2
  2017: ██ 2

Top 10 Tags:
  package-managers (20) | open source (10) | security (6) ...
───────────────────────────────────
```

The plugin calculates word counts, reading time, posting frequency, and tag distributions. It groups posts by year, month, and day of week.

Add it to your Gemfile:

```ruby
group :jekyll_plugins do
  gem "jekyll-stats"
end
```

The `--save` flag writes stats to `_data/stats.json`. This lets you build a stats page with pure Liquid templates. I built a [stats page](https://nesbitt.io/stats) that pulls from this data ([template source](https://github.com/andrew/nesbitt.io/blob/master/stats.html)).

To keep stats fresh, I added a git pre-commit hook:

```bash
#!/bin/sh
bundle exec jekyll stats --save
git add _data/stats.json
```

Now every commit updates the stats automatically.

Word counting aims to be accurate. It strips HTML tags, code blocks, and markdown syntax before counting. Reading time assumes 200 words per minute.

Source: [github.com/andrew/jekyll-stats](https://github.com/andrew/jekyll-stats)
