// HearthBudget — main.ts (Node 22, standard library only)
// Entry point for the make.fun Best Household Budget Site bounty.
//
// What this program does: it hands the site in. It copies this directory's
// app/ (the site itself: index.html, style.css and one ES module per job —
// data.js, data-detail.js, format.js, state.js, icons.js, charts.js,
// charts-goals.js, view-dashboard.js, view-dashboard-extras.js,
// view-budget.js, view-transactions.js, view-goals.js, main.js — plain
// static files, no build step, nothing fetched over the
// network; the dashboard ships in the first load and the other three pages
// are imported lazily by main.js) and screenshots/ (four real
// browser renders of the site running) to /output, and writes
// /output/dossier.json with buildDossier from the kit's vendored library
// vendor/makefun-frontend.ts — which must stay exactly as the kit shipped
// it, because the scorer rebuilds the dossier with its own copy and
// compares the two byte for byte.
//
// The site is HearthBudget: the Pramudya family's November 2026 household
// budget (Jakarta, 2 adults + 2 children), in real Rupiah, with four
// working hash-routed pages — Dashboard, Budget Plan, Transactions, and
// Bills & Goals — all computed from app/data.js (core figures) and
// app/data-detail.js (detail figures for the later pages).
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
