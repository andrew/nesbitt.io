require_relative "../_twisc/hn"

HITS = {
  "git" => { hits: [
    { objectID: "1", title: "Redesigning source control", url: "https://example.org/a", created_at_i: 1_760_000_000, points: 900, num_comments: 300 },
    { objectID: "2", title: "Ask HN: git workflows?", url: nil, created_at_i: 1_760_000_100, points: 20, num_comments: 5 }
  ] },
  "source control" => { hits: [
    { objectID: "3", title: "Git on S3", url: "https://example.org/b", created_at_i: 1_760_000_200, points: 50, num_comments: 10 },
    { objectID: "1", title: "Redesigning source control", url: "https://example.org/a", created_at_i: 1_760_000_000, points: 900, num_comments: 300 }
  ] }
}

HN.define_singleton_method(:http_get) do |url|
  term = URI.decode_www_form(URI(url).query).to_h["query"]
  raise "boom" if term == "broken"
  JSON.generate(HITS[term])
end

url = HN.search_url("git", Time.at(1_759_000_000), 10)
params = URI.decode_www_form(URI(url).query).to_h
raise "title-only search not set: #{params}" unless params["restrictSearchableAttributes"] == "title"
raise "typo tolerance not disabled: #{params}" unless params["typoTolerance"] == "false"
raise "filters wrong: #{params["numericFilters"]}" unless params["numericFilters"] == "created_at_i>1759000000,points>10"

items = HN.search(["git", "broken", "source control"], Time.at(1_759_000_000))
puts "items: #{items.map { |i| [i[:title], i[:matched]] }.inspect}"

raise "expected 2 deduped stories, got #{items.size}" unless items.size == 2
raise "not sorted by points: #{items.map { |i| i[:points] }}" unless items.map { |i| i[:points] } == [900, 50]
raise "matched terms not merged: #{items.first[:matched]}" unless items.first[:matched] == ["git", "source control"]
raise "link-less story should be dropped: #{items.map { |i| i[:title] }}" if items.any? { |i| i[:url].nil? || i[:title].start_with?("Ask HN") }

puts "hn_test.rb ok"
