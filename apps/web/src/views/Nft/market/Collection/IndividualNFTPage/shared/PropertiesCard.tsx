import styled from 'styled-components'
import { Flex, Text } from '@verto/uikit'
import { useTranslation } from '@verto/localization'
import { NftAttribute } from 'state/nftMarket/types'
import ExpandableCard from './ExpandableCard'

interface PropertiesCardProps {
  properties: NftAttribute[]
  rarity: { [key: string]: number }
}

// Map of known traits to human-readable text
const KNOWN_TRAITS_TEXT = {
  bunnyId: 'Bunny ID',
}

const StyledFlex = styled(Flex)`
  gap: 10px;
  flex-wrap: wrap;
`

const StyledProperty = styled(Flex)`
  min-width: 145px;
  alighn-items: center;
  flex-direction: column;
  background: ${({ theme }) => `${theme.colors.secondaryButtonBg}`};
  border-radius: 8px;
  padding: 8px 16px;

  > div {
    color: ${({ theme }) => `${theme.colors.placeholder}`};
  }
`

const SingleProperty: React.FC<React.PropsWithChildren<{ title: string; value: string | number; rarity: number }>> = ({
  title,
  value,
}) => {
  return (
    <StyledProperty>
      <Text fontSize="14px">{KNOWN_TRAITS_TEXT[title] ?? title}</Text>
      <Flex alignItems="center">
        <Text bold fontWeight="600">
          {value}
        </Text>
      </Flex>
    </StyledProperty>
  )
}

const PropertiesCard: React.FC<React.PropsWithChildren<PropertiesCardProps>> = ({ properties, rarity }) => {
  const { t } = useTranslation()
  const content = (
    <StyledFlex pt="24px">
      {properties.map(property => (
        <SingleProperty
          key={property.traitType}
          title={property.traitType}
          value={property.value}
          rarity={rarity[property.traitType]}
        />
      ))}
    </StyledFlex>
  )
  return <ExpandableCard title={t('Properties')} content={content} />
}

export default PropertiesCard
