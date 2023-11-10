import { useTranslation } from 'react-i18next'
import { FuncKeyShow } from '@common/keyMap'
import { Command } from 'cmdk'
import classes from '@renderer/assets/ClipKbd.module.scss'

const keyCodeMap =
  window.api.platform === 'darwin'
    ? {
        clip_copy: [FuncKeyShow.mac.enter],
        clip_copy_text: [FuncKeyShow.mac.command, FuncKeyShow.mac.enter],
        clip_copy_first_line: [FuncKeyShow.mac.command, '1'],
        clip_copy_first_line_text: [FuncKeyShow.mac.command, FuncKeyShow.mac.shift, '1'],
        clip_delete: [FuncKeyShow.mac.command, FuncKeyShow.mac.backspace],
        clip_clear: [FuncKeyShow.mac.command, FuncKeyShow.mac.shift, FuncKeyShow.mac.backspace],
        clip_top: [FuncKeyShow.mac.command, 'P'],
        clip_top_window: [FuncKeyShow.mac.command, FuncKeyShow.mac.shift, 'P']
      }
    : {
        clip_copy: [FuncKeyShow.windows.enter],
        clip_copy_text: [FuncKeyShow.windows.control, FuncKeyShow.windows.enter],
        clip_copy_first_line: [FuncKeyShow.windows.control, '1'],
        clip_copy_first_line_text: [FuncKeyShow.windows.control, FuncKeyShow.windows.shift, '1'],
        clip_delete: [FuncKeyShow.windows.control, FuncKeyShow.windows.backspace],
        clip_clear: [
          FuncKeyShow.windows.control,
          FuncKeyShow.windows.shift,
          FuncKeyShow.windows.backspace
        ],
        clip_top: [FuncKeyShow.windows.control, 'P'],
        clip_top_window: [FuncKeyShow.windows.control, FuncKeyShow.windows.shift, 'P']
      }
export default function ClipKbd(): JSX.Element {
  const { t } = useTranslation()
  const keyMap = [
    {
      name: t('clip_copy'),
      key: keyCodeMap['clip_copy']
    },
    {
      name: t('clip_copy_text'),
      key: keyCodeMap['clip_copy_text']
    },
    {
      name: t('clip_copy_first_line'),
      key: keyCodeMap['clip_copy_first_line']
    },
    {
      name: t('clip_copy_first_line_text'),
      key: keyCodeMap['clip_copy_first_line_text']
    },
    {
      name: t('clip_delete'),
      key: keyCodeMap['clip_delete']
    }
    // {
    //   name: t('clip_clear'),
    //   key: keyCodeMap['clip_clear']
    // },
    // {
    //   name: t('clip_top'),
    //   key: keyCodeMap['clip_top']
    // },
  ]

  return (
    <div className={classes.kbdmenu}>
      <Command>
        <Command.List>
          <Command.Group heading={t('clip_kbd')}>
            {keyMap.map((item) => {
              return (
                <SubItem key={item.name} shortcut={item.key}>
                  {item.name}
                </SubItem>
              )
            })}
          </Command.Group>
        </Command.List>
        <Command.Input autoFocus placeholder={t('clip_kbd_search_placeholder')} />
      </Command>
    </div>
  )
}

function SubItem({
  children,
  shortcut
}: {
  children: React.ReactNode
  shortcut: Array<string>
}): JSX.Element {
  return (
    <Command.Item>
      {children}
      <div className={classes.shortcuts}>
        {shortcut.map((key) => {
          return <kbd key={key}>{key}</kbd>
        })}
      </div>
    </Command.Item>
  )
}
