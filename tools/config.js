// Central configuration for all tiles. Order of categories and tools = display order.
// size.w: columns (1-4), size.h: rows (1-3). Tool logic lives in tools/<name>/tool.js.
// Optional page/css paths point to files relative to the site root.
export const categories = [
  { id: 'examples', title: 'Examples' },
];

export const tools = [
  { name: '_template', category: 'examples', size: { w: 1, h: 1 } },
];
