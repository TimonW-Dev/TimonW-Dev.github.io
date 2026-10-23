import { matches, initSearch } from './search.js';
import { initConsent } from './consent.js';
import { initContact } from './contact.js';
import { categories, loadAll, toolUrl } from './tools.js';
import { readList, writeList } from './local-state.js';
import { enableReorder } from './reorder.js';

const FAVORITES_KEY = 'sas-favorites';
const COLLAPSED_KEY = 'sas-collapsed';
const root = document.getElementById('categories');
const empty = document.getElementById('empty');
const tiles = [];
const sections = new Map();
const toolsByName = new Map();
let favorites = readList(FAVORITES_KEY);
const collapsed = new Set(readList(COLLAPSED_KEY));
let query = '';

function iconButton(className, text) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.textContent = text;
  return b;
}

function buildTile(tool, isFavorite) {
  const el = document.createElement('article');
  el.className = `tile w-${tool.size.w} h-${tool.size.h}`;
  el.dataset.tool = tool.name;
  const head = document.createElement('div');
  head.className = 'tile-head';
  const h = document.createElement('h3');
  h.textContent = tool.title;
  const actions = document.createElement('div');
  actions.className = 'tile-actions';
  const star = iconButton('tile-star', '☆');
  star.addEventListener('click', () => toggleFavorite(tool.name));
  const open = document.createElement('a');
  open.className = 'open';
  open.href = toolUrl(tool);
  open.textContent = '↗';
  open.title = `Open ${tool.title} on its own page`;
  open.setAttribute('aria-label', `Open ${tool.title} on its own page`);
  actions.append(star, open);
  if (isFavorite) {
    const handle = iconButton('tile-handle', '⠿');
    handle.title = `Reorder ${tool.title} with the left and right arrow keys`;
    handle.setAttribute('aria-label', handle.title);
    head.append(handle);
  }
  head.append(h, actions);
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

function buildSection(id, title, extraClass = '') {
  const section = document.createElement('section');
  section.className = `category ${extraClass}`.trim();
  const h = document.createElement('h2');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'category-toggle';
  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.id = `grid-${id}`;
  toggle.setAttribute('aria-controls', grid.id);
  const chevron = document.createElement('span');
  chevron.className = 'chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '▾';
  toggle.append(chevron, document.createTextNode(title));
  toggle.addEventListener('click', () => {
    if (!collapsed.delete(id)) collapsed.add(id);
    writeList(COLLAPSED_KEY, [...collapsed]);
    layout();
  });
  h.append(toggle);
  section.append(h, grid);
  root.append(section);
  const sec = { id, section, grid, toggle, tiles: [] };
  sections.set(id, sec);
  return sec;
}

function addTile(sec, tool, isFavorite) {
  const el = buildTile(tool, isFavorite);
  sec.grid.append(el);
  const t = { tool, el, isFavorite };
  tiles.push(t);
  sec.tiles.push(t);
  applyFilter(t);
  return t;
}

function toggleFavorite(name) {
  const sec = sections.get('favorites');
  if (favorites.includes(name)) {
    favorites = favorites.filter((n) => n !== name);
    const t = sec.tiles.find((x) => x.tool.name === name);
    t.el.remove();
    sec.tiles.splice(sec.tiles.indexOf(t), 1);
    tiles.splice(tiles.indexOf(t), 1);
  } else {
    favorites.push(name);
    addTile(sec, toolsByName.get(name), true);
  }
  writeList(FAVORITES_KEY, favorites);
  layout();
}

function saveFavoriteOrder() {
  const grid = sections.get('favorites').grid;
  favorites = [...grid.children].map((el) => el.dataset.tool);
  writeList(FAVORITES_KEY, favorites);
}

function applyFilter(t) {
  t.el.classList.toggle('hidden', !matches(t.tool, query));
}

// Counts the explicit tracks; spans are cleared first so a too-wide span cannot add implicit ones.
function columnCount() {
  for (const sec of sections.values()) sec.section.style.gridColumn = '';
  return getComputedStyle(root).gridTemplateColumns.split(' ').length;
}

// Each category spans as many grid columns as its visible tiles need (capped to the columns
// available), so it only sits next to another category when all its tiles fit. Collapsing keeps the span.
function layout() {
  const searching = query.trim() !== '';
  const available = columnCount();
  for (const sec of sections.values()) {
    const visible = sec.tiles.filter((t) => !t.el.classList.contains('hidden'));
    const isCollapsed = collapsed.has(sec.id) && !searching;
    sec.section.classList.toggle('hidden', visible.length === 0);
    sec.section.classList.toggle('collapsed', isCollapsed);
    sec.grid.hidden = isCollapsed;
    sec.toggle.setAttribute('aria-expanded', String(!isCollapsed));
    if (sec.id === 'favorites') continue;
    const cols = visible.reduce((sum, t) => sum + t.tool.size.w, 0);
    sec.section.style.gridColumn = `span ${Math.min(Math.max(cols, 1), available)}`;
  }
  for (const t of tiles) {
    const star = t.el.querySelector('.tile-star');
    const on = favorites.includes(t.tool.name);
    star.textContent = on ? '★' : '☆';
    star.setAttribute('aria-pressed', String(on));
    star.title = `${on ? 'Remove' : 'Add'} ${t.tool.title} ${on ? 'from' : 'to'} favorites`;
    star.setAttribute('aria-label', star.title);
  }
  const shown = tiles.some((t) => !t.el.classList.contains('hidden'));
  empty.classList.toggle('hidden', shown);
}

async function load() {
  const tools = await loadAll();
  for (const tool of tools) toolsByName.set(tool.name, tool);
  const fav = buildSection('favorites', '★ Favorites', 'favorites');
  enableReorder(fav.grid, saveFavoriteOrder);
  favorites = [...new Set(favorites)].filter((n) => toolsByName.has(n));
  for (const name of favorites) addTile(fav, toolsByName.get(name), true);
  for (const cat of categories) {
    const list = tools.filter((t) => t.category === cat.id);
    if (!list.length) continue;
    const sec = buildSection(cat.id, cat.title);
    for (const tool of list) addTile(sec, tool, false);
  }
  layout();
  let width = root.clientWidth;
  new ResizeObserver(() => {
    if (root.clientWidth === width) return;
    width = root.clientWidth;
    layout();
  }).observe(root);
}

function filter(value) {
  query = value;
  tiles.forEach(applyFilter);
  layout();
}

initConsent();
initContact();
initSearch(document.getElementById('search'), filter);
load();
