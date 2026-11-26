// HearthBudget — format.js: numbers and dates into display strings.
// Compact Rupiah: 24,750,000 -> "Rp 24.75 jt"; 685,000 -> "Rp 685 rb".
export function rpShort(n) {
  if (n >= 1000000) {
    const v = n / 1000000;
    return 'Rp ' + (Number.isInteger(v) ? v : v.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')) + ' jt';
  }
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return 'Rp ' + n;
}

// Full Rupiah with thousand separators: 24,750,000 -> "Rp 24.750.000".
export function rpFull(n) {
  return 'Rp ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Percent with one decimal: 0.101 -> "10.1%".
export function pct(n) {
  return (n * 100).toFixed(1) + '%';
}

// "2026-11-27" -> "Fri 27 Nov".
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function dateShort(iso) {
  const d = new Date(iso + 'T00:00:00');
  return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
}

// Days from the reference date (2026-11-26) to a due date.
export function daysUntil(iso) {
  const ref = new Date('2026-11-26T00:00:00');
  const d = new Date(iso + 'T00:00:00');
  return Math.round((d - ref) / 86400000);
}
