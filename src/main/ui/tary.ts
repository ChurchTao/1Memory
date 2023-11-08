import { Menu, Tray, app, nativeImage } from 'electron'
import appIcon from '../../../resources/tary_16x16@2x.png?asset'
// import copyIcon from '../../../resources/copy.png?asset'
import i18n from '../../common/i18n/index'
import { platform } from '@electron-toolkit/utils'

export function createTary(): void {
  if (platform.isMacOS) {
    app.dock.hide()
  }
  const icon = nativeImage.createFromPath(appIcon)
  // const icon_clip = nativeImage.createFromPath(copyIcon).resize({ width: 16, height: 16 })
  const tray = new Tray(icon)
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
