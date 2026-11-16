require "octokit"
require "time"

module GitPkgs
  ORG = "git-pkgs"

  def self.releases(client, since)
    results = []
    client.org_repos(ORG, sort: "pushed").each do |repo|
      break if repo.pushed_at < since
      results.concat(repo_releases(client, repo, since))
    end
    results.sort_by { |r| r[:repo] }
  end

  # Private advisory forks are listed for the org but 404 on tags.
  def self.repo_releases(client, repo, since)
    client.tags(repo.full_name, per_page: 3).first(3).filter_map do |tag|
      published = client.commit(repo.full_name, tag.commit.sha).commit.committer.date
      next if published < since
      {
        repo: repo.name,
        tag: tag.name,
        url: "https://github.com/#{repo.full_name}/releases/tag/#{tag.name}",
        published: published.utc.iso8601,
        repo_created: repo.created_at.utc.iso8601
      }
    end
  rescue Octokit::NotFound
    warn "git-pkgs: skipping #{repo.full_name} (404)"
    []
  end
end
