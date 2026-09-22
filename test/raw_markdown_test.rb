root = File.expand_path("..", __dir__)

pages = {
  "package-manager-threat-model" => ["# Package Manager Threat Model\n", "## Trust boundary"],
  "about" => ["# About\n", "I'm Andrew Nesbitt."],
  "consulting" => ["# Package Management Consulting\n", "## What I can help with"],
  "cv" => ["# Andrew Nesbitt's CV\n", "### Projects"],
  "oss-is-going-just-great" => ["# OSS Is Going Just Great\n", "## 2024"]
}

pages.each do |slug, (h1, body_marker)|
  markdown_path = File.join(root, "_site/#{slug}.md")
  raise "#{slug}.md was not written" unless File.exist?(markdown_path)

  content = File.read(markdown_path)
  raise "#{slug}.md must not contain front matter" if content.start_with?("---")
  raise "#{slug}.md must start with the page title as an H1" unless content.start_with?(h1)
  raise "#{slug}.md is missing the page body" unless content.include?(body_marker)
  raise "#{slug}.md contains unrendered Liquid" if content.match?(/\{\{|\{%/)
  raise "#{slug}.md contains a script tag" if content.include?("<script")
  footer = "By Andrew Nesbitt (https://nesbitt.io). Markdown version of https://nesbitt.io/#{slug}/"
  raise "#{slug}.md is missing the attribution footer" unless content.end_with?("#{footer}\n")

  html = File.read(File.join(root, "_site/#{slug}/index.html"))
  link = %(<link rel="alternate" type="text/markdown" href="/#{slug}.md">)
  raise "#{slug} HTML page is missing the markdown link tag" unless html.include?(link)
end
