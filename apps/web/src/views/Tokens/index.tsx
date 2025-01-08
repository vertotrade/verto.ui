import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { Heading, Flex, PageHeader, Pool } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { vertoTokens, vertoTokensTestnet, vertoTokensTestnetL2 } from '@verto/tokens'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import Page from 'components/Layout/Page'
import { ChainId, CurrencyAmount } from '@verto/sdk'
import { useCurrency } from 'hooks/Tokens'
// import useNativeCurrency from 'hooks/useNativeCurrency'
import { useCurrencyBalances } from 'state/wallet/hooks'
import TokenRow from './TokenRow'

const tokens =
  DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET
    ? vertoTokensTestnet
    : DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET_L2
    ? vertoTokensTestnetL2
    : vertoTokens

const allTokens = Object.values(tokens)

const Tokens: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const rebusCurrency = useCurrency('ETH')
  // const rebusCurrency = useNativeCurrency()
  const allCurrencies = [rebusCurrency, ...allTokens].filter(Boolean)
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, allCurrencies)
  const currencyAmounts = useMemo(
    () =>
      relevantTokenBalances.map((tokenBalance, index) => {
        if (typeof tokenBalance === 'undefined') {
          return CurrencyAmount.fromRawAmount(allCurrencies[index], '0')
        }

        return tokenBalance
      }),
    [allCurrencies, relevantTokenBalances],
  )

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Tokens')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        {currencyAmounts.length > 0 && (
          <Pool.PoolsTable>
            {currencyAmounts.map(currencyAmount => (
              <TokenRow key={currencyAmount.currency.symbol} currencyAmount={currencyAmount} />
            ))}
          </Pool.PoolsTable>
        )}
      </Page>
    </>
  )
}

export default Tokens
