# Copilot instructions

Project: sysadminsuite.com – static site with sysadmin tools as tiles. Stack: plain HTML, CSS, JavaScript (ES modules). No frameworks, build tools or npm dependencies.

- New tool = `tools/<name>/tool.js` (copy `tools/_template`) + `{ name, category, size }` in `tools/config.js`. Use a lowercase kebab-case name slug. The default page is `tool.html?name=<name>`; set optional `page` and `css` paths only when a tool needs its own page or stylesheet.
- Prefer local client-side logic. Before using any API or third-party service, verify it is compatible with this project: review its terms, privacy policy, data handling, HTTPS availability, and whether it works without a committed secret. Do not add incompatible services; document every approved external service in `pages/apis.html` in the same change, including the host, exact data sent, and provider privacy link. Disclose data sent in the tool UI, handle request failures, and verify the browser contacts only documented hosts. No third-party scripts, fonts, CDNs, trackers, or analytics.
- Never write the contact email into HTML/JS plainly; use `assets/js/contact.js`.
- No cookies, trackers, CDNs. Use `textContent`, not `innerHTML`, for user input.
- Keep legal pages (`pages/`) consistent: use at own risk, no liability, Swiss law.
- UI language is English. Keep code small, commented only where unclear.
- Skills in `.github/skills/`: `add-tool`, `document-api` (every external API goes into `pages/apis.html`), `test-locally`.
- Test only with the VS Code Live Server at http://127.0.0.1:5500/; do not use Python or another local server.
- See `CONTRIBUTING.md` and `docs/`.
