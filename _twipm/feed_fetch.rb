# Shared feed-fetching helpers used by fetch_feeds.rb and collect.rb.
require "feedjira"
require "net/http"
require "shellwords"
require "stringio"
require "uri"
require "zlib"

module FeedFetch
  USER_AGENT = "nesbitt.io feeds fetcher (+https://nesbitt.io)"
  PREVIEW_LENGTH = 600

  module_function

  def parse_opml(path)
    require "rexml/document"
    doc = REXML::Document.new(File.read(path))
    feeds = []
    doc.elements.each("opml/body/outline") do |category|
      cat = category.attribute("text")&.value || "Uncategorised"
      category.elements.each("outline") do |feed|
        url = feed.attribute("xmlUrl")&.value
        name = feed.attribute("text")&.value
        next unless url && name
        feeds << { category: cat, name: name, url: url }
      end
    end
    feeds
  end

  # newsboat-format urls file: URL "~Name" "Tag" ...
  def parse_urls_file(path)
    return [] unless File.exist?(path)
    File.readlines(path).filter_map do |line|
      line = line.strip
      next if line.empty? || line.start_with?("#")
      parts = Shellwords.split(line)
      url = parts.shift or next
      name = parts.find { |p| p.start_with?("~") }&.delete_prefix("~")
      tag = parts.reject { |p| p.start_with?("~") }.first
      { category: tag, name: name || url, url: url }
    end
  end

  def http_get(url, redirects: 5, timeout: 20)
    raise "too many redirects" if redirects < 0
    uri = URI(url)
    req = Net::HTTP::Get.new(uri)
    req["User-Agent"] = USER_AGENT
    req["Accept"] = "application/atom+xml, application/rss+xml, application/xml, text/xml"
    req["Accept-Encoding"] = "gzip"
    res = Net::HTTP.start(uri.hostname, uri.port,
                          use_ssl: uri.scheme == "https",
                          open_timeout: timeout,
                          read_timeout: timeout) { |h| h.request(req) }
    case res
    when Net::HTTPRedirection
      http_get(URI.join(url, res["location"]).to_s, redirects: redirects - 1, timeout: timeout)
    when Net::HTTPSuccess
      body = res.body.to_s
      body = Zlib::GzipReader.new(StringIO.new(body)).read if res["content-encoding"] == "gzip"
      body
    else
      raise "HTTP #{res.code}"
    end
  end

  def strip_html(s)
    s.to_s
      .gsub(/<script.*?<\/script>/mi, " ")
      .gsub(/<style.*?<\/style>/mi, " ")
      .gsub(/<[^>]+>/, " ")
      .gsub(/&nbsp;/, " ")
      .gsub(/&amp;/, "&")
      .gsub(/&lt;/, "<")
      .gsub(/&gt;/, ">")
      .gsub(/&quot;/, '"')
      .gsub(/&#(\d+);/) { [Regexp.last_match(1).to_i].pack("U") }
      .gsub(/\s+/, " ")
      .strip
  end

  def fetch_feed(feed, timeout: 20, length: PREVIEW_LENGTH)
    body = http_get(feed[:url], timeout: timeout)
    parsed = Feedjira.parse(body)
    return [] unless parsed && parsed.entries
    parsed.entries.filter_map do |entry|
      published = entry.published || entry.updated
      next unless entry.title && entry.url && published
      raw = entry.summary || entry.content || ""
      preview = strip_html(raw)[0, length]
      preview = nil if preview.to_s.empty?
      {
        title: entry.title.to_s.strip,
        url: entry.url,
        published: published.utc,
        preview: preview,
        source: feed[:name],
        category: feed[:category]
      }
    end
  rescue => e
    warn "  #{feed[:name]}: #{e.class}: #{e.message}"
    []
  end

  def fetch_feeds(feeds, concurrency: 12, timeout: 20)
    queue = Queue.new
    feeds.each { |f| queue << f }
    mutex = Mutex.new
    results = []
    ok = 0
    workers = Array.new(concurrency) do
      Thread.new do
        while (feed = (queue.pop(true) rescue nil))
          items = fetch_feed(feed, timeout: timeout)
          mutex.synchronize do
            ok += 1 unless items.empty?
            results.concat(items)
          end
        end
      end
    end
    workers.each(&:join)
    [results, ok]
  end
end
