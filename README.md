# Daily Executive Briefing System

A PDB-style (President's Daily Brief) executive briefing page that collects reports from a hierarchy of autonomous agents, synthesizes them into a concise dashboard, and presents everything Brian needs to know each morning — priorities, calendar, communications, project status, client health, fires, and action items — all in one page.

## Quick Start

Serve the project root with any static file server and open `index.html`:

```bash
npx serve .          # then open http://localhost:3000
# — or —
python3 -m http.server   # then open http://localhost:8000
```

> The page loads `briefs/daily-brief.json` and `agents/hierarchy.json` via `fetch`, so it must be served over HTTP (not opened as a `file://` URL).

## Repository Structure

```
briefs/
├── index.html                              # Briefing dashboard (open in browser)
├── src/
│   └── briefing.js                         # Rendering engine (vanilla JS, no frameworks)
├── briefs/
│   ├── daily-brief.json                    # Daily Executive Brief data
│   └── brian-calendar-quick-questions.json  # Calendar quick-question brief
├── agents/
│   └── hierarchy.json                      # Agent hierarchy & role definitions
├── README.md
└── LICENSE
```

## The Daily Executive Brief

The briefing page (`index.html`) renders a single-page dashboard modeled after a President's Daily Brief:

| Section              | What it shows                                                              |
|----------------------|---------------------------------------------------------------------------|
| **Executive Summary** | Top-line status + prioritized items that need attention (critical → low)  |
| **Today's Schedule**  | Full day calendar with confirmed, suggested, and open blocks              |
| **Communications**    | Email/chat stats, flagged messages, overdue follow-ups                    |
| **Active Projects**   | Progress bars, milestones, task counts, risk status                       |
| **Client Status**     | Client health indicators, last contact date, next actions                 |
| **Urgent Issues**     | Active fires or "All Clear" status                                        |
| **Action Items**      | Consolidated to-do list sorted by priority with due times                 |
| **Agent Status Board**| Live status of every agent in the hierarchy, grouped by tier              |

All data comes from `briefs/daily-brief.json`, which is assembled by the Chief of Staff agent.

## Agent Hierarchy

Agents are organized into three tiers (see `agents/hierarchy.json`):

```
Tier 1 — Executive
  └── Chief of Staff Agent
        Assembles the daily brief from all Tier 2 reports.

Tier 2 — Operational
  ├── Calendar Management Agent    → manages schedule
  ├── Communications Agent         → processes emails & chats
  ├── Project Tracking Agent       → monitors milestones & deadlines
  ├── Client Relations Agent       → tracks client health & follow-ups
  └── Urgent Issues Agent          → watches for fires & escalations

Tier 3 — Support
  ├── Calendar Scanner             → scans calendars for changes
  ├── Email Scanner                → monitors inboxes
  ├── Chat Scanner                 → monitors chat platforms
  ├── Milestone Tracker            → tracks project deadlines
  ├── Client Monitor               → monitors client activity
  └── Alert Monitor                → watches for critical alerts
```

Each agent has a defined role, a `reportsTo` relationship, and a current status. Tier 3 agents feed raw data into Tier 2 agents, which synthesize domain-specific reports. The Tier 1 Chief of Staff agent assembles everything into the daily brief.

## Briefs

### Daily Executive Brief

Located at [`briefs/daily-brief.json`](briefs/daily-brief.json). This is the main briefing document rendered by the dashboard. It contains:

- **Executive summary** with prioritized items
- **Sections** for calendar, communications, projects, clients, and fires
- **Agent status board** showing all agent statuses
- **Action items** consolidated from all agents

### Brian's Calendar Quick Questions

Located at [`briefs/brian-calendar-quick-questions.json`](briefs/brian-calendar-quick-questions.json). A multiple-choice questionnaire that:

1. **Asks which projects need to be on the calendar** — multiple-choice list of projects.
2. **Captures when and roughly what time** — scheduling preferences per project.
3. **Shows agent task statuses** — dashboard of all agent tasks and their statuses.

## How It Works

1. **Nightly (10 PM):** Tier 3 support agents scan all data sources (calendars, email, chats, project tools, client CRM). Tier 2 operational agents synthesize domain reports.
2. **Morning (6:30 AM):** The Chief of Staff agent assembles all reports into `briefs/daily-brief.json` and the briefing page is ready for Brian.
3. **Brian opens the dashboard:** One page, everything he needs. Priorities at the top, details below, agent health at the bottom.
4. **Throughout the day:** Agents continue monitoring. If fires arise, the Urgent Issues agent escalates and the brief updates.
