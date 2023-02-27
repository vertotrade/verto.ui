import React, { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useRebusVault, usePoolsWithVault } from 'state/pools/hooks'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { useAppDispatch } from 'state'
import {
  fetchCakePoolUserDataAsync,
  fetchRebusVaultFees,
  fetchRebusVaultPublicData,
  fetchRebusVaultUserData,
  fetchCakePoolPublicDataAsync,
  fetchRebusFlexibleSideVaultPublicData,
  fetchRebusFlexibleSideVaultUserData,
  fetchRebusFlexibleSideVaultFees,
} from 'state/pools'
import { batch } from 'react-redux'
import { Pool } from '@verto/uikit'
import { Token } from '@verto/sdk'
import PoolsTable from './PoolTable'

const NewPool: React.FC<React.PropsWithChildren> = () => {
  const { address: account } = useAccount()
  const { pools } = usePoolsWithVault()
  const rebusVault = useRebusVault()

  const stakedOnlyOpenPools = useMemo(
    () => pools.filter(pool => pool.userData && pool.sousId === 0 && !pool.isFinished),
    [pools],
  ) as Pool.DeserializedPool<Token>[]

  const userDataReady: boolean = !account || (!!account && !rebusVault.userData?.isLoading)

  const dispatch = useAppDispatch()

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchRebusVaultPublicData())
      dispatch(fetchRebusFlexibleSideVaultPublicData())
      dispatch(fetchCakePoolPublicDataAsync())
      if (account) {
        dispatch(fetchRebusVaultUserData({ account }))
        dispatch(fetchRebusFlexibleSideVaultUserData({ account }))
        dispatch(fetchCakePoolUserDataAsync(account))
      }
    })
  }, [account, dispatch])

  useEffect(() => {
    batch(() => {
      dispatch(fetchRebusVaultFees())
      dispatch(fetchRebusFlexibleSideVaultFees())
    })
  }, [dispatch])

  return <PoolsTable pools={stakedOnlyOpenPools} account={account} userDataReady={userDataReady} />
}

export default NewPool
