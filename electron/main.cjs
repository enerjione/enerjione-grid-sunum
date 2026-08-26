const { app, BrowserWindow, globalShortcut, shell } = require('electron')
const path = require('path')

let win = null

function createWindow() {
  win = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 900,
    minHeight: 560,
    show: false,
    fullscreen: true,
    backgroundColor: '#04070e',
    autoHideMenuBar: true,
    title: 'EnerjiOne Grid - Tanitim Sunumu',
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
    },
  })

  win.setMenuBarVisibility(false)
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  win.once('ready-to-show', () => win.show())

  // sunum icinde disari acilan linkler varsayilan tarayicida acilsin
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow()

  globalShortcut.register('F11', () => {
    if (win) win.setFullScreen(!win.isFullScreen())
  })
  globalShortcut.register('Escape', () => {
    if (win && win.isFullScreen()) win.setFullScreen(false)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => globalShortcut.unregisterAll())
app.on('window-all-closed', () => app.quit())
