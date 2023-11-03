/**
 * 剪贴板内容数据库存储类
 * 
 var doc = {
  "_id": "doc",
  "title": "Legendary Hearts",
  "_attachments": {
    "att.txt": {
      "content_type": "text/plain",
      "data": new Blob(['Is there life on Mars?'], {type: 'text/plain'})
    }
  }
};
 */

import { MimeTypes, ClipAttachMentTypes, DB_CLIP_ITEM_PREFIX } from '../../common/const'

const _prefix = DB_CLIP_ITEM_PREFIX

export default class ClipItemDocDo {
  private _id: string
  //纯文本
  public txt: string
  //创建时间
  private createdAt: number
  //包含类型
  private types: string[]
  //附件存储
  private _attachments: Attachments

  private nativeImg: Electron.NativeImage | null

  constructor(id: string) {
    this._id = _prefix + id
    this.txt = ''
    this.createdAt = Date.now()
    this.types = []
    this._attachments = {}
    this.nativeImg = null
  }

  toDoc(): ClipItemDoc {
    return {
      _id: this._id,
      txt: this.txt,
      createdAt: this.createdAt,
      types: this.types,
      _attachments: this._attachments
    }
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
    this._attachments[ClipAttachMentTypes.IMG] = {
      content_type: MimeTypes.IMG,
      data: image
    }
  }

  putThumbnail(thumbnail: Buffer): void {
    this._attachments[ClipAttachMentTypes.IMG_THUMB] = {
      content_type: MimeTypes.IMG,
      data: thumbnail
    }
  }

  putHtmlToAttachments(html: Buffer): void {
    this._attachments[ClipAttachMentTypes.HTML] = {
      content_type: MimeTypes.HTML,
      data: html
    }
  }

  putRTFToAttachments(rtf: Buffer): void {
    this._attachments[ClipAttachMentTypes.RTF] = {
      content_type: MimeTypes.RTF,
      data: rtf
    }
  }

  getImg(): Buffer | null {
    if (!this._attachments[ClipAttachMentTypes.IMG]) {
      return null
    }
    return this._attachments[ClipAttachMentTypes.IMG].data
  }

  getHtml(): Buffer | null {
    if (!this._attachments[ClipAttachMentTypes.HTML]) {
      return null
    }
    return this._attachments[ClipAttachMentTypes.HTML].data
  }

  getRtf(): Buffer | null {
    if (!this._attachments[ClipAttachMentTypes.RTF]) {
      return null
    }
    return this._attachments[ClipAttachMentTypes.RTF].data
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

  equals(clipItemDocDo: ClipItemDocDo): boolean {
    // 1. 对比 txt 长度是否想等 && txt内容是否相等
    // 2. 对比 types 长度是否相等 && types内容是否相等
    // 3. 对比 _attachments 中的内容是否相等
    if (this.txt.length !== clipItemDocDo.txt.length || this.txt !== clipItemDocDo.txt) {
      console.log('txt is not eq')
      return false
    }
    if (!compareTypes(this.types, clipItemDocDo.types)) {
      console.log('types is not eq')
      return false
    }
    if (!compareAttachments(this._attachments, clipItemDocDo._attachments)) {
      console.log('_attachments is not eq')
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

function compareAttachments(_attachments: Attachments, _attachments1: Attachments): boolean {
  for (const key in _attachments) {
    if (key == ClipAttachMentTypes.IMG) {
      if (_attachments[key].data.length !== _attachments1[key].data.length) {
        console.log('compareAttachments img: buffer length is not eq', key)
        return false
      }
      if (Buffer.compare(_attachments[key].data, _attachments1[key].data) !== 0) {
        console.log('compareAttachments img: is not eq', key)
        return false
      }
    }
  }
  return true
}
