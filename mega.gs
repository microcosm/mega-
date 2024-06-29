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
    this.getSuppliesConfig(),
    this.getOrdersConfig(),
    this.getMaintenanceDashboardConfig(),
    this.getDefaultMaintenanceConfig('ID'),
    this.getDefaultMaintenanceConfig('Online'),
    this.getDefaultMaintenanceConfig('Cars'),
    this.getDefaultMaintenanceConfig('Uhura'),
    this.getDefaultMaintenanceConfig('Home'),
    this.getDefaultMaintenanceConfig('Andy'),
    this.getDefaultMaintenanceConfig('Aspire')
  ];
}

function getSuppliesConfig() {
  const sections = ['titles', 'titlesAboveBelow', 'headers', 'main', 'underMain', 'columnsOutside', 'rowsOutside'];
  const styles = state.style.getFourPanel(sections, 1, 2, 1);
  styles.contents.all.rowHeight = 23;
  styles.contents.left.borders = [{ top: null, left: null, bottom: null, right: true, vertical: null, horizontal: null, color: '#999999', style: 'SOLID_MEDIUM' }];
  styles.contents.leftMiddle.borders = [{ top: null, left: null, bottom: null, right: true, vertical: null, horizontal: null, color: '#999999', style: 'SOLID_MEDIUM' }];
  styles.contents.rightMiddle.borders = [{ top: null, left: null, bottom: null, right: true, vertical: null, horizontal: null, color: '#999999', style: 'SOLID_MEDIUM' }];

  return {
    name: 'Supplies',
    features: {
      setSheetStylesBySection: {
        events: [Event.onSheetEdit, Event.onOvernightTimer, Event.onHourTimer],
        styles: styles
      },
      orderSheetSections: {
        events: [Event.onOvernightTimer],
        sections: SectionsCategory.MAIN,
        order: [
          { column: 'B', direction: 'ascending' },
          { column: 'E', direction: 'ascending' },
          { column: 'D', direction: 'ascending' }
        ]
      }
    },
    sidebar: {
      heading: {
        type: 'heading',
        title: 'Supplies'
      },
      arrange: {
        type: 'buttons',
        title: 'Arrange by',
        options: ['Area'],
        features: {
          orderSheetSections: {
            events: [Event.onSidebarSubmit],
            sections: SectionsCategory.MAIN,
            priority: 'HIGH_PRIORITY',
            by: {
              area: [
                { column: 'B', direction: 'ascending' },
                { column: 'E', direction: 'ascending' },
                { column: 'D', direction: 'ascending' }
              ]
            }
          }
        }
      }
    }
  };
}

function getOrdersConfig() {
  const sections = ['titles', 'titlesAboveBelow', 'headers', 'main', 'underMain', 'columnsOutside', 'rowsOutside'];
  const styles = state.style.getDefault(sections);
  styles.contents.all.rowHeight = 23;

  return {
    name: 'Orders',
    features: {
      setSheetStylesBySection: {
        events: [Event.onSheetEdit, Event.onOvernightTimer, Event.onHourTimer],
        styles: styles
      }
    },
    sidebar: {
      heading: {
        type: 'heading',
        title: 'Orders'
      }
    }
  };
}

function getMaintenanceDashboardConfig() {
  const sections = ['titles', 'titlesAboveBelow', 'headers', 'main', 'underMain', 'columnsOutside', 'rowsOutside'];
  const styles = state.style.getFourPanel(sections, 1, 1, 1);
  styles.contents.all.rowHeight = 24;
  styles.contents.left.fontSize = 12;
  styles.contents.left.borders = [{ top: null, left: null, bottom: null, right: true, vertical: null, horizontal: null, color: '#999999', style: 'SOLID_MEDIUM' }];
  styles.contents.leftMiddle.borders = [{ top: null, left: null, bottom: null, right: false, vertical: null, horizontal: null, color: '#FFFFFF', style: 'SOLID' }];
  styles.contents.leftMiddle.fontSize = 9;
  styles.contents.rightMiddle.borders = [{ top: null, left: false, bottom: null, right: true, vertical: null, horizontal: null, color: '#999999', style: 'SOLID_MEDIUM' }];
  styles.contents.rightMiddle.fontSize = 9;
  styles.contents.right.borders = [{ top: null, left: null, bottom: null, right: null, vertical: null, horizontal: false, color: '#999999', style: 'SOLID_MEDIUM' }];
  styles.contents.right.fontSize = 9;

  return {
    name: 'Maintenance',
    features: {
      setSheetStylesBySection: {
        events: [Event.onSheetEdit, Event.onOvernightTimer, Event.onHourTimer],
        styles: styles
      }
    },
    sidebar: {
      heading: {
        type: 'heading',
        title: 'Maintenance'
      }
    }
  };
}

function getDefaultMaintenanceConfig(sheetName) {
  const sections = ['titles', 'titlesAboveBelow', 'headers', 'main', 'underMain', 'rowsOutside', 'columnsOutside'];
  const styles = state.style.getFourPanel(sections, 3, 6, 1);
  styles.contents.all.rowHeight = 30;
  styles.contents.all.fontSize = 9;
  styles.contents.doneDate = { beginColumnOffset: 2, numColumns: 1, border: state.style.border.thickPanelDivider };
  styles.headers.smaller = { beginColumnOffset: 2, numColumns: 5, fontSize: 9 };

  return {
    name: sheetName,
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
        title: sheetName
      },
      arrange: {
        type: 'buttons',
        title: 'Arrange by',
        options: ['Due', 'Category', 'When'],
        features: {
          orderSheetSections: {
            events: [Event.onSidebarSubmit],
            sections: SectionsCategory.MAIN,
            priority: 'HIGH_PRIORITY',
            by: {
              due: [
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
              when: [
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