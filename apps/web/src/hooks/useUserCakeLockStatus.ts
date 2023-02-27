import { useAccount } from 'wagmi'
import { ChainId } from '@verto/sdk'
import useSWRImmutable from 'swr/immutable'
import { useRebusVaultContract } from 'hooks/useContract'
import { useActiveChainId } from './useActiveChainId'

export const useUserCakeLockStatus = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const rebusVaultContract = useRebusVaultContract()

  const { data: userCakeLockStatus = null } = useSWRImmutable(
    account && chainId === ChainId.BSC ? ['userCakeLockStatus', account] : null,
    async () => {
      const { locked, lockEndTime } = await rebusVaultContract.userInfo(account)
      const lockEndTimeStr = lockEndTime.toString()
      return locked && (lockEndTimeStr === '0' || new Date() > new Date(parseInt(lockEndTimeStr) * 1000))
    },
  )
  return userCakeLockStatus
}
