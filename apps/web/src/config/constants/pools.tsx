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
    version: 2,
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
    version: 2,
  },
]
  .filter(p => p.contractAddress[DEFAULT_CHAIN_ID] && p.stakingToken && p.earningToken)
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
