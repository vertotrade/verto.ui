import { defaultChain } from '@verto/awgmi'
import { mainnet, testnet, Chain } from '@verto/awgmi/core'

export { defaultChain }

export const chains = [mainnet, testnet].filter(Boolean) as Chain[]
