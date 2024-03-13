/* eslint-disable no-param-reassign */
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { Block, PoolData } from 'state/info/types'
import { getChangeForPeriod } from 'utils/getChangeForPeriod'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { getLpFeesAndApr } from 'utils/getLpFeesAndApr'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getPercentChange, getAmountChange } from 'views/Info/utils/infoDataHelpers'
import { SearchRequest, SearchResponse } from '@elastic/elasticsearch/lib/api/types'
import { LiquidityAggregate, search } from 'utils/elastic-search'
import { DEFAULT_TOKEN_LIST } from 'state/lists/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { fetchAllTokenPrices } from 'utils/prices'
import { ERC20Token, Pair } from '@verto/sdk'
import {
  getMultiChainQueryEndPointWithStableSwap,
  MultiChainName,
  multiChainQueryMainToken,
  checkIsStableSwap,
} from '../../constant'
import { useGetChainName } from '../../hooks'

interface PoolFields {
  id: string
  reserve0: string
  reserve1: string
  reserveUSD: string
  volumeUSD: string
  volumeOutUSD?: string
  token0Price: string
  token1Price: string
  token0?: {
    id: string
    symbol: string
    name: string
  }
  token1?: {
    id: string
    symbol: string
    name: string
  }
}

export interface FormattedPoolFields
  extends Omit<
    PoolFields,
    'volumeUSD' | 'reserveUSD' | 'reserve0' | 'reserve1' | 'token0Price' | 'token1Price' | 'volumeOutUSD'
  > {
  volumeUSD: number
  reserveUSD: number
  reserve0: number
  reserve1: number
  token0Price: number
  token1Price: number
  volumeOutUSD?: number
}

interface PoolsQueryResponse {
  now: PoolFields[]
  oneDayAgo: PoolFields[]
  twoDaysAgo: PoolFields[]
  oneWeekAgo: PoolFields[]
  twoWeeksAgo: PoolFields[]
}

/**
 * Data for displaying pool tables (on multiple pages, used throughout the site)
 * Note: Don't try to refactor it to use variables, server throws error if blocks passed as undefined variable
 * only works if its hard-coded into query string
 */
const POOL_AT_BLOCK = (chainName: MultiChainName, block: number | null, pools: string[]) => {
  const blockString = block ? `block: {number: ${block}}` : ``
  const addressesString = `["${pools.join('","')}"]`
  const volumeOutUSDString = checkIsStableSwap() ? 'volumeOutUSD' : ''

  return `pairs(
    where: { id_in: ${addressesString} }
    ${blockString}
    orderBy: trackedReserve${multiChainQueryMainToken[chainName]}
    orderDirection: desc
  ) {
    id
    reserve0
    reserve1
    reserveUSD
    volumeUSD
    ${volumeOutUSDString}
    token0Price
    token1Price
    token0 {
      id
      symbol
      name
    }
    token1 {
      id
      symbol
      name
    }
  }`
}

export const fetchPoolData = async (
  block24h: number,
  block48h: number,
  block7d: number,
  block14d: number,
  poolAddresses: string[],
  chainName: 'ETH' | 'BSC' = 'BSC',
) => {
  try {
    const query = gql`
      query pools {
        now: ${POOL_AT_BLOCK(chainName, null, poolAddresses)}
        oneDayAgo: ${POOL_AT_BLOCK(chainName, block24h, poolAddresses)}
        twoDaysAgo: ${POOL_AT_BLOCK(chainName, block48h, poolAddresses)}
        oneWeekAgo: ${POOL_AT_BLOCK(chainName, block7d, poolAddresses)}
        twoWeeksAgo: ${POOL_AT_BLOCK(chainName, block14d, poolAddresses)}
      }
    `
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<PoolsQueryResponse>(query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch pool data', error)
    return { error: true }
  }
}

// Transforms pools into "0xADDRESS: { ...PoolFields }" format and cast strings to numbers
export const parsePoolData = (pairs?: PoolFields[]) => {
  if (!pairs) {
    return {}
  }
  return pairs.reduce((accum: { [address: string]: FormattedPoolFields }, poolData) => {
    const { volumeUSD, reserveUSD, reserve0, reserve1, token0Price, token1Price, volumeOutUSD } = poolData
    accum[poolData.id.toLowerCase()] = {
      ...poolData,
      volumeUSD: parseFloat(volumeUSD),
      volumeOutUSD: volumeOutUSD && parseFloat(volumeOutUSD),
      reserveUSD: parseFloat(reserveUSD),
      reserve0: parseFloat(reserve0),
      reserve1: parseFloat(reserve1),
      token0Price: parseFloat(token0Price),
      token1Price: parseFloat(token1Price),
    }
    return accum
  }, {})
}

interface PoolDatas {
  error: boolean
  data?: {
    [address: string]: PoolData
  }
}

/**
 * Fetch top pools by liquidity
 */
const usePoolDatas = (poolAddresses: string[]): PoolDatas => {
  const [fetchState, setFetchState] = useState<PoolDatas>({ error: false })
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const [block24h, block48h, block7d, block14d] = blocks ?? []
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      const { error, data } = await fetchPoolData(
        block24h.number,
        block48h.number,
        block7d.number,
        block14d.number,
        poolAddresses,
        chainName,
      )
      if (error) {
        setFetchState({ error: true })
      } else {
        const formattedPoolData = parsePoolData(data?.now)
        const formattedPoolData24h = parsePoolData(data?.oneDayAgo)
        const formattedPoolData48h = parsePoolData(data?.twoDaysAgo)
        const formattedPoolData7d = parsePoolData(data?.oneWeekAgo)
        const formattedPoolData14d = parsePoolData(data?.twoWeeksAgo)

        // Calculate data and format
        const formatted = poolAddresses.reduce((accum: { [address: string]: PoolData }, address) => {
          // Undefined data is possible if pool is brand new and didn't exist one day ago or week ago.
          const current: FormattedPoolFields | undefined = formattedPoolData[address]
          const oneDay: FormattedPoolFields | undefined = formattedPoolData24h[address]
          const twoDays: FormattedPoolFields | undefined = formattedPoolData48h[address]
          const week: FormattedPoolFields | undefined = formattedPoolData7d[address]
          const twoWeeks: FormattedPoolFields | undefined = formattedPoolData14d[address]

          const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
            current?.volumeUSD,
            oneDay?.volumeUSD,
            twoDays?.volumeUSD,
          )
          const [volumeUSDWeek, volumeUSDChangeWeek] = getChangeForPeriod(
            current?.volumeUSD,
            week?.volumeUSD,
            twoWeeks?.volumeUSD,
          )

          const liquidityUSD = current ? current.reserveUSD : 0

          const liquidityUSDChange = getPercentChange(current?.reserveUSD, oneDay?.reserveUSD)

          const liquidityToken0 = current ? current.reserve0 : 0
          const liquidityToken1 = current ? current.reserve1 : 0

          const { totalFees24h, totalFees7d, lpFees24h, lpFees7d, lpApr7d } = getLpFeesAndApr(
            volumeUSD,
            volumeUSDWeek,
            liquidityUSD,
          )

          if (current) {
            accum[address] = {
              address,
              token0: {
                address: current.token0.id,
                name: current.token0.name,
                symbol: current.token0.symbol,
              },
              token1: {
                address: current.token1.id,
                name: current.token1.name,
                symbol: current.token1.symbol,
              },
              token0Price: current.token0Price,
              token1Price: current.token1Price,
              volumeUSD,
              volumeUSDChange,
              volumeUSDWeek,
              volumeUSDChangeWeek,
              totalFees24h,
              totalFees7d,
              lpFees24h,
              lpFees7d,
              lpApr7d,
              liquidityUSD,
              liquidityUSDChange,
              liquidityToken0,
              liquidityToken1,
            }
          }

          return accum
        }, {})
        setFetchState({ data: formatted, error: false })
      }
    }

    const allBlocksAvailable = block24h?.number && block48h?.number && block7d?.number && block14d?.number
    if (poolAddresses.length > 0 && allBlocksAvailable && !blockError) {
      fetch()
    }
  }, [poolAddresses, block24h, block48h, block7d, block14d, blockError, chainName])

  return fetchState
}

export const fetchAllPoolDataWithAddress = async (
  blocks: Block[],
  chainName: MultiChainName,
  poolAddresses: string[],
) => {
  const [block24h, block48h, block7d, block14d] = blocks ?? []

  const { data } = await fetchPoolData(
    block24h.number,
    block48h.number,
    block7d.number,
    block14d.number,
    poolAddresses,
    chainName,
  )

  const formattedPoolData = parsePoolData(data?.now)
  const formattedPoolData24h = parsePoolData(data?.oneDayAgo)
  const formattedPoolData48h = parsePoolData(data?.twoDaysAgo)
  const formattedPoolData7d = parsePoolData(data?.oneWeekAgo)
  const formattedPoolData14d = parsePoolData(data?.twoWeeksAgo)

  // Calculate data and format
  const formatted = poolAddresses.reduce((accum: { [address: string]: { data: PoolData } }, address) => {
    // Undefined data is possible if pool is brand new and didn't exist one day ago or week ago.
    const current: FormattedPoolFields | undefined = formattedPoolData[address]
    const oneDay: FormattedPoolFields | undefined = formattedPoolData24h[address]
    const twoDays: FormattedPoolFields | undefined = formattedPoolData48h[address]
    const week: FormattedPoolFields | undefined = formattedPoolData7d[address]
    const twoWeeks: FormattedPoolFields | undefined = formattedPoolData14d[address]

    const [volumeUSD, volumeUSDChange] = getChangeForPeriod(current?.volumeUSD, oneDay?.volumeUSD, twoDays?.volumeUSD)
    const volumeOutUSD = current?.volumeOutUSD && getAmountChange(current?.volumeOutUSD, oneDay?.volumeOutUSD)
    const volumeOutUSDWeek = current?.volumeOutUSD && getAmountChange(current?.volumeOutUSD, week?.volumeOutUSD)
    const [volumeUSDWeek, volumeUSDChangeWeek] = getChangeForPeriod(
      current?.volumeUSD,
      week?.volumeUSD,
      twoWeeks?.volumeUSD,
    )

    const liquidityUSD = current ? current.reserveUSD : 0

    const liquidityUSDChange = getPercentChange(current?.reserveUSD, oneDay?.reserveUSD)

    const liquidityToken0 = current ? current.reserve0 : 0
    const liquidityToken1 = current ? current.reserve1 : 0

    const { totalFees24h, totalFees7d, lpFees24h, lpFees7d, lpApr7d } = getLpFeesAndApr(
      volumeUSD,
      volumeUSDWeek,
      liquidityUSD,
    )

    if (current) {
      accum[address] = {
        data: {
          address,
          token0: {
            address: current.token0.id,
            name: current.token0.name,
            symbol: current.token0.symbol,
          },
          token1: {
            address: current.token1.id,
            name: current.token1.name,
            symbol: current.token1.symbol,
          },
          token0Price: current.token0Price,
          token1Price: current.token1Price,
          volumeUSD,
          volumeUSDChange,
          volumeUSDWeek,
          volumeUSDChangeWeek,
          totalFees24h,
          totalFees7d,
          lpFees24h,
          lpFees7d,
          lpApr7d,
          liquidityUSD,
          liquidityUSDChange,
          liquidityToken0,
          liquidityToken1,
          volumeOutUSD,
          volumeOutUSDWeek,
        },
      }
    }

    return accum
  }, {})
  return formatted
}

export const fetchAllPoolData = async () => {
  const poolDataMap: Record<string, PoolData> = {}

  try {
    const allPairsRequest: SearchRequest = {
      index: `transactions`,
      size: 0,
      aggregations: {
        pairs: {
          terms: {
            field: 'pair',
            size: 100,
          },
        },
      },
    }
    const hourlyRequest: SearchRequest = {
      index: `liquidity_*_hourly`,
      size: 24,
      query: {
        bool: {
          must: [
            {
              range: {
                timestamp: {
                  gte: 'now-1d/h',
                },
              },
            },
          ],
          should: [],
        },
      },
      sort: [
        {
          timestamp: {
            order: 'desc',
          },
        },
      ],
    }
    const dailyRequest: SearchRequest = {
      index: `liquidity_*_daily`,
      size: 7,
      query: {
        bool: {
          must: [
            {
              range: {
                timestamp: {
                  gte: 'now-7d/d',
                },
              },
            },
          ],
          should: [],
        },
      },
      sort: [
        {
          timestamp: {
            order: 'desc',
          },
        },
      ],
    }

    const [allTokenPrices, { data: allPairsRes }, { data: hourlyRes }, { data: dailyRes }] = await Promise.all([
      fetchAllTokenPrices(),
      search<SearchResponse>(allPairsRequest),
      search<SearchResponse<LiquidityAggregate>>(hourlyRequest),
      search<SearchResponse<LiquidityAggregate>>(dailyRequest),
    ])
    const pairs = allPairsRes.aggregations?.pairs as any

    const volume24BySymbol = {} as Record<string, BigNumber>
    hourlyRes.hits.hits.forEach(hit => {
      const source = hit._source

      if (!volume24BySymbol[source.pair]) {
        volume24BySymbol[source.pair] = BigNumber.from(0)
      }

      volume24BySymbol[source.pair] = volume24BySymbol[source.pair].add(BigNumber.from(source.total_value))
    })

    const volumeWeekBySymbol = {} as Record<string, BigNumber>
    dailyRes.hits.hits.forEach(hit => {
      const source = hit._source

      if (!volumeWeekBySymbol[source.pair]) {
        volumeWeekBySymbol[source.pair] = BigNumber.from(0)
      }

      volumeWeekBySymbol[source.pair] = volumeWeekBySymbol[source.pair].add(BigNumber.from(source.total_value))
    })

    const mappedData: PoolData[] | undefined = pairs?.buckets?.map(hit => {
      const [token0Symbol, token1Symbol] = hit.key.split('-')
      const token0Info = DEFAULT_TOKEN_LIST.tokens.find(token => token.symbol === token0Symbol)
      const token1Info = DEFAULT_TOKEN_LIST.tokens.find(token => token.symbol === token1Symbol)

      return {
        address: Pair.getAddress(
          new ERC20Token(
            token0Info.chainId,
            token0Info.address,
            token0Info.decimals,
            token0Info.symbol,
            token0Info.name,
          ),
          new ERC20Token(
            token1Info.chainId,
            token1Info.address,
            token1Info.decimals,
            token1Info.symbol,
            token1Info.name,
          ),
        ),
        token0: token0Info,
        token1: token1Info,

        volumeUSD: volume24BySymbol[hit.key]?.toNumber() ?? 0,
        volumeOutUSD: null,
        volumeUSDChange: 0,
        volumeUSDWeek: volumeWeekBySymbol[hit.key]?.toNumber() ?? 0,
        volumeOutUSDWeek: null,
        volumeUSDChangeWeek: 0,

        totalFees24h: 0,
        totalFees7d: 0,
        lpFees24h: 0,
        lpFees7d: 0,
        lpApr7d: 0,

        liquidityUSD: 0,
        liquidityUSDChange: 0,

        token0Price: allTokenPrices[token0Symbol],
        token1Price: allTokenPrices[token1Symbol],

        liquidityToken0: 0,
        liquidityToken1: 0,
      } as PoolData
    })

    return mappedData
  } catch {
    return poolDataMap
  }
}

export default usePoolDatas
