import { EventTypes } from '../../common/const'
import { saveSettings, getSettings } from '../dao/settings-dao'
import SettingsDO from '../do/settings-do'

export function getAllConfig(): Promise<SettingsDO> {
  return new Promise<SettingsDO>((resolve) => {
    getSettings()
      .then((doc) => {
        const settings = new SettingsDO()
        settings.fromDoc(doc)
        resolve(settings)
      })
      .catch(() => {
        resolve(new SettingsDO())
      })
  })
}

export function saveAllConfig(): void {
  saveSettings(global.settings.toDoc())
  global.settings_win?.webContents.send(EventTypes.SETTINGS_CHANGE, global.settings.toVO())
}

export async function initSettings(): Promise<void> {
  const settings = await getAllConfig()
  console.log('settings - init ok', settings)
  global.settings = settings
}
