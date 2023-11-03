import { HoverCard } from '@mantine/core'
import ClipKbd from '@renderer/pages/ClipKbd'
import { useTranslation } from 'react-i18next'
import classes from '../../assets/ClipBottomBar.module.scss'
interface ClipBottomBarProps {
  size: number
  onKbdMenuOpen: () => void
  onKbdMenuClose: () => void
}

export default function ClipBottomBar(props: ClipBottomBarProps): JSX.Element {
  const { size, onKbdMenuOpen, onKbdMenuClose } = props
  const { t } = useTranslation()
  return (
    <div className={classes.footer}>
      <span className={classes.left}>{t('clip_item_total', { total: size })}</span>
      <div className={classes.action}>
        Copy
        <kbd>↵</kbd>
      </div>
      <hr />
      <HoverCard
        closeDelay={200}
        radius={8}
        position="top-end"
        offset={8}
        onOpen={onKbdMenuOpen}
        onClose={onKbdMenuClose}
        shadow="md"
      >
        <HoverCard.Target>
          <div className={classes.action}>
            {t('clip_kbd')}
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown style={{ padding: 0 }}>
          <ClipKbd />
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  )
}
