// 控制程序配置的读写

import { DefaultDBIds } from '../../common/const'

/**
 * 保存配置
 */
export async function saveSettings(doc: BaseDoc): Promise<void> {
  const config = await getSettings()
  if (config) {
    doc._rev = config._rev
  }
  global.defaultDB
    .put(doc)
    .then(function (result) {
      console.log(result)
    })
    .catch(function (err) {
      console.log(err)
    })
}

/**
 * 获取配置
 */
export function getSettings(): Promise<BaseDoc> {
  return global.defaultDB.get(DefaultDBIds.SYSTEM_SETTINGS)
}
