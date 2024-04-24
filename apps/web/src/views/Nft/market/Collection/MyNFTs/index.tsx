import { Text, Flex, Grid, SadSmilePlaceholder } from '@verto/uikit'
import { useGetCollections } from 'state/nftMarket/hooks'
import { useTranslation } from '@verto/localization'
import MyNFT from './MyNFT'

const MyNFTs = () => {
  const { data: collections } = useGetCollections()
  const { t } = useTranslation()

  return (
    <>
      {collections ? (
        <Grid gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="64px">
          {Object.values(collections).map(collection => {
            return <MyNFT key={collection.address} collection={collection} />
          })}
        </Grid>
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

export default MyNFTs
