import { ChainId, Token, WBNB, WNATIVE } from '@verto/sdk'
import { bscTokens, bscTestnetTokens, BUSD, USDC, USDT, vertoTokens, vertoTokensTestnet, vertoTokensTestnetL2, vertoTokensL2 } from '@verto/tokens'

import { ChainMap, ChainTokenList } from '../types'

export const ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0x3BC722f252C7bAE2f55647e49aDcB9d33Ff6eBcC',
  [ChainId.GOERLI]: '0x3BC722f252C7bAE2f55647e49aDcB9d33Ff6eBcC',
  [ChainId.BSC]: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  [ChainId.BSC_TESTNET]: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  [ChainId.REBUS]: '0xAa1D16A14832538b13Cd20DD848ec1E27cF1e02B',
  [ChainId.REBUS_TESTNET]: '0xd48B044c1c24D6dDc8ffEE15b0036952FDF00D2a',
  [ChainId.REBUS_TESTNET_L2]: '0x96df773857013AF68459AB3bf019f099089C3a4A',
  [ChainId.REBUS_L2]: '0x9C2A43b674B01d8Be55004C7b01f4c88529CAF10',
}

export const STABLE_SWAP_INFO_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '',
  [ChainId.GOERLI]: '',
  [ChainId.BSC]: '0xa680d27f63Fa5E213C502d1B3Ca1EB6a3C1b31D6',
  [ChainId.BSC_TESTNET]: '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546',
  [ChainId.REBUS]: '',
  [ChainId.REBUS_TESTNET]: '',
  [ChainId.REBUS_TESTNET_L2]: '',
  [ChainId.REBUS_L2]: '',
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    WNATIVE[ChainId.ETHEREUM],
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    BUSD[ChainId.ETHEREUM],
    WBNB[ChainId.ETHEREUM],
  ],
  [ChainId.GOERLI]: [WNATIVE[ChainId.GOERLI], USDC[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [
    bscTokens.wbnb,
    bscTokens.cake,
    bscTokens.busd,
    bscTokens.usdt,
    bscTokens.btcb,
    bscTokens.eth,
    bscTokens.usdc,
  ],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
  [ChainId.REBUS]: [
    vertoTokens.wrebus,
    vertoTokens.ludus,
    vertoTokens.axlusdc,
    vertoTokens.axlwbtc,
    vertoTokens.axlweth,
  ],
  [ChainId.REBUS_TESTNET]: [vertoTokensTestnet.wrebus, vertoTokensTestnet.ludus],
  [ChainId.REBUS_TESTNET_L2]: [
    vertoTokensTestnetL2.rebus,
    vertoTokensTestnetL2.lqwrebus,
    vertoTokensTestnetL2.verto,
    vertoTokensTestnetL2.weth,
    WNATIVE[ChainId.REBUS_TESTNET_L2],
  ],
  [ChainId.REBUS_L2]: [
    vertoTokensL2.rebus,
    vertoTokensL2.lqwrebus,
    vertoTokensL2.verto,
    vertoTokensL2.weth,
    WNATIVE[ChainId.REBUS_L2],
  ],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.BSC]: {
    // SNFTS-SFUND
    [bscTokens.snfts.address]: [bscTokens.sfund],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.BSC]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], WBNB[ChainId.ETHEREUM], BUSD[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  [ChainId.GOERLI]: [USDC[ChainId.GOERLI], WNATIVE[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [bscTokens.busd, bscTokens.cake, bscTokens.btcb],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
  [ChainId.REBUS]: [
    vertoTokens.wrebus,
    vertoTokens.ludus,
    vertoTokens.axlusdc,
    vertoTokens.axlwbtc,
    vertoTokens.axlweth,
  ],
  [ChainId.REBUS_TESTNET]: [vertoTokensTestnet.wrebus, vertoTokensTestnet.ludus],
  [ChainId.REBUS_TESTNET_L2]: [
    vertoTokensTestnetL2.rebus,
    vertoTokensTestnetL2.lqwrebus,
    vertoTokensTestnetL2.verto,
    vertoTokensTestnetL2.weth,
    WNATIVE[ChainId.REBUS_TESTNET_L2],
  ],
  [ChainId.REBUS_L2]: [
    vertoTokensL2.rebus,
    vertoTokensL2.lqwrebus,
    vertoTokensL2.verto,
    vertoTokensL2.weth,
    WNATIVE[ChainId.REBUS_L2],
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    USDC[ChainId.ETHEREUM],
    WNATIVE[ChainId.ETHEREUM],
    BUSD[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    WBNB[ChainId.ETHEREUM],
  ],
  [ChainId.GOERLI]: [USDC[ChainId.GOERLI], WNATIVE[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [bscTokens.wbnb, bscTokens.dai, bscTokens.busd, bscTokens.usdt, bscTokens.cake],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
  [ChainId.REBUS]: [
    vertoTokens.wrebus,
    vertoTokens.ludus,
    vertoTokens.axlusdc,
    vertoTokens.axlwbtc,
    vertoTokens.axlweth,
  ],
  [ChainId.REBUS_TESTNET]: [vertoTokensTestnet.wrebus, vertoTokensTestnet.ludus],
  [ChainId.REBUS_TESTNET_L2]: [
    vertoTokensTestnetL2.rebus,
    vertoTokensTestnetL2.lqwrebus,
    vertoTokensTestnetL2.verto,
    vertoTokensTestnetL2.weth,
    WNATIVE[ChainId.REBUS_TESTNET_L2],
  ],
  [ChainId.REBUS_L2]: [
    vertoTokensL2.rebus,
    vertoTokensL2.lqwrebus,
    vertoTokensL2.verto,
    vertoTokensL2.weth,
    WNATIVE[ChainId.REBUS_L2],
  ],
}

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][]
} = {
  [ChainId.ETHEREUM]: [
    [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
    [WBNB[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
    [WBNB[ChainId.ETHEREUM], BUSD[ChainId.ETHEREUM]],
    [WBNB[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
    [WBNB[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM]],
  ],
  [ChainId.BSC]: [
    [bscTokens.cake, bscTokens.wbnb],
    [bscTokens.busd, bscTokens.usdt],
    [bscTokens.dai, bscTokens.usdt],
  ],
}
