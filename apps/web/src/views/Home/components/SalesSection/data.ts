import { TranslateFunction } from '@verto/localization'
import { SalesSectionProps } from '.'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Trade anything. No registration, no hassle.'),
  bodyText: t('Trade any token on Rebuschain in seconds, just by connecting your wallet.'),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.vertotrade.com/',
    text: t('Learn'),
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
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn passive income with crypto.'),
  bodyText: t('VertoTrade makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.vertotrade.com/products/yield-farming',
    text: t('Learn'),
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
})

export const vertoSectionData = (t: TranslateFunction): SalesSectionProps => ({
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
    text: t('Learn'),
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
})
