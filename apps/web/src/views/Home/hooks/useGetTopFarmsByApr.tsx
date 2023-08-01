import { useState, useEffect } from 'react'
import { useFarms, usePriceCakeBusd } from 'state/farms/hooks'
import { featureFarmApiAtom, useFeatureFlag } from 'hooks/useFeatureFlag'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync } from 'state/farms'
import orderBy from 'lodash/orderBy'
import { DeserializedFarm, FarmWithStakedValue } from '@verto/farms'
import { FetchStatus } from 'config/constants/types'
import { getFarmConfig } from '@verto/farms/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'

const useGetTopFarmsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()
  const { data: farms, regularRewardPerBlock } = useFarms()
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const [fetched, setFetched] = useState(false)
  const [topFarms, setTopFarms] = useState<FarmWithStakedValue[]>([null, null, null, null, null])
  const cakePriceBusd = usePriceCakeBusd()
  const { chainId } = useActiveChainId()
  const farmFlag = useFeatureFlag(featureFarmApiAtom)

  useEffect(() => {
    const fetchFarmData = async () => {
      const farmsConfig = await getFarmConfig(chainId)
      setFetchStatus(FetchStatus.Fetching)

      try {
        await dispatch(fetchFarmsPublicDataAsync({ pids: farmsConfig.map(farm => farm.pid), chainId, flag: farmFlag }))
        setFetchStatus(FetchStatus.Fetched)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.Failed)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.Idle) {
      fetchFarmData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topFarms, isIntersecting, chainId, farmFlag])

  useEffect(() => {
    const getTopFarmsByApr = (farmsState: DeserializedFarm[]) => {
      const farmsWithPrices = farmsState.filter(
        farm => farm.lpTotalInQuoteToken && farm.quoteTokenPriceBusd && farm.multiplier && farm.multiplier !== '0X',
      )
      const farmsWithApr: FarmWithStakedValue[] = farmsWithPrices.map(farm => {
        // const totalLiquidity = farm.lpTotalInQuoteToken.times(farm.quoteTokenPriceBusd)
        // const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
        //   chainId,
        //   farm.poolWeight,
        //   cakePriceBusd,
        //   totalLiquidity,
        //   farm.lpAddress,
        //   regularRewardPerBlock,
        // )
        return { ...farm, apr: 0, lpRewardsApr: 0 }
      })

      const sortedByApr = orderBy(farmsWithApr, farm => farm.apr + farm.lpRewardsApr, 'desc')
      setTopFarms(sortedByApr.slice(0, 5))
      setFetched(true)
    }

    if (fetchStatus === FetchStatus.Fetched && !topFarms[0] && farms?.length > 0) {
      getTopFarmsByApr(farms)
    }
  }, [setTopFarms, farms, fetchStatus, cakePriceBusd, topFarms, regularRewardPerBlock, chainId])

  return { topFarms, fetched }
}

export default useGetTopFarmsByApr
