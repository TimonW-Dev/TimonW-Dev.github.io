# Adding a tool

1. Copy `tools/_template` to `tools/<name>` (lowercase, kebab-case slug).
2. Edit `tool.js`: set `title`, `description`, `tags` (used by search) and implement `render(el)`.
3. Add an entry to `tools/config.js`: `{ name: '<name>', category: '<category-id>', size: { w: 1, h: 1 } }`.
   - `w` = columns (1–4), `h` = rows (1–3). Order in the list = order on the page.
   - New category: add `{ id, title }` to `categories` (category IDs remain `id`; tool names use `name`).
4. By default, the tool appears as a tile and opens in the shared `tool.html?name=<name>` page. Both use `render(el)`, so make it work at any size.
5. Only when needed, add `tools/<name>/index.html` and set `page: 'tools/<name>/index.html'` on the config entry for a custom full page. Copy the structure of `tool.html`, use `data-root="../../"` on `<body>`, keep the `tool-title`, `tool-desc`, `tool-category`, and `tool-body` elements, and load `../../assets/js/tool-page.js`. The overview appends `?name=<name>` to the configured page path.
6. Only when needed, add `tools/<name>/tool.css` and set `css: 'tools/<name>/tool.css'` on the config entry. It is loaded on the overview and tool page.
7. Use external APIs only if needed; list them on `pages/apis.html`.
8. Test with VS Code Live Server at `http://127.0.0.1:5500/`: tile, tool page, keyboard use, narrow screens and search.

Keep tools self-contained: shared helpers go to `assets/js/`, shared styles to `assets/css/tiles.css`.
