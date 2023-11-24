import { globalShortcut } from 'electron'
import { getOnShowWorkSpaceCenterPoints, mainWindowSize } from '../ui'

export function registerShortcut(): void {
  const ret = globalShortcut.register('Option+Space', () => {
    const toHide = global.main_win?.isVisible()
    if (toHide) {
      global.main_win?.hide()
    } else {
      // 显示在当前的屏幕上
      global.main_win?.setBounds(
        getOnShowWorkSpaceCenterPoints(mainWindowSize.width, mainWindowSize.height)
      )
      global.main_win?.show()
    }
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
