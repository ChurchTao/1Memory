import { BrowserWindow } from 'electron'
import { env } from '../utils/env'
import { join } from 'path'

const makeWindow = (): BrowserWindow => {
  let win: BrowserWindow | null
  win = new BrowserWindow({
    frame: false,
    resizable: false,
    width: 300,
    height: 300,
    skipTaskbar: false,
    focusable: false,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // win.setVisibleOnAllWorkspaces(true, {
  //   visibleOnFullScreen: true,
  // })

  env.loadPage(win, 'kbd')

  win.on('close', (e: Electron.Event) => {
    if (global.is_will_quit) {
      win = null
      global.kbd_win = null
    } else {
      e.preventDefault()
      win?.hide()
    }
  })

  global.kbd_win = win

  return win
}

export { makeWindow }
