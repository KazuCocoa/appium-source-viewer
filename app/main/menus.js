import { app } from 'electron';

let menuTemplates = {mac: {}, other: {}};

function macMenuSourceViewer () {
  return {
    label: 'SourceViewer',
    submenu: [{
      label: 'About SourceViewer',
      selector: 'orderFrontStandardAboutPanel:'
    }, {
      type: 'separator'
    }, {
      label: 'Hide SourceViewer',
      accelerator: 'Command+H',
      selector: 'hide:'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Shift+H',
      selector: 'hideOtherApplications:'
    }, {
      label: 'Show All',
      selector: 'unhideAllApplications:'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click () {
        app.quit();
      }
    }]
  };
}

function macMenuView (mainWindow) {
  return {
    label: 'View',
    submenu: (process.env.NODE_ENV === 'development') ? [{
      label: 'Reload',
      accelerator: 'Command+R',
      click () {
        mainWindow.webContents.reload();
      }
    }, {
      label: 'Toggle Full Screen',
      accelerator: 'Ctrl+Command+F',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: 'Alt+Command+I',
      click () {
        mainWindow.toggleDevTools();
      }
    }] : [{
      label: 'Toggle Full Screen',
      accelerator: 'Ctrl+Command+F',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }]
  };
}

const macMenuWindow = {
  label: 'Window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'Command+M',
    selector: 'performMiniaturize:'
  }, {
    label: 'Close',
    accelerator: 'Command+W',
    selector: 'performClose:'
  }, {
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    selector: 'arrangeInFront:'
  }]
};

menuTemplates.mac = (mainWindow) => [
  macMenuSourceViewer(),
  macMenuView(mainWindow),
  macMenuWindow
];

function otherMenuFile () {
  let fileSubmenu = [{
    label: '&Open',
    accelerator: 'Ctrl+O'
  }, {
    type: 'separator'
  }];

  return {
    label: '&File',
    submenu: fileSubmenu,
  };
}

function otherMenuView (mainWindow) {
  return {
    label: '&View',
    submenu: (process.env.NODE_ENV === 'development') ? [{
      label: '&Reload',
      accelerator: 'Ctrl+R',
      click () {
        mainWindow.webContents.reload();
      }
    }, {
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }, {
      label: 'Toggle &Developer Tools',
      accelerator: 'Alt+Ctrl+I',
      click () {
        mainWindow.toggleDevTools();
      }
    }] : [{
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }]
  };
}

menuTemplates.other = (mainWindow) => [
  otherMenuFile(),
  otherMenuView(mainWindow)
];

export default menuTemplates;
