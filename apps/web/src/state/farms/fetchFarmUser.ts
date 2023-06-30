import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall, { multicallv2 } from 'utils/multicall'
import { SerializedFarmConfig } from 'config/constants/types'
import { getCrossFarmingReceiverContract } from 'utils/contractHelpers'
import { DEFAULT_CHAIN_ID } from 'config/chains'

export const fetchFarmUserAllowances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
  proxyAddress?: string,
) => {
  const calls = farmsToFetch.map(farm => {
    const lpContractAddress = farm.lpAddress
    return { address: lpContractAddress, name: 'allowance', params: [account, proxyAddress || farm.poolAddress] }
  })

  const rawLpAllowances = await multicall<BigNumber[]>(erc20ABI, calls, chainId)
  const parsedLpAllowances = rawLpAllowances.map(lpBalance => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const calls = farmsToFetch.map(farm => {
    const lpContractAddress = farm.lpAddress
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls, chainId)
  const parsedTokenBalances = rawTokenBalances.map(tokenBalance => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const calls = farmsToFetch.map(farm => {
    return {
      address: farm.poolAddress,
      name: 'userInfo',
      params: [account],
    }
  })

  const rawStakedBalances = await multicallv2({
    abi: masterchefABI,
    calls,
    chainId,
    options: { requireSuccess: false },
  })

  const parsedStakedBalances = rawStakedBalances.map(stakedBalance => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const multiCallChainId = DEFAULT_CHAIN_ID

  const calls = farmsToFetch.map(farm => {
    return {
      address: farm.poolAddress,
      name: 'pendingReward',
      params: [account],
    }
  })

  const rawEarnings = await multicallv2({ abi: masterchefABI, calls, chainId: multiCallChainId })
  const parsedEarnings = rawEarnings.map(earnings => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchCProxyAddress = async (address: string, chainId: number) => {
  try {
    const crossFarmingAddress = getCrossFarmingReceiverContract(null, chainId)
    const cProxyAddress = await crossFarmingAddress.cProxy(address)
    return cProxyAddress.toString()
  } catch (error) {
    console.error('Failed Fetch CProxy Address', error)
    return address
  }
}
