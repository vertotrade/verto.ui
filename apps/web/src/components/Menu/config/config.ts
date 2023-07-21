import {
  MenuItemsType,
  DropdownMenuItemType,
  TrophyIcon,
  TrophyFillIcon,
  // NftIcon,
  // NftFillIcon,
  DropdownMenuItems,
} from '@verto/uikit'
import { ContextApi } from '@verto/localization'
// import { nftsBaseUrl } from 'views/Nft/market/constants'
// import { getPerpetualUrl } from 'utils/getPerpetualUrl'
import { SUPPORT_REBUS } from 'config/constants/supportChains'
import { lotteryFeatureFlagRequest } from 'components/Menu/utils'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => Promise<ConfigMenuItemsType[]> = async (t, isDark, languageCode, chainId) => {
  let isLotteryPageEnabled
  let navItems = [
    {
      label: t('Trade'),
      href: '/swap',
      showItemsOnMobile: false,
      items: [
        {
          label: t('Swap'),
          href: '/swap',
        },
        // {
        //   label: t('Limit'),
        //   href: '/limit-orders',
        //   supportChainIds: SUPPORT_ONLY_BSC,
        //   image: '/images/decorations/3d-coin.png',
        // },
        {
          label: t('Liquidity'),
          href: '/liquidity',
        },
        // {
        //   label: t('Perpetual'),
        //   href: getPerpetualUrl({
        //     chainId,
        //     languageCode,
        //     isDark,
        //   }),
        //   type: DropdownMenuItemType.EXTERNAL_LINK,
        // },
        // {
        //   label: t('Bridge'),
        //   href: 'https://bridge.vertotrade.com/',
        //   type: DropdownMenuItemType.EXTERNAL_LINK,
        // },
      ].map(item => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Gain'),
      href: '/farms',
      showItemsOnMobile: true,
      items: [
        {
          label: t('Farms'),
          href: '/farms',
        },
        {
          label: t('Pools'),
          href: '/pools',
          supportChainIds: SUPPORT_REBUS,
        },
      ].map(item => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Win'),
      href: '/lottery',
      icon: TrophyIcon,
      fillIcon: TrophyFillIcon,
      items: [
        // {
        //   label: t('Trading Competition'),
        //   href: '/competition',
        //   image: '/images/decorations/tc.png',
        //   hideSubNav: true,
        // },
        // {
        //   label: t('Prediction (BETA)'),
        //   href: '/prediction',
        //   image: '/images/decorations/prediction.png',
        // },
        {
          label: t('Lottery'),
          href: '/lottery',
          image: '/images/decorations/lottery.png',
        },
        // {
        //   label: t('Pottery (BETA)'),
        //   href: '/pottery',
        //   image: '/images/decorations/lottery.png',
        // },
      ],
    },
    // {
    //   label: t('NFT'),
    //   href: `${nftsBaseUrl}`,
    //   icon: NftIcon,
    //   fillIcon: NftFillIcon,
    //   supportChainIds: SUPPORT_ONLY_BSC,
    //   image: '/images/decorations/nft.png',
    //   items: [
    //     {
    //       label: t('Overview'),
    //       href: `${nftsBaseUrl}`,
    //     },
    //     {
    //       label: t('Collections'),
    //       href: `${nftsBaseUrl}/collections`,
    //     },
    //     {
    //       label: t('Activity'),
    //       href: `${nftsBaseUrl}/activity`,
    //     },
    //   ],
    // },
    // {
    //   label: t('Info'),
    //   href: '/info',
    //   showItemsOnMobile: false,
    // },
    {
      label: t('Docs'),
      href: 'https://docs.vertotrade.com',
      target: '_blank',
      showItemsOnMobile: false,
      type: DropdownMenuItemType.EXTERNAL_LINK,
    },
    // {
    //   label: '',
    //   href: '/info',
    //   icon: MoreIcon,
    //   hideSubNav: true,
    //   items: [
    //     {
    //       label: t('Info'),
    //       href: '/info',
    //     },
    //     {
    //       label: t('IFO'),
    //       href: '/ifo',
    //       supportChainIds: SUPPORT_ONLY_BSC,
    //       image: '/images/ifos/ifo-bunny.png',
    //     },
    //     {
    //       label: t('Voting'),
    //       href: '/voting',
    //       supportChainIds: SUPPORT_ONLY_BSC,
    //       image: '/images/voting/voting-bunny.png',
    //     },
    //     {
    //       type: DropdownMenuItemType.DIVIDER,
    //     },
    //     {
    //       label: t('Leaderboard'),
    //       href: '/teams',
    //       supportChainIds: SUPPORT_ONLY_BSC,
    //       image: '/images/decorations/leaderboard.png',
    //     },
    //     {
    //       type: DropdownMenuItemType.DIVIDER,
    //     },
    //     {
    //       label: t('Blog'),
    //       href: 'https://medium.com/vertotrade',
    //       type: DropdownMenuItemType.EXTERNAL_LINK,
    //     },
    //     {
    //       label: t('Docs'),
    //       href: 'https://docs.vertotrade.com',
    //       type: DropdownMenuItemType.EXTERNAL_LINK,
    //     },
    //   ].map(item => addMenuItemSupported(item, chainId)),
    // },
  ].map(item => addMenuItemSupported(item, chainId))

  const filterNavItems = (items: any[], shouldDisplay: boolean) => {
    return items.filter(item => {
      if (!shouldDisplay && item.label === 'Win') {
        return false
      }
      return true
    })
  }

  async function configureNavItems() {
    try {
      const response = await lotteryFeatureFlagRequest()
      isLotteryPageEnabled = response?.data?.data?.attributes?.enabled
      navItems = filterNavItems(navItems, isLotteryPageEnabled)
    } catch (error) {
      console.log('Error', error)
    }

    return navItems
  }

  await configureNavItems()
  return navItems
}

export default config
