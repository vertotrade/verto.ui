import { Button, Grid, Message, MessageText, Modal, Text } from '@verto/uikit'
import { useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useTranslation } from '@verto/localization'
import { useSwitchNetwork, useSwitchNetworkLocal } from 'hooks/useSwitchNetwork'
import useAuth from 'hooks/useAuth'
import { useMenuItems } from 'components/Menu/hooks/useMenuItems'
import { useRouter } from 'next/router'
import { getActiveMenuItem, getActiveSubMenuItem } from 'components/Menu/utils'
import { useAccount, useNetwork } from 'wagmi'
import { useMemo } from 'react'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import Dots from '../Loader/Dots'

// Where chain is not supported or page not supported
export function UnsupportedNetworkModal({ pageSupportedChains }: { pageSupportedChains: number[] }) {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const switchNetworkLocal = useSwitchNetworkLocal()
  const { chains } = useNetwork()
  const chainId = useLocalNetworkChain() || DEFAULT_CHAIN_ID
  const { isConnected } = useAccount()
  const { logout } = useAuth()
  const { t } = useTranslation()
  const menuItems = useMenuItems()
  const { pathname } = useRouter()

  const title = useMemo(() => {
    const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
    const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })
    const label = activeSubMenuItem?.label || activeMenuItem?.label

    if (!label && pathname === '/tokens') {
      return t('Tokens')
    }

    return label
  }, [menuItems, pathname, t])

  const supportedMainnetChains = useMemo(
    () => chains.filter(chain => pageSupportedChains?.includes(chain.id)),
    [chains, pageSupportedChains],
  )

  return (
    <Modal title={t('Check your network')} hideCloseButton headerBackground="backgroundAlt" paddingTop="20px">
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text>
          {t('Currently %feature% only supported in', { feature: typeof title === 'string' ? title : 'this page' })}{' '}
          {supportedMainnetChains?.map(c => c.name).join(', ')}
        </Text>
        <Message variant="warning">
          <MessageText>{t('Please switch your network to continue.')}</MessageText>
        </Message>
        {canSwitch ? (
          <Button
            isLoading={isLoading}
            onClick={() => {
              if (supportedMainnetChains.map(c => c.id).includes(chainId)) {
                switchNetworkAsync(chainId)
              } else {
                switchNetworkAsync(DEFAULT_CHAIN_ID)
              }
            }}>
            {isLoading ? <Dots>{t('Switch network in wallet')}</Dots> : t('Switch network in wallet')}
          </Button>
        ) : (
          <Message variant="danger">
            <MessageText>{t('Unable to switch network. Please try it on your wallet')}</MessageText>
          </Message>
        )}
        {isConnected && (
          <Button
            variant="secondary"
            onClick={() =>
              logout().then(() => {
                switchNetworkLocal(DEFAULT_CHAIN_ID)
              })
            }>
            {t('Disconnect Wallet')}
          </Button>
        )}
      </Grid>
    </Modal>
  )
}
