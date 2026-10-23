// Classic script in <head>: applies the saved theme before first paint (no flash). Default: dark.
(function () {
  const KEY = 'sas-theme';
  const root = document.documentElement;

  function read() {
    try { return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
  }

  function apply(theme) {
    root.dataset.theme = theme;
  }

  apply(read());

  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (!header) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';

    function update() {
      const light = root.dataset.theme === 'light';
      button.textContent = light ? '☾' : '☀';
      const label = light ? 'Switch to dark mode' : 'Switch to light mode';
      button.title = label;
      button.setAttribute('aria-label', label);
    }

    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch { /* storage blocked: applies for this page only */ }
      update();
    });
    update();
    header.append(button);
  });
})();
