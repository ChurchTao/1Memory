import { BrowserWindow } from 'electron'
import { env } from '../utils/env'
import { join } from 'path'
import i18n from '../../common/i18n/index'

const makeWindow = (): BrowserWindow => {
  let win: BrowserWindow | null
  win = new BrowserWindow({
    title: i18n.t('settings_title'),
    resizable: false,
    width: 780,
    height: 560,
    minimizable: false,
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

  env.loadPage(win, 'settings')

  win.on('close', (e: Electron.Event) => {
    if (global.is_will_quit) {
      win = null
      global.settings_win = null
    } else {
      e.preventDefault()
      win?.hide()
    }
  })

  global.settings_win = win

  return win
}

export { makeWindow }
