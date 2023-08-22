import { fetchWithCache } from './fetchWithCache'

export type PoolFarmInfo = {
  apr: number
  lpRewardsApr: number
  liquidity: number
  liquidityStaked: number
  [key: string]: number
}

export type PoolFarmInfoMap = Record<string, PoolFarmInfo>

export const getPoolFarmInfoMap = async (): Promise<PoolFarmInfoMap> => {
  return fetchWithCache()
}

export const getPoolFarmInfo = async (address: string) => {
  return (await getPoolFarmInfoMap())[address]
}

export const getApr = async (address: string) => {
  return (await getPoolFarmInfo(address))?.apr
}

export const getLiquidity = async (address: string) => {
  return (await getPoolFarmInfo(address))?.liquidity
}
