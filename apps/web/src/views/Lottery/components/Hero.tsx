import styled, { keyframes } from 'styled-components'
import { Box, Flex, Heading, Skeleton, Balance } from '@verto/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@verto/localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useLottery } from 'state/lottery/hooks'
import useTheme from 'hooks/useTheme'
import { getBalanceNumber } from '@verto/utils/formatBalance'
import { TicketPurchaseCard } from '../svgs'
import BuyTicketsButton from './BuyTicketsButton'

const mainTicketAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(6deg);
  }
  to {
    transform: rotate(0deg);
  }
`

const TicketContainer = styled(Flex)`
  animation: ${mainTicketAnimation} 3s ease-in-out infinite;
`

const PrizeTotalBalance = styled(Balance)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StyledBuyTicketButton = styled(BuyTicketsButton)<{ disabled: boolean }>`
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.disabled : 'linear-gradient(180deg, #7645d9 0%, #452a7a 100%)'};
  width: 200px;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 240px;
  }
`

const ButtonWrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-4deg);
`

const TicketSvgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-4deg);
`

const Hero = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const {
    currentRound: { amountCollectedInCake, status },
    isTransitioning,
  } = useLottery()

  const cakePriceBusd = usePriceCakeBusd()
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const getHeroHeading = () => {
    if (status === LotteryStatus.OPEN) {
      return (
        <>
          {prizeInBusd.isNaN() ? (
            <Skeleton my="7px" height={60} width={190} />
          ) : (
            <PrizeTotalBalance fontSize="64px" bold prefix="$" value={prizeTotal} mb="8px" decimals={0} />
          )}
          <Heading mb="32px" scale="lg" color="#ffffff">
            {t('in prizes!')}
          </Heading>
        </>
      )
    }
    return (
      <Heading mb="24px" scale="xl" color={theme.colors.text}>
        {t('Tickets on sale soon')}
      </Heading>
    )
  }

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Heading mb="8px" scale="md" color={theme.colors.text} id="lottery-hero-title">
        {t('The VertoTrade Lottery')}
      </Heading>
      {getHeroHeading()}
      <TicketContainer
        position="relative"
        width={['240px', '288px']}
        height={['94px', '113px']}
        alignItems="center"
        justifyContent="center">
        <ButtonWrapper>
          <StyledBuyTicketButton disabled={ticketBuyIsDisabled} themeMode="light" />
        </ButtonWrapper>
        <TicketSvgWrapper>
          <TicketPurchaseCard width="100%" />
        </TicketSvgWrapper>
      </TicketContainer>
    </Flex>
  )
}

export default Hero
