---
name: document-api
description: Document an external API or third-party service used by a tool on sysadminsuite.com. Use whenever a tool makes a network request (fetch, XHR, images, scripts, fonts) or when asked to add, change or remove an entry on the APIs page.
---

# Document an external API

Every approved external data service must be listed in `pages/apis.html` in the same change that introduces it. Tools run client-side by default; a network call is the exception. Documentation does not make an incompatible service acceptable: if it conflicts with project rules, privacy expectations, or provider terms, do not integrate it.

## Before adding an API
- Prefer a local solution (bundled data, computation in the browser).
- Check that the service is compatible with the project: review its terms of use, privacy policy, what data it collects/retains, and any relevant limitations. Confirm it is available over HTTPS and works without a secret that would need to be committed. Stop if any of these checks fail or remain unclear.
- No CDNs, trackers, analytics, or third-party scripts/fonts. Only necessary data requests (`fetch`) to a reviewed and documented service are allowed.
- Send the minimum data needed (e.g. only the first 3 bytes of a MAC address).
- Explain what user data is sent and why; do not transmit unrelated or unnecessary data.

## Steps
1. Open `pages/apis.html` and replace the placeholder row ("No external services are used yet…") with a real row; remove the placeholder once the first entry exists. Use the commented example row as the template:
   ```html
   <tr><td>Tool name</td><td>api.example.org</td><td>What exactly is sent</td><td><a href="https://example.org/privacy">Link</a></td></tr>
   ```
   - **Tool**: the tile title.
   - **Service**: the host name that is contacted.
   - **Data sent**: precise list of user-entered data (the IP address is implicit and already mentioned on the page).
   - **Provider privacy**: link to the provider's privacy policy.
2. In `tool.js`, add a comment near the request pointing to `pages/apis.html`, and show a short note in the tile that data is sent to the service.
3. Handle failures gracefully (offline, rate limit, CORS) with a readable message via `textContent`.
4. Keep legal pages consistent: "use at your own risk, no liability". Only update `pages/privacy.html` or `assets/js/consent.js` when data processing changes materially; if the consent text changes, bump the `KEY` version in `consent.js` so everyone is asked again.
5. Complete the API/third-party service review and documentation checkboxes in the PR template.

## Verify
- Serve the site (see the `test-locally` skill) and open http://127.0.0.1:5500/pages/apis.html: the table renders and the new row is correct.
- Confirm in the browser network tab that the tool contacts only the reviewed and listed host(s).
- Remove the API entry again if the tool no longer calls the service.
