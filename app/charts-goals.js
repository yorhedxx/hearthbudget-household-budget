// HearthBudget — charts-goals.js: the two SVG charts only the Bills & Goals
// page needs (savings-goal rings, mortgage payoff bars). Kept apart from
// charts.js so they load with that page, not with the dashboard.
import { rpShort } from './format.js';

// Savings-goal progress ring.
export function ring(saved, target, size = 96) {
  const frac = Math.min(1, saved / target);
  const r = (size - 12) / 2, c = 2 * Math.PI * r;
  return `<svg viewBox="0 0 ${size} ${size}" class="ring" role="img" aria-label="${Math.round(frac * 100)} percent saved">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#e7e0d2" stroke-width="10"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#d97706" stroke-width="10" stroke-linecap="round"
      stroke-dasharray="${(frac * c).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="47%" text-anchor="middle" class="ring-pct">${Math.round(frac * 100)}%</text>
    <text x="50%" y="66%" text-anchor="middle" class="ring-sub">saved</text></svg>`;
}

// Mortgage payoff: remaining balance bars by year.
export function payoffBars(schedule) {
  const max = Math.max(...schedule.map(s => s.balance), 1);
  const w = 560, h = 130, bw = w / schedule.length;
  const bars = schedule.map((s, i) => {
    const bh = Math.max(s.balance > 0 ? 5 : 2, (s.balance / max) * (h - 34));
    const x = (i * bw + 8).toFixed(1);
    const label = s.balance === 0 ? 'paid off' : rpShort(s.balance);
    return `<g><rect x="${x}" y="${(h - 22 - bh).toFixed(1)}" width="${(bw - 16).toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${s.balance === 0 ? '#d97706' : '#0f766e'}"><title>${s.year}: ${label}</title></rect>
    <text x="${(i * bw + bw / 2).toFixed(1)}" y="${h - 22 - bh - 4}" text-anchor="middle" class="bar-label">${label}</text>
    <text x="${(i * bw + bw / 2).toFixed(1)}" y="${h - 6}" text-anchor="middle" class="bar-label">${s.year}</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Mortgage balance by year, paid off in 2037">${bars}</svg>`;
}
