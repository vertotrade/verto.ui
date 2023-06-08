import styled, { keyframes } from 'styled-components'
import { Box, Flex, Heading, Skeleton, Balance, Text, Button, StarSmile } from '@verto/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@verto/localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useLottery } from 'state/lottery/hooks'
import useTheme from 'hooks/useTheme'
import { getBalanceNumber } from '@verto/utils/formatBalance'
import { useEffect, useRef } from 'react'
import { dateTimeOptions } from '../helpers'
import BuyTicketsButton from './BuyTicketsButton'

const PrizeTotalBalance = styled(Balance)<{ background?: string }>`
  margin-bottom: 0px;
  background: ${props => props.background};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const HeroWrapper = styled(Flex)`
  gap: 130px;

  @media screen and (max-width: 900px) {
    flex-direction: column;
    gap: 25px;
  }
`

const PrizeInfoWrapper = styled(Flex)`
  margin: 28px 0px;
  width: 54%;
`

const BuyTicketsWrapper = styled(Flex)`
  @media screen and (max-width: 900px) {
    justify-content: center;
    align-items: center;
  }
`

const VideoBgWrapper = styled(Flex)`
  position: relative;
`
const HeroContentWrapper = styled(Flex)`
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 15%;
  margin: 0 auto;
  width: 99%;
`

const StyledBuyTicketButton = styled(BuyTicketsButton)<{ disabled: boolean }>`
  background: ${({ theme, disabled }) => (disabled ? theme.colors.disabled : theme.colors.primary)};
`

function Clip({ url }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const { current } = videoRef
    if (!current) {
      return undefined
    }

    current.load()
    return undefined
  }, [url])

  return (
    <video width="100%" height="100%" autoPlay muted loop ref={videoRef}>
      <source src={url} />
    </video>
  )
}

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
  const prizeInXVerto = amountCollectedInCake.times(cakePriceBusd)
  const endTimeMs = parseInt(endTime, 10) * 1000
  const endDate = new Date(endTimeMs)
  const prizeTotal = getBalanceNumber(prizeInXVerto)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const getHeroHeading = () => {
    if (status === LotteryStatus.OPEN) {
      return (
        <>
          {prizeInXVerto.isNaN() ? (
            <Skeleton my="7px" height={60} width={190} />
          ) : (
            <PrizeTotalBalance
              fontSize="32px"
              background={isDark ? 'white' : 'black'}
              bold
              prefix="$"
              value={prizeTotal}
              mb="8px"
              decimals={0}
            />
          )}
          &nbsp;
          <Text fontSize="32px" color={isDark ? theme.colors.white : theme.colors.black}>
            {t('in prizes!')}
          </Text>
        </>
      )
    }
    return (
      <Heading mb="24px" scale="md" color={theme.colors.text}>
        {t('Tickets on sale soon')}
      </Heading>
    )
  }

  const getNextDrawId = () => {
    if (status === LotteryStatus.OPEN) {
      return `${currentLotteryId}`
    }
    if (status === LotteryStatus.PENDING) {
      return ''
    }
    return parseInt(currentLotteryId, 10) + 1
  }

  const getNextDrawDateTime = () => {
    if (status === LotteryStatus.OPEN) {
      return (
        <Flex flexDirection="column">
          <Text fontSize="14px" color={isDark ? theme.colors.white : theme.colors.black}>
            {t('Next Draw')}
          </Text>
          <Text fontSize="22px" color={isDark ? theme.colors.white : theme.colors.black}>
            {endDate.toLocaleString(locale, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </Flex>
      )
    }
    return ''
  }

  const handleClick = () => console.log('click')
  const videoSrc = isDark ? 'images/animations/lottery-01-dark.webm' : 'images/animations/lottery-01-light.webm'

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
        {prizeInXVerto.isNaN() ? (
          <Skeleton my="7px" height={40} width={160} />
        ) : (
          <Balance
            fontSize="22px"
            color="text"
            textAlign={['center', null, null, 'left']}
            lineHeight="1"
            bold
            my="3px"
            prefix="~$"
            value={getBalanceNumber(prizeInXVerto)}
            decimals={0}
          />
        )}
        {prizeInXVerto.isNaN() ? (
          <Skeleton my="4px" height={14} width={90} />
        ) : (
          <Balance
            fontSize="14px"
            my="4px"
            color="textSubtle"
            textAlign={['center', null, null, 'left']}
            unit=" xVERTO"
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
          <StyledBuyTicketButton disabled={ticketBuyIsDisabled} variant="secondary" paddingX="16px">
            {t('Buy Tickets')}
          </StyledBuyTicketButton>
        </BuyTicketsWrapper>
      </Box>
      <Flex flexDirection="column" alignItems="center">
        <VideoBgWrapper>
          <Clip url={videoSrc} />
          <HeroContentWrapper>
            <Flex justifyContent="center" alignItems="center" mb="25px" mt="20px">
              {getHeroHeading()}
            </Flex>
            <PrizeInfoWrapper justifyContent="space-between">
              <Flex flexDirection="column">
                <Flex justifyContent={['center', null, null, 'flex-start']}>
                  <Text fontSize="14px" color={isDark ? theme.colors.white : theme.colors.black}>
                    {t('Prize Pot')}
                  </Text>
                </Flex>
                <Flex flexDirection="column" mb="18px">
                  {getPrizeBalances()}
                </Flex>
              </Flex>
              <Box>
                <Text color={isDark ? theme.colors.white : theme.colors.black} fontSize="16px">
                  {Boolean(endTime) && getNextDrawDateTime()}
                </Text>
                <Text color={isDark ? theme.colors.white : theme.colors.black} fontSize="14px">
                  {currentLotteryId && `#${getNextDrawId()}`}
                </Text>
              </Box>
            </PrizeInfoWrapper>
          </HeroContentWrapper>
        </VideoBgWrapper>
      </Flex>
    </HeroWrapper>
  )
}

export default Hero
