import { parseUnits, formatEther } from '@ethersproject/units'
import { TranslateFunction, useTranslation } from '@verto/localization'
import { InjectedModalProps, useToast } from '@verto/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useNftMarketContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useTokenBalance from 'hooks/useTokenBalance'
import useSWR from 'swr'
import { useGasPrice } from 'state/user/hooks'
import { useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { useTokenAndPriceByAddress } from 'utils/prices'
import { ethersToBigNumber } from '@verto/utils/bigNumber'
import { getBalanceNumber } from '@verto/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import { DEFAULT_CHAIN_ID } from 'config/chains'
import { ChainId } from '@verto/sdk'
import { vertoTokens, vertoTokensTestnet } from '@verto/tokens'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import ConfirmStage from '../shared/ConfirmStage'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import ReviewStage from './ReviewStage'
import { StyledModal } from './styles'
import { BuyingStage } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [BuyingStage.REVIEW]: t('Review'),
  [BuyingStage.APPROVE_AND_CONFIRM]: t('Back'),
  [BuyingStage.CONFIRM]: t('Back'),
  [BuyingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const vertoToken = DEFAULT_CHAIN_ID === ChainId.REBUS_TESTNET ? vertoTokensTestnet.verto : vertoTokens.verto

const BuyModal: React.FC<React.PropsWithChildren<BuyModalProps>> = ({ nftToBuy, onDismiss }) => {
  const collectionContract = useNftMarketContract()
  const { data: contractCollection } = useSWR(
    collectionContract ? ['nft', 'viewCollection', nftToBuy?.collectionAddress] : null,
    async () => collectionContract.viewCollection(nftToBuy?.collectionAddress),
  )
  const { burnVerto } = contractCollection

  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account } = useActiveWeb3React()
  const [token] = useTokenAndPriceByAddress(nftToBuy.marketData?.currency)
  const contractReader = useERC20(token?.address, false)
  const contractApprover = useERC20(token?.address)
  const vertoContractReader = useERC20(vertoToken.address, false)
  const vertoContractApprover = useERC20(vertoToken.address)
  const nftMarketContract = useNftMarketContract()

  const { toastSuccess } = useToast()

  const nftPriceWei = parseUnits(nftToBuy?.marketData?.currentAskPrice, token.decimals)
  const nftPrice = parseFloat(nftToBuy?.marketData?.currentAskPrice)

  const { balance, fetchStatus: walletFetchStatus } = useTokenBalance(token?.address)
  const walletBalance = getBalanceNumber(balance, token?.decimals)

  const notEnoughForPurchase = balance.lt(ethersToBigNumber(nftPriceWei))

  const {
    isApproving: vertoIsApproving,
    isApproved: vertoIsApproved,
    handleApprove: vertoHandleApprove,
  } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      if (vertoToken.address === token?.address) {
        return requiresApproval(vertoContractReader, account, nftMarketContract.address, nftPriceWei.add(burnVerto))
      }
      return requiresApproval(vertoContractReader, account, nftMarketContract.address, burnVerto)
    },
    onApprove: () => {
      return callWithGasPrice(vertoContractApprover, 'increaseAllowance', [nftMarketContract.address, burnVerto])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now spend Verto for transaction gas!', { symbol: token.symbol }),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => null,
    onSuccess: () => null,
  })

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return requiresApproval(contractReader, account, nftMarketContract.address, nftPriceWei)
    },
    onApprove: () => {
      return callWithGasPrice(contractApprover, 'approve', [nftMarketContract.address, nftPriceWei])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now buy NFT with %symbol%!', { symbol: token.symbol }),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      return callWithGasPrice(nftMarketContract, 'buyToken', [
        nftToBuy.collectionAddress,
        nftToBuy.tokenId,
        nftPriceWei,
        token.address,
      ])
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      toastSuccess(
        t('Your NFT has been sent to your wallet'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
  })

  const continueToNextStage = () => {
    if (!isApproved || !vertoIsApproved) {
      setStage(BuyingStage.APPROVE_AND_CONFIRM)
    } else {
      setStage(BuyingStage.CONFIRM)
    }
  }

  const goBack = () => {
    setStage(BuyingStage.REVIEW)
  }

  const showBackButton = stage === BuyingStage.CONFIRM || stage === BuyingStage.APPROVE_AND_CONFIRM

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}>
      {stage === BuyingStage.REVIEW && (
        <ReviewStage
          token={token}
          nftToBuy={nftToBuy}
          nftPrice={nftPrice}
          walletBalance={walletBalance}
          walletFetchStatus={walletFetchStatus}
          notEnoughForPurchase={notEnoughForPurchase}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.APPROVE_AND_CONFIRM && (
        <ApproveAndConfirmStage
          token={token}
          variant="buy"
          gasPrice={formatEther(burnVerto)}
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
          vertoHandleApprove={vertoHandleApprove}
          vertoIsApproved={vertoIsApproved}
          vertoIsApproving={vertoIsApproving}
        />
      )}
      {stage === BuyingStage.CONFIRM && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
