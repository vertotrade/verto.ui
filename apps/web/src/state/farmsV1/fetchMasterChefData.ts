import masterchefABIV1 from 'config/abi/masterchefV1.json'
import chunk from 'lodash/chunk'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarm } from '@verto/farms'
import { SerializedFarmConfig } from '../../config/constants/types'
import { getMasterChefV1Address } from '../../utils/addressHelpers'

const masterChefAddress = getMasterChefV1Address()

const masterChefFarmCalls = (farm: SerializedFarm) => {
  const { v1pid } = farm
  return v1pid || v1pid === 0
    ? [
        {
          address: masterChefAddress,
          name: 'poolInfo',
          params: [v1pid],
        },
        {
          address: masterChefAddress,
          name: 'totalAllocPoint',
        },
      ]
    : [null, null]
}

export const fetchMasterChefData = async (farms: SerializedFarmConfig[]): Promise<any[]> => {
  const masterChefCalls = farms.map(farm => masterChefFarmCalls(farm))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter(masterChefCall => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()
  const masterChefMultiCallResult = await multicallv2({ abi: masterchefABIV1, calls: masterChefAggregatedCalls })
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
