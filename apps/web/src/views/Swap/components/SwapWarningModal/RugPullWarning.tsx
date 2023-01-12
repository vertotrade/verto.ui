import { useTranslation } from '@verto/localization'
import { Text } from '@verto/uikit'

const RugPullWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>{t('Suspicious rugpull token')}</Text>
    </>
  )
}

export default RugPullWarning
