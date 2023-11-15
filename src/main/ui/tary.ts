import { Menu, Tray, app, nativeTheme } from 'electron'
import i18n from 'i18next'
import { platform } from '@electron-toolkit/utils'

export function createTary(): void {
  if (platform.isMacOS) {
    app.dock.hide()
  }
  const tray: Tray = getTray()
  global.tary = tray
  const contextMenu = Menu.buildFromTemplate([
    {
      label: i18n.t('tary_open_clip'),
      click: () => global.main_win?.show()
    },
    { type: 'separator' },
    { label: i18n.t('tary_open_setting'), click: () => global.settings_win?.show() },
    { type: 'separator' },
    {
      label: i18n.t('tary_quit'),
      role: 'quit'
    }
  ])
  tray.setContextMenu(contextMenu)
}

export function refreshTary(): void {
  global.tary?.destroy()
  createTary()
}

function getTray(): Tray {
  if (platform.isMacOS) {
    return new Tray('resources/taryTemplate.png')
  } else {
    if (nativeTheme.shouldUseDarkColors) {
      return new Tray('resources/tary_16x16@2x.png')
    } else {
      return new Tray('resources/taryTemplate.png')
    }
  }
}
