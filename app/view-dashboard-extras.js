// HearthBudget — view-dashboard-extras.js: the Dashboard's below-the-fold
// sections (the three summary cards, the 6-month trend, the daily spending
// bars and category health), imported lazily by main.js right after the
// cover renders, so they cost the first load nothing. Figures come from
// the same data.js via state.js; the trend's figures live in data-detail.js.
import { INCOME, PLANNED_SAVINGS, CATEGORIES } from './data.js';
import { INCOME_SOURCES, MONTHLY_TREND } from './data-detail.js';
import { rpShort, pct, dateShort } from './format.js';
import { icon } from './icons.js';
import { spentNow, txns } from './state.js';

// Daily cashflow bars: one bar per day, from the transactions (this chart
// sat on the cover until the Payday Forecast took its place in v3).
function dailyBars(transactions, days = 26) {
  const perDay = new Array(days).fill(0);
  for (const t of transactions) {
    const d = parseInt(t.date.slice(8, 10), 10);
    if (d >= 1 && d <= days) perDay[d - 1] += t.amount;
  }
  const max = Math.max(...perDay, 1);
  const w = 560, h = 120, bw = w / days;
  const bars = perDay.map((v, i) => {
    const bh = Math.max(v > 0 ? 4 : 0, (v / max) * (h - 26));
    const x = (i * bw + 2).toFixed(1);
    return `<rect x="${x}" y="${(h - 22 - bh).toFixed(1)}" width="${(bw - 4).toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${v > 0 ? '#0f766e' : '#e7e0d2'}"><title>Nov ${i + 1}: ${rpShort(v)}</title></rect>`;
  }).join('');
  const labels = [1, 14, 26].map(d => {
    const anchor = d === 1 ? 'start' : d === days ? 'end' : 'middle';
    const x = d === 1 ? 2 : d === days ? w - 2 : ((d - 1) * bw + bw / 2).toFixed(1);
    return `<text x="${x}" y="${h - 4}" text-anchor="${anchor}" class="bar-label">Nov ${d}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Daily spending bars, November 1 to 26">${bars}${labels}</svg>`;
}

// Biggest single spending day, computed from the transactions.
function biggestDayLine(list) {
  const perDay = {};
  for (const t of list) perDay[t.date] = (perDay[t.date] || 0) + t.amount;
  let best = null, bestVal = 0;
  for (const [d, v] of Object.entries(perDay)) if (v > bestVal) { best = d; bestVal = v; }
  return `Biggest day: ${dateShort(best)} (${rpShort(bestVal)}). Quiet days are the gaps — the family cooks at home.`;
}

// Six-month trend: grouped bars, income (teal) vs spending (amber).
function trendBars(trend) {
  const w = 980, h = 218, top = 24, base = h - 20;
  const max = Math.max(...trend.map(m => m.income)) * 1.08;
  const y = v => top + (1 - v / max) * (base - top);
  const slot = w / trend.length, bw = 44;
  const groups = trend.map((m, i) => {
    const cx = slot * i + slot / 2;
    const kept = m.income - m.spent;
    return `<rect x="${(cx - bw - 3).toFixed(1)}" y="${y(m.income).toFixed(1)}" width="${bw}" height="${(base - y(m.income)).toFixed(1)}" rx="3" fill="#0f766e"><title>${m.month} income: ${rpShort(m.income)}</title></rect>
    <rect x="${(cx + 3).toFixed(1)}" y="${y(m.spent).toFixed(1)}" width="${bw}" height="${(base - y(m.spent)).toFixed(1)}" rx="3" fill="#d97706"><title>${m.month} spending: ${rpShort(m.spent)} · kept ${rpShort(kept)}</title></rect>
    <text x="${(cx - bw / 2 - 3).toFixed(1)}" y="${(y(m.income) - 5).toFixed(1)}" text-anchor="middle" class="bar-label">${rpShort(m.income)}</text>
    <text x="${(cx + bw / 2 + 3).toFixed(1)}" y="${(y(m.spent) - 5).toFixed(1)}" text-anchor="middle" class="bar-label">${rpShort(m.spent)}</text>
    <text x="${cx.toFixed(1)}" y="${h - 5}" text-anchor="middle" class="bar-label">${m.month} 2026</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Income versus spending, June to November 2026">${groups}</svg>`;
}

function trendPanel() {
  const best = MONTHLY_TREND.reduce((m, x) => (x.income - x.spent > m.income - m.spent ? x : m), MONTHLY_TREND[0]);
  return `
  <section class="card trend-card">
    <div class="card-head">
      <h2>Six months · income vs spending</h2>
      <p class="card-head-note"><span class="dot" style="background:#0f766e"></span>Income&nbsp;&nbsp;<span class="dot" style="background:#d97706"></span>Spending</p>
    </div>
    ${trendBars(MONTHLY_TREND)}
    <p class="card-sub">Every month ends ahead. Best so far: <b>${best.month} 2026</b> kept ${rpShort(best.income - best.spent)} of ${rpShort(best.income)} — November is the live month, 26 days in.</p>
  </section>`;
}

export function renderExtras() {
  const spent = spentNow();
  const health = CATEGORIES.map(c => {
    const frac = Math.min(1, c.actual / c.planned);
    const over = c.actual > c.planned;
    return `<li class="health-row">
      <span class="health-label">${icon(c.icon)} ${c.label}</span>
      <span class="health-bar"><span style="width:${Math.round(frac * 100)}%;background:${over ? '#b91c1c' : '#0f766e'}"></span></span>
      <span class="health-nums">${rpShort(c.actual)} <em>of ${rpShort(c.planned)}</em></span>
    </li>`;
  }).join('');
  return `
  <section class="cards3">
    <div class="card"><p class="card-label">Income · Nov</p><p class="card-big">${rpShort(INCOME)}</p><p class="card-sub">${INCOME_SOURCES.map(s => s.label.split(' — ')[0] + ' ' + rpShort(s.amount)).join(' · ')}</p></div>
    <div class="card"><p class="card-label">Spent so far</p><p class="card-big">${rpShort(spent)}</p><p class="card-sub">${pct(spent / INCOME)} of income · ${txns.length} transactions</p></div>
    <div class="card"><p class="card-label">Planned savings</p><p class="card-big">${rpShort(PLANNED_SAVINGS)}</p><p class="card-sub">Emergency + Lebaran + school funds</p></div>
  </section>
  ${trendPanel()}
  <section class="card">
    <h2>Daily spending · Nov 1–26</h2>
    ${dailyBars(txns)}
    <p class="card-sub">${biggestDayLine(txns)}</p>
  </section>
  <section class="card">
    <h2>Category health — actual vs planned</h2>
    <ul class="health">${health}</ul>
  </section>`;
}
