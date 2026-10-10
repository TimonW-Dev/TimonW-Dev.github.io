// Copy this folder to tools/<name>/ and adjust, then add it to tools/config.js
// (category + size). The same render() is used for the tile and the standalone page.
export default {
  title: 'Template Tile',
  description: 'Empty tile to copy when adding a new tool.',
  tags: ['template', 'example'],
  // el: the tile's body element. Build the UI here. No network calls without
  // listing them on pages/apis.html.
  render(el) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Input';
    input.setAttribute('aria-label', 'Input');
    const out = document.createElement('div');
    out.className = 'out';
    input.addEventListener('input', () => {
      out.textContent = input.value; // replace with real logic
    });
    el.append(input, out);
  },
};
