import { Flex, Pool, Text } from '@verto/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@verto/localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { Token } from '@verto/sdk'
import { getRebusVaultEarnings } from 'views/Pools/helpers'
import RecentCakeProfitBalance from './RecentCakeProfitBalance'

const RecentCakeProfitCountdownRow = ({ pool }: { pool: Pool.DeserializedPool<Token> }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const cakePriceBusd = usePriceCakeBusd()
  const { hasAutoEarnings, autoCakeToDisplay } = getRebusVaultEarnings(
    account,
    userData.cakeAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    cakePriceBusd.toNumber(),
    pool.vaultKey === VaultKey.RebusVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee.plus(
          (userData as DeserializedLockedVaultUser).currentOverdueFee,
        )
      : null,
  )

  if (!(userData.userShares.gt(0) && account)) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent VERTO profit')}:`}</Text>
      {hasAutoEarnings && <RecentCakeProfitBalance cakeToDisplay={autoCakeToDisplay} pool={pool} account={account} />}
    </Flex>
  )
}

export default RecentCakeProfitCountdownRow
