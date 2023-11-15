import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import * as clipWin from '../main/ui/clip'
import * as settingsWin from '../main/ui/settings'
import ClipTimer from './timer/clip-timer'
import DB from './db/index'
import { initController } from './controller'
import { createTary } from './ui/tary'
import { registerShortcut, unregisterShortcut } from './core/shortcut'
import { initSettings } from './service/settings-service'
import { init as initI18N } from './core/i18n'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('github.churchtao.1memory')
  const db: DB = await DB.getInstance()
  const defaultDB = db.getDefalutDB()
  const clipDB = db.getClipDB()
  if (defaultDB) {
    global.defaultDB = defaultDB
  }
  if (clipDB) {
    global.clipDB = clipDB
  }
  ClipTimer.getInstance().startListen()
  await initSettings()
  initI18N()
  initController()

  createTary()
  clipWin.createWindow()
  settingsWin.makeWindow()
  registerShortcut()
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) clipWin.createWindow()
  })
})

app.on('will-quit', () => {
  unregisterShortcut()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => (global.is_will_quit = true))

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (global.main_win) {
      if (global.main_win.isMinimized()) {
        global.main_win.restore()
      }
      global.main_win.focus()
    }
  })
}
