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

desc "Show word counts for recent posts (2024+), optionally filtered by tag"
task :wordcount, [:tag] do |t, args|
  posts = Dir.glob("_posts/*.md").select do |post|
    year = File.basename(post)[0, 4].to_i
    next false if year < 2024

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
