task default: :test

desc "Add archive.org links to papers post"
task :archive_papers, [:mode] do |t, args|
  require 'net/http'
  require 'json'
  require 'uri'

  papers_file = "_posts/2025-11-13-package-management-papers.md"
  content = File.read(papers_file)
  mode = args[:mode] || "report"  # report, save, or update

  # Extract paper URLs (markdown links starting with **)
  paper_links = content.scan(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/)

  puts "Found #{paper_links.size} papers\n\n"

  results = { archived: [], missing: [], errors: [] }

  paper_links.each_with_index do |(title, url), i|
    print "\r[#{i + 1}/#{paper_links.size}] Checking..."
    $stdout.flush

    begin
      # Skip archive.org URLs themselves
      if url.include?("archive.org")
        results[:archived] << { title: title, url: url, archive: url }
        next
      end

      # Check Wayback Machine availability
      check_uri = URI("https://archive.org/wayback/available?url=#{URI.encode_www_form_component(url)}")
      response = Net::HTTP.get_response(check_uri)
      data = JSON.parse(response.body)

      if data.dig("archived_snapshots", "closest", "available")
        archive_url = data.dig("archived_snapshots", "closest", "url")
        results[:archived] << { title: title, url: url, archive: archive_url }
      else
        results[:missing] << { title: title, url: url }

        # Save to Wayback Machine if requested
        if mode == "save"
          print "\r[#{i + 1}/#{paper_links.size}] Saving #{url[0, 50]}..."
          $stdout.flush
          save_uri = URI("https://web.archive.org/save/#{url}")
          begin
            save_response = Net::HTTP.get_response(save_uri)
            if save_response.is_a?(Net::HTTPSuccess) || save_response.is_a?(Net::HTTPRedirection)
              puts "\n  Saved: #{url}"
            end
          rescue => e
            puts "\n  Failed to save: #{e.message}"
          end
          sleep 5  # Rate limit for save requests
        end
      end

      sleep 0.5  # Rate limit for API
    rescue => e
      results[:errors] << { title: title, url: url, error: e.message }
    end
  end

  puts "\r" + " " * 60 + "\r"  # Clear progress line

  # Report
  puts "=" * 60
  puts "ARCHIVE STATUS REPORT"
  puts "=" * 60
  puts "\nArchived: #{results[:archived].size}"
  puts "Missing:  #{results[:missing].size}"
  puts "Errors:   #{results[:errors].size}"

  if results[:missing].any?
    puts "\n" + "-" * 60
    puts "MISSING FROM ARCHIVE:"
    puts "-" * 60
    results[:missing].each do |paper|
      puts "  #{paper[:title][0, 50]}..."
      puts "  #{paper[:url]}"
      puts
    end
  end

  if results[:errors].any?
    puts "\n" + "-" * 60
    puts "ERRORS:"
    puts "-" * 60
    results[:errors].each do |paper|
      puts "  #{paper[:title][0, 50]}: #{paper[:error]}"
    end
  end

  # Update file if requested
  if mode == "update" && results[:archived].any?
    puts "\nUpdating #{papers_file}..."

    updated_content = content.dup
    results[:archived].each do |paper|
      next if paper[:url] == paper[:archive]  # Skip if already an archive link

      old_link = "**[#{paper[:title]}](#{paper[:url]})**"
      next if updated_content.include?("#{old_link} ([archive]")  # Skip if this paper already has archive link

      new_link = "**[#{paper[:title]}](#{paper[:url]})** ([archive](#{paper[:archive]}))"
      updated_content.gsub!(old_link, new_link)
    end

    if updated_content != content
      File.write(papers_file, updated_content)
      puts "Updated file with archive links"
    else
      puts "No changes made"
    end
  end

  puts "\nUsage:"
  puts "  rake archive_papers           # Report only"
  puts "  rake archive_papers[save]     # Save missing to archive.org"
  puts "  rake archive_papers[update]   # Add archive links to file"
end

desc "Build the site and check workflows"
task :test do
  sh "bundle exec jekyll build"
  sh "zizmor .github/workflows/"
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

desc "Check links in posts (pass year like 2026, or single post path)"
task :links, [:arg] do |t, args|
  unless system("which lychee > /dev/null 2>&1")
    abort "lychee not found. Install with: brew install lychee"
  end

  arg = args[:arg]

  if arg && (arg.include?("/") || arg.end_with?(".md"))
    posts = [arg].select { |p| File.exist?(p) }
    abort "File not found: #{arg}" if posts.empty?
  else
    min_year = arg&.to_i || 2024
    posts = Dir.glob("_posts/*.md").select do |post|
      year = File.basename(post)[0, 4].to_i
      next false if year < min_year
      next false if arg && year != min_year
      true
    end
  end

  if posts.empty?
    puts "No posts found"
    next
  end

  puts "Checking #{posts.size} post#{'s' unless posts.size == 1}..."
  system("lychee",
    "--no-progress",
    "--base-url", "https://nesbitt.io",
    "--accept", "200..=299,402,403,429",
    "--suggest",
    "--format", "detailed",
    "--insecure",
    "-v",
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
