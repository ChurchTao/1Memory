import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ControllerApi, EventTypes } from '../common/const/const'
import { MemoryItemDetailVO, MemoryItemListVO, PageResult, SettingsBO } from '@common/bo'

// Custom APIs for renderer
const api = {
  platform: process.platform,
  win: {
    openWin: (name: string): void => ipcRenderer.send(ControllerApi.WIN_OPEN, name),
    closeWin: (name: string): void => ipcRenderer.send(ControllerApi.WIN_CLOSE, name),
    pin: (name: string, pin: boolean): void =>
      ipcRenderer.send(ControllerApi.WIN_SET_PIN, name, pin),
    setSize: (name: string, width: number, height: number): void =>
      ipcRenderer.send(ControllerApi.WIN_SET_SIZE, name, width, height)
  },
  settings: {
    getAll: (): Promise<SettingsBO> => ipcRenderer.invoke(ControllerApi.SETTINGS_GET_ALL),
    onChange: (callback: (event: SettingsBO) => void): void => {
      ipcRenderer.on(EventTypes.SETTINGS_CHANGE, (event, value) => {
        callback(value)
      })
    },
    datkModeSet: (darkMode: string): void =>
      ipcRenderer.send(ControllerApi.DARK_MODE_SET, darkMode),
    languageSet: (language: string): void =>
      ipcRenderer.send(ControllerApi.SETTINGS_LANGUAGE_SET, language)
  },
  clip: {
    getById: (id: string): Promise<MemoryItemDetailVO> =>
      ipcRenderer.invoke(ControllerApi.CLIP_GET_BY_ID, id),
    findByTxtLike: (
      txt: string,
      type: string,
      pageNum: number,
      pageSize: number
    ): Promise<PageResult<MemoryItemListVO>> =>
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
    },
    onUILanguageChange: (callback: (event: string) => void): void => {
      ipcRenderer.on(EventTypes.UI_LANG_CHANGE, (_event, value) => {
        callback(value)
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
