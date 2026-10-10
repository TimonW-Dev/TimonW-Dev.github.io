const KEY = 'sas-consent-v2'; // bump the version to ask everyone again after legal changes

export function hasConsent() {
  try { return localStorage.getItem(KEY) === 'yes'; } catch { return false; }
}

function show() {
  if (document.getElementById('consent')) return;
  const root = (document.body.dataset.root || '');
  const wrap = document.createElement('div');
  wrap.id = 'consent';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.innerHTML = `
    <div class="box">
      <h2>Personal hobby project — use at your own risk</h2>
      <p>sysadminsuite.com is a free, best-effort open-source hobby project, provided "as is".
      Results may be incomplete or wrong. Check all results before relying on them, especially in
      production systems. To the extent permitted by law, the operator excludes responsibility and liability.</p>
      <p>No tool APIs are currently used. If a tool later sends data to an external service, details will
      appear on <a href="${root}pages/apis.html">APIs &amp; third parties</a>. Please read the
      <a href="${root}pages/terms.html">Terms</a> and <a href="${root}pages/privacy.html">Privacy</a>.</p>
      <p>Continuing confirms that you have read this notice. It does not waive rights that cannot legally
      be waived or replace consent required by law for a specific data use.</p>
      <button type="button" id="consent-ok">I understand</button>
    </div>`;
  document.body.append(wrap);
  document.getElementById('consent-ok').addEventListener('click', () => {
    try { localStorage.setItem(KEY, 'yes'); } catch { /* storage blocked: ask again next visit */ }
    wrap.remove();
  });
}

export function initConsent() {
  if (!hasConsent()) show();
  document.querySelectorAll('[data-consent-reset]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
      show();
    }));
}
