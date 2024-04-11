import styled from 'styled-components'
import { Modal, Box, Flex, Text, Input } from '@verto/uikit'
import { ERC20Token } from '@verto/sdk'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { CurrencyLogo } from 'components/Logo'
import { multiplyPriceByAmount } from 'utils/prices'
import { SellingStage } from './types'

export const stagesWithBackButton = [
  SellingStage.SET_PRICE,
  SellingStage.ADJUST_PRICE,
  SellingStage.APPROVE_AND_CONFIRM_SELL,
  SellingStage.CONFIRM_ADJUST_PRICE,
  SellingStage.REMOVE_FROM_MARKET,
  SellingStage.CONFIRM_REMOVE_FROM_MARKET,
  SellingStage.TRANSFER,
  SellingStage.CONFIRM_TRANSFER,
]

export const StyledModal = styled(Modal)<{ stage: SellingStage }>`
  max-width: 95%;
  width: 440px;
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `color: ${theme.colors.textSubtle}` : null)};
  }
  & svg:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `fill: ${theme.colors.textSubtle}` : null)};
  }
`

export const GreyedOutContainer = styled(Box)`
  background-color: ${({ theme }) => theme.colors.dropdown};
  padding: 16px;
`

export const RightAlignedInput = styled(Input)`
  text-align: right;
`

interface AmountCellProps {
  amount: number
  token: ERC20Token
}

export const AmountCell: React.FC<React.PropsWithChildren<AmountCellProps>> = ({ amount, token }) => {
  const bnbBusdPrice = useBNBBusdPrice()
  if (!amount || amount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <CurrencyLogo currency={token} size="16px" />
        <Text bold mx="4px">
          -
        </Text>
      </Flex>
    )
  }
  const usdAmount = multiplyPriceByAmount(bnbBusdPrice, amount)
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <CurrencyLogo currency={token} size="16px" />
      <Text bold mx="4px">{`${amount.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        {`($${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}
      </Text>
    </Flex>
  )
}

interface FeeAmountCellProps {
  amount: number
  creatorFee: number
  tradingFee: number
  token: ERC20Token
}

export const FeeAmountCell: React.FC<React.PropsWithChildren<FeeAmountCellProps>> = ({
  amount,
  creatorFee,
  tradingFee,
  token,
}) => {
  if (!amount || amount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <CurrencyLogo size="16px" currency={token} />
        <Text bold mx="4px">
          -
        </Text>
      </Flex>
    )
  }

  const totalFee = creatorFee + tradingFee
  const totalFeeAsDecimal = totalFee / 100
  const feeAmount = amount * totalFeeAsDecimal
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <CurrencyLogo size="16px" currency={token} />
      <Text bold mx="4px">{`${feeAmount.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 6,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        ({totalFee}%)
      </Text>
    </Flex>
  )
}
