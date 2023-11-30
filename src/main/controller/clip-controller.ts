import { ipcMain } from 'electron'
import { handleCopy, handleCopyTxt } from '../service/clip-service'
import { ControllerApi, EventTypes } from '../../common/const/const'
import { getMemoryById, findAllMemory, deleteMemoryById } from '../core/db'
import { MemoryItemListVO, PageResult } from '@common/bo'

export function initClipController(): void {
  ipcMain.handle(ControllerApi.CLIP_GET_BY_ID, async (_event, id) => {
    return getMemoryById(id)
  })

  ipcMain.handle(
    ControllerApi.CLIP_FIND_BY_TXT_LIKE,
    async (_event, txt, type, pageNum, pageSize) => {
      console.log('search txt', txt)
      const docsRes: PageResult<MemoryItemListVO> = findAllMemory({
        txt,
        type,
        page: pageNum,
        pageSize
      })
      return docsRes
    }
  )

  ipcMain.on(ControllerApi.CLIP_DELETE_BY_ID, async (_event, id) => {
    const idList: string[] = id.split(',')
    if (!idList) {
      return
    }
    idList.forEach((id) => {
      deleteMemoryById(id)
    })
    global.main_win?.webContents.send(EventTypes.CLIP_CHANGE, 'ok')
  })

  ipcMain.on(ControllerApi.CLIP_HANDLE_COPY, async (_event, id) => {
    handleCopy(id)
  })

  ipcMain.on(ControllerApi.CLIP_HANDLE_COPY_TXT, async (_event, id) => {
    handleCopyTxt(id)
  })
}
