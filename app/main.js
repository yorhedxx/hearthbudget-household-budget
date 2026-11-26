// HearthBudget — main.js: hash router for #/ #/budget #/transactions #/goals.
// The Dashboard ships in the first load (below-fold extras follow by lazy
// import); the other three pages import lazily on first visit. Deep links work.
import { render as renderDashboard } from './view-dashboard.js';

const TITLES = {
  '': 'Dashboard',
  budget: 'Budget Plan',
  transactions: 'Transactions',
  goals: 'Bills & Goals',
};

const LAZY = {
  budget: () => import('./view-budget.js'),
  transactions: () => import('./view-transactions.js'),
  goals: () => import('./view-goals.js'),
};

const NAV = Object.entries(TITLES).map(([key, label]) => [key ? `#/${key}` : '#/', label, key]);

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
  return Object.prototype.hasOwnProperty.call(TITLES, hash) ? hash : '';
}

let navToken = 0;

async function render() {
  const route = currentRoute();
  document.title = `HearthBudget — ${TITLES[route]}`;
  document.getElementById('nav').innerHTML = NAV.map(([href, label, key]) =>
    `<a href="${href}" class="${key === route ? 'active' : ''}">${label}</a>`).join('');
  document.querySelectorAll('.tabbar a').forEach(a => {
    const key = a.getAttribute('href').replace(/^#\/?/, '');
    a.classList.toggle('active', key === route);
  });
  const app = document.getElementById('app');
  const token = ++navToken;
  if (route === '') {
    app.innerHTML = renderDashboard();
    window.scrollTo(0, 0);
    import('./view-dashboard-extras.js').then(mod => {
      const slot = document.getElementById('dash-extras');
      if (slot && token === navToken) slot.innerHTML = mod.renderExtras();
    });
    return;
  }
  const mod = await LAZY[route]();
  if (token !== navToken) return;
  app.innerHTML = mod.render();
  if (mod.wire) mod.wire();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
