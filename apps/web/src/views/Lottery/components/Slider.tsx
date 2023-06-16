import { useState, useRef, useEffect, useMemo } from 'react'
import Carousel from 'react-multi-carousel'
import styled from 'styled-components'
import { Flex, Skeleton, useModal } from '@verto/uikit'
import { useTheme } from '@verto/hooks'
import { useTranslation } from '@verto/localization'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchLottery } from 'state/lottery/helpers'
import { LotteryStatus } from 'config/constants/types'
import { getDrawnDate, processLotteryResponse } from '../helpers'
import LotteryDetailsModal from './LotteryDetailsModal'
import 'react-multi-carousel/lib/styles.css'
import WinningNumbers from './WinningNumbers'

const StyledCarousel = styled(Carousel)`
  &.react-multi-carousel-list {
    height: auto;
    width: 100%;
    min-height: 50px;
    min-width: 500px;
  }

  & .react-multi-carousel-item {
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }

  & .react-multi-carousel-item--active {
    opacity: 1;
  }
`

const TicketSlide = styled(Flex)<{ isDark: boolean }>`
  background: url(/images/lottery/${props => (props.isDark ? 'ticket-dark.svg' : 'ticket.svg')}) no-repeat center center;
  background-size: 100% 100%;
  min-height: 295px;
  margin: 0px 10px;
  position: relative;
  height: 100%;
`

const SlideContentOuterWrapper = styled(Flex)`
  position: relative;
  height: 100%;
  padding-top: 10%;

  @media screen and (max-width: 800px) {
    padding-top: 15%;
  }
`
const WinningNumbersWrapper = styled(Flex)`
  margin-top: 60px;
`
const BoldText = styled.p`
  font-weight: 700;
`

const WinningNumbersTitle = styled.p`
  margin-bottom: 20px;
`

const WinningNumbersInnerWrapper = styled(Flex)`
  width: 85%;

  @media screen and (max-width: 800px) {
    width: 100%;
  }
`

const SeeDetailsButton = styled.button`
  width: 100%;
  height: 56px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.buttonVariantBorder};
  color: ${({ theme }) => theme.colors.text};
  margin-top: 20px;
  border-radius: 32px;
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
`

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}

interface ItemProps {
  index: number
}

const SlideContent = ({ title, date, lotteryData, onClickHandler, openState = false, processedLotteryData }) => {
  const [onPresentLotteryDetailsModal] = useModal(
    <LotteryDetailsModal selectedLotteryNodeData={processedLotteryData} id={lotteryData.id} />,
  )

  const onClick = () => {
    onClickHandler(lotteryData.id)
    onPresentLotteryDetailsModal()
  }
  return (
    <SlideContentOuterWrapper id="outer-wrap" flexDirection="column">
      <Flex id="inner-wrap" flexDirection="column" justifyContent="center" alignItems="center">
        <BoldText>{title}</BoldText>
        <p>{`Drawn ${date}`}</p>
      </Flex>
      <WinningNumbersWrapper flexDirection="column" justifyContent="center" alignItems="center">
        <WinningNumbersTitle>Winning Numbers</WinningNumbersTitle>
        <WinningNumbersInnerWrapper flexDirection="column">
          {lotteryData?.finalNumber ? (
            <WinningNumbers
              rotateText={false}
              number={lotteryData?.finalNumber.toString()}
              mr={[null, null, null, '32px']}
              size="100%"
              fontSize="16px"
            />
          ) : (
            <Skeleton height={['34px', null, null, '71px']} mr={[null, null, null, '32px']} />
          )}

          <SeeDetailsButton onClick={onClick}>See Details</SeeDetailsButton>
        </WinningNumbersInnerWrapper>
      </WinningNumbersWrapper>
    </SlideContentOuterWrapper>
  )
}

const Slider = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const { isDark } = useTheme()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    currentLotteryId,
    lotteriesData,
    currentRound: { status },
  } = useLottery()
  const [latestRoundId, setLatestRoundId] = useState(null)
  const [selectedRoundId, setSelectedRoundId] = useState('')
  const [selectedLotteryNodeData, setSelectedLotteryNodeData] = useState(null)
  const timer = useRef(null)

  const numRoundsFetched = lotteriesData?.length

  const items = useMemo(() => {
    return lotteriesData
      ?.filter(lottery => lottery.status.toLowerCase() !== 'open')
      .map(lottery => ({
        title: `Round ${lottery.id}`,
        date: getDrawnDate(locale, lottery.endTime),
        lotteryData: { ...lottery },
      }))
  }, [lotteriesData, locale])

  useEffect(() => {
    if (currentLotteryId) {
      const currentLotteryIdAsInt = currentLotteryId ? parseInt(currentLotteryId) : null
      const mostRecentFinishedRoundId =
        status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
      setLatestRoundId(mostRecentFinishedRoundId)
      setSelectedRoundId(mostRecentFinishedRoundId.toString())
    }
  }, [currentLotteryId, status])

  useEffect(() => {
    setSelectedLotteryNodeData(null)

    const fetchLotteryData = async () => {
      const lotteryData = await fetchLottery(selectedRoundId)
      const processedLotteryData = processLotteryResponse(lotteryData)
      setSelectedLotteryNodeData(processedLotteryData)
    }

    timer.current = setInterval(() => {
      if (selectedRoundId) {
        fetchLotteryData()
      }
      clearInterval(timer.current)
    }, 1000)

    return () => clearInterval(timer.current)
  }, [selectedRoundId, currentLotteryId, numRoundsFetched, dispatch])

  const Item = styled(TicketSlide)<ItemProps>`
    opacity: ${props => (props.index === activeItemIndex ? '1' : '0.5')};

    &:hover {
      opacity: 1;
    }
  `

  const handleBeforeChange = nextSlide => {
    setActiveItemIndex(nextSlide)
  }

  const handleDetailsClick = async (id: string) => {
    const lotteryData = await fetchLottery(id)
    const processedLotteryData = processLotteryResponse(lotteryData)
  }

  useEffect(() => {
    setActiveItemIndex(0)
  }, [])

  return items?.length ? (
    <StyledCarousel responsive={responsive} beforeChange={handleBeforeChange}>
      {items?.map((item, index) => (
        <Item justifyContent="center" isDark={isDark} index={index}>
          <SlideContent
            title={item.title}
            date={item.date}
            lotteryData={item.lotteryData}
            onClickHandler={handleDetailsClick}
            processedLotteryData={selectedLotteryNodeData}
          />
        </Item>
      ))}
    </StyledCarousel>
  ) : (
    <h1>No lotteries have been drawn yet</h1>
  )
}

export default Slider
