import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      platform: NodeJS.Platform
      win: {
        openWin(name: string): void
        closeWin(name: string): void
        pin(name: string, pin: boolean): void
        setSize(name: string, width: number, height: number): void
        datkModeSet(darkMode: string): void
      }
      clip: {
        getById(id: string): Promise<ClipItemDocVO>
        findByTxtLike(
          txt: string,
          type: string,
          pageNum: number,
          pageSize: number
        ): Promise<ClipItemDocVO[]>
        deleteById(id: string): void
        handleCopy(id: string): void
        handleCopyTxt(id: string): void
        onChange(callback: () => void): void
        onBlur(callback: () => void): void
      }
    }
  }
}
