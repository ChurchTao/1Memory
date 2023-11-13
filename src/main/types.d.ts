/* eslint-disable no-var */
import { BrowserWindow } from 'electron'

declare global {
  var data_dir: string | undefined
  var ua: string // user agent
  var session_id: string // A random value, refreshed every time the app starts, used to identify different startup sessions.
  var main_win: BrowserWindow | null
  var settings_win: BrowserWindow | null
  var is_will_quit: boolean
  var clipDB: PouchDB.Database<ClipItemDoc>
  var defaultDB: PouchDB.Database<BaseDoc>
  var tary: Electron.Tray
}
