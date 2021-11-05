var config = {
  gsheet: {
    name: 'mega—',
    id: '1uNxspHrfm9w-DPH1wfhTNdySxupd7h1RFrWlHCYPVcs'
  },
  toggles: {
    performDataUpdates: true,
    showLogAlert: false
  }
}

function getNameSubstitution(name) {
  return name
    .replace('Either', 'either Julie or Andy')
    .replace('Both', 'both Julie and Andy together');
}

function preProcessSubsheets() {
  state.valuesSubsheet = new ValuesSubsheet(state.spreadsheet, 'Values', { start:'B5', end:'B9' });
  buildTodoSubsheet();
  buildCyclesSubsheet();
}

function buildTodoSubsheet() {
  const range = {
    offsets: {
      row: 2,
      col: 2
    },
    maxRows: 500,
    maxCols: 11
  };

  const sections = {
    todo: {
      columns: {
        label: 2,
        noun: 2,
        verb: 3,
        done: 5,
        name: 7,
        workDate: 8,
        startTime: 9,
        durationHours: 10
      },
      rangeColumns: {},
      hasDoneCol: true,
      hasEvents: true,
      allowFillInTheBlanksDates: true
    }
  };

  const triggerCols = [
    sections.todo.columns.noun,
    sections.todo.columns.verb,
    sections.todo.columns.done,
    sections.todo.columns.name,
    sections.todo.columns.workDate,
    sections.todo.columns.startTime,
    sections.todo.columns.durationHours
  ];

  //state.eventSubsheets.push(new EventSubsheet(state.spreadsheet, 'Todo', '997054615', range, sections, triggerCols));
}

function buildCyclesSubsheet() {
  const range = {
    offsets: {
      row: 2,
      col: 2
    },
    maxRows: 500,
    maxCols: 24
  };

  const sections = {
    global: {
      rows: {
        season: 2
      },
      columns: {
        season: 15
      },
      rangeColumns: {},
      hasDoneCol: false,
      hasEvents: false
    },
    regular: {
      columns: {
        label: 2,
        noun: 2,
        verb: 3,
        lastDone: 4,
        name: 6,
        cycleDays: 7,
        nudgeDays: 11,
        startTime: 12,
        durationHours: 13,
        workDate: 14
      },
      rangeColumns: {},
      hasDoneCol: false,
      hasEvents: true,
      allowFillInTheBlanksDates: false
    },
    checklist: {
      columns: {
        label: 17,
        noun: 17,
        verb: 18,
        done: 19,
        name: 21,
        workDate: 22,
        startTime: 23,
        durationHours: 24
      },
      rangeColumns: {},
      hasDoneCol: true,
      hasEvents: true,
      allowFillInTheBlanksDates: true
    }
  };

  const triggerCols = [
    sections.global.columns.season,
    sections.regular.columns.noun,
    sections.regular.columns.verb,
    sections.regular.columns.lastDone,
    sections.regular.columns.name,
    sections.regular.columns.cycleDays,
    sections.regular.columns.nudgeDays,
    sections.regular.columns.startTime,
    sections.regular.columns.durationHours,
    sections.checklist.columns.noun,
    sections.checklist.columns.verb,
    sections.checklist.columns.done,
    sections.checklist.columns.name,
    sections.checklist.columns.workDate,
    sections.checklist.columns.startTime,
    sections.checklist.columns.durationHours
  ];

  var cyclesSubsheet = new EventSubsheet(state.spreadsheet, 'Cycles', '966806031', range, sections, triggerCols);
  cyclesSubsheet.setSeasonCell(sections.global.columns.season, sections.global.rows.season);
  state.eventSubsheets.push(cyclesSubsheet);
}

function postProcessSubsheets() {
  var seasonStringLength = 6;
  state.validEventCategories = ['Todo', 'Evergreen'];
  state.eventSubsheets.forEach(function(subsheet) {
    if(subsheet.hasSeasonCell) {
      var seasonStr = state.rangeValues[subsheet.name][subsheet.getSeasonRangeRow()][subsheet.getSeasonRangeCol()];
      var fromSeason = seasonStr.substring(0, seasonStringLength);
      var toSeason = seasonStr.substring(seasonStr.length - seasonStringLength);
      state.validEventCategories.push(toSeason);
      if(toSeason != fromSeason){
        state.validEventCategories.push(seasonStr);
      }
    }
  });
}

function isSpecificValidEventData(row, section) {
  return true;
}