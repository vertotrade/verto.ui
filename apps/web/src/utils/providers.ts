import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@verto/sdk'
import { DEFAULT_CHAIN_ID } from 'config/chains'

const REBUS_URL =
  DEFAULT_CHAIN_ID === ChainId.REBUS ? 'https://api.rebuschain.com:8545' : 'https://testnet.rebus.money:48545'
export const REBUS_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || REBUS_URL

export const rebusRpcProvider = new StaticJsonRpcProvider(REBUS_NODE)

export default null
