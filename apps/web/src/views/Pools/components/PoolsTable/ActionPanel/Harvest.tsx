import { Button, Text, useModal, Flex, Skeleton, Heading, Balance, Pool, Box } from '@verto/uikit'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from '@verto/utils/formatBalance'
import { useTranslation } from '@verto/localization'
import { BIG_ZERO } from '@verto/utils/bigNumber'
import { Token } from '@verto/sdk'

import { ActionContainer, ActionContent } from './styles'
import CollectModal from '../../Modals/CollectModal'

const HarvestAction: React.FunctionComponent<React.PropsWithChildren<Pool.DeserializedPool<Token>>> = ({
  sousId,
  earningToken,
  liquidToken,
  userData,
  userDataLoaded,
  earningTokenPrice,
  isLiquid,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const liquid = userData?.liquidPendingReward ? new BigNumber(userData.liquidPendingReward) : null
  const liquidTokenBalance = getBalanceNumber(liquid, liquidToken?.decimals)
  const hasEarnings = earnings.gt(0)
  const fullBalance = getFullDisplayBalance(isLiquid ? liquid : earnings, earningToken.decimals)
  const formattedBalance = formatNumber(isLiquid ? liquidTokenBalance : earningTokenBalance, 3, 3)
  const burnFormattedBalance = isLiquid ? formatNumber(earningTokenBalance - liquidTokenBalance, 3, 3) : null

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningTokenSymbol={earningToken.symbol}
      earningsDollarValue={earningTokenDollarBalance}
      burnFormattedBalance={burnFormattedBalance}
      sousId={sousId}
    />,
  )

  if (!account) {
    return (
      <ActionContainer>
        {/* <ActionTitles>{actionTitle}</ActionTitles> */}
        <ActionContent>
          {/* <Heading>0</Heading> */}
          {/* <Button disabled>{t('Harvest')}</Button> */}
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        {/* <ActionTitles>{actionTitle}</ActionTitles> */}
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      {/* <ActionTitles>{actionTitle}</ActionTitles> */}
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <>
            {hasEarnings ? (
              <Flex>
                {isLiquid && (
                  <>
                    <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={liquidTokenBalance} />
                    {earningTokenPrice > 0 && (
                      <Balance
                        display="inline"
                        fontSize="12px"
                        color="text"
                        decimals={2}
                        prefix="~"
                        value={earningTokenDollarBalance}
                        unit=" USD"
                      />
                    )}
                    <Box mx={1}>/</Box>
                  </>
                )}
                <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={earningTokenBalance} />
                {earningTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="text"
                    decimals={2}
                    prefix="~"
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </Flex>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        </Flex>
        <Button disabled={!hasEarnings} onClick={onPresentCollect}>
          {t('Harvest')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
