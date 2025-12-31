desc "Update README with recent posts from RSS feed"
task :readme do
  require 'net/http'
  require 'rexml/document'

  response = Net::HTTP.get_response(URI('https://nesbitt.io/feed.xml'))
  abort "Failed to fetch feed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

  posts = []
  REXML::Document.new(response.body).elements.each('feed/entry') do |entry|
    break if posts.length >= 10
    title = entry.elements['title']&.text
    link = entry.elements['link']&.attributes['href']
    posts << "- [#{title}](#{link})" if title && link
  end

  content = File.read('README.md')
  updated = content.gsub(
    /<!-- POSTS:START -->.*<!-- POSTS:END -->/m,
    "<!-- POSTS:START -->\n#{posts.join("\n")}\n<!-- POSTS:END -->"
  )

  if updated == content
    puts "No changes to README"
  else
    File.write('README.md', updated)
    puts "Updated README with #{posts.length} posts"
  end
end

desc "List posts and their tags"
task :tags do
  posts = Dir.glob("_posts/*.md").select do |post|
    year = File.basename(post)[0, 4].to_i
    year >= 2024
  end.sort

  posts.each do |post|
    content = File.read(post)
    frontmatter = content.match(/\A---\n(.+?)\n---/m)&.[](1) || ""
    tags = frontmatter.scan(/^  - (.+)$/).flatten.join(", ")
    name = File.basename(post, ".md")
    puts "#{name}: #{tags}"
  end
end

desc "Show word counts for posts, optionally filtered by year and/or tag"
task :wordcount, [:year, :tag] do |t, args|
  min_year = args[:year]&.to_i || 2024
  posts = Dir.glob("_posts/*.md").select do |post|
    year = File.basename(post)[0, 4].to_i
    next false if year < min_year
    next false if args[:year] && year != min_year

    if args[:tag]
      content = File.read(post)
      frontmatter = content.match(/\A---\n(.+?)\n---/m)&.[](1) || ""
      frontmatter.include?("- #{args[:tag]}")
    else
      true
    end
  end.sort

  if posts.empty?
    puts "No posts found"
    next
  end

  total = 0
  puts "| Post | Words |"
  puts "|------|------:|"

  posts.each do |post|
    words = File.read(post).split.size
    total += words
    name = File.basename(post)
    puts "| #{name} | #{words.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse} |"
  end

  avg = total / posts.size
  puts "| **Total** | **#{total.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse}** |"
  puts "| **Average** | **#{avg.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse}** |"
  puts "\n#{posts.size} posts"
end
