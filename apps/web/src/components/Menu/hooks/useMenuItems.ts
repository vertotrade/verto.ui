import { useMemo } from 'react'
import { useTheme } from '@verto/hooks'
import { useTranslation } from '@verto/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import config, { ConfigMenuItemsType } from '../config/config'

export const useMenuItems = (): ConfigMenuItemsType[] => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation()
  const { chainId } = useActiveChainId()
  const { isDark } = useTheme()

  const menuItems = useMemo(() => {
    return config(t, isDark, languageCode, chainId)
  }, [t, isDark, languageCode, chainId])

  return menuItems
}
