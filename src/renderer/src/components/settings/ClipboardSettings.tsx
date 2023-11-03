import React, { useState } from 'react'
import { Switch, Select, Box, InputWrapper, keys } from '@mantine/core'
import ShortcutInput from '../child/ShortcutInput'

const ClipboardSettings: React.FC = () => {
  const [enableClipboardListener, setEnableClipboardListener] = useState(true)
  const [maxRecords, setMaxRecords] = useState('50')
  const [maxDays, setMaxDays] = useState('7')
  const [copyNotification, setCopyNotification] = useState(true)
  const [shortcut, setShortcut] = useState('')

  const handleEnableClipboardListenerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEnableClipboardListener(event.target.checked)
  }

  const handleMaxRecordsChange = (event: string): void => {
    setMaxRecords(event)
  }

  const handleMaxDaysChange = (event: string): void => {
    setMaxDays(event)
  }

  const handleCopyNotificationChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCopyNotification(event.currentTarget.checked)
  }

  return (
    <Box pt={4} pl={2}>
      <InputWrapper label="Enable clipboard listener">
        <Switch checked={enableClipboardListener} onChange={handleEnableClipboardListenerChange} />
      </InputWrapper>

      <InputWrapper label="Shortcut key">
        <ShortcutInput
          value={shortcut}
          onChange={(keys): void => {
            console.log(keys)
          }}
          onClear={(): void => {
            setShortcut('')
          }}
          w={200}
        />
      </InputWrapper>

      <InputWrapper label="Max records">
        <Select
          value={maxRecords}
          onChange={handleMaxRecordsChange}
          data={[
            { value: '10', label: '10' },
            { value: '20', label: '20' },
            { value: '30', label: '30' },
            { value: '40', label: '40' },
            { value: '50', label: '50' }
          ]}
        ></Select>
      </InputWrapper>

      <InputWrapper label="Max days">
        <Select
          value={maxDays}
          onChange={handleMaxDaysChange}
          data={[
            { value: '7', label: '7' },
            { value: '14', label: '14' },
            { value: '30', label: '30' },
            { value: '60', label: '60' },
            { value: '90', label: '90' }
          ]}
        ></Select>
      </InputWrapper>

      <InputWrapper label="Copy notification">
        <Switch checked={copyNotification} onChange={handleCopyNotificationChange} />
      </InputWrapper>
    </Box>
  )
}

export default ClipboardSettings
