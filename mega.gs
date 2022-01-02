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
  state.valuesSheet = new ValuesSheet({ name: 'Values', scriptRange: { start:'B5', end:'B9' }});
  buildTodoSheet();
  buildCyclesSheet();
}

function buildTodoSheet() {
  const sheetConfig = {
    name: 'Todo',
    id: '997054615',
    scriptRange: {
      offsets: {
        row: 2,
        col: 2
      },
      maxRows: 500,
      maxCols: 11
    },

    widgets: {
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
        hasDoneCol: true,
        hasEvents: true,
        allowFillInTheBlanksDates: true
      }
    },

    scriptResponsiveWidgetNames: ['Todo']
  };

  const widgets = sheetConfig.widgets;
  sheetConfig.triggerCols = [
    widgets.todo.columns.noun,
    widgets.todo.columns.verb,
    widgets.todo.columns.done,
    widgets.todo.columns.name,
    widgets.todo.columns.workDate,
    widgets.todo.columns.startTime,
    widgets.todo.columns.durationHours
  ];

  //var todoSheet = new ScriptSheet(sheetConfig);
  //registerSheetForFeature(todoSheet, state.features.updateCalendarFromSpreadsheet);
}


function buildCyclesSheet() {
  const sheetConfig = {
    name: 'Cycles',
    id: '966806031',
    scriptRange: {
      offsets: {
        row: 2,
        col: 2
      },
      maxRows: 500,
      maxCols: 24
    },

    widgets: {
      seasonDropDown: {
        rows: {
          season: 2
        },
        columns: {
          season: 15
        },
        hasDoneCol: false,
        hasEvents: false
      },
      cyclical: {
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
        hasDoneCol: true,
        hasEvents: true,
        allowFillInTheBlanksDates: true
      }
    },

    scriptResponsiveWidgetNames: ['Evergreen']
  };

  const widgets = sheetConfig.widgets;

  sheetConfig.triggerCols = [
    widgets.seasonDropDown.columns.season,

    widgets.cyclical.columns.noun,
    widgets.cyclical.columns.verb,
    widgets.cyclical.columns.lastDone,
    widgets.cyclical.columns.name,
    widgets.cyclical.columns.cycleDays,
    widgets.cyclical.columns.nudgeDays,
    widgets.cyclical.columns.startTime,
    widgets.cyclical.columns.durationHours,

    widgets.checklist.columns.noun,
    widgets.checklist.columns.verb,
    widgets.checklist.columns.done,
    widgets.checklist.columns.name,
    widgets.checklist.columns.workDate,
    widgets.checklist.columns.startTime,
    widgets.checklist.columns.durationHours
  ];

  var cyclesSheet = new ScriptSheet(sheetConfig);
  configureSeasonalWidgetsForScriptResponse(sheetConfig, cyclesSheet);
  registerSheetForFeature(cyclesSheet, state.features.updateCalendarFromSpreadsheet);
}

function configureSeasonalWidgetsForScriptResponse(sheetConfig, sheet) {
  var seasonStr = sheet.sheetRef.getRange('O2').getValue();
  var seasonStringLength = 6;
  var fromSeason = seasonStr.substring(0, seasonStringLength);
  var toSeason = seasonStr.substring(seasonStr.length - seasonStringLength);

  sheetConfig.scriptResponsiveWidgetNames.push(toSeason);
  if(toSeason != fromSeason){
    sheetConfig.scriptResponsiveWidgetNames.push(seasonStr);
  }
}