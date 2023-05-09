import { Text, Pool, useMatchBreakpoints } from '@verto/uikit'
import styled from 'styled-components'
import { Currency, CurrencyAmount } from '@verto/sdk'

interface BalanceCellProps {
  currencyAmount: CurrencyAmount<Currency>
}

const StyledCell = styled(Pool.BaseCell)<{ isMobile?: boolean }>`
  flex: 5;
  flex-direction: row;
  justify-content: ${props => (props.isMobile ? 'center' : 'flex-start')};
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<React.PropsWithChildren<BalanceCellProps>> = ({ currencyAmount }) => {
  const { isMobile } = useMatchBreakpoints()
  const balance = isMobile ? currencyAmount.toSignificant(6) : currencyAmount.toExact()

  return (
    <StyledCell role="cell" isMobile={isMobile}>
      <Pool.CellContent>
        <Text>{balance}</Text>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell
