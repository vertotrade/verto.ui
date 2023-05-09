import { Text, Pool, useMatchBreakpoints } from '@verto/uikit'
import styled from 'styled-components'
import { Currency, CurrencyAmount } from '@verto/sdk'
import { useTranslation } from '@verto/localization'

interface BalanceCellProps {
  currencyAmount: CurrencyAmount<Currency>
}

const StyledCell = styled(Pool.BaseCell)<{ isMobile?: boolean; isMd?: boolean }>`
  flex: 5;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 ${props => (props.isMd ? '100px' : '150px')};
    padding-left: ${props => (props.isMd ? '0' : '32px')};
  }
`

const NameCell: React.FC<React.PropsWithChildren<BalanceCellProps>> = ({ currencyAmount }) => {
  const { t } = useTranslation()
  const { isMobile, isMd } = useMatchBreakpoints()
  const balance = isMobile ? currencyAmount.toSignificant(6) : currencyAmount.toExact()

  return (
    <StyledCell role="cell" isMobile={isMobile} isMd={isMd}>
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
          {t('Balance')}
        </Text>
        <Text>{balance}</Text>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell
