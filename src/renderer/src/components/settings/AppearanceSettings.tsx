import React, { useState } from 'react'
import { Group, Text, Select, Stack, useMantineColorScheme } from '@mantine/core'

const AppearanceSettings: React.FC = () => {
  const [theme, setTheme] = useState('auto')
  const { setColorScheme } = useMantineColorScheme()
  const handleThemeChange = (event: string | null): void => {
    if (!event) {
      setColorScheme('auto')
      window.api.win.datkModeSet('system')
      return
    }
    setTheme(event)
    if (event === 'auto') {
      setColorScheme('auto')
      window.api.win.datkModeSet('system')
    } else if (event === 'light') {
      setColorScheme(event)
      window.api.win.datkModeSet('light')
    } else if (event === 'dark') {
      setColorScheme(event)
      window.api.win.datkModeSet('dark')
    }
  }
  return (
    <Stack>
      <Group gap={0}>
        <Text fz={'sm'}>主题：</Text>
        <Select
          w={120}
          id="theme"
          size="xs"
          value={theme}
          onChange={handleThemeChange}
          radius="md"
          data={[
            { value: 'auto', label: '跟随系统' },
            { value: 'light', label: '浅色' },
            { value: 'dark', label: '深色' }
          ]}
        />
      </Group>
    </Stack>
  )
}

export default AppearanceSettings
