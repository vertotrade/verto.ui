import env from '@beam-australia/react-env'
import { useTranslation } from '@verto/localization'
import { SearchRequest, SearchResponse } from '@elastic/elasticsearch/lib/api/types'
import { WrappedTokenInfo } from '@verto/token-lists'
import { add, sub, isEqual } from 'date-fns'
import { Currency, CurrencyAmount, Trade, TradeType } from '@verto/sdk'
import { vertoTokens, vertoTokensTestnet } from '@verto/tokens'
import tryParseAmount from '@verto/utils/tryParseAmount'
import { DEFAULT_INPUT_CURRENCY, DEFAULT_OUTPUT_CURRENCY } from 'config/constants/exchange'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { isAddress } from 'utils'
import { computeSlippageAdjustedAmounts } from 'utils/exchange'
import getLpAddress from 'utils/getLpAddress'
import { getTokenAddress } from 'views/Swap/components/Chart/utils'
import { useAccount } from 'wagmi'
import { LiquidityAggregate, ESTransaction, search } from 'utils/elastic-search'
import { AppState, useAppDispatch } from '../index'
import { useUserSlippageTolerance } from '../user/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, replaceSwapState } from './actions'
import { SwapState } from './reducer'
import { PairDataTimeWindowEnum } from './types'

const isMainnet = env('IS_MAINNET') === 'true'

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>(state => state.swap)
}

// TODO: update
const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // v2 router 02
]

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade<Currency, Currency, TradeType>, checksummedAddress: string): boolean {
  return (
    trade.route.path.some(token => token.address === checksummedAddress) ||
    trade.route.pairs.some(pair => pair.liquidityToken.address === checksummedAddress)
  )
}

// Get swap price for single token disregarding slippage and price impact
export function useSingleTokenSwapInfo(
  inputCurrencyId: string | undefined,
  inputCurrency: Currency | undefined,
  outputCurrencyId: string | undefined,
  outputCurrency: Currency | undefined,
): { [key: string]: number } {
  const token0Address = getTokenAddress(inputCurrencyId)
  const token1Address = getTokenAddress(outputCurrencyId)

  const parsedAmount = tryParseAmount('1', inputCurrency ?? undefined)

  const bestTradeExactIn = useTradeExactIn(parsedAmount, outputCurrency ?? undefined)
  if (!inputCurrency || !outputCurrency || !bestTradeExactIn) {
    return null
  }

  const inputTokenPrice = parseFloat(bestTradeExactIn?.executionPrice?.toSignificant(6))
  const outputTokenPrice = 1 / inputTokenPrice

  return {
    [token0Address]: inputTokenPrice,
    [token1Address]: outputTokenPrice,
  }
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  recipient: string,
): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  v2Trade: Trade<Currency, Currency, TradeType> | undefined
  inputError?: string
} {
  const { address: account } = useAccount()
  const { t } = useTranslation()

  const to: string | null = (recipient === null ? account : isAddress(recipient) || null) ?? null

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency]),
  )

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined)
  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? t('Select a token')
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? t('Enter a recipient')
  } else if (
    BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
    (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
    (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
  ) {
    inputError = inputError ?? t('Invalid recipient')
  }

  const [allowedSlippage] = useUserSlippageTolerance()

  const slippageAdjustedAmounts = v2Trade && allowedSlippage && computeSlippageAdjustedAmounts(v2Trade, allowedSlippage)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = t('Insufficient %symbol% balance', { symbol: amountIn.currency.symbol })
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    inputError,
  }
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !Number.isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParametersToSwapState(
  parsedQs: ParsedUrlQuery,
  nativeSymbol?: string,
  defaultOutputCurrency?: string,
): SwapState {
  let inputCurrency = isAddress(parsedQs.inputCurrency) || (nativeSymbol ?? DEFAULT_INPUT_CURRENCY)
  let outputCurrency =
    typeof parsedQs.outputCurrency === 'string'
      ? isAddress(parsedQs.outputCurrency) || nativeSymbol
      : defaultOutputCurrency ?? DEFAULT_OUTPUT_CURRENCY
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = ''
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
    pairDataById: {},
    derivedPairDataById: {},
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const native = useNativeCurrency()
  const { query } = useRouter()
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >()

  useEffect(() => {
    if (!chainId || !native) return
    const parsed = queryParametersToSwapState(
      query,
      native.symbol,
      isMainnet ? vertoTokens.wrebus?.address : vertoTokensTestnet.wrebus?.address,
    )

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: null,
      }),
    )

    setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId })
  }, [dispatch, chainId, query, native])

  return result
}

type useFetchPairPricesParams = {
  inputCurrency: WrappedTokenInfo
  outputCurrency: WrappedTokenInfo
  timeWindow: PairDataTimeWindowEnum
}

const getDurationFromTimeframe = (timeWindow: PairDataTimeWindowEnum) => {
  let duration: Duration = { days: 1 }

  if (timeWindow === PairDataTimeWindowEnum.WEEK) {
    duration.days = 7
  } else if (timeWindow === PairDataTimeWindowEnum.MONTH) {
    duration = { months: 1 }
  } else if (timeWindow === PairDataTimeWindowEnum.YEAR) {
    duration = { years: 1 }
  }

  return duration
}

const getDurationIntervalFromTimeframe = (timeWindow: PairDataTimeWindowEnum, multiplier = 1) => {
  let duration: Duration = { hours: 1 * multiplier }

  if (timeWindow === PairDataTimeWindowEnum.WEEK || timeWindow === PairDataTimeWindowEnum.MONTH) {
    duration = { days: 1 * multiplier }
  } else if (timeWindow === PairDataTimeWindowEnum.YEAR) {
    duration = { months: 1 * multiplier }
  }

  return duration
}

// Populates missing data points in the array with the previous data point
const populateEmptyDataPoints = (
  data: { time: Date; value: number }[],
  fromDate: Date,
  timeWindow: PairDataTimeWindowEnum,
): { time: Date; value: number }[] => {
  const startDate = new Date(fromDate)
  const now = new Date()
  const interval = getDurationIntervalFromTimeframe(timeWindow)
  const firstOldPointIndex = data.findIndex(point => point.time >= startDate) - 1
  let lastPoint: any = firstOldPointIndex >= 0 ? data[firstOldPointIndex] : data[0]
  let currentIndex = 0

  if (interval.hours) {
    startDate.setUTCMinutes(0, 0, 0)
  } else if (interval.days) {
    startDate.setUTCHours(0, 0, 0, 0)
  } else if (interval.months) {
    startDate.setUTCHours(0, 0, 0, 0)
    startDate.setUTCDate(1)
  }

  // eslint-disable-next-line no-param-reassign
  data = data.filter(point => point.time >= startDate)

  for (let i = startDate; i < now; i = add(i, interval)) {
    const point = data[currentIndex]

    if (!point || point.time > i) {
      data.splice(currentIndex, 0, {
        time: i,
        value: lastPoint && lastPoint.time <= i ? lastPoint.value : 0,
      })
    } else {
      if (!isEqual(point.time, i)) {
        i = sub(i, interval)
      }

      currentIndex++
      lastPoint = point
    }
  }

  return data
}

const getToken = (symbol, token0, token1) => {
  if (symbol === token0.symbol) {
    return token0
  }

  return token1
}

export const useFetchPairPrices = ({ inputCurrency, outputCurrency, timeWindow }: useFetchPairPricesParams) => {
  const [pairId, setPairId] = useState(null)
  const [pairPrices, setPairPrices] = useState([])
  const [lastPrice, setLastPrice] = useState<number | undefined>()
  const [hasError, setHasError] = useState(false)
  const currentFetchIndex = useRef(0)

  useEffect(() => {
    try {
      const pairAddress = getLpAddress(inputCurrency.address, outputCurrency.address)?.toLowerCase()
      if (pairAddress !== pairId) {
        setPairId(pairAddress)
      }
    } catch (error) {
      setPairId(null)
    }
  }, [inputCurrency?.address, outputCurrency?.address, pairId])

  useEffect(() => {
    const fetchIndex = ++currentFetchIndex.current

    const fetchData = async () => {
      if (!inputCurrency || !outputCurrency || !pairId) {
        return
      }

      setPairPrices([])
      setLastPrice(undefined)
      setHasError(false)

      const now = new Date()
      let indexSuffix = 'hourly'
      let size = 25
      if (timeWindow === PairDataTimeWindowEnum.WEEK) {
        indexSuffix = 'daily'
        size = 8
      } else if (timeWindow === PairDataTimeWindowEnum.MONTH) {
        indexSuffix = 'daily'
        size = 32
      } else if (timeWindow === PairDataTimeWindowEnum.YEAR) {
        indexSuffix = 'weekly'
        size = 54
      }

      const pair = `${inputCurrency.symbol.toLowerCase()}-${outputCurrency.symbol.toLowerCase()}`
      const originalPair = `${inputCurrency.symbol}-${outputCurrency.symbol}`
      const inverseOriginalPair = `${outputCurrency.symbol}-${inputCurrency.symbol}`
      const sort = [
        {
          timestamp: {
            order: 'desc',
          },
        },
      ] as any
      const body: SearchRequest = {
        index: `liquidity_${pair}_${indexSuffix}`,
        sort,
        size,
      }
      const lastPriceBody: SearchRequest = {
        index: 'transactions',
        sort,
        size: 1,
        query: {
          bool: {
            must: [
              {
                term: {
                  type: {
                    value: 'SWAP',
                  },
                },
              },
            ],
            should: [
              {
                term: {
                  pair: {
                    value: originalPair,
                  },
                },
              },
              {
                term: {
                  pair: {
                    value: inverseOriginalPair,
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
      }

      const actualFromDate = sub(now, getDurationFromTimeframe(timeWindow))

      try {
        const [{ data }, { data: lastPriceData }] = await Promise.all([
          search<SearchResponse<LiquidityAggregate>>(body),
          search<SearchResponse<ESTransaction>>(lastPriceBody),
        ])

        // Make sure we only set the data of the latest fetch if multiple fetches are running
        if (currentFetchIndex.current === fetchIndex) {
          const points = data.hits.hits.map(hit => ({
            time: new Date(hit._source.timestamp),
            value:
              getToken(inputCurrency.symbol, hit._source.token_0, hit._source.token_1).price /
              getToken(outputCurrency.symbol, hit._source.token_0, hit._source.token_1).price,
          }))
          points.reverse()

          const lastPriceRes = lastPriceData.hits.hits.map(
            hit =>
              getToken(inputCurrency.symbol, hit._source.token_out, hit._source.token_in).price /
              getToken(outputCurrency.symbol, hit._source.token_out, hit._source.token_in),
          )[0]
          const pairPricesRes = populateEmptyDataPoints(points, actualFromDate, timeWindow)

          setPairPrices(pairPricesRes)
          setLastPrice(lastPriceRes)
        }
      } catch (err) {
        setPairPrices(populateEmptyDataPoints([], actualFromDate, timeWindow))
        setLastPrice(undefined)

        console.error(err)
        setHasError(true)
      }
    }

    fetchData()
  }, [inputCurrency, inputCurrency?.symbol, outputCurrency, outputCurrency?.symbol, pairId, timeWindow])

  return { pairPrices, lastPrice, pairId, hasError }
}
