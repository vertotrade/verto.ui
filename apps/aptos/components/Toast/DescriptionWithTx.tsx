// TODO: aptos merge
import { Link, Text } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import truncateHash from '@verto/utils/truncateHash'
import { getBlockExploreLink } from '../../utils'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({ txHash, children }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <>
      {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <Link external href={getBlockExploreLink(txHash, 'transaction', chainId)}>
          {t('View on %site%', { site: 'Explorer' })}: {truncateHash(txHash, 8, 0)}
        </Link>
      )}
    </>
  )
}

export default DescriptionWithTx
