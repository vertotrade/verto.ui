import masterchefABI from 'config/abi/masterchef.json'
import chunk from 'lodash/chunk'
import BigNumber from 'bignumber.js'
import { multicallv2 } from 'utils/multicall'
import { BIG_ZERO } from '@verto/utils/bigNumber'
import { SerializedFarm } from '@verto/farms'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import { SerializedFarmConfig } from '../../config/constants/types'
import { getMasterChefAddress } from '../../utils/addressHelpers'

export const fetchMasterChefFarmPoolLength = async (chainId: number) => {
  try {
    const [poolLength] = await multicallv2({
      abi: masterchefABI,
      calls: [
        {
          name: 'poolLength',
          address: getMasterChefAddress(chainId),
        },
      ],
      chainId,
    })

    return new BigNumber(poolLength).toNumber()
  } catch (error) {
    console.error('Fetch MasterChef Farm Pool Length Error: ', error)
    return BIG_ZERO.toNumber()
  }
}

const masterChefFarmCalls = async (farm: SerializedFarm) => {
  const { pid } = farm
  const multiCallChainId = DEFAULT_CHAIN_ID
  const masterChefAddress = getMasterChefAddress(multiCallChainId)
  const masterChefPid = pid

  return masterChefPid || masterChefPid === 0
    ? [
        {
          address: masterChefAddress,
          name: 'poolInfo',
          params: [masterChefPid],
        },
        {
          address: masterChefAddress,
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
