import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedRebusVault, VaultKey } from 'state/types'

export const useUserLockedCakeStatus = () => {
  const vaultPool = useVaultPoolByKey(VaultKey.RebusVault) as DeserializedLockedRebusVault

  return {
    totalCakeInVault: vaultPool?.totalCakeInVault,
    totalLockedAmount: vaultPool?.totalLockedAmount,
    isLoading: vaultPool?.userData?.isLoading,
    locked: Boolean(vaultPool?.userData?.locked),
    lockedEnd: vaultPool?.userData?.lockEndTime,
    lockedAmount: vaultPool?.userData?.lockedAmount,
    lockBalance: vaultPool?.userData?.balance,
    lockedStart: vaultPool?.userData?.lockStartTime,
  }
}
