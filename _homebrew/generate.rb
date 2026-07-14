#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "erb"
require "fileutils"
require "json"
require "net/http"
require "optparse"
require "uri"

WINDOWS = %w[30d 90d 365d].freeze
ANALYTICS_ROOT = "https://formulae.brew.sh/api/analytics".freeze
EVENTS = {
  "install" => "formula_install",
  "install-on-request" => "formula_install_on_request",
}.freeze
DEFAULT_DATA_FLOOR = 500
DEFAULT_MINIMUM_CHANGE = 0.15
DEFAULT_OUTPUT = File.expand_path("../homebrew.html", __dir__).freeze
TEMPLATE_PATH = File.join(__dir__, "template.html.erb").freeze

def parse_options
  options = {
    data_floor: DEFAULT_DATA_FLOOR,
    input_dir: nil,
    minimum_change: DEFAULT_MINIMUM_CHANGE,
    output: DEFAULT_OUTPUT,
  }

  parser = OptionParser.new do |opts|
    opts.banner = "Usage: ruby _homebrew/generate.rb [options]"

    opts.on("-o", "--output PATH", "HTML destination (default: #{DEFAULT_OUTPUT})") do |path|
      options[:output] = File.expand_path(path)
    end

    opts.on("--input-dir DIR", "Read saved install and install-on-request JSON files") do |dir|
      options[:input_dir] = File.expand_path(dir)
    end

    opts.on("--data-floor N", Integer, "Embed formulae with at least N recent installs (default: #{DEFAULT_DATA_FLOOR})") do |number|
      raise OptionParser::InvalidArgument, "data floor must be at least 1" if number < 1

      options[:data_floor] = number
    end

    opts.on("--minimum-change PERCENT", Float, "Hide established formulae closer to both baselines (default: 15)") do |percent|
      unless percent >= 0 && percent < 100
        raise OptionParser::InvalidArgument, "minimum change must be between 0 and 100"
      end

      options[:minimum_change] = percent / 100.0
    end

    opts.on("-h", "--help", "Show this help") do
      puts opts
      exit
    end
  end

  parser.parse!
  options
end

def fetch(uri, redirects_remaining = 3)
  raise "too many redirects while fetching #{uri}" if redirects_remaining < 0

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = uri.scheme == "https"
  http.open_timeout = 15
  http.read_timeout = 90

  request = Net::HTTP::Get.new(uri.request_uri)
  request["Accept"] = "application/json"
  request["User-Agent"] = "homebrew-formula-momentum-generator/1.0"
  response = http.request(request)

  case response
  when Net::HTTPSuccess
    response.body
  when Net::HTTPRedirection
    location = response["location"]
    raise "redirect from #{uri} did not include a Location header" if location.nil?

    fetch(URI.join(uri.to_s, location), redirects_remaining - 1)
  else
    raise "#{uri} returned HTTP #{response.code} #{response.message}"
  end
end

def load_snapshot(event, window, input_dir)
  source = if input_dir
    path = File.join(input_dir, "#{event}-#{window}.json")
    legacy_path = File.join(input_dir, "#{window}.json")
    path = legacy_path if event == "install" && !File.exist?(path) && File.exist?(legacy_path)
    warn "Reading #{path}"
    File.read(path)
  else
    uri = URI("#{ANALYTICS_ROOT}/#{event}/#{window}.json")
    warn "Fetching #{uri}"
    fetch(uri)
  end

  JSON.parse(source)
rescue JSON::ParserError => e
  raise "invalid JSON for #{event}/#{window}: #{e.message}"
end

def parse_count(value, formula, window)
  count = Integer(value.to_s.delete(","), 10)
  raise "negative count for #{formula.inspect} in #{window}" if count.negative?

  count
rescue ArgumentError
  raise "invalid count #{value.inspect} for #{formula.inspect} in #{window}"
end

def validate_snapshot(event, window, snapshot)
  unless snapshot["category"] == EVENTS.fetch(event)
    raise "unexpected category for #{event}/#{window}: #{snapshot["category"].inspect}"
  end

  items = snapshot["items"]
  raise "#{event}/#{window} response has no items array" unless items.is_a?(Array) && !items.empty?

  start_date = Date.iso8601(snapshot.fetch("start_date"))
  end_date = Date.iso8601(snapshot.fetch("end_date"))
  days = (end_date - start_date).to_i
  raise "#{event}/#{window} response has an invalid date range" unless days.positive?

  counts = {}
  items.each do |item|
    formula = item["formula"]
    raise "#{event}/#{window} response contains an invalid formula name" unless formula.is_a?(String) && !formula.empty?
    raise "duplicate formula #{formula.inspect} in #{event}/#{window}" if counts.key?(formula)

    counts[formula] = parse_count(item["count"], formula, "#{event}/#{window}")
  end

  {
    "startDate" => start_date.iso8601,
    "endDate" => end_date.iso8601,
    "days" => days,
    "totalCount" => Integer(snapshot.fetch("total_count")),
    "counts" => counts,
  }
rescue Date::Error, KeyError, TypeError, ArgumentError => e
  raise "invalid #{event}/#{window} response: #{e.message}"
end

def build_dataset(snapshots, data_floor, minimum_change)
  end_dates = snapshots.values.flat_map do |event_snapshots|
    event_snapshots.values.map { |snapshot| snapshot.fetch("endDate") }
  end.uniq
  unless end_dates.length == 1
    raise "analytics windows do not share an end date: #{end_dates.join(", ")}"
  end

  WINDOWS.each do |window|
    day_counts = snapshots.values.map { |event_snapshots| event_snapshots.fetch(window).fetch("days") }.uniq
    raise "analytics categories disagree on the #{window} date range" unless day_counts.length == 1
  end

  installs = snapshots.fetch("install")
  requests = snapshots.fetch("install-on-request")
  current = installs.fetch("30d")
  medium = installs.fetch("90d")
  long = installs.fetch("365d")
  request_current = requests.fetch("30d")
  request_medium = requests.fetch("90d")
  request_long = requests.fetch("365d")
  current_days = current.fetch("days").to_f

  formulae = current.fetch("counts").each_with_object([]) do |(formula, installs30), rows|
    next if installs30 < data_floor

    installs90 = medium.fetch("counts").fetch(formula, 0)
    installs365 = long.fetch("counts").fetch(formula, 0)
    if installs90.zero? || installs365.zero?
      raise "#{formula.inspect} is present in 30d but missing from a longer window"
    end
    if installs90 < installs30 || installs365 < installs30
      raise "#{formula.inspect} has fewer installs in a longer window than in 30d"
    end

    prior90_installs = installs90 - installs30
    prior365_installs = installs365 - installs30
    prior90_days = medium.fetch("days") - current.fetch("days")
    prior365_days = long.fetch("days") - current.fetch("days")
    raise "analytics windows overlap incorrectly" unless prior90_days.positive? && prior365_days.positive?

    history_status = if prior365_installs.zero?
      "recent_only"
    elsif prior90_installs.zero?
      "reactivated"
    else
      "established"
    end

    average90 = prior90_installs.positive? ? prior90_installs * current_days / prior90_days : nil
    average365 = prior365_installs.positive? ? prior365_installs * current_days / prior365_days : nil

    requested30 = [request_current.fetch("counts").fetch(formula, 0), installs30].min
    requested90 = [request_medium.fetch("counts").fetch(formula, 0), installs90].min
    requested365 = [request_long.fetch("counts").fetch(formula, 0), installs365].min
    if requested90 < requested30 || requested365 < requested30
      raise "#{formula.inspect} has fewer direct requests in a longer window than in 30d"
    end

    prior90_requests = requested90 - requested30
    prior365_requests = requested365 - requested30
    request_average90 = prior90_requests.positive? ? prior90_requests * current_days / prior90_days : nil
    request_average365 = prior365_requests.positive? ? prior365_requests * current_days / prior365_days : nil
    request_history_status = if requested30.zero? && prior365_requests.zero?
      "none"
    elsif prior365_requests.zero?
      "recent_only"
    elsif prior90_requests.zero?
      "reactivated"
    else
      "established"
    end

    rows << {
      "formula" => formula,
      "installs30" => installs30,
      "baseline90" => average90&.round(2),
      "baseline365" => average365&.round(2),
      "ratio90" => average90 ? (installs30 / average90).round(4) : nil,
      "ratio365" => average365 ? (installs30 / average365).round(4) : nil,
      "historyStatus" => history_status,
      "requested30" => requested30,
      "directShare" => [requested30 / installs30.to_f, 1.0].min.round(4),
      "directBaseline90" => request_average90&.round(2),
      "directBaseline365" => request_average365&.round(2),
      "directRatio90" => request_average90 ? (requested30 / request_average90).round(4) : nil,
      "directRatio365" => request_average365 ? (requested30 / request_average365).round(4) : nil,
      "directHistoryStatus" => request_history_status,
    }
  end

  raise "no formulae met the data floor of #{data_floor}" if formulae.empty?

  formulae.sort_by! { |row| row.fetch("formula") }

  {
    "meta" => {
      "apiRoot" => ANALYTICS_ROOT,
      "dataFloor" => data_floor,
      "endDate" => end_dates.first,
      "minimumChange" => minimum_change,
      "windows" => installs.transform_values { |snapshot| snapshot.reject { |key, _| key == "counts" } },
      "requestWindows" => requests.transform_values { |snapshot| snapshot.reject { |key, _| key == "counts" } },
    },
    "formulae" => formulae,
  }
end

def script_safe_json(value)
  replacements = {
    "<" => '\\u003c',
    ">" => '\\u003e',
    "&" => '\\u0026',
    "\u2028" => '\\u2028',
    "\u2029" => '\\u2029',
  }
  JSON.generate(value).gsub(/[<>&\u2028\u2029]/) { |character| replacements.fetch(character) }
end

def format_date(iso_date)
  date = Date.iso8601(iso_date)
  "#{date.strftime("%B")} #{date.day}, #{date.year}"
end

options = parse_options
raw_snapshots = EVENTS.keys.to_h do |event|
  [event, WINDOWS.to_h { |window| [window, load_snapshot(event, window, options[:input_dir])] }]
end
snapshots = raw_snapshots.each_with_object({}) do |(event, event_snapshots), validated_events|
  validated_events[event] = event_snapshots.each_with_object({}) do |(window, snapshot), validated_windows|
    validated_windows[window] = validate_snapshot(event, window, snapshot)
  end
end
dataset = build_dataset(snapshots, options[:data_floor], options[:minimum_change])

dataset_json = script_safe_json(dataset)
end_date_label = format_date(dataset.fetch("meta").fetch("endDate"))
template = ERB.new(File.read(TEMPLATE_PATH), trim_mode: "-")
html = template.result(binding)

output = options[:output]
FileUtils.mkdir_p(File.dirname(output))
temporary_output = "#{output}.tmp.#{$$}"

begin
  File.write(temporary_output, html)
  File.rename(temporary_output, output)
ensure
  File.delete(temporary_output) if File.exist?(temporary_output)
end

puts "Wrote #{output} with #{dataset.fetch("formulae").length} formulae through #{dataset.fetch("meta").fetch("endDate")}"
