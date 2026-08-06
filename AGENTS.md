# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

Static **Bryan's Command Center** dashboard (`command-center/`) plus JSON brief templates (`briefs/`). No backend, build step, or package manager.

## Cursor Cloud specific instructions

### Dependencies

There are **no installable dependencies** (no `package.json`, `requirements.txt`, or Docker). Python 3 (stdlib `http.server`) is sufficient to serve the site locally.

### Running the Command Center

Start a static HTTP server from the `command-center` directory (preferred over `file://` for consistent asset loading):

```bash
python3 -m http.server 8080
```

Run from `command-center/` so relative paths resolve correctly. Open http://localhost:8080 in a browser.

For background/long-running use, start the server in tmux rather than a one-shot shell.

### Brief JSON files

Brief templates live in `briefs/`:

- `briefs/brian-calendar-quick-questions.json` — calendar planning questionnaire
- `briefs/carb-testing-email-draft.json` — NorCal Carb email campaign draft
- `briefs/retest-retention-check.json` — monthly retest retention workflow spec
- `briefs/retest-retention-YYYY-MM.json` — monthly snapshot (generated, gitignored from manual edits)

Validate JSON syntax:

```bash
python3 -m json.tool briefs/brian-calendar-quick-questions.json > /dev/null
python3 -m json.tool briefs/carb-testing-email-draft.json > /dev/null
python3 -m json.tool briefs/retest-retention-check.json > /dev/null
```

The dashboard **Daily Brief** button currently shows an alert pointing at the calendar brief path; it does not load the JSON in-browser yet.

### Monthly Retest Retention Check

A recurring workflow triggered by the calendar event _Monthly Retest Retention Check - Run Skill_ on the 23rd of each month (trigger phrase: `Run monthly retest check`).

- Spec: `briefs/retest-retention-check.json`
- Engine: `leads/retest_retention_check.py` (Python 3 stdlib only)
- Importer (A+ Calendar → CRM schema): `leads/import_aplus_jobs_calendar.py`
- Sample data: `leads/retest-customers-sample.csv` (used as fallback when no real CRM export is present)

Two source shapes are supported:

```bash
# A. From an A+ Leads and Jobs Calendar export (jobs log; current Squarespace export)
python3 leads/import_aplus_jobs_calendar.py \
    --input leads/aplus-jobs-calendar-YYYY-MM-DD_YYYY-MM-DD.csv \
    --output leads/retest-customers.csv
python3 leads/retest_retention_check.py --as-of $(date +%F)

# B. From a hand-maintained Master CRM CSV (already in the engine schema)
python3 leads/retest_retention_check.py --as-of $(date +%F)
```

The engine prefers `leads/retest-customers.csv` (real Master CRM export) when present, otherwise falls back to the sample dataset and stamps the output with a Demo Data banner. Outputs land at `docs/retest-retention-YYYY-MM.md` and `briefs/retest-retention-YYYY-MM.json`. The report includes Source-coverage and 12-month-pipeline sections so partial exports are obvious. See the README for full details.

### Lint / test / build

This repo has **no** ESLint, Prettier, test runner, or build pipeline. Verification is manual (browser) or HTTP checks on static assets.

### External integrations (not in repo)

Silverback AI, NorCal Carb Mobile, Notion, and Squarespace are referenced in UI copy and briefs but are **not wired** in code. Dashboard data comes from mock data in `command-center/data.js`.
