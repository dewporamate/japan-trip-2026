# Cost Splitting — Design Spec
**Date:** 2026-05-13  
**File:** `Web/budget.html`  
**Status:** Approved

---

## Overview

Add a **Split tab** inside `budget.html` alongside the existing Budget tab. Users can log shared expenses, assign a payer, select which members split each expense, and see a live balance summary with minimal-transfer settle-up instructions.

---

## Placement

`budget.html` gains a **tab bar** at the top of `<main>`:
- Tab 1: `📊 Budget` — existing content (unchanged)
- Tab 2: `💸 Split` — new content rendered by this feature

Switching tabs shows/hides the respective `<section>` via JS. No page navigation; no new file.

---

## Members

9 fixed members from the trip spreadsheet, stored as a JS constant:

```
DEW, JACK, ALPHA, PIPE, KEANE, SORAWIT, PARIN, ANAWAT, KIDAKON
```

---

## Data Model

All data lives in `localStorage` under key `japan2026_split`.

```js
{
  expenses: [
    {
      id: string,           // crypto.randomUUID()
      name: string,         // "KETA House OKU"
      amount: number,       // THB total
      payer: string,        // member name
      splitWith: string[],  // member names who share this expense
      category: string,     // emoji + label e.g. "🏠 Lodging"
      settled: string[],    // members who have marked their share settled
      createdAt: number,    // timestamp
    }
  ]
}
```

Pre-seeded with 3 expenses from the spreadsheet:
1. KETA House OKU — ฿44,116 — DEW — ÷ all 9
2. ประกันการเดินทาง — ฿596.72 — DEW — individual (DEW only)
3. eSIM — ฿640.93 — DEW — individual (DEW only)

---

## Split Tab Layout

### Row 1 — Stat boxes (3 columns)
- Total group spend (sum of all expenses)
- Per person average (total ÷ 9)
- Unsettled count (expenses with `settled` not complete)

### Row 2 — Main content (2-column grid: left 60%, right 40%)

**Left column:**

1. **Balance cards** — one card per member showing net balance (positive = owed, negative = owes, zero = settled). Color coded: green / red / grey.
2. **Settle up pills** — minimal-transfer algorithm output: "A → B ฿X" for each required transfer.
3. **Expense log** — list of all expenses. Each row: emoji, name, payer tag, split count, total amount, per-person amount. Highlight rows where payer is unset.

**Right column:**

**Add Expense form:**
- Name (text input)
- Amount in THB (number input)
- Payer (select from member list)
- Split with (multi-select chip grid, default = all 9)
- Category (select: 🏠 Lodging / ✈️ Transport / 🍜 Food / 🎫 Ticket / 🛡️ Insurance / 📱 eSIM / 📦 Other)
- Live preview: "÷ N คน = ฿X / คน"
- Submit button

**Mark settled:** each expense row has a "✓ Settle" button per member (or "ทุกคนโอนแล้ว" to settle all at once).

---

## Balance Calculation

For each expense:
- `sharePerPerson = amount / splitWith.length`
- For each member in `splitWith`: if not `payer`, they owe `payer` that amount

Sum across all expenses → net balance per member pair → apply minimal-transfer algorithm (greedy: largest debtor pays largest creditor first).

---

## Persistence

- `localStorage` key: `japan2026_split`
- Load on tab open, save on every add/settle action
- "Reset" button clears localStorage and re-seeds defaults

---

## Constraints

- No backend, no auth — purely client-side
- Matches Sakura Drift dark design system (same tokens, fonts, border-radius as rest of budget.html)
- Must not break existing Budget tab content or JS
