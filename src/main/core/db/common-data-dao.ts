import { CommonDataBO, CommonDataVO } from '@common/bo'
import { CommonData } from '@common/model'

/**
 * 通用数据读写
 */

/**
 * 写入
 * 如果存在则更新, 不存在则创建
 * @param data
 */
function save(data: CommonDataBO): void {
  global.realm?.write(() => {
    if (!global.realm) {
      return
    }
    const title = data.title
    const existCommonData = global.realm.objects(CommonData).filtered(`title == $0`, title)
    if (existCommonData.length) {
      const commonData = existCommonData.at(0)!
      commonData.data = data.data
      return
    } else {
      global.realm.create(CommonData, data)
    }
  })
}

function get(title: string): CommonDataVO | null {
  if (global.realm) {
    const existCommonData = global.realm.objects(CommonData).filtered(`title == $0`, title)
    if (existCommonData.length) {
      const commonData = existCommonData.at(0)!
      return {
        _id: commonData._id.toString(),
        title: commonData.title,
        data: commonData.data
      }
    }
  }
  return null
}

export { save as saveCommonData, get as getCommonData }
