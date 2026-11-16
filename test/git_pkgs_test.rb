require_relative "../_twipm/git_pkgs"

Repo = Struct.new(:name, :full_name, :pushed_at, :created_at)
Tag = Struct.new(:name, :commit)
Sha = Struct.new(:sha)
Commit = Struct.new(:commit)
Inner = Struct.new(:committer)
Committer = Struct.new(:date)

SINCE = Time.parse("2026-11-09T00:00:00Z")
RECENT = Time.parse("2026-11-12T10:00:00Z")
OLD = Time.parse("2026-10-01T10:00:00Z")

class FakeClient
  def org_repos(org, sort:)
    raise "wrong org #{org}" unless org == "git-pkgs"
    [
      Repo.new("proxy-ghsa-28p5-mxv5-j2px", "git-pkgs/proxy-ghsa-28p5-mxv5-j2px", RECENT, OLD),
      Repo.new("brief", "git-pkgs/brief", RECENT, OLD),
      Repo.new("stale", "git-pkgs/stale", OLD, OLD),
      Repo.new("never-reached", "git-pkgs/never-reached", RECENT, OLD)
    ]
  end

  def tags(full_name, per_page:)
    raise Octokit::NotFound if full_name.include?("-ghsa-")
    [Tag.new("v0.16.0", Sha.new("new")), Tag.new("v0.15.0", Sha.new("old"))]
  end

  def commit(_full_name, sha)
    Commit.new(Inner.new(Committer.new(sha == "new" ? RECENT : OLD)))
  end
end

releases = GitPkgs.releases(FakeClient.new, SINCE)
puts "releases: #{releases.inspect}"

raise "expected 1 release, got #{releases.size}" unless releases.size == 1
raise "wrong release: #{releases.first}" unless releases.first[:repo] == "brief" && releases.first[:tag] == "v0.16.0"
raise "wrong url: #{releases.first[:url]}" unless releases.first[:url] == "https://github.com/git-pkgs/brief/releases/tag/v0.16.0"

puts "git_pkgs_test.rb ok"
