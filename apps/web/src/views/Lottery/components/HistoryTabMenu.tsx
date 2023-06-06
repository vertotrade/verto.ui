import { ButtonMenu, ButtonMenuItem } from '@verto/uikit'
import styled from 'styled-components'
import { useTranslation } from '@verto/localization'
import { useTheme } from '@verto/hooks'

const StyledButtonItem = styled(ButtonMenuItem)`
  margin: 8px;
`

const StyledButtonMenu = styled(ButtonMenu)<{ borderColor: string; backgroundColor: string }>`
  border-color: ${props => props.borderColor};
  background: ${props => props.backgroundColor};
`

const HistoryTabMenu = ({ setActiveIndex, activeIndex }) => {
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()
  const themedMenuColor = isDark ? theme.colors.black : theme.colors.white

  return (
    <StyledButtonMenu
      borderColor={themedMenuColor}
      activeIndex={activeIndex}
      onItemClick={setActiveIndex}
      backgroundColor={themedMenuColor}
      scale="sm"
      variant="subtle">
      <StyledButtonItem>{t('All History')}</StyledButtonItem>
      <StyledButtonItem>{t('Your History')}</StyledButtonItem>
    </StyledButtonMenu>
  )
}

export default HistoryTabMenu
