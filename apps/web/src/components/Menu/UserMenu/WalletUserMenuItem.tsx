import { Flex, UserMenuItem, WarningIcon } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { useAccount, useBalance } from 'wagmi'
import { LOW_NATIVE_BALANCE } from './WalletModal'

interface WalletUserMenuItemProps {
  isWrongNetwork: boolean
  onPresentWalletModal: () => void
}

const WalletUserMenuItem: React.FC<React.PropsWithChildren<WalletUserMenuItemProps>> = ({
  isWrongNetwork,
  onPresentWalletModal,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data, isFetched } = useBalance({ address: account })
  const hasLowNativeBalance = isFetched && data && data.value.lte(LOW_NATIVE_BALANCE)

  return (
    <UserMenuItem as="button" onClick={onPresentWalletModal}>
      <Flex alignItems="center" width="100%">
        {hasLowNativeBalance && !isWrongNetwork && <WarningIcon mr="8px" color="warning" width="24px" />}
        {isWrongNetwork && <WarningIcon mr="8px" color="failure" width="24px" />}
        {t('Wallet')}
      </Flex>
    </UserMenuItem>
  )
}

export default WalletUserMenuItem
