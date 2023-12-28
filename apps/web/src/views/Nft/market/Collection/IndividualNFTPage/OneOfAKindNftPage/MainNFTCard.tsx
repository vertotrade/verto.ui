import { Box, Button, Card, CardBody, Flex, Text, useModal } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { useTokenAndPriceByAddress } from 'utils/prices'
import { NftToken } from 'state/nftMarket/types'
import { CurrencyLogo } from 'components/Logo'
import { formatNumber } from '@verto/utils/formatBalance'
import NFTMedia from 'views/Nft/market/components/NFTMedia'
// import EditProfileModal from 'views/Profile/components/EditProfileModal' //uncomment if profile code is added back
import BuyModal from '../../../components/BuySellModals/BuyModal'
// import SellModal from '../../../components/BuySellModals/SellModal'
import { nftsBaseUrl } from '../../../constants'
import { CollectionLink, Container, PriceBox } from '../shared/styles'

interface MainNFTCardProps {
  nft: NftToken
  isOwnNft: boolean
  nftIsProfilePic: boolean
  onSuccess: () => void
}

const MainNFTCard: React.FC<React.PropsWithChildren<MainNFTCardProps>> = ({
  nft,
  isOwnNft,
  nftIsProfilePic,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSuccess,
}) => {
  const { t } = useTranslation()

  const currentAskPriceAsNumber = nft?.marketData?.currentAskPrice ? parseFloat(nft.marketData?.currentAskPrice) : 0
  const [token, tokenPrice] = useTokenAndPriceByAddress(nft.marketData?.currency)
  const priceInUsd = tokenPrice * currentAskPriceAsNumber
  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  // const [onPresentSellModal] = useModal(
  //   <SellModal variant={nft.marketData?.isTradable ? 'edit' : 'sell'} nftToSell={nft} onSuccessSale={onSuccess} />,
  // )
  // const [onEditProfileModal] = useModal(<EditProfileModal />, false)

  // const ownerButtons = (
  //   <Flex flexDirection={['column', 'column', 'row']}>
  //     <Button
  //       disabled={nftIsProfilePic}
  //       minWidth="168px"
  //       mr="16px"
  //       width={['100%', null, 'max-content']}
  //       mt="24px"
  //       onClick={onPresentSellModal}>
  //       {nft.marketData?.isTradable ? t('Adjust price') : t('List for sale')}
  //     </Button>
  //     {!nft.marketData?.isTradable && (
  //       <Button
  //         minWidth="168px"
  //         variant="secondary"
  //         width={['100%', null, 'max-content']}
  //         mt="24px"
  //         onClick={onEditProfileModal}>
  //         {nftIsProfilePic ? t('Change Profile Pic') : t('Set as Profile Pic')}
  //       </Button>
  //     )}
  //   </Flex>
  // )

  return (
    <Card mb="40px" background="transparent" style={{ background: 'transparent' }}>
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center" maxWidth={440}>
            <NFTMedia key={nft.tokenId} nft={nft} width={440} height={440} />
          </Flex>
          <Flex flex="2" marginLeft={[null, null, null, '112px']}>
            <Box>
              <CollectionLink to={`${nftsBaseUrl}/collections/${nft.collectionAddress}`}>
                {nft?.collectionName}
              </CollectionLink>
              <Text fontSize="34px" mt="8px" fontFamily={`'Poppins',sans-serif`} fontWeight="600">
                {nft.name}
              </Text>
              {nft.description && (
                <Text mt="8px" fontSize="14px">
                  {t(nft.description)}
                </Text>
              )}
              <PriceBox>
                <Box>
                  <Text fontSize="14px" color="#818181">
                    {t('Price')}
                  </Text>
                  {currentAskPriceAsNumber > 0 ? (
                    <Flex alignItems="center">
                      <CurrencyLogo currency={token} size="18px" />
                      <Text fontSize="22px" bold mx="4px">
                        {formatNumber(currentAskPriceAsNumber, 0, 5)}
                      </Text>
                      {tokenPrice && priceInUsd && (
                        <Text color="textSubtle">{`(~${priceInUsd.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} USD)`}</Text>
                      )}
                    </Flex>
                  ) : (
                    <Text>{t('Not for sale')}</Text>
                  )}
                </Box>
                {nftIsProfilePic && (
                  <Text color="failure">
                    {t(
                      'This NFT is your profile picture, you must change it to some other NFT if you want to sell this one.',
                    )}
                  </Text>
                )}
                {/* {isOwnNft && ownerButtons} */}
                {!isOwnNft && (
                  <Button
                    minWidth="134px"
                    disabled={!nft.marketData?.isTradable}
                    onClick={onPresentBuyModal}
                    style={{ color: 'black', fontWeight: '500', fontSize: '14px' }}>
                    {t('Buy NFT')}
                  </Button>
                )}
              </PriceBox>
            </Box>
          </Flex>
        </Container>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
