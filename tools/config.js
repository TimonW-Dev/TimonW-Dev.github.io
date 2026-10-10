// Central configuration for all tiles. Order of categories and tools = display order.
// size.w: columns (1-4), size.h: rows (1-3). Tool logic lives in tools/<name>/tool.js.
// Optional page/css paths point to files relative to the site root.
export const categories = [
  { id: 'calculators', title: 'Calculators' },
  { id: 'encoders-decoders', title: 'Encoders / Decoders' },
];

export const tools = [
  {
    name: 'work-time-calculator',
    category: 'calculators',
    size: { w: 2, h: 1 },
    css: 'tools/work-time-calculator/tool.css',
  },
  {
    name: 'number-base-converter',
    category: 'calculators',
    size: { w: 1, h: 1 },
    css: 'tools/number-base-converter/tool.css',
  },
  {
    name: 'base64',
    category: 'encoders-decoders',
    size: { w: 1, h: 1 },
  },
];
