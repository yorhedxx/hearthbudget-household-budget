// HearthBudget — view-dashboard.js: the Dashboard (route #/), the cover
// page: hero, bills strip, donut + Payday Forecast — all in the first
// screen. Everything below the fold lives in view-dashboard-extras.js.
import {
  INCOME, PLANNED_SAVINGS, CATEGORIES, SAVINGS_RATE, MONTH, BILLS, paydayForecast,
} from './data.js';
import { rpShort, rpFull, pct, dateShort, daysUntil } from './format.js';
import { donut, forecastChart, PALETTE } from './charts.js';
import { spentNow, leftNow, paidState } from './state.js';

function whenLabel(iso) {
  const d = daysUntil(iso);
  return d === 0 ? 'today' : d === 1 ? 'tomorrow' : 'in ' + d + ' days';
}

// The forecast panel: verdict chip first (it must read at contact-sheet
// size), then the stepped line, then the model's ingredients in one line.
function forecastPanel() {
  const fc = paydayForecast(BILLS.filter((b, i) => !paidState[i]), leftNow());
  const billNames = fc.days.flatMap(d => d.bills.map(b => b.label.split(' — ')[0])).join(' · ');
  const tight = `tightest ${dateShort(fc.lowestDate)}: <b>${rpShort(fc.lowest)}</b>`;
  const [chip, cls, word] = fc.lowest < 0
    ? ['SHORT', 'fc-short', `runs out ${dateShort(fc.lowestDate)} — move money before then`]
    : fc.lowest < 500000
      ? ['TIGHT', 'fc-tight', `survives to payday, barely — ${tight}`]
      : ['SAFE', '', `until payday — ${tight}`];
  const verdict = `<span class="fc-chip ${cls}">${chip}</span> ${word}`;
  return `<p class="forecast-verdict">${verdict}</p>${forecastChart(fc)}<p class="card-sub">Bills before payday <b>${rpShort(fc.billsTotal)}</b> (${billNames}) · everyday essentials ≈ ${rpShort(fc.rate)}/day · salary lands 1 Dec</p>`;
}

export function render() {
  const spent = spentNow(), left = leftNow();
  const upcoming = BILLS.filter((b, i) => !paidState[i])
    .sort((a, b) => a.due.localeCompare(b.due)).slice(0, 6);
  const dueTotal = upcoming.reduce((s, b) => s + b.amount, 0);
  return `
<section class="hero">
  <div>
    <p class="kicker">November 2026 · ${MONTH.daySoFar} days in · Family Pramudya, Jakarta</p>
    <h1>Left to spend</h1>
    <p class="hero-big">${rpFull(left)}</p>
    <p class="hero-sub">Income ${rpShort(INCOME)} − spent ${rpShort(spent)} − savings ${rpShort(PLANNED_SAVINGS)}</p>
  </div>
  <div class="hero-side">
    <p class="hero-rate">${pct(SAVINGS_RATE)}</p>
    <p class="hero-rate-label">planned savings rate<br>${rpShort(PLANNED_SAVINGS)} of ${rpShort(INCOME)} income</p>
    <a class="btn" href="#/budget">Adjust the plan →</a>
  </div>
</section>
<section class="card bills-card">
  <div class="card-head">
    <h2>Next bills · next 14 days</h2>
    <p class="card-head-note">${upcoming.length} bills due · <b>${rpShort(dueTotal)}</b> total · first: ${upcoming[0].label.split(' — ')[0]}, ${dateShort(upcoming[0].due)}</p>
  </div>
  <ul class="bills-grid">${upcoming.map(b => `
    <li class="bill-tile">
      <span class="bill-when">${dateShort(b.due)} · ${whenLabel(b.due)}</span>
      <span class="bill-line"><span class="bill-name">${b.label}</span><b class="bill-amt">${rpShort(b.amount)}</b></span>
    </li>`).join('')}
  </ul>
  <p class="card-sub"><a href="#/goals">Tick bills off &amp; see savings goals →</a></p>
</section>
<section class="grid2">
  <div class="card">
    <h2>Where the money went</h2>
    <div class="donut-wrap">${donut(CATEGORIES, 176)}
      <ul class="legend">${CATEGORIES.map((c, i) => `<li><span class="dot" style="background:${PALETTE[i % PALETTE.length]}"></span>${c.label} <b>${rpShort(c.actual)}</b></li>`).join('')}</ul>
    </div>
  </div>
  <div class="card">
    <h2>Payday forecast</h2>
    ${forecastPanel()}
  </div>
</section>
<div id="dash-extras"></div>`;
}
