import type { Signer } from '@ethersproject/abstract-signer'
import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import type { Provider } from '@ethersproject/providers'
import { ChainId, Currency } from '@verto/sdk'
import { bsc } from 'wagmi/chains'
import memoize from 'lodash/memoize'
import { TokenAddressMap } from '@verto/token-lists'
import { vertoTokens, vertoTokensTestnet, vertoTokensTestnetL2, vertoTokensL2 } from '@verto/tokens'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import { chains } from './wagmi'
import { rebus, rebusTestnet, rebusTestnetL2, rebusL2 } from './wagmi-chains'

export const defaultVertoTokens =
  DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET
    ? vertoTokensTestnet
    : DEFAULT_CHAIN_ID === ChainId.REBUS_L2
    ? vertoTokensL2
    : DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET_L2
    ? vertoTokensTestnetL2
    : vertoTokens

export const defaultChain =
  DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET
    ? rebusTestnet
    : DEFAULT_CHAIN_ID === ChainId.REBUS_L2
    ? rebusL2
    : DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET_L2
    ? rebusTestnetL2
    : rebus

// returns the checksummed address if the address is valid, otherwise returns false
export const isAddress = memoize((value: any): string | false => {
  try {
    return getAddress(value)
  } catch {
    return false
  }
})

export function getBlockExploreLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainIdOverride?: number,
): string {
  const chainId = chainIdOverride || DEFAULT_CHAIN_ID
  const chain = chains.find(c => c.id === chainId)
  if (!chain) return bsc.blockExplorers.default.url
  switch (type) {
    case 'transaction': {
      return `${chain.blockExplorers.default.url}/tx/${data}`
    }
    case 'token': {
      return `${chain.blockExplorers.default.url}/token/${data}`
    }
    case 'block': {
      return `${chain.blockExplorers.default.url}/block/${data}`
    }
    case 'countdown': {
      return `${chain.blockExplorers.default.url}/block/countdown/${data}`
    }
    default: {
      return `${chain.blockExplorers.default.url}/address/${data}`
    }
  }
}

export function getBlockExploreName(chainIdOverride?: number) {
  const chainId = chainIdOverride || DEFAULT_CHAIN_ID
  const chain = chains.find(c => c.id === chainId)

  return chain?.blockExplorers?.default.name || bsc.blockExplorers.default.name
}

export function getExplorerScanLinkForNft(collectionAddress: string, tokenId: string): string {
  return `${defaultChain.blockExplorers.default.url}/token/${collectionAddress}?a=${tokenId}`
}

// add 10%
export function calculateGasMargin(value: BigNumber, margin = 1000): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(margin))).div(BigNumber.from(10000))
}

// account is optional
export function getContract(address: string, ABI: any, signer?: Signer | Provider): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, signer)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap<ChainId>, currency?: Currency): boolean {
  if (currency?.isNative) return true
  return Boolean(currency?.isToken && defaultTokens[currency.chainId]?.[currency.address])
}
