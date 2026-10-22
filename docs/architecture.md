# Architecture

```
index.html          overview: search + tiles grouped by category
tool.html           standard page for one tool (tool.html?name=<name>)
pages/              imprint, privacy, terms, apis (legal; keep minimal)
assets/css|js|img|icons
  js/app.js         overview: category sections, collapsing, favorites, filtering
  js/theme.js       light/dark switch (classic script in <head>, key sas-theme)
  js/reorder.js     keyboard reordering of favorite tiles
  js/local-state.js localStorage helpers (keys sas-favorites, sas-collapsed)
  js/tool-page.js   standalone tool page
  js/tools.js       shared loader (config + tool modules)
  js/search.js      tile filtering
  js/consent.js     consent modal; asks again when the notice or a legal page changes (hash in localStorage)
  js/contact.js     click-to-reveal email (anti-scraping)
tools/config.js     categories, tool name/category/size/order and optional page/css paths
tools/<name>/tool.js required ES module per tool (render(el)), used by tile and page
tools/<name>/index.html (optional custom page)
tools/<name>/tool.css   (optional stylesheet; loaded on the overview and tool page)
docs/               documentation
```

Tool names are lowercase kebab-case slugs used as folder names and in the `name` config field / `?name=` URL parameter. Category IDs remain separate.

Without optional files, tools use the shared page and shared styles. Configure `page: 'tools/<name>/index.html'` for a custom page and `css: 'tools/<name>/tool.css'` for per-tool styling. Both are paths relative to the site root. A custom page can copy the structure of `tool.html`, set `data-root="../../"` on its body, use the same `tool-title`, `tool-desc`, `tool-category`, and `tool-body` elements, and load `../../assets/js/tool-page.js`. The overview adds `?name=<name>` to custom page links, so the shared tool module renderer is reused.

Hosting: GitHub Pages, custom domain in `CNAME`. ES modules need http(s); use only VS Code Live Server at `http://127.0.0.1:5500/`, not `file://` or another local server.
