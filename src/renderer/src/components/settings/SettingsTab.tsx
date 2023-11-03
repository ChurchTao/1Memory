import { Center, Flex, Text } from '@mantine/core'
import React from 'react'
import classes from '../../assets/SettingsTab.module.css'

interface SettingsTabProps {
  title: string
  icon: React.ReactNode
  color: string
  isActive: boolean
  onClick: () => void
}

const SettingsTab: React.FC<SettingsTabProps> = ({ title, icon, color, isActive, onClick }) => {
  const iconBgColor = `${color}.3`
  const iconColor = `${color}.9`
  return (
    <Flex
      align="center"
      px={10}
      py={8}
      style={{
        borderRadius: 8
      }}
      onClick={onClick}
      className={isActive ? classes.item_active : classes.item}
    >
      <Center
        w={32}
        h={32}
        mr={12}
        bg={iconBgColor}
        c={iconColor}
        style={{
          borderRadius: 6
        }}
      >
        {icon}
      </Center>
      <Text className={isActive ? classes.text_active : classes.text} fz={'sm'}>
        {title}
      </Text>
    </Flex>
  )
}

export default SettingsTab
