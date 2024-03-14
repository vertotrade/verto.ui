import { Text, Pool } from '@verto/uikit'
import styled from 'styled-components'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { Currency } from '@verto/sdk'
import { useTranslation } from '@verto/localization'

interface NameCellProps {
  alignAtStart?: boolean
  currency: Currency
}

const StyledCell = styled(Pool.BaseCell)<{ alignAtStart?: boolean }>`
  align-items: center;
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  justify-content: ${props => (props.alignAtStart ? 'flex-start' : '')};
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<React.PropsWithChildren<NameCellProps>> = ({ alignAtStart, currency }) => {
  const { t } = useTranslation()
  const title = (currency.name ?? currency.symbol)?.replace('Rebus Chain Native Token', 'Rebus')

  return (
    <StyledCell role="cell" alignAtStart={alignAtStart}>
      <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
          {t('Name')}
        </Text>
        <Text>{title}</Text>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell
