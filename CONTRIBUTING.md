# Contributing

Thanks for your interest in contributing to sysadminsuite.com! Fork the repo, create a branch, and open a pull request.

### Adding a tool

Copy `tools/_template/` to `tools/<name>/`, edit `tool.js`, and add `{ name, category, size }` to `tools/config.js`. Use a lowercase kebab-case name slug. The default page, `tool.html?name=<name>`, is automatic; add optional `page` and `css` paths only if your tool needs a custom page or stylesheet. See the [tool guide](docs/tool-guide.md).

### A few project guidelines

- Use plain HTML, CSS and JS (ES modules)—no frameworks, build step or dependencies.
- By default, each tool gets one tile and uses the shared standard page. A custom `index.html` and `tool.css` are optional; custom pages should use `assets/js/tool-page.js` to render the tool module.
- Keep tool-specific JavaScript in `tools/<name>/tool.js` and tool-specific styles in `tools/<name>/tool.css`, registering the stylesheet with `css` in `tools/config.js`. Do not add files under `assets/js/` or rules to global CSS for logic or styles used only by one tool or category, unless deliberately establishing a documented reusable component standard. Add shared JavaScript or global CSS only for functionality or styles genuinely reused across the site, multiple independent tools, or an intentionally standardized shared component.
- Use the shared `.tool-info` class from `assets/css/tiles.css` for inline information icons. Place it next to the content it explains and provide a concise `title`, matching `aria-label`, `role="img"`, and `tabindex="0"` for hover and keyboard focus.
- Prefer local computation.
- Using an API or third-party service? Check the provider's terms, privacy policy and data handling, confirm it uses HTTPS and doesn't need a committed secret / API key, and make sure it fits the project rules and users' privacy expectations.
- Document every external data service in `pages/apis.html`. Include the service host, the precise user data sent and a link to the provider. Disclose data use in the tool, handle request failures clearly, and verify it contacts only documented hosts. No third-party scripts, fonts, CDNs, trackers or analytics.
- No cookies, trackers or third-party scripts/CDNs.
- Use `textContent`, never `innerHTML`, with user input.

We recommend testing with the Visual Studio Code “Live Server” extension at the following URL: `http://127.0.0.1:5500/`. Other live servers also work. When testing, focus on the following:
tiles, dedicated tool pages, keyboard usage, narrow screens, and search.

For the layout, see [docs/architecture.md](docs/architecture.md).
