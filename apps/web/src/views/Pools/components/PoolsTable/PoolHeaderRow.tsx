import { useMemo } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@verto/uikit'
import { PoolMobileColumnSchema, PoolDesktopColumnSchema, ColumnsDefTypes } from '@verto/uikit/src/widgets/Pool/types'

const Row = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.newPrimary};
  display: flex;
`

const HeaderCell = styled.div<{ index: number }>`
  padding: 0 8px;

  ${({ index }) => (index === 0 ? 'padding-left: 32px;' : '')}
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: ${({ index }) => {
      switch (index) {
        case 0:
          return '1 0 250px'
        case 1:
        case 3:
          return '1 0 120px'
        case 5:
          return '0 0 60px'
        default:
          return '2 0 100px'
      }
    }};
  }
`

const InnerCell = styled.div<{ index: number }>`
  padding-bottom: 8px;
  text-transform: capitalize;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;

  color: ${({ theme }) => theme.colors.tableHeader};
`

export function PoolHeaderRow() {
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const tableSchema = isDesktop ? PoolDesktopColumnSchema : PoolMobileColumnSchema

  const headerCells = useMemo(
    () =>
      tableSchema.map(({ label }: ColumnsDefTypes, index: number) => (
        <HeaderCell role="columnheader" index={index}>
          <InnerCell index={index}>{isMobile ? '' : label}</InnerCell>
        </HeaderCell>
      )),
    [tableSchema, isMobile],
  )

  return <Row role="row">{headerCells}</Row>
}
