import { BASE_URL } from 'config'

export const PANCAKE_EXTENDED = `${BASE_URL}/pancakeswap-extended.json`
export const COINGECKO = `${BASE_URL}/coingecko.json`
export const COINGECKO_ETH = 'https://tokens.coingecko.com/uniswap/all.json'
export const CMC = `${BASE_URL}/cmc.json`

export const ETH_URLS = [COINGECKO_ETH]
export const BSC_URLS = [PANCAKE_EXTENDED, CMC, COINGECKO]

// List of official tokens list
export const OFFICIAL_LISTS = [PANCAKE_EXTENDED]

export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...BSC_URLS,
  ...ETH_URLS,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
  ...WARNING_LIST_URLS,
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [PANCAKE_EXTENDED, COINGECKO_ETH]
