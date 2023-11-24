/**
 * 附件类型
 */
export const MimeTypes = {
  TXT: 'text/plain',
  HTML: 'text/html',
  IMG: 'image/png',
  RTF: 'text/rtf',
  MAC_FILE: 'text/uri-list'
}

/**
 * 搜索模式
 */
export const SearchModes = {
  ALL: 'all',
  REGEXP: 'regexp',
  TXT: 'text/plain',
  HTML: 'text/html',
  IMG: 'image/png',
  RTF: 'text/rtf'
}

export enum MemoryItemDescEnum {
  CLIP_IMG = 'clipImage',
  CLIP_IMG_THUMB = 'ClipImageThumbnail',
  CLIP_HTML = 'clipHtml',
  CLIP_RTF = 'clipRtf'
}

export enum ClipBoardContentType {
  text = 'text',
  html = 'html',
  image = 'image',
  rtf = 'rtf',
  bookmark = 'bookmark'
}

export enum MemoryItemContentType {
  text = 'text',
  html = 'html',
  image = 'image',
  rtf = 'rtf'
}

/**
 * 通知事件类型
 */
export enum EventTypes {
  CLIP_CHANGE = 'clip::change',
  CLIP_BLUR = 'clip::blur',
  UI_LANG_CHANGE = 'ui::langChange',
  SETTINGS_CHANGE = 'settings::change'
}

/**
 * renderer 与 main 通信的 api
 */
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
  SETTINGS_GET_ALL = 'settings::getAll',
  DARK_MODE_SET = 'darkMode::set',
  SETTINGS_LANGUAGE_SET = 'settings::languageSet'
}

export enum CommonDataTitle {
  SYSTEM_SETTINGS = 'system_settings'
}
