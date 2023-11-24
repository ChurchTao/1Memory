import { ElectronAPI } from '@electron-toolkit/preload'
import { MemoryItemDetailVO, SettingsBO } from '@common/bo'

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
      }
      settings: {
        getAll(): Promise<SettingsBO>
        datkModeSet(darkMode: string): void
        languageSet(language: string): void
        onChange(callback: (event: SettingsBO) => void): void
      }
      clip: {
        getById(id: string): Promise<MemoryItemDetailVO>
        findByTxtLike(
          txt: string,
          type: string,
          pageNum: number,
          pageSize: number
        ): Promise<PageResult<MemoryItemListVO>>
        deleteById(id: string): void
        handleCopy(id: string): void
        handleCopyTxt(id: string): void
        onChange(callback: () => void): void
        onBlur(callback: () => void): void
        onUILanguageChange(callback: (event: string) => void): void
      }
    }
  }
}
