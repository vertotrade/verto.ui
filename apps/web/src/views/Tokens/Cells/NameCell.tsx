import { Text, Pool, useMatchBreakpoints } from '@verto/uikit'
import styled from 'styled-components'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { Currency } from '@verto/sdk'

interface NameCellProps {
  currency: Currency
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<React.PropsWithChildren<NameCellProps>> = ({ currency }) => {
  const { isMobile } = useMatchBreakpoints()
  let title = currency.name ?? currency.symbol

  if (isMobile && title) {
    title = title.split(' ')[0]
  }

  return (
    <StyledCell role="cell">
      <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
      <Pool.CellContent>
        <Text>{title}</Text>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell
