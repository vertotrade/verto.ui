import { Link, Text, BscScanIcon } from '@verto/uikit'
import { ChainId } from '@verto/sdk'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { useTranslation } from '@verto/localization'
import truncateHash from '@verto/utils/truncateHash'
import { useActiveChainId } from 'hooks/useActiveChainId'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
  txChainId?: number
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({
  txHash,
  txChainId,
  children,
}) => {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()

  return (
    <>
      {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <Link external href={getBlockExploreLink(txHash, 'transaction', txChainId || chainId)}>
          {t('View on %site%', { site: getBlockExploreName(txChainId || chainId) })}: {truncateHash(txHash, 8, 0)}
          {(txChainId || chainId) === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />}
        </Link>
      )}
    </>
  )
}

export default DescriptionWithTx
