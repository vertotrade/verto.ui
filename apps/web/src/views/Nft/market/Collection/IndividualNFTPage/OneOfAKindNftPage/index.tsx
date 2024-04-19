import { useMemo } from 'react'
import { Flex } from '@verto/uikit'
import sum from 'lodash/sum'
import noop from 'lodash/noop'
import Page from 'components/Layout/Page'
import { useGetCollection } from 'state/nftMarket/hooks'
import PageLoader from 'components/Loader/PageLoader'
import fromPairs from 'lodash/fromPairs'
import NFTMedia from 'views/Nft/market/components/NFTMedia'
import NFTHeaderDetails from './NFTHeaderDetails'
import PropertiesCard from '../shared/PropertiesCard'
import DetailsCard from '../shared/DetailsCard'
import useGetCollectionDistribution from '../../../hooks/useGetCollectionDistribution'
import OwnerCard from './OwnerCard'
import MoreFromThisCollection from '../shared/MoreFromThisCollection'
// import ActivityCard from './ActivityCard'
import { useCompleteNft } from '../../../hooks/useCompleteNft'
import ManageNFTsCard from '../shared/ManageNFTsCard'
import { useAccount } from 'wagmi'
import { useProfile } from 'state/profile/hooks'
import { useCollectionsNftsForAddress } from 'views/Nft/market/hooks/useNftsForAddress'

interface IndividualNFTPageProps {
  collectionAddress: string
  tokenId: string
}

const IndividualNFTPage: React.FC<React.PropsWithChildren<IndividualNFTPageProps>> = ({
  collectionAddress,
  tokenId,
}) => {
  const collection = useGetCollection(collectionAddress)
  const { data: distributionData, isFetching: isFetchingDistribution } = useGetCollectionDistribution(collectionAddress)
  const {
    collection: contractCollection,
    combinedNft: nft,
    isOwn: isOwnNft,
    isProfilePic,
    refetch,
  } = useCompleteNft(collectionAddress, tokenId)
  const { address: account } = useAccount()
  // Todo : need to update useProfile hooks
  const { isLoading: isProfileLoading, profile } = useProfile()
  // console.log(isProfileLoading, profile, 'isProfileLoading, profile')
  const properties = nft?.attributes

  const attributesRarity = useMemo(() => {
    if (distributionData && !isFetchingDistribution && properties) {
      return fromPairs(
        Object.keys(distributionData).map(traitType => {
          const total = sum(Object.values(distributionData[traitType]))
          const nftAttributeValue = properties.find(attribute => attribute.traitType === traitType)?.value
          const count = distributionData[traitType][nftAttributeValue]
          const rarity = (count / total) * 100
          return [traitType, rarity]
        }),
      )
    }
    return {}
  }, [properties, isFetchingDistribution, distributionData])

  if (!nft || !collection) {
    return <PageLoader />
  }
  const {
    nfts: userNfts,
    isLoading,
    refresh,
  } = useCollectionsNftsForAddress(account, profile, isProfileLoading, { [collection.address]: collection })

  if (userNfts.length === 0) {
    return <PageLoader />
  }

  return (
    <Page>
      <Flex
        flexDirection={['column', 'column', 'row-reverse']}
        alignItems="top"
        width="100%"
        style={{ gap: '16px' }}
        paddingTop={[null, null, '88px']}>
        <NFTHeaderDetails nft={nft} isOwnNft={isOwnNft} nftIsProfilePic={isProfilePic} onSuccess={refetch} />
        <Flex flexDirection="column" alignItems="center" maxWidth="656px" width="100%" style={{ gap: '16px' }}>
          <NFTMedia key={nft.tokenId} nft={nft} width={464} height={464} />
          <ManageNFTsCard
            collection={collection}
            tokenId={tokenId}
            onSuccess={isOwnNft ? refetch : noop}
            userNfts={userNfts}
            account={account}
            isLoading={isLoading || false}
            refresh={refresh || noop}
          />
          <PropertiesCard properties={properties} rarity={attributesRarity} />
          <DetailsCard contractAddress={collectionAddress} ipfsJson={nft?.marketData?.metadataUrl} />
          <OwnerCard
            contractCollection={contractCollection}
            nft={nft}
            isOwnNft={isOwnNft}
            nftIsProfilePic={isProfilePic}
            onSuccess={refetch}
          />
          {/* <ActivityCard nft={nft} /> */}
        </Flex>
      </Flex>
      <MoreFromThisCollection collectionAddress={collectionAddress} currentTokenName={nft.name} />
    </Page>
  )
}

export default IndividualNFTPage
