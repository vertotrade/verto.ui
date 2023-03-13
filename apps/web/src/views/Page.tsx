import { Swap } from '@verto/uikit'
import { ChainId } from '@verto/sdk'
import { PageMeta } from 'components/Layout/Page'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { EXCHANGE_HELP_URLS } from 'config/constants'

const Page: React.FC<
  React.PropsWithChildren<{
    removePadding?: boolean
    hideFooterOnDesktop?: boolean
    noMinHeight?: boolean
    helpUrl?: string
  }>
> = ({
  children,
  removePadding = false,
  hideFooterOnDesktop = false,
  noMinHeight = false,
  helpUrl = EXCHANGE_HELP_URLS,
  ...props
}) => {
  const { chainId } = useActiveChainId()
  const isBSC = chainId === ChainId.BSC
  const externalLinkUrl = isBSC ? 'https://bridge.vertotrade.com/' : ''

  return (
    <>
      <PageMeta />
      <Swap.Page
        removePadding={removePadding}
        noMinHeight={noMinHeight}
        hideFooterOnDesktop={hideFooterOnDesktop}
        helpUrl={helpUrl}
        externalLinkUrl={externalLinkUrl}
        {...props}>
        {children}
      </Swap.Page>
    </>
  )
}

export default Page
