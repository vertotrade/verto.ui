import { ChainId } from '@verto/sdk'

import { StableSwapPool } from '../../types/pool'
import { poolMap } from './pools'

export function getStableSwapPools(chainId: ChainId): StableSwapPool[] {
  return poolMap[chainId] || []
}
