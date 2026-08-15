# Lead Prospecting — NorCal CARB Mobile

**Rule:** Current customers are on the **retest / recurring** list. They never go on a cold-call lead list.

## The easy loop (use this)

1. **Look at CRM** — who already buys Clean Truck Checks?
2. **Map industries → NAICS** — `naics-sweet-spot.json` (tree, mechanical, concrete, local trucking, etc.)
3. **Google Business Profile search** — same industries + city → similar companies
4. **Dedupe against CRM** — matches go to retest; everyone else becomes a lead
5. **Work leads** — open `lead-manager.html` on your phone (SMS / Call / Edit / Delete)

```bash
# See what industries your current customers look like
python3 leads/naics_prospecting.py --analyze-crm

# Print Google Maps search queries for your markets
python3 leads/naics_prospecting.py --queries --cities Hayward,"San Leandro",Fremont

# After you paste a Maps/export CSV of candidates:
python3 leads/naics_prospecting.py --dedupe leads/candidate-leads.csv \
    --crm leads/retest-customers.csv \
    --out-leads leads/cold-call-clean.csv \
    --out-customers leads/already-customers-retest.csv
```

Candidate CSV needs at least a **Company** or **Phone** column (also accepts `company_name`, `name`, `business`, `telephone`, etc.).

## Sweet-spot industries (NAICS)

| Priority | Industry | NAICS | Google search examples |
|----------|----------|-------|------------------------|
| ★ 1 | Tree / landscaping | 561730 | `tree service near Hayward CA` |
| ★ 1 | Mechanical / HVAC / plumbing | 238220, 238210 | `mechanical contractor near Hayward CA` |
| ★ 2 | Concrete | 327320, 238110 | `concrete contractor near San Leandro CA` |
| ★ 2 | Asphalt / paving | 237310 | `paving near Hayward CA` |
| ★ 2 | Local trucking / hauling | 484110, 484220 | `dump truck near Hayward CA` |
| ★ 3 | HD towing | 488410 | `heavy duty towing near San Leandro CA` |

Full list + cautions (skip mega fleets with telematics): [`naics-sweet-spot.json`](naics-sweet-spot.json).

## Files

| File | Purpose |
|------|---------|
| **`lead-manager.html`** | **Use this** — phone UI: SMS / Call / Edit (last test date) / Delete + success rate |
| `naics-sweet-spot.json` | NAICS + Google search terms for industries that convert |
| `naics_prospecting.py` | Analyze CRM → print search queries → dedupe candidates |
| `retest-customers.csv` | Current customers (from A+ calendar / Master CRM) — exclusion set |
| `gumption-cold-calls-import.csv` | Import into [Gumption](https://gumption.manus.space) → Cold Calls |
| `hayward-leads-dialer.html` | Older dial-only page (prefer lead-manager) |

## Hayward batch (2026-05-22)

Historical pack still in this folder. Before calling that batch (or any new Maps scrape), run `--dedupe` against the latest `retest-customers.csv` / Master CRM export so nobody already on recurring tests lands on the lead list.

Callback: **916-890-4427**.

## Gumption

Live CRM: https://gumption.manus.space — Cold Calls + Clients. Architecture notes: [`../docs/gumption-architecture-review.md`](../docs/gumption-architecture-review.md).
