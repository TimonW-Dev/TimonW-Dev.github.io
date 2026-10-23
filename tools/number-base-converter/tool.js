const fields = [
  { base: 10, label: 'Decimal', id: 'number-base-decimal' },
  { base: 2, label: 'Binary', id: 'number-base-binary' },
  { base: 16, label: 'Hexadecimal', id: 'number-base-hexadecimal' },
];
let instanceCount = 0;

function parseInteger(value, base) {
  const patterns = {
    2: /^[+-]?[01]+$/,
    10: /^[+-]?\d+$/,
    16: /^[+-]?[0-9a-f]+$/i,
  };
  if (!patterns[base].test(value)) return null;

  const negative = value.startsWith('-');
  const digits = value.replace(/^[+-]/, '');
  const integer = base === 10 ? BigInt(digits) : BigInt(`0${base === 2 ? 'b' : 'x'}${digits}`);
  return negative ? -integer : integer;
}

export default {
  title: 'Binary / Decimal / Hex Converter',
  description: 'Convert whole numbers between decimal, binary and hexadecimal in real time.',
  tags: ['binary', 'decimal', 'hex', 'hexadecimal', 'number base', 'converter'],
  render(el) {
    const instanceId = ++instanceCount;
    const inputs = new Map();
    const form = document.createElement('div');
    form.className = 'base-converter-fields';
    const status = document.createElement('p');
    status.className = 'base-converter-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    for (const field of fields) {
      const label = document.createElement('label');
      label.className = 'base-converter-field';
      label.htmlFor = `${field.id}-${instanceId}`;
      label.append(document.createTextNode(field.label));

      const input = document.createElement('input');
      input.id = `${field.id}-${instanceId}`;
      input.type = 'text';
      input.inputMode = field.base === 10 ? 'decimal' : 'text';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.setAttribute('aria-label', field.label);
      input.setAttribute('aria-invalid', 'false');
      label.append(input);
      form.append(label);
      inputs.set(field.base, input);
    }

    form.addEventListener('input', (event) => {
      const source = fields.find((field) => inputs.get(field.base) === event.target);
      if (!source) return;

      const input = inputs.get(source.base);
      if (input.value === '') {
        status.textContent = '';
        input.setAttribute('aria-invalid', 'false');
        for (const field of fields) {
          if (field.base !== source.base) inputs.get(field.base).value = '';
        }
        return;
      }

      const integer = parseInteger(input.value, source.base);
      if (integer === null) {
        input.setAttribute('aria-invalid', 'true');
        status.textContent = `Enter a valid ${source.label.toLowerCase()} integer.`;
        for (const field of fields) {
          if (field.base !== source.base) inputs.get(field.base).value = '';
        }
        return;
      }

      input.setAttribute('aria-invalid', 'false');
      status.textContent = '';
      for (const field of fields) {
        if (field.base !== source.base) {
          inputs.get(field.base).value = integer.toString(field.base);
        }
      }
    });

    el.append(form, status);
  },
};
