import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@verto/utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
import { transformPool, transformVault } from './helpers'
import { initialPoolVaultState } from './index'
// import { getVaultPosition, VaultPosition } from '../../utils/cakePool'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = sousId => (state: State) => state.pools.data.find(p => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState
const selectIfo = (state: State) => state.pools.ifo
const selectIfoUserCredit = (state: State) => state.pools.ifo.credit ?? BIG_ZERO

export const makePoolWithUserDataLoadingSelector = sousId =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: transformPool(pool), userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = key => createSelector([selectVault(key)], vault => transformVault(key, vault))

export const poolsWithVaultSelector = createSelector(
  [
    poolsWithUserDataLoadingSelector,
    makeVaultPoolByKey(VaultKey.RebusVault),
    makeVaultPoolByKey(VaultKey.RebusFlexibleSideVault),
  ],
  (poolsWithUserDataLoading, _, __) => {
    const { pools, userDataLoaded } = poolsWithUserDataLoading
    // const vaultPool = pools.find(pool => !pool.isFinished && pool.sousId === 0)
    const withoutVaultPool = pools.filter(pool => pool.sousId !== 0)

    // const cakeAutoVault = {
    //   ...vaultPool,
    //   ...deserializedLockedRebusVault,
    //   vaultKey: VaultKey.RebusVault,
    //   userData: { ...vaultPool?.userData, ...deserializedLockedRebusVault.userData },
    // }

    // const lockedVaultPosition = getVaultPosition(deserializedLockedRebusVault.userData)
    // const hasFlexibleSideSharesStaked = deserializedFlexibleSideRebusVault.userData.userShares.gt(0)

    // const cakeAutoFlexibleSideVault =
    //   lockedVaultPosition > VaultPosition.Flexible || hasFlexibleSideSharesStaked
    //     ? [
    //         {
    //           ...vaultPool,
    //           ...deserializedFlexibleSideRebusVault,
    //           vaultKey: VaultKey.RebusFlexibleSideVault,
    //           userData: { ...vaultPool?.userData, ...deserializedFlexibleSideRebusVault.userData },
    //         },
    //       ]
    //     : []

    // return { pools: [cakeAutoVault, ...cakeAutoFlexibleSideVault, ...withoutVaultPool], userDataLoaded }
    return { pools: [...withoutVaultPool], userDataLoaded }
  },
)

export const makeVaultPoolWithKeySelector = vaultKey =>
  createSelector(poolsWithVaultSelector, ({ pools }) => pools.find(p => p.vaultKey === vaultKey))

export const ifoCreditSelector = createSelector([selectIfoUserCredit], ifoUserCredit => {
  return new BigNumber(ifoUserCredit)
})

export const ifoCeilingSelector = createSelector([selectIfo], ifoData => {
  return new BigNumber(ifoData.ceiling)
})
