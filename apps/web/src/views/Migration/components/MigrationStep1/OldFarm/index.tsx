import React, { useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { useTranslation } from '@verto/localization'
import { useFarmsV1, usePriceCakeBusd } from 'state/farmsV1/hooks'
import { DeserializedFarm, FarmWithStakedValue } from '@verto/farms'
import MigrationFarmTable from '../../MigrationFarmTable'
import { FarmDesktopColumnSchema } from '../../types'

const OldFarmStep1: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: farmsLP, userDataLoaded } = useFarmsV1()
  const cakePrice = usePriceCakeBusd()

  const userDataReady = !account || (!!account && userDataLoaded)

  const stakedOrHasTokenBalance = farmsLP.filter(farm => {
    return (
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.tokenBalance).isGreaterThan(0))
    )
  })

  const farmsList = useCallback((farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
    const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map(farm => {
      if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
        return farm
      }
      const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
      // const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
      //   56,
      //   new BigNumber(farm.poolWeight),
      //   cakePrice,
      //   totalLiquidity,
      //   farm.lpAddress,
      //   CAKE_PER_YEAR,
      // )
      return { ...farm, apr: 0, lpRewardsApr: 0, liquidity: totalLiquidity }
    })

    return farmsToDisplayWithAPR
  }, [])

  const chosenFarmsMemoized = useMemo(() => {
    return farmsList(stakedOrHasTokenBalance)
  }, [stakedOrHasTokenBalance, farmsList])

  return (
    <MigrationFarmTable
      title={t('Old Farms')}
      noStakedFarmText={t('You are not currently staking in any v1 farms.')}
      account={account}
      cakePrice={cakePrice}
      columnSchema={FarmDesktopColumnSchema}
      farms={chosenFarmsMemoized}
      userDataReady={userDataReady}
    />
  )
}

export default OldFarmStep1
