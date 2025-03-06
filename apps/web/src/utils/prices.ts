import { ChainId, Currency, ERC20Token, Price } from '@verto/sdk'
import { vertoTokens, vertoTokensTestnet, vertoTokensTestnetL2, vertoTokensL2 } from '@verto/tokens'
import { DEFAULT_CHAIN_ID } from '@verto/farms/src/const'
import { fetchWithCache, useFetchWithCache } from './fetchWithCache'

const tokens =
  DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET
    ? vertoTokensTestnet
    : DEFAULT_CHAIN_ID === ChainId.REBUS_L2
    ? vertoTokensL2
    : DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET_L2
    ? vertoTokensTestnetL2
    : vertoTokens

/**
 * Helper to multiply a Price object by an arbitrary amount
 */
export const multiplyPriceByAmount = (price: Price<Currency, Currency>, amount: number, significantDigits = 18) => {
  if (!price) {
    return 0
  }

  try {
    return parseFloat(price.toSignificant(significantDigits)) * amount
  } catch (error) {
    return 0
  }
}

export const useTokenPrices = (symbol: string) => {
  return useFetchWithCache('prices', symbol) as number
}

export const fetchAllTokenPrices = () => {
  return fetchWithCache('prices')
}

export const useTokenAndPriceByAddress = (currencyAddress: string): [ERC20Token, number] => {
  const token = Object.values(tokens).find(x => x.address === currencyAddress)
  const tokenPrice = useTokenPrices(token?.symbol)

  return [token, tokenPrice]
}
