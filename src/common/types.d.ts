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
  _rev?: string
  data: string
}

declare interface ClipListRes {
  docs: ClipItemDoc[]
}

declare interface ClipItemDocVO {
  _id: string
  txt: string
  createdAt: number
  types: string[]
  thumbnail: Buffer | null
}

declare interface SettingsVO {
  general: GeneralSettingVO
  //剪贴板
  clip: ClipSettingVO
}

declare interface GeneralSettingVO {
  //是否开机启动
  autoLaunch: boolean
  //语言
  language: string
  //主题
  theme: string
}

declare interface ClipSettingVO {
  //是否窗口置顶
  alwaysOnTop: boolean
  //是否启用剪贴板监听
  enableClipboardListener: boolean
  //最大记录数
  maxRecords: number
  //最大保存天数
  maxDays: number
  //复制通知
  copyNotification: boolean
  //快捷键
  shortcut: string
}
