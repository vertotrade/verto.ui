import { useState } from 'react'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@verto/localization'
import { Box, Input, SearchIcon } from '@verto/uikit'
import styled from 'styled-components'

const SearchInputWrapper = styled.div`
  position: relative;
`

interface InputIconProps {
  isDark: boolean
  hidden: boolean
}
const InputIcon = styled(SearchIcon)<InputIconProps>`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  color: ${({ isDark }) => (isDark ? 'var(--colors-light-backgroundAlt2)' : '#818181')};
  display: ${({ hidden }) => (hidden ? 'none' : 'block')};

  path {
    fill: currentColor;
  }
`

const SearchBar: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const [searchValue, setSearchValue] = useState('')

  return (
    <Box>
      <SearchInputWrapper>
        <InputIcon isDark={isDark} hidden={searchValue.length > 0} />
        <Input
          id="searchNft"
          name="searchNft"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder={t('Search %subject%', { subject: t('Address').toLowerCase() })}
          style={{
            background: 'transparent',
            position: 'relative',
            zIndex: 16,
            paddingLeft: searchValue.length > 0 ? '16px' : '44px',
          }}
        />
      </SearchInputWrapper>
    </Box>
  )
}

export default SearchBar
