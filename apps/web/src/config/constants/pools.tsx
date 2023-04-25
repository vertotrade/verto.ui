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
      [ChainId.REBUS_TESTNET]: '0x32a2D7abf94d2C5fcBDA3DC4EBcb8Fc3e524c71c',
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
      [ChainId.REBUS_TESTNET]: '0x2201754426b71B8a1a760c12a1AA1b3FA56a620C',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },
  {
    sousId: 309,
    stakingToken: tokens.wrebus,
    earningToken: (tokens as any).ludus,
    contractAddress: {
      [ChainId.REBUS]: '0x7C5F263Be7C17Ad8967e904E14F323c02a14430F',
      [ChainId.REBUS_TESTNET]: '0x7C5F263Be7C17Ad8967e904E14F323c02a14430F',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
  },
  // {
  //   sousId: 310,
  //   stakingToken: tokens.wrebus,
  //   earningToken: (tokens as any).dummy,
  //   contractAddress: {
  //     [ChainId.REBUS]: '0x6e9f725b745Af16558112cC1452F22817a4d13C9',
  //     [ChainId.REBUS_TESTNET]: '',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   tokenPerBlock: '10',
  //   isFinished: false,
  // },
]
  .filter(p => p.stakingToken && p.earningToken)
  .map(p => ({
    ...p,
    stakingToken: p.stakingToken.serialize,
    earningToken: p.earningToken.serialize,
  }))

// known finished pools
const finishedPools = [].map(p => ({
  ...p,
  isFinished: true,
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

export default [...livePools, ...finishedPools] as Pool.SerializedPoolConfig<SerializedWrappedToken>[]
