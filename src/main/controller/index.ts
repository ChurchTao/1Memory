import { initClipController } from './clip-controller'
import { initWinController } from './window-controller'

export function initController(): void {
  initWinController()
  initClipController()
}
