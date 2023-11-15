import React, { useEffect, useState } from 'react'
import GeneralSettings from '../components/settings/GeneralSettings'
import ClipboardSettings from '../components/settings/ClipboardSettings'
import AboutSettings from '../components/settings/AboutSettings'
import SettingsTab from '../components/settings/SettingsTab'
import {
  IconSettings,
  IconClipboard,
  IconCode
  // IconFingerprint,
  // IconShirt,
} from '@tabler/icons-react'
import { Box, Divider, Flex, Stack, Image } from '@mantine/core'
import DeveloperSettings from '@renderer/components/settings/DeveloperSettings'
import classes from '@renderer/assets/Settings.module.scss'
import aboutLogo from '@renderer/assets/image/about_logo32x32@2x.png'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SettingsVO | null>(null)

  const handleTabClick = (tab: string): void => {
    setActiveTab(tab)
  }

  useEffect(() => {
    window.api.settings.getAll().then((settings) => {
      console.log(settings)
      setSettings(settings)
    })
  }, [])

  return (
    <>
      <Flex className="settings-page" h={'100vh'}>
        <Box w="36%" p={20} className={classes.left}>
          <Stack gap={4}>
            <SettingsTab
              title="通用"
              color="blue"
              icon={<IconSettings size={20} />}
              isActive={activeTab === 'general'}
              onClick={(): void => handleTabClick('general')}
            />
            {/* <SettingsTab
              title="外观"
              color="pink"
              icon={<IconShirt size={20} />}
              isActive={activeTab === 'appearance'}
              onClick={(): void => handleTabClick('appearance')}
            /> */}
            {/* <SettingsTab
              title="安全"
              color="yellow"
              icon={<IconFingerprint size={20} />}
              isActive={activeTab === 'security'}
              onClick={(): void => handleTabClick('security')}
            /> */}
            <SettingsTab
              title="剪贴板"
              color="pink"
              icon={<IconClipboard size={20} />}
              isActive={activeTab === 'clipboard'}
              onClick={(): void => handleTabClick('clipboard')}
            />
            <Divider my="sm" />
            <SettingsTab
              title="开发者"
              color="yellow"
              icon={<IconCode size={20} />}
              isActive={activeTab === 'developer'}
              onClick={(): void => handleTabClick('developer')}
            />
            <SettingsTab
              title="关于"
              color="indigo"
              icon={<Image src={aboutLogo} w={28} h={28} />}
              isActive={activeTab === 'about'}
              onClick={(): void => handleTabClick('about')}
            />
          </Stack>
        </Box>
        <Divider orientation="vertical" />
        {settings && (
          <Box w="64%" px={20} py={30}>
            {activeTab === 'general' && <GeneralSettings settings={settings} />}
            {activeTab === 'clipboard' && <ClipboardSettings />}
            {activeTab === 'about' && <AboutSettings />}
            {activeTab === 'developer' && <DeveloperSettings />}
          </Box>
        )}
      </Flex>
    </>
  )
}

export default Settings
