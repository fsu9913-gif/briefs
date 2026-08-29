# Security Policy — Bryan's Command Center

## Reporting a Vulnerability

If you discover a security issue in this repository, please report it
privately via [GitHub Security Advisories](../../security/advisories/new)
or email the repository owner directly. Do **not** open a public issue.

## Sensitive Data

This repository is **public**. Never commit:

| Category | Example | Protection |
|----------|---------|------------|
| Real CRM exports | `leads/retest-customers.csv` | Listed in `.gitignore` |
| API keys / tokens | Twilio, Google, Slack credentials | Use environment variables only |
| Customer PII | Names, phones, emails from production systems | Keep in private CRM; use sample/synthetic data in repo |

Before pushing, run `git diff --cached --name-only` and verify no
sensitive files are staged.

## External Systems

References to external services (Gumption CRM, Google Sheets, Make.com)
appear in documentation and briefs. Treat URLs, sheet IDs, and API
endpoint details as sensitive — avoid publishing exploitation details
for systems that lack server-side authentication.

## Supported Versions

This is a single-branch static project. Security fixes are applied
to the latest commit on `main`.
