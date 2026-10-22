// Settings stay on this device (localStorage). Failures (blocked storage) are ignored.
export function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function writeList(key, list) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* storage blocked */ }
}
