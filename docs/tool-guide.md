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
8. We recommend testing with the Visual Studio Code “Live Server” extension at the following URL: `http://127.0.0.1:5500/`. Other live servers also work. When testing, focus on the following:
tiles, dedicated tool pages, keyboard usage, narrow screens, and search.

Keep tools self-contained: tool-specific JavaScript belongs in `tools/<name>/tool.js`, and tool-specific styles belong in `tools/<name>/tool.css`, registered through `css` in `tools/config.js`. Do not add files under `assets/js/` or rules to `assets/css/base.css` or `assets/css/tiles.css` for logic or styles used only by one tool or category, unless deliberately establishing a documented reusable component standard. Add shared JavaScript or global CSS only for functionality or styles genuinely reused across the site, multiple independent tools, or an intentionally standardized shared component.

Use the shared `.tool-info` class from `assets/css/tiles.css` for inline information icons. Place the icon next to the content it explains and provide a concise `title`, matching `aria-label`, `role="img"`, and `tabindex="0"` for hover and keyboard focus.
