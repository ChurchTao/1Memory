import Realm, { BSON, ObjectSchema } from 'realm'
import { SchemaName } from './schema-name'

/**
 * 定义 realm 数据库中的 MemoryItem 表
 *
 */
class MemoryItem extends Realm.Object<MemoryItem> {
  _id!: BSON.ObjectId
  txt!: string
  createdAt!: Date
  types!: Realm.List<string>
  kewords!: Realm.List<string>

  static schema: ObjectSchema = {
    name: SchemaName.MemoryItem,
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      txt: { type: 'string', indexed: true },
      createdAt: { type: 'date', default: () => new Date() },
      types: { type: 'list', objectType: 'string' },
      kewords: { type: 'list', objectType: 'string' }
    }
  }
}

class Attachment extends Realm.Object<Attachment> {
  _id!: BSON.ObjectId
  memoryItemId!: BSON.ObjectId
  desc!: string
  contentType!: string
  data!: ArrayBuffer

  static schema: ObjectSchema = {
    name: SchemaName.Attachment,
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      memoryItemId: { type: 'objectId', indexed: true },
      desc: 'string',
      contentType: 'string',
      data: 'data'
    }
  }
}

export { MemoryItem, Attachment }
