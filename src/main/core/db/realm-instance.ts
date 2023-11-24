import { MemoryItem, Attachment, CommonData } from '@common/model'
import { app } from 'electron'
import path from 'path'
import Realm from 'realm'

export default class RealmInstance {
  private static instance: RealmInstance = new RealmInstance()
  private realmPromise: Promise<Realm>

  private constructor() {
    this.realmPromise = this.init()
  }

  private init(): Promise<Realm> {
    const dbPath = app.getPath('userData')
    return Realm.open({
      path: path.join(dbPath, '1memory.realm'),
      schema: [MemoryItem, Attachment, CommonData],
      schemaVersion: 1
    })
  }

  public static getInstance(): RealmInstance {
    return RealmInstance.instance
  }

  public async getRealm(): Promise<Realm> {
    return this.realmPromise
  }
}
