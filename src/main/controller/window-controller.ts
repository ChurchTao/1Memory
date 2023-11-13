import { ipcMain, nativeTheme } from 'electron'
import { closeWin, pinOrNot, setSize } from '../service/window-service'
import { ControllerApi } from '../../common/const'

export function initWinController(): void {
  ipcMain.on(ControllerApi.WIN_OPEN, (_event, name) => {
    console.log('open win', name)
  })

  ipcMain.on(ControllerApi.WIN_CLOSE, (_event, name) => {
    closeWin(name)
  })

  ipcMain.on(ControllerApi.WIN_SET_PIN, (_event, name, pin) => {
    pinOrNot(name, pin)
  })

  ipcMain.on(ControllerApi.WIN_SET_SIZE, (_event, name, width, height) => {
    setSize(name, width, height)
  })

  ipcMain.on(ControllerApi.DARK_MODE_SET, (_event, darkMode) => {
    // 判断 darkMode 是否 light dark 或者 system
    if (darkMode && darkMode !== 'light' && darkMode !== 'dark' && darkMode !== 'system') {
      darkMode = 'system'
    }
    // 设置系统主题
    nativeTheme.themeSource = darkMode
  })
}
