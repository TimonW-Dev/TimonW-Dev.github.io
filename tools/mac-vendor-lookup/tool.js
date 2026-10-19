const DATA_BASE = 'https://raw.githubusercontent.com/TimonW-Dev/sysadminsuite-data/main/data/mac-vendors';
const PREFIX_LENGTHS = [9, 7, 6]; // most specific assignment first
const shardCache = new Map();

// Returns { hex } for valid input, { error } otherwise, or null for empty input.
export function normalizeMac(value) {
  const text = value.trim();
  if (text === '') return null;
  if (!/^[0-9a-f:.\-\s]+$/i.test(text)) {
    return { error: 'Use only hex characters (0-9, A-F) and the separators : - . or space.' };
  }
  const hex = text.toLowerCase().replace(/[^0-9a-f]/g, '');
  if (hex.length < 6) return { error: 'Enter at least 6 hex characters.' };
  if (hex.length > 12) return { error: 'A MAC address has at most 12 hex characters.' };
  return { hex };
}

export function findVendor(shard, hex) {
  for (const length of PREFIX_LENGTHS) {
    const prefix = hex.slice(0, length);
    if (prefix.length === length && Object.hasOwn(shard, prefix) && typeof shard[prefix] === 'string') {
      return { prefix, vendor: shard[prefix] };
    }
  }
  return null;
}

function loadShard(name) {
  if (!shardCache.has(name)) {
    const request = fetch(`${DATA_BASE}/${name}.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((shard) => {
        if (shard === null || typeof shard !== 'object' || Array.isArray(shard)) {
          throw new Error('Invalid vendor data');
        }
        return shard;
      });
    request.catch(() => shardCache.delete(name));
    shardCache.set(name, request);
  }
  return shardCache.get(name);
}

export default {
  title: 'MAC Vendor Lookup',
  description: 'Look up a network device manufacturer by MAC address.',
  tags: ['mac', 'mac address', 'oui', 'vendor', 'manufacturer', 'lookup', 'network'],
  render(el) {
    const id = `mac-vendor-${Math.random().toString(36).slice(2, 8)}`;

    const input = document.createElement('input');
    input.id = id;
    input.className = 'mac-vendor-input';
    input.type = 'text';
    input.placeholder = 'e.g. CA:FE:C0:FF:EE:00';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-invalid', 'false');

    const out = document.createElement('div');
    out.className = 'out mac-vendor-result';
    out.setAttribute('role', 'status');
    out.setAttribute('aria-live', 'polite');

    const note = document.createElement('p');
    note.className = 'mac-vendor-note';
    const noteInfo = document.createElement('span');
    noteInfo.className = 'tool-info';
    noteInfo.textContent = 'i';
    const noteText = 'Only the first two hex characters are used to request a data file from raw.githubusercontent.com (GitHub). The full address stays in your browser.';
    noteInfo.title = noteText;
    noteInfo.setAttribute('aria-label', noteText);
    noteInfo.setAttribute('role', 'img');
    noteInfo.tabIndex = 0;
    note.append('Vendor data is loaded from GitHub. ', noteInfo);

    let timer;
    let run = 0;

    const show = (text, state) => {
      out.textContent = text;
      out.dataset.state = state;
      input.setAttribute('aria-invalid', state === 'invalid' ? 'true' : 'false');
    };

    async function lookup() {
      const current = ++run;
      const parsed = normalizeMac(input.value);
      if (parsed === null) return show('', 'idle');
      if (parsed.error) return show(parsed.error, 'invalid');

      show('Looking up…', 'loading');
      try {
        const shard = await loadShard(parsed.hex.slice(0, 2));
        if (current !== run) return;
        const match = findVendor(shard, parsed.hex);
        if (match) show(match.vendor, 'found');
        else show('No vendor found for this address.', 'empty');
      } catch {
        if (current !== run) return;
        show('Vendor data could not be loaded. Check your connection and try again.', 'error');
      }
    }

    input.addEventListener('input', () => {
      clearTimeout(timer);
      run++; // invalidate any lookup still in flight
      timer = setTimeout(lookup, 250);
    });

    el.append(input, out, note);
  },
};
