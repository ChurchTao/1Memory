import { app, ipcMain, nativeTheme } from 'electron'
import { ControllerApi } from '../../common/const/const'
import { saveAllConfig } from '../service/settings-service'
import i18n from 'i18next'

export function initSettingsController(): void {
  ipcMain.handle(ControllerApi.SETTINGS_GET_ALL, async () => {
    return global.settings
  })

  ipcMain.on(ControllerApi.DARK_MODE_SET, (_event, darkMode) => {
    // 判断 darkMode 是否 light dark 或者 system
    if (darkMode && darkMode !== 'light' && darkMode !== 'dark' && darkMode !== 'system') {
      darkMode = 'system'
    }
    // 设置系统主题
    nativeTheme.themeSource = darkMode
    global.settings.general.theme = darkMode
    saveAllConfig()
  })

  ipcMain.on(ControllerApi.SETTINGS_LANGUAGE_SET, (_event, language) => {
    // 判断 language 是否 zh en
    if (language && language !== 'zh' && language !== 'en') {
      language = 'zh'
    }
    i18n.changeLanguage(language)
    global.settings.general.language = language
    saveAllConfig()
  })

  ipcMain.on(ControllerApi.SETTINGS_AUTO_LAUNCH_SET, (_event, autoLaunch) => {
    app.setLoginItemSettings({
      openAtLogin: autoLaunch
    })
    global.settings.general.autoLaunch = autoLaunch
    saveAllConfig()
  })

  ipcMain.on(ControllerApi.SETTINGS_CLIPBOARD_SET, (_event, payload) => {
    console.log('payload', payload)
    global.settings.clip = payload
    saveAllConfig()
  })
}
