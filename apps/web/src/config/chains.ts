import env from '@beam-australia/react-env'
import { ChainId } from '@verto/sdk'
import memoize from 'lodash/memoize'
import invert from 'lodash/invert'

export const CHAIN_QUERY_NAME = {
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.GOERLI]: 'goerli',
  [ChainId.BSC]: 'bsc',
  [ChainId.BSC_TESTNET]: 'bscTestnet',
  [ChainId.REBUS]: 'rebus',
  [ChainId.REBUS_TESTNET]: 'rebusTestnet',
  [ChainId.REBUS_TESTNET_L2]: 'rebusTestnetL2',
}

// xport const DEFAULT_CHAIN_ID = env('IS_MAINNET') === 'true' ? ChainId.REBUS : ChainId.REBUS_TESTNET

export const DEFAULT_CHAIN_ID = 
  env('IS_MAINNET') === 'true' 
    ? ChainId.REBUS 
    : env('IS_TESTNET_L2') === 'true' 
      ? ChainId.REBUS_TESTNET_L2 
      : ChainId.REBUS_TESTNET;



const CHAIN_QUERY_NAME_TO_ID = invert(CHAIN_QUERY_NAME)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName] ? +CHAIN_QUERY_NAME_TO_ID[chainName] : undefined
})
