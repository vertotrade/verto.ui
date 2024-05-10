import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT } from 'config'
import { getFullDecimalMultiplier } from '@verto/utils/getFullDecimalMultiplier'
import { useSousChef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const sousStake = async (sousChefContract, amount, decimals = 18, gasPrice: string) => {
  return sousChefContract.deposit(new BigNumber(amount).times(getFullDecimalMultiplier(decimals)).toString(), {
    ...options,
    gasPrice,
  })
}

const useStakePool = (sousId: number) => {
  const sousChefContract = useSousChef(sousId)
  const gasPrice = useGasPrice()

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      return sousStake(sousChefContract, amount, decimals, gasPrice)
    },
    [sousChefContract, gasPrice],
  )

  return { onStake: handleStake }
}

export default useStakePool
