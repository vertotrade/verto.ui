import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@verto/sdk'
import { DEFAULT_CHAIN_ID } from 'config/chains'

// const REBUS_URL = DEFAULT_CHAIN_ID === ChainId.REBUS ? 'https://api.vertotrade.com/rpc' : 'https://testnet.rebus.money/rpc'

const REBUS_URL =
  DEFAULT_CHAIN_ID === ChainId.REBUS
    ? 'https://api.vertotrade.com/rpc'
    : DEFAULT_CHAIN_ID === ChainId.REBUS_L2
    ? 'https://apievml2.rebuschain.com/l2rpc'
    : DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET_L2
    ? 'https://testnet.rebus.money/l2rpc'
    : 'https://testnet.rebus.money/rpc'

export const REBUS_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || REBUS_URL

export const rebusRpcProvider = new StaticJsonRpcProvider(REBUS_NODE)

export default null
