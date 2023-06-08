import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, Flex, useModal, AutoRenewIcon, CoinStack } from '@verto/uikit'
import { useAccount } from 'wagmi'
import { FetchStatus, LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@verto/localization'
import useTheme from 'hooks/useTheme'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import IconDivider from 'components/IconDivider'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ClaimPrizesModal from './ClaimPrizesModal'
import useGetUnclaimedRewards from '../hooks/useGetUnclaimedRewards'

const FlexItem = styled(Flex)`
  width: 50%;
`
const ContentWrapper = styled(Flex)`
  width: 100%;
  gap: 100px;

  @media screen and (max-width: 1000px) {
    flex-direction: column-reverse;
  }
`
const StyledHeading = styled(Heading)`
  font-size: 16px;
`

const CheckPrizesSection = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { theme, isDark } = useTheme()
  const {
    isTransitioning,
    currentRound: { status },
  } = useLottery()
  const { fetchAllRewards, unclaimedRewards, fetchStatus } = useGetUnclaimedRewards()
  const userLotteryData = useGetUserLotteriesGraphData()
  const [hasCheckedForRewards, setHasCheckedForRewards] = useState(false)
  const [hasRewardsToClaim, setHasRewardsToClaim] = useState(false)
  const [onPresentClaimModal] = useModal(<ClaimPrizesModal roundsToClaim={unclaimedRewards} />, false)
  const isFetchingRewards = fetchStatus === FetchStatus.Fetching
  const lotteryIsNotClaimable = status === LotteryStatus.CLOSE
  const isCheckNowDisabled = !userLotteryData.account || lotteryIsNotClaimable

  useEffect(() => {
    if (fetchStatus === FetchStatus.Fetched) {
      // Manage showing unclaimed rewards modal once per page load / once per lottery state change
      if (unclaimedRewards.length > 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(true)
        setHasCheckedForRewards(true)
        onPresentClaimModal()
      }

      if (unclaimedRewards.length === 0 && !hasCheckedForRewards) {
        setHasRewardsToClaim(false)
        setHasCheckedForRewards(true)
      }
    }
  }, [unclaimedRewards, hasCheckedForRewards, fetchStatus, onPresentClaimModal])

  useEffect(() => {
    // Clear local state on account change, or when lottery isTransitioning state changes
    setHasRewardsToClaim(false)
    setHasCheckedForRewards(false)
  }, [account, isTransitioning])

  const getBody = () => {
    if (!account) {
      return (
        <Flex mx={['4px', null, '16px']} flexDirection="column" alignItems="flex-start">
          <Heading scale="xxl" color={theme.colors.text} mb="8px">
            {t("Check if you've won!")}
          </Heading>
          <StyledHeading color={theme.colors.text} mb="24px">
            {t('Connect your wallet')}
          </StyledHeading>
          <ConnectWalletButton width="190px" />
        </Flex>
      )
    }
    if (hasCheckedForRewards && !hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <Flex mx={['4px', null, '16px']} flexDirection="column">
            <Heading textAlign="center" color={theme.colors.text}>
              {t('No prizes to collect')}...
            </Heading>
            <Heading textAlign="center" color={theme.colors.text}>
              {t('Better luck next time!')}
            </Heading>
          </Flex>
        </Flex>
      )
    }
    if (hasCheckedForRewards && hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <Flex mx={['4px', null, '16px']} flexDirection="column">
            <Heading textAlign="center" color={theme.colors.text}>
              {t('Congratulations!')}
            </Heading>
            <Heading textAlign="center" color={theme.colors.text}>
              {t('Why not play again')}
            </Heading>
          </Flex>
        </Flex>
      )
    }
    const checkNowText = () => {
      if (lotteryIsNotClaimable) {
        return `${t('Calculating rewards')}...`
      }
      if (isFetchingRewards) {
        return t('Checking')
      }
      return t('Check Now')
    }
    return (
      <Flex alignItems="center" justifyContent="center">
        <Flex mx={['4px', null, '16px']} flexDirection="column">
          <Heading textAlign="center" color={theme.colors.text} mb="24px">
            {t('Are you a winner?')}
          </Heading>
          <Button
            disabled={isCheckNowDisabled}
            variant="secondary"
            onClick={fetchAllRewards}
            isLoading={isFetchingRewards}
            endIcon={isFetchingRewards ? <AutoRenewIcon color="currentColor" spin /> : null}>
            {checkNowText()}
          </Button>
        </Flex>
      </Flex>
    )
  }

  return (
    <ContentWrapper alignItems="center" justifyContent="space-between">
      <FlexItem>
        <IconDivider
          background={isDark ? theme.colors.backgroundAlt2D9 : theme.colors.background}
          textColor={isDark ? theme.colors.text : theme.colors.black}
          divBackground={theme.colors.backgroundAlt}
          Icon={CoinStack}
        />
      </FlexItem>
      <FlexItem>{getBody()}</FlexItem>
    </ContentWrapper>
  )
}

export default CheckPrizesSection
