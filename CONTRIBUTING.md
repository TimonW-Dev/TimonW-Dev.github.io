# Contributing

1. Fork, branch, open a PR.
2. Add a tool: copy `tools/_template/` to `tools/<name>/`, edit `tool.js`, and add `{ name, category, size }` to `tools/config.js`. Use a lowercase kebab-case name slug. The default page `tool.html?name=<name>` is automatic; add optional `page` and `css` paths only when the tool needs a custom page or stylesheet. See [docs/tool-guide.md](docs/tool-guide.md).
3. Rules:
   - Plain HTML/CSS/JS only (ES modules). No frameworks, no build step, no dependencies.
   - One tool = one tile + the shared standard page by default. A custom `index.html` and `tool.css` are optional; custom pages should use the shared `assets/js/tool-page.js` to render the tool module.
   - Prefer local computation. Before using any API or third-party service, verify it fits the project: review the provider's terms, privacy policy and data handling, confirm HTTPS and that no committed secret is needed. Do not integrate a service that conflicts with project rules or user privacy expectations.
   - Document every approved external data service in `pages/apis.html` in the same PR: service host, precise user data sent, and provider privacy-policy link. Add a short disclosure in the tool, handle request failures clearly, and verify that it contacts only documented hosts. No third-party scripts, fonts, CDNs, trackers or analytics.
   - Never put email addresses or personal data in HTML or code; use `assets/js/contact.js`.
   - No cookies, trackers or third-party scripts/CDNs.
   - Use `textContent`, never `innerHTML`, with user input.
   - Small, focused PRs; describe what you tested.
4. Test e.g with the VS-Code Live Server extension at http://127.0.0.1:5500/.

Layout: see [docs/architecture.md](docs/architecture.md).
