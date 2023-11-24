import { BSON } from 'realm'

class AttachmentBO {
  _id?: BSON.ObjectId
  memoryItemId?: BSON.ObjectId
  desc!: string
  contentType!: string
  data!: Buffer
}

class AttachmentVO {
  _id!: string
  memoryItemId!: string
  desc!: string
  contentType!: string
  data!: ArrayBuffer
}

interface AttachmentQuery {
  memoryItemId: string
  desc?: string
  contentType?: string
}

export { AttachmentBO, AttachmentVO }
export type { AttachmentQuery }
