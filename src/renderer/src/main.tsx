import React from 'react'
import ReactDOM from 'react-dom/client'
import store from './store'
import './common/i18n'
import Clip from './pages/Clip'
import Settings from './pages/Settings'
import PageWrapper from '@renderer/common/PageWrapper'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { MantineProvider } from '@mantine/core'
import { theme, cssVariablesResolver } from './theme'
import './assets/globals.scss'
import '@mantine/core/styles.css'

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
      <Provider store={store}>
        <PageWrapper>
          <RouterProvider router={router} />
        </PageWrapper>
      </Provider>
    </MantineProvider>
  </React.StrictMode>
)
