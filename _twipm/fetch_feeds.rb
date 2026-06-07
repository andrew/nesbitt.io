#!/usr/bin/env ruby
# Parse the package-manager OPML, fetch every feed in parallel, write
# _data/feeds.json with items from the last N days.
require "json"
require "optparse"
require "time"
require_relative "feed_fetch"

ROOT = File.expand_path("..", __dir__)
OPML = File.join(ROOT, "_twipm/package-manager.opml")
OUTPUT = File.join(ROOT, "_data/feeds.json")

CATEGORY_LABELS = {
  "JavaScript/Node.js" => "JavaScript",
  "Java/JVM" => "Maven",
  "Container & Cloud" => "Containers",
  "Language-Specific Registries" => "Registries",
  "Multi-Language Package Managers" => "Multi-language",
  "Package Management Infrastructure" => "Infrastructure",
  "System Package Managers" => "System"
}.freeze

options = { days: 30, concurrency: 12, timeout: 20, max_items: 5000 }
OptionParser.new do |o|
  o.on("--days N", Integer) { |v| options[:days] = v }
  o.on("--concurrency N", Integer) { |v| options[:concurrency] = v }
  o.on("--timeout N", Integer) { |v| options[:timeout] = v }
end.parse!

cutoff = Time.now.utc - (options[:days] * 86_400)

feeds = FeedFetch.parse_opml(OPML).map do |f|
  f.merge(category: CATEGORY_LABELS.fetch(f[:category], f[:category]))
end
warn "Fetching #{feeds.size} feeds, #{options[:concurrency]} at a time, last #{options[:days]} days..."

results, ok = FeedFetch.fetch_feeds(feeds, concurrency: options[:concurrency], timeout: options[:timeout])
results.reject! { |i| i[:published] < cutoff }
results.sort_by! { |i| i[:published] }.reverse!
results = results.first(options[:max_items])

payload = {
  generated: Time.now.utc.iso8601,
  cutoff: cutoff.iso8601,
  feed_count: feeds.size,
  item_count: results.size,
  categories: feeds.map { |f| f[:category] }.uniq.sort,
  items: results.map { |i| i.merge(published: i[:published].iso8601) }
}

File.write(OUTPUT, JSON.pretty_generate(payload) + "\n")
warn "Wrote #{results.size} items from #{ok}/#{feeds.size} feeds to #{OUTPUT}"
