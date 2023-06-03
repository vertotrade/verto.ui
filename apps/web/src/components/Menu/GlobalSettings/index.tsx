import { useTheme } from '@verto/hooks'
import { Flex, IconButton, CogIcon, useModal } from '@verto/uikit'
import SettingsModal from './SettingsModal'

type Props = {
  color?: string
  hasGradient?: boolean
  mr?: string
  mode?: string
}

const GlobalSettings = ({ color, mr = '8px', mode }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)
  const { theme } = useTheme()

  return (
    <Flex>
      <IconButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id={`open-settings-dialog-button-${mode}`}>
        <CogIcon height={24} width={24} color={theme.colors[color] || color || theme.colors.icon} />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
