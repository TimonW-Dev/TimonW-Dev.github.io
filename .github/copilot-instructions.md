# Copilot instructions

Project: sysadminsuite.com – static site with sysadmin tools as tiles. Stack: plain HTML, CSS, JavaScript (ES modules). No frameworks, build tools or npm dependencies.

- New tool = `tools/<name>/tool.js` (copy `tools/_template`) + `{ name, category, size }` in `tools/config.js`. Use a lowercase kebab-case name slug. The default page is `tool.html?name=<name>`; set optional `page` and `css` paths only when a tool needs its own page or stylesheet.
- Keep tool-specific JavaScript in `tools/<name>/tool.js` and tool-specific styles in `tools/<name>/tool.css`, registered through `css` in `tools/config.js`. Do not add files under `assets/js/` or rules to global CSS for logic or styles used only by one tool or category, unless deliberately establishing a documented reusable component standard. Add shared JavaScript or global CSS only for functionality or styles genuinely reused across the site, multiple independent tools, or an intentionally standardized shared component.
- Use the shared `.tool-info` class from `assets/css/tiles.css` for inline information icons. Put the icon next to the content it explains and provide a concise `title`, matching `aria-label`, `role="img"`, and `tabindex="0"` for hover and keyboard focus.
- Prefer local client-side logic. Before using any API or third-party service, verify it is compatible with this project: review its terms, privacy policy, data handling, HTTPS availability, and whether it works without a committed secret. Do not add incompatible services; document every approved external service in `pages/apis.html` in the same change, including the host, exact data sent, and provider privacy link. Disclose data sent in the tool UI, handle request failures, and verify the browser contacts only documented hosts. No third-party scripts, fonts, CDNs, trackers, or analytics.
- Never write the contact email into HTML/JS plainly; use `assets/js/contact.js`.
- No cookies, trackers, CDNs. Use `textContent`, not `innerHTML`, for user input.
- Keep legal pages (`pages/`) consistent: use at own risk, no liability.
- UI language is English. Keep code small, commented only where unclear.
- Skills in `.github/skills/`: `add-tool`, `document-api` (every external API goes into `pages/apis.html`), `test-locally`.
- Test only with the VS Code Live Server at http://127.0.0.1:5500/;