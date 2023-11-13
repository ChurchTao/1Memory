import { WindowUtil } from '../utils/window-util'

export async function closeWin(win: string): Promise<void> {
  if (win === 'clip' && global.main_win?.isVisible()) {
    WindowUtil.hideClipWindowAll()
  }
}

export function pinOrNot(win: string, pin: boolean): void {
  if (win === 'clip') {
    global.main_win?.setAlwaysOnTop(pin)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export function setSize(win: string, width: number, height: number): void {}
