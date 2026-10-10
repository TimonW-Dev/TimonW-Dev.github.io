const KEY = 'sas-consent-v1'; // bump the version to ask everyone again after legal changes

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
      <h2>Use at your own risk</h2>
      <p>sysadminsuite.com is provided free of charge and "as is". Results may be
      incomplete or wrong. You use all tools at your own risk. To the extent
      permitted by law, the operator accepts no responsibility and no liability.</p>
      <p>Some tools use third-party services (e.g. MAC vendor lookup) and send
      the data you enter to them. See <a href="${root}pages/apis.html">APIs &amp; third parties</a>,
      <a href="${root}pages/terms.html">Terms</a> and <a href="${root}pages/privacy.html">Privacy</a>.</p>
      <p>By continuing you accept all of the above once for the whole site.</p>
      <button type="button" id="consent-ok">I understand and accept</button>
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
