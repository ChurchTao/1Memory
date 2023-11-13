export const MimeTypes = {
  TXT: 'text/plain',
  HTML: 'text/html',
  IMG: 'image/png',
  RTF: 'text/rtf',
  MAC_FILE: 'text/uri-list'
}

export const SearchModes = {
  ALL: 'all',
  REGEXP: 'regexp',
  TXT: 'text/plain',
  HTML: 'text/html',
  IMG: 'image/png',
  RTF: 'text/rtf'
}

export enum ClipAttachMentTypes {
  IMG = 'image',
  IMG_THUMB = 'thumbnail',
  HTML = 'html',
  RTF = 'rtf',
  MAC_FILE = 'mac_file'
}

export enum EventTypes {
  CLIP_CHANGE = 'clip::change',
  CLIP_BLUR = 'clip::blur'
}

export enum ControllerApi {
  CLIP_GET_BY_ID = 'clip::getById',
  CLIP_FIND_BY_TXT_LIKE = 'clip::findByTxtLike',
  CLIP_DELETE_BY_ID = 'clip::deleteById',
  CLIP_HANDLE_COPY = 'clip::handleCopy',
  CLIP_HANDLE_COPY_TXT = 'clip::handleCopyTxt',
  WIN_SET_SIZE = 'win::setSize',
  WIN_SET_PIN = 'win::setPin',
  WIN_CLOSE = 'win::close',
  WIN_OPEN = 'win::open',
  DARK_MODE_SET = 'darkMode::set'
}

export const DB_CLIP_ITEM_PREFIX = 'ci_'
