import { Box, CardBody, Flex, Text } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { useTokenAndPriceByAddress } from 'utils/prices'
import PreviewImage from './PreviewImage'
import { CostLabel, MetaRow } from './styles'
import LocationTag from './LocationTag'
import { CollectibleCardProps } from './types'
import NFTMedia from '../NFTMedia'

const CollectibleCardBody: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
}) => {
  const { t } = useTranslation()
  const { name } = nft
  const [token, tokenPrice] = useTokenAndPriceByAddress(nft.marketData?.currency)

  return (
    <CardBody p="0" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="12px" />
      <Flex alignItems="center" justifyContent="space-between" px="12px" mt="auto">
        {nft?.collectionName && (
          <Text fontSize="12px" color="textSubtle">
            {nft?.collectionName}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
      </Flex>
      <Text as="h4" fontWeight="600" mb="12px" px="12px">
        {name}
      </Text>
      <Box borderTop="1px solid" borderTopColor="cardBorder" p="12px" mt="auto">
        {currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
            <CostLabel cost={currentAskPrice} usdPrice={tokenPrice} token={token} />
          </MetaRow>
        )}
      </Box>
    </CardBody>
  )
}

export default CollectibleCardBody
