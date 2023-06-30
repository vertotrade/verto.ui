import masterchefABI from 'config/abi/masterchef.json'
import chunk from 'lodash/chunk'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarm } from '@verto/farms'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import { SerializedFarmConfig } from '../../config/constants/types'

const masterChefFarmCalls = async (farm: SerializedFarm) => {
  const { pid } = farm
  const masterChefPid = pid

  return masterChefPid || masterChefPid === 0
    ? [
        {
          address: farm.poolAddress,
          name: 'poolInfo',
          params: [masterChefPid],
        },
        {
          address: farm.poolAddress,
          name: 'totalRegularAllocPoint',
        },
      ]
    : [null, null]
}

export const fetchMasterChefData = async (farms: SerializedFarmConfig[]): Promise<any[]> => {
  const masterChefCalls = await Promise.all(farms.map(farm => masterChefFarmCalls(farm)))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter(masterChefCall => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()

  const multiCallChainId = DEFAULT_CHAIN_ID
  const masterChefMultiCallResult = await multicallv2({
    abi: masterchefABI,
    calls: masterChefAggregatedCalls,
    chainId: multiCallChainId,
  })
  const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize)

  let masterChefChunkedResultCounter = 0
  return masterChefCalls.map(masterChefCall => {
    if (masterChefCall[0] === null && masterChefCall[1] === null) {
      return [null, null]
    }
    const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter]
    masterChefChunkedResultCounter++
    return data
  })
}
