import { ipcMain, nativeTheme } from 'electron'
import { ControllerApi } from '../../common/const'
import { saveAllConfig } from '../service/settings-service'
import i18n from 'i18next'

export function initSettingsController(): void {
  ipcMain.handle(ControllerApi.SETTINGS_GET_ALL, async () => {
    return global.settings.toVO()
  })

  ipcMain.on(ControllerApi.DARK_MODE_SET, (_event, darkMode) => {
    // 判断 darkMode 是否 light dark 或者 system
    if (darkMode && darkMode !== 'light' && darkMode !== 'dark' && darkMode !== 'system') {
      darkMode = 'system'
    }
    // 设置系统主题
    nativeTheme.themeSource = darkMode
    global.settings.getGeneral().theme = darkMode
    saveAllConfig()
  })

  ipcMain.on(ControllerApi.SETTINGS_LANGUAGE_SET, (_event, language) => {
    // 判断 language 是否 zh en
    if (language && language !== 'zh' && language !== 'en') {
      language = 'zh'
    }
    i18n.changeLanguage(language)
    global.settings.getGeneral().language = language
    saveAllConfig()
  })
}
