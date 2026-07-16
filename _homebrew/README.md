# Homebrew formula momentum

This small Ruby generator compares the most recent Homebrew formula install
window with monthly-equivalent averages from the *preceding* portions of the
90- and 365-day windows. It subtracts the recent window first, so the comparison
does not include the month being measured. The same calculation is applied to
the install-on-request windows so direct user demand can be separated from
dependency installs. The static page loads only D3 from a pinned jsDelivr URL;
there are no npm dependencies or browser-time API requests.

## Generate the page

Ruby 2.6 or newer is sufficient:

```sh
ruby _homebrew/generate.rb
```

The default output is `homebrew.html` at the repository root. Its Jekyll front
matter publishes it at `/homebrew/`. To write somewhere else instead:

```sh
ruby _homebrew/generate.rb --output /tmp/homebrew.html
```

The generator exits non-zero when a request fails, a response has an unexpected
shape, or the six snapshots do not have the same end date. This makes a stale
or partial update visible in CI instead of silently publishing mixed data.
Homebrew queries each rolling window independently against live data, so a
newly active formula can occasionally have a longer-window total a few events
below its 30-day total. Those per-formula counts are normalized with a warning
before the preceding periods are calculated.

## Options

```text
--output PATH       Write the generated page somewhere else
--data-floor N      Embed formulae with at least N installs in the recent window
--minimum-change N  Hide established formulae within N% of both baselines
--input-dir DIR     Read saved install and install-on-request JSON files
```

The defaults omit formulae below 500 recent installs and established formulae
that are within 15% of both baselines. Formulae with no observed installs before
the recent window are kept in a separate "new or newly active" list; aggregate
install data cannot distinguish a newly added formula from a dormant one that
became active again. The breakout table can rank either all installs or direct
user requests; direct mode requires at least the configured data floor in recent
direct requests so tiny samples do not dominate the list.

The offline option is useful for testing a saved snapshot:

```sh
mkdir -p snapshots
curl -fsSL https://formulae.brew.sh/api/analytics/install/30d.json -o snapshots/install-30d.json
curl -fsSL https://formulae.brew.sh/api/analytics/install/90d.json -o snapshots/install-90d.json
curl -fsSL https://formulae.brew.sh/api/analytics/install/365d.json -o snapshots/install-365d.json
curl -fsSL https://formulae.brew.sh/api/analytics/install-on-request/30d.json -o snapshots/install-on-request-30d.json
curl -fsSL https://formulae.brew.sh/api/analytics/install-on-request/90d.json -o snapshots/install-on-request-90d.json
curl -fsSL https://formulae.brew.sh/api/analytics/install-on-request/365d.json -o snapshots/install-on-request-365d.json
ruby _homebrew/generate.rb --input-dir snapshots
```

For a daily GitHub Pages job, run the same command on a schedule and commit the
generated `homebrew.html`. The output contains the analytics snapshot, so
visitors do not need cross-origin access to the Homebrew API.
