import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { SadSmilePlaceholder, AutoRenewIcon, Button, Flex, Text } from '@verto/uikit'
import { useProfile } from 'state/profile/hooks'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from '@verto/localization'
import GridPlaceholder from '../../components/GridPlaceholder'
import { useCollectionNfts } from '../../hooks/useCollectionNfts'
import { useCollectionsNftsForAddress } from '../../hooks/useNftsForAddress'
import CollectionNftsGrid from './CollectionNFTsGrid'

interface CollectionNftsProps {
  collection: Collection
}

const CollectionNfts: React.FC<React.PropsWithChildren<CollectionNftsProps>> = ({ collection }) => {
  const { address: collectionAddress, name: collectionName } = collection || {}
  const { t } = useTranslation()
  const { nfts, isFetchingNfts, page, setPage, resultSize, isLastPage } = useCollectionNfts(collectionAddress)

  const { address: account } = useAccount()
  const { isLoading: isProfileLoading, profile } = useProfile()

  const { nfts: userNfts, isLoading } = useCollectionsNftsForAddress(account, profile, isProfileLoading, {
    [collectionAddress]: collection
  })

  const handleLoadMore = useCallback(() => {
    setPage(page + 1)
  }, [setPage, page])

  if ((!nfts || nfts?.length === 0) && isFetchingNfts) {
    return <GridPlaceholder />
  }

  return (
    <>
      {!isLoading && userNfts.length > 0 ? (
        <>
          <Text bold p="16px">
            {t('My "%symbol%" NFTs', { symbol: collectionName })}
          </Text>
          <CollectionNftsGrid nfts={userNfts} />
        </>
      ) : null}
      {resultSize ? (
        <Flex p="16px">
          <Text bold>
            {resultSize} {t('Results')}
          </Text>
        </Flex>
      ) : null}
      {nfts.length > 0 ? (
        <>
          <CollectionNftsGrid nfts={nfts} />
          <Flex mt="60px" mb="12px" justifyContent="center">
            {!isLastPage && (
              <Button
                onClick={handleLoadMore}
                scale="sm"
                disabled={isFetchingNfts}
                endIcon={isFetchingNfts ? <AutoRenewIcon spin color="currentColor" /> : undefined}>
                {isFetchingNfts ? t('Loading') : t('Load more')}
              </Button>
            )}
          </Flex>
        </>
      ) : (
        <Flex alignItems="center" py="120px" flexDirection="column">
          <SadSmilePlaceholder width="120px" mb="24px" />
          <Text fontSize="22px" fontWeight={600} fontFamily="Poppins">
            {t('No NFTs found')}
          </Text>
        </Flex>
      )}
    </>
  )
}

export default CollectionNfts
