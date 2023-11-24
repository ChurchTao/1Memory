import {
  PageResult,
  MemoryItemBO,
  MemoryItemListVO,
  AttachmentBO,
  MemoryListQuery,
  AttachmentQuery,
  AttachmentVO,
  MemoryItemDetailVO
} from '@common/bo'
import { MemoryItemDescEnum, MimeTypes } from '@common/const/const'
import { Attachment, MemoryItem } from '@common/model'
import { BSON } from 'realm'

/**
 * 记忆数据的增删改查
 * saveClipItem(),getById(),getAttachmentByIdAndType(),findByTxtLike(),deleteById(),moveToTop()
 */
function saveMemory(memoryItem: MemoryItemBO, attachments: Array<AttachmentBO>): void {
  global.realm?.write(() => {
    if (memoryItem.types.includes(MimeTypes.IMG)) {
      //如果图片，直接保存
      saveMemoryAndAttachment(memoryItem, attachments)
      return
    }
    // 否则找一下有没有txt一模一样的，有的话，把它的createdAt改成现在，没有的话，就直接保存
    const memoryItems = global.realm?.objects(MemoryItem).filtered(`txt == $0`, memoryItem.txt)
    if (memoryItems?.length) {
      const memoryItem = memoryItems.at(0)!
      memoryItem.createdAt = new Date()
    } else {
      saveMemoryAndAttachment(memoryItem, attachments)
    }
  })
}

function saveMemoryAndAttachment(memoryItem: MemoryItemBO, attachments: Array<AttachmentBO>): void {
  // 保存记忆片段
  const res = global.realm?.create(MemoryItem, memoryItem)
  if (!res || attachments.length <= 0) {
    return
  }
  // 保存记忆附件
  for (let i = 0; i < attachments.length; i++) {
    attachments[i].memoryItemId = res._id
    global.realm?.create(Attachment, attachments[i])
  }
}

function getById(id: BSON.ObjectId, needAttachment: boolean = false): MemoryItemDetailVO | null {
  if (global.realm) {
    const memoryItem = global.realm.objectForPrimaryKey(MemoryItem, id)
    if (memoryItem) {
      const res: MemoryItemDetailVO = {
        _id: memoryItem._id.toString(),
        txt: memoryItem.txt,
        createdAt: memoryItem.createdAt,
        types: memoryItem.types.map((type) => type),
        kewords: memoryItem.kewords.map((keword) => keword)
      }
      if (needAttachment) {
        const attachments = getAttachment({
          memoryItemId: memoryItem!._id.toString()
        })
        res.attachments = attachments
      }
      return res
    }
  }
  return null
}

function getAttachment({ memoryItemId, desc, contentType }: AttachmentQuery): AttachmentVO[] {
  if (global.realm) {
    let attachments = global.realm
      .objects(Attachment)
      .filtered(`memoryItemId == $0`, new BSON.ObjectId(memoryItemId))
    if (desc) {
      attachments = attachments.filtered(`desc == $0`, desc)
    }
    if (contentType) {
      attachments = attachments.filtered(`contentType == $0`, contentType)
    }
    if (attachments.length) {
      const list: AttachmentVO[] = attachments.map((attachment) => {
        return {
          _id: attachment._id.toString(),
          memoryItemId: attachment.memoryItemId.toString(),
          desc: attachment.desc,
          contentType: attachment.contentType,
          data: attachment.data
        }
      })
      return list
    }
  }
  return []
}

function findAll({ txt, type, page, pageSize }: MemoryListQuery): PageResult<MemoryItemListVO> {
  if (global.realm) {
    let memoryItems = global.realm.objects(MemoryItem)
    if (txt) {
      memoryItems = memoryItems.filtered(`txt CONTAINS[c] $0`, txt)
    }
    if (type) {
      memoryItems = memoryItems.filtered(`types CONTAINS $0`, type)
    }
    const total = memoryItems.length
    if (total <= 0) {
      return PageResult.empty()
    }
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const finalList = memoryItems.sorted('createdAt', true).slice((page - 1) * pageSize, pageSize)
    const list: MemoryItemListVO[] = finalList.map((memoryItem) => {
      const memoryItemId = memoryItem._id.toString()
      let txt = memoryItem.txt
      if (txt.length > 400) {
        // 限定长字符串返回
        // todo 如果可以的话，把文本存到 attachment 中，txt中本来就直接存截断的文本
        const bytes = encoder.encode(txt.slice(0, 400))
        const truncatedBytes = bytes.slice(0, bytes.length - 1)
        const truncatedString = decoder.decode(truncatedBytes)
        txt = truncatedString
      }
      const types = memoryItem.types.map((type) => type)
      const kewords = memoryItem.kewords.map((keword) => keword)
      const res: MemoryItemListVO = {
        _id: memoryItem._id.toString(),
        txt,
        createdAt: memoryItem.createdAt,
        types,
        kewords
      }
      if (types.includes(MimeTypes.IMG)) {
        const thumbnails = getAttachment({
          memoryItemId,
          desc: MemoryItemDescEnum.CLIP_IMG_THUMB,
          contentType: MimeTypes.IMG
        })
        if (thumbnails.length > 0) {
          res.thumbnail = thumbnails[0]
        }
      }
      return res
    })
    return PageResult.of(total, list)
  }
  return PageResult.empty()
}

function deleteById(id: string): void {
  global.realm?.write(() => {
    if (global.realm) {
      const memoryItem = global.realm.objectForPrimaryKey(MemoryItem, new BSON.ObjectId(id))
      if (memoryItem) {
        global.realm.delete(memoryItem)
      }
    }
  })
}

function moveToTop(id: string): void {
  global.realm?.write(() => {
    if (global.realm) {
      const memoryItem = global.realm.objectForPrimaryKey(MemoryItem, new BSON.ObjectId(id))
      if (memoryItem) {
        memoryItem.createdAt = new Date()
        global.realm?.create(MemoryItem, memoryItem, Realm.UpdateMode.Modified)
      }
    }
  })
}

export {
  saveMemory,
  findAll as findAllMemory,
  getById as getMemoryById,
  deleteById as deleteMemoryById,
  moveToTop as moveToTopMemory,
  getAttachment as getMemoryAttachment
}
