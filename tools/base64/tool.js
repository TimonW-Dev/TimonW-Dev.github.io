export default {
  title: 'Base64',
  description: 'Base64 Encoder and Decoder',
  tags: ['encode', 'decode', 'base64'],
  render(el) {
    const plaintext = document.createElement('input');
    plaintext.type = 'text';
    plaintext.placeholder = 'Plain Text';
    plaintext.setAttribute('aria-label', 'Plain text');

    const base64 = document.createElement('input');
    base64.type = 'text';
    base64.placeholder = 'Base64';
    base64.setAttribute('aria-label', 'Base64 encoded text');

    plaintext.addEventListener('input', () => {
      base64.value = btoa(plaintext.value);
    });

    base64.addEventListener('input', () => {
      plaintext.value = atob(base64.value);
    })

    el.append(plaintext, base64);
  },
};
