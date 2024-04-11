import { useAccount } from 'wagmi'
import { FetchStatus } from 'config/constants/types'
import { useCallback } from 'react'
import { useErc721CollectionContract, useNftMarketContract } from 'hooks/useContract'
import { getNftApi, getNftsOnChainMarketData } from 'state/nftMarket/helpers'
import { NftLocation, NftToken, TokenMarketData } from 'state/nftMarket/types'
import { useProfile } from 'state/profile/hooks'
import useSWR from 'swr'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { isAddress } from 'utils'

const useNftOwn = (collectionAddress: string, tokenId: string, marketData?: TokenMarketData) => {
  const { address: account } = useAccount()
  const { reader: collectionContract } = useErc721CollectionContract(collectionAddress)
  const { isInitialized: isProfileInitialized, profile } = useProfile()

  const { data: tokenOwner } = useSWR(
    collectionContract ? ['nft', 'ownerOf', collectionAddress, tokenId] : null,
    async () => collectionContract.ownerOf(tokenId),
  )

  return useSWR(
    account && isProfileInitialized && tokenOwner
      ? ['nft', 'own', collectionAddress, tokenId, marketData?.currentSeller]
      : null,
    async () => {
      let isOwn = false
      let nftIsProfilePic = false
      let location: NftLocation

      nftIsProfilePic = tokenId === profile?.tokenId?.toString() && collectionAddress === profile?.collectionAddress
      const nftIsOnSale = marketData ? marketData?.currentSeller !== NOT_ON_SALE_SELLER : false
      if (nftIsOnSale) {
        isOwn = isAddress(marketData?.currentSeller) === isAddress(account)
        location = NftLocation.FORSALE
      } else if (nftIsProfilePic) {
        isOwn = true
        location = NftLocation.PROFILE
      } else {
        isOwn = isAddress(tokenOwner) === isAddress(account)
        location = NftLocation.WALLET
      }

      return {
        isOwn,
        nftIsProfilePic,
        location,
      }
    },
  )
}

export const useCompleteNft = (collectionAddress: string, tokenId: string) => {
  const collectionContract = useNftMarketContract()

  const { data: collection } = useSWR(
    collectionContract ? ['nft', 'viewCollection', collectionAddress] : null,
    async () => collectionContract.viewCollection(collectionAddress),
  )

  const { data: nft, mutate } = useSWR(
    collectionAddress && tokenId ? ['nft', collectionAddress, tokenId] : null,
    async () => {
      const metadata = await getNftApi(collectionAddress, tokenId)
      if (metadata) {
        const basicNft: NftToken = {
          tokenId,
          collectionAddress,
          collectionName: metadata.collection.name,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes,
        }
        return basicNft
      }
      return null
    },
  )

  const { data: marketData, mutate: refetchNftMarketData } = useSWR(
    collectionAddress && tokenId ? ['nft', 'marketData', collectionAddress, tokenId] : null,
    async () => {
      const onChainMarketDatas = await getNftsOnChainMarketData(collectionAddress.toLowerCase(), [tokenId])
      const onChainMarketData = onChainMarketDatas[0]

      if (!onChainMarketData) return null

      return { ...onChainMarketData }
    },
  )

  const { data: nftOwn, mutate: refetchNftOwn, status } = useNftOwn(collectionAddress, tokenId, marketData)

  const refetch = useCallback(async () => {
    await mutate()
    await refetchNftMarketData()
    await refetchNftOwn()
  }, [mutate, refetchNftMarketData, refetchNftOwn])

  return {
    collection,
    combinedNft: nft ? { ...nft, marketData, location: nftOwn?.location ?? NftLocation.WALLET } : undefined,
    isOwn: nftOwn?.isOwn || false,
    isProfilePic: nftOwn?.nftIsProfilePic || false,
    isLoading: status !== FetchStatus.Fetched,
    refetch,
  }
}
