const DATA_BASE = 'https://raw.githubusercontent.com/TimonW-Dev/sysadminsuite-data/main/data/ports';
const VERSION = 1;
const PROTOCOLS = ['tcp', 'udp', 'sctp', 'dccp'];
const shardCache = new Map();

function normalize(text) {
  return text.replace(/[A-Z]/g, character => character.toLowerCase());
}

function portShard(port) {
  const shard = port < 4096 ? Math.floor(port / 32) : 128 + Math.floor((port - 4096) / 480);
  return shard.toString(16).padStart(2, '0');
}

async function gramShard(gram) {
  const hash = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(gram));
  return new Uint8Array(hash)[0].toString(16).padStart(2, '0');
}

function loadShard(kind, shard) {
  const key = `${kind}/${shard}`;
  if (!shardCache.has(key)) {
    // The GitHub data host and requested paths are documented in pages/apis.html.
    const request = fetch(`${DATA_BASE}/${key}.json`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(payload => {
        const property = kind === 'data' ? 'entries' : 'grams';
        const values = payload?.[property];
        if (
          payload?.version !== VERSION ||
          values === null ||
          typeof values !== 'object' ||
          Array.isArray(values) ||
          (kind === 'data' &&
            !Object.values(values).every(record => record !== null && typeof record === 'object' && !Array.isArray(record)))
        ) {
          throw new Error(`Invalid ${kind} shard schema`);
        }
        return values;
      });
    request.catch(() => shardCache.delete(key));
    shardCache.set(key, request);
  }
  return shardCache.get(key);
}

function searchable(record) {
  const fields = [record.name, record.description];
  for (const optional of [record.aliases, record.comments]) {
    if (optional !== undefined && (!Array.isArray(optional) || !optional.every(text => typeof text === 'string'))) {
      throw new Error('Invalid port data record');
    }
    fields.push(...(optional ?? []));
  }
  return fields.filter(text => typeof text === 'string');
}

function matchesProtocol(record, protocol) {
  const recordProtocol = typeof record.protocol === 'string' ? normalize(record.protocol) : '';
  return protocol === null || recordProtocol === protocol;
}

function matchesFilter(record, filter) {
  const protocol = typeof record.protocol === 'string' ? normalize(record.protocol) : '';
  if (filter === 'tcp-udp') return protocol === 'tcp' || protocol === 'udp';
  if (filter === 'all') return true;
  return protocol === filter;
}

function protocolOrder(record) {
  const protocol = typeof record.protocol === 'string' ? normalize(record.protocol) : '';
  return protocol === 'tcp' ? 0 : protocol === 'udp' ? 1 : 2;
}

export async function lookupPort(port, protocol = null) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new RangeError('Port must be an integer from 0 to 65535');
  }
  const normalizedProtocol = protocol === null ? null : normalize(protocol);
  if (normalizedProtocol !== null && !PROTOCOLS.includes(normalizedProtocol)) {
    throw new TypeError('Unsupported protocol');
  }

  const entries = await loadShard('data', portShard(port));
  return Object.entries(entries).filter(([, record]) => {
    const bounds = Number.isInteger(record.port)
      ? [record.port, record.port]
      : Array.isArray(record.port) &&
          record.port.length === 2 &&
          record.port.every(Number.isInteger)
        ? record.port
        : null;
    return bounds !== null && bounds[0] <= port && port <= bounds[1] &&
      matchesProtocol(record, normalizedProtocol);
  }).map(([id, record]) => ({ id, ...record }));
}

export async function searchPorts(query) {
  if (typeof query !== 'string') throw new TypeError('Search query must be a string');
  const normalized = normalize(query);
  const characters = Array.from(normalized);
  if (characters.length < 3 || !normalized.trim()) {
    throw new RangeError('Search query must contain at least three characters');
  }

  const grams = [...new Set(characters.slice(0, -2).map((_, index) =>
    characters.slice(index, index + 3).join('')))];
  const shardsByGram = await Promise.all(grams.map(gramShard));
  const indexShards = new Map(await Promise.all([...new Set(shardsByGram)].map(async shard =>
    [shard, await loadShard('index', shard)])));
  const postingLists = grams.map((gram, index) => {
    const postings = indexShards.get(shardsByGram[index])[gram] ?? [];
    if (!Array.isArray(postings) || !postings.every(reference => typeof reference === 'string')) {
      throw new Error('Invalid port search index');
    }
    return postings;
  });
  postingLists.sort((a, b) => a.length - b.length);
  const otherLists = postingLists.slice(1).map(list => new Set(list));
  const references = postingLists[0].filter(reference =>
    otherLists.every(list => list.has(reference)));
  if (!references.every(reference => /^[0-9a-f]{2}[A-Za-z0-9_-]{16}$/.test(reference))) {
    throw new Error('Invalid port search index reference');
  }

  const shardNames = [...new Set(references.map(reference => reference.slice(0, 2)))];
  const dataShards = new Map(await Promise.all(shardNames.map(async shard =>
    [shard, await loadShard('data', shard)])));
  const results = [];
  for (const reference of references) {
    const id = reference.slice(2);
    const record = dataShards.get(reference.slice(0, 2))[id];
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      throw new Error(`Index references missing record ${reference}`);
    }
    if (searchable(record).some(text => normalize(text).includes(normalized))) {
      results.push({ id, ...record });
    }
  }
  return results;
}

function portLabel(record) {
  if (Number.isInteger(record.port)) return String(record.port);
  if (Array.isArray(record.port) && record.port.length === 2) {
    return `${record.port[0]}-${record.port[1]}`;
  }
  return 'No port';
}

function resultText(record) {
  const protocol = typeof record.protocol === 'string' ? record.protocol.toUpperCase() : 'protocol unspecified';
  return `${portLabel(record)}/${protocol}`;
}

export default {
  title: 'Port Lookup',
  description: 'Look up IANA port assignments by port number or service name.',
  tags: ['port', 'ports', 'service', 'tcp', 'udp', 'sctp', 'dccp', 'iana', 'network', 'lookup'],
  render(el) {
    const form = document.createElement('form');
    form.className = 'port-lookup-form';

    const queryLabel = document.createElement('label');
    queryLabel.textContent = 'Port number or service name';
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'e.g. 443 or https';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-invalid', 'false');
    queryLabel.append(input);

    const protocolLabel = document.createElement('label');
    protocolLabel.textContent = 'Protocol';
    const protocolSelect = document.createElement('select');
    protocolSelect.setAttribute('aria-label', 'Filter by protocol');
    const protocolFilters = [
      { value: 'tcp-udp', label: 'TCP / UDP' },
      { value: 'tcp', label: 'TCP' },
      { value: 'udp', label: 'UDP' },
      { value: 'sctp', label: 'SCTP' },
      { value: 'all', label: 'All protocols' },
    ];
    for (const [index, filter] of protocolFilters.entries()) {
      const option = document.createElement('option');
      option.value = filter.value;
      option.textContent = filter.label;
      option.selected = index === 0;
      protocolSelect.append(option);
    }
    protocolLabel.append(protocolSelect);

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Look up';

    const status = document.createElement('p');
    status.className = 'port-lookup-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    const results = document.createElement('ul');
    results.className = 'port-lookup-results';

    const note = document.createElement('p');
    note.className = 'port-lookup-note';
    const noteInfo = document.createElement('span');
    noteInfo.className = 'tool-info';
    noteInfo.textContent = 'i';
    const noteText = 'Port data is fetched from raw.githubusercontent.com (GitHub). The port number or service search text is not sent; requests load data/index shards selected by the port or by SHA-256 hashes of search trigrams.';
    noteInfo.title = noteText;
    noteInfo.setAttribute('aria-label', noteText);
    noteInfo.setAttribute('role', 'img');
    noteInfo.tabIndex = 0;
    note.append('Loads data from GitHub. ', noteInfo);

    form.append(queryLabel, protocolLabel, submit);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const query = input.value.trim();
      const filter = protocolSelect.value;
      results.replaceChildren();
      input.setAttribute('aria-invalid', 'false');

      if (!query) {
        status.textContent = 'Enter a port number or service name.';
        status.dataset.state = 'invalid';
        input.setAttribute('aria-invalid', 'true');
        return;
      }

      const isPort = /^\d+$/.test(query);
      if (isPort && (!Number.isSafeInteger(Number(query)) || Number(query) > 65535)) {
        status.textContent = 'Enter a port from 0 to 65535.';
        status.dataset.state = 'invalid';
        input.setAttribute('aria-invalid', 'true');
        return;
      }
      if (!isPort && Array.from(query).length < 3) {
        status.textContent = 'Service name searches need at least three characters.';
        status.dataset.state = 'invalid';
        input.setAttribute('aria-invalid', 'true');
        return;
      }

      submit.disabled = true;
      input.disabled = true;
      protocolSelect.disabled = true;
      status.textContent = 'Loading port data from GitHub…';
      status.dataset.state = 'loading';
      try {
        const unfilteredEntries = isPort
          ? await lookupPort(Number(query))
          : await searchPorts(query);
        const entries = unfilteredEntries
          .filter(record => matchesFilter(record, filter))
          .map((record, index) => ({ record, index }))
          .sort((left, right) =>
            protocolOrder(left.record) - protocolOrder(right.record) || left.index - right.index)
          .map(({ record }) => record);
        if (entries.length === 0) {
          status.textContent = 'No matching IANA entries found.';
          status.dataset.state = 'empty';
        } else {
          status.textContent = `${entries.length} matching IANA ${entries.length === 1 ? 'entry' : 'entries'}.`;
          status.dataset.state = 'found';
          for (const entry of entries) {
            const item = document.createElement('li');
            const primary = document.createElement('strong');
            primary.textContent = `${resultText(entry)} — ${entry.name || 'Unnamed service'}`;
            item.append(primary);
            if (typeof entry.description === 'string' && entry.description !== entry.name) {
              const description = document.createElement('span');
              description.textContent = ` — ${entry.description}`;
              item.append(description);
            }
            if (typeof entry.status === 'string') {
              const classification = document.createElement('span');
              classification.textContent = ` (${entry.status})`;
              item.append(classification);
            }
            results.append(item);
          }
        }
      } catch (error) {
        status.textContent = `Port data could not be loaded from GitHub. Check your connection and try again. ${error instanceof Error ? error.message : ''}`.trim();
        status.dataset.state = 'error';
      } finally {
        submit.disabled = false;
        input.disabled = false;
        protocolSelect.disabled = false;
      }
    });

    el.append(form, status, results, note);
  },
};
