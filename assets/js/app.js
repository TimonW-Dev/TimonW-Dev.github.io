import { matches, initSearch } from './search.js';
import { initConsent } from './consent.js';
import { initContact } from './contact.js';
import { categories, loadAll, toolUrl } from './tools.js';

const root = document.getElementById('categories');
const empty = document.getElementById('empty');
const tiles = [];
const sections = [];

function buildTile(tool) {
  const el = document.createElement('article');
  el.className = `tile w-${tool.size.w} h-${tool.size.h}`;
  const head = document.createElement('div');
  head.className = 'tile-head';
  const h = document.createElement('h3');
  h.textContent = tool.title;
  const open = document.createElement('a');
  open.className = 'open';
  open.href = toolUrl(tool);
  open.textContent = '↗';
  open.title = `Open ${tool.title} on its own page`;
  open.setAttribute('aria-label', `Open ${tool.title} on its own page`);
  head.append(h, open);
  const p = document.createElement('p');
  p.className = 'desc';
  p.textContent = tool.description;
  const body = document.createElement('div');
  body.className = 'body';
  el.append(head, p, body);
  try {
    tool.render(body);
  } catch (err) {
    console.error(`Tool "${tool.name}" failed to render`, err);
  }
  return el;
}

async function load() {
  const tools = await loadAll();
  for (const cat of categories) {
    const list = tools.filter((t) => t.category === cat.id);
    if (!list.length) continue;
    const section = document.createElement('section');
    section.className = 'category';
    const h = document.createElement('h2');
    h.textContent = cat.title;
    const grid = document.createElement('div');
    grid.className = 'grid';
    section.append(h, grid);
    root.append(section);
    const sec = { section, tiles: [] };
    for (const tool of list) {
      const el = buildTile(tool);
      grid.append(el);
      const t = { tool, el };
      tiles.push(t);
      sec.tiles.push(t);
    }
    sections.push(sec);
  }
}

function filter(query) {
  let shown = 0;
  for (const { tool, el } of tiles) {
    const ok = matches(tool, query);
    el.classList.toggle('hidden', !ok);
    if (ok) shown++;
  }
  for (const s of sections) {
    s.section.classList.toggle('hidden', s.tiles.every((t) => t.el.classList.contains('hidden')));
  }
  empty.classList.toggle('hidden', shown > 0);
}

initConsent();
initContact();
initSearch(document.getElementById('search'), filter);
load();
