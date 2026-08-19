This is the set up an agent to get my information at night for the next day to put on my calendar and then to meet in the morning if any changes happen or if there's any fires we need to put out the need to get addressed by agents or if you guys can help in anyway there should be quick but the nightly one will get the calendar set up for the following day and make sure that all messages emails and previous chats during the week are gone through to make sure that we're following up with all the clients

## 🚀 Bryan's Command Center

A SpaceX-inspired mission control dashboard for Bryan to monitor and manage all AI agents, tasks, communications, and business goals. Located at [`command-center/index.html`](command-center/index.html).

### Features

- **Agent Fleet** — Real-time status of all 8 AI agents including Silverback Prime, Calendar Agent, Email Agent, Project Tracker, Client Relations, NorCal Operations, Research Agent, and Fire Response
- **Active Tasks** — Filterable task list with priority indicators, progress tracking, and agent assignments
- **Communications** — Unified mail inbox showing unread messages, client emails, and system alerts
- **Mission Objectives** — Progress tracking for Q1 revenue, client expansion, delivery network, and operational goals
- **Integrations** — Live metrics from NorCal Carb Mobile and Silverback AI systems
- **Live Activity Feed** — Real-time stream of agent actions and system events

### Integrations

- **[NorCal Carb Mobile](https://norcalcarbmobile.com)** — Orders, revenue, and delivery metrics
- **Silverback AI** — Agent orchestration, task automation, and AI capabilities

### How to Use

Open `command-center/index.html` in any modern web browser. The dashboard features:
- Auto-refreshing data every 30 seconds
- Dark SpaceX-inspired theme with cyan accent colors
- Responsive design for desktop and mobile
- Task filtering by status (All, Active, Pending, Urgent)
- Quick access to Daily Briefing

---

## Briefs

### Brian's Calendar Quick Questions

A multiple-choice quick question brief located at [`briefs/brian-calendar-quick-questions.json`](briefs/brian-calendar-quick-questions.json). This brief is used to:

1. **Ask Brian which projects need to be on the calendar** — presents a multiple-choice list of projects so Brian can quickly select which ones should be scheduled.
2. **Capture when and roughly what time** — for each selected project, asks Brian when it should be scheduled (today, this week, next week, etc.) and what time of day works best.
3. **Show agent task statuses** — displays the current tasks across all working agents (Calendar, Email, Project Tracking, Client Relations, Urgent Issues) along with their statuses (active, in-progress, pending, idle) so Brian can assess what's being worked on.

#### How It Works

The brief is structured as a JSON questionnaire with five questions that guide Brian through calendar planning. After the questions, the `agentTaskStatuses` section provides a dashboard view of all agent tasks and their current statuses, giving Brian full visibility into what each agent is working on.

### Lead Prospecting (NAICS → Google → Dedupe → Phone)

**Current customers stay on the retest list. Cold-call lists are only similar companies who are not already customers.**

1. **CRM industries → NAICS** — [`leads/naics-sweet-spot.json`](leads/naics-sweet-spot.json) (tree 561730, mechanical 238220, concrete, local trucking, etc.)
2. **Google Business Profile** — search those terms near Hayward / San Leandro / Fremont
3. **Dedupe** — [`leads/naics_prospecting.py`](leads/naics_prospecting.py) strips anyone in `retest-customers.csv` / Master CRM into a retest file
4. **Work the list** — open [`leads/lead-manager.html`](leads/lead-manager.html) on your phone: SMS / Call / Edit (last test date) / Delete; export CSV into Gumption Cold Calls when ready

```bash
python3 leads/naics_prospecting.py --analyze-crm
python3 leads/naics_prospecting.py --queries --cities Hayward,"San Leandro"
python3 leads/naics_prospecting.py --dedupe leads/candidate-leads.csv
```

See [`leads/README.md`](leads/README.md) for the full loop. Hayward May 2026 batch briefs remain under `briefs/` and `leads/` for reference.

---

## Monthly Retest Retention Check (NorCal CARB Mobile)

A recurring monthly workflow that pulls existing NorCal CARB Mobile customers from the Master CRM, calculates each customer's next Clean Truck Check due date, buckets them by urgency (🔴 URGENT / 🟠 HOT / 🟡 WARM / 🟢 EARLY), and produces a prioritized outreach list.

- **Spec:** [`briefs/retest-retention-check.json`](briefs/retest-retention-check.json)
- **Engine:** [`leads/retest_retention_check.py`](leads/retest_retention_check.py) (Python 3, stdlib only)
- **Sample data:** [`leads/retest-customers-sample.csv`](leads/retest-customers-sample.csv)
- **Calendar trigger:** _Monthly Retest Retention Check - Run Skill_ — 23rd of every month, trigger phrase `Run monthly retest check`.

### Run it

The engine expects a per-customer CRM keyed by `customer_id` with a `last_test_date`. There are two supported source shapes:

**A. From the A+ Leads and Jobs Calendar export** (one row per job; what we currently get out of Squarespace / A+ Calendar):

```bash
# 1. Drop the A+ export at leads/aplus-jobs-calendar-<YYYY-MM-DD>_<YYYY-MM-DD>.csv
# 2. Build the per-customer CRM:
python3 leads/import_aplus_jobs_calendar.py \
    --input leads/aplus-jobs-calendar-2025-10-14_2025-12-08.csv \
    --output leads/retest-customers.csv
# 3. Run the engine:
python3 leads/retest_retention_check.py --as-of $(date +%F)
```

The importer dedupes jobs by phone (digits-only) when present, falls back to the first line of the Summary field otherwise, and writes the engine's expected schema.

**B. From a hand-maintained Master CRM (Google Sheet `1TdNnf7eLaPNN3anaBGpNdjo_unK04zWwZJ859ZDvIO4`)**:

```bash
# 1. File → Download → CSV → save as leads/retest-customers.csv
# 2. Run the engine:
python3 leads/retest_retention_check.py --as-of $(date +%F)
```

If `leads/retest-customers.csv` is missing, the engine falls back to the synthetic sample dataset and stamps the report with a ⚠️ **Demo data** banner so nobody calls a fake customer.

> ⚠️ **Coverage matters.** Make sure the source covers the full customer history, not just the last 8 weeks. A short slice will produce a report with 0 actionable rows because every customer's next-due date is too far out. The engine now writes a **Source coverage** + **12-month pipeline** section to make this visible.

### Outputs

Every run writes two files keyed by year/month:

- `docs/retest-retention-YYYY-MM.md` — human-readable report (bucket counts, prioritized lead lists, ready-to-send email body).
- `briefs/retest-retention-YYYY-MM.json` — machine-readable snapshot consumed by the Command Center.

This month's run lives at [`docs/retest-retention-2026-06.md`](docs/retest-retention-2026-06.md).
