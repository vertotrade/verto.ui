import { Text, Pool } from '@verto/uikit'
import styled from 'styled-components'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { Currency } from '@verto/sdk'
import { useTranslation } from '@verto/localization'

interface NameCellProps {
  currency: Currency
}

const StyledCell = styled(Pool.BaseCell)`
  align-items: center;
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<React.PropsWithChildren<NameCellProps>> = ({ currency }) => {
  const { t } = useTranslation()
  let title = currency.name ?? currency.symbol

  if (title) {
    title = title.split(' ')[0]
  }

  return (
    <StyledCell role="cell">
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
