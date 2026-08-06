#!/usr/bin/env python3
"""Monthly Retest Retention Engine — NorCal CARB Mobile.

Reads a Master CRM export (CSV) of existing CARB Clean Truck Check customers,
calculates each customer's next retest due date, buckets them by urgency, and
emits a Markdown report plus a machine-readable JSON snapshot.

Buckets:
  URGENT (≤ 7 days)   — call immediately
  HOT    (8–30 days)  — call this week
  WARM   (31–60 days) — email + follow-up call
  EARLY  (61–90 days) — email reminder only
  OUT    (> 90 days)  — re-check next month

Usage:
  python3 leads/retest_retention_check.py
  python3 leads/retest_retention_check.py --input leads/retest-customers.csv
  python3 leads/retest_retention_check.py --as-of 2026-06-23
  python3 leads/retest_retention_check.py --output-dir docs

Spec: briefs/retest-retention-check.json
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from dataclasses import dataclass, asdict, field
from datetime import date, datetime
from pathlib import Path
from typing import Iterable

REPO_ROOT = Path(__file__).resolve().parent.parent
REAL_INPUT = REPO_ROOT / "leads" / "retest-customers.csv"
SAMPLE_INPUT = REPO_ROOT / "leads" / "retest-customers-sample.csv"
DEFAULT_REPORT_DIR = REPO_ROOT / "docs"
DEFAULT_BRIEF_DIR = REPO_ROOT / "briefs"


def default_input() -> Path:
    """Prefer a real Master CRM export if one has been dropped in."""
    return REAL_INPUT if REAL_INPUT.exists() else SAMPLE_INPUT


def display_path(path: Path) -> str:
    """Return a repo-relative path when possible, else absolute."""
    try:
        return str(path.resolve().relative_to(REPO_ROOT))
    except ValueError:
        return str(path)

DEFAULT_CADENCE_MONTHS = 12

BUCKETS = [
    ("urgent", "🔴 URGENT", -10_000, 7, "Call immediately"),
    ("hot", "🟠 HOT", 8, 30, "Call this week"),
    ("warm", "🟡 WARM", 31, 60, "Email + follow-up call"),
    ("early", "🟢 EARLY", 61, 90, "Email reminder only"),
    ("out_of_window", "⚪ OUT OF WINDOW", 91, 10_000, "Re-check next month"),
]


def parse_date(value: str) -> date:
    value = (value or "").strip()
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%m/%d/%y"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Unrecognized date format: {value!r}")


def add_months(d: date, months: int) -> date:
    """Add `months` calendar months to a date, clamping to last day of month."""
    total_month = d.month - 1 + months
    year = d.year + total_month // 12
    month = total_month % 12 + 1
    # Clamp day to the last valid day of the target month.
    if month == 12:
        next_first = date(year + 1, 1, 1)
    else:
        next_first = date(year, month + 1, 1)
    last_day = (next_first.toordinal() - 1) - date(year, month, 1).toordinal() + 1
    return date(year, month, min(d.day, last_day))


def bucket_for(days_until_due: int) -> tuple[str, str, str]:
    for bid, label, lo, hi, action in BUCKETS:
        if lo <= days_until_due <= hi:
            return bid, label, action
    return "out_of_window", "⚪ OUT OF WINDOW", "Re-check next month"


@dataclass
class Customer:
    customer_id: str
    company_name: str
    contact_name: str
    phone: str
    email: str
    city: str
    vehicle_type: str
    vehicle_count: int
    last_test_date: date
    test_cadence_months: int
    preferred_channel: str
    last_outcome: str
    notes: str
    next_due_date: date = field(init=False)
    days_until_due: int = field(init=False)
    bucket_id: str = field(init=False)
    bucket_label: str = field(init=False)
    recommended_action: str = field(init=False)

    def compute(self, as_of: date) -> None:
        self.next_due_date = add_months(self.last_test_date, self.test_cadence_months)
        self.days_until_due = (self.next_due_date - as_of).days
        self.bucket_id, self.bucket_label, self.recommended_action = bucket_for(
            self.days_until_due
        )

    def to_dict(self) -> dict:
        d = asdict(self)
        d["last_test_date"] = self.last_test_date.isoformat()
        d["next_due_date"] = self.next_due_date.isoformat()
        return d


def load_customers(path: Path) -> list[Customer]:
    customers: list[Customer] = []
    with path.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row_num, row in enumerate(reader, start=2):
            try:
                customers.append(
                    Customer(
                        customer_id=row["customer_id"].strip(),
                        company_name=row["company_name"].strip(),
                        contact_name=row["contact_name"].strip(),
                        phone=row["phone"].strip(),
                        email=row["email"].strip(),
                        city=row["city"].strip(),
                        vehicle_type=row["vehicle_type"].strip(),
                        vehicle_count=int(row.get("vehicle_count") or 1),
                        last_test_date=parse_date(row["last_test_date"]),
                        test_cadence_months=int(
                            row.get("test_cadence_months") or DEFAULT_CADENCE_MONTHS
                        ),
                        preferred_channel=(row.get("preferred_channel") or "").strip()
                        or "call",
                        last_outcome=(row.get("last_outcome") or "").strip() or "unknown",
                        notes=(row.get("notes") or "").strip(),
                    )
                )
            except (KeyError, ValueError) as exc:
                print(
                    f"warning: skipping row {row_num} ({exc})",
                    file=sys.stderr,
                )
    return customers


def group_by_bucket(customers: Iterable[Customer]) -> dict[str, list[Customer]]:
    groups: dict[str, list[Customer]] = {bid: [] for bid, *_ in BUCKETS}
    for c in customers:
        groups[c.bucket_id].append(c)
    for items in groups.values():
        items.sort(key=lambda c: (c.days_until_due, c.company_name))
    return groups


def render_markdown(
    as_of: date,
    customers: list[Customer],
    groups: dict[str, list[Customer]],
    source: Path,
) -> str:
    total = len(customers)
    counts = {bid: len(items) for bid, items in groups.items()}
    actionable = counts["urgent"] + counts["hot"] + counts["warm"] + counts["early"]

    lines: list[str] = []
    lines.append(f"# Monthly Retest Retention Check — {as_of:%B %Y}")
    lines.append("")
    lines.append(
        f"_Generated {as_of.isoformat()} from `{display_path(source)}` "
        f"by `leads/retest_retention_check.py`._"
    )
    lines.append("")
    if source.name == "retest-customers-sample.csv":
        lines.append(
            "> ⚠️ **Demo data.** This run used the synthetic sample dataset because "
            "no `leads/retest-customers.csv` export was present. Export the Master "
            "CRM (`1TdNnf7eLaPNN3anaBGpNdjo_unK04zWwZJ859ZDvIO4`) to "
            "`leads/retest-customers.csv` and re-run before calling anyone."
        )
        lines.append("")

    if customers:
        min_last = min(c.last_test_date for c in customers)
        max_last = max(c.last_test_date for c in customers)
        min_next = min(c.next_due_date for c in customers)
        max_next = max(c.next_due_date for c in customers)
        with_phone = sum(1 for c in customers if c.phone.strip())
        with_email = sum(1 for c in customers if c.email.strip())
        lines.append("## Source coverage")
        lines.append("")
        lines.append(f"- Customers in source: **{total}**")
        lines.append(
            f"- Last-test date range: **{min_last.isoformat()} → {max_last.isoformat()}**"
        )
        lines.append(
            f"- Next-due date range: **{min_next.isoformat()} → {max_next.isoformat()}**"
        )
        lines.append(f"- With phone: {with_phone}  •  with email: {with_email}")
        lines.append("")
        if actionable == 0:
            lines.append(
                "> ⚠️ **Nothing actionable this cycle.** Every customer's next retest "
                "is more than 90 days out. The source file likely covers only a recent "
                "slice — to find URGENT/HOT retests you'll need an export that includes "
                "customers last tested ~9–12 months ago. See the 12-month pipeline "
                "below for the forward look."
            )
            lines.append("")
    lines.append("> **Spec:** [`briefs/retest-retention-check.json`](../briefs/retest-retention-check.json)  ")
    lines.append("> **Trigger:** Calendar event _Monthly Retest Retention Check - Run Skill_ (23rd of every month)  ")
    lines.append("> **Trigger phrase:** `Run monthly retest check`")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append("| Bucket | Window | Action | Count |")
    lines.append("|---|---|---|---:|")
    for bid, label, lo, hi, action in BUCKETS:
        if bid == "urgent":
            window = "≤ 7 days (incl. overdue)"
        elif bid == "out_of_window":
            window = "> 90 days"
        else:
            window = f"{lo}–{hi} days"
        lines.append(f"| {label} | {window} | {action} | {counts[bid]} |")
    lines.append(f"| **Total** | — | — | **{total}** |")
    lines.append("")
    lines.append(
        f"**Actionable this cycle:** {actionable} of {total} "
        f"({(actionable / total * 100):.0f}% of customers)."
        if total
        else "**Actionable this cycle:** 0"
    )
    lines.append("")

    bucket_titles = {
        "urgent": "🔴 URGENT — Call immediately (≤ 7 days)",
        "hot": "🟠 HOT — Call this week (8–30 days)",
        "warm": "🟡 WARM — Email + follow-up call (31–60 days)",
        "early": "🟢 EARLY — Email reminder only (61–90 days)",
        "out_of_window": "⚪ OUT OF WINDOW — Re-check next month (> 90 days)",
    }

    for bid, _label, *_rest in BUCKETS:
        items = groups[bid]
        lines.append(f"## {bucket_titles[bid]}")
        lines.append("")
        if not items:
            lines.append("_No customers in this bucket this cycle._")
            lines.append("")
            continue
        lines.append(
            "| # | Company | Contact | Phone | Email | City | Vehicle | "
            "Last test | Cadence | Next due | Days |"
        )
        lines.append("|---:|---|---|---|---|---|---|---|---:|---|---:|")
        for i, c in enumerate(items, start=1):
            days_cell = (
                f"**{c.days_until_due}**"
                if c.days_until_due <= 7
                else str(c.days_until_due)
            )
            lines.append(
                f"| {i} | {c.company_name} | {c.contact_name} | {c.phone} | "
                f"{c.email} | {c.city} | {c.vehicle_type} ×{c.vehicle_count} | "
                f"{c.last_test_date.isoformat()} | {c.test_cadence_months} mo | "
                f"{c.next_due_date.isoformat()} | {days_cell} |"
            )
        lines.append("")

    if counts["warm"] + counts["early"] > 0:
        lines.append("## Suggested email blast (WARM + EARLY)")
        lines.append("")
        lines.append("**Subject:** Your CARB Clean Truck Check is coming up — we'll come to you")
        lines.append("")
        lines.append("```")
        lines.append("Hi {{contactName}},")
        lines.append("")
        lines.append(
            "Quick reminder from Bryan at NorCal CARB Mobile — your last Clean Truck "
            "Check on {{lastTestDate}} for {{vehicleType}} puts your next CARB"
        )
        lines.append(
            "compliance check due around {{nextDueDate}} (~{{daysUntilDue}} days "
            "out)."
        )
        lines.append("")
        lines.append(
            "Let's get ahead of it before the State does. Mobile OBD + smoke "
            "opacity, 30 min per truck, 24/7."
        )
        lines.append("")
        lines.append("Reply with a window that works, or text 916-890-4427.")
        lines.append("")
        lines.append("Bryan — NorCal CARB Mobile — 916-890-4427")
        lines.append("```")
        lines.append("")
    lines.append("## 12-month retest pipeline")
    lines.append("")
    lines.append(
        "Forward-looking view: how many of the current customers will hit each "
        "monthly check cycle if cadences hold."
    )
    lines.append("")
    lines.append("| Month | Customers becoming due (within 90 days of that check) |")
    lines.append("|---|---:|")
    for month_offset in range(0, 12):
        check_date = add_months(as_of.replace(day=1), month_offset)
        count = sum(
            1
            for c in customers
            if 0 <= (c.next_due_date - check_date).days <= 90
        )
        lines.append(f"| {check_date:%Y-%m} | {count} |")
    lines.append("")

    lines.append("## Next steps")
    lines.append("")
    lines.append("1. Create call tasks in Gumption → Cold Calls for every 🔴 URGENT and 🟠 HOT row.")
    lines.append("2. Paste the email body above into Squarespace Email Campaigns; audience = 🟡 WARM + 🟢 EARLY.")
    lines.append("3. After each touch, update the Master CRM (`contact_status`, `contact_date`, `next_action`).")
    lines.append("4. Send Google Calendar invites for confirmed retest appointments.")
    lines.append("")
    return "\n".join(lines)


def render_json(
    as_of: date,
    customers: list[Customer],
    groups: dict[str, list[Customer]],
    source: Path,
) -> dict:
    counts = {bid: len(items) for bid, items in groups.items()}
    return {
        "brief": {
            "id": f"retest-retention-{as_of:%Y-%m}",
            "title": f"Retest Retention Snapshot — {as_of:%B %Y}",
            "type": "monthly-snapshot",
            "asOf": as_of.isoformat(),
            "source": display_path(source),
            "spec": "briefs/retest-retention-check.json",
        },
        "stats": {
            "totalCustomers": len(customers),
            "urgent": counts["urgent"],
            "hot": counts["hot"],
            "warm": counts["warm"],
            "early": counts["early"],
            "outOfWindow": counts["out_of_window"],
            "actionable": counts["urgent"] + counts["hot"] + counts["warm"] + counts["early"],
        },
        "buckets": {
            bid: [c.to_dict() for c in items] for bid, items in groups.items()
        },
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--input",
        type=Path,
        default=None,
        help=(
            "CSV export of the Master CRM. Defaults to "
            f"{REAL_INPUT.relative_to(REPO_ROOT)} when present, otherwise "
            f"{SAMPLE_INPUT.relative_to(REPO_ROOT)}."
        ),
    )
    parser.add_argument(
        "--as-of",
        type=parse_date,
        default=date.today(),
        help="Date to evaluate retests against (YYYY-MM-DD). Defaults to today.",
    )
    parser.add_argument(
        "--report-dir",
        type=Path,
        default=DEFAULT_REPORT_DIR,
        help="Where to write the Markdown report.",
    )
    parser.add_argument(
        "--brief-dir",
        type=Path,
        default=DEFAULT_BRIEF_DIR,
        help="Where to write the JSON snapshot.",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Suppress the bucket summary printed to stdout.",
    )
    args = parser.parse_args(argv)
    if args.input is None:
        args.input = default_input()

    if not args.input.exists():
        print(f"error: input CSV not found: {args.input}", file=sys.stderr)
        return 2

    customers = load_customers(args.input)
    for c in customers:
        c.compute(args.as_of)
    customers.sort(key=lambda c: c.days_until_due)
    groups = group_by_bucket(customers)

    args.report_dir.mkdir(parents=True, exist_ok=True)
    args.brief_dir.mkdir(parents=True, exist_ok=True)
    report_path = args.report_dir / f"retest-retention-{args.as_of:%Y-%m}.md"
    snapshot_path = args.brief_dir / f"retest-retention-{args.as_of:%Y-%m}.json"

    report_path.write_text(
        render_markdown(args.as_of, customers, groups, args.input), encoding="utf-8"
    )
    snapshot = render_json(args.as_of, customers, groups, args.input)
    snapshot_path.write_text(
        json.dumps(snapshot, indent=2) + "\n", encoding="utf-8"
    )

    if not args.quiet:
        stats = snapshot["stats"]
        print(f"Retest Retention Check — as of {args.as_of.isoformat()}")
        print(f"  Source:    {display_path(args.input)}")
        print(f"  Customers: {stats['totalCustomers']}")
        print(f"  🔴 URGENT: {stats['urgent']}")
        print(f"  🟠 HOT:    {stats['hot']}")
        print(f"  🟡 WARM:   {stats['warm']}")
        print(f"  🟢 EARLY:  {stats['early']}")
        print(f"  ⚪ OUT:    {stats['outOfWindow']}")
        print(f"  Report:    {display_path(report_path)}")
        print(f"  Snapshot:  {display_path(snapshot_path)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
