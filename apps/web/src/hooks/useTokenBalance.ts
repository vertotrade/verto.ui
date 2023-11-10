import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { CAKE } from '@verto/tokens'
import { FAST_INTERVAL } from 'config/constants'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { ChainId } from '@verto/sdk'
import { useMemo } from 'react'
import useSWR from 'swr'
import { BIG_ZERO } from '@verto/utils/bigNumber'
import { rebusRpcProvider } from 'utils/providers'
import { useWeb3React } from '@verto/wagmi'
import { useTokenContract } from './useContract'
import { useSWRContract } from './useSWRContract'

const useTokenBalance = (tokenAddress: string, forceBSC?: boolean) => {
  const { address: account } = useAccount()

  const contract = useTokenContract(tokenAddress, false)

  const key = useMemo(
    () =>
      account
        ? {
            contract: forceBSC ? contract.connect(rebusRpcProvider) : contract,
            methodName: 'balanceOf',
            params: [account],
          }
        : null,
    [account, contract, forceBSC],
  )

  const { data, status, ...rest } = useSWRContract(key as any, {
    refreshInterval: FAST_INTERVAL,
  })

  const balance = useMemo(() => (data ? new BigNumber(data.toString()) : BIG_ZERO), [data])

  return {
    ...rest,
    fetchStatus: status,
    balance,
  }
}

export const useGetRebusBalance = () => {
  const { address: account } = useAccount()
  const { status, data, mutate } = useSWR([account, 'rebusBalance'], async () => {
    return rebusRpcProvider.getBalance(account)
  })

  return { balance: data || Zero, fetchStatus: status, refresh: mutate }
}

export const useGetCakeBalance = () => {
  const { chainId } = useWeb3React()
  const { balance, fetchStatus } = useTokenBalance(CAKE[chainId]?.address || CAKE[ChainId.BSC]?.address, true)

  // TODO: Remove ethers conversion once useTokenBalance is converted to ethers.BigNumber
  return { balance: EthersBigNumber.from(balance.toString()), fetchStatus }
}

export default useTokenBalance
