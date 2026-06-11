#!/usr/bin/env ruby
# Inline SVG: monthly commits to teaxyz vs pkgxdev org repos, 2024-01..2026-06.

def monthly(path)
    File.readlines(path).map { |l| l.split.first }.tally
end

tea = monthly("data/tea/teaxyz-months.txt")
pkgx = monthly("data/tea/pkgxdev-months-authors.txt")

months = []
(2024..2026).each do |y|
    (1..12).each do |m|
        key = format("%d-%02d", y, m)
        months << key
        break if key == "2026-06"
    end
end
months = months.take_while { |k| k <= "2026-06" }

w, h = 720, 360
left, right, top, bottom = 50, 15, 15, 45
pw, ph = w - left - right, h - top - bottom

max_v = (months.map { |m| [tea[m].to_i, pkgx[m].to_i].max }.max / 50.0).ceil * 50

xs = ->(i) { left + (i.to_f / (months.size - 1)) * pw }
ys = ->(v) { top + ph - (v.to_f / max_v) * ph }

series = lambda do |data|
    months.each_with_index.map { |m, i| "#{xs.(i).round(1)},#{ys.(data[m].to_i).round(1)}" }.join(" ")
end

ylines = []
(0..max_v).step(100) do |v|
    y = ys.(v).round(1)
    ylines << %(<line x1="#{left}" y1="#{y}" x2="#{w - right}" y2="#{y}" stroke="var(--color-border)" stroke-width="1"/>)
    ylines << %(<text x="#{left - 8}" y="#{y + 4}" text-anchor="end" font-size="12" fill="var(--color-secondary)">#{v}</text>)
end

xlabels = []
months.each_with_index do |m, i|
    next unless m.end_with?("-01") || m.end_with?("-07")
    x = xs.(i).round(1)
    y, mo = m.split("-")
    label = mo == "01" ? "Jan #{y}" : "Jul #{y}"
    xlabels << %(<line x1="#{x}" y1="#{top}" x2="#{x}" y2="#{top + ph}" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>)
    xlabels << %(<text x="#{x}" y="#{h - bottom + 18}" text-anchor="middle" font-size="12" fill="var(--color-secondary)">#{label}</text>)
end

svg = <<~SVG
    <svg viewBox="0 0 #{w} #{h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Monthly commits to teaxyz and pkgxdev GitHub organisations from January 2024 to June 2026. The teaxyz line falls to near zero after November 2025 while pkgxdev continues at around 50 to 150 commits per month." style="max-width:100%;height:auto;font-family:inherit;">
      #{ylines.join("\n  ")}
      #{xlabels.join("\n  ")}
      <polyline points="#{series.(pkgx)}" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
      <polyline points="#{series.(tea)}" fill="none" stroke="#d97706" stroke-width="2"/>
      <rect x="#{left + 12}" y="#{top + 8}" width="12" height="3" fill="var(--color-accent)"/>
      <text x="#{left + 30}" y="#{top + 14}" font-size="12" fill="var(--color-text)">pkgxdev (package manager)</text>
      <rect x="#{left + 12}" y="#{top + 26}" width="12" height="3" fill="#d97706"/>
      <text x="#{left + 30}" y="#{top + 32}" font-size="12" fill="var(--color-text)">teaxyz (protocol)</text>
      <text x="#{left}" y="#{h - 6}" font-size="12" fill="var(--color-secondary)">Commits per month to non-fork repos in each GitHub org, via the GitHub API</text>
    </svg>
SVG

File.write("data/tea/commits.svg", svg)
puts "wrote commits.svg, #{months.size} months, max #{max_v}"
puts months.map { |m| "#{m} tea=#{tea[m].to_i} pkgx=#{pkgx[m].to_i}" }
