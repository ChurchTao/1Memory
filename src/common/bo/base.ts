import { BSON } from 'realm'

class PageResult<T> {
  total!: number
  list!: T[]

  static empty<T>(): PageResult<T> {
    return new PageResult<T>()
  }

  static of<T>(total: number, list: T[]): PageResult<T> {
    const pageResult = new PageResult<T>()
    pageResult.total = total
    pageResult.list = list
    return pageResult
  }
}

class CommonDataBO {
  _id?: BSON.ObjectId
  title!: string
  data!: string
}

class CommonDataVO {
  _id!: string
  title!: string
  data!: string
}

export { PageResult, CommonDataBO, CommonDataVO }
