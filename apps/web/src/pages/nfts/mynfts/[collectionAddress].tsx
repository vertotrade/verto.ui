/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-shadow */
/* @ts-nocheck */
/* @ts-ignore */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useGetCollection } from 'state/nftMarket/hooks'
import { Box, Flex, Grid, Text, Skeleton, Heading } from '@verto/uikit'
import { useAccount } from 'wagmi'
import { useProfile } from 'state/profile/hooks'
import { ApiCollections, NftLocation, NftToken, Collection } from 'state/nftMarket/types'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@verto/localization'
import { isAddress } from 'utils'
import PageLoader from 'components/Loader/PageLoader'
import { PageMeta } from 'components/Layout/Page'
import Container from 'components/Layout/Container'
import Header from '../../../views/Nft/market/Collection/Header'
import { useCollectionsNftsForAddress } from '../../../views/Nft/market/hooks/useNftsForAddress'
import { CollectibleLinkCard } from '../../../views/Nft/market/components/CollectibleCard'

const getNftFilter = (location: NftLocation) => {
  return (nft: NftToken, collectionAddress: string): boolean => {
    return isAddress(nft.collectionAddress) === isAddress(collectionAddress) && nft.location === location
  }
}

const MyNFTsPage = () => {
  const router = useRouter()
  const { t } = useTranslation() 
  const { collectionAddress, tokenId } = router.query
  const collection = useGetCollection(String(collectionAddress))
  const [isLoading, setIsLoading] = useState(true)
  const { address: account } = useAccount()
  const { isLoading: isProfileLoading, profile } = useProfile()
  const [collectionData, setCollectionData] = useState<Collection | undefined>(undefined);
  const [collectionsArg, setCollectionArg] = useState<ApiCollections | undefined>(undefined);
  const { nfts: userNfts, isLoading: nftsLoading } = useCollectionsNftsForAddress(
    account,
    profile,
    isProfileLoading,
    collectionsArg as ApiCollections,
  )

  useEffect(() => {
    if (collection) {
      setCollectionData(collection)
      setCollectionArg({ [collection.address]: collection })
      setIsLoading(false)
    }
  }, [collection])


  if (router.isFallback || isLoading || nftsLoading) {
    return <PageLoader />
  }
  const walletFilter = getNftFilter(NftLocation.WALLET)
  const nftsInWallet = userNfts.filter(nft => walletFilter(nft, collectionData.address))

  const userHasNoNfts = !isLoading && nftsInWallet.length === 0 
  const userOwnsThisNFT = userNfts.filter(({ tokenId: userTokenId }) => userTokenId === tokenId).length > 0
  const totalNfts = nftsInWallet.length
  const totalNftsText = account && !userHasNoNfts ? ` (${totalNfts})` : ''

  if (nftsInWallet.length > 0) {
    return (
      <>
        <PageMeta />
        <Header collection={collectionData} />
        <Container>
            {totalNftsText && (
              <Text fontSize="16px" color="textSubtle" ml="auto" mt="16px">
                {t(`Your NFTs ${totalNftsText}`)}
              </Text>
            )}
          <Grid
                gridGap="16px"
                gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
            alignItems="start">
            {userHasNoNfts && (
              <Text textAlign="center" fontSize="16px" color="textSubtle">
                {t('No NFTs found')}
              </Text>
            )}
            {userOwnsThisNFT && (
              <Text px="16px" pb="16px" color="textSubtle">
                {t('You don’t have any of this item.')}
              </Text>
            )}
            {nftsInWallet.map(nft => (
                  <CollectibleLinkCard key={nft.tokenId} nft={nft} />
            ))}
          </Grid>
        </Container>
    </>
   )
  }

  return (
    <Box pt="24px">
      <PageMeta />
      <Header collection={collectionData} />
      {userHasNoNfts && (
        <Flex mt="32px" mb="16px" justifyContent="center">
          <Heading scale="md">
            {t('No NFTs found')}
          </Heading>
        </Flex>
      )}
      {!account && (
        <Flex mb="16px" justifyContent="center">
          <ConnectWalletButton />
        </Flex>
      )}
      {account && isLoading && nftsLoading && (
        <Box px="16px" pb="8px">
          <Skeleton mb="8px" />
          <Skeleton mb="8px" />
          <Skeleton mb="8px" />
        </Box>
      )}
    </Box>
  )
}

export default MyNFTsPage
