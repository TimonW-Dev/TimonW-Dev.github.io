// Reorders `.tile` children of a container using the arrow keys on `.tile-handle`.
export function enableReorder(container, onChange) {
  const hint = document.createElement('div');
  hint.className = 'reorder-hint hidden';
  hint.setAttribute('role', 'status');
  hint.setAttribute('aria-live', 'polite');
  hint.textContent = 'Use the left and right arrow keys to reorder favorites.';
  document.body.append(hint);

  function showHint() {
    hint.classList.remove('hidden');
  }

  function hideHint() {
    hint.classList.add('hidden');
  }

  function visibleSibling(tile, dir) {
    let el = dir < 0 ? tile.previousElementSibling : tile.nextElementSibling;
    while (el && el.classList.contains('hidden')) {
      el = dir < 0 ? el.previousElementSibling : el.nextElementSibling;
    }
    return el;
  }

  container.addEventListener('focus', (e) => {
    const handle = e.target.closest('.tile-handle');
    if (handle) showHint();
  }, true);

  container.addEventListener('blur', (e) => {
    if (e.target.closest('.tile-handle')) hideHint();
  }, true);

  container.addEventListener('click', (e) => {
    const handle = e.target.closest('.tile-handle');
    if (!handle) return;
    handle.focus();
    showHint();
  });

  container.addEventListener('keydown', (e) => {
    const handle = e.target.closest('.tile-handle');
    if (!handle || !/^Arrow(Left|Right)$/.test(e.key)) return;
    e.preventDefault();
    const tile = handle.closest('.tile');
    if (e.key === 'ArrowLeft') {
      const prev = visibleSibling(tile, -1);
      if (prev) container.insertBefore(tile, prev);
    } else {
      const next = visibleSibling(tile, 1);
      if (next) container.insertBefore(tile, next.nextElementSibling);
    }
    handle.focus();
    onChange();
    hideHint();
  });
}
