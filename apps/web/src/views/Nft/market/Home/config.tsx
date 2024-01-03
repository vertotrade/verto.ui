// import { LinkExternal } from '@verto/uikit'
import { ContextApi } from '@verto/localization'

const config = (t: ContextApi['t']) => {
  return {
    header: 'FAQs',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    questions: [
      {
        title: t('I sold an NFT, where’s my REBUS?'),
        description: [
          t(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. .',
          ),
          t(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. .',
          ),
        ],
      },
      {
        title: t('How can I list my NFT collection on the Market?'),
        description: [
          t(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. .',
          ),
          t(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. .',
          ),
          // <LinkExternal href="https://docs.pancakeswap.finance/contact-us/nft-market-applications">
          //   {t('Please apply here')}
          // </LinkExternal>,
        ],
      },
      {
        title: t('What are the fees?'),
        description: [
          t(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. .',
          ),
          t(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. .',
          ),
        ],
      },
    ],
    applyHeader: t('Apply to NFT Marketplace!'),
    applyDescription: t(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ),
    applyButton: t('Apply'),
  }
}

export default config
