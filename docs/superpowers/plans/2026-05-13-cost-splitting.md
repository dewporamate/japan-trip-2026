# Cost Splitting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "💸 Split" tab to `budget.html` that lets the group log shared expenses, see per-member balances, and get minimal-transfer settle-up instructions — all stored in localStorage.

**Architecture:** Single-file modification to `budget.html`. Add a tab bar after the sticky header, wrap existing budget content in `<section id="section-budget">`, add a new `<section id="section-split">` with static HTML, and append one `<script>` block containing all split logic. No new files.

**Tech Stack:** Vanilla JS, Tailwind CSS (CDN), localStorage, Sakura Drift design tokens already in budget.html.

---

## File Map

| File | Action | What changes |
|---|---|---|
| `Web/budget.html` | Modify | Tab bar, section wrapping, split HTML, split JS |

---

### Task 1: Add Tab Bar + Wrap Budget Content

**Files:**
- Modify: `Web/budget.html` — around line 226 (after `</header>`) and lines 228–369

- [ ] **Step 1: Locate the exact insertion point**

Open `budget.html`. Find this line (≈ line 226):
```html
  </header>

  <div class="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
```

- [ ] **Step 2: Replace that block — add tab bar and open budget section**

Replace:
```html
  </header>

  <div class="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
```

With:
```html
  </header>

  <!-- Tab Bar -->
  <div class="flex border-b border-white/5 px-5 md:px-10 bg-[#09090b]/85 backdrop-blur-xl sticky top-16 z-30">
    <button id="tab-btn-budget" onclick="switchTab('budget')" class="tab-btn px-5 py-3 text-sm font-['Inter'] font-semibold text-primary border-b-2 border-primary -mb-px transition-all">📊 Budget</button>
    <button id="tab-btn-split" onclick="switchTab('split')" class="tab-btn px-5 py-3 text-sm font-['Inter'] text-zinc-500 border-b-2 border-transparent -mb-px transition-all hover:text-on-surface">💸 Split</button>
  </div>

  <!-- Budget Tab Content -->
  <section id="section-budget">
  <div class="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
```

- [ ] **Step 3: Close the budget section**

Find this block (≈ line 368–369):
```html
  </div>
  <div class="h-16"></div>
```

Replace with:
```html
  </div>
  <div class="h-16"></div>
  </section><!-- /section-budget -->
```

- [ ] **Step 4: Verify in browser**

Open `budget.html` in browser. You should see two tabs ("📊 Budget" and "💸 Split") below the sticky header. Budget tab is active (pink underline). Clicking Split tab should not crash (nothing happens yet).

- [ ] **Step 5: Commit**
```bash
cd "/Users/dew/Desktop/DEW_SECOND_BRAIN/01_Projects/Travel/Tokyo_Japan_No1/Web"
git add budget.html
git commit -m "feat(split): add tab bar and wrap budget content in section"
```

---

### Task 2: Add Split Section HTML

**Files:**
- Modify: `Web/budget.html` — after `</section><!-- /section-budget -->`

- [ ] **Step 1: Insert Split section HTML**

After the line `</section><!-- /section-budget -->`, insert:

```html
  <!-- Split Tab Content -->
  <section id="section-split" style="display:none" class="max-w-5xl mx-auto p-6 md:p-10">

    <!-- Stats row -->
    <div id="split-stats" class="grid grid-cols-3 gap-4 mb-8"></div>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

      <!-- Left column -->
      <div>
        <h4 class="text-xs font-['Inter'] uppercase tracking-widest text-zinc-500 font-bold mb-3">Balance — ใครค้างใคร</h4>
        <div id="split-balance-cards" class="grid grid-cols-3 gap-3 mb-6"></div>

        <h4 class="text-xs font-['Inter'] uppercase tracking-widest text-zinc-500 font-bold mb-3">Settle Up</h4>
        <div id="split-settle-pills" class="flex flex-wrap gap-2 mb-8"></div>

        <div class="flex items-center justify-between mb-3">
          <h4 class="text-xs font-['Inter'] uppercase tracking-widest text-zinc-500 font-bold">Expense Log</h4>
          <button onclick="resetSplitData()" class="text-[10px] font-['Inter'] text-zinc-700 hover:text-primary transition-colors">Reset</button>
        </div>
        <div id="split-expense-log" class="space-y-3"></div>
      </div>

      <!-- Right column: Add form -->
      <div class="bg-[#141414] rounded-2xl p-5 border border-white/5 h-fit sticky top-32">
        <h4 class="text-sm font-['Manrope'] font-black mb-4">➕ เพิ่ม Expense</h4>
        <form id="split-form" class="space-y-3">
          <div>
            <label class="block text-[10px] font-['Inter'] uppercase tracking-widest text-zinc-600 font-bold mb-1">ชื่อรายการ</label>
            <input id="split-name" type="text" required placeholder="เช่น ค่าอาหารเย็น Day 1"
              class="w-full bg-white/5 rounded-lg px-3 py-2 text-sm font-['Public_Sans'] text-on-surface placeholder:text-zinc-700 outline-none focus:ring-1 focus:ring-primary/40">
          </div>
          <div>
            <label class="block text-[10px] font-['Inter'] uppercase tracking-widest text-zinc-600 font-bold mb-1">จำนวนเงิน (฿ THB)</label>
            <input id="split-amount" type="number" min="0" step="0.01" required placeholder="0"
              class="w-full bg-white/5 rounded-lg px-3 py-2 text-sm font-['Public_Sans'] text-on-surface placeholder:text-zinc-700 outline-none focus:ring-1 focus:ring-primary/40">
          </div>
          <div>
            <label class="block text-[10px] font-['Inter'] uppercase tracking-widest text-zinc-600 font-bold mb-1">ผู้จ่าย</label>
            <select id="split-payer" required
              class="w-full bg-white/5 rounded-lg px-3 py-2 text-sm font-['Public_Sans'] text-on-surface outline-none focus:ring-1 focus:ring-primary/40">
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-['Inter'] uppercase tracking-widest text-zinc-600 font-bold mb-1">แบ่งให้ (เลือกได้หลายคน)</label>
            <div id="split-chips" class="flex flex-wrap gap-1.5 mt-1"></div>
          </div>
          <div>
            <label class="block text-[10px] font-['Inter'] uppercase tracking-widest text-zinc-600 font-bold mb-1">หมวด</label>
            <select id="split-category"
              class="w-full bg-white/5 rounded-lg px-3 py-2 text-sm font-['Public_Sans'] text-on-surface outline-none focus:ring-1 focus:ring-primary/40">
              <option value="🏠 Lodging">🏠 Lodging</option>
              <option value="✈️ Transport">✈️ Transport</option>
              <option value="🍜 Food">🍜 Food</option>
              <option value="🎫 Ticket">🎫 Ticket</option>
              <option value="🛡️ Insurance">🛡️ Insurance</option>
              <option value="📱 eSIM / Roaming">📱 eSIM / Roaming</option>
              <option value="📦 Other">📦 Other</option>
            </select>
          </div>
          <div id="split-preview" class="text-xs font-['Inter'] text-zinc-600 bg-white/5 rounded-lg px-3 py-2">
            ÷ 9 คน = ฿0 / คน
          </div>
          <button type="submit"
            class="w-full py-2.5 rounded-full bg-gradient-to-r from-primary to-inverse-primary text-white text-sm font-['Manrope'] font-bold hover:shadow-[0_0_20px_rgba(255,107,157,0.35)] transition-all active:scale-95">
            + เพิ่ม Expense
          </button>
        </form>
      </div>

    </div>
  </section><!-- /section-split -->
```

- [ ] **Step 2: Verify HTML renders**

Open `budget.html`, click "💸 Split" tab. Section should appear (empty — no JS yet). No console errors from the HTML itself.

- [ ] **Step 3: Commit**
```bash
git add budget.html
git commit -m "feat(split): add split section HTML structure"
```

---

### Task 3: Add Split JS — Data Layer

**Files:**
- Modify: `Web/budget.html` — append new `<script>` block before `</main>`

- [ ] **Step 1: Locate insertion point**

Find `</main>` near the end of budget.html (≈ line 463). Insert the following `<script>` block immediately before `</main>`:

```html
<script>
(function(){
'use strict';

/* ── Constants ─────────────────────────────────── */
const MEMBERS = ['DEW','JACK','ALPHA','PIPE','KEANE','SORAWIT','PARIN','ANAWAT','KIDAKON'];
const LS_KEY  = 'japan2026_split';

const SEED_EXPENSES = [
  {
    id: 'seed-1',
    name: 'KETA House OKU (4 คืน)',
    amount: 44116,
    payer: 'DEW',
    splitWith: [...MEMBERS],
    category: '🏠 Lodging',
    settled: [],
    createdAt: 1741000001,
  },
  {
    id: 'seed-2',
    name: 'ตั๋วเครื่องบิน BKK↔NRT (ZIPAIR) — DEW',
    amount: 17619,
    payer: 'DEW',
    splitWith: ['DEW'],
    category: '✈️ Transport',
    settled: ['DEW'],
    createdAt: 1741000002,
  },
  {
    id: 'seed-3',
    name: 'ประกันการเดินทาง SOMPO — DEW',
    amount: 597,
    payer: 'DEW',
    splitWith: ['DEW'],
    category: '🛡️ Insurance',
    settled: ['DEW'],
    createdAt: 1741000003,
  },
  {
    id: 'seed-4',
    name: 'อินเทอร์เน็ต eSIM — DEW',
    amount: 641,
    payer: 'DEW',
    splitWith: ['DEW'],
    category: '📱 eSIM / Roaming',
    settled: ['DEW'],
    createdAt: 1741000004,
  },
];

/* ── Storage ─────────────────────────────────── */
function loadData() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { expenses: SEED_EXPENSES };
}

function saveData(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

/* ── Balance calculation ─────────────────────── */
function computeBalances(expenses) {
  const bal = {};
  MEMBERS.forEach(m => { bal[m] = 0; });
  expenses.forEach(exp => {
    if (!exp.splitWith || exp.splitWith.length === 0) return;
    const share = exp.amount / exp.splitWith.length;
    exp.splitWith.forEach(m => {
      if (m !== exp.payer) {
        bal[exp.payer] = (bal[exp.payer] || 0) + share;
        bal[m] = (bal[m] || 0) - share;
      }
    });
  });
  return bal;
}

/* ── Minimal-transfer settle-up (greedy) ─────── */
function computeSettleUp(balances) {
  const creditors = [];
  const debtors   = [];
  Object.entries(balances).forEach(([m, b]) => {
    if (b >  0.5) creditors.push({ m, b: +b });
    if (b < -0.5) debtors.push(  { m, b: -b });
  });
  creditors.sort((a, b) => b.b - a.b);
  debtors.sort(  (a, b) => b.b - a.b);
  const transfers = [];
  let ci = 0, di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const amount = Math.min(creditors[ci].b, debtors[di].b);
    if (amount > 0.5) {
      transfers.push({ from: debtors[di].m, to: creditors[ci].m, amount: Math.round(amount) });
    }
    creditors[ci].b -= amount;
    debtors[di].b   -= amount;
    if (creditors[ci].b < 0.5) ci++;
    if (debtors[di].b   < 0.5) di++;
  }
  return transfers;
}

/* ── Render helpers ─────────────────────────── */
function fmt(n) { return Number(Math.round(n)).toLocaleString(); }

function renderStats(totalSpend, perPerson, unsettled) {
  const el = document.getElementById('split-stats');
  if (!el) return;
  const items = [
    { val: '฿' + fmt(totalSpend), lbl: 'Total Group Spend' },
    { val: '฿' + fmt(perPerson),  lbl: 'Per Person (÷' + MEMBERS.length + ')' },
    { val: String(unsettled),     lbl: 'Unsettled Expenses' },
  ];
  el.innerHTML = items.map(({ val, lbl }) => `
    <div class="bg-[#1a1a1a] rounded-xl p-4 ring-1 ring-white/5">
      <div class="text-2xl font-black font-['Manrope'] text-primary">${val}</div>
      <div class="text-[10px] font-['Inter'] uppercase tracking-widest text-zinc-500 mt-1">${lbl}</div>
    </div>`).join('');
}

function renderBalanceCards(balances) {
  const el = document.getElementById('split-balance-cards');
  if (!el) return;
  el.innerHTML = MEMBERS.map(m => {
    const b     = balances[m] || 0;
    const color = b >  0.5 ? '#34d399' : b < -0.5 ? '#f87171' : '#52525b';
    const label = b >  0.5 ? 'คนอื่นค้าง' : b < -0.5 ? 'ค้างอยู่' : 'เรียบร้อย ✓';
    const sign  = b >  0.5 ? '+' : b < -0.5 ? '−' : '';
    return `
      <div class="bg-[#1a1a1a] rounded-xl p-3 ring-1 ring-white/5">
        <div class="text-[10px] text-zinc-500 font-['Inter'] font-bold mb-1">${m}</div>
        <div class="text-base font-black font-['Manrope']" style="color:${color}">${sign}฿${fmt(Math.abs(b))}</div>
        <div class="text-[9px] text-zinc-700 font-['Inter'] mt-0.5">${label}</div>
      </div>`;
  }).join('');
}

function renderSettlePills(transfers) {
  const el = document.getElementById('split-settle-pills');
  if (!el) return;
  if (transfers.length === 0) {
    el.innerHTML = '<span class="text-sm text-zinc-600 font-[\'Inter\']">ทุกคนเรียบร้อยแล้ว 🎉</span>';
    return;
  }
  el.innerHTML = transfers.map(t =>
    `<span class="text-xs font-['Inter'] px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">${t.from} → ${t.to} ฿${fmt(t.amount)}</span>`
  ).join('');
}

function renderExpenseLog(expenses) {
  const el = document.getElementById('split-expense-log');
  if (!el) return;
  if (expenses.length === 0) {
    el.innerHTML = '<p class="text-sm text-zinc-600 font-[\'Inter\'] py-6 text-center">ยังไม่มี expense — เพิ่มด้านขวาได้เลย</p>';
    return;
  }
  el.innerHTML = expenses.slice().reverse().map(exp => {
    const perHead = exp.splitWith.length > 0 ? (exp.amount / exp.splitWith.length) : exp.amount;
    const unsettledMembers = exp.splitWith.filter(m => m !== exp.payer && !exp.settled.includes(m));
    const isUnsettled = unsettledMembers.length > 0;
    const ring = isUnsettled ? 'ring-1 ring-primary/30' : 'ring-1 ring-white/5';
    return `
      <div class="bg-[#1a1a1a] rounded-xl p-4 ${ring}">
        <div class="flex items-start gap-3">
          <span class="text-xl shrink-0 mt-0.5">${exp.category.split(' ')[0]}</span>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-sm font-['Public_Sans'] text-on-surface truncate">${exp.name}</div>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <span class="text-[10px] font-['Inter'] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">${exp.payer} จ่าย</span>
              <span class="text-[10px] text-zinc-600 font-['Inter']">÷ ${exp.splitWith.length} คน · ฿${fmt(perHead)} / คน</span>
            </div>
          </div>
          <div class="text-right shrink-0">
            <div class="font-bold text-sm font-['Manrope'] text-on-surface">฿${fmt(exp.amount)}</div>
            ${isUnsettled
              ? `<button onclick="settleExpense('${exp.id}')" class="text-[10px] text-primary font-['Inter'] mt-1 hover:underline">ทุกคนโอนแล้ว ✓</button>`
              : '<div class="text-[9px] text-zinc-600 font-[\'Inter\'] mt-1">เรียบร้อย ✓</div>'
            }
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ── Main render ─────────────────────────────── */
function render() {
  const { expenses } = loadData();
  const balances  = computeBalances(expenses);
  const transfers = computeSettleUp(balances);
  const total     = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = total / MEMBERS.length;
  const unsettled = expenses.filter(e =>
    e.splitWith.some(m => m !== e.payer && !e.settled.includes(m))
  ).length;
  renderStats(total, perPerson, unsettled);
  renderBalanceCards(balances);
  renderSettlePills(transfers);
  renderExpenseLog(expenses);
}

/* ── Form state ──────────────────────────────── */
let selectedSplitWith = new Set(MEMBERS);
let formInited = false;

function initForm() {
  if (formInited) return;
  formInited = true;

  // Payer dropdown
  const payerEl = document.getElementById('split-payer');
  if (payerEl) {
    payerEl.innerHTML = '<option value="">เลือกผู้จ่าย...</option>' +
      MEMBERS.map(m => `<option value="${m}">${m}</option>`).join('');
  }

  // Split-with chips
  const chipsEl = document.getElementById('split-chips');
  if (chipsEl) {
    chipsEl.innerHTML = MEMBERS.map(m =>
      `<button type="button" data-member="${m}" onclick="toggleChip('${m}', this)"
        class="chip-active text-[10px] font-['Inter'] px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 transition-all">${m}</button>`
    ).join('');
  }

  // Form listeners
  const form = document.getElementById('split-form');
  if (form) {
    document.getElementById('split-amount').addEventListener('input', updatePreview);
    form.addEventListener('submit', handleFormSubmit);
  }

  updatePreview();
}

window.toggleChip = function(m, btn) {
  if (selectedSplitWith.has(m)) {
    selectedSplitWith.delete(m);
    btn.className = 'chip-inactive text-[10px] font-[\'Inter\'] px-2.5 py-1 rounded-full bg-white/5 text-zinc-500 border border-transparent transition-all';
  } else {
    selectedSplitWith.add(m);
    btn.className = 'chip-active text-[10px] font-[\'Inter\'] px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 transition-all';
  }
  updatePreview();
};

function updatePreview() {
  const amt = parseFloat(document.getElementById('split-amount')?.value) || 0;
  const n   = selectedSplitWith.size || 1;
  const per = (amt / n).toFixed(0);
  const el  = document.getElementById('split-preview');
  if (el) el.textContent = `÷ ${n} คน = ฿${Number(per).toLocaleString()} / คน`;
}

function handleFormSubmit(e) {
  e.preventDefault();
  const name     = document.getElementById('split-name').value.trim();
  const amount   = parseFloat(document.getElementById('split-amount').value);
  const payer    = document.getElementById('split-payer').value;
  const category = document.getElementById('split-category').value || '📦 Other';
  if (!name || !amount || !payer || selectedSplitWith.size === 0) return;

  const data = loadData();
  data.expenses.push({
    id: crypto.randomUUID(),
    name,
    amount,
    payer,
    splitWith: [...selectedSplitWith],
    category,
    settled: [],
    createdAt: Date.now(),
  });
  saveData(data);

  // Reset form
  e.target.reset();
  selectedSplitWith = new Set(MEMBERS);
  document.querySelectorAll('#split-chips button').forEach(btn => {
    btn.className = 'chip-active text-[10px] font-[\'Inter\'] px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 transition-all';
  });
  updatePreview();
  render();
}

/* ── Actions ─────────────────────────────────── */
window.settleExpense = function(id) {
  const data = loadData();
  const exp  = data.expenses.find(e => e.id === id);
  if (exp) exp.settled = [...exp.splitWith];
  saveData(data);
  render();
};

window.resetSplitData = function() {
  if (!confirm('รีเซ็ต split data ทั้งหมดไหม?')) return;
  localStorage.removeItem(LS_KEY);
  formInited = false;
  selectedSplitWith = new Set(MEMBERS);
  initForm();
  render();
};

/* ── Tab switching ───────────────────────────── */
window.switchTab = function(tab) {
  const tabs = ['budget', 'split'];
  tabs.forEach(t => {
    const section = document.getElementById('section-' + t);
    const btn     = document.getElementById('tab-btn-' + t);
    if (section) section.style.display = t === tab ? '' : 'none';
    if (btn) {
      btn.className = t === tab
        ? 'tab-btn px-5 py-3 text-sm font-[\'Inter\'] font-semibold text-primary border-b-2 border-primary -mb-px transition-all'
        : 'tab-btn px-5 py-3 text-sm font-[\'Inter\'] text-zinc-500 border-b-2 border-transparent -mb-px transition-all hover:text-on-surface';
    }
  });
  if (tab === 'split') {
    initForm();
    render();
  }
};

})();
</script>
```

- [ ] **Step 2: Verify in browser — switch to Split tab**

Open `budget.html`. Click "💸 Split". You should see:
- 3 stat boxes: Total Group Spend ฿63,973, Per Person ฿7,108, Unsettled: 1
- 9 balance cards (DEW shows large positive green balance, others show zero or grey)
- Settle up pills: JACK → DEW ฿4,902, ALPHA → DEW ฿4,902 … (8 pills)
- 4 seed expenses in the log
- Add form on the right with all 9 member chips active

- [ ] **Step 3: Verify form — add a test expense**

In the form:
- Name: "ทดสอบ"
- Amount: 900
- Payer: DEW
- Split: DEW, JACK, ALPHA (deselect others)
- Submit

Expense should appear in log immediately. Stats should update. Balances should recalculate. Reload page — expense should persist (localStorage).

- [ ] **Step 4: Verify settle — mark expense as settled**

Click "ทุกคนโอนแล้ว ✓" on the test expense. It should flip to "เรียบร้อย ✓". Unsettled count should decrease.

- [ ] **Step 5: Verify reset**

Click "Reset" button. Confirm dialog → confirm. Should go back to 4 seed expenses.

- [ ] **Step 6: Commit**
```bash
git add budget.html
git commit -m "feat(split): add full split JS — data, balances, settle-up, form"
```

---

### Task 4: End-to-End Verify + Push

**Files:**
- No new changes — verification and deploy only

- [ ] **Step 1: Verify Budget tab is unaffected**

Switch back to "📊 Budget" tab. All original content (progress bar, categories, chart, transactions) must render correctly. No console errors.

- [ ] **Step 2: Verify mobile layout**

Open DevTools → toggle mobile (375px). Both tabs should be tappable. Split form should stack vertically. Balance cards should scroll.

- [ ] **Step 3: Verify localStorage persistence**

On Split tab: add an expense. Reload page (hard refresh). Switch to Split tab — expense should still be there.

- [ ] **Step 4: Push to Vercel**
```bash
cd "/Users/dew/Desktop/DEW_SECOND_BRAIN/01_Projects/Travel/Tokyo_Japan_No1/Web"
git push origin main
```

Expected: Vercel auto-deploys in ~1 min.

---

## Self-Review Against Spec

| Spec requirement | Covered by |
|---|---|
| Tab bar: Budget \| Split | Task 1 |
| 9 fixed MEMBERS constant | Task 3 — MEMBERS array |
| localStorage `japan2026_split` | Task 3 — LS_KEY, loadData(), saveData() |
| 4 pre-seeded expenses from sheet | Task 3 — SEED_EXPENSES |
| Stat boxes (total, per-person, unsettled) | Task 3 — renderStats() |
| Balance cards per member (green/red/grey) | Task 3 — renderBalanceCards() |
| Minimal-transfer settle-up pills | Task 3 — computeSettleUp() + renderSettlePills() |
| Expense log (payer, split count, per-head) | Task 3 — renderExpenseLog() |
| Add expense form (name, amount, payer, splitWith, category) | Task 2 HTML + Task 3 initForm/handleFormSubmit |
| Live preview ÷N คน = ฿X | Task 3 — updatePreview() |
| Member chip multi-select | Task 3 — toggleChip() |
| Mark as settled | Task 3 — settleExpense() |
| Reset button | Task 3 — resetSplitData() |
| Sakura Drift design tokens | All tasks — uses same Tailwind tokens |
| Budget tab unaffected | Task 4 verification |
