import { app } from 'electron'

export const WindowUtil = {
  switchToPrevWindow(): void {
    app.hide()
  },
  hideClipWindowAll(): void {
    global.main_win?.hide()
    global.kbd_win?.hide()
    app.hide()
  }
}
