import styled from 'styled-components'
import { Flex, Text, Link } from '@verto/uikit'
import { getBlockExploreLink } from 'utils'
import { formatNumber } from '@verto/utils/formatBalance'
import uriToHttp from '@verto/utils/uriToHttp'
import { useTranslation } from '@verto/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import ExpandableCard from './ExpandableCard'

interface DetailsCardProps {
  contractAddress: string
  ipfsJson: string
  count?: number
  rarity?: number
}

const LongTextContainer = styled(Text)`
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const StyledText = styled(Text)`
  color: ${({ theme }) => `${theme.colors.placeholder}`};
  font-size: 14px;
`

const DetailsCard: React.FC<React.PropsWithChildren<DetailsCardProps>> = ({
  contractAddress,
  ipfsJson,
  count,
  rarity,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const ipfsLink = ipfsJson ? uriToHttp(ipfsJson)[0] : null
  const content = (
    <Flex justifyContent="space-between" pt="24px">
      <Flex justifyContent="space-between" alignItems="start" flexDirection="column">
        <StyledText>{t('Contract address')}</StyledText>
        <Link external href={getBlockExploreLink(contractAddress, 'address', chainId)}>
          <LongTextContainer bold>{contractAddress}</LongTextContainer>
        </Link>
      </Flex>
      {ipfsLink && (
        <Flex justifyContent="space-between" alignItems="center">
          <StyledText>IPFS JSON</StyledText>
          <Link external href={ipfsLink}>
            <LongTextContainer bold>{ipfsLink}</LongTextContainer>
          </Link>
        </Flex>
      )}
      {count && (
        <Flex justifyContent="space-between" alignItems="center" mr="4px">
          <StyledText>{t('Supply Count')}</StyledText>
          <LongTextContainer bold>{formatNumber(count, 0, 0)}</LongTextContainer>
        </Flex>
      )}
      {rarity && (
        <Flex justifyContent="space-between" alignItems="center" mr="4px">
          <StyledText>{t('Rarity')}</StyledText>
          <LongTextContainer bold>{`${formatNumber(rarity, 0, 2)}%`}</LongTextContainer>
        </Flex>
      )}
    </Flex>
  )
  return <ExpandableCard title={t('Details')} content={content} />
}

export default DetailsCard
