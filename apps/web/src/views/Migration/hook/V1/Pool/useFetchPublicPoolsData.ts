import { useAppDispatch } from 'state'
import { getFarmConfig } from '@verto/farms/constants'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchFarmsPublicDataAsync } from 'state/farmsV1/index'
import { DEFAULT_CHAIN_ID } from 'config/chains'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      const farmsConfig = await getFarmConfig(DEFAULT_CHAIN_ID)
      await dispatch(fetchFarmsPublicDataAsync(farmsConfig.map(farm => farm.v1pid)))
    }

    fetchPoolsDataWithFarms()
  })
}
