import { makeWindow } from '../ui/clipKbd'
import { WindowUtil } from '../utils/windowUtil'

export async function openWin(win: string): Promise<void> {
  if (win === 'kbd') {
    try {
      const { screen } = require('electron')
      const { y } = screen.getCursorScreenPoint()
      // Create a window that fills the screen's available work area.
      if (!global.main_win) {
        return
      }
      if (!global.kbd_win) {
        global.kbd_win = await makeWindow()
      }
      const size: number[] = global.kbd_win.getSize()
      const height: number = size[1]
      const [mainX] = global.main_win.getPosition()
      const mainSize: number[] = global.main_win.getSize()
      const mainWidth: number = mainSize[0]
      global.kbd_win?.setPosition(1 + mainX + mainWidth, y - height / 2)
      global.kbd_win?.show()
    } catch (e) {
      console.log(e)
    }
  }
}

export async function closeWin(win: string): Promise<void> {
  if (win === 'kbd') {
    global.kbd_win?.hide()
  }
  if (win === 'clip' && global.main_win?.isVisible()) {
    WindowUtil.hideClipWindowAll()
  }
}

export function pinOrNot(win: string, pin: boolean): void {
  if (win === 'clip') {
    global.main_win?.setAlwaysOnTop(pin)
  }
}

export function setSize(win: string, width: number, height: number): void {
  if (win === 'kbd' && global.kbd_win) {
    const size = global.kbd_win.getSize()
    global.kbd_win?.setSize(size[0], height)
  }
}
