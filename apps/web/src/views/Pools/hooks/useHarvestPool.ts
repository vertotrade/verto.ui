import { useCallback } from 'react'
import { useSousChef } from 'hooks/useContract'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const harvestPool = async (sousChefContract, gasPrice) => {
  return sousChefContract.deposit('0', { ...options, gasPrice })
}

const useHarvestPool = sousId => {
  const sousChefContract = useSousChef(sousId)
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    return harvestPool(sousChefContract, gasPrice)
  }, [sousChefContract, gasPrice])

  return { onReward: handleHarvest }
}

export default useHarvestPool
