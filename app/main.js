// app/main.js
// based on https://scotch.io/tutorials/creating-desktop-applications-with-angularjs-and-github-electron

const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

let appIcon = null;
let trayWin = null;


function showTrayWindow()
{
  if (trayWin && !trayWin.isVisible()) 
  {
    let trayBounds = appIcon.getBounds();
    let winBounds = trayWin.getBounds();
    winBounds.x = trayBounds.x - winBounds.width + 50;
    winBounds.y = trayBounds.y - winBounds.height - 10;
    trayWin.setBounds(winBounds);
    trayWin.show();
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (appIcon) appIcon.destroy();
  if (process.platform != 'darwin') app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {

  // Create the browser window.
  let win = new BrowserWindow({ width: 800, height: 800, maximizable: false });
  // and load the index.html of the app.
  win.loadURL('file://' + __dirname + '/index.html');

  const iconPath = __dirname + '/assets/tray-icon.png';
  appIcon = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      role: "quit"
    },
    {
      label: 'Quick add task',
      click: showTrayWindow
    }
  ]);

  appIcon.on('click', function() { if (trayWin && trayWin.isVisible()) trayWin.hide(); });
  appIcon.on('double-click', showTrayWindow);

  appIcon.setToolTip('Grabtangle');
  appIcon.setContextMenu(contextMenu);

  trayWin = new BrowserWindow({ width: 555, height: 256, frame: false, transparent: false, show: false, resizable: false, alwaysOnTop: true })

  // Open the devtools.
  //win.openDevTools();
  // Emitted when the window is closed.
  win.on('closed', function () {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    if (trayWin) trayWin.close();
  });

});