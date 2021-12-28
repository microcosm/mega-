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

function preProcessSheets() {
  state.valuesSheet = new ValuesSheet(state.spreadsheet, 'Values', { start:'B5', end:'B9' });
  buildTodoSheet();
  buildCyclesSheet();
}

function buildTodoSheet() {
  const scriptRange = {
    offsets: {
      row: 2,
      col: 2
    },
    maxRows: 500,
    maxCols: 11
  };

  const widgets = {
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
      scriptRangeColumns: {},
      hasDoneCol: true,
      hasCalendarEvents: true,
      allowFillInTheBlanksDates: true
    }
  };

  const triggerCols = [
    widgets.todo.columns.noun,
    widgets.todo.columns.verb,
    widgets.todo.columns.done,
    widgets.todo.columns.name,
    widgets.todo.columns.workDate,
    widgets.todo.columns.startTime,
    widgets.todo.columns.durationHours
  ];

  //state.scriptSheets.push(new EventSheet(state.spreadsheet, 'Todo', '997054615', scriptRange, widgets, triggerCols));
  //state.scriptResponsiveWidgets.push('Todo');
}


function buildCyclesSheet() {
  const scriptRange = {
    offsets: {
      row: 2,
      col: 2
    },
    maxRows: 500,
    maxCols: 24
  };

  const widgets = {
    global: {
      rows: {
        season: 2
      },
      columns: {
        season: 15
      },
      scriptRangeColumns: {},
      hasDoneCol: false,
      hasCalendarEvents: false
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
      scriptRangeColumns: {},
      hasDoneCol: false,
      hasCalendarEvents: true,
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
      scriptRangeColumns: {},
      hasDoneCol: true,
      hasCalendarEvents: true,
      allowFillInTheBlanksDates: true
    }
  };

  const triggerCols = [
    widgets.global.columns.season,
    widgets.regular.columns.noun,
    widgets.regular.columns.verb,
    widgets.regular.columns.lastDone,
    widgets.regular.columns.name,
    widgets.regular.columns.cycleDays,
    widgets.regular.columns.nudgeDays,
    widgets.regular.columns.startTime,
    widgets.regular.columns.durationHours,
    widgets.checklist.columns.noun,
    widgets.checklist.columns.verb,
    widgets.checklist.columns.done,
    widgets.checklist.columns.name,
    widgets.checklist.columns.workDate,
    widgets.checklist.columns.startTime,
    widgets.checklist.columns.durationHours
  ];

  var cyclesSheet = new EventSheet(state.spreadsheet, 'Cycles', '966806031', scriptRange, widgets, triggerCols);
  cyclesSheet.setSeasonCell(widgets.global.columns.season, widgets.global.rows.season);
  state.scriptSheets.push(cyclesSheet);

  state.scriptResponsiveWidgets.push('Evergreen');
  registerSeasonalWidgetsForScriptResponse(cyclesSheet);  
}

function registerSeasonalWidgetsForScriptResponse(sheet) {
  var seasonStr = sheet.getSeasonStr();
  var seasonStringLength = 6;
  var fromSeason = seasonStr.substring(0, seasonStringLength);
  var toSeason = seasonStr.substring(seasonStr.length - seasonStringLength);

  state.scriptResponsiveWidgets.push(toSeason);
  if(toSeason != fromSeason){
    state.scriptResponsiveWidgets.push(seasonStr);
  }
}

function isSpecificValidCalendarEvent(row, widget) {
  return true;
}