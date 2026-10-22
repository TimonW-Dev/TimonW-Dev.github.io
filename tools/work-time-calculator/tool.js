const TARGET_KEY = 'sas-work-time-daily-target-v1';
const MAX_PERIODS = 5;
let instanceCount = 0;

function timeToMinutes(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainder = String(minutes % 60).padStart(2, '0');
  return `${hours}:${remainder}`;
}

function formatDecimal(minutes) {
  return (minutes / 60).toFixed(2);
}

function formatTimeInput(input) {
  const rawValue = input.value;
  const caret = input.selectionStart ?? rawValue.length;
  if (rawValue.includes(':')) {
    const colonIndex = rawValue.indexOf(':');
    const hours = rawValue.slice(0, colonIndex).replace(/\D/g, '').slice(0, 2);
    const minutes = rawValue.slice(colonIndex + 1).replace(/\D/g, '').slice(0, 2);
    const paddedHours = hours.length === 1 && minutes.length === 2 ? `0${hours}` : hours;
    input.value = `${paddedHours}:${minutes}`;
    const formattedCaret = caret > colonIndex
      ? paddedHours.length + 1 + rawValue.slice(colonIndex + 1, caret).replace(/\D/g, '').length
      : rawValue.slice(0, caret).replace(/\D/g, '').length + (paddedHours.length > hours.length && caret > 0 ? 1 : 0);
    input.setSelectionRange(Math.min(input.value.length, formattedCaret), Math.min(input.value.length, formattedCaret));
    return;
  }
  const digitsBeforeCaret = rawValue.slice(0, caret).replace(/\D/g, '').length;
  const digits = rawValue.replace(/\D/g, '').slice(0, 4);
  input.value = digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
  const formattedCaret = Math.min(input.value.length, digitsBeforeCaret + (digitsBeforeCaret > 2 ? 1 : 0));
  input.setSelectionRange(formattedCaret, formattedCaret);
}

function createLabeledInput(labelText, id, type, value = '') {
  const label = document.createElement('label');
  label.className = 'work-time-input';
  label.htmlFor = id;
  label.append(document.createTextNode(labelText));

  const input = document.createElement('input');
  input.id = id;
  input.type = type;
  input.setAttribute('aria-label', labelText);
  if (value) input.value = value;
  label.append(input);
  return { label, input };
}

export default {
  title: 'Working Time Calculator',
  description: 'So, how much longer do I actually have to work today?',
  tags: ['work time', 'working hours', 'time tracking', 'timesheet', 'break', 'daily target'],
  render(el) {
    const instanceId = ++instanceCount;
    const form = document.createElement('div');
    form.className = 'work-time-form';
    const targetField = createLabeledInput('Daily target (24-hour HH:MM)', `work-time-target-${instanceId}`, 'text');
    targetField.input.inputMode = 'numeric';
    targetField.input.placeholder = 'HH:MM';
    targetField.input.maxLength = 5;
    targetField.input.autocomplete = 'off';

    let storageMessage = '';
    try {
      const savedTarget = localStorage.getItem(TARGET_KEY);
      if (savedTarget !== null) {
        if (timeToMinutes(savedTarget) === null) {
          storageMessage = 'The saved daily target is invalid; enter a new target.';
        } else {
          targetField.input.value = savedTarget;
        }
      }
    } catch {
      storageMessage = 'Your browser blocked local storage; the daily target will not be remembered.';
    }

    const breakLabel = document.createElement('label');
    breakLabel.className = 'work-time-break';
    const breakInput = document.createElement('input');
    breakInput.type = 'checkbox';
    breakInput.setAttribute('aria-label', 'Deduct a 30-minute break');
    breakLabel.append(breakInput, document.createTextNode(' Deduct 30 min break'));

    const periods = document.createElement('div');
    periods.className = 'work-time-periods';
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'work-time-add work-time-button';
    addButton.textContent = 'Add period';
    const actions = document.createElement('div');
    actions.className = 'work-time-actions';

    const results = document.createElement('div');
    results.className = 'work-time-results';
    results.setAttribute('aria-live', 'polite');
    results.setAttribute('aria-atomic', 'true');
    const resultItems = [];
    for (const [label, className] of [['Worked', 'work-time-worked'], ['Remaining', 'work-time-remaining']]) {
      const item = document.createElement('div');
      item.className = `work-time-result ${className}`;
      const heading = document.createElement('strong');
      heading.textContent = label;
      const sexagesimal = document.createElement('p');
      sexagesimal.className = 'work-time-sexagesimal';
      const decimal = document.createElement('p');
      decimal.className = 'work-time-decimal';
      item.append(heading, sexagesimal, decimal);
      results.append(item);
      resultItems.push({ item, heading, sexagesimal, decimal });
    }
    const status = document.createElement('p');
    status.className = 'work-time-status';
    status.setAttribute('role', 'status');

    const entries = [];
    const addPeriod = () => {
      const index = entries.length;
      const row = document.createElement('fieldset');
      row.className = 'work-time-period';
      row.setAttribute('aria-label', `Time period ${index + 1}`);
      const legend = document.createElement('legend');
      const legendTitle = document.createElement('span');
      legendTitle.textContent = `Time period ${index + 1}`;
      const clockIn = createLabeledInput('Clock in (24-hour HH:MM)', `work-time-${instanceId}-in-${index + 1}`, 'text');
      const clockOut = createLabeledInput('Clock out (24-hour HH:MM)', `work-time-${instanceId}-out-${index + 1}`, 'text');
      for (const input of [clockIn.input, clockOut.input]) {
        input.inputMode = 'numeric';
        input.placeholder = 'HH:MM';
        input.maxLength = 5;
        input.autocomplete = 'off';
      }
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'work-time-remove work-time-button';
      removeButton.textContent = 'Remove';
      removeButton.setAttribute('aria-label', `Remove time period ${index + 1}`);
      legend.append(legendTitle, removeButton);
      row.append(legend, clockIn.label, clockOut.label);
      periods.append(row);
      const entry = {
        row,
        legendTitle,
        clockIn: clockIn.input,
        clockInLabel: clockIn.label,
        clockOut: clockOut.input,
        clockOutLabel: clockOut.label,
      };
      entries.push(entry);
      clockIn.input.addEventListener('input', () => {
        formatTimeInput(clockIn.input);
        update();
      });
      clockOut.input.addEventListener('input', () => {
        formatTimeInput(clockOut.input);
        update();
      });
      removeButton.addEventListener('click', () => {
        entry.row.remove();
        entries.splice(entries.indexOf(entry), 1);
        renderPeriods();
        update();
      });
      renderPeriods();
      update();
    };

    const renderPeriods = () => {
      entries.forEach((entry, index) => {
        entry.legendTitle.textContent = `Time period ${index + 1}`;
        entry.row.setAttribute('aria-label', `Time period ${index + 1}`);
        entry.clockIn.id = `work-time-${instanceId}-in-${index + 1}`;
        entry.clockInLabel.htmlFor = entry.clockIn.id;
        entry.clockIn.setAttribute('aria-label', `Clock in, time period ${index + 1}`);
        entry.clockOut.id = `work-time-${instanceId}-out-${index + 1}`;
        entry.clockOutLabel.htmlFor = entry.clockOut.id;
        entry.clockOut.setAttribute('aria-label', `Clock out, time period ${index + 1}`);
        entry.row.querySelector('button').setAttribute('aria-label', `Remove time period ${index + 1}`);
      });
      addButton.disabled = entries.length >= MAX_PERIODS;
      addButton.textContent = entries.length >= MAX_PERIODS ? '5 periods max' : 'Add period';
    };

    function update() {
      const targetMinutes = timeToMinutes(targetField.input.value);
      let totalMinutes = 0;
      let error = '';
      const openPeriods = [];
      let futureOpenPeriod = false;

      for (const [index, entry] of entries.entries()) {
        const startValue = entry.clockIn.value;
        const endValue = entry.clockOut.value;
        if (!startValue && !endValue) continue;
        const start = timeToMinutes(startValue);
        const end = timeToMinutes(endValue);
        if (startValue && start === null) {
          error = `Enter clock-in as 24-hour HH:MM (00:00–23:59) for time period ${index + 1}.`;
          break;
        }
        if (endValue && end === null) {
          error = `Enter clock-out as 24-hour HH:MM (00:00–23:59) for time period ${index + 1}.`;
          break;
        }
        if (!startValue && endValue) {
          error = `Enter a clock-in time for time period ${index + 1}.`;
          break;
        }
        if (!startValue) continue;
        if (!endValue) {
          openPeriods.push({ index, start });
          continue;
        }
        totalMinutes += end < start ? end + 1440 - start : end - start;
      }

      if (!error && openPeriods.length > 1) {
        error = 'Only one time period can be in progress at a time.';
      } else if (!error && openPeriods.length === 1) {
        const openPeriod = openPeriods[0];
        if (openPeriod.index !== entries.findLastIndex((entry) => entry.clockIn.value || entry.clockOut.value)) {
          error = 'Finish the open time period before adding another one.';
        } else {
          const now = new Date();
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          if (openPeriod.start > currentMinutes) {
            futureOpenPeriod = true;
          } else {
            totalMinutes += currentMinutes - openPeriod.start;
          }
        }
      }

      const targetInvalid = targetField.input.value !== '' && targetMinutes === null;
      if (!error && targetInvalid) error = 'Enter the daily target as 24-hour HH:MM (00:00–23:59).';
      status.textContent = error || storageMessage;
      for (const entry of entries) {
        const invalidClockIn = error.includes('clock-in') && error.includes(`time period ${entries.indexOf(entry) + 1}`);
        const invalidClockOut = error.includes('clock-out') && error.includes(`time period ${entries.indexOf(entry) + 1}`);
        entry.clockIn.setAttribute('aria-invalid', invalidClockIn ? 'true' : 'false');
        entry.clockOut.setAttribute('aria-invalid', invalidClockOut ? 'true' : 'false');
      }
      targetField.input.setAttribute('aria-invalid', targetInvalid ? 'true' : 'false');
      if (error) {
        for (const result of resultItems) {
          result.sexagesimal.textContent = '—';
          result.decimal.textContent = '';
        }
        resultItems[1].item.dataset.state = '';
        return;
      }

      const breakMinutes = breakInput.checked && totalMinutes > 0 ? 30 : 0;
      const workedMinutes = Math.max(0, totalMinutes - breakMinutes);
      resultItems[0].sexagesimal.textContent = `${formatTime(workedMinutes)} h`;
      resultItems[0].decimal.textContent = `${formatDecimal(workedMinutes)} decimal hours`;
      if (targetMinutes === null) {
        resultItems[1].sexagesimal.textContent = '—';
        resultItems[1].decimal.textContent = '';
        resultItems[1].item.dataset.state = '';
        status.textContent = storageMessage || 'Enter your daily target to calculate your remaining time.';
        return;
      }

      const difference = targetMinutes - workedMinutes;
      const absoluteDifference = Math.abs(difference);
      const isOvertime = difference < 0;
      const hasWorkTime = entries.some((entry) => entry.clockIn.value !== '' || entry.clockOut.value !== '');
      const suffix = isOvertime ? 'overtime' : 'remaining';
      resultItems[1].heading.textContent = isOvertime ? 'Overtime' : 'Remaining';
      resultItems[1].sexagesimal.textContent = `${formatTime(absoluteDifference)} h`;
      resultItems[1].decimal.textContent = `${formatDecimal(absoluteDifference)} decimal hours ${suffix}`;
      resultItems[1].item.dataset.state = difference > 0 && hasWorkTime ? 'remaining' : difference > 0 ? '' : 'complete';
      if (!status.textContent && openPeriods.length === 1 && !futureOpenPeriod) {
        status.textContent = 'Your open time period is counted up to the current time.';
      }
    }

    addButton.addEventListener('click', addPeriod);
    targetField.input.addEventListener('input', () => {
      formatTimeInput(targetField.input);
      try {
        if (targetField.input.value === '') {
          localStorage.removeItem(TARGET_KEY);
        } else {
          localStorage.setItem(TARGET_KEY, targetField.input.value);
        }
        storageMessage = '';
      } catch {
        storageMessage = 'Your browser blocked local storage; the daily target could not be updated.';
      }
      update();
    });
    breakInput.addEventListener('change', update);
    actions.append(addButton, breakLabel);
    form.append(targetField.label, periods, actions, results, status);
    el.append(form);
    addPeriod();
    window.setInterval(() => {
      if (entries.some((entry) => entry.clockIn.value && !entry.clockOut.value)) update();
    }, 60_000);
  },
};
