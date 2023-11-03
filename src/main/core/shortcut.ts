import { globalShortcut } from 'electron'
import { WindowUtil } from '../utils/windowUtil'

export function registerShortcut(): void {
  const ret = globalShortcut.register('Option+Space', () => {
    global.main_win?.isVisible() ? WindowUtil.hideClipWindowAll() : global.main_win?.show()
  })

  if (!ret) {
    console.log('registration failed')
  }

  // 检查快捷键是否注册成功
  console.log(
    `globalShortcut.isRegistered('Option+Space')`,
    globalShortcut.isRegistered('Option+Space')
  )
}

export function unregisterShortcut(): void {
  globalShortcut.unregisterAll()
}
