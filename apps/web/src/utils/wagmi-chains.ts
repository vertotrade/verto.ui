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
