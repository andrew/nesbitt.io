#!/usr/bin/env ruby
require 'net/http'
require 'uri'
require 'rexml/document'

FEED_URL = 'https://nesbitt.io/feed.xml'
README_PATH = 'README.md'
LIMIT = 10

POSTS_START = '<!-- POSTS:START -->'
POSTS_END = '<!-- POSTS:END -->'

def fetch_feed
  uri = URI(FEED_URL)
  response = Net::HTTP.get_response(uri)
  abort "Failed to fetch feed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)
  REXML::Document.new(response.body)
end

def parse_posts(doc)
  posts = []
  doc.elements.each('feed/entry') do |entry|
    break if posts.length >= LIMIT

    title = entry.elements['title']&.text
    link = entry.elements['link']&.attributes['href']
    next unless title && link

    posts << { title: title, url: link }
  end
  posts
end

def format_posts(posts)
  posts.map { |post| "- [#{post[:title]}](#{post[:url]})" }.join("\n")
end

def update_readme(posts)
  content = File.read(README_PATH)
  new_section = "#{POSTS_START}\n#{format_posts(posts)}\n#{POSTS_END}"

  unless content.include?(POSTS_START) && content.include?(POSTS_END)
    abort "README missing markers: #{POSTS_START} and #{POSTS_END}"
  end

  updated = content.gsub(/#{Regexp.escape(POSTS_START)}.*#{Regexp.escape(POSTS_END)}/m, new_section)

  if updated == content
    puts "No changes to README"
  else
    File.write(README_PATH, updated)
    puts "Updated README with #{posts.length} posts"
  end
end

doc = fetch_feed
posts = parse_posts(doc)
update_readme(posts)
