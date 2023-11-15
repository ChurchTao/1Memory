import ReactDOM from 'react-dom/client'
import './assets/globals.scss'
import '@mantine/core/styles.css'
import './common/i18n'
import Clip from './pages/Clip'
import Settings from './pages/Settings'
import PageWrapper from '@renderer/common/PageWrapper'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { theme, cssVariablesResolver } from './theme'
import React from 'react'

const router = createHashRouter([
  {
    path: '/',
    element: <Clip />
  },
  {
    path: '/settings',
    element: <Settings />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
      <PageWrapper>
        <RouterProvider router={router} />
      </PageWrapper>
    </MantineProvider>
  </React.StrictMode>
)
