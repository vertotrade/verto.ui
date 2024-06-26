import styled from 'styled-components'
import { Box, Flex, Grid, Text, SellIcon, WalletFilledIcon, CameraIcon, Skeleton, useModal } from '@verto/uikit'
import { useAccount } from 'wagmi'
import { useProfile } from 'state/profile/hooks'
import { NftLocation, NftToken, Collection } from 'state/nftMarket/types'
import { formatNumber } from '@verto/utils/formatBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@verto/localization'
import { isAddress } from 'utils'
import { CurrencyLogo } from 'components/Logo'
import { useTokenAndPriceByAddress } from 'utils/prices'
import { CollectibleRowContainer, SmallRoundedImage } from './styles'
import ProfileNftModal from '../../../components/ProfileNftModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import { useCollectionsNftsForAddress } from '../../../hooks/useNftsForAddress'
import ExpandableCard from './ExpandableCard'

const ScrollableContainer = styled(Box)`
  overflow-y: auto;
  max-height: 224px;
`

const Divider = styled.div`
  margin: 16px 20px;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
`

const LocationColors = {
  [NftLocation.FORSALE]: 'failure',
  [NftLocation.WALLET]: 'secondary',
  [NftLocation.PROFILE]: 'textSubtle',
}

const LocationIcons = {
  [NftLocation.FORSALE]: SellIcon,
  [NftLocation.WALLET]: WalletFilledIcon,
  [NftLocation.PROFILE]: CameraIcon,
}

interface CollectibleRowProps {
  nft: NftToken
  lowestPrice: string
  onSuccessSale: () => void
}

const CollectibleRow: React.FC<React.PropsWithChildren<CollectibleRowProps>> = ({
  nft,
  lowestPrice,
  onSuccessSale,
}) => {
  const { t } = useTranslation()
  const modalVariant = nft.location === NftLocation.WALLET ? 'sell' : 'edit'
  const [onPresentProfileNftModal] = useModal(<ProfileNftModal nft={nft} />)
  const [onPresentModal] = useModal(<SellModal variant={modalVariant} nftToSell={nft} onSuccessSale={onSuccessSale} />)
  const [token] = useTokenAndPriceByAddress(nft.marketData?.currency)

  return (
    <CollectibleRowContainer
      gridTemplateColumns="96px 1fr"
      px="16px"
      pb="8px"
      my="16px"
      onClick={nft.location === NftLocation.PROFILE ? onPresentProfileNftModal : onPresentModal}>
      <SmallRoundedImage src={nft.image.thumbnail} width={64} height={64} mx="16px" />
      <Grid gridTemplateColumns="1fr 1fr">
        <Text bold>{nft.name}</Text>
        <Text fontSize="12px" color="textSubtle" textAlign="right">
          {nft?.collectionName}
        </Text>
        {lowestPrice && (
          <>
            <Text small color="textSubtle">
              {t('Lowest price')}
            </Text>
            <Flex justifySelf="flex-end" width="max-content">
              <CurrencyLogo currency={token} size="16px" />
              <Text small ml="4px">
                {formatNumber(parseFloat(lowestPrice), 0, 5)}
              </Text>
            </Flex>
          </>
        )}
        {nft.location === NftLocation.FORSALE ? (
          <>
            <Text small color="textSubtle">
              {t('Your price')}
            </Text>
            <Flex justifySelf="flex-end" width="max-content">
              <CurrencyLogo currency={token} size="16px" />
              <Text small ml="4px">
                {nft?.marketData?.currentAskPrice}
              </Text>
            </Flex>
          </>
        ) : (
          <Text small color="textDisabled">
            {t('Not on sale')}
          </Text>
        )}
      </Grid>
    </CollectibleRowContainer>
  )
}

interface CollectiblesByLocationProps {
  location: NftLocation
  nfts: NftToken[]
  lowestPrice: string
  onSuccessSale: () => void
}

const CollectiblesByLocation: React.FC<React.PropsWithChildren<CollectiblesByLocationProps>> = ({
  location,
  nfts,
  lowestPrice,
  onSuccessSale,
}) => {
  const { t } = useTranslation()
  const IconComponent = LocationIcons[location]
  return (
    <Flex flexDirection="column">
      <Grid gridTemplateColumns="32px 1fr" px="16px" pb="8px">
        <IconComponent color={LocationColors[location]} width="24px" height="24px" />
        <Text display="inline" bold color={LocationColors[location]}>
          {t(location)}
        </Text>
      </Grid>
      <ScrollableContainer>
        {nfts.map(nft => (
          <CollectibleRow key={nft.tokenId} nft={nft} lowestPrice={lowestPrice} onSuccessSale={onSuccessSale} />
        ))}
      </ScrollableContainer>
    </Flex>
  )
}

interface ManageNftsCardProps {
  collection: Collection
  tokenId?: string | number
  lowestPrice?: string
  onSuccess?: () => void
}

const getNftFilter = (location: NftLocation) => {
  return (nft: NftToken, collectionAddress: string): boolean => {
    return isAddress(nft.collectionAddress) === isAddress(collectionAddress) && nft.location === location
  }
}

const ManageNFTsCard: React.FC<React.PropsWithChildren<ManageNftsCardProps>> = ({
  collection,
  tokenId,
  lowestPrice,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const { isLoading: isProfileLoading, profile } = useProfile()

  const {
    nfts: userNfts,
    isLoading,
    refresh,
  } = useCollectionsNftsForAddress(account, profile, isProfileLoading, { [collection.address]: collection })

  const walletFilter = getNftFilter(NftLocation.WALLET)
  const forSaleFilter = getNftFilter(NftLocation.FORSALE)
  const profileFilter = getNftFilter(NftLocation.PROFILE)

  const nftsInWallet = userNfts.filter(nft => walletFilter(nft, collection.address))
  const nftsForSale = userNfts.filter(nft => forSaleFilter(nft, collection.address))
  const profileNft = userNfts.filter(nft => profileFilter(nft, collection.address))

  const userHasNoNfts = !isLoading && nftsInWallet.length === 0 && nftsForSale.length === 0 && profileNft.length === 0
  const userOwnsThisNFT = userNfts.filter(({ tokenId: userTokenId }) => userTokenId === tokenId).length > 0
  const totalNfts = nftsInWallet.length + nftsForSale.length + profileNft.length
  const totalNftsText = account && !userHasNoNfts ? ` (${totalNfts})` : ''

  const content = (
    <Box pt="24px">
      {!account && (
        <Flex mb="16px" justifyContent="center">
          <ConnectWalletButton />
        </Flex>
      )}
      {account && !userOwnsThisNFT && (
        <Text px="16px" pb="16px" color="textSubtle">
          {t('You don’t have any of this item.')}
        </Text>
      )}
      {account && isLoading && (
        <Box px="16px" pb="8px">
          <Skeleton mb="8px" />
          <Skeleton mb="8px" />
          <Skeleton mb="8px" />
        </Box>
      )}
      {nftsForSale.length > 0 && (
        <CollectiblesByLocation
          location={NftLocation.FORSALE}
          nfts={nftsForSale}
          lowestPrice={lowestPrice}
          onSuccessSale={() => {
            refresh()
            onSuccess?.()
          }}
        />
      )}
      {nftsInWallet.length > 0 && (
        <>
          {nftsForSale.length > 0 && <Divider />}
          <CollectiblesByLocation
            location={NftLocation.WALLET}
            nfts={nftsInWallet}
            lowestPrice={lowestPrice}
            onSuccessSale={() => {
              refresh()
              onSuccess?.()
            }}
          />
        </>
      )}
      {profileNft.length > 0 && (
        <>
          {(nftsForSale.length > 0 || nftsInWallet.length > 0) && <Divider />}
          <CollectiblesByLocation
            location={NftLocation.PROFILE}
            nfts={profileNft}
            lowestPrice={lowestPrice}
            onSuccessSale={() => {
              refresh()
              onSuccess?.()
            }}
          />
        </>
      )}
    </Box>
  )
  return (
    <ExpandableCard
      title={`${tokenId ? t('Manage Yours') : t('Manage Yours in Collection')}${totalNftsText}`}
      content={content}
    />
  )
}

export default ManageNFTsCard
