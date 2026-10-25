# Hacker News stories via the Algolia search API.
require "json"
require "net/http"
require "time"
require "uri"

module HN
  ENDPOINT = "https://hn.algolia.com/api/v1/search_by_date"

  module_function

  def http_get(url)
    uri = URI(url)
    res = Net::HTTP.get_response(uri)
    raise "HTTP #{res.code}" unless res.is_a?(Net::HTTPSuccess)
    res.body
  end

  def search_url(term, since, min_points)
    # Title-only and no typo tolerance: otherwise "git" matches "Bitcoin" and any story linking a repo.
    q = URI.encode_www_form(
      query: term,
      tags: "story",
      restrictSearchableAttributes: "title",
      typoTolerance: "false",
      numericFilters: "created_at_i>#{since.to_i},points>#{min_points}",
      hitsPerPage: 50
    )
    "#{ENDPOINT}?#{q}"
  end

  def parse(body, term)
    JSON.parse(body)["hits"].filter_map do |h|
      next unless h["url"]
      discussion = "https://news.ycombinator.com/item?id=#{h["objectID"]}"
      {
        title: h["title"],
        url: h["url"],
        published: Time.at(h["created_at_i"]).utc.iso8601,
        source: "Hacker News",
        category: "Discussion",
        points: h["points"],
        comments: h["num_comments"],
        discussion: discussion,
        matched: [term]
      }
    end
  end

  def search(terms, since, min_points: 10)
    found = {}
    terms.each do |term|
      parse(http_get(search_url(term, since, min_points)), term).each do |item|
        if (existing = found[item[:discussion]])
          existing[:matched] |= item[:matched]
        else
          found[item[:discussion]] = item
        end
      end
    rescue => e
      warn "hn term #{term.inspect} skipped: #{e.message}"
    end
    found.values.sort_by { |i| -i[:points].to_i }
  end
end
