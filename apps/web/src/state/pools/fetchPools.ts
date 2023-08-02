import BigNumber from 'bignumber.js'
import fromPairs from 'lodash/fromPairs'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall, { multicallv2 } from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from '@verto/utils/bigNumber'
import chunk from 'lodash/chunk'
import { getPoolFarmInfo } from 'utils/apr'
import sousChefV2 from '../../config/abi/sousChefV2.json'
import sousChefV3 from '../../config/abi/sousChefV3.json'

const livePoolsWithEnd = poolsConfig.filter(p => p.sousId !== 0 && !p.isFinished)

const startEndBlockCalls = livePoolsWithEnd.flatMap(poolConfig => {
  return [
    {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    },
    {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    },
  ]
})

export const fetchPoolsBlockLimits = async () => {
  const startEndBlockRaw = await multicall(sousChefABI, startEndBlockCalls)

  const startEndBlockResult = startEndBlockRaw.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return livePoolsWithEnd.map((cakePoolConfig, index) => {
    const [[startBlock], [endBlock]] = startEndBlockResult[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: startBlock.toNumber(),
      endBlock: endBlock.toNumber(),
    }
  })
}

const poolsBalanceOf = poolsConfig.map(poolConfig => {
  return {
    address: poolConfig.stakingToken.address,
    name: 'balanceOf',
    params: [getAddress(poolConfig.contractAddress)],
  }
})

export const fetchPoolsTotalStaking = async () => {
  const poolsTotalStaked = await multicall(erc20ABI, poolsBalanceOf)

  return poolsConfig.map((p, index) => ({
    sousId: p.sousId,
    totalStaked: new BigNumber(poolsTotalStaked[index]).toJSON(),
  }))
}

export const fetchPoolsStakingLimits = async (
  poolsWithStakingLimit: number[],
): Promise<{ [key: string]: { stakingLimit: BigNumber; numberBlocksForUserLimit: number } }> => {
  const validPools = poolsConfig
    .filter(p => p.stakingToken.symbol !== 'BNB' && !p.isFinished)
    .filter(p => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  const poolStakingCalls = validPools
    .map(validPool => {
      const contractAddress = getAddress(validPool.contractAddress)
      return ['hasUserLimit', 'poolLimitPerUser', 'numberBlocksForUserLimit'].map(method => ({
        address: contractAddress,
        name: method,
      }))
    })
    .flat()

  const poolStakingResultRaw = await multicallv2({
    abi: sousChefV2,
    calls: poolStakingCalls,
    options: { requireSuccess: false },
  })
  const chunkSize = poolStakingCalls.length / validPools.length
  const poolStakingChunkedResultRaw = chunk(poolStakingResultRaw.flat(), chunkSize)
  return fromPairs(
    poolStakingChunkedResultRaw.map((stakingLimitRaw, index) => {
      const hasUserLimit = stakingLimitRaw[0]
      const stakingLimit = hasUserLimit && stakingLimitRaw[1] ? new BigNumber(stakingLimitRaw[1].toString()) : BIG_ZERO
      const numberBlocksForUserLimit = stakingLimitRaw[2] ? (stakingLimitRaw[2] as EthersBigNumber).toNumber() : 0
      return [validPools[index].sousId, { stakingLimit, numberBlocksForUserLimit }]
    }),
  )
}

const livePoolsWithV3 = poolsConfig.filter(pool => pool?.version === 3 && !pool?.isFinished)

export const fetchPoolsProfileRequirement = async (): Promise<{
  [key: string]: {
    required: boolean
    thresholdPoints: string
  }
}> => {
  const poolProfileRequireCalls = livePoolsWithV3
    .map(validPool => {
      const contractAddress = getAddress(validPool.contractAddress)
      return ['pancakeProfileIsRequested', 'pancakeProfileThresholdPoints'].map(method => ({
        address: contractAddress,
        name: method,
      }))
    })
    .flat()

  const poolProfileRequireResultRaw = await multicallv2({
    abi: sousChefV3,
    calls: poolProfileRequireCalls,
    options: { requireSuccess: false },
  })
  const chunkSize = poolProfileRequireCalls.length / livePoolsWithV3.length
  const poolStakingChunkedResultRaw = chunk(poolProfileRequireResultRaw.flat(), chunkSize)
  return fromPairs(
    poolStakingChunkedResultRaw.map((poolProfileRequireRaw, index) => {
      const hasProfileRequired = poolProfileRequireRaw[0]
      const profileThresholdPoints = poolProfileRequireRaw[1]
        ? new BigNumber(poolProfileRequireRaw[1].toString())
        : BIG_ZERO
      return [
        livePoolsWithV3[index].sousId,
        {
          required: !!hasProfileRequired,
          thresholdPoints: profileThresholdPoints.toJSON(),
        },
      ]
    }),
  )
}

const withdrawFeePeriod = poolsConfig.map(poolConfig => {
  return {
    address: getAddress(poolConfig.contractAddress),
    name: 'withdrawFeePeriod',
  }
})

export const fetchPoolsWithdrawFeePeriod = async () => {
  const withdrawFeePeriods = await multicall(erc20ABI, withdrawFeePeriod)

  return poolsConfig.map((p, index) => ({
    sousId: p.sousId,
    withdrawFeePeriod: new BigNumber(withdrawFeePeriods[index]).toJSON(),
  }))
}

const withdrawFee = poolsConfig.map(poolConfig => {
  return {
    address: getAddress(poolConfig.contractAddress),
    name: 'withdrawFee',
  }
})

export const fetchPoolsWithdrawFee = async () => {
  const withdrawFees = await multicall(erc20ABI, withdrawFee)

  return poolsConfig.map((p, index) => ({
    sousId: p.sousId,
    withdrawFee: new BigNumber(withdrawFees[index]).toJSON(),
  }))
}
const depositFee = poolsConfig.map(poolConfig => {
  return {
    address: getAddress(poolConfig.contractAddress),
    name: 'depositFee',
  }
})

export const fetchPoolsDepositFee = async () => {
  const depositFees = await multicall(erc20ABI, depositFee)

  return poolsConfig.map((p, index) => ({
    sousId: p.sousId,
    depositFee: new BigNumber(depositFees[index]).toJSON(),
  }))
}

const isBoosted = poolsConfig.map(poolConfig => {
  return {
    address: getAddress(poolConfig.contractAddress),
    name: 'isBoosted',
  }
})

export const fetchPoolsIsBoosted = async () => {
  const areBoosted = await multicall(erc20ABI, isBoosted)

  return poolsConfig.map((p, index) => ({
    sousId: p.sousId,
    isBoosted: areBoosted[index][0],
  }))
}

export const fetchPoolsBoostBlockStart = async poolIdsToFetch => {
  const filteredPoolsConfig = poolsConfig.filter(
    poolConfig => poolIdsToFetch.includes(poolConfig.sousId) && poolConfig.hasBoostBlockStart,
  )

  if (!filteredPoolsConfig.length) {
    return []
  }

  const boostBlockStart = filteredPoolsConfig.map(poolConfig => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'boostBlockStart',
    }
  })

  const allBoostStartBlocks = await multicall(erc20ABI, boostBlockStart)

  return filteredPoolsConfig.map((p, index) => ({
    sousId: p.sousId,
    boostBlockStart: parseInt(allBoostStartBlocks[index][0].toString(), 10),
  }))
}

export const fetchPoolsMinPerUser = async poolIdsToFetch => {
  const filteredPoolsConfig = poolsConfig.filter(
    poolConfig => poolIdsToFetch.includes(poolConfig.sousId) && poolConfig.hasMinPerUser,
  )

  if (!filteredPoolsConfig.length) {
    return []
  }

  const minPerUser = filteredPoolsConfig.map(poolConfig => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'poolMinPerUser',
    }
  })

  const allMinPerUser = await multicall(erc20ABI, minPerUser)

  return filteredPoolsConfig.map((p, index) => ({
    sousId: p.sousId,
    minPerUser: allMinPerUser[index][0].toString(),
  }))
}

export const fetchPoolsIsWhitelisted = async poolIdsToFetch => {
  const filteredPoolsConfig = poolsConfig.filter(poolConfig => poolIdsToFetch.includes(poolConfig.sousId))

  if (!filteredPoolsConfig.length) {
    return []
  }

  const isWhitelisted = filteredPoolsConfig.map(poolConfig => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'isWhiteListed',
    }
  })

  const areWhitelisted = await multicall(erc20ABI, isWhitelisted)

  return filteredPoolsConfig.map((p, index) => ({
    sousId: p.sousId,
    hasWhitelist: areWhitelisted[index][0],
  }))
}

export const fetchPoolsCheckWhitelist = async (poolIdsToFetch, walletAddress) => {
  if (!walletAddress || !poolIdsToFetch.length) {
    return []
  }

  const filteredPoolsConfig = poolsConfig.filter(poolConfig => poolIdsToFetch.includes(poolConfig.sousId))

  const checkWhitelist = filteredPoolsConfig.map(poolConfig => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'whiteList',
      params: [walletAddress],
    }
  })

  const areWhitelistConfirmed = await multicall(erc20ABI, checkWhitelist)

  return filteredPoolsConfig.map((p, index) => ({
    sousId: p.sousId,
    whitelisted: areWhitelistConfirmed[index][0],
  }))
}

const formatData = value => {
  if (value && value._hex) {
    return new BigNumber(value).toJSON()
  }
  return value
}

const recursivelyFormatData = data => {
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: recursivelyFormatData(value),
      }
    }, {})
  }
  return formatData(data)
}

export const fetchUserInfo = async (walletAddress: string) => {
  if (!walletAddress) {
    return poolsConfig.map(p => ({
      sousId: p.sousId,
      userInfo: null,
    }))
  }

  const userInfo = poolsConfig.map(poolConfig => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'userInfo',
      params: [walletAddress],
    }
  })

  const userInfoPerPool = await multicall(erc20ABI, userInfo)

  return poolsConfig.map((p, index) => {
    return {
      sousId: p.sousId,
      userInfo: recursivelyFormatData(userInfoPerPool[index]),
    }
  })
}

export const fetchPoolAprLiquidityInfo = () => {
  return Promise.all(
    poolsConfig.map(p => {
      return getPoolFarmInfo(getAddress(p.contractAddress)).then(info => ({
        sousId: p.sousId,
        info,
      }))
    }),
  )
}
