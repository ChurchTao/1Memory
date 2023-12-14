import React, { useState } from 'react'
import { Select, Text, Stack, Checkbox, Group } from '@mantine/core'
import ShortcutInput from '../child/ShortcutInput'
import { SettingsBO } from '@common/bo'
import classes from '../../assets/Settings.module.scss'
import { updateClipBoardSettings } from '@renderer/store'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

interface ClipboardSettingsProps {
  settings: SettingsBO | null
}

const ClipboardSettings: React.FC<ClipboardSettingsProps> = ({ settings }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [enableClipboardListener, setEnableClipboardListener] = useState(
    settings?.clip.enableClipboardListener
  )
  const [maxRecords, setMaxRecords] = useState(settings?.clip.maxRecords)
  const [maxDays, setMaxDays] = useState(settings?.clip.maxDays)
  const [copyNotification, setCopyNotification] = useState(settings?.clip.copyNotification)
  const [shortcut, setShortcut] = useState(settings?.clip.shortcut)

  const handleEnableClipboardListenerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEnableClipboardListener(event.target.checked)
    dispatch(
      updateClipBoardSettings({
        ...settings?.clip,
        enableClipboardListener: event.target.checked
      })
    )
  }

  const handleMaxRecordsChange = (event: string | null): void => {
    if (!event) {
      return
    }
    setMaxRecords(parseInt(event))
    dispatch(
      updateClipBoardSettings({
        ...settings?.clip,
        maxRecords: parseInt(event)
      })
    )
  }

  const handleMaxDaysChange = (event: string | null): void => {
    if (!event) {
      return
    }
    setMaxDays(parseInt(event))
    dispatch(
      updateClipBoardSettings({
        ...settings?.clip,
        maxDays: parseInt(event)
      })
    )
  }

  const handleCopyNotificationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCopyNotification(event.currentTarget.checked)
    dispatch(
      updateClipBoardSettings({
        ...settings?.clip,
        copyNotification: event.currentTarget.checked
      })
    )
  }

  const handleShortcutChange = (event: string): void => {
    setShortcut(event)
    dispatch(
      updateClipBoardSettings({
        ...settings?.clip,
        shortcut: event
      })
    )
  }

  const maxRecordsString = maxRecords?.toString()
  const maxDaysString = maxDays?.toString()

  return (
    <Stack>
      <Checkbox
        id="clipboard-listener"
        checked={enableClipboardListener}
        onChange={handleEnableClipboardListenerChange}
        label={t('settings_clip_enableClipboardListener')}
        size="xs"
        classNames={{ label: classes.label }}
      />
      <Checkbox
        id="copy-notification"
        checked={copyNotification}
        onChange={handleCopyNotificationChange}
        label={t('settings_clip_maxRecords')}
        size="xs"
        classNames={{ label: classes.label }}
      />
      <Group gap={0}>
        <Text size="sm">{t('settings_clip_maxDays')}：</Text>
        <Select
          w={110}
          size="sm"
          radius="md"
          id="maxRecords"
          value={maxRecordsString}
          onChange={handleMaxRecordsChange}
          data={[
            { value: '100', label: '100' },
            { value: '200', label: '200' },
            { value: '500', label: '500' },
            { value: '1000', label: '1000' },
            { value: '-1', label: '无限' }
          ]}
        />
      </Group>
      <Group gap={0}>
        <Text size="sm">{t('settings_clip_copyNotification')}：</Text>
        <Select
          w={110}
          size="sm"
          radius="md"
          id="maxDays"
          value={maxDaysString}
          onChange={handleMaxDaysChange}
          data={[
            { value: '7', label: '7' },
            { value: '30', label: '30' },
            { value: '90', label: '90' },
            { value: '-1', label: '永久' }
          ]}
        />
      </Group>
      <Group gap={0}>
        <Text size="sm">{t('settings_clip_shortcut')}：</Text>
        <ShortcutInput
          value={shortcut || ''}
          onChange={handleShortcutChange}
          onClear={(): void => {
            setShortcut('')
            handleShortcutChange('')
          }}
          w={200}
        />
      </Group>
    </Stack>
  )
}

export default ClipboardSettings
