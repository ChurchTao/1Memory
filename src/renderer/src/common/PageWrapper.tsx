import Loading from '@renderer/components/Loading'
import React, { Suspense } from 'react'

interface IProps {
  children?: React.ReactNode
}

function PageWrapper(props: IProps): JSX.Element {
  const { children } = props

  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

export default PageWrapper
