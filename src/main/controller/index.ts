import { initClipController } from './clip-controller'
import { initSettingsController } from './settings-controller'
import { initWinController } from './window-controller'

export function initController(): void {
  initWinController()
  initClipController()
  initSettingsController()
}
