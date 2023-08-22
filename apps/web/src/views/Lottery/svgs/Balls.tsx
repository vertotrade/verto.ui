import styled from 'styled-components'
import { Svg, SvgProps, Text, Flex } from '@verto/uikit'

export const LightThemeBall: React.FC<React.PropsWithChildren<SvgProps>> = props => {
  return (
    <Svg viewBox="0 0 32 32" {...props}>
      <defs>
        <linearGradient id="circleGradient" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="#EBEBEB" />
          <stop offset="100%" stopColor="rgba(235, 235, 235, 0)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#circleGradient)" />
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.1">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.3428 3.13232C28.9191 8.87177 28.5505 17.2573 23.2373 22.5706C17.528 28.2799 8.27148 28.2799 2.56223 22.5706C2.2825 22.2909 2.01648 22.0026 1.76416 21.7067C4.02814 27.3486 9.54881 31.3326 16 31.3326C24.4683 31.3326 31.3332 24.4677 31.3332 15.9994C31.3332 10.6078 28.5504 5.8661 24.3428 3.13232Z"
          fill="black"
        />
      </g>
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.1">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.7713 4.18262C30.6308 10.2119 30.2607 19.061 24.6609 24.6608C19.0615 30.2602 10.2132 30.6307 4.18396 25.7722C6.99643 29.1689 11.2455 31.3329 16 31.3329C24.4683 31.3329 31.3332 24.468 31.3332 15.9997C31.3332 11.2446 29.1687 6.99508 25.7713 4.18262Z"
          fill="black"
        />
      </g>
      <g style={{ mixBlendMode: 'soft-light' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.48969 24.8677C0.151051 18.7651 0.974979 11.0636 6.01931 6.01927C11.0639 0.974682 18.7659 0.15093 24.8687 3.49016C22.365 1.71201 19.3046 0.666603 16 0.666603C7.53165 0.666603 0.666733 7.53152 0.666733 15.9998C0.666733 19.3041 1.7119 22.3642 3.48969 24.8677Z"
          fill="white"
        />
      </g>
      <g style={{ mixBlendMode: 'soft-light' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.10075 9.5143C3.77271 5.93677 6.78528 3.11129 10.4921 1.68422C10.546 1.73235 10.5987 1.78219 10.6502 1.83374C12.4838 3.66728 10.9119 5.7442 8.66145 7.99465C6.411 10.2451 4.33417 11.8169 2.50064 9.98335C2.35338 9.83609 2.22013 9.6793 2.10075 9.5143Z"
          fill="white"
        />
      </g>
    </Svg>
  )
}
export const DarkThemeBall: React.FC<React.PropsWithChildren<SvgProps>> = props => {
  return (
    <Svg viewBox="0 0 32 32" {...props}>
      <circle cx="16" cy="16" r="16" fill="#484848" />
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.1">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.3428 3.13232C28.9191 8.87177 28.5505 17.2573 23.2373 22.5706C17.528 28.2799 8.27148 28.2799 2.56223 22.5706C2.2825 22.2909 2.01648 22.0026 1.76416 21.7067C4.02814 27.3486 9.54881 31.3326 16 31.3326C24.4683 31.3326 31.3332 24.4677 31.3332 15.9994C31.3332 10.6078 28.5504 5.8661 24.3428 3.13232Z"
          fill="black"
        />
      </g>
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.1">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.7713 4.18262C30.6308 10.2119 30.2607 19.061 24.6609 24.6608C19.0615 30.2602 10.2132 30.6307 4.18396 25.7722C6.99643 29.1689 11.2455 31.3329 16 31.3329C24.4683 31.3329 31.3332 24.468 31.3332 15.9997C31.3332 11.2446 29.1687 6.99508 25.7713 4.18262Z"
          fill="black"
        />
      </g>
      <g style={{ mixBlendMode: 'soft-light' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.48969 24.8677C0.151051 18.7651 0.974979 11.0636 6.01931 6.01927C11.0639 0.974682 18.7659 0.15093 24.8687 3.49016C22.365 1.71201 19.3046 0.666603 16 0.666603C7.53165 0.666603 0.666733 7.53152 0.666733 15.9998C0.666733 19.3041 1.7119 22.3642 3.48969 24.8677Z"
          fill="white"
        />
      </g>
      <g style={{ mixBlendMode: 'soft-light' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.10075 9.5143C3.77271 5.93677 6.78528 3.11129 10.4921 1.68422C10.546 1.73235 10.5987 1.78219 10.6502 1.83374C12.4838 3.66728 10.9119 5.7442 8.66145 7.99465C6.411 10.2451 4.33417 11.8169 2.50064 9.98335C2.35338 9.83609 2.22013 9.6793 2.10075 9.5143Z"
          fill="white"
        />
      </g>
    </Svg>
  )
}

const BallDivComponent = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) =>
    isDark ? '#484848' : 'linear-gradient(180deg, #EBEBEB 0%, rgba(235, 235, 235, 0) 100%);'};

  min-height: 36px;
  width: 100%;
  max-width: 48px;
  flex-grow: 1;
  min-width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;

  @media screen and (max-width: 800px) {
    height: 32px;
    width: 32px;
  }
`

export const BallTextWrapper = styled.div`
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
`

export const BallText = styled(Text)<{ rotationTransform?: number }>`
  color: ${({ theme }) => theme.colors.text}};
  font-style: normal;
  font-weight: 600;
  font-size: 22px;
  line-height: 28px;
  position: relative;
  top: 2px;

  @media screen and (max-width: 800px) {
    font-size: 18px;
  }
`

export type BallColor = 'pink' | 'lilac' | 'teal' | 'aqua' | 'green' | 'yellow'

interface BallWithNumberProps {
  isDark: boolean
  color?: BallColor
  number: string
  size?: string
  fontSize?: string
  rotationTransform?: number
}

export const BallWithNumber: React.FC<React.PropsWithChildren<BallWithNumberProps>> = ({
  isDark,
  number,
  fontSize,
  rotationTransform,
}) => {
  return (
    <Flex alignItems="center" justifyContent="center" position="relative" mx="2px">
      <BallDivComponent isDark={isDark} />
      <BallTextWrapper>
        <BallText rotationTransform={rotationTransform} bold fontSize={fontSize ?? '16px'}>
          {number}
        </BallText>
      </BallTextWrapper>
    </Flex>
  )
}
