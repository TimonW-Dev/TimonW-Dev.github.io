const permissions = [
  { label: 'Owner', digit: 4, id: 'owner' },
  { label: 'Group', digit: 2, id: 'group' },
  { label: 'Others', digit: 1, id: 'others' },
];

function symbolicPermissions(value) {
  return [
    value & 4 ? 'r' : '-',
    value & 2 ? 'w' : '-',
    value & 1 ? 'x' : '-',
  ].join('');
}

function parseSymbolicPermissions(value) {
  if (!/^[r-][w-][x-]$/.test(value)) return null;

  return (value[0] === 'r' ? 4 : 0)
    + (value[1] === 'w' ? 2 : 0)
    + (value[2] === 'x' ? 1 : 0);
}

export default {
  title: 'Chmod Simulator',
  description: 'Convert chmod numbers to symbolic permissions and edit either format.',
  tags: ['chmod', 'permissions', 'linux', 'rwx', 'file permissions', 'octal'],
  render(el) {
    // Unique ids: the tile can be rendered twice (overview + favorites).
    const prefix = `chmod-${Math.random().toString(36).slice(2, 8)}`;
    const form = document.createElement('div');
    form.className = 'chmod-simulator-fields';

    const octalLabel = document.createElement('label');
    octalLabel.className = 'chmod-simulator-field';
    octalLabel.htmlFor = `${prefix}-octal`;
    octalLabel.append(document.createTextNode('Octal permissions'));

    const octalInput = document.createElement('input');
    octalInput.id = `${prefix}-octal`;
    octalInput.type = 'text';
    octalInput.inputMode = 'numeric';
    octalInput.autocomplete = 'off';
    octalInput.maxLength = 3;
    octalInput.value = '777';
    octalInput.setAttribute('aria-label', 'Octal permissions');
    octalInput.setAttribute('aria-invalid', 'false');
    octalLabel.append(octalInput);
    form.append(octalLabel);

    const symbolicFields = new Map();
    const symbolicGroup = document.createElement('div');
    symbolicGroup.className = 'chmod-symbolic-fields';

    for (const permission of permissions) {
      const label = document.createElement('label');
      label.className = 'chmod-simulator-field';
      label.htmlFor = `${prefix}-${permission.id}`;
      label.append(document.createTextNode(permission.label));

      const input = document.createElement('input');
      input.id = `${prefix}-${permission.id}`;
      input.type = 'text';
      input.inputMode = 'text';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.maxLength = 3;
      input.value = 'rwx';
      input.setAttribute('aria-label', `${permission.label} permissions`);
      input.setAttribute('aria-invalid', 'false');
      label.append(input);
      symbolicGroup.append(label);
      symbolicFields.set(permission, input);
    }
    form.append(symbolicGroup);

    const terminalOutput = document.createElement('div');
    terminalOutput.className = 'chmod-terminal-output';
    const terminalLabel = document.createElement('span');
    terminalLabel.className = 'chmod-terminal-label';
    terminalLabel.textContent = 'Terminal output';

    const directoryLabel = document.createElement('label');
    directoryLabel.className = 'chmod-directory-option';
    const directoryCheckbox = document.createElement('input');
    directoryCheckbox.type = 'checkbox';
    directoryCheckbox.setAttribute('aria-label', 'Directory');
    directoryLabel.append(directoryCheckbox, document.createTextNode('Directory'));

    const directoryInfo = document.createElement('span');
    directoryInfo.className = 'tool-info';
    directoryInfo.textContent = 'i';
    directoryInfo.title = 'The leading d marks a directory; - marks a regular file.';
    directoryInfo.setAttribute('aria-label', directoryInfo.title);
    directoryInfo.setAttribute('role', 'img');
    directoryInfo.tabIndex = 0;
    directoryLabel.append(directoryInfo);

    const terminalValue = document.createElement('output');
    terminalValue.className = 'chmod-terminal-value';
    terminalValue.setAttribute('aria-label', 'Terminal output');
    terminalValue.textContent = '-rwxrwxrwx';
    terminalOutput.append(terminalLabel, directoryLabel, terminalValue);

    const status = document.createElement('p');
    status.className = 'chmod-simulator-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    const updateTerminalOutput = () => {
      const values = permissions.map((permission) => (
        parseSymbolicPermissions(symbolicFields.get(permission).value)
      ));
      if (values.includes(null)) {
        terminalValue.textContent = '';
        return;
      }

      const marker = directoryCheckbox.checked ? 'd' : '-';
      terminalValue.textContent = marker + values.map(symbolicPermissions).join('');
    };

    directoryCheckbox.addEventListener('change', updateTerminalOutput);

    octalInput.addEventListener('input', () => {
      if (octalInput.value === '') {
        octalInput.setAttribute('aria-invalid', 'false');
        status.textContent = '';
        for (const input of symbolicFields.values()) {
          input.value = '';
          input.setAttribute('aria-invalid', 'false');
        }
        updateTerminalOutput();
        return;
      }

      if (!/^[0-7]{3}$/.test(octalInput.value)) {
        octalInput.setAttribute('aria-invalid', 'true');
        status.textContent = 'Enter exactly three octal digits (0-7).';
        for (const input of symbolicFields.values()) {
          input.value = '';
          input.setAttribute('aria-invalid', 'false');
        }
        updateTerminalOutput();
        return;
      }

      octalInput.setAttribute('aria-invalid', 'false');
      status.textContent = '';
      for (let index = 0; index < permissions.length; index += 1) {
        const permission = permissions[index];
        symbolicFields.get(permission).value = symbolicPermissions(Number(octalInput.value[index]));
        symbolicFields.get(permission).setAttribute('aria-invalid', 'false');
      }
      updateTerminalOutput();
    });

    for (const [permission, input] of symbolicFields) {
      input.addEventListener('input', () => {
        const value = parseSymbolicPermissions(input.value);
        if (value === null) {
          const isEmpty = input.value === '';
          input.setAttribute('aria-invalid', isEmpty ? 'false' : 'true');
          octalInput.value = '';
          octalInput.setAttribute('aria-invalid', 'false');
          status.textContent = isEmpty
            ? ''
            : 'Allowed characters: r (read), w (write), x (execute), or - (no permission).';
          updateTerminalOutput();
          return;
        }

        input.setAttribute('aria-invalid', 'false');
        const octalDigits = permissions.map((entry) => {
          if (entry === permission) return String(value);
          const digit = parseSymbolicPermissions(symbolicFields.get(entry).value);
          return digit === null ? null : String(digit);
        });

        if (octalDigits.includes(null)) {
          octalInput.value = '';
          status.textContent = 'Complete each permission field before updating the octal value.';
          updateTerminalOutput();
          return;
        }

        octalInput.value = octalDigits.join('');
        octalInput.setAttribute('aria-invalid', 'false');
        status.textContent = '';
        updateTerminalOutput();
      });
    }

    el.append(form, terminalOutput, status);
  },
};
