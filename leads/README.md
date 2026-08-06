# Hayward / San Leandro Lead Pack (2026-05-22)

Prepared for **Bryan @ NorCal CARB Mobile** (`bryan@norcalcarbmobile.com`).

## Files

| File | Purpose |
|------|---------|
| `Leads_2026-05-22.csv` | Import to Master CRM tab `Leads_2026-05-14` (dedupe first) |
| `gumption-cold-calls-import.csv` | Import into [Gumption](https://gumption.manus.space) → **Cold Calls** |
| `hayward-leads-dialer.html` | Open on phone — tap any number to call |
| `make-sms-batch-2026-05-23.json` | Make.com scenario notes — SMS **Sat May 23, 2026 10:30 AM PT** |
| `../briefs/hayward-leads-2026-05-22-outreach.json` | Per-lead SMS text + metadata |
| `../briefs/hayward-leads-email-drafts.md` | Gmail-ready email drafts (fill `To:` after you get email on call) |

## Your action checklist

1. **Dedupe** phones in Master CRM (`1TdNnf7eLaPNN3anaBGpNdjo_unK04zWwZJ859ZDvIO4`) before calling or texting.
2. **Gumption** — unlock → Cold Calls → import `gumption-cold-calls-import.csv` → log outcome per call.
3. **SMS** — wire `make-sms-batch-2026-05-23.json` in Make.com **or** schedule in Twilio at unix `1779557400` (10:30 AM PT).
4. **Email** — copy drafts from `hayward-leads-email-drafts.md` into Gmail drafts (phones only in this batch).
5. **Dial** — AirDrop/open `hayward-leads-dialer.html` on iPhone.

Callback on all messages: **916-890-4427**.

## Gumption internals

See [`../docs/gumption-architecture-review.md`](../docs/gumption-architecture-review.md) for reverse-engineered routes, tRPC API, and how to add file-upload assimilation.
