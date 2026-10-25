require_relative "../_twipm/mastodon"

STATUSES = [
  { id: "5", created_at: "2026-10-20T10:00:00Z", reblog: nil, content: "<p>own post</p>" },
  { id: "4", created_at: "2026-10-19T10:00:00Z", reblog: {
    url: "https://floss.social/@forgejo/1", account: { acct: "forgejo@floss.social" },
    content: %(<p>Forgejo 17 <a href="https://forgejo.org/release">post</a> <a href="https://floss.social/tags/Forgejo">#Forgejo</a> <a href="https://floss.social/@someone">@someone</a></p>)
  } },
  { id: "3", created_at: "2026-10-18T10:00:00Z", reblog: {
    url: "https://mastodon.social/@andrewnez/9", account: { acct: "andrewnez" }, content: "<p>self boost</p>"
  } },
  { id: "2", created_at: "2026-10-01T10:00:00Z", reblog: {
    url: "https://example.social/@old/2", account: { acct: "old@example.social" }, content: "<p>too old</p>"
  } }
]

Mastodon.define_singleton_method(:get) do |path|
  next JSON.parse(JSON.generate({ id: "42" })) if path.include?("/lookup")
  path.include?("max_id") ? [] : JSON.parse(JSON.generate(STATUSES))
end

boosts = Mastodon.boosts(Time.parse("2026-10-11T00:00:00Z"))
puts "boosts: #{boosts.map { |b| [b[:title], b[:links]] }.inspect}"

raise "expected 1 boost, got #{boosts.size}" unless boosts.size == 1
raise "wrong boost: #{boosts.first[:url]}" unless boosts.first[:url] == "https://floss.social/@forgejo/1"
raise "tag and mention links not filtered: #{boosts.first[:links]}" unless boosts.first[:links] == ["https://forgejo.org/release"]
raise "preview not stripped: #{boosts.first[:preview]}" unless boosts.first[:preview] == "Forgejo 17 post #Forgejo @someone"

puts "mastodon_test.rb ok"
