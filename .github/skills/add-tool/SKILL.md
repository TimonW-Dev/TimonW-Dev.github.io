---
name: add-tool
description: Add a new tool tile and its standard page to sysadminsuite.com (e.g. converter, calculator, lookup). Use when asked to create, extend or register a tool in the tools config.
---

# Add a tool

Stack: plain HTML, CSS, JavaScript (ES modules). No frameworks, build step or dependencies. One tool = one tile on the overview plus the shared standard page `tool.html?name=<name>` by default. A custom page and stylesheet are optional.

## Steps
1. Copy the template: `tools/_template/` → `tools/<name>/` (lowercase kebab-case name slug).
2. Edit `tools/<name>/tool.js`: set `title`, `description`, `tags` (used by search) and implement `render(el)` (must work as a small tile and on the full page).
3. Add `{ name, category, size: { w, h } }` to `tools/config.js` (`w` 1–4 columns, `h` 1–3 rows); add a category to `categories` if needed.
4. By default, the shared page and styles are used. Only when needed, add `tools/<name>/index.html` and set `page: 'tools/<name>/index.html'`, or add `tools/<name>/tool.css` and set `css: 'tools/<name>/tool.css'`. Paths are relative to the site root. Custom pages should copy the structure of `tool.html`, set `data-root="../../"` on `<body>`, keep the `tool-title`, `tool-desc`, `tool-category`, and `tool-body` elements, and load `../../assets/js/tool-page.js`; the overview appends `?name=<name>` to the custom page path.
5. Shared helpers go to `assets/js/`, shared styles to `assets/css/tiles.css`. Keep the tool otherwise self-contained.
6. If the tool contacts an external service, follow the `document-api` skill in the same change.
7. Test with the `test-locally` skill.

## Rules
- Compute locally in the browser whenever possible.
- Use `textContent`, never `innerHTML`, for user input and results.
- Give every input an `aria-label` or `<label>`; keep it keyboard usable and responsive on narrow screens.
- Never write the contact email or personal data into HTML/JS; use `assets/js/contact.js`.
- No cookies, trackers, CDNs or third-party scripts.
- UI language is English. Keep code small; comment only where unclear.
