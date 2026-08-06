# Gumption Architecture Review

**Live CRM:** https://gumption.manus.space  
**Linked repo:** https://github.com/BelichickGillisMusk/mostly-gumption-and-uunit  
**Review date:** 2026-05-22 (updated after repo clone)

## Important: repo vs live app

| | `gumption.manus.space` | `mostly-gumption-and-uunit` |
|--|------------------------|----------------------------|
| **Product** | NorCal CARB CRM (leads, cold calls, knowledge) | **Rent-Ruby** — Oakland property / tenant portal |
| **Stack** | React + Express + **tRPC** | React + Express + **REST** + SQLite |
| **Deploy** | Manus (`*.manus.space`) | Cloudflare Pages (`rent-ruby`) |
| **Cold Calls** | `/coldcall` — failed OBD tests | ❌ not present |
| **Knowledge Base** | `/knowledge` — docs with `source_file` | **Info Nook** — static tenant guides |
| **File upload** | Not wired in production | Photo upload (base64) + CSV button (UI only) |

The GitHub repo name suggests Gumption + The Unit, but **`main` currently contains Rent-Ruby** (merged via PR #5 `unit-gumption-cloudflare-deploy`). The **Gumption CRM source is still on Manus**, not in this repo.

To edit Gumption CRM features, export the Manus project to GitHub (e.g. `BelichickGillisMusk/gumption`). Use this repo for Rent-Ruby / Unit patterns only.

---

## Part A — Gumption CRM (live at gumption.manus.space)

Reverse-engineered from production bundle + tRPC API (see original sections below).

---

## Tech stack (confirmed)

| Layer | Technology |
|-------|------------|
| Hosting | Manus (`gumption.manus.space`, `x-powered-by: Express`) |
| Frontend | React + Vite, Wouter routing, TanStack Query + tRPC client (`tt.*`) |
| UI | shadcn-style components (`client/src/components/ui/*`) |
| API | tRPC at `/api/trpc` |
| Auth (UI) | `PasscodeGate.tsx` — **client-only** `sessionStorage` key `gumption_unlocked` |
| Assets | `/manus-storage/*` |
| Analytics | manus-analytics.com, Plausible |

---

## Source tree (from production bundle)

Recovered from `index-CrS2bJz8.js` source paths:

```
client/src/
├── App.tsx
├── main.tsx
├── components/
│   ├── PasscodeGate.tsx      # unlock gate
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   └── ui/                   # button, card, dialog, input, ...
├── pages/
│   ├── Home.tsx              # /dashboard
│   ├── ColdCallPage.tsx      # /coldcall
│   ├── LeadsPage.tsx         # /leads
│   ├── ClientsPage.tsx       # /clients
│   ├── KnowledgeBasePage.tsx # /knowledge  ← file assimilation target
│   ├── TestEnrichmentPage.tsx# /enrichment
│   ├── AgentsPage.tsx        # /agents
│   ├── OrchestraPage.tsx     # /orchestra
│   ├── SquarespaceOrdersPage.tsx
│   ├── InvoicesPage.tsx
│   ├── GmailPage.tsx
│   ├── GCalendarPage.tsx
│   └── VirtualOffice.tsx     # /office
```

---

## Routes

| Path | Page | Purpose |
|------|------|---------|
| `/dashboard` | Home | KPIs, pipeline |
| `/coldcall` | ColdCallPage | Failed-test retest outreach, call scripts |
| `/leads` | LeadsPage | Lead CRUD |
| `/clients` | ClientsPage | Client profiles |
| `/knowledge` | KnowledgeBasePage | Document library (**Add Document** UI) |
| `/enrichment` | TestEnrichmentPage | Link 957 tests → 82 clients |
| `/tests` | TestsWrapper | Test records |
| `/invoices` | CashFlo invoicing |
| `/squarespace` | Orders |
| `/agents` | AI agent roster |
| `/orchestra` | AI Orchestra |
| `/office` | Virtual office |
| `/calendar`, `/emails` | Google integrations |

---

## tRPC API (live, mostly unauthenticated)

### Queries (GET works today)

| Procedure | Example use |
|-----------|-------------|
| `leads.list` | All leads (389+ records) |
| `clients.list` | 92 clients |
| `jobs.list` | 957 OBD/smoke tests; filter `passFailStatus: "Fail"` for cold call table |
| `knowledge.list` | Docs with `title`, `category`, `content`, `source_file`, `tags` |
| `invoices.list` | 232 invoices |
| `squarespace.list` | Squarespace orders |
| `dashboard.stats` | Revenue, pass/fail counts |
| `jobs.stats` | Test aggregates |

Example:

```bash
curl -s 'https://gumption.manus.space/api/trpc/jobs.list?input={"json":{"passFailStatus":"Fail","limit":5}}'
```

### Mutations (exist but require POST)

| Procedure | Used by |
|-----------|---------|
| `leads.create` | LeadsPage |
| `leads.update` | LeadsPage, follow-ups |
| `clients.create` / `clients.update` | ClientsPage |
| `jobs.update` | Test enrichment / call status |
| `invoices.create` / `invoices.update` | CashFlo |
| `jobs.createPlaceholderInvoice` | Billing workflow |

### Missing mutations (gaps for your feature request)

| Expected | Status |
|----------|--------|
| `knowledge.create` | **Not in client bundle** — "Add Document" button has no `useMutation` |
| `knowledge.update` / `delete` | Not exposed |
| `leads.importCsv` | Not exposed — CSV import is manual today |
| `coldcall.*` | No router — Cold Call uses `jobs.list` + static UI |
| File upload endpoint | **None** |

---

## Knowledge Base — existing “assimilation” model

`knowledge.list` returns documents that were **already ingested** (likely via Manus build-time seed or one-off script):

| id | title | source_file |
|----|-------|-------------|
| 1 | AI Agents Orchestrator | `agents-orchestrator.md` |
| 2 | NorCal site plan | `BGnewsiteplanaddlocationsfixthisisv1.txt` |
| 3–5 | Blog posts | `BLOG_POSTS_READY.md.gdoc` |
| 6 | GIA deploy zip | `GIA_Deploy_2026-02-13(3).zip` |

**Schema (inferred):**

```ts
{
  id: number;
  title: string;
  category: string;  // "AI & Automation" | "Strategy & Planning" | "Blog Posts" | ...
  content: string;   // full text stored in DB
  source_file: string;
  tags: string;      // comma-separated
  status: "active";
  created_at: string;
  updated_at: string;
}
```

UI (`KnowledgeBasePage.tsx`) already renders `source_file` and has **Add Document** + search — but **no upload/create pipeline is wired**.

---

## Cold Calls module

- Route: `/coldcall`
- Data: `jobs.list` with `passFailStatus: "Fail"` (69 failed vehicles)
- UI: call status dropdown (Not Called, Left Voicemail, …), scripts accordion, link to `/enrichment`
- **No** `coldcall.import` — Hayward CSV from `briefs` repo must be pasted/imported manually or via new `leads.create` loop

---

## Security findings (important)

1. **Passcode is client-side only** (`PasscodeGate.tsx` in bundle). Anyone can call tRPC without unlocking.
2. **tRPC read endpoints are public** (`leads.list`, `clients.list`, `knowledge.list`, etc.).
3. **Mutations are unprotected** — POST to `leads.create` would work if discovered.

Before adding file upload, add **server-side auth** (API key, session cookie, or Manus SSO).

---

## Implementation spec: file upload → assimilate into code/Knowledge

### Goal

Upload `.md`, `.txt`, `.csv`, `.json`, `.zip` (and optionally `.pdf`) → parse → store as Knowledge doc (and optionally spawn Leads / Cold Call rows).

### Phase 1 — Backend (`server/routers/knowledge.ts`)

```ts
// knowledge.ingestFile (mutation)
input: {
  filename: string;
  mimeType: string;
  contentBase64: string;  // or multipart on Express
  category?: string;
  tags?: string[];
}
output: { docId: number; title: string; bytesIngested: number }

// Parser pipeline
switch (ext) {
  case '.md':
  case '.txt':  content = utf8; title = filename; break;
  case '.csv':  rows = parseCsv; content = summarize(rows); tags += 'csv,leads'; break;
  case '.json': content = JSON.stringify(parsed, null, 2); break;
  case '.zip':  extract text/md entries only; store manifest in content; break;
}
await db.insert(knowledgeDocs).values({ title, category, content, source_file: filename, tags });
await storage.put(`/manus-storage/uploads/${id}_${filename}`, buffer);  // optional binary retention
```

### Phase 2 — Frontend (`KnowledgeBasePage.tsx`)

Wire **Add Document** to:

```tsx
<input type="file" accept=".md,.txt,.csv,.json,.zip" hidden ref={fileRef} />
// on change → FileReader.readAsDataURL → trpc.knowledge.ingestFile.mutate(...)
```

Add `tt.knowledge.ingestFile.useMutation` + invalidate `knowledge.list` on success.

### Phase 3 — CSV → Leads + Cold Calls

```ts
// leads.importCsv (mutation)
input: { csvText: string; source?: string }
// For each row: map Company→company, Phone→phone, Priority→score tier
// → leads.create in transaction
// Optionally set stage: "New" for Cold Call tracking
```

Reuse column layout from `leads/gumption-cold-calls-import.csv` in this repo.

### Phase 4 — Optional AI assimilation

After text extract, call LLM once:

- Propose `category` + `tags`
- Generate 3-bullet summary prepended to `content`
- For code files: store under `category: "Code"` with syntax hint in tags

---

## How to get the actual source code

1. Log into **Manus** → project for `gumption.manus.space` → Export / Connect GitHub.  
2. Or download the Manus project ZIP if offered.  
3. Search exported tree for `client/src/pages/KnowledgeBasePage.tsx` — that is the file to extend.  
4. Clone into `BelichickGillisMusk/gumption` and wire CI deploy back to Manus.

Until export, use this doc + `curl` probes against `/api/trpc` as the contract.

---

## Related files in `briefs` repo

| File | Role |
|------|------|
| `leads/gumption-cold-calls-import.csv` | Cold Calls import schema |
| `leads/Leads_2026-05-22.csv` | CRM import + `sms_body` |
| `briefs/hayward-leads-2026-05-22-outreach.json` | Outreach metadata |

---

## Next steps (recommended order)

1. Export Gumption source from Manus → GitHub `gumption` repo.  
2. Add server auth on tRPC middleware.  
3. Implement `knowledge.ingestFile` + wire Add Document UI.  
4. Implement `leads.importCsv` for Cold Call / Hayward batches.  
5. Redeploy to `gumption.manus.space`.

---

## Part B — `mostly-gumption-and-uunit` (Rent-Ruby source)

Cloned from https://github.com/BelichickGillisMusk/mostly-gumption-and-uunit

### Stack

| Layer | Path / tech |
|-------|-------------|
| Server | `server.ts` — Express, **better-sqlite3** (`rentroll_v3.db`) |
| Client | `src/App.tsx` + `src/components/*` |
| Dev | `npm run dev` → `tsx server.ts` (port 3000) |
| Deploy | `.github/workflows/deploy.yml` → Cloudflare Pages `rent-ruby` |

### Existing file / data patterns (reuse for assimilation)

**1. Photo upload → SQLite (working)**

```356:385:gumption-src/src/components/RentRollDashboard.tsx
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // ...
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      await fetch('/api/maintenance', {
        method: 'POST',
        body: JSON.stringify({ unit_id, description, photo_url: base64String })
      });
    };
    reader.readAsDataURL(file);
  };
```

**2. Knowledge-like tables (seeded, read-only API)**

- `GET /api/legal-forms` → `legal_forms` (title, category, content_template)
- `GET /api/laws-regulations` → `laws_regulations`
- `CEOBriefingPortal.tsx` consumes these + Gemini for lease generation

**3. Info Nook (tenant knowledge UI — static)**

- `TenantPortal.tsx` → `activeTab === 'info-nook'`
- Hardcoded cards (Move-Out Checklist, Building Rules 2026, etc.)
- **No upload** — best place to add tenant document assimilation

**4. CSV import (UI stub only)**

- `SFPlusModule.tsx` line 62: **"Import CSV"** button with no handler
- Bank transactions: `GET/POST /api/bank-transactions` — ready for CSV ingest

### Recommended additions in THIS repo

If you want file assimilation in Rent-Ruby / Unit:

```ts
// server.ts — new table
CREATE TABLE IF NOT EXISTS knowledge_docs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT,
  content TEXT NOT NULL,
  source_file TEXT,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

// POST /api/knowledge/ingest
app.post("/api/knowledge/ingest", (req, res) => {
  const { filename, content, category, tags } = req.body;
  // insert into knowledge_docs
});

// Wire Info Nook or CEO Briefing "Add Document" → FileReader → POST
```

Mirror the Gumption CRM spec (Part A) but use REST instead of tRPC.

### Repo map

```
mostly-gumption-and-uunit/
├── server.ts              # All REST routes + SQLite schema
├── src/App.tsx            # Hub / Admin / Tenant views
├── src/components/
│   ├── RentRollDashboard.tsx   # ✅ file upload pattern
│   ├── TenantPortal.tsx        # Info Nook → add doc upload here
│   ├── CEOBriefingPortal.tsx   # legal forms + AI
│   ├── SFPlusModule.tsx        # stub CSV import
│   └── MaintenanceModule.tsx
├── DEPLOYMENT.md          # Cloudflare secrets
└── AGENTS.md              # Rent-Ruby design rules
```

---

## Part A (continued) — Gumption CRM details
