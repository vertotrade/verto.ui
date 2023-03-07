import styled from 'styled-components'
import { Container } from '@verto/uikit'

export const GradientContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;

  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;

  background: ${({ theme }) => theme.colors.gradientGreenOrange};
  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
  }
`

export const ScrollableContainer = styled(Container)`
  overflow-x: auto;
  padding-left: 0;
  padding-right: 0;

  ::-webkit-scrollbar,
  ::-webkit-scrollbar-thumb {
    height: 5px;
    background: ${({ theme }) => theme.colors.tertiary};
    border-radius: 50px;
  }
`
