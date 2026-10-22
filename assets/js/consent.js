const KEY = 'sas-consent';
const LEGACY_KEYS = ['sas-consent-v1', 'sas-consent-v2', 'sas-consent-v3'];
const LEGAL_PAGES = ['pages/imprint.html', 'pages/privacy.html', 'pages/terms.html', 'pages/apis.html'];

const TITLE = 'Personal hobby project — use at your own risk';
const TEXT = [
  'sysadminsuite.com is a free, best-effort open-source hobby project, provided "as is". Results may be '
    + 'incomplete or wrong, so check them before relying on them, especially in production systems. '
    + 'To the extent permitted by law, the operator excludes responsibility and liability.',
  'Some tools may load data from external services; they are listed on the APIs page.',
  'These terms and other legal pages may change from time to time. Please review the current versions.',
  'Continuing confirms that you have read this notice and the linked pages. It does not waive rights '
    + 'that cannot legally be waived.',
];
const CHANGED = 'The legal texts have changed since you last confirmed. Please read and confirm again.';

const root = () => document.body.dataset.root || '';

function stored() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

// Fingerprint of the notice and all legal pages. Any change asks visitors to confirm again.
// Returns null when the pages cannot be read (offline, blocked), so nobody is asked by mistake.
let fingerprintPromise;
function fingerprint() {
  fingerprintPromise ??= (async () => {
    try {
      const texts = await Promise.all(LEGAL_PAGES.map(async (page) => {
        const res = await fetch(`${root()}${page}`);
        if (!res.ok) throw new Error(`${page}: ${res.status}`);
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        return (doc.querySelector('main')?.textContent ?? '').replace(/\s+/g, ' ').trim();
      }));
      const data = new TextEncoder().encode([TITLE, ...TEXT, ...texts].join('\n'));
      const digest = await crypto.subtle.digest('SHA-256', data);
      return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      console.error('Could not fingerprint the legal pages', err);
      return null;
    }
  })();
  return fingerprintPromise;
}

function link(href, text) {
  const a = document.createElement('a');
  a.href = `${root()}${href}`;
  a.textContent = text;
  return a;
}

function show(changed = false) {
  if (document.getElementById('consent')) return;
  const wrap = document.createElement('div');
  wrap.id = 'consent';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.setAttribute('aria-labelledby', 'consent-title');
  const box = document.createElement('div');
  box.className = 'box';
  const h = document.createElement('h2');
  h.id = 'consent-title';
  h.textContent = TITLE;
  box.append(h);
  if (changed) {
    const notice = document.createElement('p');
    notice.className = 'consent-changed';
    notice.textContent = CHANGED;
    box.append(notice);
  }
  for (const text of TEXT) {
    const p = document.createElement('p');
    p.textContent = text;
    box.append(p);
  }
  const links = document.createElement('p');
  links.className = 'consent-links';
  links.append(link('pages/terms.html', 'Terms'), link('pages/privacy.html', 'Privacy'),
    link('pages/apis.html', 'APIs'), link('pages/imprint.html', 'Imprint'));
  const ok = document.createElement('button');
  ok.type = 'button';
  ok.textContent = 'I understand';
  ok.addEventListener('click', async () => {
    ok.disabled = true;
    const hash = await fingerprint();
    try { localStorage.setItem(KEY, JSON.stringify({ hash })); } catch { /* storage blocked: ask again next visit */ }
    wrap.remove();
  });
  box.append(links, ok);
  wrap.append(box);
  document.body.append(wrap);
  ok.focus();
}

export async function initConsent() {
  LEGACY_KEYS.forEach((key) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  });
  document.querySelectorAll('[data-consent-reset]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
      show();
    }));
  const saved = stored();
  if (!saved) {
    show();
    return;
  }
  const current = await fingerprint();
  if (current && saved.hash !== current) show(true);
}
