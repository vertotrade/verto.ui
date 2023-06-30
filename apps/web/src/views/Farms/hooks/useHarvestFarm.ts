import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useHarvestFarm = (poolAddress: string) => {
  const masterChefContract = useMasterchef(poolAddress)
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    return harvestFarm(masterChefContract, gasPrice)
  }, [masterChefContract, gasPrice])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
