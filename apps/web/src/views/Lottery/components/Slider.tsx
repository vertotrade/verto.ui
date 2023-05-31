import React, { useState, useEffect } from 'react'
import Carousel from 'react-multi-carousel'
import styled from 'styled-components'
import { Flex } from '@verto/uikit'
import 'react-multi-carousel/lib/styles.css'
import { useTheme } from '@verto/hooks'

const StyledCarousel = styled(Carousel)`
  &.react-multi-carousel-list {
    height: auto;
    width: 100%;
    min-height: 50px;
    min-width: 500px;
  }

  & .react-multi-carousel-item {
    opacity: 0.5;
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
`
const WinningNumbersWrapper = styled(Flex)`
  margin-top: 30%;
`
const BoldText = styled.p`
  font-weight: 700;
`

const items = [
  { title: 'Round 1', date: 'May 7, 2023. 2:00 AM' },
  { title: 'Round 2', date: 'May 7, 2023. 2:00 AM' },
  { title: 'Round 3', date: 'May 7, 2023. 2:00 AM' },
  { title: 'Round 4', date: 'May 7, 2023. 2:00 AM' },
  { title: 'Round 5', date: 'May 7, 2023. 2:00 AM' },
]

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

const SlideContent = ({ title, date }) => {
  return (
    <SlideContentOuterWrapper id="outer-wrap" flexDirection="column">
      <Flex id="inner-wrap" flexDirection="column" justifyContent="center" alignItems="center">
        <BoldText>{title}</BoldText>
        <p>{`Drawn ${date}`}</p>
      </Flex>
      <WinningNumbersWrapper flexDirection="column" justifyContent="center" alignItems="center">
        <p>Winning Numbers</p>
      </WinningNumbersWrapper>
    </SlideContentOuterWrapper>
  )
}

const Slider = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const { isDark } = useTheme()

  const Item = styled(TicketSlide)<ItemProps>`
    opacity: ${props => (props.index === activeItemIndex ? '1' : '0.5')};
  `

  const handleBeforeChange = nextSlide => {
    setActiveItemIndex(nextSlide)
  }

  useEffect(() => {
    setActiveItemIndex(0)
  }, [])

  return (
    <StyledCarousel responsive={responsive} beforeChange={handleBeforeChange}>
      {items.map((item, index) => (
        <Item justifyContent="center" isDark={isDark} index={index}>
          <SlideContent title={item.title} date={item.date} />
        </Item>
      ))}
    </StyledCarousel>
  )
}

export default Slider
