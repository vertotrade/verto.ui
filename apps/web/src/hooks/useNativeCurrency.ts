import { Native, NativeCurrency } from '@verto/sdk'
import { useMemo } from 'react'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import { useActiveChainId } from './useActiveChainId'

export default function useNativeCurrency(): NativeCurrency {
  const { chainId } = useActiveChainId()
  return useMemo(() => {
    try {
      return Native.onChain(chainId)
    } catch (e) {
      return Native.onChain(DEFAULT_CHAIN_ID)
    }
  }, [chainId])
}
