// Reorders `.tile` children of a container via drag handles (`.tile-handle`).
// Pointer events cover mouse, touch and pen; arrow keys on a focused handle work too.
export function enableReorder(container, onChange) {
  let drag = null;

  function visibleSibling(tile, dir) {
    let el = dir < 0 ? tile.previousElementSibling : tile.nextElementSibling;
    while (el && el.classList.contains('hidden')) {
      el = dir < 0 ? el.previousElementSibling : el.nextElementSibling;
    }
    return el;
  }

  function end() {
    if (!drag) return;
    drag.tile.classList.remove('dragging');
    drag = null;
    onChange();
  }

  container.addEventListener('pointerdown', (e) => {
    const handle = e.target.closest('.tile-handle');
    if (!handle || e.button > 0) return;
    drag = { tile: handle.closest('.tile'), pointerId: e.pointerId };
    handle.setPointerCapture(e.pointerId);
    drag.tile.classList.add('dragging');
  });

  container.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const over = document.elementsFromPoint(e.clientX, e.clientY)
      .find((el) => el !== drag.tile && el.classList.contains('tile') && el.parentElement === container);
    if (!over) return;
    const after = drag.tile.compareDocumentPosition(over) & Node.DOCUMENT_POSITION_FOLLOWING;
    container.insertBefore(drag.tile, after ? over.nextElementSibling : over);
  });

  container.addEventListener('pointerup', end);
  container.addEventListener('pointercancel', end);

  container.addEventListener('keydown', (e) => {
    const handle = e.target.closest('.tile-handle');
    if (!handle || !/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return;
    e.preventDefault();
    const tile = handle.closest('.tile');
    if (/Left|Up/.test(e.key)) {
      const prev = visibleSibling(tile, -1);
      if (prev) container.insertBefore(tile, prev);
    } else {
      const next = visibleSibling(tile, 1);
      if (next) container.insertBefore(tile, next.nextElementSibling);
    }
    handle.focus();
    onChange();
  });
}
