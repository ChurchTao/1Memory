import { ipcMain } from 'electron'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const broadcast = (event: string, ...args: any[]): void => {
  ipcMain.emit('x_broadcast', null, { event, args })
}
