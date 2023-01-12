import { useTranslation } from '@verto/localization'
import { Text } from '@verto/uikit'

const VestingEnded: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  return (
    <Text color="textSubtle" fontSize="14px" pb="24px">
      {t('You have claimed all available token.')}
    </Text>
  )
}

export default VestingEnded
