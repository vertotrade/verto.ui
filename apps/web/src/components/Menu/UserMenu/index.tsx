import { useTranslation } from '@verto/localization'
import {
  Box,
  Flex,
  LogoutIcon,
  RefreshIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  ListViewIcon,
} from '@verto/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Trans from 'components/Trans'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
import { useEffect, useState, useCallback } from 'react'
import { useProfile } from 'state/profile/hooks'
import { usePendingTransactions } from 'state/transactions/hooks'
import { useAccount } from 'wagmi'
import WalletModal, { WalletView } from './WalletModal'
import WalletUserMenuItem from './WalletUserMenuItem'

const UserMenuItems = () => {
  const { t } = useTranslation()
  const { isWrongNetwork } = useActiveChainId()
  const { logout } = useAuth()
  const { hasPendingTransactions } = usePendingTransactions()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)

  const onClickWalletMenu = useCallback((): void => {
    if (isWrongNetwork) {
      onPresentWrongNetworkModal()
    } else {
      onPresentWalletModal()
    }
  }, [isWrongNetwork, onPresentWalletModal, onPresentWrongNetworkModal])

  return (
    <>
      <WalletUserMenuItem isWrongNetwork={isWrongNetwork} onPresentWalletModal={onClickWalletMenu} />
      <UserMenuItem as="button" disabled={isWrongNetwork} onClick={onPresentTransactionModal}>
        <Flex alignItems="center" width="100%">
          {hasPendingTransactions ? <RefreshIcon mr="10px" spin /> : <ListViewIcon mr="10px" />}
          {t('Recent Transactions')}
        </Flex>
      </UserMenuItem>
      <UserMenuDivider />
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" width="100%">
          <LogoutIcon mr="8px" />
          {t('Disconnect')}
        </Flex>
      </UserMenuItem>
    </>
  )
}

const UserMenu = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isWrongNetwork } = useActiveChainId()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const { profile } = useProfile()
  const avatarSrc = profile?.nft?.image?.thumbnail
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')

  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(t('%num% Pending', { num: pendingNumber }))
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  if (account) {
    return (
      <UIKitUserMenu account={account} avatarSrc={avatarSrc} text={userMenuText} variant={userMenuVariable}>
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text={t('Network')} variant="danger">
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  return (
    <ConnectWalletButton style={{ height: '40px' }}>
      <Box display={['none', , , 'block']}>
        <Trans>Connect Wallet</Trans>
      </Box>
      <Box display={['block', , , 'none']}>
        <Trans>Connect</Trans>
      </Box>
    </ConnectWalletButton>
  )
}

export default UserMenu
