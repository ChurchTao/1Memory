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
import { useTranslation } from 'react-i18next'
import { SettingsBO } from '@common/bo'
import { useDispatch } from 'react-redux'
import { updateLanguage, updateTheme } from '@renderer/store'

interface GeneralSettingsProps {
  settings: SettingsBO | null
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings }) => {
  const dispatch = useDispatch()
  const { setColorScheme } = useMantineColorScheme()
  const [openOnLogin, setOpenOnLogin] = useState(settings?.general.autoLaunch)
  const [language, setLanguage] = useState(settings?.general.language)
  const [theme, setTheme] = useState(settings?.general.theme)
  const { t } = useTranslation()
  const handleThemeChange = (event: string): void => {
    if (!event) {
      return
    }
    if (event === 'system') {
      setTheme(event)
      setColorScheme('auto')
    } else if (event === 'light') {
      setTheme(event)
      setColorScheme(event)
    } else if (event === 'dark') {
      setTheme(event)
      setColorScheme(event)
    }
    dispatch(updateTheme(event))
  }

  const handleOpenOnLoginChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOpenOnLogin(event.target.checked)
  }

  const handleLanguageChange = (event: string | null): void => {
    if (!event) {
      return
    }
    setLanguage(event)
    dispatch(updateLanguage(event))
  }

  return (
    <Stack>
      <Checkbox
        id="open-on-login"
        checked={openOnLogin}
        onChange={handleOpenOnLoginChange}
        label={t('settings_general_auto_launch')}
        size="xs"
        classNames={{ label: classes.label }}
      />
      <Group gap={0}>
        <Text fz={'sm'}>{t('settings_general_language')}：</Text>
        <Select
          w={90}
          size="xs"
          radius="md"
          id="language"
          value={language}
          onChange={handleLanguageChange}
          data={[
            { value: 'en', label: 'English' },
            { value: 'zh', label: '简体中文' }
          ]}
        />
      </Group>
      <Group gap={0}>
        <Text fz={'sm'}>{t('settings_general_theme')}：</Text>
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
              value: 'system',
              label: '跟随系统'
            }
          ]}
        />
      </Group>
    </Stack>
  )
}

export default GeneralSettings
