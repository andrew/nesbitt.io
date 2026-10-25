# Andrew's Mastodon boosts, shared by the twipm and twisc collectors.
require "json"
require "net/http"
require "time"
require "uri"
require_relative "feed_fetch"

module Mastodon
  INSTANCE = "https://mastodon.social"
  ACCT = "andrewnez"

  module_function

  def get(path)
    uri = URI.join(INSTANCE, path)
    req = Net::HTTP::Get.new(uri)
    req["User-Agent"] = "nesbitt.io twipm collector"
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
    res.is_a?(Net::HTTPSuccess) ? JSON.parse(res.body) : nil
  end

  def boosts(since)
    account = get("/api/v1/accounts/lookup?acct=#{ACCT}")
    return [] unless account

    results = []
    max_id = nil
    5.times do
      q = "limit=40&exclude_replies=true"
      q += "&max_id=#{max_id}" if max_id
      page = get("/api/v1/accounts/#{account["id"]}/statuses?#{q}")
      break if page.nil? || page.empty?
      page.each do |s|
        created = Time.parse(s["created_at"])
        return results if created < since
        r = s["reblog"] or next
        next if r.dig("account", "acct") == ACCT
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
end
