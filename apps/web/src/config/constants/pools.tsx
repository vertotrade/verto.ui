import { BigNumber } from '@ethersproject/bignumber'
import { Pool } from '@verto/uikit'
import { SerializedWrappedToken } from '@verto/token-lists'
// import Trans from 'components/Trans'
// import { VaultKey } from 'state/types'
import { vertoTokens, vertoTokensTestnet } from '@verto/tokens'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import { ChainId } from '@verto/sdk'
import { PoolCategory } from './types'

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = BigNumber.from('20000000000000')
export const DURATION_FACTOR = BigNumber.from('31536000')

const tokens = DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET ? vertoTokensTestnet : vertoTokens

export const vaultPoolConfig = {
  // [VaultKey.RebusVault]: {
  //   name: <Trans>Stake WRebus</Trans>,
  //   description: <Trans>Stake, Earn Ludus!</Trans>,
  //   autoCompoundFrequency: 5000,
  //   gasLimit: 600000,
  //   tokenImage: {
  //     primarySrc: `/images/tokens/${tokens.wrebus.address}.png`,
  //     secondarySrc: `/images/tokens/${tokens.ludus.address}.png`,
  //   },
  // },
} as const

export const livePools: Pool.SerializedPoolConfig<SerializedWrappedToken>[] = [
  {
    sousId: 307,
    stakingToken: tokens.wrebus,
    earningToken: tokens.verto,
    contractAddress: {
      [ChainId.REBUS]: '0x4b895F260A2F8c95cb08c17084fC064a8fcEF1A7',
      [ChainId.REBUS_TESTNET]: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },
  {
    sousId: 308,
    stakingToken: tokens.verto,
    earningToken: tokens.aureus,
    contractAddress: {
      [ChainId.REBUS]: '0xae73f9fC95789156E0F87ba7706552c7b4F647Fb',
      [ChainId.REBUS_TESTNET]: '0x1FE0bda73D56f7fC45B30362D93304db08878d17',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },
  {
    sousId: 309,
    stakingToken: tokens.verto,
    earningToken: tokens.ludus,
    contractAddress: {
      [ChainId.REBUS]: '0xe8ABD9f20AAa9A4f3bE7Cbbea52ACb1b6cBC4444',
      [ChainId.REBUS_TESTNET]: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },

  {
    sousId: 310,
    stakingToken: tokens.wrebus,
    earningToken: tokens.verto,
    contractAddress: {
      [ChainId.REBUS]: '',
      [ChainId.REBUS_TESTNET]: '0x98C9FBA188cdf85563D3B16810979FE474368B03',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },
  {
    sousId: 311,
    stakingToken: tokens.wrebus,
    earningToken: tokens.verto,
    contractAddress: {
      [ChainId.REBUS]: '',
      [ChainId.REBUS_TESTNET]: '0x00CC4012165841412a4e0D06d213b8ab9a83F925',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },
  {
    sousId: 312,
    stakingToken: tokens.wrebus,
    earningToken: tokens.xverto,
    contractAddress: {
      [ChainId.REBUS]: '0x87c42Bf8fDAf021174463cF2782ecb252308fE82',
      [ChainId.REBUS_TESTNET]: '0xd4e4097C091f3205fA6fFEae875216B780d5f31D',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
    hasBoostBlockStart: true,
    hasMinPerUser: true,
  },
  {
    sousId: 313,
    stakingToken: tokens.xverto,
    earningToken: tokens.verto,
    contractAddress: {
      [ChainId.REBUS]: '0xcc476f414e04a754136bf92766d20cdf774c0ed1',
      [ChainId.REBUS_TESTNET]: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
    canShowAfterBlock: 6975761,
  },
  {
    sousId: 314,
    stakingToken: tokens.xverto,
    earningToken: tokens.verto,
    contractAddress: {
      [ChainId.REBUS]: '0x48E706afa2C6BfB7E5457f2710bDffB9967D8614',
      [ChainId.REBUS_TESTNET]: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
    hasBoostBlockStart: true,
  },
  {
    sousId: 315,
    stakingToken: tokens.xverto,
    earningToken: tokens.verto,
    contractAddress: {
      [ChainId.REBUS]: '0xA063cB8D5497150eF640701BE2e1A9974e33f732',
      [ChainId.REBUS_TESTNET]: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
    hasBoostBlockStart: true,
  },

  {
    sousId: 316,
    stakingToken: tokens.verto,
    earningToken: vertoTokens.techne,
    contractAddress: {
      [ChainId.REBUS]: '0x39Fd397acB214ec7C6DaA15Ad1D40b05987A9050',
      [ChainId.REBUS_TESTNET]: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },

  {
    sousId: 317,
    stakingToken: tokens.wrebus,
    earningToken: tokens.verto,
    contractAddress: {
      [ChainId.REBUS]: '',
      [ChainId.REBUS_TESTNET]: '0xA6b258783CD3ddd9538aEB78D21C35831C077891',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },

  {
    sousId: 318,
    stakingToken: tokens.xverto,
    earningToken: vertoTokens.techne,
    contractAddress: {
      [ChainId.REBUS]: '0x7a34F1865ACAF55332cdf7D8338Ccc4569370a91',
      [ChainId.REBUS_TESTNET]: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
    hasBoostBlockStart: true,
  },

  {
    sousId: 319,
    stakingToken: tokens.wrebus,
    earningToken: tokens.verto,
    liquidToken: vertoTokens.lqwrebus,
    contractAddress: {
      [ChainId.REBUS]: '0x3B41cCa347A27FCC507B15a4Ca031EA8e760a0e9',
      [ChainId.REBUS_TESTNET]: '0x3FC9325B3cB81d3e71bb52bBa2d7BF906f904287',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
    isLiquid: true,
  },

  {
    sousId: 320,
    stakingToken: tokens.verto,
    earningToken: tokens.aureus,
    liquidToken: vertoTokens.lqverto,
    contractAddress: {
      [ChainId.REBUS]: '0x66fDddd3780a8001905e51Ac1B13C1E4e9f8b50e',
      [ChainId.REBUS_TESTNET]: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
    isLiquid: true,
  },

  {
    sousId: 321,
    stakingToken: tokens.verto,
    earningToken: tokens.ludus,
    liquidToken: vertoTokens.lqverto,
    contractAddress: {
      [ChainId.REBUS]: '0xaaD8a0810adA077ED84CD539fA28f0eAFF059851',
      [ChainId.REBUS_TESTNET]: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
    isLiquid: true,
  },
]
  .filter(p => p.contractAddress[DEFAULT_CHAIN_ID] && p.stakingToken && p.earningToken)
  .map(p => ({
    ...p,
    stakingToken: p.stakingToken.serialize,
    earningToken: p.earningToken.serialize,
    liquidToken: p.liquidToken?.serialize,
  }))

// known finished pools
const finishedPools = [].map(p => ({
  ...p,
  isFinished: true,
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
  liquidToken: p.liquidToken?.serialize,
}))

export default [...livePools, ...finishedPools] as Pool.SerializedPoolConfig<SerializedWrappedToken>[]
