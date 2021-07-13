var config = {
  gsheet: {
    name: 'mega—',
    id: '1uNxspHrfm9w-DPH1wfhTNdySxupd7h1RFrWlHCYPVcs'
  } 
}

function buildSubsheets() {
  state.personValuesSubsheet = new PersonValuesSubsheet(state.spreadsheet, { start:'K2', end:'K6' }, '(dropdowns)');
}

function getNameSubstitution(name) {
  return name
    .replace('Either', 'either Julie or Andy')
    .replace('Both', 'both Julie and Andy together');
}