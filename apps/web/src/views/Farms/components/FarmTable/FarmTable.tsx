import { useRef, useMemo, useCallback } from 'react'
import { latinise } from 'utils/latinise'
import styled from 'styled-components'
import { RowType, DesktopColumnSchema } from '@verto/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@verto/utils/formatBalance'
import { BIG_ZERO } from '@verto/utils/bigNumber'
import { useRouter } from 'next/router'
import { FarmWithStakedValue } from '@verto/farms'
import { getDisplayApr } from '../getDisplayApr'
import { FarmTableHead } from './FarmTableHead'
import Row, { RowProps } from './Row'
import ProxyFarmContainer from '../YieldBooster/components/ProxyFarmContainer'

export interface ITableProps {
  farms: FarmWithStakedValue[]
  userDataReady: boolean
  cakePrice: BigNumber
  sortColumn?: string
}

const Container = styled.div`
  width: 100%;
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }

    :last-child {
      td[colspan='7'] {
        > div {
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
        }
      }
    }
  }
`
const TableContainer = styled.div`
  position: relative;
`

const FarmTable: React.FC<React.PropsWithChildren<ITableProps>> = ({ farms, cakePrice, userDataReady }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { query } = useRouter()

  const columns = useMemo(
    () =>
      DesktopColumnSchema.map(column => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case 'farm':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }

              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      })),
    [],
  )

  const getFarmEarnings = useCallback((farm: FarmWithStakedValue) => {
    let earnings = BIG_ZERO
    const existingEarnings = new BigNumber(farm.userData.earnings)

    if (farm.boosted) {
      const proxyEarnings = new BigNumber(farm.userData?.proxy?.earnings)

      earnings = proxyEarnings.gt(0) ? proxyEarnings : existingEarnings
    } else {
      earnings = existingEarnings
    }

    return getBalanceNumber(earnings)
  }, [])

  const generateRow = useCallback(
    (farm: FarmWithStakedValue) => {
      const { token, quoteToken } = farm
      const tokenAddress = token.address
      const quoteTokenAddress = quoteToken.address
      const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')
      const lowercaseQuery = latinise(typeof query?.search === 'string' ? query.search.toLowerCase() : '')
      const initialActivity = latinise(lpLabel?.toLowerCase()) === lowercaseQuery
      const row: RowProps = {
        apr: {
          value: getDisplayApr(farm.apr, farm.lpRewardsApr),
          pid: farm.pid,
          multiplier: farm.multiplier,
          lpLabel,
          lpSymbol: farm.lpSymbol,
          lpTokenPrice: farm.lpTokenPrice,
          tokenAddress,
          quoteTokenAddress,
          cakePrice,
          lpRewardsApr: farm.lpRewardsApr,
          originalValue: farm.apr,
          stableSwapAddress: farm.stableSwapAddress,
          stableLpFee: farm.stableLpFee,
        },
        farm: {
          label: lpLabel,
          pid: farm.pid,
          token: farm.token,
          quoteToken: farm.quoteToken,
          isReady: farm.multiplier !== undefined,
          isStable: farm.isStable,
        },
        earned: {
          earnings: getFarmEarnings(farm),
          pid: farm.pid,
        },
        liquidity: {
          liquidity: farm?.liquidity,
        },
        multiplier: {
          multiplier: farm.multiplier,
        },
        // type: farm.isCommunity ? 'community' : 'core',
        details: farm,
        initialActivity,
      }

      return row
    },
    [cakePrice, query.search, getFarmEarnings],
  )

  const rowData = useMemo(() => farms.map(generateRow), [farms, generateRow])

  const generateSortedRow = useCallback(
    (row: RowProps) => {
      const newRow = {} as RowProps
      columns.forEach(column => {
        if (!(column.name in row)) {
          throw new Error(`Invalid row data, ${column.name} not found`)
        }
        newRow[column.name] = row[column.name]
      })
      newRow.initialActivity = row.initialActivity
      return newRow
    },
    [columns],
  )

  const sortedRows = useMemo(() => rowData.map(generateSortedRow), [rowData, generateSortedRow])

  const tableBody = useMemo(
    () =>
      sortedRows.map(row => {
        return row?.details?.boosted ? (
          <ProxyFarmContainer key={`table-row-${row.farm.pid}`} farm={row.details}>
            <Row {...row} userDataReady={userDataReady} />
          </ProxyFarmContainer>
        ) : (
          <Row {...row} userDataReady={userDataReady} key={`table-row-${row.farm.pid}`} />
        )
      }),
    [sortedRows, userDataReady],
  )

  return (
    <Container id="farms-table">
      <TableContainer id="table-container">
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              <FarmTableHead />
              {tableBody}
            </TableBody>
          </StyledTable>
        </TableWrapper>
      </TableContainer>
    </Container>
  )
}

export default FarmTable
