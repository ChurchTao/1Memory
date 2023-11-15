import { app } from 'electron'

export const WindowUtil = {
  switchToPrevWindow(): void {
    app.hide()
  }
}
