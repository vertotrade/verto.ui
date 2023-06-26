import { ButtonMenu, ButtonMenuItem } from '@verto/uikit'
import styled from 'styled-components'
import { useTranslation } from '@verto/localization'
import { useTheme } from '@verto/hooks'

const StyledButtonItem = styled(ButtonMenuItem)`
  border-radius: 24px !important;
  padding: 8px 24px;
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  height: 100%;

  &:first-child {
    margin-right: 8px;
  }
`

const StyledButtonMenu = styled(ButtonMenu)<{ borderColor: string; backgroundColor: string }>`
  border-color: ${props => props.borderColor} !important;
  background: ${props => props.backgroundColor};
  border-radius: 64px;
  padding: 8px;
  height: auto;
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
      backgroundColor={themedMenuColor}>
      <StyledButtonItem isPrimary isDark={isDark}>
        {t('All History')}
      </StyledButtonItem>
      <StyledButtonItem isPrimary isDark={isDark}>
        {t('Your History')}
      </StyledButtonItem>
    </StyledButtonMenu>
  )
}

export default HistoryTabMenu
