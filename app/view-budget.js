// HearthBudget — view-budget.js: the Budget Plan (route #/budget), loaded
// lazily on first visit. One slider per category; dragging recalculates the
// 50/30/20 strip values' basis, the row's Remaining cell and the totals live.
import { INCOME, PLANNED_SAVINGS, CATEGORIES } from './data.js';
import { RULE_50_30_20 } from './data-detail.js';
import { rpShort, rpFull, pct } from './format.js';
import { icon } from './icons.js';
import { plannedOf, plannedTotal, leftNow, setPlanned, catById } from './state.js';

export function render() {
  const groups = { needs: 0, wants: 0 };
  for (const c of CATEGORIES) groups[c.group] += plannedOf(c);
  const needsPct = groups.needs / INCOME, wantsPct = groups.wants / INCOME, savPct = PLANNED_SAVINGS / INCOME;
  const unalloc0 = INCOME - plannedTotal() - PLANNED_SAVINGS;
  const rows = CATEGORIES.map(c => {
    const p = plannedOf(c);
    const remain = p - c.actual;
    return `<tr>
      <td><span class="cat-cell">${icon(c.icon)} ${c.label}</span></td>
      <td class="num"><input type="range" min="0" max="6000000" step="50000" value="${p}" data-cat="${c.id}" aria-label="Planned ${c.label}"><span class="slider-val" data-val="${c.id}">${rpShort(p)}</span></td>
      <td class="num">${rpShort(c.actual)}</td>
      <td class="num ${remain < 0 ? 'over' : ''}">${remain < 0 ? '−' : '+'}${rpShort(Math.abs(remain))}</td>
      <td><span class="mini-bar"><span style="width:${Math.min(100, Math.round(c.actual / p * 100))}%"></span></span></td>
    </tr>`;
  }).join('');
  return `
  <section class="page-head">
    <h1>Budget Plan — November</h1>
    <p>Drag a slider and the totals below recalculate instantly. Planned across categories + savings must equal income (${rpShort(INCOME)}).</p>
  </section>
  <p class="plan-strip">Planned total <b data-strip="planned">${rpFull(plannedTotal())}</b> · Unallocated <b data-strip="unallocated"${unalloc0 < 0 ? ' class="over"' : ''}>${rpFull(unalloc0)}</b></p>
  <section class="rule-strip">
    <div class="rule-cell"><p class="rule-name">Needs · 50/30/20 target ${pct(RULE_50_30_20.needs)}</p><p class="rule-big">${rpShort(groups.needs)}</p><p class="rule-sub">${pct(needsPct)} of income — Jakarta reality runs above 50%</p></div>
    <div class="rule-cell"><p class="rule-name">Wants · target ${pct(RULE_50_30_20.wants)}</p><p class="rule-big">${rpShort(groups.wants)}</p><p class="rule-sub">${pct(wantsPct)} of income</p></div>
    <div class="rule-cell"><p class="rule-name">Savings · target ${pct(RULE_50_30_20.savings)}</p><p class="rule-big">${rpShort(PLANNED_SAVINGS)}</p><p class="rule-sub">${pct(savPct)} of income — planned savings rate</p></div>
  </section>
  <section class="card">
    <table class="budget-table">
      <thead><tr><th>Category</th><th>Planned (drag)</th><th>Actual</th><th>Remaining</th><th>Used</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals" id="budget-totals">
      <p>Total planned (categories): <b data-total="planned">${rpFull(plannedTotal())}</b></p>
      <p>+ Planned savings: <b>${rpFull(PLANNED_SAVINGS)}</b></p>
      <p>= Allocated: <b data-total="allocated">${rpFull(plannedTotal() + PLANNED_SAVINGS)}</b> of income ${rpFull(INCOME)}</p>
      <p class="totals-line">Unallocated: <b data-total="unallocated">${rpFull(INCOME - plannedTotal() - PLANNED_SAVINGS)}</b> · Left to spend: <b>${rpFull(leftNow())}</b></p>
    </div>
  </section>`;
}

export function wire() {
  document.querySelectorAll('input[type=range][data-cat]').forEach(slider => {
    slider.addEventListener('input', () => {
      setPlanned(slider.dataset.cat, Number(slider.value));
      const valEl = document.querySelector(`[data-val="${slider.dataset.cat}"]`);
      if (valEl) valEl.textContent = rpShort(Number(slider.value));
      const pt = plannedTotal();
      const set = (k, v) => { const el = document.querySelector(`[data-total="${k}"]`); if (el) el.textContent = rpFull(v); };
      set('planned', pt);
      set('allocated', pt + PLANNED_SAVINGS);
      set('unallocated', INCOME - pt - PLANNED_SAVINGS);
      // The always-visible summary strip under the page head mirrors the totals.
      const sp = document.querySelector('[data-strip="planned"]');
      if (sp) sp.textContent = rpFull(pt);
      const su = document.querySelector('[data-strip="unallocated"]');
      if (su) {
        const u = INCOME - pt - PLANNED_SAVINGS;
        su.textContent = rpFull(u);
        su.classList.toggle('over', u < 0);
      }
      // Refresh the Remaining cell of the edited row live.
      const row = slider.closest('tr');
      const cat = catById(slider.dataset.cat);
      const remainCell = row && row.querySelector('td:nth-child(4)');
      if (remainCell) {
        const r = Number(slider.value) - cat.actual;
        remainCell.textContent = (r < 0 ? '−' : '+') + rpShort(Math.abs(r));
        remainCell.classList.toggle('over', r < 0);
      }
    });
  });
}
