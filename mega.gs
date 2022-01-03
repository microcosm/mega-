var config = {
  gsheet: {
    name: 'mega—',
    id: '1uNxspHrfm9w-DPH1wfhTNdySxupd7h1RFrWlHCYPVcs'
  },
  toggles: {
    performDataUpdates: true,
    logAllEvents: false,
    showLogAlert: false
  }
}

function getNameSubstitution(name) {
  return name
    .replace('Either', 'either Julie or Andy')
    .replace('Both', 'both Julie and Andy together');
}

function setUpSheets() {
  setUpValuesSheet();
  setUpTodoSheet();
  setUpCyclesSheet();
}

function setUpValuesSheet() {
  registerValuesSheet({
    name: 'Values',
    range: 'B5:B9',
    columns: {
      users: 0
    }
  });
}

function setUpTodoSheet() {
  const sheetConfig = {
    name: 'Todo',
    id: '997054615',
    widgets: {
      todo: {
        columns: {
          label: 1,
          noun: 1,
          verb: 2,
          done: 4,
          name: 6,
          workDate: 7,
          startTime: 8,
          durationHours: 9
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

  //registerFeatureSheet(state.features.updateCalendarFromSpreadsheet, sheetConfig);
}


function setUpCyclesSheet() {
  const sheetConfig = {
    name: 'Cycles',
    id: '966806031',
    widgets: {
      cyclical: {
        columns: {
          label: 1,
          noun: 1,
          verb: 2,
          lastDone: 3,
          name: 5,
          cycleDays: 6,
          nudgeDays: 10,
          startTime: 11,
          durationHours: 12,
          workDate: 13
        },
        hasEvents: true
      },
      checklist: {
        columns: {
          label: 16,
          noun: 16,
          verb: 17,
          done: 18,
          name: 20,
          workDate: 21,
          startTime: 22,
          durationHours: 23
        },
        hasDoneCol: true,
        hasEvents: true,
        allowFillInTheBlanksDates: true
      }
    },

    scriptResponsiveWidgetNames: ['Evergreen']
  };

  const seasonCol = 14;
  const widgets = sheetConfig.widgets;

  sheetConfig.triggerCols = [
    seasonCol,

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

  var cyclesSheet = registerFeatureSheet(state.features.updateCalendarFromSpreadsheet, sheetConfig);
  addDynamicSeasonWidgetsFromDropdown(cyclesSheet);
}

function addDynamicSeasonWidgetsFromDropdown(sheet) {
  var seasonStr = sheet.sheetRef.getRange('O2').getValue();
  var seasonStringLength = 6;
  var fromSeason = seasonStr.substring(0, seasonStringLength);
  var toSeason = seasonStr.substring(seasonStr.length - seasonStringLength);

  sheet.config.scriptResponsiveWidgetNames.push(toSeason);
  if(toSeason != fromSeason){
    sheet.config.scriptResponsiveWidgetNames.push(seasonStr);
  }
}