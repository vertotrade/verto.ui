import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Menu as UikitMenu, NextLinkFromReactRouter, footerLinks } from '@verto/uikit'
import { useTranslation, languageList } from '@verto/localization'
// import PhishingWarningBanner from 'components/PhishingWarningBanner'
import useTheme from 'hooks/useTheme'
// import { usePhishingBannerManager } from 'state/user/hooks'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { SettingsMode } from './GlobalSettings/types'

const LinkComponent = linkProps => {
  return <NextLinkFromReactRouter to={linkProps.href} target={linkProps.target} {...linkProps} prefetch={false} />
}

const Menu = props => {
  const { isDark, setTheme } = useTheme()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()

  const menuItems = useMenuItems()

  const [activeMenuItem, setActiveMenuItem] = useState(null)
  const [activeSubMenuItem, setActiveSubMenuItem] = useState(null)

  useEffect(() => {
    const result = getActiveMenuItem({ menuConfig: menuItems, pathname })
    setActiveMenuItem(result)
    setActiveSubMenuItem(getActiveSubMenuItem({ menuItem: result, pathname }))
  }, [menuItems, pathname])

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <>
      <UikitMenu
        linkComponent={LinkComponent}
        rightSide={
          <>
            <GlobalSettings color="text" mode={SettingsMode.GLOBAL} hasGradient />
            {/* <NetworkSwitcher /> */}
            <UserMenu />
          </>
        }
        // banner={showPhishingWarningBanner && typeof window !== 'undefined' && <PhishingWarningBanner />}
        defaultHomeLink="/"
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        links={menuItems}
        subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
        footerLinks={getFooterLinks}
        activeItem={activeMenuItem?.href}
        activeSubItem={activeSubMenuItem?.href}
        buyCakeLabel={t('Buy VERTO')}
        buyCakeLink={`${window.origin}/swap?outputCurrency=0x376Ffa8AA69593A4E4932b5A22C46a24F37383c5`}
        {...props}
      />
    </>
  )
}

export default Menu
