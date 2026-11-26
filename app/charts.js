// HearthBudget — charts.js: the cover's two SVG charts (category donut,
// payday forecast), built from numbers. No libraries, no raster images.
import { rpShort } from './format.js';

export const PALETTE = ['#0f766e', '#d97706', '#b45309', '#0369a1', '#be185d', '#4d7c0f', '#7c3aed', '#0e7490', '#a16207'];

// Category donut: one dashed circle per category on a shared ring.
export function donut(categories, size = 200) {
  const total = categories.reduce((s, c) => s + c.actual, 0);
  const mid = size / 2, r = mid - 15, circ = 2 * Math.PI * r;
  let acc = 0;
  const parts = categories.map((c, i) => {
    const frac = c.actual / total;
    const seg = `<circle cx="${mid}" cy="${mid}" r="${r}" fill="none" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="30" stroke-dasharray="${(frac * circ).toFixed(1)} ${circ.toFixed(1)}" stroke-dashoffset="${(-acc * circ).toFixed(1)}"><title>${c.label}: ${rpShort(c.actual)}</title></circle>`;
    acc += frac;
    return seg;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category donut chart"><g transform="rotate(-90 ${mid} ${mid})">${parts}</g>
    <text x="${mid}" y="${mid - 6}" text-anchor="middle" class="donut-centre-big">${rpShort(total)}</text>
    <text x="${mid}" y="${mid + 16}" text-anchor="middle" class="donut-centre-small">spent in Nov</text></svg>`;
}

// Payday forecast: stepped line of the projected balance, today (26 Nov)
// to the last day before payday — flat runs, drops at each day's end,
// bigger drops (amber dots) where a bill lands; lowest point labelled;
// the dashed line at the right edge is payday itself (1 Dec).
export function forecastChart(fc) {
  const w = 560, h = 126, top = 20, base = h - 18, max = fc.start * 1.1;
  const y = v => (top + (1 - v / max) * (base - top)).toFixed(1);
  const xs = [10, 118, 226, 334, 442]; // 26, 27, 28, 29, 30 Nov
  let d = `M ${xs[0]} ${y(fc.start)}`;
  fc.days.forEach((day, i) => { d += ` H ${xs[i + 1]} V ${y(day.end)}`; });
  const dots = fc.days.map((day, i) =>
    `<circle cx="${xs[i + 1]}" cy="${y(day.end)}" r="${day.date === fc.lowestDate ? 6 : 4}" fill="${day.billTotal ? '#d97706' : '#0f766e'}"/>`).join('');
  const labels = ['26 Nov', '27', '28', '29', '30 Nov'].map((t, i) =>
    `<text x="${xs[i]}" y="${h - 4}" text-anchor="${i === 0 ? 'start' : 'middle'}" class="bar-label">${t}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Payday forecast to 1 December, tightest ${rpShort(fc.lowest)}"><line x1="548" y1="6" x2="548" y2="${base}" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 3"/><text x="548" y="${h - 4}" text-anchor="end" class="bar-label">payday 1 Dec</text><line x1="2" y1="${base}" x2="558" y2="${base}" stroke="#e7e0d2" stroke-width="1.5"/><path d="${d}" fill="none" stroke="#0f766e" stroke-width="3"/><circle cx="${xs[0]}" cy="${y(fc.start)}" r="4" fill="#0f766e"/>${dots}<text x="${xs[4] - 10}" y="${Number(y(fc.lowest)) + 19}" text-anchor="end" class="fc-value">${rpShort(fc.lowest)}</text>${labels}</svg>`;
}

