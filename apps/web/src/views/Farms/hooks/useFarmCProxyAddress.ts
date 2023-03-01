import useSWR from 'swr'
import { ChainId } from '@verto/sdk'
import { fetchCProxyAddress } from 'state/farms/fetchFarmUser'
import { farmFetcher } from 'state/farms'

export const useFarmCProxyAddress = (account?: string, chainId?: number) => {
  const multiCallChainId = farmFetcher.isTestnet(chainId) ? ChainId.REBUS_TESTNET : ChainId.REBUS
  const { data } = useSWR(account && chainId && ['cProxyAddress', account, chainId], async () =>
    fetchCProxyAddress(account, multiCallChainId),
  )

  return {
    cProxyAddress: data,
  }
}
