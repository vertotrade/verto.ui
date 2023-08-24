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

const BASE_URL = env('APR_URL')
const FETCH_INTERVAL = 10000

const fetchPromiseByPath: Record<string, Promise<void>> = {}
const cachedDataByPath: Record<string, any> = {}
const lastFetchedByPath: Record<string, number> = {}

export const fetchWithCache = async (path = '') => {
  const isCacheExpired = lastFetchedByPath[path] && lastFetchedByPath[path] + FETCH_INTERVAL < Date.now()

  if (isCacheExpired || (!fetchPromiseByPath[path] && !cachedDataByPath[path])) {
    fetchPromiseByPath[path] = axios
      .get(`${BASE_URL}${path}`)
      .then(response => {
        cachedDataByPath[path] = response?.data || {}
      })
      .catch(err => {
        console.error(`Error fetching APR data`, err)
      })
      .finally(() => {
        fetchPromiseByPath[path] = null
        lastFetchedByPath[path] = Date.now()
      })
  }

  if (fetchPromiseByPath[path]) {
    await fetchPromiseByPath[path]
  }

  return cachedDataByPath[path] || {}
}

export const useFetchWithCache = (path = '', key = '') => {
  const [data, setData] = useState<number>(() => {
    if (key) {
      return cachedDataByPath[path] ? cachedDataByPath[path][key] : undefined
    }

    return cachedDataByPath[path] ? cachedDataByPath[path] : undefined
  })

  useEffect(() => {
    const fetch = () =>
      fetchWithCache(path).then(res => {
        setData(key ? res[key] : res)
      })

    const interval = setInterval(fetch, FETCH_INTERVAL)

    return () => clearInterval(interval)
  }, [key, path])

  return data as any
}
