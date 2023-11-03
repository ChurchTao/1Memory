import { ipcMain } from 'electron'
import { getById, findByTxtLike, deleteById, getAttachmentByIdAndType } from '../dao/clipDao'
import { handleCopy, handleCopyTxt } from '../service/clipService'
import { ClipAttachMentTypes, ControllerApi, MimeTypes } from '../../common/const'
import { ClipItemDocVO } from '../../common/vo'

export function initClipController(): void {
  ipcMain.handle(ControllerApi.CLIP_GET_BY_ID, async (_event, id) => {
    const doc = await getById(id)
    const res: ClipItemDocVO = {
      _id: doc._id,
      txt: doc.txt,
      createdAt: doc.createdAt,
      types: doc.types,
      thumbnail: null
    }
    if (doc.types.includes(MimeTypes.IMG)) {
      const img = await getAttachmentByIdAndType(id, ClipAttachMentTypes.IMG_THUMB)
      if (img instanceof Buffer) {
        res.thumbnail = img
      }
    }
    return res
  })

  ipcMain.handle(
    ControllerApi.CLIP_FIND_BY_TXT_LIKE,
    async (_event, txt, type, pageNum, pageSize) => {
      const docsRes = await findByTxtLike(txt, type, pageNum, pageSize)
      const res: ClipItemDocVO[] = []
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()
      for (const doc of docsRes.docs) {
        if (doc.txt.length > 400) {
          // 限定长字符串返回
          // todo 如果可以的话，把文本存到 attachment 中，txt中本来就直接存截断的文本
          const bytes = encoder.encode(doc.txt.slice(0, 400))
          const truncatedBytes = bytes.slice(0, bytes.length - 1)
          const truncatedString = decoder.decode(truncatedBytes)
          doc.txt = truncatedString
        }
        const item: ClipItemDocVO = {
          _id: doc._id,
          txt: doc.txt,
          createdAt: doc.createdAt,
          types: doc.types,
          thumbnail: null
        }
        if (doc.types.includes(MimeTypes.IMG)) {
          const img = await getAttachmentByIdAndType(doc._id, ClipAttachMentTypes.IMG_THUMB)
          if (img instanceof Buffer) {
            item.thumbnail = img
          }
        }
        res.push(item)
      }
      return res
    }
  )

  ipcMain.on(ControllerApi.CLIP_DELETE_BY_ID, async (_event, id) => {
    deleteById(id)
  })

  ipcMain.on(ControllerApi.CLIP_HANDLE_COPY, async (_event, id) => {
    handleCopy(id)
  })

  ipcMain.on(ControllerApi.CLIP_HANDLE_COPY_TXT, async (_event, id) => {
    handleCopyTxt(id)
  })
}
