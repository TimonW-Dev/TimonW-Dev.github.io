const entries = [
  ['A', 'Anna', { letter: 'Ä', word: 'Äsch (Aesch)' }],
  ['B', 'Berta'],
  ['C', 'Cäsar, Charly'],
  ['D', 'Daniel'],
  ['E', 'Emil'],
  ['F', 'Friedrich'],
  ['G', 'Gustav'],
  ['H', 'Heinrich'],
  ['I', 'Ida'],
  ['J', 'Jakob'],
  ['K', 'Kaiser'],
  ['L', 'Leopold'],
  ['M', 'Marie'],
  ['N', 'Niklaus'],
  ['O', 'Otto', { letter: 'Ö', word: 'Örlikon (Oerlikon)' }],
  ['P', 'Peter'],
  ['Q', 'Quasi'],
  ['R', 'Rosa'],
  ['S', 'Sophie'],
  ['T', 'Theodor'],
  ['U', 'Ulrich', { letter: 'Ü', word: 'Übermut' }],
  ['V', 'Viktor'],
  ['W', 'Wilhelm'],
  ['X', 'Xaver'],
  ['Y', 'Yverdon'],
  ['Z', 'Zürich'],
];

function renderAlphabet(el, alphabet) {
  const grid = document.createElement('div');
  grid.className = 'phonetic-grid';

  const midpoint = Math.ceil(alphabet.length / 2);
  for (const group of [alphabet.slice(0, midpoint), alphabet.slice(midpoint)]) {
    const column = document.createElement('ul');
    column.className = 'phonetic-column';

    for (const [letter, word, variant] of group) {
      const row = document.createElement('li');
      row.className = 'phonetic-entry';

      const character = document.createElement('span');
      character.className = 'phonetic-letter';
      character.textContent = letter;

      const spelling = document.createElement('span');
      spelling.className = 'phonetic-word';
      spelling.textContent = word;

      if (variant) {
        const info = document.createElement('span');
        info.className = 'tool-info';
        info.textContent = 'i';
        info.title = `${variant.letter} — ${variant.word}`;
        info.setAttribute('aria-label', `${variant.letter}: ${variant.word}`);
        info.setAttribute('role', 'img');
        info.tabIndex = 0;
        spelling.append(info);
      }

      row.append(character, spelling);
      column.append(row);
    }

    grid.append(column);
  }

  el.append(grid);
}

export default {
  title: 'Swiss Telephone Alphabet',
  description: 'Browse the Swiss telephone alphabet from A to Z.',
  tags: ['swiss', 'telephone', 'phonetic', 'alphabet', 'spelling'],
  render(el) {
    renderAlphabet(el, entries);
  },
};
