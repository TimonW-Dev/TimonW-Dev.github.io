export function matches(tool, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [tool.title, tool.description, ...(tool.tags || [])].join(' ').toLowerCase();
  return q.split(/\s+/).every((word) => hay.includes(word));
}

export function initSearch(input, onChange) {
  input.addEventListener('input', () => onChange(input.value));
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      input.focus();
    }
  });
}
