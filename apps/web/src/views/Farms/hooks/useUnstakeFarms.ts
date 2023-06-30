import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { unstakeFarm, nonBscUnstakeFarm } from 'utils/calls'
import { useMasterchef, useNonBscVault } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'

const useUnstakeFarms = (poolAddress: string, vaultPid?: number) => {
  const { account, chainId } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const oraclePrice = useOraclePrice(chainId)
  const masterChefContract = useMasterchef(poolAddress)
  const nonBscVaultContract = useNonBscVault()

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(masterChefContract, amount, gasPrice)
    },
    [masterChefContract, gasPrice],
  )

  const handleUnstakeNonBsc = useCallback(
    async (amount: string) => {
      return nonBscUnstakeFarm(nonBscVaultContract, vaultPid, amount, gasPrice, account, oraclePrice, chainId)
    },
    [nonBscVaultContract, vaultPid, gasPrice, account, oraclePrice, chainId],
  )

  return { onUnstake: vaultPid ? handleUnstakeNonBsc : handleUnstake }
}

export default useUnstakeFarms
