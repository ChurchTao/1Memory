import { DefaultDBIds } from '../../common/const'

/**
 * 应用程序的设置项
 * 包含:
 * 通用, 剪贴板
 */
export default class SettingsDO {
  //通用
  private general: GeneralSetting
  //剪贴板
  private clip: ClipSetting

  constructor() {
    this.general = new GeneralSetting()
    this.clip = new ClipSetting()
  }

  toDoc(): BaseDoc {
    return {
      _id: DefaultDBIds.SYSTEM_SETTINGS,
      data: JSON.stringify(this)
    }
  }

  toVO(): SettingsVO {
    return {
      general: this.general,
      clip: this.clip
    }
  }

  fromDoc(doc: BaseDoc): void {
    const settings = JSON.parse(doc.data)
    this.general = settings.general
    this.clip = settings.clip
  }

  getGeneral(): GeneralSetting {
    return this.general
  }

  getClip(): ClipSetting {
    return this.clip
  }
}

/**
 * 通用设置
 * {autoLaunch,language,theme}
 */
class GeneralSetting {
  //是否开机启动
  public autoLaunch: boolean
  //语言
  public language: string
  //主题
  public theme: string

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
  public alwaysOnTop: boolean
  //是否启用剪贴板监听
  public enableClipboardListener: boolean
  //最大记录数
  public maxRecords: number
  //最大保存天数
  public maxDays: number
  //复制通知
  public copyNotification: boolean
  //快捷键
  public shortcut: string

  constructor() {
    this.alwaysOnTop = false
    this.enableClipboardListener = true
    this.maxRecords = 100
    this.maxDays = 30
    this.copyNotification = true
    this.shortcut = 'Alt+Space'
  }
}
