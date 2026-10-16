const entries = [
  ['A', 'Alpha'],
  ['B', 'Bravo'],
  ['C', 'Charlie'],
  ['D', 'Delta'],
  ['E', 'Echo'],
  ['F', 'Foxtrot'],
  ['G', 'Golf'],
  ['H', 'Hotel'],
  ['I', 'India'],
  ['J', 'Juliett'],
  ['K', 'Kilo'],
  ['L', 'Lima'],
  ['M', 'Mike'],
  ['N', 'November'],
  ['O', 'Oscar'],
  ['P', 'Papa'],
  ['Q', 'Quebec'],
  ['R', 'Romeo'],
  ['S', 'Sierra'],
  ['T', 'Tango'],
  ['U', 'Uniform'],
  ['V', 'Victor'],
  ['W', 'Whiskey'],
  ['X', 'X-Ray'],
  ['Y', 'Yankee'],
  ['Z', 'Zulu'],
];

function renderAlphabet(el, alphabet) {
  const grid = document.createElement('div');
  grid.className = 'phonetic-grid';
  const midpoint = Math.ceil(alphabet.length / 2);

  for (const group of [alphabet.slice(0, midpoint), alphabet.slice(midpoint)]) {
    const column = document.createElement('ul');
    column.className = 'phonetic-column';

    for (const [letter, word] of group) {
      const row = document.createElement('li');
      row.className = 'phonetic-entry';

      const character = document.createElement('span');
      character.className = 'phonetic-letter';
      character.textContent = letter;

      const spelling = document.createElement('span');
      spelling.className = 'phonetic-word';
      spelling.textContent = word;

      row.append(character, spelling);
      column.append(row);
    }

    grid.append(column);
  }

  el.append(grid);
}

export default {
  title: 'NATO Phonetic Alphabet',
  description: 'Browse the NATO phonetic alphabet from A to Z.',
  tags: ['nato', 'phonetic', 'alphabet', 'spelling'],
  render(el) {
    renderAlphabet(el, entries);
  },
};
