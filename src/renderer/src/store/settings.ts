import { createSlice } from '@reduxjs/toolkit'
import { changeLanguage } from '@renderer/common/i18n'

const settings = await window.api.settings.getAll()
// 定义初始状态
const initialState = settings

// 创建 slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings(state, action) {
      state = action.payload
    },
    updateLanguage(state, action) {
      state.general.language = action.payload
      window.api.settings.languageSet(action.payload)
      changeLanguage(action.payload)
    },
    updateTheme(state, action) {
      state.general.theme = action.payload
      window.api.settings.datkModeSet(action.payload)
    },
    updateAutoLaunch(state, action) {
      state.general.autoLaunch = action.payload
      window.api.settings.autoLaunchSet(action.payload)
    },
    updateClipBoardSettings(state, action) {
      state.clip = action.payload
      window.api.settings.clipboardSet(action.payload)
    }
  }
})

export const {
  updateSettings,
  updateLanguage,
  updateTheme,
  updateAutoLaunch,
  updateClipBoardSettings
} = settingsSlice.actions

export default settingsSlice.reducer
