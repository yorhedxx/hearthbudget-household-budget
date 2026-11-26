// HearthBudget — data.js: the month's core figures, the single source of
// truth every page computes from. Family Pramudya, Jakarta, November 2026,
// Rupiah. Detail figures only the later pages need live in data-detail.js,
// so they stay out of the first load. check-numbers.mjs verifies both files.

export const MONTH = { daySoFar: 26 }; // November 2026, 26 days in

export const INCOME = 24750000;

export const PLANNED_SAVINGS = 2500000;

// Categories: planned vs actual (actual == that category's transaction sum).
export const CATEGORIES = [
  { id: 'groceries',     label: 'Groceries',     icon: 'cart',  planned: 5000000, actual: 3850000, group: 'needs' },
  { id: 'transport',     label: 'Transport',     icon: 'bus',   planned: 2000000, actual: 1420000, group: 'needs' },
  { id: 'utilities',     label: 'Utilities',     icon: 'bolt',  planned: 1800000, actual: 1650000, group: 'needs' },
  { id: 'school',        label: 'School',        icon: 'book',  planned: 4100000, actual: 3400000, group: 'needs' },
  { id: 'dining',        label: 'Dining Out',    icon: 'plate', planned: 2200000, actual: 1610000, group: 'wants' },
  { id: 'health',        label: 'Health',        icon: 'plus',  planned: 1200000, actual: 980000,  group: 'needs' },
  { id: 'home',          label: 'Home',          icon: 'home',  planned: 3500000, actual: 2150000, group: 'needs' },
  { id: 'fun',           label: 'Fun',           icon: 'play',  planned: 1500000, actual: 1030000, group: 'wants' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'card',  planned: 950000,  actual: 850000,  group: 'wants' },
];

export const SPENT = CATEGORIES.reduce((s, c) => s + c.actual, 0); // 16,940,000
export const LEFT_TO_SPEND = INCOME - SPENT - PLANNED_SAVINGS; // 5,310,000
export const SAVINGS_RATE = PLANNED_SAVINGS / INCOME; // 0.101 -> 10.1%

// 30 transactions, Nov 1-26; per-category sums == CATEGORIES actuals.
export const TRANSACTIONS = [
  { date: '2026-11-01', desc: 'SPP November — Sekolah Pelita', cat: 'school', amount: 1500000 },
  { date: '2026-11-01', desc: 'Netflix Premium', cat: 'subscriptions', amount: 186000 },
  { date: '2026-11-01', desc: 'Spotify Family', cat: 'subscriptions', amount: 79000 },
  { date: '2026-11-02', desc: 'Super Indo — weekly groceries', cat: 'groceries', amount: 920000 },
  { date: '2026-11-02', desc: 'iCloud+ 200 GB', cat: 'subscriptions', amount: 129000 },
  { date: '2026-11-03', desc: 'Gojek & Grab — school runs', cat: 'transport', amount: 420000 },
  { date: '2026-11-04', desc: 'Dokter anak — Klinik Sehat', cat: 'health', amount: 350000 },
  { date: '2026-11-05', desc: 'Token PLN 500 kWh', cat: 'utilities', amount: 685000 },
  { date: '2026-11-05', desc: 'Gym membership — FitHub', cat: 'subscriptions', amount: 235000 },
  { date: '2026-11-06', desc: 'Service AC — 2 units', cat: 'home', amount: 850000 },
  { date: '2026-11-07', desc: 'Dinner — Sate Khas Senayan', cat: 'dining', amount: 523000 },
  { date: '2026-11-08', desc: 'Les piano — Kak Rani (4x)', cat: 'school', amount: 850000 },
  { date: '2026-11-09', desc: 'Pasar Santa — fresh market', cat: 'groceries', amount: 685000 },
  { date: '2026-11-09', desc: 'Cinema — family movie night', cat: 'fun', amount: 450000 },
  { date: '2026-11-10', desc: 'Bensin Pertamax — Avanza', cat: 'transport', amount: 315000 },
  { date: '2026-11-10', desc: 'YouTube Premium Family', cat: 'subscriptions', amount: 221000 },
  { date: '2026-11-11', desc: 'Apotek — vitamins & paracetamol', cat: 'health', amount: 285000 },
  { date: '2026-11-12', desc: 'PDAM — water bill October', cat: 'utilities', amount: 412000 },
  { date: '2026-11-13', desc: 'Rak buku & lampu belajar', cat: 'home', amount: 720000 },
  { date: '2026-11-14', desc: 'GoFood — weekend lunch', cat: 'dining', amount: 412000 },
  { date: '2026-11-15', desc: 'Buku & seragam sekolah', cat: 'school', amount: 1050000 },
  { date: '2026-11-16', desc: 'Super Indo — weekly groceries', cat: 'groceries', amount: 1075000 },
  { date: '2026-11-17', desc: 'Tol JORR + parkir mall', cat: 'transport', amount: 385000 },
  { date: '2026-11-18', desc: 'Check-up gigi — anak bungsu', cat: 'health', amount: 345000 },
  { date: '2026-11-19', desc: 'Internet IndiHome + gas LPG', cat: 'utilities', amount: 553000 },
  { date: '2026-11-20', desc: 'Tukang ledeng — kamar mandi', cat: 'home', amount: 580000 },
  { date: '2026-11-21', desc: 'Birthday dinner — Ayah Budi', cat: 'dining', amount: 675000 },
  { date: '2026-11-22', desc: 'Mainan edukasi — LEGO set', cat: 'fun', amount: 580000 },
  { date: '2026-11-23', desc: 'Super Indo — weekly groceries', cat: 'groceries', amount: 1170000 },
  { date: '2026-11-24', desc: 'Bensin Pertamax — Avanza', cat: 'transport', amount: 300000 },
];

// Payday forecast model — the app's one forward-looking view (cover).
// Salary lands 1 Dec (PAYDAY); from today (26 Nov) exactly 4 spending
// days remain: 27–30 Nov. Each drops the balance by the essentials rate
// (Groceries + Transport + Dining Out actuals / 26 days, rounded to the
// nearest Rp 1.000 = Rp 265 rb/day) plus any bill due that day. Bills due
// on/after payday stay out. check-numbers verifies the whole chain.
export const PAYDAY = '2026-12-01';

export function paydayForecast(unpaidBills, start = LEFT_TO_SPEND) {
  const essentials = CATEGORIES.filter(c => ['groceries', 'transport', 'dining'].includes(c.id))
    .reduce((s, c) => s + c.actual, 0);
  const rate = Math.round(essentials / MONTH.daySoFar / 1000) * 1000;
  const due = unpaidBills.filter(b => b.due > '2026-11-26' && b.due < PAYDAY);
  let balance = start;
  const days = ['2026-11-27', '2026-11-28', '2026-11-29', '2026-11-30'].map(date => {
    const bills = due.filter(b => b.due === date);
    const billTotal = bills.reduce((s, b) => s + b.amount, 0);
    return { date, bills, billTotal, end: (balance -= rate + billTotal) };
  });
  const low = days.reduce((m, d) => (d.end < m.end ? d : m), days[3]);
  return { start, rate, days, billsTotal: due.reduce((s, b) => s + b.amount, 0),
    end: balance, lowest: low.end, lowestDate: low.date };
}

// Bills: the next 14 days first, then two already paid.
export const BILLS = [
  { label: 'PDAM — water', due: '2026-11-27', amount: 412000, paid: false },
  { label: 'Token PLN — electricity', due: '2026-11-28', amount: 685000, paid: false },
  { label: 'BPJS Kesehatan', due: '2026-11-30', amount: 300000, paid: false },
  { label: 'SPP Desember — Sekolah Pelita', due: '2026-12-01', amount: 1500000, paid: false },
  { label: 'Internet IndiHome', due: '2026-12-03', amount: 385000, paid: false },
  { label: 'KPR — mortgage instalment', due: '2026-12-05', amount: 4250000, paid: false },
  { label: 'SPP November — Sekolah Pelita', due: '2026-11-01', amount: 1500000, paid: true },
  { label: 'BPJS Kesehatan', due: '2026-10-30', amount: 300000, paid: true },
];
