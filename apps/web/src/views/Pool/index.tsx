import { useMemo } from 'react'
import useTheme from 'hooks/useTheme'
import { Text, CardBody, CardFooter, Button, AddIcon } from '@verto/uikit'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useTranslation } from '@verto/localization'
import { useLPTokensWithBalanceByAccount } from 'views/Swap/StableSwap/hooks/useStableConfig'
import FullPositionCard, { StableFullPositionCard } from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

export default function Pool() {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const theme = useTheme()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  const stablePairs = useLPTokensWithBalanceByAccount(account)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }

    let positionCards = []

    if (allV2PairsWithLiquidity?.length > 0) {
      positionCards = allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={0}
          style={{
            borderBottom: `1px solid ${theme.theme.colors.hrBold}`,
            borderBottomWidth: index < allV2PairsWithLiquidity.length - 1 ? '1px' : 0,
            borderRadius: 0,
          }}
        />
      ))
    }

    if (stablePairs?.length > 0) {
      positionCards = [
        ...positionCards,
        ...stablePairs?.map((stablePair, index) => (
          <StableFullPositionCard
            key={`stable-${stablePair.liquidityToken.address}`}
            pair={stablePair}
            mb={index < stablePairs.length - 1 ? '16px' : 0}
          />
        )),
      ]
    }

    if (positionCards?.length > 0) {
      return positionCards
    }

    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <CardBody>
          {renderBody()}
          {/* TODO: Renable once users can create custom pairs */}
          {/* {account && !v2IsLoading && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pair you joined?")}
              </Text>
              <Link href="/find" passHref>
                <Button id="import-pool-link" variant="secondary" scale="sm" as="a">
                  {t('Find other LP tokens')}
                </Button>
              </Link>
            </Flex>
          )} */}
        </CardBody>
        <CardFooter style={{ textAlign: 'center' }}>
          <Link href="/add" passHref>
            <Button id="join-pool-button" variant="secondary" width="100%" startIcon={<AddIcon color="black" />}>
              {t('Add Liquidity')}
            </Button>
          </Link>
        </CardFooter>
      </AppBody>
    </Page>
  )
}
