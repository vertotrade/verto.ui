import styled from 'styled-components'
import { Flex, Image, Text, Th } from '@verto/uikit'
import CollapsibleCard from 'components/CollapsibleCard'

export const StyledCollapsibleCard = styled(CollapsibleCard)<{ marginBottom?: string }>`
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.colors.hr};

  > div {
    background: ${({ theme }) => theme.colors.vertoBg1};

    & > div:first-child {
      background: ${({ theme }) => theme.colors.vertoBg1};
      padding: 0 0 10px 0;

      h3 {
        font-size: 16px;
      }
    }
  }
`

export const TableWrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  min-width: 320px;
  overflow-x: auto;
`

export const StyledTh = styled(Th)`
  text-transform: none;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const NftImage = styled(Image)`
  flex: none;
  & > img {
    border-radius: 8px;
  }
`

export const ClickableRow = styled.tr`
  cursor: pointer;

  &:hover {
    td {
      opacity: 0.65;
    }
  }
`

export const NftName: React.FC<React.PropsWithChildren<{ thumbnailSrc: string; name: string }>> = ({
  thumbnailSrc,
  name,
}) => (
  <Flex alignItems="center">
    <NftImage src={thumbnailSrc} width={48} height={48} mr="8px" />
    <Text>{name}</Text>
  </Flex>
)
