import { Checkbox, Text, Group, Select, Stack } from '@mantine/core'
import React, { useState } from 'react'
const GeneralSettings: React.FC = () => {
  const [openOnLogin, setOpenOnLogin] = useState(true)
  const [language, setLanguage] = useState('en')

  const handleOpenOnLoginChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOpenOnLogin(event.target.checked)
  }

  const handleLanguageChange = (event: string): void => {
    setLanguage(event)
  }

  return (
    <Stack>
      <Checkbox
        id="open-on-login"
        checked={openOnLogin}
        onChange={handleOpenOnLoginChange}
        label="开机时启动"
      />
      <Group gap={0}>
        <Text fz={'sm'}>语言：</Text>
        <Select
          w={120}
          size="xs"
          id="language"
          value={language}
          onChange={handleLanguageChange}
          data={[
            { value: 'en', label: 'English' },
            { value: 'zh', label: '中文' }
          ]}
          radius="md"
        />
      </Group>
    </Stack>
  )
}

export default GeneralSettings
