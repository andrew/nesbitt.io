#!/usr/bin/env ruby
# Query OpenAlex, arXiv and DBLP for recent package-management papers and
# write candidates to _papers/candidates.json after deduping against
# _data/package_management_papers.yml.
#
# Usage: ruby _papers/collect.rb [--since YYYY-MM-DD]
# Env:   OPENALEX_API_KEY (optional, falls back to polite-pool email)

require "json"
require "net/http"
require "set"
require "time"
require "uri"
require "yaml"

MAILTO = ENV.fetch("OPENALEX_MAILTO", "andrewnez@gmail.com")
API_KEY = ENV["OPENALEX_API_KEY"]

# Keep this in sync with the topics covered by the post. Each entry is a
# free-text search phrase used by all three APIs.
QUERIES = [
  "package manager",
  "package management",
  "dependency resolution",
  "software supply chain",
  "software bill of materials",
  "SBOM",
  "lockfile",
  "typosquatting",
  "semantic versioning",
  "package ecosystem",
  "package registry",
  "npm ecosystem",
  "pypi ecosystem",
  "maven ecosystem",
  "package hallucination",
  "slopsquatting",
  "transitive dependency",
  "reproducible build",
  "vulnerable dependency",
  "malicious package",
]

def parse_args
  args = { since: nil }
  ARGV.each_cons(2) do |k, v|
    args[:since] = v if k == "--since"
  end
  args
end

def http_get_json(url)
  uri = URI(url)
  req = Net::HTTP::Get.new(uri)
  req["Accept"] = "application/json"
  req["User-Agent"] = "papers-check/1.0 (#{MAILTO})"
  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |h|
    h.read_timeout = 30
    h.request(req)
  end
  return nil unless res.is_a?(Net::HTTPSuccess)
  JSON.parse(res.body)
rescue => e
  warn "  http err: #{e.message}"
  nil
end

def http_get_text(url)
  uri = URI(url)
  req = Net::HTTP::Get.new(uri)
  req["User-Agent"] = "papers-check/1.0 (#{MAILTO})"
  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |h|
    h.read_timeout = 30
    h.request(req)
  end
  res.is_a?(Net::HTTPSuccess) ? res.body : nil
rescue => e
  warn "  http err: #{e.message}"
  nil
end

def norm_title(s)
  s.to_s.downcase.gsub(/[^a-z0-9 ]/, "").gsub(/\s+/, " ").strip
end

def existing_index
  data = YAML.load_file("_data/package_management_papers.yml")
  idx = { titles: Set.new, arxiv: Set.new, doi: Set.new }
  data["sections"].each do |section|
    section["papers"].each do |paper|
      idx[:titles] << norm_title(paper["title"])
      if (ids = paper["ids"])
        idx[:arxiv] << ids["arxiv"] if ids["arxiv"]
        idx[:doi] << ids["doi"].to_s.downcase if ids["doi"]
      end
    end
  end
  idx
end

def already_have?(idx, title:, arxiv: nil, doi: nil)
  return true if arxiv && idx[:arxiv].include?(arxiv)
  return true if doi && idx[:doi].include?(doi.to_s.downcase)
  return true if title && idx[:titles].include?(norm_title(title))
  false
end

def fetch_openalex(query, since)
  base = "https://api.openalex.org/works"
  # Tight match: search title field only, restrict to article/preprint, sort by date.
  filters = [
    "title.search:#{query.gsub(' ', '+')}",
    "from_publication_date:#{since}",
    "type:article|preprint",
  ]
  params = [
    "filter=#{filters.join(',')}",
    "per-page=50",
    "sort=publication_date:desc",
    "mailto=#{MAILTO}",
  ]
  params << "api_key=#{API_KEY}" if API_KEY
  url = "#{base}?#{params.join('&')}"
  json = http_get_json(url)
  return [] unless json
  (json["results"] || []).map do |w|
    {
      source: "openalex",
      title: w["title"],
      year: w["publication_year"],
      authors: (w["authorships"] || []).map { |a| a.dig("author", "display_name") }.compact.first(8).join(", "),
      venue: (w.dig("primary_location", "source", "display_name") || w["type"]),
      url: w.dig("primary_location", "landing_page_url") || w["doi"] || w["id"],
      doi: w["doi"]&.sub(%r{^https?://doi\.org/}, ""),
      abstract: w["abstract_inverted_index"] && reconstruct_abstract(w["abstract_inverted_index"]),
      cited_by: w["cited_by_count"],
      query: query,
    }
  end
end

def reconstruct_abstract(inv)
  return nil unless inv.is_a?(Hash)
  positions = {}
  inv.each { |word, idxs| idxs.each { |i| positions[i] = word } }
  positions.sort.map { |_, w| w }.join(" ")
end

def fetch_arxiv(query, since)
  encoded = URI.encode_www_form_component(query)
  url = "https://export.arxiv.org/api/query?search_query=all:%22#{encoded}%22+AND+(cat:cs.SE+OR+cat:cs.CR)&sortBy=submittedDate&sortOrder=descending&max_results=50"
  body = http_get_text(url)
  return [] unless body

  entries = []
  body.scan(%r{<entry>(.+?)</entry>}m) do |(entry)|
    title = entry[%r{<title>(.+?)</title>}m, 1]&.strip&.gsub(/\s+/, " ")
    published = entry[%r{<published>(.+?)</published>}, 1]
    next unless title && published
    next if since && published < since

    arxiv_id = entry[%r{<id>http://arxiv\.org/abs/([\d\.v]+)</id>}, 1]&.sub(/v\d+$/, "")
    authors = entry.scan(%r{<author>\s*<name>(.+?)</name>}).flatten.first(8).join(", ")
    summary = entry[%r{<summary>(.+?)</summary>}m, 1]&.strip&.gsub(/\s+/, " ")

    entries << {
      source: "arxiv",
      title: title,
      year: published[0, 4].to_i,
      authors: authors,
      venue: "arXiv preprint",
      url: "https://arxiv.org/abs/#{arxiv_id}",
      arxiv: arxiv_id,
      abstract: summary,
      published: published,
      query: query,
    }
  end
  entries
end

def fetch_dblp(query, since)
  encoded = URI.encode_www_form_component(query)
  url = "https://dblp.org/search/publ/api?q=#{encoded}&format=json&h=50"
  json = http_get_json(url)
  return [] unless json
  hits = json.dig("result", "hits", "hit") || []
  hits.filter_map do |hit|
    info = hit["info"]
    next unless info
    year = info["year"].to_i
    next if since && year < since[0, 4].to_i

    doi = info.dig("ee")&.match(%r{^https?://(?:dx\.)?doi\.org/(.+)$}) && $1
    {
      source: "dblp",
      title: info["title"],
      year: year,
      authors: Array(info.dig("authors", "author")).map { |a| a.is_a?(Hash) ? a["text"] : a }.compact.first(8).join(", "),
      venue: info["venue"],
      url: info["ee"],
      doi: doi,
      type: info["type"],
      query: query,
    }
  end
end

def filter_relevant(papers)
  papers.reject do |p|
    title = (p[:title] || "").downcase
    # Drop obvious off-topic noise: hardware, biology, etc.
    title.match?(/\b(genome|protein|patient|clinical|biology|species)\b/) ||
      # Drop tiny tutorial titles
      title.length < 12
  end
end

def main
  args = parse_args
  # Default cutoff: post's original date.
  since = args[:since] || "2025-11-01"

  puts "since: #{since}"
  puts "queries: #{QUERIES.size}"
  puts "openalex auth: #{API_KEY ? 'api key' : "polite pool (#{MAILTO})"}"
  puts

  idx = existing_index
  puts "existing: #{idx[:titles].size} titles, #{idx[:arxiv].size} arxiv ids, #{idx[:doi].size} dois"
  puts

  all = []
  QUERIES.each_with_index do |query, i|
    print "[#{i + 1}/#{QUERIES.size}] #{query}: "
    oa = fetch_openalex(query, since)
    ax = fetch_arxiv(query, since)
    dp = fetch_dblp(query, since)
    print "openalex=#{oa.size} arxiv=#{ax.size} dblp=#{dp.size} "
    all.concat(oa).concat(ax).concat(dp)
    sleep 1.5 # be polite (DBLP rate-limits aggressively)
    puts
  end

  puts
  puts "raw: #{all.size}"
  all = filter_relevant(all)
  puts "after relevance filter: #{all.size}"

  # Group by (normalised title) so the same paper from multiple sources collapses.
  groups = all.group_by { |p| norm_title(p[:title]) }

  candidates = []
  groups.each do |_norm, papers|
    # Pick the most informative record (prefer one with abstract).
    primary = papers.find { |p| p[:abstract] } || papers.first
    arxiv = papers.map { |p| p[:arxiv] }.compact.first
    doi = papers.map { |p| p[:doi] }.compact.first

    next if already_have?(idx, title: primary[:title], arxiv: arxiv, doi: doi)

    candidates << {
      title: primary[:title],
      year: primary[:year],
      authors: primary[:authors],
      venue: primary[:venue],
      url: primary[:url],
      arxiv: arxiv,
      doi: doi,
      abstract: primary[:abstract],
      cited_by: primary[:cited_by],
      sources: papers.map { |p| p[:source] }.uniq,
      queries: papers.map { |p| p[:query] }.uniq,
    }
  end

  # Rank: prefer multi-source corroboration, then newer, then citations.
  candidates.sort_by! { |c| [-c[:sources].size, -(c[:year] || 0), -(c[:cited_by] || 0)] }

  File.write(
    "_papers/candidates.json",
    JSON.pretty_generate(
      generated_at: Time.now.utc.iso8601,
      since: since,
      total: candidates.size,
      candidates: candidates,
    ),
  )
  puts "wrote _papers/candidates.json: #{candidates.size} candidates"
end

main if $PROGRAM_NAME == __FILE__
