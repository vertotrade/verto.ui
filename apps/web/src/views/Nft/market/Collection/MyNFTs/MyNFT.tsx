import { useAccount } from 'wagmi'
import { Text } from '@verto/uikit'
import { useProfile } from 'state/profile/hooks'
import { useTranslation } from '@verto/localization'
import { Collection } from 'state/nftMarket/types'
import { useCollectionsNftsForAddress } from '../../hooks/useNftsForAddress'
import CollectionNftsGrid from '../Items/CollectionNFTsGrid'

interface CollectionNftsProps {
  collection: Collection
}

const MyNFT: React.FC<React.PropsWithChildren<CollectionNftsProps>> = ({ collection }) => {
  const { address: collectionAddress, name: collectionName } = collection || {}
  const { t } = useTranslation()

  const { address: account } = useAccount()
  const { isLoading: isProfileLoading, profile } = useProfile()

  const { nfts: userNfts, isLoading } = useCollectionsNftsForAddress(account, profile, isProfileLoading, {
    [collectionAddress]: collection,
  })

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
    </>
  )
}

export default MyNFT
