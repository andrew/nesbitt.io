# This Week in Source Control

Collector for the weekly VCS and forge roundup. Shares `_twipm/feed_fetch.rb` and `_twipm/Gemfile`.

    bundle exec rake twisc:collect      # last 7 days -> _twisc/collected.json
    bundle exec rake "twisc:collect[14]"

`feeds.txt` lists VCS tool releases, forge blogs and changelogs, and the Lobsters `vcs` tag, in the same newsboat format as `_twipm/extra_feeds.txt`. The GitHub changelog feed only returns 10 items per page, so pages 2-4 are listed too and duplicates are dropped by URL.

Hacker News has no topic feed, so `hn.rb` queries the Algolia search API for each term in `HN_TERMS`, title-only with typo tolerance off, keeping stories above `HN_MIN_POINTS` that link to something. Each story records which terms matched and its discussion URL.
