import { useMemo } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@verto/uikit'
import {
  PoolMobileColumnSchema,
  PoolTabletColumnSchema,
  PoolDesktopColumnSchema,
  ColumnsDefTypes,
} from '@verto/uikit/src/widgets/Pool/types'

const Row = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.newPrimary};
  display: flex;
`

const HeaderCell = styled.div<{ index: number; name: string; isMobile: boolean }>`
  padding: 0 8px;

  ${({ index }) => (index === 0 ? 'padding-left: 32px;' : '')}
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: ${({ name, isMobile }) => {
      switch (name) {
        case 'pools':
          return '1 0 250px'
        case 'earned':
        case 'liquidity':
        case 'apr':
          return '1 0 120px'
        case 'details':
          return isMobile ? '1' : '0 0 60px'
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
  white-space: nowrap;

  color: ${({ theme }) => theme.colors.tableHeader};
`

export function PoolHeaderRow() {
  const { isLg, isXl, isXxl, isDesktop, isMobile } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  let tableSchema = isDesktop ? PoolDesktopColumnSchema : PoolMobileColumnSchema
  if (isLargerScreen && !isDesktop) {
    tableSchema = PoolTabletColumnSchema
  }

  const headerCells = useMemo(
    () =>
      tableSchema.map(({ label, name }: ColumnsDefTypes, index: number) => (
        <HeaderCell role="columnheader" index={index} name={name} isMobile={!isLargerScreen && !isDesktop}>
          <InnerCell index={index}>{isMobile ? '' : label}</InnerCell>
        </HeaderCell>
      )),
    [tableSchema, isLargerScreen, isDesktop, isMobile],
  )

  return <Row role="row">{headerCells}</Row>
}
