import React, { useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { getFarmApr } from 'utils/apr'
import { useTranslation } from '@verto/localization'
import { useFarms, usePriceCakeBusd, usePollFarmsWithUserData } from 'state/farms/hooks'
import { useFarmsV1 } from 'state/farmsV1/hooks'
import { DeserializedFarm, FarmWithStakedValue } from '@verto/farms'
import MigrationFarmTable from '../../MigrationFarmTable'
import { DesktopV2ColumnSchema } from '../../types'

const NewFarmStep2: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: farmsLP, userDataLoaded, regularRewardPerBlock } = useFarms()
  const { data: farmsV1LP } = useFarmsV1()
  const cakePrice = usePriceCakeBusd()

  usePollFarmsWithUserData()

  const userDataReady = !account || (!!account && userDataLoaded)

  const activeFarms = farmsLP.filter(farm => farm.multiplier !== '0X')
  const activeFarmsV1 = farmsV1LP

  const v1StakedOrHasTokenBalance = activeFarmsV1.filter(farm => {
    const hasStakedBalance = new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
    const hasTokenBalance = new BigNumber(farm.userData.tokenBalance).isGreaterThan(0)
    return farm.userData && (hasStakedBalance || hasTokenBalance)
  })

  // Only show farms that has staked or has balance in v1 & v2
  const stakedOrHasTokenBalance = activeFarms.filter(farm => {
    const hasStakedBalance = new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
    const hasTokenBalance = new BigNumber(farm.userData.tokenBalance).isGreaterThan(0)
    const farms = v1StakedOrHasTokenBalance.find(v1Farm => v1Farm.pid === farm.pid && v1Farm.lpSymbol === farm.lpSymbol)
    return farm.userData && (hasStakedBalance || hasTokenBalance || farms)
  })

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map(farm => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
          56,
          new BigNumber(farm.poolWeight),
          cakePrice,
          totalLiquidity,
          farm.lpAddress,
          regularRewardPerBlock,
        )
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [cakePrice, regularRewardPerBlock],
  )

  const chosenFarmsMemoized = useMemo(() => {
    return farmsList(stakedOrHasTokenBalance)
  }, [stakedOrHasTokenBalance, farmsList])

  return (
    <MigrationFarmTable
      title={t('Farms')}
      noStakedFarmText={t('You are not currently staking in any farms.')}
      account={account}
      cakePrice={cakePrice}
      columnSchema={DesktopV2ColumnSchema}
      farms={chosenFarmsMemoized}
      userDataReady={userDataReady}
    />
  )
}

export default NewFarmStep2
