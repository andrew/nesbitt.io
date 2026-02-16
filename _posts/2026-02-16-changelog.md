---
layout: post
title: "CHANGELOG.md"
date: 2026-02-16
description: "All notable changes to the math module will be documented in this file."
tags:
  - package-managers
  - open-source
  - ai
  - satire
---

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/).

---

## [1.2.0] - 2025-09-14

### Removed
- `mathjs` dependency. 14MB, 200+ functions. Twelve functions used.

### Added
- Custom math utilities module (`src/math-utils.js`). Addition, subtraction, multiplication, division, a handful of trig functions. `Co-authored-by: chatgpt`

### Changed
- Bundle size reduced by 68%. Build time down from 12s to 4s.

- Module: 47 lines across 1 file. 0 tests. 0 dependencies.

---

## [1.3.0] - 2025-10-03

### Added
- Percentage calculations. The replacement didn't include them.
- Rounding functions (`round`, `ceil`, `floor`). These were being done inline in 14 different places, three different ways.

### Fixed
- Division by zero no longer returns `Infinity`. Accounting flagged this after an invoice rendered a line item total as "$Infinity." (Fixes #127 "Invoice total is $Infinity")
- `round(2.675, 2)` now returns `2.68` instead of `2.67`. Floating point. Added a workaround.
- Rounding workaround broke negative numbers. All credits issued in the last 48 hours were rounded in the customer's favor. Escalation: finance.
- Subtotal calculation was concatenating instead of adding. The pricing form submits values as strings. In JavaScript, `'149.99' + '24.99'` is the string `'149.9924.99'`, not `174.98`. (Fixes #148 "Customer charged $149 million for a $175 order")

- Module: 106 lines across 1 file. 0 tests. 0 dependencies.

---

## [1.4.0] - 2025-10-22

### Added
- Expression parser for user-defined pricing formulas. Sales wanted this for months.

### Security
- **CVE-2025-41547**: Expression parser was using `eval()`. What we were told was a recursive descent parser turned out to be a `Function()` constructor wrapping user input. A customer entered `require('child_process').exec('rm -rf /')` as a pricing formula. WAF caught it. Parser replaced.

- Module: 531 lines across 1 file. 0 tests. 0 dependencies.

---

## [2.0.0] - 2025-11-15

### Changed
- Rewritten. `Co-authored-by: gpt-4o`

### Added
- Matrix operations for reporting pivot tables.
- Statistical functions (`mean`, `median`, `standardDeviation`).
- Arbitrary precision decimals for currency. Previous implementation used IEEE 754 floating point for monetary values.

### Fixed
- Expression parser does not handle operator precedence. `2 + 3 * 4` returns `20`. Enterprise customers have been receiving wrong bulk pricing since October.
- Currency amounts now stored as integers (cents) in the database. Retroactive correction tracked in JIRA-4521 through JIRA-4523.
- Matrix multiplication dimensions were backwards. Dashboard was multiplying a 3x2 by a 2x3 and getting a 2x2 result instead of 3x3.
- Input validation checked `result === NaN` to catch bad calculations. This never catches anything, because `NaN === NaN` is `false` in JavaScript. Invalid calculations were silently passing through to invoices as `NaN`. The PDF renderer prints this as "NaN" in the total field. (Fixes #209 "What does NaN mean and why do I owe it")

- Module: 842 lines across 4 files. 47 tests. 0 dependencies.

---

## [2.0.2-hotfix] - 2025-11-18

### Fixed
- Arbitrary precision decimals don't handle negative numbers. All refunds since November 15 were applied as charges. (Fixes #203 "Refund charged me twice instead of refunding") Escalation: legal. Further details tracked outside version control.

---

## [2.2.0] - 2025-12-17

### Added
- Big number support. JavaScript's `Number.MAX_SAFE_INTEGER` is 9,007,199,254,740,991. Required after a client began invoicing in Indonesian rupiah. Implementation is strings with manual digit-by-digit arithmetic. Addition works. Subtraction works when the result is positive. Multiplication works up to 15 digits.
- Long division. `Co-authored-by: copilot`

### Deprecated
- `divide()`, which silently truncated past 15 digits, renamed to `divideLegacy()`.

### Fixed
- An enterprise client's order for exactly 9,999,999,999,999,999 rupiah was billed as 10,000,000,000,000,000. JavaScript silently rounds integers above `MAX_SAFE_INTEGER` to the nearest representable value. The big number module was supposed to prevent this but was not being called for integer-only amounts. Rounding discrepancy: 1 rupiah.
- Long division infinite loops on repeating decimals. `1 / 3` does not terminate. Added a cap of 1,000 iterations, so `1 / 3` now returns a string with 1,003 characters. (Fixes #256 "Invoice PDF is 47 pages long for a single line item")

- Module: 1,891 lines across 6 files. 74 tests. 0 dependencies.

---

## [3.0.0] - 2026-01-20

### Changed
- Rewritten (third iteration). `Co-authored-by: claude-sonnet`

### Added
- Plugin system for extensibility.

### Removed
- Vendored copy of mathjs that was committed in an earlier session. No commit message references its addition.

- Module: 2,814 lines across 11 files. 340 tests. 0 dependencies.

---

## [3.0.1] - 2026-01-23

### Removed
- Plugin system. Zero adoption. No usage documentation exists.

### Added
- mathjs test suite added to the repository as a reference for expected behavior. Added `test/vendor/` to `.npmignore` so it doesn't ship with the package.

### Security
- Two test files were copy-pasted from a Stack Overflow answer that was itself taken from a GPL-licensed numerical methods textbook. Escalation: legal. Tests rewritten. Assertions are mathematically identical with different variable names.

### Fixed
- `factorial(171)` returns `Infinity`. Technically correct (it exceeds `Number.MAX_VALUE`) but the big number module was supposed to handle this. It doesn't, because `factorial()` calls `multiply()` not `bigMultiply()`. The test suite tests up to `factorial(5)`, which returns 120.
- `min()` with no arguments returns `Infinity`. `max()` with no arguments returns `-Infinity`. This is correct per the JavaScript spec but the pricing engine calls `min()` on an empty array when a product has no discount tiers. (Fixes #271 "Discount: $Infinity") Patched by checking for empty arrays. The check uses `arr.length == false`, which works because `0 == false` is `true` in JavaScript.

- Module: 2,814 lines across 11 files. 340 tests. 4,281 vendored tests. 0 dependencies.

---

## [3.1.0] - 2026-01-29

### Fixed
- Trig functions were treating all inputs as degrees. They should be radians. The original prompt said "make trig functions" and did not specify. (Fixes #285 "Delivery distances are wrong by varying amounts depending on the city") Geospatial calculations incorrect from 2025-10-01 to 2026-01-29.
- A hardcoded `3.14159` instead of `Math.PI` in the billing cycle pro-ration function. Present since 1.2.0. Monthly invoices 0.00005% incorrect for five months.

---

## [3.2.0] - 2026-02-11

### Added
- Logarithms. Finance needs them for compound interest.

### Fixed
- `log(0)` returns `-Infinity`, which is distinct from `Infinity`. Both are valid JavaScript numbers. Both are `typeof 'number'`. Neither is `NaN`. The PDF renderer handles `NaN` (after 2.0.1) but did not anticipate two different infinities. Negative infinity invoices print the minus sign. Positive infinity invoices do not. (Fixes #299 "Invoice shows just a minus sign with no amount")
- `log()` is the natural logarithm. Finance wanted `log10()`. (Fixes #303 "Loan approved at 2.3x the correct interest rate") Disclosure: customer dispute.

- Module: 3,102 lines across 14 files. 340 tests. 4,281 vendored tests. 0 dependencies. 1 README. 1 contributing guide.

---

## [3.3.0] - 2026-02-20

### Security
- Our "zero-dependency" math module imports `Buffer` for the big number implementation. In the browser build this pulls in a 500KB polyfill. Bundle size is now larger than when we had mathjs.

### Changed
- Replaced `Buffer` with `Uint8Array`. Bundle size is down. Performance is down 340%. Big number division takes 8 seconds for anything over 20 digits. Performance regression observed in production.

### Fixed
- Pricing tier validation used chained comparisons: `if (amount > 100 > 50)`. JavaScript evaluates left to right. `amount > 100` returns `true` or `false`, then `true > 50` is `false` and `false > 50` is `false`. Every order was falling into the lowest pricing tier. (Fixes #312 "All customers getting the $5/mo plan")
- `Intl.NumberFormat` grouping separator changed from U+00A0 to U+202F in Chrome 119. Invoice amounts formatted in Chrome no longer pass string equality checks against amounts formatted in Safari or server-side Node 18. (Fixes #315 "Invoice validation fails in Chrome")

---

## [4.0.0-rc.FINAL] - 2026-03-01

### Changed
- Rewritten (spec-driven). Specification: 4,200 words. `Co-authored-by: cursor-agent`

### Fixed
- The spec specified IEEE 754 double-precision floating-point. This is the default JavaScript number type. The generated implementation followed the spec and reintroduced precision issues from versions prior to 2.0.0. Reverted to string-based big numbers from 2.x and integrated them into the 4.x architecture.
- Integration of 2.x big numbers with 4.x created a circular require between `core.js` and `bignum.js`. Fixed by putting everything in one file. `Co-authored-by: devin`

- Module: 4,127 lines across 1 file. 2,100 tests. 4,281 vendored tests. 0 dependencies.

---

## [4.1.0] - 2026-03-18

### Security
- **CVE-2026-10283**: Prototype pollution in the expression parser. `{"__proto__": {"isAdmin": true}}` in the variable context modifies `Object.prototype` for every subsequent request in the process. (Fixes #327 "Expression parser allowed prototype pollution") Disclosure: external. Expression parser rewritten (third iteration).

### Fixed
- `typeof NaN` is `'number'` in JavaScript. The input validation checks `typeof result === 'number'` to confirm calculations succeeded. `NaN` passes this check. (Fixes #331 "Not a Number is a number?") Replaced with `Number.isFinite()`, which rejects `NaN`, `Infinity`, and `-Infinity`.

- Module: 4,612 lines across 1 file. 2,100 tests. 4,281 vendored tests. 0 dependencies.

---

## [4.3.0] - 2026-04-01

### Fixed
- `max(0, -0)` returns `-0`. JavaScript considers `0 === -0` to be true but `Object.is(0, -0)` to be false. (Fixes #342 "How is my balance negative zero dollars") Audit requested written explanation of negative zero.
- Exchange rate conversion for a micro-pricing feature. `parseInt(0.0000001)` returns `1`. JavaScript converts the number to the string `"1e-7"` before parsing, and `parseInt` stops at the first non-numeric character, which is `e`. A per-API-call rate of $0.0000001 was being billed as $1. (Fixes #349 "Am I being charged $1 per API call or $0.0000001")
- Floor price validation used `Number.MIN_VALUE` as a minimum threshold, expecting it to be the smallest number JavaScript can represent. `Number.MIN_VALUE` is `5e-324`. It is positive. It is the smallest *positive* number, not the most negative. The minimum price floor was effectively zero. (Fixes #353 "We are paying customers to use the product")

- Module: 4,891 lines across 1 file. 2,140 tests. 4,281 vendored tests. 0 dependencies.

---

## [5.0.0-beta.FINAL] - 2026-04-05

### Changed
- Split into a monorepo. Seven packages: `@our/math-core`, `@our/math-bignum`, `@our/math-trig`, `@our/math-stats`, `@our/math-matrix`, `@our/math-parse`, `@our/math-utils`. The last one re-exports the other six. `Co-authored-by: windsurf-cascade`

- Module: 6,430 lines across 7 packages. 2,140 tests. 4,281 vendored tests. 6 internal dependencies. 0 external dependencies.

---

## [5.0.0] - 2026-04-08

### Changed
- Collapsed back into a single package. `"workspace:*"` did not resolve when published to npm. Monorepo configuration lacks documentation.

- Module: 6,430 lines across 1 package. 2,140 tests. 4,281 vendored tests. 0 dependencies.

---

## [5.1.0] - 2026-04-15

### Added
- Complex number support. The prompt was "add any missing math functions." `Co-authored-by: gemini-2.5-pro`

### Fixed
- `sqrt(-1)` returns `{re: 0, im: 1}` instead of `NaN`. Several call sites check `isNaN()` to validate input. These now silently accept negative numbers, which propagate as objects through the calculation pipeline until the invoice template renders the total as `[object Object]`.

### Reverted
- Complex numbers.

### Fixed
- Three invoices went out showing "[object Object]" as the amount due. (Fixes #371, #372, #374 "What is [object Object] and why do I owe it")

### Removed
- Two vendored copies of mathjs found in `node_modules/@our/math-utils/node_modules/mathjs` and `node_modules/@our/math-parse/node_modules/mathjs`. Different versions (11.8.0 and 13.2.1). npm did not dedupe them. Neither was declared as a dependency. Origin undetermined.

- Module: 6,430 lines across 1 package. 2,140 tests. 4,281 vendored tests. 0 declared dependencies. Bundle size: 41MB.

---

## [5.3.0] - 2026-05-05

### Fixed
- `mean()` divides by `arguments.length` instead of by the count of values in the array. Called as `mean([1, 2, 3])`, `arguments.length` is 1 because there is one argument: the array. Returns the sum. This has been wrong since 2.0.0. (Fixes #385 "Average order value looks incredible but is it real") The board was pleased with the growth.
- Locale handling. `parseFloat("1.500,00")` returns `1.5` in every locale because `parseFloat` doesn't care about your locale. German and French customers report all amounts over a thousand euros are being billed as single-digit. (Fixes #392 "Billed 1 euro 50 for a 1,500 euro order")
- Sorting. `[1, 5, 11, 2, 23].sort()` returns `[1, 11, 2, 23, 5]`. JavaScript's default sort is lexicographic. (Fixes #398 "Top customers report is alphabetical somehow") Ranking incorrect since launch.

- Module: 6,430 lines across 1 package. 2,140 tests. 4,281 vendored tests. 0 dependencies.

---

## [6.0.0] - 2026-05-15

### Added
- Began reintroducing `mathjs` for "the hard parts." Keeping custom code for "the easy parts."

### Fixed
- Custom `add()` and mathjs `math.add()` return different results for certain floating point inputs. Standardized on mathjs, then custom, then mathjs. Implementation alternates between mathjs and custom.

- Module: 6,430 lines across 1 package. 2,140 tests. 4,281 vendored tests. 1 dependency (14MB).

---

## [6.1.0] - 2026-05-20

### Removed
- Custom implementation.

### Added
- `mathjs`.

- Module: 1 dependency.
