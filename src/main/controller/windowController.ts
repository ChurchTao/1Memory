import { ipcMain } from 'electron'
import { openWin, closeWin, pinOrNot, setSize } from '../service/windowService'
import { ControllerApi } from '../../common/const'

export function initWinController(): void {
  ipcMain.on('openWin', (_event, name) => {
    openWin(name)
  })

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
