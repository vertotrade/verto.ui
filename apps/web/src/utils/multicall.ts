import { CallOverrides } from '@ethersproject/contracts'
import { createMulticall, Call } from '@verto/multicall'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import { webSocketProvider } from './wagmi'
import { rebusRpcProvider } from './providers'

export type { Call }

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean
}

const { multicall, multicallv2, multicallv3 } = createMulticall(webSocketProvider, {
  [DEFAULT_CHAIN_ID]: rebusRpcProvider,
})

export default multicall

export { multicallv2, multicallv3 }
