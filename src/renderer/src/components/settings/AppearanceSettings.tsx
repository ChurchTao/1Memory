import React, { useState } from 'react'
import {
  Group,
  Text,
  MantineColorScheme,
  Select,
  Stack,
  useMantineColorScheme
} from '@mantine/core'

const AppearanceSettings: React.FC = () => {
  const [theme, setTheme] = useState('auto')
  const { setColorScheme } = useMantineColorScheme()
  const handleThemeChange = (event: MantineColorScheme): void => {
    setTheme(event)
    setColorScheme(event)
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
