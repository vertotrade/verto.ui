import styled from 'styled-components'
import { Flex, Text, Button, Spinner } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { ERC20Token } from '@verto/sdk'
import { StepIndicator } from './styles'

interface ApproveAndConfirmStageProps {
  token: ERC20Token
  variant: 'buy' | 'sell'
  gasPrice?: string
  isApproved: boolean
  isApproving: boolean
  isConfirming: boolean
  handleApprove: () => void
  handleConfirm: () => void
  vertoIsApproved: boolean
  vertoIsApproving: boolean
  vertoHandleApprove: () => void
}

const SpinnerWrapper = styled(Flex)`
  padding-left: 10px;

  & > div {
    margin: 0;
  }
`

// Buy Flow:
// Shown if user wants to pay and contract isn't approved yet
// Sell Flow:
// Shown the first time user puts NFT for sale
const ApproveAndConfirmStage: React.FC<React.PropsWithChildren<ApproveAndConfirmStageProps>> = ({
  token,
  variant,
  gasPrice,
  isApproved,
  isApproving,
  isConfirming,
  handleApprove,
  handleConfirm,
  vertoIsApproved,
  vertoIsApproving,
  vertoHandleApprove,
}) => {
  const { t } = useTranslation()
  const secondStepApproved = variant === 'buy' ? vertoIsApproved : true

  return (
    <Flex p="16px" flexDirection="column">
      <Flex mb="8px" alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Flex alignItems="center">
            <StepIndicator success={isApproved}>
              <Text fontSize="20px" bold color="invertedContrast">
                1
              </Text>
            </StepIndicator>
            <Text fontSize="20px" color={isApproved ? 'success' : 'secondary'} bold>
              {isApproved ? t('Enabled') : t('Enable')}
            </Text>
          </Flex>
          {!isApproved && (
            <Text mt="8px" maxWidth="275px" small color="textSubtle">
              {variant === 'buy'
                ? t('Please enable %symbol% spending in your wallet', { symbol: token?.symbol })
                : t('Please enable your NFT to be sent to the market')}
            </Text>
          )}
        </Flex>
        <SpinnerWrapper flex="0 0 64px" width="64px">
          {isApproving && <Spinner size={64} />}
        </SpinnerWrapper>
      </Flex>
      {!isApproved && (
        <Button variant="secondary" disabled={isApproving} onClick={handleApprove}>
          {isApproving ? `${t('Enabling')}...` : t('Enable')}
        </Button>
      )}

      {variant === 'buy' && (
        <>
          <Flex alignItems="center" mt="8px" justifyContent="space-between">
            <Flex flexDirection="column">
              <Flex alignItems="center" mt="16px">
                <StepIndicator success={vertoIsApproved} disabled={!isApproved && !vertoIsApproved}>
                  <Text fontSize="20px" bold color={!isApproved ? 'textDisabled' : 'invertedContrast'}>
                    2
                  </Text>
                </StepIndicator>
                <Text
                  fontSize="20px"
                  bold
                  color={vertoIsApproved ? 'success' : isApproved ? 'secondary' : 'textDisabled'}>
                  {vertoIsApproved ? t('Approved Gas') : t('Approve Gas')}
                </Text>
              </Flex>
              {!vertoIsApproved && (
                <Text small color={isApproved ? 'textSubtle' : 'textDisabled'}>
                  {t('Please approve %symbol% VERTO spending for transaction gas', { symbol: gasPrice })}
                </Text>
              )}
            </Flex>
            <SpinnerWrapper flex="0 0 64px" width="64px">
              {vertoIsApproving && <Spinner size={64} />}
            </SpinnerWrapper>
          </Flex>
          {!vertoIsApproved && (
            <Button
              mt="16px"
              disabled={!isApproved || vertoIsApproving}
              onClick={vertoHandleApprove}
              variant="secondary">
              {vertoIsApproving ? t('Approving') : t('Approve')}
            </Button>
          )}
        </>
      )}

      <Flex alignItems="center" mt="8px" justifyContent="space-between">
        <Flex flexDirection="column">
          <Flex alignItems="center" mt="16px">
            <StepIndicator success={!!0} disabled={!isApproved || !secondStepApproved}>
              <Text
                fontSize="20px"
                bold
                color={!isApproved || !secondStepApproved ? 'textDisabled' : 'invertedContrast'}>
                {variant === 'buy' ? 3 : 2}
              </Text>
            </StepIndicator>
            <Text fontSize="20px" bold color={isApproved && secondStepApproved ? 'secondary' : 'textDisabled'}>
              {t('Confirm')}
            </Text>
          </Flex>
          <Text small color={isApproved && secondStepApproved ? 'textSubtle' : 'textDisabled'}>
            {t('Please confirm the transaction in your wallet')}
          </Text>
        </Flex>
        <SpinnerWrapper flex="0 0 64px" width="64px">
          {isConfirming && <Spinner size={64} />}
        </SpinnerWrapper>
      </Flex>
      <Button
        mt="16px"
        disabled={!isApproved || !secondStepApproved || isConfirming}
        onClick={handleConfirm}
        variant="secondary">
        {isConfirming ? t('Confirming') : t('Confirm')}
      </Button>
    </Flex>
  )
}

export default ApproveAndConfirmStage
