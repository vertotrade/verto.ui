import { useTheme } from '@verto/hooks'
import { Flex, GradientIconButton, CogIcon, useModal } from '@verto/uikit'
import SettingsModal from './SettingsModal'

type Props = {
  color?: string
  hasGradient?: boolean
  mr?: string
  mode?: string
}

const GlobalSettings = ({ color, mr = '8px', mode, hasGradient }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)
  const { theme } = useTheme()

  return (
    <Flex>
      <GradientIconButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id={`open-settings-dialog-button-${mode}`}>
        <CogIcon
          height={24}
          width={24}
          color={theme.colors[color] || color || theme.colors.primary}
          hasGradient={hasGradient}
        />
      </GradientIconButton>
    </Flex>
  )
}

export default GlobalSettings
