import { BinanceWalletConnector } from '@verto/wagmi/connectors/binanceWallet'
import { BloctoConnector } from '@verto/wagmi/connectors/blocto'
import { ChainId } from '@verto/sdk'
import { mainnet } from 'wagmi/chains'
import { configureChains, createClient } from 'wagmi'
import memoize from 'lodash/memoize'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import { SafeConnector } from './safeConnector'
import { rebus, rebusTestnet } from './wagmi-chains'

const CHAINS = [mainnet, rebus, rebusTestnet]

const getNodeRealUrl = (networkName: string) => {
  switch (networkName) {
    case 'Rebus':
      if (DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET) {
        return {
          http: 'https://testnet.rebus.money/rpc',
        }
      }

      return {
        http: 'https://api.vertotrade.com/rpc',
        webSocket: 'wss://api.vertotrade.com/ws',
      }
    default:
      return null
  }
}

export const { provider, chains, webSocketProvider } = configureChains(CHAINS, [
  jsonRpcProvider({
    rpc: chain => {
      if (!!process.env.NEXT_PUBLIC_NODE_PRODUCTION && chain.id === rebus.id) {
        return { http: process.env.NEXT_PUBLIC_NODE_PRODUCTION }
      }
      if (process.env.NODE_ENV === 'test' && chain.id === mainnet.id) {
        return { http: 'https://cloudflare-eth.com' }
      }

      return getNodeRealUrl(chain.network) || { http: chain.rpcUrls.default.http[0] }
    },
    stallTimeout: 1000,
  }),
])

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'VertoTrade',
    appLogoUrl: 'https://vertotrade.com/logo.png',
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
})

export const walletConnectNoQrCodeConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: false,
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

const bloctoConnector = new BloctoConnector({
  chains,
  options: {
    defaultChainId: DEFAULT_CHAIN_ID,
  },
})

const ledgerConnector = new LedgerConnector({
  chains,
})

export const bscConnector = new BinanceWalletConnector({ chains })

export const client = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
  connectors: [
    new SafeConnector({ chains }),
    metaMaskConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    bscConnector,
    bloctoConnector,
    ledgerConnector,
  ],
})

// export const CHAIN_IDS = chains.map(c => c.id)
export const CHAIN_IDS = [rebus.id, rebusTestnet.id]

export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId))
export const isChainTestnet = memoize((chainId: number) => chains.find(c => c.id === chainId)?.testnet)
