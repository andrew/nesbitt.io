desc "Build the site"
task :test do
  sh "bundle exec jekyll build"
end

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

desc "Check links in posts"
task :links, [:year] do |t, args|
  unless system("which lychee > /dev/null 2>&1")
    abort "lychee not found. Install with: brew install lychee"
  end

  min_year = args[:year]&.to_i || 2024
  posts = Dir.glob("_posts/*.md").select do |post|
    year = File.basename(post)[0, 4].to_i
    next false if year < min_year
    next false if args[:year] && year != min_year
    true
  end

  if posts.empty?
    puts "No posts found"
    next
  end

  puts "Checking #{posts.size} posts..."
  system("lychee",
    "--no-progress",
    "--base-url", "https://nesbitt.io",
    "--accept", "200..=299,402,403,429",
    "--suggest",
    "--format", "detailed",
    "--insecure",
    "--exclude", "repology.org",
    *posts)
end

desc "Fetch GitHub projects and write to _data/projects.yml"
task :projects do
  require 'net/http'
  require 'json'
  require 'yaml'
  require 'time'

  username = 'andrew'

  # Repos shown in featured section or not relevant
  exclude = %w[
    first-pr
    hell-is-other-peoples-code
    package-managers
    open-source-metrics
    dotfiles
    andrew
  ]

  repos = []
  page = 1

  loop do
    uri = URI("https://api.github.com/users/#{username}/repos?per_page=100&page=#{page}&sort=pushed")
    request = Net::HTTP::Get.new(uri)
    request['Accept'] = 'application/vnd.github.v3+json'
    request['User-Agent'] = 'nesbitt.io-project-fetcher'
    request['Authorization'] = "token #{ENV['GITHUB_TOKEN']}" if ENV['GITHUB_TOKEN']

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(request) }
    batch = JSON.parse(response.body)
    break if batch.empty? || batch.is_a?(Hash)
    repos.concat(batch)
    break if batch.length < 100
    page += 1
  end

  cutoff = Time.now - (2 * 365 * 24 * 60 * 60)

  filtered = repos.select do |repo|
    next false if repo['fork']
    next false if repo['archived']
    next false if repo['description'].nil? || repo['description'].empty?
    next false if exclude.include?(repo['name'])
    pushed_recently = Time.parse(repo['pushed_at']) > cutoff
    has_stars = repo['stargazers_count'] >= 10
    pushed_recently || has_stars
  end

  filtered.sort_by! { |r| -r['stargazers_count'] }

  projects = filtered.map do |repo|
    {
      'name' => repo['name'],
      'url' => repo['html_url'],
      'description' => repo['description'],
      'stars' => repo['stargazers_count'],
      'language' => repo['language'],
      'pushed_at' => repo['pushed_at']
    }
  end

  File.write('_data/projects.yml', projects.to_yaml)
  puts "Wrote #{projects.length} projects to _data/projects.yml"
end

desc "Show word counts for posts, optionally filtered by tag and/or year"
task :wordcount, [:tag, :year] do |t, args|
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
