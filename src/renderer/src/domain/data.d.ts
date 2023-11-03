/**
 * 剪贴板数据类型
 * 文本，html，图片，文件
 */
export type ClipItemType = 'text' | 'html' | 'image' | 'file' | 'rtf'

export interface ClipItem {
  id: string
  type: ClipItemType
  value: string
  createdAt: number
}
