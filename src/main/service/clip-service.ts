import { MemoryItemDescEnum, EventTypes, MimeTypes, ClipBoardContentType } from '@common/const'
import { clipboard, nativeImage } from 'electron'
import { keyUtil } from '../utils/key-util'
import ClipTimer from '../timer/clip-timer'
import { WindowUtil } from '../utils/window-util'
import { ClipItemBO } from '@common/bo'
import { getMemoryById, moveToTopMemory } from '../core/db'
import { BSON } from 'realm'

// 把数据写入剪贴板
export async function handleCopy(id: string): Promise<void> {
  return new Promise((resolve) => {
    console.log('on copy id=', id)
    const doc = getMemoryById(new BSON.ObjectId(id), true)
    if (!doc) {
      return
    }
    moveToTopMemory(id)
    // 如果是图片
    if (doc.types.includes(MimeTypes.IMG)) {
      const _img = doc.attachments?.filter((item) => item.desc === MemoryItemDescEnum.CLIP_IMG)
      if (_img) {
        const _image = nativeImage.createFromBuffer(Buffer.from(_img[0].data))
        clipboard.writeImage(_image)
      }
    } else if (doc.types.includes(MimeTypes.TXT) && !doc.types.includes(MimeTypes.HTML)) {
      // 如果是纯文本
      clipboard.writeText(doc.txt)
    } else {
      // 如果是html
      const _obj = {
        text: doc.txt
      }
      if (doc.types.includes(MimeTypes.HTML)) {
        const buffer = doc.attachments?.filter((item) => item.desc === MemoryItemDescEnum.CLIP_HTML)
        if (buffer) {
          const _html = Buffer.from(buffer[0].data).toString()
          _obj[ClipBoardContentType.html] = _html
        }
      }
      if (doc.types.includes(MimeTypes.RTF)) {
        const buffer = doc.attachments?.filter((item) => item.desc === MemoryItemDescEnum.CLIP_RTF)
        if (buffer) {
          const _rtf = Buffer.from(buffer[0].data).toString()
          _obj[ClipBoardContentType.rtf] = _rtf
        }
      }
      clipboard.write(_obj)
    }
    global.main_win?.webContents.send(EventTypes.CLIP_BLUR, 'ok')
    WindowUtil.switchToPrevWindow()
    keyUtil.ctrlV()
    ClipTimer.getInstance().setLastClipDO(ClipItemBO.fromMemoryItem(doc))
    global.main_win?.webContents.send(EventTypes.CLIP_CHANGE, 'ok')
    resolve()
  })
}

export async function handleCopyTxt(id: string): Promise<void> {
  return new Promise((resolve) => {
    const doc = getMemoryById(new BSON.ObjectId(id))
    if (!doc) {
      return
    }
    moveToTopMemory(id)
    clipboard.writeText(doc.txt)
    global.main_win?.webContents.send(EventTypes.CLIP_BLUR, 'ok')
    WindowUtil.switchToPrevWindow()
    keyUtil.ctrlV()
    ClipTimer.getInstance().setLastClipDO(ClipItemBO.fromMemoryItem(doc))
    global.main_win?.webContents.send(EventTypes.CLIP_CHANGE, 'ok')
    resolve()
  })
}
