import React from 'react'
import { Box, Text } from '@mantine/core'

const DeveloperSettings: React.FC = () => {
  return (
    <Box>
      <Text size="lg" fw={500} mb={4}>
        开发者设置
      </Text>
      <Box>
        <Text size="sm" fw={500} mb={2}>
          调试模式
        </Text>
        <Box>{/* 调试模式设置 */}</Box>
      </Box>
      <Box>
        <Text size="sm" fw={500} mb={2}>
          日志记录
        </Text>
        <Box>{/* 日志记录设置 */}</Box>
      </Box>
    </Box>
  )
}

export default DeveloperSettings
