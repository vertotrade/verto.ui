import { ChainId } from '@verto/sdk'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import { provider, webSocketProvider } from './wagmi'

export const rebusRpcProvider =
  DEFAULT_CHAIN_ID === ChainId.REBUS
    ? webSocketProvider({ chainId: DEFAULT_CHAIN_ID })
    : provider({ chainId: DEFAULT_CHAIN_ID })

export default null
