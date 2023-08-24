import { Box } from '@verto/uikit'
import styled from 'styled-components'

export const StyledPriceChart = styled(Box)<{
  $isDark: boolean
  $isExpanded: boolean
  $isFullWidthContainer?: boolean
}>`
  border: none;
  border-radius: 32px;
  width: 100%;
  padding-top: 36px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 8px;
    background: ${({ $isDark, theme }) => ($isDark ? theme.colors.backgroundAlt : '#f6f5f5')};
    border-radius: 24px;
    width: 100%;
    height: ${({ $isExpanded }) => ($isExpanded ? '100%' : '516px')};
  }
`

export const StyledPriceChartContainer = styled.div<{
  $isExpanded: boolean
  $isFullWidthContainer?: boolean
}>`
  height: 100%;
  width: ${({ $isExpanded, $isFullWidthContainer }) => ($isFullWidthContainer || $isExpanded ? '100%' : '50%')};
  display: flex;
  flex-direction: column;

  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;

  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
  }
`

StyledPriceChart.defaultProps = {
  height: '70%',
}
