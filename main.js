const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let mainWindow;
const Menu = electron.Menu;

function createWindow () {

  mainWindow = new BrowserWindow({
      frame: false, width: 1000, minWidth: 1000, height: 600, minHeight: 600,
      useContentSize : true, resizable: false, autoHideMenuBar: true,
      fullscreenable : false
  })

  const menuTemplate = [
  {

  }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  //mainWindow.maximize();
  //mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})