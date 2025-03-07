import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const bscProvider = new StaticJsonRpcProvider(
  {
    url: 'https://nodes.pancakeswap.com',
    skipFetchSetup: true,
  },
  56,
)

export const bscTestnetProvider = new StaticJsonRpcProvider(
  {
    url: 'https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5',
    skipFetchSetup: true,
  },
  97,
)

export const goerliProvider = new StaticJsonRpcProvider(
  {
    url: 'https://eth-goerli.nodereal.io/v1/8a4432e42df94dcca2814fde8aea2a2e',
    skipFetchSetup: true,
  },
  5,
)

export const rebusProvider = new StaticJsonRpcProvider(
  {
    url: 'https://api.vertotrade.com/rpc',
    skipFetchSetup: true,
  },
  1011,
)

export const rebusTestnetProvider = new StaticJsonRpcProvider(
  {
    url: 'https://testnet.rebus.money/rpc',
    skipFetchSetup: true,
  },
  3033,
)

export const rebusTestnetL2Provider = new StaticJsonRpcProvider(
  {
    url: 'https://testnet.rebus.money/l2rpc',
    skipFetchSetup: true,
  },
  3034,
)

export const rebusL2Provider = new StaticJsonRpcProvider(
  {
    url: 'https://apievml2.rebuschain.com/l2rpc',
    skipFetchSetup: true,
  },
  3034,
)