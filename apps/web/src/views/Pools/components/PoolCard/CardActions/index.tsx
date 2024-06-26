import BigNumber from 'bignumber.js'

import { getBalanceNumber } from '@verto/utils/formatBalance'
import styled from 'styled-components'
import { BIG_ZERO } from '@verto/utils/bigNumber'
import { Flex, Text, Box, Pool, Balance } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { PoolCategory } from 'config/constants/types'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'
import { Token } from '@verto/sdk'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'
import { ProfileRequirementWarning } from '../../ProfileRequirementWarning'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pool.DeserializedPool<Token>
  stakedBalance: BigNumber
  liquidBalance?: BigNumber
}

const CardActions: React.FC<React.PropsWithChildren<CardActionsProps>> = ({ pool, stakedBalance, liquidBalance }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    liquidToken,
    poolCategory,
    userData,
    earningTokenPrice,
    liquidTokenPrice,
    profileRequirement,
    isLiquid,
  } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const liquid = userData?.liquidPendingReward ? new BigNumber(userData.liquidPendingReward) : null
  const needsApproval = !allowance.gt(0) && !isBnbPool
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)

  const liquidTokenBalance = getBalanceNumber(liquidBalance, liquidToken?.decimals)
  const liquidTokenDollarBalance =
    getBalanceNumber(liquidBalance.multipliedBy(liquidTokenPrice), liquidToken?.decimals) || 0

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <>
          <Box display="inline">
            <InlineText color="text" textTransform="uppercase" bold fontSize="12px">
              {`${earningToken.symbol} `}
            </InlineText>
            <InlineText color="text" textTransform="uppercase" bold fontSize="12px">
              {t('Earned')}
            </InlineText>
          </Box>
          <HarvestActions
            earnings={earnings}
            liquid={liquid}
            isLiquid={isLiquid}
            earningTokenSymbol={earningToken.symbol}
            earningTokenDecimals={earningToken.decimals}
            sousId={sousId}
            earningTokenPrice={earningTokenPrice}
            isLoading={isLoading}
          />
        </>
        <Box display="inline" mb="8px">
          <InlineText color="text" textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText color="text" textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {notMeetRequired || notMeetThreshold ? (
          <ProfileRequirementWarning profileRequirement={profileRequirement} />
        ) : needsApproval && !isStaked ? (
          <ApprovalAction pool={pool} isLoading={isLoading} />
        ) : (
          <StakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakedBalance={stakedBalance}
            isStaked={isStaked}
          />
        )}
        {isLiquid && (
          <>
            <Box display="inline" mt="16px" mb="8px">
              <InlineText color="text" textTransform="uppercase" bold fontSize="12px">
                {isStaked ? liquidToken.symbol : t('Stake')}{' '}
              </InlineText>
              <InlineText color="text" textTransform="uppercase" bold fontSize="12px">
                {isStaked ? t('Available') : `${liquidToken.symbol}`}
              </InlineText>
            </Box>
            <Flex flexDirection="column">
              <Balance bold fontSize="20px" decimals={3} value={liquidTokenBalance} />
              {liquidTokenPrice && (
                <Text fontSize="12px" color="textSubtle">
                  <Balance
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    value={liquidTokenDollarBalance}
                    prefix="~"
                    unit=" USD"
                  />
                </Text>
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default CardActions
