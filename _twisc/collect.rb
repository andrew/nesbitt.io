#!/usr/bin/env ruby
require "json"
require "time"
require "optparse"
require_relative "../_twipm/feed_fetch"
require_relative "hn"

TWISC = __dir__
FEEDS = File.join(TWISC, "feeds.txt")
OUTPUT = File.join(TWISC, "collected.json")
HN_TERMS = ["git", "jujutsu", "jj", "mercurial", "sapling", "gitoxide", "monorepo", "worktree",
            "version control", "source control", "forgejo", "gitea", "codeberg", "gitlab", "github",
            "mononoke", "radicle", "tangled", "pijul"]
HN_MIN_POINTS = 10
# gitoxide tags every crate; only the gix release itself is news.
TITLE_FILTERS = { "gitoxide releases" => /\Av\d/ }

options = { days: 7 }
OptionParser.new do |o|
  o.on("--days N", Integer) { |v| options[:days] = v }
  o.on("--since DATE") { |v| options[:since] = Time.parse(v) }
end.parse!

since = options[:since] || (Time.now - options[:days] * 86400)

feeds = FeedFetch.parse_urls_file(FEEDS)
warn "Fetching #{feeds.size} feeds..."
results, ok = FeedFetch.fetch_feeds(feeds)
feed_items = results.reject { |i| i[:published] < since || ((f = TITLE_FILTERS[i[:source]]) && i[:title] !~ f) }
                    .uniq { |i| i[:url] }
                    .map { |i| i.merge(published: i[:published].iso8601) }
                    .sort_by { |i| i[:published] }.reverse

hn = HN.search(HN_TERMS, since, min_points: HN_MIN_POINTS)

result = {
  since: since.utc.iso8601,
  generated: Time.now.utc.iso8601,
  feeds: feed_items,
  hn: hn
}

File.write(OUTPUT, JSON.pretty_generate(result))
warn "Wrote #{feed_items.size} feed items (#{ok}/#{feeds.size} feeds ok), #{hn.size} HN stories to #{OUTPUT}"
