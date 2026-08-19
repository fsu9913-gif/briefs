#!/usr/bin/env python3
"""NAICS-based lead prospecting for NorCal CARB Mobile.

Workflow Bryan wants:
  1. Look at CRM customers → what industries already buy Clean Truck Checks
  2. Map those industries to NAICS codes (leads/naics-sweet-spot.json)
  3. Search Google Business Profile with those terms + city
  4. Dedupe candidates against CRM — current customers go to RETEST, never cold-call

Commands:
  # Print Google Maps search queries for your markets
  python3 leads/naics_prospecting.py --queries --cities Hayward,San\\ Leandro,Fremont

  # Infer industry tags from current CRM company names
  python3 leads/naics_prospecting.py --analyze-crm

  # Dedupe a Google/Maps export CSV against CRM before putting on lead list
  python3 leads/naics_prospecting.py --dedupe leads/candidate-leads.csv \\
      --crm leads/retest-customers.csv \\
      --out-leads leads/cold-call-clean.csv \\
      --out-customers leads/already-customers-retest.csv
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from collections import Counter
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
NAICS_FILE = REPO / "leads" / "naics-sweet-spot.json"
DEFAULT_CRM = REPO / "leads" / "retest-customers.csv"

# Company-name keywords → sweet-spot industry labels
NAME_RULES = [
    (r"\b(tree|arbor|landscap|lawn|garden|nurser|living art)\b", "Tree/Landscaping"),
    (r"\b(truck|transport|freight|hauling|hauler|logistics|carrier|express)\b", "Trucking/Freight"),
    (r"\b(concrete|cement|ready.?mix)\b", "Concrete"),
    (r"\b(paving|asphalt|blacktop)\b", "Asphalt/Paving"),
    (r"\b(tow|recovery|wrecker)\b", "Towing"),
    (r"\b(waste|garbage|refuse|recycling|greenwaste|sanitation)\b", "Waste/Hauling"),
    (r"\b(drill|excav|grading|earthwork|civil)\b", "Drilling/Excavation"),
    (r"\b(mechanical|hvac|plumb|electric|fence)\b", "Construction/Mechanical"),
    (r"\b(motorhome|\\brv\\b)\b", "RV/Motorhome"),
]


def digits_only(value: str) -> str:
    return re.sub(r"\D", "", value or "")


def normalize_name(value: str) -> str:
    s = (value or "").lower().strip()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\b(inc|llc|ltd|corp|co|company|services?|service)\b", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def load_naics() -> dict:
    with open(NAICS_FILE, encoding="utf-8") as f:
        return json.load(f)


def load_crm_exclusions(crm_path: Path) -> tuple[set[str], set[str], list[dict]]:
    """Return (phones_digits, normalized_names, rows)."""
    phones: set[str] = set()
    names: set[str] = set()
    rows: list[dict] = []
    if not crm_path.exists():
        print(f"WARNING: CRM not found at {crm_path}", file=sys.stderr)
        return phones, names, rows
    with open(crm_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
            phone = digits_only(row.get("phone", ""))
            if len(phone) >= 10:
                phones.add(phone[-10:])  # last 10 digits
            name = normalize_name(row.get("company_name", "") or row.get("contact_name", ""))
            if name and len(name) >= 3:
                names.add(name)
    return phones, names, rows


def infer_industry(company_name: str, notes: str = "") -> str | None:
    text = f"{company_name} {notes}".lower()
    for pat, label in NAME_RULES:
        if re.search(pat, text, re.I):
            return label
    return None


def cmd_analyze_crm(crm_path: Path) -> None:
    _, _, rows = load_crm_exclusions(crm_path)
    industries = Counter()
    tagged = 0
    for row in rows:
        label = infer_industry(row.get("company_name", ""), row.get("notes", ""))
        if label:
            industries[label] += 1
            tagged += 1
    print(f"CRM customers: {len(rows)}")
    print(f"Industry-tagged from name keywords: {tagged}")
    print(f"Untagged (still exclude by phone/name on dedupe): {len(rows) - tagged}")
    print()
    print("Inferred industries among current customers:")
    for label, count in industries.most_common():
        print(f"  {count:3d}  {label}")
    print()
    data = load_naics()
    print("→ Use these NAICS / Google searches (from naics-sweet-spot.json):")
    for ind in sorted(data["industries"], key=lambda x: x["priority"]):
        marker = "★" if ind.get("sweet_spot") else " "
        codes = ", ".join(ind["naics"])
        print(f"  {marker} [{codes}] {ind['label']}")
        print(f"      search: {', '.join(ind['google_search_terms'][:4])}")


def cmd_queries(cities: list[str], sweet_spot_only: bool) -> None:
    data = load_naics()
    print("# Google Business Profile / Maps search queries")
    print("# Copy-paste into Google Maps. Then export/copy results and run --dedupe.")
    print()
    for city in cities:
        print(f"## {city}, CA")
        for ind in sorted(data["industries"], key=lambda x: x["priority"]):
            if sweet_spot_only and not ind.get("sweet_spot"):
                continue
            for term in ind["google_search_terms"]:
                print(f'  "{term}" near {city} CA   # NAICS {",".join(ind["naics"])} · {ind["label"]}')
        print()


def find_column(fieldnames: list[str], *candidates: str) -> str | None:
    lower = {f.lower().strip(): f for f in fieldnames}
    for c in candidates:
        if c.lower() in lower:
            return lower[c.lower()]
    return None


def cmd_dedupe(
    candidate_path: Path,
    crm_path: Path,
    out_leads: Path,
    out_customers: Path,
) -> None:
    phones, names, crm_rows = load_crm_exclusions(crm_path)
    # Also build last_test_date lookup by phone / name
    last_test_by_phone: dict[str, str] = {}
    last_test_by_name: dict[str, str] = {}
    for row in crm_rows:
        phone = digits_only(row.get("phone", ""))
        ltd = (row.get("last_test_date") or "").strip()
        if len(phone) >= 10 and ltd:
            last_test_by_phone[phone[-10:]] = ltd
        n = normalize_name(row.get("company_name", ""))
        if n and ltd:
            last_test_by_name[n] = ltd

    with open(candidate_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            print("ERROR: empty CSV", file=sys.stderr)
            sys.exit(1)
        company_col = find_column(reader.fieldnames, "company", "company_name", "name", "business", "business_name")
        phone_col = find_column(reader.fieldnames, "phone", "telephone", "mobile", "phone_number")
        city_col = find_column(reader.fieldnames, "city", "locality")
        type_col = find_column(reader.fieldnames, "type", "category", "industry", "types")
        address_col = find_column(reader.fieldnames, "address", "street", "formatted_address")

        if not company_col and not phone_col:
            print(
                f"ERROR: need a Company or Phone column. Found: {reader.fieldnames}",
                file=sys.stderr,
            )
            sys.exit(1)

        cold: list[dict] = []
        existing: list[dict] = []
        for row in reader:
            company = (row.get(company_col) or "").strip() if company_col else ""
            phone_raw = (row.get(phone_col) or "").strip() if phone_col else ""
            phone = digits_only(phone_raw)
            phone10 = phone[-10:] if len(phone) >= 10 else ""
            nname = normalize_name(company)

            match_reason = None
            last_test = ""
            if phone10 and phone10 in phones:
                match_reason = "phone"
                last_test = last_test_by_phone.get(phone10, "")
            elif nname and nname in names:
                match_reason = "company_name"
                last_test = last_test_by_name.get(nname, "")

            out = {
                "Company": company,
                "Phone": phone_raw,
                "City": (row.get(city_col) or "").strip() if city_col else "",
                "Category": (row.get(type_col) or "").strip() if type_col else "",
                "Address": (row.get(address_col) or "").strip() if address_col else "",
                "Last_Test_Date": last_test,
                "Match_Reason": match_reason or "",
                "Destination": "RETEST" if match_reason else "COLD_CALL",
            }
            # Preserve any extra columns that look useful
            for k, v in row.items():
                if k not in (company_col, phone_col, city_col, type_col, address_col) and k not in out:
                    out[f"src_{k}"] = v

            if match_reason:
                existing.append(out)
            else:
                cold.append(out)

    lead_fields = ["Company", "Phone", "City", "Category", "Address", "Last_Test_Date", "Match_Reason", "Destination"]
    # union of keys for cold
    for r in cold + existing:
        for k in r:
            if k not in lead_fields:
                lead_fields.append(k)

    out_leads.parent.mkdir(parents=True, exist_ok=True)
    with open(out_leads, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=lead_fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(cold)

    with open(out_customers, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=lead_fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(existing)

    print(f"CRM exclusion set: {len(phones)} phones, {len(names)} names")
    print(f"Candidates read:   {len(cold) + len(existing)}")
    print(f"→ COLD CALL list:  {len(cold)}  → {out_leads}")
    print(f"→ Already customers (RETEST, not leads): {len(existing)}  → {out_customers}")
    if existing:
        print()
        print("Existing customers pulled out of lead list:")
        for e in existing[:15]:
            ltd = e["Last_Test_Date"] or "unknown"
            print(f"  [{e['Match_Reason']}] {e['Company']}  last_test={ltd}")
        if len(existing) > 15:
            print(f"  … and {len(existing) - 15} more")


def main() -> None:
    p = argparse.ArgumentParser(description="NAICS prospecting + CRM dedupe for NorCal CARB Mobile")
    p.add_argument("--analyze-crm", action="store_true", help="Tag CRM customers by industry from company names")
    p.add_argument("--queries", action="store_true", help="Print Google Maps search queries")
    p.add_argument("--cities", default="Hayward,San Leandro,San Lorenzo,Fremont,Union City",
                   help="Comma-separated cities for --queries")
    p.add_argument("--all-industries", action="store_true", help="Include non-sweet-spot industries in queries")
    p.add_argument("--dedupe", metavar="CSV", help="Candidate leads CSV from Google/Maps export")
    p.add_argument("--crm", type=Path, default=DEFAULT_CRM, help="CRM CSV (default: retest-customers.csv)")
    p.add_argument("--out-leads", type=Path, default=REPO / "leads" / "cold-call-clean.csv")
    p.add_argument("--out-customers", type=Path, default=REPO / "leads" / "already-customers-retest.csv")
    args = p.parse_args()

    if args.analyze_crm:
        cmd_analyze_crm(args.crm)
        return
    if args.queries:
        cities = [c.strip() for c in args.cities.split(",") if c.strip()]
        cmd_queries(cities, sweet_spot_only=not args.all_industries)
        return
    if args.dedupe:
        cmd_dedupe(Path(args.dedupe), args.crm, args.out_leads, args.out_customers)
        return

    p.print_help()
    print("\nQuick start:")
    print("  python3 leads/naics_prospecting.py --analyze-crm")
    print("  python3 leads/naics_prospecting.py --queries --cities Hayward,San\\ Leandro")
    print("  python3 leads/naics_prospecting.py --dedupe leads/candidate-leads.csv")


if __name__ == "__main__":
    main()
