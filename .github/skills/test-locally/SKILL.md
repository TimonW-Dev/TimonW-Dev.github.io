---
name: test-locally
description: Test sysadminsuite.com changes in the browser using the VS Code Live Server at http://127.0.0.1:5500/. Use after changing HTML, CSS, JS, tools or legal pages, or when verifying that subpages open.
---

**# Test locally**

ES modules require a local server, so using **VS Code Live Server** at [http://127.0.0.1:5500/](http://127.0.0.1:5500/) is recommended. Avoid opening files via `file://`.

## Steps
1. Make sure Live Server is running (start it from VS Code with "Go Live" if needed) and http://127.0.0.1:5500/ responds.
2. Open the page with the browser tools (`openBrowserPage`, then `readPage` / `screenshotPage`) and check the console for errors.
3. Run the checks below that apply to the change.

## Checklist
- **Home** (`/`): tiles render, no console errors, search works (also the `/` shortcut) and shows "No tools found" for no match.
- **Consent**: with `localStorage` key `sas-consent` cleared, the dialog appears on the home page only; accepting stores it; the footer "Consent" link shows it again. After accepting, change text in a legal page (`pages/*.html`) and reload: the dialog returns with the "legal texts have changed" notice (restore the text afterwards).
- **Layout**: categories sit side by side only if all their tiles fit; the category title collapses/expands and is remembered (`sas-collapsed`).
- **Favorites**: the star adds a tile to the top "Favorites" section (stored in `sas-favorites`); drag the ⠿ handle or use arrow keys to reorder; unstarring removes it; the section is hidden without favorites.
- **Theme**: the header switch toggles light/dark (default dark, stored in `sas-theme`) on the home, tool and legal pages.
- **Subpages**: each must be reachable and readable without accepting consent:
  - /pages/imprint.html
  - /pages/privacy.html
  - /pages/terms.html
  - /pages/apis.html

  Header/footer links must go to the right pages; "Home" returns to `/`.
- **Contact**: "Show contact email" reveals the address on click (no plain email in the source).
- - **Tools**: test valid, invalid and empty input, keyboard use, and both desktop and narrow screen (about 375 px wide) layouts as described above.
- **API tools**: only hosts listed in `pages/apis.html` are contacted (see the `document-api` skill).
- **404**: `404.html` applies on GitHub Pages only; Live Server shows its own error page.

## Report
Summarize what was tested and any failures. Do not leave temporary files behind.
