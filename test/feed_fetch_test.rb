require_relative "../_twipm/feed_fetch"

RELATIVE_ATOM = <<~XML
  <feed xmlns="http://www.w3.org/2005/Atom">
    <id>blog/</id><title>fixture</title><updated>2026-01-01T00:00:00Z</updated>
    <link rel="self" href="blog/feed.xml"/>
    <entry>
      <id>opam-2-6-0/</id><title>rel</title><updated>2026-01-01T00:00:00Z</updated>
      <link rel="alternate" href="opam-2-6-0/" type="text/html"/>
    </entry>
    <entry>
      <id>abs</id><title>abs</title><updated>2026-01-01T00:00:00Z</updated>
      <link rel="alternate" href="https://example.org/post/" type="text/html"/>
    </entry>
    <entry>
      <id>bad</id><title>bad</title><updated>2026-01-01T00:00:00Z</updated>
      <link rel="alternate" href="https://[bad" type="text/html"/>
    </entry>
  </feed>
XML

FeedFetch.define_singleton_method(:http_get) { |_url, **| RELATIVE_ATOM }

items = FeedFetch.fetch_feed({ url: "https://opam.ocaml.org/blog/feed.xml", name: "t", category: "t" })
urls = items.map { |i| i[:url] }
puts "urls: #{urls.inspect}"

raise "relative link not resolved: #{urls[0]}" unless urls[0] == "https://opam.ocaml.org/blog/opam-2-6-0/"
raise "absolute link altered: #{urls[1]}" unless urls[1] == "https://example.org/post/"
raise "malformed link should fall through untouched: #{urls[2]}" unless urls[2] == "https://[bad"

CHALLENGE = "<!doctype html><html><head><title>Making sure you're not a bot!</title></head></html>"
feed = { url: "https://foss.heptapod.net/tags?format=atom", name: "hg", category: "t" }

responses = [CHALLENGE, RELATIVE_ATOM]
FeedFetch.define_singleton_method(:http_get) { |_url, **| responses.shift }
items = FeedFetch.fetch_feed(feed, retry_delay: 0)
raise "challenge then feed should retry and parse, got #{items.size} items" unless items.size == 3

FeedFetch.define_singleton_method(:http_get) { |_url, **| CHALLENGE }
err = StringIO.new
$stderr = err
items = FeedFetch.fetch_feed(feed, retry_delay: 0)
$stderr = STDERR
raise "persistent challenge should return no items" unless items.empty?
raise "warning should name the HTML response: #{err.string}" unless err.string.include?("got an HTML page instead of a feed")

calls = 0
FeedFetch.define_singleton_method(:http_get) { |_url, **| calls += 1; "not a feed" }
FeedFetch.fetch_feed(feed, retry_delay: 0)
raise "non-HTML parse failures should not retry, got #{calls} calls" unless calls == 1

puts "feed_fetch_test.rb ok"
