import Realm, { BSON, ObjectSchema } from 'realm'
import { SchemaName } from './schema-name'

class CommonData extends Realm.Object<CommonData> {
  _id!: BSON.ObjectId
  title!: string
  data!: string

  static schema: ObjectSchema = {
    name: SchemaName.CommonData,
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      title: { type: 'string', indexed: true },
      data: 'string'
    }
  }
}

export { CommonData }
