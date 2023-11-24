import { clipboard } from 'electron'
import { EventTypes, MimeTypes } from '../../common/const/const'
import { saveMemory } from '../core/db'
import { ClipItemBO } from '@common/bo'

export default class ClipTimer {
  private static instance: ClipTimer = new ClipTimer()
  private lastClipBO: ClipItemBO | null
  private timer: NodeJS.Timeout | null
  constructor() {
    console.log('ClipTimer constructor')
    this.lastClipBO = null
    this.timer = null
  }

  public setLastClipDO(clipDO: ClipItemBO): void {
    this.lastClipBO = clipDO
  }

  public async startListen(): Promise<void> {
    if (this.timer) {
      return
    }
    console.log('startListen')
    this.timer = setInterval(() => {
      let formats = clipboard.availableFormats()
      if (formats.length === 0) {
        return
      }
      // 移除 MimeTypes 中没有的fomart
      formats = formats.filter((item) => {
        return Object.values(MimeTypes).includes(item)
      })
      if (formats.length === 0) {
        return
      }
      const clipDO: ClipItemBO = new ClipItemBO()
      clipDO.setTypes(formats)

      if (formats.includes(MimeTypes.TXT)) {
        const text = clipboard.readText()
        clipDO.setTxt(text)
      }
      if (formats.includes(MimeTypes.IMG)) {
        const img = clipboard.readImage()
        const buffer = img.toPNG()
        clipDO.setImg(img)
        clipDO.putImageToAttachments(buffer)
      }
      if (formats.includes(MimeTypes.HTML)) {
        const html: string = clipboard.readHTML()
        const buffer: Buffer = Buffer.from(html)
        clipDO.putHtmlToAttachments(buffer)
      }
      if (formats.includes(MimeTypes.RTF)) {
        const rtf = clipboard.readRTF()
        const buffer: Buffer = Buffer.from(rtf)
        clipDO.putRTFToAttachments(buffer)
      }
      if (formats.includes(MimeTypes.MAC_FILE)) {
        // const files = clipboardFiles.readFiles()
        // console.log('files:', files)
        return
      }

      // 如果不是图片，且没有文本，不保存
      if (!formats.includes(MimeTypes.IMG) && formats.includes(MimeTypes.TXT)) {
        // 除去空格 换行符,如果为空，则不保存
        if (!clipDO.txt) {
          return
        }
        const text = clipDO.txt.replace(/\s/g, '')
        if (text === '') {
          return
        }
      }

      // 比较剪贴板内容是否变化
      if (this.lastClipBO && this.lastClipBO.equals(clipDO)) {
        return
      }

      // desktopCapturer
      //   .getSources({
      //     types: ['window'],
      //     thumbnailSize: {
      //       width: 0,
      //       height: 0
      //     },
      //     fetchWindowIcons: true
      //   })
      //   .then(async (sources) => {
      //     console.log('sources:', sources)
      //   })

      // 制作缩略图
      clipDO.makeThumbnail()
      const memoryItem = clipDO.toMemoryItem()
      console.log('memoryItem:', memoryItem)
      saveMemory(memoryItem.memoryItem, memoryItem.attachments)
      this.lastClipBO = clipDO
      global.main_win?.webContents.send(EventTypes.CLIP_CHANGE, 'ok')
    }, 3000)
  }

  public stopListen(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  static getInstance(): ClipTimer {
    return ClipTimer.instance
  }
}
