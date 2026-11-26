// HearthBudget — icons.js: tiny inline SVG icons, one path each.
// No raster images, no icon font, nothing fetched over the network.
const ICONS = {
  cart: '<path d="M3 4h2l2.4 12.4A2 2 0 0 0 9.4 18h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.6"/><circle cx="18" cy="21" r="1.6"/>',
  bus: '<rect x="3" y="4" width="18" height="13" rx="2"/><circle cx="8" cy="20" r="1.8"/><circle cx="16" cy="20" r="1.8"/><path d="M3 11h18"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',
  book: '<path d="M4 4a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V4z"/><path d="M19 18H6a2 2 0 0 0-2 2"/>',
  plate: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
};

export function icon(name, cls = 'ic') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.card}</svg>`;
}
