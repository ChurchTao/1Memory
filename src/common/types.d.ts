declare interface Attachments {
  [key: string]: {
    content_type: string
    data: Buffer
  }
}

declare interface ClipItemDoc {
  _id: string
  txt: string
  createdAt: number
  types: string[]
  _attachments: Attachments
}

declare interface BaseDoc {
  _id: string
  data: string
}

declare interface ClipListRes {
  docs: ClipItemDoc[]
}
