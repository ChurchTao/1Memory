import { Popover } from '@mantine/core'
import ClipKbd from '@renderer/pages/ClipKbd'
import { useTranslation } from 'react-i18next'
import classes from '../../assets/ClipBottomBar.module.scss'
interface ClipBottomBarProps {
  size: number
  kbdOpened: boolean
  onKbdMenuOpen: () => void
  onKbdMenuClose: () => void
}

export default function ClipBottomBar(props: ClipBottomBarProps): JSX.Element {
  const { size, onKbdMenuOpen, onKbdMenuClose, kbdOpened } = props
  const { t } = useTranslation()
  return (
    <div className={classes.footer}>
      <span className={classes.left}>{t('clip_item_total', { total: size })}</span>
      <div className={classes.action}>
        {t('clip_copy')}
        <kbd>↵</kbd>
      </div>
      <hr />
      <Popover
        radius={8}
        position="top-end"
        offset={8}
        onOpen={onKbdMenuOpen}
        onClose={onKbdMenuClose}
        shadow="md"
        opened={kbdOpened}
        closeOnEscape
        closeOnClickOutside
      >
        <Popover.Target>
          <div
            className={classes.action}
            onMouseEnter={onKbdMenuOpen}
            onMouseLeave={onKbdMenuClose}
          >
            {t('clip_kbd')}
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </div>
        </Popover.Target>
        <Popover.Dropdown style={{ padding: 0 }}>
          <ClipKbd />
        </Popover.Dropdown>
      </Popover>
    </div>
  )
}
