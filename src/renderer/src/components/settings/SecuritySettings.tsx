import React from 'react'
import { Box, Text } from '@mantine/core'

const SecuritySettings: React.FC = () => {
  return (
    <Box>
      <Text size="lg" fw={500} mb={4}>
        安全设置
      </Text>
      <Box>
        <Text size="sm" fw={500} mb={2}>
          密码
        </Text>
        <Box>{/* 密码设置 */}</Box>
      </Box>
      <Box>
        <Text size="sm" fw={500} mb={2}>
          双重认证
        </Text>
        <Box>{/* 双重认证设置 */}</Box>
      </Box>
    </Box>
  )
}

export default SecuritySettings
