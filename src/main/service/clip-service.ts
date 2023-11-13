import { ClipAttachMentTypes, EventTypes, MimeTypes } from '../../common/const'
import { getById, getAttachmentByIdAndType, moveToTopByDoc, findByTxtLike } from '../dao/clip-dao'
import { clipboard, nativeImage } from 'electron'
import { keyUtil } from '../utils/key-util'
import ClipItemDocDo from '../do/clipItem-doc-do'
import ClipTimer from '../timer/clip-timer'
import { WindowUtil } from '../utils/window-util'

// 把数据写入剪贴板
export async function handleCopy(id: string): Promise<void> {
  console.log('on copy id=', id)
  const doc = await getById(id)
  moveToTopByDoc(doc)
  const docDo: ClipItemDocDo = await convertDetail(doc)
  console.log('on copy doc=', docDo)
  // 如果是图片
  if (doc.types.includes(MimeTypes.IMG)) {
    const _img = docDo.getImg()
    if (_img) {
      const _image = nativeImage.createFromBuffer(_img)
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
      const buffer = docDo.getHtml()
      if (buffer) {
        const _html = buffer.toString()
        _obj[ClipAttachMentTypes.HTML] = _html
      }
    }
    if (doc.types.includes(MimeTypes.RTF)) {
      const buffer = docDo.getRtf()
      if (buffer) {
        const _rtf = buffer.toString()
        _obj[ClipAttachMentTypes.RTF] = _rtf
      }
    }
    clipboard.write(_obj)
  }
  global.main_win?.webContents.send(EventTypes.CLIP_BLUR, 'ok')
  WindowUtil.switchToPrevWindow()
  keyUtil.ctrlV()
  ClipTimer.getInstance().setLastClipDO(docDo)
  global.main_win?.webContents.send(EventTypes.CLIP_CHANGE, 'ok')
}

export function handleCopyTxt(id: string): void {
  getById(id).then((doc) => {
    moveToTopByDoc(doc)
    clipboard.writeText(doc.txt)
    global.main_win?.webContents.send(EventTypes.CLIP_BLUR, 'ok')
    WindowUtil.switchToPrevWindow()
    keyUtil.ctrlV()
    convertDetail(doc).then((docDo) => {
      ClipTimer.getInstance().setLastClipDO(docDo)
      global.main_win?.webContents.send(EventTypes.CLIP_CHANGE, 'ok')
    })
  })
}

async function convertDetail(doc: ClipItemDoc): Promise<ClipItemDocDo> {
  const id = doc._id
  const res: ClipItemDocDo = new ClipItemDocDo(doc._id)
  res.setTxt(doc.txt)
  res.setTypes(doc.types)
  res.setCreatedAt(doc.createdAt)
  if (doc.types.includes(MimeTypes.IMG)) {
    const _img: Blob | Buffer = await getAttachmentByIdAndType(id, ClipAttachMentTypes.IMG)
    if (_img instanceof Buffer) {
      res.putImageToAttachments(_img)
    }
  }
  if (doc.types.includes(MimeTypes.HTML)) {
    const _html = await getAttachmentByIdAndType(id, ClipAttachMentTypes.HTML)
    if (_html instanceof Buffer) {
      res.putHtmlToAttachments(_html)
    }
  }
  if (doc.types.includes(MimeTypes.RTF)) {
    const _rtf = await getAttachmentByIdAndType(id, ClipAttachMentTypes.RTF)
    if (_rtf instanceof Buffer) {
      res.putRTFToAttachments(_rtf)
    }
  }
  return res
}

export function getDetailById(id: string): Promise<ClipItemDocDo> {
  return getById(id).then((doc) => {
    return convertDetail(doc)
  })
}

export function getLatestDetail(): Promise<ClipItemDocDo | null> {
  return findByTxtLike('', '', 1, 1).then((docList) => {
    if (docList.docs.length === 0) {
      return null
    }
    return convertDetail(docList.docs[0])
  })
}
