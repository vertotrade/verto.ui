import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const REBUS_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://api.rebuschain.com:8545'

export const bscRpcProvider = new StaticJsonRpcProvider(REBUS_PROD_NODE)

export default null
