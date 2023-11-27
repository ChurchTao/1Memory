import Loading from '@renderer/components/Loading'
import React, { Suspense, useEffect } from 'react'
import { StoreState, updateSettings } from '@renderer/store'
import { useDispatch, useStore } from 'react-redux'
import { changeLanguage } from './i18n'

interface IProps {
  children?: React.ReactNode
}

function PageWrapper(props: IProps): JSX.Element {
  const { children } = props
  const dispatch = useDispatch()
  const store = useStore<StoreState>()
  store.subscribe(() => {
    changeLanguage(store.getState().settings.general.language)
  })

  useEffect(() => {
    window.api.settings.getAll().then((settings) => {
      dispatch(updateSettings(settings))
    })
  })
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

export default PageWrapper
