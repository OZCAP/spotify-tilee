const { app, BrowserWindow, ipcMain, shell, Menu } = require("electron");
const path = require("path");
const gotTheLock = app.requestSingleInstanceLock()

let mainWindow

const mainMenuTemplate = (window) => [
    { label:'app',
    submenu: [
      { label:'Sign out',
        click() { 
          window.webContents.send('sign-out');
          window.webContents.reloadIgnoringCache()
      }},
      { label:'Exit',
        click() { 
          app.quit()
      }},
    ]},



    {label:'Window',
    submenu: [
      { label:'Small(213px)',
        click() {
          const browserWindow = BrowserWindow.getFocusedWindow();
          browserWindow.setSize(213, 213);
      }},
      { label:'Medium(320px)',
        click() {
          const browserWindow = BrowserWindow.getFocusedWindow();
          browserWindow.setSize(320, 320);
      }},
      { label:'Large(640px)',
        click() {
          const browserWindow = BrowserWindow.getFocusedWindow();
          browserWindow.setSize(640, 640); 
      }},
    ]},

    {label:'Dev',
    submenu: [
      { label:'Dev tools',
        click() {
          window.webContents.openDevTools() 
      }}
    ]},
    {label:'Edit'},
]; 


function createWindow() {
  let params = {};
  if (process.platform === "darwin") {
    params = {
      width: 320,
      height: 320,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true
        // nodeIntegration: true,
      },
      resizable: false,
      titleBarStyle: 'hiddenInset'
    }
  } else {
    params = {
      width: 640,
      height: 660,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      resizable: false,
      autoHideMenuBar: true,
      // transparent: true,
      // titleBarStyle: 'hidden',
      // titleBarOverlay: false
    }
  }
  const win = new BrowserWindow(params);
  win.loadFile("dist/index.html");
  return win
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('spotify-tilee', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('spotify-tilee')
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});


ipcMain.on('resize-window', (event, dim) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  browserWindow.setSize(dim, dim)
})


// deep link
if (process.platform === "darwin") {
  let win;

  app.whenReady().then(() => {
    win = createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        win = createWindow();
      }
    });
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate(win));
    Menu.setApplicationMenu(mainMenu);
  });
  
  app.on('open-url', (event, url) => {
    win.webContents.send('set-user-code', {url});
  })
}

else {
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })

    // Create mainWindow, load the rest of the app, etc...
    app.whenReady().then(() => {
      createWindow()
    })

    // Handle the protocol. In this case, we choose to show an Error Box.
    app.on('open-url', (event, url) => {
      dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
    })
  }
}