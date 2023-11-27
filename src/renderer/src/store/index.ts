// 在 store.js 文件中
import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './settings'
import { SettingsBO } from '@common/bo'

const store = configureStore({
  reducer: {
    settings: settingsReducer
  }
})

export interface StoreState {
  settings: SettingsBO
}

export default store

export * from './settings'
