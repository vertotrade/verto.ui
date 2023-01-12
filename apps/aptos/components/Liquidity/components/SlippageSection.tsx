import { RowBetween, Text } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { useUserSlippage } from 'state/user'

export default function SlippageSection() {
  const { t } = useTranslation()

  const [allowedSlippage] = useUserSlippage() // custom from users

  return (
    <RowBetween>
      <Text bold fontSize="12px" color="secondary">
        {t('Slippage Tolerance')}
      </Text>
      <Text bold color="primary">
        {allowedSlippage / 100}%
      </Text>
    </RowBetween>
  )
}
