import { tools, toolUrl } from './tools.js';
import { initSearch, matches } from './search.js';

export function initToolSearch(input, results) {
  if (!input || !results) return;

  let searchTools = [];
  let activeIndex = -1;

  function closeResults() {
    results.classList.add('hidden');
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  }

  function focusResult(index) {
    const links = [...results.querySelectorAll('a')];
    if (index < 0 || index >= links.length) {
      input.focus();
      activeIndex = -1;
      return;
    }
    activeIndex = index;
    links[index].focus();
  }

  function renderResults() {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();
    activeIndex = -1;
    if (!query) {
      closeResults();
      return;
    }

    const matchingTools = searchTools.filter((tool) => matches(tool, query));

    if (matchingTools.length === 0) {
      const item = document.createElement('div');
      item.className = 'no-tool-results';
      item.textContent = 'No tools found.';
      results.append(item);
    } else {
      for (const tool of matchingTools) {
        const link = document.createElement('a');
        link.href = toolUrl(tool);
        link.setAttribute('role', 'option');
        link.textContent = tool.title;
        results.append(link);
      }
    }

    results.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
  }

  initSearch(input, renderResults);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && !results.classList.contains('hidden')) {
      event.preventDefault();
      focusResult(0);
    } else if (event.key === 'Enter') {
      const matchingTools = searchTools.filter((tool) => matches(tool, input.value));
      if (matchingTools.length === 1) {
        event.preventDefault();
        window.location.href = toolUrl(matchingTools[0]);
      }
    } else if (event.key === 'Escape') {
      closeResults();
    }
  });
  results.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeResults();
      input.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    focusResult(activeIndex + (event.key === 'ArrowDown' ? 1 : -1));
  });
  document.addEventListener('click', (event) => {
    if (!input.parentElement.contains(event.target)) closeResults();
  });

  Promise.all(tools.map(async (entry) => {
    try {
      const { default: tool } = await import(`../../tools/${entry.name}/tool.js`);
      return { ...tool, name: entry.name, page: entry.page };
    } catch (error) {
      console.error(`Tool "${entry.name}" failed to load for search`, error);
      return null;
    }
  })).then((loaded) => {
    searchTools = loaded.filter(Boolean);
    if (input.value.trim()) renderResults();
  });
}
