import env from '@beam-australia/react-env'
import axios from 'axios'

export type PoolFarmInfo = Record<
  string,
  {
    apr: number
    lpRewardsApr: number
    liquidity: number
    liquidityStaked: number
    [key: string]: number
  }
>

const URL = env('APR_URL')

let fetchAprMapPromise: Promise<void> = null
let aprMap: undefined | PoolFarmInfo = null

export const getPoolFarmInfoMap = async () => {
  if (!fetchAprMapPromise && !aprMap) {
    fetchAprMapPromise = axios
      .get(URL)
      .then(response => {
        aprMap = response?.data || {}
        fetchAprMapPromise = null
      })
      .catch(err => {
        console.error(`Error fetching APR data`, err)
        fetchAprMapPromise = null
      })
  }

  if (fetchAprMapPromise) {
    await fetchAprMapPromise
  }

  return aprMap || {}
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
