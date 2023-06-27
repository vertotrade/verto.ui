import orderBy from 'lodash/orderBy'
import axios from 'axios'
import { ConfigMenuItemsType } from './config/config'

export const getActiveMenuItem = ({
  pathname,
  menuConfig,
}: {
  pathname: string
  menuConfig: ConfigMenuItemsType[]
}): ConfigMenuItemsType | undefined => {
  try {
    return menuConfig?.find(
      menuItem => pathname.startsWith(menuItem.href) || getActiveSubMenuItem({ menuItem, pathname }),
    )
  } catch (error) {
    console.error('Error resolving menuConfig:', error)
    return undefined
  }
}

export const getActiveSubMenuItem = ({ pathname, menuItem }: { pathname: string; menuItem?: ConfigMenuItemsType }) => {
  const activeSubMenuItems = menuItem?.items?.filter(subMenuItem => pathname.startsWith(subMenuItem.href)) ?? []

  // Pathname doesn't include any submenu item href - return undefined
  if (!activeSubMenuItems || activeSubMenuItems.length === 0) {
    return undefined
  }

  // Pathname includes one sub menu item href - return it
  if (activeSubMenuItems.length === 1) {
    return activeSubMenuItems[0]
  }

  // Pathname includes multiple sub menu item hrefs - find the most specific match
  const mostSpecificMatch = orderBy(activeSubMenuItems, subMenuItem => subMenuItem.href.length, 'desc')[0]

  return mostSpecificMatch
}

export const lotteryFeatureFlagRequest = () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const url =
    process.env.NODE_ENV === 'production'
      ? 'https://api.raindrop.club/api/feature-flags/35'
      : 'https://api.raindrop.club/api/dev-endpoint'

  let request

  if (isLocal) {
    // mock request for localhost
    request = new Promise(resolve => {
      resolve({
        data: {
          id: 35,
          attributes: {
            enabled: true,
            description: 'VertoTrade lottery page',
            slug: 'lottery-page',
            createdAt: '2023-06-22T14:37:33.903Z',
            updatedAt: '2023-06-22T14:37:33.903Z',
          },
        },
        meta: {},
      })
    })
  } else {
    request = axios.get(url)
  }

  return request
}
