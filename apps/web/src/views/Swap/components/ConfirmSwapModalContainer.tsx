import { Modal } from '@verto/uikit'
import { useTranslation } from '@verto/localization'

const ConfirmSwapModalContainer = ({ children, handleDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Confirm Swap')} headerBackground="backgroundAlt" onDismiss={handleDismiss}>
      {children}
    </Modal>
  )
}

export default ConfirmSwapModalContainer
