// app/main.js
// based on https://scotch.io/tutorials/creating-desktop-applications-with-angularjs-and-github-electron

const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

const DataBackend = require('./components/data-service/DataBackend.js');

let appIcon = null;
let win = null;

function toggleMainWindow()
{
  if (!win) return;

  if (win.isVisible())
  {
    win.hide();
  }
  else
  {
    win.show();
    win.focus();
  }
}

function showMainWindow(addTask)
{
  win.show();
  //win.focus();

  if (addTask) win.send('add-task');
}

global['backend'] = new DataBackend();

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (appIcon) appIcon.destroy();
  if (process.platform != 'darwin') app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {

  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 800, maximizable: false, fullscreenable: false, resizable: false, frame: false });
  //win.setMenu(null);
  // and load the index.html of the app.
  win.loadURL('file://' + __dirname + '/index.html');

  const iconPath = __dirname + '/assets/tray-icon.png';
  appIcon = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Add Task',
      click: function()
      {
        showMainWindow(true);
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: function()
      {
        win.close();
      }
    }
  ]);

  appIcon.on('double-click', function()
  {
    showMainWindow(true);
  });

/*
  appIcon.on('click', function()
  {
    toggleMainWindow(true);
  });
*/
  appIcon.setToolTip('Grabtangle');
  appIcon.setContextMenu(contextMenu);

  // Open the devtools.
  //win.openDevTools();
  // Emitted when the window is closed.
  win.on('closed', function () {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

});