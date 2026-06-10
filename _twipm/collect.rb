#!/usr/bin/env ruby
require "octokit"
require "json"
require "time"
require "set"
require "optparse"
require "net/http"
require "uri"
require_relative "feed_fetch"

ROOT = File.expand_path("..", __dir__)
TWIPM = File.join(ROOT, "_twipm")
FEEDS_JSON = File.join(ROOT, "_data/feeds.json")
EXTRA_FEEDS = File.join(TWIPM, "extra_feeds.txt")
BOOKMARKS_TXT = File.join(TWIPM, "bookmarks.txt")
OUTPUT = File.join(TWIPM, "collected.json")
MASTODON_INSTANCE = "https://mastodon.social"
MASTODON_ACCT = "andrewnez"
GIT_PKGS_ORG = "git-pkgs"
DBLP_TERMS = ["package manager", "software supply chain", "dependency confusion", "typosquatting"]
DBLP_SEEN = File.join(TWIPM, "dblp_seen.txt")

options = { days: 7 }
OptionParser.new do |o|
  o.on("--days N", Integer) { |v| options[:days] = v }
  o.on("--since DATE") { |v| options[:since] = Time.parse(v) }
end.parse!

since = options[:since] || (Time.now - options[:days] * 86400)

def load_feeds_json(path, since)
  abort "#{path} not found - run `rake feeds` first" unless File.exist?(path)
  data = JSON.parse(File.read(path), symbolize_names: true)
  data[:items].filter_map do |i|
    pub = Time.parse(i[:published])
    next if pub < since
    i.merge(published: pub.utc.iso8601)
  end
end

def collapse_releases(items)
  items.group_by { |i| i[:source] }.flat_map do |source, group|
    if group.size <= 2 || source !~ /releases/i
      group
    else
      newest = group.first
      oldest = group.last
      [{
        title: "#{group.size} releases (#{oldest[:title]} … #{newest[:title]})",
        url: newest[:url],
        published: newest[:published],
        source: source,
        category: newest[:category],
        preview: newest[:preview],
        collapsed: group.size
      }]
    end
  end.sort_by { |i| i[:published] }.reverse
end

def mastodon_get(path)
  uri = URI.join(MASTODON_INSTANCE, path)
  req = Net::HTTP::Get.new(uri)
  req["User-Agent"] = "nesbitt.io twipm collector"
  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
  res.is_a?(Net::HTTPSuccess) ? JSON.parse(res.body) : nil
end

def collect_mastodon_boosts(since)
  account = mastodon_get("/api/v1/accounts/lookup?acct=#{MASTODON_ACCT}")
  return [] unless account

  results = []
  max_id = nil
  5.times do
    q = "limit=40&exclude_replies=true"
    q += "&max_id=#{max_id}" if max_id
    page = mastodon_get("/api/v1/accounts/#{account["id"]}/statuses?#{q}")
    break if page.nil? || page.empty?
    page.each do |s|
      created = Time.parse(s["created_at"])
      return results if created < since
      r = s["reblog"] or next
      next if r.dig("account", "acct") == MASTODON_ACCT
      links = r["content"].scan(/href="([^"]+)"/).flatten.reject { |u| u.include?("/tags/") || u.include?("/@") }
      results << {
        title: "boost: @#{r.dig("account", "acct")}",
        url: r["url"],
        published: created.utc.iso8601,
        source: "Mastodon boosts",
        category: "Mastodon",
        preview: FeedFetch.strip_html(r["content"])[0, 400],
        links: links
      }
    end
    max_id = page.last["id"]
  end
  results
rescue => e
  warn "mastodon boosts skipped: #{e.message}"
  []
end

def octokit
  @octokit ||= begin
    token = ENV["GITHUB_TOKEN"] || `gh auth token 2>/dev/null`.strip.then { |t| t.empty? ? nil : t }
    Octokit::Client.new(access_token: token, auto_paginate: true)
  end
end

def collect_git_pkgs_releases(since)
  results = []
  octokit.org_repos(GIT_PKGS_ORG, sort: "pushed").each do |repo|
    break if repo.pushed_at < since
    octokit.tags(repo.full_name, per_page: 3).first(3).each do |tag|
      commit = octokit.commit(repo.full_name, tag.commit.sha)
      published = commit.commit.committer.date
      next if published < since
      results << {
        repo: repo.name,
        tag: tag.name,
        url: "https://github.com/#{repo.full_name}/releases/tag/#{tag.name}",
        published: published.utc.iso8601
      }
    end
  end
  results.sort_by { |r| r[:repo] }
rescue => e
  warn "git-pkgs releases skipped: #{e.message}"
  []
end

def http_get_json(url)
  uri = URI(url)
  req = Net::HTTP::Get.new(uri)
  req["User-Agent"] = "nesbitt.io twipm collector"
  req["Accept"] = "application/json"
  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |h| h.request(req) }
  res.is_a?(Net::HTTPSuccess) ? JSON.parse(res.body) : nil
end

def dblp_authors(info)
  a = info.dig("authors", "author")
  a = a.is_a?(Array) ? a : [a].compact
  a.map { |x| x.is_a?(Hash) ? x["text"] : x }.compact
end

def collect_dblp
  min_year = Time.now.year - 1
  seen = File.exist?(DBLP_SEEN) ? File.readlines(DBLP_SEEN, chomp: true).to_set : Set.new
  hits = {}
  DBLP_TERMS.each do |term|
    q = URI.encode_www_form(q: term, format: "json", h: 50)
    data = begin
      http_get_json("https://dblp.org/search/publ/api?#{q}")
    rescue => e
      warn "dblp term #{term.inspect} skipped: #{e.message}"
      nil
    end
    next unless data
    Array(data.dig("result", "hits", "hit")).each do |h|
      info = h["info"] or next
      key = info["key"] or next
      next if info["year"].to_i < min_year
      hits[key] ||= {
        key: key,
        title: info["title"].to_s.sub(/\.\z/, ""),
        authors: dblp_authors(info),
        venue: info["venue"],
        year: info["year"],
        url: info["ee"] || info["url"],
        new: !seen.include?(key)
      }
    end
  end
  new_hits = hits.values.select { |h| h[:new] }
  File.write(DBLP_SEEN, (seen.to_a + new_hits.map { |h| h[:key] }).sort.uniq.join("\n") + "\n") unless new_hits.empty?
  hits.values.sort_by { |h| [h[:new] ? 0 : 1, -h[:year].to_i, h[:title]] }
rescue => e
  warn "dblp skipped: #{e.message}"
  []
end

def collect_bookmarks_txt(path)
  return [] unless File.exist?(path)
  File.readlines(path).filter_map do |line|
    line = line.strip
    next if line.empty? || line.start_with?("#")
    url, note = line.split(/\s+/, 2)
    { url: url, title: note, via: "bookmarks.txt" }
  end
end

opml_items = load_feeds_json(FEEDS_JSON, since)
extra_feeds = FeedFetch.parse_urls_file(EXTRA_FEEDS)
warn "Fetching #{extra_feeds.size} extra feeds..." unless extra_feeds.empty?
extra_results, _ok = FeedFetch.fetch_feeds(extra_feeds)
extra_items = extra_results.reject { |i| i[:published] < since }.map { |i| i.merge(published: i[:published].iso8601) }

feed_items = opml_items + extra_items + collect_mastodon_boosts(since)
collapsed = collapse_releases(feed_items)

bookmarks = collect_bookmarks_txt(BOOKMARKS_TXT)

git_pkgs = collect_git_pkgs_releases(since)
dblp = collect_dblp

result = {
  since: since.utc.iso8601,
  generated: Time.now.utc.iso8601,
  feed_item_count: feed_items.size,
  feeds: collapsed,
  bookmarks: bookmarks,
  git_pkgs: git_pkgs,
  dblp: dblp
}

File.write(OUTPUT, JSON.pretty_generate(result))
warn "Wrote #{collapsed.size} feed items (#{feed_items.size} raw), #{bookmarks.size} bookmarks, #{git_pkgs.size} git-pkgs releases, #{dblp.count { |d| d[:new] }}/#{dblp.size} new DBLP papers to #{OUTPUT}"
