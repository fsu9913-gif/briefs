#!/usr/bin/env python3
"""Import an A+ Leads and Jobs Calendar CSV export into the Retest Retention CRM schema.

The A+ calendar export is an append-only jobs log (one row per test/visit) with a
free-text Summary field. The Retest Retention Engine expects a per-customer CRM
keyed by customer_id, with last_test_date and test_cadence_months columns.

This importer:
  1. Reads the A+ jobs log (auto-skipping the preamble metadata lines).
  2. Deduplicates rows into a per-customer view:
       - Primary key: digits-only Phone when present
       - Fallback key: normalised first line of Summary
  3. Keeps the most recent job per customer as their "last_test_date".
  4. Maps Service codes to vehicle types:
       OBD → Diesel ≥14k lbs (OBD)
       OVI → Smoke opacity (OVI)
       RV  → Motorhome/RV
  5. Writes leads/retest-customers.csv in the engine's expected schema.

Then re-run leads/retest_retention_check.py to regenerate the monthly report.

Usage:
  python3 leads/import_aplus_jobs_calendar.py \
      --input leads/aplus-jobs-calendar-2025-10-14_2025-12-08.csv \
      --output leads/retest-customers.csv
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import OrderedDict
from datetime import date, datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_INPUT = REPO_ROOT / "leads" / "aplus-jobs-calendar-2025-10-14_2025-12-08.csv"
DEFAULT_OUTPUT = REPO_ROOT / "leads" / "retest-customers.csv"

SERVICE_VEHICLE_TYPE = {
    "OBD": "Diesel ≥14k lbs (OBD)",
    "OVI": "Smoke opacity (OVI)",
    "RV": "Motorhome/RV",
}

DEFAULT_CADENCE_MONTHS = 12

ENGINE_COLUMNS = [
    "customer_id",
    "company_name",
    "contact_name",
    "phone",
    "email",
    "city",
    "vehicle_type",
    "vehicle_count",
    "last_test_date",
    "test_cadence_months",
    "preferred_channel",
    "last_outcome",
    "notes",
]


def parse_date(value: str) -> date:
    value = (value or "").strip()
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%m/%d/%y"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Unrecognized date format: {value!r}")


def digits_only(value: str) -> str:
    return re.sub(r"\D", "", value or "")


def first_nonempty_line(summary: str) -> str:
    for line in (summary or "").splitlines():
        line = line.strip()
        if line:
            return line
    return ""


def normalize_key_text(text: str) -> str:
    """Produce a stable dedup key from a free-text headline."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", " ", text).strip()
    text = re.sub(r"\s+", " ", text)
    return text[:60]


COMPANY_TRAILER_RE = re.compile(
    r"\s*(?:\d+\s*@\s*\d+\.?\d*|@\s*\d+|\bobd\b|\bovi\b|\brv\b|\bretest\b|\b\d+\s*at\s*\d+\b)",
    re.IGNORECASE,
)


def clean_company_name(headline: str) -> str:
    """Strip pricing / service-code trailers from a Summary headline."""
    name = headline
    # Strip leading patterns like "1@50 ", "2 @ 50 ", "1 at 75 "
    name = re.sub(r"^\s*\d+\s*(?:@|at)\s*\d+\.?\d*\s*", "", name, flags=re.IGNORECASE)
    # Strip trailing service tags
    name = COMPANY_TRAILER_RE.sub("", name)
    name = re.sub(r"\s+", " ", name).strip(" ,;:-")
    return name[:120] or headline[:120]


def skip_preamble(handle) -> None:
    """Skip metadata lines until the header row (line beginning with 'Date,')."""
    pos = handle.tell()
    while True:
        line = handle.readline()
        if not line:
            raise ValueError("Header row 'Date,Summary,...' not found in input.")
        if line.startswith("Date,"):
            handle.seek(pos)
            return
        pos = handle.tell()


def dedup_key(phone: str, summary: str) -> str:
    digits = digits_only(phone)
    if len(digits) >= 7:
        return f"phone:{digits[-10:]}"
    headline = first_nonempty_line(summary)
    norm = normalize_key_text(headline)
    return f"summary:{norm}" if norm else "summary:unknown"


def import_jobs(input_path: Path, output_path: Path) -> dict:
    by_customer: "OrderedDict[str, dict]" = OrderedDict()
    job_count = 0
    skipped = 0

    with input_path.open(newline="", encoding="utf-8") as fh:
        skip_preamble(fh)
        reader = csv.DictReader(fh)
        for row_num, row in enumerate(reader, start=2):
            raw_date = (row.get("Date") or "").strip()
            if not raw_date:
                skipped += 1
                continue
            try:
                job_date = parse_date(raw_date)
            except ValueError:
                skipped += 1
                continue
            job_count += 1

            phone_raw = (row.get("Phone") or "").strip()
            summary = (row.get("Summary") or "").strip()
            key = dedup_key(phone_raw, summary)

            existing = by_customer.get(key)
            if existing and existing["_last_date"] >= job_date:
                # Append the older job into notes for context
                existing["_history"].append(f"{raw_date} {row.get('Service','').strip()}")
                continue

            headline = first_nonempty_line(summary)
            company = clean_company_name(headline) or "Unknown"
            service = (row.get("Service") or "").strip().upper()
            vehicle_type = SERVICE_VEHICLE_TYPE.get(service, service or "Unknown")

            try:
                qty = int(row.get("Qty") or 1)
            except ValueError:
                qty = 1

            city = (row.get("City") or "").strip()
            email = (row.get("email") or "").strip()
            phone_norm = phone_raw if phone_raw else ""

            preferred_channel = "call" if phone_norm else ("email" if email else "call")

            # Compact the multiline summary into a single-line note
            flat_summary = re.sub(r"\s+", " ", summary)[:240]
            notes = f"A+ jobs calendar import; service={service}; qty={qty}; original_summary=\"{flat_summary}\""

            history = []
            if existing:
                history = existing.get("_history", [])
                history.append(
                    f"{existing['last_test_date']} {existing.get('_service','')}".strip()
                )

            by_customer[key] = {
                "customer_id": _customer_id(key, len(by_customer) + 1),
                "company_name": company,
                "contact_name": company,
                "phone": phone_norm,
                "email": email,
                "city": city,
                "vehicle_type": vehicle_type,
                "vehicle_count": qty,
                "last_test_date": raw_date,
                "test_cadence_months": DEFAULT_CADENCE_MONTHS,
                "preferred_channel": preferred_channel,
                "last_outcome": "passed",
                "notes": notes,
                "_last_date": job_date,
                "_service": service,
                "_history": history,
            }

    # Append history into notes
    for cust in by_customer.values():
        if cust["_history"]:
            prior = ", ".join(sorted(set(cust["_history"]), reverse=True))
            cust["notes"] = f"{cust['notes']} | prior_visits=[{prior}]"

    # Stable output ordering: by most recent test descending
    ordered = sorted(by_customer.values(), key=lambda c: c["_last_date"], reverse=True)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=ENGINE_COLUMNS)
        writer.writeheader()
        for cust in ordered:
            writer.writerow({k: cust[k] for k in ENGINE_COLUMNS})

    return {
        "input": str(input_path),
        "output": str(output_path),
        "job_rows_read": job_count,
        "rows_skipped": skipped,
        "unique_customers": len(by_customer),
        "with_phone": sum(1 for c in by_customer.values() if c["phone"]),
        "with_email": sum(1 for c in by_customer.values() if c["email"]),
    }


def _customer_id(key: str, ordinal: int) -> str:
    if key.startswith("phone:"):
        digits = key.split(":", 1)[1]
        return f"CUST-P-{digits[-7:]}"
    return f"CUST-S-{ordinal:04d}"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args(argv)

    if not args.input.exists():
        print(f"error: input not found: {args.input}", file=sys.stderr)
        return 2

    stats = import_jobs(args.input, args.output)
    print("A+ Jobs Calendar → Retest CRM import")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
