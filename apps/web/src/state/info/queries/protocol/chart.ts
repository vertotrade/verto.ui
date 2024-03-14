/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react'
import { ChartEntry } from 'state/info/types'
import { SearchRequest, SearchResponse } from '@elastic/elasticsearch/lib/api/types'
import { TvlEntry, search } from 'utils/elastic-search'
import { fetchChartData, mapDayData } from '../helpers'
import { MultiChainName } from '../../constant'
import { useGetChainName } from '../../hooks'

const getOverviewChartData = async (): Promise<{ data?: ChartEntry[]; error: boolean }> => {
  try {
    const body: SearchRequest = {
      index: 'tvl',
      sort: [
        {
          timestamp: {
            order: 'asc',
          },
        },
      ] as any,
      size: 10000,
    }

    const { data: dayDatas } = await search<SearchResponse<TvlEntry>>(body)
    const data = dayDatas.hits.hits.map(hit => mapDayData(hit._source))

    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch overview chart data', error)
    return { error: true }
  }
}

/**
 * Fetch historic chart data
 */
const useFetchGlobalChartData = (): {
  error: boolean
  data: ChartEntry[] | undefined
} => {
  const [overviewChartData, setOverviewChartData] = useState<ChartEntry[] | undefined>()
  const [error, setError] = useState(false)
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchChartData(chainName, getOverviewChartData)
      if (data) {
        setOverviewChartData(data)
      } else {
        setError(true)
      }
    }
    if (!overviewChartData && !error) {
      fetch()
    }
  }, [overviewChartData, error, chainName])

  return {
    error,
    data: overviewChartData,
  }
}

export const fetchGlobalChartData = async (chainName: MultiChainName) => {
  const { data } = await fetchChartData(chainName, getOverviewChartData)
  return data
}

export default useFetchGlobalChartData
