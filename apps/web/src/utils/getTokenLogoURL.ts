import memoize from 'lodash/memoize'
import { Token } from '@verto/sdk'
import { DEFAULT_TOKEN_LIST } from 'state/lists/hooks'

const getTokenLogoURL = memoize(
  (token?: Token) => {
    return (
      DEFAULT_TOKEN_LIST.tokens.find(t => t.address === token.address && t.chainId === token.chainId)?.logoURI ||
      (token as any)?.logoURI ||
      null
    )
  },
  t => `${t.chainId}#${t.address}`,
)

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    return DEFAULT_TOKEN_LIST.tokens.find(t => t.address === address && t.chainId === chainId)?.logoURI || null
  },
  (address, chainId) => `${chainId}#${address}`,
)

export default getTokenLogoURL
