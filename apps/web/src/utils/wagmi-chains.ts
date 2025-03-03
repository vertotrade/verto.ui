export const rebus = {
  id: 1011,
  name: 'Rebus Mainnet',
  network: 'Rebus Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'REBUS',
    symbol: 'REBUS',
  },
  rpcUrls: {
    default: { http: ['https://apievm.rebuschain.com/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Rebus Mainnet', url: 'https://evm.rebuschain.com' },
  },
  testnet: false,
}

export const rebusTestnet = {
  id: 3033,
  name: 'Rebus Testnet',
  network: 'Rebus',
  nativeCurrency: {
    decimals: 18,
    name: 'REBUS',
    symbol: 'REBUS',
  },
  rpcUrls: {
    default: { http: ['https://testnet.rebus.money/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Rebus', url: 'https://evm.testnet.rebus.money' },
  },
  testnet: true,
}

export const rebusTestnetL2 = {
  id: 3034,
  name: 'Rebus Testnet L2',
  network: 'RebusL2',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://testnet.rebus.money/l2rpc'] },
  },
  blockExplorers: {
    default: { name: 'Rebus', url: 'https://evm-v2.rebuschain.com' },
  },
  testnet: true,
}

export const rebusL2 = {
  id: 9696,
  name: 'Rebus L2',
  network: 'RebusL2',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://apievml2.rebuschain.com/l2rpc'] },
  },
  blockExplorers: {
    default: { name: 'Rebus', url: 'https://evm.rebuschain.com' },
  },
  testnet: true,
}
