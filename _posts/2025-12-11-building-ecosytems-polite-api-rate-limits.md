---
layout: post
title: "Building Ecosyste.ms Polite API Rate Limits"
date: 2025-12-11
description: "Tiered rate limiting that rewards good citizenship: API keys, polite users, and everyone else."
tags:
  - ecosystems
  - apisix
  - package-managers
---

[ecosyste.ms](https://ecosyste.ms) serves about 1.3 billion API requests per month from researchers, security tools, and package managers. Rate limiting is necessary, but I wanted something fairer than just throttling by IP.

The setup has three tiers. Authenticated users with API keys get custom limits configured per consumer. Polite users who include an email in their User-Agent or a `mailto` query parameter get 15,000 requests per hour. Everyone else gets 5,000.

The polite tier borrows from [OpenAlex's convention](https://docs.openalex.org/how-to-use-the-api/rate-limits-and-authentication#the-polite-pool). The idea is simple: if you identify yourself, you're probably not a bot or scraper, and you're easier to contact if something goes wrong. That earns you more headroom.

APISIX's built-in rate limiting doesn't support this kind of conditional logic, so I wrote a custom Lua plugin. It checks for an authenticated consumer first (set by key-auth), then looks for an email pattern in the User-Agent, then falls back to anonymous limiting by IP. Each tier gets its own rate limit bucket and response headers showing which tier you're in and how many requests you have left.

For API key users, the plugin reads their individual limit from the consumer's config. This lets me give different users different quotas without code changes. A researcher running a one-off analysis might get 10,000 requests per hour. A security tool polling continuously might get 500,000.

The plugin also exempts internal hosts like Grafana and Prometheus dashboards, and supports exempting specific IPs for internal services. All of this is configurable via the APISIX admin API, so I can adjust limits, add exempt hosts, or change the email pattern without redeploying anything.

### An APISIX gotcha

I spent hours debugging why `ctx.consumer_name` was always nil. The plugins were configured correctly, priorities were right, phases were right. The consumer was authenticated. But my plugin couldn't see any consumer data.

At 400+ requests per second, tailing logs isn't practical, so I added debug headers to see what was happening. Every request showed nil, even with valid API keys. When I disabled my plugin entirely, key-auth worked fine. Something about my plugin being active was preventing key-auth from setting consumer data.

I checked plugin priorities (key-auth is 2500, mine is 1001, higher runs first). Execution phases (key-auth runs in rewrite, mine in access, rewrite runs first). Consumer configuration in etcd. Data encryption settings. According to APISIX docs, plugins execute by priority within each phase, so key-auth should always run before my plugin.

Then I looked at where the plugins were configured:

```bash
curl .../apisix/admin/global_rules/1
# {"plugins": {"conditional-rate-limit": {...}}}

curl .../apisix/admin/global_rules/5
# {"plugins": {"key-auth": {...}}}
```

My plugin was in global_rules/1. key-auth was in global_rules/5.

It turns out APISIX sequences plugins across separate global rules by creation timestamp, not by plugin phase or priority. My plugin on rule 1 ran before key-auth on rule 5, so `ctx.consumer_name` hadn't been set yet.

GitHub issue [#12704](https://github.com/apache/apisix/issues/12704) confirms this is a bug in how global rules are sequenced. The fix: consolidate dependent plugins into a single global rule.

```bash
curl -X PATCH .../apisix/admin/global_rules/1 \
  -d '{
    "plugins": {
      "key-auth": {"hide_credentials": true, "header": "apikey", "query": "apikey"},
      "conditional-rate-limit": {"anonymous_count": 5000, "polite_count": 15000}
    }
  }'
```

After this, everything worked.

My overall experience with APISIX has been mixed. The core is powerful, but debugging is painful (I ended up adding debug headers just to see what was happening), the dashboard is neglected, and you hit walls quickly where the only option is writing Lua. It's capable, but expect to spend time on undocumented behavior.

The plugin is at [github.com/ecosyste-ms/conditional-rate-limit.lua](https://github.com/ecosyste-ms/conditional-rate-limit.lua).
