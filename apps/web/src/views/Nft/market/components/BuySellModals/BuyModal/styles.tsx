import styled from 'styled-components'
import { Modal, Grid, Flex, Text, Skeleton } from '@verto/uikit'
import { ERC20Token } from '@verto/sdk'
import { useTokenPrices } from 'utils/prices'
import { CurrencyLogo } from 'components/Logo'
import { BuyingStage } from './types'

export const StyledModal = styled(Modal)<{ stage: BuyingStage }>`
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ stage, theme }) =>
      stage === BuyingStage.APPROVE_AND_CONFIRM || stage === BuyingStage.CONFIRM
        ? `color: ${theme.colors.textSubtle}`
        : null};
  }
  & svg:first-of-type {
    ${({ stage, theme }) =>
      stage === BuyingStage.APPROVE_AND_CONFIRM || stage === BuyingStage.CONFIRM
        ? `fill: ${theme.colors.textSubtle}`
        : null};
  }
`

export const BorderedBox = styled(Grid)`
  margin: 16px 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 8px;
`

interface AmountCellProps {
  amount: number
  token: ERC20Token
  isLoading?: boolean
  isInsufficient?: boolean
}

export const AmountCell: React.FC<React.PropsWithChildren<AmountCellProps>> = ({
  amount,
  token,
  isLoading,
  isInsufficient,
}) => {
  const tokenPrice = useTokenPrices(token?.symbol)
  if (isLoading) {
    return (
      <Flex flexDirection="column" justifySelf="flex-end">
        <Skeleton width="86px" height="20px" mb="6px" />
        <Skeleton width="86px" height="20px" />
      </Flex>
    )
  }
  const usdAmount = tokenPrice * amount
  return (
    <Flex justifySelf="flex-end" flexDirection="column">
      <Flex alignItems="center" justifyContent="flex-end">
        <CurrencyLogo currency={token} size="16px" style={{ marginRight: '4px' }} />
        <Text bold color={isInsufficient ? 'failure' : 'text'}>{`${amount.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 5,
        })}`}</Text>
      </Flex>
      <Text small color="textSubtle" textAlign="right">
        {`($${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}
      </Text>
    </Flex>
  )
}
