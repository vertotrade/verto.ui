import React from 'react'
import { useIsMounted } from '@verto/hooks'

interface NoSSRProps {
  children?: React.ReactNode
  loader?: React.ReactNode
}

const NoSSR: React.FC<NoSSRProps> = ({ children, loader }) => {
  const isMounted = useIsMounted()

  return <>{isMounted ? children : loader ?? null}</>
}

export default NoSSR
