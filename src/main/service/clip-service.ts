import { MemoryItemDescEnum, EventTypes, MimeTypes, ClipBoardContentType } from '@common/const'
import { clipboard, nativeImage } from 'electron'
import { keyUtil } from '../utils/key-util'
import { WindowUtil } from '../utils/window-util'
import { MemoryItemDetailVO } from '@common/bo'
import { getMemoryByIds, moveToTopMemory } from '../core/db'
import { BSON } from 'realm'
import { Data as ElectronData } from 'electron'

// 把数据写入剪贴板
export async function handleCopy(id: string): Promise<void> {
  return new Promise((resolve) => {
    console.log('on copy id=', id)
    const _idList = id.split(',').map((item) => new BSON.ObjectId(item))
    if (!_idList) {
      return
    }
    const doc = getMemoryByIds(_idList, true)
    if (!doc) {
      return
    }
    const data = makeElectronData(doc)
    console.log('data', data)
    clipboard.write(data)
    if (_idList.length === 1) {
      moveToTopMemory(id)
    }
    global.main_win?.webContents.send(EventTypes.CLIP_BLUR, 'ok')
    WindowUtil.switchToPrevWindow()
    keyUtil.ctrlV()
    global.main_win?.webContents.send(EventTypes.CLIP_CHANGE, 'ok')
    // 延迟清空剪贴板，防止在切换窗口时，剪贴板被清空
    setTimeout(() => {
      clipboard.clear()
    }, 500)
    resolve()
  })
}

export async function handleCopyTxt(id: string): Promise<void> {
  return new Promise((resolve) => {
    console.log('on copy id=', id)
    const _idList = id.split(',').map((item) => new BSON.ObjectId(item))
    if (!_idList) {
      return
    }
    const doc = getMemoryByIds(_idList, false)
    if (!doc) {
      return
    }
    const data = makeElectronData(doc, true)
    clipboard.writeText(data.text)
    if (_idList.length === 1) {
      moveToTopMemory(id)
    }
    global.main_win?.webContents.send(EventTypes.CLIP_BLUR, 'ok')
    WindowUtil.switchToPrevWindow()
    keyUtil.ctrlV()
    global.main_win?.webContents.send(EventTypes.CLIP_CHANGE, 'ok')
    // 延迟清空剪贴板，防止在切换窗口时，剪贴板被清空
    setTimeout(() => {
      clipboard.clear()
    }, 500)
    resolve()
  })
}

function makeElectronData(items: MemoryItemDetailVO[], onlyText: boolean = false): ElectronData {
  if (items.length === 1) {
    const doc = items[0]
    // 如果是单个复制
    // 如果是图片
    if (doc.types.includes(MimeTypes.IMG)) {
      const _img = doc.attachments?.filter((item) => item.desc === MemoryItemDescEnum.CLIP_IMG)
      if (_img) {
        return {
          image: nativeImage.createFromBuffer(Buffer.from(_img[0].data))
        }
      }
    } else if (doc.types.includes(MimeTypes.TXT) && !doc.types.includes(MimeTypes.HTML)) {
      // 如果是纯文本
      return {
        text: doc.txt
      }
    } else {
      // 如果是html
      const _obj = {
        text: doc.txt
      }
      if (!onlyText) {
        if (doc.types.includes(MimeTypes.HTML)) {
          const buffer = doc.attachments?.filter(
            (item) => item.desc === MemoryItemDescEnum.CLIP_HTML
          )
          if (buffer) {
            const _html = Buffer.from(buffer[0].data).toString()
            _obj[ClipBoardContentType.html] = _html
          }
        }
        if (doc.types.includes(MimeTypes.RTF)) {
          const buffer = doc.attachments?.filter(
            (item) => item.desc === MemoryItemDescEnum.CLIP_RTF
          )
          if (buffer) {
            const _rtf = Buffer.from(buffer[0].data).toString()
            _obj[ClipBoardContentType.rtf] = _rtf
          }
        }
      }
      return _obj
    }
  } else {
    // 如果是多个复制，则排除图片类型的数据，并把其他的数据合并，用换行符分割
    const docs = items.filter((item) => !item.types.includes(MimeTypes.IMG))
    const _obj = {
      text: docs.map((item) => item.txt).join('\n')
    }
    if (!onlyText) {
      const _html = docs
        .filter((item) => item.types.includes(MimeTypes.HTML))
        .map((item) => {
          const buffer = item.attachments?.filter(
            (item) => item.desc === MemoryItemDescEnum.CLIP_HTML
          )
          if (buffer) {
            return Buffer.from(buffer[0].data).toString()
          }
        })
      if (_html.length) {
        _obj[ClipBoardContentType.html] = _html.join()
      }
      const _rtf = docs
        .filter((item) => item.types.includes(MimeTypes.RTF))
        .map((item) => {
          const buffer = item.attachments?.filter(
            (item) => item.desc === MemoryItemDescEnum.CLIP_RTF
          )
          if (buffer) {
            return Buffer.from(buffer[0].data).toString()
          }
        })
      if (_rtf.length) {
        _obj[ClipBoardContentType.rtf] = _rtf.join()
      }
    }
    return _obj
  }
}
