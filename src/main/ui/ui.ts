import { EventTypes } from '../../common/const'
import i18n from 'i18next'
import { refreshUI as refreshSettingsUI } from './settings'
import { refreshTary } from './tary'

export function refresh(): void {
  refreshSettingsUI()
  refreshTary()
  global.main_win?.webContents.send(EventTypes.UI_LANG_CHANGE, i18n.language)
}
