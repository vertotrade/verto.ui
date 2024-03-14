import { memo } from 'react'
import { Pool } from '@verto/uikit'
import { Currency, CurrencyAmount } from '@verto/sdk'

import NameCell from './Cells/NameCell'
import BalanceCell from './Cells/BalanceCell'
import AddressCell from './Cells/AddressCell'
import ActionCell from './Cells/ActionCell'

const TokenRow: React.FC<React.PropsWithChildren<{ currencyAmount: CurrencyAmount<Currency> }>> = ({
  currencyAmount,
}) => {
  return (
    <Pool.ExpandRow disableExpandActionCell>
      <NameCell alignAtStart currency={currencyAmount.currency} />
      <BalanceCell currencyAmount={currencyAmount} />
      <AddressCell currency={currencyAmount.currency} />
      <ActionCell currency={currencyAmount.currency} />
    </Pool.ExpandRow>
  )
}

export default memo(TokenRow)
