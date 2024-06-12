import React, { useEffect, useState } from 'react'
import { ModalContainer, ModalHeader, ModalTitle, IconButton, CloseIcon } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import styled from 'styled-components'

const StyledModalBody = styled.div`
  width: 100%;
  height: 100%;
  margin: 0px;

  & iframe {
    border-radius: 0px;
  }
`

const BuyTokenModal: React.FC<React.PropsWithChildren> = ({ onDismiss }) => {
  const { t } = useTranslation()

  useEffect(() => {
    const swipeluxContainer = document.getElementById('swipelux-payment-container')
    if (swipeluxContainer) {
      const settings = {
        apiKey: '5fa9d5b3-4ccd-4e25-b5dd-735df3a8d8da',
      }

      try {
        if (!window.SwipeluxWidgetInstance) {
          const swipelux = new window.SwipeluxWidget(swipeluxContainer, settings)
          swipelux.init()
          window.SwipeluxWidgetInstance = swipelux
        }
      } catch (error) {
        console.error('Failed to initialize Swipelux widget:', error)
      }
    } else {
      console.error('Swipelux is not available on the window object')
    }
  }, [])

  return (
    <ModalContainer style={{ padding: '0px' }} title={t('Welcome!')} $minWidth="360px" top="200px">
      {/* <ModalHeader style={{ backgroundColor: 'white', margin: '0px' }}>
        <IconButton variant="text" onClick={}>
          <CloseIcon width="24px" color="text" />
        </IconButton>
      </ModalHeader> */}
      <StyledModalBody id="swipelux-payment-container" />
    </ModalContainer>
  )
}

export default BuyTokenModal
