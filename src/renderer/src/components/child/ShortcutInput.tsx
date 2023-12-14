// 设计一个快捷键输入框，用于设置快捷键
// 包含输入框，清除按钮
// 输入框的值为快捷键的字符串，如：ctrl+shift+alt+a
// 清除按钮点击后，清除输入框的值

import { CloseButton, Input } from '@mantine/core'
import { IconKeyboard } from '@tabler/icons-react'
import hotkeys from 'hotkeys-js'
import { useRef, useState } from 'react'
import { specialKeyCodeNameMap, modifierKeyCodeMap, FuncKeyShow } from '@common/const'
import { Key } from 'ts-key-enum'
import classes from '../../assets/ShortcutInput.module.scss'

interface ShortcutInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  w: number
}

export default function ShortcutInput(props: ShortcutInputProps): JSX.Element {
  const { value, onChange, onClear, ...others } = props
  let initValue = ''
  if (value) {
    initValue = value
      .split('+')
      .map((item) => trans2KeyStr(item))
      .join('')
  }
  const ref = useRef(null)
  const [shortcut, setShortcut] = useState(initValue)

  function startListen(): void {
    hotkeys.filter = (): boolean => true
    hotkeys.unbind('*')
    hotkeys('*', (evn: KeyboardEvent) => {
      evn.preventDefault()
      const codes = hotkeys.getPressedKeyCodes()
      const names = checkKeyMapValid(codes)
      if (names.length === 0) {
        return
      }
      setShortcut(getShortCutShow(codes))
      onChange(names.join('+'))
    })
  }

  function stopListen(): void {
    hotkeys.unbind('*')
  }

  function handleClear(): void {
    setShortcut('')
    onClear()
  }

  return (
    <Input
      ref={ref}
      onFocus={startListen}
      onBlur={stopListen}
      placeholder="请输入快捷键"
      value={shortcut}
      variant="filled"
      radius="md"
      classNames={{
        input: classes.shortcutInput
      }}
      onChange={(e): void => e.preventDefault()}
      leftSection={<IconKeyboard size={20} stroke={1.2} />}
      rightSectionPointerEvents="all"
      rightSection={
        <CloseButton
          radius="md"
          aria-label="Clear input"
          onClick={handleClear}
          style={{ display: shortcut ? undefined : 'none' }}
        />
      }
      {...others}
    />
  )
}

function checkKeyMapValid(keyCodeArr: number[]): string[] {
  if (keyCodeArr.length < 2) {
    return []
  }
  keyCodeArr = keyCodeArr.sort((a, b) => a - b)
  const modifier: string[] = []
  let keyStr = ''
  let normalKey = ''
  keyCodeArr.forEach((keyCode) => {
    if (modifierKeyCodeMap[keyCode]) {
      modifier.push(trans2KeyName(modifierKeyCodeMap[keyCode]))
    } else if (specialKeyCodeNameMap[keyCode]) {
      keyStr = specialKeyCodeNameMap[keyCode]
    } else {
      normalKey = String.fromCharCode(keyCode).toUpperCase()
    }
  })
  if (modifier.length === 0) {
    return []
  }
  // 若只有modifier，不显示
  if (keyStr === '' && normalKey === '') {
    return []
  }
  if (keyStr) {
    modifier.push(keyStr)
  }
  if (normalKey) {
    modifier.push(normalKey)
  }
  return modifier
}

function getShortCutShow(keyCodeArr: number[]): string {
  keyCodeArr = keyCodeArr.sort((a, b) => a - b)
  let keyStr = ''
  let modifier = ''
  let normalKey = ''
  keyCodeArr.forEach((keyCode) => {
    if (modifierKeyCodeMap[keyCode]) {
      modifier += trans2KeyStr(modifierKeyCodeMap[keyCode])
    } else if (specialKeyCodeNameMap[keyCode]) {
      keyStr = trans2KeyStr(specialKeyCodeNameMap[keyCode])
    } else {
      normalKey = String.fromCharCode(keyCode).toUpperCase()
    }
  })
  return modifier + keyStr + normalKey
}

function trans2KeyName(key: string): string {
  if (!key) {
    return ''
  }
  if (window.api.platform === 'darwin') {
    switch (key) {
      case Key.Meta:
        return 'Command'
      case Key.Control:
        return 'Control'
      case Key.Alt:
        return 'Option'
      default:
        return key
    }
  }
  return key
}

function trans2KeyStr(key: string): string {
  if (!key) {
    return ''
  }
  if (window.api.platform === 'darwin') {
    switch (key) {
      case 'Command':
      case Key.Meta:
        return FuncKeyShow.mac.command
      case Key.Control:
        return FuncKeyShow.mac.control
      case 'Option':
      case Key.Alt:
        return FuncKeyShow.mac.option
      case Key.Shift:
        return FuncKeyShow.mac.shift
      case 'Space':
        return '空格'
      default:
        return key
    }
  } else {
    switch (key) {
      case Key.Meta:
        return FuncKeyShow.windows.command
      case Key.Control:
        return FuncKeyShow.windows.control
      case Key.Alt:
        return FuncKeyShow.windows.alt
      case Key.Shift:
        return FuncKeyShow.windows.shift
      case 'Space':
        return '空格'
      default:
        return key
    }
  }
}
