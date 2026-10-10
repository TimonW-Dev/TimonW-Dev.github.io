// The address is stored base64-encoded and only decoded after a user click,
// so it never appears in the HTML source or in static scrapes.
const ENC = 'dGltb24uZ2l0aHViQG91dGxvb2suY29t';

export function initContact() {
  document.querySelectorAll('[data-contact]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const addr = atob(ENC);
      const a = document.createElement('a');
      a.href = `mailto:${addr}`;
      a.textContent = addr;
      el.replaceWith(a);
    }, { once: true });
  });
}
