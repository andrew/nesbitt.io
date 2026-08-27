require "nokogiri"

root = File.expand_path("..", __dir__)
post_path = File.join(root, "_site/2026/08/25/hardening-the-override-flag.html")
document = Nokogiri::HTML(File.read(post_path))
header = document.at_css("article.post header.post-header")
elements = header.element_children
title_index = elements.index { |element| element.matches?("h1.post-title") }
tagline_index = elements.index { |element| element.matches?("p.post-tagline") }
meta_index = elements.index { |element| element.matches?("p.post-meta") }
expected_tagline = "export PIP_BREAK_SYSTEM_PACKAGES=1"
metadata = elements[meta_index].element_children
date_index = metadata.index { |element| element.matches?("time.dt-published") }
tags_index = metadata.index { |element| element.matches?("span.post-tags") }

raise "Post tagline is missing" unless tagline_index
raise "Post tagline does not match post description" unless elements[tagline_index].text.strip == expected_tagline
raise "Post tagline must follow the title" unless title_index < tagline_index
raise "Post tagline must precede the metadata" unless tagline_index < meta_index
raise "Post date must precede the tags" unless date_index < tags_index
