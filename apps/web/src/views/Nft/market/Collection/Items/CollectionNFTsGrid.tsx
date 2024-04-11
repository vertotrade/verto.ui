import { Grid } from '@verto/uikit'
import { NftToken } from 'state/nftMarket/types'
import { CollectibleLinkCard } from '../../components/CollectibleCard'

interface CollectionNftsGridProps {
  nfts: NftToken[]
}

const CollectionNftsGrid: React.FC<React.PropsWithChildren<CollectionNftsGridProps>> = ({ nfts }) => {
  return (
    <Grid
      gridGap="16px"
      gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
      alignItems="start">
      {nfts.map(nft => {
        const currentAskPriceAsNumber = nft.marketData && parseFloat(nft?.marketData?.currentAskPrice)

        return (
          <CollectibleLinkCard
            key={nft.tokenId}
            nft={nft}
            currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
            data-test="collection-detail-page-card"
          />
        )
      })}
    </Grid>
  )
}

export default CollectionNftsGrid
