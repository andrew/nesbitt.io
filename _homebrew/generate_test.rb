# frozen_string_literal: true

require "minitest/autorun"
require_relative "generate"

class HomebrewGenerateTest < Minitest::Test
  START_DATES = {
    "30d" => "2026-06-16",
    "90d" => "2026-04-17",
    "365d" => "2025-07-16",
  }.freeze
  DAYS = {
    "30d" => 30,
    "90d" => 90,
    "365d" => 365,
  }.freeze

  def snapshot(window, counts, end_date: "2026-07-16")
    {
      "startDate" => START_DATES.fetch(window),
      "endDate" => end_date,
      "days" => DAYS.fetch(window),
      "totalCount" => counts.values.sum,
      "counts" => counts,
    }
  end

  def snapshots(installs, requests)
    {
      "install" => WINDOWS.to_h { |window| [window, snapshot(window, installs.fetch(window))] },
      "install-on-request" => WINDOWS.to_h { |window| [window, snapshot(window, requests.fetch(window))] },
    }
  end

  def test_normalizes_independently_queried_rolling_windows
    installs = {
      "30d" => { "hunk" => 1_000, "stable" => 600 },
      "90d" => { "hunk" => 999, "stable" => 1_800 },
      "365d" => { "hunk" => 999, "stable" => 7_200 },
    }
    requests = {
      "30d" => { "hunk" => 1_001, "stable" => 300 },
      "90d" => { "hunk" => 1_000, "stable" => 900 },
      "365d" => { "hunk" => 999, "stable" => 3_000 },
    }

    dataset = nil
    _, warnings = capture_io do
      dataset = build_dataset(snapshots(installs, requests), 500, 0.15)
    end

    hunk = dataset.fetch("formulae").find { |row| row.fetch("formula") == "hunk" }
    assert_equal "recent_only", hunk.fetch("historyStatus")
    assert_nil hunk.fetch("baseline90")
    assert_nil hunk.fetch("baseline365")
    assert_equal 1_000, hunk.fetch("requested30")
    assert_equal 1.0, hunk.fetch("directShare")
    assert_equal "recent_only", hunk.fetch("directHistoryStatus")
    assert_nil hunk.fetch("directBaseline90")
    assert_nil hunk.fetch("directBaseline365")
    assert_includes warnings, 'Normalizing non-monotonic installs for "hunk"'
    assert_includes warnings, 'Normalizing non-monotonic direct requests for "hunk"'
  end

  def test_still_rejects_snapshots_with_different_end_dates
    installs = WINDOWS.to_h { |window| [window, { "stable" => DAYS.fetch(window) * 20 }] }
    requests = WINDOWS.to_h { |window| [window, { "stable" => DAYS.fetch(window) * 10 }] }
    data = snapshots(installs, requests)
    data.fetch("install").fetch("90d")["endDate"] = "2026-07-15"

    error = assert_raises(RuntimeError) { build_dataset(data, 500, 0.15) }
    assert_includes error.message, "analytics windows do not share an end date"
  end
end
