import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, ButtonMenu, ButtonMenuItem, Flex, Grid, Text } from '@verto/uikit'
import capitalize from 'lodash/capitalize'
import { useGetNftShowOnlyOnSale } from 'state/nftMarket/hooks'
import { NftAttribute } from 'state/nftMarket/types'
import { useTranslation } from '@verto/localization'
import { Item, ListTraitFilter } from 'views/Nft/market/components/Filters'
import { useNftStorage } from 'state/nftMarket/storage'
import groupBy from 'lodash/groupBy'
import useGetCollectionDistribution from '../../hooks/useGetCollectionDistribution'
import SortSelect from './SortSelect'

interface FiltersProps {
  address: string
  attributes: NftAttribute[]
}

const GridContainer = styled(Grid)`
  margin-bottom: 16px;
  padding: 0 16px;
  grid-gap: 8px 16px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'attributeFilters attributeFilters'
    'filterByControls sortByControls';
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'attributeFilters attributeFilters attributeFilters'
      'filterByControls . sortByControls';
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'attributeFilters attributeFilters attributeFilters'
      'filterByControls sortByControls';
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1.3fr 5fr 1fr;
    grid-template-areas: 'filterByControls attributeFilters sortByControls';
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    grid-template-columns: 1fr 5fr 1fr;
  }
`

const FilterByControls = styled(Box)`
  grid-area: filterByControls;
`

const SortByControls = styled(Box)`
  grid-area: sortByControls;
  display: flex;
  align-items: center;
  gap: 8px;
  text-wrap: nowrap;
`

const ScrollableFlexContainer = styled(Flex)`
  grid-area: attributeFilters;
  align-items: center;
  flex: 1;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: wrap;
    overflow-x: revert;
  }
`

const Filters: React.FC<React.PropsWithChildren<FiltersProps>> = ({ address, attributes }) => {
  const { data } = useGetCollectionDistribution(address)
  const { t } = useTranslation()
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(address)
  const { setShowOnlyOnSale } = useNftStorage()
  const [activeButtonIndex, setActiveButtonIndex] = useState(showOnlyNftsOnSale ? 1 : 0)

  useEffect(() => {
    setActiveButtonIndex(showOnlyNftsOnSale ? 1 : 0)
  }, [showOnlyNftsOnSale])

  const onActiveButtonChange = (newIndex: number) => {
    setShowOnlyOnSale({ collection: address, showOnlyOnSale: newIndex === 1 })
  }

  const attrsByType: Record<string, NftAttribute[]> = attributes ? groupBy(attributes, attr => attr.traitType) : null
  const uniqueTraitTypes = attrsByType ? Object.keys(attrsByType) : []

  return (
    <GridContainer>
      <FilterByControls>
        <ButtonMenu scale="sm" activeIndex={activeButtonIndex} onItemClick={onActiveButtonChange} variant="light">
          <ButtonMenuItem>{t('All')}</ButtonMenuItem>
          <ButtonMenuItem>{t('On Sale')}</ButtonMenuItem>
        </ButtonMenu>
      </FilterByControls>
      <SortByControls>
        <Text fontSize="14px" color="textSecondary">
          {t('Sort By')}
        </Text>
        <SortSelect collectionAddress={address} />
      </SortByControls>
      <ScrollableFlexContainer>
        {uniqueTraitTypes.map(traitType => {
          const attrs = attrsByType[traitType]
          const items: Item[] = attrs.map(attr => ({
            label: capitalize(attr.value as string),
            count: data && data[traitType] ? data[traitType][attr.value] : undefined,
            attr,
          }))

          return (
            <ListTraitFilter
              key={traitType}
              title={capitalize(traitType)}
              traitType={traitType}
              items={items}
              collectionAddress={address}
            />
          )
        })}
        {/* {!isEmpty(nftFilters) && <ClearAllButton collectionAddress={address} />} */}
      </ScrollableFlexContainer>
    </GridContainer>
  )
}

export default Filters
