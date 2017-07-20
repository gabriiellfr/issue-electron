const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let mainWindow;

const Menu = electron.Menu;
app.on('ready', function () {
   mainWindow = new BrowserWindow({
      frame: true, width: 600, minWidth: 600, height: 600, minHeight: 600,
      useContentSize : true, resizable: false, autoHideMenuBar: true,
      fullscreenable : false
    });
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

    //mainWindow.webContents.openDevTools();

});

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