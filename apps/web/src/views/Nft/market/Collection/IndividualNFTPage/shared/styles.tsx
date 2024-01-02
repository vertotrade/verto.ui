import styled from 'styled-components'
import { Box, Flex, Grid, Image, NextLinkFromReactRouter } from '@verto/uikit'

export const RoundedImage = styled(Image)`
  height: max-content;
  border-radius: ${({ theme }) => theme.radii.default};
  overflow: hidden;
  & > img {
    object-fit: contain;
  }
`

export const SmallRoundedImage = styled(Image)`
  & > img {
    border-radius: ${({ theme }) => theme.radii.default};
  }
`

export const Container = styled(Flex)`
  gap: 24px;
`

export const CollectionLink = styled(NextLinkFromReactRouter)`
  color: ${({ theme }) => theme.colors.primary};
  display: block;
  font-weight: 600;
  line-height: 22px;
  font-family: 'Poppins', sans-serif;
`

export const PriceBox = styled(Flex)`
  margin-top: 32px;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.hr};
  border-radius: 16px;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    width: 464px;
    justify-content: space-between;
  }
`

export const CollectibleRowContainer = styled(Grid)`
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`

export const StyledSortButton = styled.button`
  border: none;
  cursor: pointer;
  background: none;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: bold;
`

export const ButtonContainer = styled(Box)`
  text-align: right;
  padding-right: 24px;
`

export const TableHeading = styled(Grid)`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
`
