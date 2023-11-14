import {
  Box,
  Center,
  Checkbox,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
  rem,
  useMantineColorScheme
} from '@mantine/core'
import React, { useState } from 'react'
import classes from '../../assets/Settings.module.scss'
import { IconMoon, IconSun } from '@tabler/icons-react'
const GeneralSettings: React.FC = () => {
  const [openOnLogin, setOpenOnLogin] = useState(true)
  const [language, setLanguage] = useState('en')
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

  const handleOpenOnLoginChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOpenOnLogin(event.target.checked)
  }

  const handleLanguageChange = (event: string | null): void => {
    if (!event) {
      return
    }
    setLanguage(event)
  }

  return (
    <Stack>
      <Checkbox
        id="open-on-login"
        checked={openOnLogin}
        onChange={handleOpenOnLoginChange}
        label="开机时启动"
        size="xs"
        classNames={{ label: classes.label }}
      />
      <Group gap={0}>
        <Text fz={'sm'}>语言：</Text>
        <Select
          w={90}
          size="xs"
          radius="md"
          id="language"
          value={language}
          onChange={handleLanguageChange}
          data={[
            { value: 'en', label: 'English' },
            { value: 'zh', label: '中文' }
          ]}
        />
      </Group>
      <Group gap={0}>
        <Text fz={'sm'}>主题：</Text>
        <SegmentedControl
          onChange={handleThemeChange}
          value={theme}
          data={[
            {
              value: 'light',
              label: (
                <Center>
                  <IconSun style={{ width: rem(16), height: rem(16) }} />
                  <Box ml={10}>浅色</Box>
                </Center>
              )
            },
            {
              value: 'dark',
              label: (
                <Center>
                  <IconMoon style={{ width: rem(16), height: rem(16) }} />
                  <Box ml={10}>深色</Box>
                </Center>
              )
            },
            {
              value: 'auto',
              label: '跟随系统'
            }
          ]}
        />
      </Group>
    </Stack>
  )
}

export default GeneralSettings
