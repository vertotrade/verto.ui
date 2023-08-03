import { Currency, Price } from '@verto/sdk'
import env from '@beam-australia/react-env'
import axios from 'axios'
import { useEffect, useState } from 'react'

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

export type PoolFarmInfo = Record<string, number>

const URL = `${env('APR_URL')}prices`

let fetchTokenPricesMapPromise: Promise<void> = null
let tokenPricesMap: undefined | PoolFarmInfo = null

export const getTokenPrices = async () => {
  if (!fetchTokenPricesMapPromise && !tokenPricesMap) {
    fetchTokenPricesMapPromise = axios
      .get(URL)
      .then(response => {
        tokenPricesMap = response?.data || {}
        fetchTokenPricesMapPromise = null
      })
      .catch(err => {
        console.error(`Error fetching APR data`, err)
        fetchTokenPricesMapPromise = null
      })
  }

  if (fetchTokenPricesMapPromise) {
    await fetchTokenPricesMapPromise
  }

  return tokenPricesMap || {}
}

export const useTokenPrices = (symbol: string) => {
  const [tokenPrice, setTokenPrice] = useState<number>(tokenPricesMap ? tokenPricesMap[symbol] : undefined)

  useEffect(() => {
    getTokenPrices().then(prices => {
      setTokenPrice(prices[symbol])
    })
  }, [symbol])

  return tokenPrice
}
