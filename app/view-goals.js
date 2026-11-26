// HearthBudget — view-goals.js: Bills & Goals (route #/goals), loaded lazily
// on first visit. Layout is screenshot-first: the four savings-goal rings in
// one row, then the mortgage payoff chart and the "Can We Afford It?"
// calculator side by side — the calculator opens with a worked example and
// its verdict already showing. The recurring-bills checklist sits below.
import { BILLS } from './data.js';
import { GOALS, MORTGAGE } from './data-detail.js';
import { rpShort, rpFull, dateShort, daysUntil } from './format.js';
import { ring, payoffBars } from './charts-goals.js';
import { paidState, leftNow, setPaid } from './state.js';

export function render() {
  const dueSoon = BILLS.filter((b, i) => !paidState[i]).reduce((s, b) => s + b.amount, 0);
  const billRows = BILLS.map((b, i) => {
    const d = daysUntil(b.due);
    const when = paidState[i] ? 'Paid ✓' : d < 0 ? 'Overdue' : d === 0 ? 'Due today' : d === 1 ? 'Due tomorrow' : 'Due in ' + d + ' days';
    return `<li class="bill-row ${paidState[i] ? 'paid' : ''}">
      <label><input type="checkbox" data-bill="${i}" ${paidState[i] ? 'checked' : ''}> <span>${b.label}</span></label>
      <span class="bill-date">${dateShort(b.due)} · ${when}</span><b>${rpShort(b.amount)}</b></li>`;
  }).join('');
  const goalCards = GOALS.map(g => `
    <div class="goal-mini">
      ${ring(g.saved, g.target, 74)}
      <h3>${g.label}</h3>
      <p class="goal-nums">${rpShort(g.saved)} <em>of ${rpShort(g.target)}</em></p>
      <p class="card-sub">${g.note}</p>
      <p class="goal-togo">${rpShort(g.target - g.saved)} to go</p>
    </div>`).join('');
  return `
  <section class="page-head">
    <h1>Bills &amp; Goals</h1>
    <p>Savings goals, the mortgage and a quick check before any big purchase — the bills checklist is at the bottom.</p>
  </section>
  <section class="card">
    <h2>Savings goals — four funds, one payday split</h2>
    <div class="goals-row">${goalCards}</div>
  </section>
  <section class="grid2">
    <div class="card">
      <h2>Mortgage — ${MORTGAGE.bank}</h2>
      <p class="card-big">${rpShort(MORTGAGE.remaining)}</p>
      <p class="card-sub">left of ${rpShort(MORTGAGE.original)} · ${rpShort(MORTGAGE.monthly)}/month · ${MORTGAGE.rate}</p>
      ${payoffBars(MORTGAGE.payoff)}
      <p class="card-sub">Paid off in 2037 at the current pace — 11 years early if the family adds Rp 500 rb/month.</p>
    </div>
    <div class="card afford">
      <h2>Can We Afford It?</h2>
      <p>Spread a wish over months — does the monthly saving fit inside left-to-spend (<b id="afford-left">${rpFull(leftNow())}</b>)?</p>
      <form id="afford-form" class="afford-form">
        <label>What is it? <input type="text" id="afford-item" value="Yogyakarta family trip" required></label>
        <label>Price (Rp) <input type="number" id="afford-price" min="1000" step="1000" value="6000000" required></label>
        <label>Months <input type="number" id="afford-months" min="1" max="24" value="5" required></label>
        <button class="btn" type="submit">Check it</button>
      </form>
      <div class="afford-result" id="afford-result" aria-live="polite"></div>
    </div>
  </section>
  <section class="card">
    <h2>Recurring bills</h2>
    <ul class="bill-list">${billRows}</ul>
    <p class="card-sub" id="due-total">Still to pay: <b>${rpFull(dueSoon)}</b> — tick a bill when it is paid.</p>
  </section>`;
}

// Run the affordability maths on the current form values and paint the
// verdict. Called once when the page opens (the worked example) and again
// on every submit.
function runAfford() {
  const item = document.getElementById('afford-item').value.trim() || 'That item';
  const price = Number(document.getElementById('afford-price').value);
  const months = Math.max(1, Number(document.getElementById('afford-months').value));
  const monthly = Math.ceil(price / months / 1000) * 1000;
  const left = leftNow();
  const fits = monthly <= left;
  const verdict = fits
    ? `<strong class="fits">✓ FITS — the family can afford it.</strong> ${rpFull(monthly)}/month for ${months} months pays for the ${item.toLowerCase()}, leaving ${rpFull(left - monthly)} of left-to-spend untouched.`
    : `<strong class="nofit">✗ Not yet at that pace.</strong> ${rpFull(monthly)}/month is ${rpFull(monthly - left)} over left-to-spend (${rpFull(left)}). Stretch it to ${Math.ceil(price / Math.max(left, 1))} months, or wait for next month.`;
  document.getElementById('afford-result').innerHTML =
    `<p>${rpFull(price)} over ${months} months = <b>${rpFull(monthly)}/month</b>.</p><p>${verdict}</p>`;
}

export function wire() {
  document.querySelectorAll('input[type=checkbox][data-bill]').forEach(box => {
    box.addEventListener('change', () => {
      setPaid(Number(box.dataset.bill), box.checked);
      box.closest('.bill-row').classList.toggle('paid', box.checked);
      const due = BILLS.filter((b, i) => !paidState[i]).reduce((s, b) => s + b.amount, 0);
      const el = document.getElementById('due-total');
      if (el) el.innerHTML = `Still to pay: <b>${rpFull(due)}</b> — tick a bill when it is paid.`;
    });
  });
  const form = document.getElementById('afford-form');
  if (form) {
    form.addEventListener('submit', e => { e.preventDefault(); runAfford(); });
    runAfford(); // the worked example, verdict visible without a click
  }
}
