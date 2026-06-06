#!/usr/bin/env ruby
# Merge _papers/additions.yml into _data/package_management_papers.yml.
# Skips entries whose title or ids already appear in the target section.

require "yaml"
require "set"

DATA = "_data/package_management_papers.yml"
ADDS = "_papers/additions.yml"

def norm_title(s)
  s.to_s.downcase.gsub(/[^a-z0-9 ]/, "").gsub(/\s+/, " ").strip
end

data = YAML.load_file(DATA)
additions = YAML.load_file(ADDS)

# Global dedup index across all sections — if a paper is already anywhere,
# don't add it again.
existing = { titles: Set.new, arxiv: Set.new, doi: Set.new }
data["sections"].each do |s|
  s["papers"].each do |p|
    existing[:titles] << norm_title(p["title"])
    if (ids = p["ids"])
      existing[:arxiv] << ids["arxiv"].to_s if ids["arxiv"]
      existing[:doi] << ids["doi"].to_s.downcase if ids["doi"]
    end
  end
end

added = Hash.new(0)
skipped = []

additions.each do |section_id, papers|
  section = data["sections"].find { |s| s["id"] == section_id }
  unless section
    abort "no such section: #{section_id}"
  end

  papers.each do |paper|
    arxiv = paper.dig("ids", "arxiv").to_s
    doi = paper.dig("ids", "doi").to_s.downcase
    nt = norm_title(paper["title"])

    if existing[:titles].include?(nt) ||
       (!arxiv.empty? && existing[:arxiv].include?(arxiv)) ||
       (!doi.empty? && existing[:doi].include?(doi))
      skipped << paper["title"]
      next
    end

    section["papers"] << paper
    existing[:titles] << nt
    existing[:arxiv] << arxiv unless arxiv.empty?
    existing[:doi] << doi unless doi.empty?
    added[section_id] += 1
  end
end

File.write(DATA, data.to_yaml(line_width: -1))
puts "added per section:"
added.each { |id, n| puts "  #{id}: #{n}" }
puts "skipped (already present): #{skipped.size}"
skipped.each { |t| puts "  - #{t}" }
puts "total added: #{added.values.sum}"
