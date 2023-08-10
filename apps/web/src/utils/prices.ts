import { Currency, Price } from '@verto/sdk'
import { useFetchWithCache } from './fetchWithCache'

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
