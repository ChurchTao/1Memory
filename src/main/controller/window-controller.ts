import { ipcMain } from 'electron'
import { closeWin, pinOrNot, setSize } from '../service/window-service'
import { ControllerApi } from '../../common/const'

export function initWinController(): void {
  ipcMain.on('closeWin', (_event, name) => {
    closeWin(name)
  })

  ipcMain.on('pin', (_event, name, pin) => {
    pinOrNot(name, pin)
  })

  ipcMain.on(ControllerApi.WIN_SET_SIZE, (_event, name, width, height) => {
    console.log('set size', name, width, height)
    setSize(name, width, height)
  })
}
