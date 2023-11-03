export interface ClipItemDocVO {
  _id: string
  txt: string
  createdAt: number
  types: string[]
  thumbnail: Buffer | null
}
