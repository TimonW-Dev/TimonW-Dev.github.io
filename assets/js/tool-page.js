import { initConsent } from './consent.js';
import { initContact } from './contact.js';
import { initToolSearch } from './tool-search.js';
import { tools, loadTool, categoryOf } from './tools.js';

initConsent();
initContact();
initToolSearch(document.getElementById('tool-search'), document.getElementById('tool-search-results'));

const name = new URLSearchParams(location.search).get('name');
const entry = tools.find((t) => t.name === name);
const title = document.getElementById('tool-title');
const desc = document.getElementById('tool-desc');
const crumb = document.getElementById('tool-category');
const body = document.getElementById('tool-body');

function fail(message) {
  title.textContent = 'Tool not found';
  desc.textContent = message;
}

if (!entry) {
  fail('This tool does not exist.');
} else {
  const tool = await loadTool(entry);
  if (!tool) {
    fail('This tool could not be loaded.');
  } else {
    document.title = `${tool.title} – sysadminsuite.com`;
    title.textContent = tool.title;
    desc.textContent = tool.description;
    crumb.textContent = categoryOf(tool.category)?.title ?? '';
    tool.render(body);
  }
}
