import { ButtonMenu, ButtonMenuItem } from '@verto/uikit'
import styled from 'styled-components'
import { useTranslation } from '@verto/localization'

const StyledButtonItem = styled(ButtonMenuItem)`
  margin: 8px;
`

const HistoryTabMenu = ({ setActiveIndex, activeIndex }) => {
  const { t } = useTranslation()

  return (
    <ButtonMenu activeIndex={activeIndex} onItemClick={setActiveIndex} scale="sm" variant="subtle">
      <StyledButtonItem>{t('All History')}</StyledButtonItem>
      <StyledButtonItem>{t('Your History')}</StyledButtonItem>
    </ButtonMenu>
  )
}

export default HistoryTabMenu
