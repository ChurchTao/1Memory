import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { join } from 'path'

export const env = {
  loadPage(win: BrowserWindow, path: string): void {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/' + path)
    } else {
      win.loadFile(join(__dirname, '../renderer/index.html'), { hash: path })
    }
  },
  isMac(): boolean {
    return process.platform === 'darwin'
  }
}
