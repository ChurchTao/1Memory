import { EventTypes } from '../../common/const/const'
import i18n from 'i18next'
import { refreshUI as refreshSettingsUI } from './settings'
import { refreshTary } from './tary'
import { nativeTheme, screen } from 'electron'

function init(): void {
  nativeTheme.themeSource = global.settings.general.theme
}

function refresh(): void {
  refreshSettingsUI()
  refreshTary()
  global.main_win?.webContents.send(EventTypes.UI_LANG_CHANGE, i18n.language)
}

function getOnShowWorkSpaceCenterPoints(width: number, height: number): { x: number; y: number } {
  // 显示在当前的屏幕上
  const { getCursorScreenPoint, getDisplayNearestPoint } = screen
  const currentScreen = getDisplayNearestPoint(getCursorScreenPoint())
  // 计算当前屏幕的居中 x,y
  const x = currentScreen.bounds.x + currentScreen.bounds.width / 2 - width / 2
  const y = currentScreen.bounds.y + currentScreen.bounds.height / 2 - height / 2
  return { x, y }
}

export { init as initUI, refresh, getOnShowWorkSpaceCenterPoints }
