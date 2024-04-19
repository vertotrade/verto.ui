/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components'
import { Box, Flex, Grid, Text, SellIcon, WalletFilledIcon, CameraIcon, Skeleton, useModal } from '@verto/uikit'
import { NftLocation, NftToken, Collection } from 'state/nftMarket/types'
import { formatNumber } from '@verto/utils/formatBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@verto/localization'
import { isAddress } from 'utils'
import { CurrencyLogo } from 'components/Logo'
import { useTokenAndPriceByAddress } from 'utils/prices'
import React, { useState, useEffect, useMemo } from 'react'
import { CollectibleRowContainer, SmallRoundedImage } from './styles'
import ProfileNftModal from '../../../components/ProfileNftModal'
import SellModal from '../../../components/BuySellModals/SellModal'
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
  userNfts: NftToken[] | null
  account: string
  isLoading?: boolean
  refresh?: () => void
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
  userNfts,
  account,
  isLoading,
  refresh,
}) => {
  const { t } = useTranslation()
  const [content, setContent] = useState<React.ReactNode | null>(null)
  const [title, setTitle] = useState<string>(tokenId ? t('Manage Yours') : t('Manage Yours in Collection'))
  const [nftData, setNftData] = useState({
    nftsInWallet: [],
    nftsForSale: [],
    profileNft: [],
    userOwnsThisNFT: false,
  })

  const walletFilter = useMemo(() => getNftFilter(NftLocation.WALLET), [])
  const forSaleFilter = useMemo(() => getNftFilter(NftLocation.FORSALE), [])
  const profileFilter = useMemo(() => getNftFilter(NftLocation.PROFILE), [])

  useEffect(() => {
    setNftData({
      nftsInWallet: userNfts?.filter(nft => walletFilter(nft, collection.address)) || [],
      nftsForSale: userNfts?.filter(nft => forSaleFilter(nft, collection.address)) || [],
      profileNft: userNfts?.filter(nft => profileFilter(nft, collection.address)) || [],
      userOwnsThisNFT: userNfts?.filter(({ tokenId: userTokenId }) => userTokenId === tokenId).length > 0,
    })
  }, [])

  const userHasNoNfts =
    !isLoading &&
    nftData.nftsInWallet.length === 0 &&
    nftData.nftsForSale.length === 0 &&
    nftData.profileNft.length === 0
  const totalNfts = nftData.nftsInWallet.length + nftData.nftsForSale.length + nftData.profileNft.length
  const totalNftsText = account && !userHasNoNfts ? ` (${totalNfts})` : ''

  useEffect(() => {
    setTitle(`${tokenId ? t('Manage Yours') : t('Manage Yours in Collection')}${totalNftsText}`)
  }, [totalNfts])

  const handleButtonClick = () => {
    setContent(
      <Box pt="24px">
        {!account && (
          <Flex mb="16px" justifyContent="center">
            <ConnectWalletButton />
          </Flex>
        )}
        {account && !nftData.userOwnsThisNFT && (
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
        {nftData.nftsForSale.length > 0 && (
          <CollectiblesByLocation
            location={NftLocation.FORSALE}
            nfts={nftData.nftsForSale}
            lowestPrice={lowestPrice}
            onSuccessSale={() => {
              refresh()
              onSuccess?.()
            }}
          />
        )}
        {nftData.nftsInWallet.length > 0 && (
          <>
            {nftData.nftsForSale.length > 0 && <Divider />}
            <CollectiblesByLocation
              location={NftLocation.WALLET}
              nfts={nftData.nftsInWallet}
              lowestPrice={lowestPrice}
              onSuccessSale={() => {
                refresh()
                onSuccess?.()
              }}
            />
          </>
        )}
        {nftData.profileNft.length > 0 && (
          <>
            {(nftData.nftsForSale.length > 0 || nftData.nftsInWallet.length > 0) && <Divider />}
            <CollectiblesByLocation
              location={NftLocation.PROFILE}
              nfts={nftData.profileNft}
              lowestPrice={lowestPrice}
              onSuccessSale={() => {
                refresh()
                onSuccess?.()
              }}
            />
          </>
        )}
      </Box>,
    )
  }

  return <ExpandableCard title={title} content={content} handleButtonClick={handleButtonClick} />
}

export default ManageNFTsCard
