import React, { useState } from 'react'
import GeneralSettings from '../components/settings/GeneralSettings'
import ClipboardSettings from '../components/settings/ClipboardSettings'
import AboutSettings from '../components/settings/AboutSettings'
import SettingsTab from '../components/settings/SettingsTab'
import {
  IconSettings,
  IconClipboard,
  IconCat,
  IconCode,
  IconFingerprint,
  IconShirt
} from '@tabler/icons-react'
import { Box, Divider, Flex, Stack } from '@mantine/core'
import AppearanceSettings from '@renderer/components/settings/AppearanceSettings'
import SecuritySettings from '@renderer/components/settings/SecuritySettings'
import DeveloperSettings from '@renderer/components/settings/DeveloperSettings'
import classes from '@renderer/assets/Settings.module.css'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')

  const handleTabClick = (tab: string): void => {
    setActiveTab(tab)
  }

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
            <SettingsTab
              title="外观"
              color="pink"
              icon={<IconShirt size={20} />}
              isActive={activeTab === 'appearance'}
              onClick={(): void => handleTabClick('appearance')}
            />
            <SettingsTab
              title="安全"
              color="yellow"
              icon={<IconFingerprint size={20} />}
              isActive={activeTab === 'security'}
              onClick={(): void => handleTabClick('security')}
            />
            <SettingsTab
              title="剪贴板"
              color="cyan"
              icon={<IconClipboard size={20} />}
              isActive={activeTab === 'clipboard'}
              onClick={(): void => handleTabClick('clipboard')}
            />
            <Divider my="sm" />
            <SettingsTab
              title="开发者"
              color="teal"
              icon={<IconCode size={20} />}
              isActive={activeTab === 'developer'}
              onClick={(): void => handleTabClick('developer')}
            />
            <SettingsTab
              title="关于"
              color="blue"
              icon={<IconCat size={20} />}
              isActive={activeTab === 'about'}
              onClick={(): void => handleTabClick('about')}
            />
          </Stack>
        </Box>
        <Divider orientation="vertical" />
        <Box w="64%" px={20} py={30}>
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'clipboard' && <ClipboardSettings />}
          {activeTab === 'about' && <AboutSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'developer' && <DeveloperSettings />}
        </Box>
      </Flex>
    </>
  )
}

export default Settings
