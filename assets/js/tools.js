import { categories, tools } from '../../tools/config.js';

export function toolUrl(tool) {
  const root = document.body.dataset.root || '';
  const page = tool.page || 'tool.html';
  return `${root}${page}?name=${encodeURIComponent(tool.name)}`;
}

export function categoryOf(id) {
  return categories.find((c) => c.id === id);
}

function loadToolStyles(entry) {
  if (!entry.css || [...document.querySelectorAll('link[data-tool-css]')]
    .some((link) => link.dataset.toolCss === entry.name)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${document.body.dataset.root || ''}${entry.css}`;
  link.dataset.toolCss = entry.name;
  link.addEventListener('error', () => {
    console.error(`Stylesheet for tool "${entry.name}" failed to load: ${link.href}`);
  }, { once: true });
  document.head.append(link);
}

// Loads one tool module and merges it with its config entry. Returns null on failure.
export async function loadTool(entry) {
  try {
    loadToolStyles(entry);
    const { default: tool } = await import(`../../tools/${entry.name}/tool.js`);
    const size = { w: 1, h: 1, ...entry.size };
    return {
      ...tool,
      name: entry.name,
      category: entry.category,
      size,
      page: entry.page,
      css: entry.css,
    };
  } catch (err) {
    console.error(`Tool "${entry.name}" failed to load`, err);
    return null;
  }
}

export async function loadAll() {
  const loaded = await Promise.all(tools.map(loadTool));
  return loaded.filter(Boolean);
}

export { categories, tools };
