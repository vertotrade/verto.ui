import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { useWeb3React } from '@verto/wagmi'
import { featureFarmApiAtom, useFeatureFlag } from 'hooks/useFeatureFlag'
import { FAST_INTERVAL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'
import { getFarmConfig } from '@verto/farms/constants'
import { livePools } from 'config/constants/pools'
import { Pool } from '@verto/uikit'
import { Token } from '@verto/sdk'

import { useActiveChainId } from 'hooks/useActiveChainId'
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchRebusVaultPublicData,
  fetchRebusVaultUserData,
  fetchRebusVaultFees,
  fetchPoolsStakingLimitsAsync,
  fetchUserIfoCreditDataAsync,
  fetchIfoPublicDataAsync,
  fetchRebusFlexibleSideVaultPublicData,
  fetchRebusFlexibleSideVaultUserData,
  fetchRebusFlexibleSideVaultFees,
  fetchCakePoolUserDataAsync,
  fetchCakePoolPublicDataAsync,
} from '.'
import { VaultKey } from '../types'
import { fetchFarmsPublicDataAsync } from '../farms'
import {
  makePoolWithUserDataLoadingSelector,
  makeVaultPoolByKey,
  poolsWithVaultSelector,
  ifoCreditSelector,
  ifoCeilingSelector,
  makeVaultPoolWithKeySelector,
} from './selectors'

const lPoolAddresses = livePools.filter(({ sousId }) => sousId !== 0).map(({ earningToken }) => earningToken.address)

// Only fetch farms for live pools
const getActiveFarms = async (chainId: number) => {
  const farmsConfig = await getFarmConfig(chainId)
  return farmsConfig
    .filter(
      ({ token, quoteToken }) =>
        (token.symbol === 'CAKE' && quoteToken.symbol === 'WBNB') ||
        (token.symbol === 'BUSD' && quoteToken.symbol === 'WBNB') ||
        lPoolAddresses.find(poolAddress => poolAddress === token.address),
    )
    .map(farm => farm.pid)
}

const getCakePriceFarms = async (chainId: number) => {
  const farmsConfig = await getFarmConfig(chainId)
  return farmsConfig
    .filter(
      ({ token, pid, quoteToken }) =>
        (token.symbol === 'CAKE' && quoteToken.symbol === 'WBNB') ||
        (token.symbol === 'BUSD' && quoteToken.symbol === 'WBNB'),
    )
    .map(farm => farm.pid)
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const farmFlag = useFeatureFlag(featureFarmApiAtom)
  const { account } = useWeb3React()

  useSlowRefreshEffect(
    currentBlock => {
      const fetchPoolsDataWithFarms = async () => {
        const activeFarms = await getActiveFarms(chainId)
        await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms, chainId, flag: farmFlag }))

        batch(() => {
          dispatch(fetchPoolsPublicDataAsync(currentBlock, chainId, account))
          dispatch(fetchPoolsStakingLimitsAsync())
        })
      }

      fetchPoolsDataWithFarms()
    },
    [dispatch, chainId, farmFlag, account],
  )
}

export const usePool = (sousId: number): { pool: Pool.DeserializedPool<Token>; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsWithVault = () => {
  return useSelector(poolsWithVaultSelector)
}

export const useDeserializedPoolByVaultKey = vaultKey => {
  const vaultPoolWithKeySelector = useMemo(() => makeVaultPoolWithKeySelector(vaultKey), [vaultKey])

  return useSelector(vaultPoolWithKeySelector)
}

export const usePoolsPageFetch = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchRebusVaultPublicData())
      dispatch(fetchRebusFlexibleSideVaultPublicData())
      dispatch(fetchIfoPublicDataAsync())
      if (account) {
        dispatch(fetchPoolsUserDataAsync(account))
        dispatch(fetchRebusVaultUserData({ account }))
        dispatch(fetchRebusFlexibleSideVaultUserData({ account }))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchRebusVaultFees())
      dispatch(fetchRebusFlexibleSideVaultFees())
    })
  }, [dispatch])
}

export const useRebusVaultUserData = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    if (account) {
      dispatch(fetchRebusVaultUserData({ account }))
    }
  }, [account, dispatch])
}

export const useRebusVaultPublicData = () => {
  const dispatch = useAppDispatch()
  useFastRefreshEffect(() => {
    dispatch(fetchRebusVaultPublicData())
  }, [dispatch])
}

export const useFetchIfo = () => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const farmFlag = useFeatureFlag(featureFarmApiAtom)

  useSWRImmutable(
    'fetchIfoPublicData',
    async () => {
      const cakePriceFarms = await getCakePriceFarms(chainId)
      await dispatch(fetchFarmsPublicDataAsync({ pids: cakePriceFarms, chainId, flag: farmFlag }))
      batch(() => {
        dispatch(fetchCakePoolPublicDataAsync())
        dispatch(fetchRebusVaultPublicData())
        dispatch(fetchIfoPublicDataAsync())
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWRImmutable(
    account && ['fetchIfoUserData', account],
    async () => {
      batch(() => {
        dispatch(fetchCakePoolUserDataAsync(account))
        dispatch(fetchRebusVaultUserData({ account }))
        dispatch(fetchUserIfoCreditDataAsync(account))
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWRImmutable('fetchRebusVaultFees', async () => {
    dispatch(fetchRebusVaultFees())
  })
}

export const useRebusVault = () => {
  return useVaultPoolByKey(VaultKey.RebusVault)
}

export const useVaultPoolByKey = (key: VaultKey) => {
  const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key])

  return useSelector(vaultPoolByKey)
}

export const useIfoCredit = () => {
  return useSelector(ifoCreditSelector)
}

export const useIfoCeiling = () => {
  return useSelector(ifoCeilingSelector)
}
