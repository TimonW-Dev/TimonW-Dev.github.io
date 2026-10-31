# Project guidelines

- Stack: plain HTML, CSS and JavaScript (ES modules); no frameworks, build tools or npm dependencies.
- Prefer local processing. Review every external service for compatibility and document it in `pages/apis.html` before use. Disclose the data sent, handle failures, and contact only documented hosts. Do not add third-party scripts, fonts, CDNs, trackers or cookies.
- Use `textContent`, never `innerHTML`, for user input. Never put the contact email directly in HTML/JS; use `assets/js/contact.js`.
- For tool changes, follow the [tool guide](../docs/tool-guide.md) and [add-tool skill](skills/add-tool/SKILL.md). For external services, use the [document-api skill](skills/document-api/SKILL.md); for browser checks, use the [test-locally skill](skills/test-locally/SKILL.md).
- Test browser behavior only with VS Code Live Server at http://127.0.0.1:5500/; do not use Node.js or npm test/server commands.
- Keep the UI in English and legal pages consistent with the site's use-at-your-own-risk/no-liability wording. Keep code small and comment only where unclear.
