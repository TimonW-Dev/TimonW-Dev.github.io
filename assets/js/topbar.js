const STORAGE_KEY = 'sas-clock';
const defaults = { date: true, time: true, seconds: true };
const dateElement = document.getElementById('site-date');
const timeElement = document.getElementById('site-time');
const separator = document.getElementById('clock-separator');
const dateToggle = document.getElementById('show-date');
const timeToggle = document.getElementById('show-time');
const secondsToggle = document.getElementById('show-seconds');

if (dateElement && timeElement && separator && dateToggle && timeToggle && secondsToggle) {
  let settings = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') {
      settings = {
        date: typeof saved.date === 'boolean' ? saved.date : defaults.date,
        time: typeof saved.time === 'boolean' ? saved.time : defaults.time,
        seconds: typeof saved.seconds === 'boolean' ? saved.seconds : defaults.seconds,
      };
    }
  } catch {
    // Keep defaults when storage is unavailable or invalid.
  }

  const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
  const timeFormatters = {
    withSeconds: new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }),
    withoutSeconds: new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }),
  };

  function updateClock() {
    const now = new Date();
    dateElement.hidden = !settings.date;
    timeElement.hidden = !settings.time;
    separator.hidden = !settings.date || !settings.time;
    dateToggle.checked = settings.date;
    timeToggle.checked = settings.time;
    secondsToggle.checked = settings.seconds;

    dateElement.dateTime = now.toISOString().slice(0, 10);
    dateElement.textContent = dateFormatter.format(now);

    timeElement.dateTime = now.toISOString();
    timeElement.textContent = timeFormatters[settings.seconds ? 'withSeconds' : 'withoutSeconds'].format(now);
  }

  function saveSettings() {
    settings = {
      date: dateToggle.checked,
      time: timeToggle.checked,
      seconds: secondsToggle.checked,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Settings still apply for this page when storage is unavailable.
    }
    updateClock();
  }

  dateToggle.addEventListener('change', saveSettings);
  timeToggle.addEventListener('change', saveSettings);
  secondsToggle.addEventListener('change', saveSettings);
  updateClock();
  window.setInterval(updateClock, 1000);
}
