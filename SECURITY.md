# Security Policy

## Scope

This repository contains a **static dashboard** (`command-center/`) and **JSON brief templates** (`briefs/`). There is no backend, authentication layer, or user-facing API in this codebase.

## Reporting a Vulnerability

If you discover a security issue in this repository, please report it privately:

1. **GitHub Security Advisories** — open a draft advisory at  
   `https://github.com/BelichickGillisMusk/briefs/security/advisories/new`
2. **Email** — contact the repository owner directly.

Please **do not** open a public issue for security vulnerabilities.

## Known Considerations

- **No authentication**: The static site has no access control. Do not serve it on a publicly reachable host unless all committed data is non-sensitive.
- **Data in source control**: Lead and business data files are committed to the repository. Treat the repository as confidential if it contains real contact information.
- **No server-side processing**: The dashboard renders entirely client-side from static data files. There are no API endpoints, databases, or server-side logic in this repository.

## Sensitive Files

The `.gitignore` is configured to exclude real CRM exports (`leads/retest-customers.csv`), environment files, and credentials. Contributors should never commit API keys, tokens, or real customer PII to this repository.
