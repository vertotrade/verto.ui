import { getNftsUpdatedMarketData } from 'state/nftMarket/helpers'

export interface LowestNftPrice {
  isFetching: boolean
  lowestPrice: number
}

export const getLowestUpdatedToken = async (collectionAddress: string, nftsMarketTokenIds: string[]) => {
  const updatedMarketData = await getNftsUpdatedMarketData(collectionAddress.toLowerCase(), nftsMarketTokenIds)

  if (!updatedMarketData) return null

  return updatedMarketData
    .filter(tokenUpdatedPrice => {
      return tokenUpdatedPrice && tokenUpdatedPrice.currentAskPrice.gt(0) && tokenUpdatedPrice.isTradable
    })
    .sort((askInfoA, askInfoB) => {
      return askInfoA.currentAskPrice.gt(askInfoB.currentAskPrice)
        ? 1
        : askInfoA.currentAskPrice.eq(askInfoB.currentAskPrice)
        ? 0
        : -1
    })[0]
}
