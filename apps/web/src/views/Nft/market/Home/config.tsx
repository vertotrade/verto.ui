// import { LinkExternal } from '@verto/uikit'
import { ContextApi } from '@verto/localization'

const config = (t: ContextApi['t']) => {
  return {
    header: 'FAQs',
    description: '',
    questions: [
      {
        title: t('I sold an NFT, where’s my REBUS?'),
        description: [t('Coming Soon!')],
      },
      {
        title: t('How can I list my NFT collection on the Market?'),
        description: [t('Coming Soon!')],
        // <LinkExternal href="https://docs.pancakeswap.finance/contact-us/nft-market-applications">
        //   {t('Please apply here')}
        // </LinkExternal>,
      },
      {
        title: t('What are the fees?'),
        description: [t('Coming Soon!')],
      },
    ],
    applyHeader: t('Apply to NFT Marketplace!'),
    applyDescription: t(''),
    applyButton: t('Apply'),
  }
}

export default config
