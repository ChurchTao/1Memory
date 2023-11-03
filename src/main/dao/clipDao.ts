import { EventTypes, MimeTypes } from '../../common/const'
import ClipItemDocDo from '../do/clipItemDocDo'
// import { DB_CLIP_ITEM_PREFIX } from '../../common/const'
/*
selector Defines a selector to filter the results. Required.
$lt Match fields “less than” this one.
$gt Match fields “greater than” this one.
$lte Match fields “less than or equal to” this one.
$gte Match fields “greater than or equal to” this one.
$eq Match fields equal to this one.
$ne Match fields not equal to this one.
$exists True if the field should exist, false otherwise.
$type One of: “null”, “boolean”, “number”, “string”, “array”, or “object”.
$in The document field must exist in the list provided.
$and Matches if all the selectors in the array match.
$nin The document field must not exist in the list provided.
$all Matches an array value if it contains all the elements of the argument array.
$size Special condition to match the length of an array field in a document.
$or Matches if any of the selectors in the array match. All selectors must use the same index.
$nor Matches if none of the selectors in the array match.
$not Matches if the given selector does not match.
$mod Matches documents where (field % Divisor == Remainder) is true, and only when the document field is an integer.
$regex A regular expression pattern to match against the document field.
$elemMatch Matches all documents that contain an array field with at least one element that matches all the specified query criteria.
fields (Optional) Defines a list of fields that you want to receive. If omitted, you get the full documents.
sort (Optional) Defines a list of fields defining how you want to sort. Note that sorted fields also have to be selected in the selector.
limit (Optional) Maximum number of documents to return.
skip (Optional) Number of docs to skip before returning.
use_index (Optional) Set which index to use for the query. It can be “design-doc-name” or “[‘design-doc-name’, ‘name’]”.
*/

export function saveClipItem(clipItemDocDo: ClipItemDocDo): void {
  const doc: ClipItemDoc = clipItemDocDo.toDoc()
  const db = global.clipDB
  if (doc.types.includes(MimeTypes.IMG)) {
    db.put(doc).then((result) => {
      console.log(result)
    })
    return
  }
  db.find({
    selector: {
      txt: { $eq: doc.txt }
    },
    limit: 1
  }).then((result) => {
    if (result.docs.length > 0) {
      result.docs[0].createdAt = Date.now()
      db.put(result.docs[0]).then((result) => {
        console.log(result)
      })
      return
    }
    db.put(doc)
      .then(function (result) {
        console.log(result)
      })
      .catch(function (err) {
        console.log(err)
      })
  })
}

export function getById(id: string): Promise<ClipItemDoc> {
  return global.clipDB.get(id)
}

export function getAttachmentByIdAndType(id: string, type: string): Promise<Buffer | Blob> {
  return global.clipDB.getAttachment(id, type)
}

/**
 * 前提条件：_id 以 DB_CLIP_ITEM_PREFIX 开头
 * @param txt
 * @param pageNum
 * @param pageSize
 * @returns
 */
export function findByTxtLike(
  txt: string,
  type: string,
  pageNum: number,
  pageSize: number
): Promise<ClipListRes> {
  const selector = {
    txt: { $regex: RegExp(txt, 'i') },
    createdAt: { $exists: true }
  }
  if (type && type !== 'all') {
    selector['types'] = { $in: [type] }
  }
  return global.clipDB.find({
    selector: selector,
    limit: pageSize,
    skip: (pageNum - 1) * pageSize,
    sort: [{ createdAt: 'desc' }]
  })
}

export function deleteById(id: string): void {
  const db = global.clipDB
  db.get(id).then((doc) => {
    db.remove(doc).then(() => {
      global.main_win?.webContents.send(EventTypes.CLIP_CHANGE, 'ok')
    })
  })
}

export function moveToTop(id: string): void {
  const db = global.clipDB
  db.get(id).then((doc) => {
    doc.createdAt = Date.now()
    db.put(doc)
  })
}

export function moveToTopByDoc(doc: ClipItemDoc): void {
  const db = global.clipDB
  doc.createdAt = Date.now()
  db.put(doc)
}
