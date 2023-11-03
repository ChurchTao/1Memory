import robot from '@jitsi/robotjs'
import { env } from './env'

export const keyUtil = {
  sleepMoment(): void {
    robot.setKeyboardDelay(20)
  },
  // 快捷键 ctrl + v
  ctrlV(): void {
    if (env.isMac()) {
      robot.keyTap('v', ['command'])
    } else {
      robot.keyTap('v', ['control'])
    }
  }
}
