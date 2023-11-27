/**
 * 应用程序的设置项
 * 包含:
 * 通用, 剪贴板
 */
class SettingsBO {
  //通用
  general: GeneralSetting
  //剪贴板
  clip: ClipSetting

  constructor() {
    this.general = new GeneralSetting()
    this.clip = new ClipSetting()
  }

  static of(data: string): SettingsBO {
    const settings = JSON.parse(data)
    return {
      general: settings.general,
      clip: settings.clip
    }
  }
}

/**
 * 通用设置
 * {autoLaunch,language,theme}
 */
class GeneralSetting {
  //是否开机启动
  autoLaunch: boolean
  //语言
  language: string
  //主题
  theme: 'system' | 'light' | 'dark'

  constructor() {
    this.autoLaunch = false
    this.language = 'zh'
    this.theme = 'system'
  }
}

/**
 * 剪贴板设置
 * {alwaysOnTop,enableClipboardListener,maxRecords,maxDays,copyNotification,shortcut}
 */
class ClipSetting {
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

  constructor() {
    this.alwaysOnTop = false
    this.enableClipboardListener = true
    this.maxRecords = 100
    this.maxDays = 30
    this.copyNotification = true
    this.shortcut = 'Alt+Space'
  }
}

export { SettingsBO, GeneralSetting, ClipSetting }
