/* eslint-disable no-var */
import { SettingsBO } from '@common/bo'
import { BrowserWindow } from 'electron'

import Realm from 'realm'

declare global {
  var data_dir: string | undefined
  var ua: string // user agent
  var session_id: string // A random value, refreshed every time the app starts, used to identify different startup sessions.
  var main_win: BrowserWindow | null
  var settings_win: BrowserWindow | null
  var is_will_quit: boolean
  var settings: SettingsBO
  var tary: Electron.Tray
  var realm: Realm | null
}
