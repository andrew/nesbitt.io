window.mapData = {
  "title": "Software, data & connections",
  "elements": [
    {
      "data": {
        "id": "forge",
        "label": "Git forge",
        "description": "A service hosting Git repositories.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "hosts",
              "repositories",
              "tags",
              "releases"
            ]
          },
          {
            "repository": "ecosyste-ms/commits",
            "tables": [
              "hosts",
              "repositories",
              "commits"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "hosts",
              "projects",
              "releases"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "repository",
        "label": "Repository",
        "description": "Source files and history in a Git repository. A project can have several repositories.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "hosts",
              "repositories",
              "tags",
              "releases"
            ]
          },
          {
            "repository": "ecosyste-ms/commits",
            "tables": [
              "hosts",
              "repositories",
              "commits"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "hosts",
              "projects",
              "releases"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "revision",
        "label": "Commit / tag",
        "description": "A point in repository history. A tag is a reference to a revision, not a package version.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "hosts",
              "repositories",
              "tags",
              "releases"
            ]
          },
          {
            "repository": "ecosyste-ms/commits",
            "tables": [
              "hosts",
              "repositories",
              "commits"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "hosts",
              "projects",
              "releases"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "files",
        "label": "Files",
        "description": "Contents of a source snapshot or extracted artifact. These two sets of files can differ.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "hosts",
              "repositories",
              "tags",
              "releases"
            ]
          },
          {
            "repository": "ecosyste-ms/commits",
            "tables": [
              "hosts",
              "repositories",
              "commits"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "hosts",
              "projects",
              "releases"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "registry",
        "label": "Package registry",
        "description": "A source of published packages and version records.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "registries",
              "packages",
              "versions"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "package_registries",
              "packages",
              "package_versions"
            ]
          },
          {
            "repository": "ecosyste-ms/nexus",
            "tables": [
              "repositories",
              "packages",
              "versions",
              "maven_artifacts"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "package",
        "label": "Package",
        "description": "A package identity within an ecosystem or registry. Source links need evidence.",
        "tables": [
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "registries",
              "packages",
              "versions"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "package_registries",
              "packages",
              "package_versions"
            ]
          },
          {
            "repository": "ecosyste-ms/nexus",
            "tables": [
              "repositories",
              "packages",
              "versions",
              "maven_artifacts"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "packages",
              "sbom_packages",
              "package_alternatives"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "version",
        "label": "Version",
        "description": "One published version of a package. It can have several artifacts.",
        "tables": [
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "registries",
              "packages",
              "versions"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "package_registries",
              "packages",
              "package_versions"
            ]
          },
          {
            "repository": "ecosyste-ms/nexus",
            "tables": [
              "repositories",
              "packages",
              "versions",
              "maven_artifacts"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "packages",
              "sbom_packages"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "artifact",
        "label": "Published artifact",
        "description": "A distributed archive or other package payload, with contents that can be examined.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "registries",
              "packages",
              "versions"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "package_registries",
              "packages",
              "package_versions"
            ]
          },
          {
            "repository": "ecosyste-ms/nexus",
            "tables": [
              "repositories",
              "packages",
              "versions",
              "maven_artifacts"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "dependency",
        "label": "Dependency declaration",
        "description": "A package requirement declared by a manifest, with scope, optionality and a version constraint. A declaration is distinct from a resolved graph, reverse usage index or evidence that code is exercised.",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "manifests",
              "dependencies",
              "package_usages",
              "repository_usages"
            ]
          },
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "dependencies",
              "top_dependent_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "dependencies",
              "project_dependencies"
            ]
          },
          {
            "repository": "ecosyste-ms/docker",
            "tables": [
              "dependencies",
              "package_usages",
              "sboms"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "dependencies"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "license",
        "label": "License evidence",
        "description": "License declarations, texts and matches found in software contents. Detection and a legal assessment are separate things.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "advisory",
        "label": "Advisory",
        "description": "An external report describing affected packages or versions.",
        "tables": [
          {
            "repository": "ecosyste-ms/advisories",
            "tables": [
              "advisories",
              "sources",
              "packages",
              "related_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "scorecards"
            ]
          },
          {
            "repository": "ecosyste-ms/dependabot",
            "tables": [
              "advisories",
              "issue_advisories"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "advisories",
              "advisory_audits"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "paper",
        "label": "Research paper",
        "description": "An external publication that mentions software. A mention alone does not prove use of a particular version.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/papers",
            "tables": [
              "projects",
              "papers",
              "mentions"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "projects",
              "papers",
              "mentions",
              "mention_sources",
              "project_papers",
              "package_papers",
              "package_projects",
              "fields",
              "open_alex_topics",
              "project_fields",
              "project_open_alex_topics",
              "project_repository_aliases",
              "external_software_records",
              "project_external_software_records"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "manifest",
        "label": "Manifest / lockfile",
        "description": "Package declarations, dependency requirements and locked selections recorded in project files.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "manifests",
              "dependencies",
              "package_usages",
              "repository_usages"
            ]
          },
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "dependencies",
              "top_dependent_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "dependencies",
              "project_dependencies"
            ]
          },
          {
            "repository": "ecosyste-ms/docker",
            "tables": [
              "dependencies",
              "package_usages",
              "sboms"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "version-range",
        "label": "Version constraint",
        "description": "A requirement or affected-version range interpreted using the rules of its package ecosystem.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "manifests",
              "dependencies",
              "package_usages",
              "repository_usages"
            ]
          },
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "dependencies",
              "top_dependent_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "dependencies",
              "project_dependencies"
            ]
          },
          {
            "repository": "ecosyste-ms/docker",
            "tables": [
              "dependencies",
              "package_usages",
              "sboms"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "dependency-graph",
        "label": "Resolved dependencies",
        "description": "Selected package versions and directed dependency edges, with direct and transitive paths. Results depend on the root, environment, resolver and available releases.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "manifests",
              "dependencies",
              "package_usages",
              "repository_usages"
            ]
          },
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "dependencies",
              "top_dependent_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "dependencies",
              "project_dependencies"
            ]
          },
          {
            "repository": "ecosyste-ms/docker",
            "tables": [
              "dependencies",
              "package_usages",
              "sboms"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "dependent-package",
        "label": "Dependent packages",
        "description": "Packages whose versions declare or resolve a dependency on a target package. This is the reverse view of package dependency edges, with version, scope and direct/transitive qualifications.",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "manifests",
              "dependencies",
              "package_usages",
              "repository_usages"
            ]
          },
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "dependencies",
              "top_dependent_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "dependencies",
              "project_dependencies"
            ]
          },
          {
            "repository": "ecosyste-ms/docker",
            "tables": [
              "dependencies",
              "package_usages",
              "sboms"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "dependents"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "dependent-repository",
        "label": "Dependent repositories",
        "description": "Source repositories with evidence of a dependency on a target package. Manifest declarations, resolved paths, source imports and test use provide different strengths of evidence.",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "manifests",
              "dependencies",
              "package_usages",
              "repository_usages"
            ]
          },
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "dependencies",
              "top_dependent_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "dependencies",
              "project_dependencies"
            ]
          },
          {
            "repository": "ecosyste-ms/docker",
            "tables": [
              "dependencies",
              "package_usages",
              "sboms"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "dependents",
              "finding_dependents"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "sbom",
        "label": "SBOM",
        "description": "A software inventory document containing components, identifiers and relationships. Declared contents and external enrichment can coexist; an SBOM need not be a complete resolved graph.",
        "tables": [
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "manifests",
              "dependencies",
              "package_usages",
              "repository_usages"
            ]
          },
          {
            "repository": "ecosyste-ms/packages",
            "tables": [
              "dependencies",
              "top_dependent_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "dependencies",
              "project_dependencies"
            ]
          },
          {
            "repository": "ecosyste-ms/docker",
            "tables": [
              "dependencies",
              "package_usages",
              "sboms"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "sbom_uploads",
              "sbom_packages"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "attestation",
        "label": "Attestation / provenance",
        "description": "A statement about software, such as its builder, source revision or build process. A signature check verifies a statement against verification material; it does not prove every claim in it.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "maintainer",
        "label": "Maintainer role",
        "description": "A package- or repository-scoped publishing or maintenance role recorded by a registry or forge. Roles can change, and records across services need not identify the same person.",
        "tables": [
          {
            "repository": "ecosyste-ms/issues",
            "tables": [
              "repositories",
              "issues"
            ]
          },
          {
            "repository": "ecosyste-ms/timeline",
            "tables": [
              "events"
            ]
          },
          {
            "repository": "ecosyste-ms/commits",
            "tables": [
              "commits",
              "contributions"
            ]
          },
          {
            "repository": "ecosyste-ms/dependabot",
            "tables": [
              "issues",
              "issue_packages"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "maintainers"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "issue",
        "label": "Issue / pull request",
        "description": "A forge-hosted report or proposed change, including dependency updates and remediation work.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/issues",
            "tables": [
              "repositories",
              "issues"
            ]
          },
          {
            "repository": "ecosyste-ms/timeline",
            "tables": [
              "events"
            ]
          },
          {
            "repository": "ecosyste-ms/commits",
            "tables": [
              "commits",
              "contributions"
            ]
          },
          {
            "repository": "ecosyste-ms/dependabot",
            "tables": [
              "issues",
              "issue_packages"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "activity",
        "label": "Project activity",
        "description": "External repository events and observations of maintenance, collaboration and publication over time.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/issues",
            "tables": [
              "repositories",
              "issues"
            ]
          },
          {
            "repository": "ecosyste-ms/timeline",
            "tables": [
              "events"
            ]
          },
          {
            "repository": "ecosyste-ms/commits",
            "tables": [
              "commits",
              "contributions"
            ]
          },
          {
            "repository": "ecosyste-ms/dependabot",
            "tables": [
              "issues",
              "issue_packages"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "funding",
        "label": "Funding",
        "description": "Project-scoped sponsorships, funding sources, transactions and allocations.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/opencollective",
            "tables": [
              "collectives",
              "projects",
              "transactions"
            ]
          },
          {
            "repository": "ecosyste-ms/funds",
            "tables": [
              "funds",
              "projects",
              "allocations",
              "project_allocations",
              "funding_sources",
              "transactions"
            ]
          },
          {
            "repository": "ecosyste-ms/sponsors",
            "tables": [
              "sponsorships"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "collection",
        "label": "Software collection",
        "description": "Curated lists and catalogues connecting software to a purpose, research field or funding context.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/awesome",
            "tables": [
              "lists",
              "projects",
              "list_projects",
              "topics"
            ]
          },
          {
            "repository": "ecosyste-ms/ost",
            "tables": [
              "collections",
              "projects",
              "votes"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "collections",
              "projects",
              "votes"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "classification",
        "label": "Software classification",
        "description": "Descriptions of software purpose or role using a vocabulary, curated labels or classifier output. The basis and uncertainty of an assignment matter.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/awesome",
            "tables": [
              "lists",
              "projects",
              "list_projects",
              "topics"
            ]
          },
          {
            "repository": "ecosyste-ms/ost",
            "tables": [
              "collections",
              "projects",
              "votes"
            ]
          },
          {
            "repository": "ecosyste-ms/science",
            "tables": [
              "collections",
              "projects",
              "votes"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "structure",
        "label": "Code structure / imports",
        "description": "Symbols, signatures, types and imports extracted from source, including bindings between import names and package identities.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "language",
        "label": "Programming language",
        "description": "Language observations derived from source names and contents, with evidence for ambiguous files.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "file-format",
        "label": "File format",
        "description": "Format and encoding observations derived from bytes and filenames.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "file-role",
        "label": "File role",
        "description": "A path’s role within software, such as source, test, fixture, generated or vendored content.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "metadata",
        "label": "Declared software metadata",
        "description": "Project descriptions and other metadata embedded in files such as CodeMeta. Declared authorship and external maintainer roles are separate claims.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "citation",
        "label": "Citation metadata",
        "description": "Citation and bibliographic records declared in project files and documentation. These may identify software or publications.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "changelog",
        "label": "Changelog",
        "description": "Release notes and change entries declared by a software project.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "digest",
        "label": "Content digest / integrity",
        "description": "Hashes and integrity strings computed from bytes, plus comparisons with expected values supplied by manifests or publication records.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "finding",
        "label": "Analysis finding",
        "description": "An observation or assessment tied to evidence, locations and a rule or category. Source-derived findings and imported assessments have different provenance.",
        "tables": [
          {
            "repository": "ecosyste-ms/advisories",
            "tables": [
              "advisories",
              "sources",
              "packages",
              "related_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "scorecards"
            ]
          },
          {
            "repository": "ecosyste-ms/dependabot",
            "tables": [
              "advisories",
              "issue_advisories"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "findings",
              "finding_verifications",
              "finding_reviews",
              "finding_attack_paths"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "weakness",
        "label": "Weakness category",
        "description": "A shared classification for kinds of software weakness, such as CWE. A category alone is not a finding in a particular project.",
        "kind": "concept",
        "tables": [
          {
            "repository": "ecosyste-ms/advisories",
            "tables": [
              "advisories",
              "sources",
              "packages",
              "related_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "scorecards"
            ]
          },
          {
            "repository": "ecosyste-ms/dependabot",
            "tables": [
              "advisories",
              "issue_advisories"
            ]
          }
        ]
      }
    },
    {
      "data": {
        "id": "capability",
        "label": "Code capability",
        "description": "Privileged operations and reachability inferred from source and dependency code.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "threat-model",
        "label": "Threat model",
        "description": "Project security boundaries, entry points and stated security expectations. Code evidence, inferred claims and maintainer-confirmed scope remain distinguishable.",
        "tables": [
          {
            "repository": "ecosyste-ms/advisories",
            "tables": [
              "advisories",
              "sources",
              "packages",
              "related_packages"
            ]
          },
          {
            "repository": "ecosyste-ms/repos",
            "tables": [
              "scorecards"
            ]
          },
          {
            "repository": "ecosyste-ms/dependabot",
            "tables": [
              "advisories",
              "issue_advisories"
            ]
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "repositories",
              "scans"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "test-result",
        "label": "Test / task result",
        "description": "An execution outcome with the tested revision, environment and task. Downstream compatibility tests compare a dependency change against a baseline.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "content-identity",
        "label": "Content identity",
        "description": "Content-based identifiers for software files, trees, revisions or code locations. An identifier does not by itself establish archival preservation.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "change",
        "label": "Content / dependency change",
        "description": "Differences between snapshots, package artifacts or dependency states, with the compared inputs retained as evidence.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "policy",
        "label": "Package acceptance policy",
        "description": "Rules and decisions about accepting package releases or artifacts, based on age, integrity or analysis results.",
        "kind": "concept",
        "tables": []
      }
    },
    {
      "data": {
        "id": "exposure",
        "label": "Vulnerability exposure",
        "description": "An assessment of whether a particular consuming project is affected by a finding in a dependency, with version, reachability, status and supporting evidence. A matching advisory alone does not establish exposure.",
        "tables": [
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "finding_dependents"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "remediation",
        "label": "Remediation",
        "description": "A proposed patch or operational mitigation, its validation results, and the released version containing a fix. Proposed, applied, verified and released are distinct states.",
        "tables": [
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "remediation_attempts",
              "remediation_validations"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "disclosure",
        "label": "Security disclosure",
        "description": "A project-scoped report, communication history and publication status for a security finding. Drafting, sending and publishing are separate actions.",
        "tables": [
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "finding_communications",
              "finding_references"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "security-posture",
        "label": "Security posture",
        "description": "Evidence about project security practices and disclosure readiness, including policy, repository settings and control assessments. A missing control is not itself a vulnerability.",
        "tables": [
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "compliance_controls"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "id": "subproject",
        "label": "Subproject / workspace",
        "description": "A package, workspace or independently scannable part of a source repository, with its own path and potentially its own published packages.",
        "tables": [
          {
            "repository": "alpha-omega-security/scrutineer",
            "tables": [
              "subprojects"
            ]
          }
        ],
        "kind": "concept"
      }
    },
    {
      "data": {
        "source": "forge",
        "target": "repository",
        "label": "hosts",
        "nature": "extrinsic",
        "description": "Hosting context comes from a Git forge.",
        "id": "relation:forge:repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "registry",
        "target": "package",
        "label": "publishes",
        "nature": "extrinsic",
        "description": "Registry records connect a package identity to its publication context.",
        "id": "relation:registry:package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "package",
        "target": "repository",
        "label": "declares source",
        "nature": "extrinsic",
        "description": "A source link supplied by a registry or external catalogue. It needs verification before equating source and published contents.",
        "id": "relation:package:repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "repository",
        "target": "revision",
        "label": "has history",
        "nature": "intrinsic",
        "description": "Commits and tags come from the repository history.",
        "id": "relation:repository:revision",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "revision",
        "target": "files",
        "label": "snapshot contains",
        "nature": "intrinsic",
        "description": "Files at a particular revision provide the source evidence.",
        "id": "relation:revision:files",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "package",
        "target": "version",
        "label": "has versions",
        "nature": "extrinsic",
        "description": "Published version records are obtained from the registry.",
        "id": "relation:package:version",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "version",
        "target": "artifact",
        "label": "distributes",
        "nature": "extrinsic",
        "description": "Publication metadata associates a version with its artifacts.",
        "id": "relation:version:artifact",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "artifact",
        "target": "files",
        "label": "unpacks into",
        "nature": "intrinsic",
        "description": "Extracting an artifact exposes its contents, which can differ from the source snapshot.",
        "id": "relation:artifact:files",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependency",
        "target": "package",
        "label": "names",
        "nature": "intrinsic",
        "description": "The declaration names a package. Resolving that name and requirement against registry records adds external context.",
        "id": "relation:dependency:package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "license",
        "label": "contains evidence",
        "nature": "intrinsic",
        "description": "License text and declarations are evidence within the software.",
        "id": "relation:files:license",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "advisory",
        "target": "version",
        "label": "affects",
        "nature": "extrinsic",
        "description": "Advisory records supply affected package names and version ranges.",
        "id": "relation:advisory:version",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "paper",
        "target": "package",
        "label": "mentions",
        "nature": "extrinsic",
        "description": "A research publication supplies context about software. Mention, use and exact version are separate claims.",
        "id": "relation:paper:package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "version",
        "target": "revision",
        "label": "may correspond to",
        "nature": "extrinsic",
        "description": "A published version may identify a source commit or tag through registry metadata, provenance or a verified release mapping. Matching names alone do not establish the relationship; builds can use other revisions or modified contents.",
        "certainty": "conditional",
        "id": "relation:version:revision",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "version",
        "target": "dependency",
        "label": "declares dependencies",
        "nature": "intrinsic",
        "description": "Published manifests and package metadata contain dependency declarations for a particular version. A registry may index these declarations without changing their intrinsic origin.",
        "id": "relation:version:dependency",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "advisory",
        "target": "package",
        "label": "identifies affected package",
        "nature": "extrinsic",
        "description": "An advisory identifies a package; affected version ranges determine which releases are covered.",
        "id": "relation:advisory:package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "paper",
        "target": "repository",
        "label": "mentions source",
        "nature": "extrinsic",
        "description": "A paper may cite a repository URL directly. That mention does not identify a published package version or prove use of its code.",
        "id": "relation:paper:repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "manifest",
        "label": "contains",
        "nature": "intrinsic",
        "description": "Manifest and lockfile contents are part of a source snapshot or artifact.",
        "id": "relation:files:manifest",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "manifest",
        "target": "dependency",
        "label": "declares",
        "nature": "intrinsic",
        "description": "Parsing a manifest yields requirements; it does not by itself execute resolution.",
        "id": "relation:manifest:dependency",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependency",
        "target": "version-range",
        "label": "constrains versions with",
        "nature": "intrinsic",
        "description": "Requirements use ecosystem-specific version constraint rules.",
        "id": "relation:dependency:version-range",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "manifest",
        "target": "dependency-graph",
        "label": "records locked selections in",
        "nature": "intrinsic",
        "description": "Lockfiles can record selected versions and dependency edges; completeness and platform scope vary.",
        "id": "relation:manifest:dependency-graph",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependency",
        "target": "dependency-graph",
        "label": "is resolved into",
        "nature": "extrinsic",
        "description": "Resolution combines declarations with available releases and package-manager behaviour in a particular environment.",
        "id": "relation:dependency:dependency-graph",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependency-graph",
        "target": "version",
        "label": "selects",
        "nature": "extrinsic",
        "description": "A resolution selects published versions; the graph should retain its root and environment.",
        "id": "relation:dependency-graph:version",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "package",
        "target": "dependent-package",
        "label": "has reverse dependencies",
        "nature": "extrinsic",
        "description": "A cross-package index reverses dependency edges to find packages that depend on the target. Counts depend on version selection, scope and direct or transitive traversal.",
        "id": "relation:package:dependent-package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependent-package",
        "target": "version",
        "label": "is evidenced by dependencies of",
        "nature": "intrinsic",
        "description": "Specific dependent versions supply declarations or resolved edges; the package-wide result is an aggregation.",
        "id": "relation:dependent-package:version",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "package",
        "target": "dependent-repository",
        "label": "is used by",
        "nature": "extrinsic",
        "description": "Cross-repository discovery finds candidates with evidence of dependencies on the target package. Index coverage is not all use everywhere.",
        "id": "relation:package:dependent-repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependent-repository",
        "target": "repository",
        "label": "identifies a consuming",
        "nature": "extrinsic",
        "description": "The consumer is a source repository, which need not publish a package.",
        "id": "relation:dependent-repository:repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependent-repository",
        "target": "manifest",
        "label": "has declaration evidence in",
        "nature": "intrinsic",
        "description": "A consuming repository’s manifests can identify a dependency without proving runtime use.",
        "id": "relation:dependent-repository:manifest",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependent-repository",
        "target": "structure",
        "label": "may have import evidence in",
        "nature": "intrinsic",
        "description": "Imports can strengthen a candidate match, but require package-to-import mapping and do not alone prove execution.",
        "certainty": "conditional",
        "id": "relation:dependent-repository:structure",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependent-repository",
        "target": "test-result",
        "label": "can be checked through",
        "nature": "intrinsic",
        "description": "Running the consuming project’s tests against baseline and changed dependency versions yields compatibility evidence.",
        "certainty": "conditional",
        "id": "relation:dependent-repository:test-result",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependency-graph",
        "target": "dependent-package",
        "label": "supports transitive lookup of",
        "nature": "extrinsic",
        "description": "Reverse graph traversal can find transitive consumers when graph coverage, version and environment are known.",
        "id": "relation:dependency-graph:dependent-package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "sbom",
        "target": "package",
        "label": "inventories",
        "nature": "intrinsic",
        "description": "Component identities record what the inventory claims is present; confirm contents when needed.",
        "id": "relation:sbom:package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "sbom",
        "target": "dependency-graph",
        "label": "may describe",
        "nature": "intrinsic",
        "description": "Some SBOMs encode dependency relationships, while others provide only a component list.",
        "certainty": "conditional",
        "id": "relation:sbom:dependency-graph",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "artifact",
        "target": "sbom",
        "label": "can be inventoried in",
        "nature": "intrinsic",
        "description": "Inspecting an artifact or container image can produce a component inventory.",
        "certainty": "conditional",
        "id": "relation:artifact:sbom",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "attestation",
        "target": "artifact",
        "label": "makes claims about",
        "nature": "extrinsic",
        "description": "The statement names a subject artifact, often by content digest.",
        "id": "relation:attestation:artifact",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "attestation",
        "target": "revision",
        "label": "may identify build source",
        "nature": "extrinsic",
        "description": "Provenance can state a source revision; this is a claim with its own verification context.",
        "certainty": "conditional",
        "id": "relation:attestation:revision",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "attestation",
        "target": "digest",
        "label": "identifies its subject using",
        "nature": "extrinsic",
        "description": "A stated subject digest is checked against the actual artifact bytes.",
        "id": "relation:attestation:digest",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "artifact",
        "target": "digest",
        "label": "has computed",
        "nature": "intrinsic",
        "description": "Hashing the bytes produces a content digest.",
        "id": "relation:artifact:digest",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "content-identity",
        "label": "can be addressed by",
        "nature": "intrinsic",
        "description": "Content-based identifiers can identify files or trees without an external catalogue.",
        "certainty": "conditional",
        "id": "relation:files:content-identity",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "revision",
        "target": "content-identity",
        "label": "can be addressed by",
        "nature": "intrinsic",
        "description": "Revision identifiers incorporate the history representation they address.",
        "certainty": "conditional",
        "id": "relation:revision:content-identity",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "finding",
        "target": "content-identity",
        "label": "can reference code through",
        "nature": "intrinsic",
        "description": "Code-location identifiers anchor evidence to the referenced content.",
        "certainty": "conditional",
        "id": "relation:finding:content-identity",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "package",
        "target": "maintainer",
        "label": "has registry-scoped",
        "nature": "extrinsic",
        "description": "Publisher and maintainer roles come from package registry records at a point in time.",
        "id": "relation:package:maintainer",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "repository",
        "target": "maintainer",
        "label": "has forge-scoped",
        "nature": "extrinsic",
        "description": "Repository-scoped roles and maintenance activity provide context without a unified person index.",
        "id": "relation:repository:maintainer",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "forge",
        "target": "issue",
        "label": "hosts",
        "nature": "extrinsic",
        "description": "Forges supply issue and pull-request records.",
        "id": "relation:forge:issue",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "issue",
        "target": "repository",
        "label": "concerns",
        "nature": "extrinsic",
        "description": "Collaboration records refer to a repository.",
        "id": "relation:issue:repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "issue",
        "target": "dependency",
        "label": "may propose updating",
        "nature": "extrinsic",
        "description": "A dependency-update pull request links proposed changes to declared dependencies.",
        "certainty": "conditional",
        "id": "relation:issue:dependency",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "issue",
        "target": "advisory",
        "label": "may remediate",
        "nature": "extrinsic",
        "description": "A remediation link is recorded context; opening or merging a pull request alone is not proof that all consumers are fixed.",
        "certainty": "conditional",
        "id": "relation:issue:advisory",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "repository",
        "target": "activity",
        "label": "has observed",
        "nature": "extrinsic",
        "description": "Event and issue indexes provide external activity observations.",
        "id": "relation:repository:activity",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "revision",
        "target": "change",
        "label": "supplies history for",
        "nature": "intrinsic",
        "description": "Comparing source snapshots records changes with commit evidence.",
        "id": "relation:revision:change",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "artifact",
        "target": "change",
        "label": "can be compared for",
        "nature": "intrinsic",
        "description": "Comparing artifacts reveals differences in the distributed contents.",
        "certainty": "conditional",
        "id": "relation:artifact:change",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "dependency",
        "target": "change",
        "label": "can be tracked through",
        "nature": "intrinsic",
        "description": "Dependency histories track added, removed and changed requirements or locked selections.",
        "certainty": "conditional",
        "id": "relation:dependency:change",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "repository",
        "target": "funding",
        "label": "has project context in",
        "nature": "extrinsic",
        "description": "Funding records can link to software projects without merging personal identities.",
        "id": "relation:repository:funding",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "collection",
        "target": "repository",
        "label": "includes",
        "nature": "extrinsic",
        "description": "A catalogue or curated list supplies membership context.",
        "id": "relation:collection:repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "collection",
        "target": "package",
        "label": "includes",
        "nature": "extrinsic",
        "description": "Collections may also identify published packages.",
        "id": "relation:collection:package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "classification",
        "target": "repository",
        "label": "describes purpose of",
        "nature": "extrinsic",
        "description": "A vocabulary or classifier supplies an interpretation grounded in repository evidence.",
        "id": "relation:classification:repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "classification",
        "target": "collection",
        "label": "groups software in",
        "nature": "extrinsic",
        "description": "Collection topics and classifications organise software by purpose.",
        "id": "relation:classification:collection",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "structure",
        "label": "contain",
        "nature": "intrinsic",
        "description": "Parsing source produces structural observations and import names.",
        "id": "relation:files:structure",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "structure",
        "target": "package",
        "label": "can map imports to",
        "nature": "intrinsic",
        "description": "Local bindings and package-to-import mappings connect import names to package identities; ambiguity must be retained.",
        "certainty": "conditional",
        "id": "relation:structure:package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "language",
        "label": "provide evidence for",
        "nature": "intrinsic",
        "description": "Filenames and contents can support language classification.",
        "id": "relation:files:language",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "file-format",
        "label": "have detected",
        "nature": "intrinsic",
        "description": "Magic signatures and encoding checks describe file contents.",
        "id": "relation:files:file-format",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "file-role",
        "label": "have contextual",
        "nature": "intrinsic",
        "description": "Path and content rules classify a file’s role within a repository.",
        "id": "relation:files:file-role",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "metadata",
        "label": "contain",
        "nature": "intrinsic",
        "description": "Declared metadata is extracted from project files.",
        "id": "relation:files:metadata",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "citation",
        "label": "contain",
        "nature": "intrinsic",
        "description": "Citation files and bibliography entries supply declared metadata.",
        "id": "relation:files:citation",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "citation",
        "target": "paper",
        "label": "may identify",
        "nature": "intrinsic",
        "description": "A project may declare a paper in its bibliography; that differs from finding a software mention in the paper.",
        "certainty": "conditional",
        "id": "relation:citation:paper",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "changelog",
        "label": "contain",
        "nature": "intrinsic",
        "description": "Release notes can be parsed from project documentation.",
        "id": "relation:files:changelog",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "changelog",
        "target": "version",
        "label": "may describe",
        "nature": "intrinsic",
        "description": "A changelog heading can name a release; matching a publication record still requires evidence.",
        "certainty": "conditional",
        "id": "relation:changelog:version",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "files",
        "target": "finding",
        "label": "supply evidence for",
        "nature": "intrinsic",
        "description": "Scans can locate credentials, security signals and other observations in source or package contents.",
        "id": "relation:files:finding",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "finding",
        "target": "weakness",
        "label": "may be classified by",
        "nature": "extrinsic",
        "description": "A finding can be assigned an external weakness category.",
        "certainty": "conditional",
        "id": "relation:finding:weakness",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "structure",
        "target": "capability",
        "label": "provides evidence for",
        "nature": "intrinsic",
        "description": "Code and call structure can reveal privileged operations and reachability.",
        "id": "relation:structure:capability",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "capability",
        "target": "finding",
        "label": "can produce change findings in",
        "nature": "intrinsic",
        "description": "Capability comparisons can identify changes requiring review.",
        "certainty": "conditional",
        "id": "relation:capability:finding",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "repository",
        "target": "threat-model",
        "label": "contains or is assessed against",
        "nature": "intrinsic",
        "description": "Checked-in threat-model documents and code-derived boundaries are intrinsic evidence.",
        "id": "relation:repository:threat-model",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "threat-model",
        "target": "finding",
        "label": "supplies assessment context for",
        "nature": "extrinsic",
        "description": "Stated security expectations and confirmed scope inform triage of findings.",
        "id": "relation:threat-model:finding",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "maintainer",
        "target": "threat-model",
        "label": "may confirm scope in",
        "nature": "extrinsic",
        "description": "Confirmation is scoped to a project and role, rather than a global identity record.",
        "certainty": "conditional",
        "id": "relation:maintainer:threat-model",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "repository",
        "target": "test-result",
        "label": "is exercised by",
        "nature": "intrinsic",
        "description": "Task and test execution outcomes need their input revision and environment.",
        "id": "relation:repository:test-result",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "policy",
        "target": "version",
        "label": "accepts or withholds",
        "nature": "extrinsic",
        "description": "Release-age policies combine publication timestamps with configured rules.",
        "id": "relation:policy:version",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "policy",
        "target": "finding",
        "label": "uses assessment evidence from",
        "nature": "extrinsic",
        "description": "Scan results may inform a decision to serve or withhold an artifact.",
        "id": "relation:policy:finding",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "policy",
        "target": "digest",
        "label": "can require a match for",
        "nature": "extrinsic",
        "description": "Integrity checks compare computed bytes with expected publication or manifest values.",
        "certainty": "conditional",
        "id": "relation:policy:digest",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "funding",
        "target": "package",
        "label": "can support",
        "nature": "extrinsic",
        "description": "Funding information can be associated with a published package through project links.",
        "certainty": "conditional",
        "id": "relation:funding:package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "repository",
        "target": "sbom",
        "label": "has an inventory snapshot in",
        "nature": "intrinsic",
        "description": "A generated SBOM can describe a repository at a recorded commit; an uploaded inventory may have no identified root repository.",
        "id": "relation:repository:sbom",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "sbom",
        "target": "repository",
        "label": "may resolve components to",
        "nature": "extrinsic",
        "description": "Component package identifiers can be looked up to identify their source repositories. These are distinct from the repository whose dependencies were inventoried.",
        "certainty": "conditional",
        "id": "relation:sbom:repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "repository",
        "target": "subproject",
        "label": "contains",
        "nature": "intrinsic",
        "description": "Workspace declarations and repository structure identify scannable subprojects.",
        "id": "relation:repository:subproject",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "subproject",
        "target": "package",
        "label": "may publish",
        "nature": "extrinsic",
        "description": "Registry lookup and manifest matching can associate a published package with a particular subproject.",
        "certainty": "conditional",
        "id": "relation:subproject:package",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "finding",
        "target": "exposure",
        "label": "is assessed for",
        "nature": "extrinsic",
        "description": "A finding in a library is evaluated against the versions and paths used by each consumer.",
        "id": "relation:finding:exposure",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "exposure",
        "target": "dependent-repository",
        "label": "assesses impact on",
        "nature": "extrinsic",
        "description": "Downstream exposure is scoped to a consuming project and its evidence.",
        "id": "relation:exposure:dependent-repository",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "exposure",
        "target": "version",
        "label": "qualifies affected",
        "nature": "extrinsic",
        "description": "Version and code-path evidence qualify whether the reported problem applies.",
        "id": "relation:exposure:version",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "exposure",
        "target": "structure",
        "label": "uses reachability evidence from",
        "nature": "intrinsic",
        "description": "Source traces can establish or rule out a path to vulnerable dependency code, subject to the analysed scope.",
        "id": "relation:exposure:structure",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "finding",
        "target": "remediation",
        "label": "may be addressed by",
        "nature": "extrinsic",
        "description": "A proposed fix or mitigation is linked to the finding it addresses.",
        "certainty": "conditional",
        "id": "relation:finding:remediation",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "remediation",
        "target": "change",
        "label": "proposes",
        "nature": "intrinsic",
        "description": "Patch contents record the proposed source changes.",
        "id": "relation:remediation:change",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "remediation",
        "target": "test-result",
        "label": "is validated through",
        "nature": "intrinsic",
        "description": "Reproduction and regression outcomes supply validation evidence for a particular patch.",
        "id": "relation:remediation:test-result",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "remediation",
        "target": "version",
        "label": "may ship in",
        "nature": "extrinsic",
        "description": "Release observation distinguishes a landed patch from a fix available in a published version.",
        "certainty": "conditional",
        "id": "relation:remediation:version",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "finding",
        "target": "disclosure",
        "label": "may be reported through",
        "nature": "extrinsic",
        "description": "Disclosure records track coordination and publication separately from finding verification.",
        "certainty": "conditional",
        "id": "relation:finding:disclosure",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "disclosure",
        "target": "maintainer",
        "label": "is routed to project contacts in",
        "nature": "extrinsic",
        "description": "Contacts are used in the context of reporting a project issue.",
        "id": "relation:disclosure:maintainer",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "disclosure",
        "target": "advisory",
        "label": "may be published as",
        "nature": "extrinsic",
        "description": "A published advisory can result from coordinated disclosure.",
        "certainty": "conditional",
        "id": "relation:disclosure:advisory",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "repository",
        "target": "security-posture",
        "label": "is assessed for",
        "nature": "extrinsic",
        "description": "Security policies, forge settings and independent control checks inform a project assessment.",
        "id": "relation:repository:security-posture",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    },
    {
      "data": {
        "source": "security-posture",
        "target": "disclosure",
        "label": "informs readiness for",
        "nature": "extrinsic",
        "description": "Contact channels and security processes affect how reports can be received.",
        "id": "relation:security-posture:disclosure",
        "kind": "relationship",
        "basis": "Conceptual relationship curated from the audit; not a claim of a direct integration between tools."
      }
    }
  ],
  "software": [
    {
      "id": "ecosyste-ms/packages",
      "label": "packages",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/packages",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "package-information",
        "dependencies"
      ],
      "purpose": "Maintains a cross-registry index of packages, releases and dependencies.",
      "inputs": [
        {
          "description": "Published package metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Registry records and repository context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency and declared-license records",
          "nature": "intrinsic"
        },
        {
          "description": "Release, publisher, usage and advisory records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/packages",
        "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "packages.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/packages",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "registry": "collects from",
        "package": "indexes",
        "version": "indexes",
        "dependency": "indexes declarations of",
        "dependent-package": "indexes",
        "dependent-repository": "indexes usage by",
        "maintainer": "indexes package roles for",
        "license": "indexes declarations of",
        "repository": "links packages to source repositories and enriches metadata for",
        "advisory": "indexes and matches",
        "version-range": "records dependency constraints and affected ranges as",
        "digest": "records published integrity values as",
        "funding": "aggregates package and repository links for",
        "language": "records package and source repository",
        "metadata": "exports package records as CodeMeta"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Repository enrichment, advisories, funding, integrity, language and CodeMeta export were missing.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "config/routes.rb"
          },
          {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "db/schema.rb"
          },
          {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "app/models/package.rb"
          },
          {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "app/models/version.rb"
          }
        ]
      },
      "data_products": [
        {
          "id": "ecosyste-ms/packages:data",
          "maintained_by": "ecosyste-ms/packages",
          "kind": "index",
          "label": "packages data",
          "purpose": "Maintains a cross-registry index of packages, releases and dependencies.",
          "contents": [
            {
              "description": "Dependency and declared-license records",
              "nature": "intrinsic"
            },
            {
              "description": "Release, publisher, usage and advisory records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "package-information",
            "dependencies"
          ],
          "source": {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/repos",
      "label": "repos",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/repos",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "repository-evidence",
        "dependencies"
      ],
      "purpose": "Maintains an index of source repositories and their contents and activity.",
      "inputs": [
        {
          "description": "Repository files and manifests",
          "nature": "intrinsic"
        },
        {
          "description": "Forge repository and owner records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Manifest and dependency records",
          "nature": "intrinsic"
        },
        {
          "description": "Repository profiles, topics and popularity",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/repos",
        "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "repos.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/repos",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "forge": "indexes hosts from",
        "repository": "indexes",
        "revision": "indexes tags from",
        "manifest": "indexes",
        "dependency": "indexes",
        "dependent-repository": "indexes usage by",
        "activity": "indexes",
        "package": "indexes repository usage of",
        "registry": "records package sources as",
        "license": "records declared",
        "language": "records repository",
        "funding": "extracts repository declarations of",
        "security-posture": "caches Scorecard assessments of",
        "files": "records paths of conventional repository",
        "classification": "indexes repository topics as",
        "artifact": "records forge release assets as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added package usage, registry context, license, language, funding, file paths, topics, release assets and Scorecard data.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/repos",
            "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
            "path": "config/routes.rb"
          },
          {
            "repository": "ecosyste-ms/repos",
            "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
            "path": "db/schema.rb"
          },
          {
            "repository": "ecosyste-ms/repos",
            "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
            "path": "app/models/repository.rb"
          }
        ]
      },
      "data_products": [
        {
          "id": "ecosyste-ms/repos:data",
          "maintained_by": "ecosyste-ms/repos",
          "kind": "index",
          "label": "repos data",
          "purpose": "Maintains an index of source repositories and their contents and activity.",
          "contents": [
            {
              "description": "Manifest and dependency records",
              "nature": "intrinsic"
            },
            {
              "description": "Repository profiles, topics and popularity",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence",
            "dependencies"
          ],
          "source": {
            "repository": "ecosyste-ms/repos",
            "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/commits",
      "label": "commits",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/commits",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "repository-evidence",
        "maintenance-funding"
      ],
      "purpose": "Collects commit history and contributor activity for repositories.",
      "inputs": [
        {
          "description": "Git history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Commit records and contribution summaries",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/commits",
        "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "commits.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/commits",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "revision": "indexes",
        "change": "indexes",
        "activity": "summarises commit activity as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/commits:data",
          "maintained_by": "ecosyste-ms/commits",
          "kind": "index",
          "label": "commits data",
          "purpose": "Collects commit history and contributor activity for repositories.",
          "contents": [
            {
              "description": "Commit records and contribution summaries",
              "nature": "intrinsic"
            }
          ],
          "areas": [
            "repository-evidence",
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/commits",
            "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/issues",
      "label": "issues",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/issues",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "repository-evidence",
        "maintenance-funding"
      ],
      "purpose": "Collects issues and pull requests to describe project activity and maintenance.",
      "inputs": [
        {
          "description": "Forge issues and pull requests",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Issue, pull-request and maintainer-activity records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/issues",
        "commit": "8182b698df20d556e163e79c64bd61b14150cdf0",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "issues.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/issues",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "issue": "indexes",
        "activity": "summarises",
        "maintainer": "reports repository activity associated with"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/issues:data",
          "maintained_by": "ecosyste-ms/issues",
          "kind": "index",
          "label": "issues data",
          "purpose": "Collects issues and pull requests to describe project activity and maintenance.",
          "contents": [
            {
              "description": "Issue, pull-request and maintainer-activity records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence",
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/issues",
            "commit": "8182b698df20d556e163e79c64bd61b14150cdf0",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/timeline",
      "label": "timeline",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/timeline",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Collects public GitHub events into a historical activity index.",
      "inputs": [
        {
          "description": "Public forge events",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Repository event histories and activity summaries",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/timeline",
        "commit": "08c79539293f64f2048301ad002a635ef3187fc1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "timeline.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/timeline",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "activity": "indexes forge events as",
        "repository": "indexes event context for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/timeline:data",
          "maintained_by": "ecosyste-ms/timeline",
          "kind": "index",
          "label": "timeline data",
          "purpose": "Collects public GitHub events into a historical activity index.",
          "contents": [
            {
              "description": "Repository event histories and activity summaries",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence"
          ],
          "source": {
            "repository": "ecosyste-ms/timeline",
            "commit": "08c79539293f64f2048301ad002a635ef3187fc1",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/advisories",
      "label": "advisories",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/advisories",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Collects vulnerability advisories and associates them with affected packages.",
      "inputs": [
        {
          "description": "Published vulnerability advisories",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Advisory records and affected-package information",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/advisories",
        "commit": "37baf19cac89ee4e8854ae541926f0bd772d69fa",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "advisories.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://ecosyste.ms/",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "advisory": "indexes",
        "package": "links affected",
        "version-range": "indexes affected ranges as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/advisories:data",
          "maintained_by": "ecosyste-ms/advisories",
          "kind": "index",
          "label": "advisories data",
          "purpose": "Collects vulnerability advisories and associates them with affected packages.",
          "contents": [
            {
              "description": "Advisory records and affected-package information",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security",
            "package-information"
          ],
          "source": {
            "repository": "ecosyste-ms/advisories",
            "commit": "37baf19cac89ee4e8854ae541926f0bd772d69fa",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/awesome",
      "label": "awesome",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/awesome",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "software-discovery"
      ],
      "purpose": "Indexes curated software lists and the projects they recommend.",
      "inputs": [
        {
          "description": "Curated lists about software",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "List membership and project recommendations",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/awesome",
        "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "awesome.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/awesome",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "indexes curated",
        "repository": "links recommendations to",
        "classification": "indexes list topics as",
        "language": "filters recommended software by"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added language filtering of indexed recommendations.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "config/routes.rb"
          },
          {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "db/schema.rb"
          },
          {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "app/models/project.rb"
          },
          {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "app/controllers/api/v1/projects_controller.rb"
          }
        ]
      },
      "data_products": [
        {
          "id": "ecosyste-ms/awesome:data",
          "maintained_by": "ecosyste-ms/awesome",
          "kind": "index",
          "label": "awesome data",
          "purpose": "Indexes curated software lists and the projects they recommend.",
          "contents": [
            {
              "description": "List membership and project recommendations",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "software-discovery"
          ],
          "source": {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/papers",
      "label": "papers",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/papers",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "research-software"
      ],
      "purpose": "Indexes mentions of software in scientific papers.",
      "inputs": [
        {
          "description": "Scientific papers and software mentions",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Paper-to-software relationships",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/papers",
        "commit": "73490219b17c02cfb8e6c80afa000ea4fef72c33",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "papers.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/papers",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "paper": "indexes software mentions in",
        "repository": "links publications to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/papers:data",
          "maintained_by": "ecosyste-ms/papers",
          "kind": "index",
          "label": "papers data",
          "purpose": "Indexes mentions of software in scientific papers.",
          "contents": [
            {
              "description": "Paper-to-software relationships",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "research-software"
          ],
          "source": {
            "repository": "ecosyste-ms/papers",
            "commit": "73490219b17c02cfb8e6c80afa000ea4fef72c33",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/science",
      "label": "science",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/science",
      "scope": "main",
      "roles": [
        "index",
        "application"
      ],
      "areas": [
        "research-software",
        "software-discovery"
      ],
      "purpose": "Builds a searchable catalogue of research software and its scientific context.",
      "inputs": [
        {
          "description": "Repository metadata and embedded citations",
          "nature": "intrinsic"
        },
        {
          "description": "Package indexes, papers and research catalogues",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Extracted software metadata and dependencies",
          "nature": "intrinsic"
        },
        {
          "description": "Research classifications, publication links and institutional context",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/science",
        "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "science.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/science",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "maintains research catalogues as",
        "paper": "links software to",
        "repository": "catalogues",
        "package": "catalogues",
        "classification": "indexes research topics as",
        "dependency": "indexes"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/science:data",
          "maintained_by": "ecosyste-ms/science",
          "kind": "index",
          "label": "science data",
          "purpose": "Builds a searchable catalogue of research software and its scientific context.",
          "contents": [
            {
              "description": "Extracted software metadata and dependencies",
              "nature": "intrinsic"
            },
            {
              "description": "Research classifications, publication links and institutional context",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "research-software",
            "software-discovery"
          ],
          "source": {
            "repository": "ecosyste-ms/science",
            "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/opencollective",
      "label": "opencollective",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/opencollective",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "maintenance-funding"
      ],
      "purpose": "Collects Open Collective information about software projects and their funding.",
      "inputs": [
        {
          "description": "Open Collective project and financial records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Collective, funding and transaction records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/opencollective",
        "commit": "29518f5e4ae205a0a524e829853db27158fe02c5",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "opencollective.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/opencollective",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "funding": "indexes",
        "repository": "links funded projects to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/opencollective:data",
          "maintained_by": "ecosyste-ms/opencollective",
          "kind": "index",
          "label": "opencollective data",
          "purpose": "Collects Open Collective information about software projects and their funding.",
          "contents": [
            {
              "description": "Collective, funding and transaction records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/opencollective",
            "commit": "29518f5e4ae205a0a524e829853db27158fe02c5",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/sponsors",
      "label": "sponsors",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/sponsors",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "maintenance-funding"
      ],
      "purpose": "Collects public GitHub Sponsors information.",
      "inputs": [
        {
          "description": "Public sponsorship records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Sponsor and sponsorship records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/sponsors",
        "commit": "9e378d0fae4b009900d26d5086f163eedf7e3dc4",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "sponsors.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/sponsors",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "funding": "indexes sponsorships as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/sponsors:data",
          "maintained_by": "ecosyste-ms/sponsors",
          "kind": "index",
          "label": "sponsors data",
          "purpose": "Collects public GitHub Sponsors information.",
          "contents": [
            {
              "description": "Sponsor and sponsorship records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/sponsors",
            "commit": "9e378d0fae4b009900d26d5086f163eedf7e3dc4",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/dependabot",
      "label": "dependabot",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/dependabot",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "dependencies",
        "maintenance-funding",
        "security"
      ],
      "purpose": "Indexes dependency update pull requests and their advisory context.",
      "inputs": [
        {
          "description": "Dependabot pull requests and published advisories",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency-update activity and remediation records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/dependabot",
        "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "dependabot.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/dependabot",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "issue": "indexes update pull requests as",
        "dependency": "tracks updates to",
        "advisory": "links remediation to",
        "change": "indexes dependency updates as",
        "remediation": "indexes dependency update activity for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/dependabot:data",
          "maintained_by": "ecosyste-ms/dependabot",
          "kind": "index",
          "label": "dependabot data",
          "purpose": "Indexes dependency update pull requests and their advisory context.",
          "contents": [
            {
              "description": "Dependency-update activity and remediation records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "dependencies",
            "maintenance-funding",
            "security"
          ],
          "source": {
            "repository": "ecosyste-ms/dependabot",
            "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/nexus",
      "label": "nexus",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/nexus",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Maintains Maven package and release discovery records from repository indexes.",
      "inputs": [
        {
          "description": "Maven repository indexes",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Maven package and release discovery records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/nexus",
        "commit": "d4b79a80fcfdf1ed5baab758c5efa49b4b89d982",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "nexus.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/nexus",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "registry": "indexes Maven repositories as",
        "package": "indexes",
        "version": "indexes",
        "artifact": "indexes Maven artifacts as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/nexus:data",
          "maintained_by": "ecosyste-ms/nexus",
          "kind": "index",
          "label": "nexus data",
          "purpose": "Maintains Maven package and release discovery records from repository indexes.",
          "contents": [
            {
              "description": "Maven package and release discovery records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "package-information"
          ],
          "source": {
            "repository": "ecosyste-ms/nexus",
            "commit": "d4b79a80fcfdf1ed5baab758c5efa49b4b89d982",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/critical",
      "label": "critical",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/critical",
      "scope": "main",
      "roles": [
        "dataset"
      ],
      "areas": [
        "package-information",
        "maintenance-funding"
      ],
      "purpose": "Publishes a downloadable snapshot of critical packages and their metadata.",
      "inputs": [
        {
          "description": "Indexed package and repository contents",
          "nature": "intrinsic"
        },
        {
          "description": "Package usage, maintenance and registry records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Snapshot of content-derived package metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Critical-package selection and enriched package snapshot",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/critical",
        "commit": "bb0fc1d6abd8361533109c132b75c53a1df9ee2e",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "collection": "publishes a critical-package snapshot as",
        "package": "catalogues",
        "classification": "records critical-package selections as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/critical:data",
          "maintained_by": "ecosyste-ms/critical",
          "kind": "dataset",
          "label": "critical data",
          "purpose": "Publishes a downloadable snapshot of critical packages and their metadata.",
          "contents": [
            {
              "description": "Snapshot of content-derived package metadata",
              "nature": "intrinsic"
            },
            {
              "description": "Critical-package selection and enriched package snapshot",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "package-information",
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/critical",
            "commit": "bb0fc1d6abd8361533109c132b75c53a1df9ee2e",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/docker",
      "label": "docker",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/docker",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Collects dependency information about container images.",
      "inputs": [
        {
          "description": "Container image contents",
          "nature": "intrinsic"
        },
        {
          "description": "Image registry records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Image dependency inventories",
          "nature": "intrinsic"
        },
        {
          "description": "Indexed image identities and registry context",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/docker",
        "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "docker.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/docker",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "artifact": "inspects container images as",
        "sbom": "collects",
        "dependency": "indexes image dependencies as",
        "dependent-package": "indexes image package use as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/docker:data",
          "maintained_by": "ecosyste-ms/docker",
          "kind": "index",
          "label": "docker data",
          "purpose": "Collects dependency information about container images.",
          "contents": [
            {
              "description": "Image dependency inventories",
              "nature": "intrinsic"
            },
            {
              "description": "Indexed image identities and registry context",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "dependencies"
          ],
          "source": {
            "repository": "ecosyste-ms/docker",
            "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/parser",
      "label": "parser",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/parser",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Extracts dependency information from manifests and lockfiles.",
      "inputs": [
        {
          "description": "Manifest and lockfile contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency names, requirements, scopes and file locations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/parser",
        "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "parser.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/parser",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "manifest": "parses",
        "dependency": "extracts",
        "artifact": "extracts manifests from",
        "files": "reads uploaded and downloaded",
        "package": "extracts declared dependency identities as",
        "version-range": "extracts dependency requirements as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added archive/file inputs, dependency identities and version requirements. Does not compute a resolved dependency graph.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/parser",
            "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
            "path": "config/routes.rb"
          },
          {
            "repository": "ecosyste-ms/parser",
            "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
            "path": "app/controllers/api/v1/jobs_controller.rb"
          },
          {
            "repository": "ecosyste-ms/parser",
            "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
            "path": "app/models/job.rb"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "ecosyste-ms/bibliothecary",
      "label": "bibliothecary",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/bibliothecary",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Recognises and parses dependency manifests and lockfiles across package ecosystems.",
      "inputs": [
        {
          "description": "Manifest and lockfile contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Structured dependency records",
          "nature": "intrinsic"
        }
      ],
      "fork": true,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/bibliothecary",
        "commit": "2e4fa0c4304b8bab6fc5eb80d69727c808d7a2a1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "manifest": "recognises and parses",
        "dependency": "extracts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/archives",
      "label": "archives",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/archives",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "archives-artifacts"
      ],
      "purpose": "Provides access to files and documentation inside package archives.",
      "inputs": [
        {
          "description": "Package archive bytes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "File listings, file contents, READMEs and changelogs",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/archives",
        "commit": "63d7a7887ab4d854f0ec3d7c8fae73fcd25fce86",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "archives.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/archives",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "artifact": "inspects",
        "files": "lists and retrieves",
        "changelog": "retrieves documents containing"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/licenses",
      "label": "licenses",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/licenses",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "licenses"
      ],
      "purpose": "Detects license information in package and repository contents.",
      "inputs": [
        {
          "description": "License text and archive contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Detected licenses and matching files",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/licenses",
        "commit": "c7453c1f723e3ef92025485760dc2e23c798fc28",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "licenses.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/licenses",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "license": "detects",
        "files": "examines"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/digest",
      "label": "digest",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/digest",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "archives-artifacts",
        "security"
      ],
      "purpose": "Calculates content digests for downloaded package files.",
      "inputs": [
        {
          "description": "Package file bytes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Digests, integrity strings and file sizes",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/digest",
        "commit": "ed17117ad9cab6fa1be7104a01340664bece4dea",
        "path": "readme.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "digest.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://ecosyste.ms/",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "artifact": "hashes",
        "digest": "computes"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/diff",
      "label": "diff",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/diff",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "archives-artifacts"
      ],
      "purpose": "Compares the contents of package releases.",
      "inputs": [
        {
          "description": "Two package release archives",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Changed files and release-content differences",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/diff",
        "commit": "4c6a7adac9d7e5305dc2d4fff9370bedd540d0f1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "diff.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/diff",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "artifact": "compares",
        "change": "produces content comparisons as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/resolve",
      "label": "resolve",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/resolve",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Resolves package dependencies into dependency trees.",
      "inputs": [
        {
          "description": "Declared dependency requirements",
          "nature": "intrinsic"
        },
        {
          "description": "Available package releases and metadata",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Resolved dependency relationships",
          "nature": "intrinsic"
        },
        {
          "description": "Selected published package versions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/resolve",
        "commit": "2770b8e637bdd3bfdddcf27df6b75f22ad6b9b44",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "resolve.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/resolve",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "dependency": "resolves",
        "dependency-graph": "produces",
        "version": "selects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/resolve-cli",
      "label": "resolve-cli",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/resolve-cli",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Resolves package dependency trees using package-manager behaviour.",
      "inputs": [
        {
          "description": "Dependency requirements",
          "nature": "intrinsic"
        },
        {
          "description": "Registry package and release records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Resolved dependency relationships",
          "nature": "intrinsic"
        },
        {
          "description": "Selected published package versions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/resolve-cli",
        "commit": "3d0e15375d5583a2c7f628d29c2e37b233d0eaf2",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency": "resolves",
        "dependency-graph": "produces",
        "version": "selects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/sbom",
      "label": "sbom",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/sbom",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Reads and converts software bills of materials.",
      "inputs": [
        {
          "description": "Software inventory documents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Parsed component records and converted inventory documents",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/sbom",
        "commit": "a0d8d2a8bb0186c3f5a9dfe967c2deaaad2570e3",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "An SBOM may carry external enrichment. Classification follows the fields retained, rather than the document format."
      ],
      "domains": [
        "sbom.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/sbom",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "sbom": "reads and converts",
        "package": "extracts component records for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/dashboards",
      "label": "dashboards",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/dashboards",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "maintenance-funding",
        "software-discovery"
      ],
      "purpose": "Combines project data into browsable collections and project views.",
      "inputs": [
        {
          "description": "Indexed package and repository contents",
          "nature": "intrinsic"
        },
        {
          "description": "Activity, advisory and funding records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency and project-content summaries",
          "nature": "intrinsic"
        },
        {
          "description": "Collection, maintenance and funding views",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/dashboards",
        "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Lower priority for this map, per the user; keep outside the default view."
      ],
      "domains": [
        "dashboards.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://ecosyste.ms/",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "presents",
        "activity": "summarises",
        "funding": "presents project context for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/funds",
      "label": "funds",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/funds",
      "scope": "main",
      "roles": [
        "application"
      ],
      "areas": [
        "maintenance-funding"
      ],
      "purpose": "Supports funding open source projects and allocating funds.",
      "inputs": [
        {
          "description": "Project, collective and funding information",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Funding allocations and project funding records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/funds",
        "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "funds.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/funds",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "funding": "records allocations as",
        "repository": "links funded projects to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/radar",
      "label": "radar",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/radar",
      "scope": "main",
      "roles": [
        "application"
      ],
      "areas": [
        "dependencies",
        "maintenance-funding"
      ],
      "purpose": "Shows the projects that depend on a package.",
      "inputs": [
        {
          "description": "Indexed dependent packages and repositories",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Downstream usage views",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/radar",
        "commit": "a19908a14f1f63d54f66a680822a35ce5168872c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependent-repository": "displays",
        "package": "looks up downstream use of",
        "dependent-package": "displays"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/summary",
      "label": "summary",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/summary",
      "scope": "supporting",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "maintenance-funding",
        "software-discovery"
      ],
      "purpose": "Produces combined overviews for collections of projects.",
      "inputs": [
        {
          "description": "Indexed repository contents",
          "nature": "intrinsic"
        },
        {
          "description": "Project metadata and activity",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Combined content-derived summaries",
          "nature": "intrinsic"
        },
        {
          "description": "Combined project and activity summaries",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/summary",
        "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Lower priority for this map, per the user; keep outside the default view."
      ],
      "domains": [
        "summary.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/summary",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "summarises",
        "activity": "aggregates",
        "dependency": "summarises"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/ost",
      "label": "ost",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ost",
      "scope": "main",
      "roles": [
        "index",
        "application"
      ],
      "areas": [
        "software-discovery",
        "research-software"
      ],
      "purpose": "Catalogues software connected to environmental sustainability.",
      "inputs": [
        {
          "description": "Open Sustainable Technology curation and project metadata",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Curated sustainability software catalogue",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ost",
        "commit": "98b61c17b8ab5c7adf6789024b7f35e51e85d182",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "ost.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/ost",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "maintains sustainability catalogues as",
        "classification": "records sustainability topics as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/ost:data",
          "maintained_by": "ecosyste-ms/ost",
          "kind": "index",
          "label": "ost data",
          "purpose": "Catalogues software connected to environmental sustainability.",
          "contents": [
            {
              "description": "Curated sustainability software catalogue",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "software-discovery",
            "research-software"
          ],
          "source": {
            "repository": "ecosyste-ms/ost",
            "commit": "98b61c17b8ab5c7adf6789024b7f35e51e85d182",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/ruby",
      "label": "ruby",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ruby",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "software-discovery",
        "maintenance-funding"
      ],
      "purpose": "Presents an overview of the Ruby software ecosystem.",
      "inputs": [
        {
          "description": "Indexed package dependencies",
          "nature": "intrinsic"
        },
        {
          "description": "Ruby package and project metadata",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency summaries",
          "nature": "intrinsic"
        },
        {
          "description": "Ruby ecosystem summaries",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ruby",
        "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Domain-specific view; supporting detail rather than an overview anchor."
      ],
      "domains": [
        "ruby.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/ruby",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "package": "presents Ruby ecosystem records for",
        "dependency": "summarises",
        "activity": "summarises"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/oss-taxonomy",
      "label": "oss-taxonomy",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/oss-taxonomy",
      "scope": "main",
      "roles": [
        "dataset"
      ],
      "areas": [
        "software-discovery"
      ],
      "purpose": "Provides a shared vocabulary for describing software purposes and roles.",
      "inputs": [
        {
          "description": "Curated software classification terms",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Software taxonomy terms and facets",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/oss-taxonomy",
        "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "taxonomy.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/oss-taxonomy",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "classification": "defines vocabulary for"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Retained classification coverage. CodeMeta examples explain vocabulary use; they do not constitute a metadata parser.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/oss-taxonomy",
            "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
            "path": "README.md"
          },
          {
            "repository": "ecosyste-ms/oss-taxonomy",
            "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
            "path": "schema.json"
          },
          {
            "repository": "ecosyste-ms/oss-taxonomy",
            "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
            "path": "scripts/collect_external_source.rb"
          }
        ]
      },
      "data_products": [
        {
          "id": "ecosyste-ms/oss-taxonomy:data",
          "maintained_by": "ecosyste-ms/oss-taxonomy",
          "kind": "dataset",
          "label": "oss-taxonomy data",
          "purpose": "Provides a shared vocabulary for describing software purposes and roles.",
          "contents": [
            {
              "description": "Software taxonomy terms and facets",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "software-discovery"
          ],
          "source": {
            "repository": "ecosyste-ms/oss-taxonomy",
            "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/conda-api",
      "label": "conda-api",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/conda-api",
      "scope": "supporting",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Makes Conda package and version discovery available to Packages.",
      "inputs": [
        {
          "description": "Conda channel records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Conda package and version listings",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/conda-api",
        "commit": "4ac5da5d6441b6dd6369e12466690ebc575ea357",
        "path": "Readme.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "conda.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/conda-api",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "registry": "adapts Conda discovery from",
        "package": "lists",
        "version": "lists"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/npm-update-stream",
      "label": "npm-update-stream",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/npm-update-stream",
      "scope": "supporting",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Supplies recently changed npm package names for collection.",
      "inputs": [
        {
          "description": "npm registry changes",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package update feed",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/npm-update-stream",
        "commit": "f5d42f56920a3c6ad84d4c38c247d4603d9f21dd",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "streams changed identities of",
        "activity": "supplies publication updates as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/live",
      "label": "live",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/live",
      "scope": "main",
      "roles": [
        "service"
      ],
      "areas": [
        "package-information",
        "access-publishing"
      ],
      "purpose": "Publishes a live feed of newly observed packages and versions.",
      "inputs": [
        {
          "description": "Package and version events from collecting services",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Live package and release events",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/live",
        "commit": "c8e879658b133aab7169d75a6965c7490975ba64",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "live.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/live",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "package": "streams newly observed",
        "version": "streams newly observed"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/export",
      "label": "export",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/export",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Publishes bulk exports of collected data.",
      "inputs": [
        {
          "description": "Content-derived database records",
          "nature": "intrinsic"
        },
        {
          "description": "Externally collected database records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Bulk exports of intrinsic records",
          "nature": "intrinsic"
        },
        {
          "description": "Bulk exports of extrinsic records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/export",
        "commit": "a7436dc9a0ed994e6fb9015cbc62383626151de8",
        "path": "readme.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "exports indexed records for",
        "repository": "exports indexed records for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/ecosystems-go",
      "label": "ecosystems-go",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ecosystems-go",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Provides programmatic access to ecosyste.ms indexes and tools.",
      "inputs": [
        {
          "description": "Intrinsic records from ecosyste.ms",
          "nature": "intrinsic"
        },
        {
          "description": "Extrinsic records from ecosyste.ms",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved intrinsic records",
          "nature": "intrinsic"
        },
        {
          "description": "Retrieved extrinsic records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ecosystems-go",
        "commit": "038a83102b03aa8f3244eba9f23d8482e7df8043",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "queries indexed records for",
        "repository": "queries indexed records for",
        "advisory": "queries"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/ecosyste_ms_cli",
      "label": "ecosyste_ms_cli",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ecosyste_ms_cli",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Makes ecosyste.ms data available through command-line queries.",
      "inputs": [
        {
          "description": "Intrinsic records from ecosyste.ms",
          "nature": "intrinsic"
        },
        {
          "description": "Extrinsic records from ecosyste.ms",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Queried intrinsic records",
          "nature": "intrinsic"
        },
        {
          "description": "Queried extrinsic records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ecosyste_ms_cli",
        "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
        "path": "Readme.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "queries",
        "repository": "queries"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/mcp",
      "label": "mcp",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/mcp",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "access-publishing",
        "package-information"
      ],
      "purpose": "Lets assistant clients query a local critical-package snapshot and live package data.",
      "inputs": [
        {
          "description": "Content-derived package metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Critical-package snapshot and package context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved intrinsic package metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Package lookup results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/mcp",
        "commit": "826874adc73b4867ac56e9ed2aa28208111ed775",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "queries critical-package and live records for",
        "collection": "queries a critical-package snapshot as"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/mcp-server",
      "label": "mcp-server",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/mcp-server",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "access-publishing",
        "package-information"
      ],
      "purpose": "Exposes package ecosystem data to assistant clients.",
      "inputs": [
        {
          "description": "Indexed dependency and license records",
          "nature": "intrinsic"
        },
        {
          "description": "Package, release and usage records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency and license lookup results",
          "nature": "intrinsic"
        },
        {
          "description": "Package and ecosystem lookup results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/mcp-server",
        "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Keep separate from ecosyste-ms/mcp until their intended long-term roles are confirmed."
      ],
      "connection_review": null,
      "coverage": {
        "package": "queries",
        "dependency": "queries",
        "license": "queries"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/skills",
      "label": "skills",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/skills",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Provides reusable instructions for querying ecosyste.ms data.",
      "inputs": [
        {
          "description": "Content-derived index records",
          "nature": "intrinsic"
        },
        {
          "description": "Package and project context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved intrinsic information",
          "nature": "intrinsic"
        },
        {
          "description": "Retrieved extrinsic information",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/skills",
        "commit": "ad1ab09a19ea99e01a871db81b72282654655993",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "provides query workflows for",
        "repository": "provides query workflows for"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/threat_models",
      "label": "threat_models",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/threat_models",
      "scope": "supporting",
      "roles": [
        "dataset",
        "tool"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Collects and analyses threat-model documents found in repositories.",
      "inputs": [
        {
          "description": "Repository threat-model documents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Document corpus and observations about threat-model contents",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/threat_models",
        "commit": "e7a2e436c89ffb68339a73b97c0b85deff58af5f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "threat-model": "collects and analyses documents describing"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/threat_models:data",
          "maintained_by": "ecosyste-ms/threat_models",
          "kind": "dataset",
          "label": "threat_models data",
          "purpose": "Collects and analyses threat-model documents found in repositories.",
          "contents": [
            {
              "description": "Document corpus and observations about threat-model contents",
              "nature": "intrinsic"
            }
          ],
          "areas": [
            "security"
          ],
          "source": {
            "repository": "ecosyste-ms/threat_models",
            "commit": "e7a2e436c89ffb68339a73b97c0b85deff58af5f",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/typosquatting-dataset",
      "label": "typosquatting-dataset",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/typosquatting-dataset",
      "scope": "supporting",
      "roles": [
        "dataset"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Collects published examples of package typosquatting.",
      "inputs": [
        {
          "description": "Public security research",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Mappings between malicious package names and their targets",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/typosquatting-dataset",
        "commit": "fd0bde98d200efe5c282a07edc4c68fba13252c6",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "records impersonation targets for",
        "finding": "collects reported typosquatting examples as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/typosquatting-dataset:data",
          "maintained_by": "ecosyste-ms/typosquatting-dataset",
          "kind": "dataset",
          "label": "typosquatting-dataset data",
          "purpose": "Collects published examples of package typosquatting.",
          "contents": [
            {
              "description": "Mappings between malicious package names and their targets",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security",
            "package-information"
          ],
          "source": {
            "repository": "ecosyste-ms/typosquatting-dataset",
            "commit": "fd0bde98d200efe5c282a07edc4c68fba13252c6",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/git-pkgs",
      "label": "git-pkgs",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/git-pkgs",
      "scope": "main",
      "roles": [
        "application"
      ],
      "areas": [
        "dependencies",
        "security",
        "maintenance-funding"
      ],
      "purpose": "Tracks dependency changes through repository history and adds package context.",
      "inputs": [
        {
          "description": "Repository history, manifests and lockfiles",
          "nature": "intrinsic"
        },
        {
          "description": "Registry metadata and advisories",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Local dependency-history index, differences and SBOMs",
          "nature": "intrinsic"
        },
        {
          "description": "Vulnerability, freshness, funding and maintainer reports",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/git-pkgs",
        "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency": "tracks history of",
        "change": "reports dependency changes as",
        "sbom": "generates",
        "advisory": "retrieves",
        "maintainer": "reports package context for",
        "funding": "reports package context for",
        "repository": "analyses dependency history in",
        "revision": "indexes dependency snapshots at",
        "manifest": "parses and tracks",
        "package": "identifies and enriches dependencies as",
        "version": "compares installed and published",
        "version-range": "records declared dependency constraints as",
        "registry": "queries package and release metadata from",
        "license": "reports declarations and policy compatibility for",
        "digest": "verifies downloaded artifacts against",
        "attestation": "reports registry provenance metadata as",
        "changelog": "retrieves and filters version entries from",
        "files": "browses downloaded package source",
        "artifact": "downloads and inspects"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added repository history, manifests, package/version metadata, license, integrity, provenance and source/changelog browsing. The tree command groups records by manifest/type; it does not establish a resolved dependency graph.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "README.md"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "cmd/root.go"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "cmd/tree.go"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "cmd/provenance.go"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "cmd/integrity.go"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "internal/database/schema.go"
          }
        ]
      },
      "data_products": [
        {
          "id": "git-pkgs/git-pkgs:data",
          "maintained_by": "git-pkgs/git-pkgs",
          "kind": "index",
          "label": "Local dependency history",
          "purpose": "Tracks dependency changes through repository history and adds package context.",
          "contents": [
            {
              "description": "Dependency occurrences and changes indexed against commits and file paths",
              "nature": "intrinsic"
            }
          ],
          "areas": [
            "dependencies",
            "security",
            "maintenance-funding"
          ],
          "source": {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/manifests",
      "label": "manifests",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/manifests",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Extracts dependencies and package declarations from manifests and lockfiles.",
      "inputs": [
        {
          "description": "Manifest and lockfile contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package declarations, dependency requirements and integrity metadata",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/manifests",
        "commit": "99bbda20167c3d2ab3146f94fdf19aed38ce36d2",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "manifest": "parses",
        "dependency": "extracts",
        "package": "extracts declarations of",
        "digest": "extracts declared integrity values as",
        "subproject": "extracts workspace package declarations for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/registries",
      "label": "registries",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/registries",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Retrieves package information from registry sources.",
      "inputs": [
        {
          "description": "Package registry records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package, version and download information",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/registries",
        "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "registry": "queries",
        "package": "retrieves",
        "version": "retrieves"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/enrichment",
      "label": "enrichment",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/enrichment",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "package-information",
        "maintenance-funding"
      ],
      "purpose": "Combines package information from several sources using package identities.",
      "inputs": [
        {
          "description": "Content-derived metadata in source indexes",
          "nature": "intrinsic"
        },
        {
          "description": "Registry and ecosyste.ms package records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved dependency and declared-license information",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched package, maintainer, funding and release records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/enrichment",
        "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "enriches",
        "maintainer": "retrieves package roles for",
        "funding": "retrieves",
        "license": "retrieves declarations of"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/vers",
      "label": "vers",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/vers",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies",
        "security"
      ],
      "purpose": "Interprets and compares version ranges across package ecosystems.",
      "inputs": [
        {
          "description": "Version requirements in project metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Published release and advisory ranges",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Comparisons of declared constraints",
          "nature": "intrinsic"
        },
        {
          "description": "Release and advisory range matches",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/vers",
        "commit": "a2aa5bb667275e9a4ecf7a1eeb07760494558004",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "version-range": "interprets and compares"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/purl",
      "label": "purl",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/purl",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Identifies packages consistently across package ecosystems.",
      "inputs": [
        {
          "description": "Package coordinates declared in source",
          "nature": "intrinsic"
        },
        {
          "description": "Registry package identities",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Normalised declared package identities",
          "nature": "intrinsic"
        },
        {
          "description": "Normalised registry identities and package links",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/purl",
        "commit": "0cfbf6f91087fc7899b1c8e7e952bfc8c172c9e9",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "normalises identifiers for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/managers",
      "label": "managers",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/managers",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies",
        "testing-compatibility"
      ],
      "purpose": "Provides common package-management operations across ecosystems.",
      "inputs": [
        {
          "description": "Project configuration and dependency declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Package-manager capabilities",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Updated project dependency declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Package-management operation results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/managers",
        "commit": "c16c0e502615df3d69a6e0b005868232d5fdb978",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "manifest": "updates",
        "dependency": "changes through package-manager operations"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/resolve",
      "label": "resolve",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/resolve",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Turns package-manager resolution results into dependency graphs.",
      "inputs": [
        {
          "description": "Package-manager dependency-tree output",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Structured dependency trees and package identities",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/resolve",
        "commit": "59be154c0eb8846d0b77a6e6d9af24a444ad3d00",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency-graph": "normalises package-manager results into",
        "package": "identifies graph components as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/pom",
      "label": "pom",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/pom",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Resolves Maven dependency declarations and inherited configuration.",
      "inputs": [
        {
          "description": "Project POM declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Published parent POMs and dependency-management records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Resolved project dependency declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Resolved inherited package constraints",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/pom",
        "commit": "3bac91f5192593942d62e2ac8196ade9d06b1b5f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "manifest": "parses Maven configuration as",
        "dependency": "resolves inherited declarations of",
        "version-range": "resolves inherited constraints as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/provides",
      "label": "provides",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/provides",
      "scope": "main",
      "roles": [
        "library"
      ],
      "areas": [
        "dependencies",
        "testing-compatibility"
      ],
      "purpose": "Connects package identities to the names imported by source code.",
      "inputs": [
        {
          "description": "Package contents, source imports and project declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Package identity context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package-to-import mappings and project bindings",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/provides",
        "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "structure": "maps import names in",
        "package": "binds imports to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/sbom",
      "label": "sbom",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/sbom",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Reads and writes software inventory documents.",
      "inputs": [
        {
          "description": "Software inventory documents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Component records, relationships and converted SBOMs",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/sbom",
        "commit": "f23464671ebf1fb8e92ab70d61059e44f6ed6659",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "An SBOM may carry external enrichment. Classification follows the fields retained, rather than the document format."
      ],
      "connection_review": null,
      "coverage": {
        "sbom": "reads and writes",
        "dependency-graph": "reads recorded relationships for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/archives",
      "label": "archives",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/archives",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "archives-artifacts"
      ],
      "purpose": "Reads files and directories inside package archives.",
      "inputs": [
        {
          "description": "Archive bytes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Archive entries and file contents",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/archives",
        "commit": "acad49ddba4999e66c36643960cf3f06daeee197",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "extracts",
        "files": "reads"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/licenses",
      "label": "licenses",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/licenses",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "licenses"
      ],
      "purpose": "Detects licenses in text and repository contents.",
      "inputs": [
        {
          "description": "License text and repository files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "License matches and repository license reports",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/licenses",
        "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "license": "detects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/spdx",
      "label": "spdx",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/spdx",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "licenses"
      ],
      "purpose": "Interprets and normalises license expressions.",
      "inputs": [
        {
          "description": "License expressions in project files",
          "nature": "intrinsic"
        },
        {
          "description": "License expressions in registry records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Normalised project license expressions",
          "nature": "intrinsic"
        },
        {
          "description": "Normalised registry license expressions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/spdx",
        "commit": "9660a1d8e4a46de2479c3d4219904d625c15b3ca",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "license": "normalises expressions for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/reuse",
      "label": "reuse",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/reuse",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "licenses"
      ],
      "purpose": "Extracts declared license and copyright information from files and annotations.",
      "inputs": [
        {
          "description": "Source headers and license annotations",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Per-file license and copyright declarations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/reuse",
        "commit": "d9216df5ba8c6dbc319d875a4e81954c56356ec2",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "license": "extracts per-file declarations of",
        "files": "reads annotations in"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/git-spdx",
      "label": "git-spdx",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/git-spdx",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "licenses",
        "repository-evidence"
      ],
      "purpose": "Traces license evidence and changes through repository history.",
      "inputs": [
        {
          "description": "Git history and license-bearing files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "License-change histories with file and commit evidence",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/git-spdx",
        "commit": "522d4603703cfa625914f222830fc6b7ba78e744",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "license": "traces evidence for",
        "change": "reports license changes as",
        "revision": "examines"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/changelog",
      "label": "changelog",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/changelog",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Turns changelog text into structured release entries.",
      "inputs": [
        {
          "description": "Changelog contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Release entries and documented changes",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/changelog",
        "commit": "e594ba2fdf4df8d065f51a2aaa77141d64607fc2",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "changelog": "parses"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/history",
      "label": "history",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/history",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Reads commits, file changes and contents across repository history.",
      "inputs": [
        {
          "description": "Git objects and history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Commit, tree, file and change records",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/history",
        "commit": "cb72b31b48e428604d44dbad300014209f7dc48c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "revision": "reads",
        "files": "reads historical contents of",
        "change": "extracts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/forge",
      "label": "forge",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/forge",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Retrieves and manages repository information across source hosts.",
      "inputs": [
        {
          "description": "Forge repository, issue and release records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Repository and collaboration records and operation results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/forge",
        "commit": "70caf18ac5059dbb877d26f2b191d24d4805723a",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "forge": "queries",
        "repository": "retrieves metadata for",
        "issue": "retrieves and manages",
        "revision": "retrieves commits and resolves references to",
        "files": "reads and updates repository",
        "test-result": "retrieves CI runs and commit statuses as",
        "maintainer": "retrieves repository collaborator roles as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added commit/reference resolution, repository files, CI results and collaborator roles.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "git-pkgs/forge",
            "commit": "70caf18ac5059dbb877d26f2b191d24d4805723a",
            "path": "README.md"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "git-pkgs/brief",
      "label": "brief",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/brief",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "repository-evidence",
        "software-discovery",
        "research-software"
      ],
      "purpose": "Describes a repository's contents, toolchain, dependencies and embedded metadata.",
      "inputs": [
        {
          "description": "Repository files and configuration",
          "nature": "intrinsic"
        },
        {
          "description": "Optional enrichment sources",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Repository descriptions, dependency records and extracted citations",
          "nature": "intrinsic"
        },
        {
          "description": "Optional enriched project context",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/brief",
        "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "tasks": [
        "Describe repository contents and toolchains",
        "Extract dependencies and embedded metadata",
        "Derive threat categories from tool definitions",
        "Publish reusable tool-detection knowledge"
      ],
      "connection_review": null,
      "coverage": {
        "dependency": "extracts",
        "metadata": "extracts",
        "citation": "extracts",
        "language": "reports",
        "file-role": "reports",
        "classification": "describes repository purpose using",
        "manifest": "detects and parses",
        "files": "inventories project resources and changed",
        "license": "detects and reports declared",
        "changelog": "locates project documents containing",
        "threat-model": "derives stack-specific categories for",
        "weakness": "maps toolchain threats and known sinks to",
        "structure": "produces source outlines of",
        "change": "scopes toolchain reports to",
        "package": "retrieves published project",
        "dependent-package": "retrieves counts of",
        "security-posture": "retrieves Scorecard assessments of",
        "artifact": "inspects native objects inside",
        "file-format": "identifies binary and archive"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added threat categories, source outlines, artifact inspection, resource discovery, changes and external project enrichment. Known sinks are reference data, not detected vulnerabilities.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "README.md"
          },
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "cmd/brief/main.go"
          },
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "cmd/brief/threat.go"
          },
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "cmd/brief/enrich.go"
          },
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "cmd/brief/diff.go"
          }
        ]
      },
      "data_products": [
        {
          "id": "git-pkgs/brief:knowledge",
          "maintained_by": "git-pkgs/brief",
          "kind": "dataset",
          "label": "Toolchain knowledge",
          "purpose": "Reusable tool definitions, detection rules, taxonomy tags and security mappings.",
          "contents": [
            {
              "description": "Tool-detection rules, tool classifications and threat mappings",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence",
            "software-discovery",
            "research-software"
          ],
          "source": {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "knowledge/",
            "basis": "repository_source"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/outline",
      "label": "outline",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/outline",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Extracts a compact structural view of source code.",
      "inputs": [
        {
          "description": "Source files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Signatures, types, imports and source structure",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/outline",
        "commit": "62172fe572b40569208b040ac3b671e602bee63e",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "structure": "extracts",
        "files": "selects and packs source",
        "language": "identifies supported source"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added source-file selection and language identification. Import/call graphs remain code structure, not package dependency resolution.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "git-pkgs/outline",
            "commit": "62172fe572b40569208b040ac3b671e602bee63e",
            "path": "README.md"
          },
          {
            "repository": "git-pkgs/outline",
            "commit": "62172fe572b40569208b040ac3b671e602bee63e",
            "path": "pack.go"
          },
          {
            "repository": "git-pkgs/outline",
            "commit": "62172fe572b40569208b040ac3b671e602bee63e",
            "path": "cmd/outline/main.go"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "git-pkgs/distill",
      "label": "distill",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/distill",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "software-discovery"
      ],
      "purpose": "Builds and applies software classifiers using repository evidence.",
      "inputs": [
        {
          "description": "Repository descriptions and source structure",
          "nature": "intrinsic"
        },
        {
          "description": "Taxonomy terms and curated labels",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Extracted repository features",
          "nature": "intrinsic"
        },
        {
          "description": "Training labels, classifier models and classification assignments",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/distill",
        "commit": "0bcc406baa1364a11d249514c27e3878e9db89d7",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Classification assignments are assessments; extracted repository features remain intrinsic evidence."
      ],
      "connection_review": null,
      "coverage": {
        "classification": "builds and applies classifiers for",
        "repository": "extracts classification features from"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/languages",
      "label": "languages",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/languages",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Identifies programming languages from filenames and contents.",
      "inputs": [
        {
          "description": "File paths and source bytes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Language candidates and supporting evidence",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/languages",
        "commit": "0ebb33cb7dfcb9cc04a2863ba9bee51d3b746891",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "language": "detects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/roles",
      "label": "roles",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/roles",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Describes the roles of paths within repositories.",
      "inputs": [
        {
          "description": "Repository paths",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Source, test, fixture, generated and vendored path classifications",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/roles",
        "commit": "ac5d16bb5da206004961e28288c3d831684d973c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "tasks": [
        "Classify repository paths",
        "Attach evidence for source, test, vendor and generated-file roles",
        "Publish reusable path-classification rules"
      ],
      "connection_review": null,
      "coverage": {
        "file-role": "classifies"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "git-pkgs/roles:corpus",
          "maintained_by": "git-pkgs/roles",
          "kind": "dataset",
          "label": "Repository path-role corpus",
          "purpose": "Reusable conventions and rules for classifying paths in a repository.",
          "contents": [
            {
              "description": "Path conventions and classification rules",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence"
          ],
          "source": {
            "repository": "git-pkgs/roles",
            "commit": "ac5d16bb5da206004961e28288c3d831684d973c",
            "path": "corpus/",
            "basis": "repository_source"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/magic",
      "label": "magic",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/magic",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "archives-artifacts",
        "repository-evidence"
      ],
      "purpose": "Identifies file formats and encodings from file contents.",
      "inputs": [
        {
          "description": "File bytes or prefixes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Format and encoding observations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/magic",
        "commit": "f82631dea06e7f9d04093d0fd5d034814693c530",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "file-format": "detects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/gitignore",
      "label": "gitignore",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/gitignore",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Selects repository paths according to ignore rules.",
      "inputs": [
        {
          "description": "Paths and ignore files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Included and excluded paths with matching rules",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/gitignore",
        "commit": "d9fa9f898b68c0f3df90a182f2448e0f30fe1325",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "files": "filters paths in"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/clone",
      "label": "clone",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/clone",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Maintains local copies of remote repositories for analysis.",
      "inputs": [
        {
          "description": "Repository contents and history",
          "nature": "intrinsic"
        },
        {
          "description": "Remote repository locations",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Local repository copies",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/clone",
        "commit": "b9842889da5a6bdaef5e18011908e7ec037c4917",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "repository": "maintains local copies of"
      },
      "concept_review": {
        "repositories": [
          "git-pkgs/clone",
          "git-pkgs/scan",
          "git-pkgs/markup"
        ],
        "reason": "These have clear operations on repository copies, pattern matches and documentation, but are supporting utilities. Concept coverage alone does not establish that each deserves a map node.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/markup",
      "label": "markup",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/markup",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "archives-artifacts",
        "repository-evidence",
        "access-publishing"
      ],
      "purpose": "Renders repository documentation for display.",
      "inputs": [
        {
          "description": "Repository documentation",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Rendered documentation",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/markup",
        "commit": "b7247b92bd83fcf2bcab2f5c424b5deb2c6572d1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "files": "renders documentation from"
      },
      "concept_review": {
        "repositories": [
          "git-pkgs/clone",
          "git-pkgs/scan",
          "git-pkgs/markup"
        ],
        "reason": "These have clear operations on repository copies, pattern matches and documentation, but are supporting utilities. Concept coverage alone does not establish that each deserves a map node.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/vulns",
      "label": "vulns",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/vulns",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Retrieves vulnerability information for identified packages.",
      "inputs": [
        {
          "description": "Vulnerability databases and package identities",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package vulnerability records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/vulns",
        "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "advisory": "retrieves",
        "package": "looks up vulnerability context for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/signals",
      "label": "signals",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/signals",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "security",
        "repository-evidence"
      ],
      "purpose": "Traces security-related evidence through repository history.",
      "inputs": [
        {
          "description": "Git history and security-relevant files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Security evidence and changes with file and commit locations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/signals",
        "commit": "addc7cb43363d030f7c55184c9fdd004ed7f22d8",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "finding": "extracts security signals as",
        "revision": "traces evidence through",
        "change": "reports security-related"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/secrets",
      "label": "secrets",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/secrets",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "security",
        "repository-evidence"
      ],
      "purpose": "Finds possible leaked credentials across repository history.",
      "inputs": [
        {
          "description": "Repository file contents and history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Potential credential findings with file and commit evidence",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/secrets",
        "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "finding": "reports possible credentials as",
        "revision": "traces evidence through"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/capcheck",
      "label": "capcheck",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/capcheck",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Detects changes in the privileged operations reachable by code and dependencies.",
      "inputs": [
        {
          "description": "Source code and dependency code",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Capability baselines and change reports",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/capcheck",
        "commit": "d25374be9b8bd409e8b254cf21916bd1e1fc8c22",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "capability": "detects and compares",
        "finding": "reports capability changes as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/sarif",
      "label": "sarif",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/sarif",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Reads, writes and validates structured analysis findings.",
      "inputs": [
        {
          "description": "Source-analysis findings",
          "nature": "intrinsic"
        },
        {
          "description": "Imported assessment reports",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Structured intrinsic findings",
          "nature": "intrinsic"
        },
        {
          "description": "Structured imported findings",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/sarif",
        "commit": "fe6de84035a6302d08e729cb746ca4a66dcb4506",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "finding": "reads writes and validates"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/cwe",
      "label": "cwe",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/cwe",
      "scope": "supporting",
      "roles": [
        "tool",
        "dataset"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Provides names and descriptions for weakness categories.",
      "inputs": [
        {
          "description": "Published weakness catalogue",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Weakness names, descriptions and categories",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/cwe",
        "commit": "bfed07a9be7e2ac7dbe9b390430373f5faa261df",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "weakness": "provides vocabulary for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "git-pkgs/cwe:data",
          "maintained_by": "git-pkgs/cwe",
          "kind": "dataset",
          "label": "cwe data",
          "purpose": "Provides names and descriptions for weakness categories.",
          "contents": [
            {
              "description": "Weakness names, descriptions and categories",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security"
          ],
          "source": {
            "repository": "git-pkgs/cwe",
            "commit": "bfed07a9be7e2ac7dbe9b390430373f5faa261df",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/attestation",
      "label": "attestation",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/attestation",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "archives-artifacts"
      ],
      "purpose": "Extracts provenance claims from package attestations.",
      "inputs": [
        {
          "description": "Published attestation documents",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Builder, source and signer claims",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/attestation",
        "commit": "372f9e85d2e869c0c5cdc1b3fe735293c344c62b",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "attestation": "extracts provenance claims from",
        "revision": "extracts claimed source references to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/sigstore",
      "label": "sigstore",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/sigstore",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "archives-artifacts"
      ],
      "purpose": "Checks package attestations against verification material.",
      "inputs": [
        {
          "description": "Package content digests",
          "nature": "intrinsic"
        },
        {
          "description": "Attestations and verification records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Attestation verification results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/sigstore",
        "commit": "3c434e7633283fa3cb3878fd6a3f21f8d79e951a",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "attestation": "verifies signatures and subjects of"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/integrity",
      "label": "integrity",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/integrity",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "archives-artifacts"
      ],
      "purpose": "Checks package bytes against declared integrity information.",
      "inputs": [
        {
          "description": "Package bytes",
          "nature": "intrinsic"
        },
        {
          "description": "Expected checksums from publishers or registries",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Calculated content digests",
          "nature": "intrinsic"
        },
        {
          "description": "Match results against expected checksums",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/integrity",
        "commit": "8d80cb83c37b9107cca9f3ced25b2e11a1066dd3",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "digest": "computes and checks",
        "artifact": "checks bytes of"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/artifacts",
      "label": "artifacts",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/artifacts",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "archives-artifacts",
        "package-information"
      ],
      "purpose": "Describes completed package files by identity, digest and size.",
      "inputs": [
        {
          "description": "File digest and byte count",
          "nature": "intrinsic"
        },
        {
          "description": "Package coordinates",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "File content descriptors",
          "nature": "intrinsic"
        },
        {
          "description": "Associations between files and published packages",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/artifacts",
        "commit": "fd25f2d9eed3c17d0f517fb69b5f762404ef7e64",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "describes",
        "digest": "records",
        "package": "associates artifact identities with"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/proxy",
      "label": "proxy",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/proxy",
      "scope": "main",
      "roles": [
        "application",
        "service"
      ],
      "areas": [
        "archives-artifacts",
        "security"
      ],
      "purpose": "Caches package downloads and applies release-age and scanning policies.",
      "inputs": [
        {
          "description": "Package files",
          "nature": "intrinsic"
        },
        {
          "description": "Registry metadata, publication times and scanner verdicts",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Cached package files",
          "nature": "intrinsic"
        },
        {
          "description": "Filtered release metadata and scan decisions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/proxy",
        "commit": "544e1a5bdde698e6da82d73b77f31eee114a371f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "caches and serves",
        "policy": "applies",
        "finding": "uses scan results recorded as",
        "registry": "proxies upstreams and hosts packages as a",
        "package": "caches and enriches records for",
        "version": "filters by release age and checks for newer",
        "license": "normalizes and displays declared",
        "advisory": "queries and caches reports recorded as",
        "digest": "checks artifact bytes against",
        "files": "browses contents extracted from cached artifacts as",
        "change": "compares cached versions to display",
        "sbom": "reads component inventories for mirroring from",
        "attestation": "serves attached statements through OCI referrers as",
        "repository": "records package source links to"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Registry routes, enrichment APIs, SBOM mirroring, archive browsing and comparison, OCI referrers, integrity checks and database table names were inspected at the recorded revision. Attestations are served as attached artifacts; this does not imply verification of their claims.",
        "freshness_note": "Remote freshness could not be checked because writing FETCH_HEAD was blocked.",
        "references": [
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "README.md"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/server/server.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/server/api.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/enrichment/enrichment.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/mirror/source.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/server/browse.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/handler/container.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/handler/integrity.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/database/schema.go"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "git-pkgs/cooldown",
      "label": "cooldown",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/cooldown",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Filters releases according to their publication age.",
      "inputs": [
        {
          "description": "Release timestamps and age policies",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Eligible and withheld release lists",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/cooldown",
        "commit": "57cce9c6343064a45da140d64dcc568fc2119e89",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "policy": "applies release-age rules as",
        "version": "filters by publication age"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/pin",
      "label": "pin",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/pin",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "archives-artifacts",
        "dependencies"
      ],
      "purpose": "Vendors selected browser assets and records their identities and integrity.",
      "inputs": [
        {
          "description": "Published package file contents",
          "nature": "intrinsic"
        },
        {
          "description": "Registry package and release information",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Vendored assets and integrity hashes",
          "nature": "intrinsic"
        },
        {
          "description": "Package provenance and inventory records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/pin",
        "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "vendors browser assets as",
        "digest": "records integrity values as",
        "package": "records identities and provenance for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/nexus",
      "label": "nexus",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/nexus",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Reads Maven repository indexes to discover published artifacts.",
      "inputs": [
        {
          "description": "Maven repository indexes",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Artifact additions, removals and index progress records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/nexus",
        "commit": "fe5a039118c51d74bd5c28080484b95ce3bf154c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "registry": "reads Maven indexes from",
        "artifact": "discovers"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/citation",
      "label": "citation",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/citation",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "research-software"
      ],
      "purpose": "Extracts citation metadata declared by software projects.",
      "inputs": [
        {
          "description": "CITATION.cff files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Declared citation and author records",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/citation",
        "commit": "3b2ac7bd4aea9b096b8e8e2fad427b87a5ef4f93",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "citation": "extracts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/bibtex",
      "label": "bibtex",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/bibtex",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "research-software"
      ],
      "purpose": "Extracts bibliographic entries from files and repository documentation.",
      "inputs": [
        {
          "description": "Bibliography files and embedded entries",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Declared bibliography entries and citation metadata",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/bibtex",
        "commit": "7c94fb7dc3e7e174218eb4a5a6b82dc9e62aaf81",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "citation": "extracts bibliography entries as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/codemeta",
      "label": "codemeta",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/codemeta",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "research-software"
      ],
      "purpose": "Extracts software metadata declared in CodeMeta files.",
      "inputs": [
        {
          "description": "codemeta.json files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Declared software metadata",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/codemeta",
        "commit": "b382c2db41c9041c247c5907e806274f7f069980",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "metadata": "extracts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/scan",
      "label": "scan",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/scan",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "repository-evidence"
      ],
      "purpose": "Matches many text patterns in files for analysis tools.",
      "inputs": [
        {
          "description": "File contents",
          "nature": "intrinsic"
        },
        {
          "description": "Supplied matching patterns",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Pattern matches and source locations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/scan",
        "commit": "20366450e1eef8694485702ab77f64c91a5ac5ce",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Experimental pattern-matching tool."
      ],
      "connection_review": null,
      "coverage": {
        "finding": "supplies pattern matches for"
      },
      "concept_review": {
        "repositories": [
          "git-pkgs/clone",
          "git-pkgs/scan",
          "git-pkgs/markup"
        ],
        "reason": "These have clear operations on repository copies, pattern matches and documentation, but are supporting utilities. Concept coverage alone does not establish that each deserves a map node.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/actions",
      "label": "actions",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/actions",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies",
        "security"
      ],
      "purpose": "Runs dependency analysis in repository automation.",
      "inputs": [
        {
          "description": "Dependency changes",
          "nature": "intrinsic"
        },
        {
          "description": "Package and vulnerability context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency change reports",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched dependency checks",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/actions",
        "commit": "dc784fe1d639fd9b44f2ccdfad70976eac73c6ea",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency": "analyses",
        "change": "reports dependency changes as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/skills",
      "label": "skills",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/skills",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Provides reusable assistant workflows around repository and dependency tools.",
      "inputs": [
        {
          "description": "Repository contents",
          "nature": "intrinsic"
        },
        {
          "description": "Package and forge context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Repository analysis results",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched project analysis results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/skills",
        "commit": "a0b0f35e120def17440dd594dd2e8ad880aff7cb",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency": "provides analysis workflows for",
        "repository": "provides analysis workflows for"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "alpha-omega-security/scrutineer",
      "label": "scrutineer",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/scrutineer",
      "scope": "main",
      "roles": [
        "application",
        "index"
      ],
      "areas": [
        "security",
        "dependencies",
        "maintenance-funding"
      ],
      "purpose": "Investigates repositories and manages findings, verification and disclosure.",
      "inputs": [
        {
          "description": "Source code, dependencies and repository evidence",
          "nature": "intrinsic"
        },
        {
          "description": "Advisories, package context and maintainer activity",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency records, generated SBOM components and source-derived threat-model evidence",
          "nature": "intrinsic"
        },
        {
          "description": "Source findings, reproductions and patch validation evidence",
          "nature": "intrinsic"
        },
        {
          "description": "Published package records, imported inventory context, advisories and dependent exposure assessments",
          "nature": "extrinsic"
        },
        {
          "description": "Security posture assessments, triage decisions, remediation tracking and disclosure records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/scrutineer",
        "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "SBOMs and threat models can combine source-derived observations with external claims. Maintainer information is shown as project disclosure context."
      ],
      "connection_review": null,
      "coverage": {
        "finding": "investigates and manages",
        "test-result": "records reproductions as",
        "change": "records patch evidence as",
        "repository": "investigates",
        "sbom": "generates imports and indexes",
        "package": "looks up publications and inventory components for",
        "version": "records published and inventoried",
        "dependency": "records declarations of",
        "manifest": "records dependency evidence from",
        "dependent-package": "records downstream package candidates as",
        "dependent-repository": "investigates downstream exposure in",
        "threat-model": "derives and stores",
        "advisory": "retrieves and investigates",
        "maintainer": "identifies project disclosure contacts in",
        "revision": "records scan and inventory snapshots at",
        "license": "records package declarations of",
        "language": "retrieves and analyses",
        "structure": "examines reachability through",
        "weakness": "classifies findings using",
        "exposure": "assesses and exports",
        "remediation": "proposes and validates",
        "disclosure": "coordinates and records",
        "security-posture": "assesses",
        "subproject": "discovers and scopes scans to"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Skills, worker dispatch and parsers, and the models migrated for SQLite were inspected at the recorded revision. Table vocabulary describes the schema, not database contents.",
        "references": [
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "internal/db/db.go"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "internal/worker/skill.go"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "internal/worker/skill_parsers.go"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "internal/web/sboms.go"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/sbom/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/packages/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/threat-model/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/reachability/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/exposure/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/maintainers/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/posture/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/compliance/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/subprojects/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/patch/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/disclose/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/release-watch/SKILL.md"
          }
        ],
        "freshness_note": "Remote freshness could not be checked during this inspection because checkout writes and network access were restricted."
      },
      "data_products": [
        {
          "id": "alpha-omega-security/scrutineer:data",
          "maintained_by": "alpha-omega-security/scrutineer",
          "kind": "index",
          "label": "Repository inventories and security investigations",
          "purpose": "Investigates repositories and manages findings, verification and disclosure.",
          "contents": [
            {
              "description": "Dependency records, generated SBOM components and source-derived threat-model evidence",
              "nature": "intrinsic"
            },
            {
              "description": "Source findings, reproductions and patch validation evidence",
              "nature": "intrinsic"
            },
            {
              "description": "Published package records, imported inventory context, advisories and dependent exposure assessments",
              "nature": "extrinsic"
            },
            {
              "description": "Security posture assessments, triage decisions, remediation tracking and disclosure records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security",
            "dependencies",
            "maintenance-funding"
          ],
          "source": {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "alpha-omega-security/harness",
      "label": "harness",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/harness",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "testing-compatibility"
      ],
      "purpose": "Runs coding-agent tasks and collects their execution results.",
      "inputs": [
        {
          "description": "Source material supplied to analysis tasks",
          "nature": "intrinsic"
        },
        {
          "description": "Task instructions and external context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Source-derived task results",
          "nature": "intrinsic"
        },
        {
          "description": "Task outcomes and execution records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/harness",
        "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "test-result": "records coding-agent task outcomes as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Retained task-result coverage. Generic coding-agent event/usage output does not imply that Harness itself produces findings, SBOMs or threat models.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "alpha-omega-security/harness",
            "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
            "path": "README.md"
          },
          {
            "repository": "alpha-omega-security/harness",
            "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
            "path": "harness.go"
          },
          {
            "repository": "alpha-omega-security/harness",
            "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
            "path": "event.go"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "alpha-omega-security/hyrum",
      "label": "hyrum",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/hyrum",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "testing-compatibility",
        "dependencies"
      ],
      "purpose": "Generates tests for the ways projects use their dependencies.",
      "inputs": [
        {
          "description": "Source usage, tests and dependency-change history",
          "nature": "intrinsic"
        },
        {
          "description": "Package metadata and dependent discovery",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Usage evidence and generated behaviour tests",
          "nature": "intrinsic"
        },
        {
          "description": "Cross-project compatibility context",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/hyrum",
        "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependent-repository": "examines dependency use in",
        "structure": "extracts usage evidence from",
        "test-result": "generates behaviour checks for",
        "repository": "examines dependency consumers in",
        "manifest": "reads dependency declarations from",
        "dependency": "traces use of",
        "package": "resolves identities of dependencies as",
        "version": "compares behaviour across",
        "version-range": "resolves baseline dependency constraints expressed as",
        "revision": "mines compatibility evidence from",
        "changelog": "mines compatibility history from",
        "advisory": "gathers historical context from",
        "change": "identifies dependency behaviour changes as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added manifest and package/version inputs, source revisions, changelogs, advisories and behavioural changes used by compatibility tests.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "README.md"
          },
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "cmd/hyrum/gen.go"
          },
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "internal/hyrum/history.go"
          },
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "internal/hyrum/target.go"
          },
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "internal/hyrum/verify.go"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "alpha-omega-security/marshal",
      "label": "marshal",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/marshal",
      "scope": "main",
      "roles": [
        "application",
        "index"
      ],
      "areas": [
        "dependencies",
        "maintenance-funding",
        "security"
      ],
      "purpose": "Builds a local collection of package and project information from an SBOM.",
      "inputs": [
        {
          "description": "Imported component inventories",
          "nature": "intrinsic"
        },
        {
          "description": "Package, repository, maintainer and advisory records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Imported component records",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched local package catalogue and advisory matches",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/marshal",
        "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "sbom": "imports",
        "package": "builds an enriched local catalogue of",
        "advisory": "matches",
        "repository": "enriches package source records for",
        "version": "records observed SBOM component",
        "version-range": "matches observed versions against advisory",
        "license": "records package and repository declarations of",
        "maintainer": "records package-scoped publisher roles as",
        "activity": "aggregates repository maintenance signals as",
        "language": "records package and repository",
        "dependent-package": "records upstream counts of",
        "dependent-repository": "records upstream counts of"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added observed versions, advisory ranges, source repositories, license, package maintainer roles, activity, language and dependent counts. No resolved dependency graph or per-version enrichment is claimed.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "README.md"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "cmd/marshal/main.go"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "internal/db/models.go"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "internal/ingest/ingest.go"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "internal/enrich/packages/packages.go"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "internal/enrich/packages/advisories.go"
          }
        ]
      },
      "data_products": [
        {
          "id": "alpha-omega-security/marshal:data",
          "maintained_by": "alpha-omega-security/marshal",
          "kind": "index",
          "label": "Local enriched package catalogue",
          "purpose": "Builds a local collection of package and project information from an SBOM.",
          "contents": [
            {
              "description": "Imported component records",
              "nature": "intrinsic"
            },
            {
              "description": "Enriched local package catalogue and advisory matches",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "dependencies",
            "maintenance-funding",
            "security"
          ],
          "source": {
            "repository": "alpha-omega-security/marshal",
            "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "alpha-omega-security/heatmap",
      "label": "heatmap",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/heatmap",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "maintenance-funding",
        "security"
      ],
      "purpose": "Shows package criticality, maintenance and ownership in a visual overview.",
      "inputs": [
        {
          "description": "Content-derived project metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Critical-package, usage and maintenance records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Derived criticality and maintenance views",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/heatmap",
        "commit": "4ed37981a6e5049c81d7436d90abe036d2810773",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "An exploratory view with derived measures, not an authoritative risk score."
      ],
      "connection_review": null,
      "coverage": {
        "package": "visualises criticality of",
        "activity": "visualises maintenance context from",
        "maintainer": "visualises project-scoped ownership context for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/dependents",
      "label": "dependents",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/dependents",
      "scope": "main",
      "roles": [
        "library"
      ],
      "areas": [
        "dependencies",
        "testing-compatibility"
      ],
      "purpose": "Finds and ranks repositories that use a package.",
      "inputs": [
        {
          "description": "Package and dependent-repository metadata",
          "nature": "extrinsic"
        },
        {
          "description": "Candidate repository source, tests and build files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Downstream candidate lists",
          "nature": "extrinsic"
        },
        {
          "description": "Evidence of imports and tests in candidates",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/dependents",
        "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Restored from the audit’s recorded purpose and outputs, with scope and readiness corrected by the user.",
      "caveats": [
        "Exists and belongs in the map; needs further work, per the user."
      ],
      "tasks": [
        "Discover dependent repositories using package metadata",
        "Filter and rank candidates",
        "Inspect checkouts for imports, tests and build context"
      ],
      "connection_review": null,
      "coverage": {
        "dependent-repository": "discovers and ranks",
        "structure": "checks imports and test evidence in"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/downstream",
      "label": "downstream",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/downstream",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "testing-compatibility",
        "dependencies"
      ],
      "purpose": "Tests changes to a library against projects that depend on it.",
      "inputs": [
        {
          "description": "Library changes and dependent project tests",
          "nature": "intrinsic"
        },
        {
          "description": "Dependent project selection",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Baseline and changed-version test results",
          "nature": "intrinsic"
        },
        {
          "description": "Downstream compatibility reports",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/downstream",
        "commit": "d2dbe63e4fd7f1c1600cfd4d8657f83efdb352a0",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Restored from the audit’s recorded purpose and outputs, with scope and readiness corrected by the user.",
      "caveats": [
        "Exists and belongs in the map; needs further work, per the user."
      ],
      "tasks": [
        "Discover or curate dependent test projects",
        "Run baseline and changed-dependency tests",
        "Report new failures separately from broken baselines"
      ],
      "connection_review": null,
      "coverage": {
        "dependent-repository": "runs compatibility tests in",
        "test-result": "compares baseline and changed versions through"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/spam",
      "label": "spam",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/spam",
      "scope": "supporting",
      "roles": [
        "library",
        "dataset"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Measures promotional-text signals in package contents.",
      "inputs": [
        {
          "description": "Software package text",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Text measurements and exploratory spam indicators",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/spam",
        "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Restored from the audit’s recorded purpose and outputs, with scope and readiness corrected by the user.",
      "caveats": [
        "Exists and belongs in the map; needs further work, per the user.",
        "Measurements and exploratory scores do not establish that a package is spam; the selected corpus does not establish registry-wide accuracy."
      ],
      "tasks": [
        "Measure promotional-text signals",
        "Record matches and evidence from package text",
        "Evaluate rules against labelled package examples"
      ],
      "connection_review": null,
      "coverage": {
        "finding": "produces exploratory promotional-text indicators as",
        "files": "measures text in"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "git-pkgs/spam:corpus",
          "maintained_by": "git-pkgs/spam",
          "kind": "dataset",
          "label": "Promotional-text evaluation corpus",
          "purpose": "Selected package texts, labels and controls used to evaluate promotional-text rules.",
          "contents": [
            {
              "description": "Saved package text and file hashes",
              "nature": "intrinsic"
            },
            {
              "description": "Curated labels, campaign groups and evaluation selections",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security",
            "package-information"
          ],
          "source": {
            "repository": "git-pkgs/spam",
            "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
            "path": "testdata/corpus/README.md",
            "basis": "repository_source"
          }
        }
      ]
    },
    {
      "id": "andrew/swhid",
      "label": "SWHID (Ruby)",
      "organisation": "andrew",
      "url": "https://github.com/andrew/swhid",
      "scope": "supporting",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "archives-artifacts",
        "repository-evidence"
      ],
      "purpose": "Computes and parses content-based identifiers for software files, trees and history.",
      "tasks": [
        "Identify file contents and directory trees",
        "Identify revisions, releases and snapshots",
        "Parse and validate identifiers"
      ],
      "inputs": [
        {
          "description": "Files, directory trees and repository history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Software Heritage identifiers and parsed identifier fields",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/swhid",
        "commit": "11a904c175371414280df869fd024e6dafb49f47",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "content-identity": "computes and parses"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/swhid-go",
      "label": "SWHID",
      "organisation": "andrew",
      "url": "https://github.com/andrew/swhid-go",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "archives-artifacts",
        "repository-evidence"
      ],
      "purpose": "Computes and parses content-based identifiers for software files, trees and history.",
      "tasks": [
        "Identify file contents and directory trees",
        "Identify revisions, releases and snapshots",
        "Parse and validate identifiers"
      ],
      "inputs": [
        {
          "description": "Files, directory trees and repository history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Software Heritage identifiers and parsed identifier fields",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/swhid-go",
        "commit": "970dc0c078a04baa7daba0adb0a58a0bc383a1a7",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "content-identity": "computes and parses"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/vid",
      "label": "VID",
      "organisation": "andrew",
      "url": "https://github.com/andrew/vid",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "security",
        "repository-evidence"
      ],
      "purpose": "Computes content-based identifiers for code locations referenced by security findings.",
      "tasks": [
        "Identify code referenced by findings",
        "Compare whether reports refer to identical code"
      ],
      "inputs": [
        {
          "description": "Source bytes at selected finding locations",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Identifiers for the referenced code, including combined identifiers for multiple locations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/vid",
        "commit": "d6ec93c63b361c988a65adbf76fb8122ed5f7882",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [
        "An identifier establishes a match in code bytes, not whether the code is vulnerable."
      ],
      "connection_review": null,
      "coverage": {
        "content-identity": "computes code-location identifiers as",
        "finding": "anchors code evidence for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "alpha-omega-security/threat-model",
      "label": "Threat Model",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/threat-model",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Produces and validates a project security contract for maintainers, integrators and finding triage.",
      "tasks": [
        "Describe a project’s security contract",
        "Record and resolve maintainer questions",
        "Validate model documents and triage findings against them"
      ],
      "inputs": [
        {
          "description": "Source code and in-repository security documentation",
          "nature": "intrinsic"
        },
        {
          "description": "Maintainer answers and optional external security history",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Code-derived trust boundaries, entry points and security properties",
          "nature": "intrinsic"
        },
        {
          "description": "Maintainer-confirmed scope, inferred contract claims, triage dispositions and open questions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/threat-model",
        "commit": "192fd60cd0afe8851128ce4c68ed68c174c11948",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [
        "Claims retain documented, maintainer-supplied or inferred provenance. Functional overlap with Scrutineer does not establish a direct integration."
      ],
      "connection_review": null,
      "coverage": {
        "threat-model": "produces and validates",
        "finding": "triages against security scope",
        "structure": "examines entry points in",
        "repository": "scopes security contracts to",
        "dependency": "describes security responsibilities for",
        "advisory": "uses published security history from",
        "issue": "uses security discussions and triage history from",
        "subproject": "scopes models to"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added repository/subproject scope, dependency responsibility and advisory/issue context. Produces security contracts and triage dispositions, not vulnerability discoveries.",
        "freshness_note": "Public README reviewed on 2026-10-14; source link follows main because a local clone was unavailable.",
        "references": [
          {
            "repository": "alpha-omega-security/threat-model",
            "commit": "main",
            "path": "README.md"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "ecosyste-ms/ecosystems-ts",
      "label": "ecosystems-ts",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ecosystems-ts",
      "scope": "supporting",
      "roles": [
        "library"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Retrieves package, repository, advisory and activity records from ecosyste.ms.",
      "tasks": [
        "Look up packages and versions",
        "Retrieve repository, advisory and activity records",
        "Batch and paginate index queries"
      ],
      "inputs": [
        {
          "description": "Indexed content-derived software records",
          "nature": "intrinsic"
        },
        {
          "description": "Indexed package and repository context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved dependency and declared-content records",
          "nature": "intrinsic"
        },
        {
          "description": "Retrieved release, advisory, repository and activity records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ecosystems-ts",
        "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "queries",
        "repository": "queries",
        "advisory": "queries",
        "activity": "queries"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/purl",
      "label": "purl",
      "organisation": "andrew",
      "url": "https://github.com/andrew/purl",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "package-information",
        "dependencies"
      ],
      "purpose": "Parses and generates package URLs, resolves download links and retrieves package, repository and advisory records.",
      "inputs": [
        {
          "description": "Declared package coordinates",
          "nature": "intrinsic"
        },
        {
          "description": "Registry, repository and advisory records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Normalised declared package identities",
          "nature": "intrinsic"
        },
        {
          "description": "Download links and retrieved metadata",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/purl",
        "commit": "b4278d3acb1e09dadbc71bff07997fcd4d19d9f6",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "normalises identifiers and retrieves records for",
        "artifact": "resolves download links for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/vers",
      "label": "vers",
      "organisation": "andrew",
      "url": "https://github.com/andrew/vers",
      "scope": "main",
      "roles": [
        "library"
      ],
      "areas": [
        "dependencies",
        "security"
      ],
      "purpose": "Parses and compares version ranges, including VERS and package-manager constraint formats.",
      "inputs": [
        {
          "description": "Declared version constraints",
          "nature": "intrinsic"
        },
        {
          "description": "Release and advisory ranges",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Comparisons of declared constraints",
          "nature": "intrinsic"
        },
        {
          "description": "Release and advisory range matches",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/vers",
        "commit": "02432b51116d55fcb20b524706c3babac9dac486",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "version-range": "parses and compares"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/sarif",
      "label": "sarif",
      "organisation": "andrew",
      "url": "https://github.com/andrew/sarif",
      "scope": "supporting",
      "roles": [
        "library"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Creates, reads and manipulates structured static-analysis reports in SARIF.",
      "inputs": [
        {
          "description": "Source-analysis findings",
          "nature": "intrinsic"
        },
        {
          "description": "Imported assessment reports",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Structured source findings",
          "nature": "intrinsic"
        },
        {
          "description": "Structured imported assessments",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/sarif",
        "commit": "81ee77d4f3d09b3d2012de4d346ff1938240a88b",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "finding": "reads writes and manipulates"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/sbom",
      "label": "sbom",
      "organisation": "andrew",
      "url": "https://github.com/andrew/sbom",
      "scope": "main",
      "roles": [
        "library"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Parses, generates, validates and converts SPDX and CycloneDX software inventories.",
      "inputs": [
        {
          "description": "Software inventory documents",
          "nature": "intrinsic"
        },
        {
          "description": "External enrichment records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Component records, relationships and converted inventories",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched component metadata",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/sbom",
        "commit": "9565b6c57c089aa21df19639eeba21acab6eb875",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [
        "SBOM classification depends on the fields and their provenance."
      ],
      "connection_review": null,
      "coverage": {
        "sbom": "parses generates and converts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/changelog-parser",
      "label": "changelog-parser",
      "organisation": "andrew",
      "url": "https://github.com/andrew/changelog-parser",
      "scope": "supporting",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Parses changelog text into structured release entries.",
      "inputs": [
        {
          "description": "Changelog contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Release entries and documented changes",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/changelog-parser",
        "commit": "0bc7738ac74251f435132e5108676b5279120aec",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "changelog": "parses"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/diffoscope",
      "label": "diffoscope",
      "organisation": "andrew",
      "url": "https://github.com/andrew/diffoscope",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "archives-artifacts"
      ],
      "purpose": "Wraps diffoscope to compare files, URLs and package artifacts identified by PURL.",
      "inputs": [
        {
          "description": "Files and package artifact contents",
          "nature": "intrinsic"
        },
        {
          "description": "Package download locations",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Content differences and file digests",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/diffoscope",
        "commit": "6302b86137df7a7c44db8777d5c62ad9a935f5d0",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "compares",
        "change": "produces content comparisons as",
        "digest": "computes"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/typosquatting",
      "label": "typosquatting",
      "organisation": "andrew",
      "url": "https://github.com/andrew/typosquatting",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "package-information",
        "security"
      ],
      "purpose": "Generates similar package names and checks for published candidates and dependency-confusion risks.",
      "inputs": [
        {
          "description": "Package names and ecosystem identifiers",
          "nature": "extrinsic"
        },
        {
          "description": "Package records from ecosyste.ms",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Candidate names and publication matches for investigation",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/typosquatting",
        "commit": "70aa46db9f5a2a1ba526f2588b734f9e45a6bb72",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [
        "Similar names are investigation candidates, not proof of malicious intent."
      ],
      "connection_review": null,
      "coverage": {
        "package": "generates and checks similar names for",
        "finding": "produces impersonation candidates as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/ultimate-awesome",
      "label": "ultimate-awesome",
      "organisation": "andrew",
      "url": "https://github.com/andrew/ultimate-awesome",
      "scope": "supporting",
      "roles": [
        "dataset"
      ],
      "areas": [
        "software-discovery"
      ],
      "purpose": "Publishes a combined list of curated software recommendations exported by Awesome.",
      "inputs": [
        {
          "description": "Awesome list export",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Generated Markdown software list",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/ultimate-awesome",
        "commit": "d457c48223f2106a7ce6f34f35a1526247b4808d",
        "path": ".github/workflows/update.yml",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "collection": "publishes combined curated lists as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ultimate-awesome-list",
          "maintained_by": "andrew/ultimate-awesome",
          "kind": "dataset",
          "label": "Combined Awesome list",
          "purpose": "A published Markdown export of curated software lists.",
          "contents": [
            {
              "description": "Software recommendations and list membership",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "software-discovery"
          ],
          "source": {
            "repository": "andrew/ultimate-awesome",
            "commit": "d457c48223f2106a7ce6f34f35a1526247b4808d",
            "path": ".github/workflows/update.yml",
            "basis": "repository_documentation"
          }
        }
      ]
    }
  ],
  "repositories": [
    {
      "id": "ecosyste-ms/packages",
      "label": "packages",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/packages",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "package-information",
        "dependencies"
      ],
      "purpose": "Maintains a cross-registry index of packages, releases and dependencies.",
      "inputs": [
        {
          "description": "Published package metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Registry records and repository context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency and declared-license records",
          "nature": "intrinsic"
        },
        {
          "description": "Release, publisher, usage and advisory records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/packages",
        "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "packages.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/packages",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "registry": "collects from",
        "package": "indexes",
        "version": "indexes",
        "dependency": "indexes declarations of",
        "dependent-package": "indexes",
        "dependent-repository": "indexes usage by",
        "maintainer": "indexes package roles for",
        "license": "indexes declarations of",
        "repository": "links packages to source repositories and enriches metadata for",
        "advisory": "indexes and matches",
        "version-range": "records dependency constraints and affected ranges as",
        "digest": "records published integrity values as",
        "funding": "aggregates package and repository links for",
        "language": "records package and source repository",
        "metadata": "exports package records as CodeMeta"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Repository enrichment, advisories, funding, integrity, language and CodeMeta export were missing.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "config/routes.rb"
          },
          {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "db/schema.rb"
          },
          {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "app/models/package.rb"
          },
          {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "app/models/version.rb"
          }
        ]
      },
      "data_products": [
        {
          "id": "ecosyste-ms/packages:data",
          "maintained_by": "ecosyste-ms/packages",
          "kind": "index",
          "label": "packages data",
          "purpose": "Maintains a cross-registry index of packages, releases and dependencies.",
          "contents": [
            {
              "description": "Dependency and declared-license records",
              "nature": "intrinsic"
            },
            {
              "description": "Release, publisher, usage and advisory records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "package-information",
            "dependencies"
          ],
          "source": {
            "repository": "ecosyste-ms/packages",
            "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/repos",
      "label": "repos",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/repos",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "repository-evidence",
        "dependencies"
      ],
      "purpose": "Maintains an index of source repositories and their contents and activity.",
      "inputs": [
        {
          "description": "Repository files and manifests",
          "nature": "intrinsic"
        },
        {
          "description": "Forge repository and owner records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Manifest and dependency records",
          "nature": "intrinsic"
        },
        {
          "description": "Repository profiles, topics and popularity",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/repos",
        "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "repos.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/repos",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "forge": "indexes hosts from",
        "repository": "indexes",
        "revision": "indexes tags from",
        "manifest": "indexes",
        "dependency": "indexes",
        "dependent-repository": "indexes usage by",
        "activity": "indexes",
        "package": "indexes repository usage of",
        "registry": "records package sources as",
        "license": "records declared",
        "language": "records repository",
        "funding": "extracts repository declarations of",
        "security-posture": "caches Scorecard assessments of",
        "files": "records paths of conventional repository",
        "classification": "indexes repository topics as",
        "artifact": "records forge release assets as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added package usage, registry context, license, language, funding, file paths, topics, release assets and Scorecard data.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/repos",
            "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
            "path": "config/routes.rb"
          },
          {
            "repository": "ecosyste-ms/repos",
            "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
            "path": "db/schema.rb"
          },
          {
            "repository": "ecosyste-ms/repos",
            "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
            "path": "app/models/repository.rb"
          }
        ]
      },
      "data_products": [
        {
          "id": "ecosyste-ms/repos:data",
          "maintained_by": "ecosyste-ms/repos",
          "kind": "index",
          "label": "repos data",
          "purpose": "Maintains an index of source repositories and their contents and activity.",
          "contents": [
            {
              "description": "Manifest and dependency records",
              "nature": "intrinsic"
            },
            {
              "description": "Repository profiles, topics and popularity",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence",
            "dependencies"
          ],
          "source": {
            "repository": "ecosyste-ms/repos",
            "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/commits",
      "label": "commits",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/commits",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "repository-evidence",
        "maintenance-funding"
      ],
      "purpose": "Collects commit history and contributor activity for repositories.",
      "inputs": [
        {
          "description": "Git history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Commit records and contribution summaries",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/commits",
        "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "commits.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/commits",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "revision": "indexes",
        "change": "indexes",
        "activity": "summarises commit activity as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/commits:data",
          "maintained_by": "ecosyste-ms/commits",
          "kind": "index",
          "label": "commits data",
          "purpose": "Collects commit history and contributor activity for repositories.",
          "contents": [
            {
              "description": "Commit records and contribution summaries",
              "nature": "intrinsic"
            }
          ],
          "areas": [
            "repository-evidence",
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/commits",
            "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/issues",
      "label": "issues",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/issues",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "repository-evidence",
        "maintenance-funding"
      ],
      "purpose": "Collects issues and pull requests to describe project activity and maintenance.",
      "inputs": [
        {
          "description": "Forge issues and pull requests",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Issue, pull-request and maintainer-activity records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/issues",
        "commit": "8182b698df20d556e163e79c64bd61b14150cdf0",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "issues.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/issues",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "issue": "indexes",
        "activity": "summarises",
        "maintainer": "reports repository activity associated with"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/issues:data",
          "maintained_by": "ecosyste-ms/issues",
          "kind": "index",
          "label": "issues data",
          "purpose": "Collects issues and pull requests to describe project activity and maintenance.",
          "contents": [
            {
              "description": "Issue, pull-request and maintainer-activity records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence",
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/issues",
            "commit": "8182b698df20d556e163e79c64bd61b14150cdf0",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/timeline",
      "label": "timeline",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/timeline",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Collects public GitHub events into a historical activity index.",
      "inputs": [
        {
          "description": "Public forge events",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Repository event histories and activity summaries",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/timeline",
        "commit": "08c79539293f64f2048301ad002a635ef3187fc1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "timeline.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/timeline",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "activity": "indexes forge events as",
        "repository": "indexes event context for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/timeline:data",
          "maintained_by": "ecosyste-ms/timeline",
          "kind": "index",
          "label": "timeline data",
          "purpose": "Collects public GitHub events into a historical activity index.",
          "contents": [
            {
              "description": "Repository event histories and activity summaries",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence"
          ],
          "source": {
            "repository": "ecosyste-ms/timeline",
            "commit": "08c79539293f64f2048301ad002a635ef3187fc1",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/advisories",
      "label": "advisories",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/advisories",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Collects vulnerability advisories and associates them with affected packages.",
      "inputs": [
        {
          "description": "Published vulnerability advisories",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Advisory records and affected-package information",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/advisories",
        "commit": "37baf19cac89ee4e8854ae541926f0bd772d69fa",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "advisories.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://ecosyste.ms/",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "advisory": "indexes",
        "package": "links affected",
        "version-range": "indexes affected ranges as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/advisories:data",
          "maintained_by": "ecosyste-ms/advisories",
          "kind": "index",
          "label": "advisories data",
          "purpose": "Collects vulnerability advisories and associates them with affected packages.",
          "contents": [
            {
              "description": "Advisory records and affected-package information",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security",
            "package-information"
          ],
          "source": {
            "repository": "ecosyste-ms/advisories",
            "commit": "37baf19cac89ee4e8854ae541926f0bd772d69fa",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/awesome",
      "label": "awesome",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/awesome",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "software-discovery"
      ],
      "purpose": "Indexes curated software lists and the projects they recommend.",
      "inputs": [
        {
          "description": "Curated lists about software",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "List membership and project recommendations",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/awesome",
        "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "awesome.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/awesome",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "indexes curated",
        "repository": "links recommendations to",
        "classification": "indexes list topics as",
        "language": "filters recommended software by"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added language filtering of indexed recommendations.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "config/routes.rb"
          },
          {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "db/schema.rb"
          },
          {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "app/models/project.rb"
          },
          {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "app/controllers/api/v1/projects_controller.rb"
          }
        ]
      },
      "data_products": [
        {
          "id": "ecosyste-ms/awesome:data",
          "maintained_by": "ecosyste-ms/awesome",
          "kind": "index",
          "label": "awesome data",
          "purpose": "Indexes curated software lists and the projects they recommend.",
          "contents": [
            {
              "description": "List membership and project recommendations",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "software-discovery"
          ],
          "source": {
            "repository": "ecosyste-ms/awesome",
            "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/papers",
      "label": "papers",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/papers",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "research-software"
      ],
      "purpose": "Indexes mentions of software in scientific papers.",
      "inputs": [
        {
          "description": "Scientific papers and software mentions",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Paper-to-software relationships",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/papers",
        "commit": "73490219b17c02cfb8e6c80afa000ea4fef72c33",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "papers.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/papers",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "paper": "indexes software mentions in",
        "repository": "links publications to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/papers:data",
          "maintained_by": "ecosyste-ms/papers",
          "kind": "index",
          "label": "papers data",
          "purpose": "Indexes mentions of software in scientific papers.",
          "contents": [
            {
              "description": "Paper-to-software relationships",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "research-software"
          ],
          "source": {
            "repository": "ecosyste-ms/papers",
            "commit": "73490219b17c02cfb8e6c80afa000ea4fef72c33",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/science",
      "label": "science",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/science",
      "scope": "main",
      "roles": [
        "index",
        "application"
      ],
      "areas": [
        "research-software",
        "software-discovery"
      ],
      "purpose": "Builds a searchable catalogue of research software and its scientific context.",
      "inputs": [
        {
          "description": "Repository metadata and embedded citations",
          "nature": "intrinsic"
        },
        {
          "description": "Package indexes, papers and research catalogues",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Extracted software metadata and dependencies",
          "nature": "intrinsic"
        },
        {
          "description": "Research classifications, publication links and institutional context",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/science",
        "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "science.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/science",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "maintains research catalogues as",
        "paper": "links software to",
        "repository": "catalogues",
        "package": "catalogues",
        "classification": "indexes research topics as",
        "dependency": "indexes"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/science:data",
          "maintained_by": "ecosyste-ms/science",
          "kind": "index",
          "label": "science data",
          "purpose": "Builds a searchable catalogue of research software and its scientific context.",
          "contents": [
            {
              "description": "Extracted software metadata and dependencies",
              "nature": "intrinsic"
            },
            {
              "description": "Research classifications, publication links and institutional context",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "research-software",
            "software-discovery"
          ],
          "source": {
            "repository": "ecosyste-ms/science",
            "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/opencollective",
      "label": "opencollective",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/opencollective",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "maintenance-funding"
      ],
      "purpose": "Collects Open Collective information about software projects and their funding.",
      "inputs": [
        {
          "description": "Open Collective project and financial records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Collective, funding and transaction records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/opencollective",
        "commit": "29518f5e4ae205a0a524e829853db27158fe02c5",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "opencollective.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/opencollective",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "funding": "indexes",
        "repository": "links funded projects to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/opencollective:data",
          "maintained_by": "ecosyste-ms/opencollective",
          "kind": "index",
          "label": "opencollective data",
          "purpose": "Collects Open Collective information about software projects and their funding.",
          "contents": [
            {
              "description": "Collective, funding and transaction records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/opencollective",
            "commit": "29518f5e4ae205a0a524e829853db27158fe02c5",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/sponsors",
      "label": "sponsors",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/sponsors",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "maintenance-funding"
      ],
      "purpose": "Collects public GitHub Sponsors information.",
      "inputs": [
        {
          "description": "Public sponsorship records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Sponsor and sponsorship records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/sponsors",
        "commit": "9e378d0fae4b009900d26d5086f163eedf7e3dc4",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "sponsors.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/sponsors",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "funding": "indexes sponsorships as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/sponsors:data",
          "maintained_by": "ecosyste-ms/sponsors",
          "kind": "index",
          "label": "sponsors data",
          "purpose": "Collects public GitHub Sponsors information.",
          "contents": [
            {
              "description": "Sponsor and sponsorship records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/sponsors",
            "commit": "9e378d0fae4b009900d26d5086f163eedf7e3dc4",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/dependabot",
      "label": "dependabot",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/dependabot",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "dependencies",
        "maintenance-funding",
        "security"
      ],
      "purpose": "Indexes dependency update pull requests and their advisory context.",
      "inputs": [
        {
          "description": "Dependabot pull requests and published advisories",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency-update activity and remediation records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/dependabot",
        "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "dependabot.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/dependabot",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "issue": "indexes update pull requests as",
        "dependency": "tracks updates to",
        "advisory": "links remediation to",
        "change": "indexes dependency updates as",
        "remediation": "indexes dependency update activity for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/dependabot:data",
          "maintained_by": "ecosyste-ms/dependabot",
          "kind": "index",
          "label": "dependabot data",
          "purpose": "Indexes dependency update pull requests and their advisory context.",
          "contents": [
            {
              "description": "Dependency-update activity and remediation records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "dependencies",
            "maintenance-funding",
            "security"
          ],
          "source": {
            "repository": "ecosyste-ms/dependabot",
            "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/nexus",
      "label": "nexus",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/nexus",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Maintains Maven package and release discovery records from repository indexes.",
      "inputs": [
        {
          "description": "Maven repository indexes",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Maven package and release discovery records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/nexus",
        "commit": "d4b79a80fcfdf1ed5baab758c5efa49b4b89d982",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "nexus.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/nexus",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "registry": "indexes Maven repositories as",
        "package": "indexes",
        "version": "indexes",
        "artifact": "indexes Maven artifacts as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/nexus:data",
          "maintained_by": "ecosyste-ms/nexus",
          "kind": "index",
          "label": "nexus data",
          "purpose": "Maintains Maven package and release discovery records from repository indexes.",
          "contents": [
            {
              "description": "Maven package and release discovery records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "package-information"
          ],
          "source": {
            "repository": "ecosyste-ms/nexus",
            "commit": "d4b79a80fcfdf1ed5baab758c5efa49b4b89d982",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/critical",
      "label": "critical",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/critical",
      "scope": "main",
      "roles": [
        "dataset"
      ],
      "areas": [
        "package-information",
        "maintenance-funding"
      ],
      "purpose": "Publishes a downloadable snapshot of critical packages and their metadata.",
      "inputs": [
        {
          "description": "Indexed package and repository contents",
          "nature": "intrinsic"
        },
        {
          "description": "Package usage, maintenance and registry records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Snapshot of content-derived package metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Critical-package selection and enriched package snapshot",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/critical",
        "commit": "bb0fc1d6abd8361533109c132b75c53a1df9ee2e",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "collection": "publishes a critical-package snapshot as",
        "package": "catalogues",
        "classification": "records critical-package selections as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/critical:data",
          "maintained_by": "ecosyste-ms/critical",
          "kind": "dataset",
          "label": "critical data",
          "purpose": "Publishes a downloadable snapshot of critical packages and their metadata.",
          "contents": [
            {
              "description": "Snapshot of content-derived package metadata",
              "nature": "intrinsic"
            },
            {
              "description": "Critical-package selection and enriched package snapshot",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "package-information",
            "maintenance-funding"
          ],
          "source": {
            "repository": "ecosyste-ms/critical",
            "commit": "bb0fc1d6abd8361533109c132b75c53a1df9ee2e",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/docker",
      "label": "docker",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/docker",
      "scope": "main",
      "roles": [
        "index",
        "service"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Collects dependency information about container images.",
      "inputs": [
        {
          "description": "Container image contents",
          "nature": "intrinsic"
        },
        {
          "description": "Image registry records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Image dependency inventories",
          "nature": "intrinsic"
        },
        {
          "description": "Indexed image identities and registry context",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/docker",
        "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "docker.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/docker",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "artifact": "inspects container images as",
        "sbom": "collects",
        "dependency": "indexes image dependencies as",
        "dependent-package": "indexes image package use as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/docker:data",
          "maintained_by": "ecosyste-ms/docker",
          "kind": "index",
          "label": "docker data",
          "purpose": "Collects dependency information about container images.",
          "contents": [
            {
              "description": "Image dependency inventories",
              "nature": "intrinsic"
            },
            {
              "description": "Indexed image identities and registry context",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "dependencies"
          ],
          "source": {
            "repository": "ecosyste-ms/docker",
            "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/parser",
      "label": "parser",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/parser",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Extracts dependency information from manifests and lockfiles.",
      "inputs": [
        {
          "description": "Manifest and lockfile contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency names, requirements, scopes and file locations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/parser",
        "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "parser.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/parser",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "manifest": "parses",
        "dependency": "extracts",
        "artifact": "extracts manifests from",
        "files": "reads uploaded and downloaded",
        "package": "extracts declared dependency identities as",
        "version-range": "extracts dependency requirements as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added archive/file inputs, dependency identities and version requirements. Does not compute a resolved dependency graph.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/parser",
            "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
            "path": "config/routes.rb"
          },
          {
            "repository": "ecosyste-ms/parser",
            "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
            "path": "app/controllers/api/v1/jobs_controller.rb"
          },
          {
            "repository": "ecosyste-ms/parser",
            "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
            "path": "app/models/job.rb"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "ecosyste-ms/bibliothecary",
      "label": "bibliothecary",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/bibliothecary",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Recognises and parses dependency manifests and lockfiles across package ecosystems.",
      "inputs": [
        {
          "description": "Manifest and lockfile contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Structured dependency records",
          "nature": "intrinsic"
        }
      ],
      "fork": true,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/bibliothecary",
        "commit": "2e4fa0c4304b8bab6fc5eb80d69727c808d7a2a1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "manifest": "recognises and parses",
        "dependency": "extracts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/archives",
      "label": "archives",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/archives",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "archives-artifacts"
      ],
      "purpose": "Provides access to files and documentation inside package archives.",
      "inputs": [
        {
          "description": "Package archive bytes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "File listings, file contents, READMEs and changelogs",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/archives",
        "commit": "63d7a7887ab4d854f0ec3d7c8fae73fcd25fce86",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "archives.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/archives",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "artifact": "inspects",
        "files": "lists and retrieves",
        "changelog": "retrieves documents containing"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/licenses",
      "label": "licenses",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/licenses",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "licenses"
      ],
      "purpose": "Detects license information in package and repository contents.",
      "inputs": [
        {
          "description": "License text and archive contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Detected licenses and matching files",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/licenses",
        "commit": "c7453c1f723e3ef92025485760dc2e23c798fc28",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "licenses.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/licenses",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "license": "detects",
        "files": "examines"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/digest",
      "label": "digest",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/digest",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "archives-artifacts",
        "security"
      ],
      "purpose": "Calculates content digests for downloaded package files.",
      "inputs": [
        {
          "description": "Package file bytes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Digests, integrity strings and file sizes",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/digest",
        "commit": "ed17117ad9cab6fa1be7104a01340664bece4dea",
        "path": "readme.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "digest.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://ecosyste.ms/",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "artifact": "hashes",
        "digest": "computes"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/diff",
      "label": "diff",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/diff",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "archives-artifacts"
      ],
      "purpose": "Compares the contents of package releases.",
      "inputs": [
        {
          "description": "Two package release archives",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Changed files and release-content differences",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/diff",
        "commit": "4c6a7adac9d7e5305dc2d4fff9370bedd540d0f1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "diff.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/diff",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "artifact": "compares",
        "change": "produces content comparisons as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/resolve",
      "label": "resolve",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/resolve",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Resolves package dependencies into dependency trees.",
      "inputs": [
        {
          "description": "Declared dependency requirements",
          "nature": "intrinsic"
        },
        {
          "description": "Available package releases and metadata",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Resolved dependency relationships",
          "nature": "intrinsic"
        },
        {
          "description": "Selected published package versions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/resolve",
        "commit": "2770b8e637bdd3bfdddcf27df6b75f22ad6b9b44",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "resolve.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/resolve",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "dependency": "resolves",
        "dependency-graph": "produces",
        "version": "selects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/resolve-cli",
      "label": "resolve-cli",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/resolve-cli",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Resolves package dependency trees using package-manager behaviour.",
      "inputs": [
        {
          "description": "Dependency requirements",
          "nature": "intrinsic"
        },
        {
          "description": "Registry package and release records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Resolved dependency relationships",
          "nature": "intrinsic"
        },
        {
          "description": "Selected published package versions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/resolve-cli",
        "commit": "3d0e15375d5583a2c7f628d29c2e37b233d0eaf2",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency": "resolves",
        "dependency-graph": "produces",
        "version": "selects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/sbom",
      "label": "sbom",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/sbom",
      "scope": "main",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Reads and converts software bills of materials.",
      "inputs": [
        {
          "description": "Software inventory documents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Parsed component records and converted inventory documents",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/sbom",
        "commit": "a0d8d2a8bb0186c3f5a9dfe967c2deaaad2570e3",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "An SBOM may carry external enrichment. Classification follows the fields retained, rather than the document format."
      ],
      "domains": [
        "sbom.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/sbom",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "sbom": "reads and converts",
        "package": "extracts component records for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/dashboards",
      "label": "dashboards",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/dashboards",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "maintenance-funding",
        "software-discovery"
      ],
      "purpose": "Combines project data into browsable collections and project views.",
      "inputs": [
        {
          "description": "Indexed package and repository contents",
          "nature": "intrinsic"
        },
        {
          "description": "Activity, advisory and funding records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency and project-content summaries",
          "nature": "intrinsic"
        },
        {
          "description": "Collection, maintenance and funding views",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/dashboards",
        "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Lower priority for this map, per the user; keep outside the default view."
      ],
      "domains": [
        "dashboards.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://ecosyste.ms/",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "presents",
        "activity": "summarises",
        "funding": "presents project context for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/funds",
      "label": "funds",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/funds",
      "scope": "main",
      "roles": [
        "application"
      ],
      "areas": [
        "maintenance-funding"
      ],
      "purpose": "Supports funding open source projects and allocating funds.",
      "inputs": [
        {
          "description": "Project, collective and funding information",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Funding allocations and project funding records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/funds",
        "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "funds.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/funds",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "funding": "records allocations as",
        "repository": "links funded projects to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/radar",
      "label": "radar",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/radar",
      "scope": "main",
      "roles": [
        "application"
      ],
      "areas": [
        "dependencies",
        "maintenance-funding"
      ],
      "purpose": "Shows the projects that depend on a package.",
      "inputs": [
        {
          "description": "Indexed dependent packages and repositories",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Downstream usage views",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/radar",
        "commit": "a19908a14f1f63d54f66a680822a35ce5168872c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependent-repository": "displays",
        "package": "looks up downstream use of",
        "dependent-package": "displays"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/summary",
      "label": "summary",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/summary",
      "scope": "supporting",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "maintenance-funding",
        "software-discovery"
      ],
      "purpose": "Produces combined overviews for collections of projects.",
      "inputs": [
        {
          "description": "Indexed repository contents",
          "nature": "intrinsic"
        },
        {
          "description": "Project metadata and activity",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Combined content-derived summaries",
          "nature": "intrinsic"
        },
        {
          "description": "Combined project and activity summaries",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/summary",
        "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Lower priority for this map, per the user; keep outside the default view."
      ],
      "domains": [
        "summary.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/summary",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "summarises",
        "activity": "aggregates",
        "dependency": "summarises"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/ost",
      "label": "ost",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ost",
      "scope": "main",
      "roles": [
        "index",
        "application"
      ],
      "areas": [
        "software-discovery",
        "research-software"
      ],
      "purpose": "Catalogues software connected to environmental sustainability.",
      "inputs": [
        {
          "description": "Open Sustainable Technology curation and project metadata",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Curated sustainability software catalogue",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ost",
        "commit": "98b61c17b8ab5c7adf6789024b7f35e51e85d182",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "ost.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/ost",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "collection": "maintains sustainability catalogues as",
        "classification": "records sustainability topics as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/ost:data",
          "maintained_by": "ecosyste-ms/ost",
          "kind": "index",
          "label": "ost data",
          "purpose": "Catalogues software connected to environmental sustainability.",
          "contents": [
            {
              "description": "Curated sustainability software catalogue",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "software-discovery",
            "research-software"
          ],
          "source": {
            "repository": "ecosyste-ms/ost",
            "commit": "98b61c17b8ab5c7adf6789024b7f35e51e85d182",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/ruby",
      "label": "ruby",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ruby",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "software-discovery",
        "maintenance-funding"
      ],
      "purpose": "Presents an overview of the Ruby software ecosystem.",
      "inputs": [
        {
          "description": "Indexed package dependencies",
          "nature": "intrinsic"
        },
        {
          "description": "Ruby package and project metadata",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency summaries",
          "nature": "intrinsic"
        },
        {
          "description": "Ruby ecosystem summaries",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ruby",
        "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Domain-specific view; supporting detail rather than an overview anchor."
      ],
      "domains": [
        "ruby.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/ruby",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "package": "presents Ruby ecosystem records for",
        "dependency": "summarises",
        "activity": "summarises"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/oss-taxonomy",
      "label": "oss-taxonomy",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/oss-taxonomy",
      "scope": "main",
      "roles": [
        "dataset"
      ],
      "areas": [
        "software-discovery"
      ],
      "purpose": "Provides a shared vocabulary for describing software purposes and roles.",
      "inputs": [
        {
          "description": "Curated software classification terms",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Software taxonomy terms and facets",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/oss-taxonomy",
        "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "taxonomy.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/oss-taxonomy",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "classification": "defines vocabulary for"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Retained classification coverage. CodeMeta examples explain vocabulary use; they do not constitute a metadata parser.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "ecosyste-ms/oss-taxonomy",
            "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
            "path": "README.md"
          },
          {
            "repository": "ecosyste-ms/oss-taxonomy",
            "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
            "path": "schema.json"
          },
          {
            "repository": "ecosyste-ms/oss-taxonomy",
            "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
            "path": "scripts/collect_external_source.rb"
          }
        ]
      },
      "data_products": [
        {
          "id": "ecosyste-ms/oss-taxonomy:data",
          "maintained_by": "ecosyste-ms/oss-taxonomy",
          "kind": "dataset",
          "label": "oss-taxonomy data",
          "purpose": "Provides a shared vocabulary for describing software purposes and roles.",
          "contents": [
            {
              "description": "Software taxonomy terms and facets",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "software-discovery"
          ],
          "source": {
            "repository": "ecosyste-ms/oss-taxonomy",
            "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/conda-api",
      "label": "conda-api",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/conda-api",
      "scope": "supporting",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Makes Conda package and version discovery available to Packages.",
      "inputs": [
        {
          "description": "Conda channel records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Conda package and version listings",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/conda-api",
        "commit": "4ac5da5d6441b6dd6369e12466690ebc575ea357",
        "path": "Readme.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "conda.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/conda-api",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "registry": "adapts Conda discovery from",
        "package": "lists",
        "version": "lists"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/npm-update-stream",
      "label": "npm-update-stream",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/npm-update-stream",
      "scope": "supporting",
      "roles": [
        "tool",
        "service"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Supplies recently changed npm package names for collection.",
      "inputs": [
        {
          "description": "npm registry changes",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package update feed",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/npm-update-stream",
        "commit": "f5d42f56920a3c6ad84d4c38c247d4603d9f21dd",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "streams changed identities of",
        "activity": "supplies publication updates as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/live",
      "label": "live",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/live",
      "scope": "main",
      "roles": [
        "service"
      ],
      "areas": [
        "package-information",
        "access-publishing"
      ],
      "purpose": "Publishes a live feed of newly observed packages and versions.",
      "inputs": [
        {
          "description": "Package and version events from collecting services",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Live package and release events",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/live",
        "commit": "c8e879658b133aab7169d75a6965c7490975ba64",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "domains": [
        "live.ecosyste.ms"
      ],
      "domains_source": {
        "url": "https://github.com/ecosyste-ms/live",
        "basis": "Published service directory or repository homepage metadata",
        "checked_at": "2026-10-14"
      },
      "connection_review": null,
      "coverage": {
        "package": "streams newly observed",
        "version": "streams newly observed"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/export",
      "label": "export",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/export",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Publishes bulk exports of collected data.",
      "inputs": [
        {
          "description": "Content-derived database records",
          "nature": "intrinsic"
        },
        {
          "description": "Externally collected database records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Bulk exports of intrinsic records",
          "nature": "intrinsic"
        },
        {
          "description": "Bulk exports of extrinsic records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/export",
        "commit": "a7436dc9a0ed994e6fb9015cbc62383626151de8",
        "path": "readme.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "exports indexed records for",
        "repository": "exports indexed records for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/ecosystems-go",
      "label": "ecosystems-go",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ecosystems-go",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Provides programmatic access to ecosyste.ms indexes and tools.",
      "inputs": [
        {
          "description": "Intrinsic records from ecosyste.ms",
          "nature": "intrinsic"
        },
        {
          "description": "Extrinsic records from ecosyste.ms",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved intrinsic records",
          "nature": "intrinsic"
        },
        {
          "description": "Retrieved extrinsic records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ecosystems-go",
        "commit": "038a83102b03aa8f3244eba9f23d8482e7df8043",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "queries indexed records for",
        "repository": "queries indexed records for",
        "advisory": "queries"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/ecosyste_ms_cli",
      "label": "ecosyste_ms_cli",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ecosyste_ms_cli",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Makes ecosyste.ms data available through command-line queries.",
      "inputs": [
        {
          "description": "Intrinsic records from ecosyste.ms",
          "nature": "intrinsic"
        },
        {
          "description": "Extrinsic records from ecosyste.ms",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Queried intrinsic records",
          "nature": "intrinsic"
        },
        {
          "description": "Queried extrinsic records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ecosyste_ms_cli",
        "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
        "path": "Readme.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "queries",
        "repository": "queries"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/mcp",
      "label": "mcp",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/mcp",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "access-publishing",
        "package-information"
      ],
      "purpose": "Lets assistant clients query a local critical-package snapshot and live package data.",
      "inputs": [
        {
          "description": "Content-derived package metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Critical-package snapshot and package context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved intrinsic package metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Package lookup results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/mcp",
        "commit": "826874adc73b4867ac56e9ed2aa28208111ed775",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "queries critical-package and live records for",
        "collection": "queries a critical-package snapshot as"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/mcp-server",
      "label": "mcp-server",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/mcp-server",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "access-publishing",
        "package-information"
      ],
      "purpose": "Exposes package ecosystem data to assistant clients.",
      "inputs": [
        {
          "description": "Indexed dependency and license records",
          "nature": "intrinsic"
        },
        {
          "description": "Package, release and usage records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency and license lookup results",
          "nature": "intrinsic"
        },
        {
          "description": "Package and ecosystem lookup results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/mcp-server",
        "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Keep separate from ecosyste-ms/mcp until their intended long-term roles are confirmed."
      ],
      "connection_review": null,
      "coverage": {
        "package": "queries",
        "dependency": "queries",
        "license": "queries"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/skills",
      "label": "skills",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/skills",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Provides reusable instructions for querying ecosyste.ms data.",
      "inputs": [
        {
          "description": "Content-derived index records",
          "nature": "intrinsic"
        },
        {
          "description": "Package and project context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved intrinsic information",
          "nature": "intrinsic"
        },
        {
          "description": "Retrieved extrinsic information",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/skills",
        "commit": "ad1ab09a19ea99e01a871db81b72282654655993",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "provides query workflows for",
        "repository": "provides query workflows for"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "ecosyste-ms/threat_models",
      "label": "threat_models",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/threat_models",
      "scope": "supporting",
      "roles": [
        "dataset",
        "tool"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Collects and analyses threat-model documents found in repositories.",
      "inputs": [
        {
          "description": "Repository threat-model documents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Document corpus and observations about threat-model contents",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/threat_models",
        "commit": "e7a2e436c89ffb68339a73b97c0b85deff58af5f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "threat-model": "collects and analyses documents describing"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/threat_models:data",
          "maintained_by": "ecosyste-ms/threat_models",
          "kind": "dataset",
          "label": "threat_models data",
          "purpose": "Collects and analyses threat-model documents found in repositories.",
          "contents": [
            {
              "description": "Document corpus and observations about threat-model contents",
              "nature": "intrinsic"
            }
          ],
          "areas": [
            "security"
          ],
          "source": {
            "repository": "ecosyste-ms/threat_models",
            "commit": "e7a2e436c89ffb68339a73b97c0b85deff58af5f",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "ecosyste-ms/typosquatting-dataset",
      "label": "typosquatting-dataset",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/typosquatting-dataset",
      "scope": "supporting",
      "roles": [
        "dataset"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Collects published examples of package typosquatting.",
      "inputs": [
        {
          "description": "Public security research",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Mappings between malicious package names and their targets",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/typosquatting-dataset",
        "commit": "fd0bde98d200efe5c282a07edc4c68fba13252c6",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "records impersonation targets for",
        "finding": "collects reported typosquatting examples as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ecosyste-ms/typosquatting-dataset:data",
          "maintained_by": "ecosyste-ms/typosquatting-dataset",
          "kind": "dataset",
          "label": "typosquatting-dataset data",
          "purpose": "Collects published examples of package typosquatting.",
          "contents": [
            {
              "description": "Mappings between malicious package names and their targets",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security",
            "package-information"
          ],
          "source": {
            "repository": "ecosyste-ms/typosquatting-dataset",
            "commit": "fd0bde98d200efe5c282a07edc4c68fba13252c6",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/git-pkgs",
      "label": "git-pkgs",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/git-pkgs",
      "scope": "main",
      "roles": [
        "application"
      ],
      "areas": [
        "dependencies",
        "security",
        "maintenance-funding"
      ],
      "purpose": "Tracks dependency changes through repository history and adds package context.",
      "inputs": [
        {
          "description": "Repository history, manifests and lockfiles",
          "nature": "intrinsic"
        },
        {
          "description": "Registry metadata and advisories",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Local dependency-history index, differences and SBOMs",
          "nature": "intrinsic"
        },
        {
          "description": "Vulnerability, freshness, funding and maintainer reports",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/git-pkgs",
        "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency": "tracks history of",
        "change": "reports dependency changes as",
        "sbom": "generates",
        "advisory": "retrieves",
        "maintainer": "reports package context for",
        "funding": "reports package context for",
        "repository": "analyses dependency history in",
        "revision": "indexes dependency snapshots at",
        "manifest": "parses and tracks",
        "package": "identifies and enriches dependencies as",
        "version": "compares installed and published",
        "version-range": "records declared dependency constraints as",
        "registry": "queries package and release metadata from",
        "license": "reports declarations and policy compatibility for",
        "digest": "verifies downloaded artifacts against",
        "attestation": "reports registry provenance metadata as",
        "changelog": "retrieves and filters version entries from",
        "files": "browses downloaded package source",
        "artifact": "downloads and inspects"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added repository history, manifests, package/version metadata, license, integrity, provenance and source/changelog browsing. The tree command groups records by manifest/type; it does not establish a resolved dependency graph.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "README.md"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "cmd/root.go"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "cmd/tree.go"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "cmd/provenance.go"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "cmd/integrity.go"
          },
          {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "internal/database/schema.go"
          }
        ]
      },
      "data_products": [
        {
          "id": "git-pkgs/git-pkgs:data",
          "maintained_by": "git-pkgs/git-pkgs",
          "kind": "index",
          "label": "Local dependency history",
          "purpose": "Tracks dependency changes through repository history and adds package context.",
          "contents": [
            {
              "description": "Dependency occurrences and changes indexed against commits and file paths",
              "nature": "intrinsic"
            }
          ],
          "areas": [
            "dependencies",
            "security",
            "maintenance-funding"
          ],
          "source": {
            "repository": "git-pkgs/git-pkgs",
            "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/manifests",
      "label": "manifests",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/manifests",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Extracts dependencies and package declarations from manifests and lockfiles.",
      "inputs": [
        {
          "description": "Manifest and lockfile contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package declarations, dependency requirements and integrity metadata",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/manifests",
        "commit": "99bbda20167c3d2ab3146f94fdf19aed38ce36d2",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "manifest": "parses",
        "dependency": "extracts",
        "package": "extracts declarations of",
        "digest": "extracts declared integrity values as",
        "subproject": "extracts workspace package declarations for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/registries",
      "label": "registries",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/registries",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Retrieves package information from registry sources.",
      "inputs": [
        {
          "description": "Package registry records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package, version and download information",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/registries",
        "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "registry": "queries",
        "package": "retrieves",
        "version": "retrieves"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/enrichment",
      "label": "enrichment",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/enrichment",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "package-information",
        "maintenance-funding"
      ],
      "purpose": "Combines package information from several sources using package identities.",
      "inputs": [
        {
          "description": "Content-derived metadata in source indexes",
          "nature": "intrinsic"
        },
        {
          "description": "Registry and ecosyste.ms package records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved dependency and declared-license information",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched package, maintainer, funding and release records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/enrichment",
        "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "enriches",
        "maintainer": "retrieves package roles for",
        "funding": "retrieves",
        "license": "retrieves declarations of"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/vers",
      "label": "vers",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/vers",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies",
        "security"
      ],
      "purpose": "Interprets and compares version ranges across package ecosystems.",
      "inputs": [
        {
          "description": "Version requirements in project metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Published release and advisory ranges",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Comparisons of declared constraints",
          "nature": "intrinsic"
        },
        {
          "description": "Release and advisory range matches",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/vers",
        "commit": "a2aa5bb667275e9a4ecf7a1eeb07760494558004",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "version-range": "interprets and compares"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/purl",
      "label": "purl",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/purl",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Identifies packages consistently across package ecosystems.",
      "inputs": [
        {
          "description": "Package coordinates declared in source",
          "nature": "intrinsic"
        },
        {
          "description": "Registry package identities",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Normalised declared package identities",
          "nature": "intrinsic"
        },
        {
          "description": "Normalised registry identities and package links",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/purl",
        "commit": "0cfbf6f91087fc7899b1c8e7e952bfc8c172c9e9",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "normalises identifiers for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/managers",
      "label": "managers",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/managers",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies",
        "testing-compatibility"
      ],
      "purpose": "Provides common package-management operations across ecosystems.",
      "inputs": [
        {
          "description": "Project configuration and dependency declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Package-manager capabilities",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Updated project dependency declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Package-management operation results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/managers",
        "commit": "c16c0e502615df3d69a6e0b005868232d5fdb978",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "manifest": "updates",
        "dependency": "changes through package-manager operations"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/resolve",
      "label": "resolve",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/resolve",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Turns package-manager resolution results into dependency graphs.",
      "inputs": [
        {
          "description": "Package-manager dependency-tree output",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Structured dependency trees and package identities",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/resolve",
        "commit": "59be154c0eb8846d0b77a6e6d9af24a444ad3d00",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency-graph": "normalises package-manager results into",
        "package": "identifies graph components as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/pom",
      "label": "pom",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/pom",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Resolves Maven dependency declarations and inherited configuration.",
      "inputs": [
        {
          "description": "Project POM declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Published parent POMs and dependency-management records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Resolved project dependency declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Resolved inherited package constraints",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/pom",
        "commit": "3bac91f5192593942d62e2ac8196ade9d06b1b5f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "manifest": "parses Maven configuration as",
        "dependency": "resolves inherited declarations of",
        "version-range": "resolves inherited constraints as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/provides",
      "label": "provides",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/provides",
      "scope": "main",
      "roles": [
        "library"
      ],
      "areas": [
        "dependencies",
        "testing-compatibility"
      ],
      "purpose": "Connects package identities to the names imported by source code.",
      "inputs": [
        {
          "description": "Package contents, source imports and project declarations",
          "nature": "intrinsic"
        },
        {
          "description": "Package identity context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package-to-import mappings and project bindings",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/provides",
        "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "structure": "maps import names in",
        "package": "binds imports to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/sbom",
      "label": "sbom",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/sbom",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Reads and writes software inventory documents.",
      "inputs": [
        {
          "description": "Software inventory documents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Component records, relationships and converted SBOMs",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/sbom",
        "commit": "f23464671ebf1fb8e92ab70d61059e44f6ed6659",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "An SBOM may carry external enrichment. Classification follows the fields retained, rather than the document format."
      ],
      "connection_review": null,
      "coverage": {
        "sbom": "reads and writes",
        "dependency-graph": "reads recorded relationships for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/archives",
      "label": "archives",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/archives",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "archives-artifacts"
      ],
      "purpose": "Reads files and directories inside package archives.",
      "inputs": [
        {
          "description": "Archive bytes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Archive entries and file contents",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/archives",
        "commit": "acad49ddba4999e66c36643960cf3f06daeee197",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "extracts",
        "files": "reads"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/licenses",
      "label": "licenses",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/licenses",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "licenses"
      ],
      "purpose": "Detects licenses in text and repository contents.",
      "inputs": [
        {
          "description": "License text and repository files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "License matches and repository license reports",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/licenses",
        "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "license": "detects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/spdx",
      "label": "spdx",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/spdx",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "licenses"
      ],
      "purpose": "Interprets and normalises license expressions.",
      "inputs": [
        {
          "description": "License expressions in project files",
          "nature": "intrinsic"
        },
        {
          "description": "License expressions in registry records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Normalised project license expressions",
          "nature": "intrinsic"
        },
        {
          "description": "Normalised registry license expressions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/spdx",
        "commit": "9660a1d8e4a46de2479c3d4219904d625c15b3ca",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "license": "normalises expressions for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/reuse",
      "label": "reuse",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/reuse",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "licenses"
      ],
      "purpose": "Extracts declared license and copyright information from files and annotations.",
      "inputs": [
        {
          "description": "Source headers and license annotations",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Per-file license and copyright declarations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/reuse",
        "commit": "d9216df5ba8c6dbc319d875a4e81954c56356ec2",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "license": "extracts per-file declarations of",
        "files": "reads annotations in"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/git-spdx",
      "label": "git-spdx",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/git-spdx",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "licenses",
        "repository-evidence"
      ],
      "purpose": "Traces license evidence and changes through repository history.",
      "inputs": [
        {
          "description": "Git history and license-bearing files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "License-change histories with file and commit evidence",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/git-spdx",
        "commit": "522d4603703cfa625914f222830fc6b7ba78e744",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "license": "traces evidence for",
        "change": "reports license changes as",
        "revision": "examines"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/changelog",
      "label": "changelog",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/changelog",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Turns changelog text into structured release entries.",
      "inputs": [
        {
          "description": "Changelog contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Release entries and documented changes",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/changelog",
        "commit": "e594ba2fdf4df8d065f51a2aaa77141d64607fc2",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "changelog": "parses"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/history",
      "label": "history",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/history",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Reads commits, file changes and contents across repository history.",
      "inputs": [
        {
          "description": "Git objects and history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Commit, tree, file and change records",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/history",
        "commit": "cb72b31b48e428604d44dbad300014209f7dc48c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "revision": "reads",
        "files": "reads historical contents of",
        "change": "extracts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/forge",
      "label": "forge",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/forge",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Retrieves and manages repository information across source hosts.",
      "inputs": [
        {
          "description": "Forge repository, issue and release records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Repository and collaboration records and operation results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/forge",
        "commit": "70caf18ac5059dbb877d26f2b191d24d4805723a",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "forge": "queries",
        "repository": "retrieves metadata for",
        "issue": "retrieves and manages",
        "revision": "retrieves commits and resolves references to",
        "files": "reads and updates repository",
        "test-result": "retrieves CI runs and commit statuses as",
        "maintainer": "retrieves repository collaborator roles as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added commit/reference resolution, repository files, CI results and collaborator roles.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "git-pkgs/forge",
            "commit": "70caf18ac5059dbb877d26f2b191d24d4805723a",
            "path": "README.md"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "git-pkgs/brief",
      "label": "brief",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/brief",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "repository-evidence",
        "software-discovery",
        "research-software"
      ],
      "purpose": "Describes a repository's contents, toolchain, dependencies and embedded metadata.",
      "inputs": [
        {
          "description": "Repository files and configuration",
          "nature": "intrinsic"
        },
        {
          "description": "Optional enrichment sources",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Repository descriptions, dependency records and extracted citations",
          "nature": "intrinsic"
        },
        {
          "description": "Optional enriched project context",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/brief",
        "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "tasks": [
        "Describe repository contents and toolchains",
        "Extract dependencies and embedded metadata",
        "Derive threat categories from tool definitions",
        "Publish reusable tool-detection knowledge"
      ],
      "connection_review": null,
      "coverage": {
        "dependency": "extracts",
        "metadata": "extracts",
        "citation": "extracts",
        "language": "reports",
        "file-role": "reports",
        "classification": "describes repository purpose using",
        "manifest": "detects and parses",
        "files": "inventories project resources and changed",
        "license": "detects and reports declared",
        "changelog": "locates project documents containing",
        "threat-model": "derives stack-specific categories for",
        "weakness": "maps toolchain threats and known sinks to",
        "structure": "produces source outlines of",
        "change": "scopes toolchain reports to",
        "package": "retrieves published project",
        "dependent-package": "retrieves counts of",
        "security-posture": "retrieves Scorecard assessments of",
        "artifact": "inspects native objects inside",
        "file-format": "identifies binary and archive"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added threat categories, source outlines, artifact inspection, resource discovery, changes and external project enrichment. Known sinks are reference data, not detected vulnerabilities.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "README.md"
          },
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "cmd/brief/main.go"
          },
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "cmd/brief/threat.go"
          },
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "cmd/brief/enrich.go"
          },
          {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "cmd/brief/diff.go"
          }
        ]
      },
      "data_products": [
        {
          "id": "git-pkgs/brief:knowledge",
          "maintained_by": "git-pkgs/brief",
          "kind": "dataset",
          "label": "Toolchain knowledge",
          "purpose": "Reusable tool definitions, detection rules, taxonomy tags and security mappings.",
          "contents": [
            {
              "description": "Tool-detection rules, tool classifications and threat mappings",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence",
            "software-discovery",
            "research-software"
          ],
          "source": {
            "repository": "git-pkgs/brief",
            "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
            "path": "knowledge/",
            "basis": "repository_source"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/outline",
      "label": "outline",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/outline",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Extracts a compact structural view of source code.",
      "inputs": [
        {
          "description": "Source files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Signatures, types, imports and source structure",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/outline",
        "commit": "62172fe572b40569208b040ac3b671e602bee63e",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "structure": "extracts",
        "files": "selects and packs source",
        "language": "identifies supported source"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added source-file selection and language identification. Import/call graphs remain code structure, not package dependency resolution.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "git-pkgs/outline",
            "commit": "62172fe572b40569208b040ac3b671e602bee63e",
            "path": "README.md"
          },
          {
            "repository": "git-pkgs/outline",
            "commit": "62172fe572b40569208b040ac3b671e602bee63e",
            "path": "pack.go"
          },
          {
            "repository": "git-pkgs/outline",
            "commit": "62172fe572b40569208b040ac3b671e602bee63e",
            "path": "cmd/outline/main.go"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "git-pkgs/distill",
      "label": "distill",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/distill",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "software-discovery"
      ],
      "purpose": "Builds and applies software classifiers using repository evidence.",
      "inputs": [
        {
          "description": "Repository descriptions and source structure",
          "nature": "intrinsic"
        },
        {
          "description": "Taxonomy terms and curated labels",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Extracted repository features",
          "nature": "intrinsic"
        },
        {
          "description": "Training labels, classifier models and classification assignments",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/distill",
        "commit": "0bcc406baa1364a11d249514c27e3878e9db89d7",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Classification assignments are assessments; extracted repository features remain intrinsic evidence."
      ],
      "connection_review": null,
      "coverage": {
        "classification": "builds and applies classifiers for",
        "repository": "extracts classification features from"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/languages",
      "label": "languages",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/languages",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Identifies programming languages from filenames and contents.",
      "inputs": [
        {
          "description": "File paths and source bytes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Language candidates and supporting evidence",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/languages",
        "commit": "0ebb33cb7dfcb9cc04a2863ba9bee51d3b746891",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "language": "detects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/roles",
      "label": "roles",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/roles",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Describes the roles of paths within repositories.",
      "inputs": [
        {
          "description": "Repository paths",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Source, test, fixture, generated and vendored path classifications",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/roles",
        "commit": "ac5d16bb5da206004961e28288c3d831684d973c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "tasks": [
        "Classify repository paths",
        "Attach evidence for source, test, vendor and generated-file roles",
        "Publish reusable path-classification rules"
      ],
      "connection_review": null,
      "coverage": {
        "file-role": "classifies"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "git-pkgs/roles:corpus",
          "maintained_by": "git-pkgs/roles",
          "kind": "dataset",
          "label": "Repository path-role corpus",
          "purpose": "Reusable conventions and rules for classifying paths in a repository.",
          "contents": [
            {
              "description": "Path conventions and classification rules",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "repository-evidence"
          ],
          "source": {
            "repository": "git-pkgs/roles",
            "commit": "ac5d16bb5da206004961e28288c3d831684d973c",
            "path": "corpus/",
            "basis": "repository_source"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/magic",
      "label": "magic",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/magic",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "archives-artifacts",
        "repository-evidence"
      ],
      "purpose": "Identifies file formats and encodings from file contents.",
      "inputs": [
        {
          "description": "File bytes or prefixes",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Format and encoding observations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/magic",
        "commit": "f82631dea06e7f9d04093d0fd5d034814693c530",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "file-format": "detects"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/gitignore",
      "label": "gitignore",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/gitignore",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Selects repository paths according to ignore rules.",
      "inputs": [
        {
          "description": "Paths and ignore files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Included and excluded paths with matching rules",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/gitignore",
        "commit": "d9fa9f898b68c0f3df90a182f2448e0f30fe1325",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "files": "filters paths in"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/clone",
      "label": "clone",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/clone",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Maintains local copies of remote repositories for analysis.",
      "inputs": [
        {
          "description": "Repository contents and history",
          "nature": "intrinsic"
        },
        {
          "description": "Remote repository locations",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Local repository copies",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/clone",
        "commit": "b9842889da5a6bdaef5e18011908e7ec037c4917",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "repository": "maintains local copies of"
      },
      "concept_review": {
        "repositories": [
          "git-pkgs/clone",
          "git-pkgs/scan",
          "git-pkgs/markup"
        ],
        "reason": "These have clear operations on repository copies, pattern matches and documentation, but are supporting utilities. Concept coverage alone does not establish that each deserves a map node.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/markup",
      "label": "markup",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/markup",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "archives-artifacts",
        "repository-evidence",
        "access-publishing"
      ],
      "purpose": "Renders repository documentation for display.",
      "inputs": [
        {
          "description": "Repository documentation",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Rendered documentation",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/markup",
        "commit": "b7247b92bd83fcf2bcab2f5c424b5deb2c6572d1",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "files": "renders documentation from"
      },
      "concept_review": {
        "repositories": [
          "git-pkgs/clone",
          "git-pkgs/scan",
          "git-pkgs/markup"
        ],
        "reason": "These have clear operations on repository copies, pattern matches and documentation, but are supporting utilities. Concept coverage alone does not establish that each deserves a map node.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/vulns",
      "label": "vulns",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/vulns",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Retrieves vulnerability information for identified packages.",
      "inputs": [
        {
          "description": "Vulnerability databases and package identities",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Package vulnerability records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/vulns",
        "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "advisory": "retrieves",
        "package": "looks up vulnerability context for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/signals",
      "label": "signals",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/signals",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "security",
        "repository-evidence"
      ],
      "purpose": "Traces security-related evidence through repository history.",
      "inputs": [
        {
          "description": "Git history and security-relevant files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Security evidence and changes with file and commit locations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/signals",
        "commit": "addc7cb43363d030f7c55184c9fdd004ed7f22d8",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "finding": "extracts security signals as",
        "revision": "traces evidence through",
        "change": "reports security-related"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/secrets",
      "label": "secrets",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/secrets",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "security",
        "repository-evidence"
      ],
      "purpose": "Finds possible leaked credentials across repository history.",
      "inputs": [
        {
          "description": "Repository file contents and history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Potential credential findings with file and commit evidence",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/secrets",
        "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "finding": "reports possible credentials as",
        "revision": "traces evidence through"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/capcheck",
      "label": "capcheck",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/capcheck",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Detects changes in the privileged operations reachable by code and dependencies.",
      "inputs": [
        {
          "description": "Source code and dependency code",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Capability baselines and change reports",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/capcheck",
        "commit": "d25374be9b8bd409e8b254cf21916bd1e1fc8c22",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "capability": "detects and compares",
        "finding": "reports capability changes as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/sarif",
      "label": "sarif",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/sarif",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Reads, writes and validates structured analysis findings.",
      "inputs": [
        {
          "description": "Source-analysis findings",
          "nature": "intrinsic"
        },
        {
          "description": "Imported assessment reports",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Structured intrinsic findings",
          "nature": "intrinsic"
        },
        {
          "description": "Structured imported findings",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/sarif",
        "commit": "fe6de84035a6302d08e729cb746ca4a66dcb4506",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "finding": "reads writes and validates"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/cwe",
      "label": "cwe",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/cwe",
      "scope": "supporting",
      "roles": [
        "tool",
        "dataset"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Provides names and descriptions for weakness categories.",
      "inputs": [
        {
          "description": "Published weakness catalogue",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Weakness names, descriptions and categories",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/cwe",
        "commit": "bfed07a9be7e2ac7dbe9b390430373f5faa261df",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "weakness": "provides vocabulary for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "git-pkgs/cwe:data",
          "maintained_by": "git-pkgs/cwe",
          "kind": "dataset",
          "label": "cwe data",
          "purpose": "Provides names and descriptions for weakness categories.",
          "contents": [
            {
              "description": "Weakness names, descriptions and categories",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security"
          ],
          "source": {
            "repository": "git-pkgs/cwe",
            "commit": "bfed07a9be7e2ac7dbe9b390430373f5faa261df",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "git-pkgs/attestation",
      "label": "attestation",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/attestation",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "archives-artifacts"
      ],
      "purpose": "Extracts provenance claims from package attestations.",
      "inputs": [
        {
          "description": "Published attestation documents",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Builder, source and signer claims",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/attestation",
        "commit": "372f9e85d2e869c0c5cdc1b3fe735293c344c62b",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "attestation": "extracts provenance claims from",
        "revision": "extracts claimed source references to"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/sigstore",
      "label": "sigstore",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/sigstore",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "archives-artifacts"
      ],
      "purpose": "Checks package attestations against verification material.",
      "inputs": [
        {
          "description": "Package content digests",
          "nature": "intrinsic"
        },
        {
          "description": "Attestations and verification records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Attestation verification results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/sigstore",
        "commit": "3c434e7633283fa3cb3878fd6a3f21f8d79e951a",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "attestation": "verifies signatures and subjects of"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/integrity",
      "label": "integrity",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/integrity",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "archives-artifacts"
      ],
      "purpose": "Checks package bytes against declared integrity information.",
      "inputs": [
        {
          "description": "Package bytes",
          "nature": "intrinsic"
        },
        {
          "description": "Expected checksums from publishers or registries",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Calculated content digests",
          "nature": "intrinsic"
        },
        {
          "description": "Match results against expected checksums",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/integrity",
        "commit": "8d80cb83c37b9107cca9f3ced25b2e11a1066dd3",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "digest": "computes and checks",
        "artifact": "checks bytes of"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/artifacts",
      "label": "artifacts",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/artifacts",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "archives-artifacts",
        "package-information"
      ],
      "purpose": "Describes completed package files by identity, digest and size.",
      "inputs": [
        {
          "description": "File digest and byte count",
          "nature": "intrinsic"
        },
        {
          "description": "Package coordinates",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "File content descriptors",
          "nature": "intrinsic"
        },
        {
          "description": "Associations between files and published packages",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/artifacts",
        "commit": "fd25f2d9eed3c17d0f517fb69b5f762404ef7e64",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "describes",
        "digest": "records",
        "package": "associates artifact identities with"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/proxy",
      "label": "proxy",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/proxy",
      "scope": "main",
      "roles": [
        "application",
        "service"
      ],
      "areas": [
        "archives-artifacts",
        "security"
      ],
      "purpose": "Caches package downloads and applies release-age and scanning policies.",
      "inputs": [
        {
          "description": "Package files",
          "nature": "intrinsic"
        },
        {
          "description": "Registry metadata, publication times and scanner verdicts",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Cached package files",
          "nature": "intrinsic"
        },
        {
          "description": "Filtered release metadata and scan decisions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/proxy",
        "commit": "544e1a5bdde698e6da82d73b77f31eee114a371f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "caches and serves",
        "policy": "applies",
        "finding": "uses scan results recorded as",
        "registry": "proxies upstreams and hosts packages as a",
        "package": "caches and enriches records for",
        "version": "filters by release age and checks for newer",
        "license": "normalizes and displays declared",
        "advisory": "queries and caches reports recorded as",
        "digest": "checks artifact bytes against",
        "files": "browses contents extracted from cached artifacts as",
        "change": "compares cached versions to display",
        "sbom": "reads component inventories for mirroring from",
        "attestation": "serves attached statements through OCI referrers as",
        "repository": "records package source links to"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Registry routes, enrichment APIs, SBOM mirroring, archive browsing and comparison, OCI referrers, integrity checks and database table names were inspected at the recorded revision. Attestations are served as attached artifacts; this does not imply verification of their claims.",
        "freshness_note": "Remote freshness could not be checked because writing FETCH_HEAD was blocked.",
        "references": [
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "README.md"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/server/server.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/server/api.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/enrichment/enrichment.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/mirror/source.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/server/browse.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/handler/container.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/handler/integrity.go"
          },
          {
            "repository": "git-pkgs/proxy",
            "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
            "path": "internal/database/schema.go"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "git-pkgs/cooldown",
      "label": "cooldown",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/cooldown",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Filters releases according to their publication age.",
      "inputs": [
        {
          "description": "Release timestamps and age policies",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Eligible and withheld release lists",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/cooldown",
        "commit": "57cce9c6343064a45da140d64dcc568fc2119e89",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "policy": "applies release-age rules as",
        "version": "filters by publication age"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/pin",
      "label": "pin",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/pin",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "archives-artifacts",
        "dependencies"
      ],
      "purpose": "Vendors selected browser assets and records their identities and integrity.",
      "inputs": [
        {
          "description": "Published package file contents",
          "nature": "intrinsic"
        },
        {
          "description": "Registry package and release information",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Vendored assets and integrity hashes",
          "nature": "intrinsic"
        },
        {
          "description": "Package provenance and inventory records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/pin",
        "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "vendors browser assets as",
        "digest": "records integrity values as",
        "package": "records identities and provenance for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/nexus",
      "label": "nexus",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/nexus",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "package-information"
      ],
      "purpose": "Reads Maven repository indexes to discover published artifacts.",
      "inputs": [
        {
          "description": "Maven repository indexes",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Artifact additions, removals and index progress records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/nexus",
        "commit": "fe5a039118c51d74bd5c28080484b95ce3bf154c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "registry": "reads Maven indexes from",
        "artifact": "discovers"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/citation",
      "label": "citation",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/citation",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "research-software"
      ],
      "purpose": "Extracts citation metadata declared by software projects.",
      "inputs": [
        {
          "description": "CITATION.cff files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Declared citation and author records",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/citation",
        "commit": "3b2ac7bd4aea9b096b8e8e2fad427b87a5ef4f93",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "citation": "extracts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/bibtex",
      "label": "bibtex",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/bibtex",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "research-software"
      ],
      "purpose": "Extracts bibliographic entries from files and repository documentation.",
      "inputs": [
        {
          "description": "Bibliography files and embedded entries",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Declared bibliography entries and citation metadata",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/bibtex",
        "commit": "7c94fb7dc3e7e174218eb4a5a6b82dc9e62aaf81",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "citation": "extracts bibliography entries as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/codemeta",
      "label": "codemeta",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/codemeta",
      "scope": "main",
      "roles": [
        "tool"
      ],
      "areas": [
        "research-software"
      ],
      "purpose": "Extracts software metadata declared in CodeMeta files.",
      "inputs": [
        {
          "description": "codemeta.json files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Declared software metadata",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/codemeta",
        "commit": "b382c2db41c9041c247c5907e806274f7f069980",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "metadata": "extracts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/scan",
      "label": "scan",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/scan",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "repository-evidence"
      ],
      "purpose": "Matches many text patterns in files for analysis tools.",
      "inputs": [
        {
          "description": "File contents",
          "nature": "intrinsic"
        },
        {
          "description": "Supplied matching patterns",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Pattern matches and source locations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/scan",
        "commit": "20366450e1eef8694485702ab77f64c91a5ac5ce",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "Experimental pattern-matching tool."
      ],
      "connection_review": null,
      "coverage": {
        "finding": "supplies pattern matches for"
      },
      "concept_review": {
        "repositories": [
          "git-pkgs/clone",
          "git-pkgs/scan",
          "git-pkgs/markup"
        ],
        "reason": "These have clear operations on repository copies, pattern matches and documentation, but are supporting utilities. Concept coverage alone does not establish that each deserves a map node.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/actions",
      "label": "actions",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/actions",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "dependencies",
        "security"
      ],
      "purpose": "Runs dependency analysis in repository automation.",
      "inputs": [
        {
          "description": "Dependency changes",
          "nature": "intrinsic"
        },
        {
          "description": "Package and vulnerability context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency change reports",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched dependency checks",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/actions",
        "commit": "dc784fe1d639fd9b44f2ccdfad70976eac73c6ea",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency": "analyses",
        "change": "reports dependency changes as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/skills",
      "label": "skills",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/skills",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Provides reusable assistant workflows around repository and dependency tools.",
      "inputs": [
        {
          "description": "Repository contents",
          "nature": "intrinsic"
        },
        {
          "description": "Package and forge context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Repository analysis results",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched project analysis results",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/skills",
        "commit": "a0b0f35e120def17440dd594dd2e8ad880aff7cb",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependency": "provides analysis workflows for",
        "repository": "provides analysis workflows for"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "alpha-omega-security/scrutineer",
      "label": "scrutineer",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/scrutineer",
      "scope": "main",
      "roles": [
        "application",
        "index"
      ],
      "areas": [
        "security",
        "dependencies",
        "maintenance-funding"
      ],
      "purpose": "Investigates repositories and manages findings, verification and disclosure.",
      "inputs": [
        {
          "description": "Source code, dependencies and repository evidence",
          "nature": "intrinsic"
        },
        {
          "description": "Advisories, package context and maintainer activity",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Dependency records, generated SBOM components and source-derived threat-model evidence",
          "nature": "intrinsic"
        },
        {
          "description": "Source findings, reproductions and patch validation evidence",
          "nature": "intrinsic"
        },
        {
          "description": "Published package records, imported inventory context, advisories and dependent exposure assessments",
          "nature": "extrinsic"
        },
        {
          "description": "Security posture assessments, triage decisions, remediation tracking and disclosure records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/scrutineer",
        "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "SBOMs and threat models can combine source-derived observations with external claims. Maintainer information is shown as project disclosure context."
      ],
      "connection_review": null,
      "coverage": {
        "finding": "investigates and manages",
        "test-result": "records reproductions as",
        "change": "records patch evidence as",
        "repository": "investigates",
        "sbom": "generates imports and indexes",
        "package": "looks up publications and inventory components for",
        "version": "records published and inventoried",
        "dependency": "records declarations of",
        "manifest": "records dependency evidence from",
        "dependent-package": "records downstream package candidates as",
        "dependent-repository": "investigates downstream exposure in",
        "threat-model": "derives and stores",
        "advisory": "retrieves and investigates",
        "maintainer": "identifies project disclosure contacts in",
        "revision": "records scan and inventory snapshots at",
        "license": "records package declarations of",
        "language": "retrieves and analyses",
        "structure": "examines reachability through",
        "weakness": "classifies findings using",
        "exposure": "assesses and exports",
        "remediation": "proposes and validates",
        "disclosure": "coordinates and records",
        "security-posture": "assesses",
        "subproject": "discovers and scopes scans to"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Skills, worker dispatch and parsers, and the models migrated for SQLite were inspected at the recorded revision. Table vocabulary describes the schema, not database contents.",
        "references": [
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "internal/db/db.go"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "internal/worker/skill.go"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "internal/worker/skill_parsers.go"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "internal/web/sboms.go"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/sbom/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/packages/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/threat-model/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/reachability/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/exposure/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/maintainers/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/posture/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/compliance/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/subprojects/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/patch/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/disclose/SKILL.md"
          },
          {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "skills/release-watch/SKILL.md"
          }
        ],
        "freshness_note": "Remote freshness could not be checked during this inspection because checkout writes and network access were restricted."
      },
      "data_products": [
        {
          "id": "alpha-omega-security/scrutineer:data",
          "maintained_by": "alpha-omega-security/scrutineer",
          "kind": "index",
          "label": "Repository inventories and security investigations",
          "purpose": "Investigates repositories and manages findings, verification and disclosure.",
          "contents": [
            {
              "description": "Dependency records, generated SBOM components and source-derived threat-model evidence",
              "nature": "intrinsic"
            },
            {
              "description": "Source findings, reproductions and patch validation evidence",
              "nature": "intrinsic"
            },
            {
              "description": "Published package records, imported inventory context, advisories and dependent exposure assessments",
              "nature": "extrinsic"
            },
            {
              "description": "Security posture assessments, triage decisions, remediation tracking and disclosure records",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security",
            "dependencies",
            "maintenance-funding"
          ],
          "source": {
            "repository": "alpha-omega-security/scrutineer",
            "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "alpha-omega-security/harness",
      "label": "harness",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/harness",
      "scope": "supporting",
      "roles": [
        "tool"
      ],
      "areas": [
        "security",
        "testing-compatibility"
      ],
      "purpose": "Runs coding-agent tasks and collects their execution results.",
      "inputs": [
        {
          "description": "Source material supplied to analysis tasks",
          "nature": "intrinsic"
        },
        {
          "description": "Task instructions and external context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Source-derived task results",
          "nature": "intrinsic"
        },
        {
          "description": "Task outcomes and execution records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/harness",
        "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "test-result": "records coding-agent task outcomes as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Retained task-result coverage. Generic coding-agent event/usage output does not imply that Harness itself produces findings, SBOMs or threat models.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "alpha-omega-security/harness",
            "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
            "path": "README.md"
          },
          {
            "repository": "alpha-omega-security/harness",
            "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
            "path": "harness.go"
          },
          {
            "repository": "alpha-omega-security/harness",
            "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
            "path": "event.go"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "alpha-omega-security/hyrum",
      "label": "hyrum",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/hyrum",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "testing-compatibility",
        "dependencies"
      ],
      "purpose": "Generates tests for the ways projects use their dependencies.",
      "inputs": [
        {
          "description": "Source usage, tests and dependency-change history",
          "nature": "intrinsic"
        },
        {
          "description": "Package metadata and dependent discovery",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Usage evidence and generated behaviour tests",
          "nature": "intrinsic"
        },
        {
          "description": "Cross-project compatibility context",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/hyrum",
        "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "dependent-repository": "examines dependency use in",
        "structure": "extracts usage evidence from",
        "test-result": "generates behaviour checks for",
        "repository": "examines dependency consumers in",
        "manifest": "reads dependency declarations from",
        "dependency": "traces use of",
        "package": "resolves identities of dependencies as",
        "version": "compares behaviour across",
        "version-range": "resolves baseline dependency constraints expressed as",
        "revision": "mines compatibility evidence from",
        "changelog": "mines compatibility history from",
        "advisory": "gathers historical context from",
        "change": "identifies dependency behaviour changes as"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added manifest and package/version inputs, source revisions, changelogs, advisories and behavioural changes used by compatibility tests.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "README.md"
          },
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "cmd/hyrum/gen.go"
          },
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "internal/hyrum/history.go"
          },
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "internal/hyrum/target.go"
          },
          {
            "repository": "alpha-omega-security/hyrum",
            "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
            "path": "internal/hyrum/verify.go"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "alpha-omega-security/marshal",
      "label": "marshal",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/marshal",
      "scope": "main",
      "roles": [
        "application",
        "index"
      ],
      "areas": [
        "dependencies",
        "maintenance-funding",
        "security"
      ],
      "purpose": "Builds a local collection of package and project information from an SBOM.",
      "inputs": [
        {
          "description": "Imported component inventories",
          "nature": "intrinsic"
        },
        {
          "description": "Package, repository, maintainer and advisory records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Imported component records",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched local package catalogue and advisory matches",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/marshal",
        "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "sbom": "imports",
        "package": "builds an enriched local catalogue of",
        "advisory": "matches",
        "repository": "enriches package source records for",
        "version": "records observed SBOM component",
        "version-range": "matches observed versions against advisory",
        "license": "records package and repository declarations of",
        "maintainer": "records package-scoped publisher roles as",
        "activity": "aggregates repository maintenance signals as",
        "language": "records package and repository",
        "dependent-package": "records upstream counts of",
        "dependent-repository": "records upstream counts of"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added observed versions, advisory ranges, source repositories, license, package maintainer roles, activity, language and dependent counts. No resolved dependency graph or per-version enrichment is claimed.",
        "freshness_note": "Inspected the recorded local revision; fetching remote updates was blocked.",
        "references": [
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "README.md"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "cmd/marshal/main.go"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "internal/db/models.go"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "internal/ingest/ingest.go"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "internal/enrich/packages/packages.go"
          },
          {
            "repository": "alpha-omega-security/marshal",
            "commit": "2222e0d9481cad01c4823217a4b4e56744e2112b",
            "path": "internal/enrich/packages/advisories.go"
          }
        ]
      },
      "data_products": [
        {
          "id": "alpha-omega-security/marshal:data",
          "maintained_by": "alpha-omega-security/marshal",
          "kind": "index",
          "label": "Local enriched package catalogue",
          "purpose": "Builds a local collection of package and project information from an SBOM.",
          "contents": [
            {
              "description": "Imported component records",
              "nature": "intrinsic"
            },
            {
              "description": "Enriched local package catalogue and advisory matches",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "dependencies",
            "maintenance-funding",
            "security"
          ],
          "source": {
            "repository": "alpha-omega-security/marshal",
            "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
            "path": "README.md",
            "basis": "repository_documentation"
          }
        }
      ]
    },
    {
      "id": "alpha-omega-security/heatmap",
      "label": "heatmap",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/heatmap",
      "scope": "supporting",
      "roles": [
        "application"
      ],
      "areas": [
        "maintenance-funding",
        "security"
      ],
      "purpose": "Shows package criticality, maintenance and ownership in a visual overview.",
      "inputs": [
        {
          "description": "Content-derived project metadata",
          "nature": "intrinsic"
        },
        {
          "description": "Critical-package, usage and maintenance records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Derived criticality and maintenance views",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/heatmap",
        "commit": "4ed37981a6e5049c81d7436d90abe036d2810773",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from repository purpose and representative inputs and outputs.",
      "caveats": [
        "An exploratory view with derived measures, not an authoritative risk score."
      ],
      "connection_review": null,
      "coverage": {
        "package": "visualises criticality of",
        "activity": "visualises maintenance context from",
        "maintainer": "visualises project-scoped ownership context for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/dependents",
      "label": "dependents",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/dependents",
      "scope": "main",
      "roles": [
        "library"
      ],
      "areas": [
        "dependencies",
        "testing-compatibility"
      ],
      "purpose": "Finds and ranks repositories that use a package.",
      "inputs": [
        {
          "description": "Package and dependent-repository metadata",
          "nature": "extrinsic"
        },
        {
          "description": "Candidate repository source, tests and build files",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Downstream candidate lists",
          "nature": "extrinsic"
        },
        {
          "description": "Evidence of imports and tests in candidates",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/dependents",
        "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Restored from the audit’s recorded purpose and outputs, with scope and readiness corrected by the user.",
      "caveats": [
        "Exists and belongs in the map; needs further work, per the user."
      ],
      "tasks": [
        "Discover dependent repositories using package metadata",
        "Filter and rank candidates",
        "Inspect checkouts for imports, tests and build context"
      ],
      "connection_review": null,
      "coverage": {
        "dependent-repository": "discovers and ranks",
        "structure": "checks imports and test evidence in"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/downstream",
      "label": "downstream",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/downstream",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "testing-compatibility",
        "dependencies"
      ],
      "purpose": "Tests changes to a library against projects that depend on it.",
      "inputs": [
        {
          "description": "Library changes and dependent project tests",
          "nature": "intrinsic"
        },
        {
          "description": "Dependent project selection",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Baseline and changed-version test results",
          "nature": "intrinsic"
        },
        {
          "description": "Downstream compatibility reports",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/downstream",
        "commit": "d2dbe63e4fd7f1c1600cfd4d8657f83efdb352a0",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Restored from the audit’s recorded purpose and outputs, with scope and readiness corrected by the user.",
      "caveats": [
        "Exists and belongs in the map; needs further work, per the user."
      ],
      "tasks": [
        "Discover or curate dependent test projects",
        "Run baseline and changed-dependency tests",
        "Report new failures separately from broken baselines"
      ],
      "connection_review": null,
      "coverage": {
        "dependent-repository": "runs compatibility tests in",
        "test-result": "compares baseline and changed versions through"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "git-pkgs/spam",
      "label": "spam",
      "organisation": "git-pkgs",
      "url": "https://github.com/git-pkgs/spam",
      "scope": "supporting",
      "roles": [
        "library",
        "dataset"
      ],
      "areas": [
        "security",
        "package-information"
      ],
      "purpose": "Measures promotional-text signals in package contents.",
      "inputs": [
        {
          "description": "Software package text",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Text measurements and exploratory spam indicators",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "git-pkgs/spam",
        "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Restored from the audit’s recorded purpose and outputs, with scope and readiness corrected by the user.",
      "caveats": [
        "Exists and belongs in the map; needs further work, per the user.",
        "Measurements and exploratory scores do not establish that a package is spam; the selected corpus does not establish registry-wide accuracy."
      ],
      "tasks": [
        "Measure promotional-text signals",
        "Record matches and evidence from package text",
        "Evaluate rules against labelled package examples"
      ],
      "connection_review": null,
      "coverage": {
        "finding": "produces exploratory promotional-text indicators as",
        "files": "measures text in"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "git-pkgs/spam:corpus",
          "maintained_by": "git-pkgs/spam",
          "kind": "dataset",
          "label": "Promotional-text evaluation corpus",
          "purpose": "Selected package texts, labels and controls used to evaluate promotional-text rules.",
          "contents": [
            {
              "description": "Saved package text and file hashes",
              "nature": "intrinsic"
            },
            {
              "description": "Curated labels, campaign groups and evaluation selections",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "security",
            "package-information"
          ],
          "source": {
            "repository": "git-pkgs/spam",
            "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
            "path": "testdata/corpus/README.md",
            "basis": "repository_source"
          }
        }
      ]
    },
    {
      "id": "andrew/swhid",
      "label": "SWHID (Ruby)",
      "organisation": "andrew",
      "url": "https://github.com/andrew/swhid",
      "scope": "supporting",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "archives-artifacts",
        "repository-evidence"
      ],
      "purpose": "Computes and parses content-based identifiers for software files, trees and history.",
      "tasks": [
        "Identify file contents and directory trees",
        "Identify revisions, releases and snapshots",
        "Parse and validate identifiers"
      ],
      "inputs": [
        {
          "description": "Files, directory trees and repository history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Software Heritage identifiers and parsed identifier fields",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/swhid",
        "commit": "11a904c175371414280df869fd024e6dafb49f47",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "content-identity": "computes and parses"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/swhid-go",
      "label": "SWHID",
      "organisation": "andrew",
      "url": "https://github.com/andrew/swhid-go",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "archives-artifacts",
        "repository-evidence"
      ],
      "purpose": "Computes and parses content-based identifiers for software files, trees and history.",
      "tasks": [
        "Identify file contents and directory trees",
        "Identify revisions, releases and snapshots",
        "Parse and validate identifiers"
      ],
      "inputs": [
        {
          "description": "Files, directory trees and repository history",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Software Heritage identifiers and parsed identifier fields",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/swhid-go",
        "commit": "970dc0c078a04baa7daba0adb0a58a0bc383a1a7",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "content-identity": "computes and parses"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/vid",
      "label": "VID",
      "organisation": "andrew",
      "url": "https://github.com/andrew/vid",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "security",
        "repository-evidence"
      ],
      "purpose": "Computes content-based identifiers for code locations referenced by security findings.",
      "tasks": [
        "Identify code referenced by findings",
        "Compare whether reports refer to identical code"
      ],
      "inputs": [
        {
          "description": "Source bytes at selected finding locations",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Identifiers for the referenced code, including combined identifiers for multiple locations",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/vid",
        "commit": "d6ec93c63b361c988a65adbf76fb8122ed5f7882",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [
        "An identifier establishes a match in code bytes, not whether the code is vulnerable."
      ],
      "connection_review": null,
      "coverage": {
        "content-identity": "computes code-location identifiers as",
        "finding": "anchors code evidence for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "alpha-omega-security/threat-model",
      "label": "Threat Model",
      "organisation": "alpha-omega-security",
      "url": "https://github.com/alpha-omega-security/threat-model",
      "scope": "main",
      "roles": [
        "tool",
        "application"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Produces and validates a project security contract for maintainers, integrators and finding triage.",
      "tasks": [
        "Describe a project’s security contract",
        "Record and resolve maintainer questions",
        "Validate model documents and triage findings against them"
      ],
      "inputs": [
        {
          "description": "Source code and in-repository security documentation",
          "nature": "intrinsic"
        },
        {
          "description": "Maintainer answers and optional external security history",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Code-derived trust boundaries, entry points and security properties",
          "nature": "intrinsic"
        },
        {
          "description": "Maintainer-confirmed scope, inferred contract claims, triage dispositions and open questions",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "alpha-omega-security/threat-model",
        "commit": "192fd60cd0afe8851128ce4c68ed68c174c11948",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [
        "Claims retain documented, maintainer-supplied or inferred provenance. Functional overlap with Scrutineer does not establish a direct integration."
      ],
      "connection_review": null,
      "coverage": {
        "threat-model": "produces and validates",
        "finding": "triages against security scope",
        "structure": "examines entry points in",
        "repository": "scopes security contracts to",
        "dependency": "describes security responsibilities for",
        "advisory": "uses published security history from",
        "issue": "uses security discussions and triage history from",
        "subproject": "scopes models to"
      },
      "concept_review": null,
      "concept_sources": {
        "note": "Added repository/subproject scope, dependency responsibility and advisory/issue context. Produces security contracts and triage dispositions, not vulnerability discoveries.",
        "freshness_note": "Public README reviewed on 2026-10-14; source link follows main because a local clone was unavailable.",
        "references": [
          {
            "repository": "alpha-omega-security/threat-model",
            "commit": "main",
            "path": "README.md"
          }
        ]
      },
      "data_products": []
    },
    {
      "id": "ecosyste-ms/ecosystems-ts",
      "label": "ecosystems-ts",
      "organisation": "ecosyste-ms",
      "url": "https://github.com/ecosyste-ms/ecosystems-ts",
      "scope": "supporting",
      "roles": [
        "library"
      ],
      "areas": [
        "access-publishing"
      ],
      "purpose": "Retrieves package, repository, advisory and activity records from ecosyste.ms.",
      "tasks": [
        "Look up packages and versions",
        "Retrieve repository, advisory and activity records",
        "Batch and paginate index queries"
      ],
      "inputs": [
        {
          "description": "Indexed content-derived software records",
          "nature": "intrinsic"
        },
        {
          "description": "Indexed package and repository context",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Retrieved dependency and declared-content records",
          "nature": "intrinsic"
        },
        {
          "description": "Retrieved release, advisory, repository and activity records",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "ecosyste-ms/ecosystems-ts",
        "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Repository documentation and inspected source; output labels are relative to the examined software.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "queries",
        "repository": "queries",
        "advisory": "queries",
        "activity": "queries"
      },
      "concept_review": {
        "repositories": [
          "ecosyste-ms/ecosystems-go",
          "ecosyste-ms/ecosystems-ts",
          "ecosyste-ms/ecosyste_ms_cli",
          "ecosyste-ms/mcp",
          "ecosyste-ms/mcp-server",
          "ecosyste-ms/skills",
          "git-pkgs/skills"
        ],
        "reason": "These expose existing concepts through clients or workflows rather than adding an independent data model. Retained under the existing scope; candidates for grouping if the overview is too busy.",
        "decision": "retain for review"
      },
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/purl",
      "label": "purl",
      "organisation": "andrew",
      "url": "https://github.com/andrew/purl",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "package-information",
        "dependencies"
      ],
      "purpose": "Parses and generates package URLs, resolves download links and retrieves package, repository and advisory records.",
      "inputs": [
        {
          "description": "Declared package coordinates",
          "nature": "intrinsic"
        },
        {
          "description": "Registry, repository and advisory records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Normalised declared package identities",
          "nature": "intrinsic"
        },
        {
          "description": "Download links and retrieved metadata",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/purl",
        "commit": "b4278d3acb1e09dadbc71bff07997fcd4d19d9f6",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "package": "normalises identifiers and retrieves records for",
        "artifact": "resolves download links for"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/vers",
      "label": "vers",
      "organisation": "andrew",
      "url": "https://github.com/andrew/vers",
      "scope": "main",
      "roles": [
        "library"
      ],
      "areas": [
        "dependencies",
        "security"
      ],
      "purpose": "Parses and compares version ranges, including VERS and package-manager constraint formats.",
      "inputs": [
        {
          "description": "Declared version constraints",
          "nature": "intrinsic"
        },
        {
          "description": "Release and advisory ranges",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Comparisons of declared constraints",
          "nature": "intrinsic"
        },
        {
          "description": "Release and advisory range matches",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/vers",
        "commit": "02432b51116d55fcb20b524706c3babac9dac486",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "version-range": "parses and compares"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/sarif",
      "label": "sarif",
      "organisation": "andrew",
      "url": "https://github.com/andrew/sarif",
      "scope": "supporting",
      "roles": [
        "library"
      ],
      "areas": [
        "security"
      ],
      "purpose": "Creates, reads and manipulates structured static-analysis reports in SARIF.",
      "inputs": [
        {
          "description": "Source-analysis findings",
          "nature": "intrinsic"
        },
        {
          "description": "Imported assessment reports",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Structured source findings",
          "nature": "intrinsic"
        },
        {
          "description": "Structured imported assessments",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/sarif",
        "commit": "81ee77d4f3d09b3d2012de4d346ff1938240a88b",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "finding": "reads writes and manipulates"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/sbom",
      "label": "sbom",
      "organisation": "andrew",
      "url": "https://github.com/andrew/sbom",
      "scope": "main",
      "roles": [
        "library"
      ],
      "areas": [
        "dependencies"
      ],
      "purpose": "Parses, generates, validates and converts SPDX and CycloneDX software inventories.",
      "inputs": [
        {
          "description": "Software inventory documents",
          "nature": "intrinsic"
        },
        {
          "description": "External enrichment records",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Component records, relationships and converted inventories",
          "nature": "intrinsic"
        },
        {
          "description": "Enriched component metadata",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/sbom",
        "commit": "9565b6c57c089aa21df19639eeba21acab6eb875",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [
        "SBOM classification depends on the fields and their provenance."
      ],
      "connection_review": null,
      "coverage": {
        "sbom": "parses generates and converts"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/changelog-parser",
      "label": "changelog-parser",
      "organisation": "andrew",
      "url": "https://github.com/andrew/changelog-parser",
      "scope": "supporting",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "repository-evidence"
      ],
      "purpose": "Parses changelog text into structured release entries.",
      "inputs": [
        {
          "description": "Changelog contents",
          "nature": "intrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Release entries and documented changes",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/changelog-parser",
        "commit": "0bc7738ac74251f435132e5108676b5279120aec",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "changelog": "parses"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/diffoscope",
      "label": "diffoscope",
      "organisation": "andrew",
      "url": "https://github.com/andrew/diffoscope",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "archives-artifacts"
      ],
      "purpose": "Wraps diffoscope to compare files, URLs and package artifacts identified by PURL.",
      "inputs": [
        {
          "description": "Files and package artifact contents",
          "nature": "intrinsic"
        },
        {
          "description": "Package download locations",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Content differences and file digests",
          "nature": "intrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/diffoscope",
        "commit": "6302b86137df7a7c44db8777d5c62ad9a935f5d0",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "artifact": "compares",
        "change": "produces content comparisons as",
        "digest": "computes"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/typosquatting",
      "label": "typosquatting",
      "organisation": "andrew",
      "url": "https://github.com/andrew/typosquatting",
      "scope": "main",
      "roles": [
        "library",
        "application"
      ],
      "areas": [
        "package-information",
        "security"
      ],
      "purpose": "Generates similar package names and checks for published candidates and dependency-confusion risks.",
      "inputs": [
        {
          "description": "Package names and ecosystem identifiers",
          "nature": "extrinsic"
        },
        {
          "description": "Package records from ecosyste.ms",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Candidate names and publication matches for investigation",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/typosquatting",
        "commit": "70aa46db9f5a2a1ba526f2588b734f9e45a6bb72",
        "path": "README.md",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [
        "Similar names are investigation candidates, not proof of malicious intent."
      ],
      "connection_review": null,
      "coverage": {
        "package": "generates and checks similar names for",
        "finding": "produces impersonation candidates as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": []
    },
    {
      "id": "andrew/ultimate-awesome",
      "label": "ultimate-awesome",
      "organisation": "andrew",
      "url": "https://github.com/andrew/ultimate-awesome",
      "scope": "supporting",
      "roles": [
        "dataset"
      ],
      "areas": [
        "software-discovery"
      ],
      "purpose": "Publishes a combined list of curated software recommendations exported by Awesome.",
      "inputs": [
        {
          "description": "Awesome list export",
          "nature": "extrinsic"
        }
      ],
      "outputs": [
        {
          "description": "Generated Markdown software list",
          "nature": "extrinsic"
        }
      ],
      "fork": false,
      "archived": false,
      "source": {
        "repository": "andrew/ultimate-awesome",
        "commit": "d457c48223f2106a7ce6f34f35a1526247b4808d",
        "path": ".github/workflows/update.yml",
        "basis": "repository_documentation"
      },
      "classification_basis": "Curated from public documentation and source; intrinsic and extrinsic describe individual inputs and outputs.",
      "caveats": [],
      "connection_review": null,
      "coverage": {
        "collection": "publishes combined curated lists as"
      },
      "concept_review": null,
      "concept_sources": null,
      "data_products": [
        {
          "id": "ultimate-awesome-list",
          "maintained_by": "andrew/ultimate-awesome",
          "kind": "dataset",
          "label": "Combined Awesome list",
          "purpose": "A published Markdown export of curated software lists.",
          "contents": [
            {
              "description": "Software recommendations and list membership",
              "nature": "extrinsic"
            }
          ],
          "areas": [
            "software-discovery"
          ],
          "source": {
            "repository": "andrew/ultimate-awesome",
            "commit": "d457c48223f2106a7ce6f34f35a1526247b4808d",
            "path": ".github/workflows/update.yml",
            "basis": "repository_documentation"
          }
        }
      ]
    }
  ],
  "relationships": [
    {
      "id": "relationship-1",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/bibliothecary",
      "target": "git-pkgs/manifests",
      "direction": "undirected",
      "description": "Both extract dependency information from manifests and lockfiles.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/bibliothecary",
          "commit": "2e4fa0c4304b8bab6fc5eb80d69727c808d7a2a1",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/manifests",
          "commit": "99bbda20167c3d2ab3146f94fdf19aed38ce36d2",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-2",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/parser",
      "target": "git-pkgs/manifests",
      "direction": "undirected",
      "description": "Both turn project dependency files into structured dependency records.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/parser",
          "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/manifests",
          "commit": "99bbda20167c3d2ab3146f94fdf19aed38ce36d2",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-3",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/packages",
      "target": "git-pkgs/registries",
      "direction": "undirected",
      "description": "Both provide package and release information; Packages maintains a collected index and registries retrieves records on demand.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-4",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/licenses",
      "target": "git-pkgs/licenses",
      "direction": "undirected",
      "description": "Both detect licenses in software contents, with different coverage and matching behaviour.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/licenses",
          "commit": "c7453c1f723e3ef92025485760dc2e23c798fc28",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/licenses",
          "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-5",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/archives",
      "target": "git-pkgs/archives",
      "direction": "undirected",
      "description": "Both provide access to files inside package archives.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/archives",
          "commit": "63d7a7887ab4d854f0ec3d7c8fae73fcd25fce86",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/archives",
          "commit": "acad49ddba4999e66c36643960cf3f06daeee197",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-6",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/sbom",
      "target": "git-pkgs/sbom",
      "direction": "undirected",
      "description": "Both read and convert software inventory documents.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/sbom",
          "commit": "a0d8d2a8bb0186c3f5a9dfe967c2deaaad2570e3",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/sbom",
          "commit": "f23464671ebf1fb8e92ab70d61059e44f6ed6659",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-7",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/resolve",
      "target": "git-pkgs/resolve",
      "direction": "undirected",
      "description": "Both concern resolved dependency trees; the service handles resolution requests and the tool structures package-manager results.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/resolve",
          "commit": "2770b8e637bdd3bfdddcf27df6b75f22ad6b9b44",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/resolve",
          "commit": "59be154c0eb8846d0b77a6e6d9af24a444ad3d00",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-8",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/nexus",
      "target": "git-pkgs/nexus",
      "direction": "undirected",
      "description": "Both concern Maven index discovery; one maintains collected records and the other reads the upstream index.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/nexus",
          "commit": "d4b79a80fcfdf1ed5baab758c5efa49b4b89d982",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/nexus",
          "commit": "fe5a039118c51d74bd5c28080484b95ce3bf154c",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-9",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/advisories",
      "target": "git-pkgs/vulns",
      "direction": "undirected",
      "description": "Both provide known vulnerability information associated with packages.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/advisories",
          "commit": "37baf19cac89ee4e8854ae541926f0bd772d69fa",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-10",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/repos",
      "target": "git-pkgs/forge",
      "direction": "undirected",
      "description": "Both provide repository information across source hosts, with collected-index and on-demand uses.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/repos",
          "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/forge",
          "commit": "70caf18ac5059dbb877d26f2b191d24d4805723a",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-11",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/commits",
      "target": "git-pkgs/history",
      "direction": "undirected",
      "description": "Both describe repository history; Commits accumulates records and summaries while history supplies local history-reading operations.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/commits",
          "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/history",
          "commit": "cb72b31b48e428604d44dbad300014209f7dc48c",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-12",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/digest",
      "target": "git-pkgs/integrity",
      "direction": "undirected",
      "description": "Both work with package content digests; integrity also compares bytes against declared checksums.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/digest",
          "commit": "ed17117ad9cab6fa1be7104a01340664bece4dea",
          "path": "readme.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/integrity",
          "commit": "8d80cb83c37b9107cca9f3ced25b2e11a1066dd3",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-13",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/radar",
      "target": "git-pkgs/dependents",
      "direction": "undirected",
      "description": "Both help identify the projects that use a package.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/radar",
          "commit": "a19908a14f1f63d54f66a680822a35ce5168872c",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-14",
      "kind": "functional_overlap",
      "source": "git-pkgs/downstream",
      "target": "alpha-omega-security/hyrum",
      "direction": "undirected",
      "description": "Both assess dependency compatibility; downstream runs dependent projects’ tests and Hyrum creates tests from observed dependency use.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/downstream",
          "commit": "d2dbe63e4fd7f1c1600cfd4d8657f83efdb352a0",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/hyrum",
          "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-15",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/threat_models",
      "target": "alpha-omega-security/scrutineer",
      "direction": "undirected",
      "description": "Both concern threat models; the corpus describes existing documents and Scrutineer produces and uses models during investigations.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/threat_models",
          "commit": "e7a2e436c89ffb68339a73b97c0b85deff58af5f",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-16",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/diff",
      "target": "git-pkgs/git-pkgs",
      "direction": "undirected",
      "description": "Both explain changes over time; Diff compares released file contents and git-pkgs tracks dependency changes.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/diff",
          "commit": "4c6a7adac9d7e5305dc2d4fff9370bedd540d0f1",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-17",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/oss-taxonomy",
      "target": "git-pkgs/distill",
      "direction": "undirected",
      "description": "The taxonomy defines software categories and Distill assigns categories using repository evidence.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/oss-taxonomy",
          "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/distill",
          "commit": "0bcc406baa1364a11d249514c27e3878e9db89d7",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-18",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/science",
      "target": "git-pkgs/citation",
      "direction": "undirected",
      "description": "Both concern software citation metadata; Science maintains research context and citation extracts declarations from files.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/citation",
          "commit": "3b2ac7bd4aea9b096b8e8e2fad427b87a5ef4f93",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-19",
      "kind": "supports_task",
      "source": "ecosyste-ms/bibliothecary",
      "target": "ecosyste-ms/parser",
      "direction": "source_to_target",
      "description": "Supplies manifest parsing for the dependency parsing service.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/bibliothecary",
          "commit": "2e4fa0c4304b8bab6fc5eb80d69727c808d7a2a1",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/parser",
          "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-20",
      "kind": "data_flow",
      "source": "ecosyste-ms/parser",
      "target": "ecosyste-ms/repos",
      "direction": "source_to_target",
      "description": "Supplies parsed manifest and dependency results for repository records.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/parser",
          "commit": "860dd37df33a52209120d09d9c604b39bec2de8e",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/repos",
          "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-21",
      "kind": "data_flow",
      "source": "ecosyste-ms/repos",
      "target": "ecosyste-ms/packages",
      "direction": "source_to_target",
      "description": "Supplies repository context and observed repository usage for package records.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/repos",
          "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/ecosystem/actions.rb",
          "line": 76
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/ecosystem/actions.rb",
          "line": 107
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/ecosystem/actions.rb",
          "line": 125
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-22",
      "kind": "data_flow",
      "source": "ecosyste-ms/commits",
      "target": "ecosyste-ms/packages",
      "direction": "source_to_target",
      "description": "Supplies commit activity summaries for package context.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/commits",
          "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/package.rb",
          "line": 893
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/package.rb",
          "line": 898
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-23",
      "kind": "data_flow",
      "source": "ecosyste-ms/issues",
      "target": "ecosyste-ms/packages",
      "direction": "source_to_target",
      "description": "Supplies issue and maintainer activity for package context.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/issues",
          "commit": "8182b698df20d556e163e79c64bd61b14150cdf0",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/package.rb",
          "line": 758
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/package.rb",
          "line": 764
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-24",
      "kind": "data_flow",
      "source": "ecosyste-ms/advisories",
      "target": "ecosyste-ms/packages",
      "direction": "source_to_target",
      "description": "Supplies known advisories for package records.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/advisories",
          "commit": "37baf19cac89ee4e8854ae541926f0bd772d69fa",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/package.rb",
          "line": 988
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/package.rb",
          "line": 992
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/package.rb",
          "line": 1012
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-25",
      "kind": "data_flow",
      "source": "ecosyste-ms/archives",
      "target": "ecosyste-ms/packages",
      "direction": "source_to_target",
      "description": "Supplies README contents from published package archives.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/archives",
          "commit": "63d7a7887ab4d854f0ec3d7c8fae73fcd25fce86",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/package.rb",
          "line": 1095
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/version.rb",
          "line": 124
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/version.rb",
          "line": 128
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-26",
      "kind": "data_flow",
      "source": "ecosyste-ms/conda-api",
      "target": "ecosyste-ms/packages",
      "direction": "source_to_target",
      "description": "Supplies Conda package discovery records.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/conda-api",
          "commit": "4ac5da5d6441b6dd6369e12466690ebc575ea357",
          "path": "Readme.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-27",
      "kind": "data_flow",
      "source": "ecosyste-ms/npm-update-stream",
      "target": "ecosyste-ms/packages",
      "direction": "source_to_target",
      "description": "Supplies names of recently changed npm packages.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/npm-update-stream",
          "commit": "f5d42f56920a3c6ad84d4c38c247d4603d9f21dd",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-28",
      "kind": "data_flow",
      "source": "ecosyste-ms/nexus",
      "target": "ecosyste-ms/packages",
      "direction": "source_to_target",
      "description": "Supplies Maven package and version discovery records.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/nexus",
          "commit": "d4b79a80fcfdf1ed5baab758c5efa49b4b89d982",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documented_purpose",
      "verification_note": "Nexus identifies Packages as the intended consumer. Current automatic ingestion by Packages was not established in this audit."
    },
    {
      "id": "relationship-29",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/live",
      "direction": "source_to_target",
      "description": "Publishes package and version events into the live feed.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/live",
          "commit": "c8e879658b133aab7169d75a6965c7490975ba64",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-30",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/critical",
      "direction": "source_to_target",
      "description": "Supplies package records for the critical-package snapshot.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/critical",
          "commit": "bb0fc1d6abd8361533109c132b75c53a1df9ee2e",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-31",
      "kind": "data_flow",
      "source": "ecosyste-ms/critical",
      "target": "ecosyste-ms/mcp",
      "direction": "source_to_target",
      "description": "Supplies the bundled local package snapshot.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/critical",
          "commit": "bb0fc1d6abd8361533109c132b75c53a1df9ee2e",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/mcp",
          "commit": "826874adc73b4867ac56e9ed2aa28208111ed775",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-32",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/mcp",
      "direction": "source_to_target",
      "description": "Supplies package lookups beyond the local snapshot.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/mcp",
          "commit": "826874adc73b4867ac56e9ed2aa28208111ed775",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-34",
      "kind": "data_flow",
      "source": "git-pkgs/brief",
      "target": "ecosyste-ms/science",
      "direction": "source_to_target",
      "description": "Supplies repository descriptions, dependency records and embedded research metadata.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-35",
      "kind": "supports_task",
      "source": "git-pkgs/citation",
      "target": "git-pkgs/brief",
      "direction": "source_to_target",
      "description": "Extracts citation-file metadata during repository description.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/citation",
          "commit": "3b2ac7bd4aea9b096b8e8e2fad427b87a5ef4f93",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/citation.go",
          "line": 7
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-36",
      "kind": "supports_task",
      "source": "git-pkgs/bibtex",
      "target": "git-pkgs/brief",
      "direction": "source_to_target",
      "description": "Extracts bibliography entries from repository files and READMEs.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/bibtex",
          "commit": "7c94fb7dc3e7e174218eb4a5a6b82dc9e62aaf81",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/bibtex.go",
          "line": 8
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-37",
      "kind": "supports_task",
      "source": "git-pkgs/codemeta",
      "target": "git-pkgs/brief",
      "direction": "source_to_target",
      "description": "Extracts declared software metadata during repository description.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/codemeta",
          "commit": "b382c2db41c9041c247c5907e806274f7f069980",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/codemeta.go",
          "line": 8
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-38",
      "kind": "supports_task",
      "source": "git-pkgs/manifests",
      "target": "git-pkgs/brief",
      "direction": "source_to_target",
      "description": "Extracts dependency declarations during repository description.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/manifests",
          "commit": "99bbda20167c3d2ab3146f94fdf19aed38ce36d2",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/detect.go",
          "line": 27
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-40",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/science",
      "direction": "source_to_target",
      "description": "Supplies published-package metadata and package-to-repository associations.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 232
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 346
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 773
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-41",
      "kind": "data_flow",
      "source": "ecosyste-ms/repos",
      "target": "ecosyste-ms/science",
      "direction": "source_to_target",
      "description": "Supplies repository records and discovery candidates.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/repos",
          "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 215
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 249
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 535
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-42",
      "kind": "data_flow",
      "source": "ecosyste-ms/papers",
      "target": "ecosyste-ms/science",
      "direction": "source_to_target",
      "description": "Supplies software and paper associations for discovery.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/papers",
          "commit": "73490219b17c02cfb8e6c80afa000ea4fef72c33",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 591
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 599
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/project.rb",
          "line": 996
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-43",
      "kind": "data_flow",
      "source": "ecosyste-ms/awesome",
      "target": "ecosyste-ms/science",
      "direction": "source_to_target",
      "description": "Supplies candidate projects from curated software lists.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/awesome",
          "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 63
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-44",
      "kind": "data_flow",
      "source": "ecosyste-ms/ost",
      "target": "ecosyste-ms/science",
      "direction": "source_to_target",
      "description": "Supplies reviewed sustainability projects for discovery.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/ost",
          "commit": "98b61c17b8ab5c7adf6789024b7f35e51e85d182",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/science",
          "commit": "e5881a4951f466609089d51a15b59a9a9c047e0f",
          "path": "app/models/concerns/project/importers.rb",
          "line": 478
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-45",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "git-pkgs/enrichment",
      "direction": "source_to_target",
      "description": "Supplies collected package information for enrichment.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-46",
      "kind": "supports_task",
      "source": "git-pkgs/registries",
      "target": "git-pkgs/enrichment",
      "direction": "source_to_target",
      "description": "Provides direct registry lookups as an enrichment source.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "ecosystems.go",
          "line": 11
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "registries.go",
          "line": 7
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "registries.go",
          "line": 8
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-47",
      "kind": "supports_task",
      "source": "git-pkgs/enrichment",
      "target": "git-pkgs/git-pkgs",
      "direction": "source_to_target",
      "description": "Adds package, release, funding and maintainer context to dependency analysis.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/enrichment.go",
          "line": 8
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/freshness.go",
          "line": 11
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/funding.go",
          "line": 10
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-48",
      "kind": "supports_task",
      "source": "git-pkgs/manifests",
      "target": "git-pkgs/git-pkgs",
      "direction": "source_to_target",
      "description": "Extracts dependency records from repository manifests and lockfiles.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/manifests",
          "commit": "99bbda20167c3d2ab3146f94fdf19aed38ce36d2",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/diff_driver.go",
          "line": 13
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/diff_file.go",
          "line": 10
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/ecosystems.go",
          "line": 9
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-49",
      "kind": "supports_task",
      "source": "git-pkgs/licenses",
      "target": "git-pkgs/git-pkgs",
      "direction": "source_to_target",
      "description": "Detects licenses in package contents for license analysis.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/licenses",
          "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/license_artifacts.go",
          "line": 20
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/licenses.go",
          "line": 19
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-50",
      "kind": "data_flow",
      "source": "git-pkgs/git-pkgs",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Produces dependency inventories and SBOMs for repository investigations.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "Dockerfile",
          "line": 30
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-51",
      "kind": "data_flow",
      "source": "git-pkgs/brief",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Produces repository overviews used during investigations.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "Dockerfile",
          "line": 32
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "skills/embedded-native/scripts/scan.sh",
          "line": 36
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-52",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Supplies published-package information and dependent context.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/db/db.go",
          "line": 472
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/db/db.go",
          "line": 724
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/db/ecosystem.go",
          "line": 12
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-53",
      "kind": "data_flow",
      "source": "ecosyste-ms/repos",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Supplies repository metadata for investigations.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/repos",
          "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/worker/skill_parsers.go",
          "line": 54
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-54",
      "kind": "data_flow",
      "source": "ecosyste-ms/commits",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Supplies contribution history used in maintainer investigations.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/commits",
          "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-55",
      "kind": "data_flow",
      "source": "ecosyste-ms/issues",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Supplies collaboration activity used in maintainer investigations.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/issues",
          "commit": "8182b698df20d556e163e79c64bd61b14150cdf0",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-56",
      "kind": "data_flow",
      "source": "ecosyste-ms/advisories",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Supplies existing advisories for investigation context.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/advisories",
          "commit": "37baf19cac89ee4e8854ae541926f0bd772d69fa",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/db/db.go",
          "line": 631
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/web/server.go",
          "line": 279
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-57",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "alpha-omega-security/marshal",
      "direction": "source_to_target",
      "description": "Supplies enriched package records for a local catalogue built around imported inventories.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/marshal",
          "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/marshal",
          "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
          "path": "cmd/marshal/main.go",
          "line": 28
        },
        {
          "repository": "alpha-omega-security/marshal",
          "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
          "path": "internal/db/lifecycle.go",
          "line": 42
        },
        {
          "repository": "alpha-omega-security/marshal",
          "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
          "path": "internal/db/models.go",
          "line": 119
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-58",
      "kind": "supports_task",
      "source": "git-pkgs/sbom",
      "target": "alpha-omega-security/marshal",
      "direction": "source_to_target",
      "description": "Reads component inventories used to start collection.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/sbom",
          "commit": "f23464671ebf1fb8e92ab70d61059e44f6ed6659",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/marshal",
          "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/marshal",
          "commit": "a0df921571c8ff010060c31e3aaec5edf21a125f",
          "path": "internal/ingest/ingest.go",
          "line": 10
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-59",
      "kind": "supports_task",
      "source": "alpha-omega-security/harness",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Runs investigation tasks and collects their results.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "alpha-omega-security/harness",
          "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "cmd/scrutineer/main.go",
          "line": 27
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/egressgrant/egressgrant.go",
          "line": 14
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/evals/model_judge.go",
          "line": 11
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-60",
      "kind": "supports_task",
      "source": "alpha-omega-security/harness",
      "target": "alpha-omega-security/hyrum",
      "direction": "source_to_target",
      "description": "Runs tasks that investigate dependency use and generate tests.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "alpha-omega-security/harness",
          "commit": "d2d4efa9d6783f8d77e15ffb8fe7f01a0c4c1636",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/hyrum",
          "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/hyrum",
          "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
          "path": "cmd/hyrum/corpus.go",
          "line": 12
        },
        {
          "repository": "alpha-omega-security/hyrum",
          "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
          "path": "cmd/hyrum/gen.go",
          "line": 13
        },
        {
          "repository": "alpha-omega-security/hyrum",
          "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
          "path": "cmd/hyrum/gen.go",
          "line": 14
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-63",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "alpha-omega-security/heatmap",
      "direction": "source_to_target",
      "description": "Supplies critical-package, usage and maintenance information for the visual overview.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/heatmap",
          "commit": "4ed37981a6e5049c81d7436d90abe036d2810773",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/heatmap",
          "commit": "4ed37981a6e5049c81d7436d90abe036d2810773",
          "path": "scripts/extract_critical_full.py",
          "line": 128
        },
        {
          "repository": "alpha-omega-security/heatmap",
          "commit": "4ed37981a6e5049c81d7436d90abe036d2810773",
          "path": "scripts/fetch_critical_full.py",
          "line": 2
        },
        {
          "repository": "alpha-omega-security/heatmap",
          "commit": "4ed37981a6e5049c81d7436d90abe036d2810773",
          "path": "scripts/fetch_critical_full.py",
          "line": 29
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-64",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/radar",
      "direction": "source_to_target",
      "description": "Supplies package identities and downstream package relationships.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/radar",
          "commit": "a19908a14f1f63d54f66a680822a35ce5168872c",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/radar",
          "commit": "a19908a14f1f63d54f66a680822a35ce5168872c",
          "path": "app/models/package.rb",
          "line": 24
        },
        {
          "repository": "ecosyste-ms/radar",
          "commit": "a19908a14f1f63d54f66a680822a35ce5168872c",
          "path": "app/models/package.rb",
          "line": 40
        },
        {
          "repository": "ecosyste-ms/radar",
          "commit": "a19908a14f1f63d54f66a680822a35ce5168872c",
          "path": "app/models/package.rb",
          "line": 41
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-65",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/dashboards",
      "direction": "source_to_target",
      "description": "Supplies package records for project and collection views.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 382
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 387
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 1039
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-66",
      "kind": "data_flow",
      "source": "ecosyste-ms/repos",
      "target": "ecosyste-ms/dashboards",
      "direction": "source_to_target",
      "description": "Supplies repository information for project views.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/repos",
          "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/collection.rb",
          "line": 192
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/collection.rb",
          "line": 348
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/collective.rb",
          "line": 228
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-67",
      "kind": "data_flow",
      "source": "ecosyste-ms/issues",
      "target": "ecosyste-ms/dashboards",
      "direction": "source_to_target",
      "description": "Supplies issue and pull-request activity for project views.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/issues",
          "commit": "8182b698df20d556e163e79c64bd61b14150cdf0",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 371
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 612
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 1802
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-68",
      "kind": "data_flow",
      "source": "ecosyste-ms/commits",
      "target": "ecosyste-ms/dashboards",
      "direction": "source_to_target",
      "description": "Supplies contribution summaries for project views.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/commits",
          "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 376
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 754
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 1804
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-69",
      "kind": "data_flow",
      "source": "ecosyste-ms/opencollective",
      "target": "ecosyste-ms/dashboards",
      "direction": "source_to_target",
      "description": "Supplies collective project membership for collection imports.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/opencollective",
          "commit": "29518f5e4ae205a0a524e829853db27158fe02c5",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/collection.rb",
          "line": 159
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-70",
      "kind": "data_flow",
      "source": "ecosyste-ms/sponsors",
      "target": "ecosyste-ms/dashboards",
      "direction": "source_to_target",
      "description": "Supplies sponsorship context for projects.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/sponsors",
          "commit": "9e378d0fae4b009900d26d5086f163eedf7e3dc4",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "app/models/project.rb",
          "line": 1403
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-71",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/funds",
      "direction": "source_to_target",
      "description": "Supplies package discovery and project context for funding collections.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "app/models/fund.rb",
          "line": 136
        },
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "app/models/fund.rb",
          "line": 169
        },
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "app/models/project.rb",
          "line": 178
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-72",
      "kind": "data_flow",
      "source": "ecosyste-ms/awesome",
      "target": "ecosyste-ms/funds",
      "direction": "source_to_target",
      "description": "Supplies topic-based project candidates for funds.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/awesome",
          "commit": "1a63999c10ec751bf01abb7437457da6b443e8d1",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "app/models/fund.rb",
          "line": 56
        },
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "app/models/fund.rb",
          "line": 74
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-73",
      "kind": "data_flow",
      "source": "ecosyste-ms/opencollective",
      "target": "ecosyste-ms/funds",
      "direction": "source_to_target",
      "description": "Supplies collective and project funding context.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/opencollective",
          "commit": "29518f5e4ae205a0a524e829853db27158fe02c5",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "app/models/funding_source.rb",
          "line": 122
        },
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "app/models/project.rb",
          "line": 787
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-74",
      "kind": "data_flow",
      "source": "ecosyste-ms/sponsors",
      "target": "ecosyste-ms/funds",
      "direction": "source_to_target",
      "description": "Supplies public sponsorship context.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/sponsors",
          "commit": "9e378d0fae4b009900d26d5086f163eedf7e3dc4",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "app/models/funding_source.rb",
          "line": 32
        },
        {
          "repository": "ecosyste-ms/funds",
          "commit": "c4defcb7fae48ade2d1ee13ae14562762ff2e05a",
          "path": "app/models/funding_source.rb",
          "line": 132
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-75",
      "kind": "supports_task",
      "source": "git-pkgs/nexus",
      "target": "ecosyste-ms/nexus",
      "direction": "source_to_target",
      "description": "Reads upstream Maven indexes so the service can maintain discovery records.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/nexus",
          "commit": "fe5a039118c51d74bd5c28080484b95ce3bf154c",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/nexus",
          "commit": "d4b79a80fcfdf1ed5baab758c5efa49b4b89d982",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/nexus",
          "commit": "d4b79a80fcfdf1ed5baab758c5efa49b4b89d982",
          "path": "Dockerfile",
          "line": 6
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-76",
      "kind": "supports_task",
      "source": "git-pkgs/registries",
      "target": "ecosyste-ms/resolve-cli",
      "direction": "source_to_target",
      "description": "Retrieves package dependency declarations for resolution.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/resolve-cli",
          "commit": "3d0e15375d5583a2c7f628d29c2e37b233d0eaf2",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/resolve-cli",
          "commit": "3d0e15375d5583a2c7f628d29c2e37b233d0eaf2",
          "path": "cmd/resolve/main.go",
          "line": 15
        },
        {
          "repository": "ecosyste-ms/resolve-cli",
          "commit": "3d0e15375d5583a2c7f628d29c2e37b233d0eaf2",
          "path": "cmd/resolve/main.go",
          "line": 16
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-77",
      "kind": "supports_task",
      "source": "git-pkgs/resolve",
      "target": "ecosyste-ms/resolve-cli",
      "direction": "source_to_target",
      "description": "Produces structured dependency trees from resolution results.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/resolve",
          "commit": "59be154c0eb8846d0b77a6e6d9af24a444ad3d00",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/resolve-cli",
          "commit": "3d0e15375d5583a2c7f628d29c2e37b233d0eaf2",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/resolve-cli",
          "commit": "3d0e15375d5583a2c7f628d29c2e37b233d0eaf2",
          "path": "cmd/resolve/main.go",
          "line": 17
        },
        {
          "repository": "ecosyste-ms/resolve-cli",
          "commit": "3d0e15375d5583a2c7f628d29c2e37b233d0eaf2",
          "path": "cmd/resolve/main.go",
          "line": 18
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-78",
      "kind": "supports_task",
      "source": "git-pkgs/history",
      "target": "git-pkgs/git-spdx",
      "direction": "source_to_target",
      "description": "Supplies repository history for license-change analysis.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/history",
          "commit": "cb72b31b48e428604d44dbad300014209f7dc48c",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/git-spdx",
          "commit": "522d4603703cfa625914f222830fc6b7ba78e744",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "documentation_based",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-79",
      "kind": "supports_task",
      "source": "git-pkgs/history",
      "target": "git-pkgs/signals",
      "direction": "source_to_target",
      "description": "Supplies repository history for security-evidence timelines.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/history",
          "commit": "cb72b31b48e428604d44dbad300014209f7dc48c",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/signals",
          "commit": "addc7cb43363d030f7c55184c9fdd004ed7f22d8",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/signals",
          "commit": "addc7cb43363d030f7c55184c9fdd004ed7f22d8",
          "path": "history.go",
          "line": 14
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-80",
      "kind": "supports_task",
      "source": "git-pkgs/history",
      "target": "git-pkgs/secrets",
      "direction": "source_to_target",
      "description": "Supplies historical file contents for credential scanning.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/history",
          "commit": "cb72b31b48e428604d44dbad300014209f7dc48c",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "scan.go",
          "line": 20
        },
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "validate.go",
          "line": 9
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-81",
      "kind": "supports_task",
      "source": "git-pkgs/licenses",
      "target": "git-pkgs/git-spdx",
      "direction": "source_to_target",
      "description": "Detects license evidence for historical comparisons.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/licenses",
          "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/git-spdx",
          "commit": "522d4603703cfa625914f222830fc6b7ba78e744",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/git-spdx",
          "commit": "522d4603703cfa625914f222830fc6b7ba78e744",
          "path": "history.go",
          "line": 16
        },
        {
          "repository": "git-pkgs/git-spdx",
          "commit": "522d4603703cfa625914f222830fc6b7ba78e744",
          "path": "main.go",
          "line": 24
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-82",
      "kind": "supports_task",
      "source": "git-pkgs/scan",
      "target": "git-pkgs/secrets",
      "direction": "source_to_target",
      "description": "Matches candidate credential patterns in file contents.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/scan",
          "commit": "20366450e1eef8694485702ab77f64c91a5ac5ce",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "internal/scandb/database.go",
          "line": 10
        },
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "prefilter_scan.go",
          "line": 15
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-84",
      "kind": "supports_task",
      "source": "git-pkgs/cooldown",
      "target": "git-pkgs/proxy",
      "direction": "source_to_target",
      "description": "Applies publication-age rules to available package releases.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/cooldown",
          "commit": "57cce9c6343064a45da140d64dcc568fc2119e89",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "544e1a5bdde698e6da82d73b77f31eee114a371f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "544e1a5bdde698e6da82d73b77f31eee114a371f",
          "path": "internal/config/retention.go",
          "line": 11
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "544e1a5bdde698e6da82d73b77f31eee114a371f",
          "path": "internal/cooldownpolicy/policy.go",
          "line": 11
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "544e1a5bdde698e6da82d73b77f31eee114a371f",
          "path": "internal/handler/handler.go",
          "line": 20
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-85",
      "kind": "supports_task",
      "source": "git-pkgs/sarif",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Reads external analysis reports into the findings workflow.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/sarif",
          "commit": "fe6de84035a6302d08e729cb746ca4a66dcb4506",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/ingest/sarif.go",
          "line": 9
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-86",
      "kind": "supports_task",
      "source": "git-pkgs/cwe",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Supplies weakness descriptions for findings.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/cwe",
          "commit": "bfed07a9be7e2ac7dbe9b390430373f5faa261df",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/web/cwe.go",
          "line": 4
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/web/cwe.go",
          "line": 17
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/web/server.go",
          "line": 27
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-87",
      "kind": "supports_task",
      "source": "git-pkgs/pom",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Resolves Maven dependency declarations for package assessment.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/pom",
          "commit": "3bac91f5192593942d62e2ac8196ade9d06b1b5f",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/worker/skill_parsers.go",
          "line": 14
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Describes the documented or source-supported relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-88",
      "kind": "supports_task",
      "source": "git-pkgs/dependents",
      "target": "git-pkgs/downstream",
      "direction": "source_to_target",
      "description": "Selects and ranks dependent projects for compatibility testing.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/downstream",
          "commit": "d2dbe63e4fd7f1c1600cfd4d8657f83efdb352a0",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/downstream",
          "commit": "d2dbe63e4fd7f1c1600cfd4d8657f83efdb352a0",
          "path": "internal/discover/analyze.go",
          "basis": "repository_source",
          "line": 34
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-89",
      "kind": "supports_task",
      "source": "git-pkgs/dependents",
      "target": "alpha-omega-security/hyrum",
      "direction": "source_to_target",
      "description": "Discovers dependent projects for a corpus of observed dependency use.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/hyrum",
          "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/hyrum",
          "commit": "d3a066d6de2529b84cb0a9ae77e4146383efa57e",
          "path": "cmd/hyrum/corpus.go",
          "basis": "repository_source",
          "line": 161
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-90",
      "kind": "supports_task",
      "source": "git-pkgs/scan",
      "target": "git-pkgs/spam",
      "direction": "source_to_target",
      "description": "Matches promotional phrases and URL patterns in supplied package text.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/scan",
          "commit": "20366450e1eef8694485702ab77f64c91a5ac5ce",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/spam",
          "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/spam",
          "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
          "path": "spam.go",
          "basis": "repository_source",
          "line": 127
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-91",
      "kind": "data_flow",
      "source": "git-pkgs/enrichment",
      "target": "git-pkgs/dependents",
      "direction": "source_to_target",
      "description": "Supplies package-to-dependent relationships and repository metadata for candidate discovery.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "candidate.go",
          "basis": "repository_source",
          "line": 113
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-92",
      "kind": "supports_task",
      "source": "git-pkgs/clone",
      "target": "git-pkgs/dependents",
      "direction": "source_to_target",
      "description": "Provides candidate repository checkouts for source and test analysis.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/clone",
          "commit": "b9842889da5a6bdaef5e18011908e7ec037c4917",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "checkout.go",
          "basis": "repository_source",
          "line": 34
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-93",
      "kind": "supports_task",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/downstream",
      "direction": "source_to_target",
      "description": "Detects the test commands used for baseline and changed-dependency runs.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/downstream",
          "commit": "d2dbe63e4fd7f1c1600cfd4d8657f83efdb352a0",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/downstream",
          "commit": "d2dbe63e4fd7f1c1600cfd4d8657f83efdb352a0",
          "path": "internal/run/brief.go",
          "basis": "repository_source",
          "line": 36
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-94",
      "kind": "supports_task",
      "source": "git-pkgs/managers",
      "target": "git-pkgs/downstream",
      "direction": "source_to_target",
      "description": "Replaces a dependency with the proposed library checkout before rerunning tests.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/managers",
          "commit": "c16c0e502615df3d69a6e0b005868232d5fdb978",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/downstream",
          "commit": "d2dbe63e4fd7f1c1600cfd4d8657f83efdb352a0",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/downstream",
          "commit": "d2dbe63e4fd7f1c1600cfd4d8657f83efdb352a0",
          "path": "internal/run/run.go",
          "basis": "repository_source",
          "line": 105
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-95",
      "kind": "data_flow",
      "source": "git-pkgs/enrichment",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Supplies dependent-package context for investigations.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/worker/ecosystems.go",
          "basis": "repository_source",
          "line": 326
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-96",
      "kind": "supports_task",
      "source": "andrew/vid",
      "target": "alpha-omega-security/scrutineer",
      "direction": "source_to_target",
      "description": "Computes identifiers for source locations attached to findings.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "andrew/vid",
          "commit": "d6ec93c63b361c988a65adbf76fb8122ed5f7882",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/worker/findings.go",
          "basis": "repository_source",
          "line": 37
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "internal/worker/vid.go",
          "basis": "repository_source",
          "line": 81
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-100",
      "kind": "functional_overlap",
      "source": "andrew/swhid",
      "target": "andrew/swhid-go",
      "direction": "undirected",
      "description": "Both compute and parse Software Heritage identifiers for contents and history.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "andrew/swhid",
          "commit": "11a904c175371414280df869fd024e6dafb49f47",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "andrew/swhid-go",
          "commit": "970dc0c078a04baa7daba0adb0a58a0bc383a1a7",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-101",
      "kind": "functional_overlap",
      "source": "alpha-omega-security/threat-model",
      "target": "alpha-omega-security/scrutineer",
      "direction": "undirected",
      "description": "Both describe project security contracts; Threat Model produces reusable documents and triage rules, while Scrutineer uses its own threat-model workflow during investigations.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "alpha-omega-security/threat-model",
          "commit": "192fd60cd0afe8851128ce4c68ed68c174c11948",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "alpha-omega-security/scrutineer",
          "commit": "ef03370d39542d32bb4b2fb028d8add393ffbd7f",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-102",
      "kind": "supports_task",
      "source": "ecosyste-ms/oss-taxonomy",
      "target": "git-pkgs/brief",
      "direction": "source_to_target",
      "description": "Supplies classification terms used in tool definitions and derived threat categories.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/oss-taxonomy",
          "commit": "cf48d8ceacee3595073f90b19f1f0db5111d5bce",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "README.md",
          "basis": "repository_documentation",
          "line": 179
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-103",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/ecosystems-go",
      "target": "ecosyste-ms/ecosystems-ts",
      "direction": "undirected",
      "description": "Both provide client access to ecosyste.ms records; the TypeScript client is documented as a port of the Go client.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/ecosystems-go",
          "commit": "038a83102b03aa8f3244eba9f23d8482e7df8043",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-104",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/ecosystems-ts",
      "direction": "source_to_target",
      "description": "Supplies package and release records for client queries.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "src/client.ts",
          "basis": "repository_source",
          "line": 395
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-105",
      "kind": "data_flow",
      "source": "ecosyste-ms/repos",
      "target": "ecosyste-ms/ecosystems-ts",
      "direction": "source_to_target",
      "description": "Supplies repository records for client queries.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/repos",
          "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "src/client.ts",
          "basis": "repository_source",
          "line": 576
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-106",
      "kind": "data_flow",
      "source": "ecosyste-ms/advisories",
      "target": "ecosyste-ms/ecosystems-ts",
      "direction": "source_to_target",
      "description": "Supplies advisory records for client queries.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/advisories",
          "commit": "37baf19cac89ee4e8854ae541926f0bd772d69fa",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "src/client.ts",
          "basis": "repository_source",
          "line": 590
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-107",
      "kind": "data_flow",
      "source": "ecosyste-ms/commits",
      "target": "ecosyste-ms/ecosystems-ts",
      "direction": "source_to_target",
      "description": "Supplies repository contribution history for client queries.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/commits",
          "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "src/client.ts",
          "basis": "repository_source",
          "line": 609
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-108",
      "kind": "data_flow",
      "source": "ecosyste-ms/issues",
      "target": "ecosyste-ms/ecosystems-ts",
      "direction": "source_to_target",
      "description": "Supplies issue and pull-request activity for client queries.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/issues",
          "commit": "8182b698df20d556e163e79c64bd61b14150cdf0",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosystems-ts",
          "commit": "8e2953d873469f0233b561fe3bb4b02a688a575c",
          "path": "src/client.ts",
          "basis": "repository_source",
          "line": 625
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-109",
      "kind": "functional_overlap",
      "source": "ecosyste-ms/summary",
      "target": "ecosyste-ms/dashboards",
      "direction": "undirected",
      "description": "Both aggregate project data into collection views; both are supporting detail in this map.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/dashboards",
          "commit": "08822ba439d7f8340be3c2311cc70825c65d9e15",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [],
      "assessment": "functional_comparison",
      "verification_note": "Functional similarity does not imply equivalence or an existing data exchange."
    },
    {
      "id": "relationship-110",
      "kind": "data_flow",
      "source": "ecosyste-ms/repos",
      "target": "ecosyste-ms/summary",
      "direction": "source_to_target",
      "description": "Supplies repository and owner records for project overviews.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/repos",
          "commit": "781365a1c38e1be404a29784615e8fc28b4d0879",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "app/models/project.rb",
          "basis": "repository_source",
          "line": 139
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-111",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/summary",
      "direction": "source_to_target",
      "description": "Supplies published-package records for project overviews.",
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "app/models/project.rb",
          "basis": "repository_source",
          "line": 204
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-112",
      "kind": "data_flow",
      "source": "ecosyste-ms/commits",
      "target": "ecosyste-ms/summary",
      "direction": "source_to_target",
      "description": "Supplies contribution summaries for project overviews.",
      "data_nature": [
        "intrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/commits",
          "commit": "5168cf4bdaf82324b88e73ddaa5b9a2fa0d2fd49",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "app/models/project.rb",
          "basis": "repository_source",
          "line": 219
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-113",
      "kind": "data_flow",
      "source": "ecosyste-ms/issues",
      "target": "ecosyste-ms/summary",
      "direction": "source_to_target",
      "description": "Supplies issue and pull-request summaries for project overviews.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/issues",
          "commit": "8182b698df20d556e163e79c64bd61b14150cdf0",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "app/models/project.rb",
          "basis": "repository_source",
          "line": 352
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "relationship-114",
      "kind": "data_flow",
      "source": "ecosyste-ms/timeline",
      "target": "ecosyste-ms/summary",
      "direction": "source_to_target",
      "description": "Supplies repository event summaries for project overviews.",
      "data_nature": [
        "extrinsic"
      ],
      "evidence": [
        {
          "repository": "ecosyste-ms/timeline",
          "commit": "08c79539293f64f2048301ad002a635ef3187fc1",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/summary",
          "commit": "d8d3ef5688fe9c4b49c77eba965ad96f2b9602eb",
          "path": "app/models/project.rb",
          "basis": "repository_source",
          "line": 176
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Inspected documentation or source supports this relationship; deployed operation was not tested."
    },
    {
      "id": "service:packages:dependabot",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/dependabot",
      "direction": "source_to_target",
      "description": "Supplies package metadata and source-repository links for dependencies mentioned in update pull requests.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "app/sidekiq/sync_package_worker.rb",
          "line": 5,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "app/models/package.rb",
          "line": 77,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "app/models/issue.rb",
          "line": 768,
          "basis": "source_reference"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Arrow follows the returned data from provider to consumer. Calls traced from sync workers or Rake tasks; deployed operation was not tested."
    },
    {
      "id": "service:repos:dependabot",
      "kind": "data_flow",
      "source": "ecosyste-ms/repos",
      "target": "ecosyste-ms/dependabot",
      "direction": "source_to_target",
      "description": "Supplies Git forge hosts and repository metadata for dependency-update analysis.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "lib/tasks/hosts.rake",
          "line": 9,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "app/models/host.rb",
          "line": 68,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "app/sidekiq/sync_repository_worker.rb",
          "line": 5,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "app/models/repository.rb",
          "line": 99,
          "basis": "source_reference"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Arrow follows the returned data from provider to consumer. Calls traced from sync workers or Rake tasks; deployed operation was not tested."
    },
    {
      "id": "service:advisories:dependabot",
      "kind": "data_flow",
      "source": "ecosyste-ms/advisories",
      "target": "ecosyste-ms/dependabot",
      "direction": "source_to_target",
      "description": "Supplies advisories and affected-package records, which Dependabot imports and matches to update pull requests.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "lib/tasks/advisories.rake",
          "line": 4,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "app/models/advisory.rb",
          "line": 175,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/dependabot",
          "commit": "d3569e22d72d03a7dafc23d9bd23ba51e1bb7b65",
          "path": "app/models/advisory.rb",
          "line": 197,
          "basis": "source_reference"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Arrow follows the returned data from provider to consumer. Calls traced from sync workers or Rake tasks; deployed operation was not tested."
    },
    {
      "id": "service:packages:docker",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/docker",
      "direction": "source_to_target",
      "description": "Supplies container-image package metadata, download counts and release records used to select and refresh images for SBOM analysis.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/docker",
          "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
          "path": "lib/tasks/packages.rake",
          "line": 3,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/docker",
          "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
          "path": "app/models/package.rb",
          "line": 31,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/docker",
          "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
          "path": "app/models/package.rb",
          "line": 57,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/docker",
          "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
          "path": "app/models/package.rb",
          "line": 99,
          "basis": "source_reference"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Arrow follows the returned data from provider to consumer. Calls traced from sync workers or Rake tasks; deployed operation was not tested."
    },
    {
      "id": "service:docker:packages",
      "kind": "data_flow",
      "source": "ecosyste-ms/docker",
      "target": "ecosyste-ms/packages",
      "direction": "source_to_target",
      "description": "Supplies counts of container images containing a package and their aggregate download counts; Packages stores these as Docker usage context.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "lib/tasks/packages.rake",
          "line": 185,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/packages",
          "commit": "f45879e22d91db6ecad52312ed1285d1b859b6ed",
          "path": "app/models/package.rb",
          "line": 1057,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/docker",
          "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
          "path": "app/controllers/api/v1/package_usages_controller.rb",
          "line": 14,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/docker",
          "commit": "d26aa957a4b0b10e1bdff1aa182691c734d9aa37",
          "path": "app/models/package_usage.rb",
          "line": 19,
          "basis": "source_reference"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Arrow follows the returned data from provider to consumer. Calls traced from sync workers or Rake tasks; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/advisories:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/advisories",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies advisories API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/advisories.openapi.yaml",
          "line": 19,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/archives:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/archives",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies archives API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/archives.openapi.yaml",
          "line": 17,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/commits:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/commits",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies commits API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/commits.openapi.yaml",
          "line": 18,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/dependabot:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/dependabot",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies dependabot API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/dependabot.openapi.yaml",
          "line": 18,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/diff:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/diff",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies diff API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/diff.openapi.yaml",
          "line": 19,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/docker:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/docker",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies docker API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/docker.openapi.yaml",
          "line": 18,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/issues:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/issues",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies issues API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/issues.openapi.yaml",
          "line": 18,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/licenses:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/licenses",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies licenses API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/licenses.openapi.yaml",
          "line": 19,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/opencollective:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/opencollective",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies opencollective API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/opencollective.openapi.yaml",
          "line": 18,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/packages:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies packages API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/packages.openapi.yaml",
          "line": 19,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/parser:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/parser",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies parser API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/parser.openapi.yaml",
          "line": 19,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/repos:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/repos",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies repos API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/repos.openapi.yaml",
          "line": 19,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/resolve:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/resolve",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies resolve API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/resolve.openapi.yaml",
          "line": 19,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/sbom:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/sbom",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies sbom API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/sbom.openapi.yaml",
          "line": 18,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/sponsors:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/sponsors",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies sponsors API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/sponsors.openapi.yaml",
          "line": 18,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/summary:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/summary",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies summary API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/summary.openapi.yaml",
          "line": 19,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/timeline:ecosyste-ms/ecosyste_ms_cli",
      "source": "ecosyste-ms/timeline",
      "target": "ecosyste-ms/ecosyste_ms_cli",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Supplies timeline API responses for command-line queries and job results.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/apis/timeline.openapi.yaml",
          "line": 19,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/commands/execution.py",
          "line": 132,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ecosyste_ms_cli",
          "commit": "c99530f6fb2df37fe38f33fe343fd7209cb4a089",
          "path": "ecosystems_cli/openapi_client.py",
          "line": 288,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/packages:ecosyste-ms/ruby",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/ruby",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Published-package metadata and package-to-repository associations feed the Ruby project overview.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 195,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 364,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 42,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/repos:ecosyste-ms/ruby",
      "source": "ecosyste-ms/repos",
      "target": "ecosyste-ms/ruby",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Repository metadata and manifests feed the Ruby project overview.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 195,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 296,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 256,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/commits:ecosyste-ms/ruby",
      "source": "ecosyste-ms/commits",
      "target": "ecosyste-ms/ruby",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Commit activity summaries feed the Ruby project overview.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 195,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 381,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 266,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/timeline:ecosyste-ms/ruby",
      "source": "ecosyste-ms/timeline",
      "target": "ecosyste-ms/ruby",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Repository event summaries feed the Ruby project overview.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 195,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 338,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 335,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/issues:ecosyste-ms/ruby",
      "source": "ecosyste-ms/issues",
      "target": "ecosyste-ms/ruby",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Issue and pull-request statistics feed the Ruby project overview.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 195,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 455,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 261,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/archives:ecosyste-ms/ruby",
      "source": "ecosyste-ms/archives",
      "target": "ecosyste-ms/ruby",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "README and citation-file contents extracted from repository archives feed the Ruby project overview.",
      "source_references": [
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 195,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 752,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/ruby",
          "commit": "fbb9a2f5bbd6d7d2d1135b6764a532c06f9d9c32",
          "path": "app/models/project.rb",
          "line": 724,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/packages:ecosyste-ms/mcp-server",
      "source": "ecosyste-ms/packages",
      "target": "ecosyste-ms/mcp-server",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Package metadata are retrieved for MCP tool responses.",
      "source_references": [
        {
          "repository": "ecosyste-ms/mcp-server",
          "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
          "path": "app/tools/get_package_basic_info_tool.rb",
          "line": 25,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/mcp-server",
          "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
          "path": "app/services/ecosystems_client.rb",
          "line": 7,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/repos:ecosyste-ms/mcp-server",
      "source": "ecosyste-ms/repos",
      "target": "ecosyste-ms/mcp-server",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Repository metadata are retrieved for MCP tool responses.",
      "source_references": [
        {
          "repository": "ecosyste-ms/mcp-server",
          "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
          "path": "app/tools/get_repo_basic_info_tool.rb",
          "line": 38,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/mcp-server",
          "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
          "path": "app/services/ecosystems_client.rb",
          "line": 8,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic",
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/issues:ecosyste-ms/mcp-server",
      "source": "ecosyste-ms/issues",
      "target": "ecosyste-ms/mcp-server",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Issue and pull-request statistics are retrieved for MCP tool responses.",
      "source_references": [
        {
          "repository": "ecosyste-ms/mcp-server",
          "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
          "path": "app/tools/get_issue_counts_tool.rb",
          "line": 37,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/mcp-server",
          "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
          "path": "app/services/ecosystems_client.rb",
          "line": 9,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:data_flow:ecosyste-ms/commits:ecosyste-ms/mcp-server",
      "source": "ecosyste-ms/commits",
      "target": "ecosyste-ms/mcp-server",
      "kind": "data_flow",
      "direction": "source_to_target",
      "description": "Commit activity summaries are retrieved for MCP tool responses.",
      "source_references": [
        {
          "repository": "ecosyste-ms/mcp-server",
          "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
          "path": "app/tools/get_commit_overview_tool.rb",
          "line": 37,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/mcp-server",
          "commit": "69c6757badc342cf297ddc705fe663205bc4bb28",
          "path": "app/services/ecosystems_client.rb",
          "line": 10,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "intrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:supports_task:ecosyste-ms/skills:ecosyste-ms/packages",
      "source": "ecosyste-ms/skills",
      "target": "ecosyste-ms/packages",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides instructions and API query examples for the packages service.",
      "source_references": [
        {
          "repository": "ecosyste-ms/skills",
          "commit": "ad1ab09a19ea99e01a871db81b72282654655993",
          "path": "skills/packages/SKILL.md",
          "line": 9,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support. The instruction repository does not itself collect service data."
    },
    {
      "id": "connectivity:supports_task:ecosyste-ms/skills:ecosyste-ms/repos",
      "source": "ecosyste-ms/skills",
      "target": "ecosyste-ms/repos",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides instructions and API query examples for the repos service.",
      "source_references": [
        {
          "repository": "ecosyste-ms/skills",
          "commit": "ad1ab09a19ea99e01a871db81b72282654655993",
          "path": "skills/repos/SKILL.md",
          "line": 9,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support. The instruction repository does not itself collect service data."
    },
    {
      "id": "connectivity:supports_task:ecosyste-ms/skills:ecosyste-ms/advisories",
      "source": "ecosyste-ms/skills",
      "target": "ecosyste-ms/advisories",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides instructions and API query examples for the advisories service.",
      "source_references": [
        {
          "repository": "ecosyste-ms/skills",
          "commit": "ad1ab09a19ea99e01a871db81b72282654655993",
          "path": "skills/advisories/SKILL.md",
          "line": 9,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support. The instruction repository does not itself collect service data."
    },
    {
      "id": "connectivity:supports_task:ecosyste-ms/skills:ecosyste-ms/issues",
      "source": "ecosyste-ms/skills",
      "target": "ecosyste-ms/issues",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides instructions and API query examples for the issues service.",
      "source_references": [
        {
          "repository": "ecosyste-ms/skills",
          "commit": "ad1ab09a19ea99e01a871db81b72282654655993",
          "path": "skills/issues/SKILL.md",
          "line": 9,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support. The instruction repository does not itself collect service data."
    },
    {
      "id": "connectivity:supports_task:ecosyste-ms/skills:ecosyste-ms/commits",
      "source": "ecosyste-ms/skills",
      "target": "ecosyste-ms/commits",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides instructions and API query examples for the commits service.",
      "source_references": [
        {
          "repository": "ecosyste-ms/skills",
          "commit": "ad1ab09a19ea99e01a871db81b72282654655993",
          "path": "skills/commits/SKILL.md",
          "line": 9,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support. The instruction repository does not itself collect service data."
    },
    {
      "id": "connectivity:supports_task:ecosyste-ms/skills:ecosyste-ms/docker",
      "source": "ecosyste-ms/skills",
      "target": "ecosyste-ms/docker",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides instructions and API query examples for the docker service.",
      "source_references": [
        {
          "repository": "ecosyste-ms/skills",
          "commit": "ad1ab09a19ea99e01a871db81b72282654655993",
          "path": "skills/docker/SKILL.md",
          "line": 9,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support. The instruction repository does not itself collect service data."
    },
    {
      "id": "connectivity:supports_task:git-pkgs/skills:git-pkgs/brief",
      "source": "git-pkgs/skills",
      "target": "git-pkgs/brief",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides assistant workflows for using brief.",
      "source_references": [
        {
          "repository": "git-pkgs/skills",
          "commit": "a0b0f35e120def17440dd594dd2e8ad880aff7cb",
          "path": "skills/brief/SKILL.md",
          "line": 2,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support; no imported code or deployed data flow is implied."
    },
    {
      "id": "connectivity:supports_task:git-pkgs/skills:git-pkgs/forge",
      "source": "git-pkgs/skills",
      "target": "git-pkgs/forge",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides assistant workflows for using forge.",
      "source_references": [
        {
          "repository": "git-pkgs/skills",
          "commit": "a0b0f35e120def17440dd594dd2e8ad880aff7cb",
          "path": "skills/forge/SKILL.md",
          "line": 2,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support; no imported code or deployed data flow is implied."
    },
    {
      "id": "connectivity:supports_task:git-pkgs/skills:git-pkgs/pin",
      "source": "git-pkgs/skills",
      "target": "git-pkgs/pin",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides assistant workflows for using pin.",
      "source_references": [
        {
          "repository": "git-pkgs/skills",
          "commit": "a0b0f35e120def17440dd594dd2e8ad880aff7cb",
          "path": "skills/pin/SKILL.md",
          "line": 2,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support; no imported code or deployed data flow is implied."
    },
    {
      "id": "connectivity:supports_task:git-pkgs/skills:git-pkgs/capcheck",
      "source": "git-pkgs/skills",
      "target": "git-pkgs/capcheck",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides assistant workflows for using capcheck.",
      "source_references": [
        {
          "repository": "git-pkgs/skills",
          "commit": "a0b0f35e120def17440dd594dd2e8ad880aff7cb",
          "path": "skills/capcheck/SKILL.md",
          "line": 2,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Documented workflow support; no imported code or deployed data flow is implied."
    },
    {
      "id": "connectivity:supports_task:git-pkgs/skills:git-pkgs/git-pkgs",
      "source": "git-pkgs/skills",
      "target": "git-pkgs/git-pkgs",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides assistant workflows for dependency queries and analysis with git-pkgs.",
      "source_references": [
        {
          "repository": "git-pkgs/skills",
          "commit": "a0b0f35e120def17440dd594dd2e8ad880aff7cb",
          "path": "skills/init/SKILL.md",
          "line": 4,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:supports_task:git-pkgs/actions:git-pkgs/git-pkgs",
      "source": "git-pkgs/actions",
      "target": "git-pkgs/git-pkgs",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Installs and runs git-pkgs in repository automation, including dependency diffs, vulnerability checks and SBOM output.",
      "source_references": [
        {
          "repository": "git-pkgs/actions",
          "commit": "dc784fe1d639fd9b44f2ccdfad70976eac73c6ea",
          "path": "setup/action.yml",
          "line": 60,
          "basis": "source_reference"
        },
        {
          "repository": "git-pkgs/actions",
          "commit": "dc784fe1d639fd9b44f2ccdfad70976eac73c6ea",
          "path": "README.md",
          "line": 46,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Source inspected at the recorded revision; deployed operation was not tested."
    },
    {
      "id": "connectivity:supports_task:ecosyste-ms/export:ecosyste-ms/packages",
      "source": "ecosyste-ms/export",
      "target": "ecosyste-ms/packages",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Exports a service database to object storage and records the resulting export in the service; Packages is the documented example.",
      "source_references": [
        {
          "repository": "ecosyste-ms/export",
          "commit": "a7436dc9a0ed994e6fb9015cbc62383626151de8",
          "path": "readme.md",
          "line": 14,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/export",
          "commit": "a7436dc9a0ed994e6fb9015cbc62383626151de8",
          "path": "export.sh",
          "line": 23,
          "basis": "source_reference"
        }
      ],
      "data_nature": [],
      "assessment": "source_reference",
      "verification_note": "Generic export tool with a documented Packages use case; current scheduling was not verified."
    },
    {
      "id": "connectivity:supports_task:ecosyste-ms/typosquatting-dataset:andrew/typosquatting",
      "source": "ecosyste-ms/typosquatting-dataset",
      "target": "andrew/typosquatting",
      "kind": "supports_task",
      "direction": "source_to_target",
      "description": "Provides labelled package-name examples for evaluating typosquatting detection.",
      "source_references": [
        {
          "repository": "ecosyste-ms/typosquatting-dataset",
          "commit": "fd0bde98d200efe5c282a07edc4c68fba13252c6",
          "path": "README.md",
          "line": 5,
          "basis": "source_reference"
        }
      ],
      "data_nature": [
        "extrinsic"
      ],
      "assessment": "source_reference",
      "verification_note": "Documented evaluation corpus. Automatic ingestion into the tool or Packages was not established."
    },
    {
      "id": "connectivity:functional_overlap:git-pkgs/reuse:git-pkgs/licenses",
      "source": "git-pkgs/reuse",
      "target": "git-pkgs/licenses",
      "kind": "functional_overlap",
      "direction": "undirected",
      "description": "Both extract license evidence from software contents. REUSE reads explicit file annotations and declarations; Licenses detects license texts.",
      "source_references": [
        {
          "repository": "git-pkgs/reuse",
          "commit": "d9216df5ba8c6dbc319d875a4e81954c56356ec2",
          "path": "README.md",
          "line": 3,
          "basis": "source_reference"
        },
        {
          "repository": "git-pkgs/licenses",
          "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "data_nature": [
        "intrinsic"
      ],
      "assessment": "functional_comparison",
      "verification_note": "Shared license-evidence task with different inputs and coverage; no direct integration established."
    },
    {
      "id": "module:ecosyste-ms/archives:git-pkgs/markup",
      "source": "ecosyste-ms/archives",
      "target": "git-pkgs/markup",
      "kind": "module_dependency",
      "direction": "source_to_target",
      "description": "Archives uses Markup to render README and changelog contents extracted from archives.",
      "source_references": [
        {
          "repository": "ecosyste-ms/archives",
          "commit": "63d7a7887ab4d854f0ec3d7c8fae73fcd25fce86",
          "path": "cmd/server/main.go",
          "line": 73,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/archives",
          "commit": "63d7a7887ab4d854f0ec3d7c8fae73fcd25fce86",
          "path": "internal/handler/archives.go",
          "line": 144,
          "basis": "source_reference"
        },
        {
          "repository": "ecosyste-ms/archives",
          "commit": "63d7a7887ab4d854f0ec3d7c8fae73fcd25fce86",
          "path": "internal/archive/readme.go",
          "line": 223,
          "basis": "source_reference"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Traced from the public README HTTP handler through archive extraction to Markup rendering."
    },
    {
      "id": "personal:overlap:purl",
      "kind": "functional_overlap",
      "source": "andrew/purl",
      "target": "git-pkgs/purl",
      "direction": "undirected",
      "description": "Both provide package URL parsing and generation.",
      "evidence": [
        {
          "repository": "andrew/purl",
          "commit": "b4278d3acb1e09dadbc71bff07997fcd4d19d9f6",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/purl",
          "commit": "0cfbf6f91087fc7899b1c8e7e952bfc8c172c9e9",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "assessment": "functional_comparison",
      "verification_note": "Functional overlap; no cross-language dependency or data exchange is implied."
    },
    {
      "id": "personal:overlap:vers",
      "kind": "functional_overlap",
      "source": "andrew/vers",
      "target": "git-pkgs/vers",
      "direction": "undirected",
      "description": "Both provide version-range parsing and comparison.",
      "evidence": [
        {
          "repository": "andrew/vers",
          "commit": "02432b51116d55fcb20b524706c3babac9dac486",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/vers",
          "commit": "a2aa5bb667275e9a4ecf7a1eeb07760494558004",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "assessment": "functional_comparison",
      "verification_note": "Functional overlap; no cross-language dependency or data exchange is implied."
    },
    {
      "id": "personal:overlap:sarif",
      "kind": "functional_overlap",
      "source": "andrew/sarif",
      "target": "git-pkgs/sarif",
      "direction": "undirected",
      "description": "Both provide structured SARIF report handling.",
      "evidence": [
        {
          "repository": "andrew/sarif",
          "commit": "81ee77d4f3d09b3d2012de4d346ff1938240a88b",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/sarif",
          "commit": "fe6de84035a6302d08e729cb746ca4a66dcb4506",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "assessment": "functional_comparison",
      "verification_note": "Functional overlap; no cross-language dependency or data exchange is implied."
    },
    {
      "id": "personal:overlap:sbom",
      "kind": "functional_overlap",
      "source": "andrew/sbom",
      "target": "git-pkgs/sbom",
      "direction": "undirected",
      "description": "Both provide software inventory parsing and generation.",
      "evidence": [
        {
          "repository": "andrew/sbom",
          "commit": "9565b6c57c089aa21df19639eeba21acab6eb875",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/sbom",
          "commit": "f23464671ebf1fb8e92ab70d61059e44f6ed6659",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "assessment": "functional_comparison",
      "verification_note": "Functional overlap; no cross-language dependency or data exchange is implied."
    },
    {
      "id": "personal:overlap:changelog-parser",
      "kind": "functional_overlap",
      "source": "andrew/changelog-parser",
      "target": "git-pkgs/changelog",
      "direction": "undirected",
      "description": "Both provide structured changelog parsing.",
      "evidence": [
        {
          "repository": "andrew/changelog-parser",
          "commit": "0bc7738ac74251f435132e5108676b5279120aec",
          "path": "README.md",
          "basis": "repository_documentation"
        },
        {
          "repository": "git-pkgs/changelog",
          "commit": "e594ba2fdf4df8d065f51a2aaa77141d64607fc2",
          "path": "README.md",
          "basis": "repository_documentation"
        }
      ],
      "assessment": "functional_comparison",
      "verification_note": "Functional overlap; no cross-language dependency or data exchange is implied."
    },
    {
      "id": "personal:flow:ecosyste-ms/packages:andrew/purl",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "andrew/purl",
      "direction": "source_to_target",
      "description": "Package lookup retrieves package and version records from Packages.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "andrew/purl",
          "commit": "b4278d3acb1e09dadbc71bff07997fcd4d19d9f6",
          "path": "lib/purl/lookup.rb",
          "basis": "source_reference",
          "line": 39
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Source-confirmed service use; live execution and deployment coverage were not tested."
    },
    {
      "id": "personal:flow:ecosyste-ms/repos:andrew/purl",
      "kind": "data_flow",
      "source": "ecosyste-ms/repos",
      "target": "andrew/purl",
      "direction": "source_to_target",
      "description": "Repository lookup retrieves repository metadata from Repos when package lookup has no result.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "andrew/purl",
          "commit": "b4278d3acb1e09dadbc71bff07997fcd4d19d9f6",
          "path": "lib/purl/lookup.rb",
          "basis": "source_reference",
          "line": 66
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Source-confirmed service use; live execution and deployment coverage were not tested."
    },
    {
      "id": "personal:flow:ecosyste-ms/advisories:andrew/purl",
      "kind": "data_flow",
      "source": "ecosyste-ms/advisories",
      "target": "andrew/purl",
      "direction": "source_to_target",
      "description": "Advisory lookup retrieves package advisories from Advisories.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "andrew/purl",
          "commit": "b4278d3acb1e09dadbc71bff07997fcd4d19d9f6",
          "path": "lib/purl/advisory.rb",
          "basis": "source_reference",
          "line": 11
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Source-confirmed service use; live execution and deployment coverage were not tested."
    },
    {
      "id": "personal:flow:ecosyste-ms/packages:andrew/typosquatting",
      "kind": "data_flow",
      "source": "ecosyste-ms/packages",
      "target": "andrew/typosquatting",
      "direction": "source_to_target",
      "description": "Candidate lookup checks package publication records through Packages.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "andrew/typosquatting",
          "commit": "70aa46db9f5a2a1ba526f2588b734f9e45a6bb72",
          "path": "lib/typosquatting/lookup.rb",
          "basis": "source_reference",
          "line": 11
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Source-confirmed service use; live execution and deployment coverage were not tested."
    },
    {
      "id": "personal:flow:ecosyste-ms/awesome:andrew/ultimate-awesome",
      "kind": "data_flow",
      "source": "ecosyste-ms/awesome",
      "target": "andrew/ultimate-awesome",
      "direction": "source_to_target",
      "description": "The update workflow downloads the Awesome Markdown export and publishes it as the repository README.",
      "data_nature": [
        "extrinsic"
      ],
      "source_references": [
        {
          "repository": "andrew/ultimate-awesome",
          "commit": "d457c48223f2106a7ce6f34f35a1526247b4808d",
          "path": ".github/workflows/update.yml",
          "basis": "source_reference",
          "line": 21
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Source-confirmed service use; live execution and deployment coverage were not tested."
    },
    {
      "id": "personal:module:ecosyste-ms/diff:andrew/diffoscope",
      "kind": "module_dependency",
      "source": "ecosyste-ms/diff",
      "target": "andrew/diffoscope",
      "direction": "source_to_target",
      "description": "Diff calls the diffoscope library to compare the two requested artifacts.",
      "source_references": [
        {
          "repository": "ecosyste-ms/diff",
          "commit": "4c6a7adac9d7e5305dc2d4fff9370bedd540d0f1",
          "path": "app/models/job.rb",
          "basis": "source_reference",
          "line": 53
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Ruby library use confirmed in source."
    },
    {
      "id": "personal:module:andrew/diffoscope:andrew/purl",
      "kind": "module_dependency",
      "source": "andrew/diffoscope",
      "target": "andrew/purl",
      "direction": "source_to_target",
      "description": "Diffoscope uses PURL parsing and download URL resolution when comparing package artifacts.",
      "source_references": [
        {
          "repository": "andrew/diffoscope",
          "commit": "6302b86137df7a7c44db8777d5c62ad9a935f5d0",
          "path": "lib/diffoscope/resolver.rb",
          "basis": "source_reference",
          "line": 53
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Ruby library use confirmed in source."
    },
    {
      "id": "personal:module:andrew/sbom:andrew/purl",
      "kind": "module_dependency",
      "source": "andrew/sbom",
      "target": "andrew/purl",
      "direction": "source_to_target",
      "description": "SBOM uses PURL parsing and generation for component identifiers.",
      "source_references": [
        {
          "repository": "andrew/sbom",
          "commit": "9565b6c57c089aa21df19639eeba21acab6eb875",
          "path": "lib/sbom/data/package.rb",
          "basis": "source_reference",
          "line": 303
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Ruby library use confirmed in source."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/archives",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/archives",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/archives in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/license_artifacts.go",
          "line": 14,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/artifacts",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/artifacts",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/artifacts in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/license_artifacts.go",
          "line": 15,
          "import": "github.com/git-pkgs/artifacts/acquire",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/artifactcache/store.go",
          "line": 19,
          "import": "github.com/git-pkgs/artifacts",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/artifactcache/store.go",
          "line": 20,
          "import": "github.com/git-pkgs/artifacts/acquire",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/artifactregistry/client.go",
          "line": 10,
          "import": "github.com/git-pkgs/artifacts/acquire",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/changelog",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/changelog",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/changelog in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/changelog.go",
          "line": 12,
          "import": "github.com/git-pkgs/changelog",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/enrichment",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/enrichment",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/enrichment in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/enrichment.go",
          "line": 8,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/freshness.go",
          "line": 11,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/funding.go",
          "line": 10,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/health.go",
          "line": 11,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/licenses.go",
          "line": 16,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/maintainers.go",
          "line": 11,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/version_status.go",
          "line": 4,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/gitignore",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/gitignore",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/gitignore in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/where.go",
          "line": 14,
          "import": "github.com/git-pkgs/gitignore",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/analyzer/analyzer.go",
          "line": 14,
          "import": "github.com/git-pkgs/gitignore",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/integrity",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/integrity",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/integrity in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/license_artifacts.go",
          "line": 19,
          "import": "github.com/git-pkgs/integrity",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/artifactcache/store.go",
          "line": 21,
          "import": "github.com/git-pkgs/integrity",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/artifactregistry/client.go",
          "line": 11,
          "import": "github.com/git-pkgs/integrity",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/licenses",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/licenses",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/licenses in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/license_artifacts.go",
          "line": 20,
          "import": "github.com/git-pkgs/licenses",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/licenses.go",
          "line": 19,
          "import": "github.com/git-pkgs/licenses",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/managers",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/managers",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/managers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/add.go",
          "line": 9,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/browse.go",
          "line": 12,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/browse.go",
          "line": 13,
          "import": "github.com/git-pkgs/managers/definitions",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/install.go",
          "line": 8,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/managers.go",
          "line": 14,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/managers.go",
          "line": 15,
          "import": "github.com/git-pkgs/managers/definitions",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/remove.go",
          "line": 10,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/replace.go",
          "line": 12,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/resolve.go",
          "line": 11,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/update.go",
          "line": 9,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/vendor.go",
          "line": 8,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/manifests",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/manifests",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/manifests in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/diff_driver.go",
          "line": 13,
          "import": "github.com/git-pkgs/manifests",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/diff_file.go",
          "line": 10,
          "import": "github.com/git-pkgs/manifests",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/ecosystems.go",
          "line": 9,
          "import": "github.com/git-pkgs/manifests",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/sbom_root_license.go",
          "line": 11,
          "import": "github.com/git-pkgs/manifests",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/where.go",
          "line": 15,
          "import": "github.com/git-pkgs/manifests",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/analyzer/analyzer.go",
          "line": 15,
          "import": "github.com/git-pkgs/manifests",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/changelog.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/deprecated.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/ecosystems.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/freshness.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/funding.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/health.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/helpers.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/license_artifacts.go",
          "line": 21,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/licenses.go",
          "line": 20,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/maintainers.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/outdated.go",
          "line": 11,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/provenance.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/sbom.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/urls.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/vulns.go",
          "line": 20,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/config/ecosystems.go",
          "line": 9,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/registries",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/registries",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/registries in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/deprecated.go",
          "line": 14,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/deprecated.go",
          "line": 15,
          "import": "github.com/git-pkgs/registries/all",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/ecosystems.go",
          "line": 11,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/license_artifacts.go",
          "line": 22,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/urls.go",
          "line": 11,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/urls.go",
          "line": 12,
          "import": "github.com/git-pkgs/registries/all",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/artifactregistry/client.go",
          "line": 12,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/artifactregistry/client.go",
          "line": 13,
          "import": "github.com/git-pkgs/registries/all",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "internal/artifactregistry/client.go",
          "line": 14,
          "import": "github.com/git-pkgs/registries/fetch",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/resolve",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/resolve",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/resolve in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/remove.go",
          "line": 11,
          "import": "github.com/git-pkgs/resolve",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/remove.go",
          "line": 12,
          "import": "github.com/git-pkgs/resolve/parsers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/resolve.go",
          "line": 12,
          "import": "github.com/git-pkgs/resolve",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/resolve.go",
          "line": 13,
          "import": "github.com/git-pkgs/resolve/parsers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/sarif",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/sarif",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/sarif in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/vulns.go",
          "line": 21,
          "import": "github.com/git-pkgs/sarif",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/sbom",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/sbom",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/sbom in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/sbom.go",
          "line": 15,
          "import": "github.com/git-pkgs/sbom",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/spdx",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/spdx",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/spdx in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/licenses.go",
          "line": 21,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/sbom_root_license.go",
          "line": 12,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/vers",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/vers",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/vers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/freshness.go",
          "line": 15,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/outdated.go",
          "line": 12,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/sbom.go",
          "line": 16,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/vulns.go",
          "line": 22,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-pkgs:git-pkgs/vulns",
      "kind": "module_dependency",
      "source": "git-pkgs/git-pkgs",
      "target": "git-pkgs/vulns",
      "direction": "source_to_target",
      "description": "git-pkgs/git-pkgs directly imports git-pkgs/vulns in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/vulns.go",
          "line": 23,
          "import": "github.com/git-pkgs/vulns",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-pkgs",
          "commit": "eae84845c9d4e50979c95fe8805c6f69b25138ec",
          "path": "cmd/vulns.go",
          "line": 24,
          "import": "github.com/git-pkgs/vulns/osv",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/manifests:git-pkgs/pom",
      "kind": "module_dependency",
      "source": "git-pkgs/manifests",
      "target": "git-pkgs/pom",
      "direction": "source_to_target",
      "description": "git-pkgs/manifests directly imports git-pkgs/pom in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/manifests",
          "commit": "99bbda20167c3d2ab3146f94fdf19aed38ce36d2",
          "path": "internal/maven/declarations.go",
          "line": 8,
          "import": "github.com/git-pkgs/pom",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/manifests",
          "commit": "99bbda20167c3d2ab3146f94fdf19aed38ce36d2",
          "path": "internal/maven/maven.go",
          "line": 11,
          "import": "github.com/git-pkgs/pom",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/manifests:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/manifests",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/manifests directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/manifests",
          "commit": "99bbda20167c3d2ab3146f94fdf19aed38ce36d2",
          "path": "manifests.go",
          "line": 22,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/registries:git-pkgs/artifacts",
      "kind": "module_dependency",
      "source": "git-pkgs/registries",
      "target": "git-pkgs/artifacts",
      "direction": "source_to_target",
      "description": "git-pkgs/registries directly imports git-pkgs/artifacts in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "fetch/observation.go",
          "line": 13,
          "import": "github.com/git-pkgs/artifacts",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/registries:git-pkgs/pom",
      "kind": "module_dependency",
      "source": "git-pkgs/registries",
      "target": "git-pkgs/pom",
      "direction": "source_to_target",
      "description": "git-pkgs/registries directly imports git-pkgs/pom in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "internal/maven/maven.go",
          "line": 13,
          "import": "github.com/git-pkgs/pom",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/registries:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/registries",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/registries directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "internal/core/helpers.go",
          "line": 7,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "internal/npm/npm.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "registries.go",
          "line": 38,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/registries:git-pkgs/spdx",
      "kind": "module_dependency",
      "source": "git-pkgs/registries",
      "target": "git-pkgs/spdx",
      "direction": "source_to_target",
      "description": "git-pkgs/registries directly imports git-pkgs/spdx in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "internal/core/license.go",
          "line": 6,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/registries:git-pkgs/vers",
      "kind": "module_dependency",
      "source": "git-pkgs/registries",
      "target": "git-pkgs/vers",
      "direction": "source_to_target",
      "description": "git-pkgs/registries directly imports git-pkgs/vers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "internal/core/helpers.go",
          "line": 8,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/registries",
          "commit": "23c15a81775d1acb7f2a07f82c56f71e21bc0694",
          "path": "internal/helm/helm.go",
          "line": 16,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/enrichment:ecosyste-ms/ecosystems-go",
      "kind": "module_dependency",
      "source": "git-pkgs/enrichment",
      "target": "ecosyste-ms/ecosystems-go",
      "direction": "source_to_target",
      "description": "git-pkgs/enrichment directly imports ecosyste-ms/ecosystems-go in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "ecosystems.go",
          "line": 9,
          "import": "github.com/ecosyste-ms/ecosystems-go",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "ecosystems.go",
          "line": 10,
          "import": "github.com/ecosyste-ms/ecosystems-go/packages",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/enrichment:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/enrichment",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/enrichment directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "depsdev.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "hybrid.go",
          "line": 7,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "registries.go",
          "line": 6,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "vulnerabilities.go",
          "line": 8,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/enrichment:git-pkgs/registries",
      "kind": "module_dependency",
      "source": "git-pkgs/enrichment",
      "target": "git-pkgs/registries",
      "direction": "source_to_target",
      "description": "git-pkgs/enrichment directly imports git-pkgs/registries in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "ecosystems.go",
          "line": 11,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "registries.go",
          "line": 7,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "registries.go",
          "line": 8,
          "import": "github.com/git-pkgs/registries/all",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "registries.go",
          "line": 9,
          "import": "github.com/git-pkgs/registries/client",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/enrichment:git-pkgs/spdx",
      "kind": "module_dependency",
      "source": "git-pkgs/enrichment",
      "target": "git-pkgs/spdx",
      "direction": "source_to_target",
      "description": "git-pkgs/enrichment directly imports git-pkgs/spdx in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "helpers.go",
          "line": 6,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/enrichment:git-pkgs/vers",
      "kind": "module_dependency",
      "source": "git-pkgs/enrichment",
      "target": "git-pkgs/vers",
      "direction": "source_to_target",
      "description": "git-pkgs/enrichment directly imports git-pkgs/vers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "helpers.go",
          "line": 7,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "vulnerabilities.go",
          "line": 9,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/enrichment:git-pkgs/vulns",
      "kind": "module_dependency",
      "source": "git-pkgs/enrichment",
      "target": "git-pkgs/vulns",
      "direction": "source_to_target",
      "description": "git-pkgs/enrichment directly imports git-pkgs/vulns in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "vulnerabilities.go",
          "line": 10,
          "import": "github.com/git-pkgs/vulns",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/enrichment",
          "commit": "020c6e1ea7617f65253dd5d135eff77eb9558baa",
          "path": "vulnerabilities.go",
          "line": 11,
          "import": "github.com/git-pkgs/vulns/osv",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/purl:git-pkgs/vers",
      "kind": "module_dependency",
      "source": "git-pkgs/purl",
      "target": "git-pkgs/vers",
      "direction": "source_to_target",
      "description": "git-pkgs/purl directly imports git-pkgs/vers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/purl",
          "commit": "0cfbf6f91087fc7899b1c8e7e952bfc8c172c9e9",
          "path": "makepurl.go",
          "line": 6,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/resolve:git-pkgs/managers",
      "kind": "module_dependency",
      "source": "git-pkgs/resolve",
      "target": "git-pkgs/managers",
      "direction": "source_to_target",
      "description": "git-pkgs/resolve directly imports git-pkgs/managers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/resolve",
          "commit": "59be154c0eb8846d0b77a6e6d9af24a444ad3d00",
          "path": "resolve_deps.go",
          "line": 11,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/resolve",
          "commit": "59be154c0eb8846d0b77a6e6d9af24a444ad3d00",
          "path": "resolve_deps.go",
          "line": 12,
          "import": "github.com/git-pkgs/managers/definitions",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/resolve:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/resolve",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/resolve directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/resolve",
          "commit": "59be154c0eb8846d0b77a6e6d9af24a444ad3d00",
          "path": "resolve.go",
          "line": 7,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/provides:git-pkgs/archives",
      "kind": "module_dependency",
      "source": "git-pkgs/provides",
      "target": "git-pkgs/archives",
      "direction": "source_to_target",
      "description": "git-pkgs/provides directly imports git-pkgs/archives in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "artifacts/cargo.go",
          "line": 9,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "artifacts/common.go",
          "line": 12,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "artifacts/golang.go",
          "line": 9,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "artifacts/java.go",
          "line": 12,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "artifacts/npm.go",
          "line": 7,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "artifacts/python.go",
          "line": 11,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/provides:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/provides",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/provides directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "artifacts/common.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "bindings/cargo.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "bindings/deno.go",
          "line": 9,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "bindings/golist.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "bindings/npm.go",
          "line": 9,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "catalog.go",
          "line": 8,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/provides",
          "commit": "6c4b67fb01afd2249b34538173616a60ca8a4aa0",
          "path": "heuristic/heuristic.go",
          "line": 23,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/archives:git-pkgs/magic",
      "kind": "module_dependency",
      "source": "git-pkgs/archives",
      "target": "git-pkgs/magic",
      "direction": "source_to_target",
      "description": "git-pkgs/archives directly imports git-pkgs/magic in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/archives",
          "commit": "acad49ddba4999e66c36643960cf3f06daeee197",
          "path": "archives.go",
          "line": 25,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/archives",
          "commit": "acad49ddba4999e66c36643960cf3f06daeee197",
          "path": "diff/diff.go",
          "line": 12,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/licenses:git-pkgs/magic",
      "kind": "module_dependency",
      "source": "git-pkgs/licenses",
      "target": "git-pkgs/magic",
      "direction": "source_to_target",
      "description": "git-pkgs/licenses directly imports git-pkgs/magic in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/licenses",
          "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
          "path": "scan.go",
          "line": 22,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/licenses:git-pkgs/manifests",
      "kind": "module_dependency",
      "source": "git-pkgs/licenses",
      "target": "git-pkgs/manifests",
      "direction": "source_to_target",
      "description": "git-pkgs/licenses directly imports git-pkgs/manifests in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/licenses",
          "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
          "path": "scan.go",
          "line": 23,
          "import": "github.com/git-pkgs/manifests",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/licenses:git-pkgs/spdx",
      "kind": "module_dependency",
      "source": "git-pkgs/licenses",
      "target": "git-pkgs/spdx",
      "direction": "source_to_target",
      "description": "git-pkgs/licenses directly imports git-pkgs/spdx in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/licenses",
          "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
          "path": "scan.go",
          "line": 24,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/licenses",
          "commit": "878adf42dcc7c44aa29df48584dc69c17ae12077",
          "path": "spdx.go",
          "line": 11,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/git-spdx:git-pkgs/licenses",
      "kind": "module_dependency",
      "source": "git-pkgs/git-spdx",
      "target": "git-pkgs/licenses",
      "direction": "source_to_target",
      "description": "git-pkgs/git-spdx directly imports git-pkgs/licenses in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/git-spdx",
          "commit": "522d4603703cfa625914f222830fc6b7ba78e744",
          "path": "history.go",
          "line": 16,
          "import": "github.com/git-pkgs/licenses",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/git-spdx",
          "commit": "522d4603703cfa625914f222830fc6b7ba78e744",
          "path": "main.go",
          "line": 24,
          "import": "github.com/git-pkgs/licenses",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/changelog:git-pkgs/vers",
      "kind": "module_dependency",
      "source": "git-pkgs/changelog",
      "target": "git-pkgs/vers",
      "direction": "source_to_target",
      "description": "git-pkgs/changelog directly imports git-pkgs/vers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/changelog",
          "commit": "e594ba2fdf4df8d065f51a2aaa77141d64607fc2",
          "path": "changelog.go",
          "line": 32,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/forge:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/forge",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/forge directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/forge",
          "commit": "70caf18ac5059dbb877d26f2b191d24d4805723a",
          "path": "forge.go",
          "line": 12,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/archives",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/archives",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/archives in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "cmd/brief/inspect.go",
          "line": 24,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/bibtex",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/bibtex",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/bibtex in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/bibtex.go",
          "line": 8,
          "import": "github.com/git-pkgs/bibtex",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/citation",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/citation",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/citation in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/citation.go",
          "line": 7,
          "import": "github.com/git-pkgs/citation",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/clone",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/clone",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/clone in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "remote/remote.go",
          "line": 13,
          "import": "github.com/git-pkgs/clone",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/codemeta",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/codemeta",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/codemeta in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/codemeta.go",
          "line": 8,
          "import": "github.com/git-pkgs/codemeta",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/enrichment",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/enrichment",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/enrichment in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "cmd/brief/enrich.go",
          "line": 20,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "cmd/brief/enrich.go",
          "line": 21,
          "import": "github.com/git-pkgs/enrichment/endoflife",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "cmd/brief/enrich.go",
          "line": 22,
          "import": "github.com/git-pkgs/enrichment/scorecard",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/forge",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/forge",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/forge in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "remote/remote.go",
          "line": 14,
          "import": "github.com/git-pkgs/forge",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/magic",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/magic",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/magic in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "cmd/brief/inspect.go",
          "line": 25,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/manifests",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/manifests",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/manifests in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/detect.go",
          "line": 27,
          "import": "github.com/git-pkgs/manifests",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/outline",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/outline",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/outline in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "cmd/brief/outline.go",
          "line": 13,
          "import": "github.com/git-pkgs/outline",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "remote/remote.go",
          "line": 15,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/registries",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/registries",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/registries in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "remote/remote.go",
          "line": 16,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "remote/remote.go",
          "line": 17,
          "import": "github.com/git-pkgs/registries/all",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/roles",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/roles",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/roles in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/detect.go",
          "line": 28,
          "import": "github.com/git-pkgs/roles",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/roles.go",
          "line": 7,
          "import": "github.com/git-pkgs/roles",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/brief:git-pkgs/spdx",
      "kind": "module_dependency",
      "source": "git-pkgs/brief",
      "target": "git-pkgs/spdx",
      "direction": "source_to_target",
      "description": "git-pkgs/brief directly imports git-pkgs/spdx in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/brief",
          "commit": "cb20cb5578fc8bb7afd53c1ae7e91ac9270f33da",
          "path": "detect/detect.go",
          "line": 29,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/outline:git-pkgs/gitignore",
      "kind": "module_dependency",
      "source": "git-pkgs/outline",
      "target": "git-pkgs/gitignore",
      "direction": "source_to_target",
      "description": "git-pkgs/outline directly imports git-pkgs/gitignore in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/outline",
          "commit": "62172fe572b40569208b040ac3b671e602bee63e",
          "path": "build.go",
          "line": 15,
          "import": "github.com/git-pkgs/gitignore",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/outline",
          "commit": "62172fe572b40569208b040ac3b671e602bee63e",
          "path": "pack.go",
          "line": 11,
          "import": "github.com/git-pkgs/gitignore",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/outline:git-pkgs/magic",
      "kind": "module_dependency",
      "source": "git-pkgs/outline",
      "target": "git-pkgs/magic",
      "direction": "source_to_target",
      "description": "git-pkgs/outline directly imports git-pkgs/magic in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/outline",
          "commit": "62172fe572b40569208b040ac3b671e602bee63e",
          "path": "pack.go",
          "line": 12,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/distill:git-pkgs/enrichment",
      "kind": "module_dependency",
      "source": "git-pkgs/distill",
      "target": "git-pkgs/enrichment",
      "direction": "source_to_target",
      "description": "git-pkgs/distill directly imports git-pkgs/enrichment in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/distill",
          "commit": "0bcc406baa1364a11d249514c27e3878e9db89d7",
          "path": "cmd/distill/classify.go",
          "line": 17,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/distill",
          "commit": "0bcc406baa1364a11d249514c27e3878e9db89d7",
          "path": "cmd/distill/corpus.go",
          "line": 11,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/distill",
          "commit": "0bcc406baa1364a11d249514c27e3878e9db89d7",
          "path": "cmd/distill/extract.go",
          "line": 12,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/distill",
          "commit": "0bcc406baa1364a11d249514c27e3878e9db89d7",
          "path": "cmd/distill/gather.go",
          "line": 12,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/distill:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/distill",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/distill directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/distill",
          "commit": "0bcc406baa1364a11d249514c27e3878e9db89d7",
          "path": "cmd/distill/gather.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/languages:git-pkgs/magic",
      "kind": "module_dependency",
      "source": "git-pkgs/languages",
      "target": "git-pkgs/magic",
      "direction": "source_to_target",
      "description": "git-pkgs/languages directly imports git-pkgs/magic in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/languages",
          "commit": "0ebb33cb7dfcb9cc04a2863ba9bee51d3b746891",
          "path": "analyze.go",
          "line": 8,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/languages",
          "commit": "0ebb33cb7dfcb9cc04a2863ba9bee51d3b746891",
          "path": "encoding.go",
          "line": 9,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/languages",
          "commit": "0ebb33cb7dfcb9cc04a2863ba9bee51d3b746891",
          "path": "encoding_stream.go",
          "line": 6,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/languages",
          "commit": "0ebb33cb7dfcb9cc04a2863ba9bee51d3b746891",
          "path": "reader.go",
          "line": 9,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/languages:git-pkgs/scan",
      "kind": "module_dependency",
      "source": "git-pkgs/languages",
      "target": "git-pkgs/scan",
      "direction": "source_to_target",
      "description": "git-pkgs/languages directly imports git-pkgs/scan in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/languages",
          "commit": "0ebb33cb7dfcb9cc04a2863ba9bee51d3b746891",
          "path": "heuristics.go",
          "line": 7,
          "import": "github.com/git-pkgs/scan",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/clone:git-pkgs/magic",
      "kind": "module_dependency",
      "source": "git-pkgs/clone",
      "target": "git-pkgs/magic",
      "direction": "source_to_target",
      "description": "git-pkgs/clone directly imports git-pkgs/magic in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/clone",
          "commit": "b9842889da5a6bdaef5e18011908e7ec037c4917",
          "path": "blob.go",
          "line": 13,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/clone",
          "commit": "b9842889da5a6bdaef5e18011908e7ec037c4917",
          "path": "gogit/blob.go",
          "line": 12,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/clone:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/clone",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/clone directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/clone",
          "commit": "b9842889da5a6bdaef5e18011908e7ec037c4917",
          "path": "submodule.go",
          "line": 12,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/vulns:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/vulns",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/vulns directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "depsdev/depsdev.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "ghsa/ghsa.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "grypedb/grypedb.go",
          "line": 20,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "nvd/nvd.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "osv/osv.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "vl/vl.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "vulncheck/vulncheck.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "vulns.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/vulns:git-pkgs/vers",
      "kind": "module_dependency",
      "source": "git-pkgs/vulns",
      "target": "git-pkgs/vers",
      "direction": "source_to_target",
      "description": "git-pkgs/vulns directly imports git-pkgs/vers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/vulns",
          "commit": "89a5afebe71f77b1ecc8d4000ac6c2b200e3b9da",
          "path": "affected.go",
          "line": 4,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/signals:git-pkgs/history",
      "kind": "module_dependency",
      "source": "git-pkgs/signals",
      "target": "git-pkgs/history",
      "direction": "source_to_target",
      "description": "git-pkgs/signals directly imports git-pkgs/history in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/signals",
          "commit": "addc7cb43363d030f7c55184c9fdd004ed7f22d8",
          "path": "history.go",
          "line": 14,
          "import": "github.com/git-pkgs/history",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/secrets:git-pkgs/history",
      "kind": "module_dependency",
      "source": "git-pkgs/secrets",
      "target": "git-pkgs/history",
      "direction": "source_to_target",
      "description": "git-pkgs/secrets directly imports git-pkgs/history in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "scan.go",
          "line": 20,
          "import": "github.com/git-pkgs/history",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "validate.go",
          "line": 9,
          "import": "github.com/git-pkgs/history",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/secrets:git-pkgs/magic",
      "kind": "module_dependency",
      "source": "git-pkgs/secrets",
      "target": "git-pkgs/magic",
      "direction": "source_to_target",
      "description": "git-pkgs/secrets directly imports git-pkgs/magic in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "scan.go",
          "line": 21,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/secrets:git-pkgs/sarif",
      "kind": "module_dependency",
      "source": "git-pkgs/secrets",
      "target": "git-pkgs/sarif",
      "direction": "source_to_target",
      "description": "git-pkgs/secrets directly imports git-pkgs/sarif in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "sarif.go",
          "line": 8,
          "import": "github.com/git-pkgs/sarif",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/secrets:git-pkgs/scan",
      "kind": "module_dependency",
      "source": "git-pkgs/secrets",
      "target": "git-pkgs/scan",
      "direction": "source_to_target",
      "description": "git-pkgs/secrets directly imports git-pkgs/scan in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "internal/scandb/database.go",
          "line": 10,
          "import": "github.com/git-pkgs/scan",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/secrets",
          "commit": "3656f66df2c6c76070b5254568854d36a60046cb",
          "path": "prefilter_scan.go",
          "line": 15,
          "import": "github.com/git-pkgs/scan",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/artifacts:git-pkgs/integrity",
      "kind": "module_dependency",
      "source": "git-pkgs/artifacts",
      "target": "git-pkgs/integrity",
      "direction": "source_to_target",
      "description": "git-pkgs/artifacts directly imports git-pkgs/integrity in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/artifacts",
          "commit": "fd25f2d9eed3c17d0f517fb69b5f762404ef7e64",
          "path": "acquire/acquire.go",
          "line": 12,
          "import": "github.com/git-pkgs/integrity",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/artifacts:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/artifacts",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/artifacts directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/artifacts",
          "commit": "fd25f2d9eed3c17d0f517fb69b5f762404ef7e64",
          "path": "acquire/acquire.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/artifacts",
          "commit": "fd25f2d9eed3c17d0f517fb69b5f762404ef7e64",
          "path": "artifact.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/archives",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/archives",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/archives in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/browse.go",
          "line": 14,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/browse.go",
          "line": 15,
          "import": "github.com/git-pkgs/archives/diff",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/browse_archive.go",
          "line": 11,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/server.go",
          "line": 68,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/artifacts",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/artifacts",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/artifacts in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/database/queries.go",
          "line": 10,
          "import": "github.com/git-pkgs/artifacts",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/database/types.go",
          "line": 9,
          "import": "github.com/git-pkgs/artifacts",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/handler.go",
          "line": 19,
          "import": "github.com/git-pkgs/artifacts",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/cooldown",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/cooldown",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/cooldown in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/config/retention.go",
          "line": 11,
          "import": "github.com/git-pkgs/cooldown",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/cooldownpolicy/policy.go",
          "line": 11,
          "import": "github.com/git-pkgs/cooldown",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/handler.go",
          "line": 20,
          "import": "github.com/git-pkgs/cooldown",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/server.go",
          "line": 69,
          "import": "github.com/git-pkgs/cooldown",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/enrichment",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/enrichment",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/enrichment in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/api.go",
          "line": 8,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/integrity",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/integrity",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/integrity in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/integrity.go",
          "line": 7,
          "import": "github.com/git-pkgs/integrity",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/magic",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/magic",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/magic in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/browse.go",
          "line": 16,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/browse_archive.go",
          "line": 12,
          "import": "github.com/git-pkgs/magic",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/config/config.go",
          "line": 79,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/config/retention.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/database/queries.go",
          "line": 11,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/denylist/denylist.go",
          "line": 8,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/enrichment/enrichment.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/apk.go",
          "line": 11,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/composer.go",
          "line": 17,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/conda.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/container.go",
          "line": 17,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/debian.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/handler.go",
          "line": 27,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/maven.go",
          "line": 11,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/nuget.go",
          "line": 11,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/rpm.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/swift.go",
          "line": 19,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/metrics/metrics.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/mirror/source.go",
          "line": 10,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/packageurl/packageurl.go",
          "line": 7,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/retention/retention.go",
          "line": 17,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/api.go",
          "line": 11,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/registries",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/registries",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/registries in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/enrichment/enrichment.go",
          "line": 14,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/enrichment/enrichment.go",
          "line": 15,
          "import": "github.com/git-pkgs/registries/all",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/artifact_size.go",
          "line": 10,
          "import": "github.com/git-pkgs/registries/fetch",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/go.go",
          "line": 10,
          "import": "github.com/git-pkgs/registries/fetch",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/handler/handler.go",
          "line": 28,
          "import": "github.com/git-pkgs/registries/fetch",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/mirror/source.go",
          "line": 11,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/mirror/source.go",
          "line": 12,
          "import": "github.com/git-pkgs/registries/all",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/server.go",
          "line": 84,
          "import": "github.com/git-pkgs/registries/fetch",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/server.go",
          "line": 85,
          "import": "github.com/git-pkgs/registries/safehttp",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/spdx",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/spdx",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/spdx in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/enrichment/enrichment.go",
          "line": 16,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/server/server.go",
          "line": 86,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/vers",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/vers",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/vers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/enrichment/enrichment.go",
          "line": 17,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/proxy:git-pkgs/vulns",
      "kind": "module_dependency",
      "source": "git-pkgs/proxy",
      "target": "git-pkgs/vulns",
      "direction": "source_to_target",
      "description": "git-pkgs/proxy directly imports git-pkgs/vulns in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/enrichment/enrichment.go",
          "line": 18,
          "import": "github.com/git-pkgs/vulns",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/proxy",
          "commit": "e0fb8be4d9fc49e1cda82f8beded6477c7cadf76",
          "path": "internal/enrichment/enrichment.go",
          "line": 19,
          "import": "github.com/git-pkgs/vulns/osv",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/archives",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/archives",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/archives in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/npm/npm.go",
          "line": 15,
          "import": "github.com/git-pkgs/archives",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/attestation",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/attestation",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/attestation in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/forge/github.go",
          "line": 12,
          "import": "github.com/git-pkgs/attestation",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/npm/provenance.go",
          "line": 9,
          "import": "github.com/git-pkgs/attestation",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/cooldown",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/cooldown",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/cooldown in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "manifest/manifest.go",
          "line": 10,
          "import": "github.com/git-pkgs/cooldown",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/npm/version.go",
          "line": 10,
          "import": "github.com/git-pkgs/cooldown",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/forge",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/forge",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/forge in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/forge/github.go",
          "line": 13,
          "import": "github.com/git-pkgs/forge/github",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/integrity",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/integrity",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/integrity in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "lock/cyclonedx.go",
          "line": 9,
          "import": "github.com/git-pkgs/integrity",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "verify.go",
          "line": 15,
          "import": "github.com/git-pkgs/integrity",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "manifest/manifest.go",
          "line": 11,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "outdated.go",
          "line": 11,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/forge/forge.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/forge/github.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/npm/npm.go",
          "line": 16,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/npm/version.go",
          "line": 11,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/rawurl/rawurl.go",
          "line": 14,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/source.go",
          "line": 27,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "verify.go",
          "line": 18,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/registries",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/registries",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/registries in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "client.go",
          "line": 9,
          "import": "github.com/git-pkgs/registries/client",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/forge/forge.go",
          "line": 15,
          "import": "github.com/git-pkgs/registries/client",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/npm/npm.go",
          "line": 17,
          "import": "github.com/git-pkgs/registries/client",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/npm/provenance.go",
          "line": 10,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/npm/signatures.go",
          "line": 15,
          "import": "github.com/git-pkgs/registries",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/rawurl/rawurl.go",
          "line": 15,
          "import": "github.com/git-pkgs/registries/client",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/sbom",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/sbom",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/sbom in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "sbomout.go",
          "line": 10,
          "import": "github.com/git-pkgs/sbom",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/sigstore",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/sigstore",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/sigstore in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "client.go",
          "line": 10,
          "import": "github.com/git-pkgs/sigstore",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/spdx",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/spdx",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/spdx in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "outdated.go",
          "line": 12,
          "import": "github.com/git-pkgs/spdx",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/pin:git-pkgs/vers",
      "kind": "module_dependency",
      "source": "git-pkgs/pin",
      "target": "git-pkgs/vers",
      "direction": "source_to_target",
      "description": "git-pkgs/pin directly imports git-pkgs/vers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "outdated.go",
          "line": 13,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/pin",
          "commit": "126d7d529939806b545a36049589ecd3b04d95d9",
          "path": "source/npm/version.go",
          "line": 12,
          "import": "github.com/git-pkgs/vers",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/dependents:git-pkgs/brief",
      "kind": "module_dependency",
      "source": "git-pkgs/dependents",
      "target": "git-pkgs/brief",
      "direction": "source_to_target",
      "description": "git-pkgs/dependents directly imports git-pkgs/brief in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "analyze.go",
          "line": 16,
          "import": "github.com/git-pkgs/brief",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "analyze.go",
          "line": 17,
          "import": "github.com/git-pkgs/brief/detect",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "analyze.go",
          "line": 18,
          "import": "github.com/git-pkgs/brief/kb",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/dependents:git-pkgs/clone",
      "kind": "module_dependency",
      "source": "git-pkgs/dependents",
      "target": "git-pkgs/clone",
      "direction": "source_to_target",
      "description": "git-pkgs/dependents directly imports git-pkgs/clone in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "checkout.go",
          "line": 7,
          "import": "github.com/git-pkgs/clone",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/dependents:git-pkgs/enrichment",
      "kind": "module_dependency",
      "source": "git-pkgs/dependents",
      "target": "git-pkgs/enrichment",
      "direction": "source_to_target",
      "description": "git-pkgs/dependents directly imports git-pkgs/enrichment in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/dependents",
          "commit": "06c8758333eecdca38b622ee113331e680fa1d03",
          "path": "candidate.go",
          "line": 11,
          "import": "github.com/git-pkgs/enrichment",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/downstream:git-pkgs/brief",
      "kind": "module_dependency",
      "source": "git-pkgs/downstream",
      "target": "git-pkgs/brief",
      "direction": "source_to_target",
      "description": "git-pkgs/downstream directly imports git-pkgs/brief in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/downstream",
          "commit": "3fc7654ab9c1575e4dc7d1e076e977cb0d3d47f5",
          "path": "internal/run/brief.go",
          "line": 6,
          "import": "github.com/git-pkgs/brief",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/downstream",
          "commit": "3fc7654ab9c1575e4dc7d1e076e977cb0d3d47f5",
          "path": "internal/run/brief.go",
          "line": 7,
          "import": "github.com/git-pkgs/brief/detect",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/downstream",
          "commit": "3fc7654ab9c1575e4dc7d1e076e977cb0d3d47f5",
          "path": "internal/run/brief.go",
          "line": 8,
          "import": "github.com/git-pkgs/brief/kb",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/downstream:git-pkgs/dependents",
      "kind": "module_dependency",
      "source": "git-pkgs/downstream",
      "target": "git-pkgs/dependents",
      "direction": "source_to_target",
      "description": "git-pkgs/downstream directly imports git-pkgs/dependents in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/downstream",
          "commit": "3fc7654ab9c1575e4dc7d1e076e977cb0d3d47f5",
          "path": "internal/discover/analyze.go",
          "line": 6,
          "import": "github.com/git-pkgs/dependents",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/downstream",
          "commit": "3fc7654ab9c1575e4dc7d1e076e977cb0d3d47f5",
          "path": "internal/discover/discover.go",
          "line": 12,
          "import": "github.com/git-pkgs/dependents",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/downstream:git-pkgs/managers",
      "kind": "module_dependency",
      "source": "git-pkgs/downstream",
      "target": "git-pkgs/managers",
      "direction": "source_to_target",
      "description": "git-pkgs/downstream directly imports git-pkgs/managers in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/downstream",
          "commit": "3fc7654ab9c1575e4dc7d1e076e977cb0d3d47f5",
          "path": "internal/run/run.go",
          "line": 15,
          "import": "github.com/git-pkgs/managers",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/downstream",
          "commit": "3fc7654ab9c1575e4dc7d1e076e977cb0d3d47f5",
          "path": "internal/run/run.go",
          "line": 16,
          "import": "github.com/git-pkgs/managers/definitions",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/downstream:git-pkgs/manifests",
      "kind": "module_dependency",
      "source": "git-pkgs/downstream",
      "target": "git-pkgs/manifests",
      "direction": "source_to_target",
      "description": "git-pkgs/downstream directly imports git-pkgs/manifests in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/downstream",
          "commit": "3fc7654ab9c1575e4dc7d1e076e977cb0d3d47f5",
          "path": "cmd/discover.go",
          "line": 12,
          "import": "github.com/git-pkgs/manifests",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/spam:git-pkgs/purl",
      "kind": "module_dependency",
      "source": "git-pkgs/spam",
      "target": "git-pkgs/purl",
      "direction": "source_to_target",
      "description": "git-pkgs/spam directly imports git-pkgs/purl in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/spam",
          "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
          "path": "internal/corpus/corpus.go",
          "line": 13,
          "import": "github.com/git-pkgs/purl",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    },
    {
      "id": "module:git-pkgs/spam:git-pkgs/scan",
      "kind": "module_dependency",
      "source": "git-pkgs/spam",
      "target": "git-pkgs/scan",
      "direction": "source_to_target",
      "description": "git-pkgs/spam directly imports git-pkgs/scan in its Go source.",
      "source_references": [
        {
          "repository": "git-pkgs/spam",
          "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
          "path": "cmd/spam-rules-eval/main.go",
          "line": 13,
          "import": "github.com/git-pkgs/scan",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/spam",
          "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
          "path": "rules.go",
          "line": 11,
          "import": "github.com/git-pkgs/scan",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/spam",
          "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
          "path": "signals.go",
          "line": 11,
          "import": "github.com/git-pkgs/scan",
          "basis": "go_source_import"
        },
        {
          "repository": "git-pkgs/spam",
          "commit": "a58fbb174693373c30701e03e6ece524fe4c8987",
          "path": "spam.go",
          "line": 10,
          "import": "github.com/git-pkgs/scan",
          "basis": "go_source_import"
        }
      ],
      "assessment": "source_reference",
      "verification_note": "Consumer → dependency. Non-test Go source imports at the recorded revision; examples and vendored files excluded. Build tags and optional commands are included. This does not establish a deployed data flow."
    }
  ],
  "areas": [
    {
      "id": "package-information",
      "label": "Package information",
      "members": [
        "ecosyste-ms/packages",
        "ecosyste-ms/advisories",
        "ecosyste-ms/nexus",
        "ecosyste-ms/critical",
        "ecosyste-ms/conda-api",
        "ecosyste-ms/npm-update-stream",
        "ecosyste-ms/live",
        "ecosyste-ms/mcp",
        "ecosyste-ms/mcp-server",
        "ecosyste-ms/typosquatting-dataset",
        "git-pkgs/registries",
        "git-pkgs/enrichment",
        "git-pkgs/purl",
        "git-pkgs/vulns",
        "git-pkgs/artifacts",
        "git-pkgs/cooldown",
        "git-pkgs/nexus",
        "git-pkgs/spam",
        "andrew/purl",
        "andrew/typosquatting"
      ]
    },
    {
      "id": "dependencies",
      "label": "Dependencies and inventories",
      "members": [
        "ecosyste-ms/packages",
        "ecosyste-ms/repos",
        "ecosyste-ms/dependabot",
        "ecosyste-ms/docker",
        "ecosyste-ms/parser",
        "ecosyste-ms/bibliothecary",
        "ecosyste-ms/resolve",
        "ecosyste-ms/resolve-cli",
        "ecosyste-ms/sbom",
        "ecosyste-ms/radar",
        "git-pkgs/git-pkgs",
        "git-pkgs/manifests",
        "git-pkgs/vers",
        "git-pkgs/managers",
        "git-pkgs/resolve",
        "git-pkgs/pom",
        "git-pkgs/provides",
        "git-pkgs/sbom",
        "git-pkgs/pin",
        "git-pkgs/actions",
        "alpha-omega-security/scrutineer",
        "alpha-omega-security/hyrum",
        "alpha-omega-security/marshal",
        "git-pkgs/dependents",
        "git-pkgs/downstream",
        "andrew/purl",
        "andrew/vers",
        "andrew/sbom"
      ]
    },
    {
      "id": "repository-evidence",
      "label": "Repository contents and history",
      "members": [
        "ecosyste-ms/repos",
        "ecosyste-ms/commits",
        "ecosyste-ms/issues",
        "ecosyste-ms/timeline",
        "git-pkgs/git-spdx",
        "git-pkgs/changelog",
        "git-pkgs/history",
        "git-pkgs/forge",
        "git-pkgs/brief",
        "git-pkgs/outline",
        "git-pkgs/languages",
        "git-pkgs/roles",
        "git-pkgs/magic",
        "git-pkgs/gitignore",
        "git-pkgs/clone",
        "git-pkgs/markup",
        "git-pkgs/signals",
        "git-pkgs/secrets",
        "git-pkgs/scan",
        "andrew/swhid",
        "andrew/swhid-go",
        "andrew/vid",
        "andrew/changelog-parser"
      ]
    },
    {
      "id": "licenses",
      "label": "Licenses",
      "members": [
        "ecosyste-ms/licenses",
        "git-pkgs/licenses",
        "git-pkgs/spdx",
        "git-pkgs/reuse",
        "git-pkgs/git-spdx"
      ]
    },
    {
      "id": "archives-artifacts",
      "label": "Package contents and artifacts",
      "members": [
        "git-pkgs/markup",
        "ecosyste-ms/archives",
        "ecosyste-ms/digest",
        "ecosyste-ms/diff",
        "git-pkgs/archives",
        "git-pkgs/magic",
        "git-pkgs/attestation",
        "git-pkgs/sigstore",
        "git-pkgs/integrity",
        "git-pkgs/artifacts",
        "git-pkgs/proxy",
        "git-pkgs/pin",
        "andrew/swhid",
        "andrew/swhid-go",
        "andrew/diffoscope"
      ]
    },
    {
      "id": "security",
      "label": "Security investigation and verification",
      "members": [
        "ecosyste-ms/advisories",
        "ecosyste-ms/dependabot",
        "ecosyste-ms/digest",
        "ecosyste-ms/threat_models",
        "ecosyste-ms/typosquatting-dataset",
        "git-pkgs/git-pkgs",
        "git-pkgs/vers",
        "git-pkgs/vulns",
        "git-pkgs/signals",
        "git-pkgs/secrets",
        "git-pkgs/capcheck",
        "git-pkgs/sarif",
        "git-pkgs/cwe",
        "git-pkgs/attestation",
        "git-pkgs/sigstore",
        "git-pkgs/integrity",
        "git-pkgs/proxy",
        "git-pkgs/cooldown",
        "git-pkgs/scan",
        "git-pkgs/actions",
        "alpha-omega-security/scrutineer",
        "alpha-omega-security/harness",
        "alpha-omega-security/marshal",
        "alpha-omega-security/heatmap",
        "git-pkgs/spam",
        "andrew/vid",
        "alpha-omega-security/threat-model",
        "andrew/vers",
        "andrew/sarif",
        "andrew/typosquatting"
      ]
    },
    {
      "id": "software-discovery",
      "label": "Software discovery and classification",
      "members": [
        "ecosyste-ms/awesome",
        "ecosyste-ms/science",
        "ecosyste-ms/dashboards",
        "ecosyste-ms/summary",
        "ecosyste-ms/ost",
        "ecosyste-ms/ruby",
        "ecosyste-ms/oss-taxonomy",
        "git-pkgs/brief",
        "git-pkgs/distill",
        "andrew/ultimate-awesome"
      ]
    },
    {
      "id": "research-software",
      "label": "Research software and citations",
      "members": [
        "ecosyste-ms/papers",
        "ecosyste-ms/science",
        "ecosyste-ms/ost",
        "git-pkgs/brief",
        "git-pkgs/citation",
        "git-pkgs/bibtex",
        "git-pkgs/codemeta"
      ]
    },
    {
      "id": "maintenance-funding",
      "label": "Maintenance and funding",
      "members": [
        "ecosyste-ms/commits",
        "ecosyste-ms/issues",
        "ecosyste-ms/opencollective",
        "ecosyste-ms/sponsors",
        "ecosyste-ms/dependabot",
        "ecosyste-ms/critical",
        "ecosyste-ms/dashboards",
        "ecosyste-ms/funds",
        "ecosyste-ms/radar",
        "ecosyste-ms/summary",
        "ecosyste-ms/ruby",
        "git-pkgs/git-pkgs",
        "git-pkgs/enrichment",
        "alpha-omega-security/scrutineer",
        "alpha-omega-security/marshal",
        "alpha-omega-security/heatmap"
      ]
    },
    {
      "id": "testing-compatibility",
      "label": "Dependency compatibility",
      "members": [
        "git-pkgs/managers",
        "git-pkgs/provides",
        "alpha-omega-security/harness",
        "alpha-omega-security/hyrum",
        "git-pkgs/dependents",
        "git-pkgs/downstream"
      ]
    },
    {
      "id": "access-publishing",
      "label": "Data access and publication",
      "members": [
        "ecosyste-ms/live",
        "ecosyste-ms/export",
        "ecosyste-ms/ecosystems-go",
        "ecosyste-ms/ecosyste_ms_cli",
        "ecosyste-ms/mcp",
        "ecosyste-ms/mcp-server",
        "ecosyste-ms/skills",
        "git-pkgs/markup",
        "git-pkgs/skills",
        "ecosyste-ms/ecosystems-ts"
      ]
    }
  ],
  "audit_date": "2026-10-14",
  "audit_count": 111
};
