import { CommonDataTitle, EventTypes } from '@common/const'
import { getCommonData, saveCommonData } from '../core/db'
import { SettingsBO } from '@common/bo'

export function getAllConfig(): Promise<SettingsBO> {
  return new Promise<SettingsBO>((resolve) => {
    const settingsData = getCommonData(CommonDataTitle.SYSTEM_SETTINGS)
    console.log('settingsData', settingsData)
    if (settingsData) {
      resolve(SettingsBO.of(settingsData.data))
    } else {
      resolve(new SettingsBO())
    }
  })
}

export function saveAllConfig(): void {
  saveCommonData({
    title: CommonDataTitle.SYSTEM_SETTINGS,
    data: JSON.stringify(global.settings)
  })
  global.settings_win?.webContents.send(EventTypes.SETTINGS_CHANGE, global.settings)
}

export async function initSettings(): Promise<void> {
  const settings = await getAllConfig()
  console.log('settings - init ok', settings)
  global.settings = settings
}
