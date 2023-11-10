import { stringify } from 'querystring'
import { API_NFTMARKET } from 'config/constants/endpoints'
import { multicallv2 } from 'utils/multicall'
import erc721Abi from 'config/abi/erc721.json'
import range from 'lodash/range'
import groupBy from 'lodash/groupBy'
import { BigNumber } from '@ethersproject/bignumber'
import { getNftMarketContract } from 'utils/contractHelpers'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import DELIST_COLLECTIONS from 'config/constants/nftsCollections/delist'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { formatBigNumber } from '@verto/utils/formatBalance'
import { getNftMarketAddress } from 'utils/addressHelpers'
import nftMarketAbi from 'config/abi/nftMarket.json'
import fromPairs from 'lodash/fromPairs'
import pickBy from 'lodash/pickBy'
import lodashSize from 'lodash/size'
import axios from 'axios'
import { defaultVertoTokens } from 'utils'
import {
  ApiCollection,
  ApiCollections,
  ApiResponseCollectionTokens,
  ApiResponseSpecificToken,
  Collection,
  NftLocation,
  NftToken,
  TokenIdWithCollectionAddress,
  TokenMarketData,
  ApiSingleTokenData,
  NftAttribute,
  ApiTokenFilterResponse,
  ApiCollectionsResponse,
} from './types'

/**
 * API HELPERS
 */

/**
 * Fetch data from all collections using the API
 * @returns
 */
export const getCollectionsApi = async (): Promise<ApiCollectionsResponse> => {
  const res = await fetch(`${API_NFTMARKET}/collections`)
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollections = async (): Promise<Record<string, Collection>> => {
  try {
    const collections = await getCollectionsApi()
    const collectionApiData: ApiCollection[] = collections?.data ?? []

    return combineCollectionData(collectionApiData)
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return null
  }
}

/**
 * Fetch collection data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollection = async (collectionAddress: string): Promise<Record<string, Collection> | null> => {
  try {
    const collection = await getCollectionApi(collectionAddress)

    return combineCollectionData([collection])
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return null
  }
}

/**
 * Fetch static data from a collection using the API
 * @returns
 */
export const getCollectionApi = async (collectionAddress: string): Promise<ApiCollection> => {
  const res = await fetch(`${API_NFTMARKET}/collection/${collectionAddress}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  console.error(`API: Failed to fetch NFT collection ${collectionAddress}`, res.statusText)
  return null
}

/**
 * Fetch static data for all nfts in a collection using the API
 * @param collectionAddress
 * @param size
 * @param page
 * @returns
 */
export const getNftsFromCollectionApi = async (collectionAddress: string): Promise<ApiResponseCollectionTokens> => {
  const requestPath = `${API_NFTMARKET}/tokens/${collectionAddress}`

  try {
    const res = await fetch(requestPath)
    if (res.ok) {
      const data = await res.json()
      const filteredAttributesDistribution = pickBy(data.attributesDistribution, Boolean)
      const filteredData = pickBy(data.data, Boolean)
      const filteredTotal = lodashSize(filteredData)
      return {
        ...data,
        total: filteredTotal,
        attributesDistribution: filteredAttributesDistribution,
        data: filteredData,
      }
    }
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, res.statusText)
    return null
  } catch (error) {
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, error)
    return null
  }
}

/**
 * Fetch a single NFT using the API
 * @param collectionAddress
 * @param tokenId
 * @returns NFT from API
 */
export const getNftApi = async (
  collectionAddress: string,
  tokenId: string,
): Promise<ApiResponseSpecificToken['data']> => {
  const res = await fetch(`${API_NFTMARKET}/tokens/${collectionAddress}/${tokenId}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }

  console.error(`API: Can't fetch NFT token ${tokenId} in ${collectionAddress}`, res.status)
  return null
}

/**
 * Fetch a list of NFT from different collections
 * @param from Array of { collectionAddress: string; tokenId: string }
 * @returns Array of NFT from API
 */
export const getNftsFromDifferentCollectionsApi = async (
  from: { collectionAddress: string; tokenId: string }[],
): Promise<NftToken[]> => {
  const promises = from.map(nft => getNftApi(nft.collectionAddress, nft.tokenId))
  const responses = await Promise.all(promises)
  // Sometimes API can't find some tokens (e.g. 404 response)
  // at least return the ones that returned successfully
  return responses
    .filter(resp => resp)
    .map((res, index) => ({
      tokenId: res.tokenId,
      name: res.name,
      collectionName: res.collection.name,
      collectionAddress: from[index].collectionAddress,
      description: res.description,
      attributes: res.attributes,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      image: res.image,
    }))
}

/**
 * Fetch nfts for collection
 * @param collectionAddress - collection address
 * @returns
 */
export const getNftsForCollection = async (collectionAddress: string): Promise<TokenMarketData[]> => {
  try {
    const { data } = await axios.get(`${API_NFTMARKET}/tokens/${collectionAddress}`)
    return data.collection.nfts
  } catch (error) {
    console.error(`Failed to fetch NFTs by a collection address`, error)
    return []
  }
}

export const getNftsOnChainMarketData = async (
  collectionAddress: string,
  tokenIds: string[],
): Promise<TokenMarketData[]> => {
  try {
    const nftMarketContract = getNftMarketContract()
    const response = await nftMarketContract.viewAsksByCollectionAndTokenIds(collectionAddress.toLowerCase(), tokenIds)
    const askInfo = response?.askInfo

    if (!askInfo) return []

    return askInfo
      .map((tokenAskInfo, index) => {
        if (tokenAskInfo.currency === NOT_ON_SALE_SELLER || !tokenAskInfo.seller || !tokenAskInfo.price) return null
        const currentSeller = tokenAskInfo.seller
        const isTradable = currentSeller.toLowerCase() !== NOT_ON_SALE_SELLER
        const token = Object.values(defaultVertoTokens).find(x => x.address === tokenAskInfo.currency)
        const currentAskPrice =
          tokenAskInfo.price && formatBigNumber(tokenAskInfo.price, token?.decimals, token?.decimals)

        return {
          collection: { id: collectionAddress.toLowerCase() },
          tokenId: tokenIds[index],
          currentSeller,
          isTradable,
          currentAskPrice,
          currency: tokenAskInfo.currency,
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error('Failed to fetch NFTs onchain market data', error)
    return []
  }
}

export const getNftsUpdatedMarketData = async (
  collectionAddress: string,
  tokenIds: string[],
): Promise<{ tokenId: string; currentSeller: string; currentAskPrice: BigNumber; isTradable: boolean }[]> => {
  try {
    const nftMarketContract = getNftMarketContract()
    const response = await nftMarketContract.viewAsksByCollectionAndTokenIds(collectionAddress.toLowerCase(), tokenIds)
    const askInfo = response?.askInfo

    if (!askInfo) return null

    return askInfo.map((tokenAskInfo, index) => {
      const isTradable = tokenAskInfo.seller ? tokenAskInfo.seller.toLowerCase() !== NOT_ON_SALE_SELLER : false

      return {
        tokenId: tokenIds[index],
        currentSeller: tokenAskInfo.seller,
        isTradable,
        currentAskPrice: tokenAskInfo.price,
      }
    })
  } catch (error) {
    console.error('Failed to fetch updated NFT market data', error)
    return null
  }
}

export const getAccountNftsOnChainMarketData = async (
  collections: ApiCollections,
  account: string,
): Promise<TokenMarketData[]> => {
  try {
    const nftMarketAddress = getNftMarketAddress()
    const collectionList = Object.values(collections)
    const askCalls = collectionList.map(collection => {
      const { address: collectionAddress } = collection
      return {
        address: nftMarketAddress,
        name: 'viewAsksByCollectionAndSeller',
        params: [collectionAddress, account, 0, 1000],
      }
    })

    const askCallsResultsRaw = await multicallv2({
      abi: nftMarketAbi,
      calls: askCalls,
      options: { requireSuccess: false },
    })
    const askCallsResults = askCallsResultsRaw
      .map((askCallsResultRaw, askCallIndex) => {
        if (!askCallsResultRaw?.tokenIds || !askCallsResultRaw?.askInfo || !collectionList[askCallIndex]?.address)
          return null
        return askCallsResultRaw.tokenIds
          .map((tokenId, tokenIdIndex) => {
            if (!tokenId || !askCallsResultRaw.askInfo[tokenIdIndex] || !askCallsResultRaw.askInfo[tokenIdIndex].price)
              return null

            const token = Object.values(defaultVertoTokens).find(
              x => x.address === askCallsResultRaw.askInfo[tokenIdIndex].currency,
            )
            const currentAskPrice = formatBigNumber(
              askCallsResultRaw.askInfo[tokenIdIndex].price,
              token?.decimals,
              token?.decimals,
            )

            return {
              collection: { id: collectionList[askCallIndex].address.toLowerCase() },
              tokenId: tokenId.toString(),
              account,
              isTradable: true,
              currentAskPrice,
            }
          })
          .filter(Boolean)
      })
      .flat()
      .filter(Boolean)

    return askCallsResults
  } catch (error) {
    console.error('Failed to fetch NFTs onchain market data', error)
    return []
  }
}

/**
 * Filter NFTs from a collection
 * @param collectionAddress
 * @returns
 */
export const fetchNftsFiltered = async (
  collectionAddress: string,
  filters: Record<string, string | number>,
): Promise<ApiTokenFilterResponse> => {
  const res = await fetch(`${API_NFTMARKET}/tokens/filtered/${collectionAddress}?${stringify(filters)}`)

  if (res.ok) {
    const data = await res.json()
    return data
  }

  console.error(`API: Failed to fetch NFT collection ${collectionAddress}`, res.statusText)
  return null
}

/**
 * OTHER HELPERS
 */

export const getMetadataWithFallback = (apiMetadata: ApiResponseCollectionTokens['data'], bunnyId: string) => {
  // The fallback is just for the testnet where some bunnies don't exist
  return (
    apiMetadata[bunnyId] ?? {
      name: '',
      description: '',
      collection: { name: 'Pancake Bunnies' },
      image: {
        original: '',
        thumbnail: '',
      },
    }
  )
}

export const getPancakeBunniesAttributesField = (bunnyId: string) => {
  // Generating attributes field that is not returned by API
  // but can be "faked" since objects are keyed with bunny id
  return [
    {
      traitType: 'bunnyId',
      value: bunnyId,
      displayType: null,
    },
  ]
}

export const combineApiAndSgResponseToNftToken = (
  apiMetadata: ApiSingleTokenData,
  marketData: TokenMarketData,
  attributes: NftAttribute[],
) => {
  return {
    tokenId: marketData.tokenId,
    name: apiMetadata.name,
    description: apiMetadata.description,
    collectionName: apiMetadata.collection.name,
    collectionAddress: pancakeBunniesAddress,
    image: apiMetadata.image,
    marketData,
    attributes,
  }
}

export const fetchWalletTokenIdsForCollections = async (
  account: string,
  collections: ApiCollections,
): Promise<TokenIdWithCollectionAddress[]> => {
  const balanceOfCalls = Object.values(collections).map(collection => {
    const { address: collectionAddress } = collection
    return {
      address: collectionAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const balanceOfCallsResultRaw = await multicallv2({
    abi: erc721Abi,
    calls: balanceOfCalls,
    options: { requireSuccess: false },
  })
  const balanceOfCallsResult = balanceOfCallsResultRaw.flat()

  const tokenIdCalls = Object.values(collections)
    .map((collection, index) => {
      const balanceOf = balanceOfCallsResult[index]?.toNumber() ?? 0
      const { address: collectionAddress } = collection

      return range(balanceOf).map(tokenIndex => {
        return {
          address: collectionAddress,
          name: 'tokenOfOwnerByIndex',
          params: [account, tokenIndex],
        }
      })
    })
    .flat()

  const tokenIdResultRaw = await multicallv2({
    abi: erc721Abi,
    calls: tokenIdCalls,
    options: { requireSuccess: false },
  })
  const tokenIdResult = tokenIdResultRaw.flat()

  const nftLocation = NftLocation.WALLET

  const walletNfts = tokenIdResult.reduce((acc, tokenIdBn, index) => {
    if (tokenIdBn) {
      const { address: collectionAddress } = tokenIdCalls[index]
      acc.push({ tokenId: tokenIdBn.toString(), collectionAddress, nftLocation })
    }
    return acc
  }, [])

  return walletNfts
}

/**
 * Helper to combine data from the collections' API and subgraph
 */
export const combineCollectionData = (collectionApiData: ApiCollection[]): Record<string, Collection> => {
  return fromPairs(
    collectionApiData
      .filter(collection => collection?.address)
      .map(current => {
        return [current.address, current as any]
      }),
  )
}

/**
 * Evaluate whether a market NFT is in a users wallet, their profile picture, or on sale
 * @param tokenId string
 * @param tokenIdsInWallet array of tokenIds in wallet
 * @param tokenIdsForSale array of tokenIds on sale
 * @param profileNftId Optional tokenId of users' profile picture
 * @returns NftLocation enum value
 */
export const getNftLocationForMarketNft = (
  tokenId: string,
  tokenIdsInWallet: string[],
  tokenIdsForSale: string[],
  profileNftId?: string,
): NftLocation => {
  if (tokenId === profileNftId) {
    return NftLocation.PROFILE
  }
  if (tokenIdsForSale.includes(tokenId)) {
    return NftLocation.FORSALE
  }
  if (tokenIdsInWallet.includes(tokenId)) {
    return NftLocation.WALLET
  }
  console.error(`Cannot determine location for tokenID ${tokenId}, defaulting to NftLocation.WALLET`)
  return NftLocation.WALLET
}

/**
 * Construct complete TokenMarketData entities with a users' wallet NFT ids and market data for their wallet NFTs
 * @param walletNfts TokenIdWithCollectionAddress
 * @param marketDataForWalletNfts TokenMarketData[]
 * @returns TokenMarketData[]
 */
export const attachMarketDataToWalletNfts = (
  walletNfts: TokenIdWithCollectionAddress[],
  marketDataForWalletNfts: TokenMarketData[],
): TokenMarketData[] => {
  const walletNftsWithMarketData = walletNfts.map(walletNft => {
    const marketData = marketDataForWalletNfts.find(
      marketNft =>
        marketNft.tokenId === walletNft.tokenId &&
        marketNft.collection.id.toLowerCase() === walletNft.collectionAddress.toLowerCase(),
    )
    return (
      marketData ?? {
        tokenId: walletNft.tokenId,
        collection: {
          id: walletNft.collectionAddress.toLowerCase(),
        },
        nftLocation: walletNft.nftLocation,
        metadataUrl: null,
        transactionHistory: null,
        currentSeller: null,
        isTradable: null,
        currentAskPrice: null,
        latestTradedPriceInBNB: null,
        tradeVolumeBNB: null,
        totalTrades: null,
        otherId: null,
        currency: null,
      }
    )
  })
  return walletNftsWithMarketData
}

/**
 * Attach TokenMarketData and location to NftToken
 * @param nftsWithMetadata NftToken[] with API metadata
 * @param nftsForSale  market data for nfts that are on sale (i.e. not in a user's wallet)
 * @param walletNfts market data for nfts in a user's wallet
 * @param tokenIdsInWallet array of token ids in user's wallet
 * @param tokenIdsForSale array of token ids of nfts that are on sale
 * @param profileNftId profile picture token id
 * @returns NFT[]
 */
export const combineNftMarketAndMetadata = (
  nftsWithMetadata: NftToken[],
  nftsForSale: TokenMarketData[],
  walletNfts: TokenMarketData[],
  tokenIdsInWallet: string[],
  tokenIdsForSale: string[],
  profileNftId?: string,
): NftToken[] => {
  const completeNftData = nftsWithMetadata.map<NftToken>(nft => {
    // Get metadata object
    let marketData = nftsForSale.find(
      forSaleNft =>
        forSaleNft.tokenId === nft.tokenId &&
        forSaleNft.collection &&
        forSaleNft.collection.id === nft.collectionAddress,
    )
    if (!marketData) {
      marketData = walletNfts.find(
        marketNft =>
          marketNft.collection &&
          marketNft.collection.id === nft.collectionAddress &&
          marketNft.tokenId === nft.tokenId,
      )
    }
    const location = getNftLocationForMarketNft(nft.tokenId, tokenIdsInWallet, tokenIdsForSale, profileNftId)
    return { ...nft, marketData, location }
  })
  return completeNftData
}

const fetchWalletMarketData = async (walletNftsByCollection: {
  [collectionAddress: string]: TokenIdWithCollectionAddress[]
}): Promise<TokenMarketData[]> => {
  const walletMarketDataRequests = Object.entries(walletNftsByCollection).map(
    async ([collectionAddress, tokenIdsWithCollectionAddress]) => {
      const tokenIdIn = tokenIdsWithCollectionAddress.map(walletNft => walletNft.tokenId)
      const nftsOnChainMarketData = await getNftsOnChainMarketData(collectionAddress.toLowerCase(), tokenIdIn)

      return tokenIdIn
        .map(tokenId => {
          const onChainMarketData = nftsOnChainMarketData.find(
            onChainTokenMarketData => onChainTokenMarketData.tokenId === tokenId,
          )

          if (!onChainMarketData) return null

          return { ...onChainMarketData }
        })
        .filter(Boolean)
    },
  )

  const walletMarketDataResponses = await Promise.all(walletMarketDataRequests)
  return walletMarketDataResponses.flat()
}

/**
 * Get in-wallet, on-sale & profile pic NFT metadata, complete with market data for a given account
 * @param account
 * @param collections
 * @param profileNftWithCollectionAddress
 * @returns Promise<NftToken[]>
 */
export const getCompleteAccountNftData = async (
  account: string,
  collections: ApiCollections,
  profileNftWithCollectionAddress?: TokenIdWithCollectionAddress,
): Promise<NftToken[]> => {
  // Add delist collections to allow user reclaim their NFTs
  const collectionsWithDelist = { ...collections, ...DELIST_COLLECTIONS }

  const [walletNftIdsWithCollectionAddress, onChainForSaleNfts] = await Promise.all([
    fetchWalletTokenIdsForCollections(account, collectionsWithDelist),
    getAccountNftsOnChainMarketData(collectionsWithDelist, account),
  ])

  if (profileNftWithCollectionAddress?.tokenId) {
    walletNftIdsWithCollectionAddress.unshift(profileNftWithCollectionAddress)
  }

  const walletNftsByCollection = groupBy(
    walletNftIdsWithCollectionAddress,
    walletNftId => walletNftId.collectionAddress,
  )

  const walletMarketData = await fetchWalletMarketData(walletNftsByCollection)

  const walletNftsWithMarketData = attachMarketDataToWalletNfts(walletNftIdsWithCollectionAddress, walletMarketData)

  const walletTokenIds = walletNftIdsWithCollectionAddress
    .filter(walletNft => {
      // Profile Pic NFT is no longer wanted in this array, hence the filter
      return profileNftWithCollectionAddress?.tokenId !== walletNft.tokenId
    })
    .map(nft => nft.tokenId)

  const tokenIdsForSale = onChainForSaleNfts.map(nft => nft.tokenId)

  const forSaleNftIds = onChainForSaleNfts.map(nft => {
    return { collectionAddress: nft.collection.id, tokenId: nft.tokenId }
  })

  const metadataForAllNfts = await getNftsFromDifferentCollectionsApi([
    ...forSaleNftIds,
    ...walletNftIdsWithCollectionAddress,
  ])

  const completeNftData = combineNftMarketAndMetadata(
    metadataForAllNfts,
    onChainForSaleNfts,
    walletNftsWithMarketData,
    walletTokenIds,
    tokenIdsForSale,
    profileNftWithCollectionAddress?.tokenId,
  )

  return completeNftData
}

/**
 * Fetch distribution information for a collection
 * @returns
 */
export const getCollectionDistributionApi = async <T>(collectionAddress: string): Promise<T> => {
  const res = await fetch(`${API_NFTMARKET}/attributes/distribution/${collectionAddress}`)
  if (res.ok) {
    const data = await res.json()
    return data
  }
  console.error(`API: Failed to fetch NFT collection ${collectionAddress} distribution`, res.statusText)
  return null
}
