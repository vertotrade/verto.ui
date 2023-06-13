import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from '@verto/localization'
import styled from 'styled-components'
import { Flex, Modal } from '@verto/uikit'
import { useTheme } from '@verto/hooks'
import FooterExpanded from './PreviousRoundCard/FooterExpanded'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 750px;
  }
`

interface LotteryDetailsProps {
  id?: string
  onDismiss?: () => void
  selectedLotteryNodeData: any
}

const LotteryDetailsModal: React.FC<React.PropsWithChildren<LotteryDetailsProps>> = ({
  onDismiss,
  id,
  selectedLotteryNodeData,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const handleDismiss = () => {
    onDismiss?.()
  }

  return (
    <StyledModal title={t('Lottery Details')} onDismiss={handleDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <FooterExpanded lotteryNodeData={selectedLotteryNodeData} lotteryId={id} />
      </Flex>
    </StyledModal>
  )
}

export default LotteryDetailsModal
