import { globalShortcut } from 'electron'

export function registerShortcut(): void {
  const ret = globalShortcut.register('Option+Space', () => {
    global.main_win?.isVisible() ? global.main_win?.hide() : global.main_win?.show()
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
