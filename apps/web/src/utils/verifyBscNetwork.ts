import { ChainId } from '@verto/sdk'

export const verifyBscNetwork = (chainId: number) => {
  return chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET
}
