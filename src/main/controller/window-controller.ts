import { ipcMain } from 'electron'
import { closeWin, pinOrNot, setSize } from '../service/window-service'
import { ControllerApi } from '../../common/const/const'

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
}
