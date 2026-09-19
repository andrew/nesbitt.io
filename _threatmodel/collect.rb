#!/usr/bin/env ruby
# Sweep osv.dev and GitHub repository security advisories for every package
# manager / registry listed in _threatmodel/targets.yml, dedupe, and write
# _threatmodel/advisories.yml with each advisory pre-bucketed against the
# headings in the Package Manager CWEs post where a CWE or keyword matches.
#
# Usage: ruby _threatmodel/collect.rb [--since YYYY-MM-DD] [--all]
#   --since   only keep advisories published on/after this date
#             (default: 2026-05-04, the CWE post's publish date)
#   --all     ignore --since; keep every advisory ever filed
#
# Env: GITHUB_TOKEN (optional; raises the repo-advisories rate limit)

require "json"
require "net/http"
require "set"
require "time"
require "uri"
require "yaml"

HERE     = __dir__
TARGETS  = YAML.load_file(File.join(HERE, "targets.yml"))
OUT      = File.join(HERE, "advisories.yml")
UA       = "nesbitt.io-threatmodel (andrewnez@gmail.com; +https://nesbitt.io)"
GH_TOKEN = ENV["GITHUB_TOKEN"] || `gh auth token 2>/dev/null`.strip.then { |t| t.empty? ? nil : t }
DEFAULT_SINCE = "2026-05-04"

# CWE id -> heading slugs from the Package Manager CWEs post. A CWE can map
# to more than one heading; the output records all candidates for review.
CWE_HEADINGS = {
  22   => %w[archive-extraction],
  23   => %w[archive-extraction],
  24   => %w[archive-extraction],
  36   => %w[archive-extraction],
  59   => %w[archive-extraction shared-filesystem],
  61   => %w[shared-filesystem],
  73   => %w[archive-extraction],
  77   => %w[argument-injection],
  78   => %w[argument-injection],
  88   => %w[argument-injection],
  345  => %w[integrity-fail-open lockfile-not-pinning],
  347  => %w[integrity-fail-open],
  348  => %w[integrity-fail-open],
  353  => %w[lockfile-not-pinning],
  354  => %w[integrity-fail-open],
  494  => %w[integrity-fail-open],
  295  => %w[integrity-fail-open],
  757  => %w[integrity-fail-open],
  522  => %w[credentials-wrong-place],
  201  => %w[credentials-wrong-place],
  532  => %w[credentials-wrong-place],
  427  => %w[wrong-source local-files-trusted],
  829  => %w[wrong-source],
  426  => %w[local-files-trusted],
  377  => %w[shared-filesystem],
  378  => %w[shared-filesystem],
  379  => %w[shared-filesystem],
  276  => %w[shared-filesystem],
  278  => %w[shared-filesystem],
  281  => %w[shared-filesystem],
  732  => %w[shared-filesystem],
  362  => %w[shared-filesystem],
  367  => %w[shared-filesystem],
  502  => %w[unsafe-deserialisation],
  611  => %w[unsafe-deserialisation],
  776  => %w[resource-exhaustion],
  400  => %w[resource-exhaustion],
  770  => %w[resource-exhaustion],
  1333 => %w[resource-exhaustion],
  674  => %w[resource-exhaustion],
  835  => %w[resource-exhaustion],
  150  => %w[terminal-escapes],
  693  => %w[sandbox-escape],
  787  => %w[memory-corruption],
  125  => %w[memory-corruption],
  119  => %w[memory-corruption],
  120  => %w[memory-corruption],
  190  => %w[memory-corruption],
  416  => %w[memory-corruption],
  266  => %w[registry-authorisation],
  269  => %w[registry-authorisation],
  284  => %w[registry-authorisation],
  285  => %w[registry-authorisation],
  862  => %w[registry-authorisation],
  863  => %w[registry-authorisation token-overscope],
  1220 => %w[token-overscope],
  1259 => %w[token-overscope],
  287  => %w[account-takeover],
  384  => %w[account-takeover],
  613  => %w[account-takeover],
  601  => %w[account-takeover],
  79   => %w[registry-xss],
  80   => %w[registry-xss],
  94   => %w[server-side-rce],
  918  => %w[registry-ssrf],
  639  => %w[registry-idor],
  436  => %w[registry-client-disagree],
  444  => %w[registry-client-disagree],
  326  => %w[weak-crypto-parameters],
  327  => %w[weak-crypto-parameters],
  338  => %w[weak-crypto-parameters],
  524  => %w[cdn-caching],
}

# Fallback keyword -> heading when no CWE is assigned. Matched against
# summary + first 400 chars of details, case-insensitive.
KEYWORD_HEADINGS = {
  /path travers|zip slip|directory travers|tar slip|\.\.\/|dot.segment/i          => "archive-extraction",
  /arbitrary (file )?(over)?write|arbitrary (file )?move|write outside|not confined to|sanitize .*path/i => "archive-extraction",
  /symlink|symbolic link|hardlink|hard link/i                                     => "shared-filesystem",
  /argument inject|command inject|shell inject|--upload-pack|shell metachar/i     => "argument-injection",
  /signature verif|checksum|integrity check|unsigned|verif\w+ bypass/i            => "integrity-fail-open",
  /HTTPS.to.HTTP|certificate verif|host key|downgrade/i                           => "integrity-fail-open",
  /sumdb|transparency log|tlog/i                                                  => "integrity-fail-open",
  /credential|bearer token|auth token|private key|API key|GITHUB_TOKEN/i          => "credentials-wrong-place",
  /token.*(disclos|leak|sent to|attached to|forward)|in logs\b|not saniti[sz]ed in log/i => "credentials-wrong-place",
  /dependency confusion|extra-index-url|wrong (index|registry|source)/i           => "wrong-source",
  /temp(orary)? (file|dir)|world.writable|\/tmp\b|\bumask\b|file ownership/i      => "shared-filesystem",
  /\.git.?config|hooksPath|config\.toml|\.npmrc|toolchain directive|trusted as/i  => "local-files-trusted",
  /YAML load|deseriali[sz]|marshal|pickle/i                                       => "unsafe-deserialisation",
  /\bXXE\b|external entit/i                                                       => "unsafe-deserialisation",
  /ReDoS|regular expression|denial.of.service|resource exhaust|panic|\bOOM\b|unbounded|memory exhaust|size (limit|guard)/i => "resource-exhaustion",
  /ANSI escape|terminal escape|control character|escape sequence/i                => "terminal-escapes",
  /sandbox|confinement|isolation bypass/i                                         => "sandbox-escape",
  /out.of.bounds|buffer overflow|heap overflow|use.after.free|integer overflow/i  => "memory-corruption",
  /lockfile|frozen install|not pinned|hash not stored/i                           => "lockfile-not-pinning",
  /\bXSS\b|cross.site script/i                                                    => "registry-xss",
  /\bSSRF\b|server.side request forgery/i                                         => "registry-ssrf",
  /\bIDOR\b|direct object reference/i                                             => "registry-idor",
  /cache poison|CDN cach|Cache-Control/i                                          => "cdn-caching",
}

def parse_args
  args = {since: DEFAULT_SINCE, all: false}
  i = 0
  while i < ARGV.length
    case ARGV[i]
    when "--since" then args[:since] = ARGV[i += 1]
    when "--all"   then args[:all] = true
    end
    i += 1
  end
  args
end

def http_json(method, url, body: nil, headers: {})
  uri = URI(url)
  klass = method == :post ? Net::HTTP::Post : Net::HTTP::Get
  req = klass.new(uri)
  req["User-Agent"] = UA
  req["Accept"] = "application/json"
  headers.each { |k, v| req[k] = v }
  req.body = body if body
  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https",
                        open_timeout: 10, read_timeout: 30) { |h| h.request(req) }
  unless res.is_a?(Net::HTTPSuccess)
    if %w[401 403 429].include?(res.code)
      warn "\n  #{res.code} from #{uri.host} — set GITHUB_TOKEN or wait for rate-limit reset"
    end
    return nil
  end
  [JSON.parse(res.body), res]
rescue => e
  warn "  http err #{url}: #{e.class}: #{e.message}"
  nil
end

def osv_query(ecosystem, name)
  vulns = []
  body = {package: {ecosystem: ecosystem, name: name}}
  loop do
    result, _ = http_json(:post, "https://api.osv.dev/v1/query",
                          body: JSON.generate(body),
                          headers: {"Content-Type" => "application/json"})
    break unless result
    vulns.concat(result["vulns"] || [])
    token = result["next_page_token"]
    break unless token && !token.empty?
    body[:page_token] = token
  end
  vulns
end

def gh_repo_advisories(repo)
  headers = {"X-GitHub-Api-Version" => "2022-11-28"}
  headers["Authorization"] = "Bearer #{GH_TOKEN}" if GH_TOKEN
  url = "https://api.github.com/repos/#{repo}/security-advisories?state=published&per_page=100"
  advs = []
  while url
    result, res = http_json(:get, url, headers: headers)
    break unless result
    advs.concat(result)
    link = res["Link"]
    url = link && link[/<([^>]+)>;\s*rel="next"/, 1]
  end
  advs
end

def norm_osv(v, tool, kind)
  cwes = (v.dig("database_specific", "cwe_ids") || []).map { |c| c.sub(/^CWE-/, "").to_i }.reject(&:zero?)
  refs = (v["references"] || []).map { |r| r["url"] }.compact
  {
    id: v["id"],
    aliases: (v["aliases"] || []).sort,
    tool: tool,
    kind: kind,
    published: v["published"]&.[](0, 10),
    modified: v["modified"]&.[](0, 10),
    severity: v.dig("database_specific", "severity") ||
              (v["severity"] || []).map { |s| s["score"] }.compact.first,
    summary: v["summary"]&.strip,
    details: v["details"]&.strip&.[](0, 400),
    cwes: cwes.sort,
    refs: refs.first(6),
    source: "osv",
  }
end

def norm_gh(a, tool, kind)
  cwes = (a["cwes"] || []).map { |c| c["cwe_id"].to_s.sub(/^CWE-/, "").to_i }.reject(&:zero?)
  aliases = (a["identifiers"] || []).map { |i| i["value"] }.compact
  aliases << a["cve_id"] if a["cve_id"]
  aliases.delete(a["ghsa_id"])
  {
    id: a["ghsa_id"],
    aliases: aliases.uniq.sort,
    tool: tool,
    kind: kind,
    published: a["published_at"]&.[](0, 10),
    modified: a["updated_at"]&.[](0, 10),
    severity: a["severity"]&.upcase,
    summary: a["summary"]&.strip,
    details: a["description"]&.strip&.[](0, 400),
    cwes: cwes.sort,
    refs: [a["html_url"]].compact,
    source: "github",
  }
end

def headings_for(adv)
  h = adv[:cwes].flat_map { |c| CWE_HEADINGS[c] || [] }
  if h.empty?
    text = "#{adv[:summary]} #{adv[:details]}"
    KEYWORD_HEADINGS.each { |re, slug| h << slug if text.match?(re) }
  end
  h.uniq
end

def id_rank(id)
  case id
  when /^GHSA-/ then 0
  when /^CVE-/  then 1
  else 2
  end
end

def main
  args = parse_args
  since = args[:all] ? nil : args[:since]
  puts "targets: #{TARGETS.size}"
  puts "since:   #{since || '(all time)'}"
  puts "github:  #{GH_TOKEN ? 'token' : 'anonymous (60 req/hr)'}"
  puts

  all = []
  dropped = Hash.new(0)
  TARGETS.each_with_index do |t, i|
    tool = t["tool"]
    kind = t["kind"]
    filter = t["filter"] && Regexp.new(t["filter"], Regexp::IGNORECASE)
    print "[#{i + 1}/#{TARGETS.size}] #{tool.ljust(22)} "

    hits = []
    (t["osv"] || []).each do |pkg|
      osv_query(pkg["ecosystem"], pkg["name"]).each { |v| hits << norm_osv(v, tool, kind) }
    end
    n_osv = hits.size

    (t["repos"] || []).each do |repo|
      gh_repo_advisories(repo).each { |a| hits << norm_gh(a, tool, kind) }
    end
    n_gh = hits.size - n_osv

    if filter
      kept, drop = hits.partition { |a| "#{a[:summary]} #{a[:details]}".match?(filter) }
      dropped[tool] += drop.size
      hits = kept
    end
    all.concat(hits)

    line = "osv=#{n_osv} gh=#{n_gh}"
    line += " (kept #{hits.size})" if filter
    puts line
    sleep 0.3
  end

  puts
  puts "raw: #{all.size}"

  # Dedupe: an advisory can arrive as GHSA-x, GO-x, PYSEC-x, RUSTSEC-x etc.
  # via different sources. Merge on the union of id+aliases; keep the record
  # with the best id (GHSA > CVE > other) and richest cwes/refs.
  seen = {}
  merged = []
  all.sort_by { |a| [id_rank(a[:id]), -(a[:cwes].size)] }.each do |a|
    ids = [a[:id], *a[:aliases]].compact
    hit = ids.find { |i| seen.key?(i) }
    if hit
      m = merged[seen[hit]]
      m[:aliases] = (m[:aliases] + ids - [m[:id]]).uniq.sort
      m[:cwes]    = (m[:cwes] + a[:cwes]).uniq.sort
      m[:refs]    = (m[:refs] + a[:refs]).uniq.first(8)
      m[:tool]    = [m[:tool], a[:tool]].flatten.uniq
      ids.each { |i| seen[i] = seen[hit] }
    else
      idx = merged.size
      a[:tool] = [a[:tool]]
      merged << a
      ids.each { |i| seen[i] = idx }
    end
  end
  puts "deduped: #{merged.size}"

  if since
    merged.select! { |a| a[:published] && a[:published] >= since }
    puts "since #{since}: #{merged.size}"
  end

  merged.each do |a|
    a[:headings] = headings_for(a)
    a[:tool] = a[:tool].size == 1 ? a[:tool].first : a[:tool]
    a.delete(:details)
  end

  merged.sort_by! { |a| [a[:published] || "", a[:id]] }

  by_heading = Hash.new(0)
  merged.each do |a|
    if a[:headings].empty?
      by_heading["(unbucketed)"] += 1
    else
      a[:headings].each { |h| by_heading[h] += 1 }
    end
  end
  by_tool = Hash.new(0)
  merged.each { |a| Array(a[:tool]).each { |t| by_tool[t] += 1 } }

  out = {
    "generated" => Time.now.utc.iso8601,
    "since" => since,
    "count" => merged.size,
    "by_heading" => by_heading.sort_by { |_, n| -n }.to_h,
    "by_tool" => by_tool.sort_by { |_, n| -n }.to_h,
    "filtered_out" => dropped.reject { |_, n| n.zero? },
    "advisories" => merged.map { |a| a.transform_keys(&:to_s) },
  }
  File.write(OUT, YAML.dump(out))
  puts
  puts "wrote #{OUT}"
  puts
  puts "by heading:"
  by_heading.sort_by { |_, n| -n }.each { |h, n| puts "  #{h.ljust(28)} #{n}" }
end

main if $PROGRAM_NAME == __FILE__
