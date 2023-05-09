import { Pool, Flex, CopyButton, Box } from '@verto/uikit'
import styled from 'styled-components'
import { Currency, Token } from '@verto/sdk'
import AddToWalletButton from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@verto/localization'

interface BalanceCellProps {
  currency: Currency
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 5;
  flex-direction: row;
  justify-content: flex-end;
  padding-left: 0;
  padding-right: 16px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const ActionCell: React.FC<React.PropsWithChildren<BalanceCellProps>> = ({ currency }) => {
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        {currency instanceof Token && currency.address ? (
          <Flex style={{ gap: '4px' }} ml="4px" alignItems="center">
            <Box mr="4px">
              <CopyButton
                width="20px"
                buttonColor="textSubtle"
                text={currency.address}
                tooltipMessage={t('Token address copied')}
              />
            </Box>
            <AddToWalletButton
              variant="text"
              p="0"
              height="auto"
              width="fit-content"
              tokenAddress={currency.address}
              tokenSymbol={currency.symbol}
              tokenDecimals={currency.decimals}
              tokenLogo={`${window.origin}/images/tokens/${currency.address}.png`}
              iconWidth="20px"
            />
          </Flex>
        ) : null}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default ActionCell
