---
layout: post
title: "Two-Factor Authentication Across Package Registries"
date: 2026-08-18 10:00 +0000
description: "Something you have, something you know, and someone else's OAuth."
tags:
  - package-managers
  - security
  - registries
at_uri: "at://did:plc:q3moczhdry2263q35ffqqzs5/site.standard.document/3mtiqtol3652d"
---

This month npm [stopped accepting](https://docs.npmjs.com/about-two-factor-authentication/) bypass-2FA tokens for account-governance actions, one of the steps in [the plan GitHub set out last September](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/) to close the remaining routes that let a reusable credential bypass 2FA on npm. I went through the other [registries ecosyste.ms tracks](https://packages.ecosyste.ms/registries) with more than ten thousand packages to see where each is on the same question, and the answer mostly follows from whose accounts a registry uses, an axis I'd left out when [categorising registries](/2025/12/29/categorizing-package-registries.html) last year: its own, an OAuth provider's, a git forge's, or none.

## Registries with their own accounts

npm, PyPI, RubyGems, Packagist, Docker Hub, Hex.pm, Clojars, Hackage, and CPAN's [PAUSE](https://pause.perl.org/) each have a username-and-password identity system of their own, so 2FA on each has been implemented separately with its own enforcement policy. PyPI is the only one where enforcement is complete: 2FA has been [mandatory for every account](https://blog.pypi.org/posts/2024-01-01-2fa-enforced/) since 1 January 2024, with TOTP and WebAuthn both accepted, after a run-up that included [distributing 4,000 hardware keys](https://pypi.org/security-key-giveaway/) to maintainers of top projects in 2022. Publishing to npm requires either 2FA or a granular access token carrying a bypass flag. This month's change closes the bypass for account-governance actions, and the September 2025 plan proposes removing it for local publishing as well, though that step has not yet landed. Mandatory enrolment on npm has run in cohorts since 2022: [top 100 by dependents](https://github.blog/security/supply-chain-security/top-100-npm-package-maintainers-require-2fa-additional-security/) in February, [top 500](https://github.blog/changelog/2022-05-31-top-500-npm-package-maintainers-now-require-2fa/) in May, then [high-impact packages](https://github.blog/open-source/enrolling-npm-publishers-enhanced-login-verification-two-factor-authentication-enforcement/) at a million weekly downloads or 500 dependents.

[RubyGems](https://guides.rubygems.org/setting-up-multifactor-authentication/) supports WebAuthn and TOTP and has [required it since August 2022](https://blog.rubygems.org/2022/08/15/requiring-mfa-on-popular-gems.html) for owners of any gem with more than 180 million total downloads, with a per-gem `rubygems_mfa_required` metadata flag for maintainers who want to opt the rest of their co-owners in. TOTP has been [available on Packagist](https://github.com/composer/packagist/pull/1031) since 2019, and the Packagist team's [May 2026 post](https://blog.packagist.com/an-update-on-composer-packagist-supply-chain-security/) sets out mandatory MFA across packagist.org as the direction, with organisation-level enforcement and a requirement on maintainers of larger packages as the concrete first steps. [Hex.pm](https://hex.pm/blog/announcing-two-factor-auth) supports TOTP and offers GitHub login alongside its native accounts. TOTP is already required when publishing over the OAuth device flow, which is the default in the mix and Gleam CLIs, and the [July 2026 basic-auth deprecation](https://hex.pm/blog/deprecating-basic-auth) sets 1 November 2026 as the date from which 2FA applies to every write operation on the API.[^hex]

[Docker Hub](https://docs.docker.com/security/2fa/) and [Clojars](https://github.com/clojars/clojars-web/wiki/Two-Factor-Auth) each support TOTP as an account option with no mandate, WebAuthn is not available on either, and SMS is not a supported second factor anywhere in this group. Hackage has an [open issue](https://github.com/haskell/hackage-server/issues/1265) from November 2023 with a volunteer to implement it, and PAUSE authenticates uploads with a password and sends a notification email on every upload as the check on unexpected activity.

## Registries that delegate identity to a platform

[crates.io](https://crates.io/) authenticates exclusively through GitHub OAuth, so a crates.io login carries whatever protections the GitHub account behind it has, and the same is true of [pub.dev](https://dart.dev/tools/pub/publishing) against Google accounts and the public [Terraform Registry](https://developer.hashicorp.com/terraform/registry/modules/publish) against GitHub. There has been [discussion](https://github.com/rust-lang/crates.io/discussions/4200) of having crates.io refuse logins from GitHub accounts without 2FA enabled, which the GitHub API exposes, but it has not been implemented. [RFC 3946](https://github.com/rust-lang/rfcs/pull/3946), accepted in May, introduces a crates.io-native username so that an account's identity is no longer its GitHub username, and the [July 2026 development update](https://blog.rust-lang.org/2026/07/13/crates-io-development-update/) reports the implementation as started, which opens the way for other identity providers and would move crates.io towards the first group.

[NuGet.org](https://learn.microsoft.com/en-us/nuget/nuget-org/individual-accounts) delegates authentication to Microsoft and Azure AD accounts and has [required 2FA on the linked identity](https://devblogs.microsoft.com/dotnet/requiring-two-factor-authentication-on-nuget-org/) for new accounts since 8 March 2022, with existing accounts phased in over the following two months: sign-in to NuGet.org redirects to the Microsoft 2FA enrolment screen for any account without it, without changing that account's global 2FA setting. That makes NuGet the earlier of the two registries in this survey with a universal requirement, and the requirement is NuGet.org's own policy applied through an identity system it does not run.

Sonatype's [Central Publisher Portal](https://central.sonatype.org/register/central-portal/) for Maven Central, which replaced the old OSSRH JIRA-based signup, supports GitHub and Google social login alongside a portal-native username and password. There is no second factor on the portal's own login, so a Central account has 2FA only to the extent that a linked GitHub or Google account does, and Sonatype's 2FA support elsewhere in its product line does not extend to Central. Maven Central separately requires every published artifact to be [PGP-signed](https://central.sonatype.org/publish/requirements/gpg/), which is a control on the artifact rather than the account.

## Registries that are a git repository

Homebrew, conda-forge, Spack, nixpkgs, Guix, and Julia's [General registry](https://github.com/JuliaRegistries/General) keep their package definitions [in a git repository](/2025/12/24/package-managers-keep-using-git-as-a-database.html) and accept new packages and version bumps as pull requests, so there is no separate registry publisher account and any second factor is on the forge account instead. GitHub Actions, where an action is [any repository with an `action.yml`](/2025/12/06/github-actions-package-manager.html), works the same way with the marketplace listing on top. For the ones hosted on GitHub the effective policy is GitHub's contributor 2FA programme, on which GitHub reported in [April 2024](https://github.blog/2024-04-24-securing-millions-of-developers-through-2fa/) that 95% of the users targeted through 2023 had enrolled, with the requirement applied to groups selected by "the impact of their user privileges or specific actions they took" rather than to every account, so whether a homebrew-core or conda-forge committer is subject to mandatory 2FA is determined by GitHub's targeting rather than by anything the registry sets. A committer to one of these repositories necessarily contributes code on GitHub and so falls within the programme's selection criteria, unlike a crates.io or Terraform Registry publisher who only needs a GitHub login and may hold an account the programme has not reached. Guix has been [hosted on Codeberg](https://guix.gnu.org/blog/2025/migrating-to-codeberg/) since May 2025, where [TOTP and WebAuthn](https://docs.codeberg.org/security/2fa/) are available with no mandate.

## Email-gated and account-free

[CRAN](https://cran.r-project.org/submit.html) accepts submissions through a web form and email confirmation with human review of every package, CocoaPods trunk authenticates with an [emailed session token](https://guides.cocoapods.org/making/getting-setup-with-trunk.html), and neither has an account database that a second factor would attach to. Trunk is [scheduled](https://blog.cocoapods.org/CocoaPods-Specs-Repo/) to stop accepting new podspecs on 2 December 2026 after a read-only trial in the first week of November, which will make the question moot for that registry. The Go module proxy and the Swift Package Index have no publisher accounts at all: [proxy.golang.org](https://proxy.golang.org/) is a caching mirror of module versions fetched from their VCS hosts, and the [Swift Package Index](https://swiftpackageindex.com/) is a discovery layer over repositories it does not host.

## Publishing from CI

A CI job cannot tap a security key, so publishing from CI on any registry that enforces 2FA at publish time requires a path other than an interactive login. Long-lived API tokens with the 2FA check waived have been that path historically, as with npm's bypass flag and RubyGems' automation-scoped keys, and the current round of changes on both registries is narrowing it. Trusted publishing replaces the stored token with a short-lived OIDC token that the registry verifies against a pre-registered CI workflow, so the credential is bound to the workflow that built the artifact and no maintainer credential is involved in the publish. [PyPI](https://docs.pypi.org/trusted-publishers/) added it in April 2023, followed by [RubyGems](https://blog.rubygems.org/2023/12/14/trusted-publishing.html) in December 2023, [npm](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/) and [crates.io](https://blog.rust-lang.org/2025/07/11/crates-io-development-update-2025-07/) in 2025, and [pub.dev](https://dart.dev/tools/pub/automated-publishing) for GitHub Actions and Google Cloud.

npm's [staged publishing](https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/), generally available since npm CLI 11.15.0 in May 2026, instead keeps the second factor with a human by splitting the operation in two: [`npm stage publish`](https://docs.npmjs.com/staged-publishing/) uploads the tarball to a holding area with any token and no 2FA prompt, and the version becomes installable only after a maintainer approves it through a separate 2FA challenge on the CLI or the website. The approval step applies regardless of which token staged the upload, including one issued over OIDC, so a human 2FA challenge sits between CI and the public index even when the pipeline authenticated with trusted publishing. Packagist's planned FIDO2-confirmed release step applies the same design to git tags, and a [pre-PEP discussion](https://discuss.python.org/t/pre-pep-staged-releases-separated-from-pep-694/107804) opened in June proposes splitting staged releases out of [PEP 694](https://peps.python.org/pep-0694/) as a standalone feature for PyPI.

## Summary

| | packages | account model | 2FA methods | required |
|---|---:|---|---|---|
| npm | 5,745,146 | native | WebAuthn, TOTP | publish; cohorts since 2022 |
| Go proxy | 2,281,772 | none | n/a | n/a |
| Docker Hub | 1,002,426 | native | TOTP | no |
| PyPI | 928,948 | native | WebAuthn, TOTP | all users since Jan 2024 |
| NuGet | 840,288 | Microsoft account | via MSA/AAD | all users since Mar 2022 |
| Maven Central | 615,793 | native / GitHub / Google | none native | no |
| Packagist | 510,123 | native | TOTP | direction set May 2026 |
| crates.io | 325,536 | GitHub | via GitHub | no |
| RubyGems | 211,106 | native | WebAuthn, TOTP | >180M downloads |
| nixpkgs | 153,297 | GitHub PRs | via GitHub | contributor cohorts |
| CocoaPods | 102,418 | email token | none | no |
| pub.dev | 88,115 | Google account | via Google | no |
| CPAN | 41,333 | native | none | no |
| GitHub Actions | 32,727 | GitHub | via GitHub | contributor cohorts |
| Guix | 32,281 | Codeberg PRs | via Codeberg | no |
| CRAN | 29,558 | email form | none | n/a |
| Terraform Registry | 23,429 | GitHub | via GitHub | no |
| Hex.pm | 22,730 | native / GitHub | TOTP | partial[^hexreq] |
| Clojars | 22,298 | native | TOTP | no |
| conda-forge | 20,636 | GitHub PRs | via GitHub | contributor cohorts |
| Hackage | 19,403 | native | none | no |
| Swift Package Index | 14,112 | none | n/a | n/a |
| Julia General | 13,730 | GitHub PRs | via GitHub | contributor cohorts |
| Homebrew | 9,483 | GitHub PRs | via GitHub | contributor cohorts |
| Spack | 9,300 | GitHub PRs | via GitHub | contributor cohorts |

Package counts from [ecosyste.ms](https://packages.ecosyste.ms/registries), August 2026. Distribution repositories (Debian, Ubuntu, Alpine, and similar) are omitted since publication goes through distribution maintainers rather than upstream authors.

[^hex]: An earlier version of this post grouped Hex.pm with the registries that have TOTP as an unenforced option. Thanks to Jonatan Männchen for the correction.
[^hexreq]: Required when publishing over the OAuth device flow; required for all API write operations from 1 November 2026.
