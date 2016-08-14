// app/main.js
// based on https://scotch.io/tutorials/creating-desktop-applications-with-angularjs-and-github-electron

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {

  // Create the browser window.
  let win = new BrowserWindow({ width: 800, height: 600 });
  // and load the index.html of the app.
  win.loadURL('file://' + __dirname + '/index.html');

  // Open the devtools.
  win.openDevTools();
  // Emitted when the window is closed.
  win.on('closed', function () {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

});