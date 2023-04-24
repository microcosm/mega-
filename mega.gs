function getSpreadsheetConfig() {
  return {
    name: 'mega—',
    id: '15VNTi90yus1Sdzbivx-4LSZyLDCvfrWt9ApbWDOcjMQ'
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
    this.getDashboardConfig(),
    this.getTimelineConfig(),
    this.getMaintainConfig(),
    this.getCurrentAndyConfig(),
    this.getMapConfig()
  ];
}

function getDashboardConfig() {
  const sections = ['titles', 'titlesAboveBelow', 'headers', 'main', 'underMain', 'columnsOutside', 'rowsOutside'];
  const styles = state.style.getFourPanel(sections, 1, 2, 1);
  styles.headers.all.fontSize = PropertyCommand.IGNORE;
  styles.headers.left = { fontSize: 13, beginColumnOffset: 0, numColumns: 1 };
  styles.headers.middle = { fontSize: 9, beginColumnOffset: 1, numColumns: 2 };
  styles.headers.right = { fontSize: 13, beginColumnOffset: 3 };
  styles.contents.left.fontSize = 12;
  styles.contents.leftMiddle.fontSize = 9;
  styles.contents.daysCol = { beginColumnOffset: 2, numColumns: 1, border: state.style.border.thinPanelDivider };
  styles.contents.rightMiddle.fontSize = 9;
  styles.contents.right.fontSize = 9;
  Object.assign(styles.titles.review, state.style.getBlank());

  return {
    name: 'Dashboard',
    features: {
      setSheetStylesBySection: {
        events: [Event.onSheetEdit, Event.onOvernightTimer, Event.onHourTimer],
        styles: styles
      }
    },
    sidebar: {
      heading: {
        type: 'heading',
        title: 'Dashboard'
      },
      guidance: {
        type: 'ul',
        title: 'Guidance',
        texts: ['Edit last review dates on individual sheets', 'Edit warning and overdue days here to set yellow and red coloring']
      }
    }
  };
}

function getTimelineConfig() {
  const sections = ['titlesAbove', 'titles', 'headers', 'generic', 'rowBottomOutside', 'columnsOutside', 'rowMatchers']
  const styles = state.style.getTimeline(sections);
  styles.contents.main.rowHeight = 48;

  let birthdayRange, birthdayRangeValues = null;

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
        beginRow: 4,
        isValidEvent: (event) => {
          const title = event.getTitle();
          return !(title.startsWith('[') && title.endsWith(']'));
        },
        customSetupSheetState: (sheet, data) => {
          const birthdayColumnIndex = 13; // 'M'   ??
          birthdayRange = sheet.sheetRef.getRange(data.beginRow, birthdayColumnIndex, data.numRows, 1);
          birthdayRangeValues = birthdayRange.getValues();
        },
        customProcessWeek: (weekIndex, data) => {
          const birthdays = data.calendarEventsThisWeek
            .filter(calendarEvent => calendarEvent.title.toLowerCase().endsWith(` birthday`) && calendarEvent.title.includes(`'`))
            .map(calendarEvent => calendarEvent.title.split(`'`)[0] + ' (' + calendarEvent.startDateTime.getDayStr() + ')')
            .join(',\n');
          birthdayRangeValues[weekIndex][0] = birthdays.length > 0 ? birthdays + ' *' : '';
        },
        customUpdateSheet: () => {
          birthdayRange.setValues(birthdayRangeValues);
        },
      },
      setSheetStylesBySection: {
        events: [Event.onSheetEdit, Event.onOvernightTimer, Event.onHourTimer],
        styles: styles
      },
      setSheetHiddenRowsBySection: {
        events: [Event.onOvernightTimer],
        section: SectionMarker.generic,
        startRowOffset: -1,
        visibilityMatcher: {
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
      heading: {
        type: 'heading',
        title: 'Timeline'
      },
      review: getReviewConfig(SectionMarker.aboveTitle, 'D'),
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
            visibilityMatcher: {
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
      guidance: {
        type: 'ul',
        title: 'Guidance',
        texts: ['Free type in the colored lanes', 'Cross reference with GCal (left)']
      },
      help: {
        type: 'text',
        title: 'More help',
        text: '1. Use these event typing conventions:<table><tr><td><pre>&nbsp;&nbsp;words?</pre></td><td>dates not yet confirmed</td></tr><tr><td><pre>&nbsp;[words]&nbsp;&nbsp;</pre></td><td>behind-the-scenes, less time-sensitive, or internal/operational</td></tr><tr><td><pre>&nbsp;&nbsp;words*</pre></td><td>holidays, admin or overriding concerns</td></tr></table><br>2. Don\'t edit the grey lane, it is overwritten by Google Calendar events. Either create an event in Google Calendar or invite <a href="mailto:fidt265p24ci7gpcv424d0d5kk@group.calendar.google.com">this email address</a> to a Google Calendar event.<br><br>3. Type into the filter box above to hide items from the grey lane below, or put [brackets] around the event title in GCal.'
      }
    }
  };
}

function getMaintainConfig() {
  const sections = ['titles', 'titlesAboveBelow', 'headers', 'main', 'underMain', 'rowsOutside', 'columnsOutside'];
  const styles = state.style.getFourPanel(sections, 3, 6, 1);
  styles.contents.all.rowHeight = 30;
  styles.contents.all.fontSize = 9;
  styles.contents.doneDate = { beginColumnOffset: 2, numColumns: 1, border: state.style.border.thickPanelDivider };
  styles.titles.between.endColumnOffset = 2;
  styles.titles.review.endColumnOffset = 1;
  styles.titles.after = state.style.getBlank({ endColumnOffset: 0, numColumns: 1, border: state.style.border.empty });
  styles.headers.smaller = { beginColumnOffset: 2, numColumns: 5, fontSize: 9 };

  return {
    name: 'Maintain',
    features: {
      setSheetStylesBySection: {
        events: [Event.onSheetEdit, Event.onOvernightTimer, Event.onHourTimer],
        styles: styles
      },
      orderSheetSections: {
        events: [Event.onOvernightTimer],
        sections: SectionsCategory.MAIN,
        order: [
          { column: 'M', direction: 'ascending' },
          { column: 'I', direction: 'ascending' },
          { column: 'H', direction: 'ascending' },
          { column: 'G', direction: 'descending' },
          { column: 'B', direction: 'ascending' },
          { column: 'C', direction: 'ascending' }
        ]
      }
    },
    sidebar: {
      heading: {
        type: 'heading',
        title: 'Maintain'
      },
      review: getReviewConfig(SectionMarker.title, 'L'),
      arrange: {
        type: 'buttons',
        title: 'Arrange by',
        options: ['Priority', 'Category', 'Season'],
        features: {
          orderSheetSections: {
            events: [Event.onSidebarSubmit],
            sections: SectionsCategory.MAIN,
            priority: 'HIGH_PRIORITY',
            by: {
              priority: [
                { column: 'M', direction: 'ascending' },
                { column: 'I', direction: 'ascending' },
                { column: 'H', direction: 'ascending' },
                { column: 'G', direction: 'descending' },
                { column: 'B', direction: 'ascending' },
                { column: 'C', direction: 'ascending' }
              ],
              category: [
                { column: 'B', direction: 'ascending' },
                { column: 'C', direction: 'ascending' }
              ],
              season: [
                { column: 'L', direction: 'ascending' },
                { column: 'B', direction: 'ascending' },
                { column: 'C', direction: 'ascending' }
              ]
            }
          }
        }
      }
    }
  };
}

function getCurrentAndyConfig() {
  const sections = ['titles', 'titlesAboveBelow', 'hiddenValues', 'headers', 'main', 'done', 'underMain', 'underDone', 'rowsOutside', 'columnsOutside'];
  const styles = state.style.getDefault(sections);
  styles.headers.all.fontSize = PropertyCommand.IGNORE;
  styles.headers.left = { fontSize: 13, beginColumnOffset: 0, numColumns: 3 };
  styles.headers.middle = { fontSize: 9, beginColumnOffset: 3, numColumns: 3 };
  styles.headers.right = { fontSize: 13, beginColumnOffset: 6 };
  styles.contents.all.rowHeight = 36;

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
          data: { valid: [') Priority', ') Following'] }
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
      heading: {
        type: 'heading',
        title: 'Current:Andy'
      },
      review: getReviewConfig(),
      arrange: {
        type: 'buttons',
        title: 'Arrange by',
        options: ['Timing' , 'Category'],
        features: {
          orderSheetSections: {
            events: [Event.onSidebarSubmit],
            sections: SectionsCategory.MAIN,
            priority: 'HIGH_PRIORITY',
            by: {
              timing: [{ column: 'D', direction: 'ascending' }, { column: 'B', direction: 'ascending' }, { column: 'C', direction: 'ascending' }],
              category: [{ column: 'B', direction: 'ascending' }, { column: 'C', direction: 'ascending' }, { column: 'D', direction: 'ascending' }]
            }
          }
        }
      },
      create: {
        type: 'buttons',
        title: 'Create',
        options: ['Priority', 'Following', 'Rolling'],
        features: {
          createSheetItem: {
            events: [Event.onSidebarSubmit],
            priority: 'HIGH_PRIORITY',
            getValues: (option) => {
              const options = {
                'Priority':  '(1) Priority',
                'Following': '(2) Following',
                'Rolling':   '(3) Rolling'
              };
              const timing = options[option];
              return ['', '', timing, '', '', '', ''];
            }
          },
          setSheetStylesBySection: {
            events: [Event.onSidebarSubmit],
            styles: styles
          },
        }
      },
      archive: {
        type: 'buttons',
        title: 'Tidy',
        options: ['Archive Done Items'],
        features: {
          moveSheetRowsToDone: {
            events: [Event.onSidebarSubmit],
            from: SectionMarker.main,
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
      heading: {
        type: 'heading',
        title: 'Map'
      },
      review: getReviewConfig(),
      guidance: {
        type: 'ul',
        title: 'Guidance',
        texts: [`All text fields are free type`, `Don't overthink - should reflect what's on your mind`, `Come here occasionally for a new "grab bag" of items for "Current" sheets`, `Inspired by the idea of <a href='https://www.mindmapping.com/mind-map'>Mind Maps</a>`]
      }
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
