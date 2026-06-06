#!/usr/bin/env ruby
# Parse _posts/2025-11-13-package-management-papers.md and write
# _data/package_management_papers.yml.
#
# Run once to migrate. After that, edit the YAML directly.

require "yaml"

SRC  = "_posts/2025-11-13-package-management-papers.md"
DEST = "_data/package_management_papers.yml"

def slugify(s)
  s.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, "")
end

def extract_ids(url)
  ids = {}
  if url =~ %r{arxiv\.org/(?:abs|pdf|html)/([\d\.]+(?:v\d+)?)}
    ids["arxiv"] = $1.sub(/v\d+$/, "")
  end
  if url =~ %r{doi\.org/(.+?)/?$}
    ids["doi"] = $1
  elsif url =~ %r{dl\.acm\.org/doi/(?:full/|abs/)?(10\.\d+/[^?#]+)}
    ids["doi"] = $1.chomp("/")
  end
  ids
end

def parse_paper(block)
  lines = block.lines
  header = lines.shift.rstrip

  m = header.match(/\A\*\*\[(.+?)\]\((.+?)\)\*\*(?:\s+\(\[archive\]\((.+?)\)\))?(?:\s+\|\s*\[GitHub\]\((.+?)\))?\s*\((\d{4}(?:,\s*\d{4})?)\)\s*\z/)
  unless m
    warn "skip: #{header[0, 80]}"
    return nil
  end
  title, url, archive_url, github_url, year = m.captures

  lines.shift while lines.first && lines.first.strip.empty?

  authors = nil
  if lines.first && (a = lines.first.match(/\A\*(.+?)\*\s*\z/))
    authors = a[1]
    lines.shift
  end

  lines.shift while lines.first && lines.first.strip.empty?

  venue = nil
  if lines.first && !lines.first.start_with?("**[")
    venue = lines.shift.strip
  end

  notes = lines.join.strip
  notes = nil if notes && notes.empty?

  paper = {
    "title"       => title,
    "url"         => url,
    "archive_url" => archive_url,
    "github_url"  => github_url,
    "year"        => year,
    "authors"     => authors,
    "venue"       => venue,
    "notes"       => notes,
    "ids"         => extract_ids(url),
  }
  paper["ids"] = nil if paper["ids"].empty?
  paper.compact
end

src = File.read(SRC)
m = src.match(/\A---\n(.+?)\n---\n(.*)\z/m)
abort "no frontmatter" unless m
body = m[2]

# Split off intro (everything before first ## )
intro, rest = body.split(/(?=^## )/m, 2)

# Capture trailing prose after the last paper section (the "If you're aware..." line)
outro = nil
if rest
  # Detect the final paragraph that isn't a paper (no leading **[ and not under a heading)
  # Easier: split into section blocks by ^## , then on the LAST block remove a trailing
  # paragraph that doesn't start with **[
end

sections = []
rest.scan(/^## ([^\n]+)\n(.*?)(?=^## |\z)/m).each do |title, chunk|
  desc, papers_text = chunk.split(/(?=^\*\*\[)/, 2)
  desc = desc.to_s.strip
  desc = nil if desc.empty?

  # Trailing prose after the last paper (only present in the final section)
  trailing = nil
  if papers_text
    paper_blocks = papers_text.split(/(?=^\*\*\[)/).reject { |b| b.strip.empty? }

    # If the last block contains content after a blank line that isn't a paper line,
    # carve off a trailing-prose paragraph for outro detection.
    if (last = paper_blocks.last) && (parts = last.split(/\n\n(?!\*)/, 2)).size == 2
      # No-op: trailing prose within a paper's notes is fine.
    end

    paper_blocks.each do |block|
      paper = parse_paper(block)
      sections << { paper: paper, section_title: title.strip, section_desc: desc, section_id: slugify(title.strip) } if paper
    end
  end
end

# Re-group into sections preserving order, deduping by title within each section
grouped = []
sections.each do |row|
  current = grouped.last
  if !current || current["title"] != row[:section_title]
    grouped << {
      "id" => row[:section_id],
      "title" => row[:section_title],
      "description" => row[:section_desc],
      "papers" => [],
    }
    grouped.last.compact!
  end
  if grouped.last["papers"].any? { |p| p["title"] == row[:paper]["title"] }
    warn "dedup: #{row[:paper]['title']}"
    next
  end
  grouped.last["papers"] << row[:paper]
end

# Detect outro: the original post ends with a paragraph after the last paper.
# Pull it out by trimming trailing prose from the last paper's notes if it
# matches the "If you're aware" pattern.
if (last_section = grouped.last) && (last_paper = last_section["papers"].last) && last_paper["notes"]
  if last_paper["notes"] =~ /\A(.*?)\n\n(If you're aware of research.*)\z/m
    last_paper["notes"] = $1.strip
    @outro = $2.strip
  end
end

data = {
  "intro" => intro.strip,
  "outro" => @outro,
  "sections" => grouped,
}.compact

File.write(DEST, data.to_yaml(line_width: -1))
puts "wrote #{DEST}: #{grouped.size} sections, #{grouped.sum { |s| s['papers'].size }} papers"
