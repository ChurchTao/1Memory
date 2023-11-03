import { initClipController } from './clipController'
import { initWinController } from './windowController'

export function initController(): void {
  initWinController()
  initClipController()
}
