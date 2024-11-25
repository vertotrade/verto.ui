import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Flex, Text, Button, Message, Link } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { ChainId, ERC20Token } from '@verto/sdk'
import { DEFAULT_CHAIN_ID } from '@verto/farms/src/const'
import { vertoTokensTestnet, vertoTokens, vertoTokensTestnetL2 } from '@verto/tokens'
import { NftToken } from 'state/nftMarket/types'
import { getExplorerScanLinkForNft } from 'utils'
import { FetchStatus } from 'config/constants/types'
import { Divider, RoundedImage } from '../shared/styles'
import { BorderedBox, AmountCell } from './styles'

interface ReviewStageProps {
  nftToBuy: NftToken
  token: ERC20Token
  nftPrice: number
  walletBalance: number
  walletFetchStatus: FetchStatus
  notEnoughForPurchase: boolean
  continueToNextStage: () => void
}

const tokens =
  DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET
    ? vertoTokensTestnet
    : DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET_L2
    ? vertoTokensTestnetL2
    : vertoTokens

const ReviewStage: React.FC<React.PropsWithChildren<ReviewStageProps>> = ({
  nftToBuy,
  token,
  nftPrice,
  walletBalance,
  walletFetchStatus,
  notEnoughForPurchase,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  return (
    <>
      <Flex px="24px" pt="24px" flexDirection="column">
        <Flex>
          <RoundedImage src={nftToBuy.image.thumbnail} height={68} width={68} mr="16px" />
          <Flex flexDirection="column" justifyContent="space-evenly">
            <Text color="textSubtle" fontSize="12px">
              {nftToBuy?.collectionName}
            </Text>
            <Text bold>{nftToBuy.name}</Text>
            <Flex alignItems="center">
              <Text fontSize="12px" color="textSubtle" p="0px" height="16px" mr="4px">
                {t('Token ID:')}
              </Text>
              <Button
                as={Link}
                scale="xs"
                px="0px"
                pt="2px"
                external
                variant="text"
                href={getExplorerScanLinkForNft(nftToBuy.collectionAddress, nftToBuy.tokenId)}>
                {nftToBuy.tokenId}
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <BorderedBox>
          <Text small color="textSubtle">
            {t('Total payment')}
          </Text>
          <AmountCell amount={nftPrice} token={token} />
          <Text small color="textSubtle">
            {t('%symbol% in wallet', { symbol: token?.symbol })}
          </Text>
          {!account ? (
            <Flex justifySelf="flex-end">
              <ConnectWalletButton scale="sm" />
            </Flex>
          ) : (
            <AmountCell
              amount={walletBalance}
              isLoading={walletFetchStatus !== FetchStatus.Fetched}
              isInsufficient={walletFetchStatus === FetchStatus.Fetched && notEnoughForPurchase}
              token={token}
            />
          )}
        </BorderedBox>
        {walletFetchStatus === FetchStatus.Fetched && notEnoughForPurchase && (
          <Message p="8px" variant="danger">
            <Text>
              {t('Not enough %symbol% to purchase this NFT', {
                symbol: token?.symbol,
              })}
            </Text>
          </Message>
        )}
        {token?.symbol === tokens.wrebus.symbol && (
          <>
            <Flex alignItems="center">
              <Text my="16px" mr="4px">
                {t('Convert between REBUS and WREBUS for free')}:
              </Text>
              <Button
                as={Link}
                p="0px"
                height="16px"
                external
                variant="text"
                href={`/swap?inputCurrency=REBUS&outputCurrency=${tokens.wrebus.address}`}>
                {t('Convert')}
              </Button>
            </Flex>
          </>
        )}
      </Flex>
      <Divider />
      <Flex px="24px" pb="24px" flexDirection="column">
        <Button
          onClick={continueToNextStage}
          disabled={walletFetchStatus !== FetchStatus.Fetched || notEnoughForPurchase}
          mb="8px">
          {t('Checkout')}
        </Button>
        <Button
          as={Link}
          external
          style={{ width: '100%' }}
          href={`/swap?outputCurrency=${token?.address}`}
          variant="secondary">
          {t('Get %symbol%', { symbol: token?.symbol })}
        </Button>
      </Flex>
    </>
  )
}

export default ReviewStage
