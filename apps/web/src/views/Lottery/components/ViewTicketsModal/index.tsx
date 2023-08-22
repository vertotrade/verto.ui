import styled from 'styled-components'
import { Modal } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { LotteryStatus } from 'config/constants/types'
import { useLottery } from 'state/lottery/hooks'
import PreviousRoundTicketsInner from './PreviousRoundTicketsInner'
import CurrentRoundTicketsInner from './CurrentRoundTicketsInner'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 280px;
  }
`

interface ViewTicketsModalProps {
  roundId: string
  roundStatus?: LotteryStatus
  onDismiss?: () => void
}

const ViewTicketsModal: React.FC<React.PropsWithChildren<ViewTicketsModalProps>> = ({
  onDismiss,
  roundId,
  roundStatus,
}) => {
  const { t } = useTranslation()
  const { currentLotteryId } = useLottery()
  const isPreviousRound = roundStatus?.toLowerCase() === LotteryStatus.CLAIMABLE || roundId !== currentLotteryId

  return (
    <StyledModal title={`${t('Round')} ${roundId}`} onDismiss={onDismiss}>
      {isPreviousRound ? <PreviousRoundTicketsInner roundId={roundId} /> : <CurrentRoundTicketsInner />}
    </StyledModal>
  )
}

export default ViewTicketsModal
