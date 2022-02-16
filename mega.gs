function getSpreadsheetConfig() {
  return {
    name: 'mega—',
    id: '1uNxspHrfm9w-DPH1wfhTNdySxupd7h1RFrWlHCYPVcs'
  };
}

function getValuesSheetConfig() {
  return {
    name: 'Values',
    range: 'B5:C9',
    usersColumnIndex: 0,
    eventsCalendarIdRowIndex: 0,
    eventsCalendarIdColumnIndex: 1
  };
}

function getFeatureSheetConfigs() {
  return [
    this.getTimelineConfig(),
    this.getCurrentAndyConfig(),
    this.getCyclesConfig(),
    this.getMapConfig()
  ];
}

function getTimelineConfig() {
  const sections = ['titlesAbove', 'titles', 'headers', 'generic', 'rowBottomOutside', 'columnsOutside', 'matchers']
  const styles = state.style.getTimeline(sections);

  return {
    name: 'Timeline',
    features: {
      copyCalendarEventsToSheet: {
        events: [Event.onCalendarEdit, Event.onSheetEdit],
        triggerColumns: ['D'],
        fromDate: 'March 29, 2021',
        eventsToNumYearsFromNow: 3,
        dateColumn: 'C',
        eventColumn: 'D',
        filterRow: 2,
        beginRow: 4
      },
      setSheetStylesBySection: {
        events: [Event.onSheetEdit, Event.onOvernightTimer, Event.onHourTimer],
        styles: styles
      },
      setSheetHiddenRowsBySection: {
        events: [Event.onOvernightTimer],
        section: SectionMarker.generic,
        startRowOffset: -1,
        visibleIfMatch: {
          column: 'D',
          text: state.today.getFullYear()
        }
      },
      copySheetValuesBySection: {
        events: [Event.onOvernightTimer],
        beginColumnOffset: 3,
        from: {
          section: SectionMarker.headers,
          copyIfMatch: {
            column: 'D',
            text: state.today.getFullYear()
          }
        },
        to: {
          section: SectionMarker.title
        }
      }
    },
    sidebar: {
      guidance: {
        type: 'text',
        title: 'Timeline',
        text: 'Free type in the colored lanes, and cross reference with Google Calendar events (in the grey lane on the left).'
      },
      years: {
        type: 'buttons',
        title: 'Year to display',
        options: ['2021', '2022', '2023', '2024'],
        features: {
          setSheetHiddenRowsBySection: {
            events: [Event.onSidebarSubmit],
            priority: 'HIGH_PRIORITY',
            section: SectionMarker.generic,
            startRowOffset: -1,
            visibleIfMatch: {
              column: 'D',
              text: PropertyCommand.EVENT_DATA
            }
          },
          copySheetValuesBySection: {
            events: [Event.onSidebarSubmit],
            beginColumnOffset: 3,
            from: {
              section: SectionMarker.headers,
              copyIfMatch: {
                column: 'D',
                text: PropertyCommand.EVENT_DATA
              }
            },
            to: {
              section: SectionMarker.title
            }
          }
        }
      },
      color: {
        type: 'text',
        title: 'Help',
        text: '1. Use these event typing conventions:<table><tr><td><pre>&nbsp;&nbsp;words?</pre></td><td>dates not yet confirmed</td></tr><tr><td><pre>&nbsp;[words]&nbsp;&nbsp;</pre></td><td>behind-the-scenes, less time-sensitive, or internal/operational</td></tr><tr><td><pre>&nbsp;&nbsp;words*</pre></td><td>holidays, admin or overriding concerns</td></tr></table><br>2. Don\'t edit the grey lane, it is overwritten by Google Calendar events. Either create an event in Google Calendar or invite <a href="mailto:jahya.net_55gagu1o5dmvtkvfrhc9k39tls@group.calendar.google.com">this email address</a> to a Google Calendar event.<br><br>3. Type into the filter box above to hide items from the grey lane below.'
      },
      review: getReviewConfig(SectionMarker.aboveTitle, 'D')
    }
  };
}

function getCurrentAndyConfig() {
  const sections = ['titles', 'titlesAboveBelow', 'hiddenValues', 'headers', 'main', 'done', 'underMain', 'underDone', 'rowsOutside', 'columnsOutside'];
  const styles = state.style.getDefault(sections);

  return {
    name: 'Current:Andy',
    features: {
      copySheetEventsToCalendar: {
        events: [Event.onSheetEdit, Event.onOvernightTimer],
        username: 'Andy',
        priority: 'HIGH_PRIORITY',
        sheetIdForUrl: '1370791528',
        workDateLabel: 'Work date',
        eventValidator: {
          method: (row, data, columns) => {
            const timing = row[columns.zeroBasedIndices.timing];
            return data.valid.filter(v => timing.endsWith(v)).length === 1;
          },
          data: { valid: [') Now', ') Next'] }
        },
        widgetCategories: {
          current: {
            name: { column: 'C', rowOffset: -1 },
            columns: {
              noun: 'B',
              verb: 'C',
              timing: 'D',
              workDate: 'E',
              startTime: 'F',
              durationHours: 'G'
            }
          }
        }
      },
      setSheetStylesBySection: {
        events: [Event.onSheetEdit, Event.onOvernightTimer, Event.onHourTimer],
        styles: styles
      },
      setSheetGroupsBySection: {
        events: [Event.onOvernightTimer],
        section: SectionMarker.done,
        numRowsToDisplay: 3
      }
    },
    sidebar: {
      guidance: {
        type: 'text',
        title: 'Usage Guidance',
        text: 'This is guidance on Current sheet. It may be several lines of text, or even rich html? Nunc vulputate mauris imperdiet vehicula faucibus. Curabitur facilisis turpis libero, id volutpat velit aliquet a. Curabitur at euismod mi.'
      },
      review: getReviewConfig(),
      arrange: {
        type: 'buttons',
        title: 'Arrange by',
        options: ['Timing' , 'Work Stream'],
        features: {
          orderSheetMainSection: {
            events: [Event.onSidebarSubmit],
            priority: 'HIGH_PRIORITY',
            by: {
              timing: [{ column: 'D', direction: 'ascending' }, { column: 'B', direction: 'ascending' }],
              workStream: [{ column: 'B', direction: 'ascending' }, { column: 'D', direction: 'ascending' }]
            }
          },
          setSheetValue: {
            events: [Event.onSidebarSubmit],
            update: {
              rowMarker: SectionMarker.hiddenValues,
              column: 'D',
              value: PropertyCommand.EVENT_DATA
            }
          }
        }
      },
      archive: {
        type: 'buttons',
        title: 'Tidy',
        options: ['Archive Done Items'],
        features: {
          moveSheetRowsMainToDone: {
            events: [Event.onSidebarSubmit],
            priority: 'HIGH_PRIORITY',
            match: {
              value: ') DONE',
              column: 'D'
            }
          }
        }
      }
    }
  };
}

function getCyclesConfig() {
  return {
    name: 'Cycles',
    features: {
      copySheetEventsToCalendar: {
        events: [Event.onSheetEdit, Event.onOvernightTimer],
        priority: 'HIGH_PRIORITY',
        workDateLabel: 'Work date',
        sheetIdForUrl: '966806031',
        widgetValidator: {
          method: (widgetName, sheet, data) => {
            if(widgetName === 'Evergreen') return true;
            const seasonStr = sheet.getValue(data.row.cardinalIndex, data.column.cardinalIndex);
            if(widgetName === seasonStr) return true;
            const toSeason = seasonStr.substring(seasonStr.length - data.strLength);
            if(widgetName === toSeason) return true;
            return false; 
          },
          data: { strLength: 6, column: 'O', row: 2 }
        },
        eventValidator: {
          method: (row, data, columns, widgetCategory) => {
            if(widgetCategory !== 'checklist') return true;
            const done = row[columns.zeroBasedIndices.done];
            return done === data.valid;
          },
          data: { valid: 'No' }
        },
        widgetCategories: {
          cyclical: {
            name: {
              column: 'B',
              rowOffset: -1
            },
            columns: {
              noun: 'B',
              verb: 'C',
              name: 'F',
              startTime: 'L',
              durationHours: 'M',
              workDate: 'N'
            }
          },
          checklist: {
            name: {
              column: 'Q',
              rowOffset: -1
            },
            columns: {
              noun: 'Q',
              verb: 'R',
              name: 'U',
              done: 'S',
              workDate: 'V',
              startTime: 'W',
              durationHours: 'X'
            }
          }
        }
      }
    },
    sidebar: {
      guidance: {
        type: 'text',
        title: 'Cycles',
        text: 'Tasks which repeat in cycles. Columns on the left need attention every set number of days, whereas columns on the right occur once per year during season transitions.'
      },
      review: getReviewConfig(SectionMarker.title, 'D')
    }
  };
}

function getMapConfig() {
  const sections = ['titles', 'titlesAboveBelow', 'headers', 'main', 'underMain', 'rowsOutside', 'columnsOutside'];
  let styles = state.style.getTwoPanel(sections, 2);
  styles.contents.all.rowHeight = 70;

  return {
    name: 'Map',
    features: {
      setSheetStylesBySection: {
        events: [Event.onSheetEdit, Event.onOvernightTimer, Event.onHourTimer],
        styles: styles
      }
    },
    sidebar: {
      guidance: {
        type: 'text',
        title: 'Map',
        text: `The 'Map' tab is based loosely around <a href='https://www.mindmapping.com/mind-map'>Mind Maps</a>, in that is is designed to work in harmony the natural functioning of the human mind and get ideas down in a mental tree-like structure.<br><br>All the text fields are free type, no need to worry about whether your edits correctly reference other areas of the dashboard. Just go ahead and start typing in whatever way matches the way things are in your mind.<br><br>There is a hierarchy inherent to mind-mapping but it shouldn't be overthought - arrange things in an intuitive way. Also, there is an inherent prioritization inherent in the positions of branches and twigs, but this doesn't constrain action. The next todo item could right now be on the furthest twig. Instead, arrage things as intuitively as you can.<br><br>The benefit of this tab is it can be referenced when building and updating Todo lists, or to get a fast but comprehensive overview of the set of current concerns.`
      },
      review: getReviewConfig()
    }
  };
}

function getReviewConfig(rowMarker=SectionMarker.title, column=false) {
  return {
    type: 'buttons',
    title: 'Last review',
    options: ['Today'],
    features: {
      setSheetValue: {
        events: [Event.onSidebarSubmit],
        update: {
          rowMarker: rowMarker,
          column: column || PropertyCommand.LAST_COLUMN,
          value: PropertyCommand.CURRENT_DATE
        }
      }
    }
  }
}