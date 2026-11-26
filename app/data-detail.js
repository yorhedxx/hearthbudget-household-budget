// HearthBudget — data-detail.js: the detail figures only the later pages
// need — income sources (Dashboard extras), the 50/30/20 targets (Budget
// Plan), savings goals and the mortgage (Bills & Goals). Kept apart from
// data.js so the first load carries only the month's core figures; every
// consumer of this file is itself loaded lazily.

export const INCOME_SOURCES = [
  { label: 'Salary — Budi', amount: 18500000 },
  { label: 'Freelance design — Sari', amount: 4250000 },
  { label: 'Rental — small flat, Bekasi', amount: 2000000 },
];

// Six months of income vs spending (Dashboard extras). November is the
// live month: its figures ARE data.js's INCOME and SPENT (check-numbers
// enforces the match). Jun–Oct are full months on the same income sources
// — salary + rent fixed, freelance varying — with a positive gap kept
// every month.
export const MONTHLY_TREND = [
  { month: 'Jun', income: 23900000, spent: 17850000 },
  { month: 'Jul', income: 24300000, spent: 18420000 },
  { month: 'Aug', income: 24750000, spent: 19150000 },
  { month: 'Sep', income: 24100000, spent: 17260000 },
  { month: 'Oct', income: 24550000, spent: 18930000 },
  { month: 'Nov', income: 24750000, spent: 16940000 },
];

// 50/30/20 rule targets, beside the family's real split.
export const RULE_50_30_20 = { needs: 0.5, wants: 0.3, savings: 0.2 };

// Savings goals with progress rings.
export const GOALS = [
  { id: 'emergency', label: 'Emergency fund', target: 30000000, saved: 18400000, note: '6 months of needs' },
  { id: 'spp', label: 'School SPP fund', target: 6000000, saved: 4200000, note: 'Next semester, Jan 2027' },
  { id: 'lebaran', label: 'Lebaran fund', target: 8000000, saved: 2750000, note: 'THR + mudik, Mar 2027' },
  { id: 'dp', label: 'House deposit', target: 150000000, saved: 42500000, note: 'Bigger flat in Depok' },
];

// Mortgage: remaining balance and payoff schedule (year-end balances).
export const MORTGAGE = {
  bank: 'Bank BTN — KPR Subsidi',
  original: 450000000,
  remaining: 386250000,
  monthly: 4250000,
  rate: '6.75% fixed 3 yrs',
  payoff: [
    { year: 2026, balance: 386250000 },
    { year: 2028, balance: 332400000 },
    { year: 2030, balance: 271800000 },
    { year: 2032, balance: 203500000 },
    { year: 2034, balance: 126300000 },
    { year: 2036, balance: 39400000 },
    { year: 2037, balance: 0 },
  ],
};
