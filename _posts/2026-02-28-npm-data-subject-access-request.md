---
layout: post
title: "npm Data Subject Access Request"
date: 2026-02-28 10:00 +0000
description: "A response to a GDPR data subject access request."
tags:
  - package-managers
  - npm
  - satire
---

**From:** Data Protection Officer, npm, Inc. (a subsidiary of GitHub, Inc., a subsidiary of Microsoft Corporation)  
**To:** [REDACTED]  
**Date:** 26 February 2026  
**Re:** Data Subject Access Request (Ref: DSAR-2026-0041573)  
**Response deadline:** Exceeded (statutory: 30 days)  

Dear Data Subject,

Thank you for your request under Article 15 of the General Data Protection Regulation (EU) 2016/679 to access all personal data we hold about you.

We apologize for the delay in responding. Your request was initially routed to our dependency resolution system, which spent 47 days attempting to resolve your identity against our user registry before entering a circular reference with GitHub's SSO provider. A human has since intervened.

### 1. Categories of Personal Data Processed

- **Identity data**: Name, email address, username, GitHub handle, two-factor authentication status, and 487 unique IP addresses recorded since account creation.
- **Package data**: Full publishing history for `buttplug` (147 versions) and 1 package published at 2:47 AM containing your `.env` file. You un-published it within four minutes, by which time 14 users had installed it.
- **Behavioral data**: Every `npm install` you have ever run, including timestamps and resolved dependency trees. Every `npm audit` you have run (4 times) and every `npm audit` you chose not to run (approximately 11,200 times), all of which we log.
- **node_modules inventory**: Resolved dependency trees, install manifests, and content hashes collected from your local environment during package installation. This constitutes the largest category at 412 pages (see Appendix J).

### 2. Purposes of Processing

- **Service provision**: To deliver packages to your machine.
- **Dependency graph construction**: To build and maintain a complete graph of every package's relationship to every other package, and by extension, every developer's relationship to every other developer, though we have not yet determined a use for it.
- **Security**: To detect anomalous publishing behavior. Our system flagged your 2:47 AM publish as anomalous.
- **Legitimate interest**: We have a legitimate interest in understanding the full topology of the JavaScript ecosystem. We acknowledge this interest is difficult to distinguish from surveillance.

### 3. Recipients of Personal Data

- **GitHub, Inc.**: Our parent company. They hold your data under a separate privacy policy. You will need to submit a separate DSAR to them. They will redirect you to Microsoft.
- **GitHub Dependabot**: Each of the 147 versions of `buttplug` you have published generated automated pull requests titled "Bump buttplug" across an estimated 1,247 downstream repositories.
- **Microsoft Corporation**: Our parent company's parent company. Their response to your DSAR will be delivered via Microsoft Teams, which you will need to install.
- **Cloudflare, Inc.**: Our CDN provider. They have observed every package you have ever downloaded. They consider this metadata, not personal data.
- **The npm public registry**: Your published packages, including their `package.json` files, are publicly available. Your `package.json` from the 2:47 AM incident contained your home directory path and your OS username. We cannot un-publish this information, as at least one of the 14 downstream consumers has mirrored it to IPFS.
- **GitHub Arctic Code Vault**: Your published packages were frozen in February 2020 on archival film in a decommissioned coal mine in Svalbard, Norway.
- **An unspecified number of CI/CD pipelines**: Your packages are installed approximately 900 times per week in automated build environments. Each of these environments logs the installation. We do not control these logs, nor, as far as we can determine, does anyone else.
- **An unknown number of software bills of materials**: Under Executive Order 14028, federal software suppliers are required to produce SBOMs listing all components. Your package `buttplug` is listed as a transitive dependency in an estimated 340 SBOMs submitted as federal records to US government agencies.

### 4. Retention Periods

- **Account data**: For the lifetime of your account, plus 7 years after deletion, plus the remaining useful life of physical backup media.
- **Package data**: Indefinitely. npm's contract with the ecosystem is that published packages are permanent. Un-publishing is technically possible but discouraged since 2016.
- **Behavioral data**: 24 months in our primary database, after which it is moved to cold storage, where it remains queryable.
- **node_modules inventories**: We do not have a retention policy for this data because we did not realize we were collecting it.

### 5. Your Rights

- **Right of access**: You are exercising this right now.
- **Right to rectification**: You may request correction of inaccurate data. If you would like us to update the OS username in the leaked `package.json`, please note that this would require modifying a published package, which would break the integrity hash, which would cause `npm audit` to flag it as tampered, which would generate security advisories for the 14 downstream consumers, one of whom has mirrored it to a public Git repository. We advise against rectification at this time.
- **Right to erasure**: You may request deletion of your personal data where there is no compelling reason for its continued processing. We believe there is a compelling reason: `buttplug` has 1,247 direct dependents, including 3 production banking applications. Deleting your account would remove it from the registry, breaking its dependents, their dependents, and so on until an estimated 0.003% of the JavaScript ecosystem fails to build. Our legal team considers this a compelling reason.
- **Right to data portability**: You may request your data in a structured, commonly used, machine-readable format. We have prepared your data as a 2.7 GB JSON file, available for download at a pre-signed URL that expires in 7 days.
- **Right to object**: You may object to processing based on legitimate interest. If you object to our construction of the global dependency graph, your objection will be noted in the graph.

### 6. Automated Decision-Making

- **Trust score**: Our system has assigned you a trust score of 72 out of 100, based on account age, publishing frequency, two-factor authentication status, and whether you have ever mass-transferred package ownership to a stranger. The platform average is 64. The scoring methodology is proprietary.
- **Bus factor assessment**: Our system has determined that `buttplug` has a bus factor of 1: You are driving the bus. This assessment has been shared with downstream maintainers who have opted into critical dependency notifications.

### 7. International Transfers

- **United States**: Where our servers are located. This transfer is covered by the EU-US Data Privacy Framework, which replaced Privacy Shield, which replaced Safe Harbor.
- **47 additional countries**: Your published packages are distributed via a global CDN. We cannot enumerate which edge nodes have cached your `package.json` at any given time. The full list of jurisdictions is included in Appendix K.

---

If you have questions about this response, please contact our Data Protection Officer at dpo@npmjs.com. Please allow 30 days for a reply. If our response requires querying the dependency graph, please allow 47 additional days.

Yours faithfully,

Data Protection Officer  
npm, Inc.  
A subsidiary of GitHub, Inc.  
A subsidiary of Microsoft Corporation

**Enclosures:**  
Appendix A: Account metadata (3 pages)  
Appendix B: Publishing history including retracted packages (7 pages)  
Appendix C: Behavioral telemetry (41 pages)  
Appendix D: Dependency graph, your packages only (28 pages)  
Appendix E: Dependency graph for `buttplug`, including transitive dependents (119 pages)  
Appendix F: npm audit output (84 pages)  
Appendix G: Download logs (31 pages)  
Appendix H: IP address history with geolocation (6 pages)  
Appendix J: node_modules inventory, deduplicated (412 pages)  
Appendix K: List of jurisdictions (2 pages)  

*Total enclosures: 743 pages*  
*Format: JSON*