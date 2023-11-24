import { BSON } from 'realm'
import { AttachmentVO } from './attachment'
import { MemoryItemContentType } from '@common/const'

class MemoryItemBO {
  _id?: BSON.ObjectId
  txt!: string
  createdAt!: Date
  types!: string[]
  kewords!: string[]
}

class BaseMemoryItemVO {
  _id!: string
  txt!: string
  createdAt!: Date
  types!: string[]
  kewords!: string[]
}

class MemoryItemListVO extends BaseMemoryItemVO {
  thumbnail?: AttachmentVO
}

class MemoryItemDetailVO extends BaseMemoryItemVO {
  attachments?: AttachmentVO[]
}

interface MemoryListQuery {
  page: number
  pageSize: number
  txt?: string
  type?: string
}

interface MemoryItemReact {
  id: string
  type: MemoryItemContentType
  value: string
  createdAt: Date
}

export { MemoryItemBO, MemoryItemListVO, MemoryItemDetailVO }
export type { MemoryListQuery, MemoryItemReact }
