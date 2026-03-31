---
layout: post
title: "npm's Defaults Are Bad"
date: 2026-03-31 10:00 +0000
description: "The npm client's default settings are a root cause of JavaScript's recurring supply chain security problems."
tags:
  - package-managers
  - javascript
  - npm
  - security
---

Yesterday the [axios package was compromised](https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan) on npm. An attacker hijacked a maintainer account, published two malicious versions that bundled a remote access trojan through a staged dependency called `plain-crypto-js`, and the versions were live for two to three hours before npm pulled them. Axios gets 83 million weekly downloads. This [keeps](https://snyk.io/blog/maintainers-of-eslint-prettier-plugin-attacked-via-npm-supply-chain-malware/) [happening](https://nx.dev/blog/s1ngularity-postmortem) [over](https://snyk.io/articles/npm-security-best-practices-shai-hulud-attack/) [and](https://github.com/advisories/GHSA-pjwm-rvh2-c87w) [over](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident) [and](https://eslint.org/blog/2018/07/postmortem-for-malicious-package-publishes/) [over](https://snyk.io/blog/peacenotwar-malicious-npm-node-ipc-package-vulnerability/) and the post-incident conversation always goes the same way: was the maintainer using MFA, should the registry have caught it faster, should people be running more scanners. None of that gets at why JavaScript keeps having these incidents at a rate no other ecosystem comes close to matching. The npm client's defaults actively enable the attacks and have done for years.

### npm install rewrites your lockfile

`npm install` will [modify your lockfile](https://github.com/npm/npm/issues/17761) if it detects drift between `package.json` and `package-lock.json`, which means the command developers reach for by default, the one in every tutorial and onboarding doc, can silently change your resolved dependency tree. The behaviour you actually want in almost every case lives in `npm ci`, which refuses to install if the lockfile doesn't match and never modifies it. Most developers only discover `npm ci` after something breaks in CI, and many never discover it at all, because the client steers them toward the less safe option by making it the obvious one.

### Lifecycle scripts run by default

When you run `npm install`, every dependency and transitive dependency gets to execute arbitrary code on your machine through [postinstall scripts](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html). A vanishingly small number of packages actually need this, mostly native addons that compile C/C++ bindings, but npm grants the privilege to everything by default.

The axios attacker used exactly this mechanism, staging a clean version of `plain-crypto-js` eighteen hours before publishing a second version with the payload, then adding it as a dependency to the compromised axios release so the RAT dropped automatically on install.

pnpm v10 [disabled postinstall scripts by default](https://pnpm.io/supply-chain-security) and moved to an explicit allow-list where you approve which packages can run scripts. Bun blocks them by default too, with opt-in via `trustedDependencies` in `package.json`. npm shipped [`npm trust`](https://docs.npmjs.com/cli/v11/commands/npm-trust/) in v11.10.0 for managing an allow-list, but left the default unchanged, so every package still gets to run whatever it wants unless you've gone out of your way to configure it otherwise.

### Trusted publishing can be turned off

npm's [trusted publishing](https://docs.npmjs.com/trusted-publishers/) via OIDC lets packages publish from CI without long-lived tokens, which is a genuine improvement. But a maintainer, or an attacker who has compromised their account, can disable trusted publishing and fall back to token-based publishing at any time, and consumers of the package have no signal that this happened. They'll keep pulling new versions as if nothing changed. Opting a package into trusted publishing should be a one-way door that only npm support can reverse, because an attacker with account access can flip a toggle just as easily as a maintainer can.

The client could help here too. `npm install` and `npm update` could detect when a package that previously used trusted publishing releases a new version without it, and refuse to update or at least warn. That kind of downgrade in publishing method is exactly the signal that something has gone wrong.

### Cooldowns aren't on by default

npm shipped [`min-release-age`](https://socket.dev/blog/npm-introduces-minimumreleaseage-and-bulk-oidc-configuration) in v11.10.0, which lets you refuse to install package versions published within a configurable window. Most malicious versions are caught within the first 24 to 48 hours, so even a modest cooldown would block the majority of supply chain attacks from reaching your project. But it's off by default, which means the developers who would benefit from it most, the ones running `npm install` without thinking about supply chain security, will never turn it on, because they don't know it exists.

### npx has no safety net at all

`npx` doesn't use a lockfile. It fetches whatever the latest version of a package is and runs it immediately, with no cooldown and no pinning. If an attacker publishes a malicious version of a popular `npx` target, every invocation from that moment forward pulls and executes the compromised code.

The defaults problem is worse here than anywhere else in npm, because `npm install` at least has `npm ci` and `min-release-age` as things you can opt into, while `npx` has no equivalent at all. And `npx` has become the standard way to bootstrap projects and run one-off tools in tutorials, CI scripts, and increasingly in AI coding agents that generate and execute `npx` commands as part of their workflows.

### GitHub Actions as an enabler

npm revoked classic tokens in December 2025 and capped granular token lifetimes at 90 days, which reduced the window of exposure from a stolen token. But most npm packages are published from GitHub Actions, where tokens sit in repository secrets, and the 90-day rotation creates enough friction that maintainers look for shortcuts rather than setting up OIDC properly.

[Shai-Hulud](https://snyk.io/articles/npm-security-best-practices-shai-hulud-attack/) propagated specifically by harvesting tokens from CI environments, and the architecture that made that possible, long-lived secrets stored alongside the code that uses them, hasn't fundamentally changed even though the individual token lifetimes got shorter. The [Trivy supply chain compromise](https://www.aquasec.com/blog/trivy-supply-chain-attack-what-you-need-to-know/) earlier this month showed how this plays out in practice: attackers used a leaked token from a GitHub Actions environment to force-push malicious code to 76 version tags, harvesting secrets from every CI pipeline that referenced them.

There's no confirmed link between that incident and the axios compromise twelve days later, but the attack surface is the same: npm tokens stored in CI environments that become the prize in a GitHub Actions breach.

[OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers/) with no stored tokens is the answer here, and it works today, but npm hasn't made it the default onboarding path and the setup still requires enough manual configuration that most maintainers haven't switched.

### npm is the one that matters

pnpm, Bun, and Deno have all made better choices about their defaults. pnpm blocks postinstall scripts, Bun requires explicit opt-in for them, Deno's permission model is restrictive by design. But npm ships with Node.js, and it's the client that the vast majority of the JavaScript ecosystem actually runs on, so the other clients making better choices doesn't change the baseline security posture for the millions of projects that use npm because it was already there when they ran `node --version` for the first time.

The OpenSSF's [Secure Software Development Guiding Principles](https://best.openssf.org/SecureSoftwareGuidingPrinciples.html) set an explicit goal of creating software that is "secure by default," and their [Principles for Package Repository Security](https://repos.openssf.org/principles-for-package-repository-security.html) lay out maturity levels for registries and CLI tooling. npm has shipped the safer options as flags and config keys, but none of that matters until it changes what happens when someone types `npm install` or `npx` with no flags.

npm's defaults are bad and they have been for a long time. Fixing them would do more for JavaScript supply chain security than any scanner, policy, or post-incident review ever will.
