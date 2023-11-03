import path from 'path'
import fs from 'fs'
import PouchDB from 'pouchdb'
import { app } from 'electron'
PouchDB.plugin(require('pouchdb-find'))

export default class DB {
  private static instance: DB
  private dbpath: string
  private defaultDbName: string
  private clipDBName: string
  private pouchDB: PouchDB.Database<BaseDoc> | null
  private clipDB: PouchDB.Database<ClipItemDoc> | null

  private constructor() {
    const dbPath = app.getPath('userData')
    this.dbpath = dbPath
    this.defaultDbName = path.join(dbPath, '1memory_db')
    this.clipDBName = path.join(dbPath, '1memory_clip_db')
    this.pouchDB = null
    this.clipDB = null
  }

  private async init(): Promise<void> {
    console.log('init db=', this.dbpath)
    fs.existsSync(this.dbpath) || fs.mkdirSync(this.dbpath)
    this.pouchDB = new PouchDB(this.defaultDbName, { auto_compaction: true })
    this.clipDB = new PouchDB(this.clipDBName, { auto_compaction: true })
    const result = await this.clipDB.createIndex({
      index: { fields: ['createdAt', 'txt', 'types'] }
    })
    console.log('createIndex:', result)
  }

  static async getInstance(): Promise<DB> {
    if (!DB.instance) {
      DB.instance = new DB()
      await DB.instance.init()
      DB.instance.pouchDB?.info().then(function (info) {
        console.log('default db info:', info)
      })
      DB.instance.clipDB?.info().then(function (info) {
        console.log('clip db info:', info)
      })
    }
    return DB.instance
  }

  public getClipDB(): PouchDB.Database<ClipItemDoc> | null {
    return this.clipDB
  }

  public getDefalutDB(): PouchDB.Database<BaseDoc> | null {
    return this.pouchDB
  }
}
