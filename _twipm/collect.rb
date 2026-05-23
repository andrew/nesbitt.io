#!/usr/bin/env ruby
require "sqlite3"
require "octokit"
require "json"
require "time"
require "fileutils"
require "tmpdir"
require "optparse"
require "shellwords"
require "net/http"
require "uri"

ROOT = File.expand_path("..", __dir__)
TWIPM = File.join(ROOT, "_twipm")
NEWSBOAT_DIR = File.join(TWIPM, "newsboat")
URLS_FILE = File.join(NEWSBOAT_DIR, "urls")
CACHE_DB = File.join(NEWSBOAT_DIR, "cache.db")
BOOKMARKS_TXT = File.join(TWIPM, "bookmarks.txt")
OUTPUT = File.join(TWIPM, "collected.json")
MASTODON_INSTANCE = "https://mastodon.social"
MASTODON_ACCT = "andrewnez"
GIT_PKGS_ORG = "git-pkgs"

options = { days: 7, reload: true }
OptionParser.new do |o|
  o.on("--days N", Integer) { |v| options[:days] = v }
  o.on("--since DATE") { |v| options[:since] = Time.parse(v) }
  o.on("--no-reload") { options[:reload] = false }
end.parse!

since = options[:since] || (Time.now - options[:days] * 86400)

def strip_html(s)
  s.to_s.gsub(/<[^>]+>/, " ").gsub(/\s+/, " ").strip
end

def parse_urls_file(path)
  feeds = {}
  File.readlines(path).each do |line|
    line = line.strip
    next if line.empty? || line.start_with?("#")
    parts = Shellwords.split(line)
    url = parts.shift
    name = parts.find { |p| p.start_with?("~") }&.delete_prefix("~")
    tags = parts.reject { |p| p.start_with?("~") }
    feeds[url] = { name: name, category: tags.first }
  end
  feeds
end

def reload_feeds
  cmd = [
    "newsboat",
    "-u", URLS_FILE,
    "-c", CACHE_DB,
    "-C", File.join(NEWSBOAT_DIR, "config"),
    "-x", "reload"
  ]
  warn "Reloading feeds..."
  system(*cmd) or warn "newsboat reload exited nonzero"
end

def collect_feed_items(since, feed_meta)
  db = SQLite3::Database.new(CACHE_DB, readonly: true)
  rows = db.execute(<<~SQL, [since.to_i])
    SELECT i.title, i.url, i.pubDate, i.feedurl, i.content
    FROM rss_item i
    WHERE i.pubDate >= ?
    ORDER BY i.pubDate DESC
  SQL
  db.close

  rows.map do |title, url, pub, feedurl, content|
    meta = feed_meta[feedurl] || {}
    {
      title: title,
      url: url,
      published: Time.at(pub).utc.iso8601,
      source: meta[:name] || feedurl,
      category: meta[:category],
      preview: strip_html(content)[0, 400]
    }
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

def firefox_places_path
  case RUBY_PLATFORM
  when /darwin/
    Dir.glob(File.expand_path("~/Library/Application Support/Firefox/Profiles/*/places.sqlite")).first
  when /linux/
    Dir.glob(File.expand_path("~/.mozilla/firefox/*/places.sqlite")).first
  end
end

def collect_firefox_bookmarks(since, tag: "twipm")
  src = firefox_places_path
  return [] unless src && File.exist?(src)

  Dir.mktmpdir do |dir|
    %w[places.sqlite places.sqlite-wal places.sqlite-shm].each do |f|
      path = File.join(File.dirname(src), f)
      FileUtils.cp(path, dir) if File.exist?(path)
    end
    db = SQLite3::Database.new(File.join(dir, "places.sqlite"), readonly: true)
    rows = db.execute(<<~SQL, [tag, since.to_i * 1_000_000])
      SELECT p.url, p.title, b.dateAdded
      FROM moz_bookmarks tags_root
      JOIN moz_bookmarks tag_folder ON tag_folder.parent = tags_root.id
      JOIN moz_bookmarks b ON b.parent = tag_folder.id
      JOIN moz_places p ON p.id = b.fk
      WHERE tags_root.guid = 'tags________'
        AND tag_folder.title = ?
        AND b.dateAdded >= ?
      ORDER BY b.dateAdded DESC
    SQL
    db.close
    rows.map do |url, title, added|
      { url: url, title: title, added: Time.at(added / 1_000_000).utc.iso8601, via: "firefox" }
    end
  end
rescue => e
  warn "firefox bookmarks skipped: #{e.message}"
  []
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
        preview: strip_html(r["content"])[0, 400],
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

def collect_bookmarks_txt(path)
  return [] unless File.exist?(path)
  File.readlines(path).filter_map do |line|
    line = line.strip
    next if line.empty? || line.start_with?("#")
    url, note = line.split(/\s+/, 2)
    { url: url, title: note, via: "bookmarks.txt" }
  end
end

reload_feeds if options[:reload]

feed_meta = parse_urls_file(URLS_FILE)
items = collect_feed_items(since, feed_meta) + collect_mastodon_boosts(since)
collapsed = collapse_releases(items)

bookmarks = collect_firefox_bookmarks(since) + collect_bookmarks_txt(BOOKMARKS_TXT)
bookmarks.uniq! { |b| b[:url] }

git_pkgs = collect_git_pkgs_releases(since)

result = {
  since: since.utc.iso8601,
  generated: Time.now.utc.iso8601,
  feed_item_count: items.size,
  feeds: collapsed,
  bookmarks: bookmarks,
  git_pkgs: git_pkgs
}

File.write(OUTPUT, JSON.pretty_generate(result))
warn "Wrote #{collapsed.size} feed items (#{items.size} raw), #{bookmarks.size} bookmarks, #{git_pkgs.size} git-pkgs releases to #{OUTPUT}"
