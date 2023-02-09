import { Flex, GradientIconButton, CogIcon, useModal } from '@verto/uikit'
import SettingsModal from './SettingsModal'

type Props = {
  color?: string
  mr?: string
  mode?: string
}

const GlobalSettings = ({ color, mr = '8px', mode }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)

  return (
    <Flex>
      <GradientIconButton
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
        mr={mr}
        id={`open-settings-dialog-button-${mode}`}>
        <CogIcon height={24} width={24} color={color || 'textSubtle'} />
      </GradientIconButton>
    </Flex>
  )
}

export default GlobalSettings
