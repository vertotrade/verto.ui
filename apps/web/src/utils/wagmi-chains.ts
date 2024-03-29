export const rebus = {
  id: 1111,
  name: 'Rebus',
  network: 'Rebus',
  nativeCurrency: {
    decimals: 18,
    name: 'REBUS',
    symbol: 'REBUS',
  },
  rpcUrls: {
    default: { http: ['https://api.rebuschain.com/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Rebus', url: 'https://evm.rebuschain.com' },
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
    default: { name: 'Rebus', url: 'https://testnet.rebus.money:8040' },
  },
  testnet: true,
}
