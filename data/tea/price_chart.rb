#!/usr/bin/env ruby
# Generates an inline SVG line chart of hourly TEA close prices.

rows = File.readlines("data/tea/tea-price-hourly.txt").map do |line|
    parts = line.split
    { time: "#{parts[0]} #{parts[1]}", close: parts[5].to_f, high: parts[3].to_f }
end

w, h = 720, 360
left, right, top, bottom = 70, 15, 15, 45
pw, ph = w - left - right, h - top - bottom

max_p = rows.map { |r| r[:high] }.max
min_p = 0.0

xs = ->(i) { left + (i.to_f / (rows.size - 1)) * pw }
ys = ->(p) { top + ph - ((p - min_p) / (max_p - min_p)) * ph }

# use highs for first two candles so the spike is visible, closes after
points = rows.each_with_index.map do |r, i|
    val = i < 2 ? r[:high] : r[:close]
    "#{xs.(i).round(1)},#{ys.(val).round(1)}"
end

# y axis gridlines at 0.0001 steps
ylines = []
step = 0.0001
(0..(max_p / step).ceil).each do |n|
    p = n * step
    next if p > max_p * 1.05
    y = ys.(p).round(1)
    ylines << %(<line x1="#{left}" y1="#{y}" x2="#{w - right}" y2="#{y}" stroke="var(--color-border)" stroke-width="1"/>)
    label = p.zero? ? "$0" : "$#{format('%.4f', p)}"
    ylines << %(<text x="#{left - 8}" y="#{y + 4}" text-anchor="end" font-size="12" fill="var(--color-secondary)">#{label}</text>)
end

# x axis: day boundaries (00:00)
xlines = []
rows.each_with_index do |r, i|
    next unless r[:time].end_with?("00:00")
    x = xs.(i).round(1)
    day = r[:time][8, 2].to_i
    xlines << %(<line x1="#{x}" y1="#{top}" x2="#{x}" y2="#{top + ph}" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="2,3"/>)
    xlines << %(<text x="#{x}" y="#{h - bottom + 18}" text-anchor="middle" font-size="12" fill="var(--color-secondary)">Jun #{day}</text>)
end

tge_x = xs.(rows.index { |r| r[:time] == "2026-06-04 00:00" }).round(1)

svg = <<~SVG
    <svg viewBox="0 0 #{w} #{h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TEA token price per hour, June 3 to June 11 2026, showing a collapse from $0.00053 to under $0.0001 in the first hour of official trading" style="max-width:100%;height:auto;font-family:inherit;">
      #{ylines.join("\n  ")}
      #{xlines.join("\n  ")}
      <polyline points="#{points.join(' ')}" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
      <line x1="#{tge_x}" y1="#{top}" x2="#{tge_x}" y2="#{top + ph}" stroke="var(--color-text)" stroke-width="1" stroke-dasharray="5,4"/>
      <text x="#{tge_x + 6}" y="#{top + 14}" font-size="12" fill="var(--color-text)">official launch, 00:00 UTC Jun 4</text>
      <text x="#{left}" y="#{h - 6}" font-size="12" fill="var(--color-secondary)">Hourly $TEA price on Aerodrome (TEA/USDC pool), data from GeckoTerminal</text>
    </svg>
SVG

File.write("data/tea/price.svg", svg)
puts "wrote price.svg, #{rows.size} points, max #{max_p}"
