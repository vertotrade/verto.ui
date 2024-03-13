import { ChartEntry } from 'state/info/types'
import { fetchChartDataWithAddress } from '../helpers'
import { MultiChainName } from '../../constant'

const getTokenChartData = async (): Promise<{ data?: ChartEntry[]; error: boolean }> => {
  return Promise.resolve({ data: [], error: false })
}

const fetchTokenChartData = async (
  chainName: MultiChainName,
  address: string,
): Promise<{ data?: ChartEntry[]; error: boolean }> => {
  return fetchChartDataWithAddress(chainName, getTokenChartData, address)
}

export default fetchTokenChartData
