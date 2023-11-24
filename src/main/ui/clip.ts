import { shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { env } from '../utils/env'
import { EventTypes } from '@common/const/const'

const mainWindowSize = {
  width: 640,
  height: 500
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: mainWindowSize.width,
    height: mainWindowSize.height,
    resizable: false,
    show: false,
    skipTaskbar: false,
    frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: is.dev
    }
  })

  mainWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true
  })

  global.main_win = mainWindow

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('close', (e: Electron.Event) => {
    if (global.is_will_quit) {
      global.main_win = null
    } else {
      e.preventDefault()
      global.main_win?.hide()
    }
  })

  mainWindow.on('closed', () => {
    global.main_win = null
  })

  mainWindow.on('blur', () => {
    console.log('mainWindow blur')
    if (!mainWindow.isAlwaysOnTop()) {
      global.main_win?.webContents.send(EventTypes.CLIP_BLUR, 'ok')
      global.main_win?.hide()
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  env.loadPage(mainWindow, '')
}

export { createWindow as createMainWindow, mainWindowSize }
