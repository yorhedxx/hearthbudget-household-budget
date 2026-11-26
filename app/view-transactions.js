// HearthBudget — view-transactions.js: the Transactions ledger (route
// #/transactions), loaded lazily on first visit. Category chips + a search
// box filter the table live; the add form appends a real transaction and
// every total on the page (and the dashboard) updates with it.
import { CATEGORIES } from './data.js';
import { rpFull, dateShort } from './format.js';
import { txns, spentNow, leftNow, catById, addTxn } from './state.js';

function rowHtml(t) {
  const c = catById(t.cat);
  return `<tr><td>${dateShort(t.date)}</td><td>${t.desc}</td><td><span class="chip-mini">${c.label}</span></td><td class="num">−${rpFull(t.amount)}</td></tr>`;
}

function shownTxns(filter, query) {
  const q = query.trim().toLowerCase();
  return txns.filter(t =>
    (filter === 'all' || t.cat === filter) &&
    (!q || t.desc.toLowerCase().includes(q) || catById(t.cat).label.toLowerCase().includes(q)));
}

export function render(filter = 'all', query = '') {
  const shown = shownTxns(filter, query);
  const chips = [{ id: 'all', label: 'All' }, ...CATEGORIES.map(c => ({ id: c.id, label: c.label }))];
  const rows = shown.map(rowHtml).join('') ||
    `<tr><td colspan="4" class="empty">No transactions match. Try another filter or search.</td></tr>`;
  return `
  <section class="page-head">
    <h1>Transactions — November</h1>
    <p>${txns.length} transactions · total spent <b>${rpFull(spentNow())}</b> · left to spend <b>${rpFull(leftNow())}</b></p>
  </section>
  <section class="card">
    <div class="chips" id="filter-chips">${chips.map(c =>
      `<button class="chip${filter === c.id ? ' active' : ''}" data-filter="${c.id}">${c.label}</button>`).join('')}</div>
    <div class="search-row">
      <label>Search <input type="search" id="txn-search" placeholder="e.g. GoFood, PLN, school…" value="${query.replace(/"/g, '&quot;')}"></label>
      <p class="result-count" id="result-count">Showing <b>${shown.length}</b> of ${txns.length} transactions</p>
    </div>
    <table class="txn-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th></tr></thead>
      <tbody id="txn-body">${rows}</tbody>
    </table>
  </section>
  <section class="card">
    <h2>Add a transaction</h2>
    <form id="add-txn" class="add-form">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>Description <input type="text" name="desc" placeholder="e.g. Warung makan siang" required></label>
      <label>Category <select name="cat">${CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}</select></label>
      <label>Amount (Rp) <input type="number" name="amount" min="1000" step="1000" placeholder="50000" required></label>
      <button class="btn" type="submit">Add transaction</button>
    </form>
    <p class="card-sub">Adding updates the ledger, the totals above and the dashboard immediately.</p>
  </section>`;
}

export function wire() {
  let currentFilter = 'all';
  const applyFilter = (f, q) => {
    const shown = shownTxns(f, q);
    document.querySelectorAll('#filter-chips .chip').forEach(chip =>
      chip.classList.toggle('active', chip.dataset.filter === f));
    document.getElementById('txn-body').innerHTML = shown.map(rowHtml).join('') ||
      `<tr><td colspan="4" class="empty">No transactions match. Try another filter or search.</td></tr>`;
    document.getElementById('result-count').innerHTML =
      `Showing <b>${shown.length}</b> of ${txns.length} transactions`;
  };
  document.querySelectorAll('#filter-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentFilter = chip.dataset.filter;
      applyFilter(currentFilter, document.getElementById('txn-search').value);
    });
  });
  const search = document.getElementById('txn-search');
  if (search) search.addEventListener('input', () => applyFilter(currentFilter, search.value));
  const form = document.getElementById('add-txn');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    addTxn({
      date: fd.get('date'), desc: String(fd.get('desc')).trim(),
      cat: fd.get('cat'), amount: Number(fd.get('amount')),
    });
    // Re-render the whole page so the header totals update too.
    document.getElementById('app').innerHTML = render(currentFilter, '');
    wire();
    document.querySelector('.page-head').scrollIntoView();
  });
}
