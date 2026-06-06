#!/usr/bin/env ruby
# Render the Liquid template against the YAML data and print a summary plus
# the last 40 lines so you can sanity-check recent additions.

require "yaml"
require "liquid"

data = YAML.load_file("_data/package_management_papers.yml")
template = File.read("_includes/package_management_papers.md")

rendered = Liquid::Template.parse(template).render(
  "site" => { "data" => { "package_management_papers" => data } }
)

papers = data["sections"].sum { |s| s["papers"].size }
puts "sections: #{data['sections'].size}"
puts "papers:   #{papers}"
puts "rendered: #{rendered.lines.size} lines, #{rendered.size} bytes"
puts
puts "tail (last 40 lines):"
puts rendered.lines.last(40).join
