import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABIV1 from 'config/abi/masterchefV1.json'
import multicall from 'utils/multicall'
import { SerializedFarmConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const calls = farmsToFetch.map(farm => {
    const lpContractAddress = farm.lpAddress
    return { address: lpContractAddress, name: 'allowance', params: [account, farm.poolAddress] }
  })

  const rawLpAllowances = await multicall<BigNumber[]>(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map(lpBalance => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const calls = farmsToFetch.map(farm => {
    const lpContractAddress = farm.lpAddress
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map(tokenBalance => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const calls = farmsToFetch.map(farm => {
    return {
      address: farm.poolAddress,
      name: 'userInfo',
      params: [farm.v1pid, account],
    }
  })

  const rawStakedBalances = await multicall(masterchefABIV1, calls)
  const parsedStakedBalances = rawStakedBalances.map(stakedBalance => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const calls = farmsToFetch.map(farm => {
    return {
      address: farm.poolAddress,
      name: 'pendingReward',
      params: [farm.v1pid, account],
    }
  })

  const rawEarnings = await multicall(masterchefABIV1, calls)
  const parsedEarnings = rawEarnings.map(earnings => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
