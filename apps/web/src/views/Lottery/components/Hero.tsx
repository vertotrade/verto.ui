import styled, { keyframes } from 'styled-components'
import { Box, Flex, Heading, Skeleton, Balance, Text, Button, StarSmile } from '@verto/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@verto/localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useLottery } from 'state/lottery/hooks'
import useTheme from 'hooks/useTheme'
import { getBalanceNumber } from '@verto/utils/formatBalance'
import { dateTimeOptions } from '../helpers'
import { TicketPurchaseCard } from '../svgs'
import BuyTicketsButton from './BuyTicketsButton'

const Rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const TicketContainer = styled(Flex)``

const PrizeTotalBalance = styled(Balance)<{ background?: string }>`
  margin-bottom: 0px;
  background: ${props => props.background};
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

const HeroWrapper = styled(Flex)`
  @media screen and (max-width: 900px) {
    flex-direction: column;
    gap: 25px;
  }
`

const GreenWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(90deg, #30e8bf 0%, #82f8c7 100%);
  border-radius: 0px 90px 90px 90px;
  width: 100%;
  height: 360px;
  padding: 67px 40px 0px;
  position: relative;
  overflow: hidden;
`

const CircleDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  width: 180px;
  height: 180px;
  border: 4px solid ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 50%;
`
const CurvedRectangle = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  width: 360px;
  height: 180px;
  border-radius: 90px 90px 0px 90px;
`

const TicketWrapper = styled(Flex)`
  background: url('/images/lottery/ticket.svg');
  width: 100%;
  height: 100%;
  max-width: 370px;
  z-index: 1;
`
const PrizeInfoWrapper = styled(Flex)`
  margin: 24px 0px;
`

const BuyTicketsWrapper = styled(Flex)`
  @media screen and (max-width: 900px) {
    justify-content: center;
    align-items: center;
  }
`

const StripesVector = styled.img`
  position: absolute;
  top: -59px;
  width: 575px;
  z-index: 0;
  animation: ${Rotate} 12s linear infinite;
`

const Hero = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { theme, isDark } = useTheme()
  const {
    currentRound: { endTime, amountCollectedInCake, status },
    isTransitioning,
    currentLotteryId,
  } = useLottery()

  const cakePriceBusd = usePriceCakeBusd()
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const endTimeMs = parseInt(endTime, 10) * 1000
  const endDate = new Date(endTimeMs)
  const prizeTotal = getBalanceNumber(prizeInBusd)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const getHeroHeading = () => {
    if (status === LotteryStatus.OPEN) {
      return (
        <>
          {prizeInBusd.isNaN() ? (
            <Skeleton my="7px" height={60} width={190} />
          ) : (
            <PrizeTotalBalance
              fontSize="64px"
              bold
              prefix="$"
              value={prizeTotal}
              mb="8px"
              decimals={0}
              color={isDark ? theme.colors.white : theme.colors.black}
            />
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

  const getNextDrawId = () => {
    if (status === LotteryStatus.OPEN) {
      return `${currentLotteryId} |`
    }
    if (status === LotteryStatus.PENDING) {
      return ''
    }
    return parseInt(currentLotteryId, 10) + 1
  }

  const getNextDrawDateTime = () => {
    // if (status === LotteryStatus.OPEN) {
    //   return `${t('Draw')}: ${endDate.toLocaleString(locale, dateTimeOptions)}`
    // }
    // return 'Blah Blah'
    if (true) {
      console.log(
        '========\n',
        'date',
        `${t('Draw')}: ${endDate.toLocaleString(locale, dateTimeOptions)}`,
        '\n========',
      )
      return `${t('Draw')}: ${endDate.toLocaleString(locale, dateTimeOptions)}`
    }
    return 'Blah Blah'
  }

  const handleClick = () => console.log('click')

  const getPrizeBalances = () => {
    if (status === LotteryStatus.CLOSE || status === LotteryStatus.CLAIMABLE) {
      return (
        <Heading scale="xl" color="secondary" textAlign={['center', null, null, 'left']}>
          {t('Calculating')}...
        </Heading>
      )
    }
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={160} />
        ) : (
          <Balance
            fontSize="40px"
            color="secondary"
            textAlign={['center', null, null, 'left']}
            lineHeight="1"
            bold
            prefix="~$"
            value={getBalanceNumber(prizeInBusd)}
            decimals={0}
          />
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={14} width={90} />
        ) : (
          <Balance
            fontSize="14px"
            color="textSubtle"
            textAlign={['center', null, null, 'left']}
            unit=" CAKE"
            value={getBalanceNumber(amountCollectedInCake)}
            decimals={0}
          />
        )}
      </>
    )
  }

  return (
    <HeroWrapper flexDirection="row" alignItems="center" justifyContent="space-between">
      <Box style={{ maxWidth: '465px' }}>
        <Heading mb="8px" scale="xxl" color={theme.colors.text} id="lottery-hero-title">
          {t('Verto Lottery')}
        </Heading>
        <Text mb="24px" color={theme.colors.text}>
          {t(
            'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
          )}
        </Text>
        <BuyTicketsWrapper>
          <Button onClick={handleClick} variant="secondary" paddingX="16px">
            {t('Buy Tickets')}
          </Button>
        </BuyTicketsWrapper>
      </Box>
      <Flex flexDirection="column" alignItems="center">
        <GreenWrapper>
          <StripesVector src="/images/lottery/wheel.svg" />
          <TicketWrapper
            style={{ background: `url(/images/lottery/${isDark ? 'ticket-dark.svg' : 'ticket.svg'})` }}
            flexDirection="column"
            alignItems="center">
            <Flex justifyContent="center" alignItems="center" mb="25px" mt="25px">
              <PrizeTotalBalance
                fontSize="32px"
                background={isDark ? 'white' : 'black'}
                bold
                prefix="$"
                value={prizeTotal}
                mb="8px"
                decimals={0}
              />
              &nbsp;
              <Text fontSize="32px" color={isDark ? theme.colors.white : theme.colors.black}>
                {t('in prizes!')}
              </Text>
            </Flex>
            <PrizeInfoWrapper justifyContent="space-between">
              <Box>
                <Flex justifyContent={['center', null, null, 'flex-start']}>
                  <Text fontSize="14px" color={isDark ? theme.colors.white : theme.colors.black}>
                    {t('Prize Pot')}
                  </Text>
                </Flex>
                <Flex flexDirection="column" mb="18px">
                  {getPrizeBalances()}
                </Flex>
              </Box>
              <Box>
                <Text color={isDark ? theme.colors.white : theme.colors.black} fontSize="16px">
                  {`#${getNextDrawId()}`} {Boolean(endTime) && getNextDrawDateTime()}
                  {/* {currentLotteryId && `#${getNextDrawId()}`} {Boolean(endTime) && getNextDrawDateTime()} real one */}
                </Text>
              </Box>
            </PrizeInfoWrapper>
          </TicketWrapper>
        </GreenWrapper>
        <Flex>
          <CircleDiv>
            <StarSmile color={isDark ? theme.colors.white : theme.colors.black} />
          </CircleDiv>
          <CurvedRectangle />
        </Flex>
      </Flex>
    </HeroWrapper>
  )
}

export default Hero
