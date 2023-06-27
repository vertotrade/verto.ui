import { useEffect, useState } from 'react'
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

  const [menuItems, setMenuItems] = useState<ConfigMenuItemsType[]>([])

  useEffect(() => {
    config(t, isDark, languageCode, chainId)
      .then(result => {
        setMenuItems(result)
      })
      .catch(error => {
        console.error('Error getting menu items:', error)
      })
  }, [t, isDark, languageCode, chainId])

  return menuItems
}
