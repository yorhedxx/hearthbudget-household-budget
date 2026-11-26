// HearthBudget — state.js: shared interactive state and derived totals.
import { INCOME, PLANNED_SAVINGS, CATEGORIES, TRANSACTIONS, BILLS } from './data.js';

export const txns = [...TRANSACTIONS];
export const plannedEdits = {}; // category id -> slider-set planned amount
export const paidState = {};    // bill index -> paid boolean (from BILLS[].paid)
BILLS.forEach((b, i) => { paidState[i] = b.paid; });

export function spentNow() { return txns.reduce((s, t) => s + t.amount, 0); }
export function leftNow() { return INCOME - spentNow() - PLANNED_SAVINGS; }
export function plannedOf(c) { return plannedEdits[c.id] ?? c.planned; }
export function plannedTotal() { return CATEGORIES.reduce((s, c) => s + plannedOf(c), 0); }
export function catById(id) { return CATEGORIES.find(c => c.id === id); }
export function addTxn(t) { txns.unshift(t); }
export function setPlanned(id, amount) { plannedEdits[id] = amount; }
export function setPaid(i, paid) { paidState[i] = paid; }
