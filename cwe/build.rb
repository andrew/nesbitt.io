#!/usr/bin/env ruby
require "nokogiri"
require "json"

HERE = __dir__
DATA = ARGV[0] || ENV["CWE_DATA"] || File.expand_path("../../cwe-data", HERE)
XML  = Dir[File.join(DATA, "cwec_v*.xml")].max
CVES = File.join(DATA, "cvelistV5-main", "cves")
OUT  = File.join(HERE, "cwe_data.json")

abort "Data dir not found: #{DATA}" unless File.directory?(DATA)

NS = { "c" => "http://cwe.mitre.org/cwe-7" }

abort "CWE XML not found" unless XML && File.exist?(XML)

puts "Parsing #{File.basename(XML)}"
doc = Nokogiri::XML(File.read(XML))

weaknesses = {}
doc.xpath("//c:Weaknesses/c:Weakness", NS).each do |w|
  id = w["ID"].to_i
  desc = w.at_xpath("c:Description", NS)&.text&.strip
  weaknesses[id] = {
    id: id,
    name: w["Name"],
    abstraction: w["Abstraction"],
    status: w["Status"],
    description: desc && desc[0, 300],
    count: 0
  }
end
puts "  #{weaknesses.size} weaknesses"

categories = {}
doc.xpath("//c:Categories/c:Category", NS).each do |c|
  id = c["ID"].to_i
  members = c.xpath("c:Relationships/c:Has_Member", NS).map do |m|
    { id: m["CWE_ID"].to_i, view: m["View_ID"].to_i }
  end
  categories[id] = {
    id: id,
    name: c["Name"],
    status: c["Status"],
    summary: c.at_xpath("c:Summary", NS)&.text&.strip,
    members: members
  }
end
puts "  #{categories.size} categories"

puts "Counting CWE references in CVEs (this may take a minute)"
counts = Hash.new(0)
total_cves = 0
cwe_re = /"cweId"\s*:\s*"CWE-(\d+)"/

Dir.glob(File.join(CVES, "**", "CVE-*.json")).each do |path|
  total_cves += 1
  File.read(path).scan(cwe_re) { |(n)| counts[n.to_i] += 1 }
  print "\r  #{total_cves} files" if total_cves % 5000 == 0
end
puts "\r  #{total_cves} files, #{counts.size} distinct CWEs referenced"

counts.each { |id, n| weaknesses[id][:count] = n if weaknesses[id] }

unmapped = counts.reject { |id, _| weaknesses.key?(id) }
puts "  #{unmapped.size} CWE IDs in CVEs not found as weaknesses (categories/views/typos)"

def build_view(doc, view_id, categories, weaknesses)
  view = doc.at_xpath("//c:Views/c:View[@ID='#{view_id}']", NS)
  cat_ids = view.xpath("c:Members/c:Has_Member", NS).map { |m| m["CWE_ID"].to_i }

  children = cat_ids.filter_map do |cid|
    cat = categories[cid]
    next unless cat
    leaves = cat[:members]
      .select { |m| m[:view] == view_id }
      .filter_map { |m| weaknesses[m[:id]] }
      .reject { |w| w[:status] == "Deprecated" }
      .map { |w| { id: "CWE-#{w[:id]}", name: w[:name], abstraction: w[:abstraction], description: w[:description], value: [w[:count], 1].max, count: w[:count] } }
    next if leaves.empty?
    name = cat[:name].sub(/^Comprehensive Categorization:\s*/, "")
    { id: "CWE-#{cat[:id]}", name: name, summary: cat[:summary], children: leaves }
  end

  { id: "CWE-#{view_id}", name: view["Name"], children: children }
end

tree = build_view(doc, 1400, categories, weaknesses)

leaf_count = tree[:children].sum { |c| c[:children].size }
total_refs = counts.values.sum
puts "View 1400: #{tree[:children].size} categories, #{leaf_count} weaknesses, #{total_refs} total CVE→CWE refs"

output = {
  generated: Time.now.utc.iso8601,
  cwe_version: doc.root["Version"],
  cve_files: total_cves,
  total_refs: total_refs,
  tree: tree,
  top: counts.sort_by { |_, n| -n }.first(25).map { |id, n| { id: "CWE-#{id}", name: weaknesses.dig(id, :name), count: n } }
}

File.write(OUT, JSON.pretty_generate(output))
puts "Wrote #{OUT} (#{(File.size(OUT) / 1024.0).round(1)} KB)"
