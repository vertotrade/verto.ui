import { useEffect, useState, useRef, useMemo } from 'react'
import { NftAttribute, NftToken, Collection } from 'state/nftMarket/types'
import { useGetNftFilters, useGetNftOrdering, useGetNftShowOnlyOnSale, useGetCollection } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import { fetchNftsFiltered, getNftsFromCollectionApi, getNftsOnChainMarketData } from 'state/nftMarket/helpers'
import useSWRInfinite from 'swr/infinite'
import intersectionBy from 'lodash/intersectionBy'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import fromPairs from 'lodash/fromPairs'
import { REQUEST_SIZE } from '../Collection/config'

interface ItemListingSettings {
  field: string
  direction: 'asc' | 'desc'
  showOnlyNftsOnSale: boolean
  nftFilters: Record<string, NftAttribute>
}

const applySaleData = async (collection: Collection, tokens: NftToken[], settings: ItemListingSettings) => {
  const onChainData = await getNftsOnChainMarketData(
    collection.address,
    tokens.filter(x => !!x.tokenId).map(x => x.tokenId),
  )
  const tokenMarketDataMap = onChainData.reduce((acc, t) => {
    // eslint-disable-next-line no-param-reassign
    acc[t.tokenId] = t
    return acc
  }, {})

  if (settings.showOnlyNftsOnSale) {
    // eslint-disable-next-line no-param-reassign
    tokens = intersectionBy(tokens, onChainData as any, (x: any) => x.tokenId)
  }

  return tokens.map(t => ({
    ...t,
    collectionAddress: t.collectionAddress || collection.address,
    marketData: tokenMarketDataMap[t.tokenId],
  }))
}

const fetchTokensFromFilter = async (address: string, settings: ItemListingSettings, page: number) => {
  const filterObject: Record<string, NftAttribute> = settings.nftFilters
  const attrParams = fromPairs(Object.values(filterObject).map(attr => [attr.traitType, attr.value]))
  const attrFilters = !isEmpty(attrParams)
    ? await fetchNftsFiltered(address, attrParams, page, REQUEST_SIZE, settings.field, settings.direction)
    : null
  return attrFilters ? Object.values(attrFilters.data) : null
}

const fetchMarketDataNfts = async (
  collection: Collection,
  settings: ItemListingSettings,
  page: number,
): Promise<NftToken[]> => {
  const res = await getNftsFromCollectionApi(collection.address, REQUEST_SIZE, page, settings.field, settings.direction)
  const nfts = Object.values(res.data)
  const newNfts: NftToken[] = nfts.map(apiNft => {
    return {
      ...apiNft,
      collectionAddress: collection.address,
      collectionName: collection.name,
      // marketData: subgraphRes.find(marketNft => marketNft.tokenId === apiNft.tokenId),
    } as any
  })
  return newNfts
}

export const useCollectionNfts = (collectionAddress: string) => {
  const fetchedNfts = useRef<NftToken[]>([])
  const fallbackMode = useRef(false)
  const fallbackModePage = useRef(0)
  const isLastPage = useRef(false)
  const collection = useGetCollection(collectionAddress)
  const { field, direction } = useGetNftOrdering(collectionAddress)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(collectionAddress)
  const nftFilters = useGetNftFilters(collectionAddress)
  const [itemListingSettings, setItemListingSettings] = useState<ItemListingSettings>({
    field,
    direction,
    showOnlyNftsOnSale,
    nftFilters,
  })

  // We don't know the amount in advance if nft filters exist
  const resultSize =
    !Object.keys(nftFilters).length && collection
      ? showOnlyNftsOnSale
        ? collection.listedItems
        : collection?.totalSupply
      : null

  const itemListingSettingsJson = JSON.stringify(itemListingSettings)
  const filtersJson = JSON.stringify(nftFilters)

  useEffect(() => {
    setItemListingSettings(() => ({
      field,
      direction,
      showOnlyNftsOnSale,
      nftFilters: JSON.parse(filtersJson),
    }))
    fallbackMode.current = false
    fallbackModePage.current = 0
    fetchedNfts.current = []
    isLastPage.current = false
  }, [field, direction, showOnlyNftsOnSale, filtersJson])

  const {
    data: nfts,
    status,
    size,
    setSize,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (pageIndex !== 0 && previousPageData && !previousPageData.length) return null
      return [collectionAddress, itemListingSettingsJson, pageIndex, 'collectionNfts']
    },
    async ([, settingsJson, page]) => {
      const settings: ItemListingSettings = JSON.parse(settingsJson as string)
      const tokensFromFilter = await fetchTokensFromFilter(collection?.address, settings, page as any)
      let newNfts: NftToken[] = []
      if (tokensFromFilter) {
        newNfts = tokensFromFilter as any
      } else {
        newNfts = await fetchMarketDataNfts(collection, settings, page as any)
      }
      newNfts = await applySaleData(collection, newNfts, settings)
      if (newNfts.length < REQUEST_SIZE) {
        isLastPage.current = true
      }
      return newNfts
    },
    { revalidateAll: false },
  )

  const uniqueNftList: NftToken[] = useMemo(() => (nfts ? uniqBy(nfts.flat(), 'tokenId') : []), [nfts])
  fetchedNfts.current = uniqueNftList

  return {
    nfts: uniqueNftList,
    isFetchingNfts: status !== FetchStatus.Fetched,
    page: size,
    setPage: setSize,
    resultSize,
    isLastPage: isLastPage.current,
  }
}
