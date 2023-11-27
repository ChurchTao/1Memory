/**
 * 剪贴板内容数据库存储类
 */
import { MemoryItemBO, AttachmentBO, MemoryItemDetailVO } from '@common/bo'
import { MimeTypes, MemoryItemDescEnum } from '../const/const'

export class ClipItemBO {
  //纯文本
  public txt: string
  //创建时间
  private createdAt: number
  //包含类型
  private types: string[]
  //附件存储
  private attachments: Array<AttachmentBO>

  private nativeImg: Electron.NativeImage | null

  constructor() {
    this.txt = ''
    this.createdAt = Date.now()
    this.types = []
    this.attachments = []
    this.nativeImg = null
  }

  toMemoryItem(): { memoryItem: MemoryItemBO; attachments: Array<AttachmentBO> } {
    return {
      memoryItem: {
        txt: this.txt,
        createdAt: new Date(this.createdAt),
        types: this.types,
        kewords: []
      },
      attachments: this.attachments
    }
  }

  static fromMemoryItem(memoryItem: MemoryItemDetailVO): ClipItemBO {
    const clipItem = new ClipItemBO()
    clipItem.setTxt(memoryItem.txt)
    clipItem.setCreatedAt(memoryItem.createdAt.getTime())
    clipItem.setTypes(memoryItem.types)
    memoryItem.attachments?.forEach((attachment) => {
      if (attachment.desc === MemoryItemDescEnum.CLIP_IMG) {
        clipItem.putImageToAttachments(Buffer.from(attachment.data))
      }
      if (attachment.desc === MemoryItemDescEnum.CLIP_HTML) {
        clipItem.putHtmlToAttachments(Buffer.from(attachment.data))
      }
      if (attachment.desc === MemoryItemDescEnum.CLIP_RTF) {
        clipItem.putRTFToAttachments(Buffer.from(attachment.data))
      }
    })
    return clipItem
  }

  setTxt(txt: string): void {
    this.txt = txt
  }

  setImg(img: Electron.NativeImage): void {
    this.nativeImg = img
  }

  setTypes(types: string[]): void {
    this.types = types
  }

  setCreatedAt(createdAt: number): void {
    this.createdAt = createdAt
  }

  putImageToAttachments(image: Buffer): void {
    this.attachments.push({
      desc: MemoryItemDescEnum.CLIP_IMG,
      contentType: MimeTypes.IMG,
      data: image
    })
  }

  putThumbnail(thumbnail: Buffer): void {
    this.attachments.push({
      desc: MemoryItemDescEnum.CLIP_IMG_THUMB,
      contentType: MimeTypes.IMG,
      data: thumbnail
    })
  }

  putHtmlToAttachments(html: Buffer): void {
    this.attachments.push({
      desc: MemoryItemDescEnum.CLIP_HTML,
      contentType: MimeTypes.HTML,
      data: html
    })
  }

  putRTFToAttachments(rtf: Buffer): void {
    this.attachments.push({
      desc: MemoryItemDescEnum.CLIP_RTF,
      contentType: MimeTypes.RTF,
      data: rtf
    })
  }

  makeThumbnail(): void {
    if (!this.nativeImg) {
      return
    }
    // 缩略图, 宽度200，高宽比不变
    const ratio = this.nativeImg.getAspectRatio()
    const thumbnail = this.nativeImg.resize({ width: 200, height: 200 / ratio, quality: 'good' })
    this.putThumbnail(thumbnail.toPNG())
  }

  equals(clipItemDocDo: ClipItemBO): boolean {
    // 1. 对比 txt 长度是否想等 && txt内容是否相等
    // 2. 对比 types 长度是否相等 && types内容是否相等
    // 3. 对比 _attachments 中的内容是否相等
    if (this.txt.length !== clipItemDocDo.txt.length || this.txt !== clipItemDocDo.txt) {
      return false
    }
    if (!compareTypes(this.types, clipItemDocDo.types)) {
      return false
    }
    if (!compareAttachments(this.attachments, clipItemDocDo.attachments)) {
      return false
    }
    return true
  }
}

function compareTypes(types: Array<string>, types2: Array<string>): boolean {
  if (types.length !== types2.length) {
    return false
  }
  for (let i = 0; i < types.length; i++) {
    if (types[i] !== types2[i]) {
      return false
    }
  }
  return true
}

function compareAttachments(_attachments: AttachmentBO[], _attachments1: AttachmentBO[]): boolean {
  const _left = _attachments.filter(
    (attachment) => attachment.desc !== MemoryItemDescEnum.CLIP_IMG_THUMB
  )
  const _right = _attachments1.filter(
    (attachment) => attachment.desc !== MemoryItemDescEnum.CLIP_IMG_THUMB
  )
  if (_left.length !== _right.length) {
    return false
  }
  for (let i = 0; i < _left.length; i++) {
    if (_left[i].desc !== _right[i].desc) {
      return false
    }
    if (_left[i].contentType !== _right[i].contentType) {
      return false
    }
    if (_left[i].data.byteLength !== _right[i].data.byteLength) {
      return false
    }
    if (Buffer.compare(_left[i].data, _right[i].data) !== 0) {
      return false
    }
  }
  return true
}
