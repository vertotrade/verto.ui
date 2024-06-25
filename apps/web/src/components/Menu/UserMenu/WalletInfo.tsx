import {
  Box,
  Button,
  Flex,
  InjectedModalProps,
  LinkExternal,
  Message,
  Skeleton,
  Text,
  CopyAddress,
  useModal,
} from '@verto/uikit'
import { ChainId, WNATIVE } from '@verto/sdk'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@verto/localization'
import useAuth from 'hooks/useAuth'
import useNativeCurrency from 'hooks/useNativeCurrency'
import useTokenBalance from 'hooks/useTokenBalance'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { useCallback } from 'react'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { formatBigNumber, getFullDisplayBalance } from '@verto/utils/formatBalance'
import { useBalance } from 'wagmi'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import BuyTokenModal from 'components/BuyTokenModal/BuyTokenModal'

const COLORS = {
  ETH: '#627EEA',
  BNB: '#14151A',
}

interface WalletInfoProps {
  hasLowNativeBalance: boolean
  switchView: (newIndex: number) => void
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowNativeBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account, chainId, chain } = useActiveWeb3React()
  const isRebus = chainId === ChainId.REBUS || chainId === ChainId.REBUS_TESTNET
  const rebusBalance = useBalance({ address: account, chainId: DEFAULT_CHAIN_ID })
  const nativeBalance = useBalance({ address: account, enabled: !isRebus })
  const native = useNativeCurrency()
  const wNativeToken = !isRebus ? WNATIVE[chainId] : null
  const wRebusToken = WNATIVE[DEFAULT_CHAIN_ID]
  const { balance: wNativeBalance, fetchStatus: wNativeFetchStatus } = useTokenBalance(wNativeToken?.address)
  const { balance: wRebusBalance, fetchStatus: wRebusFetchStatus } = useTokenBalance(wRebusToken?.address, true)
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }
  const [onPresentBuyToken] = useModal(<BuyTokenModal />)

  const handleBuyToken = useCallback((): void => {
    onPresentBuyToken()
  }, [onPresentBuyToken])

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <CopyAddress tooltipMessage={t('Copied')} account={account} mb="24px" />
      {hasLowNativeBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">
              {t('%currency% Balance Low', {
                currency: native.symbol,
              })}
            </Text>
            <Text as="p">
              {t('You need %currency% for transaction fees.', {
                currency: native.symbol,
              })}
            </Text>
          </Box>
        </Message>
      )}
      {!isRebus && chain && (
        <Box mb="12px">
          <Flex justifyContent="space-between" alignItems="center" mb="8px">
            <Flex bg={COLORS.ETH} borderRadius="16px" pl="4px" pr="8px" py="2px">
              <ChainLogo chainId={chain.id} />
              <Text color="white" ml="4px">
                {chain.name}
              </Text>
            </Flex>
            <LinkExternal href={getBlockExploreLink(account, 'address', chainId)}>
              {getBlockExploreName(chainId)}
            </LinkExternal>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">
              {native.symbol} {t('Balance')}
            </Text>
            {!nativeBalance.isFetched ? (
              <Skeleton height="22px" width="60px" />
            ) : (
              <Text>{formatBigNumber(nativeBalance.data.value, 6)}</Text>
            )}
          </Flex>
          {wNativeBalance.gt(0) && (
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle">
                {wNativeToken.symbol} {t('Balance')}
              </Text>
              {wNativeFetchStatus !== FetchStatus.Fetched ? (
                <Skeleton height="22px" width="60px" />
              ) : (
                <Text>{getFullDisplayBalance(wNativeBalance, wNativeToken.decimals, 6)}</Text>
              )}
            </Flex>
          )}
        </Box>
      )}
      <Box mb="24px">
        <Flex justifyContent="space-between" alignItems="center" mb="8px">
          <Flex bg={COLORS.BNB} borderRadius="16px" pl="4px" pr="8px" py="2px">
            <ChainLogo chainId={DEFAULT_CHAIN_ID} />
            <Text color="white" ml="4px">
              Rebus Chain
            </Text>
          </Flex>
          <LinkExternal isBscScan href={getBlockExploreLink(account, 'address', DEFAULT_CHAIN_ID)}>
            {getBlockExploreName(DEFAULT_CHAIN_ID)}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle">Rebus {t('Balance')}</Text>
          {!rebusBalance.isFetched ? (
            <Skeleton height="22px" width="60px" />
          ) : (
            <Text>{formatBigNumber(rebusBalance.data.value, 6)}</Text>
          )}
        </Flex>
        {wRebusBalance.gt(0) && (
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">WRebus {t('Balance')}</Text>
            {wRebusFetchStatus !== FetchStatus.Fetched ? (
              <Skeleton height="22px" width="60px" />
            ) : (
              <Text>{getFullDisplayBalance(wRebusBalance, wRebusToken.decimals, 6)}</Text>
            )}
          </Flex>
        )}
      </Box>
      <Button variant="secondary" width="100%" minHeight={48} mb="2" onClick={handleBuyToken}>
        {t('Buy Tokens')}
      </Button>
      <Button variant="secondary" width="100%" minHeight={48} onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
