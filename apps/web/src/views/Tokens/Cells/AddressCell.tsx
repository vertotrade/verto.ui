import { Text, Pool, useMatchBreakpoints } from '@verto/uikit'
import styled from 'styled-components'
import { Currency, Token } from '@verto/sdk'
import { useTranslation } from '@verto/localization'

interface AddressCellProps {
  currency: Currency
}

const StyledCell = styled(Pool.BaseCell)<{ isSmall?: boolean }>`
  flex: 5;
  flex-direction: row;
  min-width: ${props => (props.isSmall ? 'auto' : '420px')};
  word-break: break-all;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
  }
`

const AddressCell: React.FC<React.PropsWithChildren<AddressCellProps>> = ({ currency }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const address = currency instanceof Token ? currency.address : ''

  if (isMobile) {
    return null
  }

  return (
    <StyledCell role="cell" isSmall={isTablet}>
      <Pool.CellContent>
        {address && (
          <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
            {t('Address')}
          </Text>
        )}
        <Text>{address}</Text>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default AddressCell
