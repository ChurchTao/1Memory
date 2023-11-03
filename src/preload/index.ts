import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ClipItemDocVO } from '../common/vo'
import { ControllerApi, EventTypes } from '../common/const'

// Custom APIs for renderer
const api = {
  platform: process.platform,
  win: {
    openWin: (name: string): void => ipcRenderer.send('openWin', name),
    closeWin: (name: string): void => ipcRenderer.send('closeWin', name),
    pin: (name: string, pin: boolean): void => ipcRenderer.send('pin', name, pin),
    setSize: (name: string, width: number, height: number): void =>
      ipcRenderer.send(ControllerApi.WIN_SET_SIZE, name, width, height)
  },
  clip: {
    getById: (id: string): Promise<ClipItemDocVO> =>
      ipcRenderer.invoke(ControllerApi.CLIP_GET_BY_ID, id),
    findByTxtLike: (
      txt: string,
      type: string,
      pageNum: number,
      pageSize: number
    ): Promise<ClipItemDocVO[]> =>
      ipcRenderer.invoke(ControllerApi.CLIP_FIND_BY_TXT_LIKE, txt, type, pageNum, pageSize),
    deleteById: (id: string): void => ipcRenderer.send(ControllerApi.CLIP_DELETE_BY_ID, id),
    handleCopy: (id: string): void => ipcRenderer.send(ControllerApi.CLIP_HANDLE_COPY, id),
    handleCopyTxt: (id: string): void => ipcRenderer.send(ControllerApi.CLIP_HANDLE_COPY_TXT, id),
    onChange: (callback: () => void): void => {
      ipcRenderer.on(EventTypes.CLIP_CHANGE, () => {
        callback()
      })
    },
    onBlur: (callback: () => void): void => {
      ipcRenderer.on(EventTypes.CLIP_BLUR, () => {
        callback()
      })
    }
  }
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
