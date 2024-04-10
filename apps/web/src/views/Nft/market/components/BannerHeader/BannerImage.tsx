import styled from 'styled-components'

export const StyledBannerImageWrapper = styled.div`
  ${({ theme }) => `background-color: ${theme.colors.cardBorder}`};
  flex: none;
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 394 / 100;

  ${({ theme }) => theme.mediaQueries.sm} {
    aspect-ratio: 394 / 100;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    aspect-ratio: 394 / 100;
  }
`
