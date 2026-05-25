task default: :test

namespace :twipm do
  NEWSBOAT_ARGS = %w[
    -u _twipm/newsboat/urls
    -c _twipm/newsboat/cache.db
    -C _twipm/newsboat/config
  ].freeze

  desc "Re-fetch OPML from ecosyste-ms and reimport feed list"
  task :opml do
    require "net/http"
    url = "https://raw.githubusercontent.com/ecosyste-ms/package-managers-opml/main/package-manager.opml"
    body = Net::HTTP.get(URI(url))
    File.write("_twipm/newsboat/package-manager.opml", body)
    File.write("_twipm/newsboat/urls", "")
    sh "newsboat", *NEWSBOAT_ARGS, "-i", "_twipm/newsboat/package-manager.opml"
    extra = "_twipm/newsboat/urls.extra"
    File.open("_twipm/newsboat/urls", "a") { |f| f.write(File.read(extra)) } if File.exist?(extra)
    puts File.readlines("_twipm/newsboat/urls").size.to_s + " feeds"
  end

  desc "Reload feeds and write _twipm/collected.json (default 7 days)"
  task :collect, [:days] do |t, args|
    days = args[:days] || "7"
    Bundler.with_unbundled_env do
      sh({ "BUNDLE_GEMFILE" => "_twipm/Gemfile" }, "bundle", "exec", "ruby", "_twipm/collect.rb", "--days", days)
    end
  end
end

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

namespace :matrix do
  CANONICAL_REPOS = {
    "npm"        => %w[npm/cli],
    "Yarn"       => %w[yarnpkg/berry yarnpkg/yarn],
    "pnpm"       => %w[pnpm/pnpm],
    "Bun"        => %w[oven-sh/bun],
    "pip"        => %w[pypa/pip],
    "Poetry"     => %w[python-poetry/poetry],
    "uv"         => %w[astral-sh/uv],
    "pdm"        => %w[pdm-project/pdm],
    "Conda"      => %w[conda/conda],
    "Bundler"    => %w[rubygems/bundler rubygems/rubygems],
    "RubyGems"   => %w[rubygems/rubygems],
    "Cargo"      => %w[rust-lang/cargo rust-lang/rust],
    "Go"         => %w[golang/go],
    "Maven"      => %w[apache/maven],
    "Gradle"     => %w[gradle/gradle],
    "Composer"   => %w[composer/composer],
    "NuGet"      => %w[nuget/nuget.client dotnet/sdk],
    "pub"        => %w[dart-lang/pub dart-lang/sdk],
    "Hex"        => %w[hexpm/hex elixir-lang/elixir],
    "Cabal"      => %w[haskell/cabal],
    "opam"       => %w[ocaml/opam],
    "CocoaPods"  => %w[cocoapods/cocoapods],
    "Swift Package Manager" => %w[swiftlang/swift-package-manager apple/swift-package-manager],
    "apt"        => %w[debian/apt],
    "DNF"        => %w[rpm-software-management/dnf],
    "pacman"     => %w[archlinux/pacman],
    "apk"        => %w[alpinelinux/apk-tools],
    "Homebrew"   => %w[homebrew/brew],
    "Nix"        => %w[nixos/nix],
    "Guix"       => %w[guix-mirror/guix],
    "Spack"      => %w[spack/spack],
    "CPAN"       => %w[andk/cpanpm perl/perl5],
    "CRAN"       => %w[r-devel/r-svn wch/r-source],
    "Hackage"    => %w[haskell/hackage-server],
    "Elm"        => %w[elm/compiler],
    "Stack"      => %w[commercialhaskell/stack],
    "Julia"      => %w[julialang/julia julialang/pkg.jl],
    "LuaRocks"   => %w[luarocks/luarocks],
    "Helm"       => %w[helm/helm],
    "dub"        => %w[dlang/dub],
    "vcpkg"      => %w[microsoft/vcpkg],
    "Conan"      => %w[conan-io/conan]
  }.freeze

  CANONICAL_URLS = {
    "apt"    => %w[https://salsa.debian.org/apt-team/apt],
    "pacman" => %w[https://gitlab.archlinux.org/pacman/pacman],
    "apk"    => %w[https://gitlab.alpinelinux.org/alpine/apk-tools],
    "Guix"   => %w[https://git.savannah.gnu.org/git/guix.git],
    "CRAN"   => %w[https://svn.r-project.org/R]
  }.freeze

  ECOSYSTEM_MAP = {
    "npm"       => %w[npm Yarn pnpm Bun],
    "pypi"      => %w[pip Poetry uv pdm],
    "rubygems"  => %w[RubyGems Bundler],
    "cargo"     => %w[Cargo],
    "nuget"     => %w[NuGet],
    "maven"     => %w[Maven Gradle],
    "packagist" => %w[Composer],
    "cocoapods" => %w[CocoaPods],
    "pub"       => %w[pub],
    "cpan"      => %w[CPAN],
    "cran"      => %w[CRAN],
    "hex"       => %w[Hex],
    "hackage"   => %w[Cabal Stack],
    "julia"     => %w[Julia],
    "swiftpm"   => ["Swift Package Manager"],
    "elm"       => %w[Elm],
    "conan"     => %w[Conan],
    "conda"     => %w[Conda]
  }.freeze

  REPOLOGY_PROJECTS = {
    "npm"        => %w[npm nodejs],
    "Yarn"       => %w[yarn],
    "pnpm"       => %w[pnpm],
    "Bun"        => %w[bun],
    "pip"        => %w[pip python],
    "Poetry"     => %w[poetry],
    "uv"         => %w[uv],
    "pdm"        => %w[pdm],
    "Conda"      => %w[conda miniconda3],
    "Bundler"    => %w[ruby:bundler ruby],
    "RubyGems"   => %w[ruby],
    "Cargo"      => %w[cargo rust],
    "Go"         => %w[go],
    "Maven"      => %w[maven],
    "Gradle"     => %w[gradle],
    "Composer"   => %w[php:composer],
    "NuGet"      => %w[nuget dotnet],
    "pub"        => %w[dart flutter],
    "Hex"        => %w[elixir],
    "Cabal"      => %w[cabal-install],
    "opam"       => %w[opam],
    "CocoaPods"  => %w[cocoapods],
    "Swift Package Manager" => %w[swift],
    "apt"        => %w[apt dpkg],
    "DNF"        => %w[dnf],
    "pacman"     => %w[pacman-package-manager],
    "apk"        => %w[apk-tools],
    "Homebrew"   => %w[brew],
    "Nix"        => %w[nix],
    "Guix"       => %w[guix],
    "Spack"      => %w[spack],
    "CPAN"       => %w[perl],
    "CRAN"       => %w[r],
    "Hackage"    => %w[cabal-install],
    "Elm"        => %w[elm-compiler],
    "Stack"      => %w[haskell:stack],
    "Julia"      => %w[julia],
    "LuaRocks"   => %w[luarocks],
    "Helm"       => %w[kubernetes-helm],
    "dub"        => %w[dub],
    "vcpkg"      => %w[vcpkg],
    "Conan"      => %w[conan]
  }.freeze

  PROBE_NAMES = {
    "npm" => %w[npm], "Yarn" => %w[yarn], "pnpm" => %w[pnpm], "Bun" => %w[bun],
    "pip" => %w[pip], "Poetry" => %w[poetry], "uv" => %w[uv], "pdm" => %w[pdm],
    "Conda" => %w[conda], "Bundler" => %w[bundler], "RubyGems" => %w[rubygems],
    "Cargo" => %w[cargo rust], "Go" => %w[go golang], "Maven" => %w[maven], "Gradle" => %w[gradle],
    "Composer" => %w[composer], "NuGet" => %w[nuget], "pub" => %w[pub],
    "Hex" => %w[hex], "Cabal" => %w[cabal], "opam" => %w[opam],
    "CocoaPods" => %w[cocoapods], "Swift Package Manager" => %w[swiftpm],
    "apt" => %w[apt], "DNF" => %w[dnf], "pacman" => %w[pacman], "apk" => %w[apk],
    "Homebrew" => %w[homebrew brew], "Nix" => %w[nix], "Guix" => %w[guix],
    "Spack" => %w[spack], "CPAN" => %w[cpan], "CRAN" => %w[cran],
    "Hackage" => %w[hackage cabal-install], "Elm" => %w[elm], "Stack" => %w[stack],
    "Julia" => %w[julia], "LuaRocks" => %w[luarocks], "Helm" => %w[helm],
    "dub" => %w[dub], "vcpkg" => %w[vcpkg], "Conan" => %w[conan]
  }.freeze

  def http_json(url)
    uri = URI(url)
    req = Net::HTTP::Get.new(uri)
    req["User-Agent"] = "nesbitt.io-matrix (andrewnez@gmail.com; +https://nesbitt.io)"
    req["Accept"] = "application/json"
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https",
                          open_timeout: 5, read_timeout: 15) { |h| h.request(req) }
    res.is_a?(Net::HTTPSuccess) ? JSON.parse(res.body) : nil
  rescue
    nil
  end

  def ecosystems_lookup(repo_url)
    enc = URI.encode_www_form_component(repo_url)
    pkgs = http_json("https://packages.ecosyste.ms/api/v1/packages/lookup?repository_url=#{enc}&per_page=1000")
    pkgs || []
  end

  def repology_repos(project)
    uri = URI("https://repology.org/api/v1/project/#{project}")
    req = Net::HTTP::Get.new(uri)
    req["User-Agent"] = "nesbitt.io-matrix (andrewnez@gmail.com; +https://nesbitt.io)"
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true,
                          open_timeout: 5, read_timeout: 10) { |h| h.request(req) }
    return [] unless res.is_a?(Net::HTTPSuccess)
    JSON.parse(res.body)
  rescue
    []
  end

  REPOLOGY_REPO_MAP = {
    /\Adebian_/    => "apt",
    /\Aubuntu_/    => "apt",
    /\Adevuan_/    => "apt",
    /\Araspbian_/  => "apt",
    /\Akali_/      => "apt",
    /\Apureos_/    => "apt",
    /\Aapertis_/   => "apt",
    /\Afedora_/    => "DNF",
    /\Acentos_/    => "DNF",
    /\Arocky_/     => "DNF",
    /\Aalmalinux_/ => "DNF",
    /\Aepel_/      => "DNF",
    /\Aarch\z/     => "pacman",
    /\Aaur\z/      => "pacman",
    /\Amanjaro_/   => "pacman",
    /\Aartix\z/    => "pacman",
    /\Aalpine_/    => "apk",
    /\Ahomebrew/   => "Homebrew",
    /\Anix_/       => "Nix",
    /\Agnuguix\z/  => "Guix",
    /\Aspack\z/    => "Spack",
    /\Avcpkg\z/    => "vcpkg",
    /\Aconda/      => "Conda"
  }.freeze

  desc "Probe ecosyste.ms (language registries) + Repology (system registries), write data/package-manager-matrix.csv"
  task :probe do
    require "csv"
    require "json"
    require "net/http"
    require "uri"
    require "set"

    targets = CSV.read("data/package-manager-clients.csv", headers: true).map { |r| r["client"] }
    CSV.open("_data/package_manager_clients.csv", "w") do |csv|
      csv << ["client"]
      targets.each { |t| csv << [t] }
    end
    rows = []
    if File.exist?("_data/package_manager_matrix.csv")
      CSV.foreach("_data/package_manager_matrix.csv", headers: true) do |r|
        rows << r.fields if %w[manual squat].include?(r["confidence"])
      end
    end
    pinned = rows.map { |r| [r[0], r[1]] }.to_set

    targets.each_with_index do |target, i|
      print "\r[#{i + 1}/#{targets.size}] #{target.ljust(24)}"
      $stdout.flush

      repo_urls = (CANONICAL_REPOS[target] || []).map { |p| "https://github.com/#{p}" } +
                  (CANONICAL_URLS[target] || [])

      hits = {}
      repo_urls.each do |url|
        ecosystems_lookup(url).each do |pkg|
          installers = ECOSYSTEM_MAP[pkg["ecosystem"]] || []
          aliases = PROBE_NAMES[target] || []
          name = pkg["name"].downcase
          score = aliases.index { |a| name == a } ||
                  (aliases.any? { |a| name.split(/[\s.:\/_-]+/).include?(a) } ? 50 + name.length : nil)
          next unless score
          installers.each do |installer|
            next unless targets.include?(installer)
            if hits[installer].nil? || score < hits[installer][:score]
              hits[installer] = { name: pkg["name"], url: pkg["registry_url"] || pkg["homepage"], score: score }
            end
          end
        end
      end
      hits.each do |installer, h|
        rows << [installer, target, h[:name], h[:url], "ecosystems"] unless pinned.include?([installer, target])
      end

      (REPOLOGY_PROJECTS[target] || []).each do |proj|
        repology_repos(proj).each do |entry|
          installer = REPOLOGY_REPO_MAP.find { |re, _| re.match?(entry["repo"]) }&.last
          next unless installer && targets.include?(installer)
          next if hits.key?(installer)
          hits[installer] = true
          rows << [installer, target, entry["visiblename"] || entry["srcname"] || entry["binname"] || proj,
                   "https://repology.org/project/#{proj}/versions", "repology"]
        end
        sleep 1
      end
    end

    print "\r" + " " * 50 + "\r"
    rows.uniq! { |r| [r[0], r[1]] }

    CSV.open("_data/package_manager_matrix.csv", "w") do |csv|
      csv << %w[installer target package_name url confidence]
      rows.sort_by { |r| [r[0].downcase, r[1].downcase] }.each { |r| csv << r }
    end

    real = rows.reject { |r| r[4] == "squat" }
    by_installer = real.group_by(&:first).transform_values(&:size).sort_by { |_, v| -v }
    puts "Wrote #{rows.size} cells (#{real.size} real, #{rows.size - real.size} squat) to _data/package_manager_matrix.csv"
    puts
    by_installer.each { |inst, n| puts "  #{inst.ljust(12)} packages #{n}" }
    puts
    puts "Self-packaging: #{real.select { |r| r[0] == r[1] }.map(&:first).sort.join(', ')}"
  end


  desc "Print the matrix as a text grid"
  task :show do
    require "csv"
    targets = CSV.read("data/package-manager-clients.csv", headers: true).map { |r| r["client"] }
    cells = {}
    glyph = { "ecosystems" => "x", "repology" => "x", "manual" => "X", "squat" => nil }
    CSV.foreach("_data/package_manager_matrix.csv", headers: true) do |r|
      g = glyph.fetch(r["confidence"], "?")
      cells[[r["installer"], r["target"]]] = g if g
    end
    w = targets.map(&:size).max + 1
    print " " * w
    targets.each_with_index { |_, i| print (i + 1).to_s.rjust(3) }
    puts
    targets.each_with_index do |inst, i|
      print "#{i + 1}".rjust(3) + " " + inst.ljust(w - 4)
      targets.each do |tgt|
        c = cells[[inst, tgt]]
        print (inst == tgt ? (c || "\\") : (c || ".")).rjust(3)
      end
      puts
    end
  end
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
