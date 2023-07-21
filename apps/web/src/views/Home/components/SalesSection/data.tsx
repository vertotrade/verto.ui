import { TranslateFunction } from '@verto/localization'
import { Clip } from 'components/Clip'
import IconDivider from 'components/IconDivider'
import { SalesSectionProps } from '.'

export const swapSectionData = (t: TranslateFunction, isDark: boolean): SalesSectionProps => ({
  headingText: t('Trade smarter, not harder.'),
  bodyText: t('Trade any token on Rebuschain in seconds, just by connecting your wallet.'),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.vertotrade.com/',
    text: t('Learn more'),
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'REBUS', alt: t('REBUS token') },
      { src: 'BTC', alt: t('BTC token') },
      { src: 'VERTO', alt: t('VERTO token') },
    ],
  },
  ClipComponent: () => (
    <Clip url={isDark ? 'images/animations/home-01-dark.webm' : 'images/animations/home-01-light.webm'} />
  ),
})

export const earnSectionData = (t: TranslateFunction, isDark: boolean): SalesSectionProps => ({
  headingText: t('Gain passive income with crypto.'),
  bodyText: t('VertoTrade makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.vertotrade.com/products/yield-farming',
    text: t('Learn more'),
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'pie', alt: t('Pie chart') },
      { src: 'stonks', alt: t('Stocks chart') },
      { src: 'folder', alt: t('Folder with verto token') },
    ],
  },
  ClipComponent: () => (
    <Clip url={isDark ? 'images/animations/home-02-dark.webm' : 'images/animations/home-02-light.webm'} />
  ),
})

export const vertoSectionData = (t: TranslateFunction, isDark: boolean, theme: any): SalesSectionProps => ({
  headingText: t('VERTO the future of DeFi is here.'),
  bodyText: t(
    'VERTO token is at the heart of the VertoTrade ecosystem. Buy it, trade it, farm it, spend it, stake it... and so much more coming soon!',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56',
    text: t('Buy VERTO'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.vertotrade.com/tokenomics/verto/#verto',
    text: t('Learn more'),
    external: true,
  },

  images: {
    path: '/images/home/verto/',
    attributes: [
      { src: 'bottom-right', alt: t('Small 3d pancake') },
      { src: 'top-right', alt: t('Small 3d pancake') },
      { src: 'coin', alt: t('VERTO token') },
      { src: 'top-left', alt: t('Small 3d pancake') },
    ],
  },
  ClipComponent: () => (
    <IconDivider
      background="transparent"
      textColor={isDark ? theme.colors.text : theme.colors.black}
      divBackground={theme.colors.backgroundAlt}
      Clip={() => <Clip url="images/animations/token.webm" />}
      reverse
    />
  ),
})
