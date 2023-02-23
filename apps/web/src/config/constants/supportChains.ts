import { ChainId } from '@verto/sdk'

export const SUPPORT_ONLY_BSC = [ChainId.BSC]
export const SUPPORT_FARMS = [
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.ETHEREUM,
  ChainId.GOERLI,
  ChainId.REBUS,
  ChainId.REBUS_TESTNET,
]

export const SUPPORT_ZAP = [ChainId.BSC, ChainId.BSC_TESTNET]

export const SUPPORT_REBUS = [ChainId.REBUS, ChainId.REBUS_TESTNET]
