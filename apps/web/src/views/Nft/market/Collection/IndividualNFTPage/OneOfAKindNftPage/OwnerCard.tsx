import styled from 'styled-components'
import { Flex, Grid, Text, useModal, Box, Skeleton, Button } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { CurrencyLogo } from 'components/Logo'
import { NftToken } from 'state/nftMarket/types'
import { formatNumber } from '@verto/utils/formatBalance'
import { useTokenAndPriceByAddress } from 'utils/prices'
import useNftOwner from 'views/Nft/market/hooks/useNftOwner'
import { CollectionStructOutput } from 'config/abi/types/NftMarket'
import BuyModal from '../../../components/BuySellModals/BuyModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import ProfileCell from '../../../components/ProfileCell'
import { ButtonContainer, TableHeading } from '../shared/styles'
import ExpandableCard from '../shared/ExpandableCard'

const OwnerRow = styled(Grid)`
  grid-template-columns: 2fr 2fr 1fr;
  grid-row-gap: 16px;
  margin-top: 16px;
  margin-bottom: 8px;
  align-items: center;
`

const StyledText = styled(Text)`
  color: ${({ theme }) => `${theme.colors.tableHeader}`};
  font-size: 14px;
`

interface OwnerCardProps {
  contractCollection: CollectionStructOutput
  nft: NftToken
  isOwnNft: boolean
  nftIsProfilePic: boolean
  onSuccess: () => void
}

const OwnerCard: React.FC<React.PropsWithChildren<OwnerCardProps>> = ({
  nft,
  isOwnNft,
  nftIsProfilePic,
  onSuccess,
}) => {
  const { t } = useTranslation()

  const { owner, isLoadingOwner } = useNftOwner(nft, isOwnNft)

  const [token, tokenPrice] = useTokenAndPriceByAddress(nft.marketData?.currency)
  const priceInUsd = parseFloat(nft?.marketData?.currentAskPrice) * tokenPrice

  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const [onPresentAdjustPriceModal] = useModal(
    <SellModal variant={nft.marketData?.isTradable ? 'edit' : 'sell'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )

  const content = (
    <Box background="transparent" pt="10px">
      {owner && (
        <>
          <TableHeading flex="0 1 auto" gridTemplateColumns="2fr 2fr 1fr" py="12px">
            <Flex alignItems="center">
              <StyledText pl="24px">{t('Price')}</StyledText>
            </Flex>
            <StyledText>{t('Owner')}</StyledText>
          </TableHeading>
          <OwnerRow>
            <Box pl="24px">
              {nft.marketData?.isTradable ? (
                <>
                  <Flex justifySelf="flex-start" alignItems="center" width="max-content">
                    <CurrencyLogo currency={token} size="24px" />
                    <Text bold ml="8px">
                      {formatNumber(parseFloat(nft?.marketData?.currentAskPrice), 0, 5)}
                    </Text>
                  </Flex>
                  {priceInUsd ? (
                    <Text fontSize="12px" color="textSubtle">
                      {`(~${formatNumber(priceInUsd, 2, 2)} USD)`}
                    </Text>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                <Flex alignItems="center" height="100%">
                  <Text>{t('Not for sale')}</Text>
                </Flex>
              )}
            </Box>
            <Box>
              <Flex width="max-content" alignItems="center">
                <ProfileCell accountAddress={owner.toLowerCase()} />
              </Flex>
            </Box>
            <ButtonContainer>
              {isOwnNft ? (
                <Button
                  disabled={nftIsProfilePic}
                  scale="sm"
                  variant="secondary"
                  maxWidth="128px"
                  onClick={onPresentAdjustPriceModal}>
                  {nft.marketData?.isTradable ? t('Manage') : t('Sell')}
                </Button>
              ) : (
                <Button
                  disabled={!nft.marketData?.isTradable}
                  scale="md"
                  variant="secondary"
                  maxWidth="128px"
                  onClick={onPresentBuyModal}
                  style={{ fontSize: '16px' }}>
                  {t('Buy')}
                </Button>
              )}
            </ButtonContainer>
          </OwnerRow>
        </>
      )}
      {isLoadingOwner && <Skeleton />}
      {!isLoadingOwner && !owner && (
        <Flex justifyContent="center" alignItems="center" padding="24px">
          <Text>{t('Owner information is not available for this item')}</Text>
        </Flex>
      )}
    </Box>
  )
  return <ExpandableCard title={t('Owner')} content={content} />
}

export default OwnerCard
